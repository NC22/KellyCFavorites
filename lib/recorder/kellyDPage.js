// todo - follow related data - search images bigger then original preview and add if something founded +\-
// todo - remove bad links +\-
// todo - get ext by mimeTypes \ recieved contentType for fix download links without ext +\-
// 
// priority to load proportions, then load docs

// фильтры в форме не обрабатываются
// Считает все !untrusted в гугле
// проверять relatedDoc с оригиналом по пропорциям \ исключать дубли найденые в related doc \ порядок
// чистить кеш dispetcher.recorder

// optional skip loadimg stage

// todo - хранить группы  и линки раздельно
//        хранить реферер и ссылку для вебреквестов как два отдельных массива для ускорения поиска

/*
    массив групп с названиями и id
    цвет для некоторых групп
*/

KellyDPage = new Object();
KellyDPage.env = false;
KellyDPage.sandBox = false;
KellyDPage.docsUrlMap = false;

KellyDPage.aDProgress = {current : 0, total : 0, minW : 0, maxW : 0, minH : 0, maxH : 0};

KellyDPage.cats = {
    
    imageBasic : {loc : 'Basic image', id : false, color : false, l : false}, 
    imageRelated : {loc : 'Related image'},
    imageError : {loc : 'Load error', exclude : true},

    // post processing \ detected by driver groups that helps to filter good images from recorded stream
    
    imageByDocument : {loc : 'Original Image (Doc)', selected : 90},    
    imageOriginal : {loc : 'Original (HD)', selected : 100, color : '#45ea6b'},
    imagePreview : {loc : 'Preview', selected : 2, color : '#45dbea'},
    imageAny : {loc : 'Media', selected : 1, color : '#45dbea'},
    
    imageBg : {loc : 'Background image'},
    
    withDoc : {loc : 'With doc link'},
    unsettedFormat : {loc : 'Unsetted ext'},
    
    srcVideo : {loc : 'Video', exclude : true},
    srcIcon : {loc : 'Icon', exclude : true},
    SVG : {loc : 'SVG', exclude : true},
}

KellyDPage.getCat = function(key) {
    
    if (!KellyDPage.cats[key]) {
         KellyDPage.cats[key] = {loc : key};
    }
    
    if (!KellyDPage.cats[key].id) {
        var cat = K_FAV.getStorageManager().getCategoryBy(KellyDPage.storage, KellyDPage.cats[key].loc, 'name');
        if (cat.id == -1) cat = {id : K_FAV.getStorageManager().categoryCreate(KellyDPage.storage, KellyDPage.cats[key].loc, false)};
        
        KellyDPage.cats[key].id = cat.id;
    }
    
    return KellyDPage.cats[key];
}

KellyDPage.addStorageItem = function(src, doc, referrer, groups) {
                                
     var ext = KellyTools.getUrlExt(src);
     groups.push(ext ? ext.toUpperCase() : 'unsettedFormat');  // extension could be undefined if route is unclear (we can check if this is actually image when img.onerror occurs)
     
     //if (K_FAV.getStorageManager().searchItem(storage, {link : src}) !== false) return;
                 
     if (ext != 'dataUrl') {

        KellyDPage.urlMap.push([src, referrer]);

        var imageHost = KellyTools.getLocationFromUrl(src).hostname;
        if (imageHost && KellyDPage.env.hostList.indexOf(imageHost) == -1) KellyDPage.env.hostList.push(imageHost);
     }
     
     var catList = [];
     for (var i = 0; i < groups.length; i++)  {
         catList.push(KellyDPage.getCat(groups[i]).id);
     }
            
     return K_FAV.getStorageManager().createDbItem({ 
            images : src,
            info : false,
            cats : catList,
            referrer : referrer, // keep referrer for proper profile works in future
            postLink : src,    
            relatedDoc : doc,
            vd : groups.indexOf('srcVideo') != -1,
     }, KellyDPage.storage, false, true);
}

// full restart needed only first time and when hostlist modified

