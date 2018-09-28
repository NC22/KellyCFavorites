



//D:\Dropbox\Private\l scripts\jfav\release\Extension\\widget\kellyTooltip.js



/*
   @encoding utf-8
   @name           KellyTooltip
   @namespace      Kelly
   @description    image view widget
   @author         Rubchuk Vladimir <torrenttvi@gmail.com>
   @license        GPLv3
   @version        v 1.0.0 24.09.18
   
   ToDo : 
   
   todo docs and examples
   
*/

function KellyTooltip(cfg) {
    
    var handler = this;
    
    this.message = '';
    this.target = false; // target or 'screen'
    this.hideWidth = false;
    this.minWidth = false;
    
    this.closeByBody = false;
    
    this.self = false;
    this.classGroup = 'tooltipster'; // prefix for all classes in tooltip container
    this.selfClass = '';
    
    this.positionY = 'top';	
    this.positionX = 'center';
    this.ptypeX = '';
    this.ptypeY = 'outside';
    
    this.offset = {left : 0, top : -20};
    
    this.removeOnClose = false;
    this.closeButton = true;
    this.zIndex = false;
    
    this.contentId = '';
    
    this.userEvents = { onMouseOut : false, onMouseOver : false, onClose : false  };
    
    var events = {};
    
    this.updateCfg = function(cfg) {
    
        var updateContainerClass = false;
        
        if (cfg.positionY && ['top', 'bottom', 'center'].indexOf(cfg.positionY) != -1) {
            handler.positionY = cfg.positionY;
            updateContainerClass = true;
        }
        
        if (cfg.positionX && ['left', 'right', 'center'].indexOf(cfg.positionX) != -1) {
            handler.positionX = cfg.positionX;
            updateContainerClass = true;
        }
        
        if (cfg.ptypeX && ['inside', 'outside'].indexOf(cfg.ptypeX) != -1) {
            handler.ptypeX = cfg.ptypeX;
            updateContainerClass = true;
        }

        if (cfg.ptypeY && ['inside', 'outside'].indexOf(cfg.ptypeY) != -1) {
            handler.ptypeY = cfg.ptypeY;
            updateContainerClass = true;
        }
        
        if (handler.self && updateContainerClass) {
            handler.self.className = getSelfClass();
        }
        
        var settings = ['target', 'message', 'hideWidth', 'offset', 'minWidth', 'closeByBody', 'classGroup', 'selfClass', 'zIndex', 'closeButton', 'removeOnClose'];
        
        for (var i=0; i < settings.length; i++) {
            var key = settings[i];
            if (typeof cfg[key] != 'undefined') {
            
                handler[key] = cfg[key];
                
                if (key == 'closeButton' && handler.self) {
                    handler.getCloseButton().style.display = handler.closeButton ? 'block' : 'none';
                } else if (key == 'message' && handler.self) {
                    handler.setMessage(handler[key]);			
                } else if (key == 'zIndex' && handler.self) {
                    handler.self.style.zIndex = handler[key];
                }
                
            }
        }
        
        if (cfg.events && cfg.events.onClose) {
            handler.userEvents.onClose = cfg.events.onClose;
        }
        
        if (cfg.events && cfg.events.onMouseOut) {
            handler.userEvents.onMouseOut = cfg.events.onMouseOut;
        }
        
        if (cfg.events && cfg.events.onMouseIn) {
            handler.userEvents.onMouseIn = cfg.events.onMouseIn;
        }
        
        return handler;
    }
    
    function getSelfClass() {
            
        var className = handler.classGroup + '-wrap';
            className += ' ' + handler.classGroup + '-y-' + handler.positionY;
            className += ' ' + handler.classGroup + '-x-' + handler.positionX;
        
        if (handler.ptypeX) className += ' ' + handler.classGroup + '-' + handler.ptypeX;
        if (handler.ptypeY) className += ' ' + handler.classGroup + '-' + handler.ptypeY;
        if (handler.selfClass) className += ' ' + handler.selfClass;
        
        return className;
    }
    
    function constructor(cfg) {		
        
        if (KellyTooltip.autoloadCss) KellyTooltip.loadDefaultCss(KellyTooltip.autoloadCss);

        if (handler.self) return;

        handler.updateCfg(cfg);
        
        handler.self = document.createElement('div');
        handler.self.className = getSelfClass();			
        handler.self.innerHTML =  '<div class="' + handler.classGroup + '-container"><div class="' + handler.classGroup + '-content">' + handler.message;
        handler.self.innerHTML += '<span class="' + handler.classGroup + '-close" style="cursor : pointer; display:' + (handler.closeButton ? 'block' : 'none') +'">+</span></div>';
        handler.self.innerHTML += '</div>';	
        
        handler.self.onmouseover = function (e) { 
            if (handler.userEvents.onMouseOver) handler.userEvents.onMouseOver(handler, e);
        }
        
        handler.self.onmouseout = function(e) {
            if (handler.userEvents.onMouseOut) handler.userEvents.onMouseOut(handler, e);
        };
        
        document.body.appendChild(handler.self);	
        
        var closeButton = handler.self.getElementsByClassName(handler.classGroup + '-close')[0];
            closeButton.onclick = function() {
                
                 handler.show(false); 
            }
        
        events.onBodyClick = function(e) {
            
            if (handler.closeByBody) {
                
                if (e.target != handler.self) {
                    
                    var parent = e.target;
                    while (parent && handler.self != parent) {
                        parent = parent.parentElement;
                    }  
                    
                    if (!parent) {								
                        handler.show(false);
                    }
                }
            }
            
        };
        
        document.body.addEventListener('click', events.onBodyClick);
        
        events.onResize = function(e) {
        
            //console.log(screen.width + ' ff '  + toolTip.hideAfterWidth)
            
            if (!checkRequierdWidth()) {
                handler.show(false);
                return;
            }
            
            handler.updatePosition();	
        }
        
        window.addEventListener('resize', events.onResize);
        
        return handler;
    }
    
    function checkRequierdWidth() {
        if (handler.hideAfterWidth && document.body.clientWidth <= handler.hideAfterWidth) return false;
        else return true;
    }
            
    this.setMessage = function(mess) {	
        
        if (!handler.self) return;
        
        handler.message = mess;
        this.getContent().innerHTML = mess;	

        return handler;
    }
    
    this.getCloseButton = function() {
        return handler.self.getElementsByClassName(handler.classGroup + '-close')[0];
    }

    this.getContent = function() {
        return handler.self.getElementsByClassName(handler.classGroup + '-content')[0];
    }
    
    this.getContentContainer = function() {
        return handler.self.getElementsByClassName(handler.classGroup + '-container')[0];
    }
    
    this.show = function(show, contentId) {
        if (!handler.self) return;
        
        handler.self.className = handler.self.className.replace(handler.classGroup + '-show', '').trim();
    
        if (show) {			
        
            if (!checkRequierdWidth()) return;
            
            handler.self.className += ' ' + handler.classGroup + '-show';
            if (handler.zIndex) handler.self.style.zIndex = handler.zIndex;
            
            handler.updatePosition();
            
            if (!contentId) contentId = 'default';
            
            handler.contentId = contentId;
            
        } else {
            if (handler.userEvents.onClose) handler.userEvents.onClose(handler);
            
            if (handler.removeOnClose) handler.remove();
            
            handler.contentId = false;
        }	
        
    }
    
    this.isShown = function() {
        return (handler.self && handler.self.className.indexOf(handler.classGroup + '-show') !== -1) ? handler.contentId : false;
    }
    
    this.remove = function() {
        if (handler.self) {
            handler.self.parentNode.removeChild(handler.self);
            handler.self = false;
            
            // но можно и добавлять \ удалять события при показе \ скрытии подсказки
            document.body.removeEventListener('click', events.onBodyClick); 
            window.removeEventListener('resize', events.onResize);
        }
    }

    this.isChild = function(target, searchParent) {
        var parent = target;
        
        if (!searchParent) searchParent = handler.self;
        
        while (parent && parent != searchParent) {
            parent = parent.parentElement;
        } 

        return parent ? true : false;
    }
    
    this.getTarget = function() {
                
        if (!handler.target || handler.target == 'screen') return false;
        
        if (typeof handler.target == 'string') {
            var target = document.getElementById(handler.target);
            if (target) {
                handler.target = target;
                return handler.target;
            } else return false;		
            
        } else return handler.target;
    }
    
    this.updatePosition = function() {
    
        if (!handler.self) return false;
        
        var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
        var scrollLeft = (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0);
        
        if (handler.getTarget()) {			
            var pos = handler.getTarget().getBoundingClientRect();	
        } else if (handler.target == 'screen') {
        
            var screenBoundEl = (document.compatMode === "CSS1Compat") ? document.documentElement : document.body;
            var pos = {left : 0, top : 0, width : screenBoundEl.clientWidth, height : screenBoundEl.clientHeight};
        
        } else return false;
        

                                
        var toolTip = handler.self;
        if (handler.minWidth) toolTip.style.minWidth = handler.minWidth + 'px';	
                 
        var toolTipBounds = toolTip.getBoundingClientRect();		
        
        var left = pos.left + handler.offset.left + scrollLeft;
        var top = pos.top + handler.offset.top + scrollTop;
                
        if (handler.positionY == 'top' && handler.ptypeY == 'outside') {		
            top = top - toolTipBounds.height; //  + handler.offset.top				
        } else if (handler.positionY == 'top' && handler.ptypeY == 'inside') {		
                        
        } else if (handler.positionY == 'bottom' && handler.ptypeY == 'outside') { 
            top = top + pos.height; // - handler.offset.top
        } else if (handler.positionY == 'bottom' && handler.ptypeY == 'inside') { 
            top = top + pos.height - toolTipBounds.height; 
        } else if (handler.positionY == 'center') {
            top += pos.height / 2 - toolTipBounds.height / 2;
        }
        
        if (handler.positionX == 'left' && handler.ptypeX == 'outside') {
            left = left - toolTipBounds.width;			
        } else if (handler.positionX == 'left' && handler.ptypeX == 'inside') {
                
        } else if (handler.positionX == 'right' && handler.ptypeX == 'outside' ) {
            left = left + pos.width;			
        } else if (handler.positionX == 'right' && handler.ptypeX == 'inside' ) {
            left = left + pos.width - toolTipBounds.width;	
        } else if (handler.positionX == 'center') {
            left += pos.width / 2 - toolTipBounds.width / 2;
        }
        
        toolTip.style.top = top + 'px';
        toolTip.style.left = left + 'px';
    }
        
    constructor(cfg);
}

/* static methods */

KellyTooltip.autoloadCss = false; // className
KellyTooltip.defaultStyle = false;

KellyTooltip.loadDefaultCss = function(className) {
    
    if (this.defaultStyle) return true;
    
    if (!className || className === true) className = 'tooltipster';
    var border = 0;
    
    var css = '\
        .' + className + '-wrap {\
            position : absolute;\
            opacity : 0;\
            z-index : 60;\
            pointer-events: none;\
        }\
        .' + className + '-container {\
            min-width: 210px;\
            min-height: 52px;\
            margin : 0;\
            background : rgba(96, 102, 126, 0.9490);\
            border : ' + border + 'px dashed #c5c5c5;\
            transition: opacity 0.1s;\
            color : #fff;\
            border-radius : 4px;\
            padding : 12px;\
        }\
        .' + className + '-close {\
            left: 0px;\
            right: auto;\
            position: absolute;\
            top: 0px;\
            display: block;\
            transform: rotate(45deg);\
            cursor: pointer;\
            font-size: 25px;\
            width: 25px;\
            height: 25px;\
            line-height: 25px;\
        }\
        .' + className + '-content {\
            text-align: left;\
            font-size: 16px;\
        }\
        .' + className + '-show {\
            opacity : 1;\
            pointer-events: auto;\
        }\
    ';	

    var head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    } 
    
    this.defaultStyle = style;
    head.appendChild(style);
    
    return true;
}

KellyTooltip.addTipToEl = function(el, message, cfg, delay) {
    
    if (!delay) delay = 50;
    
    if (!cfg) {
    
        cfg = {
            offset : {left : -20, top : 0}, 
            positionY : 'top',
            positionX : 'right',
            ptypeX : 'outside',
            ptypeY : 'inside',
            closeButton : false,
            selfClass : 'KellyTooltip-ItemTip-tooltipster',
            classGroup : 'KellyTooltip-tooltipster',
            removeOnClose : true,
        };
    }
    
    cfg.target = el;

    el.onmouseover = function (e) { 
            
        var tipTimer = setTimeout(function() {
            
            var text = false;
            
            if (typeof message == 'function') {
                text = message(el, e);
                
                if (!text) return;
            } else text = message;			
            
            var tooltip = new KellyTooltip(cfg);
            
            var onmouseOver = el.onmouseover;
            
            el.onmouseout = function(e) {}
            el.onmouseover = function(e) {}
            
            setTimeout(function() {
            
                tooltip.setMessage(text);			
                tooltip.show(true);
                tooltip.updatePosition();
                
                el.onmouseover = onmouseOver;
                
                el.onmouseout = function(e) {
                    var related = e.toElement || e.relatedTarget;
                    if (tooltip.isChild(related)) return;
                    
                    tooltip.show(false);
                    delete tooltip;
                }
                
                tooltip.self.onmouseout = function(e) {					
                    var related = e.toElement || e.relatedTarget;
                    
                    if (tooltip.isChild(related) ) return;
                    
                    tooltip.show(false);
                    delete tooltip;
                }
            }, 100);           
            
            
        }, delay);
        
        el.onmouseout = function(e) {
            if (tipTimer) {
                clearTimeout(tipTimer);
            }
        }
    }		
}


//D:\Dropbox\Private\l scripts\jfav\release\Extension\\widget\kellyTileGrid.js



/*
   @encoding utf-8
   @name           KellyTileGrid
   @namespace      Kelly
   @description    image view widget
   @author         Rubchuk Vladimir <torrenttvi@gmail.com>
   @license        GPLv3
   @version        v 1.0.8 24.09.18
   
   ToDo : 
   
   todo docs and examples
   
*/

function KellyTileGrid(cfg) {
    
    var tilesBlock = false;
    var tileClass = 'image';
    var loadTimer = false;
    
    var tiles = false;
    var tilesLoadState = false;
    var tilesLoaded = false;
    
    var currentTileRow = false;
    var requiredWidth = false;
    var hideUnfited = false;
    
    var rowHeight = 250; // требуемая высота тайловой строки
    
    var rules = {
        min : 2, // минимальное кол-во элементов в строке не зависимо от rowHeight
        heightDiff : 10, // допустимая погрешность по высоте для текущей строки элементов
        heightDiffLast : 20, // допустимая погрешность для последнего ряда
        unfitedExtendMin : 2, // для последнего ряда - подгоняем по ширине не обращая внимания на требуемую высоту если осталось указанное кол-во изображений невместифшихся в сетку с требуемой высотой
        dontWait : false,
        fixed : false,
        tmpBounds : false,
        oversizedHeightRatio : 0.2,
        
        // внимание к длинным картинкам -oversized
    };
    
    var handler = this;
    var events = { 
        onGridUpdated : false, // (handler) after updateTileGrid method
        
        getResizableElement : false, // (handler, tile) если метод задан - возвращать элемент к которому в тайле будет применены атрибуты width \ height, по умолчанию сам тайл
        getBoundElement : false, // (handler, tile) если метод задан - возвращать элемент из которого можно получить данные о пропорция тайла (свойства data-width \ data-height) , по умолчанию сам тайл
        
        isBoundsLoaded : false, // (handler, tile, boundEl) is element loaded
        // getScaleElement
        onBadBounds : false, // (handler, data[errorCode, error, tile, boundEl]) element is loaded, but bounds is unsetted or loaded with error 
        onResize : false, // (handler) window resize
        onLoadBounds : false, // (handler, boundEl, errorTriger) some of unknown bounds element is ready
        onResizeImage : false, // (handler, tileResizedInfo[origHeight, origWidth, width, height])
    };
    
    var imgEvents = {
        onError : function(e) {
            onLoadBounds(this, 'error'); 
        },
        onSuccess : function(e) {
            onLoadBounds(this, 'success'); 
        },
    };
    
    function constructor(cfg) {
        handler.updateConfig(cfg);
    }
    
    this.updateConfig = function(cfg) {
        
        if (!cfg) return false;
                
        if (typeof cfg.tilesBlock != 'undefined') {
        
            tilesBlock = cfg.tilesBlock;
            
            if (typeof tilesBlock == 'string') {
                var el = document.getElementById(tilesBlock.trim());
                if (el) tilesBlock = document.getElementById(tilesBlock.trim());
            }
        }
        
        if (cfg.rowHeight) {
            rowHeight = cfg.rowHeight;
        }
        
        if (cfg.rules) {
        
            for (var k in rules){
                if (typeof rules[k] !== 'function' && typeof cfg.rules[k] !== 'undefined') {
                     rules[k] = cfg.rules[k];
                }
            }
        }
        
        if (cfg.tileClass) {
            tileClass = cfg.tileClass;
        }
        
        if (cfg.hideUnfited) {
            hideUnfited = true;
        } else {
            hideUnfited = false;
        }
        
        if (cfg.events) {
        
            for (var k in events){
                if (typeof cfg.events[k] == 'function') {
                     events[k] = cfg.events[k];
                }
            }
        }
        
        window.addEventListener('resize', onResize);	
        return true;
    }
    
    function onResize() {
        if (!tilesBlock) return;
        
        if (events.onResize && events.onResize(handler)) {
            return true;
        } 
        
        handler.updateTileGrid(true);
    }
    
   function isBoundsLoaded(tile) {
   
        var boundEl = handler.getBoundElement(tile);
        if (!boundEl) return true;
                
        if (events.isBoundsLoaded && events.isBoundsLoaded(handler, tile, boundEl)) {
            return true;
        } 
        
           if (boundEl.tagName != 'IMG') return true;  // text previews without image or some thing like that
        if (boundEl.getAttribute('error')) return true;
        if (boundEl.getAttribute('data-width')) return true;
        
        if (!boundEl.src) {
            boundEl.setAttribute('error', '1');
            return true;
        }
    
        var loaded = boundEl.complete && boundEl.naturalHeight !== 0;
        return loaded;
    }
    
    function onBadBounds(data) {
            
        console.log(data);
        
        if (events.onBadBounds) {
            
            return events.onBadBounds(handler, data);
            
        } else {
        
            if (data.tile) data.tile.style.display = 'none';
        }
        
        return false;
            
    }
    
    function onLoadBounds(boundEl, state) {
        
        if (boundEl.tagName != 'IMG' && (!boundEl.naturalWidth || !boundEl.naturalHeight)) {
            state = 'error';
        }
        
        if (events.onLoadBounds && events.onLoadBounds(handler, boundEl, state)) {
            return true;
        } 
        
        if (state == 'error') {
            boundEl.setAttribute('error', '1');
        } else {
            
        }
        
        handler.updateTileGrid();
    }

    function getResizedInfo(resizeTo, info, resizeBy) 
    {		 
        var k;
        
        if (resizeBy == 'width') {
            k = info[resizeBy] / resizeTo;
            info.height = Math.ceil(info.height / k);
        } else {
            k = info[resizeBy] / resizeTo;
            info.width = Math.ceil(info.width / k);
        }
        
        info[resizeBy] = resizeTo;
        return info;
    }	 

    this.getTilesBlock = function() {
        return tilesBlock;
    }

    this.getTiles = function() {
        return tilesBlock.getElementsByClassName(tileClass);
    }
    
    this.getBoundElement = function(tile) {
        if (events.getBoundElement) return events.getBoundElement(handler, tile);
        return tile;
    }

    this.getResizableElement = function(tile) {
        if (events.getResizableElement) return events.getResizableElement(handler, tile);
        return tile;
    }
    
    this.clearEvents = function() {
        
        if (!tilesBlock) return false;
        tiles = handler.getTiles();
        
        for (var i = 0; i < tiles.length; i++) {
            var boundEl = handler.getBoundElement(tiles[i]);
            if (boundEl.tagName == 'IMG' && tiles[i].getAttribute('data-load-eventInit')) {
                
                boundEl.removeEventListener('error', imgEvents.onError);
                boundEl.removeEventListener('load',  imgEvents.onSuccess);				
                tiles[i].setAttribute('data-load-eventInit', '0');
            }
        }
    }
        
    this.stopLoad = function() {
    
        // останавливаем загрузку если что-то не успело загрузится. При сценариях - смена страницы \ закрытие блока с тайлами и т.п.
   
        if (!tilesBlock) return false;
        for (var i = 0; i < tiles.length; i++) {
            var boundEl = handler.getBoundElement(tiles[i]);
            if (boundEl.tagName == 'IMG') {
                boundEl.src = ''; 
            }
        }
    }
    
    this.close = function() {
        handler.clearEvents();
        handler.stopLoad();
    }
    
    this.isWaitLoad = function() {
        return tilesLoaded == tiles.length ? false : true;
    }
    
    function markRowAsRendered() {
    
        for (var i=0; i <= currentTileRow.length-1; i++) { 
            currentTileRow[i].tile.setAttribute('data-rowItem-rendered', '1');
        }
    }

    function clearRowRenderMarks() {
        
        for (var i=0; i <= tiles.length-1; i++){ 
                
            if (tiles[i].getAttribute('data-rowItem-rendered')) {
                tiles[i].setAttribute('data-rowItem-rendered', '');
            }
        }
    }
    
    this.updateTileGridState = function() {
        
        if (!tilesBlock) return false;
        
        tiles = handler.getTiles();
        tilesLoaded = 0;        
        tilesLoadState = [];
        
        for (var i = 0; i < tiles.length; i++) {
            
            tilesLoadState[i] = isBoundsLoaded(tiles[i]);
            
            if (tilesLoadState[i]) {
                tilesLoaded++;                
            } else {
            
                var boundEl = handler.getBoundElement(tiles[i]);
                if (boundEl.tagName == 'IMG' && !tiles[i].getAttribute('data-load-eventInit')) {
                    
                    // test error states
                    /*
                        var testError = Math.floor(Math.random() * Math.floor(50));
                        if (testError > 25) {
                            boundEl.src = boundEl.src.replace('.', 'test.d');
                        }
                    */
                    
                    boundEl.addEventListener('error', imgEvents.onError);
                    boundEl.addEventListener('load', imgEvents.onSuccess);
                    
                    tiles[i].setAttribute('data-load-eventInit', '1');
                }
            }
        }
        
        return true;
    }
    
    this.updateTileGrid = function(resize) {		
        
        if (!handler.updateTileGridState()) return false;
        
        if (resize) {
            clearRowRenderMarks();
        }
        
        if (tilesLoaded == tiles.length || (rules.dontWait && tilesLoaded >= rules.dontWait)) {
        
            landscape = 0;
            portrait = 0;
            currentTileRow = [];        
            
            var screenSize = tilesBlock.getBoundingClientRect().width; 
            
            requiredWidth = Math.floor(screenSize); 
            if (screenSize < requiredWidth) requiredWidth = screenSize;

            if (!requiredWidth) {
                console.log('fail to get required width by block. Possible block is hidden');
                console.log(tilesBlock);
                return false;
            }
               
            for (var i=0; i <= tiles.length-1; i++){ 
                
                // если понадобятся lazy load \ порядок загрузки изображений, лучше вынести в отдельное решение при необходимости, 
                // здесь нужен только контроль текущего состояния пропорций элементов
                
                if (tilesLoaded != tiles.length && rules.dontWait && tiles[i].getAttribute('data-rowItem-rendered')) continue;
                if (!tilesLoadState[i] && !rules.tmpBounds) break;
                                    
                var tileMainEl = this.getBoundElement(tiles[i]);
                var alternativeBounds = false;					
                
                var imageInfo = {
                    portrait : false,
                    image : this.getResizableElement(tiles[i]),
                    width : 0,
                    height : 0,
                    tile : tiles[i],
                };
                
                if (tilesLoadState[i]) {
                
                    if (rules.dontWait && rules.tmpBounds && tiles[i].className.indexOf(tileClass + '-tmp-bounds') !== -1) {
                        tiles[i].className = tiles[i].className.replace(tileClass + '-tmp-bounds', '');
                    }
                    
                    if (!tileMainEl) {							
                        alternativeBounds = onBadBounds({errorCode : 1, error : 'updateTileGrid getBoundElement fail', tile : tiles[i], boundEl : false});						
                        if (!alternativeBounds){						
                            continue;
                        }
                    }
                    
                    if (tileMainEl.getAttribute('error')) {
                    
                        alternativeBounds = onBadBounds({errorCode : 2, error : 'updateTileGrid error during load image', tile : tiles[i], boundEl : tileMainEl});						
                        if (!alternativeBounds) {						
                            continue;
                        }
                    }
                    
                    imageInfo.width = parseInt(tileMainEl.getAttribute('data-width'));
                    imageInfo.height = parseInt(tileMainEl.getAttribute('data-height'));
                    
                    if (!imageInfo.width) {
                    
                        if (tileMainEl.tagName == 'IMG') {
                                                    
                            imageInfo.width = parseInt(tileMainEl.naturalWidth);
                            imageInfo.height = parseInt(tileMainEl.naturalHeight); 
                        } 
                    }    
                    
                    if (!imageInfo.width || imageInfo.width < 0) {
                    
                        alternativeBounds = onBadBounds({errorCode : 3, error : 'no width \ height', tile : tiles[i],	boundEl : tileMainEl});						
                        if (!alternativeBounds) {
                        
                            continue;
                            
                        } else {
                        
                            imageInfo.width = alternativeBounds.width;
                            if (alternativeBounds.height) imageInfo.height = alternativeBounds.height;
                        }
                    } 
                
                    
                } else {
                    
                    if (tiles[i].className.indexOf(tileClass + '-tmp-bounds') == -1) {
                        tiles[i].className += ' ' + tileClass + '-tmp-bounds';
                    }
                    
                    imageInfo.width = rules.tmpBounds.width;
                    imageInfo.height = rules.tmpBounds.height;
                }
                
                
                if (!imageInfo.height) imageInfo.height = imageInfo.width;
                
                var ratio = Math.min(imageInfo.width, imageInfo.height) / Math.max(imageInfo.height, imageInfo.width);
                var oversized = false;
                
                if (imageInfo.height > imageInfo.width && ratio <= rules.oversizedHeightRatio) oversized = true; 
                
                if (oversized) {
                    
                    imageInfo.width = 0;
                    imageInfo.height = 0;
                    
                    alternativeBounds = onBadBounds({errorCode : 4, error : 'oversized', tile : tiles[i],	boundEl : tileMainEl});						
                    if (!alternativeBounds) {
                    
                        continue;
                        
                    } else {
                    
                        imageInfo.width = alternativeBounds.width;
                        if (alternativeBounds.height) imageInfo.height = alternativeBounds.height;
                        else imageInfo.height = imageInfo.width;
                        
                        if (tiles[i].className.indexOf(tileClass + '-oversized-bounds') == -1) {
                            tiles[i].className += ' ' + tileClass + '-oversized-bounds';
                        }
                    }
                    
                    
                }				
                    
                if (imageInfo.width < imageInfo.height) imageInfo.portrait = true;   
                imageInfo.portrait ? portrait++ : landscape++;
                
                tiles[i].style.display = 'inline-block';
                currentTileRow.push(imageInfo);
                
                if (!rules.fixed) {
                    if (currentTileRow.length < rules.min ) continue;
                    if (i + rules.min >= tiles.length) continue; // collect last elements, todo set as option
                    
                    var currentRowResultHeight = getExpectHeight();
                    
                    // если текущий ряд не масштабируеся под требуемую высоту с определенным допуском, продолжаем сбор изображений
                    
                    if (currentRowResultHeight > rowHeight + ( (rowHeight / 100) * rules.heightDiff )) continue;
                    
                } else {
                
                    if (currentTileRow.length < rules.fixed) continue;
                }
                
                // console.log(imageInfo);
                // console.log(currentTileRow);
                
                markRowAsRendered();
                resizeImagesRow();
            }
                           
            if (currentTileRow.length) {
            
                if (getExpectHeight() > rowHeight + ( (rowHeight / 100) * rules.heightDiffLast )) {
                    
                    if (hideUnfited) {
                        
                        for (var i=0; i <= currentTileRow.length-1; ++i){ 
                            currentTileRow[i].image.style.display = 'none';
                        }
                        
                    } else {
                        
                        
                        var showAsUnfited = currentTileRow.length >= rules.unfitedExtendMin ? false : true;
                        // if (rules.fixed) showAsUnfited = false;
                        
                        resizeImagesRow(showAsUnfited);
                    }
                    
                } else {
                
                    resizeImagesRow();
                }
            }

            var clear = tilesBlock.getElementsByClassName(tileClass + '-clear-both');
            if (clear.length) clear[0].parentNode.appendChild(clear[0]);
            else {
                clear = document.createElement('div');
                clear.className = tileClass + '-clear-both';
                clear.setAttribute('style', 'clear : both;');
                tilesBlock.appendChild(clear);                        
            }

            if (events.onGridUpdated) events.onGridUpdated(handler);
            
        } 
    }
    
    function getCurrentRowWidth() {
    
        var width = 0; 	
        for (var i=0; i <= currentTileRow.length-1; ++i){ 
            
            // масштабируем до нужной высоты весь набор изображений и смотрим сколько получилось по ширине в сумме
            
            width += parseInt(getResizedInfo(rowHeight, {width : currentTileRow[i].width, height : currentTileRow[i].height}, 'height').width);            
        }
        
        return width;
    }
    
    function getExpectHeight() {
        
        return getResizedInfo(requiredWidth, {width : getCurrentRowWidth(), height : rowHeight}, 'width').height; // подгоняем к треуемой ширине
    }
    
    // if some of the items info contain zero values, can return NaN for all row items
    
    function resizeImagesRow(unfited) {
    
        if (!currentTileRow.length) return false;
        
        var width = 0; // counter		
               
        // count total width of row, and resize by required row height
        for (var i=0; i <= currentTileRow.length-1; ++i){ 
            currentTileRow[i].origWidth = currentTileRow[i].width;
            currentTileRow[i].origHeight = currentTileRow[i].hight;
            currentTileRow[i] = getResizedInfo(rowHeight, currentTileRow[i], 'height');
            width += parseInt(currentTileRow[i].width); 
            
        }
        
        // get required row width by resizing common bounds width \ height
        // lose required height, if some proportions not fit
        
        var required = getResizedInfo(requiredWidth, {width : width, 'height' : rowHeight}, 'width');
        
        // finally resize image by required recalced height according to width

        currentRowWidth = 0;
        
        for (var i=0; i <= currentTileRow.length-1; ++i){ 
            
            if (!unfited) {
                currentTileRow[i] = getResizedInfo(required.height, currentTileRow[i], 'height');
            }
            
            currentRowWidth += currentTileRow[i].width;
            
            if (currentRowWidth > requiredWidth) {
                currentTileRow[i].width = currentTileRow[i].width - (currentRowWidth - requiredWidth); // correct after float operations
            }
            
            if (currentTileRow[i].image.className.indexOf(tileClass + '-grid-resized') == -1) {
                currentTileRow[i].image.className += ' ' + tileClass + '-grid-resized';
            }
            
            if (i == 0 && currentTileRow[i].image.className.indexOf(tileClass + '-grid-first') == -1) {
                //currentTileRow[i].image.className = currentTileRow[i].image.className.replace(tileClass + '-grid-first', '');
                currentTileRow[i].image.className += ' ' + tileClass + '-grid-first';                
            }
            
            if (i == currentTileRow.length-1 && currentTileRow[i].image.className.indexOf(tileClass + '-grid-last') == -1 ) {            
                currentTileRow[i].image.className += ' ' + tileClass + '-grid-last';                
            }
                    
            if (events.onResizeImage && events.onResizeImage(handler, currentTileRow[i])) {
                
            } else {
        
                currentTileRow[i].image.style.width = currentTileRow[i].width + 'px';
                currentTileRow[i].image.style.height = currentTileRow[i].height + 'px'; 
                currentTileRow[i].image.style.float = 'left';
            }
        }
        
        
        portrait = 0;
        landscape = 0;
        currentTileRow = new Array();
    }
    
    constructor(cfg);
}


//D:\Dropbox\Private\l scripts\jfav\release\Extension\\widget\kellyImageView.js



/*
   @encoding utf-8
   @name           KellyImgView
   @namespace      Kelly
   @description    image view widget
   @author         Rubchuk Vladimir <torrenttvi@gmail.com>
   @license        GPLv3
   @version        v 1.0.6 22.09.18
   
   ToDo : 
   
   data-ignore-click - ok
   include pixel ratio detection - https://stackoverflow.com/questions/1713771/how-to-detect-page-zoom-level-in-all-modern-browsers
   add user event onButtonsShow
   
*/

function KellyImgView(cfg) {
    
    var handler = this;    
    var events = new Array();
    
    var beasy = false;
    
    var image = false; // current loaded image, false if not shown (getCurrentImage().image)
    var imageBounds = false; 
    
    var selectedGallery = 'default'; // inherit by opened source
   
    var commClassName = false; // DOM viewer class \ id base name
   
    var block = false;
    var fadeTime = 500; // not synced with css
    var buttonsMargin = 6;
    var blockShown = false;
    
    var cursor = 0;
    
    // todo touch move by x, go to previuse \ next by swipe
    // realise throw dragStart \ DragMove functions that related to image block
    
    var isMoved = false;
    
    var scale = 1;
    
    var move = {x : -1, y : -1, left : false, top : false}; // начальная точка клика dragStart, базовая позиция перемещаемого элемента
    var lastPos = false;
    
    var buttons = {};
    
    var images = {}; // gallery_prefix - array of images ( string \ a \ img \ element with data-src attribute )
    var imagesData = {};
    
    var userEvents = { 
        onBeforeGalleryOpen : false, // 
        onBeforeShow : false, // изображение загружено но не показано, переменные окружения обновлены
        onClose : false, //
    }; 
 
    var moveable = true;
    var swipe = false;	
    var bodyLockCss = false;
    var lockMoveMethod = 'lockMove'; // hideScroll (position : fixed элементы все равно сдвигаются если привязаны к правой стороне) | lockMove (блокирует движение но скроллбар остается)
   
    function constructor(cfg) {
        handler.updateConfig(cfg);
    }
    
    function getBlock() {
    
        if (typeof block == 'string') {
            var el = document.getElementById(block.trim());
            if (el) block = el;
        }
        
        return block ? block : false;
    }
    
    this.updateConfig = function(cfg) {
        
        if (cfg.className) {
            commClassName = cfg.className;
        }
        
        if (cfg.viewerBlock) {
            block = cfg.viewerBlock;            
        }
        
        if (cfg.userEvents) {
         
            if (cfg.userEvents.onBeforeGalleryOpen) {
                userEvents.onBeforeGalleryOpen = cfg.userEvents.onBeforeGalleryOpen;
            }
            
            if (cfg.userEvents.onBeforeShow) {
                userEvents.onBeforeShow = cfg.userEvents.onBeforeShow;
            }
            
            if (cfg.userEvents.onClose) {
                userEvents.onClose = cfg.userEvents.onClose;
            }
        }
        
        if (cfg.buttonsMargin) {
        
        }
        
        if (typeof cfg.moveable != 'undefined') {
            moveable = cfg.moveable;
        }
        
        if (typeof cfg.swipe != 'undefined') {
            swipe = cfg.swipe;
        }   
    }
   
    function isImgLoaded(imgElement) {
        
        if (!imgElement.src) return true;
    
        return imgElement.complete && imgElement.naturalHeight !== 0;
    }
    
    function showBodyScroll(show) {
        var body = document.body;
        
        body.className = body.className.replace(commClassName + '-margin', '').trim();
        body.className = body.className.replace(commClassName + '-lock', '').trim();
        
        if (show) {

            return;
            
        } else {
        
            if (!body || !body.clientWidth) return false;
        
            var diff = screen.width - body.clientWidth;
            if (!diff || diff <= 0) return false;
            
            if (bodyLockCss !== false) {
                bodyLockCss.innerHTML = '';
            }
    
            var head = document.head || document.getElementsByTagName('head')[0];
            
            bodyLockCss = document.createElement('style');
            bodyLockCss.type = 'text/css';
            
            head.appendChild(bodyLockCss);
            
            css = '.' + commClassName + '-margin {';
            css += 'margin-right : ' + diff + 'px;';
            css += '}';
            
            if (bodyLockCss.styleSheet){
              bodyLockCss.styleSheet.cssText = css;
            } else {
              bodyLockCss.appendChild(document.createTextNode(css));
            }
            
            body.className += ' ' + commClassName + '-lock ' + commClassName + '-margin';
        }

        return true;
    }
    
    this.getButton = function(index) {
    
        if (!index) return buttons;
    
        if (!buttons[index]) return false;
        
        return buttons[index];
    }
    
    this.getButtons = function() {
        return buttons;
    }
    
    this.getImages = function() {
        return images;
    }
           
    this.getCurrentState = function() {	
        
        return { 
            block : getBlock(),
            image : image, 
            gallery : selectedGallery, 
            index : cursor,
            cursor : cursor,
            shown : blockShown,
            blockShown : blockShown,
            imageData : imagesData[selectedGallery] ? imagesData[selectedGallery] : false,
        };
    }
    
    this.hideButtons = function(hide) {
        for (var k in buttons){
            if (typeof buttons[k] !== 'function') {
            
                buttons[k].className = buttons[k].className.replace(commClassName + '-btn-hidden', '').trim();
                
                if ((k == 'prev' || k == 'next') && (!images[selectedGallery] || images[selectedGallery].length <= 1)) {
                    buttons[k].className += ' ' + commClassName + '-btn-hidden';
                    continue;
                } else if (hide) {
                    buttons[k].className += ' ' + commClassName + '-btn-hidden';
                }
            }
        }        
        
        handler.updateButtonsPos();
    }
    
    this.hideLoader = function(hide) {
                
        var loader = getEl('loader');
        if (loader) {
            if (hide) addClass(loader, 'loader-hidden');
            else deleteClass(loader, 'loader-hidden');
        }
    }
    
    this.addButton = function(innerHTML, index, onclick, addition) {
        
        if (!getBlock()) {        
            console.log('cant create buttons, main block not ready');
            return false;
        }
        
        var w, h, additionStyle, className;
        
        if (addition) {
            if (addition.w) w = parseInt(addition.w);
            if (addition.h) h = parseInt(addition.h);
            if (addition.additionStyle) additionStyle = addition.additionStyle;
            if (addition.className) className = addition.className;
        }
        
        if (!additionStyle) additionStyle = '';
        if (!className) className = commClassName + '-btn ' + commClassName + '-btn-' + index ;
        
        if (w) additionStyle += 'width : ' + w + 'px;';
        if (h) additionStyle += 'height : ' + h + 'px;';
        
        var button = document.createElement('div');
            if (additionStyle) button.setAttribute('style', additionStyle);
            button.onclick = onclick;
            button.className = className;
            button.innerHTML = innerHTML;
            
        buttons[index] = button;
        block.appendChild(buttons[index]);
        
        return button;        
    }
    
    this.addBaseButtons = function(){
        if (buttons['close']) return true;
        
        handler.addButton(getSvgIcon('close', '#000'), 'close', function() { handler.cancelLoad(); });
        
        handler.addButton(getSvgIcon('left', '#000'), 'prev', function() { handler.nextImage(false); });
        handler.addButton(getSvgIcon('right', '#000'), 'next', function() { handler.nextImage(true); });
        
        return true;
    }

    this.updateButtonsPos = function(pos) {
        
        if (!image) return false;
        // console.log(window.getComputedStyle(image));
        
        if (!pos) {
            pos = {						
                left : parseInt(image.style.left),
                top : parseInt(image.style.top),
            }
        }
    
        var clientBounds = handler.getClientBounds();
        
        var item = 0;
        var horizontal = false;        
        
        var left = pos.left + parseInt(image.style.width) + 12;
        var top = pos.top;
        
        for (var k in buttons) {
            
            if (buttons[k].className.indexOf('hidden') != -1) continue;
            
            item++;                
            var buttonBounds = buttons[k].getBoundingClientRect();
            
            if (item == 1) {
                // console.log(top - buttonBounds.height)
                if (left + buttonBounds.width > clientBounds.screenWidth - 12) {
                    horizontal = true;
                    left = pos.left;
                    top -= buttonBounds.height +  12;                    
                }

                if (horizontal && top - buttonBounds.height <= 0) {
                    top = pos.top;
                }
                
                if (!horizontal && top <= 0) {
                    top = 0;
                }
            } 
            
            buttons[k].style.left = left + 'px';
            buttons[k].style.top = top + 'px'; 
            
            if (horizontal) { 
                left += buttonBounds.width + buttonsMargin;
            } else {
                top += buttonBounds.height + buttonsMargin;
            }
        }
    }
    
    function deleteClass(el, name) {        
        if (el && el.className.indexOf(commClassName + '-' + name) != -1) {
            el.className = el.className.replace(commClassName + '-' + name, '').trim();
        }
    }
    
    function addClass(el, name) {
        if (el && el.className.indexOf(commClassName + '-' + name) == -1) {
            el.className += ' ' + commClassName + '-' + name;
        }
    }
    
    function getEl(name) {
        if (!getBlock()) return false;
        var pool = block.getElementsByClassName(commClassName + '-' + name);        
        if (pool && pool.length) return pool[0];
        else return false;
    }
    
    function showMainBlock(show) {
           
        if (show && blockShown) return;
        
        // will be extended if something from this events will be used for some thing else
        
        var disableMoveContainer = function(disable) {
        
            var stop = function(e) {
                event.preventDefault();
            }
            
            if (disable) {
            
                handler.addEventListner(window, 'wheel', stop, '_scroll');
                handler.addEventListner(window, 'mousewheel', stop, '_scroll');
                handler.addEventListner(window, 'touchmove', stop, '_scroll');
            
            } else {
            
                handler.removeEventListener(window, 'touchmove', '_scroll');            
                handler.removeEventListener(window, 'mousewheel', '_scroll');
                handler.removeEventListener(window, 'wheel', '_scroll');
            }
            
        }            
        
        if (show) {
        
            if (lockMoveMethod == 'hideScroll') {
                showBodyScroll(false);
            } else {				
                disableMoveContainer(true);
            }
            
            blockShown = true;
            
            if (!getBlock()) {
                return;
            }
            
            addClass(block, 'active');
            deleteClass(block, 'fade');
            
            block.onclick = function(e) { 
            
                if (e.target != this) return false;
                handler.cancelLoad(); return false; 
            }        
                 
            handler.addEventListner(window, "scroll", function (e) {
                handler.updateBlockPosition();
            }, 'img_view_');
            
            handler.addEventListner(window, "resize", function (e) {

                    handler.updateSize(e);
                    return false;
            }, 'image_update_');

           // env.addEventListner(block, "mousemove", function (e) {
           //     handler.updateCursor();
           // }, 'image_mouse_move_');            

            handler.addEventListner(document.body, "keyup", function (e) {
            
                var c = e.keyCode - 36;
               
                var right = c == 3 || c == 32 || c == 68 || c == 102;
                var left = c == 1 || c == 29 || c == 65 || c == 100;
               
                if (right || left) {
                    
                    handler.nextImage(right, 1, e);
                }
                
                var minus = c == 73;
                var plus = c == 71;
                
                if (minus || plus) {
                    
                    handler.scale(plus);
                }
                
                
            }, 'next_image_key');    
        } else {       
            
            setTimeout(function() { 
            
                if (lockMoveMethod == 'hideScroll') {
                    showBodyScroll(true);
                } else {				
                    disableMoveContainer(false);
                } 
                
                deleteClass(block, 'active');
                deleteClass(block, 'fade');              
                handler.removeEventListener(window, "scroll", 'img_view_');
                blockShown = false;
                
            }, fadeTime);  
            
            
            addClass(block, 'fade');
            handler.removeEventListener(window, "resize", 'image_update_');
            handler.removeEventListener(document.body, "keyup", 'next_image_key');
        }     
    }
    
    // initialize image viewer from gallery pointer with start cursor \ gallery and image src, or go to nextimage in selected gallery
    
    // galleryItemPointer - dom element with kellyGallery and kellyGalleryIndex attributes, if false, go to next \ prev in current gallery
    // initial image must be setted in href \ src \ or in data-image attribute, else - set kellyGalleryIndex to -1 to start from begining of gallery array
    // next - bool  (true \ false, if false go to previuse) 
    
    // for navigation use nextImage method instead if gallery already opened
    
    this.loadImage = function(galleryItemPointer, galleryData) {
        
        if (beasy) return false;
        
        beasy = true;
        scale = 1;
        // console.log('load image');
        
        if (userEvents.onBeforeGalleryOpen) {
            userEvents.onBeforeGalleryOpen(handler, galleryItemPointer, galleryData);
        }
        
        if (!blockShown) showMainBlock(true);
        
        if (!galleryItemPointer && !galleryData) {
        
            galleryItemPointer = images[selectedGallery][cursor];
            
        } else if (galleryData) {
            
            if (galleryData.gallery) {
                selectedGallery = galleryData.gallery;
            }
            
            if (typeof galleryData.cursor != 'undefined') {
                if (galleryData.cursor == 'next') {
                    galleryItemPointer = getNextImage(true, true);
                } else if (galleryData.cursor == 'prev') {
                    galleryItemPointer = getNextImage(false, true);
                } else {
                    cursor = galleryData.cursor;
                    galleryItemPointer = images[selectedGallery][cursor];
                }
            }
        }
                
        
        handler.hideButtons(true);
        handler.hideLoader(false);
        handler.updateBlockPosition();    
        
          image = document.createElement("img");
        image.src = getImageUrlFromPointer(galleryItemPointer);  
        
        if (isImgLoaded(image)) handler.imageShow();
        else image.onload = function() { handler.imageShow(); return false; }	
    }
    
    this.getClientBounds = function() {
    
        var elem = (document.compatMode === "CSS1Compat") ? 
            document.documentElement :
            document.body;

        return {
            screenHeight: elem.clientHeight,
            screenWidth: elem.clientWidth,
        };
    }
    
    this.getScale = function() { return scale; }
    
    this.scale = function(plus) {
        
        var newScale = scale;
        var step = 0.1;
        if (!plus) step = step * -1;
        
        newScale += step;
        
        if (newScale < 0.5) return;
        scale = newScale;
        
        var rHeight = imageBounds.resizedHeight; // resized variables
        var rWidth = imageBounds.resizedWidth;
        
        var newHeight = Math.round(rHeight * scale);
        
        var k = newHeight / rHeight;
        
        rHeight = k * rHeight;
        rWidth = k * rWidth;
        
        var pos = {left : parseInt(image.style.left), top : parseInt(image.style.top)};
        var posCenter = {left : pos.left + parseInt(image.style.width) / 2, top : pos.top + parseInt(image.style.height) / 2};
        
        image.style.width = rWidth + 'px';
        image.style.height = rHeight + 'px';
        
        image.style.left = Math.floor(posCenter.left - (rWidth / 2)) + 'px';
        image.style.top = Math.floor(posCenter.top - (rHeight / 2)) + 'px';
        
        
        handler.updateButtonsPos();
    }
    
    // get local coordinats event pos
    
    function getEventDot(e) {
        e = e || window.event;
        var x, y;
        
        // 
        var scrollX = 0; // document.body.scrollLeft + document.documentElement.scrollLeft;
        var scrollY = 0; // document.body.scrollTop + document.documentElement.scrollTop;
        
        var touches = [];
        if (e.touches && e.touches.length > 0) {
            
            for (var i = 0; i < e.touches.length; i++) {
                touches[i] = {
                    x : e.touches[i].clientX + scrollX,
                    y : e.touches[i].clientY + scrollY,
                }
                
                if (i == 0) {
                    x = touches[0].x;
                    y = touches[0].y;
                }
            }
            
        } else {
            // e.pageX e.pageY e.x e.y bad for cross-browser
            x = e.clientX + scrollX;
            y = e.clientY + scrollY;		
        }
        
        //var rect = canvas.getBoundingClientRect();

        return {x: x, y: y, touches : touches};
    }
    
    this.updateCursor = function(e) {
    
        console.log(getEventDot(e));
    }
    
    function calcDistance(pointA, pointB) {
        var a = pointA.x - pointB.x;
        var b = pointA.y - pointB.y;

        return Math.sqrt( a*a + b*b );
    }

    this.drag = function(e) {
        
        var prevTouches = lastPos ? lastPos.touches : false;
        
        lastPos = getEventDot(e);
        if (lastPos.touches && lastPos.touches.length > 2){
            return;
        }
        
        /*
        if (!animationFrame) return false;
        
        window.requestAnimationFrame(function() {
            animationFrame = true;
        })
        
        animationFrame = false;
        */
        
        if (prevTouches && prevTouches.length > 1 && lastPos.touches.length > 1) {
        
            var zoomIn = calcDistance(prevTouches[0], prevTouches[1]) < calcDistance(lastPos.touches[0], lastPos.touches[1]) ? true : false;
            handler.scale(zoomIn);
            
        } else if (moveable || scale != 1) {
        
            var newPos = {left : move.left + lastPos.x - move.x, top : move.top + lastPos.y - move.y}
            
            image.style.left = newPos.left + 'px';
            image.style.top =  newPos.top + 'px';
            
        } else if (scale == 1 && swipe) { // lastPos && lastPos.touches.length == 1
        
            var newPos = {left : move.left + lastPos.x - move.x, top : move.top}
            image.style.left = newPos.left + 'px';
            
        } else return;
        
        handler.updateButtonsPos(newPos);
    }
    
    this.dragEnd = function(e) {
    
        isMoved = false;
        handler.removeEventListener(document.body, "mousemove", 'image_drag_');
        handler.removeEventListener(document.body, "mouseup", 'image_drag_');
        handler.removeEventListener(document.body, "touchmove", 'image_drag_');
        handler.removeEventListener(document.body, "touchend", 'image_drag_');
        
        if (!lastPos) return;
        
        if (scale == 1 && swipe) { // lastPos && lastPos.touches.length == 1
            
            //image.style.transition = 'left 0.3s';
            
            var diff = lastPos.x - move.x;
            if (Math.abs(diff) > 64) {
            
                var next = false;
                if (diff <= 0) {
                    next = true;
                    //image.style.right =  + 'px';
                }
                
                handler.nextImage(next);
                
            } else {
            
                if (image) {
                
                    var newPos = {left : move.left, top : move.top}
                
                    image.style.left = newPos.left + 'px';                
                    handler.updateButtonsPos(newPos);
                }
            }
            
        }     

        lastPos = false;
    }
    
    this.dragStart = function(e) {
        
        if (isMoved) return false;        
        if (beasy) return false;
        
        move = getEventDot(e);

        move.left = parseInt(image.style.left);
        move.top = parseInt(image.style.top);
        
        // console.log(move); // 884 - 554
        // move.x = parseInt(image.style.left)
        
        isMoved = true; 
        handler.addEventListner(document.body, "mousemove", function (e) {
            handler.drag(e);
        }, 'image_drag_');
        handler.addEventListner(document.body, "mouseup", function (e) {
            handler.dragEnd(e);
        }, 'image_drag_');
        handler.addEventListner(document.body, "mouseout", function (e) {
            handler.dragEnd(e);
        }, 'image_drag_');
        handler.addEventListner(document.body, "touchend", function (e) {
            handler.dragEnd(e);
        }, 'image_drag_');
        handler.addEventListner(document.body, "touchmove", function (e) {
            handler.drag(e);
        }, 'image_drag_');
    }
    
    this.imageShow = function() {
    
        beasy = false;
        
        var imgContainer = getEl('img'); 

        handler.hideLoader(true);
        handler.updateSize(false);
        
        if (userEvents.onBeforeShow) {
            userEvents.onBeforeShow(handler, image);
        }
        
        imgContainer.innerHTML = '';
        imgContainer.appendChild(image);
  
        image.onmousedown = function(e) {
        
            handler.dragStart(e);
            return false;
        }
        
        image.ontouchstart = function (e) {
            handler.dragStart(e);
            return false;
        }
        
        handler.hideLoader(true);
        setTimeout(function() { image.style.opacity = '1'; handler.hideButtons(false); }, 100);  
        
    }
    
    this.updateSize = function(e) {
        if (!image) return false;
            
        var bounds = handler.getClientBounds(); 
        
        var padding = 20;
        
        var maxWidth = bounds.screenWidth - padding; 
        var maxHeight = bounds.screenHeight - padding; 
        
        if (!imageBounds) {
            imageBounds = {
                width : image.width, 
                height : image.height, 
                resizedWidth : image.width, 
                resizedHeight : image.height
            }; // save orig bounds before transform
        }
        
        var wRatio = maxWidth / imageBounds.width;
        var hRatio = maxHeight / imageBounds.height;
        
        // get value by biggest difference 
        var ratio = hRatio;
        if (wRatio < hRatio) ratio = wRatio;

        if (ratio < 1) { // resize if image bigger than screen
            imageBounds.resizedWidth = Math.floor(ratio * imageBounds.width);
            imageBounds.resizedHeight = Math.floor(ratio * imageBounds.height);
          
            // console.log('set Image to : ' + rWidth + ' |' + rHeight);
        }
        
        image.style.position = 'absolute';
        
        // console.log('maxWidth : ' + maxWidth + ' image Width' + image.width + ' maxHeight : ' + maxHeight + ' image Height ' + image.height);
        
        var newPos = {left : Math.round((bounds.screenWidth - imageBounds.resizedWidth) / 2), top : Math.round((bounds.screenHeight - imageBounds.resizedHeight) / 2 )};
        
        // todo check this values after scale
        
        image.style.width = imageBounds.resizedWidth + 'px';
        image.style.height = imageBounds.resizedHeight + 'px';
        image.style.left =  newPos.left + 'px';
        image.style.top = newPos.top + 'px';
        
        handler.updateButtonsPos(newPos);
        return true;
    }
    
    // hide show image block and cancel load
    
    this.cancelLoad = function(stage) {

       
        if (stage == 2) {
            beasy = false; 
            isMoved = false;
            
            if (image) {
                image.src = '';
                image = false;  
                
                if (image.parentNode) image.parentNode.removeChild(image);
            }
           
            var imgContainer = getEl('img'); 
                imgContainer.innerHTML = '';
            
            if (userEvents.onClose) {
                userEvents.onClose(handler);
            }				
            return;
            
        } else {
          
            if (image) {
                image.onload = function() { return false; };                
            }
            
            showMainBlock(false);
            
            imageBounds = false;
            beasy = true; 
            
            handler.hideLoader(true);
            
            setTimeout(function() { handler.cancelLoad(2);}, fadeTime);  
        }
        
    }
    
    // update image gallery viewer block position 
    
    this.updateBlockPosition = function() {
        if (blockShown && window.getComputedStyle(block).position !== 'fixed') {
            block.style.top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0) + 'px'; // getScrollTop
        }
    }

    
    // get image url from source string or element
    // if source is member of exist gallery - move cursor to source index and switch to source gallery
    
    function getImageUrlFromPointer(source) {
    
        var sourceImg = '';
        
        // change gallery by source - affects on next image functions and buttons
        
        if (typeof source !== 'string' && source.getAttribute('kellyGallery') && source.getAttribute('kellyGalleryIndex')) {
        
            selectedGallery = source.getAttribute('kellyGallery');
            cursor = parseInt(source.getAttribute('kellyGalleryIndex'));
            sourceImg = getUrlFromGalleryItem(images[selectedGallery][cursor]);
            
        } else {
        
            sourceImg = getUrlFromGalleryItem(source);
        }
        
        if (!sourceImg) {
            console.log('image not found for element');
            console.log(source);
        }
        
        return validateUrl(sourceImg);
    }
    
    function getUrlFromGalleryItem(item) {
    
        var url = '';
        if (typeof item == 'string') {
        
            url  = item;
            
        } else {
        
            url = item.getAttribute('data-image');
            if (!url) {
            
                     if (item.tagName == 'A') url = item.href;
                else if (item.tagName == 'IMG') url = item.src;
            }
        }
        
        return validateUrl(url);
    }
    
    function validateUrl(source) {
        if (!source) return '';	
        return source.trim();
    }
    
    function getSvgIcon(name, color) {
    
        if (!color) color = '#000';
        
        var icon = '';
        var bounds = '170 170';
        
        if (name == 'close') {
        
            icon = '<g>\
                    <title>' + name + '</title>\
                    <line x1="27.5" x2="145.5" y1="24.9" y2="131.9" fill="none" stroke="' + color + '" stroke-linecap="round" stroke-linejoin="undefined" stroke-width="19"/>\
                    <line x1="144" x2="28" y1="24.9" y2="131.9" fill="none" stroke="' + color + '" stroke-linecap="round" stroke-linejoin="undefined" stroke-width="19"/>\
                    </g>';
                    
        } else if (name == 'left' || name == 'right') {
        
            bounds = '120 120';
            icon = '<g>\
                     <title>' + name + '</title>\
                     <path transform="rotate(' + (name == 'right' ? '90' : '-90') + ' 61.24249267578127,65.71360778808595) " id="svg_1" \
                     d="m12.242498,108.588584l48.999996,-85.74996l48.999996,85.74996l-97.999992,0z" \
                     stroke-width="1.5" stroke="' + color + '" fill="' + color + '"/>\
                     </g>';
        } 
        
        return '<?xml version="1.0" encoding="UTF-8"?>\
                    <svg viewBox="0 0 ' + bounds + '" xmlns="http://www.w3.org/2000/svg">' + icon + '</svg>'; 
    }
    
    function getNextImage(next, updateCursor) {

        var items = images[selectedGallery];
        var nextItemIndex = cursor;  
        
             if (next && items.length-1 == cursor) nextItemIndex = 0;
        else if (next) nextItemIndex += 1;
        else if (!next && !cursor) nextItemIndex = items.length-1;
        else nextItemIndex -= 1;
        
        if (updateCursor) {
            cursor = nextItemIndex;
        }
        
        return items[nextItemIndex];
    }
    
    this.nextImage = function(next, stage, event) {             
             
        if (stage == 2) {
        
            beasy = false;
            if (image.parentNode) image.parentNode.removeChild(image);
            image = false;            
            imageBounds = false;
            
            handler.loadImage(false, {cursor : next ? 'next' : 'prev'});
            
        } else { // select image and fade
        
            if (beasy) return false;
            if (!image) return false;
            if (!getNextImage(next)) return false;
            
            handler.hideLoader(false);
            handler.hideButtons(true);
            
            beasy = true;
            image.style.opacity = '0';
            
            // todo make load at same time as previuse image fades
            
            setTimeout(function() {
                handler.nextImage(next, 2, false);
                return false;
            }, fadeTime);
            
        }
    }
        
    // accept events to A or IMG elements, or elements with attribute "data-image" and specify gallery name, or accept data for some galleryName
    // galleryItems - array of elements or className or array of src strings
    // data-ignore-click = child for prevent loadImage when click on child nodes
    // galleryName - key for gallery that store this elements, detecting of next element based on this key
    
    this.addToGallery = function(galleryItems, galleryName, data) {
        
        if (!galleryName) galleryName = 'default';
        
        // accept by class name
        
        if (typeof galleryItems === 'string') {
            var className = galleryItems;
            images[galleryName] = document.getElementsByClassName(className);
            
        // accept by list of urls
        
        } else if (galleryItems.length) {
            images[galleryName] = galleryItems;
            
        } else return false;
        
        // addition data for gallery elements
        
        if (typeof data == 'object') {
            imagesData[galleryName] = data;
        }
        
        if (images[galleryName].length && typeof images[galleryName][0] === 'string') {
        
            // image gallery contain only urls
        
        } else {
        
            // image gallery contain elements associated with gallery items
            
            for (var i = 0, l = images[galleryName].length; i < l; i++)  {
                images[galleryName][i].setAttribute('kellyGallery', galleryName);
                images[galleryName][i].setAttribute('kellyGalleryIndex', i);
                images[galleryName][i].onclick = function(e) {
                                    
                    if (this.getAttribute('data-ignore-click') == 'child' && e.target !== this) return true; // pass throw child events if they exist
                
                    handler.loadImage(this);
                    return false;
                    
                }
            }	
        }
        
        return true;    
    }
    
    this.addEventListner = function(object, event, callback, prefix) {
        if (!object)
            return false;
        if (!prefix)
            prefix = '';

        events[prefix + event] = callback;

        if (!object.addEventListener) {
            object.attachEvent('on' + event, events[prefix + event]);
        } else {
            object.addEventListener(event, events[prefix + event]);
        }

        return true;
    }

    this.removeEventListener = function(object, event, prefix) {
        if (!object)
            return false;
        if (!prefix)
            prefix = '';

        if (!events[prefix + event])
            return false;

        if (!object.removeEventListener) {
            object.detachEvent('on' + event, events[prefix + event]);
        } else {
            object.removeEventListener(event, events[prefix + event]);
        }

        events[prefix + event] = null;
        return true;
    }
    
    constructor(cfg);
}


//D:\Dropbox\Private\l scripts\jfav\release\Extension\\lib\kellyLoc.js



var KellyLoc = new Object();

    // loaded by requestLoc method localization data
    KellyLoc.locs = {};		
    KellyLoc.debug = true;
    KellyLoc.browser = -1;
    
    // deprecated, detectLanguage not required for i18n mode
    KellyLoc.detectLanguage = function() {	

        var language = window.navigator.userLanguage || window.navigator.language;
        if (language) {
            if (language.indexOf('-') != -1) language = language.split('-')[0];
            
            language = language.trim();

            return language;
        } else return this.defaultLanguage;
        
    }
    
    KellyLoc.log = function(message) {
        if (this.debug) {
            KellyTools.log(message, 'KellyLoc');
        }
    }
    
    KellyLoc.parseText = function(text, vars) {
        
        if (!text) return '';
        
        if (vars) {
            for (var key in vars){
                if (typeof vars[key] != 'function') {
                    text = text.replace('__' + key + '__', vars[key]);
                }
            }
        } 
        
        return text;
    }
    
    KellyLoc.s = function(defaultLoc, key, vars) {
        
        if (this.locs[key]) return this.parseText(this.locs[key], vars);
        
        if (this.browser == -1) this.browser = KellyTools.getBrowser();
        
        if (!this.browser || !this.browser.i18n || !this.browser.i18n.getMessage) return this.parseText(defaultLoc, vars);
        
        this.locs[key] = this.browser.i18n.getMessage(key);
        if (!this.locs[key]) this.locs[key] = defaultLoc;  
        
        return this.parseText(this.locs[key], vars);
    }


//D:\Dropbox\Private\l scripts\jfav\release\Extension\\lib\kellyStorageManager.js



function KellyFavStorageManager(cfg) {
    
    var handler = this;
    
    // prefixes modified by environment on init, relative to current profile name
    // todo add list all storages for extension
    
    this.prefix = 'kelly_db_';
    this.prefixCfg = 'kelly_cfg_';
    
    this.api = KellyTools.getBrowser();
    
    this.wrap = false;
    
    this.className = 'KellyFavStorageManager';
    this.mergeProcess = false;
    
    this.driver = 'localstorage'; // config always loads from localstorage
    
    this.storageContainer = false; 
    this.storageList = false;
    
    this.inUse = false;
    
    this.fav = false; // kellyFavHelper
    
    var lng = KellyLoc; // singleton
    
    this.format = 'json';
        
    this.slist = false;
    
    function constructor(cfg) {	}
            
    this.showMessage = function(text, error, section) {
    
        var	message = KellyTools.getElementByClass(handler.storageContainer, handler.className + '-message' + (section ? '-' + section : ''));
            
        if (!message) return;
        
        message.className = message.className.replace(handler.className + '-error', '').trim();
        
        if (error) message.className += ' ' + handler.className + '-error';
        message.innerHTML = text;
        
        handler.inUse = false;
    }
    
    this.showStorageList = function(slist) {	
    
        if (!handler.storageList) return;
        
        handler.slist = slist;
        
        handler.storageList.innerHTML = '<div class="' + handler.className + '-DBItems-total">' + lng.s('Общий размер данных', 'storage_manager_total') + ' : <span>' + (!slist.length ? '0' +  lng.s('кб', 'kb') :  lng.s('Загрузка', 'loading') + '...') + '</span></div>' ;
        var totalKb = 0;
        var itemsLoaded = 0;
        
        for (var i=0; i < slist.length; i++) {
        
            var dbItem = document.createElement('DIV');
                dbItem.className = handler.className + '-DBItem';
                
                if (handler.fav.getGlobal('fav').coptions.storage == slist[i]) {
                    dbItem.className += ' active';
                }
            
            var dbName = slist[i];
            
                dbItem.innerHTML  = '<span class="' + handler.className + '-DBItem-name">' + slist[i] + '</span>';
                dbItem.innerHTML += '<span class="' + handler.className + '-DBItem-size ' + handler.className + '-' + dbName + '" ></span>';
                if (handler.fav.isDownloadSupported) {
                    dbItem.innerHTML += '<a class="' + handler.className + '-DBItem-download' + '" href="#">' + lng.s('Скачать', 'download') + '</a>';
                }
                dbItem.innerHTML += '<a class="' + handler.className + '-DBItem-select' + '" href="#">' + lng.s('Выбрать', 'select') + '</a>';
                
            handler.storageList.appendChild(dbItem);			
            
            handler.getDBSize(dbName, false, function(dbName, size) {
                KellyTools.getElementByClass(handler.storageList, handler.className + '-' + dbName).innerHTML = parseFloat(size).toFixed(2) + 'кб';
                
                totalKb += size;
                itemsLoaded++;
                if (itemsLoaded == slist.length) {
                    var totalEl = KellyTools.getElementByClass(handler.storageList, handler.className + '-DBItems-total');
                    KellyTools.getElementByTag(totalEl, 'span').innerHTML = parseFloat(totalKb).toFixed(2) + lng.s('кб', 'kb');
                }
            });
            
            var selectButton = KellyTools.getElementByClass(dbItem, handler.className + '-DBItem-select');
                selectButton.setAttribute('data-dbname', slist[i]);
                selectButton.onclick = function() {
                
                    if (!this.getAttribute('data-dbname')) return false;
                    
                    handler.fav.getGlobal('fav').coptions.storage = this.getAttribute('data-dbname');
                    handler.fav.save('cfg', function(error) {
                    
                        handler.getStorageList(handler.showStorageList);
                        handler.fav.load('items', function() {					
                                
                            handler.fav.updateFavCounter();
                            handler.fav.resetFilterSettings();
                            handler.showMessage(lng.s('База данных выбрана', 'storage_selected'), false, 'storage');
                        });					
                    });
    
                    return false;
                }
            if (handler.fav.isDownloadSupported) {	
                var downloadButton = KellyTools.getElementByClass(dbItem, handler.className + '-DBItem-download');
                    downloadButton.setAttribute('data-dbname', slist[i]);
                    downloadButton.onclick = function() {
                        var dbName = this.getAttribute('data-dbname');
                        
                        handler.loadDB(dbName, function(db) {
                        
                            if (db === false) {
                                return false;							
                            }
                            
                            var path = handler.fav.getGlobal('env').profile + '/Storage/ExportedDBs/' + dbName + '_' + KellyTools.getTimeStamp() + '.' + handler.format;
                                path = KellyTools.validateFolderPath(path);
                                
                            KellyTools.createAndDownloadFile(JSON.stringify(db), path);	
                        });
                        
                        return false;
                    }
            }    
        }
    
    }
        
    this.showDBManager = function() {
    
        if (!handler.wrap) return;
        if (handler.inUse) return;
        
        handler.wrap.innerHTML = '';
        
        /*
        if (handler.driver == 'localstorage' && !handler.fav.isMainDomain()) {
            
            handler.wrap.innerHTML = '<div>\
                <p>Тип хранения данных ' + handler.driver + ' не поддерживает управление данными с дочерних доменов</p>\
                <p>Перейдите на <a href="http://' + handler.fav.getGlobal('env').mainDomain + '/">основной домен</a> для переключения текущего хранилищя или управления данными\
            </div>';
            
            return;
        }
        */
        
        var overwriteId = handler.className + '-overwrite';
        var html = '\
            <div class="' + handler.className + '-wrap">\
                <table class="' + handler.className + '-options-table">\
                    <tr><td>' + lng.s('Тип хранения данных', 'storage_type') + ' :</td><td>\
                        <select class="' + handler.className + '-driver">\
                            <option value="localstorage" ' + (handler.driver == 'localstorage' ? 'selected' : '') + '>Localstorage</option>\
                            <option value="api" ' + (handler.driver == 'api' ? 'selected' : '') + '>Browser API (testing)</option>\
                        </select>\
                    </td></tr>\
                    <tr><td colspan="2">' + lng.s('', 'storage_type_notice') + '</td></tr>\
                    <tr><td colspan="2"><h3>' + lng.s('Добавить новую базу', 'storage_add_new') + '</h3></td></tr>\
                    <tr><td>' + lng.s('Загрузить из файла', 'storage_load_from_file') + '</td><td><input type="file" id="' + handler.className + '-db-file"></td></tr>\
                    <tr><td>' + lng.s('Идентификатор базы', 'storage_name') + '</td><td><input type="text" id="' + handler.className + '-create-name" placeholder="custom_data"></td></tr>\
                    <tr style="display : none;"><td><label for="' + overwriteId + '-cancel">' + lng.s('Отмена если существует', 'storage_create_cancel_if_exist') + '</label></td>\
                        <td><input type="radio" name="' + overwriteId + '" id="' + overwriteId + '-cancel" value="cancel" checked></td></tr>\
                    <tr style="display : none;"><td><label for="' + overwriteId + '-overwrite">Перезаписать если существует</label></td>\
                        <td><input type="radio" name="' + overwriteId + '" id="' + overwriteId + '-overwrite" value="overwrite" ></td></tr>\
                    <tr style="display : none;"><td><label for="' + overwriteId + '-add">Дополнить если существует</label></td>\
                        <td><input type="radio" name="' + overwriteId + '" id="' + overwriteId + '-add" value="add"></td></tr>\
                    <tr><td colspan="2"><input type="submit" class="' + handler.className + '-create" value="' + lng.s('Создать', 'create') + '"></td></tr>\
                    <tr><td colspan="2"><div class="' + handler.className + '-message"></div></td></tr>\
                    <tr><td colspan="2"><h3>' + lng.s('Управление данными', 'storage_manage') + '</h3></td></tr>\
                    <tr><td colspan="2"><div class="' + handler.className +'-StorageList"></div></td></tr>\
                    <tr><td colspan="2"><div class="' + handler.className + '-message ' + handler.className + '-message-storage"></div></td></tr>\
                    <tr><td colspan="2"><h3>' + lng.s('Удалить базу данных', 'storage_delete') + '</h3></td></tr>\
                    <tr><td>' + lng.s('Идентификатор базы', 'storage_name') + '</td><td><input type="text" id="' + handler.className + '-delete-name" placeholder="custom_data"></td></tr>\
                    <tr><td colspan="2"><input type="submit" class="' + handler.className + '-delete" value="' + lng.s('Удалить', 'delete') + '"></td></tr>\
                    <tr><td colspan="2"><div class="' + handler.className + '-message ' + handler.className + '-message-delete"></div></td></tr>\
                </table>\
            </div>\
        ';
        
        handler.storageContainer = document.createElement('DIV');
        handler.storageContainer.innerHTML = html;
        
        var driver = KellyTools.getElementByClass(handler.storageContainer, handler.className + '-driver');
            driver.onchange = function() {
            
                var newDriver = KellyTools.val(this.options[this.selectedIndex].value);
            
                if (handler.fav.getGlobal('fav').coptions.storageDriver != newDriver) { 
                
                    handler.fav.getGlobal('fav').coptions.storageDriver = newDriver;
                    handler.driver = newDriver;
                    
                    handler.fav.save('cfg', function () {
                    
                        handler.getStorageList(handler.showStorageList);
                        handler.fav.load('items', function() {
                            
                            handler.fav.updateFavCounter();
                        });					
                    });					
                }
            }
        
            
        
        handler.storageList = KellyTools.getElementByClass(handler.storageContainer, handler.className + '-StorageList');			
        
        
        var removeButton = KellyTools.getElementByClass(handler.storageContainer, handler.className + '-delete');
            removeButton.onclick = function() {
                
                if (handler.inUse) return false;
                handler.inUse = true;
                
                var dbName = KellyTools.inputVal(document.getElementById(handler.className + '-delete-name')); 	
                if (!dbName) {
                    handler.showMessage('Введите название базы данных', true, 'delete');
                    return false;
                }
                
                if (handler.slist && handler.slist.indexOf(dbName) == -1) {
                    
                    handler.showMessage('Базы данных не существует', true, 'delete');
                    return false;					
                }
                
                handler.removeDB(dbName, function(error) {
                    
                    handler.showMessage('Данные удалены', true, 'delete');					
                    handler.getStorageList(handler.showStorageList);
                });	
                
                return false;
            };
            
        var createNewButton = KellyTools.getElementByClass(handler.storageContainer, handler.className + '-create');
            createNewButton.onclick = function() {
                
                if (handler.inUse) return false;
                handler.inUse = true;
                
                var dbName = KellyTools.inputVal(document.getElementById(handler.className + '-create-name')); // todo validate by regular	
                if (!dbName) {
                    handler.showMessage(lng.s('Введите название базы данных', 'storage_empty_name'), true);
                    return false;
                }
                
                var overwrite = document.getElementById(overwriteId + '-overwrite').checked ? true : false;
                var add = document.getElementById(overwriteId + '-add').checked ? true : false;
                var cancel = document.getElementById(overwriteId + '-cancel').checked ? true : false;
                
                if (cancel && handler.slist === false) {

                    handler.showMessage(lng.s('Дождитесь загрузки списка баз данных', 'storage_beasy'), true);
                    return false;
                }
                
                // check cached data before ask dispetcher
                if (cancel && handler.slist.indexOf(dbName) != -1) {
                    
                    handler.showMessage(lng.s('База данных уже существует', 'storage_create_already_exist'), true);
                    return false;					
                }
                
                // request if any bd already exist
                handler.loadDB(dbName, function(db) {
                    
                    if (db !== false) {
                        handler.showMessage(lng.s('База данных уже существует', 'storage_create_already_exist'), true);
                        return false;							
                    }
                    
                    var onDBSave =  function(error) {
                    
                        if (!error) {
                            
                            handler.getStorageList(handler.showStorageList);							
                            handler.showMessage(lng.s('База данных добавлена', 'storage_create_ok'));
                            
                        } else {
                        
                            handler.showMessage(lng.s('Ошибка добавления базы данных', 'storage_create_e1'), true);
                        }
                        
                    };
                            
                    // load data from input file
                    
                    var fileInput = document.getElementById(handler.className + '-db-file');
                    if (fileInput.value) {
                    
                        KellyTools.readFile(fileInput, function(input, fileData) {
                                                        
                            var db = KellyTools.parseJSON(fileData.trim());
                            if (db) {
                                db = handler.validateDBItems(db);	
                                handler.saveDB(dbName, db, onDBSave);
                            } else {
                                handler.showMessage(lng.s('Ошибка парсинга структурированных данных', 'storage_create_e2'), true);	
                            }
                            
                        });
                    
                    } else {
                        
                        handler.saveDB(dbName, handler.getDefaultData(), onDBSave);
                    }
                    
                });
                
                return false;
            }
        
        handler.getStorageList(handler.showStorageList);
        
        handler.wrap.appendChild(handler.storageContainer);
    }

    this.mergeDB = function(dbsKeys) {
        
        if (handler.mergeProcess) return;
        if (!dbsKeys || dbsKeys.length <= 1) return;
        
        handler.mergeProcess = {
            dbs : {},
            loaded : 0,
            container : false,
            dbsKeys : dbsKeys,
        }
        
        for (var i=0; i < dbsKeys.length; i++) {
            handler.mergeProcess.dbs[dbsKeys[i]] = -1;
            handler.loadDB(name, function(db) { 
                onLoadDb(db, dbsKeys[i]);	
            });
        }
        
        var onLoadDb = function(db, key) {
            
            var mergeData = handler.mergeProcess;
            
            mergeData.loaded++;
            if (mergeData.loaded != mergeData.dbsKeys.length) return;
            
            mergeData.container = mergeData.dbs[mergeData.dbsKeys[0]];
            
            for (var i=1; i < dbsKeys.length; i++) {
                handler.addDataToDb(mergeData.container, mergeData.dbs[dbsKeys[i]]);
            }			
        }
        
    }

    this.addCategoriesToDb = function(item, newItem) {

    }
   
    this.getCategoryBy = function(db, input, method) {
        
        var index = handler.searchCategoryBy(db, input, method);
        if (index !== false) return db.categories[index];
        
        return {id : -1, name : KellyLoc.s('Удаленная категория', 'removed_cat')};      
    }
    
    this.getCategoryById = function(db, id) {
        
        id = parseInt(id);
                            
        for (var i = 0; i < db.categories.length; i++) {
            if (id == db.categories[i].id) return db.categories[i];
        }  
        
        return {id : -1, name : KellyLoc.s('Удаленная категория', 'removed_cat')};
    }
    
    this.categoryOrder = function(cats, index, up) {
        
        index = parseInt(index);
        
        if (!cats.length) return index;
        
        if (up && index == 0) {
            return index;
        }
        
        if (!up && index == cats.length - 1) {
            return index;
        }
        
        var switchIndex = up ? index - 1 : index + 1;
        var item = cats[index]; 
        
        console.log(switchIndex);
        
        
        console.log(switchIndex);
                
        var switchItem = cats[switchIndex]; 
        var switchOrder = switchItem.order;
        
        switchItem.order = item.order;
        item.order = switchOrder;
        
        cats[index] = switchItem;
        cats[switchIndex] = item;

        return switchIndex;
    }
    
    this.sortCategories = function(cats) {
        
        cats.sort(function(a, b) {
            if (!a.order) {
                a.order = cats.indexOf(a);
            }
            
            if (!b.order) {
                b.order = cats.indexOf(b);
            }
            return b.order - a.order;
        });
        
        for (var i = 0; i < cats.length; i++) {
            cats[i].order = cats.length - i;
        }
    }
    
    // search item by post link
    // item - {link : URL} or {commentLink : URL}
    // 
    
    this.searchItem = function(db, item) {
        
        var link = '';	
        var isComment = false;
        
        if (item.commentLink) {
            link = KellyTools.getRelativeUrl(item.commentLink);
            isComment = true;
        } else {
            link = KellyTools.getRelativeUrl(item.link);
        }
        
        if (!link) return false;
        
        for (var b = 0; b < db.items.length; b++) {
        
            if (isComment && KellyTools.getRelativeUrl(db.items[b].commentLink).indexOf(link) != -1) {
                return b;
            } else if (!isComment && KellyTools.getRelativeUrl(db.items[b].link).indexOf(link) != -1) {
                return b;
            }		
        }
        
        return false;
    }

    this.searchCategoryBy = function(db, input, method) {
        
        if (!method) method = 'name';   
        
        for (var c = 0; c < db.categories.length; c++) {
            if (db.categories[c][method] == input) return c;
        }
        // todo safe in buffer
        return false;
    }
    
    this.categoryCreate = function(db, name, catIsNSFW, order) {
        
        if (!name) return false;
        
        for (var i = 0; i < db.categories.length; i++) {
            if (db.categories[i].name == name) {
               return false;
            }
        }
        
        if (!order) {
            order = db.categories.length;
        }
          
        db.ids++;
        
        var key = db.categories.length;
        
        db.categories[key] = { 
            name : name, 
            id : db.ids, 
            nsfw : catIsNSFW,
            order : order,
        }; 
        

        return db.ids;
    }
    
    this.copyObjectValues = function(from, to) {
        for (var k in from){
            if (typeof from[k] !== 'function') {
                to[k] = from[k];
            }
        }
    }

    /* IN DEV, not tested */
    
    this.addDataToDb = function(db, data) {

        for (var i = 0; i < data.items.length; i++) {
            
            var existIndex = handler.searchItem(db, data.items[i]);
            // todo update categories \ add new item with new id
            
            if (existIndex !== false) {
            
                // db.items[existIndex].categoryId = db.items[existIndex].categoryId.concat(data.items[i].categoryId);
            
            } else {
            
                existIndex = db.items.length;
                
                db.items[existIndex] = {};
                copyObjectValues(data.items[i], db.items[existIndex]);			
                
                db.ids++;
                db.items[existIndex].id = db.ids;
                
                var dataCats = data.items[i].categoryId;
                var actualItemCats = [];
                
                for (var c = 0; c < dataCats.length; c++) {
                
                    var dataCat = data.categories[dataCats[c]];
                    var existCatIndex = handler.searchCategoryBy(db, dataCat.name, 'name');
                    
                    if (existCatIndex !== false) {
                        actualItemCats[actualItemCats.length] = db.categories[existCatIndex].id;
                    } else {
                        existCatIndex = db.categories.length;
                        db.categories[existCatIndex] = {};
                        copyObjectValues(dataCat, db.categories[existCatIndex]);
                        
                        db.ids++;
                        db.categories[existCatIndex].id = db.ids;
                        
                        actualItemCats[actualItemCats.length] = db.categories[existCatIndex].id;
                    }
                }
            }
            
        }
    }
            
    this.getStorageList = function(callback, keepPrefix) {
                
        if (handler.driver == 'localstorage') {
            
            KellyTools.getBrowser().runtime.sendMessage({
                method: "getLocalStorageList", 
                prefix : handler.prefix,
                keepPrefix : keepPrefix,
            }, function(response) {
                if (callback) callback(response.slist);				
            });
            
        } else {
                
            KellyTools.getBrowser().runtime.sendMessage({
                method: "getApiStorageList", 
                prefix : handler.prefix,
                keepPrefix : keepPrefix,
            }, function(response) {
            
                if (callback) callback(response.slist);
            });
            
        }
    }
        
    this.getDBSize = function(name, inBytes, callback) {
    
        name = handler.validateDBName(name);
        
        if (!name) {
            if (callback) callback(name, 0);
            return;
        }
        
        var dbName = handler.getFullDBName(name, cfg);
        
        if (handler.driver == 'localstorage') {
        
            KellyTools.getBrowser().runtime.sendMessage({
                method: "getLocalStorageItem", 
                dbName : dbName,
            }, function(response) {
            
                if (!response.item) bytes = 0;
                
                if (inBytes) {
                    bytes = response.item.length;
                } else {
                    bytes = response.item.length / 1000;
                }	
                
                if (callback) callback(name, bytes);
            });
            
        } else {
            
            KellyTools.getBrowser().runtime.sendMessage({
                method: "getApiStorageItemBytesInUse", 
                dbName : dbName,
            }, function(response) {
            
                if (!response.bytes) response.bytes = 0;
                
                if (!inBytes) {
                    response.bytes = response.bytes / 1000;
                }
            
                if (callback) callback(name, response.bytes);
            });
        }
    }

    this.log = function(text) {
        if (handler.fav && handler.fav.getGlobal('debug')) {
            KellyTools.log(text, 'KellyStorageManager');
        }
    }

    this.getDefaultData = function() {

        return {
            ids : 100,
            categories : [
                {id : 1, name : 'GIF', protect : true, order : -1},
                {id : 2, name : 'NSFW', nsfw : true, protect : true, order : -1},
            ],
            items : [],
            // native_tags : [],
        }
    }

    // todo check links .items.pImage and .link and .commentLink
    this.validateDBItems = function(data) {
        
        var validKeys = ['categories', 'items', 'ids', 'selected_cats_ids', 'meta', 'coptions'];
        
        for (var key in data) {            
            if (typeof data[key] == 'function') {
                handler.log('data key ' + key + ' function is not allowed');
                delete data[key];
            } else if (validKeys.indexOf(key) == -1) {
                handler.log('data key ' + key + ' is not allowed');
                delete data[key];
            }
        }
        
        if (!data.categories) data.categories = [];
        if (!data.items) data.items = [];
        if (!data.ids) data.ids = 100;
        
        for (var i = 0; i < data.items.length; i++) {
            
            if (!data.items[i].categoryId) data.items[i].categoryId = [];
            if (!data.items[i].id) {
                
                data.ids++;
                data.items[i].id = data.ids;
            }
            
            for (var b = 0; b < data.items[i].categoryId.length; b++) {
                data.items[i].categoryId[b] = parseInt(data.items[i].categoryId[b]);
            }
        }       
        
        return data;
    }
    
    this.validateDBName = function(name) {
        if (!name || typeof name != 'string') return '';
        
        name = name.trim();
        
        if (!name) return '';
                
        return name.replace(/[^A-Za-z0-9_]/g, '');
    }

    
    this.getFullDBName = function(name, cfg) {
        
        return (cfg ? handler.prefixCfg : handler.prefix) + name;
        //return (cfg ? handler.prefixCfg : handler.prefix) + handler.fav.getGlobal('env').profile + '_' + name;
    }

    // callback(db)
    
    this.loadDB = function(name, callback, cfg) {
        
        name = handler.validateDBName(name);		
        if (!name) {
            if (callback) callback(false);
            return;
        }
        
        var dbName = handler.getFullDBName(name, cfg);
        
        if (handler.driver == 'localstorage' || cfg) {
        
            KellyTools.getBrowser().runtime.sendMessage({
                method: "getLocalStorageItem", 
                dbName : dbName,
            }, function(response) {
                
                var db = false;
                
                if (response.item) {
                    db = KellyTools.parseJSON(response.item);
                }
                
                if (!db) {
                    handler.log('unexist db key ' + name);
                    db = false;
                }
                
                if (callback) callback(db);
            });
            
            
        } else {
        
            KellyTools.getBrowser().runtime.sendMessage({
                method: "getApiStorageItem", 
                dbName : dbName,
            }, function(response) {

                if (!response.item || response.item === null || !response.item[dbName]) {
                    handler.log('unexist db key ' + name);
                    response.item = false;
                } else {
                    response.item = response.item[dbName];
                }
                // 	handler.copyObjectValues(response.item[dbName], db);
                                
                if (callback) callback(response.item);
                
            });
            
        }
    }
    
    // callback(error)

    this.removeDB = function(name, callback, cfg) {
            
        name = handler.validateDBName(name);
        
        if (!name) {
            if (callback) callback('empty or bad DB name');
            return;
        }
        
        var dbName = handler.getFullDBName(name, cfg);
        
        if (handler.driver == 'localstorage' || cfg) {
        
            KellyTools.getBrowser().runtime.sendMessage({
                method: "removeLocalStorageItem", 
                dbName : dbName,
            }, function(response) {
                
                if (callback) callback(false);
            });
                
        } else {
            
            KellyTools.getBrowser().runtime.sendMessage({
                method: "removeApiStorageItem", 
                dbName : dbName,
            }, function(response) {
                
                if (callback) callback(response.error);
            });			
        }
    } 
    
    // callback(error)
    
    this.saveDB = function(name, data, callback, cfg) {
            
        name = handler.validateDBName(name);
        
        if (!name) {
            if (callback) callback('empty or bad DB name');
            return;
        }
        
        var dbName = handler.getFullDBName(name, cfg);
        
        if (!cfg && handler.fav && handler.fav.getGlobal('env')) {
            
            // all storage data that can be accessed wihout JSON parse
            
            data.meta = '[meta_start]' + handler.fav.getGlobal('env').profile + '|' + KellyTools.getGMTDate() + '[meta_end]';
        }
        
        if (handler.driver == 'localstorage' || cfg) {
        
            // проверить поведение при пороговых значениях (~3-4мб данных)
            // upd. данные не сохраняются. Выполняется вызов исключения. добавлен в обработку ошибок despetcher
            // проверка корректного исполнения save в kellyFavItems не выполняется, добавить
            
            KellyTools.getBrowser().runtime.sendMessage({
                method: "setLocalStorageItem", 
                dbName : dbName,
                data : data,
            }, function(response) {
            
                if (response.error) {
                    handler.log(response.error);
                }
                
                if (callback) callback(response.error ? true : false);
            });
            
        } else {
            
            // при больших объемах данных данные сохраняются корректно (тесты при 40-100мб данных, фрагментация 1-2 мегабайта на одно хранилище)
            
            var save = {};
                save[dbName] = data;
            
            KellyTools.getBrowser().runtime.sendMessage({
                method: "setApiStorageItem", 
                dbName : dbName,
                data : save,
            }, function(response) {
                
                if (callback) callback(response.error);
            });
        }	   
    }
    
    constructor(cfg);
}


//D:\Dropbox\Private\l scripts\jfav\release\Extension\\lib\kellyThreadWork.js



function KellyThreadWork(cfg) {


    var jobs = [];
    var env = false;
    var maxThreads = 1; // эксперименты чреваты баном за спам запросами, пробовать только за впном или если у вас динамический адрес
    var threads = [];
    var iframeC = 0;
    
    var timeout = 15; // таймаут ожидания загрузки страницы в секундах, в обработчик onLoad попадет idocument = false
    var timeoutOnEnd = [2, 2.2, 1.1, 3.4, 4, 3, 3, 3, 4.6]; // таймер перехода к следующей задаче после выполнения - сек. рандомно из массива
    
    // long pause every
    var pauseEvery = [40,30,20];
    var untilPause = getRandom(pauseEvery);
    var pauseTimer = [10,14,20];
    
    var beasy = false;
    var events = { onProcess : false, onEnd : false };
    var handler = this;
    var threadId = 1;
    
    
    function constructor(cfg) {
    
        if (cfg.env) {
            env = cfg.env;
        }        
        
    }
    
    function getRandom(input) {
        return input[Math.floor(Math.random() * ((input.length - 1) + 1))];
    }
    
    this.getJobs = function() {
        return jobs;
    }
    
    this.setEvent = function(name, f) {
        
        events[name] = f;    
    }
    
    this.stop = function(noCleanJobs) {
                    
        for (var i = 0; i < threads.length; i++) {
            
            if (threads[i].request) {
                threads[i].request.abort();
            }
            
            if (threads[i].timeoutTimer) {
                clearTimeout(threads[i].timeoutTimer);
                threads[i].timeoutTimer = false;
            }
        }
        
        threads = [];
        jobs = [];
        console.log('clean job');
    }
        
    // todo add watch dog with timeout for long jobs
    
    this.onJobEnd = function(thread) {

        if (thread.timeoutTimer) {
            clearTimeout(thread.timeoutTimer);
            thread.timeoutTimer = false;
        }
        
        for (var i = 0; i < threads.length; i++) {
            if (threads[i].id == thread.id) {     
                
                threads.splice(i, 1);
        
                if (!thread.response) {
                    // error
                    console.log('job end without load document');
                    console.log(thread);
                }
        
                thread.job.onLoad(handler, thread, jobs.length);
                
                if (events.onProcess) events.onProcess(jobs.length, thread);
                
                if (!jobs.length && !threads.length) {   
                
                    if (events.onEnd) events.onEnd();
                    
                } else {
                    
                    var timeout = getRandom(timeoutOnEnd);
                    
                    if (pauseEvery && pauseEvery.length) {
                        
                        if (untilPause > 0) {
                            untilPause--;
                            console.log('before pause ' + untilPause);
                        } else {
                            untilPause = getRandom(pauseEvery);
                            timeout = getRandom(pauseTimer);
                            
                            console.log('timeout ' + timeout + ' | new pause ' + untilPause);
                            
                        }
                    }
                    
                    // clean timer ?
                    setTimeout(function() {        
                         applayJob();
                    }, timeout * 1000);
                }
                
                break;
            }
        }
    }

    function validateResponse(response) {
    
        if (response.indexOf('<body>') != -1) {
            response = response.replace(/(\r\n\t|\n|\r\t)/gm,"");
            response = response.match(/<body>([\s\S]*?)<\/body>/g); // (.*?)
            if (response && response.length >= 1) {
                response = response[0].replace(/<\/?body>/g,'')
            } else return 0;
            
        } else return 0;
        
        return response;
    }
    
    function applayJob() {
    
        if (threads.length >= maxThreads) return false;
        if (!jobs.length && !threads.length) {            
            if (events.onEnd) events.onEnd();
            return false;
        }
        
        if (!jobs.length) {            
            return false;
        }
        
        threadId++;
        var thread = {       
            job : jobs.pop(),
            response : false,
            request : false,
            id : threadId,
        }   
      
        var request = new XMLHttpRequest();
            request.open('GET', thread.job.url, true);

            request.onload = function() {
              if (this.status == 200) {		  
                thread.response = validateResponse(this.response);
              } else {
                thread.response = 0;
              }
              
              handler.onJobEnd(thread);
            };

            request.onerror = function() {
               thread.response = 0;
               handler.onJobEnd(thread);
            };
            
            request.send();
        
        // may be banned as cross site scripting if protocol or domain differs
        /*	
            var request = getIframe();
                request.src = thread.job.url + '?' + env.getGlobal('env').actionVar + '=sanitize';
        */		
        
        thread.request = request;
        thread.timeoutTimer = setTimeout(function() {        
            handler.onJobEnd(thread);        
        }, timeout * 1000);
        
        threads[threads.length] = thread;
        
        return true;            
    }
    
    this.exec = function() {
    
        if (beasy) return false;
        
        if (!jobs.length) {            
            if (events.onEnd) events.onEnd();
            return false;
        }
        
        for (var i = 1; i <= maxThreads; i++) {
            if (!applayJob()) return false;
        }
      
    }
    
    // data - page \ nik \ etc
    
    this.addJob = function(url, onLoad, data) {
    
        if (typeof onLoad !== 'function') {
            onLoad = false;
        }
            
        var job = {
            url : url,
            onLoad : onLoad,
            data : data,
        };
        
        jobs[jobs.length] = job;
    }
    
    constructor(cfg);
}


//D:\Dropbox\Private\l scripts\jfav\release\Extension\\lib\kellyGrabber.js



// важно создавать объект KellyGrabber в рамках процесса-вкладки с которой будут сохраняться картинки \ данные.
// т.к. при скачивании из фона хром не позволяет установить заголовки "гостевой" вкладки из фонового процесса. Любой сервер потенциально может принять скачивание без должных заголовков за атаку \ бота

// сохранять последний выбор
// скорректировать вывод состояниф для публикаций с несколькими медиа элементами

function KellyGrabber(cfg) {
    
    var handler = this;   
    
    var downloadingIds = []; // ids from chrome API that returned for each download process
  
    // array of current added throw method addDownloadItem download items
    // 
    // Download item object params :
    //     
    // .downloadId > 0     - accepted by API, downloading 
    // .downloadId = DOWNLOADID_GET_PROCESS    - request to API sended, waiting 
    // .downloadId = DOWNLOADID_INACTIVE - inactive 
    //
    // .workedout          - true if element already processed (check .error \ .downloadDelta for result)
    // 
    // .item               - reference to fav.item[n] object
    // .subItem            - index of fav.item.pImage if object has more then one image
    
    downloads = []; 
        
    // .downloadId values constants
    
    var DOWNLOADID_GET_PROCESS = -1;
    var DOWNLOADID_INACTIVE = false;
  
    
    var ids = 0; // counter for downloads
    
    var acceptItems = false;
    
    var events = { 
        onDownloadAllEnd : false, 
        onDownloadFile : false,
        onUpdateState : false,
    };
    
    this.nameTemplate = false;
    
    var style = false;
    var className = 'kellyGrabber-';
    
    var buttons = {};
    
    var options = {	
        nameTemplate : '#category_1#/#filename#', 
        baseFolder : '',
        maxDownloadsAtTime : 2,
        interval : 1,
        cancelTimer : 3 * 60, // not added currently
        quality : 'hd',
        itemsList : '',
        from : 0,
        // to : 0,
    }
    
    var mode = 'wait';
    var eventsEnabled = false;
    
    var extendedOptionsShown = false;
    
    // dom elements
    
    // assigned
      
    this.container = false;
    
    // generated on showGrabManager
    
    this.btnsSection = false;
    var logSection = false;
    var downloadProgress = false;
    
    var fav;
    var log = '';
    var lng = KellyLoc;
    
    var availableItemsIndexes = [];
    
    function constructor(cfg) { 
        handler.updateCfg(cfg);
    }
    
    this.getState = function() {    
        return mode;
    }
    
    this.updateCfg = function(cfg) {
    
        if (cfg) {
            if (cfg.container) handler.container = cfg.container;
        
            if (cfg.events) {
            
                for (var k in events){
                    if (typeof cfg.events[k] == 'function') {
                         events[k] = cfg.events[k];
                    }
                }
            }
            
            for (var k in options) {
                if (typeof cfg[k] != 'undefined') {
                    
                    if (k == 'baseFolder') {
                        handler.setBaseFolder(cfg.baseFolder);
                    } else {
                        options[k] = cfg[k];
                    }
                }
            }
            
            if (cfg.className) {
                className = cfg.className;
            }
            
            
            if (cfg.fav) {
                fav = cfg.fav;
            }
            
            if (cfg.availableItemsIndexes) {
                availableItemsIndexes = cfg.availableItemsIndexes;
            }
            
            if (cfg.shownItems) {
                
                shownItems = cfg.shownItems;
            }
            
            if (cfg.imageClassName) {
                imageClassName = cfg.imageClassName;
            }
        }
    }
    
    this.showGrabManager = function() {
    
        if (!handler.container) return false;
        
        var extendedClass = className + '-controll-extended ' + (extendedOptionsShown ? 'active' : 'hidden'); 
        var extendedShowTitle = {
            show : lng.s('Показать расширенные настройки', 'grabber_show_extended'),
            hide : lng.s('Скрыть расширенные настройки', 'grabber_hide_extended'),
        };
       
        if (!options.baseFolder) {
            handler.setBaseFolder(fav.getGlobal('env').profile + '/Downloads');
        }
       
        handler.container.innerHTML = '\
            <div class="' + className + '-controll">\
                <table>\
                    <tr><td>\
                        <label>' + lng.s('Основная директория', 'grabber_common_folder') + '</label>\
                    </td><td>\
                        <input type="text" placeholder="' + lng.s('Директория', 'folder') + '" class="' + className + '-controll-baseFolder" value="' + options.baseFolder + '">\
                    </td></tr>\
                    <tr><td>\
                        <label>' + lng.s('Элементы', 'grabber_selected_items') + '</label>\
                    </td><td>\
                        <input type="text" placeholder="1-2, 44-823, 1-999..." class="' + className + '-itemsList" value="' + options.itemsList + '">\
                    </td></tr>\
                    <!--tr class="' + className + '-range-tr"><td>\
                        <label>' + lng.s('Диапазон', 'grabber_range') + '</label>\
                    </td><td>\
                        <input type="text" placeholder="С" class="' + className + '-from" value="' + (options.from + 1) + '">\
                        <input type="text" placeholder="По" class="' + className + '-to" value="' + (options.to-1) + '">\
                    </td></tr-->\
                    <tr class="' + className + '-quality-tr"><td colspan="2">\
                        <label><input type="radio" name="' + className + '_image_size[]" value="hd" class="' + className + '-quality" checked>' + lng.s('Оригинал', 'grabber_source') + '</label>\
                        <label><input type="radio" name="' + className + '_image_size[]" value="preview" class="' + className + '-quality">' + lng.s('Превью', 'grabber_preview') + '</label>\
                    </td></tr>\
                    <tr class="' + className + '-extended-show-row"><td colspan="2">\
                        <label><a href="#" class="' + className + '-extended-show">' + extendedShowTitle[extendedOptionsShown ? 'hide' : 'show'] + '</a></label>\
                    </td></tr>\
                    <tr class="' + extendedClass + '"><td>\
                        <label>' + lng.s('Шаблон названия', 'grabber_name_template') + ' (<a href="#" class="' + className + '-nameTemplate-help">' + lng.s('Подсказка', 'tip') + '</a>)</label>\
                    </td><td>\
                        <input type="text" placeholder="" class="' + className + '-nameTemplate" value="' + options.nameTemplate + '">\
                    </td></tr>\
                    <tr class="' + extendedClass + '"><td>\
                        <label>' + lng.s('Количество потоков', 'grabber_threads_num') + '</label>\
                    </td><td>\
                        <input type="text" placeholder="1" class="' + className + '-threads" value="' + options.maxDownloadsAtTime + '">\
                    </td></tr>\
                    <tr class="' + extendedClass + '"><td>\
                        <label>' + lng.s('Интервал загрузки (сек)', 'grabber_interval') + '</label>\
                    </td><td>\
                        <input type="text" placeholder="1" class="' + className + '-interval" value="' + options.interval + '">\
                    </td></tr>\
                    <tr class="' + extendedClass + '"><td>\
                        <label>' + lng.s('Таймаут при долгом выполнении запроса (сек)', 'grabber_timeout') + '</label>\
                    </td><td>\
                        <input type="text" placeholder="1" class="' + className + '-timeout" value="' + options.cancelTimer + '">\
                    </td></tr>\
                    <!--tr><td colspan="2">\
                        <label>' + lng.s('Исключать изображения с низким разрешением', 'grabber_exclude_lowres') + '</label><label><input type="checkbox" class="' + className + '-exclude-low-res" value="1"></label>\
                    </td></tr-->\
                    <tr><td colspan="2"><div class="' + className + '-controll-buttons"></div></td></tr>\
                    <tr><td colspan="2">\
                        <div class="' + className + '-progressbar"><span class="' + className + '-progressbar-line"></span><span class="' + className + '-progressbar-state"></span></div>\
                    </td></tr>\
                    <tr><td colspan="2"><div class="' + className + '-controll-log" style="display : none;"></div></td></tr>\
                </table>\
            </div>\
        ';
            
        var baseFolderInput = KellyTools.getElementByClass(handler.container, className + '-controll-baseFolder');
            baseFolderInput.onchange = function() {
                
                handler.setBaseFolder(this.value);
                
                this.value = options.baseFolder;
                return;
            }        
            
        var itemsList = KellyTools.getElementByClass(handler.container, className + '-itemsList');
            itemsList.onchange = function() {
                
                updateContinue(true);
                return;
            }                    
            
        var nameTemplateHelp = KellyTools.getElementByClass(handler.container, className + '-nameTemplate-help');
            nameTemplateHelp.onclick = function() {
                                
                var envVars = fav.getGlobal('env');
                var tooltip = new KellyTooltip({
                    target : 'screen', 
                    offset : {left : 20, top : -20}, 
                    positionY : 'bottom',
                    positionX : 'left',				
                    ptypeX : 'inside',
                    ptypeY : 'inside',
                   // closeByBody : true,
                    closeButton : true,
                    removeOnClose : true,                    
                    selfClass : envVars.hostClass + ' ' + envVars.className + '-tooltipster-help',
                    classGroup : envVars.className + '-tooltipster',
                });
                   
                var html = lng.s('', 'grabber_name_template_help');
                for (var i = 1; i <= 4; i++) {
                    html += lng.s('', 'grabber_name_template_help_' + i);
                }
                   
                var tcontainer = tooltip.getContent();
                    tcontainer.innerHTML = html;
                
                setTimeout(function() {
                    
                    tooltip.show(true);                    
                    tooltip.updatePosition();
                    tooltip.updateCfg({closeByBody : true});
                    
                }, 100);
                return false;
            }
        
        var nameTemplate = KellyTools.getElementByClass(handler.container, className + '-nameTemplate');
            nameTemplate.onchange = function() {
                
                options.nameTemplate = KellyTools.validateFolderPath(this.value);                
                this.value = options.nameTemplate;
                
                handler.setDownloadTasks();
                return;
            }       
            
            
        var quality = KellyTools.getElementByClass(handler.container, className + '-quality');
            quality.onclick = function() {
                options.quality = this.value == 'hd' ? 'hd' : 'preview';
                handler.setDownloadTasks();
            }
            
        var showExtend = KellyTools.getElementByClass(handler.container, className + '-extended-show');
            showExtend.onclick = function() {
                
                extendedOptionsShown = !extendedOptionsShown;
                
                var extOptions = document.getElementsByClassName(className + '-controll-extended');
                if (extOptions) {
                    for (var i=0; i < extOptions.length; i++) {						
                        if (!extendedOptionsShown) {
                            extOptions[i].className = extOptions[i].className.replace('active', 'hidden');
                        } else {
                            extOptions[i].className = extOptions[i].className.replace('hidden', 'active');
                        }
                    }
                }
                
                this.innerHTML = extendedShowTitle[extendedOptionsShown ? 'hide' : 'show'];
                return false;
            }
        
        var threadsInput = KellyTools.getElementByClass(handler.container, className + '-threads');
            threadsInput.onchange = function() {
                                
                options.maxDownloadsAtTime = parseInt(this.value);
                if (!options.maxDownloadsAtTime || options.maxDownloadsAtTime < 0) options.maxDownloadsAtTime = 1;
                
                this.value = options.maxDownloadsAtTime;
                
                console.log(options.maxDownloadsAtTime);
            }
   
        var intervalInput = KellyTools.getElementByClass(handler.container, className + '-interval');
            intervalInput.onchange = function() {
                                
                options.interval = KellyTools.validateFloatSting(this.value)                
                if (!options.interval || options.interval < 0.1) options.interval = 0.1;
               
                this.value = options.interval;
                 
                console.log(options.interval);
            }
            
        var cancelInput = KellyTools.getElementByClass(handler.container, className + '-timeout');
            cancelInput.onchange = function() {
                                
                options.cancelTimer = KellyTools.validateFloatSting(this.value)                
                if (!options.cancelTimer || options.cancelTimer < 2) options.cancelTimer = 5 * 60;                
                
                this.value = options.cancelTimer;
                
                console.log(options.cancelTimer);
            } 
            
        downloadProgress = {
            line : KellyTools.getElementByClass(handler.container, className + '-progressbar-line'),
            state : KellyTools.getElementByClass(handler.container, className + '-progressbar-state'),
        }
            
        logSection = KellyTools.getElementByClass(handler.container, className + '-controll-log');
    
        handler.btnsSection = KellyTools.getElementByClass(handler.container, className + '-controll-buttons');
        
        // add controll buttons
        
        buttons = {};
        handler.addControllEl('init', ''); 
        
        var continueBtn = handler.addControllEl('continue', lng.s('Продолжить', 'grabber_continue'), function() {
            
            if (mode != 'wait') return false;
            
            options.from = parseInt(this.getAttribute('data-start-from'));            
            handler.download();  
            
            updateContinue(true);            
            return false;
        });  
        
        continueBtn.style.display = 'none';        
        
        handler.addControllEl('save_as_json', lng.s('Скачать файл данных', 'grabber_save_as_json'), function() {
        
            fav.downloadFilteredData();            
            return false;
        }); 

        var logBtn = handler.addControllEl('save_log', lng.s('Скачать лог', 'grabber_save_log'), function() {
        
            downloadLog();            
            return false;
        });   

        logBtn.style.display = 'none';
        
        handler.updateStartButtonState('start');
        updateProgressBar();        
    }
    
    function updateProgressBar() {
        if (!downloadProgress || !downloadProgress.line) return false;
        
        var total = downloads.length;
        if (acceptItems) {
            total = acceptItems.length;
        }
        
        var current = handler.countCurrent('complete');
        if (current > total) {
            toTxtLog('CHECK COUNTER ' + current + ' / ' + total);
            current = total;
        }
        
        downloadProgress.state.innerHTML = current + ' / ' + total;        
        downloadProgress.line.style.width = Math.round(current / (total / 100)) + '%';
    }
    
    function downloadLog() {
    
        var fname = fav.getGlobal('env').profile + '/Storage/Logs/';
            fname += 'download_log_' + KellyTools.getTimeStamp() + '.log';
            fname = KellyTools.validateFolderPath(fname);
            
        KellyTools.createAndDownloadFile(log, fname);
        
    }
    
    function optionsFormDisable(disable) {
        
        var inputs = handler.container.getElementsByTagName('input');
        
        if (!inputs || !inputs.length) return;
        
        for (var i = 0; i < inputs.length; i++) {
            
            inputs[i].disabled = disable;
        }
    }
    
    function showState(state) {
        
        if (!state) state = 'undefined';
        
        var html = '';
        
        if (state == "complete") {
            html += '<div class="' + className + '-item-state ' + className + '-item-state-ok" data-notice="' + lng.s('Загрузка завершена', 'grabber_state_ready') + '"></div>';
        } else if (state == "in_progress") {
            html += '<div class="' + className + '-item-state ' + className + '-item-state-loading" data-notice="' + lng.s('Загрузка...', 'grabber_state_loading') + '" ></div>';
        } else if (state == 'wait') {
            html += '<div class="' + className + '-item-state ' + className + '-item-state-wait" data-notice="' + lng.s('Ожидает в очереди', 'grabber_state_wait') + '"></div>';
        } else if (state == 'error') {
            html += '<div class="' + className + '-item-state ' + className + '-item-state-err" data-notice="' + lng.s('Ошибка загрузки', 'grabber_state_error') + '"></div>'; // todo вывод деталей ошибки, сохраняется в lastError?
        } else if (state == 'skip') {
            html += '<div class="' + className + '-item-state ' + className + '-item-state-skip" data-notice=""></div>'; 
        }  else {
            html += '<div class="' + className + '-item-state ' + className + '-item-state-undefined" data-notice=""></div>';
        }
         
        return html;
    }
    
    function showDownloadItemInfoTooltip(downloadIndex, target) {
    
        if (KellyTools.getElementByClass(document, fav.getGlobal('env').className + '-tooltipster-help')) {
            return;
        }
        
        if (!downloads[downloadIndex]) return;
        
        if (!handler.initDownloadItemFile(downloads[downloadIndex])) return;
        
        var item = downloads[downloadIndex].item;
        var tooltipEl = fav.getTooltip();
            tooltipEl.updateCfg({
                target : target, 
                offset : {left : 0, top : 0}, 
                positionY : 'top',
                positionX : 'right',				
                ptypeX : 'outside',
                ptypeY : 'inside',
            });
            
        var baseClass = fav.getGlobal('env').className + '-tooltipster-ItemInfo';
        
        var itemInfo = document.createElement('div');
            itemInfo.className = baseClass;
            itemInfo.id = baseClass + '-' + downloadIndex;
            itemInfo.innerHTML = lng.s('Сохранить как', 'grabber_save_as') + ' : <br>' + downloads[downloadIndex].filename + '.' + downloads[downloadIndex].ext + '<br><br>' + fav.showItemInfo(item); 		
    
        var tcontainer = tooltipEl.getContent();
            tcontainer.innerHTML = '';
            tcontainer.appendChild(itemInfo);
            
        tooltipEl.show(true);
    }
        
    this.updateStateForImageGrid = function() {
        
        if (events.onUpdateState && events.onUpdateState(handler)) return;
        
        var subItems = {};
        // var gridItems = this.imageGrid.getTiles();
        
        for (var i = 0; i <= downloads.length-1; i++) {
                
            //    console.log(handler.isItemShown(downloads[i].item));
            if (!downloads[i].item) continue;
            
            var downloadItemId = imageClassName + '-' + downloads[i].item.id;
            var N = i+1;
           
            if (downloads[i].subItem !== false) {                
                if (!subItems[downloads[i].item.id]) subItems[downloads[i].item.id] = [];
                subItems[downloads[i].item.id].push(i);                
            }
            
            var itemContainer = document.getElementById(downloadItemId);
            if (!itemContainer) {
                continue;
            }       
            
            // console.log(imageClassName + '-' + downloads[i].item.id);
        
            var holder = KellyTools.getElementByClass(itemContainer, imageClassName + '-download-state-holder');
            
            if (!holder) {
                
                holder = document.createElement('DIV');
                holder.className = imageClassName + '-download-state-holder';
                holder.setAttribute('downloadIndex', i);
                
                var title = '#' + N;
                if (downloads[i].subItem !== false) {
                    title += '-#' + (N + downloads[i].item.pImage.length-1);
                }
                
                holder.innerHTML = '\
                    <div class="' + imageClassName + '-download-number" data-start="' + N + '"><span>' + title + '</span></div>\
                    <div class="' + imageClassName + '-download-status"></div>\
               ';
                
                itemContainer.appendChild(holder);
                                
                /* не проработаны исключения
                var envVars = fav.getGlobal('env');
                
                var tooltipOptions = {
                    offset : {left : 0, top : 0}, 
                    positionY : 'top',
                    positionX : 'right',				
                    ptypeX : 'outside',
                    ptypeY : 'inside',
                    closeButton : false,

                    selfClass : envVars.hostClass + ' ' + envVars.className + '-ItemTip-tooltipster',
                    classGroup : envVars.className + '-tooltipster',
                    removeOnClose : true,
                };
                
                KellyTooltip.addTipToEl(holder, function(el, e){
                
                    return showDownloadItemInfoTooltip(el.getAttribute('downloadIndex'));
                
                }, tooltipOptions, 100);       
                */
                holder.onmouseover = function(e) {                
                    
                    var itemIndex = this.getAttribute('downloadIndex');
                    showDownloadItemInfoTooltip(this.getAttribute('downloadIndex'), this);
                }  
                    
                holder.onmouseout = function(e) {    
                    
                    var related = e.toElement || e.relatedTarget;
                    if (fav.getTooltip().isChild(related)) return;
                        
                    fav.getTooltip().show(false);
                }  
                                
            } 
            
            var statusPlaceholder = KellyTools.getElementByClass(holder, imageClassName + '-download-status');
            
            // update state by last item in collection

            if (downloads[i].subItem === false || downloads[i].subItem == downloads[i].item.pImage.length-1) {
                
                var html = '';
                
                if (downloads[i].subItem === false) {
                    
                    html = showState(getDownloadItemState(downloads[i]));
                } else {
                    
                    // console.log(subItems[downloads[i].item.id]);
                    var subItemsStat = {
                        wait : 0,
                        complete : 0,
                        in_progress : 0,
                        error : 0,
                        skip : 0,
                    }
                    
                    for (var b = 0; b < subItems[downloads[i].item.id].length; b++) {    
                        var subItemState = getDownloadItemState(downloads[subItems[downloads[i].item.id][b]]);
                        subItemsStat[subItemState]++;                        
                        
                        if ( subItemsStat[subItemState] == subItems[downloads[i].item.id].length ) {
                             html = showState(subItemState);
                        }
                    }
                    
                    if (!html) html = showState('in_progress');
                }
            
                statusPlaceholder.innerHTML = html;
            }
        }
        
        setTimeout(function() {
            
            var textNodes = document.getElementsByClassName(imageClassName + '-download-number');
            for (var i = 0; i < textNodes.length; i++) {
                var textNode = KellyTools.getElementByTag(textNodes[i], 'span');                
                KellyTools.fitText(textNodes[i], textNode);
            }
            
        }, 100);
    }  
    
    function getDownloadItemState(ditem) {
        
        if (!ditem.item) return 'skip';
        
        var itemIndex = downloads.indexOf(ditem);        
        if (itemIndex == -1) return 'skip';
        
        if (acceptItems && acceptItems.indexOf(itemIndex+1) == -1) return 'skip';
        
        if (ditem.downloadDelta) {
            
            return 'complete';
            
        } else if (ditem.error) {
                             
            return 'error';
            
        } else if (ditem.canceling) {
            
            return 'canceling';
            
        } else if ((ditem.blobRequest) || (ditem.downloadId && ditem.downloadId > 0)) {
            
           return 'in_progress';
            
        } else {
            
           return 'wait'; // inlist \ wait 
        }
    }
    
    function assignEvents() {
    
        if (eventsEnabled) return;
        
        // sometimes runtime may be undefined after debug breakpoints
        // https://stackoverflow.com/questions/44234623/why-is-chrome-runtime-undefined-in-the-content-script
        
        KellyTools.getBrowser().runtime.sendMessage({method: "onChanged.keepAliveListener"}, function(response) {});
                
        KellyTools.getBrowser().runtime.onMessage.addListener(
            function(request, sender, sendResponse) {

            if (request.method == "onChanged") {       
                
                handler.onDownloadProcessChanged(request.downloadDelta);                
            }
        });  
        
        eventsEnabled = true;
    
    }
    
    this.onDownloadProcessChanged = function(downloadDelta) {
        
        if (mode != 'download') return;
        
        // console.log('incoming ' + downloadDelta.id);
        // its not our item, exit
        if (downloadingIds.indexOf(downloadDelta.id) === -1) {
            console.log('download id not found, skip ' + downloadDelta.id);
            return false;
        }
        
        var waitingNum = handler.countCurrent('wait');
            
        if (downloadDelta.state) {
        
            if (downloadDelta.state.current != "in_progress") {
                
                // console.log(downloadDelta);
                downloadingIds.splice(downloadingIds.indexOf(downloadDelta.id), 1);
            
                var downloadIndex = handler.getDownloadById(downloadDelta.id);
                if (downloadIndex === false) {
                
                    console.log('item by download id not found in common stack');
                    console.log(downloadDelta);
                    
                    return false;
                }
                
                var downloadItem = downloads[downloadIndex];
                   
                if (downloadItem.cancelTimer) {
                    clearTimeout(downloadItem.cancelTimer);
                    downloadItem.cancelTimer = false;
                }
                 
                downloadItem.downloadDelta = downloadDelta;
                downloadItem.workedout = true;
                
                if (events.onDownloadFile) {
                    // downloadDelta.id, filename, totalBytes
                    events.onDownloadFile(handler, downloadItem);                    
                }

                if (waitingNum) {
                
                    setTimeout(function() {                        
                        handler.addDownloadWork();
                    }, options.interval * 1000);
                }
               
                updateProgressBar();
               
            } else {
                
                // console.log(downloadDelta);
                // console.log(downloadDelta.url + 'download process ' + downloadDelta.fileSize);
            } 
            
            // check if that was last current active work, bring back start button
            if (!waitingNum && !handler.countCurrent('in_progress')) {
                                
                if (events.onDownloadAllEnd) {
                    events.onDownloadAllEnd(handler);
                }
                                    
                handler.updateStartButtonState('start');
                updateContinue(true);
            }
        }
        
        console.log('current in progress ' + handler.countCurrent('in_progress') + ' | wait ' + waitingNum)
        
        handler.updateStateForImageGrid();
    }
    
    this.getControllEl = function(key) {
        return buttons[key] ? buttons[key] : false;
    }
    
    this.addControllEl = function(key, name, onClick, type) {
        
        if (buttons[key]) return false;
        
        if (!handler.btnsSection) return false;
        
        var btn =  document.createElement(type ? type : 'A');        
            btn.className = className + '-button ' + className + '-button-' + key;
            btn.href = "#";
            btn.innerHTML = name;
            
        if (onClick) btn.onclick = onClick;
            
        handler.btnsSection.appendChild(btn);
        
        buttons[key] = btn;
        return btn;
    }
    
    this.closeGrabManager = function() {
 
        if (!handler.container) return false;
        
        handler.cancelDownloads(function() {               
            buttons = {};
            handler.container.innerHTML = ''; 
            downloads = [];
        });
                 
    }
    
    function getNameTemplate() {
        
        if (!options.nameTemplate) {
            options.nameTemplate = '#category_1#/#id#_#category_1#_#category_2#_#category_3#';
        }
        
        return options.nameTemplate;
    }
    
    this.initDownloadItemFile = function(ditem) {
        
        if (ditem.filename !== false) {
            return ditem;
        }
        
        var item = ditem.item;
        
        if (typeof item.pImage !== 'string') {                           
            ditem.url = fav.getGlobal('env').getImageDownloadLink(item.pImage[ditem.subItem], options.quality == 'hd');            
        } else {        
            ditem.url = fav.getGlobal('env').getImageDownloadLink(item.pImage, options.quality == 'hd');
        }        
               
        if (!ditem.url || ditem.url.length < 6) {
            
            return false;
            
        } else {
            
            ditem.ext = KellyTools.getExt(ditem.url);
            
            if (!ditem.ext) {            
                 return false;
            }
        }
                
        var fileName = getNameTemplate();       
        if (item.categoryId) {            
        
            var categories = fav.getGlobal('fav').categories;
            var sm = fav.getStorageManager();
                sm.sortCategories(categories);
               
            var itemCatN = 0;
              
            for (var i = 0; i < categories.length; i++) {            
                if (item.categoryId.indexOf(categories[i].id) != -1) {
                    itemCatN++;
                    // console.log('#category_' + itemCatN + '#' + ' - replace - ' + favItems.categories[i].name);
                    fileName = KellyTools.replaceAll(fileName, '#category_' + itemCatN + '#', categories[i].name);
                }                
            }            
        }        
        
        if (item.name) {
            fileName = KellyTools.replaceAll(fileName, '#name#', item.name);
        } else {
            fileName = KellyTools.replaceAll(fileName, '#name#', '');
        }
        
        if (item.id) {
            fileName = KellyTools.replaceAll(fileName, '#id#', item.id);
        } else {
            fileName = KellyTools.replaceAll(fileName, '#id#', '');
        }    
        
        var originalName = false;
        
        if (fileName.indexOf('#filename#') != -1) {
            
            var fullSize = options.quality == 'hd';     
            originalName = true;
            
            var fileUrlName = KellyTools.getUrlFileName(ditem.url, true);
            
            if (!fileUrlName) {
                
                console.log('cant find filename for ' + item.id);
                console.log(item);
                console.log(getNameTemplate());
                
                return false;
            }
            
            fileName = KellyTools.replaceAll(fileName, '#filename#', fileUrlName);
        }
        
        if (fileName.indexOf('#number#') != -1) {
            
            fileName = KellyTools.replaceAll(fileName, '#number#', downloads.indexOf(ditem) + 1); 
        }
        
        fileName = KellyTools.replaceAll(fileName, /#category_[1-9]+#/, '');        
        fileName = KellyTools.validateFolderPath(fileName);
        
        if (!fileName) return false;
        
        if (!originalName && ditem.subItem > 0) {
            fileName += '_' + ditem.subItem;
        }
        
        ditem.filename = fileName;
        
        return ditem;
    }
    
    // переинициализировать список задач
    
    this.setDownloadTasks = function(indexes) {
        
        if (handler.getState() == 'download') {
            return;            
        }
        
        handler.clearDownloads();
        
        if (indexes) {
            availableItemsIndexes = indexes;
        }
        
        var items = fav.getGlobal('fav').items;
            
        for (var i = 0; i < availableItemsIndexes.length; i++) {
        
            var item = items[availableItemsIndexes[i]]
            if (!item.pImage) continue; 
            
            if (typeof item.pImage !== 'string') {
            
                for (var b = 0; b <= item.pImage.length-1; b++) {
                    handler.addDownloadItem(item, b);
                }
                
            } else {
            
                handler.addDownloadItem(item);
            }
        }  
                
        updateProgressBar(); 
        //KellyTools.createAndDownloadFile('test', 'test.txt');
    }
    
    this.setBaseFolder = function(folder) {
    
        var tmpFolder = KellyTools.validateFolderPath(folder);
        if (tmpFolder) {
            options.baseFolder = tmpFolder;
        }
        
        return options.baseFolder;
    }
    
   
    this.getDownloads = function() {
    
        return downloads;
    }
    
    this.clearDownloads = function() {
        downloads = [];
        downloadingIds = [];
        acceptItems = false;
    }
    
    this.updateStartButtonState = function(state) {

        if (state == 'start') {
            
            optionsFormDisable(false);
            mode = 'wait';
            buttons['init'].innerHTML = lng.s('Начать выгрузку', 'grabber_start');
            buttons['init'].onclick = function() { 
                options.from = 0;
                handler.resetStates(false);
                handler.download();                
                return false;
            }
        
        } else {
            
            
            optionsFormDisable(true);
            mode = 'download';
            buttons['init'].innerHTML = lng.s('Остановить загрузку', 'grabber_stop');
            buttons['init'].onclick = function() {
                handler.cancelDownloads();
                return false;
            }       
        }
      
        if (log &&  buttons['save_log']) {
             buttons['save_log'].style.display = 'block';
        }       
    }
    
    function updateContinue(hide) {
        
        if (!buttons['continue']) return;
        
        if (hide) {
            buttons['continue'].style.display = 'none';
            return;
        }
        
        var lastReadyIndex = 0;
        for (var i = options.from; i <= downloads.length-1; i++) {
            var state = getDownloadItemState(downloads[i]);            
            if (state != 'complete' && state != 'skip') {
                break;
            } else {               
               lastReadyIndex = i;
            }
        }
        
        if (lastReadyIndex) {
            buttons['continue'].setAttribute('data-start-from', lastReadyIndex);            
            buttons['continue'].style.display = 'block';
        } else {
            buttons['continue'].style.display = 'none';
        }
    }
    
    this.cancelDownloads = function(onCancel) {    
        
        if (!downloads.length) return;
        
        if ( buttons['init'] ) {
             buttons['init'].innerHTML = lng.s('Остановка...', 'grabber_canceling');        
        }
        
        mode = 'cancel';
        
        // that shold call from event OnStateChanged
                
        var untilStop = 0;      
 
        var checkAllCanceled = function() {            
            
            if (untilStop <= 0) {
                updateContinue();

                handler.resetStates(true);
                handler.updateStartButtonState('start');
                
                if (onCancel) onCancel();
            }
        }
        
        var cancelDownloadItem = function(downloadItem) {
            
            downloadItem.canceling = true;
            
            KellyTools.getBrowser().runtime.sendMessage({method: "downloads.cancel", downloadId : downloadItem.downloadId}, function(response) {
                
                untilStop--;
                
                resetItem(downloadItem);                
                checkAllCanceled();
            });    
        }
        
        for (var i=0; i < downloads.length; i++) {
            
            if (getDownloadItemState(downloads[i]) == 'in_progress') {
                                
                if (downloads[i].blobRequest) {                
                    downloads[i].blobRequest.abort();  
                    downloads[i].blobRequest = false;
                }
            
                if (downloads[i].cancelTimer) {
                    clearTimeout(downloads[i].cancelTimer);
                    downloads[i].cancelTimer = false;
                }
                
                if (downloads[i].downloadId && downloads[i].downloadId > 0) {
                    untilStop++;
                    cancelDownloadItem(downloads[i]);         
                }
            } 
        }
                      
        checkAllCanceled();    
    }
    
    this.addDownloadItem = function(item, subItem) {
        
        if (!item) return false;
        
        ids++;

        if (item && typeof item.pImage !== 'string') {
            subItem = subItem <= item.pImage.length-1 ? subItem : 0;
        } else subItem = false;
            
        
        downloads.push({
            
            id : ids, 
            filename : false, 
            url : false, 
            conflictAction : 'overwrite', 
            ext : false,
            
            downloadId : false,
            
            item : item,
            subItem : subItem, 
        });    
    }
    
    this.getDownloadById = function(id) {
                
        for (var i=0; i <= downloads.length-1; ++i) {
            if (downloads[i].downloadId === id) {
                return i;
            }
        }
        
        return false;
    }
        
    this.downloadUrl = function(isBlobData, downloadOptions, onDownload) {
        
        if (!downloadOptions) return false;
        if (!downloadOptions.url) return false;
        if (!downloadOptions.filename) return false;
        
        if (!onDownload) {
            // some browser require default response function for API
            onDownload = function(response) {};
        }
        
        downloadOptions.url = isBlobData ? URL.createObjectURL(downloadOptions.url) : url;         
        KellyTools.getBrowser().runtime.sendMessage({method: "downloads.download", blob : isBlobData, download : downloadOptions}, onDownload);             
        
        return true;
    }
    
    function toTxtLog(str) {
    
        log += '[' + KellyTools.getTime() + '] ' + str + "\r\n";
    }
    
    // download file by request as blob data. GET | ASYNC
    // callback(url, data (false on fail), errorCode, errorNotice);
    
    this.createBlobFromUrl = function(urlOrig, callback) {
    
        var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';

            xhr.onload = function(e) {
                if (this.status == 200) {
                    callback(urlOrig, this.response);
                } else {
                    callback(urlOrig, false, this.status, this.statusText);
                }
            };

            xhr.onerror = function(e) {
                callback(urlOrig, false, -1, 'domain mismatch ? check Access-Control-Allow-Origin header');
            };

            xhr.open('get', urlOrig, true);
            xhr.send();  
        
        return xhr;
    }
    
    this.downloadByXMLHTTPRequest = function(download) {
    
        // design from https://stackoverflow.com/questions/20579112/send-referrer-header-with-chrome-downloads-api
        // key is to save original headers
    
        var baseFileFolder = options.baseFolder;        
        if (!baseFileFolder) baseFileFolder = '';
        
        baseFileFolder += '/';
        
        var pImageUrl = '';
        if (typeof download.item.pImage == 'string') {
            pImageUrl = download.item.pImage;
        } else {
            pImageUrl = download.item.pImage[download.item.subItem];
        }
        
        if (!handler.initDownloadItemFile(download)) return false;
                
        var downloadOptions = {
            filename : baseFileFolder + download.filename + '.' + download.ext, 
            conflictAction : download.conflictAction,
            method : 'GET',
        }
        
        toTxtLog('download : ' + downloadOptions.filename);
        
        var onDownloadApiStart = function(response){
                
            if (!response.downloadId || response.downloadId < 0) {
                
                toTxtLog('download REJECTED by browser API : ' + downloadOptions.filename);
                toTxtLog('error : ' + response.error + "\n\r");
                
                download.workedout = true;
                download.downloadId = DOWNLOADID_INACTIVE;
                download.error = response.error;
                
            } else {            
                                
                toTxtLog('download ACCEPTED by browser API : ' + downloadOptions.filename);
                
                if (mode != 'download') { // perhapse promise was sended after cancel ?
                
                    // download not needed
                    toTxtLog('downloading start, but user CANCEL downloading process. SEND REJECT TO API for file : ' + downloadOptions.filename);
                     
                    KellyTools.getBrowser().runtime.sendMessage({method: "downloads.cancel", downloadId : response.downloadId}, function(response) {
                    
                    });
                    return false;
                }
                    
                downloadingIds.push(response.downloadId);                
                console.log('new downloading process ' + response.downloadId + ' for file ' + download.id);
                
                download.downloadId = response.downloadId;                    
                handler.updateStateForImageGrid();
            }			
        }
                
        var onLoadFileAsBlob = function(url, blobData, errorCode, errorNotice) {
            
            if (mode != 'download') return false;
            
            download.blobRequest = false;
            
            if (!blobData) {
            
                // try again, but use default Browser API shitty method (headers from original domain will be fucked up)
                // newer catch this scenario throw, so may be this dont needed
                
                toTxtLog('file NOT LOADED as BLOB ' + download.url + ', attempt to download by download api without blob - BAD HEADERS : ' + downloadOptions.filename);
                toTxtLog('LOAD FAIL NOTICE error code ' + errorCode + ', message : ' + errorNotice);
                
                downloadOptions.url = download.url;
                handler.downloadUrl(false, downloadOptions, onDownloadApiStart);
                
            } else {
                
                toTxtLog('file LOADED as BLOB ' + download.url + ', send to browser API for save to folder : ' + downloadOptions.filename);
                downloadOptions.url = blobData;     

                handler.downloadUrl(true, downloadOptions, onDownloadApiStart);
            }
        }
        
        download.blobRequest = handler.createBlobFromUrl(download.url, onLoadFileAsBlob);
        
        return true;
    }
       
    // count elements
    // type = 'complete' - count ready downloaded items
    // type = 'wait'  - count in order to download items (elements at work not included)
    
    this.countCurrent = function(type) {
        
        if (!type) {
            type = 'wait';
        } 
        
        var count = 0;
        
        for (var i = 0; i <= downloads.length-1; ++i) { 
        
            if (getDownloadItemState(downloads[i]) != type) continue;
            count++;            
        }
        
        return count;
    }
    
    this.addDownloadWork = function() {
        
        if (mode != 'download') return false;
        
        var currentWork = handler.countCurrent('in_progress');        
        if (currentWork >= options.maxDownloadsAtTime) return false;
        
        var newWorkNum = options.maxDownloadsAtTime - currentWork; 
        var searchWorkErrorsLimit = 20;
        
        var addCancelTimer = function(downloadItem) {
            
            downloadItem.cancelTimer = setTimeout(function() {
                
                if (!downloadItem) return;
                
                resetItem(downloadItem);
                
                downloadItem.cancelTimer = false;            
                downloadItem.error = 'Canceled by timeout';	
                downloadItem.canceling = true;
                
                if (downloadItem.downloadId > 0) {                    
                    KellyTools.getBrowser().runtime.sendMessage({method: "downloads.cancel", downloadId : downloadItem.downloadId}, function(response) {   
                        downloadItem.canceling = false;	
                        downloadItem.workedout = true;                        
                    });                
                }
                
                toTxtLog('CANCELED BY TIMEOUT ' + downloadItem.url + ', ' + downloadItem.filename);
                
            }, options.cancelTimer * 1000);
        }
        
        for (var i = options.from; i <= downloads.length - 1; i++) {
            
            if (getDownloadItemState(downloads[i]) != 'wait') continue;
            
            var downloadItem = downloads[i];
            
            downloadItem.downloadId = DOWNLOADID_GET_PROCESS;
            downloadItem.workedout = false;
                       
            if (handler.downloadByXMLHTTPRequest(downloads[i])) {
                
                if (options.cancelTimer) {
                    addCancelTimer(downloadItem);
                }
                
                newWorkNum--;
            } else {
                
                // bad name template \ url \ extension - common for corrupted data
                toTxtLog('CAND INIT Download item FILENAME for N ' +  i);
                
                try {
                    
                     toTxtLog('download item dump ' + JSON.stringify(downloads[i].item));
                    
                } catch (E) {
                    
                }
                
                resetItem(downloadItem);
                downloadItem.workedout = true;
                downloadItem.error = 'Initialize download data error';
                
                searchWorkErrorsLimit--;
                if (searchWorkErrorsLimit <= 0) break;
            }
                        
            if (newWorkNum <= 0) break;
        }               
    }
    
    function resetItem(downloadItem) {
        
        downloadItem.workedout = false;
        downloadItem.canceling = false;
        
        if (downloadItem.error) downloadItem.error = false;			
        if (downloadItem.downloadDelta) downloadItem.downloadDelta = false;
        
        downloadItem.downloadId = DOWNLOADID_INACTIVE; 
        downloadItem.url = false;
        downloadItem.filename = false;
    }
    
    this.resetStates = function(keepReady) {
        
        if (!downloads.length) return false;
        
        for (var i=0; i <= downloads.length-1; ++i) {
            
            if (keepReady && getDownloadItemState(downloads[i]) == 'complete') {
                continue;
            } 
            
            resetItem(downloads[i]);
        }
        
    }
    
    this.download = function() {
        
        log = '';
        
        if (mode != 'wait') return false;
        
        if (!downloads.length) {
            console.log('work empty');
            return false;
        }
        
        acceptItems = false;
        var itemsListInput = KellyTools.getElementByClass(handler.container, className + '-itemsList');
        
        if (itemsListInput && itemsListInput.value) {
           acceptItems = KellyTools.getPrintValues(itemsListInput.value, false, 1, downloads.length);
           if (!acceptItems.length) {
                acceptItems = false;
           }
           
           console.log(acceptItems);
        }
        
        if (options.from <= 0) {
            options.from = 0;   
        } else if (options.from > downloads.length-1) {
            options.from = downloads.length-1;            
        }
                
        if (!options.interval) options.interval = 0.1;
               
        /*
        options.from = KellyTools.inputVal(className + '-from', 'int', handler.container) - 1;
        options.to = KellyTools.inputVal(className + '-to', 'int', handler.container) - 1;
       
        
        
        if (options.to <= 0 || options.to > downloads.length-1) {
            options.to = downloads.length-1;            
        }
        
        if (options.from > options.to) {
            options.from = 0;            
        }
        */
        
        assignEvents();
        
        handler.updateStartButtonState('stop');  
        
        handler.resetStates(true);
        handler.updateStateForImageGrid();
        
        handler.addDownloadWork();
        
        if (!handler.countCurrent('in_progress')) {
            
            mode = 'wait';
            handler.updateStartButtonState('start');            
            KellyTools.getBrowser().runtime.sendMessage({method: "onChanged.keepAliveListener"}, function(response) {});                
        }
        
        updateProgressBar();
        log = 'Start download process...' + "\r\n";
        console.log(options);
        
        return true;
    }
    
 
    constructor(cfg);
}



//D:\Dropbox\Private\l scripts\jfav\release\Extension\\lib\kellyTools.js



KellyTools = new Object();

// Get screen width \ height

KellyTools.getViewport = function() {

    var elem = (document.compatMode === "CSS1Compat") ? 
        document.documentElement :
        document.body;

    var height = elem.clientHeight;
    var width = elem.clientWidth;	

    return {
        scrollBottom: KellyTools.getScrollTop() + height, // scroll + viewport height
        screenHeight: height,
        screenWidth: width,
    };
}

KellyTools.replaceAll = function(str, search, replacement) {
    return str.split(search).join(replacement);
}

KellyTools.getScrollTop = function() {

    var scrollTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
    return scrollTop;
}

KellyTools.getScrollLeft = function() {

    var scrollLeft = (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0);
    return scrollLeft;
}

// validate input string

KellyTools.val = function(value, type) {
    
    value = value.trim();
    
    if (!type) type = 'string';
    
    if (type == 'string') {
        if (!value) return '';
        return value.substring(0, 255);
    } else if (type == 'int') {
        if (!value) return 0;
        return parseInt(value);
    } else if (type == 'float') {
        if (!value) return 0.0;
        return parseFloat(value);
    } else if (type == 'bool') {
        return value ? true : false;
    } else if (type == 'longtext') {
        if (!value) return '';
        return value.substring(0, 65400);
    }
}

KellyTools.inputVal = function(el, type, parent) {
    
    var value = ''; 
    
    if (typeof el == 'string') {
        if (!parent) parent = document;
        el = KellyTools.getElementByClass(parent, el);
    }
    
    if (el) value = el.value;    
    return KellyTools.val(value, type);
}

KellyTools.fitText = function(parent, textEl, noExtHeight) {
    
    var bounds = textEl.getBoundingClientRect();
    var parentBounds = parent.getBoundingClientRect();

    if (parentBounds.width >= bounds.width && parentBounds.height >= bounds.height) {
        return;
    }    
      
    var textStyle = window.getComputedStyle(textEl);
    var defaultFontSize = parseInt(textStyle.fontSize);
    var fontSize = defaultFontSize;
    
    if (!fontSize) return;
    
    while (fontSize > 10 && (parentBounds.width < bounds.width || parentBounds.height < bounds.height)) {
        fontSize--;        
        textEl.style.fontSize = fontSize + 'px'; 
        bounds = textEl.getBoundingClientRect();        
    }   
    
    if (!noExtHeight && parentBounds.height < bounds.height) {
        
        var defaultLineHeight = parseInt(textStyle.lineHeight);
        var redusedLineHeight = Math.round((defaultLineHeight / 100) * 66);
        
        parent.style.height = Math.round(bounds.height) + 'px';
        parent.style.lineHeight = redusedLineHeight + 'px';
    }
}

KellyTools.getChildByTag = function(el, tag) {
    if (!el) return false;
    
    var childNodes = el.getElementsByTagName(tag);
    
    if (!childNodes || !childNodes.length) return false;
    
    return childNodes[0];
}

KellyTools.getElementByTag = function (el, tag) {
    return KellyTools.getChildByTag(el, tag);
}

KellyTools.getParentByTag = function(el, tagName) {
    var parent = el;
    if (!tagName) return false;
    
    tagName = tagName.toLowerCase();
    
    while (parent && parent.tagName.toLowerCase() != tagName) {
        parent = parent.parentElement;
    }  
    
    return parent;
}

KellyTools.getUrlFileName = function(url, excludeExt) {
    if (!url) return '';
    
    url = url.split("?");
    url = url[0];
    
    if (!url) return '';
    
    url = url.substring(url.lastIndexOf('/')+1);    
    
    if (url.indexOf('%') != -1) {
        url = decodeURIComponent(url);
    } 
    
    if (excludeExt && url.indexOf('.') != -1) {       
        url = url.substr(0, url.indexOf('.'));
    }
    
    return url;
}

KellyTools.getUrlExtension = function(url) {
             
    url = url.split("?");
    url = url[0];

    var ext = url.substr(url.length - 5).split(".");
    if (ext.length < 2) return '';

    ext = ext[1];
    return ext;        
}
    
// unused end

KellyTools.getUrlParam = function(param, url) {
    if (!url) url = location.search;
    
    var paramIndex = url.indexOf(param + "=");
    var paramValue = '';
    if (paramIndex != -1) {
        paramValue = url.substr(paramIndex).split('=');
        if (paramValue.length >= 2) {
            paramValue = paramValue[1].split('&')[0];
        }
    }
    
    return paramValue.trim();
}

// turn this - '2, 4, 66-99, 44, 78, 8-9, 29-77' to an array of all values [2, 4, 66, 67, 68 ... etc] in range

KellyTools.getPrintValues = function(print, reverse, limitFrom, limitTo) {

    var itemsToSelect = [];
    var options = print.split(',');
    
    for (var i = 0; i < options.length; i++) {

        var option = options[i].trim().split('-');
        if (!option.length || !option[0]) continue;
        if (option.length <= 1) option[1] = -1;
        

        option[0] = parseInt(option[0]);
        if (!option[0]) option[0] = 0;
        
        if (option[1]) {
            option[1] = parseInt(option[1]);
            if (!option[1]) option[1] = option[0];
        }

        if (option[0] == option[1]) option[1] = -1;

        if (option[1] !== -1) {

            if (option[1] < option[0]) {
                var switchOp = option[0];
                option[0] = option[1];
                option[1] = switchOp;
            }

            for (var b = option[0]; b <= option[1]; b++) {
                if (typeof limitTo != 'undefined' && b > limitTo) continue;
                if (typeof limitFrom != 'undefined' && b < limitFrom) continue;
                if (itemsToSelect.indexOf(b) == -1) itemsToSelect[itemsToSelect.length] = b;
            }

        } else {
            if (typeof limitTo != 'undefined' && option[0] > limitTo) continue; 
            if (typeof limitFrom != 'undefined' && option[0] < limitFrom) continue;            
            if (itemsToSelect.indexOf(option[0]) == -1) itemsToSelect[itemsToSelect.length] = option[0];
        }

    }
    
    if (!reverse) {
        itemsToSelect.sort(function(a, b) {
          return a - b;
        });
    } else {
        itemsToSelect.sort(function(a, b) {
          return b - a;
        });
    }
    
    return itemsToSelect;
}


KellyTools.getVarList = function(str) {
    str = str.trim();
    
    if (!str) return [];
    
    str = str.split(",");
    
    for (var i=0; i <= str.length-1; i++) {
        var tmp = str[i].trim();
        if (tmp) str[i] = tmp;
    }
    
    return str;
}
    
KellyTools.varListToStr = function(varlist) {
    if (!varlist || !varlist.length) return '';
    var str = '';        
    for (var i=0; i <= varlist.length-1; i++) {
    
        if (!varlist[i]) continue;
    
        if (str) str += ',' + varlist[i];
        else str = varlist[i];
    }
    
    return str;
}
    
KellyTools.parseTagsList = function(text) {
    var text = text.split(','); 
    
    var tagList = {
        exclude : [],
        include : [],
    }
        
    for (var i = 0; i < text.length; i++) {
        var tagName = text[i].trim();        
        
        var exclude = false;
        if (tagName.charAt(0) == '-') {
            exclude = true;
        }
        
        if (tagName.charAt(0) == '-' || tagName.charAt(0) == '+') {
            tagName = tagName.substr(1);
        } 
        
        if (!tagName) {
            continue;
        }
        
        if (exclude) {
            tagList.exclude[tagList.exclude.length] = tagName;
        } else {
            tagList.include[tagList.include.length] = tagName;
        }
    }
    
    var getUniq = function(arr) {
            
        var uniq = [];

        for (var i=0; i < arr.length; i++) {
            if (uniq.indexOf(arr[i]) == -1) {
                uniq.push(arr[i]);
            }
        }
        
        return uniq;
    }
    
    if (tagList.exclude.length > 1) {
        tagList.exclude = getUniq(tagList.exclude);
    }
    
    if (tagList.include.length > 1) {
        tagList.include = getUniq(tagList.include);
    }
    
    if (!tagList.exclude.length && !tagList.include.length) return false;
    
    return tagList;
}

KellyTools.validateFloatSting = function(val) {

    if (!val) return 0.0;
    
    val = val.trim();
    val = val.replace(',', '.');
    val = parseFloat(val);
    
    if (!val) return 0.0;
    
    return val;    
}

// bring string to regular expression match template like /sdfsdf/sf/sd/fs/f/test.ttt 

KellyTools.folderPatchToRegularExpression = function(folder) {
    
    if (!folder) return '';
    folder = folder.trim();
    
    if (!folder) return '';
    // [\\(] [\\)]

    folder = KellyTools.replaceAll(folder, '\\(', '__CCCC__');    
    folder = KellyTools.replaceAll(folder, '\\)', '__DDDD__');
    folder = KellyTools.replaceAll(folder, '\\\\', '/');
    folder = KellyTools.replaceAll(folder, '\\\\', '(\\\\\\\\|/)');
    folder = KellyTools.replaceAll(folder, '/', '(\\\\\\\\|/)');
    folder = KellyTools.replaceAll(folder, '__CCCC__', '[\(]');    
    folder = KellyTools.replaceAll(folder, '__DDDD__', '[\)]');
    
    // todo check special characters 
    
    return folder;
}

// input - any string that suppose to be file path or directory -> output - dir/dir2/dir3/file.ext, dir/dir2, dir/dir2/dir3 ...

KellyTools.validateFolderPath = function(folder) {

    if (!folder) return '';
    folder = folder.trim();
    
    if (!folder) return '';
    folder = KellyTools.replaceAll(folder, '\\\\', '/');
    
    var tmpFolder = '';
    for (var i=0; i <= folder.length-1; ++i) {
        if (i == 0 && folder[i] == '/') {
             continue;
        }
        
        if (i == folder.length-1 && folder[i] == '/') {
            continue;
        }
        
        if (folder[i] == '/' && tmpFolder[tmpFolder.length-1] == '/') {
            continue;
        }
        
        if (folder[i] == '/' && tmpFolder.length == 0) continue;
        

        tmpFolder += folder[i];
        
    }
    
    if (tmpFolder[tmpFolder.length-1] == '/') {
        tmpFolder = tmpFolder.slice(0, -1); 
    }

    return tmpFolder;
}

KellyTools.getBrowser = function() {
    
    // chrome - Opera \ Chrome, browser - Firefox
    
    if (typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') { // Edge has this object, but runtime is undefined
        return chrome;
    } else if (typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined') {
        return browser;
    } else {
        console.log('browser not suppot runtime API method');
        return false;
    }
}

KellyTools.getExt = function(str, limit) {
    
    var dot = str.lastIndexOf('.');
    
    if (dot === -1) return false;
    
    var ext =  str.substr(dot).split(".");
    if (ext.length < 2) return false;
    
    ext = ext[1];
    
    if (!limit) limit = 5;
    if (ext.length > limit) return false;
    if (ext.indexOf('/') !== -1) return false;
    
    return ext;
}

KellyTools.log = function(info, module) {
    
    if (!module) module = 'Kelly';
    
    if (typeof info == 'object' || typeof info == 'function') {
        console.log('[' + KellyTools.getTime() + '] ' + module + ' :  var output :');
        console.log(info);
    } else {
        console.log('[' + KellyTools.getTime() + '] ' + module + ' : '+ info);
    }
}

// 01:12

KellyTools.getTime = function() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    
    if (minutes < 10){
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}

// 2018_09_09__085827

KellyTools.getTimeStamp = function() {
    date = new Date();
    date = date.getUTCFullYear() + '_' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '_' +
        ('00' + date.getUTCDate()).slice(-2) + '__' + 
        ('00' + date.getUTCHours()).slice(-2) + '' + 
        ('00' + date.getUTCMinutes()).slice(-2) + '' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    
    return date;
}

// 2018-09-09 08:58:27

KellyTools.getGMTDate = function() {
    return new Date().toJSON().slice(0, 19).replace('T', ' ');
}

KellyTools.createAndDownloadFile = function(data, filename, mimetype) {

    if (!data) return false;
    if (!KellyTools.getBrowser()) return false;
    
    var ext = KellyTools.getExt(filename);
    if (!ext) ext = 'txt';
    
    if (!mimetype) {
        mimetype = 'application/x-' + ext;
        
        // MIME type list http://webdesign.about.com/od/multimedia/a/mime-types-by-content-type.htm
        
             if (ext == 'jpg' || ext == 'jpeg') mimetype = 'image/jpeg';
        else if (ext == 'png' ) mimetype = 'image/png';
        else if (ext == 'gif' ) mimetype = 'image/gif';
        else if (ext == 'zip' ) mimetype = 'application/zip';
        else if (ext == 'txt' ) mimetype = 'text/plain';
        else if (ext == 'json' ) mimetype = 'application/json';
    }
    
    if (filename.indexOf('.') == -1) filename += '.' + ext;
    

    var blobData = new Blob([data], {type : mimetype});
    
    var downloadOptions = {
        filename : filename, 
        conflictAction : 'uniquify',
        method : 'GET',
    }

    downloadOptions.url = URL.createObjectURL(blobData);  
    
    KellyTools.getBrowser().runtime.sendMessage({method: "downloads.download", blob : true, download : downloadOptions}, function(response){});             

    return true;
}

KellyTools.getParentByClass = function(el, className) {
    var parent = el;
 
    while (parent && parent.className != className) {
        parent = parent.parentElement;
    }  
    
    return parent;
}

// read local file
// untested in dataurl mode - suppose get binary data - such as png image
// try - btoa(unescape(encodeURIComponent(rawData))) to store local as base64:image

KellyTools.readFile = function(input, onRead, readAs) {
    
    if (!input) return false;
    
     var file = input.files[0];
 
    if (file) {
    
      var fileReader = new FileReader();
          fileReader.onloadend = function (e) {
                if (onRead) onRead(input, e.target.result);
          };
          
        if (readAs == 'dataurl') {
            
            fileReader.readAsDataURL(file);
        } else {
            fileReader.readAsText(file)
        }
        return true;
    } else return false;
}	

// return onLoad only on succesful load data, onFail - any problems during load, or bad response status (only 200 - OK accepted)

KellyTools.readUrl = function(url, onLoad, onFail, method, async) {

    if (!method) method = 'GET';
    if (typeof async == 'undefined') async = true;

    var request = new XMLHttpRequest();
        request.open(method, url, async);

        request.onload = function() {
          if (this.status == 200) {
             onLoad(this.response, url);
          } else {
             onFail(url, this.status, this.statusText);
          }
        };

        request.onerror = function() {
           onFail(url, -1);
        };

        request.send();
}

KellyTools.getRelativeUrl = function(str) {
    
    if ( typeof str !== 'string') return '/';

    str = str.trim();
    
    if (!str.length) return '/';
    
    if (str[str.length-1] != '/') str += '/';
    
    if (str.indexOf('http') != -1 || str.substring(0, 2) == '//') {
        str = str.replace(/^(?:\/\/|[^\/]+)*\//, "");
    }

    if (!str.length) str = '/';

    if (str[0] != '/') {
        str = '/' + str;
    }
    
    return str;
}
    
KellyTools.getElementByClass = function(parent, className) {
        
    if (parent === false) parent = document.body;
    
    if (typeof parent !== 'object') {
     
        
        console.log('unexpected type - ' + typeof parent);
        console.log(parent);
        return false;
    }
    
    if (!parent) return false;
    
    var childNodes = parent.getElementsByClassName(className);
    
    if (!childNodes || !childNodes.length) return false;
    
    return childNodes[0];
}

KellyTools.parseJSON = function(json) {
    
    var data = false;
    
    if (json) {
        try {
            data = window.JSON && window.JSON.parse ? JSON.parse(json) : eval('(' + json + ')');
        } catch (E) {
            KellyTools.log('fail to load json data : ' + json, 'KellyTools');            
        }
    } else {
        KellyTools.log('empty json', 'KellyTools');
    } 

    return data;
}

// https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript

KellyTools.replaceAll = function(text, search, replace) {
    return text.replace(new RegExp(search, 'g'), replace);
}

KellyTools.dispatchEvent = function(target, name) {
    
    if (!target) return;
    if (!name) name = 'click';
    if(typeof(Event) === 'function') {
        
        var event = false;
        
        try {
            
            event = new Event(name, {bubbles: true, cancelable: true});
          
        } catch(e){

            event = document.createEvent('Event');
            event.initEvent(name, true, false);
        }
                
    } else {
        
        var event = document.createEvent('Event');
        event.initEvent(name, true, true);
    }

    var bn = target.getBoundingClientRect();

    event.clientX = Math.round(bn.left + KellyTools.getScrollLeft() + bn.width / 2);
    event.clientY = Math.round(bn.top + KellyTools.getScrollTop() + bn.height / 2);

    target.dispatchEvent(event);
}

// params - paginationContainer, curPage, onGoTo, classPrefix, pageItemsNum, itemsNum, perPage

KellyTools.showPagination = function(params) {
    
    if (!params) {
        return false;	
    }
        
    if (!params.container) return false;
    if (!params.classPrefix) {
        params.classPrefix = 'KellyTools';
    }
    
    if (!params.itemsNum) params.itemsNum = 0;
    if (!params.perPage) params.perPage = 50;
    
    params.container.innerHTML = '';
    
    if (!params.itemsNum) return;
    
    var totalPages = Math.ceil(params.itemsNum / params.perPage);

    if (totalPages <= 1) return;
    
    var page = params.curPage ? params.curPage : 1;
    var pageListItemsNum = params.pageItemsNum ? params.pageItemsNum : 4; // maximum number of page buttons
    var pageStart = 1; // rendered button start

    pageStart = page - Math.ceil(pageListItemsNum / 2);       
    if (pageStart < 1) pageStart = 1; 
    
    var pageEnd = pageStart + pageListItemsNum - 1; // rendered button end
    if (pageListItemsNum > totalPages) pageEnd = totalPages;
    
    if (pageEnd <= 1) pageEnd = totalPages;
    if (pageEnd > totalPages) pageEnd = totalPages;
    
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;
    
    var goToFunction = function() {
        if (params.onGoTo) params.onGoTo(this.getAttribute('pageNum'));
        return false;
    }
    
    var goToPreviuse = document.createElement('a');
        goToPreviuse.href = '#';
        goToPreviuse.setAttribute('pageNum', 'previuse');
        goToPreviuse.innerHTML = '<';
        goToPreviuse.className = params.classPrefix + '-item';
        goToPreviuse.onclick = goToFunction;
             
    if (pageStart > 1) {
        var goToBegin = goToPreviuse.cloneNode(true);
        goToBegin.setAttribute('pageNum', '1');
        goToBegin.onclick = goToFunction;
        goToBegin.innerHTML = '<<';
        
        params.container.appendChild(goToBegin); 
    }
    
    if (pageStart > 1) { 
        params.container.appendChild(goToPreviuse); 
    }
          
    for (var pageNum = pageStart; pageNum <= pageEnd; pageNum++) {
         var pageEl = document.createElement('a');
             pageEl.href = '#';
             pageEl.innerHTML = pageNum;
             pageEl.className = params.classPrefix + '-item';
             if (pageNum >= 100) pageEl.className += ' ' + params.classPrefix + '-item-100';
             
             pageEl.setAttribute('pageNum', pageNum);
             
        if (page == pageNum) pageEl.className += ' active';
            
            pageEl.onclick = goToFunction;                
            params.container.appendChild(pageEl);
    }

    var goToNext = document.createElement('a');
        goToNext.href = '#';
        goToNext.setAttribute('pageNum', 'next');
        goToNext.className = params.classPrefix + '-item';
        goToNext.innerHTML = '>';
        goToNext.onclick = goToFunction;
        
    if (pageEnd < totalPages) { 
        params.container.appendChild(goToNext);
    }
    
    if (pageEnd < totalPages) {
        var goToEnd = goToPreviuse.cloneNode(true);
        goToEnd.setAttribute('pageNum', totalPages);            
        goToEnd.onclick = goToFunction;
        goToEnd.innerHTML = '>>';
        
        params.container.appendChild(goToEnd); 
    }
    
    if (totalPages > pageListItemsNum) {
    
        if (page < totalPages - 1) {
            // go to end
        }
        
        if (page > 1) {
            // go to begin
        }
    }
    
    return params.container;
}
    


//D:\Dropbox\Private\l scripts\jfav\release\Extension\\lib\kellyFavItems.js



﻿// ==UserScript==
// @encoding utf-8
// @name           KellyFavItems
// @namespace      Kelly
// @description    useful script
// @author         Rubchuk Vladimir <torrenttvi@gmail.com>
// @license   GPLv3
// ==/UserScript==

function KellyFavItems() 
{
    this.PROGNAME = 'KellyFavItems v1.0b';
    
    var handler = this;	
        
    var env = false;
    var events = new Array();
    
    var selectedPost = false;
    var selectedImages = false;
    var selectedComment = false;
    var selectedInfo = false; // какие-либо мета данные сохраняемые для определенной публикации в обработчике itemAdd (добавлять методом setSelectionInfo)
    
    var extendCats = []; // выделеные категории для последующего добавления к определенной публикации в режиме просмотра избранного
    
    var init = false; // маркер инициализации расширения (вызов метода initExtension)
    
    // события
    
    // onPageReady - вызов выполняется сразу при запуске плагина если есть хотябы одна публикация, иначе window.onload, доступны все переменные конфига \ сохраненные публикации в fav.
    // onExtensionReady - вызывается после загрузки всех необходимых css ресурсов расширения  
    
    // dynamicly created DOM elements
    
    var sideBarWrap = false;
    var sideBarLock = false;
    var modalBox = false;
    var modalBoxContent = false;
    var modalBoxMessage = false;
    
    var downloaderBox = false;    
    var favCounter = false;
    
    //    
    
    var siteContent = false; // main page container - setted by env
    var favContent = false; // main extension container
    var imagesBlock = false;
    
    var publications = false;
    var submenuItems = false;
    var menuButtons = [];
    
    var mode = 'main'; // current extension page, main - not in extension, fav - show favourites page
    
    // Фильтры в режиме просмотра избранного    
    // исключать из выборки публикации по типу
    
    var excludeFavPosts = false;
    var excludeFavComments = false;
    
    var logic = 'and';
    var catFilters = [];
    var catFilterNot = false; // режим выбора категории с отрицанием
    var catIgnoreFilters = [];
    
    var commentsBlockTimer = [];
    
    var readOnly = true;
    var imagesAsDownloadItems = false;
    
    // addition classes
    var imgViewer = false;    
    var favNativeParser = false;
    var downloadManager = false;
    var storageManager = false;
    var tooltip = false;
           
    var debug = true;
    
    var page = 1;
    var uiBeasy = false;
    
    var displayedItems = [];
    var galleryImages = [];
    var galleryImagesData = [];
    
    var lng = KellyLoc;
    
    var imageGrid = false;
    var fav = {};
    
    this.isDownloadSupported = false;
    
    function initImageGrid() {
        
        imageGrid = new KellyTileGrid({
        
            tilesBlock : imagesBlock,
            rowHeight : 250,
            tileClass : env.className + '-FavItem',
            hideUnfited : false,
            
            
            rules : {
                dontWait : true,
                fixed : 2,
                tmpBounds : { width : 200, height : 200},
            },
            
            events : {
                // isBoundsLoaded : function(tile, tileMainEl) { return false },
                getBoundElement : function(self, tile) {
                
                    var el = tile.getElementsByClassName(env.className + '-preview');
                    
                    if (el && el.length) return el[0];
                    return false;
                    
                },
                
                // для картинки неизвестны пропорции и картинка была удалена с сервера \ ошибка подключения
                
                onBadBounds : function(self, data) {
                    
                    if (data.errorCode == 2 || data.errorCode == 3 || data.errorCode == 4) {
                        
                        data.boundEl.setAttribute('data-width', 200);
                        data.boundEl.style.display = 'inline-block';
                        
                        return {width : 200};
                        
                    } else {
                        
                        if (data.tile) data.tile.style.display = 'none';
                        return false;
                    }
                },
                getResizableElement : function(self, tile) {
                    return tile;
                },
                onGridUpdated : function(self) {
                    
                    // if fav.coptions.imagegrid.padding
                    /*
                        var grid = imagesBlock.getElementsByClassName(env.className + '-FavItem-grid-resized');
                        
                        for (var i = 0; i < grid.length; i++) {
                            grid[i].style.boxSizing = 'border-box';
                            grid[i].style.padding = '6px';
                        }
                    */
                
                },
                
                // для одного из элементов сетки загружены пропорции
                
                onLoadBounds : function(self, boundEl, state) {
                
                    handler.onFavImageLoad(boundEl, state == 'error' ? true : false);
                    return false;
                },
                
                onResizeImage : function(self, itemInfo) {
                
                    // todo show in original size elements that smaller then resized version
                    
                    if (!itemInfo.tile) return;
                    if (itemInfo.width < 140) {
                        var showPostBtn = KellyTools.getElementByClass(itemInfo.tile, env.className + '-FavItem-overlay-button');
                        if (showPostBtn) {
                            showPostBtn.parentElement.removeChild(showPostBtn);
                        }
                    }                    
                },
                
            },
            
        });
    }
    
    // categories - name \ id
    
    // items - categoryId \ post link \ previewImage \ is_comment . todo - addition pictures (show number)
        
    function constructor(noexec) {
        
        if (noexec) return;
        
        if (typeof K_DEFAULT_ENVIRONMENT == 'undefined') {
            
            // for other services, currently none
            
            var profile = false; // check by window.location.host if some excludes will be in future		
            
            if (profile) {
                KellyTools.getBrowser().runtime.sendMessage({method: "getProfile", profile : profile}, handler.exec);
            } else {
                log('Unknown servise or site, cant find profile for ' + window.location.host);
            }
            
        } else {
            handler.exec({env : K_DEFAULT_ENVIRONMENT});
        }
    }	
    
    this.exec = function(cfg) {

        if (env) {
            return;
        }
        
        if (!cfg || (!cfg.envText && !cfg.env)) {
            log('empty environment attribute or profile name');
            log(cfg.error);
            return;
        }
    
        // todo catch error details for custom profile
        
        if (cfg.envText) {
                
            K_ENVIRONMENT = false;
        
            try {
                eval(cfg.envText);
            } catch (e) {
                if (e) {
                    log(e);
                    return;
                }
            }
            
            if (typeof K_ENVIRONMENT != 'undefined') {
                env = K_ENVIRONMENT;
            }
        
        } else env = cfg.env;
        
        if (!env) {
            log('init env error');
            return;
        }
        
        env.setFav(handler);		
        
        var action = getInitAction();        
        if (action == 'main') {
     
            handler.load(false, function() {
                
                KellyLoc.debug = debug;
                
                var posts = document.getElementsByClassName(env.publication);
                if (posts) { 
                    handler.initOnPageReady();
                } else {
                    handler.addEventListner(window, "load", function (e) {
                        handler.initOnPageReady();
                        return false;
                    }, 'init_');
                }
            });  
            
        } else if (action == 'disable') {
        
        }
        
        log(handler.PROGNAME + ' init | loaded in ' + action + ' mode | profile ' + env.profile);        
    }
    
    
    this.updateFavCounter = function() {
    
        if (!favCounter) return;		
        var itemsLengthClass = env.className + '-FavItemsCount';
        
        if (fav.items.length < 10) {
            itemsLengthClass += '-1';
        } else if (fav.items.length < 100) {
            itemsLengthClass += '-10';
        } else if (fav.items.length < 1000) {
            itemsLengthClass += '-100';
        } else {
            itemsLengthClass += '-1000';
        }
        
        favCounter.className = env.className + '-FavItemsCount ' + env.className + '-buttoncolor-dynamic ' + itemsLengthClass;        
        favCounter.innerHTML = fav.items.length;
    }
    
    function getInitAction() { // if page included as Iframe, we use it just to restore local storage data on subdomain, or domain with other name
        var mode = KellyTools.getUrlParam(env.actionVar);
        if (!mode) return 'main';
        
        return mode;
    }
    
    this.getStorageManager = function() {
        if (!storageManager) {
        
            storageManager = new KellyFavStorageManager();
            storageManager.fav = handler;
            
            storageManager.className = env.className;
            
            storageManager.prefix += env.profile + '_';      
            storageManager.prefixCfg += env.profile + '_';             
        }
        
        return storageManager;
    }
    
    this.getDownloadManager = function() {
        
        if (!downloadManager) {
            
            downloadManager = new KellyGrabber({
                className : env.className + '-downloader',
                imageClassName : env.className + '-FavItem',
                fav : handler,
                // baseFolder
            });
        }
          
        return downloadManager;
    }
    
    this.getTooltip = function() {
        if (!tooltip) {
        
            tooltip = new KellyTooltip({
            
                classGroup : env.className + '-tooltipster', 
                selfClass : env.hostClass + ' ' + env.className + '-Default-tooltipster',
                closeButton : false,
                
                events : { onMouseOut : function(tooltip, e) {
                
                    var related = e.toElement || e.relatedTarget;
                    if (tooltip.isChild(related)) return;
                    
                    tooltip.show(false);
                }}, 
                
            });
        } 
        
        return tooltip;
    }
    
    function log(info) {
        if (debug) {
            KellyTools.log(info, 'KellyFavItems');
        }
    }

    // validate selected categories, remove from selected if some of them not exist
    
    function validateCategories(catList, db) {
           
        if (!db) db = fav;
        var tmpSelectedCategories = []; 
        
        if (catList) {
            
            for (var i = 0; i < catList.length; i++) {
            
                if (handler.getStorageManager().getCategoryById(db, catList[i]).id == -1) {
                    log('skip deprecated category ' + catList[i]);
                    continue;
                } 
                
                tmpSelectedCategories.push(catList[i]);
            }
        }       
        return tmpSelectedCategories;
    }
        
    // загрузить настройки и локальное избранное
    
    // локальное хранилище, структура данных поумолчанию
    /*
        var fav = {       
            items : [], 
            
            selected_cats_ids : [], // последние выбраные категории при добавлении изображения через диалоговое окно (categoryExclude, validateCategories, getCategoryBy)
            categories : [
                {id : 1, name : 'GIF', protect : true},
                {id : 2, name : 'NSFW', nsfw : true, protect : true},
            ],  // категории элементов
                               
            ids : 100, // счетчик уникальных идентификаторов
            
            coptions : {}
        };
    */
    
    this.load = function(type, onAfterload) {
                
        var onLoadItems = function(itemsDb) {
                    
            if (!itemsDb) {
                itemsDb = sm.getDefaultData();
                log('load() ' + fav.coptions.storage + ' db not exist, default used');
            }
            
            for (var k in itemsDb){
                if (typeof itemsDb[k] !== 'function') {
                    
                    fav[k] = itemsDb[k];
                }
            }
            
            page = 1;
            fav.selected_cats_ids = validateCategories(fav.selected_cats_ids);	
            
            sm.validateDBItems(fav);
            
            if ((type == 'items' || !type) && onAfterload) onAfterload(); 
        }

        var onLoadConfig = function (config) {
            
            if (config) fav = config;
            else log('load() bad or empty config ' + sm.prefixCfg + 'config, default used');
                                
            if (!fav.selected_cats_ids) fav.selected_cats_ids = [];
            if (!fav.coptions) {
            
                // default values
                
                fav.coptions = {                
                    syncByAdd : false,
                    newFirst : true,
                    hideSoc : true,
                    optionsSide : false,
                };
            }
            
            if (!fav.coptions.storage) {
                fav.coptions.storage = 'default';
            }
                    
            // fav.items[fav.items.length] = {"categoryId":[6,4,12],"previewImage":"http://img1.joyreactor.cc/pics/post/bad.jpg","name":""};
            
            if (!fav.coptions.comments_blacklist)  fav.coptions.comments_blacklist = [];
            if (!fav.coptions.posts_blacklist)  fav.coptions.posts_blacklist = [];
            
            fav.coptions.debug = fav.coptions.debug ? true : false;
            debug = fav.coptions.debug;
            
            fav.coptions.newFirst = fav.coptions.newFirst ? true : false;
            
            if (!fav.coptions.storageDriver) {
                fav.coptions.storageDriver = 'localstorage';
            }
            
            fav.coptions.hideSoc = fav.coptions.hideSoc ? true : false;
            
            if (!fav.coptions.tagList) fav.coptions.tagList = '';
                        
            sm.driver = fav.coptions.storageDriver;
                        
            fav.coptions.syncByAdd = fav.coptions.syncByAdd ? true : false;
            
            if (!fav.coptions.grid)  {
                fav.coptions.grid = {
                    fixed : false,
                    rowHeight : 250,
                    heightDiff : 10,
                    min : 2, 
                    cssItem : '',
                    perPage : 60,
                    type : 'dynamic',
                };
            }
            
            if (!fav.coptions.grid.type) {
                fav.coptions.grid.type = 'dynamic';
            }
            
            if (!fav.coptions.fastsave) {
            
                fav.coptions.fastsave = {
                    baseFolder : env.profile + '/Fast',
                    // nameTemplate : '#category_1#/#id#_#category_1#_#category_2#_#category_3#',
                    enabled : false,
                    check : false,
                    conflict : 'overwrite',
                };
            }
            
            if (!fav.coptions.downloader) {
                fav.coptions.downloader = {
                    //perPage : 200,
                }
            }
        
            if (!type) {
                sm.loadDB(fav.coptions.storage, onLoadItems);
            } else {
            
                if (onAfterload) onAfterload();
            }
        }
        
        var sm = handler.getStorageManager();
        
        if (!type || type == 'cfg') {
            sm.loadDB('config', onLoadConfig, true);            
        } else if (type == 'items') {
            sm.loadDB(fav.coptions.storage, onLoadItems);   
        }
    }
            
    this.save = function(type, onSave) {
    
        log('save() ' + type);
        var notSaved = (!type) ? 2 : 1 ;
        
        if (!type || type == 'items') {
        
            handler.getStorageManager().saveDB(fav.coptions.storage, { 
                categories : fav.categories, 
                items : fav.items,  
                ids : fav.ids, 
            }, function(error) {
                  log('save() save data to storage ' + (error ? error : 'OK'));
                  notSaved--;
                  if (!notSaved && onSave) onSave(error);
            });
        }
        
        if (!type || type == 'cfg') {
        
            handler.getStorageManager().saveDB('config', { 
                selected_cats_ids : fav.selected_cats_ids, 
                coptions : fav.coptions
            }, function(error) {
                 log('save() save cfg to storage ' + (error ? error : 'OK'));
                 notSaved--;
                 if (!notSaved && onSave) onSave(error);
            }, true);
        }
    }
    
    this.goToFavPage = function(newPage) {
        
        if (page == newPage) return false;
        if (uiBeasy) return false;
        if (!displayedItems || !displayedItems.length || !imagesBlock) return false;
                
        var totalPages = Math.ceil(displayedItems.length / fav.coptions.grid.perPage);
               
        if (newPage == 'next') newPage = page+1;
        else if (newPage == 'previuse' || newPage == 'prev' ) newPage = page-1;
        else {
            newPage = parseInt(newPage);
        }
        
        if (newPage < 1) newPage = 1;
                        
        if (newPage > totalPages) {
            newPage = totalPages;
        }
        
        if (newPage == page) {
            return false;
        }
        
        page = newPage;
        
        uiBeasy = true;
        imagesBlock.className = imagesBlock.className.replace('active', 'hidden');
        
        setTimeout(function() {
            
            imagesBlock.className = imagesBlock.className.replace('hidden', 'active');
            imageGrid.close();
            
            handler.updateImagesBlock();
            handler.updateImageGrid();
            uiBeasy = false;
            
        }, 200);
        
        return true;
    }
    
    // updates navigation block in order of current selection for mode = fav
    
    function updatePagination(container) {
        
        return KellyTools.showPagination({ 
            container : container, 
            curPage : page, 
            onGoTo : handler.goToFavPage, 
            classPrefix : env.className + '-pagination',
            pageItemsNum : 4,
            itemsNum : displayedItems.length,
            perPage : fav.coptions.grid.perPage,
        });
    }

    this.addCss = function(text, remove) {

        var style = document.getElementById(env.className + '-mainCss');
        if (!style) {
            
            var head = document.head || document.getElementsByTagName('head')[0];
            var	style = document.createElement('style');
                style.type = 'text/css';
                style.id = env.className + '-mainCss';
            
                head.appendChild(style);
        }
        
        if (remove) {
            style.innerHTML = '';
        }
        
        if (style.styleSheet){
          style.styleSheet.cssText = text;
        } else {
          style.appendChild(document.createTextNode(text));
        }
    }
    
    this.showItemInfo = function(item) {
    
        if (!item) return false;
    
        // console.log(item)
        
        var text = lng.s('Запись №__ITEMN__', 'item_number', {ITEMN : item.id}) + '<br>';
        
        if (item.name) {
            text += lng.s('Подпись : ', 'item_sign') + '<br>' + item.name + '<br>';
        }
        
        if (item.pw ) {
            text += item.pw + 'x' + item.ph;
            if (item.ps ) text += ' (' + lng.s('оригинал', 'source') + ')' + '<br>';
            else text += ' (' + lng.s('превью', 'preview') + ')' + '<br>';
        }
        
        if (item.link) {
            text += '<a href="' + item.link + '" target="_blank">' + lng.s('Перейти к публикации', 'go_to_publication') + '</a>' + '<br>';
            
        }
        
        if (item.commentLink) {
            text += '<a href="' + item.commentLink + '" target="_blank">' + lng.s('Перейти к комментарию', 'go_to_comment') + '</a>' + '<br>';
            
        }
        
        if (typeof item.pImage != 'string' && item.pImage.length > 1) {
            text += lng.s('Изображений : __IMAGEN__', 'image_total', {IMAGEN : item.pImage.length}) + '<br>';
        }
    
        if (typeof item.pImage != 'string' && item.pImage.length > 1) {
            
            text += '<ul class="'+ env.className +'-ItemTip-images">';
            
            
                for (var i = 0; i < item.pImage.length; i++) {
                
                    var imgTitle = lng.s('Изображение __IMAGEN__', 'image', {IMAGEN : i});
                    if (i == 0) imgTitle = lng.s('Основное изображение', 'image_main');
                    
                    text += '<li><a href="' + env.getImageDownloadLink(item.pImage[i], true) + '" target="_blank">';
                    text += '<img src="' + env.getStaticImage(env.getImageDownloadLink(item.pImage[i], false)) + '" alt="' + imgTitle + '"></a></li>';
                }
                    
            text += '</ul>';
        
        } else {
        
            text += '<a href="' + env.getImageDownloadLink(item.pImage, true) + '" target="_blank">' + lng.s('Основное изображение', 'image_main') + '</a>' + '<br>';
        }
        
        return text;
    }
       
    function addImageInfoTip(el) {
        
        var getMessage = function(el, e) {
        
            var item = false;
            var state = imgViewer.getCurrentState();
            if (state.imageData) {		
                if (typeof state.imageData.pImage != 'undefined') {
                    item = state.imageData;
                } else {
                    item = state.imageData[state.cursor];
                }
            }
            
            if (!item) return false;
        
            
            return handler.showItemInfo(item);
        }
        
        KellyTooltip.addTipToEl(el, getMessage, {
            offset : {left : -20, top : 0}, 
            positionY : 'top',
            positionX : 'right',
            ptypeX : 'outside',
            ptypeY : 'inside',
            closeButton : false,
            selfClass : env.hostClass + ' ' + env.className + '-ItemTip-tooltipster',
            classGroup : env.className + '-tooltipster',
            removeOnClose : true,
        }, 100);	
    }
    
    function initWorktop() {
        
        // todo modal mode for fit to ANY site
        var envContainers = env.getMainContainers();
        if (!envContainers.body) {
            debug = true;
            log('initWorktop() main container is undefined ' + env.profile);
        }
        
        var modalClass = env.className + '-ModalBox';
        
        sideBarWrap = document.createElement('div');
        sideBarWrap.id = env.className + '-sidebar-wrap';
        sideBarWrap.className = env.className + '-sidebar-wrap ' + env.className + '-sidebar-wrap-hidden ' + env.hostClass; 
        
        var modalBoxHTML  = '<div class="' + modalClass + ' ' + modalClass +'-main">';
            modalBoxHTML += '<div class="' + modalClass + '-header">\
                                <a href="#" class="' + modalClass + '-hide-preview hidden" ></a>\
                                <a href="#" class="' + modalClass + '-close">' + lng.s('Закрыть', 'close') + '</a>\
                            </div>';
            modalBoxHTML += '<div class="' + modalClass + '-content">';
                                
            modalBoxHTML += '</div><div class="' + modalClass + '-message"></div>';
            modalBoxHTML += '</div>';
                
        var imgViewClass = env.className + '-ImgView';
        
        var imgView = document.createElement('div');
            imgView.className = imgViewClass;
            imgView.innerHTML = '<div class="' + imgViewClass + '-loader"></div><div class="' + imgViewClass + '-img" ></div>';
            
            imgViewer = new KellyImgView({className : env.className + '-ImgView', viewerBlock : imgView});
            
        var downloaderHTML = '\
            <div class="' + modalClass + ' ' + modalClass + '-downloader hidden">\
                <div class="' + modalClass + '-content"></div>\
            </div>\
        ';
        
        sideBarWrap.innerHTML = modalBoxHTML + downloaderHTML;
        
        modalBox = KellyTools.getElementByClass(sideBarWrap, modalClass + '-main');
        modalBoxContent = KellyTools.getElementByClass(modalBox, modalClass + '-content');
        modalBoxMessage = KellyTools.getElementByClass(modalBox, modalClass + '-message');
        
        downloaderBox = {
            modal : KellyTools.getElementByClass(sideBarWrap, modalClass + '-downloader'),
        }; 
        
        downloaderBox.content = KellyTools.getElementByClass(downloaderBox.modal, modalClass + '-content');
        
        envContainers.body.appendChild(sideBarWrap);
        envContainers.body.appendChild(imgView);
        
        imgViewer.addBaseButtons();
        
        var tip = imgViewer.addButton('?', 'info', function() { });
        addImageInfoTip(tip);
        
        handler.addEventListner(window, "resize", function (e) {
            updateSidebarPosition();
        }, '_fav_dialog');
        
        handler.addEventListner(window, "scroll", function (e) {
            updateFastSaveButtonsState();
            updateSidebarPosition();
        }, '_fav_dialog');
        
        updateFastSaveButtonsState();

        // add fav button on top
        
        var counterHtml = '<div class="'+ env.className + '-FavItemsCount ' + env.className + '-basecolor-dynamic"></div>';
        var iconHtml = '';
        
        if (fav.coptions.icon) {
            iconHtml = '<div class="' + env.className + '-icon ' + env.className + '-buttoncolor-dynamic" style="' + fav.coptions.icon + '"></div>';
        } else {			
            iconHtml = '<div class="' + env.className + '-icon ' + env.className + '-icon-diskete ' + env.className + '-buttoncolor-dynamic"></div>';
        }
        
        var favButton = createMainMenuButton(iconHtml + counterHtml, function() { 
                
                if (!checkSafeUpdateData()) return false;
                
                if (mode == 'fav') {
                    handler.hideFavoritesBlock();
                } else {					
                    handler.showFavouriteImages();
                }
         
                return false; 
        }, 'fav');

        
        if (favButton) {
            menuButtons['fav'] = favButton.parentNode;
            favCounter = favButton.getElementsByClassName(env.className  + '-FavItemsCount')[0];
            // if (handler.isMainDomain())
            handler.updateFavCounter();
        }
        
        if (!fav.coptions.optionsSide) {
            var optionsButton = createMainMenuButton(lng.s('Настройки', 'options'), function() { 
                                
                if (!checkSafeUpdateData()) return false;
                
                if (mode == 'ctoptions') {
                    handler.hideFavoritesBlock();
                } else {					
                    handler.showOptionsDialog();
                }
                
                return false; 
            
            }, 'options');
            
            if (optionsButton) {
                menuButtons['ctoptions'] = optionsButton.parentNode;
            }
        }
        
        // add fav container
        
        siteContent = envContainers.content;        
        if (siteContent) {
        
            favContent = document.createElement('div');
            favContent.className = env.className + '-FavContainer';
            
            favContent.className += ' ' + env.hostClass; 
            
            siteContent.parentNode.insertBefore(favContent, siteContent);
        } else {
            log('main container inner not found');
        }
        
        
        if (env.onInitWorktop) env.onInitWorktop();	
    }
    
    function updateFastSaveButtonsState() {
    
        if (!handler.isDownloadSupported || !fav.coptions.fastsave.enabled || !fav.coptions.fastsave.check) {
            return false;
        }
        
        if (!publications || !publications.length) return false;

        var scrollBottom = KellyTools.getViewport().scrollBottom;
        
        for (var i = 0; i < publications.length; i++) {
            
            if (!publications[i]) continue;
            var button = KellyTools.getElementByClass(publications[i], env.className + '-fast-save-unchecked');
           
            if (!button) continue;
            
            if (button.getBoundingClientRect().top < scrollBottom + 100) {
                fastDownloadCheckState(publications[i], button);
            }         
                    
        }
    }
    
    function createMainMenuButton(name, onclick, index) {
        
        var submenu = env.getMainContainers().menu;
        
        if (!submenu) {
            log('bad submenu identifer');
            return false;
        }
        
        // old reactor
        var menuButtonTest = KellyTools.getElementByTag(submenu, 'a');
        if (menuButtonTest && menuButtonTest.getAttribute('rel') == 'v:url') {
            submenu = menuButtonTest.parentNode.parentNode;
        }
        
        var menuBrTest = KellyTools.getElementByTag(submenu, 'br');
        if (menuBrTest) menuBrTest.style.display = 'none';
        
        var menuButtonContainer = document.createElement('div');
            menuButtonContainer.className = 'submenuitem ' + env.hostClass + ' ' + env.className + '-MainMenuItem ' + env.className + '-ahover-dynamic' ;
            if (index) {
                menuButtonContainer.className += ' ' + env.className + '-MainMenuItem-' + index;
            }
            
            menuButtonContainer.innerHTML = '<a href="#">' + name + '</a>';
        
        var menuButtonA = KellyTools.getElementByTag(menuButtonContainer, 'a');
        
        if (menuButtonA) {          
            menuButtonA.onclick = onclick;
            
            submenu.appendChild(menuButtonContainer);
            
        } else {
            log('main menu button not exist');
            return false;
        }
        
        return menuButtonA;
    }
    
    function getPostUserName(postBlock) {
        var nameContainer = KellyTools.getElementByClass(postBlock, 'uhead_nick');
        if (nameContainer) {
            var img = KellyTools.getElementByClass(postBlock, 'avatar');
            if (img) return img.getAttribute('alt');
        }
        
        return false;
    }
    
    function getCommentUserName(comment) {
        var nameContainer = KellyTools.getElementByClass(comment, 'reply-link');
        if (nameContainer) {   
                var a = KellyTools.getElementByTag(nameContainer, 'A');
                if (a) return a.textContent || a.innerText || '';
        }
        
        return false;
    }
    
    function getCommentsList(postBlock) {    
        
        var postFooter =  KellyTools.getElementByClass(postBlock, 'ufoot');
        if (!postFooter) return false;
        
        var list =  KellyTools.getElementByClass(postFooter, 'post_comment_list');
        if (!list) return false;        
        
        var comments = list.getElementsByClassName('comment');
        if (comments.length) return comments;
        
        return false;               
    }
    
    // todo move to profile
    
    function formatPostContainer(postBlock) {
        
        if (fav.coptions.posts_blacklist) {  
            var userName = getPostUserName(postBlock);
            if (fav.coptions.posts_blacklist.indexOf(userName) != -1) { 
                postBlock.style.display = 'none';            
                return false;
            }
        }
        
        var censored = postBlock.innerHTML.indexOf('/images/censorship') != -1 ? true : false;
        
        if (!updatePostFavButton(postBlock)) return false;    
        
        var toogleCommentsButton = postBlock.getElementsByClassName('toggleComments');

        if (toogleCommentsButton.length) {
            toogleCommentsButton = toogleCommentsButton[0];
            handler.removeEventListener(toogleCommentsButton, 'click', 'toogle_comments_' + postBlock.id);
            
            handler.addEventListner(toogleCommentsButton, "click", function (e) {
                    handler.onPostCommentsShowClick(postBlock);
                    return false;
            }, 'toogle_comments_' + postBlock.id);
        }
        
        formatComments(postBlock);     
            
        var shareButtonsBlock = KellyTools.getElementByClass(postBlock, 'share_buttons');
        if (shareButtonsBlock) {
            
            var fastSave = KellyTools.getElementByClass(postBlock,  env.className + '-fast-save');
            if (!censored && fav.coptions.fastsave.enabled) {
                
                if (!fastSave) {
                    fastSave = document.createElement('DIV');                    
                    shareButtonsBlock.appendChild(fastSave); 
                        
                    var fastSaveBaseClass =  env.hostClass + ' ' + env.className + '-fast-save ' + env.className + '-icon-diskete ';
                
                    fastSave.className = fastSaveBaseClass + env.className + '-fast-save-unchecked';
                    fastSave.onclick = function() {
                        if (this.className.indexOf('loading') != -1 || this.className.indexOf('unavailable') != -1) return false;
                                          
                        fastSave.className = fastSave.className.replace('unchecked', 'checked');
                        this.className += ' ' + env.className + '-fast-save-loading';
                        
                        fastDownloadPostData(postBlock, false, function(success) {
                            fastSave.className = fastSaveBaseClass + env.className + '-fast-save-' + (success ? '' : 'not') + 'downloaded';
                        });
                        
                        return false;
                    }  
                } 
                
            } else {
                if (fastSave) {
                    fastSave.parentNode.removeChild(fastSave);
                }
            }
            
            if (fav.coptions.hideSoc) {
                var shareButtons = shareButtonsBlock.childNodes;
                for (var i = 0; i < shareButtons.length; i++) {            
                    if (shareButtons[i].tagName == 'A' && shareButtons[i].className.indexOf('share') != -1) {
                        // keep technically alive
                        shareButtons[i].setAttribute('style', 'height : 0px; width : 0px; opacity : 0; margin : 0px; padding : 0px; display : block; overflow : hidden;');
                    }
                }
            }
        }
    }
             
    function toogleActive(el) {
        if (!el) return;
        
        if (el.className.indexOf('active') !== -1) {
            el.className = el.className.replace('active', '');
        } else {
            el.className += ' active';
        }
    }
    
    // exit from Favourites plugin block
    
    this.hideFavoritesBlock = function() {
    
        siteContent.style.display = 'block';
        favContent.style.display = 'none';
        handler.removeEventListener(window, 'scroll', 'fav_scroll');

        imageGrid.close();
        
        for (var k in menuButtons){
            if (typeof menuButtons[k] !== 'function') {
                menuButtons[k].className = menuButtons[k].className.replace('active', '');
            }
        }

        handler.closeSidebar();
        mode = 'main';
        
        if (downloaderBox) {
            downloaderBox.modal.className = downloaderBox.modal.className.replace('active', 'hidden');
            
            imagesAsDownloadItems = false;
            sideBarLock = false;
        }
    }
    
    // вывести окно расширения и назначить режим отображения
    
    function displayFavouritesBlock(newMode) {
        siteContent.style.display = 'none';
        favContent.style.display = 'block';
                
        if (!newMode) mode = 'fav';
        else mode = newMode;
        
        for (var k in menuButtons){
            if (typeof menuButtons[k] !== 'function') {
                menuButtons[k].className = menuButtons[k].className.replace('active', '');
            }
        }
        
        if (typeof menuButtons[mode] != 'undefined') {
            menuButtons[mode].className += ' active';
        }
    }
    
    function getCommentText(comment) {
    
        var contentContainer = KellyTools.getElementByClass(comment, 'txt');
        
        if (!contentContainer) return '';
        
        var textContainer = contentContainer.childNodes[0];
        return textContainer.textContent || textContainer.innerText || '';
    }
    
    function updatePostFavButton(postBlock) {
        
        var link = env.getPostLink(postBlock);
        
        if (!link) {            
            log('bad postcontainer');
            return false;        
        }
        
        var linkUrl = KellyTools.getRelativeUrl(link.href);
        if (!linkUrl) {
            log('bad postcontainer url');
            return false;  
        }
                
        var inFav = handler.getStorageManager().searchItem(fav, {link : linkUrl, commentLink : false});
        
        var addToFav = KellyTools.getElementByClass(postBlock, env.className + '-post-FavAdd');
    
        // create if not exist
        
        if (!addToFav) {
            addToFav = document.createElement('a');
            addToFav.className = env.className + '-post-FavAdd';
            
            // keep same url as main button, to dont loose getPostLink method functional and keep similar environment
            addToFav.href = link.href; 
           
            var parentNode = link.parentNode;
                parentNode.insertBefore(addToFav, link);
        }
        
        // update title
        
        if (inFav !== false) {
            addToFav.onclick = function() { 
            
                handler.showRemoveFromFavDialog(inFav, function() {
                    if (fav.coptions.syncByAdd && env.syncFav) env.syncFav(postBlock, false);
                    
                    handler.closeSidebar(); 
                }); 
                
                return false; 
            };
            addToFav.innerHTML = lng.s('Удалить из избранного', 'remove_from_fav');
        } else {
            addToFav.onclick = function() { handler.showAddToFavDialog(postBlock); return false; };
            addToFav.innerHTML = lng.s('Добавить в избранное', 'add_to_fav');
        }
                
        return true;            
    }	
       
    function formatComments(block) {
    
        var comments = getCommentsList(block);
        if (!comments) return false;
        
        for(var i = 0; i < comments.length; i++) {
        
            if (fav.coptions.comments_blacklist) {  
                var userName = getCommentUserName(comments[i]);
                if (fav.coptions.comments_blacklist.indexOf(userName) != -1) { 
                    comments[i].style.display = 'none';            
                    continue;
                }
            }
        
            var addToFavButton = comments[i].getElementsByClassName('kelly-add-to-fav');
            
            if (!addToFavButton.length) {
        
                var bottomLinks = comments[i].getElementsByClassName('reply-link');
                if (bottomLinks.length) {
                
                    addToFavButton = document.createElement('a');
                    addToFavButton.href = '#';
                    addToFavButton.innerHTML = lng.s('Добавить в избранное', 'add_to_fav');
                    addToFavButton.setAttribute('commentId', comments[i].id);
                    addToFavButton.className = 'kelly-add-to-fav';
            
                    bottomLinks[0].appendChild(addToFavButton);
                    // responseButton.parentNode.inserBefore(addToFavButton, responseButton.nextSibling) insert after
                }
            } else {
                addToFavButton = addToFavButton[0];
            }
            
            
            // searh comment by link
            var link = KellyTools.getRelativeUrl(env.getCommentLink(comments[i]));
            var inFav = false;
            
            if (link != '#') {
                inFav = handler.getStorageManager().searchItem(fav, {link : false, commentLink : link});
            }
                
            if (inFav !== false) {
                
                addToFavButton.setAttribute('itemIndex', inFav);
                addToFavButton.onclick = function() { handler.showRemoveFromFavDialog(this.getAttribute('itemIndex')); return false; };
                addToFavButton.innerHTML = lng.s('Удалить из избранного', 'remove_from_fav');
                
            } else {
            
                addToFavButton.onclick =  function() {						
                    handler.showAddToFavDialog(block, document.getElementById(this.getAttribute('commentId')));
                    return false;					
                }
                
                addToFavButton.innerHTML = lng.s('Добавить в избранное', 'add_to_fav');
            }
            
        }
        
        log(comments.length + ' - '+ block.id);
    }
    
    // format comments on button show with delay, until comments block will be loaded
    this.onPostCommentsShowClick = function(postBlock, clearTimer) {
        
        if (clearTimer) {
            commentsBlockTimer = false;
            clearTimeout(commentsBlockTimer[postBlock.id]);
        }
        
        if (commentsBlockTimer[postBlock.id]) return false;
        
        var commentsBlock = postBlock.getElementsByClassName('comment_list_post'); // KellyTools.getElementByClass(postBlock, 'comment_list_post'); // check is block loaded  
               
        if (!commentsBlock.length) { // todo exit after num iterations        
            commentsBlockTimer[postBlock.id] = setTimeout(function() { handler.onPostCommentsShowClick(postBlock, true); }, 100);
            return false;
        }
                       
        formatComments(postBlock);
        return false;
    }
        
    // fires when fav element preview dimensions loaded
    // also dimensions can be catched by setSelectionInfo method during Fav item addition before save
    
    this.onFavImageLoad = function(imgElement, error) {
        
        if (!error) {
        
            var favItemIndex = parseInt(imgElement.getAttribute('itemIndex'));
            if (!fav.items[favItemIndex]) {
                
                log('fav item not found ' + favItemIndex);
                // imgElement.setAttribute('error', '1');
                imgElement.style.display = 'none';
                
            } else if (!fav.items[favItemIndex].pw) {			
                
                handler.saveWH(imgElement, favItemIndex);
                // if (catAnimateGif) {
                //	var preview = getPreviewImageByItem(fav.items[favItemIndex]);
                //	imgElement.src = preview;
                // }
            }
        }
    }
        
    this.updateImageGrid = function() {
        
        imageGrid.updateConfig({tilesBlock : imagesBlock});
        imageGrid.updateTileGrid();
        
        return;		
    }
    
    this.updateOptionsConfig = function() {
    
        if (KellyTools.getElementByClass(favContent, 'kellyAutoScroll').checked) {
            fav.coptions.autoload_onscroll = true;
        } else {
            fav.coptions.autoload_onscroll = false;
        }
        
        fav.coptions.grid = {
            fixed :  KellyTools.inputVal(env.className + 'GridFixed', 'int', favContent),
            rowHeight : KellyTools.inputVal(env.className + 'GridRowHeight', 'int', favContent),
            min : KellyTools.inputVal(env.className + 'GridMin', 'int', favContent), 
            cssItem : KellyTools.inputVal(env.className + 'GridCssItem', 'string', favContent),
            heightDiff : KellyTools.inputVal(env.className + 'GridHeightDiff', 'int', favContent),
            perPage : KellyTools.inputVal(env.className + 'GridPerPage', 'int', favContent),
            type : fav.coptions.grid.type,
        };
        
        if (fav.coptions.grid.fixed < 1) {
            fav.coptions.grid.fixed = 1;
        }
        
        if (fav.coptions.grid.fixed > 10) {
            fav.coptions.grid.fixed = 10;
        }
        
        if (fav.coptions.grid.min > 10) {
            fav.coptions.grid.min = 10;
        }
        
        var refreshPosts = false;
        
        var hideSocCurrent = fav.coptions.hideSoc;
        fav.coptions.hideSoc = KellyTools.getElementByClass(favContent, env.className + 'HideSoc').checked ? true : false;
        
        if (hideSocCurrent != fav.coptions.hideSoc) {
            refreshPosts = true;
        }
        
        var fastSaveCurrent = KellyTools.getElementByClass(favContent, env.className + 'FastSaveEnabled').checked ? true : false;
        
        if (fastSaveCurrent != fav.coptions.fastsave.enabled) {
            refreshPosts = true;
        }
        
        var fconflictActions = document.getElementsByClassName(env.className + '-conflict');
        var fconflict = 'overwrite';
        
        for (var i = 0; i < fconflictActions.length; i++) {
        
            var value = KellyTools.inputVal(fconflictActions[i]);
            
            if (value && fconflictActions[i].checked && ['overwrite', 'uniquify'].indexOf(value) != -1) {
                 fconflict = fconflictActions[i].value;
            }
        }
        
        fav.coptions.fastsave = {
            baseFolder : KellyTools.inputVal(env.className + 'FastSaveBaseFolder', 'string', favContent),
            // nameTemplate : KellyTools.getElementByClass(favContent, env.className + 'FastSaveNameTemplate').value,
            enabled : fastSaveCurrent,
            check :  KellyTools.getElementByClass(favContent, env.className + 'FastSaveCheck').checked ? true : false,
            conflict : fconflict,
        };
        
        fav.coptions.debug = false;
        debug = false;
        
        if (KellyTools.getElementByClass(favContent, env.className + 'OptionsDebug').checked) {
            fav.coptions.debug = true;
            debug = true;
        }
        
        fav.coptions.newFirst = false;
        if (KellyTools.getElementByClass(favContent, env.className + 'NewFirst').checked) {
            fav.coptions.newFirst = true;
        }
        
        fav.coptions.syncByAdd = false;
        if (KellyTools.getElementByClass(favContent, env.className + 'SyncByAdd').checked) {
            fav.coptions.syncByAdd = true;
        }
        
        fav.coptions.optionsSide = false;
        if (KellyTools.getElementByClass(favContent, env.className + 'OptionsSide').checked) {
            fav.coptions.optionsSide = true;
        }
        
        var menuButton = KellyTools.getElementByClass(document, env.className + '-MainMenuItem-options');
        if (fav.coptions.optionsSide && menuButton) {            
            menuButton.parentElement.removeChild(menuButton);
            delete menuButtons['ctoptions'];
        } else if (!fav.coptions.optionsSide && !menuButton) {
            
            var optionsButton = createMainMenuButton(lng.s('Настройки', 'options'), function() { 
                                
                if (!checkSafeUpdateData()) return false;
                
                if (mode == 'ctoptions') {
                    handler.hideFavoritesBlock();
                } else {					
                    handler.showOptionsDialog();
                }
                
                return false; 
            
            }, 'options');
            
            if (optionsButton) {
                menuButtons['ctoptions'] = optionsButton.parentNode;
            }  
            
        }
        
           
        var iconFile = KellyTools.getElementByClass(favContent, 'kellyAutoScroll');
        
        if (iconFile.value) {
        
            var saveIcon = function(el, icon) {
                log(icon);
            }
            
            KellyTools.readFile(iconFile, saveIcon, 'dataurl');
        } 
                
        if (!fav.coptions.grid.rowHeight || fav.coptions.grid.rowHeight <= 0) fav.coptions.grid.rowHeight = 250;
        if (!fav.coptions.grid.min || fav.coptions.grid.min <= 0) fav.coptions.grid.min = 2;
        if (!fav.coptions.grid.heightDiff || fav.coptions.grid.heightDiff <= 0) fav.coptions.grid.heightDiff = 10;
        if (!fav.coptions.grid.perPage || fav.coptions.grid.perPage <= 0) fav.coptions.grid.perPage = 60;
        
        if (fav.coptions.grid.perPage > 1000) {
            fav.coptions.grid.perPage = 1000;
        }
        
        if (fav.coptions.grid.heightDiff > 60) {
            fav.coptions.grid.heightDiff = 60;
        }
                
        fav.coptions.comments_blacklist = KellyTools.getVarList(KellyTools.inputVal('kellyBlockcomments', 'string', favContent));
        fav.coptions.posts_blacklist = KellyTools.getVarList(KellyTools.inputVal('kellyBlockposts', 'string', favContent));
        
        var applaySave = function(msg) {
        
            handler.showOptionsDialog();
            
            if (!msg) msg = lng.s('Настройки сохранены', 'options_saved');
            
            var messageBox = document.getElementsByClassName(env.className + '-OptionsMessage');
            for (var i = 0; i < messageBox.length; i++) {
                messageBox[i].innerHTML = msg;
            }
            handler.save('cfg');
        }
        
        applaySave();	

        
        if (refreshPosts) {
            
            handler.formatPostContainers(); 
        }        
    }
    
    this.showOptionsDialog = function(tabActive) {
       
        imageGrid.updateConfig({tilesBlock : false});
        
        if (!tabActive) {
            tabActive = env.className + '-BaseOptions';
                
            var tabItems = favContent.getElementsByClassName(env.className + '-tab-item');
            for (var i = 0; i < tabItems.length; i++) {
                if (tabItems[i].className.indexOf('active') != -1) {
                    tabActive = tabItems[i].getAttribute('data-tab');
                }
            }
        }
        
        if (fav.coptions.optionsSide) {
           
            var backActionButtons = sideBarWrap.getElementsByTagName('A');
            for (var i = 0; i < backActionButtons.length; i++) {
                backActionButtons[i].onclick = function() {
                    handler.showFavouriteImages();
                    return false;
                }                
            }
            
        } else {            
            
            handler.closeSidebar();
        }
                
        // currently only one type of storage
        favContent.innerHTML = '';
        var output= '';
    
        output += '<h3>' + lng.s('Добавление в избранное', 'options_fav_add') + '</h3>';
        output += '<table class="' + env.className + '-options-table">';
      
        output += '<tr><td colspan="2"><label><input type="checkbox" value="1" class="' + env.className + 'SyncByAdd" ' + (fav.coptions.syncByAdd ? 'checked' : '') + '> ' + lng.s('Дублировать в основное избранное пользователя если авторизован', 'sync_by_add') + '</label></td></tr>';
        output += '<tr><td colspan="2"><label><input type="checkbox" value="1" class="' + env.className + 'HideSoc" ' + (fav.coptions.hideSoc ? 'checked' : '') + '> ' + lng.s('Скрывать кнопки соц. сетей из публикаций', 'hide_soc') + '</label></td></tr>';
        
        output += '</table>';
        
        output += '<h3>' + lng.s('Быстрое сохранение', 'fast_download') + '</h3>';	
        
        output += '<table class="' + env.className + '-options-table">\
            <tr><td colspan="2"><label><input type="checkbox" class="' + env.className + 'FastSaveEnabled" ' + (fav.coptions.fastsave.enabled ? 'checked' : '') + '> ' + lng.s('Показывать кнопку быстрого сохранения для публикаций', 'fast_save_enabled') + '</label></td></tr>\
            <tr><td>' + lng.s('Сохранять в папку', 'fast_save_to') + '</td><td><input type="text" class="' + env.className + 'FastSaveBaseFolder" placeholder="' + env.profile + '/Fast' + '" value="' +  fav.coptions.fastsave.baseFolder + '"></td></tr>\
            <tr class="radioselect"><td colspan="2">\
                \
                    <label><input type="radio" name="' + env.className + '-conflict" class="' + env.className + '-conflict" ' + (!fav.coptions.fastsave.conflict || fav.coptions.fastsave.conflict == 'overwrite' ? 'checked' : '') + '> \
                    ' + lng.s('Перезаписывать при совпадении имен', 'fast_save_overwrite') + '\
                    </label>\
                    <label><input type="radio" name="' + env.className + '-conflict" class="' + env.className + '-conflict" ' + (fav.coptions.fastsave.conflict == 'uniquify' ? 'checked' : '') + '> \
                    ' + lng.s('Сохранять с другим именем', 'fast_save_uniq') + '\
                    </label>\
                \
            </td></tr>\
            <tr><td colspan="2">\
                <label><input type="checkbox" value="1" class="' + env.className + 'FastSaveCheck" ' + (fav.coptions.fastsave.check ? 'checked' : '') + '> ' + lng.s('Проверять был ли уже скачан файл', 'fast_save_check') + '</label>\
                <p>' + lng.s('Если файл уже скачан ранее, к кнопке сохранения будет добавлен зеленый маркер', 'fast_save_check_notice') + '</p>\
                </td>\
            </tr>\
            <!--tr><td>Шаблон имени файла</td><td><input type="text" class="' + env.className + 'FastSaveNameTemplate" value="' +  fav.coptions.fastsave.nameTemplate + '"></td></tr-->\
        ';
        output += '</table>';
        
        output += '<h3>' + lng.s('Настройки страницы избранного', 'cgrid_tiles_header') + '</h3>';		
         
        output += '<table class="' + env.className + '-options-table"><tr><td colspan="2"><label><input type="checkbox" value="1" class="' + env.className + 'NewFirst" ' + (fav.coptions.newFirst ? 'checked' : '') + '> ' + lng.s('Новые в начало', 'cgrid_new_to_begin') + '</td></tr>';        
        output += '<tr><td>' + lng.s('Элементов на страницу', 'cgrid_per_page') + '</td> <td><input type="text" class="' + env.className + 'GridPerPage" value="' +  fav.coptions.grid.perPage + '"></td></tr>';
        
        output += '<tr><td colspan="2">' + lng.s('Режим отображения публикаций', 'cgrid_type') + '</td></tr>';
        output += '\
            <tr class="radioselect"><td colspan="2">\
                \
                    <label><input type="radio" value="dynamic" name="' + env.className + 'GridType" class="' + env.className + 'GridType" ' + (fav.coptions.grid.type == 'dynamic'  ? 'checked' : '') + '> ' + lng.s('Динамическое количество в строке', 'cgrid_type_dynamic') + '</label>\
                    <label><input type="radio" value="fixed" name="' + env.className + 'GridType" class="' + env.className + 'GridType" ' + (fav.coptions.grid.type == 'fixed'  ? 'checked' : '') + '> ' + lng.s('Фиксированое количество в строке', 'cgrid_type_fixed') + '</label>\
                \
            </td></tr>\
        ';
        
        var classRow = env.className + 'GridType-option ' + env.className + 'GridType-dynamic ';
            classRow += fav.coptions.grid.type == 'dynamic' ? 'active' : 'hidden';
                  
        output += '<tr class="' + classRow + '"><td>' + lng.s('Максимальная высота одной строки', 'cgrid_max_row_height') + ' (px)</td> <td><input type="text" class="' + env.className + 'GridRowHeight" value="' +  fav.coptions.grid.rowHeight + '"></td></tr>';
        output += '<tr class="' + classRow + '"><td>' + lng.s('Допустимая погрешность высоты строки', 'cgrid_max_diff') + ' (%)</td> <td><input type="text" class="' + env.className + 'GridHeightDiff" value="' +  fav.coptions.grid.heightDiff + '"></td></tr>';
        output += '<tr class="' + classRow + '"><td>' + lng.s('Минимальное кол-во элементов в строке', 'cgrid_min_number') + '</td> <td><input type="text" class="' + env.className + 'GridMin" value="' +  fav.coptions.grid.min + '"></td></tr>';
            
            classRow = env.className + 'GridType-option ' + env.className + 'GridType-fixed ';
            classRow += fav.coptions.grid.type && fav.coptions.grid.type == 'fixed' ? 'active' : 'hidden';
            
        output += '<tr class="' + classRow + '"><td>' + lng.s('Фиксированное кол-во элементов на строку', 'cgrid_fixed') + '</td> <td><input type="text" class="' + env.className + 'GridFixed" value="' +  (!fav.coptions.grid.fixed ? '4' : fav.coptions.grid.fixed) + '"></td></tr>';
        
        output += '<tr><td>' + lng.s('Стиль по умолчанию для элемента строки', 'cgrid_default_rowst') + '</td> <td><input type="text" class="' + env.className + 'GridCssItem" value="' +  fav.coptions.grid.cssItem + '"></td></tr>';
        
        /*
        output += '<tr><td colspan="2"><h3>Кнопка меню</h3></td></tr>';	

        output += '<tr><td>Иконка :</td><td>';
        
        if (!fav.coptions.icon) {
            output += '<div class="' + env.className + '-icon ' + env.className + '-icon-diskete" style="position : static; display : inline-block;"></div>';
        } else {
            output += '<div class="' + env.className + '-icon" style="' + fav.coptions.icon + '"></div>';
        }
        
        output += '<input type="file" class="' + env.className + 'Icon"></td></td>';		
        */        
        output += '</table>';
                
        output += '<div><input type="submit" value="' + lng.s('Сохранить', 'save') + '" class="' + env.className + '-OptionsSave"></div>';
        output += '<div class="' + env.className + '-OptionsMessage"></div>';       
        
        var tabControlls = document.createElement('DIV');
            tabControlls.innerHTML = '\
            <div class="' + env.className + '-tab-list">\
                <ul>\
                    <li data-tab="' + env.className + '-BaseOptions" class="' + env.className + '-tab-item ' + env.className + '-buttoncolor-dynamic" >\
                        <a href="#" >' + lng.s('Основные настройки', 'options_main') + '</a>\
                    </li>\
                    <li data-tab="' + env.className + '-Storage" class="' + env.className + '-tab-item ' + env.className + '-buttoncolor-dynamic" >\
                        <a href="#">' + lng.s('Данные', 'storage') + '</a>\
                    </li>\
                    <li data-tab="' + env.className + '-Other" class="' + env.className + '-tab-item ' + env.className + '-buttoncolor-dynamic" >\
                        <a href="#" >' + lng.s('Остальное', 'other') + '</a>\
                    </li>\
                </ul>\
            </div>';
        
        var tabBaseOptions = document.createElement('DIV');
            tabBaseOptions.innerHTML = output;
            tabBaseOptions.className = env.className + '-tab ' + env.className + '-BaseOptions';		
            
        var tabStorage = document.createElement('DIV');
            tabStorage.innerHTML = '';
            tabStorage.className = env.className + '-tab ' + env.className + '-Storage';
            
        var tabOther = document.createElement('DIV');
            tabOther.className = env.className + '-tab ' + env.className + '-Other';
            
        favContent.appendChild(tabControlls);
        favContent.appendChild(tabBaseOptions);
        favContent.appendChild(tabStorage);
        favContent.appendChild(tabOther);

        var gridType = favContent.getElementsByClassName(env.className + 'GridType');
        if (gridType) {
            for (var i = 0; i < gridType.length; i++) {
            
                gridType[i].onclick = function() {
                
                    fav.coptions.grid.type = this.value;
                    
                    if (!fav.coptions.grid.type ||  fav.coptions.grid.type == 'dynamic') {
                         fav.coptions.grid.type = 'dynamic';
                    } else {
                         fav.coptions.grid.type = 'fixed';
                    }
                    
                    var typeOptionList = favContent.getElementsByClassName(env.className + 'GridType-option');
                    if (typeOptionList) {
                        for (var i = 0; i < typeOptionList.length; i++) {
                        
                            if (typeOptionList[i].className.indexOf(fav.coptions.grid.type) == -1) {
                                typeOptionList[i].className = typeOptionList[i].className.replace('active', 'hidden');
                            } else {
                                typeOptionList[i].className = typeOptionList[i].className.replace('hidden', 'active');
                            }
                        }
                    }
                }
            }
        }
            
        var tabMenuItems = tabControlls.getElementsByClassName(env.className + '-tab-item');
        for (var i = 0; i < tabMenuItems.length; i++) {
            var tabEl = KellyTools.getElementByClass(favContent, tabMenuItems[i].getAttribute('data-tab'));
            if (!tabEl) continue;
            
            if (tabMenuItems[i].getAttribute('data-tab').indexOf(tabActive) != -1) {
                tabMenuItems[i].className += ' active';
                tabEl.style.display = 'block';
            } else {
                tabEl.style.display = 'none';
            }
            
            tabMenuItems[i].onclick = function() {
            
                for (var i = 0; i < tabMenuItems.length; i++) {
                    tabMenuItems[i].className = tabMenuItems[i].className.replace('active', '').trim();
                    KellyTools.getElementByClass(favContent, tabMenuItems[i].getAttribute('data-tab')).style.display = 'none';
                }
                
                KellyTools.getElementByClass(favContent, this.getAttribute('data-tab')).style.display = 'block';
                this.className += ' active';
                
                var messageBox = document.getElementsByClassName(env.className + '-OptionsMessage');
                for (var i = 0; i < messageBox.length; i++) {
                    messageBox[i].innerHTML = '';
                }
                return false;
            }
        }			
        
        output = '';  
            
        output += '<table>';
        
        output += '<tr><td colspan="2"><label><input type="checkbox" value="1" class="' + env.className + 'OptionsSide" ' + (fav.coptions.optionsSide ? 'checked' : '') + '> \
               ' + lng.s('Перенести кнопку настроек из основного в боковое меню фильтров', 'options_side') + '</label></td></tr>';
       
        output += '<tr><td>' + lng.s('Игнорировать комментарии', 'ignore_comments') + ' :</td>\
                        <td><input type="text" class="kellyBlockcomments" value="' + KellyTools.varListToStr(fav.coptions.comments_blacklist) + '"></td>\
                   </tr>';
        output += '<tr><td>' + lng.s('Игнорировать посты', 'ignore_publications') + ' :</td>\
                        <td><input type="text" class="kellyBlockposts" value="' + KellyTools.varListToStr(fav.coptions.posts_blacklist) + '"></td>\
                   </tr>';
        output += '<tr><td colspan="2"><label><input type="checkbox" class="' + env.className + 'OptionsDebug" ' + (debug ? 'checked' : '') + '> ' + lng.s('Режим отладки', 'debug') + '</label></td></tr>';
        output += '<tr><td colspan="2"><label>' + lng.s('Версия', 'ext_ver') + ' : ' + handler.PROGNAME + '</label></td></tr>';
                  
        output += '</table>';
        output += '<div><input type="submit" value="' + lng.s('Сохранить', 'save') + '" class="' + env.className + '-OptionsSave"></div>';
        output += '<div class="' + env.className + '-OptionsMessage"></div>';    
        
        tabOther.innerHTML = output;
                
        handler.getStorageManager().wrap = tabStorage;
        handler.getStorageManager().showDBManager();
        
        var saveButtons = document.getElementsByClassName(env.className + '-OptionsSave');
        for (var i = 0; i < saveButtons.length; i++) {
            saveButtons[i].onclick = function() {
                handler.updateOptionsConfig();
                return false;
            }
        }
        
        displayFavouritesBlock('ctoptions');
        
        var message = {};

        for (var k in KellyLoc.locs) {
            message[k] = {message : KellyLoc.locs[k]}
        }
    }
    
    this.addExtendCats = function(itemIndex, remove) {
        
        if (!fav.categories[itemIndex]) return false;
        
        var category = fav.categories[itemIndex];        
        if (category.id == -1) return false;
        
        var catIndex = extendCats.indexOf(category.id);
        if (catIndex != -1 && !remove) return false;
        if (catIndex == -1 && remove) return false;
        
        if (remove) extendCats.splice(catIndex, 1);
        else {
            extendCats[extendCats.length] = category.id;
        }

        var tag = document.getElementById(env.className + '-extend-filter-' + category.id);
        if (tag) {
            tag.className = tag.className.replace('includable', '');	
            if (!remove) tag.className += ' includable';
            tag.className = tag.className.trim();
        }
        
        return true;
    }
    
    function updatePostCatList(index, list) {
            
        list.innerHTML = '';
        
        if (fav.items[index].categoryId) {
        
            for (var b = 0; b < fav.items[index].categoryId.length; b++) {
                
                var tagItem = document.createElement('li');
                var category = handler.getStorageManager().getCategoryById(fav, fav.items[index].categoryId[b]);
                var spanName = document.createElement('span');
                    spanName.innerHTML = category.name;
                
                list.appendChild(spanName);
                
                var removeBtn = document.createElement('a');
                    removeBtn.innerHTML = lng.s('Удалить', 'delete');
                    removeBtn.href = '#';
                    removeBtn.setAttribute('itemIndex', index);
                    removeBtn.setAttribute('catId', category.id);
                    
                    removeBtn.onclick = function() {
                        
                        handler.removeCatFromPost(parseInt(this.getAttribute('itemIndex')), parseInt(this.getAttribute('catId')));
                        
                        return false;
                    }
                    
                tagItem.appendChild(spanName); 
                tagItem.appendChild(removeBtn);
                list.appendChild(tagItem);    
                
            }
        }
    }
    
    this.removeCatFromPost = function(postIndex, catId) {
        
        if (!fav.items[postIndex]) return false;
        
        var index = fav.items[postIndex].categoryId.indexOf(catId);
        if (index != -1) {        
            fav.items[postIndex].categoryId.splice(index, 1);
        }
        
        fav.items[postIndex].categoryId = validateCategories(fav.items[postIndex].categoryId);
        
        var list = document.getElementById(env.className + '-cat-list-post' + postIndex);
        
        if (list) {
            updatePostCatList(postIndex, list);
        }
        
        handler.save('items');
    } 
    
    this.addCatsForPost = function(index) {
        
        if (!extendCats.length) return false
        
        if (!fav.items[index]) return false;
        
        for (var i = 0; i < extendCats.length; i++) {
        
            if (fav.items[index].categoryId.indexOf(extendCats[i]) != -1) continue;
            
            fav.items[index].categoryId[fav.items[index].categoryId.length] = parseInt(extendCats[i]);
        }
        
        fav.items[index].categoryId = validateCategories(fav.items[index].categoryId);
        
        var list = document.getElementById(env.className + '-cat-list-post' + index)
        
        if (list) {
            updatePostCatList(index, list);
        }
        
        handler.save('items');
    } 
    
    this.toogleFilter = function(el) {
        
        if (!el) return;
        var filterId = parseInt(el.getAttribute('filterId'));
        
        var filter = handler.getStorageManager().getCategoryById(fav, filterId);
        if (filter.id == -1) return false;
        
        page = 1;
        
        if (el.className.indexOf('active') !== -1) {
            el.className = el.className.replace('active', '');
            el.className = el.className.replace('activeIgnore', '');
            
            var index = catFilters.indexOf(filter.id);
            if (index != -1) catFilters.splice(index, 1);
            index = catIgnoreFilters.indexOf(filter.id); 
            if (index != -1) catIgnoreFilters.splice(index, 1);
            
        } else {
            el.className += ' active';
            if (!catFilterNot) {
                catFilters[catFilters.length] = filter.id;
            } else {
                el.className += ' activeIgnore';
                catIgnoreFilters[catIgnoreFilters.length] = filter.id;
            }
        }
        
        
    }
    
    function getPreviewImageByItem(item, full) {
        if (!item || !item.pImage) return '';        
        
        if (typeof item.pImage == 'string') {
            if (item.pImage.trim() !== '') return env.getImageDownloadLink(item.pImage, full);            
        } else {
            if (item.pImage.length) return env.getImageDownloadLink(item.pImage[0], full);
        }
        
        return '';
    }
    
    function showItemInfoTooltip(index, target) {
    
        if (!fav.items[index]) return;
        
        var tooltipEl = handler.getTooltip();
            tooltipEl.updateCfg({
                target : target, 
                offset : {left : 0, top : 0}, 
                positionY : 'bottom',
                positionX : 'left',				
                ptypeX : 'inside',
                ptypeY : 'outside',
            });
            
        var item = fav.items[index];
        
        var baseClass = env.className + '-tooltipster-ItemInfo';
        
        // блок дополнительной информации о публикации со списком категорий
        var itemInfo = document.createElement('div');
            itemInfo.className = baseClass;
            itemInfo.id = baseClass + '-' + index;
            itemInfo.innerHTML = ''; 
            
            if (item.commentLink) {
            
                itemInfo.innerHTML += '<a href="' + item.commentLink + '" target="_blank">' + lng.s('Показать комментарий', 'go_to_comment') + '</a><br>'
            
            }
            
        var removeItem = document.createElement('a');
            removeItem.setAttribute('itemIndex', index);		
            removeItem.onclick = function() { 
            
                var updateFavPage = function() { handler.showFavouriteImages(); };
                handler.showRemoveFromFavDialog(this.getAttribute('itemIndex'), updateFavPage, updateFavPage, updateFavPage);
                
                return false; 
            }
            
            removeItem.innerHTML = lng.s('Удалить', 'delete');
            removeItem.href = '#';
            removeItem.style.display = 'block';

        itemInfo.appendChild(removeItem);
         
        var addCats = document.createElement('a');
            addCats.href = '#';
            addCats.innerHTML = lng.s('Добавить отмеченые категории', 'add_selected_cats'); 
            addCats.setAttribute('itemIndex', index);
            addCats.onclick = function() {
                handler.addCatsForPost(parseInt(this.getAttribute('itemIndex')));
                
                return false;
            }
                            
        itemInfo.appendChild(addCats);
        
        var catList = document.createElement('ul');
            catList.id = env.className + '-cat-list-post' + index;
            catList.className = baseClass + "-tags";
    
        updatePostCatList(index, catList);
            
        itemInfo.appendChild(catList);
        
        var container = tooltipEl.getContent();
            container.innerHTML = '';
        
        container.appendChild(itemInfo);
            
        tooltipEl.show(true);
    }
    
    function updateDisplayItemsList() {

        displayedItems = []; // все элементы попавшие в выборку
        
        // applay filters 
        
        for (var i = fav.coptions.newFirst ? fav.items.length-1 : 0; fav.coptions.newFirst ? i >= 0 : i < fav.items.length; fav.coptions.newFirst ? i-- : i++) {
                               
            if (excludeFavPosts && !fav.items[i].commentLink) continue;
            if (excludeFavComments && fav.items[i].commentLink) continue;            
            if (imagesAsDownloadItems && !getPreviewImageByItem(fav.items[i])) continue;
            
            if (catIgnoreFilters && catIgnoreFilters.length) {
                var ignore = false;
                for (var b = 0; b < catIgnoreFilters.length; b++) {
                
                    if (fav.items[i].categoryId.indexOf(catIgnoreFilters[b]) !== -1) { 
                        ignore = true;
                        break;
                    }
                }
                
                if (ignore) continue;
            }
            
            if (catFilters && catFilters.length) {
            
                if (!fav.items[i].categoryId || !fav.items[i].categoryId.length) continue;
                
                var filterMatched = 0;
                
                for (var b = 0; b < catFilters.length; b++) {
                
                    if (fav.items[i].categoryId.indexOf(catFilters[b]) !== -1) { 
                    
                        filterMatched++; 
                        
                        if (logic == 'or') break;                     
                    }
                }

                if (logic == 'or' && !filterMatched) continue;
                if (logic == 'and' && filterMatched != catFilters.length) continue;
            }
            
            // output
            
            displayedItems[displayedItems.length] = i;
        
        }   
        
        galleryImages = [];
        galleryImagesData = [];
        
        for (var i = 0; i <= displayedItems.length-1; i++) {
        
            var item = fav.items[displayedItems[i]];
            var previewImage = getPreviewImageByItem(item);
            
            // whole gallery images array for current selector
            
            if (previewImage) {
            
                var galleryIndex = galleryImages.length;
                
                    galleryImages[galleryIndex] = previewImage;
                    galleryImagesData[galleryIndex] = item;           
            }
        }
        
    }
      
    function updateFilteredData() {

        if (!checkSafeUpdateData()) {
            return false;
        }
        
        displayedItems = false;
                
        updateDisplayItemsList();
        
        if (imagesAsDownloadItems) {
            
            handler.getDownloadManager().setDownloadTasks(displayedItems);
            handler.getDownloadManager().showGrabManager();
        }
        
        // init gallery only for current page
        // create gallery, by array
        imgViewer.addToGallery(galleryImages, 'fav-images', galleryImagesData);  
    }
    
    this.downloadFilteredData = function(format) { // todo format
        
        if (!displayedItems || !displayedItems.length) return false;
        
        var storage = handler.getStorageManager().getDefaultData();       
            storage.ids = fav.ids;
            storage.categories = [];
        
        // revers order (first added to array will count as "oldes")
        for (var i = displayedItems.length-1; i >= 0; i--) {
            
            var item = fav.items[displayedItems[i]];
            var itemCats = item.categoryId;
            
            if (itemCats) {
                for (var c = 0; c < itemCats.length; c++) {
                    if (handler.getStorageManager().getCategoryById(storage, itemCats[c]).id == -1) {
                        storage.categories[storage.categories.length] = handler.getStorageManager().getCategoryById(fav, itemCats[c]);
                    }                    
                }	
            }

            storage.items[storage.items.length] = item;			
        }
  
        var fname = env.profile + '/Storage/FilteredFavourites/';
            fname += fav.coptions.storage + '_filtered_' + KellyTools.getTimeStamp() + '.' + handler.getStorageManager().format;
            fname = KellyTools.validateFolderPath(fname);
            
        KellyTools.createAndDownloadFile(JSON.stringify(storage), fname);
        return true;
    }
    
    function showItem(item, subItem) {
        
        if (!item) return false;
        
        if (typeof item.pImage !== 'string') {
            subItem = subItem <= item.pImage.length-1 ? subItem : 0;
        } else subItem = 0;
        
        var previewImage = getPreviewImageByItem(item);
        
        var index = fav.items.indexOf(item);
           
        var itemBlock = document.createElement('div');
            itemBlock.className = env.className + '-FavItem ';			
            itemBlock.id = env.className + '-FavItem-' + item.id;
            
        if (subItem) {
            itemBlock.id += '-' + subItem;
            previewImage = env.getImageDownloadLink(item.pImage[subItem], false);
        }
                            
        var collectionBtn = false;
        var imageCount = 0;
                    
        itemBlock.setAttribute('itemIndex', index);
        
        if (!previewImage) {
            
            var freeSpace = 250;
            
            var text = (!item.name && !item.text) ? '<div class="' + env.className + '-preview-text-noimage">' + lng.s('Без изображения', 'no_image') + '</div>' : '';
            
            if (item.name) {
                freeSpace -= item.name.length;
                text += '<div class="' + env.className + '-preview-text-name">' + item.name + '</div>';
            }
            
            if (freeSpace > 0 && item.text) {
                var ctext = item.text.length > freeSpace ? value.substring(0, freeSpace) + '...' : item.text;
                text += '<div class="' + env.className + '-preview-text-ctext">' + item.text + '</div>';
            }
                                  
            var size = Math.ceil(text.length / 100) * 50;
            
            //itemBlock.setAttribute('data-width', size);
            
            itemBlock.innerHTML = '\
                <div style="' + fav.coptions.grid.cssItem + '" class="' + env.className + '-preview" data-width="'+size+'" itemIndex="' + index + '">\
                    <div class="' + env.className + '-preview-text">' + text + '</div>\
                </div>\
            ';
            
        } else {
            
            var pInfo = '';
            if (item.pw && !subItem) { // no proportions info for sub items currently
                pInfo = ' data-width="' + item.pw + '" data-height="' + item.ph + '" ';
            }                
            
            //if (item.pw) {
            //	itemBlock.setAttribute('data-width', item.pw);
            //	itemBlock.setAttribute('data-height', item.ph);
            //}
            
            imageCount = 1;
            
            if (typeof item.pImage !== 'string') imageCount = item.pImage.length;
            
            var additionAtributes = '';
            
            if (subItem) {
                additionAtributes += ' subItem="' + subItem + '" ';
            }
            
            // multi image list
            if (imageCount > 1) {
            
                additionAtributes += ' data-images="' + imageCount + '" ';
                
                // todo button to explode collection 
                
                collectionBtn = document.createElement('a');
                collectionBtn.innerHTML = imageCount;
                collectionBtn.href = item.pImage[0];
                collectionBtn.className = env.className + '-FavItem-collection';
                
                collectionBtn.setAttribute('kellyGallery', 'collection');
                collectionBtn.setAttribute('kellyGalleryIndex', 0);
                collectionBtn.setAttribute('itemIndex', index);
                
                collectionBtn.onclick = function() {
                
                    var item = fav.items[this.getAttribute('itemIndex')];
                                            
                    imgViewer.addToGallery(item.pImage, 'collection', item);
                    imgViewer.loadImage(this);   
                    
                    return false;
                }
                
            }
            // todo replace
            //env.getImageDownloadLink(galleryImages[galleryIndex], true)
            
            if (!fav.coptions.animateGif || !item.pw) previewImage = env.getStaticImage(previewImage);
            
            itemBlock.innerHTML = '\
                <img style="' + fav.coptions.grid.cssItem + '" \
                     class="' + env.className + '-preview" \
                     kellyGalleryIndex="' + (galleryImagesData.indexOf(item) + subItem) + '" \
                     kellyGallery="fav-images" \
                     itemIndex="' + index + '"' + pInfo + additionAtributes + '\
                     src="' + previewImage + '" \
                >';
        
        }
        
        if (!imagesAsDownloadItems) {
        
            var postLink = document.createElement('a');
                postLink.href = item.commentLink ? item.commentLink : item.link;
                postLink.className = env.className + '-FavItem-overlay-button';
                postLink.innerHTML = item.commentLink ? lng.s('Комментарий', 'comment') : lng.s('Публикация', 'publication'); 
                postLink.setAttribute('target', '_blank');
            
            var postHd = false;
            
            if (imageCount > 0) {
            
                postHd = document.createElement('a');
                postHd.href = '#';
                postHd.className = env.className + '-FavItem-overlay-button ' + env.className + '-FavItem-overlay-button-bottom';
                postHd.innerHTML = 'HD'; 
                
                
                if (imageCount > 1) {
                    postHd.innerHTML = 'HDs'; 
                }
                
                postHd.setAttribute('kellyGallery', 'hdsource');
                postHd.setAttribute('kellyGalleryIndex', 0);
                postHd.setAttribute('itemIndex', index);
                
                postHd.onclick = function() {
                    
                    var index = this.getAttribute('itemIndex');
                    
                    var imageSet = [];
                    
                    if (typeof fav.items[index].pImage != 'string') {
                        
                        for (var b = 0; b < fav.items[index].pImage.length; b++) {
                            
                            imageSet[imageSet.length] = env.getImageDownloadLink(fav.items[index].pImage[b], true);
                        }
                        
                    } else {
                        
                        imageSet[imageSet.length] = env.getImageDownloadLink(fav.items[index].pImage, true);
                    }
                    
                    imgViewer.addToGallery(imageSet, 'hdsource', fav.items[index]);
                    imgViewer.loadImage(this);   
                    
                    return false;
                }
            }			
            
            var itemBlockAdditions = document.createElement('DIV');
                itemBlockAdditions.className = env.className + '-FavItem-additions';
                
            if (collectionBtn) itemBlockAdditions.appendChild(collectionBtn);
            
            itemBlock.appendChild(itemBlockAdditions);        
            itemBlock.onmouseover = function(e) {                
                
                if (readOnly) return false;
                
                var itemIndex = this.getAttribute('itemIndex');
                showItemInfoTooltip(this.getAttribute('itemIndex'), this);
            }  
                
            itemBlock.onmouseout = function(e) {    
                
                if (readOnly) return false;
                var related = e.toElement || e.relatedTarget;
                if (handler.getTooltip().isChild(related)) return;
                    
                handler.getTooltip().show(false);
            }  
        
            itemBlock.appendChild(postLink);
            if (postHd) itemBlock.appendChild(postHd);
        }
        
        imagesBlock.appendChild(itemBlock);
    }
    
    // noClear - add to show list (on move to next page for example)
    
    this.updateImagesBlock = function(noClear) {
        
        if (!imagesBlock) return false;
        if (!fav.items.length) {
            imagesBlock.innerHTML = lng.s('Список избранных публикаций пуст', 'fav_list_empty');
            return false;
        }
        
        // clear elements if update during page listing
        if (!noClear) {
            while (imagesBlock.firstChild) {
                imagesBlock.removeChild(imagesBlock.firstChild);
            }
        }
        
        var startItem = (page - 1) * fav.coptions.grid.perPage;
        var end = startItem + fav.coptions.grid.perPage - 1;         
        if (end > displayedItems.length-1) end = displayedItems.length-1;
              
        log('show start : ' + startItem + ' | end : ' + end + ' | total : ' + displayedItems.length);
    
        for (var i = startItem; i <= end; i++) {
            showItem(fav.items[displayedItems[i]]);
        }
        
        if (imagesAsDownloadItems) {
            handler.getDownloadManager().updateStateForImageGrid(imagesBlock);
        }
        
        // connect events to current image elements
        var galleryEl = imagesBlock.getElementsByTagName('img');
        
        for (var i = 0, l = galleryEl.length; i < l; i++)  {
            galleryEl[i].onclick = function() {
                imgViewer.loadImage(this);
                return false;
            }
        }
        
        updatePagination(document.getElementById(env.className + '-pagination'));
     
        return true;
    }
              
    function getSelectedPostMediaControlls() {

        var controlls = document.createElement('DIV');
            controlls.className = env.className + '-ModalBox-PreviewContainer active';
        
        var img = '';
        
        if (selectedImages.length > 1) {
            img += '<p>' + lng.s('Основное изображение', 'image_main') + '</p>' +
                   '<p class="' + env.className + '-ModalBox-controll-buttons">' + 
                   '<a href="#" class="' + env.className + '-PreviewImage-del">' + lng.s('Удалить', 'delete')  + '</a><a href="#" class="' + env.className + '-PreviewImage-prev">\
                    ' + lng.s('Предыдущее', 'prev') + '</a><a href="#" class="' + env.className + '-PreviewImage-next">' + lng.s('Следующее', 'next')  + '</a>' +
                    '</p>';
        }
        
        if (selectedImages.length) {
            
            img += '<div class="' + env.className + '-PreviewImage-container"><img src="' + env.getStaticImage(selectedImages[0]) + '" class="' + env.className + '-PreviewImage"></div>';
        }
        
        controlls.innerHTML = img;
        
        KellyTools.getElementByClass(controlls, env.className + '-PreviewImage-prev').onclick = function() { handler.switchPreviewImage(-1); return false; }
        KellyTools.getElementByClass(controlls, env.className + '-PreviewImage-next').onclick = function() { handler.switchPreviewImage(1); return false; }
        KellyTools.getElementByClass(controlls, env.className + '-PreviewImage-del').onclick = function() { handler.switchPreviewImage(0); return false; }
        
        
        KellyTools.getElementByClass(controlls, env.className + '-PreviewImage').onload = function() {
            
            var dimensions = {width : parseInt(this.naturalWidth), height : parseInt(this.naturalHeight)};
            
            // dont overwrite trusted proportions
            if (selectedInfo && selectedInfo['dimensions'] && selectedInfo['dimensions'].width && selectedInfo['dimensions'].schemaOrg) return false;
                            
            handler.setSelectionInfo('dimensions', dimensions);
            
            // console.log('get width and height for ' + this.src);
            // console.log(dimensions);
            
            updateSidebarPosition(); 
            /*handler.saveWH(this, false);*/ 
            return false; 
        }
        
        return controlls;
    }
        
    function showCategoryCreateTooltip(target) {
        
        var tooltipEl = handler.getTooltip();
            tooltipEl.updateCfg({
                target : target, 
                offset : {left : 0, top : 0}, 
                positionY : 'bottom',
                positionX : 'left',
                ptypeX : 'inside',                
                ptypeY : 'outside',
            });
        
        html = '\
            <div class="' + env.className + 'CatAddForm">\
                <div>\
                    <input type="text" placeholder="' + lng.s('Название новой категории', 'cat_name') + '" value="" class="' + env.className + 'CatName"><br>\
                    <input type="text" placeholder="' + lng.s('Приоритет', 'cat_order') + '" value="" class="' + env.className + 'CatOrder"><br>\
                    <a href="#" class="' + env.className + 'CatCreate">' + lng.s('Создать категорию', 'cat_create') + '</a>\
                </div>\
            </div>';
        
        var container = tooltipEl.getContent();
            container.innerHTML = html;
        
        KellyTools.getElementByClass(container, env.className + 'CatCreate').onclick = function () { 
            if (handler.categoryCreate(container)) {
                
                // handler.showFavouriteImages();
                showCatList();
            }

            return false; 
        }
        
        tooltipEl.show(true, 'categoryCreate');
    }
    
    this.resetFilterSettings = function() {    
        page = 1;
        catFilters = [];
        catIgnoreFilters = [];
        extendCats = [];
    }
    
    function showCategoryControllTooltip(id, target) {
        
        var category = handler.getStorageManager().getCategoryById(fav, id);                
        if (category.id == -1) return false;
        
        var tooltipEl = handler.getTooltip();
            tooltipEl.updateCfg({
                target : target, 
                offset : {left : 0, top : 0}, 
                positionY : 'bottom',
                positionX : 'left',
                ptypeX : 'inside',                
                ptypeY : 'outside',
            });
        
        // Edit mode add to image check
        var filterChecked = '';
        if (extendCats.indexOf(category.id) != -1) {
            filterChecked = 'checked';
        }
        
        var isNSFWChecked = '';
        if (category.nsfw) isNSFWChecked = 'checked';
        // todo показывать кол-во элементов
        
        var baseClass = env.className + '-FiltersMenu';
        
        var deleteButtonHtml = '';
        if (!category.protect) {
            deleteButtonHtml += ' <a class="' + baseClass + '-delete-button" href="#">' + lng.s('Удалить', 'delete') + '</a>';
        }
        
        var itemIndex = fav.categories.indexOf(category);
        
        var html = '\
        <div class="' + baseClass + '-tooltip">\
            <label><input class="' + baseClass + '-check" type="checkbox" ' + filterChecked + '> ' + lng.s('Добавить к изображению', 'add_to_item') + '</label>\
            <label><input class="' + baseClass + '-nsfw" type="checkbox" ' + isNSFWChecked + '> NSFW </label>\
            <p>' + lng.s('Новое название', 'new_name') + '</p>\
            <input class="' + baseClass + '-newname" type="text" value="' + category.name + '" placeholder="' + lng.s('Новое название', 'new_name') + '">\
            <p class="' + baseClass + '-order-buttons">' + lng.s('Приоритет', 'cat_order') + '\
            <a href="#" class="' + env.className + '-neworder-up">&#9650;</a><a href="#" class="' + env.className + '-neworder-down">&#9660;</a></p>\
            <!--input class="' + baseClass + '-neworder" type="text" value="' + (!category.order ? itemIndex : category.order) + '" placeholder="' + lng.s('Приоритет', 'cat_order') + '"-->\
            <br>\
            <a class="' + baseClass + '-newname-button" href="#">' + lng.s('Применить', 'change') + '</a>\
            ' + deleteButtonHtml + '\
        </div>';
        
        var container = tooltipEl.getContent();
            container.innerHTML = html;
        
        var flushCatButton = function() {            
            setTimeout(function() {
                var filterButton = document.getElementById(env.className + '-extend-filter-' + category.id); 
                
                if (filterButton && filterButton.className.indexOf('flush') == -1) {
                    filterButton.className += ' flush';
                    setTimeout(function() {
                        filterButton.className = filterButton.className.replace('flush', '').trim();             
                    }, 300);
                } 
            }, 100);
        }
        
        var changeCatOrder = function(el, up) {
        
                itemIndex = handler.getStorageManager().categoryOrder(fav.categories, itemIndex, up);
                showCatList();
                flushCatButton();
            }
        
        var orderChangeUp = KellyTools.getElementByClass(container, env.className + '-neworder-up');
            orderChangeUp.onclick = function() {
                changeCatOrder(this, true);
                return false;
            }
            
        var orderChangeDown = KellyTools.getElementByClass(container, env.className + '-neworder-down');
            orderChangeDown.onclick = function() {
                changeCatOrder(this, false);
                return false;
            }

        var renameButton = KellyTools.getElementByClass(container, baseClass + '-newname-button');
            renameButton.onclick = function () {
                
                var editCat = {
                
                    name : KellyTools.inputVal(baseClass + '-newname', 'string', container),
                    nsfw : KellyTools.getElementByClass(container, baseClass + '-nsfw').checked,
                    // order : parseInt(document.getElementById('kelly-filter-neworder-' + itemIndex).value),
                    
                }
                
                var result = handler.categoryEdit(editCat, itemIndex);
                if (!result) return false;
                
                showCatList();                
                flushCatButton();
                // handler.showSidebarMessage('Изменения применены');
                return false;
            }

        if (!category.protect) {
            var deleteButton = KellyTools.getElementByClass(container, baseClass + '-delete-button');
                deleteButton.onclick = function () {
                
                    var updateFavPage = function() { 
                        
                        // after delete validated, test that, reset unnecessary
                        handler.resetFilterSettings();
                        
                        handler.showFavouriteImages(); 
                    };
                    
                    handler.showRemoveCategoryDialog(itemIndex, updateFavPage, updateFavPage);
                    return false;
                }
        }
        
        var catExtender = KellyTools.getElementByClass(container, baseClass + '-check'); 
            catExtender.onclick = function() { 
                var remove = true;
                if (this.checked) remove = false;
                
                handler.addExtendCats(itemIndex, remove); 
            }
            
        tooltipEl.show(true, 'categoryEdit');
    }
    
    function showCatList(list) {
        
        if (!list) {
            list = KellyTools.getElementByClass(modalBoxContent, env.className + '-FiltersMenu');
        }
        
        if (!list) return false;
        
        list.innerHTML = '';
        
        handler.getStorageManager().sortCategories(fav.categories);
        
        for (var i = 0; i < fav.categories.length; i++) {
    
            var filter = document.createElement('li');
                filter.id = env.className + '-extend-filter-' + fav.categories[i].id;
                filter.setAttribute('itemId', fav.categories[i].id);
                   
                // Edit mode add to image check
                if (extendCats.indexOf(fav.categories[i].id) != -1) {
                    filter.className += ' includable';
                }
            
                filter.onmouseover = function (e) { 
                
                    if (readOnly) return false; 
                    showCategoryControllTooltip(this.getAttribute('itemId'), this);    
                }
                
                filter.onmouseout = function(e) {
                
                    if (readOnly) return false;
                    
                    var related = e.toElement || e.relatedTarget;
                    if (handler.getTooltip().isChild(related)) return;
                    
                    handler.getTooltip().show(false);
                }
                          
            // filter.onclick
            
            var catSelector = document.createElement('a');
                catSelector.innerHTML = fav.categories[i].name;
                catSelector.href = '#';
                catSelector.setAttribute('filterId', fav.categories[i].id);
                
                var catSelectorActive = '';	
                
                     if (catFilters.indexOf(fav.categories[i].id) != -1) catSelectorActive = 'active';
                else if (catIgnoreFilters.indexOf(fav.categories[i].id) != -1) catSelectorActive = 'activeIgnore';
                
                catSelector.className = catSelectorActive;
                catSelector.onclick = function() {
                
                    if (!checkSafeUpdateData()) return false;
                    handler.toogleFilter(this); 
                                        
                    updateFilteredData();
                    
                    handler.updateImagesBlock();
                    handler.updateImageGrid();
                    
                    return false;
                }
          
            
            filter.appendChild(catSelector);
            //filter.appendChild(catExtender);
            list.appendChild(filter);
                
        }
                
        var filterAdd = document.createElement('li');
            filterAdd.className = env.className + '-filters-CatCreate';

            if (readOnly) filterAdd.style.display = 'none';
            
            filterAdd.innerHTML = '<a href="#" onclick="return false;">+</a>';
            
            filterAdd.onmouseover = function (e) { 
                showCategoryCreateTooltip(this);    
            }
            
            filterAdd.onmouseout = function(e) {
            
                var related = e.toElement || e.relatedTarget;
                if (handler.getTooltip().isChild(related)) return;
                
                handler.getTooltip().show(false);
            }
        
            list.appendChild(filterAdd);	

        return true;
    }
    
    this.ignoreNSFW = function() {
                                
        for (var i = 0; i < fav.categories.length; i++) {
            if (fav.categories[i].nsfw) {
                if (catIgnoreFilters.indexOf(fav.categories[i].id) == -1) {
                    catIgnoreFilters[catIgnoreFilters.length] = fav.categories[i].id;
                }
                
                var catIndex = catFilters.indexOf(fav.categories[i].id);
                if (catIndex != -1) catFilters.splice(catIndex, 1);
            }
        }  			
        
    }
    
    function checkSafeUpdateData() {
    
        if (handler.getDownloadManager().getState() != 'wait') {
            handler.showSidebarMessage('Перед выполнением действия необходимо остановить загрузку данных');
            return false;
        } else {            
            
            handler.showSidebarMessage(false);            
        }
        
        return true;        
    }
                 
    // вывод всех изображений избранного \ обновление блока категорий
    // страницы сбрасываются только при смене фильтров
    
    this.showFavouriteImages = function() {
        
        imageGrid.close();		
        imageGrid.updateConfig({rowHeight : fav.coptions.grid.rowHeight, rules : fav.coptions.grid});
        
        if (fav.coptions.grid.type != 'fixed') {
            imageGrid.updateConfig({rules : {fixed : false}});
        }
        
        if (mode != 'fav') {
            // moved to reset button
            // catFilters = [];
            // catIgnoreFilters = [];
        }		
        
        if (!env.isNSFW() || fav.coptions.ignoreNSFW) {
                               
            handler.ignoreNSFW();
        }
        
        var controllsContainer = modalBoxContent;
        
        handler.showSidebarMessage(false);
        controllsContainer.innerHTML = '';
                
        if (!document.getElementById(env.className + '-mainCss')) {
            
            favContent.innerHTML = lng.s('Ошибка инициализации таблиц оформления', 'init_css_error');
            displayFavouritesBlock('fav');
            return;
        }
        
        favContent.innerHTML = '';
        
        var editButton = document.createElement('a');
            editButton.href = '#';
            editButton.innerHTML = '';
            editButton.title = lng.s('Режим редактирования', 'edit_mode');
            editButton.onclick = function() {
                
                var filterAdd = KellyTools.getElementByClass(controllsContainer, env.className + '-filters-CatCreate');
                    
                if (readOnly) {
                
                    readOnly = false;					
                    this.className = this.className.replace('closed', 'open');
                
                } else {				
                    readOnly = true;
                    this.className = this.className.replace('open', 'closed');					
                }
                                
                if (filterAdd) filterAdd.style.display = readOnly ? 'none' : 'inline-block';				
                return false;				
            }
            
            editButton.className  = env.className + '-FavEditButton-edit ' + env.className + '-iconset1 ';
            editButton.className += env.className + '-iconset1-lock ' + env.className + '-iconset1-lock-' + (readOnly ? 'closed' : 'open');
       
        var optionsButton = false;
        
        if (fav.coptions.optionsSide) {
            optionsButton = editButton.cloneNode();
            optionsButton.className = env.className + '-FavEditButton-options ' + env.className + '-iconset1 ' + env.className + '-icon-gear closed';
            optionsButton.title = lng.s('Настройки', 'options');
            optionsButton.onclick = function() {
                
                if (!checkSafeUpdateData()) return false;
                
                if (mode == 'ctoptions') {
                    handler.hideFavoritesBlock();                    
                    this.className = this.className.replace('closed', 'open');
                } else {					
                    handler.showOptionsDialog();                    
                    this.className = this.className.replace('open', 'closed');
                }
                
                return false;
            }
        }   
        
        var resetButton = editButton.cloneNode();
            resetButton.innerHTML = lng.s('Сбросить', 'reset');
            resetButton.onclick = function() {
            
                if (!checkSafeUpdateData()) return false;
                
                handler.resetFilterSettings();
                handler.showFavouriteImages();
                
                return false;				
            }
            
            resetButton.className = env.className + '-FavEditButton-reset';
        
        var filterComments = editButton.cloneNode();
            filterComments.className = env.className + '-FavFilter ' + env.className + '-buttoncolor-dynamic';
            filterComments.innerHTML = lng.s('Комменты', 'comments');
           
        var filterPosts = filterComments.cloneNode();
            filterPosts.innerHTML = lng.s('Публикации', 'items');          
        
            if (!excludeFavPosts) filterPosts.className += ' active';
            if (!excludeFavComments) filterComments.className += ' active';
            
        filterComments.onclick = function() {
            
            if (!checkSafeUpdateData()) return false;
            page = 1;
            
            if (!excludeFavComments) {
                this.className = this.className.replace('active', '');
                excludeFavComments = true;
                
            } else {
                 this.className += ' active';
                 excludeFavComments = false;
            }
            
            updateFilteredData();
            
            handler.updateImagesBlock();
            handler.updateImageGrid();
            
            return false;
            
        }
            
        filterPosts.onclick = function() {
            
            if (!checkSafeUpdateData()) return false;
            
            page = 1;
            
            if (!excludeFavPosts) {
                this.className = this.className.replace('active', '');
                excludeFavPosts = true;
                
            } else {
                 this.className += ' active';
                 excludeFavPosts = false;
            }        
            
            updateFilteredData();
            
            handler.updateImagesBlock();
            handler.updateImageGrid();
            
            return false;
            
        }
        
        var typeFiltersContainer = document.createElement('div');
            typeFiltersContainer.className = env.className + '-TypeFiltersContainer';
            typeFiltersContainer.appendChild(filterComments);
            typeFiltersContainer.appendChild(filterPosts);
            
        var logicButton = editButton.cloneNode();
            logicButton.className = env.className + '-FavFilter ' + env.className + '-FavFilter-logic';
            logicButton.innerHTML = lng.s('Логика И', 'logic_and');
            // logic.alt = 'Вывести записи где есть хотябы один из выбранных тегов';
            
            logicButton.onclick = function () {
                
                if (!checkSafeUpdateData()) return false;
                
                if (logic == 'or') {
                    logic = 'and';
                    this.innerHTML = lng.s('Логика И', 'logic_and');
                    
                } else {
                    logic = 'or';
                    this.innerHTML = lng.s('Логика ИЛИ', 'logic_or');
                }
                
                updateFilteredData();
                
                handler.updateImagesBlock();
                handler.updateImageGrid();
                
                return false;
            }
            
        var no = logicButton.cloneNode();
            no.className = env.className + '-FavFilter';
            if (!catFilterNot) no.innerHTML = '+ ' + lng.s('Категории', 'cats');
            else no.innerHTML = '- ' + lng.s('Категории', 'cats');
            
            no.onclick = function () {
  
                if (catFilterNot) {
                    catFilterNot = false;
                    this.innerHTML = '+ ' + lng.s('Категории', 'cats');
                } else {
                    catFilterNot = true;
                    this.innerHTML = '- ' + lng.s('Категории', 'cats');
                }
            
                return false;
            }
            
        var gif = logicButton.cloneNode();			
            gif.className = env.className + '-FavFilter';
            if (fav.coptions.animateGif) gif.innerHTML = '+ ' + lng.s('Анимация GIF', 'animate_gifs');
            else gif.innerHTML = '- ' + lng.s('Анимация GIF', 'animate_gifs');
            
            gif.onclick = function () {
                
                if (!checkSafeUpdateData()) return false;
                
                if (fav.coptions.animateGif) {
                    fav.coptions.animateGif = false;
                    this.innerHTML = '- ' + lng.s('Анимация GIF', 'animate_gifs');
                } else {
                    fav.coptions.animateGif = true;
                    this.innerHTML = '+ ' + lng.s('Анимация GIF', 'animate_gifs');
                }
            
                handler.save('cfg');
                
                updateFilteredData();
                
                handler.updateImagesBlock();
                handler.updateImageGrid();
                return false;
            }
            
        var nsfw = logicButton.cloneNode();		
            nsfw.className = env.className + '-FavFilter';
            if (fav.coptions.ignoreNSFW) nsfw.innerHTML = '- NSFW';
            else nsfw.innerHTML = '+ NSFW';
            
            nsfw.onclick = function () {
                
                if (!checkSafeUpdateData()) return false;
                
                if (fav.coptions.ignoreNSFW) {
                    fav.coptions.ignoreNSFW = false;
                    this.innerHTML = '+ NSFW';
                } else {
                    fav.coptions.ignoreNSFW = true;
                    this.innerHTML = '- NSFW';
                }
                
                handler.save('cfg');
                
                page = 1;
                handler.showFavouriteImages();
                return false;
            }
            
        var additionButtons = document.createElement('div');
            additionButtons.className = env.className + '-filters-AdditionButtons';
            
            additionButtons.appendChild(resetButton);
            additionButtons.appendChild(editButton);
        
        if (optionsButton) {
            additionButtons.appendChild(optionsButton);
        }
            
        if (handler.isDownloadSupported) {   
            
            var showDownloadManagerForm = function(show) {
                
                if (!show) {
                    
                    downloaderBox.modal.className = downloaderBox.modal.className.replace('active', 'hidden');  
                    return;
                    
                } else {
                    var dm = handler.getDownloadManager();
                    
                    if (!dm.container) {
                         dm.container = downloaderBox.content;
                    }
                        
                    dm.showGrabManager();  
                    downloaderBox.modal.className = downloaderBox.modal.className.replace('hidden', 'active');                    
                }
                
                updateSidebarPosition();
            }
            
            var download = editButton.cloneNode();
                download.className = env.className + '-FavEditButton ' + env.className + '-FavEditButton-download ' + (imagesAsDownloadItems ? 'active' : 'hidden');
                download.innerHTML = lng.s('Загрузки', 'download_manager');
                
                download.onclick = function () {
                    if (!checkSafeUpdateData()) return false;
                    
                    if (imagesAsDownloadItems) { // todo ask before cancel if something in progress
                        imagesAsDownloadItems = false;
                        this.className = this.className.replace('active', 'hidden');
                        sideBarLock = false;
                        showDownloadManagerForm(false);
                    } else {
                        imagesAsDownloadItems = true;
                        this.className = this.className.replace('hidden', 'active');                
                        
                        sideBarLock = true;
                        handler.getDownloadManager().setDownloadTasks(displayedItems);                        
                        showDownloadManagerForm(true);
                    }
                    
                    handler.updateImagesBlock();                
                    handler.updateImageGrid();
                    return false;
                }
                
            additionButtons.appendChild(download);
        }
            
            typeFiltersContainer.appendChild(logicButton);
        
        var cOptions = document.createElement('table');	
            cOptions.innerHTML = '<tr><td></td><td></td><td></td></tr>';
        
        var cOptionsSectors = cOptions.getElementsByTagName('td');
        var cOptionsSectorItems = [no, gif, nsfw];
        
        for (i = 0; i < cOptionsSectors.length; i++) {
            
            cOptionsSectors[i].appendChild(cOptionsSectorItems[i]);
        }
            
        additionButtons.appendChild(cOptions);
        
        var clearDiv = document.createElement('div');
            clearDiv.style.clear = 'both';
            
        additionButtons.appendChild(clearDiv);
            
        controllsContainer.appendChild(additionButtons);
        controllsContainer.appendChild(typeFiltersContainer);
        
        if (!readOnly) editButton.className += ' active';
        
        var filtersMenuBlock = document.createElement('div');
            filtersMenuBlock.className = env.className + '-FiltersMenu-container'; 
            
        var filtersMenu = document.createElement('ul');
            filtersMenu.className = env.className + '-FiltersMenu';
        
        showCatList(filtersMenu);  
                  
        filtersMenuBlock.appendChild(filtersMenu);
        controllsContainer.appendChild(filtersMenuBlock);
        
        var paginationContainer = document.createElement('div');
            paginationContainer.className = env.className + '-pagination';
            paginationContainer.id = env.className + '-pagination';
            
        controllsContainer.appendChild(paginationContainer);     
        
        if (!imagesBlock) {
            imagesBlock = document.createElement('div');
            imagesBlock.className = env.className + '-imagesBlock-container ' + env.className + '-imagesBlock-container-active';
        }
        
        updateFilteredData();
        
        if (imagesAsDownloadItems) {
            showDownloadManagerForm(true);
        }
        
        favContent.appendChild(imagesBlock);       
        handler.updateImagesBlock();
        
        handler.showSidebar(true);
        
        displayFavouritesBlock('fav');
        handler.updateImageGrid();
        
        return false;
    }
    
    this.closeSidebar = function() {
        sideBarWrap.className = sideBarWrap.className.replace( env.className + '-sidebar-wrap-active',  env.className + '-sidebar-wrap-hidden');
        
        var siteSideBlock = env.getMainContainers().sideBlock;
        if (siteSideBlock) {
            siteSideBlock.style.visibility = 'visible';
            siteSideBlock.style.opacity = '1';
        }
    }
    
    this.showSidebarMessage = function(message, error) {
        
        modalBoxMessage.className = env.className + '-ModalBox-message ' + env.className + '-ModalBox-message-' + (message ? 'active' : 'hidden');
        
        if (!message) {
            modalBoxMessage.innerHTML = '';
        } else {
            
            modalBoxMessage.innerHTML = message;
            if (error) modalBoxMessage.className += ' ' + env.className + '-ModalBox-message-error';
        }
    }
    
    this.getSidebar = function() {
        return sideBarWrap;
    }
    
    this.showSidebar = function(hideHeader, onClose) {
    
        sideBarWrap.className = sideBarWrap.className.replace( env.className + '-sidebar-wrap-hidden',  env.className + '-sidebar-wrap-active');
        
        var header = KellyTools.getElementByClass(modalBox, env.className + '-ModalBox-header');
          
        var modalBoxBtnClose = KellyTools.getElementByClass(modalBox, env.className + '-ModalBox-close');
            modalBoxBtnClose.onclick = function() { 
            
                if (onClose) {
                    onClose(); 
                } else {
                    handler.closeSidebar();
                }
                
                return false; 
            };
        
        if (hideHeader) {
            header.style.display = 'none';
          
        } else {
            header.style.display = 'block';
        }
    
        var siteSideBlock = env.getMainContainers().sideBlock;		
        if (siteSideBlock) {	
            siteSideBlock.style.visibility = 'hidden';
            siteSideBlock.style.opacity = '0'; 
        }
        
        updateSidebarPosition();
    }
    
    function updateSidebarPosition() {
        if (env.updateSidebarPosition && env.updateSidebarPosition(sideBarLock)) return;        
    }
    
    // preview dimensions, preview jpg for gif media 
    this.setSelectionInfo = function(type, info) {
        
        if (!type) {
        
            log('setSelectionInfo : clean selected info');
            if (selectedInfo) selectedInfo = false;
            
            return;
        }
        
        if (!selectedInfo) selectedInfo = new Object();
        
        selectedInfo[type] = info;    
    }
    
    // save preview image dimensions for fav.items[index], if not saved
    
    this.saveWH = function(el, index) {

        if (!el) return false;
        var src = el.getAttribute('src');
        if (!src) return false;
        
        var fileName = src.replace(/^.*[\\\/]/, '');        
        var imageWH = {width : parseInt(el.naturalWidth), height : parseInt(el.naturalHeight)};
        
        if (!fav.items[index]) { 
            log('item with index ' + index + 'not found');
        }
        
        if (fav.items[index].pImage) {
            fav.items[index].pw = imageWH.width;
            fav.items[index].ph = imageWH.height;
        }   
        
        handler.save('items');
    }
    
    this.switchPreviewImage = function(next) {
    
        if (!selectedImages) return false;
    
        if (selectedImages.length <= 1) return false;
        var previewImage = KellyTools.getElementByClass(modalBoxContent, env.className + '-PreviewImage');
        
        if (!previewImage) return false;
        
        var caret = previewImage.getAttribute('data-caret');
        if (!caret) caret = 0;
        else caret = parseInt(caret);
        
        if (!next) {            
            selectedImages.splice(caret, 1);
            next = 1;
        }
            
        caret += next;
        if (caret < 0) caret = selectedImages.length-1;
        else if (caret > selectedImages.length-1) caret = 0;
        
        previewImage.setAttribute('data-caret', caret);
        //previewImage.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        
        previewImage.src = env.getStaticImage(selectedImages[caret]);
        previewImage.onload = function() { return false; } // todo after change image src width \ height may be wrong, so we cant use them for dimensions detect | may be recreate DOM img element helps
        
        handler.setSelectionInfo('dimensions', false);
        //console.log( previewImage.src );
    }
    
    this.showRemoveCategoryDialog = function(itemIndex, onRemove, onCancel) {
    
        if (!fav.categories[itemIndex]) {
            log('attempt to remove unexist item ' + itemIndex);
            return false;
        }
        
        handler.getTooltip().show(false);
        
        handler.showSidebarMessage(false);
        
        var html = '<p>' + lng.s('Подтвердите удаление', 'delete_confirm') + '</p>';
            html += '<p><label><input type="checkbox" name="removeImages" class="' + env.className + 'RemoveImages">' + lng.s('Удалить все связанные изображения', 'delete_rcat_items')  +  '</label></p>'
            html += '<p class="' + env.className + '-ModalBox-controll-buttons"><a href="#" class="' + env.className + 'Remove">' + lng.s('Удалить', 'delete')  +  '</a>';
            html += '<a href="#" class="' + env.className + 'Cancel">' + lng.s('Отменить', 'cancel')  +  '</a></p>';       
        
        modalBoxContent.innerHTML = '<div class="' +  env.className + '-removeDialog">' + html + '</div>';
        
        var removeButton = KellyTools.getElementByClass(modalBoxContent, env.className + 'Remove');
        var removeApplyButton = KellyTools.getElementByClass(modalBoxContent, env.className + 'Apply');

    
        var onCancelCommon = function() {

            if (onCancel) {
                onCancel();
            } else {
                handler.closeSidebar();  
            } 
            
            return false; 
        }
        
        KellyTools.getElementByClass(modalBoxContent, env.className + 'Cancel').onclick = onCancelCommon;
        
        removeButton.onclick = function() { 
            
            var removeImages = KellyTools.getElementByClass(modalBoxContent, env.className + 'RemoveImages');
            if (removeImages && removeImages.checked) {
                removeImages = true;
            } else {
                removeImages = false;
            }
            
            handler.categoryRemove(itemIndex, removeImages);
            
            if (onRemove) {
                onRemove();
            } else {
                handler.closeSidebar();  
            } 
            
            return false; 
        }
        
        handler.showSidebar(false, onCancelCommon);
        updateSidebarPosition();
        return false;
    }
    
    function removeDimensionsForItem(item) {
        if (!item) return false;
        
        log('clean proportions info');
        
        if (typeof item.pw != 'undefined') delete item.pw;
        if (typeof item.ph != 'undefined') delete item.ph;
        if (typeof item.ps != 'undefined') delete item.ps;
        
        return true;
    }
    
    // postBlock is deprecated variable - unimportant here, todo remove
    // onApply - применить изменения (удаление части элементов из подборки)
    // onRemove - полное удаление
    // onCancel - отмена
    
    this.showRemoveFromFavDialog = function(itemIndex, onRemove, onCancel, onApply) {
    
        if (!fav.items[itemIndex]) {
            log('attempt to remove unexist item ' + itemIndex);
            return false;
        }
        
        handler.showSidebarMessage(false);
        
        var html = '<p>Подтвердите удаление</p>';
            html += '<p class="' + env.className + '-ModalBox-controll-buttons"><a href="#" class="' + env.className + 'Remove">' + lng.s('Удалить', 'delete')  +  '</a><a href="#" class="' + env.className + 'Apply">' + lng.s('Применить изменения', 'apply')  +  '</a>';
            html += '<a href="#" class="' + env.className + 'Cancel">' + lng.s('Отменить', 'cancel')  +  '</a></p>';       
        
        modalBoxContent.innerHTML = '<div class="' +  env.className + '-removeDialog">' + html + '</div>';
        
        var removeButton = KellyTools.getElementByClass(modalBoxContent, env.className + 'Remove');
        var removeApplyButton = KellyTools.getElementByClass(modalBoxContent, env.className + 'Apply');
        var removeDialog = KellyTools.getElementByClass(modalBoxContent, env.className + '-removeDialog');
        
        selectedImages = false;
        
        var previewBefore = getPreviewImageByItem(fav.items[itemIndex]);
        
        if (fav.items[itemIndex].pImage) {
        
            if (typeof fav.items[itemIndex].pImage == 'string') {
                selectedImages = [fav.items[itemIndex].pImage];
            } else {
                selectedImages = [];
                
                for (var i = 0; i < fav.items[itemIndex].pImage.length; i++) {
                    selectedImages[i] = fav.items[itemIndex].pImage[i];
                }
            }
            
            var controlls = getSelectedPostMediaControlls();
            
            removeDialog.insertBefore(controlls, removeDialog.childNodes[0]);
        }
        
        
        if (!selectedImages || selectedImages.length <= 1) { 
            removeApplyButton.style.display = 'none';
        } else {
            removeButton.innerHTML = lng.s('Удалить всю подборку', 'delete_all_items');
        }
         
        removeApplyButton.onclick = function() {

            if (!selectedImages || selectedImages.length <= 0) {
                
                handler.itemRemove(itemIndex);  
                    
            } else {
                
                fav.items[itemIndex].pImage = selectedImages;

                var previewAfter = getPreviewImageByItem(fav.items[itemIndex]);
                
                if (previewAfter.indexOf(previewBefore) == -1) {
                    removeDimensionsForItem(fav.items[itemIndex]);
                }
                
                handler.save('items');
            }
            
            if (onApply) {
                onApply();
            } else {
                handler.closeSidebar();  
            } 
            
            return false; 
        }
         
        var onCancelCommon = function() {

            if (onCancel) {
                onCancel();
            } else {
                handler.closeSidebar();  
            } 
            
            return false; 
        }
        
        KellyTools.getElementByClass(modalBoxContent, env.className + 'Cancel').onclick = onCancelCommon;
        
        removeButton.onclick = function() { 
            
            handler.itemRemove(itemIndex);  
                        
            if (onRemove) {
                onRemove();
            } else {
                handler.closeSidebar();  
            } 
            
            return false; 
        }
        
        handler.showSidebar(false, onCancelCommon);
        updateSidebarPosition();
        return false;
    }
    
    // sets auto categories by current selected media
    
    function selectAutoCategories(db) {
        
        if (!db) db = fav;
        
        // autoselect gif
        var gifCategory = handler.getStorageManager().getCategoryBy(db, 'GIF', 'name');
        var containGif = false;
        
        if (gifCategory.id !== -1) {  
        
            for (var i = 0; i < selectedImages.length; i++) {     
                if (selectedImages[i].indexOf('.gif') != -1) {
                    containGif = true;
                    break;
                }
            }           
            
            var selectedGifCat = db.selected_cats_ids.indexOf(gifCategory.id);
                        
            if (containGif && selectedGifCat == -1) {
                db.selected_cats_ids.push(gifCategory.id);
            } else if (!containGif && selectedGifCat != -1) {                
                db.selected_cats_ids.splice(selectedGifCat, 1);
            }           
        }
    }
    
    // todo callback onDownload
    function fastDownloadCheckState(postData, button) {
    
        if (!handler.isDownloadSupported || !fav.coptions.fastsave.enabled) {
            return false;
        }
        
        button.className = button.className.replace('unchecked', 'checked');
        var postMedia = env.getAllMedia(postData);
        
        if (postMedia && postMedia.length) {
            
            button.className += ' ' + env.className + '-fast-save-loading';
            var onSearch = function(response) {
                
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = false;
                    
                    // todo err
                }
                
                if (response && response.matchResults && response.matchResults[0].match) {
                    button.className = button.className.replace('checked', 'downloaded');
                } else {
                    button.className = button.className.replace('checked', 'notdownloaded');
                }
                
                button.className = button.className.replace(env.className + '-fast-save-loading', '').trim();
        
            }
            
            var timeout = setTimeout(function() {
                onSearch(false);
            }, 4000);
            
            KellyTools.getBrowser().runtime.sendMessage({method: "isFilesDownloaded", filenames : [KellyTools.getUrlFileName(env.getImageDownloadLink(postMedia[0]))]}, onSearch);
        
        } else {
            button.className = button.className.replace('checked', 'unavailable');
        }     
    }
    
    function fastDownloadPostData(postData, onInit, onDownload) {
        
        if (!handler.isDownloadSupported || !fav.coptions.fastsave.enabled) {
            return false;
        }
        
        if (!KellyTools.getBrowser()) return false;
        
        var postMedia = env.getAllMedia(postData);        
        if (postMedia && postMedia.length) {
            var dm = handler.getDownloadManager();
            
            var downloadInitiated = 0;
            var downloadDone = 0; 
            var downloadIds = [];
            
            KellyTools.getBrowser().runtime.sendMessage({method: "onChanged.keepAliveListener"}, function(response) {});
         
            var timeoutListener = setTimeout(function() {
                 KellyTools.getBrowser().runtime.onMessage.removeListener(onDownloadStateChanged);
                 timeoutListener = false;
                 if (onDownload) onDownload(false);
            }, 4000);
            
            var onDownloadStateChanged = function(request, sender, sendResponse) {
   
                if (request.method == "onChanged" ) {                    
                                        
                    if (request.downloadDelta && request.downloadDelta.state) {
                    
                        if (request.downloadDelta.state.current != "in_progress" && downloadIds.indexOf(request.downloadDelta.id) != -1) {
                            downloadDone++;
                            downloadIds.splice(downloadIds.indexOf(request.downloadDelta.id), 1);
                            if (downloadDone == postMedia.length) {
                            
                                if (onDownload) onDownload(true);
                                
                                KellyTools.getBrowser().runtime.onMessage.removeListener(onDownloadStateChanged);
                                if (timeoutListener) {
                                    clearTimeout(timeoutListener);
                                    timeoutListener = false;
                                }
                            }
                        }
                        
                    }
                }
            }
            
            KellyTools.getBrowser().runtime.onMessage.addListener(onDownloadStateChanged); 
            
            for (var i = 0; i < postMedia.length; i++) {
            
                dm.createBlobFromUrl(env.getImageDownloadLink(postMedia[i], true), function(url, blobData, errorCode, errorNotice) {

                    if (!blobData) {
                        
                        log('downloadPostData : bad blob data for fast download; error : ' + errorCode + ' | message ' + errorNotice);
                        
                        downloadInitiated++;
                        if (downloadInitiated == postMedia.length) {
                            if (onDownload) onDownload(false);
                        }
                        
                        return;
                    }
                    
                    if (!fav.coptions.fastsave.conflict) {
                        fav.coptions.fastsave.conflict = 'overwrite';
                    }
                    
                    var downloadOptions = { 
                            conflictAction : fav.coptions.fastsave.conflict,
                            method : 'GET',
                            filename : KellyTools.validateFolderPath(fav.coptions.fastsave.baseFolder) + '/' + KellyTools.getUrlFileName(url),
                            url : blobData,
                        }
                        
                    dm.downloadUrl(true, downloadOptions, function(response) {
                    
                        downloadInitiated++;
                        if (response.downloadId && response.downloadId != -1) downloadIds.push(response.downloadId);
                        console.log(downloadIds);
                        if (downloadInitiated == postMedia.length) {
                            if (onInit) onInit(downloadInitiated, response.downloadId);
                        }
                    });
                });
            }
            
        } else {
           if (onDownload) onDownload(false);
        }
    }
    
    this.showAddToFavDialog = function(postBlock, comment) {
        
        if (!postBlock) return false;
        
        handler.showSidebarMessage(false);
        
        // selectedPostCats = [];
        handler.setSelectionInfo(false);
        
        selectedPost = postBlock;
        if (comment) {
            selectedComment = comment;
            selectedImages = env.getAllMedia(comment);
        } else {            
            selectedComment = false;
            selectedImages = env.getAllMedia(postBlock);
        }
                
        var controlls = getSelectedPostMediaControlls();
        
        var hidePreview = KellyTools.getElementByClass(modalBox, env.className + '-ModalBox-hide-preview');
        if (hidePreview) {
            hidePreview.innerHTML = lng.s('Скрыть превью', 'item_preview_hide');
            hidePreview.className = hidePreview.className.replace('hidden', 'active');
            hidePreview.onclick = function() {
                if (controlls.className.indexOf('hidden') != -1) {             
                    controlls.className = controlls.className.replace('hidden', 'active');
                    hidePreview.innerHTML = lng.s('Скрыть превью', 'item_preview_hide');
                } else {
                    controlls.className = controlls.className.replace('active', 'hidden');
                    hidePreview.innerHTML = lng.s('Показать превью', 'item_preview_show');
                }
                
                return false;
            }
            
            if (selectedImages.length > 0) {                
               hidePreview.className = hidePreview.className.replace('hidden', 'active'); 
            } else {
               hidePreview.className = hidePreview.className.replace('active', 'hidden'); 
            }
        }
        
        var onClose = function() {
            if (hidePreview) {
                hidePreview.className = hidePreview.className.replace('active', 'hidden');
            }
            
            handler.save('cfg');
            handler.closeSidebar();
        }
       
        selectAutoCategories();        
        handler.showSidebar(false, onClose);
                
        var catsHTML = '<option value="-1">' + lng.s('Без категории', 'cat_no_cat') + '</option>';
        
        for (var i = 0; i < fav.categories.length; i++) {
            var selected = '';
            
            //if (fav.last_cat == fav.categories[i].id) selected = 'selected';
            
            catsHTML += '<option value="' + fav.categories[i].id + '" ' + selected + '>' + fav.categories[i].name + '</option>';
        }
        
        catsHTML = '<select class="' + env.className + 'Cat">' + catsHTML + '</select>';
        
        var html = '\
        <div class="' + env.className + 'SavePostWrap">\
                <div class="' + env.className + 'CatAddForm">\
                    <div>\
                        <input type="text" placeholder="' + lng.s('Новая категория', 'cat_new_cat_name') + '" value="" class="' + env.className + 'CatName">\
                        <a href="#" class="' + env.className + 'CatCreate">' +lng.s('Создать категорию', 'cat_create') + '</a>\
                    </div>\
                </div>\
                <div class="' + env.className + 'SavePost">\
                    <div class="' + env.className + 'CatList">' + catsHTML + ' <a href="#" class="' + env.className + 'CatAdd">' +lng.s('Добавить категорию', 'cat_add') + '</a></div>\
                    <input type="text" placeholder="' +lng.s('Подпись', 'item_notice') + '" value="" class="' + env.className + 'Name">\
                    <a href="#" class="' + env.className + 'Add">' +lng.s('Сохранить', 'save') + '</a>\
                </div>\
                <div class="' + env.className + 'CatAddToPostList"></div>\
        </div>\
        ';

        
        modalBoxContent.innerHTML = html;
        modalBoxContent.insertBefore(controlls, modalBoxContent.childNodes[0]);		
        
        KellyTools.getElementByClass(modalBoxContent, env.className + 'CatAdd').onclick = function() { handler.categoryAdd(); return false; }        
        KellyTools.getElementByClass(modalBoxContent, env.className + 'CatCreate').onclick = function () { handler.categoryCreate(); return false; }
        // KellyTools.getElementByClass(modalBoxContent, env.className + 'CatRemove').onclick = function () { handler.categoryRemove(); return false; }

        KellyTools.getElementByClass(modalBoxContent, env.className + 'Add').onclick = function () { 
            handler.save('cfg'); 
            if (handler.itemAdd() && fav.coptions.syncByAdd && env.syncFav) {
                env.syncFav(selectedPost, true);
            } 
            return false; 
        }
                
        var list = KellyTools.getElementByClass(modalBoxContent, env.className + 'CatAddToPostList');    

        if (fav.selected_cats_ids.length) {
        
            for (var i = 0; i < fav.selected_cats_ids.length; i++) {
                if (handler.getStorageManager().getCategoryById(fav, fav.selected_cats_ids[i]).id == -1) {
                    continue;
                } 
                
                list.appendChild(createCatExcludeButton(fav.selected_cats_ids[i]));
            }
            
        }            
        
        updateSidebarPosition();
        return false;
    }
    
    // noSave = true - only return new item without save and dialog
    
    this.itemAdd = function(noSave) {
        
        if (!selectedPost) {
            log('itemAdd : selected post empty');
            return false;
        }
                          
        var postItem = { 
            categoryId : [], 
            pImage : '', 
            link : '', 
            name : KellyTools.inputVal(env.className + 'Name', 'string', modalBoxContent),
            // commentLink : '',
        };
               
        fav.selected_cats_ids = validateCategories(fav.selected_cats_ids);
        
        if (fav.selected_cats_ids.length) {
        
            for (var i = 0; i < fav.selected_cats_ids.length; i++) {            
                postItem.categoryId[postItem.categoryId.length] = fav.selected_cats_ids[i];
            }
        }
                
        //var firstImageBlock = KellyTools.getElementByClass(selectedPost, 'image');
        if (selectedComment) {
        
            var text = getCommentText(selectedComment);
            console.log(text);
            if (text) postItem.text = text;

            postItem.commentLink = env.getCommentLink(selectedComment);
        } 

        if (selectedImages.length == 1) postItem.pImage = selectedImages[0];
        else if (selectedImages.length > 1) {
            var previewImage = KellyTools.getElementByClass(modalBoxContent, env.className + '-PreviewImage');
            
            // may unexist for images that taken from native favorites in iframe mode
            
            if (previewImage) {
            
                var caret = previewImage.getAttribute('data-caret');
                if (!caret) caret = 0;
                else caret = parseInt(caret);
                
                if (caret && caret < selectedImages.length && caret >= 1) {
                    var tmp = selectedImages[0];
                    selectedImages[0] = selectedImages[caret];
                    selectedImages[caret] = tmp;
                }
                
            }
            
            postItem.pImage = selectedImages;
        }
                
        if (selectedInfo && selectedInfo['dimensions'] && selectedInfo['dimensions'].width) {
        
            postItem.pw = selectedInfo['dimensions'].width;
            postItem.ph = selectedInfo['dimensions'].height;  
            
            // trusted original proportions
            if (selectedInfo['dimensions'].schemaOrg) {
                postItem.ps = 1;
            }
        }
        
        if (selectedInfo && selectedInfo['gifInfo'] && selectedInfo['gifInfo'].length) {
            postItem.gifInfo = selectedInfo['gifInfo'];     
        }
        
        var link = env.getPostLink(selectedPost);
        if (link) postItem.link = link.href;           
        
        if (!postItem.link) {
            
            if (!noSave) handler.showSidebarMessage(lng.s('Публикация не имеет ссылки', 'item_bad_url'), true);
            return false;
            
        }
        
        if (noSave) return postItem;
        
        /*
            todo validate in storageManager
            
            postItem.link = postItem.link.replace('https://', '');
            postItem.link = postItem.link.replace('http://', '');
            
            if (postItem.commentLink) {
                postItem.commentLink = postItem.commentLink.replace('https://', '');
                postItem.commentLink = postItem.commentLink.replace('http://', '');
            }
        */
        
        var selectedUrl = KellyTools.getRelativeUrl(selectedComment ? postItem.commentLink : postItem.link);
        var selectedUrlTypeKey = selectedComment ? 'commentLink' : 'link';
        
        for (var i = 0; i < fav.items.length; i++) {
            
            if ( KellyTools.getRelativeUrl(fav.items[i][selectedUrlTypeKey]).indexOf(selectedUrl) != -1 ) {
                fav.items[i] = postItem;
                handler.showSidebarMessage(lng.s('Избранная публикация обновлена', 'item_upd'));
                handler.save('items');
                return false;
            }
        }
                
        fav.ids++;		
        postItem.id = fav.ids; 

        handler.showSidebarMessage(lng.s('Публикация добавлена в избранное', 'item_added'));
                
        fav.items[fav.items.length] = postItem;
        handler.updateFavCounter();
            
        selectedComment ? formatComments(selectedPost) : formatPostContainer(selectedPost);
        
        log('post saved');
        log(postItem);
        handler.save('items');
        
        return true;
    }
    
    // удалить элемент с последующим обновлением контейнеров публикаций 
    // index - item index in fav.items[index] - comment \ or post
    // postBlock - not important post container dom element referense, helps to find affected post
        
    this.itemRemove = function(index, postBlock) {
    
        fav.items.splice(index, 1);
        
        handler.updateFavCounter();
        
        handler.save('items');

        if (!postBlock) { // update all visible posts
        
            var posts = document.getElementsByClassName('postContainer');
            
            for (var i = 0; i < posts.length; i++) {
                formatPostContainer(posts[i]);
            }
            
        } else {
        
            formatPostContainer(postBlock);
            
        }
    }
    
    // удалить категорию с последующим обновлением контейнеров публикаций 
    
    this.categoryRemove = function(i, removeImages) {
        
        if (!fav.categories[i]) return false;

        if (fav.categories[i].protect) {
            return false;
        }
        
        var removeCatId = fav.categories[i].id;
        
        var getItemWithRemoveCat = function() {
        
            for (var b = 0; b < fav.items.length; b++) {
                if (fav.items[b].categoryId.indexOf(removeCatId) !== -1) return b;
            }
            
            return false;
        }
        
        if (removeImages) {
        
            var imageItem = false;
            do { 
                
                imageItem = false;
                var itemIndex = getItemWithRemoveCat(); 
                
                if (itemIndex !== false) {
                    imageItem = true;
                    fav.items.splice(itemIndex, 1);
                } 
                
            } while (imageItem);
            
            var posts = document.getElementsByClassName('postContainer');
            
            for (var posti = 0; posti < posts.length; posti++) {
                formatPostContainer(posts[posti]);
            }
            
            handler.updateFavCounter();
            
        } else {
        
            // remove child posts
            for (var b = 0; b < fav.items.length; b++) {
                var itemCategoryIndex = fav.items[b].categoryId.indexOf(removeCatId);
                if (itemCategoryIndex === -1) continue;
                fav.items[b].categoryId.splice(itemCategoryIndex, 1);
            }
        }
       
       // x.options[x.selectedIndex]
       
       fav.categories.splice(i, 1);
       fav.selected_cats_ids = validateCategories(fav.selected_cats_ids);
       
       handler.save();
       return true;
    }
    
    this.categoryExclude = function(newCatId) {
        
        var index = fav.selected_cats_ids.indexOf(newCatId);

        if (index == -1) return false;
        
        fav.selected_cats_ids.splice(index, 1);
        
        // console.log(fav.selected_cats_ids);        
    }
    
    function createCatExcludeButton(catId) {
        
        var category = handler.getStorageManager().getCategoryById(fav, catId);
        
        var catItem = document.createElement('a');
            catItem.href = '#';
            catItem.innerHTML = 'Исключить ' + category.name;
            catItem.setAttribute('categoryId', category.id);
            catItem.onclick = function() {
                
                handler.categoryExclude(parseInt(this.getAttribute('categoryId')));
                this.parentNode.removeChild(this);
                
                return false;
            }
            
        return catItem;
    }
    
    this.categoryEdit = function(data, index) {
        
        if (!fav.categories[index]) return false;
        
        var edited = false;
        
        // log(newName + ' | ' + index);
        if (data.name && fav.categories[index].name != data.name) {
            data.name = data.name.trim();
            
            if (
                data.name && 
                data.name.length && 
                handler.getStorageManager().getCategoryBy(fav, data.name, 'name').id == -1
            ) {
                fav.categories[index].name = data.name;
                edited = true;
            }            
        }  
        
        if (typeof data.nsfw != 'undefined') {
        
            if (data.nsfw)
            fav.categories[index].nsfw = true;
            else 
            fav.categories[index].nsfw = false;
            
            edited = true;
        }  
        
        
        if (typeof data.order != 'undefined') {
            
            data.order = parseInt(data.order);
            
            if (data.order)
            fav.categories[index].order = data.order;
            else 
            fav.categories[index].order = index;
            
            edited = true;
        }  
        
        if (edited) {
        
            handler.save('items');
            return fav.categories[index];
            
        } else return false;
        
    }

    this.getGlobal = function(name) {
        if (name == 'debug') return debug;	
        if (name == 'env') return env;		
        if (name == 'fav') return fav;
        if (name == 'filters') return catFilters;
        if (name == 'lng') return lng;
    }
    
    // add category to list of categories of selected item
    
    this.categoryAdd = function() {
    
        var list = KellyTools.getElementByClass(modalBoxContent, env.className + 'CatAddToPostList');
        if (!list) return false;
        
        var catSelect = KellyTools.getElementByClass(modalBoxContent, env.className + 'Cat');       
        var newCatId = parseInt(catSelect.options[catSelect.selectedIndex].value);
                
        if (fav.selected_cats_ids.indexOf(newCatId) !== -1) return false;
        
        if (handler.getStorageManager().getCategoryById(fav, newCatId).id == -1) return false;
        
        fav.selected_cats_ids[fav.selected_cats_ids.length] = parseInt(newCatId);
        
        list.appendChild(createCatExcludeButton(newCatId));
    }
    
    this.categoryCreate = function(container) {
        
        if (!container) {
            container = sideBarWrap;
        }
        
        if (!container) return false;
        
        var name = KellyTools.inputVal(env.className + 'CatName', 'string', container);
        
        var orderNum = 0;
        var order =  KellyTools.getElementByClass(container, env.className + 'CatOrder');
        if (order) {
            orderNum = parseInt(order.value)
        }  
                
        var catIsNSFW = KellyTools.getElementByClass(container, env.className + 'CatIsNSFW');
        if (catIsNSFW && catIsNSFW.checked) catIsNSFW = true;
        else catIsNSFW = false;
        
        if (!name) {
            handler.showSidebarMessage( lng.s('Введите название категории', 'cat_error_name'), true);
            return false;
        }
        
        if (!handler.getStorageManager().categoryCreate(fav, name, catIsNSFW, orderNum)) {
            handler.showSidebarMessage(lng.s('Категория с указаным именем уже существует', 'cat_error_name_exist'), true);      
        }
        
        var option = document.createElement("option");
            option.text = name;
            option.value = fav.ids;
        
        var catSelect = KellyTools.getElementByClass(container, env.className + 'Cat');
        if (catSelect) {
            catSelect.add(option);
            catSelect.selectedIndex = catSelect.options.length-1;
        }
        
        handler.showSidebarMessage(lng.s('Категория добавлена', 'cat_add_success'));
        handler.save('items');
        
        return true;
    }
    
    
    this.onDownloadNativeFavPagesEnd = function() {
    
        var downloadBtn = KellyTools.getElementByClass(document, 'kelly-DownloadFav');
        if (downloadBtn) downloadBtn.innerHTML = lng.s('Запустить скачивание страниц', 'download_start');	
            
        if (!favNativeParser || !favNativeParser.collectedData.items.length) return false;
                                
        KellyTools.getElementByClass(document, 'kelly-Save').style.display = 'block';
            
        var saveNew = KellyTools.getElementByClass(document, 'kelly-SaveFavNew');
            saveNew.onclick = function() {
            
                if (favNativeParser && favNativeParser.collectedData.items.length) {
                    
                    if (favNativeParser.collectedData.selected_cats_ids) {
                        delete favNativeParser.collectedData.selected_cats_ids;
                    }
                    
                    var fname = env.profile + '/Storage/ExportedFavourites/';
                        fname += 'db_';
                        
                    var pageInfo = env.getFavPageInfo();					
                    if (pageInfo.userName) fname += '_' + KellyTools.getUrlFileName(pageInfo.userName);
                    
                    fname += '_' + KellyTools.getTimeStamp() + '.' + handler.getStorageManager().format;
                    fname = KellyTools.validateFolderPath(fname);
                    
                    KellyTools.createAndDownloadFile(JSON.stringify(favNativeParser.collectedData), fname);	
                }
                
                return false;
            }            
    }
    
    this.onDownloadNativeFavPage = function(worker, thread, jobsLength) {
        
        var error = '';
        var logEl = KellyTools.getElementByClass(document, env.className + '-exporter-log');
        var logNum = parseInt(logEl.getAttribute('data-lines'));
        if (!logNum) logNum = 0;
        
        if (logNum > 1000) {
            logEl.innerHTML = '';
        }
        
        KellyTools.getElementByClass(document, env.className + '-exporter-process').innerHTML = lng.s('Страниц в очереди __PAGESN__', 'download_pages_left', {PAGESN : jobsLength});
        
        var skipEmpty = KellyTools.getElementByClass(document, env.className + '-exporter-skip-empty');
            skipEmpty = skipEmpty && skipEmpty.checked ? true : false;
            
        if (!thread.response) {
        
            error = 'Страница не доступна ' + thread.job.data.page + ' (ошибка загрузки или превышен интервал ожидания)'; // window.document null  
            
            favNativeParser.addJob(
                thread.job.url, 
                handler.onDownloadNativeFavPage, 
                {page : thread.job.data.page}
            );
            
        } else {
        
            var loadDoc = document.createElement('DIV');
                loadDoc.innerHTML = thread.response;
                
            var posts = loadDoc.getElementsByClassName('postContainer');
            
            if (!posts) {
            
                error = 'Отсутствует контейнер postContainer для страницы ' + thread.job.data.page;
            } else {
                logNum++;
                logEl.innerHTML += '[' + KellyTools.getTime() + '] Страница : ' + thread.job.data.page + ' найдено ' + posts.length + ' элементов' + '<br>';
                logEl.setAttribute('data-lines', logNum+1);
            }
        }
        
        if (error) {
        
            worker.errors += error;		
            logEl.innerHTML += '[' + KellyTools.getTime() + ']' + error + '<br>';
            logEl.setAttribute('data-lines', logNum+1);
            
            return;
        }
                
        var pageInfo = {
            page : thread.job.data.page,
            itemsNum : 0,
        }
        
        // check uniquie throw searchItem
        // check for duplicates on save in current storage by post url updatePostFavButton as example
        // exlude unnesessery data to improve load speed
        
            fav.selected_cats_ids = [];
            
        for (var i = 0; i < posts.length; i++) {
        
            selectedComment = false;
            selectedPost = posts[i];
            
            handler.setSelectionInfo(false);
            
            selectedImages = env.getAllMedia(posts[i]);
            selectAutoCategories();
                    
            if (skipEmpty && !selectedImages.length) {
                log('onDownloadNativeFavPage : skip empty item');
                log(selectedPost);
                continue;
            }
            
            if (env.getPostTags && (worker.catByTagList || worker.tagList)) {
                 var postTags = env.getPostTags(selectedPost);
            }
            
            worker.collectedData.selected_cats_ids = [];
            
            if (env.getPostTags && worker.catByTagList) {
            
                for(var b = 0; b < worker.catByTagList.length; b++) {
                
                    if (postTags.indexOf(worker.catByTagList[b]) != -1) {
                
                            var sm = handler.getStorageManager();
                            
                            var itemCatId = sm.getCategoryBy(worker.collectedData, worker.catByTagList[b], 'name');
                                itemCatId = itemCatId.id;
                                
                            if (itemCatId == -1) {
                                itemCatId = handler.getStorageManager().categoryCreate(worker.collectedData, worker.catByTagList[b], false);                                
                            }
                            
                            if (itemCatId > 0 && worker.collectedData.selected_cats_ids.indexOf(itemCatId) == -1) {                                
                                worker.collectedData.selected_cats_ids.push(itemCatId);
                            }
                    }
                }
            }
            
            if (env.getPostTags && worker.tagList) {
                       
                if (!postTags.length) {
                    log('onDownloadNativeFavPage : post tag list is empty');
                    log(selectedPost);
                    continue;
                }
                
                var postOk = true;
                
                if (worker.tagList.exclude && worker.tagList.exclude.length > 0) {
                
                    for(var b = 0; b < worker.tagList.exclude.length; b++) {
                        if (postTags.indexOf(worker.tagList.exclude[b]) != -1) {
                            postOk = false;
                            break;
                        }
                    }
                    
                    if (!postOk) {
                        continue;
                    } 
                }                             
                
                if (worker.tagList.include && worker.tagList.include.length > 0) {
                    
                    postOk = false;
                    
                    for(var b = 0; b < worker.tagList.include.length; b++) {
                    
                        if (postTags.indexOf(worker.tagList.include[b]) != -1) {
                            postOk = true;
                            
                            var sm = handler.getStorageManager();
                            
                            var itemCatId = sm.getCategoryBy(worker.collectedData, worker.tagList.include[b], 'name');
                                itemCatId = itemCatId.id;
                                
                            if (itemCatId == -1) {
                                itemCatId = handler.getStorageManager().categoryCreate(worker.collectedData, worker.tagList.include[b], false);                                
                            }
                            
                            if (itemCatId > 0 && worker.collectedData.selected_cats_ids.indexOf(itemCatId) == -1) {                                
                                worker.collectedData.selected_cats_ids.push(itemCatId);
                            }
                            
                            break;
                        }
                        
                    }                    
                } 
                               
                if (!postOk) continue;
            }
            
            var postItem = handler.itemAdd(true);
            if (postItem) {
                
                if (handler.getStorageManager().searchItem(worker.collectedData, postItem) === false) {
                    
                    if (worker.collectedData.selected_cats_ids.length >= 1) {
                        postItem.categoryId = validateCategories(worker.collectedData.selected_cats_ids, worker.collectedData);
                    }
                    
                    worker.collectedData.ids++;	
                
                    postItem.id = worker.collectedData.ids; 

                    worker.collectedData.items[worker.collectedData.items.length] = postItem;
                    
                    pageInfo.itemsNum++;
                }

            }
        }
        
        log(pageInfo.page + ' | ' + pageInfo.itemsNum);
        // console.log(fav.native_tags);
        log('--');
        
    }
    
    this.downloadNativeFavPage = function(el) {
        
        if (!env.getFavPageInfo) {
            log(env.profile + 'not support native downloads');
            return false;
        }
        
        var favInfo = env.getFavPageInfo();        
        if (!favInfo) return false;
        
        if (!favNativeParser) {
            favNativeParser = new KellyThreadWork({env : handler});      
            favNativeParser.setEvent('onEnd', handler.onDownloadNativeFavPagesEnd);
        }

        favNativeParser.errors = '';

        if (favNativeParser.getJobs().length) {
        
            favNativeParser.stop();
            handler.onDownloadNativeFavPagesEnd();
            
            return false;
        }
        
        favNativeParser.collectedData = handler.getStorageManager().getDefaultData();
        
        var pages = KellyTools.getElementByClass(document, 'kelly-PageArray'); 
        var pagesList = [];
        
        var message = KellyTools.getElementByClass(document, env.className + '-exporter-process');
        
        if (pages && pages.value.length) {
            pagesList = KellyTools.getPrintValues(pages.value, true);
        } else { 
            pagesList = KellyTools.getPrintValues('1-' + favInfo.pages, true);
        }	
        
        if (!pagesList.length) {
            message.innerHTML = lng.s('Выборка пуста', 'selection_empty');
            return;
        }
        
        for (var i = 0; i < pagesList.length; i++) {
            
            var pageNumber = pagesList[i];
            
            favNativeParser.addJob(
                favInfo.url.replace('__PAGENUMBER__', pageNumber), 
                handler.onDownloadNativeFavPage, 
                {page : pageNumber}
            );
        }
        
        var showLogButton = KellyTools.getElementByClass(document, env.className + '-exporter-show-log');
            showLogButton.style.display = 'inline-block';
            
            showLogButton.onclick = function() {
                var log = KellyTools.getElementByClass(document, env.className + '-exporter-log-container');
                
                if (log.style.display == 'none') {
                    log.style.display = 'block';
                } else {
                    log.style.display = 'none';
                }
                
                return false;
            }
        
        var saveFavItemsButton = KellyTools.getElementByClass(document, 'kelly-Save');
            saveFavItemsButton.style.display = 'none';
         
        favNativeParser.tagList = false;
        
        var updateOptions = false;
        
        var tagFilter = KellyTools.getElementByClass(document, env.className + '-exporter-tag-filter');
        var tagFilterEnabled = KellyTools.getElementByClass(document, env.className + '-exporter-show-tag-filter');
            tagFilterEnabled = tagFilterEnabled && tagFilterEnabled.checked ? true : false;
        
        if (tagFilterEnabled && tagFilter) {
            if (tagFilter.value != fav.coptions.tagList) {
                fav.coptions.tagList = KellyTools.inputVal(tagFilter, 'longtext'); 
                
                updateOptions = true;
            }
            
            favNativeParser.tagList = KellyTools.parseTagsList(fav.coptions.tagList);
        }
        
        var catCreate = KellyTools.getElementByClass(document, env.className + '-exporter-create-by-tag');
        var catCreateEnabled = KellyTools.getElementByClass(document, env.className + '-exporter-show-create-by-tag');
            catCreateEnabled = catCreateEnabled && catCreateEnabled.checked ? true : false;
        
        if (catCreateEnabled && catCreate) {
            if (catCreate.value != fav.coptions.catByTagList) {
                fav.coptions.catByTagList = KellyTools.inputVal(catCreate, 'longtext'); 
                
                updateOptions = true;
            }
            
            favNativeParser.catByTagList = KellyTools.parseTagsList(fav.coptions.catByTagList);
            if (favNativeParser.catByTagList && favNativeParser.catByTagList.include && favNativeParser.catByTagList.include.length != 0) {
                favNativeParser.catByTagList = favNativeParser.catByTagList.include;
            } else {
                favNativeParser.catByTagList = false;
            }
        }
        
        if (updateOptions) {
            handler.save('cfg');
        }
        
        var logEl = KellyTools.getElementByClass(document, env.className + '-exporter-log');
            logEl.innerHTML = '[' + KellyTools.getTime() + '] Инициализация...' + "<br>";
            
        el.innerHTML = lng.s('Загрузка... (Отменить)', 'download_started_cancel');  
        
        log('download native page started');
        log(favNativeParser.tagList);
        
        favNativeParser.exec();        
    }
    
    this.showNativeFavoritePageInfo = function() {
    
        // not supported by browser
        if (!handler.isDownloadSupported) {
            return false;
        }
        
        if (!env.getFavPageInfo) {
            log(env.profile + 'not support native downloads');
            return false;
        }
        
        var favPageInfo = env.getFavPageInfo();
     
        if (favPageInfo && favPageInfo.items) {
        
            var saveBlock = '<div class="kelly-Save" style="display : none;"><a href="#" class="kelly-SaveFavNew" >Скачать список элементов</a></div>';
            
            var items = favPageInfo.items;
            if (favPageInfo.pages > 2) { 
                items = '~' + items;
            }
            
            // для текстовый публикаций делать заголовок через метод setSelectionInfo
            
            var tagFilterHtml = '';
            
            var tags = fav.coptions.tagList ? fav.coptions.tagList : '';
            var createByTags = fav.coptions.catByTagList ? fav.coptions.catByTagList : '';
            
            if (env.getPostTags) {
            
                tagFilterHtml = '\
                    <br><br>\
                    <label><input type="checkbox" class="' + env.className + '-exporter-show-tag-filter">Применять фильтрацию по тегам</label>\
                    <br>\
                    <div class="' + env.className + '-exporter-tag-filter-container" style="display : none;">'
                        + lng.s('', 'download_tag_filter_1') + '<br>'
                        + lng.s('Если теги не определены, выполняется сохранение всех публикаций', 'download_tag_filter_empty') 
                        + '</br>\
                        <textarea class="' + env.className + '-exporter-tag-filter" placeholder="' + lng.s('Фильтровать публикации по списку тегов', 'download_tag_filter') + '">' + tags + '</textarea>\
                    </div>\
                ';
                
                tagFilterHtml += '\
                    <br>\
                    <label><input type="checkbox" class="' + env.className + '-exporter-show-create-by-tag">' + lng.s('Автоматически создавать категории для тегов', 'download_createc_by_tag') + '</label>\
                    <br>\
                    <div class="' + env.className + '-exporter-create-by-tag-container" style="display : none;">'
                        + lng.s('Если публикация содержит один из перечисленных в поле тегов, к публикации будет добавлена соответствующая категория', 'download_createc_1') + '<br>'
                        + '</br>\
                        <textarea class="' + env.className + '-exporter-create-by-tag" placeholder="' + lng.s('Автоматически создавать категории для тегов', 'download_createc_by_tag') + '">' + createByTags + '</textarea>\
                    </div>\
                ';
            }
            
            favPageInfo.container.innerHTML = '\
                <div class="' + env.className + '-exporter-container">\
                     <h2>' +  lng.s('Сделать локальную копию', 'download_title') + '</h2>\
                     ' +  lng.s('Страниц', 'pages_n') + ' : ' + favPageInfo.pages + ' (' + items + ')<br>\
                     ' +  lng.s('Укажите список страниц выборки, которые необходимо скачать. Например 2, 4, 66-99, 44, 78, 8-9, 29-77 и т.п.,', 'download_example') + '<br>\
                     ' +  lng.s('Если нужно захватить все страницы оставьте не заполненным', 'download_tip') + '<br>\
                     <input class="kelly-PageArray" type="text" placeholder="' + lng.s('Страницы', 'pages')+ '" value=""><br>\
                     <label><input type="checkbox" class="' + env.className + '-exporter-skip-empty"> ' +  
                        lng.s('Пропускать публикации не имеющие медиа данных (текст, заблокировано цензурой)', 'download_skip_empty') +
                     '</label>\
                     ' + tagFilterHtml + '\
                     <br><a href="#" class="kelly-DownloadFav">' + lng.s('Запустить скачивание страниц', 'download_start') + '</a>\
                     <a href="#" class="' + env.className + '-exporter-show-log" style="display : none;">' + lng.s('Показать лог', 'download_log') + '</a>\
                     ' + saveBlock + '\
                     <div class="' + env.className + '-exporter-process"></div>\
                     <div class="' + env.className + '-exporter-log-container" style="display : none;">\
                        <div class="' + env.className + '-exporter-log"></div>\
                     </div>\
                </div>\
            ';		

            if (env.getPostTags) {
                KellyTools.getElementByClass(favPageInfo.container, env.className + '-exporter-show-tag-filter').onchange = function() {
                    
                    var el = KellyTools.getElementByClass(favPageInfo.container, env.className + '-exporter-tag-filter-container');
                        el.style.display = this.checked ? 'block' : 'none'; 
                    
                    return false;
                };
                
                KellyTools.getElementByClass(favPageInfo.container, env.className + '-exporter-show-create-by-tag').onchange = function() {
                    
                    var el = KellyTools.getElementByClass(favPageInfo.container, env.className + '-exporter-create-by-tag-container');
                        el.style.display = this.checked ? 'block' : 'none'; 
                    
                    return false;
                };
            }            
            
            KellyTools.getElementByClass(document, 'kelly-DownloadFav').onclick = function() {
                handler.downloadNativeFavPage(this);
                return false;
            };
        }
        
    }
    
    this.formatPostContainers = function() {
        
        publications = document.getElementsByClassName(env.publication);
        for (var i = 0; i < publications.length; i++) {
            formatPostContainer(publications[i]);
        }
    }
    
    function initExtensionResources() {
        
        if (init) return true;
        init = true;        
        
        var onLoadCssResource = function(response) {
            
            // console.log(response.url);
            
            if (!response || response.data === false) {	
                log('onLoadCssResource : bad init data');
                return false;
            }
            
            if (!response.data.css) {
                log('onLoadCssResource : css empty');
                log('onLoadCssResource : Browser API response : ' + response.data.notice);
                return false; 
            }
            
            handler.addCss(KellyTools.replaceAll(response.data.css, '__BASECLASS__', env.className));
             
            handler.isDownloadSupported = response.isDownloadSupported;
            
            if (!handler.isDownloadSupported) {
                log('browser not support download API. Most of functional is turned OFF');
            }
            
            initImageGrid();           
            initWorktop();
                        
            if (env.onExtensionReady) env.onExtensionReady();
        };
        
        KellyTools.getBrowser().runtime.sendMessage({method: "getCss", items : ['main', env.profile]}, onLoadCssResource);		
        return true;
    }
        
    this.initOnPageReady = function() {
        
        if (init) return false;
        
        if (!KellyTools.getBrowser()) {
        
            log('Fail to get API functions, safe exit from page ' + document.title);
            return false; 
        }
        
        // parallel with load resources in initCss
        
        handler.addEventListner(document.body, "keyup", function (e) {
            
            if (!e.target) return;
            
            if (e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') {
                return;
            }
            
            var c = e.keyCode - 36;
           
            var right = c == 3 || c == 32 || c == 68 || c == 102;
            var left = c == 1 || c == 29 || c == 65 || c == 100;
         
            if (mode  == 'fav') {
                // disable if already view any image
                
                if (handler.getTooltip().isShown() == 'categoryEdit') return;
                
                if (imgViewer && imgViewer.getCurrentState().shown) return;
                
                if (right) {
                                    
                    handler.goToFavPage('next');
                } else if (left) {
                
                    handler.goToFavPage('prev');
                }             
            }
            
        }, 'next_fav_page');    
        
        if (env.onPageReady && env.onPageReady()) {			
            return false;
        }
        
        // currently we can modify post containers without waiting css, looks fine
        handler.formatPostContainers();
        initExtensionResources();       
    }
    
    this.addEventListner = function(object, event, callback, prefix) {
    
        handler.removeEventListener(object, event, prefix);
        
        if (typeof object !== 'object') {
            object = document.getElementById(object);
        }

        if (!object)
            return false;
        if (!prefix)
            prefix = '';

        events[prefix + event] = callback;

        if (!object.addEventListener) {
            object.attachEvent('on' + event, events[prefix + event]);
        } else {
            object.addEventListener(event, events[prefix + event]);
        }

        return true;
    }

    this.removeEventListener = function(object, event, prefix) {
        if (typeof object !== 'object') {
            object = document.getElementById(object);
        }

        // console.log('remove :  : ' + Object.keys(events).length);
        if (!object)
            return false;
        if (!prefix)
            prefix = '';

        if (!events[prefix + event])
            return false;

        if (!object.removeEventListener) {
            object.detachEvent('on' + event, events[prefix + event]);
        } else {
            object.removeEventListener(event, events[prefix + event]);
        }

        events[prefix + event] = null;
        return true;
    }
    
    constructor();
}



//D:\Dropbox\Private\l scripts\jfav\release\Extension\\env\profiles\joyreactor.js



// JoyReactor environment driver

// !@ - not required by FavItems object methods	

// default profile driver must be assign to K_DEFAULT_ENVIRONMENT variable
// todo move formatcomment \ formatpost methods from FavItems to keep core without "environment only" / driver methods

var K_ENVIRONMENT = {
    
    fav : false, 
    
    className : 'kellyJRFav', 
    profile : 'joyreactor',
    mainDomain : 'joyreactor.cc',
    favPage : '/user/__USERNAME__/favorite/__PAGENUMBER__',
    
    publication : 'postContainer',
    
    hostClass : window.location.host.split(".").join("_"),
    
    actionVar : 'dkl_pp', 
    containers : false,

    isNSFW : function() {
        var sfw = KellyTools.getElementByClass(document, 'sswither');
        if (sfw && sfw.className.indexOf('active') != -1) return false;
        else return true;
    },
    
    getMainContainers : function() {
        
        if (!this.containers) {
            this.containers = {
                body : document.getElementById('container'),
                content : document.getElementById('contentinner'),
                sideBlock : document.getElementById('sidebar'),
                menu : document.getElementById('submenu'),
            };
        }
        
        return this.containers;
    },
   
    /* @! */        
    getPostTags : function(publication, limitTags) {
        
        if (!limitTags) limitTags = false;
        
        var tags = [];
        var nativeTags = KellyTools.getElementByClass(publication, 'taglist');
        if (!nativeTags) return tags;
        
        var nativeTags = nativeTags.getElementsByTagName('A');
        if (!nativeTags || !nativeTags.length) return tags;
    
        for (var i = 0; i < nativeTags.length; i++) {
           var tagName = nativeTags[i].innerHTML.trim(); 
           if (!tagName) continue;
           
           tags[tags.length] = tagName;
           if (limitTags && tags.length >= limitTags) return tags;
        }
        
        return tags;
    },
    
    getPostLink : function(publication) {
        
        if (window.location.host.indexOf('old.') == -1) {

            var link = KellyTools.getElementByClass(publication, 'link_wr');
            if (link) return KellyTools.getChildByTag(link, 'a');
        } else {
            return publication.querySelector('[title="ссылка на пост"]');
        }			
    
    },
    
    getAllMedia : function(publication) {
        
        var data = [];
        
        if (!publication) return data;
        
        var content = false;
        
        if (publication.className.indexOf('comment') != -1) {
            content = KellyTools.getElementByClass(publication, 'txt');
        } else {
            content = KellyTools.getElementByClass(publication, 'post_content');
        }
        
        if (!content) return data;
        
        var mainImage = this.getMainImage(publication, content);
        
        // censored posts not contain post container and
        // /images/censorship/ru.png
        
        var imagesEl = content.getElementsByClassName('image');
        
        for (var i = 0; i < imagesEl.length; i++) {
            
            var image = '';
            
            if (imagesEl[i].innerHTML.indexOf('gif_source') !== -1) {
                
                // extended gif info for fast get dimensions \ keep gif unloaded until thats needed
                var gif = KellyTools.getElementByTag(imagesEl[i], 'a');                
                if (gif) {
                    image = this.getImageDownloadLink(gif.getAttribute("href"), false);
                }
                
            } else {
            
                var imageEl = KellyTools.getElementByTag(imagesEl[i], 'img');
                if (imageEl) {
                    image = this.getImageDownloadLink(imageEl.getAttribute("src"), false);
                }     
            }
            
            if (image) data.push(image);
            
            // todo test assoc main image with gifs
            
            if (data.length == 1 && image && mainImage && image.indexOf(this.getImageDownloadLink(mainImage.url, false, true)) != -1) {
                this.fav.setSelectionInfo('dimensions', mainImage);
            } else if (data.length == 1 && image && mainImage) {
                KellyTools.log(image);
                KellyTools.log(this.getImageDownloadLink(mainImage.url, false));
            }
        }

        if (!data.length && mainImage) {
            
            mainImage.url = this.getImageDownloadLink(mainImage.url, false);
            data.push(mainImage.url);
            
            this.fav.setSelectionInfo('dimensions', mainImage);
        }
        
        return data; //  return decodeURIComponent(url);
    },		
    
    /* @! */
    getMainImage : function(publication, content) {
        
        if (!publication) return false;
        
        var mainImage = false;
        var validateTextContent = function(input) {
            var output = "";
            for (var i=0; i < input.length; i++) {
                
                if (input.charCodeAt(i) > 127) continue;
                
                if (input.charAt(i) == "\\") output += "\\\\"; 
                else output += input.charAt(i);
            }
            
            // console.log(output);
            return output;
        }
        
        try {
            var schemaOrg = publication.querySelector('script[type="application/ld+json"]');
            
            if (schemaOrg) schemaOrg = schemaOrg.textContent.trim();
            if (schemaOrg) schemaOrg = validateTextContent(schemaOrg);
            
            if (schemaOrg && schemaOrg.indexOf('//schema.org') != -1) {
        
                mainImage = JSON.parse(schemaOrg);
                if (mainImage && mainImage.image) {
                    mainImage = mainImage.image;
                    mainImage.url = this.getImageDownloadLink(mainImage.url, false);
                    if (!mainImage.url || !mainImage.width || !mainImage.height) {
                        mainImage = false;
                    }
                } else mainImage = false;
            }

        } catch (e) {
            mainImage = false;
            KellyTools.log(e, 'profile getMainImage');
            if (schemaOrg) {
                KellyTools.log(schemaOrg, 'profile getMainImage json data');
            }
        }
        
        if (mainImage) {					
            mainImage.schemaOrg = true;
        }
        
        return mainImage;
    },
    
    // route format
    // [image-server-subdomain].[domain].cc/pics/post/full/[title]-[image-id].[extension]
    
    getImageDownloadLink : function(url, full, relative) {
        
             url = url.trim();
        if (!url || url.length < 10) return url;
        
        // for correct download process we must keep same domain for image
        // to avoid show copyright \ watermarks
    
        var imgServer = url.match(/img(\d+)/);
        if (imgServer &&  imgServer.length) {
            
            imgServer = imgServer[0];
            
            var relativeUrl = url.replace('http://', '');
                relativeUrl = relativeUrl.replace('https://', '');
                relativeUrl = relativeUrl.replace('//', '');
                
            var slash = relativeUrl.indexOf('/');
            
            if (slash > 0) { 
                relativeUrl = relativeUrl.substr(slash + 1);
            }
            
            if (full && relativeUrl.indexOf('post/full/') == -1) {
                relativeUrl = relativeUrl.replace('post/', 'post/full/');        
            }
            
            if (!full && relativeUrl.indexOf('post/full/') != -1) {
                
                relativeUrl = relativeUrl.replace('post/full/', 'post/');  
            }

            if (relative) return relativeUrl;

            url = window.location.origin + '/' + relativeUrl;
            url = url.replace('http://', 'http://' + imgServer + '.');                    
            url = url.replace('https://', 'https://' + imgServer + '.');
        }
        
        
        return url;
    },
    
    getCommentLink : function(comment) {
        
        if (!comment) return '#';
        
        var links = comment.getElementsByTagName('a');
        
        for (var b = 0; b < links.length; b++) {
            if (links[b].href.indexOf('#comment') != -1) {
                return links[b].href;                    
            }
        }
        
        return '#';
    },
    
    updateSidebarPosition : function(lock) {
    
        if (!this.fav) return false;
        
        var sideBarWrap = this.fav.getSidebar();
        
        if (!sideBarWrap || sideBarWrap.className.indexOf('hidden') !== -1) return false;
    
        var sideBlock = this.getMainContainers().sideBlock;
        var minTop = 0;
        
        if (sideBlock) {
            minTop = sideBlock.getBoundingClientRect().top;
        }
                    
        var modalBoxTop = 24;
        
        var filters = KellyTools.getElementByClass(sideBarWrap, this.className + '-FiltersMenu');     
        if (filters && filters.offsetHeight > 440 && filters.className.indexOf('calculated') == -1) {
            
            var filtersBlock = KellyTools.getElementByClass(sideBarWrap, this.className + '-FiltersMenu-container');
                
            filtersBlock.style.maxHeight = '0';
            filtersBlock.style.overflow = 'hidden';
            
            var modalBox = KellyTools.getElementByClass(document, this.className + '-ModalBox-main');						
                modalBox.style.minHeight = '0';

            var modalBoxHeight = modalBox.getBoundingClientRect().height;       
            
            var viewport = KellyTools.getViewport();
            if (viewport.screenHeight < modalBoxHeight + filters.offsetHeight + modalBoxTop) {
                filtersBlock.style.maxHeight = (viewport.screenHeight - modalBoxHeight - modalBoxTop - 44 - modalBoxTop) + 'px';
                filtersBlock.style.overflowY = 'scroll';

            } else {
                    
                filtersBlock.style.maxHeight = 'none';
                filtersBlock.style.overflow = 'auto';
            }
            
            filters.className += ' calculated';
        }
        
        // screen.height / 2  - (sideBarWrap.getBoundingClientRect().height / 2) - 24
        
        if (lock || modalBoxTop < minTop) modalBoxTop = minTop;
        
        var scrollTop = KellyTools.getScrollTop();
        var scrollLeft = KellyTools.getScrollLeft();
        
        sideBarWrap.style.top = modalBoxTop + scrollTop  + 'px';
        
        var widthBase = 0;
        
        if (window.location.host.indexOf('old.') == -1) {
            widthBase = 24;
        }
        
        if (sideBlock) {
            sideBarWrap.style.right = 'auto';
            sideBarWrap.style.left = Math.round(sideBlock.getBoundingClientRect().left + scrollLeft) + 'px';
            sideBarWrap.style.width = Math.round(sideBlock.getBoundingClientRect().width + widthBase) + 'px';
        } else {
            sideBarWrap.right = '0px';
        }		
        
        // tagList
    },
    
    // return same url if not supported
    
    getStaticImage : function(source) {

        if (source.indexOf('reactor') != -1) {
        
            if (source.indexOf('static') !== -1 || source.indexOf('.gif') == -1) return source;
            
            source = source.replace('pics/comment/', 'pics/comment/static/');
            source = source.replace('post/', 'post/static/');
            source = source.replace('.gif', '.jpeg');
        }
        
        return source;
    },
    
    // return false if not supported for page \ site
    
    getFavPageInfo : function() {
    
        var header = KellyTools.getElementByClass(document, 'mainheader');
        if (!header) {
            return false;
        }
        
        if (header.innerHTML.indexOf('Избранное') == -1) {
            return false;
        }
        
        var info = {
            pages : 1,
            items : 0,
            page : 1,
            header : header,
            url : false,
            userName : false,
        }
        
        var parts = window.location.href.split('/');
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == 'user' && i+1 <= parts.length-1) {
                info.userName = parts[i+1];
                break;
            }
        }
        
        if (!info.userName) return false;
        
        info.url = '';
        
        if (window.origin.indexOf('https') != -1) {
            info.url = 'https://';
        } else {
            info.url = 'http://';
        }

        // основной домен предоставляет больше метаинфы в отличии от old.
        // если основной домен перестанет отдавать Access-Control-Allow-Origin для поддоменов, то нужно будет всегда использовать текущий домен
        
        info.url += this.mainDomain + this.favPage;
        info.url = info.url.replace('__USERNAME__', info.userName);
        
        var posts = document.getElementsByClassName('postContainer');
        if (posts) info.items = posts.length;
        
        //(window.location.href.substr(window.location.href.length - 8) == 'favourite')
        
        if (window.location.host.indexOf('old.') != -1) {
            var pagination = document.getElementById('Pagination');
        } else {
            var pagination = KellyTools.getElementByClass(document, 'pagination_expanded'); 
        }  
        
        if (pagination) {
            var current = pagination.getElementsByClassName('current');
            
            if (current) {
                for (var i = 0; i < current.length; i++) {
                    if (parseInt(current[i].innerHTML)) {
                        info.page = parseInt(current[i].innerHTML);
                        break;
                    }
                }
            }
            
            if (info.page > info.pages) info.pages = info.page;
            
            var pages = pagination.getElementsByTagName('A');
            for (var i = 0; i < pages.length; i++) {
            
                var pageNum = parseInt(pages[i].innerHTML);
                if (info.pages < pageNum) info.pages = pageNum;   
                
            }
            
            info.items += (info.pages - 1) * 10;
        }
        
        
        info.container = KellyTools.getElementByClass(document, this.className + '-FavNativeInfo'); 
        if (!info.container) {
        
            info.container = document.createElement('div');
            info.container.className = this.className + '-FavNativeInfo';
            
            info.header.parentNode.insertBefore(info.container, info.header.nextSibling);
        }
            
        return info;
    },
    
    /* @! */
    onInitWorktop : function() {
    
    },
    
    /* @! */
    onExtensionReady : function() {
                 
        if (window.location.host == this.mainDomain || window.location.host.indexOf('old.') == -1) {

            var bar = document.getElementById('searchBar');
            
            var style = {
                bg : false,
                btn : false,
            };
            
            if (bar) {
                style.bg = window.getComputedStyle(bar).backgroundColor;
                
                var btn = bar.querySelector('.submenuitem.active a');
                if (btn) {
                    style.btn = window.getComputedStyle(btn).backgroundColor;
                }
            }
            
            css = "\n\r\n\r\n\r" + '/* ' +  this.profile + '-dynamic */' + "\n\r\n\r\n\r";
            if (style.btn && style.btn.indexOf('0, 0, 0, 0') == -1) {
                css += '.' + this.className + '-basecolor-dynamic {';
                css += 'background-color : ' + style.btn + '!important;';
                css += '}';
            }
            
            if (style.bg && style.bg.indexOf('0, 0, 0, 0') == -1) {
            
                css += '.active .' + this.className + '-buttoncolor-dynamic, \
                        .active.' + this.className + '-buttoncolor-dynamic, \
                        .' + this.className + '-ahover-dynamic:hover .' + this.className + '-buttoncolor-dynamic, \
                        .' + this.className + '-ahover-dynamic .' + this.className + '-buttoncolor-dynamic:hover \
                        {';
                        
                css += 'background-color : ' + style.btn + '!important;';
                css += '}';
                                    
                css += '.' + this.className + '-buttoncolor-any-dynamic {';
                css += 'background-color : ' + style.btn + '!important;';
                css += '}';
            }
            
            this.fav.addCss(css);
        }
        
        this.fav.showNativeFavoritePageInfo();
    },
    
    syncFav : function(publication, inFav) {        
        var item = publication.querySelector('.favorite_link');
        if (!item) return;
        
        
        if (inFav && item.className.indexOf(' favorite') == -1) {                
            KellyTools.dispatchEvent(item);
        } else if (!inFav && item.className.indexOf(' favorite') != -1) {                
            KellyTools.dispatchEvent(item);
        }
    },
    
    /* @! */
    onPageReady : function() {
        
        return false;
    },
    
    setFav : function(fav) {
        this.fav = fav;
    }
}

var K_DEFAULT_ENVIRONMENT = K_ENVIRONMENT;




//D:\Dropbox\Private\l scripts\jfav\release\Extension\\init.js



if (!K_FAV) var K_FAV = new KellyFavItems();

// keep empty space to prevent syntax errors if some symobls will added at end