KellyDPage.updateUrlMap = function(onReady, restart) {
          
    KellyDPage.env.webRequestsRules = {
        referrer : false,
        cors : true,
        urlMap : KellyDPage.urlMap,
        hostList : KellyDPage.env.hostList,
        types : false,
        method : 'registerDownloader',
    };

    var onUpdatedEvent = function(request) {                
        if (request.method == "updateUrlMap" || request.method == "registerDownloader") {
            onReady();
            K_FAV.runtime.webRequestPort.onMessage.removeListener(onUpdatedEvent);
        }
    }
    
    var request = restart ?  KellyDPage.env.webRequestsRules : {method : 'updateUrlMap', urlMap : KellyDPage.urlMap};

    K_FAV.getGlobal('fav').coptions.webRequest = true;          
    K_FAV.runtime.webRequestPort.onMessage.addListener(onUpdatedEvent);
    K_FAV.runtime.webRequestPort.postMessage(request);
}

KellyDPage.showAdditionFilters = function() {
    
    var cl = KellyDPage.env.className, container = KellyTools.getElementByClass(KellyDPage.getContainer(), cl + '-common-filters-wrap');
    
    if (!KellyDPage.commonFilters) {
        var section = document.getElementById(cl + '-sidebar-wrap');
        
        KellyDPage.commonFilters = document.createElement('div');
        KellyDPage.commonFilters.className = cl + '-common-filters-wrap';
        
        section.insertBefore(KellyDPage.commonFilters, section.firstChild);
    }
    
    var displayed = K_FAV.getGlobal('filtered'), numOfItems = displayed.length, items = K_FAV.getGlobal('fav').items, docs = [];
    
    for (var i = 0; i < displayed.length; i++) {
        var item = items[displayed[i]];
        if (item.relatedDoc && docs.indexOf(item.relatedDoc) == -1) docs.push(item.relatedDoc);
    }
                  
    var html  = '<div class="' + cl + '-ModalBox-wrap ' + cl + '-ModalBox-wrap-addition"><div class="' + cl + '-ModalBox ' + cl + '-ModalBox-section ' + cl + '-ModalBox-addition" data-title="sidebar_section_downloads">';
        
        html += '<div class="' + cl + '-statistic"><span>&#9660; Filters</span> <span>items : ' + numOfItems + ' | related docs : ' + docs.length + '</span></div>';
        html += '<div class="' + cl + '-ModalBox-content ' + cl + '-ModalBox-addition-content">';
        html += '<div class="' + cl + '-notice" style="margin-bottom : 6px;">Load proportions before use filters for best result</div>';
        html += '<div class="' + cl + '-bounds">Min dimensions : <input type="text" class="' + cl +'-width" placeholder="width" value=""> x <input type="text" class="' + cl + '-height" placeholder="height" value=""></div>';
        html += '<div class="' + cl + '-exclude-url"><input type="text" class="' + cl + '-url" placeholder="Exclude urls"></div>'; 
        html += '<div class="' + cl + '-url"><input type="text" class="' + cl + '-url" placeholder="Match url"> <label><input type="checkbox"> Reqular expression</label></div>';
        html += '<div class="' + cl + '-buttons"><button class="' + cl + '-proportions">Load proportions</button>';
        if (docs.length > 0) html += '<button class="' + cl + '-related-links">Load related links</button>';
        html += '</div>';
        
        html += '<div class="' + cl + '-downloader-statistic hidden"></div>';                
        html += '<div class="' + cl + '-downloader-progressbar hidden"><span class="' + cl + '-downloader-progressbar-line ' + cl + '-downloader-progressbar-line-ok" style="width: 0%;"></span>\
                 <span class="' + cl + '-downloader-progressbar-line ' + cl + '-downloader-progressbar-line-err" style="width: 0px;"></span>\
                 <span class="' + cl + '-downloader-progressbar-state"></span>\
                 </div>';
        
        html += '</div></div>';
    
    KellyTools.setHTMLData(KellyDPage.commonFilters, html);
    
    KellyDPage.aDProgress.container = KellyTools.getElementByClass(container, cl + '-downloader-progressbar');
    KellyDPage.aDProgress.line = KellyTools.getElementByClass(container, cl + '-downloader-progressbar-line-ok');
    KellyDPage.aDProgress.lineErr =  KellyTools.getElementByClass(container, cl + '-downloader-progressbar-line-err');
    KellyDPage.aDProgress.state = KellyTools.getElementByClass(container, cl + '-downloader-progressbar-state');
    KellyDPage.aDProgress.statistic = KellyTools.getElementByClass(container, cl + '-downloader-statistic');
    
    KellyDPage.aDProgress.updateLoader = function(show) {

        if (!show) {
            KellyDPage.aDProgress.container.classList.add('hidden');
            KellyDPage.aDProgress.statistic.classList.add('hidden');
            return;
        }
        
        KellyDPage.aDProgress.container.classList.remove('hidden');
        KellyDPage.aDProgress.statistic.classList.remove('hidden');
        
        var complete = Math.round(KellyDPage.aDProgress.current / (KellyDPage.aDProgress.total / 100));
        var bad = KellyDPage.aDProgress.fail ? Math.round(KellyDPage.aDProgress.fail / (KellyDPage.aDProgress.total / 100)) : 0;
        if (bad > 100) bad = 100;
        
        KellyDPage.aDProgress.state.innerText = KellyDPage.aDProgress.current + ' / ' + KellyDPage.aDProgress.total;        
        KellyDPage.aDProgress.line.style.width = complete + '%';
        KellyDPage.aDProgress.lineErr.style.width = bad > 0 ?  bad + '%' : '0px';
    }
    
    if (docs.length > 0)   
    KellyTools.getElementByClass(container, cl + '-related-links').onclick = function() {

        if (KellyDPage.aDProgress.docLoader) {
            KellyDPage.aDProgress.docLoader.stop();
            return false;
        }
        
        if (K_FAV.dataFilterLock) return false;                
        K_FAV.dataFilterLock =  {message : 'Load related documents process is enabled. Cancel before exit', context : 'loadRelatedDoc'};  
        
        KellyDPage.aDProgress.docLoader = new KellyLoadDocControll({storage : KellyDPage.storage, filtered : K_FAV.getGlobal('filtered')}); 
        
        KellyDPage.aDProgress.docLoader.events.onRelatedDocImageCheck = function(item) {
            // check matches with already addeded items and add Original group
        }
        
        // todo - list errors
        
        KellyDPage.aDProgress.docLoader.events.onUpdateState = function(stage, context, stat) {
            
            KellyDPage.aDProgress.statistic.innerText = stage;
            
            if (stage != 'off') {
            
                KellyDPage.aDProgress.current = stat.current;
                KellyDPage.aDProgress.total = stat.total;
                KellyDPage.aDProgress.fail = 0;
            }
            
            if (context == 'onDownloadDocEnd') {
                
                if (KellyDPage.aDProgress.docLoader.docsImages.length > 0) {
                    KellyDPage.aDProgress.docLoader.docsImages.forEach(function(item) {
                         
                            KellyDPage.urlMap.push([item.src, item.relatedItem.referrer]);
                            
                        var loc = KellyTools.getLocationFromUrl(item.relatedDoc); 
                        if (KellyDPage.env.hostList.indexOf(loc.hostname) == -1) KellyDPage.env.hostList.push(loc.hostname);                    
                    });
                    
                    KellyDPage.updateUrlMap(KellyDPage.aDProgress.docLoader.runImgLoad, true);
                    
                } else {
                    
                    KellyDPage.aDProgress.statistic.innerText = 'Cant find images in related documents';
                    K_FAV.dataFilterLock = false;  
                }
            }
            
            KellyDPage.aDProgress.updateLoader(true); // stage != 'off'
        }
        
        KellyDPage.aDProgress.docLoader.events.onQualityImageFound = function(relatedItem, imageData) {
            
            imageData.groups.push('imageByDocument');
            // todo - keep related doc as postlink
            var newItem = KellyDPage.addStorageItem(imageData.src, false, relatedItem.referrer, imageData.groups);
            if (newItem.itemIndex) {
                KellyDPage.storage.items[newItem.itemIndex].pw = imageData.pw;
                KellyDPage.storage.items[newItem.itemIndex].ph = imageData.ph;
            }
        }
        
        KellyDPage.aDProgress.docLoader.events.onStagesEnd = function(reason, addedTotal) {
                                           
            if (reason == 'stop') {
                
                KellyDPage.aDProgress.statistic.innerText = 'canceled';                
                
            } else {
                
                KellyDPage.aDProgress.statistic.innerText = 'added ' + addedTotal + ' images from related docs';    
                
                if (addedTotal > 0) {
                    KellyDPage.updateUrlMap(function() {
                        
                        KellyDPage.updateCatFilters();
                        
                        K_FAV.updateCategoryList();
                        K_FAV.updateFavCounter();
                        K_FAV.updateFilteredData();                    
                        K_FAV.updateImagesBlock();                
                        K_FAV.updateImageGrid();   
                    });
                }
            }
            
            K_FAV.dataFilterLock = false; 
            KellyDPage.aDProgress.updateLoader(true); // false
        }
        
        if (!KellyDPage.docsUrlMap) {
            
            KellyDPage.docsUrlMap = true;            
            KellyDPage.storage.items.forEach(function(item) {
                 if (!item.relatedDoc) return;
                 
                var loc = KellyTools.getLocationFromUrl(item.relatedDoc); 
                    KellyDPage.urlMap.push([item.relatedDoc, item.referrer]);
                    
                if (KellyDPage.env.hostList.indexOf(loc.hostname) == -1) KellyDPage.env.hostList.push(loc.hostname);                    
            });
            
            KellyDPage.updateUrlMap(KellyDPage.aDProgress.docLoader.run, true);
            
        } else KellyDPage.aDProgress.docLoader.run();
    }
    
    KellyTools.getElementByClass(container, cl + '-proportions').onclick = function() {
        
        if (KellyDPage.aDProgress.imgLoader) {
            KellyDPage.aDProgress.imgLoader.stop();
            return false;
        }
        
        if (K_FAV.dataFilterLock) return false;
        K_FAV.dataFilterLock = {message : 'Load proportions process is enabled. Cancel before exit', context : 'loadProportions'};
        
        var items = K_FAV.getGlobal('fav').items, displayed = K_FAV.getGlobal('filtered');
        
        KellyDPage.aDProgress.total = displayed.length;
        KellyDPage.aDProgress.current = 0;  
        
        var updateStatistic = function() {
            
            KellyDPage.aDProgress.current = 0;
            KellyDPage.aDProgress.fail = 0;
            
            for (var i = 0; i < displayed.length; i++) {
                var item = items[displayed[i]];
                if (!item.pw) continue;
                
                     if (item.pw > 0) KellyDPage.aDProgress.current++;
                else if (item.pw < 0) KellyDPage.aDProgress.fail++;
                
                if (item.pw > 0 && (KellyDPage.aDProgress.minW == 0 || item.pw < KellyDPage.aDProgress.minW)) KellyDPage.aDProgress.minW = item.pw;      
                if (item.pw > 0 && item.pw > KellyDPage.aDProgress.maxW) KellyDPage.aDProgress.maxW = item.pw; 
                if (item.ph > 0 && (KellyDPage.aDProgress.minH == 0 || item.ph < KellyDPage.aDProgress.minH)) KellyDPage.aDProgress.minH = item.ph;
                if (item.ph > 0 && item.ph > KellyDPage.aDProgress.maxH) KellyDPage.aDProgress.maxH = item.ph;   
            }
            
            KellyDPage.aDProgress.statistic.innerText = 'Min : ' + KellyDPage.aDProgress.minW + 'x' + KellyDPage.aDProgress.minH + ' | Max : ' + KellyDPage.aDProgress.maxW + 'x' + KellyDPage.aDProgress.maxH;
            KellyDPage.aDProgress.updateLoader(true);
        }
        
        KellyDPage.aDProgress.imgLoader = KellyLoadDocControll.createImageLoaderController({
                onEnd : function(reason) {
                    
                    console.log('onEnd ' + reason);
                    K_FAV.dataFilterLock = false;
                    
                    if (reason == 'stop') {
                        
                        KellyDPage.aDProgress.statistic.innerText = 'Stopped';
                        KellyDPage.aDProgress.updateLoader(true); // false
                        
                    } else {
                    
                        items.sort(function(a, b) {
                            if (!a.pw) return -1;
                            var megaPixels = (a.pw * a.ph) / 1000000, megaPixelsB = (b.pw * b.ph) / 1000000;                           
                            return megaPixelsB - megaPixels;
                        });
                            
                        updateStatistic();
                        
                        K_FAV.updateFilteredData();                    
                        K_FAV.updateImagesBlock();                
                        K_FAV.updateImageGrid();  
                    }
                    
                    KellyDPage.aDProgress.imgLoader = false;
                },                    
                onAskJob : function(controller) {

                    for (var i = 0; i < displayed.length; i++) {
                        var item = items[displayed[i]];
                        if (!item.pw) return {src : item.pImage, item : item};     
                    }                   
                    
                    return false;
                },
                onImageLoad : function(controller, item, proportions, error) {
                                        
                    item.pw = proportions[0];
                    item.ph = proportions[1];                    
                    
                    updateStatistic();
                },
            });
            
        KellyDPage.aDProgress.imgLoader.run();
        updateStatistic();
    };    
}

KellyDPage.updateCatFilters = function() {
    
      var filters = {catIgnoreFilters : [], catFilters : [], logic : 'or'};
      
      var sKey = false;
      for (var k in KellyDPage.cats) {
            if (KellyDPage.cats[k].id) {
                     if (KellyDPage.cats[k].selected && (sKey === false || KellyDPage.cats[k].selected > KellyDPage.cats[sKey].selected)) sKey = k;
                else if (KellyDPage.cats[k].exclude) filters.catIgnoreFilters.push(KellyDPage.cats[k].id);
            }
      }
      
      if (sKey !== false ) filters.catFilters.push(KellyDPage.cats[sKey].id);
      
      K_FAV.setFilters(filters);
}

KellyDPage.showRecordedImages = function(onShow) {
    
     KellyTools.getBrowser().runtime.sendMessage({method: "getRecord"}, function(response) {
          
          console.log(response.images);
              
          KellyDPage.urlMap = [];
          
          for (var k in response.cats) KellyDPage.cats[k] = response.cats[k];
          
          for (var i = 0; i < response.images.length; i++) {
              
              for (var b = 0; b < response.images[i].relatedSrc.length; b++) {
                  
                    var unpackedSrc = KellyPageWatchdog.explodeSrc(response.images[i].relatedSrc[b]);
                        unpackedSrc.groups.push(b > 0 ? 'imageRelated' : 'imageBasic');
                        
                    if (b == 0 && response.images[i].relatedDoc) unpackedSrc.groups.push('withDoc');
                    KellyDPage.addStorageItem(unpackedSrc.src, response.images[i].relatedDoc, response.images[i].referrer, unpackedSrc.groups);
              }  
          }
          
          KellyDPage.updateCatFilters();
          K_FAV.updateFavCounter();
          
          // todo set db name by count num of items form every host and select main
          
          K_FAV.getGlobal('fav').dbName = KellyTools.generateIdWord(KellyTools.getLocationFromUrl(response.host).hostname.replace('.', '_') + '_record');
                    
          KellyDPage.updateUrlMap(function(){            
              
              K_FAV.showFavouriteImages(); 
              if (onShow) onShow();
          }, true);
          
          //console.log(KellyDPage.env.webRequestsRules);
          
          // window.requestAnimationFrame(function(){ });      
     });
}
     
KellyDPage.init = function() {
    
     window.K_FAV = false;
     document.title = KellyTools.getProgName();

     var badItems = []; KellyTools.DEBUG = true; 
     
     K_FAV = new KellyFavItems({env : KellyProfileRecorder.getInstance(), location : { href : '', protocol : 'http:', host : ''}});
              
     KellyDPage.env = K_FAV.getGlobal('env');
     KellyDPage.env.hostClass = 'options_page';
     
     KellyDPage.env.events.onShowFavouriteImages = function(downloadMode) {
         KellyDPage.showAdditionFilters();
     }
     
     KellyDPage.env.events.onGridBadBounds = function(self, data) {
         
          // retry before delete ?
          
          if (data.errorCode < 4 && data.tile) {

                var index = parseInt(data.tile.getAttribute('itemIndex')), item = K_FAV.getGlobal('fav').items[index];
                if (item && badItems.indexOf(index) == -1) {

                    item.categoryId.push(KellyDPage.getCat('imageError').id);
                    
                    K_FAV.getStorageManager().createDbItem({ 
                            cats : item.categoryId,
                            itemIndex : index,
                    }, KellyDPage.storage, true, true);
                    
                    badItems.push(index);
                }
          }
          
          return true;
          // updateFilteredData from time to time
      }  
      
      KellyDPage.env.events.onGridUpdated = function(self, isAllBoundsLoaded) {
       
          if (isAllBoundsLoaded && badItems.length) {
              
              console.log('Bad items : ' + badItems.length); // todo showCatList public?
              
              K_FAV.updateCategoryList();
              K_FAV.updateFavCounter();
          }
     }   
     
     KellyDPage.env.events.onStorageAfterload = function(storage, loadType, context) {
        
        if (context == 'selectDB' && (loadType == 'items' || !loadType)) {
            
            K_FAV.dataFilterLock = {message : 'Updating web request settings. Please wait...', context : context};
            
            KellyDPage.urlMap = [];
            KellyDPage.env.hostList = [];
            
            storage.items.forEach(function(item) {
                 if (item.referrer) {
                    KellyDPage.urlMap.push([item.pImage, item.referrer]);
                    var imageHost = KellyTools.getLocationFromUrl(item.pImage).hostname;
                    if (imageHost && KellyDPage.env.hostList.indexOf(imageHost) == -1) KellyDPage.env.hostList.push(imageHost);
                 }
            });
            
            KellyDPage.updateUrlMap(function(){            
                    K_FAV.dataFilterLock = false;
            }, true);            
                          
            console.log('Update Url map required');              
        }
     }
      
     /*
        getGlobal('mode') - fav | ctoptions
        setFilters
        callbacks      
        
        env.events.onGridBadBounds(self, data)
        env.events.onGridUpdated(self, isAllBoundsLoaded);
        env.events.onGridLoadBounds(self, boundEl, state); 
        env.events.onUpdateFilteredData(displayedItems); 
        
     */
     
     
        
     K_FAV.load('cfg', function(fav) {
    
        // todo hide this options on options tab
        // hide profile list temporary while it cant store addition data about referrer
        // динамически менять minHeight для рядов с < 50x50 картинками
        
        KellyDPage.storage = fav;
        
        K_FAV.getStorageManager().collectSource = ['user-current'];
        var defaultItemStorage = K_FAV.getStorageManager().getDefaultData();
        for (var k in defaultItemStorage) fav[k] = defaultItemStorage[k]; 
         
        fav.selected_cats_ids = [];
        fav.categories = [];
         
        fav.coptions.storage = 'default';        
        fav.coptions.newFirst = false;
        fav.coptions.grid.fixed = 4;
        fav.coptions.grid.type = 'fixed';
        fav.coptions.grid.lazy = true; // gently creates loading pool with max queryes per second
        fav.coptions.grid.perPage = 120;
        fav.coptions.webRequest = false;        
        
        K_FAV.getGlobal('image_events').saveImageProportions = function() { return; }            

        var nativeOnExtensionReady = KellyDPage.env.events.onExtensionReady;            
        KellyDPage.env.events.onExtensionReady = function() {
            
            if (nativeOnExtensionReady) nativeOnExtensionReady();
            
            KellyDPage.getContainer().removeAttribute('style');
            
            var options = K_FAV.getOptionsManager();
            delete options.tabData['BaseOptions'].parts.fast_download;
            delete options.tabData['BaseOptions'].parts.options_fav_add;
            options.protectedOptions = ['grid_fixed', 'grid_type', 'grid_lazy', 'grid_viewerShowAs', 'grid_perPage', 'webRequest', 'newFirst'];
            
            if (window.location.href.indexOf('tab=options') != -1) K_FAV.showOptionsDialog();
            else KellyDPage.showRecordedImages(); 
        }
        
        var resources = ['options', 'main', 'recorderDownloader'];
            
        if (fav.coptions.mobileOptimization) document.body.classList.add(KellyDPage.env.className + '-mobile');       
        if (fav.coptions.darkTheme) {
            document.body.classList.add(KellyDPage.env.className + '-dark');
            resources.push('dark');
        }
            
        K_FAV.initFormatPage(resources);         
     });

     KellyTools.setHTMLData(document.getElementById('submenu'), '<div class="' + KellyDPage.env.className + '-copyright-info">' + KellyTools.getProgName(KellyDPage.env.location) + '</div>');
}

KellyDPage.getContainer = function() {   
 
    if (this.sandBox) return this.sandBox;    
    this.sandBox = document.getElementById('sandbox-env');
    return this.sandBox;    
}