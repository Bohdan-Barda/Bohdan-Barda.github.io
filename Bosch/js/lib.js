/*
== malihu jquery custom scrollbar plugin ==
Version: 3.1.5
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development.
For production, use either the minified jquery.mCustomScrollbar.min.js script or
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin
and dependencies (minified).
*/

(function(factory){
    if(typeof define==="function" && define.amd){
        define(["jquery"],factory);
    }else if(typeof module!=="undefined" && module.exports){
        module.exports=factory;
    }else{
        factory(jQuery,window,document);
    }
}(function($){
    (function(init){
        var _rjs=typeof define==="function" && define.amd, /* RequireJS */
            _njs=typeof module !== "undefined" && module.exports, /* NodeJS */
            _dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
            _url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
        if(!_rjs){
            if(_njs){
                require("jquery-mousewheel")($);
            }else{
                /* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS
                (works when mCustomScrollbar fn is called on window load) */
                $.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
            }
        }
        init();
    }(function(){

        /*
        ----------------------------------------
        PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S)
        ----------------------------------------
        */

        var pluginNS="mCustomScrollbar",
            pluginPfx="mCS",
            defaultSelector=".mCustomScrollbar",





            /*
            ----------------------------------------
            DEFAULT OPTIONS
            ----------------------------------------
            */

            defaults={
                /*
                set element/content width/height programmatically
                values: boolean, pixels, percentage
                    option						default
                    -------------------------------------
                    setWidth					false
                    setHeight					false
                */
                /*
                set the initial css top property of content
                values: string (e.g. "-100px", "10%" etc.)
                */
                setTop:0,
                /*
                set the initial css left property of content
                values: string (e.g. "-100px", "10%" etc.)
                */
                setLeft:0,
                /*
                scrollbar axis (vertical and/or horizontal scrollbars)
                values (string): "y", "x", "yx"
                */
                axis:"y",
                /*
                position of scrollbar relative to content
                values (string): "inside", "outside" ("outside" requires elements with position:relative)
                */
                scrollbarPosition:"inside",
                /*
                scrolling inertia
                values: integer (milliseconds)
                */
                scrollInertia:950,
                /*
                auto-adjust scrollbar dragger length
                values: boolean
                */
                autoDraggerLength:true,
                /*
                auto-hide scrollbar when idle
                values: boolean
                    option						default
                    -------------------------------------
                    autoHideScrollbar			false
                */
                /*
                auto-expands scrollbar on mouse-over and dragging
                values: boolean
                    option						default
                    -------------------------------------
                    autoExpandScrollbar			false
                */
                /*
                always show scrollbar, even when there's nothing to scroll
                values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
                */
                alwaysShowScrollbar:0,
                /*
                scrolling always snaps to a multiple of this number in pixels
                values: integer, array ([y,x])
                    option						default
                    -------------------------------------
                    snapAmount					null
                */
                /*
                when snapping, snap with this number in pixels as an offset
                values: integer
                */
                snapOffset:0,
                /*
                mouse-wheel scrolling
                */
                mouseWheel:{
                    /*
                    enable mouse-wheel scrolling
                    values: boolean
                    */
                    enable:true,
                    /*
                    scrolling amount in pixels
                    values: "auto", integer
                    */
                    scrollAmount:"auto",
                    /*
                    mouse-wheel scrolling axis
                    the default scrolling direction when both vertical and horizontal scrollbars are present
                    values (string): "y", "x"
                    */
                    axis:"y",
                    /*
                    prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached
                    values: boolean
                        option						default
                        -------------------------------------
                        preventDefault				null
                    */
                    /*
                    the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.
                    values: "auto", integer
                    "auto" uses the default OS/browser value
                    */
                    deltaFactor:"auto",
                    /*
                    normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration)
                    values: boolean
                        option						default
                        -------------------------------------
                        normalizeDelta				null
                    */
                    /*
                    invert mouse-wheel scrolling direction
                    values: boolean
                        option						default
                        -------------------------------------
                        invert						null
                    */
                    /*
                    the tags that disable mouse-wheel when cursor is over them
                    */
                    disableOver:["select","option","keygen","datalist","textarea"]
                },
                /*
                scrollbar buttons
                */
                scrollButtons:{
                    /*
                    enable scrollbar buttons
                    values: boolean
                        option						default
                        -------------------------------------
                        enable						null
                    */
                    /*
                    scrollbar buttons scrolling type
                    values (string): "stepless", "stepped"
                    */
                    scrollType:"stepless",
                    /*
                    scrolling amount in pixels
                    values: "auto", integer
                    */
                    scrollAmount:"auto"
                    /*
                    tabindex of the scrollbar buttons
                    values: false, integer
                        option						default
                        -------------------------------------
                        tabindex					null
                    */
                },
                /*
                keyboard scrolling
                */
                keyboard:{
                    /*
                    enable scrolling via keyboard
                    values: boolean
                    */
                    enable:true,
                    /*
                    keyboard scrolling type
                    values (string): "stepless", "stepped"
                    */
                    scrollType:"stepless",
                    /*
                    scrolling amount in pixels
                    values: "auto", integer
                    */
                    scrollAmount:"auto"
                },
                /*
                enable content touch-swipe scrolling
                values: boolean, integer, string (number)
                integer values define the axis-specific minimum amount required for scrolling momentum
                */
                contentTouchScroll:25,
                /*
                enable/disable document (default) touch-swipe scrolling
                */
                documentTouchScroll:true,
                /*
                advanced option parameters
                */
                advanced:{
                    /*
                    auto-expand content horizontally (for "x" or "yx" axis)
                    values: boolean, integer (the value 2 forces the non scrollHeight/scrollWidth method, the value 3 forces the scrollHeight/scrollWidth method)
                        option						default
                        -------------------------------------
                        autoExpandHorizontalScroll	null
                    */
                    /*
                    auto-scroll to elements with focus
                    */
                    autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
                    /*
                    auto-update scrollbars on content, element or viewport resize
                    should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc.
                    values: boolean
                    */
                    updateOnContentResize:true,
                    /*
                    auto-update scrollbars each time each image inside the element is fully loaded
                    values: "auto", boolean
                    */
                    updateOnImageLoad:"auto",
                    /*
                    auto-update scrollbars based on the amount and size changes of specific selectors
                    useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size
                    values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed)
                    a value of true (boolean) will auto-update scrollbars each time any element is changed
                        option						default
                        -------------------------------------
                        updateOnSelectorChange		null
                    */
                    /*
                    extra selectors that'll allow scrollbar dragging upon mousemove/up, pointermove/up, touchend etc. (e.g. "selector-1, selector-2")
                        option						default
                        -------------------------------------
                        extraDraggableSelectors		null
                    */
                    /*
                    extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
                        option						default
                        -------------------------------------
                        releaseDraggableSelectors	null
                    */
                    /*
                    auto-update timeout
                    values: integer (milliseconds)
                    */
                    autoUpdateTimeout:60
                },
                /*
                scrollbar theme
                values: string (see CSS/plugin URI for a list of ready-to-use themes)
                */
                theme:"light",
                /*
                user defined callback functions
                */
                callbacks:{
                    /*
                    Available callbacks:
                        callback					default
                        -------------------------------------
                        onCreate					null
                        onInit						null
                        onScrollStart				null
                        onScroll					null
                        onTotalScroll				null
                        onTotalScrollBack			null
                        whileScrolling				null
                        onOverflowY					null
                        onOverflowX					null
                        onOverflowYNone				null
                        onOverflowXNone				null
                        onImageLoad					null
                        onSelectorChange			null
                        onBeforeUpdate				null
                        onUpdate					null
                    */
                    onTotalScrollOffset:0,
                    onTotalScrollBackOffset:0,
                    alwaysTriggerOffsets:true
                }
                /*
                add scrollbar(s) on all elements matching the current selector, now and in the future
                values: boolean, string
                string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
                liveSelector values: string (selector)
                    option						default
                    -------------------------------------
                    live						false
                    liveSelector				null
                */
            },





            /*
            ----------------------------------------
            VARS, CONSTANTS
            ----------------------------------------
            */

            totalInstances=0, /* plugin instances amount */
            liveTimers={}, /* live option timers */
            oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
            touchActive=false,touchable, /* global touch vars (for touch and pointer events) */
            /* general plugin classes */
            classes=[
                "mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar",
                "mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer",
                "mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"
            ],





            /*
            ----------------------------------------
            METHODS
            ----------------------------------------
            */

            methods={

                /*
                plugin initialization method
                creates the scrollbar(s), plugin data object and options
                ----------------------------------------
                */

                init:function(options){

                    var options=$.extend(true,{},defaults,options),
                        selector=_selector.call(this); /* validate selector */

                    /*
                    if live option is enabled, monitor for elements matching the current selector and
                    apply scrollbar(s) when found (now and in the future)
                    */
                    if(options.live){
                        var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
                            $liveSelector=$(liveSelector); /* live selector(s) as jquery object */
                        if(options.live==="off"){
                            /*
                            disable live if requested
                            usage: $(selector).mCustomScrollbar({live:"off"});
                            */
                            removeLiveTimers(liveSelector);
                            return;
                        }
                        liveTimers[liveSelector]=setTimeout(function(){
                            /* call mCustomScrollbar fn on live selector(s) every half-second */
                            $liveSelector.mCustomScrollbar(options);
                            if(options.live==="once" && $liveSelector.length){
                                /* disable live after first invocation */
                                removeLiveTimers(liveSelector);
                            }
                        },500);
                    }else{
                        removeLiveTimers(liveSelector);
                    }

                    /* options backward compatibility (for versions < 3.0.0) and normalization */
                    options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
                    options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
                    options.axis=(options.horizontalScroll) ? "x" : _findAxis(options.axis);
                    options.scrollInertia=options.scrollInertia>0 && options.scrollInertia<17 ? 17 : options.scrollInertia;
                    if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
                        options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
                    }
                    options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
                    options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
                    options.scrollButtons.scrollType=_findScrollButtonsType(options.scrollButtons.scrollType);

                    _theme(options); /* theme-specific options */

                    /* plugin constructor */
                    return $(selector).each(function(){

                        var $this=$(this);

                        if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */

                            /* store options and create objects in jquery data */
                            $this.data(pluginPfx,{
                                idx:++totalInstances, /* instance index */
                                opt:options, /* options */
                                scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
                                overflowed:null, /* overflowed axis */
                                contentReset:{y:null,x:null}, /* object to check when content resets */
                                bindEvents:false, /* object to check if events are bound */
                                tweenRunning:false, /* object to check if tween is running */
                                sequential:{}, /* sequential scrolling object */
                                langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
                                cbOffsets:null, /* object to check whether callback offsets always trigger */
                                /*
                                object to check how scrolling events where last triggered
                                "internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method)
                                usage: object.data("mCS").trigger
                                */
                                trigger:null,
                                /*
                                object to check for changes in elements in order to call the update method automatically
                                */
                                poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}
                            });

                            var d=$this.data(pluginPfx),o=d.opt,
                                /* HTML data attributes */
                                htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");

                            if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
                            if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
                            if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
                                o.theme=htmlDataTheme;
                                _theme(o); /* theme-specific options */
                            }

                            _pluginMarkup.call(this); /* add plugin markup */

                            if(d && o.callbacks.onCreate && typeof o.callbacks.onCreate==="function"){o.callbacks.onCreate.call(this);} /* callbacks: onCreate */

                            $("#mCSB_"+d.idx+"_container img:not(."+classes[2]+")").addClass(classes[2]); /* flag loaded images */

                            methods.update.call(null,$this); /* call the update method */

                        }

                    });

                },
                /* ---------------------------------------- */



                /*
                plugin update method
                updates content and scrollbar(s) values, events and status
                ----------------------------------------
                usage: $(selector).mCustomScrollbar("update");
                */

                update:function(el,cb){

                    var selector=el || _selector.call(this); /* validate selector */

                    return $(selector).each(function(){

                        var $this=$(this);

                        if($this.data(pluginPfx)){ /* check if plugin has initialized */

                            var d=$this.data(pluginPfx),o=d.opt,
                                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                                mCustomScrollBox=$("#mCSB_"+d.idx),
                                mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];

                            if(!mCSB_container.length){return;}

                            if(d.tweenRunning){_stop($this);} /* stop any running tweens while updating */

                            if(cb && d && o.callbacks.onBeforeUpdate && typeof o.callbacks.onBeforeUpdate==="function"){o.callbacks.onBeforeUpdate.call(this);} /* callbacks: onBeforeUpdate */

                            /* if element was disabled or destroyed, remove class(es) */
                            if($this.hasClass(classes[3])){$this.removeClass(classes[3]);}
                            if($this.hasClass(classes[4])){$this.removeClass(classes[4]);}

                            /* css flexbox fix, detect/set max-height */
                            mCustomScrollBox.css("max-height","none");
                            if(mCustomScrollBox.height()!==$this.height()){mCustomScrollBox.css("max-height",$this.height());}

                            _expandContentHorizontally.call(this); /* expand content horizontally */

                            if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
                                mCSB_container.css("width",_contentWidth(mCSB_container));
                            }

                            d.overflowed=_overflowed.call(this); /* determine if scrolling is required */

                            _scrollbarVisibility.call(this); /* show/hide scrollbar(s) */

                            /* auto-adjust scrollbar dragger length analogous to content */
                            if(o.autoDraggerLength){_setDraggerLength.call(this);}

                            _scrollRatio.call(this); /* calculate and store scrollbar to content ratio */

                            _bindEvents.call(this); /* bind scrollbar events */

                            /* reset scrolling position and/or events */
                            var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
                            if(o.axis!=="x"){ /* y/yx axis */
                                if(!d.overflowed[0]){ /* y scrolling is not required */
                                    _resetContentPosition.call(this); /* reset content position */
                                    if(o.axis==="y"){
                                        _unbindEvents.call(this);
                                    }else if(o.axis==="yx" && d.overflowed[1]){
                                        _scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
                                    }
                                }else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
                                    _resetContentPosition.call(this); /* reset content position */
                                }else{ /* y scrolling is required */
                                    _scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
                                    d.contentReset.y=null;
                                }
                            }
                            if(o.axis!=="y"){ /* x/yx axis */
                                if(!d.overflowed[1]){ /* x scrolling is not required */
                                    _resetContentPosition.call(this); /* reset content position */
                                    if(o.axis==="x"){
                                        _unbindEvents.call(this);
                                    }else if(o.axis==="yx" && d.overflowed[0]){
                                        _scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
                                    }
                                }else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
                                    _resetContentPosition.call(this); /* reset content position */
                                }else{ /* x scrolling is required */
                                    _scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
                                    d.contentReset.x=null;
                                }
                            }

                            /* callbacks: onImageLoad, onSelectorChange, onUpdate */
                            if(cb && d){
                                if(cb===2 && o.callbacks.onImageLoad && typeof o.callbacks.onImageLoad==="function"){
                                    o.callbacks.onImageLoad.call(this);
                                }else if(cb===3 && o.callbacks.onSelectorChange && typeof o.callbacks.onSelectorChange==="function"){
                                    o.callbacks.onSelectorChange.call(this);
                                }else if(o.callbacks.onUpdate && typeof o.callbacks.onUpdate==="function"){
                                    o.callbacks.onUpdate.call(this);
                                }
                            }

                            _autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */

                        }

                    });

                },
                /* ---------------------------------------- */



                /*
                plugin scrollTo method
                triggers a scrolling event to a specific value
                ----------------------------------------
                usage: $(selector).mCustomScrollbar("scrollTo",value,options);
                */

                scrollTo:function(val,options){

                    /* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
                    if(typeof val=="undefined" || val==null){return;}

                    var selector=_selector.call(this); /* validate selector */

                    return $(selector).each(function(){

                        var $this=$(this);

                        if($this.data(pluginPfx)){ /* check if plugin has initialized */

                            var d=$this.data(pluginPfx),o=d.opt,
                                /* method default options */
                                methodDefaults={
                                    trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
                                    scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
                                    scrollEasing:"mcsEaseInOut", /* animation easing */
                                    moveDragger:false, /* move dragger instead of content */
                                    timeout:60, /* scroll-to delay */
                                    callbacks:true, /* enable/disable callbacks */
                                    onStart:true,
                                    onUpdate:true,
                                    onComplete:true
                                },
                                methodOptions=$.extend(true,{},methodDefaults,options),
                                to=_arr.call(this,val),dur=methodOptions.scrollInertia>0 && methodOptions.scrollInertia<17 ? 17 : methodOptions.scrollInertia;

                            /* translate yx values to actual scroll-to positions */
                            to[0]=_to.call(this,to[0],"y");
                            to[1]=_to.call(this,to[1],"x");

                            /*
                            check if scroll-to value moves the dragger instead of content.
                            Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.)
                            */
                            if(methodOptions.moveDragger){
                                to[0]*=d.scrollRatio.y;
                                to[1]*=d.scrollRatio.x;
                            }

                            methodOptions.dur=_isTabHidden() ? 0 : dur; //skip animations if browser tab is hidden

                            setTimeout(function(){
                                /* do the scrolling */
                                if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
                                    methodOptions.dir="y";
                                    methodOptions.overwrite="all";
                                    _scrollTo($this,to[0].toString(),methodOptions);
                                }
                                if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
                                    methodOptions.dir="x";
                                    methodOptions.overwrite="none";
                                    _scrollTo($this,to[1].toString(),methodOptions);
                                }
                            },methodOptions.timeout);

                        }

                    });

                },
                /* ---------------------------------------- */



                /*
                plugin stop method
                stops scrolling animation
                ----------------------------------------
                usage: $(selector).mCustomScrollbar("stop");
                */
                stop:function(){

                    var selector=_selector.call(this); /* validate selector */

                    return $(selector).each(function(){

                        var $this=$(this);

                        if($this.data(pluginPfx)){ /* check if plugin has initialized */

                            _stop($this);

                        }

                    });

                },
                /* ---------------------------------------- */



                /*
                plugin disable method
                temporarily disables the scrollbar(s)
                ----------------------------------------
                usage: $(selector).mCustomScrollbar("disable",reset);
                reset (boolean): resets content position to 0
                */
                disable:function(r){

                    var selector=_selector.call(this); /* validate selector */

                    return $(selector).each(function(){

                        var $this=$(this);

                        if($this.data(pluginPfx)){ /* check if plugin has initialized */

                            var d=$this.data(pluginPfx);

                            _autoUpdate.call(this,"remove"); /* remove automatic updating */

                            _unbindEvents.call(this); /* unbind events */

                            if(r){_resetContentPosition.call(this);} /* reset content position */

                            _scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */

                            $this.addClass(classes[3]); /* add disable class */

                        }

                    });

                },
                /* ---------------------------------------- */



                /*
                plugin destroy method
                completely removes the scrollbar(s) and returns the element to its original state
                ----------------------------------------
                usage: $(selector).mCustomScrollbar("destroy");
                */
                destroy:function(){

                    var selector=_selector.call(this); /* validate selector */

                    return $(selector).each(function(){

                        var $this=$(this);

                        if($this.data(pluginPfx)){ /* check if plugin has initialized */

                            var d=$this.data(pluginPfx),o=d.opt,
                                mCustomScrollBox=$("#mCSB_"+d.idx),
                                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                                scrollbar=$(".mCSB_"+d.idx+"_scrollbar");

                            if(o.live){removeLiveTimers(o.liveSelector || $(selector).selector);} /* remove live timers */

                            _autoUpdate.call(this,"remove"); /* remove automatic updating */

                            _unbindEvents.call(this); /* unbind events */

                            _resetContentPosition.call(this); /* reset content position */

                            $this.removeData(pluginPfx); /* remove plugin data object */

                            _delete(this,"mcs"); /* delete callbacks object */

                            /* remove plugin markup */
                            scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
                            mCSB_container.find("img."+classes[2]).removeClass(classes[2]); /* remove loaded images flag */
                            mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
                            /* remove plugin classes from the element and add destroy class */
                            $this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" "+classes[6]+" "+classes[7]+" "+classes[5]+" "+classes[3]).addClass(classes[4]);

                        }

                    });

                }
                /* ---------------------------------------- */

            },





            /*
            ----------------------------------------
            FUNCTIONS
            ----------------------------------------
            */

            /* validates selector (if selector is invalid or undefined uses the default one) */
            _selector=function(){
                return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
            },
            /* -------------------- */


            /* changes options according to theme */
            _theme=function(obj){
                var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
                    nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
                    disabledScrollButtonsThemes=["minimal","minimal-dark"],
                    enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
                    scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
                obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
                obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
                obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
                obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
                obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
            },
            /* -------------------- */


            /* live option timers removal */
            removeLiveTimers=function(selector){
                if(liveTimers[selector]){
                    clearTimeout(liveTimers[selector]);
                    _delete(liveTimers,selector);
                }
            },
            /* -------------------- */


            /* normalizes axis option to valid values: "y", "x", "yx" */
            _findAxis=function(val){
                return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
            },
            /* -------------------- */


            /* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
            _findScrollButtonsType=function(val){
                return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
            },
            /* -------------------- */


            /* generates plugin markup */
            _pluginMarkup=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    expandClass=o.autoExpandScrollbar ? " "+classes[1]+"_expand" : "",
                    scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
                    wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
                    scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
                    contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
                    autoHideClass=o.autoHideScrollbar ? " "+classes[6] : "",
                    scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " "+classes[7] : "";
                if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
                if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
                o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
                $this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir='"+d.langDir+"' /></div>");
                var mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container");
                if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
                    mCSB_container.css("width",_contentWidth(mCSB_container));
                }
                if(o.scrollbarPosition==="outside"){
                    if($this.css("position")==="static"){ /* requires elements with non-static position */
                        $this.css("position","relative");
                    }
                    $this.css("overflow","visible");
                    mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
                }else{
                    mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
                    mCSB_container.wrap(contentWrapper);
                }
                _scrollButtons.call(this); /* add scrollbar buttons */
                /* minimum dragger length */
                var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
                mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
                mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
            },
            /* -------------------- */


            /* calculates content width */
            _contentWidth=function(el){
                var val=[el[0].scrollWidth,Math.max.apply(Math,el.children().map(function(){return $(this).outerWidth(true);}).get())],w=el.parent().width();
                return val[0]>w ? val[0] : val[1]>w ? val[1] : "100%";
            },
            /* -------------------- */


            /* expands content horizontally */
            _expandContentHorizontally=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    mCSB_container=$("#mCSB_"+d.idx+"_container");
                if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
                    /* calculate scrollWidth */
                    mCSB_container.css({"width":"auto","min-width":0,"overflow-x":"scroll"});
                    var w=Math.ceil(mCSB_container[0].scrollWidth);
                    if(o.advanced.autoExpandHorizontalScroll===3 || (o.advanced.autoExpandHorizontalScroll!==2 && w>mCSB_container.parent().width())){
                        mCSB_container.css({"width":w,"min-width":"100%","overflow-x":"inherit"});
                    }else{
                        /*
                        wrap content with an infinite width div and set its position to absolute and width to auto.
                        Setting width to auto before calculating the actual width is important!
                        We must let the browser set the width as browser zoom values are impossible to calculate.
                        */
                        mCSB_container.css({"overflow-x":"inherit","position":"absolute"})
                            .wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
                            .css({ /* set actual width, original position and un-wrap */
                                /*
                                get the exact width (with decimals) and then round-up.
                                Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
                                */
                                "width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
                                "min-width":"100%",
                                "position":"relative"
                            }).unwrap();
                    }
                }
            },
            /* -------------------- */


            /* adds scrollbar buttons */
            _scrollButtons=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
                    tabindex=!_isNumeric(o.scrollButtons.tabindex) ? "" : "tabindex='"+o.scrollButtons.tabindex+"'",
                    btnHTML=[
                        "<a href='#' class='"+classes[13]+"' "+tabindex+" />",
                        "<a href='#' class='"+classes[14]+"' "+tabindex+" />",
                        "<a href='#' class='"+classes[15]+"' "+tabindex+" />",
                        "<a href='#' class='"+classes[16]+"' "+tabindex+" />"
                    ],
                    btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
                if(o.scrollButtons.enable){
                    mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
                }
            },
            /* -------------------- */


            /* auto-adjusts scrollbar dragger length */
            _setDraggerLength=function(){
                var $this=$(this),d=$this.data(pluginPfx),
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                    ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
                    l=[
                        parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
                        parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
                    ],
                    h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
                mCSB_dragger[0].css({
                    "height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
                }).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
                mCSB_dragger[1].css({
                    "width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
                });
            },
            /* -------------------- */


            /* calculates scrollbar to content ratio */
            _scrollRatio=function(){
                var $this=$(this),d=$this.data(pluginPfx),
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                    scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
                    ratio=[
                        scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
                        scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
                    ];
                d.scrollRatio={y:ratio[0],x:ratio[1]};
            },
            /* -------------------- */


            /* toggles scrolling classes */
            _onDragClasses=function(el,action,xpnd){
                var expandClass=xpnd ? classes[0]+"_expanded" : "",
                    scrollbar=el.closest(".mCSB_scrollTools");
                if(action==="active"){
                    el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]);
                    el[0]._draggable=el[0]._draggable ? 0 : 1;
                }else{
                    if(!el[0]._draggable){
                        if(action==="hide"){
                            el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
                        }else{
                            el.addClass(classes[0]); scrollbar.addClass(classes[1]);
                        }
                    }
                }
            },
            /* -------------------- */


            /* checks if content overflows its container to determine if scrolling is required */
            _overflowed=function(){
                var $this=$(this),d=$this.data(pluginPfx),
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
                    contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false),
                    h=mCSB_container[0].scrollHeight,w=mCSB_container[0].scrollWidth;
                if(h>contentHeight){contentHeight=h;}
                if(w>contentWidth){contentWidth=w;}
                return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
            },
            /* -------------------- */


            /* resets content position to 0 */
            _resetContentPosition=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
                _stop($this); /* stop any current scrolling before resetting */
                if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){ /* reset y */
                    mCSB_dragger[0].add(mCSB_container).css("top",0);
                    _scrollTo($this,"_resetY");
                }
                if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
                    var cx=dx=0;
                    if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
                        cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
                        dx=Math.abs(cx/d.scrollRatio.x);
                    }
                    mCSB_container.css("left",cx);
                    mCSB_dragger[1].css("left",dx);
                    _scrollTo($this,"_resetX");
                }
            },
            /* -------------------- */


            /* binds scrollbar events */
            _bindEvents=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
                if(!d.bindEvents){ /* check if events are already bound */
                    _draggable.call(this);
                    if(o.contentTouchScroll){_contentDraggable.call(this);}
                    _selectable.call(this);
                    if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
                        function _mwt(){
                            mousewheelTimeout=setTimeout(function(){
                                if(!$.event.special.mousewheel){
                                    _mwt();
                                }else{
                                    clearTimeout(mousewheelTimeout);
                                    _mousewheel.call($this[0]);
                                }
                            },100);
                        }
                        var mousewheelTimeout;
                        _mwt();
                    }
                    _draggerRail.call(this);
                    _wrapperScroll.call(this);
                    if(o.advanced.autoScrollOnFocus){_focus.call(this);}
                    if(o.scrollButtons.enable){_buttons.call(this);}
                    if(o.keyboard.enable){_keyboard.call(this);}
                    d.bindEvents=true;
                }
            },
            /* -------------------- */


            /* unbinds scrollbar events */
            _unbindEvents=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    namespace=pluginPfx+"_"+d.idx,
                    sb=".mCSB_"+d.idx+"_scrollbar",
                    sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" ."+classes[12]+",#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
                    mCSB_container=$("#mCSB_"+d.idx+"_container");
                if(o.advanced.releaseDraggableSelectors){sel.add($(o.advanced.releaseDraggableSelectors));}
                if(o.advanced.extraDraggableSelectors){sel.add($(o.advanced.extraDraggableSelectors));}
                if(d.bindEvents){ /* check if events are bound */
                    /* unbind namespaced events from document/selectors */
                    $(document).add($(!_canAccessIFrame() || top.document)).unbind("."+namespace);
                    sel.each(function(){
                        $(this).unbind("."+namespace);
                    });
                    /* clear and delete timeouts/objects */
                    clearTimeout($this[0]._focusTimeout); _delete($this[0],"_focusTimeout");
                    clearTimeout(d.sequential.step); _delete(d.sequential,"step");
                    clearTimeout(mCSB_container[0].onCompleteTimeout); _delete(mCSB_container[0],"onCompleteTimeout");
                    d.bindEvents=false;
                }
            },
            /* -------------------- */


            /* toggles scrollbar visibility */
            _scrollbarVisibility=function(disabled){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
                    content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
                    scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
                    mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
                if(o.axis!=="x"){
                    if(d.overflowed[0] && !disabled){
                        scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
                        content.removeClass(classes[8]+" "+classes[10]);
                    }else{
                        if(o.alwaysShowScrollbar){
                            if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].css("display","none");}
                            content.removeClass(classes[10]);
                        }else{
                            scrollbar[0].css("display","none");
                            content.addClass(classes[10]);
                        }
                        content.addClass(classes[8]);
                    }
                }
                if(o.axis!=="y"){
                    if(d.overflowed[1] && !disabled){
                        scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
                        content.removeClass(classes[9]+" "+classes[11]);
                    }else{
                        if(o.alwaysShowScrollbar){
                            if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].css("display","none");}
                            content.removeClass(classes[11]);
                        }else{
                            scrollbar[1].css("display","none");
                            content.addClass(classes[11]);
                        }
                        content.addClass(classes[9]);
                    }
                }
                if(!d.overflowed[0] && !d.overflowed[1]){
                    $this.addClass(classes[5]);
                }else{
                    $this.removeClass(classes[5]);
                }
            },
            /* -------------------- */


            /* returns input coordinates of pointer, touch and mouse events (relative to document) */
            _coordinates=function(e){
                var t=e.type,o=e.target.ownerDocument!==document && frameElement!==null ? [$(frameElement).offset().top,$(frameElement).offset().left] : null,
                    io=_canAccessIFrame() && e.target.ownerDocument!==top.document && frameElement!==null ? [$(e.view.frameElement).offset().top,$(e.view.frameElement).offset().left] : [0,0];
                switch(t){
                    case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
                    return o ? [e.originalEvent.pageY-o[0]+io[0],e.originalEvent.pageX-o[1]+io[1],false] : [e.originalEvent.pageY,e.originalEvent.pageX,false];
                    break;
                    case "touchstart": case "touchmove": case "touchend":
                    var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                        touches=e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
                    return e.target.ownerDocument!==document ? [touch.screenY,touch.screenX,touches>1] : [touch.pageY,touch.pageX,touches>1];
                    break;
                    default:
                        return o ? [e.pageY-o[0]+io[0],e.pageX-o[1]+io[1],false] : [e.pageY,e.pageX,false];
                }
            },
            /* -------------------- */


            /*
            SCROLLBAR DRAG EVENTS
            scrolls content via scrollbar dragging
            */
            _draggable=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    namespace=pluginPfx+"_"+d.idx,
                    draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
                    draggable,dragY,dragX,
                    rds=o.advanced.releaseDraggableSelectors ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors)) : mCSB_dragger,
                    eds=o.advanced.extraDraggableSelectors ? $(!_canAccessIFrame() || top.document).add($(o.advanced.extraDraggableSelectors)) : $(!_canAccessIFrame() || top.document);
                mCSB_dragger.bind("contextmenu."+namespace,function(e){
                    e.preventDefault(); //prevent right click
                }).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
                    touchActive=true;
                    if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
                    _iframe.call(mCSB_container,false); /* enable scrollbar dragging over iframes by disabling their events */
                    _stop($this);
                    draggable=$(this);
                    var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
                        h=draggable.height()+offset.top,w=draggable.width()+offset.left;
                    if(y<h && y>0 && x<w && x>0){
                        dragY=y;
                        dragX=x;
                    }
                    _onDragClasses(draggable,"active",o.autoExpandScrollbar);
                }).bind("touchmove."+namespace,function(e){
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
                    _drag(dragY,dragX,y,x);
                });
                $(document).add(eds).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
                    if(draggable){
                        var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
                        if(dragY===y && dragX===x){return;} /* has it really moved? */
                        _drag(dragY,dragX,y,x);
                    }
                }).add(rds).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
                    if(draggable){
                        _onDragClasses(draggable,"active",o.autoExpandScrollbar);
                        draggable=null;
                    }
                    touchActive=false;
                    if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
                    _iframe.call(mCSB_container,true); /* enable iframes events */
                });
                function _drag(dragY,dragX,y,x){
                    mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
                    if(draggable.attr("id")===draggerId[1]){
                        var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
                    }else{
                        var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
                    }
                    _scrollTo($this,to.toString(),{dir:dir,drag:true});
                }
            },
            /* -------------------- */


            /*
            TOUCH SWIPE EVENTS
            scrolls content via touch swipe
            Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices
            */
            _contentDraggable=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    namespace=pluginPfx+"_"+d.idx,
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                    draggable,dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
                    durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all",touchIntent=[],touchDrag,docDrag,
                    iframe=mCSB_container.find("iframe"),
                    events=[
                        "touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace, //start
                        "touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace, //move
                        "touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace //end
                    ],
                    touchAction=document.body.style.touchAction!==undefined && document.body.style.touchAction!=="";
                mCSB_container.bind(events[0],function(e){
                    _onTouchstart(e);
                }).bind(events[1],function(e){
                    _onTouchmove(e);
                });
                mCustomScrollBox.bind(events[0],function(e){
                    _onTouchstart2(e);
                }).bind(events[2],function(e){
                    _onTouchend(e);
                });
                if(iframe.length){
                    iframe.each(function(){
                        $(this).bind("load",function(){
                            /* bind events on accessible iframes */
                            if(_canAccessIFrame(this)){
                                $(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
                                    _onTouchstart(e);
                                    _onTouchstart2(e);
                                }).bind(events[1],function(e){
                                    _onTouchmove(e);
                                }).bind(events[2],function(e){
                                    _onTouchend(e);
                                });
                            }
                        });
                    });
                }
                function _onTouchstart(e){
                    if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
                    touchable=1; touchDrag=0; docDrag=0; draggable=1;
                    $this.removeClass("mCS_touch_action");
                    var offset=mCSB_container.offset();
                    dragY=_coordinates(e)[0]-offset.top;
                    dragX=_coordinates(e)[1]-offset.left;
                    touchIntent=[_coordinates(e)[0],_coordinates(e)[1]];
                }
                function _onTouchmove(e){
                    if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
                    if(!o.documentTouchScroll){e.preventDefault();}
                    e.stopImmediatePropagation();
                    if(docDrag && !touchDrag){return;}
                    if(draggable){
                        runningTime=_getTime();
                        var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
                            easing="mcsLinearOut";
                        touchMoveY.push(y);
                        touchMoveX.push(x);
                        touchIntent[2]=Math.abs(_coordinates(e)[0]-touchIntent[0]); touchIntent[3]=Math.abs(_coordinates(e)[1]-touchIntent[1]);
                        if(d.overflowed[0]){
                            var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
                                prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y) && (touchIntent[3]*2<touchIntent[2] || o.axis==="yx"));
                        }
                        if(d.overflowed[1]){
                            var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
                                preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x) && (touchIntent[2]*2<touchIntent[3] || o.axis==="yx"));
                        }
                        if(prevent || preventX){ /* prevent native document scrolling */
                            if(!touchAction){e.preventDefault();}
                            touchDrag=1;
                        }else{
                            docDrag=1;
                            $this.addClass("mCS_touch_action");
                        }
                        if(touchAction){e.preventDefault();}
                        amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
                        mCSB_container[0].idleTimer=250;
                        if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
                        if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
                    }
                }
                function _onTouchstart2(e){
                    if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
                    touchable=1;
                    e.stopImmediatePropagation();
                    _stop($this);
                    startTime=_getTime();
                    var offset=mCustomScrollBox.offset();
                    touchStartY=_coordinates(e)[0]-offset.top;
                    touchStartX=_coordinates(e)[1]-offset.left;
                    touchMoveY=[]; touchMoveX=[];
                }
                function _onTouchend(e){
                    if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
                    draggable=0;
                    e.stopImmediatePropagation();
                    touchDrag=0; docDrag=0;
                    endTime=_getTime();
                    var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
                    if((endTime-runningTime)>30){return;}
                    speed=1000/(endTime-startTime);
                    var easing="mcsEaseOut",slow=speed<2.5,
                        diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
                    distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
                    var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
                    speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
                    var a=[
                        Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
                        Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
                    ];
                    amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
                    durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
                    var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
                    amount[0]=absDistance[0]>md ? amount[0] : 0;
                    amount[1]=absDistance[1]>md ? amount[1] : 0;
                    if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
                    if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
                }
                function _m(ds,s){
                    var r=[s*1.5,s*2,s/1.5,s/2];
                    if(ds>90){
                        return s>4 ? r[0] : r[3];
                    }else if(ds>60){
                        return s>3 ? r[3] : r[2];
                    }else if(ds>30){
                        return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
                    }else{
                        return s>8 ? s : r[3];
                    }
                }
                function _drag(amount,dur,easing,dir,overwrite,drag){
                    if(!amount){return;}
                    _scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
                }
            },
            /* -------------------- */


            /*
            SELECT TEXT EVENTS
            scrolls content when text is selected
            */
            _selectable=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
                    namespace=pluginPfx+"_"+d.idx,
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    wrapper=mCSB_container.parent(),
                    action;
                mCSB_container.bind("mousedown."+namespace,function(e){
                    if(touchable){return;}
                    if(!action){action=1; touchActive=true;}
                }).add(document).bind("mousemove."+namespace,function(e){
                    if(!touchable && action && _sel()){
                        var offset=mCSB_container.offset(),
                            y=_coordinates(e)[0]-offset.top+mCSB_container[0].offsetTop,x=_coordinates(e)[1]-offset.left+mCSB_container[0].offsetLeft;
                        if(y>0 && y<wrapper.height() && x>0 && x<wrapper.width()){
                            if(seq.step){_seq("off",null,"stepped");}
                        }else{
                            if(o.axis!=="x" && d.overflowed[0]){
                                if(y<0){
                                    _seq("on",38);
                                }else if(y>wrapper.height()){
                                    _seq("on",40);
                                }
                            }
                            if(o.axis!=="y" && d.overflowed[1]){
                                if(x<0){
                                    _seq("on",37);
                                }else if(x>wrapper.width()){
                                    _seq("on",39);
                                }
                            }
                        }
                    }
                }).bind("mouseup."+namespace+" dragend."+namespace,function(e){
                    if(touchable){return;}
                    if(action){action=0; _seq("off",null);}
                    touchActive=false;
                });
                function _sel(){
                    return 	window.getSelection ? window.getSelection().toString() :
                        document.selection && document.selection.type!="Control" ? document.selection.createRange().text : 0;
                }
                function _seq(a,c,s){
                    seq.type=s && action ? "stepped" : "stepless";
                    seq.scrollAmount=10;
                    _sequentialScroll($this,a,c,"mcsLinearOut",s ? 60 : null);
                }
            },
            /* -------------------- */


            /*
            MOUSE WHEEL EVENT
            scrolls content via mouse-wheel
            via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
            */
            _mousewheel=function(){
                if(!$(this).data(pluginPfx)){return;} /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    namespace=pluginPfx+"_"+d.idx,
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                    iframe=$("#mCSB_"+d.idx+"_container").find("iframe");
                if(iframe.length){
                    iframe.each(function(){
                        $(this).bind("load",function(){
                            /* bind events on accessible iframes */
                            if(_canAccessIFrame(this)){
                                $(this.contentDocument || this.contentWindow.document).bind("mousewheel."+namespace,function(e,delta){
                                    _onMousewheel(e,delta);
                                });
                            }
                        });
                    });
                }
                mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
                    _onMousewheel(e,delta);
                });
                function _onMousewheel(e,delta){
                    _stop($this);
                    if(_disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
                    var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor || 100,
                        dur=o.scrollInertia;
                    if(o.axis==="x" || o.mouseWheel.axis==="x"){
                        var dir="x",
                            px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
                            amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
                            contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
                            draggerPos=mCSB_dragger[1][0].offsetLeft,
                            limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
                            dlt=o.mouseWheel.axis==="y" ? (e.deltaY || delta) : e.deltaX;
                    }else{
                        var dir="y",
                            px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
                            amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
                            contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
                            draggerPos=mCSB_dragger[0][0].offsetTop,
                            limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
                            dlt=e.deltaY || delta;
                    }
                    if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
                    if(o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice){dlt=-dlt;}
                    if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
                    if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
                        e.stopImmediatePropagation();
                        e.preventDefault();
                    }
                    if(e.deltaFactor<5 && !o.mouseWheel.normalizeDelta){
                        //very low deltaFactor values mean some kind of delta acceleration (e.g. osx trackpad), so adjusting scrolling accordingly
                        amount=e.deltaFactor; dur=17;
                    }
                    _scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir,dur:dur});
                }
            },
            /* -------------------- */


            /* checks if iframe can be accessed */
            _canAccessIFrameCache=new Object(),
            _canAccessIFrame=function(iframe){
                var result=false,cacheKey=false,html=null;
                if(iframe===undefined){
                    cacheKey="#empty";
                }else if($(iframe).attr("id")!==undefined){
                    cacheKey=$(iframe).attr("id");
                }
                if(cacheKey!==false && _canAccessIFrameCache[cacheKey]!==undefined){
                    return _canAccessIFrameCache[cacheKey];
                }
                if(!iframe){
                    try{
                        var doc=top.document;
                        html=doc.body.innerHTML;
                    }catch(err){/* do nothing */}
                    result=(html!==null);
                }else{
                    try{
                        var doc=iframe.contentDocument || iframe.contentWindow.document;
                        html=doc.body.innerHTML;
                    }catch(err){/* do nothing */}
                    result=(html!==null);
                }
                if(cacheKey!==false){_canAccessIFrameCache[cacheKey]=result;}
                return result;
            },
            /* -------------------- */


            /* switches iframe's pointer-events property (drag, mousewheel etc. over cross-domain iframes) */
            _iframe=function(evt){
                var el=this.find("iframe");
                if(!el.length){return;} /* check if content contains iframes */
                var val=!evt ? "none" : "auto";
                el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
            },
            /* -------------------- */


            /* disables mouse-wheel when hovering specific elements like select, datalist etc. */
            _disableMousewheel=function(el,target){
                var tag=target.nodeName.toLowerCase(),
                    tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
                    /* elements that require focus */
                    focusTags=["select","textarea"];
                return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
            },
            /* -------------------- */


            /*
            DRAGGER RAIL CLICK EVENT
            scrolls content via dragger rail
            */
            _draggerRail=function(){
                var $this=$(this),d=$this.data(pluginPfx),
                    namespace=pluginPfx+"_"+d.idx,
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    wrapper=mCSB_container.parent(),
                    mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar ."+classes[12]),
                    clickable;
                mCSB_draggerContainer.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
                    touchActive=true;
                    if(!$(e.target).hasClass("mCSB_dragger")){clickable=1;}
                }).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
                    touchActive=false;
                }).bind("click."+namespace,function(e){
                    if(!clickable){return;}
                    clickable=0;
                    if($(e.target).hasClass(classes[12]) || $(e.target).hasClass("mCSB_draggerRail")){
                        _stop($this);
                        var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
                        if(el.parent(".mCSB_scrollTools_horizontal").length>0){
                            if(!d.overflowed[1]){return;}
                            var dir="x",
                                clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
                                to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9));
                        }else{
                            if(!d.overflowed[0]){return;}
                            var dir="y",
                                clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
                                to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
                        }
                        _scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
                    }
                });
            },
            /* -------------------- */


            /*
            FOCUS EVENT
            scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
            */
            _focus=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    namespace=pluginPfx+"_"+d.idx,
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    wrapper=mCSB_container.parent();
                mCSB_container.bind("focusin."+namespace,function(e){
                    var el=$(document.activeElement),
                        nested=mCSB_container.find(".mCustomScrollBox").length,
                        dur=0;
                    if(!el.is(o.advanced.autoScrollOnFocus)){return;}
                    _stop($this);
                    clearTimeout($this[0]._focusTimeout);
                    $this[0]._focusTimer=nested ? (dur+17)*nested : 0;
                    $this[0]._focusTimeout=setTimeout(function(){
                        var	to=[_childPos(el)[0],_childPos(el)[1]],
                            contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
                            isVisible=[
                                (contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
                                (contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
                            ],
                            overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
                        if(o.axis!=="x" && !isVisible[0]){
                            _scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
                        }
                        if(o.axis!=="y" && !isVisible[1]){
                            _scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
                        }
                    },$this[0]._focusTimer);
                });
            },
            /* -------------------- */


            /* sets content wrapper scrollTop/scrollLeft always to 0 */
            _wrapperScroll=function(){
                var $this=$(this),d=$this.data(pluginPfx),
                    namespace=pluginPfx+"_"+d.idx,
                    wrapper=$("#mCSB_"+d.idx+"_container").parent();
                wrapper.bind("scroll."+namespace,function(e){
                    if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){
                        $(".mCSB_"+d.idx+"_scrollbar").css("visibility","hidden"); /* hide scrollbar(s) */
                    }
                });
            },
            /* -------------------- */


            /*
            BUTTONS EVENTS
            scrolls content via up, down, left and right buttons
            */
            _buttons=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
                    namespace=pluginPfx+"_"+d.idx,
                    sel=".mCSB_"+d.idx+"_scrollbar",
                    btn=$(sel+">a");
                btn.bind("contextmenu."+namespace,function(e){
                    e.preventDefault(); //prevent right click
                }).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+" pointerout."+namespace+" MSPointerOut."+namespace+" click."+namespace,function(e){
                    e.preventDefault();
                    if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
                    var btnClass=$(this).attr("class");
                    seq.type=o.scrollButtons.scrollType;
                    switch(e.type){
                        case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
                        if(seq.type==="stepped"){return;}
                        touchActive=true;
                        d.tweenRunning=false;
                        _seq("on",btnClass);
                        break;
                        case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
                        case "mouseout": case "pointerout": case "MSPointerOut":
                        if(seq.type==="stepped"){return;}
                        touchActive=false;
                        if(seq.dir){_seq("off",btnClass);}
                        break;
                        case "click":
                            if(seq.type!=="stepped" || d.tweenRunning){return;}
                            _seq("on",btnClass);
                            break;
                    }
                    function _seq(a,c){
                        seq.scrollAmount=o.scrollButtons.scrollAmount;
                        _sequentialScroll($this,a,c);
                    }
                });
            },
            /* -------------------- */


            /*
            KEYBOARD EVENTS
            scrolls content via keyboard
            Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
            */
            _keyboard=function(){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
                    namespace=pluginPfx+"_"+d.idx,
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    wrapper=mCSB_container.parent(),
                    editables="input,textarea,select,datalist,keygen,[contenteditable='true']",
                    iframe=mCSB_container.find("iframe"),
                    events=["blur."+namespace+" keydown."+namespace+" keyup."+namespace];
                if(iframe.length){
                    iframe.each(function(){
                        $(this).bind("load",function(){
                            /* bind events on accessible iframes */
                            if(_canAccessIFrame(this)){
                                $(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
                                    _onKeyboard(e);
                                });
                            }
                        });
                    });
                }
                mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
                    _onKeyboard(e);
                });
                function _onKeyboard(e){
                    switch(e.type){
                        case "blur":
                            if(d.tweenRunning && seq.dir){_seq("off",null);}
                            break;
                        case "keydown": case "keyup":
                        var code=e.keyCode ? e.keyCode : e.which,action="on";
                        if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
                            /* up (38), down (40), left (37), right (39) arrows */
                            if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
                            if(e.type==="keyup"){action="off";}
                            if(!$(document.activeElement).is(editables)){
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                _seq(action,code);
                            }
                        }else if(code===33 || code===34){
                            /* PgUp (33), PgDn (34) */
                            if(d.overflowed[0] || d.overflowed[1]){
                                e.preventDefault();
                                e.stopImmediatePropagation();
                            }
                            if(e.type==="keyup"){
                                _stop($this);
                                var keyboardDir=code===34 ? -1 : 1;
                                if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
                                    var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
                                }else{
                                    var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
                                }
                                _scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
                            }
                        }else if(code===35 || code===36){
                            /* End (35), Home (36) */
                            if(!$(document.activeElement).is(editables)){
                                if(d.overflowed[0] || d.overflowed[1]){
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                }
                                if(e.type==="keyup"){
                                    if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
                                        var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
                                    }else{
                                        var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
                                    }
                                    _scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
                                }
                            }
                        }
                        break;
                    }
                    function _seq(a,c){
                        seq.type=o.keyboard.scrollType;
                        seq.scrollAmount=o.keyboard.scrollAmount;
                        if(seq.type==="stepped" && d.tweenRunning){return;}
                        _sequentialScroll($this,a,c);
                    }
                }
            },
            /* -------------------- */


            /* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
            _sequentialScroll=function(el,action,trigger,e,s){
                var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    once=seq.type==="stepped" ? true : false,
                    steplessSpeed=o.scrollInertia < 26 ? 26 : o.scrollInertia, /* 26/1.5=17 */
                    steppedSpeed=o.scrollInertia < 1 ? 17 : o.scrollInertia;
                switch(action){
                    case "on":
                        seq.dir=[
                            (trigger===classes[16] || trigger===classes[15] || trigger===39 || trigger===37 ? "x" : "y"),
                            (trigger===classes[13] || trigger===classes[15] || trigger===38 || trigger===37 ? -1 : 1)
                        ];
                        _stop(el);
                        if(_isNumeric(trigger) && seq.type==="stepped"){return;}
                        _on(once);
                        break;
                    case "off":
                        _off();
                        if(once || (d.tweenRunning && seq.dir)){
                            _on(true);
                        }
                        break;
                }

                /* starts sequence */
                function _on(once){
                    if(o.snapAmount){seq.scrollAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : seq.dir[0]==="x" ? o.snapAmount[1] : o.snapAmount[0];} /* scrolling snapping */
                    var c=seq.type!=="stepped", /* continuous scrolling */
                        t=s ? s : !once ? 1000/60 : c ? steplessSpeed/1.5 : steppedSpeed, /* timer */
                        m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
                        contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
                        ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
                        amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
                        px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
                        to=seq.scrollAmount!=="auto" ? px : amount,
                        easing=e ? e : !once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
                        onComplete=!once ? false : true;
                    if(once && t<17){
                        to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
                    }
                    _scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});
                    if(once){
                        seq.dir=false;
                        return;
                    }
                    clearTimeout(seq.step);
                    seq.step=setTimeout(function(){
                        _on();
                    },t);
                }
                /* stops sequence */
                function _off(){
                    clearTimeout(seq.step);
                    _delete(seq,"step");
                    _stop(el);
                }
            },
            /* -------------------- */


            /* returns a yx array from value */
            _arr=function(val){
                var o=$(this).data(pluginPfx).opt,vals=[];
                if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
                /* check if value is object or array, its length and create an array with yx values */
                if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
                    vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
                    vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
                }else{ /* array value (e.g. [100,100]) */
                    vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
                }
                /* check if array values are anonymous functions */
                if(typeof vals[0]==="function"){vals[0]=vals[0]();}
                if(typeof vals[1]==="function"){vals[1]=vals[1]();}
                return vals;
            },
            /* -------------------- */


            /* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
            _to=function(val,dir){
                if(val==null || typeof val=="undefined"){return;}
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    wrapper=mCSB_container.parent(),
                    t=typeof val;
                if(!dir){dir=o.axis==="x" ? "x" : "y";}
                var contentLength=dir==="x" ? mCSB_container.outerWidth(false)-wrapper.width() : mCSB_container.outerHeight(false)-wrapper.height(),
                    contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
                    cssProp=dir==="x" ? "left" : "top";
                switch(t){
                    case "function": /* this currently is not used. Consider removing it */
                        return val();
                        break;
                    case "object": /* js/jquery object */
                        var obj=val.jquery ? val : $(val);
                        if(!obj.length){return;}
                        return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
                        break;
                    case "string": case "number":
                    if(_isNumeric(val)){ /* numeric value */
                        return Math.abs(val);
                    }else if(val.indexOf("%")!==-1){ /* percentage value */
                        return Math.abs(contentLength*parseInt(val)/100);
                    }else if(val.indexOf("-=")!==-1){ /* decrease value */
                        return Math.abs(contentPos-parseInt(val.split("-=")[1]));
                    }else if(val.indexOf("+=")!==-1){ /* inrease value */
                        var p=(contentPos+parseInt(val.split("+=")[1]));
                        return p>=0 ? 0 : Math.abs(p);
                    }else if(val.indexOf("px")!==-1 && _isNumeric(val.split("px")[0])){ /* pixels string value (e.g. "100px") */
                        return Math.abs(val.split("px")[0]);
                    }else{
                        if(val==="top" || val==="left"){ /* special strings */
                            return 0;
                        }else if(val==="bottom"){
                            return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
                        }else if(val==="right"){
                            return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
                        }else if(val==="first" || val==="last"){
                            var obj=mCSB_container.find(":"+val);
                            return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
                        }else{
                            if($(val).length){ /* jquery selector */
                                return dir==="x" ? _childPos($(val))[1] : _childPos($(val))[0];
                            }else{ /* other values (e.g. "100em") */
                                mCSB_container.css(cssProp,val);
                                methods.update.call(null,$this[0]);
                                return;
                            }
                        }
                    }
                    break;
                }
            },
            /* -------------------- */


            /* calls the update method automatically */
            _autoUpdate=function(rem){
                var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                    mCSB_container=$("#mCSB_"+d.idx+"_container");
                if(rem){
                    /*
                    removes autoUpdate timer
                    usage: _autoUpdate.call(this,"remove");
                    */
                    clearTimeout(mCSB_container[0].autoUpdate);
                    _delete(mCSB_container[0],"autoUpdate");
                    return;
                }
                upd();
                function upd(){
                    clearTimeout(mCSB_container[0].autoUpdate);
                    if($this.parents("html").length===0){
                        /* check element in dom tree */
                        $this=null;
                        return;
                    }
                    mCSB_container[0].autoUpdate=setTimeout(function(){
                        /* update on specific selector(s) length and size change */
                        if(o.advanced.updateOnSelectorChange){
                            d.poll.change.n=sizesSum();
                            if(d.poll.change.n!==d.poll.change.o){
                                d.poll.change.o=d.poll.change.n;
                                doUpd(3);
                                return;
                            }
                        }
                        /* update on main element and scrollbar size changes */
                        if(o.advanced.updateOnContentResize){
                            d.poll.size.n=$this[0].scrollHeight+$this[0].scrollWidth+mCSB_container[0].offsetHeight+$this[0].offsetHeight+$this[0].offsetWidth;
                            if(d.poll.size.n!==d.poll.size.o){
                                d.poll.size.o=d.poll.size.n;
                                doUpd(1);
                                return;
                            }
                        }
                        /* update on image load */
                        if(o.advanced.updateOnImageLoad){
                            if(!(o.advanced.updateOnImageLoad==="auto" && o.axis==="y")){ //by default, it doesn't run on vertical content
                                d.poll.img.n=mCSB_container.find("img").length;
                                if(d.poll.img.n!==d.poll.img.o){
                                    d.poll.img.o=d.poll.img.n;
                                    mCSB_container.find("img").each(function(){
                                        imgLoader(this);
                                    });
                                    return;
                                }
                            }
                        }
                        if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
                    },o.advanced.autoUpdateTimeout);
                }
                /* a tiny image loader */
                function imgLoader(el){
                    if($(el).hasClass(classes[2])){doUpd(); return;}
                    var img=new Image();
                    function createDelegate(contextObject,delegateMethod){
                        return function(){return delegateMethod.apply(contextObject,arguments);}
                    }
                    function imgOnLoad(){
                        this.onload=null;
                        $(el).addClass(classes[2]);
                        doUpd(2);
                    }
                    img.onload=createDelegate(img,imgOnLoad);
                    img.src=el.src;
                }
                /* returns the total height and width sum of all elements matching the selector */
                function sizesSum(){
                    if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
                    var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
                    if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=this.offsetHeight+this.offsetWidth;});}
                    return total;
                }
                /* calls the update method */
                function doUpd(cb){
                    clearTimeout(mCSB_container[0].autoUpdate);
                    methods.update.call(null,$this[0],cb);
                }
            },
            /* -------------------- */


            /* snaps scrolling to a multiple of a pixels number */
            _snapAmount=function(to,amount,offset){
                return (Math.round(to/amount)*amount-offset);
            },
            /* -------------------- */


            /* stops content and scrollbar animations */
            _stop=function(el){
                var d=el.data(pluginPfx),
                    sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
                sel.each(function(){
                    _stopTween.call(this);
                });
            },
            /* -------------------- */


            /*
            ANIMATES CONTENT
            This is where the actual scrolling happens
            */
            _scrollTo=function(el,to,options){
                var d=el.data(pluginPfx),o=d.opt,
                    defaults={
                        trigger:"internal",
                        dir:"y",
                        scrollEasing:"mcsEaseOut",
                        drag:false,
                        dur:o.scrollInertia,
                        overwrite:"all",
                        callbacks:true,
                        onStart:true,
                        onUpdate:true,
                        onComplete:true
                    },
                    options=$.extend(defaults,options),
                    dur=[options.dur,(options.drag ? 0 : options.dur)],
                    mCustomScrollBox=$("#mCSB_"+d.idx),
                    mCSB_container=$("#mCSB_"+d.idx+"_container"),
                    wrapper=mCSB_container.parent(),
                    totalScrollOffsets=o.callbacks.onTotalScrollOffset ? _arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
                    totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? _arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
                d.trigger=options.trigger;
                if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){ /* always reset scrollTop/Left */
                    $(".mCSB_"+d.idx+"_scrollbar").css("visibility","visible");
                    wrapper.scrollTop(0).scrollLeft(0);
                }
                if(to==="_resetY" && !d.contentReset.y){
                    /* callbacks: onOverflowYNone */
                    if(_cb("onOverflowYNone")){o.callbacks.onOverflowYNone.call(el[0]);}
                    d.contentReset.y=1;
                }
                if(to==="_resetX" && !d.contentReset.x){
                    /* callbacks: onOverflowXNone */
                    if(_cb("onOverflowXNone")){o.callbacks.onOverflowXNone.call(el[0]);}
                    d.contentReset.x=1;
                }
                if(to==="_resetY" || to==="_resetX"){return;}
                if((d.contentReset.y || !el[0].mcs) && d.overflowed[0]){
                    /* callbacks: onOverflowY */
                    if(_cb("onOverflowY")){o.callbacks.onOverflowY.call(el[0]);}
                    d.contentReset.x=null;
                }
                if((d.contentReset.x || !el[0].mcs) && d.overflowed[1]){
                    /* callbacks: onOverflowX */
                    if(_cb("onOverflowX")){o.callbacks.onOverflowX.call(el[0]);}
                    d.contentReset.x=null;
                }
                if(o.snapAmount){ /* scrolling snapping */
                    var snapAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : options.dir==="x" ? o.snapAmount[1] : o.snapAmount[0];
                    to=_snapAmount(to,snapAmount,o.snapOffset);
                }
                switch(options.dir){
                    case "x":
                        var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
                            property="left",
                            contentPos=mCSB_container[0].offsetLeft,
                            limit=[
                                mCustomScrollBox.width()-mCSB_container.outerWidth(false),
                                mCSB_dragger.parent().width()-mCSB_dragger.width()
                            ],
                            scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.x)],
                            tso=totalScrollOffsets[1],
                            tsbo=totalScrollBackOffsets[1],
                            totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
                            totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
                        break;
                    case "y":
                        var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
                            property="top",
                            contentPos=mCSB_container[0].offsetTop,
                            limit=[
                                mCustomScrollBox.height()-mCSB_container.outerHeight(false),
                                mCSB_dragger.parent().height()-mCSB_dragger.height()
                            ],
                            scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.y)],
                            tso=totalScrollOffsets[0],
                            tsbo=totalScrollBackOffsets[0],
                            totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
                            totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
                        break;
                }
                if(scrollTo[1]<0 || (scrollTo[0]===0 && scrollTo[1]===0)){
                    scrollTo=[0,0];
                }else if(scrollTo[1]>=limit[1]){
                    scrollTo=[limit[0],limit[1]];
                }else{
                    scrollTo[0]=-scrollTo[0];
                }
                if(!el[0].mcs){
                    _mcs();  /* init mcs object (once) to make it available before callbacks */
                    if(_cb("onInit")){o.callbacks.onInit.call(el[0]);} /* callbacks: onInit */
                }
                clearTimeout(mCSB_container[0].onCompleteTimeout);
                _tweenTo(mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
                if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
                _tweenTo(mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
                    onStart:function(){
                        if(options.callbacks && options.onStart && !d.tweenRunning){
                            /* callbacks: onScrollStart */
                            if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
                            d.tweenRunning=true;
                            _onDragClasses(mCSB_dragger);
                            d.cbOffsets=_cbOffsets();
                        }
                    },onUpdate:function(){
                        if(options.callbacks && options.onUpdate){
                            /* callbacks: whileScrolling */
                            if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
                        }
                    },onComplete:function(){
                        if(options.callbacks && options.onComplete){
                            if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
                            var t=mCSB_container[0].idleTimer || 0;
                            mCSB_container[0].onCompleteTimeout=setTimeout(function(){
                                /* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
                                if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
                                if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
                                if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
                                d.tweenRunning=false;
                                mCSB_container[0].idleTimer=0;
                                _onDragClasses(mCSB_dragger,"hide");
                            },t);
                        }
                    }
                });
                /* checks if callback function exists */
                function _cb(cb){
                    return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
                }
                /* checks whether callback offsets always trigger */
                function _cbOffsets(){
                    return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
                }
                /*
                populates object with useful values for the user
                values:
                    content: this.mcs.content
                    content top position: this.mcs.top
                    content left position: this.mcs.left
                    dragger top position: this.mcs.draggerTop
                    dragger left position: this.mcs.draggerLeft
                    scrolling y percentage: this.mcs.topPct
                    scrolling x percentage: this.mcs.leftPct
                    scrolling direction: this.mcs.direction
                */
                function _mcs(){
                    var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
                        dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
                        cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
                        pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
                    el[0].mcs={
                        content:mCSB_container, /* original content wrapper as jquery object */
                        top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
                        topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
                        direction:options.dir
                    };
                    /*
                    this refers to the original element containing the scrollbar(s)
                    usage: this.mcs.top, this.mcs.leftPct etc.
                    */
                }
            },
            /* -------------------- */


            /*
            CUSTOM JAVASCRIPT ANIMATION TWEEN
            Lighter and faster than jquery animate() and css transitions
            Animates top/left properties and includes easings
            */
            _tweenTo=function(el,prop,to,duration,easing,overwrite,callbacks){
                if(!el._mTween){el._mTween={top:{},left:{}};}
                var callbacks=callbacks || {},
                    onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
                    startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
                if(prop==="left"){from=el.offsetLeft;}
                var diff=to-from;
                tobj.stop=0;
                if(overwrite!=="none"){_cancelTween();}
                _startTween();
                function _step(){
                    if(tobj.stop){return;}
                    if(!progress){onStart.call();}
                    progress=_getTime()-startTime;
                    _tween();
                    if(progress>=tobj.time){
                        tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
                        if(tobj.time<progress+1){tobj.time=progress+1;}
                    }
                    if(tobj.time<duration){tobj.id=_request(_step);}else{onComplete.call();}
                }
                function _tween(){
                    if(duration>0){
                        tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
                        elStyle[prop]=Math.round(tobj.currVal)+"px";
                    }else{
                        elStyle[prop]=to+"px";
                    }
                    onUpdate.call();
                }
                function _startTween(){
                    _delay=1000/60;
                    tobj.time=progress+_delay;
                    _request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
                    tobj.id=_request(_step);
                }
                function _cancelTween(){
                    if(tobj.id==null){return;}
                    if(!window.requestAnimationFrame){clearTimeout(tobj.id);
                    }else{window.cancelAnimationFrame(tobj.id);}
                    tobj.id=null;
                }
                function _ease(t,b,c,d,type){
                    switch(type){
                        case "linear": case "mcsLinear":
                        return c*t/d + b;
                        break;
                        case "mcsLinearOut":
                            t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
                            break;
                        case "easeInOutSmooth":
                            t/=d/2;
                            if(t<1) return c/2*t*t + b;
                            t--;
                            return -c/2 * (t*(t-2) - 1) + b;
                            break;
                        case "easeInOutStrong":
                            t/=d/2;
                            if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
                            t--;
                            return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
                            break;
                        case "easeInOut": case "mcsEaseInOut":
                        t/=d/2;
                        if(t<1) return c/2*t*t*t + b;
                        t-=2;
                        return c/2*(t*t*t + 2) + b;
                        break;
                        case "easeOutSmooth":
                            t/=d; t--;
                            return -c * (t*t*t*t - 1) + b;
                            break;
                        case "easeOutStrong":
                            return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
                            break;
                        case "easeOut": case "mcsEaseOut": default:
                        var ts=(t/=d)*t,tc=ts*t;
                        return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
                    }
                }
            },
            /* -------------------- */


            /* returns current time */
            _getTime=function(){
                if(window.performance && window.performance.now){
                    return window.performance.now();
                }else{
                    if(window.performance && window.performance.webkitNow){
                        return window.performance.webkitNow();
                    }else{
                        if(Date.now){return Date.now();}else{return new Date().getTime();}
                    }
                }
            },
            /* -------------------- */


            /* stops a tween */
            _stopTween=function(){
                var el=this;
                if(!el._mTween){el._mTween={top:{},left:{}};}
                var props=["top","left"];
                for(var i=0; i<props.length; i++){
                    var prop=props[i];
                    if(el._mTween[prop].id){
                        if(!window.requestAnimationFrame){clearTimeout(el._mTween[prop].id);
                        }else{window.cancelAnimationFrame(el._mTween[prop].id);}
                        el._mTween[prop].id=null;
                        el._mTween[prop].stop=1;
                    }
                }
            },
            /* -------------------- */


            /* deletes a property (avoiding the exception thrown by IE) */
            _delete=function(c,m){
                try{delete c[m];}catch(e){c[m]=null;}
            },
            /* -------------------- */


            /* detects left mouse button */
            _mouseBtnLeft=function(e){
                return !(e.which && e.which!==1);
            },
            /* -------------------- */


            /* detects if pointer type event is touch */
            _pointerTouch=function(e){
                var t=e.originalEvent.pointerType;
                return !(t && t!=="touch" && t!==2);
            },
            /* -------------------- */


            /* checks if value is numeric */
            _isNumeric=function(val){
                return !isNaN(parseFloat(val)) && isFinite(val);
            },
            /* -------------------- */


            /* returns element position according to content */
            _childPos=function(el){
                var p=el.parents(".mCSB_container");
                return [el.offset().top-p.offset().top,el.offset().left-p.offset().left];
            },
            /* -------------------- */


            /* checks if browser tab is hidden/inactive via Page Visibility API */
            _isTabHidden=function(){
                var prop=_getHiddenProp();
                if(!prop) return false;
                return document[prop];
                function _getHiddenProp(){
                    var pfx=["webkit","moz","ms","o"];
                    if("hidden" in document) return "hidden"; //natively supported
                    for(var i=0; i<pfx.length; i++){ //prefixed
                        if((pfx[i]+"Hidden") in document)
                            return pfx[i]+"Hidden";
                    }
                    return null; //not supported
                }
            };
        /* -------------------- */





        /*
        ----------------------------------------
        PLUGIN SETUP
        ----------------------------------------
        */

        /* plugin constructor functions */
        $.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
            if(methods[method]){
                return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
            }else if(typeof method==="object" || !method){
                return methods.init.apply(this,arguments);
            }else{
                $.error("Method "+method+" does not exist");
            }
        };
        $[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
            if(methods[method]){
                return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
            }else if(typeof method==="object" || !method){
                return methods.init.apply(this,arguments);
            }else{
                $.error("Method "+method+" does not exist");
            }
        };

        /*
        allow setting plugin default options.
        usage: $.mCustomScrollbar.defaults.scrollInertia=500;
        to apply any changed default options on default selectors (below), use inside document ready fn
        e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
        */
        $[pluginNS].defaults=defaults;

        /*
        add window object (window.mCustomScrollbar)
        usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
        */
        window[pluginNS]=true;

        $(window).bind("load",function(){

            $(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */

            /* extend jQuery expressions */
            $.extend($.expr[":"],{
                /* checks if element is within scrollable viewport */
                mcsInView:$.expr[":"].mcsInView || function(el){
                    var $el=$(el),content=$el.parents(".mCSB_container"),wrapper,cPos;
                    if(!content.length){return;}
                    wrapper=content.parent();
                    cPos=[content[0].offsetTop,content[0].offsetLeft];
                    return 	cPos[0]+_childPos($el)[0]>=0 && cPos[0]+_childPos($el)[0]<wrapper.height()-$el.outerHeight(false) &&
                        cPos[1]+_childPos($el)[1]>=0 && cPos[1]+_childPos($el)[1]<wrapper.width()-$el.outerWidth(false);
                },
                /* checks if element or part of element is in view of scrollable viewport */
                mcsInSight:$.expr[":"].mcsInSight || function(el,i,m){
                    var $el=$(el),elD,content=$el.parents(".mCSB_container"),wrapperView,pos,wrapperViewPct,
                        pctVals=m[3]==="exact" ? [[1,0],[1,0]] : [[0.9,0.1],[0.6,0.4]];
                    if(!content.length){return;}
                    elD=[$el.outerHeight(false),$el.outerWidth(false)];
                    pos=[content[0].offsetTop+_childPos($el)[0],content[0].offsetLeft+_childPos($el)[1]];
                    wrapperView=[content.parent()[0].offsetHeight,content.parent()[0].offsetWidth];
                    wrapperViewPct=[elD[0]<wrapperView[0] ? pctVals[0] : pctVals[1],elD[1]<wrapperView[1] ? pctVals[0] : pctVals[1]];
                    return 	pos[0]-(wrapperView[0]*wrapperViewPct[0][0])<0 && pos[0]+elD[0]-(wrapperView[0]*wrapperViewPct[0][1])>=0 &&
                        pos[1]-(wrapperView[1]*wrapperViewPct[1][0])<0 && pos[1]+elD[1]-(wrapperView[1]*wrapperViewPct[1][1])>=0;
                },
                /* checks if element is overflowed having visible scrollbar(s) */
                mcsOverflow:$.expr[":"].mcsOverflow || function(el){
                    var d=$(el).data(pluginPfx);
                    if(!d){return;}
                    return d.overflowed[0] || d.overflowed[1];
                }
            });

        });

    }))}));


/*! Selectric ϟ v1.13.0 (2017-08-22) - git.io/tjl9sQ - Copyright (c) 2017 Leonardo Santos - MIT License */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=function(t,s){return void 0===s&&(s="undefined"!=typeof window?require("jquery"):require("jquery")(t)),e(s),s}:e(jQuery)}(function(e){"use strict";var t=e(document),s=e(window),l=["a","e","i","o","u","n","c","y"],i=[/[\xE0-\xE5]/g,/[\xE8-\xEB]/g,/[\xEC-\xEF]/g,/[\xF2-\xF6]/g,/[\xF9-\xFC]/g,/[\xF1]/g,/[\xE7]/g,/[\xFD-\xFF]/g],n=function(t,s){var l=this;l.element=t,l.$element=e(t),l.state={multiple:!!l.$element.attr("multiple"),enabled:!1,opened:!1,currValue:-1,selectedIdx:-1,highlightedIdx:-1},l.eventTriggers={open:l.open,close:l.close,destroy:l.destroy,refresh:l.refresh,init:l.init},l.init(s)};n.prototype={utils:{isMobile:function(){return/android|ip(hone|od|ad)/i.test(navigator.userAgent)},escapeRegExp:function(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")},replaceDiacritics:function(e){for(var t=i.length;t--;)e=e.toLowerCase().replace(i[t],l[t]);return e},format:function(e){var t=arguments;return(""+e).replace(/\{(?:(\d+)|(\w+))\}/g,function(e,s,l){return l&&t[1]?t[1][l]:t[s]})},nextEnabledItem:function(e,t){for(;e[t=(t+1)%e.length].disabled;);return t},previousEnabledItem:function(e,t){for(;e[t=(t>0?t:e.length)-1].disabled;);return t},toDash:function(e){return e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()},triggerCallback:function(t,s){var l=s.element,i=s.options["on"+t],n=[l].concat([].slice.call(arguments).slice(1));e.isFunction(i)&&i.apply(l,n),e(l).trigger("selectric-"+this.toDash(t),n)},arrayToClassname:function(t){var s=e.grep(t,function(e){return!!e});return e.trim(s.join(" "))}},init:function(t){var s=this;if(s.options=e.extend(!0,{},e.fn.selectric.defaults,s.options,t),s.utils.triggerCallback("BeforeInit",s),s.destroy(!0),s.options.disableOnMobile&&s.utils.isMobile())return void(s.disableOnMobile=!0);s.classes=s.getClassNames();var l=e("<input/>",{class:s.classes.input,readonly:s.utils.isMobile()}),i=e("<div/>",{class:s.classes.items,tabindex:-1}),n=e("<div/>",{class:s.classes.scroll}),a=e("<div/>",{class:s.classes.prefix,html:s.options.arrowButtonMarkup}),o=e("<span/>",{class:"label"}),r=s.$element.wrap("<div/>").parent().append(a.prepend(o),i,l),u=e("<div/>",{class:s.classes.hideselect});s.elements={input:l,items:i,itemsScroll:n,wrapper:a,label:o,outerWrapper:r},s.options.nativeOnMobile&&s.utils.isMobile()&&(s.elements.input=void 0,u.addClass(s.classes.prefix+"-is-native"),s.$element.on("change",function(){s.refresh()})),s.$element.on(s.eventTriggers).wrap(u),s.originalTabindex=s.$element.prop("tabindex"),s.$element.prop("tabindex",-1),s.populate(),s.activate(),s.utils.triggerCallback("Init",s)},activate:function(){var e=this,t=e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow),s=e.$element.width();t.removeClass(e.classes.tempshow),e.utils.triggerCallback("BeforeActivate",e),e.elements.outerWrapper.prop("class",e.utils.arrayToClassname([e.classes.wrapper,e.$element.prop("class").replace(/\S+/g,e.classes.prefix+"-$&"),e.options.responsive?e.classes.responsive:""])),e.options.inheritOriginalWidth&&s>0&&e.elements.outerWrapper.width(s),e.unbindEvents(),e.$element.prop("disabled")?(e.elements.outerWrapper.addClass(e.classes.disabled),e.elements.input&&e.elements.input.prop("disabled",!0)):(e.state.enabled=!0,e.elements.outerWrapper.removeClass(e.classes.disabled),e.$li=e.elements.items.removeAttr("style").find("li"),e.bindEvents()),e.utils.triggerCallback("Activate",e)},getClassNames:function(){var t=this,s=t.options.customClass,l={};return e.each("Input Items Open Disabled TempShow HideSelect Wrapper Focus Hover Responsive Above Below Scroll Group GroupLabel".split(" "),function(e,i){var n=s.prefix+i;l[i.toLowerCase()]=s.camelCase?n:t.utils.toDash(n)}),l.prefix=s.prefix,l},setLabel:function(){var t=this,s=t.options.labelBuilder;if(t.state.multiple){var l=e.isArray(t.state.currValue)?t.state.currValue:[t.state.currValue];l=0===l.length?[0]:l;var i=e.map(l,function(s){return e.grep(t.lookupItems,function(e){return e.index===s})[0]});i=e.grep(i,function(t){return i.length>1||0===i.length?""!==e.trim(t.value):t}),i=e.map(i,function(l){return e.isFunction(s)?s(l):t.utils.format(s,l)}),t.options.multiple.maxLabelEntries&&(i.length>=t.options.multiple.maxLabelEntries+1?(i=i.slice(0,t.options.multiple.maxLabelEntries),i.push(e.isFunction(s)?s({text:"..."}):t.utils.format(s,{text:"..."}))):i.slice(i.length-1)),t.elements.label.html(i.join(t.options.multiple.separator))}else{var n=t.lookupItems[t.state.currValue];t.elements.label.html(e.isFunction(s)?s(n):t.utils.format(s,n))}},populate:function(){var t=this,s=t.$element.children(),l=t.$element.find("option"),i=l.filter(":selected"),n=l.index(i),a=0,o=t.state.multiple?[]:0;i.length>1&&t.state.multiple&&(n=[],i.each(function(){n.push(e(this).index())})),t.state.currValue=~n?n:o,t.state.selectedIdx=t.state.currValue,t.state.highlightedIdx=t.state.currValue,t.items=[],t.lookupItems=[],s.length&&(s.each(function(s){var l=e(this);if(l.is("optgroup")){var i={element:l,label:l.prop("label"),groupDisabled:l.prop("disabled"),items:[]};l.children().each(function(s){var l=e(this);i.items[s]=t.getItemData(a,l,i.groupDisabled||l.prop("disabled")),t.lookupItems[a]=i.items[s],a++}),t.items[s]=i}else t.items[s]=t.getItemData(a,l,l.prop("disabled")),t.lookupItems[a]=t.items[s],a++}),t.setLabel(),t.elements.items.append(t.elements.itemsScroll.html(t.getItemsMarkup(t.items))))},getItemData:function(t,s,l){var i=this;return{index:t,element:s,value:s.val(),className:s.prop("class"),text:s.html(),slug:e.trim(i.utils.replaceDiacritics(s.html())),alt:s.attr("data-alt"),selected:s.prop("selected"),disabled:l}},getItemsMarkup:function(t){var s=this,l="<ul>";return e.isFunction(s.options.listBuilder)&&s.options.listBuilder&&(t=s.options.listBuilder(t)),e.each(t,function(t,i){void 0!==i.label?(l+=s.utils.format('<ul class="{1}"><li class="{2}">{3}</li>',s.utils.arrayToClassname([s.classes.group,i.groupDisabled?"disabled":"",i.element.prop("class")]),s.classes.grouplabel,i.element.prop("label")),e.each(i.items,function(e,t){l+=s.getItemMarkup(t.index,t)}),l+="</ul>"):l+=s.getItemMarkup(i.index,i)}),l+"</ul>"},getItemMarkup:function(t,s){var l=this,i=l.options.optionsItemBuilder,n={value:s.value,text:s.text,slug:s.slug,index:s.index};return l.utils.format('<li data-index="{1}" class="{2}">{3}</li>',t,l.utils.arrayToClassname([s.className,t===l.items.length-1?"last":"",s.disabled?"disabled":"",s.selected?"selected":""]),e.isFunction(i)?l.utils.format(i(s,this.$element,t),s):l.utils.format(i,n))},unbindEvents:function(){var e=this;e.elements.wrapper.add(e.$element).add(e.elements.outerWrapper).add(e.elements.input).off(".sl")},bindEvents:function(){var t=this;t.elements.outerWrapper.on("mouseenter.sl mouseleave.sl",function(s){e(this).toggleClass(t.classes.hover,"mouseenter"===s.type),t.options.openOnHover&&(clearTimeout(t.closeTimer),"mouseleave"===s.type?t.closeTimer=setTimeout(e.proxy(t.close,t),t.options.hoverIntentTimeout):t.open())}),t.elements.wrapper.on("click.sl",function(e){t.state.opened?t.close():t.open(e)}),t.options.nativeOnMobile&&t.utils.isMobile()||(t.$element.on("focus.sl",function(){t.elements.input.focus()}),t.elements.input.prop({tabindex:t.originalTabindex,disabled:!1}).on("keydown.sl",e.proxy(t.handleKeys,t)).on("focusin.sl",function(e){t.elements.outerWrapper.addClass(t.classes.focus),t.elements.input.one("blur",function(){t.elements.input.blur()}),t.options.openOnFocus&&!t.state.opened&&t.open(e)}).on("focusout.sl",function(){t.elements.outerWrapper.removeClass(t.classes.focus)}).on("input propertychange",function(){var s=t.elements.input.val(),l=new RegExp("^"+t.utils.escapeRegExp(s),"i");clearTimeout(t.resetStr),t.resetStr=setTimeout(function(){t.elements.input.val("")},t.options.keySearchTimeout),s.length&&e.each(t.items,function(e,s){if(!s.disabled){if(l.test(s.text)||l.test(s.slug))return void t.highlight(e);if(s.alt)for(var i=s.alt.split("|"),n=0;n<i.length&&i[n];n++)if(l.test(i[n].trim()))return void t.highlight(e)}})})),t.$li.on({mousedown:function(e){e.preventDefault(),e.stopPropagation()},click:function(){return t.select(e(this).data("index")),!1}})},handleKeys:function(t){var s=this,l=t.which,i=s.options.keys,n=e.inArray(l,i.previous)>-1,a=e.inArray(l,i.next)>-1,o=e.inArray(l,i.select)>-1,r=e.inArray(l,i.open)>-1,u=s.state.highlightedIdx,p=n&&0===u||a&&u+1===s.items.length,c=0;if(13!==l&&32!==l||t.preventDefault(),n||a){if(!s.options.allowWrap&&p)return;n&&(c=s.utils.previousEnabledItem(s.lookupItems,u)),a&&(c=s.utils.nextEnabledItem(s.lookupItems,u)),s.highlight(c)}if(o&&s.state.opened)return s.select(u),void(s.state.multiple&&s.options.multiple.keepMenuOpen||s.close());r&&!s.state.opened&&s.open()},refresh:function(){var e=this;e.populate(),e.activate(),e.utils.triggerCallback("Refresh",e)},setOptionsDimensions:function(){var e=this,t=e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow),s=e.options.maxHeight,l=e.elements.items.outerWidth(),i=e.elements.wrapper.outerWidth()-(l-e.elements.items.width());!e.options.expandToItemText||i>l?e.finalWidth=i:(e.elements.items.css("overflow","scroll"),e.elements.outerWrapper.width(9e4),e.finalWidth=e.elements.items.width(),e.elements.items.css("overflow",""),e.elements.outerWrapper.width("")),e.elements.items.width(e.finalWidth).height()>s&&e.elements.items.height(s),t.removeClass(e.classes.tempshow)},isInViewport:function(){var e=this;if(!0===e.options.forceRenderAbove)e.elements.outerWrapper.addClass(e.classes.above);else if(!0===e.options.forceRenderBelow)e.elements.outerWrapper.addClass(e.classes.below);else{var t=s.scrollTop(),l=s.height(),i=e.elements.outerWrapper.offset().top,n=e.elements.outerWrapper.outerHeight(),a=i+n+e.itemsHeight<=t+l,o=i-e.itemsHeight>t,r=!a&&o,u=!r;e.elements.outerWrapper.toggleClass(e.classes.above,r),e.elements.outerWrapper.toggleClass(e.classes.below,u)}},detectItemVisibility:function(t){var s=this,l=s.$li.filter("[data-index]");s.state.multiple&&(t=e.isArray(t)&&0===t.length?0:t,t=e.isArray(t)?Math.min.apply(Math,t):t);var i=l.eq(t).outerHeight(),n=l[t].offsetTop,a=s.elements.itemsScroll.scrollTop(),o=n+2*i;s.elements.itemsScroll.scrollTop(o>a+s.itemsHeight?o-s.itemsHeight:n-i<a?n-i:a)},open:function(s){var l=this;if(l.options.nativeOnMobile&&l.utils.isMobile())return!1;l.utils.triggerCallback("BeforeOpen",l),s&&(s.preventDefault(),l.options.stopPropagation&&s.stopPropagation()),l.state.enabled&&(l.setOptionsDimensions(),e("."+l.classes.hideselect,"."+l.classes.open).children().selectric("close"),l.state.opened=!0,l.itemsHeight=l.elements.items.outerHeight(),l.itemsInnerHeight=l.elements.items.height(),l.elements.outerWrapper.addClass(l.classes.open),l.elements.input.val(""),s&&"focusin"!==s.type&&l.elements.input.focus(),setTimeout(function(){t.on("click.sl",e.proxy(l.close,l)).on("scroll.sl",e.proxy(l.isInViewport,l))},1),l.isInViewport(),l.options.preventWindowScroll&&t.on("mousewheel.sl DOMMouseScroll.sl","."+l.classes.scroll,function(t){var s=t.originalEvent,i=e(this).scrollTop(),n=0;"detail"in s&&(n=-1*s.detail),"wheelDelta"in s&&(n=s.wheelDelta),"wheelDeltaY"in s&&(n=s.wheelDeltaY),"deltaY"in s&&(n=-1*s.deltaY),(i===this.scrollHeight-l.itemsInnerHeight&&n<0||0===i&&n>0)&&t.preventDefault()}),l.detectItemVisibility(l.state.selectedIdx),l.highlight(l.state.multiple?-1:l.state.selectedIdx),l.utils.triggerCallback("Open",l))},close:function(){var e=this;e.utils.triggerCallback("BeforeClose",e),t.off(".sl"),e.elements.outerWrapper.removeClass(e.classes.open),e.state.opened=!1,e.utils.triggerCallback("Close",e)},change:function(){var t=this;t.utils.triggerCallback("BeforeChange",t),t.state.multiple?(e.each(t.lookupItems,function(e){t.lookupItems[e].selected=!1,t.$element.find("option").prop("selected",!1)}),e.each(t.state.selectedIdx,function(e,s){t.lookupItems[s].selected=!0,t.$element.find("option").eq(s).prop("selected",!0)}),t.state.currValue=t.state.selectedIdx,t.setLabel(),t.utils.triggerCallback("Change",t)):t.state.currValue!==t.state.selectedIdx&&(t.$element.prop("selectedIndex",t.state.currValue=t.state.selectedIdx).data("value",t.lookupItems[t.state.selectedIdx].text),t.setLabel(),t.utils.triggerCallback("Change",t))},highlight:function(e){var t=this,s=t.$li.filter("[data-index]").removeClass("highlighted");t.utils.triggerCallback("BeforeHighlight",t),void 0===e||-1===e||t.lookupItems[e].disabled||(s.eq(t.state.highlightedIdx=e).addClass("highlighted"),t.detectItemVisibility(e),t.utils.triggerCallback("Highlight",t))},select:function(t){var s=this,l=s.$li.filter("[data-index]");if(s.utils.triggerCallback("BeforeSelect",s,t),void 0!==t&&-1!==t&&!s.lookupItems[t].disabled){if(s.state.multiple){s.state.selectedIdx=e.isArray(s.state.selectedIdx)?s.state.selectedIdx:[s.state.selectedIdx];var i=e.inArray(t,s.state.selectedIdx);-1!==i?s.state.selectedIdx.splice(i,1):s.state.selectedIdx.push(t),l.removeClass("selected").filter(function(t){return-1!==e.inArray(t,s.state.selectedIdx)}).addClass("selected")}else l.removeClass("selected").eq(s.state.selectedIdx=t).addClass("selected");s.state.multiple&&s.options.multiple.keepMenuOpen||s.close(),s.change(),s.utils.triggerCallback("Select",s,t)}},destroy:function(e){var t=this;t.state&&t.state.enabled&&(t.elements.items.add(t.elements.wrapper).add(t.elements.input).remove(),e||t.$element.removeData("selectric").removeData("value"),t.$element.prop("tabindex",t.originalTabindex).off(".sl").off(t.eventTriggers).unwrap().unwrap(),t.state.enabled=!1)}},e.fn.selectric=function(t){return this.each(function(){var s=e.data(this,"selectric");s&&!s.disableOnMobile?"string"==typeof t&&s[t]?s[t]():s.init(t):e.data(this,"selectric",new n(this,t))})},e.fn.selectric.defaults={onChange:function(t){e(t).change()},maxHeight:300,keySearchTimeout:500,arrowButtonMarkup:'<b class="button">&#x25be;</b>',disableOnMobile:!1,nativeOnMobile:!0,openOnFocus:!0,openOnHover:!1,hoverIntentTimeout:500,expandToItemText:!1,responsive:!1,preventWindowScroll:!0,inheritOriginalWidth:!1,allowWrap:!0,forceRenderAbove:!1,forceRenderBelow:!1,stopPropagation:!0,optionsItemBuilder:"{text}",labelBuilder:"{text}",listBuilder:!1,keys:{previous:[37,38],next:[39,40],select:[9,13,27],open:[13,32,37,38,39,40],close:[9,27]},customClass:{prefix:"selectric",camelCase:!1},multiple:{separator:", ",keepMenuOpen:!0,maxLabelEntries:!1}}});


/**
 * Swiper 4.1.0
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * http://www.idangero.us/swiper/
 *
 * Copyright 2014-2018 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: January 13, 2018
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.Swiper=t()}(this,function(){"use strict";var e=function(e){for(var t=0;t<e.length;t+=1)this[t]=e[t];return this.length=e.length,this};function t(t,i){var s=[],a=0;if(t&&!i&&t instanceof e)return t;if(t)if("string"==typeof t){var r,n,o=t.trim();if(o.indexOf("<")>=0&&o.indexOf(">")>=0){var l="div";for(0===o.indexOf("<li")&&(l="ul"),0===o.indexOf("<tr")&&(l="tbody"),0!==o.indexOf("<td")&&0!==o.indexOf("<th")||(l="tr"),0===o.indexOf("<tbody")&&(l="table"),0===o.indexOf("<option")&&(l="select"),(n=document.createElement(l)).innerHTML=o,a=0;a<n.childNodes.length;a+=1)s.push(n.childNodes[a])}else for(r=i||"#"!==t[0]||t.match(/[ .<>:~]/)?(i||document).querySelectorAll(t.trim()):[document.getElementById(t.trim().split("#")[1])],a=0;a<r.length;a+=1)r[a]&&s.push(r[a])}else if(t.nodeType||t===window||t===document)s.push(t);else if(t.length>0&&t[0].nodeType)for(a=0;a<t.length;a+=1)s.push(t[a]);return new e(s)}function i(e){for(var t=[],i=0;i<e.length;i+=1)-1===t.indexOf(e[i])&&t.push(e[i]);return t}t.fn=e.prototype,t.Class=e,t.Dom7=e;"resize scroll".split(" ");var s={addClass:function(e){if(void 0===e)return this;for(var t=e.split(" "),i=0;i<t.length;i+=1)for(var s=0;s<this.length;s+=1)void 0!==this[s].classList&&this[s].classList.add(t[i]);return this},removeClass:function(e){for(var t=e.split(" "),i=0;i<t.length;i+=1)for(var s=0;s<this.length;s+=1)void 0!==this[s].classList&&this[s].classList.remove(t[i]);return this},hasClass:function(e){return!!this[0]&&this[0].classList.contains(e)},toggleClass:function(e){for(var t=e.split(" "),i=0;i<t.length;i+=1)for(var s=0;s<this.length;s+=1)void 0!==this[s].classList&&this[s].classList.toggle(t[i]);return this},attr:function(e,t){var i=arguments;if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var s=0;s<this.length;s+=1)if(2===i.length)this[s].setAttribute(e,t);else for(var a in e)this[s][a]=e[a],this[s].setAttribute(a,e[a]);return this},removeAttr:function(e){for(var t=0;t<this.length;t+=1)this[t].removeAttribute(e);return this},data:function(e,t){var i;if(void 0!==t){for(var s=0;s<this.length;s+=1)(i=this[s]).dom7ElementDataStorage||(i.dom7ElementDataStorage={}),i.dom7ElementDataStorage[e]=t;return this}if(i=this[0]){if(i.dom7ElementDataStorage&&e in i.dom7ElementDataStorage)return i.dom7ElementDataStorage[e];var a=i.getAttribute("data-"+e);return a||void 0}},transform:function(e){for(var t=0;t<this.length;t+=1){var i=this[t].style;i.webkitTransform=e,i.transform=e}return this},transition:function(e){"string"!=typeof e&&(e+="ms");for(var t=0;t<this.length;t+=1){var i=this[t].style;i.webkitTransitionDuration=e,i.transitionDuration=e}return this},on:function(){for(var e=[],i=arguments.length;i--;)e[i]=arguments[i];var s,a=e[0],r=e[1],n=e[2],o=e[3];function l(e){var i=e.target;if(i){var s=e.target.dom7EventData||[];if(s.unshift(e),t(i).is(r))n.apply(i,s);else for(var a=t(i).parents(),o=0;o<a.length;o+=1)t(a[o]).is(r)&&n.apply(a[o],s)}}function d(e){var t=e&&e.target?e.target.dom7EventData||[]:[];t.unshift(e),n.apply(this,t)}"function"==typeof e[1]&&(a=(s=e)[0],n=s[1],o=s[2],r=void 0),o||(o=!1);for(var h,p=a.split(" "),c=0;c<this.length;c+=1){var u=this[c];if(r)for(h=0;h<p.length;h+=1)u.dom7LiveListeners||(u.dom7LiveListeners=[]),u.dom7LiveListeners.push({type:a,listener:n,proxyListener:l}),u.addEventListener(p[h],l,o);else for(h=0;h<p.length;h+=1)u.dom7Listeners||(u.dom7Listeners=[]),u.dom7Listeners.push({type:a,listener:n,proxyListener:d}),u.addEventListener(p[h],d,o)}return this},off:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];var i,s=e[0],a=e[1],r=e[2],n=e[3];"function"==typeof e[1]&&(s=(i=e)[0],r=i[1],n=i[2],a=void 0),n||(n=!1);for(var o=s.split(" "),l=0;l<o.length;l+=1)for(var d=0;d<this.length;d+=1){var h=this[d];if(a){if(h.dom7LiveListeners)for(var p=0;p<h.dom7LiveListeners.length;p+=1)r?h.dom7LiveListeners[p].listener===r&&h.removeEventListener(o[l],h.dom7LiveListeners[p].proxyListener,n):h.dom7LiveListeners[p].type===o[l]&&h.removeEventListener(o[l],h.dom7LiveListeners[p].proxyListener,n)}else if(h.dom7Listeners)for(var c=0;c<h.dom7Listeners.length;c+=1)r?h.dom7Listeners[c].listener===r&&h.removeEventListener(o[l],h.dom7Listeners[c].proxyListener,n):h.dom7Listeners[c].type===o[l]&&h.removeEventListener(o[l],h.dom7Listeners[c].proxyListener,n)}return this},trigger:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var i=e[0].split(" "),s=e[1],a=0;a<i.length;a+=1)for(var r=0;r<this.length;r+=1){var n=void 0;try{n=new window.CustomEvent(i[a],{detail:s,bubbles:!0,cancelable:!0})}catch(e){(n=document.createEvent("Event")).initEvent(i[a],!0,!0),n.detail=s}this[r].dom7EventData=e.filter(function(e,t){return t>0}),this[r].dispatchEvent(n),this[r].dom7EventData=[],delete this[r].dom7EventData}return this},transitionEnd:function(e){var t,i=["webkitTransitionEnd","transitionend"],s=this;function a(r){if(r.target===this)for(e.call(this,r),t=0;t<i.length;t+=1)s.off(i[t],a)}if(e)for(t=0;t<i.length;t+=1)s.on(i[t],a);return this},outerWidth:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetWidth+parseFloat(t.getPropertyValue("margin-right"))+parseFloat(t.getPropertyValue("margin-left"))}return this[0].offsetWidth}return null},outerHeight:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetHeight+parseFloat(t.getPropertyValue("margin-top"))+parseFloat(t.getPropertyValue("margin-bottom"))}return this[0].offsetHeight}return null},offset:function(){if(this.length>0){var e=this[0],t=e.getBoundingClientRect(),i=document.body,s=e.clientTop||i.clientTop||0,a=e.clientLeft||i.clientLeft||0,r=e===window?window.scrollY:e.scrollTop,n=e===window?window.scrollX:e.scrollLeft;return{top:t.top+r-s,left:t.left+n-a}}return null},css:function(e,t){var i;if(1===arguments.length){if("string"!=typeof e){for(i=0;i<this.length;i+=1)for(var s in e)this[i].style[s]=e[s];return this}if(this[0])return window.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(i=0;i<this.length;i+=1)this[i].style[e]=t;return this}return this},each:function(e){if(!e)return this;for(var t=0;t<this.length;t+=1)if(!1===e.call(this[t],t,this[t]))return this;return this},html:function(e){if(void 0===e)return this[0]?this[0].innerHTML:void 0;for(var t=0;t<this.length;t+=1)this[t].innerHTML=e;return this},text:function(e){if(void 0===e)return this[0]?this[0].textContent.trim():null;for(var t=0;t<this.length;t+=1)this[t].textContent=e;return this},is:function(i){var s,a,r=this[0];if(!r||void 0===i)return!1;if("string"==typeof i){if(r.matches)return r.matches(i);if(r.webkitMatchesSelector)return r.webkitMatchesSelector(i);if(r.msMatchesSelector)return r.msMatchesSelector(i);for(s=t(i),a=0;a<s.length;a+=1)if(s[a]===r)return!0;return!1}if(i===document)return r===document;if(i===window)return r===window;if(i.nodeType||i instanceof e){for(s=i.nodeType?[i]:i,a=0;a<s.length;a+=1)if(s[a]===r)return!0;return!1}return!1},index:function(){var e,t=this[0];if(t){for(e=0;null!==(t=t.previousSibling);)1===t.nodeType&&(e+=1);return e}},eq:function(t){if(void 0===t)return this;var i,s=this.length;return new e(t>s-1?[]:t<0?(i=s+t)<0?[]:[this[i]]:[this[t]])},append:function(){for(var t,i=[],s=arguments.length;s--;)i[s]=arguments[s];for(var a=0;a<i.length;a+=1){t=i[a];for(var r=0;r<this.length;r+=1)if("string"==typeof t){var n=document.createElement("div");for(n.innerHTML=t;n.firstChild;)this[r].appendChild(n.firstChild)}else if(t instanceof e)for(var o=0;o<t.length;o+=1)this[r].appendChild(t[o]);else this[r].appendChild(t)}return this},prepend:function(t){var i,s;for(i=0;i<this.length;i+=1)if("string"==typeof t){var a=document.createElement("div");for(a.innerHTML=t,s=a.childNodes.length-1;s>=0;s-=1)this[i].insertBefore(a.childNodes[s],this[i].childNodes[0])}else if(t instanceof e)for(s=0;s<t.length;s+=1)this[i].insertBefore(t[s],this[i].childNodes[0]);else this[i].insertBefore(t,this[i].childNodes[0]);return this},next:function(i){return this.length>0?i?this[0].nextElementSibling&&t(this[0].nextElementSibling).is(i)?new e([this[0].nextElementSibling]):new e([]):this[0].nextElementSibling?new e([this[0].nextElementSibling]):new e([]):new e([])},nextAll:function(i){var s=[],a=this[0];if(!a)return new e([]);for(;a.nextElementSibling;){var r=a.nextElementSibling;i?t(r).is(i)&&s.push(r):s.push(r),a=r}return new e(s)},prev:function(i){if(this.length>0){var s=this[0];return i?s.previousElementSibling&&t(s.previousElementSibling).is(i)?new e([s.previousElementSibling]):new e([]):s.previousElementSibling?new e([s.previousElementSibling]):new e([])}return new e([])},prevAll:function(i){var s=[],a=this[0];if(!a)return new e([]);for(;a.previousElementSibling;){var r=a.previousElementSibling;i?t(r).is(i)&&s.push(r):s.push(r),a=r}return new e(s)},parent:function(e){for(var s=[],a=0;a<this.length;a+=1)null!==this[a].parentNode&&(e?t(this[a].parentNode).is(e)&&s.push(this[a].parentNode):s.push(this[a].parentNode));return t(i(s))},parents:function(e){for(var s=[],a=0;a<this.length;a+=1)for(var r=this[a].parentNode;r;)e?t(r).is(e)&&s.push(r):s.push(r),r=r.parentNode;return t(i(s))},closest:function(t){var i=this;return void 0===t?new e([]):(i.is(t)||(i=i.parents(t).eq(0)),i)},find:function(t){for(var i=[],s=0;s<this.length;s+=1)for(var a=this[s].querySelectorAll(t),r=0;r<a.length;r+=1)i.push(a[r]);return new e(i)},children:function(s){for(var a=[],r=0;r<this.length;r+=1)for(var n=this[r].childNodes,o=0;o<n.length;o+=1)s?1===n[o].nodeType&&t(n[o]).is(s)&&a.push(n[o]):1===n[o].nodeType&&a.push(n[o]);return new e(i(a))},remove:function(){for(var e=0;e<this.length;e+=1)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this},add:function(){for(var e=[],i=arguments.length;i--;)e[i]=arguments[i];var s,a;for(s=0;s<e.length;s+=1){var r=t(e[s]);for(a=0;a<r.length;a+=1)this[this.length]=r[a],this.length+=1}return this},styles:function(){return this[0]?window.getComputedStyle(this[0],null):{}}};Object.keys(s).forEach(function(e){t.fn[e]=s[e]});var a,r,n,o="undefined"==typeof window?{navigator:{userAgent:""},location:{},history:{},addEventListener:function(){},removeEventListener:function(){},getComputedStyle:function(){return{}},Image:function(){},Date:function(){},screen:{}}:window,l={deleteProps:function(e){var t=e;Object.keys(t).forEach(function(e){try{t[e]=null}catch(e){}try{delete t[e]}catch(e){}})},nextTick:function(e,t){return void 0===t&&(t=0),setTimeout(e,t)},now:function(){return Date.now()},getTranslate:function(e,t){var i,s,a;void 0===t&&(t="x");var r=o.getComputedStyle(e,null);return o.WebKitCSSMatrix?((s=r.transform||r.webkitTransform).split(",").length>6&&(s=s.split(", ").map(function(e){return e.replace(",",".")}).join(", ")),a=new o.WebKitCSSMatrix("none"===s?"":s)):i=(a=r.MozTransform||r.OTransform||r.MsTransform||r.msTransform||r.transform||r.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,")).toString().split(","),"x"===t&&(s=o.WebKitCSSMatrix?a.m41:16===i.length?parseFloat(i[12]):parseFloat(i[4])),"y"===t&&(s=o.WebKitCSSMatrix?a.m42:16===i.length?parseFloat(i[13]):parseFloat(i[5])),s||0},parseUrlQuery:function(e){var t,i,s,a,r={},n=e||o.location.href;if("string"==typeof n&&n.length)for(a=(i=(n=n.indexOf("?")>-1?n.replace(/\S*\?/,""):"").split("&").filter(function(e){return""!==e})).length,t=0;t<a;t+=1)s=i[t].replace(/#\S+/g,"").split("="),r[decodeURIComponent(s[0])]=void 0===s[1]?void 0:decodeURIComponent(s[1])||"";return r},isObject:function(e){return"object"==typeof e&&null!==e&&e.constructor&&e.constructor===Object},extend:function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];for(var i=Object(e[0]),s=1;s<e.length;s+=1){var a=e[s];if(void 0!==a&&null!==a)for(var r=Object.keys(Object(a)),n=0,o=r.length;n<o;n+=1){var d=r[n],h=Object.getOwnPropertyDescriptor(a,d);void 0!==h&&h.enumerable&&(l.isObject(i[d])&&l.isObject(a[d])?l.extend(i[d],a[d]):!l.isObject(i[d])&&l.isObject(a[d])?(i[d]={},l.extend(i[d],a[d])):i[d]=a[d])}}return i}},d="undefined"==typeof document?{addEventListener:function(){},removeEventListener:function(){},activeElement:{blur:function(){},nodeName:""},querySelector:function(){return{}},querySelectorAll:function(){return[]},createElement:function(){return{style:{},setAttribute:function(){},getElementsByTagName:function(){return[]}}},location:{hash:""}}:document,h=(n=d.createElement("div"),{touch:o.Modernizr&&!0===o.Modernizr.touch||!!("ontouchstart"in o||o.DocumentTouch&&d instanceof o.DocumentTouch),pointerEvents:!(!o.navigator.pointerEnabled&&!o.PointerEvent),prefixedPointerEvents:!!o.navigator.msPointerEnabled,transition:(r=n.style,"transition"in r||"webkitTransition"in r||"MozTransition"in r),transforms3d:o.Modernizr&&!0===o.Modernizr.csstransforms3d||(a=n.style,"webkitPerspective"in a||"MozPerspective"in a||"OPerspective"in a||"MsPerspective"in a||"perspective"in a),flexbox:function(){for(var e=n.style,t="alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "),i=0;i<t.length;i+=1)if(t[i]in e)return!0;return!1}(),observer:"MutationObserver"in o||"WebkitMutationObserver"in o,passiveListener:function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});o.addEventListener("testPassiveListener",null,t)}catch(e){}return e}(),gestures:"ongesturestart"in o}),p=function(e){void 0===e&&(e={});var t=this;t.params=e,t.eventsListeners={},t.params&&t.params.on&&Object.keys(t.params.on).forEach(function(e){t.on(e,t.params.on[e])})},c={components:{configurable:!0}};p.prototype.on=function(e,t){var i=this;return"function"!=typeof t?i:(e.split(" ").forEach(function(e){i.eventsListeners[e]||(i.eventsListeners[e]=[]),i.eventsListeners[e].push(t)}),i)},p.prototype.once=function(e,t){var i=this;if("function"!=typeof t)return i;return i.on(e,function s(){for(var a=[],r=arguments.length;r--;)a[r]=arguments[r];t.apply(i,a),i.off(e,s)})},p.prototype.off=function(e,t){var i=this;return e.split(" ").forEach(function(e){void 0===t?i.eventsListeners[e]=[]:i.eventsListeners[e].forEach(function(s,a){s===t&&i.eventsListeners[e].splice(a,1)})}),i},p.prototype.emit=function(){for(var e=[],t=arguments.length;t--;)e[t]=arguments[t];var i,s,a,r=this;return r.eventsListeners?("string"==typeof e[0]||Array.isArray(e[0])?(i=e[0],s=e.slice(1,e.length),a=r):(i=e[0].events,s=e[0].data,a=e[0].context||r),(Array.isArray(i)?i:i.split(" ")).forEach(function(e){if(r.eventsListeners[e]){var t=[];r.eventsListeners[e].forEach(function(e){t.push(e)}),t.forEach(function(e){e.apply(a,s)})}}),r):r},p.prototype.useModulesParams=function(e){var t=this;t.modules&&Object.keys(t.modules).forEach(function(i){var s=t.modules[i];s.params&&l.extend(e,s.params)})},p.prototype.useModules=function(e){void 0===e&&(e={});var t=this;t.modules&&Object.keys(t.modules).forEach(function(i){var s=t.modules[i],a=e[i]||{};s.instance&&Object.keys(s.instance).forEach(function(e){var i=s.instance[e];t[e]="function"==typeof i?i.bind(t):i}),s.on&&t.on&&Object.keys(s.on).forEach(function(e){t.on(e,s.on[e])}),s.create&&s.create.bind(t)(a)})},c.components.set=function(e){this.use&&this.use(e)},p.installModule=function(e){for(var t=[],i=arguments.length-1;i-- >0;)t[i]=arguments[i+1];var s=this;s.prototype.modules||(s.prototype.modules={});var a=e.name||Object.keys(s.prototype.modules).length+"_"+l.now();return s.prototype.modules[a]=e,e.proto&&Object.keys(e.proto).forEach(function(t){s.prototype[t]=e.proto[t]}),e.static&&Object.keys(e.static).forEach(function(t){s[t]=e.static[t]}),e.install&&e.install.apply(s,t),s},p.use=function(e){for(var t=[],i=arguments.length-1;i-- >0;)t[i]=arguments[i+1];var s=this;return Array.isArray(e)?(e.forEach(function(e){return s.installModule(e)}),s):s.installModule.apply(s,[e].concat(t))},Object.defineProperties(p,c);var u={updateSize:function(){var e,t,i=this.$el;e=void 0!==this.params.width?this.params.width:i[0].clientWidth,t=void 0!==this.params.height?this.params.height:i[0].clientHeight,0===e&&this.isHorizontal()||0===t&&this.isVertical()||(e=e-parseInt(i.css("padding-left"),10)-parseInt(i.css("padding-right"),10),t=t-parseInt(i.css("padding-top"),10)-parseInt(i.css("padding-bottom"),10),l.extend(this,{width:e,height:t,size:this.isHorizontal()?e:t}))},updateSlides:function(){var e=this.params,t=this.$wrapperEl,i=this.size,s=this.rtl,a=this.wrongRTL,r=t.children("."+this.params.slideClass),n=this.virtual&&e.virtual.enabled?this.virtual.slides.length:r.length,o=[],d=[],p=[],c=e.slidesOffsetBefore;"function"==typeof c&&(c=e.slidesOffsetBefore.call(this));var u=e.slidesOffsetAfter;"function"==typeof u&&(u=e.slidesOffsetAfter.call(this));var f=n,v=this.snapGrid.length,m=this.snapGrid.length,g=e.spaceBetween,b=-c,w=0,y=0;if(void 0!==i){var x,T;"string"==typeof g&&g.indexOf("%")>=0&&(g=parseFloat(g.replace("%",""))/100*i),this.virtualSize=-g,s?r.css({marginLeft:"",marginTop:""}):r.css({marginRight:"",marginBottom:""}),e.slidesPerColumn>1&&(x=Math.floor(n/e.slidesPerColumn)===n/this.params.slidesPerColumn?n:Math.ceil(n/e.slidesPerColumn)*e.slidesPerColumn,"auto"!==e.slidesPerView&&"row"===e.slidesPerColumnFill&&(x=Math.max(x,e.slidesPerView*e.slidesPerColumn)));for(var E,S=e.slidesPerColumn,C=x/S,M=C-(e.slidesPerColumn*C-n),z=0;z<n;z+=1){T=0;var P=r.eq(z);if(e.slidesPerColumn>1){var k=void 0,$=void 0,L=void 0;"column"===e.slidesPerColumnFill?(L=z-($=Math.floor(z/S))*S,($>M||$===M&&L===S-1)&&(L+=1)>=S&&(L=0,$+=1),k=$+L*x/S,P.css({"-webkit-box-ordinal-group":k,"-moz-box-ordinal-group":k,"-ms-flex-order":k,"-webkit-order":k,order:k})):$=z-(L=Math.floor(z/C))*C,P.css("margin-"+(this.isHorizontal()?"top":"left"),0!==L&&e.spaceBetween&&e.spaceBetween+"px").attr("data-swiper-column",$).attr("data-swiper-row",L)}"none"!==P.css("display")&&("auto"===e.slidesPerView?(T=this.isHorizontal()?P.outerWidth(!0):P.outerHeight(!0),e.roundLengths&&(T=Math.floor(T))):(T=(i-(e.slidesPerView-1)*g)/e.slidesPerView,e.roundLengths&&(T=Math.floor(T)),r[z]&&(this.isHorizontal()?r[z].style.width=T+"px":r[z].style.height=T+"px")),r[z]&&(r[z].swiperSlideSize=T),p.push(T),e.centeredSlides?(b=b+T/2+w/2+g,0===w&&0!==z&&(b=b-i/2-g),0===z&&(b=b-i/2-g),Math.abs(b)<.001&&(b=0),y%e.slidesPerGroup==0&&o.push(b),d.push(b)):(y%e.slidesPerGroup==0&&o.push(b),d.push(b),b=b+T+g),this.virtualSize+=T+g,w=T,y+=1)}if(this.virtualSize=Math.max(this.virtualSize,i)+u,s&&a&&("slide"===e.effect||"coverflow"===e.effect)&&t.css({width:this.virtualSize+e.spaceBetween+"px"}),h.flexbox&&!e.setWrapperSize||(this.isHorizontal()?t.css({width:this.virtualSize+e.spaceBetween+"px"}):t.css({height:this.virtualSize+e.spaceBetween+"px"})),e.slidesPerColumn>1&&(this.virtualSize=(T+e.spaceBetween)*x,this.virtualSize=Math.ceil(this.virtualSize/e.slidesPerColumn)-e.spaceBetween,this.isHorizontal()?t.css({width:this.virtualSize+e.spaceBetween+"px"}):t.css({height:this.virtualSize+e.spaceBetween+"px"}),e.centeredSlides)){E=[];for(var I=0;I<o.length;I+=1)o[I]<this.virtualSize+o[0]&&E.push(o[I]);o=E}if(!e.centeredSlides){E=[];for(var D=0;D<o.length;D+=1)o[D]<=this.virtualSize-i&&E.push(o[D]);o=E,Math.floor(this.virtualSize-i)-Math.floor(o[o.length-1])>1&&o.push(this.virtualSize-i)}0===o.length&&(o=[0]),0!==e.spaceBetween&&(this.isHorizontal()?s?r.css({marginLeft:g+"px"}):r.css({marginRight:g+"px"}):r.css({marginBottom:g+"px"})),l.extend(this,{slides:r,snapGrid:o,slidesGrid:d,slidesSizesGrid:p}),n!==f&&this.emit("slidesLengthChange"),o.length!==v&&(this.params.watchOverflow&&this.checkOverflow(),this.emit("snapGridLengthChange")),d.length!==m&&this.emit("slidesGridLengthChange"),(e.watchSlidesProgress||e.watchSlidesVisibility)&&this.updateSlidesOffset()}},updateAutoHeight:function(){var e,t=[],i=0;if("auto"!==this.params.slidesPerView&&this.params.slidesPerView>1)for(e=0;e<Math.ceil(this.params.slidesPerView);e+=1){var s=this.activeIndex+e;if(s>this.slides.length)break;t.push(this.slides.eq(s)[0])}else t.push(this.slides.eq(this.activeIndex)[0]);for(e=0;e<t.length;e+=1)if(void 0!==t[e]){var a=t[e].offsetHeight;i=a>i?a:i}i&&this.$wrapperEl.css("height",i+"px")},updateSlidesOffset:function(){for(var e=this.slides,t=0;t<e.length;t+=1)e[t].swiperSlideOffset=this.isHorizontal()?e[t].offsetLeft:e[t].offsetTop},updateSlidesProgress:function(e){void 0===e&&(e=this.translate||0);var t=this.params,i=this.slides,s=this.rtl;if(0!==i.length){void 0===i[0].swiperSlideOffset&&this.updateSlidesOffset();var a=-e;s&&(a=e),i.removeClass(t.slideVisibleClass);for(var r=0;r<i.length;r+=1){var n=i[r],o=(a+(t.centeredSlides?this.minTranslate():0)-n.swiperSlideOffset)/(n.swiperSlideSize+t.spaceBetween);if(t.watchSlidesVisibility){var l=-(a-n.swiperSlideOffset),d=l+this.slidesSizesGrid[r];(l>=0&&l<this.size||d>0&&d<=this.size||l<=0&&d>=this.size)&&i.eq(r).addClass(t.slideVisibleClass)}n.progress=s?-o:o}}},updateProgress:function(e){void 0===e&&(e=this.translate||0);var t=this.params,i=this.maxTranslate()-this.minTranslate(),s=this.progress,a=this.isBeginning,r=this.isEnd,n=a,o=r;0===i?(s=0,a=!0,r=!0):(a=(s=(e-this.minTranslate())/i)<=0,r=s>=1),l.extend(this,{progress:s,isBeginning:a,isEnd:r}),(t.watchSlidesProgress||t.watchSlidesVisibility)&&this.updateSlidesProgress(e),a&&!n&&this.emit("reachBeginning toEdge"),r&&!o&&this.emit("reachEnd toEdge"),(n&&!a||o&&!r)&&this.emit("fromEdge"),this.emit("progress",s)},updateSlidesClasses:function(){var e,t=this.slides,i=this.params,s=this.$wrapperEl,a=this.activeIndex,r=this.realIndex,n=this.virtual&&i.virtual.enabled;t.removeClass(i.slideActiveClass+" "+i.slideNextClass+" "+i.slidePrevClass+" "+i.slideDuplicateActiveClass+" "+i.slideDuplicateNextClass+" "+i.slideDuplicatePrevClass),(e=n?this.$wrapperEl.find("."+i.slideClass+'[data-swiper-slide-index="'+a+'"]'):t.eq(a)).addClass(i.slideActiveClass),i.loop&&(e.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+r+'"]').addClass(i.slideDuplicateActiveClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+r+'"]').addClass(i.slideDuplicateActiveClass));var o=e.nextAll("."+i.slideClass).eq(0).addClass(i.slideNextClass);i.loop&&0===o.length&&(o=t.eq(0)).addClass(i.slideNextClass);var l=e.prevAll("."+i.slideClass).eq(0).addClass(i.slidePrevClass);i.loop&&0===l.length&&(l=t.eq(-1)).addClass(i.slidePrevClass),i.loop&&(o.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass),l.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+l.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass))},updateActiveIndex:function(e){var t,i=this.rtl?this.translate:-this.translate,s=this.slidesGrid,a=this.snapGrid,r=this.params,n=this.activeIndex,o=this.realIndex,d=this.snapIndex,h=e;if(void 0===h){for(var p=0;p<s.length;p+=1)void 0!==s[p+1]?i>=s[p]&&i<s[p+1]-(s[p+1]-s[p])/2?h=p:i>=s[p]&&i<s[p+1]&&(h=p+1):i>=s[p]&&(h=p);r.normalizeSlideIndex&&(h<0||void 0===h)&&(h=0)}if((t=a.indexOf(i)>=0?a.indexOf(i):Math.floor(h/r.slidesPerGroup))>=a.length&&(t=a.length-1),h!==n){var c=parseInt(this.slides.eq(h).attr("data-swiper-slide-index")||h,10);l.extend(this,{snapIndex:t,realIndex:c,previousIndex:n,activeIndex:h}),this.emit("activeIndexChange"),this.emit("snapIndexChange"),o!==c&&this.emit("realIndexChange"),this.emit("slideChange")}else t!==d&&(this.snapIndex=t,this.emit("snapIndexChange"))},updateClickedSlide:function(e){var i=this.params,s=t(e.target).closest("."+i.slideClass)[0],a=!1;if(s)for(var r=0;r<this.slides.length;r+=1)this.slides[r]===s&&(a=!0);if(!s||!a)return this.clickedSlide=void 0,void(this.clickedIndex=void 0);this.clickedSlide=s,this.virtual&&this.params.virtual.enabled?this.clickedIndex=parseInt(t(s).attr("data-swiper-slide-index"),10):this.clickedIndex=t(s).index(),i.slideToClickedSlide&&void 0!==this.clickedIndex&&this.clickedIndex!==this.activeIndex&&this.slideToClickedSlide()}},f={getTranslate:function(e){void 0===e&&(e=this.isHorizontal()?"x":"y");var t=this.params,i=this.rtl,s=this.translate,a=this.$wrapperEl;if(t.virtualTranslate)return i?-s:s;var r=l.getTranslate(a[0],e);return i&&(r=-r),r||0},setTranslate:function(e,t){var i=this.rtl,s=this.params,a=this.$wrapperEl,r=this.progress,n=0,o=0;this.isHorizontal()?n=i?-e:e:o=e,s.roundLengths&&(n=Math.floor(n),o=Math.floor(o)),s.virtualTranslate||(h.transforms3d?a.transform("translate3d("+n+"px, "+o+"px, 0px)"):a.transform("translate("+n+"px, "+o+"px)")),this.translate=this.isHorizontal()?n:o;var l=this.maxTranslate()-this.minTranslate();(0===l?0:(e-this.minTranslate())/l)!==r&&this.updateProgress(e),this.emit("setTranslate",this.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]}},v={setTransition:function(e,t){this.$wrapperEl.transition(e),this.emit("setTransition",e,t)},transitionStart:function(e){void 0===e&&(e=!0);var t=this.activeIndex,i=this.params,s=this.previousIndex;i.autoHeight&&this.updateAutoHeight(),this.emit("transitionStart"),e&&t!==s&&(this.emit("slideChangeTransitionStart"),t>s?this.emit("slideNextTransitionStart"):this.emit("slidePrevTransitionStart"))},transitionEnd:function(e){void 0===e&&(e=!0);var t=this.activeIndex,i=this.previousIndex;this.animating=!1,this.setTransition(0),this.emit("transitionEnd"),e&&t!==i&&(this.emit("slideChangeTransitionEnd"),t>i?this.emit("slideNextTransitionEnd"):this.emit("slidePrevTransitionEnd"))}},m={slideTo:function(e,t,i,s){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===i&&(i=!0);var a=this,r=e;r<0&&(r=0);var n=a.params,o=a.snapGrid,l=a.slidesGrid,d=a.previousIndex,p=a.activeIndex,c=a.rtl,u=a.$wrapperEl,f=Math.floor(r/n.slidesPerGroup);f>=o.length&&(f=o.length-1),(p||n.initialSlide||0)===(d||0)&&i&&a.emit("beforeSlideChangeStart");var v=-o[f];if(a.updateProgress(v),n.normalizeSlideIndex)for(var m=0;m<l.length;m+=1)-Math.floor(100*v)>=Math.floor(100*l[m])&&(r=m);if(a.initialized){if(!a.allowSlideNext&&v<a.translate&&v<a.minTranslate())return!1;if(!a.allowSlidePrev&&v>a.translate&&v>a.maxTranslate()&&(p||0)!==r)return!1}return c&&-v===a.translate||!c&&v===a.translate?(a.updateActiveIndex(r),n.autoHeight&&a.updateAutoHeight(),a.updateSlidesClasses(),"slide"!==n.effect&&a.setTranslate(v),!1):(0!==t&&h.transition?(a.setTransition(t),a.setTranslate(v),a.updateActiveIndex(r),a.updateSlidesClasses(),a.emit("beforeTransitionStart",t,s),a.transitionStart(i),a.animating||(a.animating=!0,u.transitionEnd(function(){a&&!a.destroyed&&a.transitionEnd(i)}))):(a.setTransition(0),a.setTranslate(v),a.updateActiveIndex(r),a.updateSlidesClasses(),a.emit("beforeTransitionStart",t,s),a.transitionStart(i),a.transitionEnd(i)),!0)},slideNext:function(e,t,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var s=this.params,a=this.animating;return s.loop?!a&&(this.loopFix(),this._clientLeft=this.$wrapperEl[0].clientLeft,this.slideTo(this.activeIndex+s.slidesPerGroup,e,t,i)):this.slideTo(this.activeIndex+s.slidesPerGroup,e,t,i)},slidePrev:function(e,t,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var s=this.params,a=this.animating;return s.loop?!a&&(this.loopFix(),this._clientLeft=this.$wrapperEl[0].clientLeft,this.slideTo(this.activeIndex-1,e,t,i)):this.slideTo(this.activeIndex-1,e,t,i)},slideReset:function(e,t,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);return this.slideTo(this.activeIndex,e,t,i)},slideToClickedSlide:function(){var e,i=this,s=i.params,a=i.$wrapperEl,r="auto"===s.slidesPerView?i.slidesPerViewDynamic():s.slidesPerView,n=i.clickedIndex;if(s.loop){if(i.animating)return;e=parseInt(t(i.clickedSlide).attr("data-swiper-slide-index"),10),s.centeredSlides?n<i.loopedSlides-r/2||n>i.slides.length-i.loopedSlides+r/2?(i.loopFix(),n=a.children("."+s.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+s.slideDuplicateClass+")").eq(0).index(),l.nextTick(function(){i.slideTo(n)})):i.slideTo(n):n>i.slides.length-r?(i.loopFix(),n=a.children("."+s.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+s.slideDuplicateClass+")").eq(0).index(),l.nextTick(function(){i.slideTo(n)})):i.slideTo(n)}else i.slideTo(n)}},g={loopCreate:function(){var e=this,i=e.params,s=e.$wrapperEl;s.children("."+i.slideClass+"."+i.slideDuplicateClass).remove();var a=s.children("."+i.slideClass);if(i.loopFillGroupWithBlank){var r=i.slidesPerGroup-a.length%i.slidesPerGroup;if(r!==i.slidesPerGroup){for(var n=0;n<r;n+=1){var o=t(d.createElement("div")).addClass(i.slideClass+" "+i.slideBlankClass);s.append(o)}a=s.children("."+i.slideClass)}}"auto"!==i.slidesPerView||i.loopedSlides||(i.loopedSlides=a.length),e.loopedSlides=parseInt(i.loopedSlides||i.slidesPerView,10),e.loopedSlides+=i.loopAdditionalSlides,e.loopedSlides>a.length&&(e.loopedSlides=a.length);var l=[],h=[];a.each(function(i,s){var r=t(s);i<e.loopedSlides&&h.push(s),i<a.length&&i>=a.length-e.loopedSlides&&l.push(s),r.attr("data-swiper-slide-index",i)});for(var p=0;p<h.length;p+=1)s.append(t(h[p].cloneNode(!0)).addClass(i.slideDuplicateClass));for(var c=l.length-1;c>=0;c-=1)s.prepend(t(l[c].cloneNode(!0)).addClass(i.slideDuplicateClass))},loopFix:function(){var e,t=this.params,i=this.activeIndex,s=this.slides,a=this.loopedSlides,r=this.allowSlidePrev,n=this.allowSlideNext;this.allowSlidePrev=!0,this.allowSlideNext=!0,i<a?(e=s.length-3*a+i,e+=a,this.slideTo(e,0,!1,!0)):("auto"===t.slidesPerView&&i>=2*a||i>s.length-2*t.slidesPerView)&&(e=-s.length+i+a,e+=a,this.slideTo(e,0,!1,!0)),this.allowSlidePrev=r,this.allowSlideNext=n},loopDestroy:function(){var e=this.$wrapperEl,t=this.params,i=this.slides;e.children("."+t.slideClass+"."+t.slideDuplicateClass).remove(),i.removeAttr("data-swiper-slide-index")}},b={setGrabCursor:function(e){if(!h.touch&&this.params.simulateTouch){var t=this.el;t.style.cursor="move",t.style.cursor=e?"-webkit-grabbing":"-webkit-grab",t.style.cursor=e?"-moz-grabbin":"-moz-grab",t.style.cursor=e?"grabbing":"grab"}},unsetGrabCursor:function(){h.touch||(this.el.style.cursor="")}},w={appendSlide:function(e){var t=this.$wrapperEl,i=this.params;if(i.loop&&this.loopDestroy(),"object"==typeof e&&"length"in e)for(var s=0;s<e.length;s+=1)e[s]&&t.append(e[s]);else t.append(e);i.loop&&this.loopCreate(),i.observer&&h.observer||this.update()},prependSlide:function(e){var t=this.params,i=this.$wrapperEl,s=this.activeIndex;t.loop&&this.loopDestroy();var a=s+1;if("object"==typeof e&&"length"in e){for(var r=0;r<e.length;r+=1)e[r]&&i.prepend(e[r]);a=s+e.length}else i.prepend(e);t.loop&&this.loopCreate(),t.observer&&h.observer||this.update(),this.slideTo(a,0,!1)},removeSlide:function(e){var t=this.params,i=this.$wrapperEl,s=this.activeIndex;t.loop&&(this.loopDestroy(),this.slides=i.children("."+t.slideClass));var a,r=s;if("object"==typeof e&&"length"in e){for(var n=0;n<e.length;n+=1)a=e[n],this.slides[a]&&this.slides.eq(a).remove(),a<r&&(r-=1);r=Math.max(r,0)}else a=e,this.slides[a]&&this.slides.eq(a).remove(),a<r&&(r-=1),r=Math.max(r,0);t.loop&&this.loopCreate(),t.observer&&h.observer||this.update(),t.loop?this.slideTo(r+this.loopedSlides,0,!1):this.slideTo(r,0,!1)},removeAllSlides:function(){for(var e=[],t=0;t<this.slides.length;t+=1)e.push(t);this.removeSlide(e)}},y=function(){var e=o.navigator.userAgent,t={ios:!1,android:!1,androidChrome:!1,desktop:!1,windows:!1,iphone:!1,ipod:!1,ipad:!1,cordova:o.cordova||o.phonegap,phonegap:o.cordova||o.phonegap},i=e.match(/(Windows Phone);?[\s\/]+([\d.]+)?/),s=e.match(/(Android);?[\s\/]+([\d.]+)?/),a=e.match(/(iPad).*OS\s([\d_]+)/),r=e.match(/(iPod)(.*OS\s([\d_]+))?/),n=!a&&e.match(/(iPhone\sOS|iOS)\s([\d_]+)/);if(i&&(t.os="windows",t.osVersion=i[2],t.windows=!0),s&&!i&&(t.os="android",t.osVersion=s[2],t.android=!0,t.androidChrome=e.toLowerCase().indexOf("chrome")>=0),(a||n||r)&&(t.os="ios",t.ios=!0),n&&!r&&(t.osVersion=n[2].replace(/_/g,"."),t.iphone=!0),a&&(t.osVersion=a[2].replace(/_/g,"."),t.ipad=!0),r&&(t.osVersion=r[3]?r[3].replace(/_/g,"."):null,t.iphone=!0),t.ios&&t.osVersion&&e.indexOf("Version/")>=0&&"10"===t.osVersion.split(".")[0]&&(t.osVersion=e.toLowerCase().split("version/")[1].split(" ")[0]),t.desktop=!(t.os||t.android||t.webView),t.webView=(n||a||r)&&e.match(/.*AppleWebKit(?!.*Safari)/i),t.os&&"ios"===t.os){var l=t.osVersion.split("."),h=d.querySelector('meta[name="viewport"]');t.minimalUi=!t.webView&&(r||n)&&(1*l[0]==7?1*l[1]>=1:1*l[0]>7)&&h&&h.getAttribute("content").indexOf("minimal-ui")>=0}return t.pixelRatio=o.devicePixelRatio||1,t}(),x=function(e){var i=this.touchEventsData,s=this.params,a=this.touches,r=e;if(r.originalEvent&&(r=r.originalEvent),i.isTouchEvent="touchstart"===r.type,(i.isTouchEvent||!("which"in r)||3!==r.which)&&(!i.isTouched||!i.isMoved))if(s.noSwiping&&t(r.target).closest("."+s.noSwipingClass)[0])this.allowClick=!0;else if(!s.swipeHandler||t(r).closest(s.swipeHandler)[0]){a.currentX="touchstart"===r.type?r.targetTouches[0].pageX:r.pageX,a.currentY="touchstart"===r.type?r.targetTouches[0].pageY:r.pageY;var n=a.currentX,o=a.currentY;if(!(y.ios&&!y.cordova&&s.iOSEdgeSwipeDetection&&n<=s.iOSEdgeSwipeThreshold&&n>=window.screen.width-s.iOSEdgeSwipeThreshold)){if(l.extend(i,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),a.startX=n,a.startY=o,i.touchStartTime=l.now(),this.allowClick=!0,this.updateSize(),this.swipeDirection=void 0,s.threshold>0&&(i.allowThresholdMove=!1),"touchstart"!==r.type){var h=!0;t(r.target).is(i.formElements)&&(h=!1),d.activeElement&&t(d.activeElement).is(i.formElements)&&d.activeElement.blur(),h&&this.allowTouchMove&&r.preventDefault()}this.emit("touchStart",r)}}},T=function(e){var i=this.touchEventsData,s=this.params,a=this.touches,r=this.rtl,n=e;if(n.originalEvent&&(n=n.originalEvent),!i.isTouchEvent||"mousemove"!==n.type){var o="touchmove"===n.type?n.targetTouches[0].pageX:n.pageX,h="touchmove"===n.type?n.targetTouches[0].pageY:n.pageY;if(n.preventedByNestedSwiper)return a.startX=o,void(a.startY=h);if(!this.allowTouchMove)return this.allowClick=!1,void(i.isTouched&&(l.extend(a,{startX:o,startY:h,currentX:o,currentY:h}),i.touchStartTime=l.now()));if(i.isTouchEvent&&s.touchReleaseOnEdges&&!s.loop)if(this.isVertical()){if(h<a.startY&&this.translate<=this.maxTranslate()||h>a.startY&&this.translate>=this.minTranslate())return i.isTouched=!1,void(i.isMoved=!1)}else if(o<a.startX&&this.translate<=this.maxTranslate()||o>a.startX&&this.translate>=this.minTranslate())return;if(i.isTouchEvent&&d.activeElement&&n.target===d.activeElement&&t(n.target).is(i.formElements))return i.isMoved=!0,void(this.allowClick=!1);if(i.allowTouchCallbacks&&this.emit("touchMove",n),!(n.targetTouches&&n.targetTouches.length>1)){a.currentX=o,a.currentY=h;var p,c=a.currentX-a.startX,u=a.currentY-a.startY;if(void 0===i.isScrolling)this.isHorizontal()&&a.currentY===a.startY||this.isVertical()&&a.currentX===a.startX?i.isScrolling=!1:c*c+u*u>=25&&(p=180*Math.atan2(Math.abs(u),Math.abs(c))/Math.PI,i.isScrolling=this.isHorizontal()?p>s.touchAngle:90-p>s.touchAngle);if(i.isScrolling&&this.emit("touchMoveOpposite",n),"undefined"==typeof startMoving&&(a.currentX===a.startX&&a.currentY===a.startY||(i.startMoving=!0)),i.isTouched)if(i.isScrolling)i.isTouched=!1;else if(i.startMoving){this.allowClick=!1,n.preventDefault(),s.touchMoveStopPropagation&&!s.nested&&n.stopPropagation(),i.isMoved||(s.loop&&this.loopFix(),i.startTranslate=this.getTranslate(),this.setTransition(0),this.animating&&this.$wrapperEl.trigger("webkitTransitionEnd transitionend"),i.allowMomentumBounce=!1,!s.grabCursor||!0!==this.allowSlideNext&&!0!==this.allowSlidePrev||this.setGrabCursor(!0),this.emit("sliderFirstMove",n)),this.emit("sliderMove",n),i.isMoved=!0;var f=this.isHorizontal()?c:u;a.diff=f,f*=s.touchRatio,r&&(f=-f),this.swipeDirection=f>0?"prev":"next",i.currentTranslate=f+i.startTranslate;var v=!0,m=s.resistanceRatio;if(s.touchReleaseOnEdges&&(m=0),f>0&&i.currentTranslate>this.minTranslate()?(v=!1,s.resistance&&(i.currentTranslate=this.minTranslate()-1+Math.pow(-this.minTranslate()+i.startTranslate+f,m))):f<0&&i.currentTranslate<this.maxTranslate()&&(v=!1,s.resistance&&(i.currentTranslate=this.maxTranslate()+1-Math.pow(this.maxTranslate()-i.startTranslate-f,m))),v&&(n.preventedByNestedSwiper=!0),!this.allowSlideNext&&"next"===this.swipeDirection&&i.currentTranslate<i.startTranslate&&(i.currentTranslate=i.startTranslate),!this.allowSlidePrev&&"prev"===this.swipeDirection&&i.currentTranslate>i.startTranslate&&(i.currentTranslate=i.startTranslate),s.threshold>0){if(!(Math.abs(f)>s.threshold||i.allowThresholdMove))return void(i.currentTranslate=i.startTranslate);if(!i.allowThresholdMove)return i.allowThresholdMove=!0,a.startX=a.currentX,a.startY=a.currentY,i.currentTranslate=i.startTranslate,void(a.diff=this.isHorizontal()?a.currentX-a.startX:a.currentY-a.startY)}s.followFinger&&((s.freeMode||s.watchSlidesProgress||s.watchSlidesVisibility)&&(this.updateActiveIndex(),this.updateSlidesClasses()),s.freeMode&&(0===i.velocities.length&&i.velocities.push({position:a[this.isHorizontal()?"startX":"startY"],time:i.touchStartTime}),i.velocities.push({position:a[this.isHorizontal()?"currentX":"currentY"],time:l.now()})),this.updateProgress(i.currentTranslate),this.setTranslate(i.currentTranslate))}}}},E=function(e){var t=this,i=t.touchEventsData,s=t.params,a=t.touches,r=t.rtl,n=t.$wrapperEl,o=t.slidesGrid,d=t.snapGrid,h=e;if(h.originalEvent&&(h=h.originalEvent),i.allowTouchCallbacks&&t.emit("touchEnd",h),i.allowTouchCallbacks=!1,i.isTouched){s.grabCursor&&i.isMoved&&i.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);var p,c=l.now(),u=c-i.touchStartTime;if(t.allowClick&&(t.updateClickedSlide(h),t.emit("tap",h),u<300&&c-i.lastClickTime>300&&(i.clickTimeout&&clearTimeout(i.clickTimeout),i.clickTimeout=l.nextTick(function(){t&&!t.destroyed&&t.emit("click",h)},300)),u<300&&c-i.lastClickTime<300&&(i.clickTimeout&&clearTimeout(i.clickTimeout),t.emit("doubleTap",h))),i.lastClickTime=l.now(),l.nextTick(function(){t.destroyed||(t.allowClick=!0)}),!i.isTouched||!i.isMoved||!t.swipeDirection||0===a.diff||i.currentTranslate===i.startTranslate)return i.isTouched=!1,void(i.isMoved=!1);if(i.isTouched=!1,i.isMoved=!1,p=s.followFinger?r?t.translate:-t.translate:-i.currentTranslate,s.freeMode){if(p<-t.minTranslate())return void t.slideTo(t.activeIndex);if(p>-t.maxTranslate())return void(t.slides.length<d.length?t.slideTo(d.length-1):t.slideTo(t.slides.length-1));if(s.freeModeMomentum){if(i.velocities.length>1){var f=i.velocities.pop(),v=i.velocities.pop(),m=f.position-v.position,g=f.time-v.time;t.velocity=m/g,t.velocity/=2,Math.abs(t.velocity)<s.freeModeMinimumVelocity&&(t.velocity=0),(g>150||l.now()-f.time>300)&&(t.velocity=0)}else t.velocity=0;t.velocity*=s.freeModeMomentumVelocityRatio,i.velocities.length=0;var b=1e3*s.freeModeMomentumRatio,w=t.velocity*b,y=t.translate+w;r&&(y=-y);var x,T=!1,E=20*Math.abs(t.velocity)*s.freeModeMomentumBounceRatio;if(y<t.maxTranslate())s.freeModeMomentumBounce?(y+t.maxTranslate()<-E&&(y=t.maxTranslate()-E),x=t.maxTranslate(),T=!0,i.allowMomentumBounce=!0):y=t.maxTranslate();else if(y>t.minTranslate())s.freeModeMomentumBounce?(y-t.minTranslate()>E&&(y=t.minTranslate()+E),x=t.minTranslate(),T=!0,i.allowMomentumBounce=!0):y=t.minTranslate();else if(s.freeModeSticky){for(var S,C=0;C<d.length;C+=1)if(d[C]>-y){S=C;break}y=-(y=Math.abs(d[S]-y)<Math.abs(d[S-1]-y)||"next"===t.swipeDirection?d[S]:d[S-1])}if(0!==t.velocity)b=r?Math.abs((-y-t.translate)/t.velocity):Math.abs((y-t.translate)/t.velocity);else if(s.freeModeSticky)return void t.slideReset();s.freeModeMomentumBounce&&T?(t.updateProgress(x),t.setTransition(b),t.setTranslate(y),t.transitionStart(),t.animating=!0,n.transitionEnd(function(){t&&!t.destroyed&&i.allowMomentumBounce&&(t.emit("momentumBounce"),t.setTransition(s.speed),t.setTranslate(x),n.transitionEnd(function(){t&&!t.destroyed&&t.transitionEnd()}))})):t.velocity?(t.updateProgress(y),t.setTransition(b),t.setTranslate(y),t.transitionStart(),t.animating||(t.animating=!0,n.transitionEnd(function(){t&&!t.destroyed&&t.transitionEnd()}))):t.updateProgress(y),t.updateActiveIndex(),t.updateSlidesClasses()}(!s.freeModeMomentum||u>=s.longSwipesMs)&&(t.updateProgress(),t.updateActiveIndex(),t.updateSlidesClasses())}else{for(var M=0,z=t.slidesSizesGrid[0],P=0;P<o.length;P+=s.slidesPerGroup)void 0!==o[P+s.slidesPerGroup]?p>=o[P]&&p<o[P+s.slidesPerGroup]&&(M=P,z=o[P+s.slidesPerGroup]-o[P]):p>=o[P]&&(M=P,z=o[o.length-1]-o[o.length-2]);var k=(p-o[M])/z;if(u>s.longSwipesMs){if(!s.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(k>=s.longSwipesRatio?t.slideTo(M+s.slidesPerGroup):t.slideTo(M)),"prev"===t.swipeDirection&&(k>1-s.longSwipesRatio?t.slideTo(M+s.slidesPerGroup):t.slideTo(M))}else{if(!s.shortSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&t.slideTo(M+s.slidesPerGroup),"prev"===t.swipeDirection&&t.slideTo(M)}}}},S=function(){var e=this.params,t=this.el;if(!t||0!==t.offsetWidth){e.breakpoints&&this.setBreakpoint();var i=this.allowSlideNext,s=this.allowSlidePrev;if(this.allowSlideNext=!0,this.allowSlidePrev=!0,this.updateSize(),this.updateSlides(),e.freeMode){var a=Math.min(Math.max(this.translate,this.maxTranslate()),this.minTranslate());this.setTranslate(a),this.updateActiveIndex(),this.updateSlidesClasses(),e.autoHeight&&this.updateAutoHeight()}else this.updateSlidesClasses(),("auto"===e.slidesPerView||e.slidesPerView>1)&&this.isEnd&&!this.params.centeredSlides?this.slideTo(this.slides.length-1,0,!1,!0):this.slideTo(this.activeIndex,0,!1,!0);this.allowSlidePrev=s,this.allowSlideNext=i}},C=function(e){this.allowClick||(this.params.preventClicks&&e.preventDefault(),this.params.preventClicksPropagation&&this.animating&&(e.stopPropagation(),e.stopImmediatePropagation()))};var M={init:!0,direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,iOSEdgeSwipeDetection:!1,iOSEdgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeMomentumVelocityRatio:1,freeModeSticky:!1,freeModeMinimumVelocity:.02,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,centeredSlides:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,watchOverflow:!1,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:0,touchMoveStopPropagation:!0,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,loopFillGroupWithBlank:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",passiveListeners:!0,containerModifierClass:"swiper-container-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-invisible-blank",slideActiveClass:"swiper-slide-active",slideDuplicateActiveClass:"swiper-slide-duplicate-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slideDuplicateNextClass:"swiper-slide-duplicate-next",slidePrevClass:"swiper-slide-prev",slideDuplicatePrevClass:"swiper-slide-duplicate-prev",wrapperClass:"swiper-wrapper",runCallbacksOnInit:!0},z={update:u,translate:f,transition:v,slide:m,loop:g,grabCursor:b,manipulation:w,events:{attachEvents:function(){var e=this.params,t=this.touchEvents,i=this.el,s=this.wrapperEl;this.onTouchStart=x.bind(this),this.onTouchMove=T.bind(this),this.onTouchEnd=E.bind(this),this.onClick=C.bind(this);var a="container"===e.touchEventsTarget?i:s,r=!!e.nested;if(h.pointerEvents||h.prefixedPointerEvents)a.addEventListener(t.start,this.onTouchStart,!1),(h.touch?a:d).addEventListener(t.move,this.onTouchMove,r),(h.touch?a:d).addEventListener(t.end,this.onTouchEnd,!1);else{if(h.touch){var n=!("touchstart"!==t.start||!h.passiveListener||!e.passiveListeners)&&{passive:!0,capture:!1};a.addEventListener(t.start,this.onTouchStart,n),a.addEventListener(t.move,this.onTouchMove,h.passiveListener?{passive:!1,capture:r}:r),a.addEventListener(t.end,this.onTouchEnd,n)}(e.simulateTouch&&!y.ios&&!y.android||e.simulateTouch&&!h.touch&&y.ios)&&(a.addEventListener("mousedown",this.onTouchStart,!1),d.addEventListener("mousemove",this.onTouchMove,r),d.addEventListener("mouseup",this.onTouchEnd,!1))}(e.preventClicks||e.preventClicksPropagation)&&a.addEventListener("click",this.onClick,!0),this.on("resize observerUpdate",S)},detachEvents:function(){var e=this.params,t=this.touchEvents,i=this.el,s=this.wrapperEl,a="container"===e.touchEventsTarget?i:s,r=!!e.nested;if(h.pointerEvents||h.prefixedPointerEvents)a.removeEventListener(t.start,this.onTouchStart,!1),(h.touch?a:d).removeEventListener(t.move,this.onTouchMove,r),(h.touch?a:d).removeEventListener(t.end,this.onTouchEnd,!1);else{if(h.touch){var n=!("onTouchStart"!==t.start||!h.passiveListener||!e.passiveListeners)&&{passive:!0,capture:!1};a.removeEventListener(t.start,this.onTouchStart,n),a.removeEventListener(t.move,this.onTouchMove,r),a.removeEventListener(t.end,this.onTouchEnd,n)}(e.simulateTouch&&!y.ios&&!y.android||e.simulateTouch&&!h.touch&&y.ios)&&(a.removeEventListener("mousedown",this.onTouchStart,!1),d.removeEventListener("mousemove",this.onTouchMove,r),d.removeEventListener("mouseup",this.onTouchEnd,!1))}(e.preventClicks||e.preventClicksPropagation)&&a.removeEventListener("click",this.onClick,!0),this.off("resize observerUpdate",S)}},breakpoints:{setBreakpoint:function(){var e=this.activeIndex,t=this.loopedSlides;void 0===t&&(t=0);var i=this.params,s=i.breakpoints;if(s&&(!s||0!==Object.keys(s).length)){var a=this.getBreakpoint(s);if(a&&this.currentBreakpoint!==a){var r=a in s?s[a]:this.originalParams,n=i.loop&&r.slidesPerView!==i.slidesPerView;l.extend(this.params,r),l.extend(this,{allowTouchMove:this.params.allowTouchMove,allowSlideNext:this.params.allowSlideNext,allowSlidePrev:this.params.allowSlidePrev}),this.currentBreakpoint=a,n&&(this.loopDestroy(),this.loopCreate(),this.updateSlides(),this.slideTo(e-t+this.loopedSlides,0,!1)),this.emit("breakpoint",r)}}},getBreakpoint:function(e){if(e){var t=!1,i=[];Object.keys(e).forEach(function(e){i.push(e)}),i.sort(function(e,t){return parseInt(e,10)-parseInt(t,10)});for(var s=0;s<i.length;s+=1){var a=i[s];a>=o.innerWidth&&!t&&(t=a)}return t||"max"}}},checkOverflow:{checkOverflow:function(){var e=this.isLocked;this.isLocked=1===this.snapGrid.length,this.allowTouchMove=!this.isLocked,e&&e!==this.isLocked&&(this.isEnd=!1,this.navigation.update())}},classes:{addClasses:function(){var e=this.classNames,t=this.params,i=this.rtl,s=this.$el,a=[];a.push(t.direction),t.freeMode&&a.push("free-mode"),h.flexbox||a.push("no-flexbox"),t.autoHeight&&a.push("autoheight"),i&&a.push("rtl"),t.slidesPerColumn>1&&a.push("multirow"),y.android&&a.push("android"),y.ios&&a.push("ios"),(h.pointerEvents||h.prefixedPointerEvents)&&a.push("wp8-"+t.direction),a.forEach(function(i){e.push(t.containerModifierClass+i)}),s.addClass(e.join(" "))},removeClasses:function(){var e=this.$el,t=this.classNames;e.removeClass(t.join(" "))}},images:{loadImage:function(e,t,i,s,a,r){var n;function l(){r&&r()}e.complete&&a?l():t?((n=new o.Image).onload=l,n.onerror=l,s&&(n.sizes=s),i&&(n.srcset=i),t&&(n.src=t)):l()},preloadImages:function(){var e=this;function t(){void 0!==e&&null!==e&&e&&!e.destroyed&&(void 0!==e.imagesLoaded&&(e.imagesLoaded+=1),e.imagesLoaded===e.imagesToLoad.length&&(e.params.updateOnImagesReady&&e.update(),e.emit("imagesReady")))}e.imagesToLoad=e.$el.find("img");for(var i=0;i<e.imagesToLoad.length;i+=1){var s=e.imagesToLoad[i];e.loadImage(s,s.currentSrc||s.getAttribute("src"),s.srcset||s.getAttribute("srcset"),s.sizes||s.getAttribute("sizes"),!0,t)}}}},P={},k=function(e){function i(){for(var s,a,r,n=[],o=arguments.length;o--;)n[o]=arguments[o];1===n.length&&n[0].constructor&&n[0].constructor===Object?a=n[0]:(s=(r=n)[0],a=r[1]);a||(a={}),a=l.extend({},a),s&&!a.el&&(a.el=s),e.call(this,a),Object.keys(z).forEach(function(e){Object.keys(z[e]).forEach(function(t){i.prototype[t]||(i.prototype[t]=z[e][t])})});var d=this;void 0===d.modules&&(d.modules={}),Object.keys(d.modules).forEach(function(e){var t=d.modules[e];if(t.params){var i=Object.keys(t.params)[0],s=t.params[i];if("object"!=typeof s)return;if(!(i in a&&"enabled"in s))return;!0===a[i]&&(a[i]={enabled:!0}),"object"!=typeof a[i]||"enabled"in a[i]||(a[i].enabled=!0),a[i]||(a[i]={enabled:!1})}});var p=l.extend({},M);d.useModulesParams(p),d.params=l.extend({},p,P,a),d.originalParams=l.extend({},d.params),d.passedParams=l.extend({},a);var c=t(d.params.el);if(s=c[0]){if(c.length>1){var u=[];return c.each(function(e,t){var s=l.extend({},a,{el:t});u.push(new i(s))}),u}s.swiper=d,c.data("swiper",d);var f,v,m=c.children("."+d.params.wrapperClass);return l.extend(d,{$el:c,el:s,$wrapperEl:m,wrapperEl:m[0],classNames:[],slides:t(),slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:function(){return"horizontal"===d.params.direction},isVertical:function(){return"vertical"===d.params.direction},rtl:"horizontal"===d.params.direction&&("rtl"===s.dir.toLowerCase()||"rtl"===c.css("direction")),wrongRTL:"-webkit-box"===m.css("display"),activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,progress:0,velocity:0,animating:!1,allowSlideNext:d.params.allowSlideNext,allowSlidePrev:d.params.allowSlidePrev,touchEvents:(f=["touchstart","touchmove","touchend"],v=["mousedown","mousemove","mouseup"],h.pointerEvents?v=["pointerdown","pointermove","pointerup"]:h.prefixedPointerEvents&&(v=["MSPointerDown","MSPointerMove","MSPointerUp"]),{start:h.touch||!d.params.simulateTouch?f[0]:v[0],move:h.touch||!d.params.simulateTouch?f[1]:v[1],end:h.touch||!d.params.simulateTouch?f[2]:v[2]}),touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,formElements:"input, select, option, textarea, button, video",lastClickTime:l.now(),clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,isTouchEvent:void 0,startMoving:void 0},allowClick:!0,allowTouchMove:d.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),d.useModules(),d.params.init&&d.init(),d}}e&&(i.__proto__=e),i.prototype=Object.create(e&&e.prototype),i.prototype.constructor=i;var s={extendedDefaults:{configurable:!0},defaults:{configurable:!0},Class:{configurable:!0},$:{configurable:!0}};return i.prototype.slidesPerViewDynamic=function(){var e=this.params,t=this.slides,i=this.slidesGrid,s=this.size,a=this.activeIndex,r=1;if(e.centeredSlides){for(var n,o=t[a].swiperSlideSize,l=a+1;l<t.length;l+=1)t[l]&&!n&&(r+=1,(o+=t[l].swiperSlideSize)>s&&(n=!0));for(var d=a-1;d>=0;d-=1)t[d]&&!n&&(r+=1,(o+=t[d].swiperSlideSize)>s&&(n=!0))}else for(var h=a+1;h<t.length;h+=1)i[h]-i[a]<s&&(r+=1);return r},i.prototype.update=function(){var e=this;e&&!e.destroyed&&(e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),e.params.freeMode?(t(),e.params.autoHeight&&e.updateAutoHeight()):(("auto"===e.params.slidesPerView||e.params.slidesPerView>1)&&e.isEnd&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0))||t(),e.emit("update"));function t(){var t=e.rtl?-1*e.translate:e.translate,i=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(i),e.updateActiveIndex(),e.updateSlidesClasses()}},i.prototype.init=function(){this.initialized||(this.emit("beforeInit"),this.params.breakpoints&&this.setBreakpoint(),this.addClasses(),this.params.loop&&this.loopCreate(),this.updateSize(),this.updateSlides(),this.params.watchOverflow&&this.checkOverflow(),this.params.grabCursor&&this.setGrabCursor(),this.params.preloadImages&&this.preloadImages(),this.params.loop?this.slideTo(this.params.initialSlide+this.loopedSlides,0,this.params.runCallbacksOnInit):this.slideTo(this.params.initialSlide,0,this.params.runCallbacksOnInit),this.attachEvents(),this.initialized=!0,this.emit("init"))},i.prototype.destroy=function(e,t){void 0===e&&(e=!0),void 0===t&&(t=!0);var i=this,s=i.params,a=i.$el,r=i.$wrapperEl,n=i.slides;i.emit("beforeDestroy"),i.initialized=!1,i.detachEvents(),s.loop&&i.loopDestroy(),t&&(i.removeClasses(),a.removeAttr("style"),r.removeAttr("style"),n&&n.length&&n.removeClass([s.slideVisibleClass,s.slideActiveClass,s.slideNextClass,s.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index").removeAttr("data-swiper-column").removeAttr("data-swiper-row")),i.emit("destroy"),Object.keys(i.eventsListeners).forEach(function(e){i.off(e)}),!1!==e&&(i.$el[0].swiper=null,i.$el.data("swiper",null),l.deleteProps(i)),i.destroyed=!0},i.extendDefaults=function(e){l.extend(P,e)},s.extendedDefaults.get=function(){return P},s.defaults.get=function(){return M},s.Class.get=function(){return e},s.$.get=function(){return t},Object.defineProperties(i,s),i}(p),$={name:"device",proto:{device:y},static:{device:y}},L={name:"support",proto:{support:h},static:{support:h}},I=function(){return{isSafari:(e=o.navigator.userAgent.toLowerCase(),e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(o.navigator.userAgent)};var e}(),D={name:"browser",proto:{browser:I},static:{browser:I}},O={name:"resize",create:function(){var e=this;l.extend(e,{resize:{resizeHandler:function(){e&&!e.destroyed&&e.initialized&&(e.emit("beforeResize"),e.emit("resize"))},orientationChangeHandler:function(){e&&!e.destroyed&&e.initialized&&e.emit("orientationchange")}}})},on:{init:function(){o.addEventListener("resize",this.resize.resizeHandler),o.addEventListener("orientationchange",this.resize.orientationChangeHandler)},destroy:function(){o.removeEventListener("resize",this.resize.resizeHandler),o.removeEventListener("orientationchange",this.resize.orientationChangeHandler)}}},A={func:o.MutationObserver||o.WebkitMutationObserver,attach:function(e,t){void 0===t&&(t={});var i=this,s=new(0,A.func)(function(e){e.forEach(function(e){i.emit("observerUpdate",e)})});s.observe(e,{attributes:void 0===t.attributes||t.attributes,childList:void 0===t.childList||t.childList,characterData:void 0===t.characterData||t.characterData}),i.observer.observers.push(s)},init:function(){if(h.observer&&this.params.observer){if(this.params.observeParents)for(var e=this.$el.parents(),t=0;t<e.length;t+=1)this.observer.attach(e[t]);this.observer.attach(this.$el[0],{childList:!1}),this.observer.attach(this.$wrapperEl[0],{attributes:!1})}},destroy:function(){this.observer.observers.forEach(function(e){e.disconnect()}),this.observer.observers=[]}},H={name:"observer",params:{observer:!1,observeParents:!1},create:function(){l.extend(this,{observer:{init:A.init.bind(this),attach:A.attach.bind(this),destroy:A.destroy.bind(this),observers:[]}})},on:{init:function(){this.observer.init()},destroy:function(){this.observer.destroy()}}},N={update:function(e){var t=this,i=t.params,s=i.slidesPerView,a=i.slidesPerGroup,r=i.centeredSlides,n=t.virtual,o=n.from,d=n.to,h=n.slides,p=n.slidesGrid,c=n.renderSlide,u=n.offset;t.updateActiveIndex();var f,v,m,g=t.activeIndex||0;f=t.rtl&&t.isHorizontal()?"right":t.isHorizontal()?"left":"top",r?(v=Math.floor(s/2)+a,m=Math.floor(s/2)+a):(v=s+(a-1),m=a);var b=Math.max((g||0)-m,0),w=Math.min((g||0)+v,h.length-1),y=(t.slidesGrid[b]||0)-(t.slidesGrid[0]||0);function x(){t.updateSlides(),t.updateProgress(),t.updateSlidesClasses(),t.lazy&&t.params.lazy.enabled&&t.lazy.load()}if(l.extend(t.virtual,{from:b,to:w,offset:y,slidesGrid:t.slidesGrid}),o===b&&d===w&&!e)return t.slidesGrid!==p&&y!==u&&t.slides.css(f,y+"px"),void t.updateProgress();if(t.params.virtual.renderExternal)return t.params.virtual.renderExternal.call(t,{offset:y,from:b,to:w,slides:function(){for(var e=[],t=b;t<=w;t+=1)e.push(h[t]);return e}()}),void x();var T=[],E=[];if(e)t.$wrapperEl.find("."+t.params.slideClass).remove();else for(var S=o;S<=d;S+=1)(S<b||S>w)&&t.$wrapperEl.find("."+t.params.slideClass+'[data-swiper-slide-index="'+S+'"]').remove();for(var C=0;C<h.length;C+=1)C>=b&&C<=w&&(void 0===d||e?E.push(C):(C>d&&E.push(C),C<o&&T.push(C)));E.forEach(function(e){t.$wrapperEl.append(c(h[e],e))}),T.sort(function(e,t){return e<t}).forEach(function(e){t.$wrapperEl.prepend(c(h[e],e))}),t.$wrapperEl.children(".swiper-slide").css(f,y+"px"),x()},renderSlide:function(e,i){var s=this.params.virtual;if(s.cache&&this.virtual.cache[i])return this.virtual.cache[i];var a=s.renderSlide?t(s.renderSlide.call(this,e,i)):t('<div class="'+this.params.slideClass+'" data-swiper-slide-index="'+i+'">'+e+"</div>");return a.attr("data-swiper-slide-index")||a.attr("data-swiper-slide-index",i),s.cache&&(this.virtual.cache[i]=a),a},appendSlide:function(e){this.virtual.slides.push(e),this.virtual.update(!0)},prependSlide:function(e){if(this.virtual.slides.unshift(e),this.params.virtual.cache){var t=this.virtual.cache,i={};Object.keys(t).forEach(function(e){i[e+1]=t[e]}),this.virtual.cache=i}this.virtual.update(!0),this.slideNext(0)}},X={name:"virtual",params:{virtual:{enabled:!1,slides:[],cache:!0,renderSlide:null,renderExternal:null}},create:function(){l.extend(this,{virtual:{update:N.update.bind(this),appendSlide:N.appendSlide.bind(this),prependSlide:N.prependSlide.bind(this),renderSlide:N.renderSlide.bind(this),slides:this.params.virtual.slides,cache:{}}})},on:{beforeInit:function(){if(this.params.virtual.enabled){this.classNames.push(this.params.containerModifierClass+"virtual");var e={watchSlidesProgress:!0};l.extend(this.params,e),l.extend(this.originalParams,e),this.virtual.update()}},setTranslate:function(){this.params.virtual.enabled&&this.virtual.update()}}},Y={handle:function(e){var t=e;t.originalEvent&&(t=t.originalEvent);var i=t.keyCode||t.charCode;if(!this.allowSlideNext&&(this.isHorizontal()&&39===i||this.isVertical()&&40===i))return!1;if(!this.allowSlidePrev&&(this.isHorizontal()&&37===i||this.isVertical()&&38===i))return!1;if(!(t.shiftKey||t.altKey||t.ctrlKey||t.metaKey||d.activeElement&&d.activeElement.nodeName&&("input"===d.activeElement.nodeName.toLowerCase()||"textarea"===d.activeElement.nodeName.toLowerCase()))){if(this.params.keyboard.onlyInViewport&&(37===i||39===i||38===i||40===i)){var s=!1;if(this.$el.parents("."+this.params.slideClass).length>0&&0===this.$el.parents("."+this.params.slideActiveClass).length)return;var a=o.pageXOffset,r=o.pageYOffset,n=o.innerWidth,l=o.innerHeight,h=this.$el.offset();this.rtl&&(h.left-=this.$el[0].scrollLeft);for(var p=[[h.left,h.top],[h.left+this.width,h.top],[h.left,h.top+this.height],[h.left+this.width,h.top+this.height]],c=0;c<p.length;c+=1){var u=p[c];u[0]>=a&&u[0]<=a+n&&u[1]>=r&&u[1]<=r+l&&(s=!0)}if(!s)return}this.isHorizontal()?(37!==i&&39!==i||(t.preventDefault?t.preventDefault():t.returnValue=!1),(39===i&&!this.rtl||37===i&&this.rtl)&&this.slideNext(),(37===i&&!this.rtl||39===i&&this.rtl)&&this.slidePrev()):(38!==i&&40!==i||(t.preventDefault?t.preventDefault():t.returnValue=!1),40===i&&this.slideNext(),38===i&&this.slidePrev()),this.emit("keyPress",i)}},enable:function(){this.keyboard.enabled||(t(d).on("keydown",this.keyboard.handle),this.keyboard.enabled=!0)},disable:function(){this.keyboard.enabled&&(t(d).off("keydown",this.keyboard.handle),this.keyboard.enabled=!1)}},G={name:"keyboard",params:{keyboard:{enabled:!1,onlyInViewport:!0}},create:function(){l.extend(this,{keyboard:{enabled:!1,enable:Y.enable.bind(this),disable:Y.disable.bind(this),handle:Y.handle.bind(this)}})},on:{init:function(){this.params.keyboard.enabled&&this.keyboard.enable()},destroy:function(){this.keyboard.enabled&&this.keyboard.disable()}}};var B={lastScrollTime:l.now(),event:o.navigator.userAgent.indexOf("firefox")>-1?"DOMMouseScroll":function(){var e="onwheel"in d;if(!e){var t=d.createElement("div");t.setAttribute("onwheel","return;"),e="function"==typeof t.onwheel}return!e&&d.implementation&&d.implementation.hasFeature&&!0!==d.implementation.hasFeature("","")&&(e=d.implementation.hasFeature("Events.wheel","3.0")),e}()?"wheel":"mousewheel",normalize:function(e){var t=0,i=0,s=0,a=0;return"detail"in e&&(i=e.detail),"wheelDelta"in e&&(i=-e.wheelDelta/120),"wheelDeltaY"in e&&(i=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=i,i=0),s=10*t,a=10*i,"deltaY"in e&&(a=e.deltaY),"deltaX"in e&&(s=e.deltaX),(s||a)&&e.deltaMode&&(1===e.deltaMode?(s*=40,a*=40):(s*=800,a*=800)),s&&!t&&(t=s<1?-1:1),a&&!i&&(i=a<1?-1:1),{spinX:t,spinY:i,pixelX:s,pixelY:a}},handle:function(e){var t=e,i=this,s=i.params.mousewheel;t.originalEvent&&(t=t.originalEvent);var a=0,r=i.rtl?-1:1,n=B.normalize(t);if(s.forceToAxis)if(i.isHorizontal()){if(!(Math.abs(n.pixelX)>Math.abs(n.pixelY)))return!0;a=n.pixelX*r}else{if(!(Math.abs(n.pixelY)>Math.abs(n.pixelX)))return!0;a=n.pixelY}else a=Math.abs(n.pixelX)>Math.abs(n.pixelY)?-n.pixelX*r:-n.pixelY;if(0===a)return!0;if(s.invert&&(a=-a),i.params.freeMode){var d=i.getTranslate()+a*s.sensitivity,h=i.isBeginning,p=i.isEnd;if(d>=i.minTranslate()&&(d=i.minTranslate()),d<=i.maxTranslate()&&(d=i.maxTranslate()),i.setTransition(0),i.setTranslate(d),i.updateProgress(),i.updateActiveIndex(),i.updateSlidesClasses(),(!h&&i.isBeginning||!p&&i.isEnd)&&i.updateSlidesClasses(),i.params.freeModeSticky&&(clearTimeout(i.mousewheel.timeout),i.mousewheel.timeout=l.nextTick(function(){i.slideReset()},300)),i.emit("scroll",t),i.params.autoplay&&i.params.autoplayDisableOnInteraction&&i.stopAutoplay(),0===d||d===i.maxTranslate())return!0}else{if(l.now()-i.mousewheel.lastScrollTime>60)if(a<0)if(i.isEnd&&!i.params.loop||i.animating){if(s.releaseOnEdges)return!0}else i.slideNext(),i.emit("scroll",t);else if(i.isBeginning&&!i.params.loop||i.animating){if(s.releaseOnEdges)return!0}else i.slidePrev(),i.emit("scroll",t);i.mousewheel.lastScrollTime=(new o.Date).getTime()}return t.preventDefault?t.preventDefault():t.returnValue=!1,!1},enable:function(){if(!B.event)return!1;if(this.mousewheel.enabled)return!1;var e=this.$el;return"container"!==this.params.mousewheel.eventsTarged&&(e=t(this.params.mousewheel.eventsTarged)),e.on(B.event,this.mousewheel.handle),this.mousewheel.enabled=!0,!0},disable:function(){if(!B.event)return!1;if(!this.mousewheel.enabled)return!1;var e=this.$el;return"container"!==this.params.mousewheel.eventsTarged&&(e=t(this.params.mousewheel.eventsTarged)),e.off(B.event,this.mousewheel.handle),this.mousewheel.enabled=!1,!0}},V={update:function(){var e=this.params.navigation;if(!this.params.loop){var t=this.navigation,i=t.$nextEl,s=t.$prevEl;s&&s.length>0&&(this.isBeginning?s.addClass(e.disabledClass):s.removeClass(e.disabledClass),s[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](e.lockClass)),i&&i.length>0&&(this.isEnd?i.addClass(e.disabledClass):i.removeClass(e.disabledClass),i[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](e.lockClass))}},init:function(){var e,i,s=this,a=s.params.navigation;(a.nextEl||a.prevEl)&&(a.nextEl&&(e=t(a.nextEl),s.params.uniqueNavElements&&"string"==typeof a.nextEl&&e.length>1&&1===s.$el.find(a.nextEl).length&&(e=s.$el.find(a.nextEl))),a.prevEl&&(i=t(a.prevEl),s.params.uniqueNavElements&&"string"==typeof a.prevEl&&i.length>1&&1===s.$el.find(a.prevEl).length&&(i=s.$el.find(a.prevEl))),e&&e.length>0&&e.on("click",function(e){e.preventDefault(),s.isEnd&&!s.params.loop||s.slideNext()}),i&&i.length>0&&i.on("click",function(e){e.preventDefault(),s.isBeginning&&!s.params.loop||s.slidePrev()}),l.extend(s.navigation,{$nextEl:e,nextEl:e&&e[0],$prevEl:i,prevEl:i&&i[0]}))},destroy:function(){var e=this.navigation,t=e.$nextEl,i=e.$prevEl;t&&t.length&&(t.off("click"),t.removeClass(this.params.navigation.disabledClass)),i&&i.length&&(i.off("click"),i.removeClass(this.params.navigation.disabledClass))}},R={update:function(){var e=this.rtl,i=this.params.pagination;if(i.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var s,a=this.virtual&&this.params.virtual.enabled?this.virtual.slides.length:this.slides.length,r=this.pagination.$el,n=this.params.loop?Math.ceil((a-2*this.loopedSlides)/this.params.slidesPerGroup):this.snapGrid.length;if(this.params.loop?((s=Math.ceil((this.activeIndex-this.loopedSlides)/this.params.slidesPerGroup))>a-1-2*this.loopedSlides&&(s-=a-2*this.loopedSlides),s>n-1&&(s-=n),s<0&&"bullets"!==this.params.paginationType&&(s=n+s)):s=void 0!==this.snapIndex?this.snapIndex:this.activeIndex||0,"bullets"===i.type&&this.pagination.bullets&&this.pagination.bullets.length>0){var o=this.pagination.bullets;if(i.dynamicBullets&&(this.pagination.bulletSize=o.eq(0)[this.isHorizontal()?"outerWidth":"outerHeight"](!0),r.css(this.isHorizontal()?"width":"height",5*this.pagination.bulletSize+"px")),o.removeClass(i.bulletActiveClass+" "+i.bulletActiveClass+"-next "+i.bulletActiveClass+"-next-next "+i.bulletActiveClass+"-prev "+i.bulletActiveClass+"-prev-prev"),r.length>1)o.each(function(e,a){var r=t(a);r.index()===s&&(r.addClass(i.bulletActiveClass),i.dynamicBullets&&(r.prev().addClass(i.bulletActiveClass+"-prev").prev().addClass(i.bulletActiveClass+"-prev-prev"),r.next().addClass(i.bulletActiveClass+"-next").next().addClass(i.bulletActiveClass+"-next-next")))});else{var l=o.eq(s);l.addClass(i.bulletActiveClass),i.dynamicBullets&&(l.prev().addClass(i.bulletActiveClass+"-prev").prev().addClass(i.bulletActiveClass+"-prev-prev"),l.next().addClass(i.bulletActiveClass+"-next").next().addClass(i.bulletActiveClass+"-next-next"))}if(i.dynamicBullets){var d=Math.min(o.length,5),h=(this.pagination.bulletSize*d-this.pagination.bulletSize)/2-s*this.pagination.bulletSize,p=e?"right":"left";o.css(this.isHorizontal()?p:"top",h+"px")}}if("fraction"===i.type&&(r.find("."+i.currentClass).text(s+1),r.find("."+i.totalClass).text(n)),"progressbar"===i.type){var c=(s+1)/n,u=c,f=1;this.isHorizontal()||(f=c,u=1),r.find("."+i.progressbarFillClass).transform("translate3d(0,0,0) scaleX("+u+") scaleY("+f+")").transition(this.params.speed)}"custom"===i.type&&i.renderCustom?(r.html(i.renderCustom(this,s+1,n)),this.emit("paginationRender",this,r[0])):this.emit("paginationUpdate",this,r[0]),r[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](i.lockClass)}},render:function(){var e=this.params.pagination;if(e.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var t=this.virtual&&this.params.virtual.enabled?this.virtual.slides.length:this.slides.length,i=this.pagination.$el,s="";if("bullets"===e.type){for(var a=this.params.loop?Math.ceil((t-2*this.loopedSlides)/this.params.slidesPerGroup):this.snapGrid.length,r=0;r<a;r+=1)e.renderBullet?s+=e.renderBullet.call(this,r,e.bulletClass):s+="<"+e.bulletElement+' class="'+e.bulletClass+'"></'+e.bulletElement+">";i.html(s),this.pagination.bullets=i.find("."+e.bulletClass)}"fraction"===e.type&&(s=e.renderFraction?e.renderFraction.call(this,e.currentClass,e.totalClass):'<span class="'+e.currentClass+'"></span> / <span class="'+e.totalClass+'"></span>',i.html(s)),"progressbar"===e.type&&(s=e.renderProgressbar?e.renderProgressbar.call(this,e.progressbarFillClass):'<span class="'+e.progressbarFillClass+'"></span>',i.html(s)),"custom"!==e.type&&this.emit("paginationRender",this.pagination.$el[0])}},init:function(){var e=this,i=e.params.pagination;if(i.el){var s=t(i.el);0!==s.length&&(e.params.uniqueNavElements&&"string"==typeof i.el&&s.length>1&&1===e.$el.find(i.el).length&&(s=e.$el.find(i.el)),"bullets"===i.type&&i.clickable&&s.addClass(i.clickableClass),s.addClass(i.modifierClass+i.type),"bullets"===i.type&&i.dynamicBullets&&s.addClass(""+i.modifierClass+i.type+"-dynamic"),i.clickable&&s.on("click","."+i.bulletClass,function(i){i.preventDefault();var s=t(this).index()*e.params.slidesPerGroup;e.params.loop&&(s+=e.loopedSlides),e.slideTo(s)}),l.extend(e.pagination,{$el:s,el:s[0]}))}},destroy:function(){var e=this.params.pagination;if(e.el&&this.pagination.el&&this.pagination.$el&&0!==this.pagination.$el.length){var t=this.pagination.$el;t.removeClass(e.hiddenClass),t.removeClass(e.modifierClass+e.type),this.pagination.bullets&&this.pagination.bullets.removeClass(e.bulletActiveClass),e.clickable&&t.off("click","."+e.bulletClass)}}},F={setTranslate:function(){if(this.params.scrollbar.el&&this.scrollbar.el){var e=this.scrollbar,t=this.rtl,i=this.progress,s=e.dragSize,a=e.trackSize,r=e.$dragEl,n=e.$el,o=this.params.scrollbar,l=s,d=(a-s)*i;t&&this.isHorizontal()?(d=-d)>0?(l=s-d,d=0):-d+s>a&&(l=a+d):d<0?(l=s+d,d=0):d+s>a&&(l=a-d),this.isHorizontal()?(h.transforms3d?r.transform("translate3d("+d+"px, 0, 0)"):r.transform("translateX("+d+"px)"),r[0].style.width=l+"px"):(h.transforms3d?r.transform("translate3d(0px, "+d+"px, 0)"):r.transform("translateY("+d+"px)"),r[0].style.height=l+"px"),o.hide&&(clearTimeout(this.scrollbar.timeout),n[0].style.opacity=1,this.scrollbar.timeout=setTimeout(function(){n[0].style.opacity=0,n.transition(400)},1e3))}},setTransition:function(e){this.params.scrollbar.el&&this.scrollbar.el&&this.scrollbar.$dragEl.transition(e)},updateSize:function(){if(this.params.scrollbar.el&&this.scrollbar.el){var e=this.scrollbar,t=e.$dragEl,i=e.$el;t[0].style.width="",t[0].style.height="";var s,a=this.isHorizontal()?i[0].offsetWidth:i[0].offsetHeight,r=this.size/this.virtualSize,n=r*(a/this.size);s="auto"===this.params.scrollbar.dragSize?a*r:parseInt(this.params.scrollbar.dragSize,10),this.isHorizontal()?t[0].style.width=s+"px":t[0].style.height=s+"px",i[0].style.display=r>=1?"none":"",this.params.scrollbarHide&&(i[0].style.opacity=0),l.extend(e,{trackSize:a,divider:r,moveDivider:n,dragSize:s}),e.$el[this.params.watchOverflow&&this.isLocked?"addClass":"removeClass"](this.params.scrollbar.lockClass)}},setDragPosition:function(e){var t,i=this.scrollbar,s=i.$el,a=i.dragSize,r=i.trackSize;t=((this.isHorizontal()?"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageX:e.pageX||e.clientX:"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].pageY:e.pageY||e.clientY)-s.offset()[this.isHorizontal()?"left":"top"]-a/2)/(r-a),t=Math.max(Math.min(t,1),0),this.rtl&&(t=1-t);var n=this.minTranslate()+(this.maxTranslate()-this.minTranslate())*t;this.updateProgress(n),this.setTranslate(n),this.updateActiveIndex(),this.updateSlidesClasses()},onDragStart:function(e){var t=this.params.scrollbar,i=this.scrollbar,s=this.$wrapperEl,a=i.$el,r=i.$dragEl;this.scrollbar.isTouched=!0,e.preventDefault(),e.stopPropagation(),s.transition(100),r.transition(100),i.setDragPosition(e),clearTimeout(this.scrollbar.dragTimeout),a.transition(0),t.hide&&a.css("opacity",1),this.emit("scrollbarDragStart",e)},onDragMove:function(e){var t=this.scrollbar,i=this.$wrapperEl,s=t.$el,a=t.$dragEl;this.scrollbar.isTouched&&(e.preventDefault?e.preventDefault():e.returnValue=!1,t.setDragPosition(e),i.transition(0),s.transition(0),a.transition(0),this.emit("scrollbarDragMove",e))},onDragEnd:function(e){var t=this.params.scrollbar,i=this.scrollbar.$el;this.scrollbar.isTouched&&(this.scrollbar.isTouched=!1,t.hide&&(clearTimeout(this.scrollbar.dragTimeout),this.scrollbar.dragTimeout=l.nextTick(function(){i.css("opacity",0),i.transition(400)},1e3)),this.emit("scrollbarDragEnd",e),t.snapOnRelease&&this.slideReset())},enableDraggable:function(){if(this.params.scrollbar.el){var e=this.scrollbar.$el,i=h.touch?e[0]:document;e.on(this.scrollbar.dragEvents.start,this.scrollbar.onDragStart),t(i).on(this.scrollbar.dragEvents.move,this.scrollbar.onDragMove),t(i).on(this.scrollbar.dragEvents.end,this.scrollbar.onDragEnd)}},disableDraggable:function(){if(this.params.scrollbar.el){var e=this.scrollbar.$el,i=h.touch?e[0]:document;e.off(this.scrollbar.dragEvents.start),t(i).off(this.scrollbar.dragEvents.move),t(i).off(this.scrollbar.dragEvents.end)}},init:function(){var e=this;if(e.params.scrollbar.el){var i=e.scrollbar,s=e.$el,a=e.touchEvents,r=e.params.scrollbar,n=t(r.el);e.params.uniqueNavElements&&"string"==typeof r.el&&n.length>1&&1===s.find(r.el).length&&(n=s.find(r.el));var o=n.find(".swiper-scrollbar-drag");0===o.length&&(o=t('<div class="swiper-scrollbar-drag"></div>'),n.append(o)),e.scrollbar.dragEvents=!1!==e.params.simulateTouch||h.touch?a:{start:"mousedown",move:"mousemove",end:"mouseup"},l.extend(i,{$el:n,el:n[0],$dragEl:o,dragEl:o[0]}),r.draggable&&i.enableDraggable()}},destroy:function(){this.scrollbar.disableDraggable()}},W={setTransform:function(e,i){var s=this.rtl,a=t(e),r=s?-1:1,n=a.attr("data-swiper-parallax")||"0",o=a.attr("data-swiper-parallax-x"),l=a.attr("data-swiper-parallax-y"),d=a.attr("data-swiper-parallax-scale"),h=a.attr("data-swiper-parallax-opacity");if(o||l?(o=o||"0",l=l||"0"):this.isHorizontal()?(o=n,l="0"):(l=n,o="0"),o=o.indexOf("%")>=0?parseInt(o,10)*i*r+"%":o*i*r+"px",l=l.indexOf("%")>=0?parseInt(l,10)*i+"%":l*i+"px",void 0!==h&&null!==h){var p=h-(h-1)*(1-Math.abs(i));a[0].style.opacity=p}if(void 0===d||null===d)a.transform("translate3d("+o+", "+l+", 0px)");else{var c=d-(d-1)*(1-Math.abs(i));a.transform("translate3d("+o+", "+l+", 0px) scale("+c+")")}},setTranslate:function(){var e=this,i=e.$el,s=e.slides,a=e.progress,r=e.snapGrid;i.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(t,i){e.parallax.setTransform(i,a)}),s.each(function(i,s){var n=s.progress;e.params.slidesPerGroup>1&&"auto"!==e.params.slidesPerView&&(n+=Math.ceil(i/2)-a*(r.length-1)),n=Math.min(Math.max(n,-1),1),t(s).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(t,i){e.parallax.setTransform(i,n)})})},setTransition:function(e){void 0===e&&(e=this.params.speed);this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function(i,s){var a=t(s),r=parseInt(a.attr("data-swiper-parallax-duration"),10)||e;0===e&&(r=0),a.transition(r)})}},j={getDistanceBetweenTouches:function(e){if(e.targetTouches.length<2)return 1;var t=e.targetTouches[0].pageX,i=e.targetTouches[0].pageY,s=e.targetTouches[1].pageX,a=e.targetTouches[1].pageY;return Math.sqrt(Math.pow(s-t,2)+Math.pow(a-i,2))},onGestureStart:function(e){var i=this.params.zoom,s=this.zoom,a=s.gesture;if(s.fakeGestureTouched=!1,s.fakeGestureMoved=!1,!h.gestures){if("touchstart"!==e.type||"touchstart"===e.type&&e.targetTouches.length<2)return;s.fakeGestureTouched=!0,a.scaleStart=j.getDistanceBetweenTouches(e)}a.$slideEl&&a.$slideEl.length||(a.$slideEl=t(this),0===a.$slideEl.length&&(a.$slideEl=this.slides.eq(this.activeIndex)),a.$imageEl=a.$slideEl.find("img, svg, canvas"),a.$imageWrapEl=a.$imageEl.parent("."+i.containerClass),a.maxRatio=a.$imageWrapEl.attr("data-swiper-zoom")||i.maxRatio,0!==a.$imageWrapEl.length)?(a.$imageEl.transition(0),this.zoom.isScaling=!0):a.$imageEl=void 0},onGestureChange:function(e){var t=this.params.zoom,i=this.zoom,s=i.gesture;if(!h.gestures){if("touchmove"!==e.type||"touchmove"===e.type&&e.targetTouches.length<2)return;i.fakeGestureMoved=!0,s.scaleMove=j.getDistanceBetweenTouches(e)}s.$imageEl&&0!==s.$imageEl.length&&(h.gestures?this.zoom.scale=e.scale*i.currentScale:i.scale=s.scaleMove/s.scaleStart*i.currentScale,i.scale>s.maxRatio&&(i.scale=s.maxRatio-1+Math.pow(i.scale-s.maxRatio+1,.5)),i.scale<t.minRatio&&(i.scale=t.minRatio+1-Math.pow(t.minRatio-i.scale+1,.5)),s.$imageEl.transform("translate3d(0,0,0) scale("+i.scale+")"))},onGestureEnd:function(e){var t=this.params.zoom,i=this.zoom,s=i.gesture;if(!h.gestures){if(!i.fakeGestureTouched||!i.fakeGestureMoved)return;if("touchend"!==e.type||"touchend"===e.type&&e.changedTouches.length<2&&!y.android)return;i.fakeGestureTouched=!1,i.fakeGestureMoved=!1}s.$imageEl&&0!==s.$imageEl.length&&(i.scale=Math.max(Math.min(i.scale,s.maxRatio),t.minRatio),s.$imageEl.transition(this.params.speed).transform("translate3d(0,0,0) scale("+i.scale+")"),i.currentScale=i.scale,i.isScaling=!1,1===i.scale&&(s.$slideEl=void 0))},onTouchStart:function(e){var t=this.zoom,i=t.gesture,s=t.image;i.$imageEl&&0!==i.$imageEl.length&&(s.isTouched||(y.android&&e.preventDefault(),s.isTouched=!0,s.touchesStart.x="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,s.touchesStart.y="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY))},onTouchMove:function(e){var t=this.zoom,i=t.gesture,s=t.image,a=t.velocity;if(i.$imageEl&&0!==i.$imageEl.length&&(this.allowClick=!1,s.isTouched&&i.$slideEl)){s.isMoved||(s.width=i.$imageEl[0].offsetWidth,s.height=i.$imageEl[0].offsetHeight,s.startX=l.getTranslate(i.$imageWrapEl[0],"x")||0,s.startY=l.getTranslate(i.$imageWrapEl[0],"y")||0,i.slideWidth=i.$slideEl[0].offsetWidth,i.slideHeight=i.$slideEl[0].offsetHeight,i.$imageWrapEl.transition(0),this.rtl&&(s.startX=-s.startX),this.rtl&&(s.startY=-s.startY));var r=s.width*t.scale,n=s.height*t.scale;if(!(r<i.slideWidth&&n<i.slideHeight)){if(s.minX=Math.min(i.slideWidth/2-r/2,0),s.maxX=-s.minX,s.minY=Math.min(i.slideHeight/2-n/2,0),s.maxY=-s.minY,s.touchesCurrent.x="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,s.touchesCurrent.y="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,!s.isMoved&&!t.isScaling){if(this.isHorizontal()&&(Math.floor(s.minX)===Math.floor(s.startX)&&s.touchesCurrent.x<s.touchesStart.x||Math.floor(s.maxX)===Math.floor(s.startX)&&s.touchesCurrent.x>s.touchesStart.x))return void(s.isTouched=!1);if(!this.isHorizontal()&&(Math.floor(s.minY)===Math.floor(s.startY)&&s.touchesCurrent.y<s.touchesStart.y||Math.floor(s.maxY)===Math.floor(s.startY)&&s.touchesCurrent.y>s.touchesStart.y))return void(s.isTouched=!1)}e.preventDefault(),e.stopPropagation(),s.isMoved=!0,s.currentX=s.touchesCurrent.x-s.touchesStart.x+s.startX,s.currentY=s.touchesCurrent.y-s.touchesStart.y+s.startY,s.currentX<s.minX&&(s.currentX=s.minX+1-Math.pow(s.minX-s.currentX+1,.8)),s.currentX>s.maxX&&(s.currentX=s.maxX-1+Math.pow(s.currentX-s.maxX+1,.8)),s.currentY<s.minY&&(s.currentY=s.minY+1-Math.pow(s.minY-s.currentY+1,.8)),s.currentY>s.maxY&&(s.currentY=s.maxY-1+Math.pow(s.currentY-s.maxY+1,.8)),a.prevPositionX||(a.prevPositionX=s.touchesCurrent.x),a.prevPositionY||(a.prevPositionY=s.touchesCurrent.y),a.prevTime||(a.prevTime=Date.now()),a.x=(s.touchesCurrent.x-a.prevPositionX)/(Date.now()-a.prevTime)/2,a.y=(s.touchesCurrent.y-a.prevPositionY)/(Date.now()-a.prevTime)/2,Math.abs(s.touchesCurrent.x-a.prevPositionX)<2&&(a.x=0),Math.abs(s.touchesCurrent.y-a.prevPositionY)<2&&(a.y=0),a.prevPositionX=s.touchesCurrent.x,a.prevPositionY=s.touchesCurrent.y,a.prevTime=Date.now(),i.$imageWrapEl.transform("translate3d("+s.currentX+"px, "+s.currentY+"px,0)")}}},onTouchEnd:function(){var e=this.zoom,t=e.gesture,i=e.image,s=e.velocity;if(t.$imageEl&&0!==t.$imageEl.length){if(!i.isTouched||!i.isMoved)return i.isTouched=!1,void(i.isMoved=!1);i.isTouched=!1,i.isMoved=!1;var a=300,r=300,n=s.x*a,o=i.currentX+n,l=s.y*r,d=i.currentY+l;0!==s.x&&(a=Math.abs((o-i.currentX)/s.x)),0!==s.y&&(r=Math.abs((d-i.currentY)/s.y));var h=Math.max(a,r);i.currentX=o,i.currentY=d;var p=i.width*e.scale,c=i.height*e.scale;i.minX=Math.min(t.slideWidth/2-p/2,0),i.maxX=-i.minX,i.minY=Math.min(t.slideHeight/2-c/2,0),i.maxY=-i.minY,i.currentX=Math.max(Math.min(i.currentX,i.maxX),i.minX),i.currentY=Math.max(Math.min(i.currentY,i.maxY),i.minY),t.$imageWrapEl.transition(h).transform("translate3d("+i.currentX+"px, "+i.currentY+"px,0)")}},onTransitionEnd:function(){var e=this.zoom,t=e.gesture;t.$slideEl&&this.previousIndex!==this.activeIndex&&(t.$imageEl.transform("translate3d(0,0,0) scale(1)"),t.$imageWrapEl.transform("translate3d(0,0,0)"),t.$slideEl=void 0,t.$imageEl=void 0,t.$imageWrapEl=void 0,e.scale=1,e.currentScale=1)},toggle:function(e){var t=this.zoom;t.scale&&1!==t.scale?t.out():t.in(e)},in:function(e){var i,s,a,r,n,o,l,d,h,p,c,u,f,v,m,g,b=this.zoom,w=this.params.zoom,y=b.gesture,x=b.image;(y.$slideEl||(y.$slideEl=this.clickedSlide?t(this.clickedSlide):this.slides.eq(this.activeIndex),y.$imageEl=y.$slideEl.find("img, svg, canvas"),y.$imageWrapEl=y.$imageEl.parent("."+w.containerClass)),y.$imageEl&&0!==y.$imageEl.length)&&(y.$slideEl.addClass(""+w.zoomedSlideClass),void 0===x.touchesStart.x&&e?(i="touchend"===e.type?e.changedTouches[0].pageX:e.pageX,s="touchend"===e.type?e.changedTouches[0].pageY:e.pageY):(i=x.touchesStart.x,s=x.touchesStart.y),b.scale=y.$imageWrapEl.attr("data-swiper-zoom")||w.maxRatio,b.currentScale=y.$imageWrapEl.attr("data-swiper-zoom")||w.maxRatio,e?(m=y.$slideEl[0].offsetWidth,g=y.$slideEl[0].offsetHeight,a=y.$slideEl.offset().left+m/2-i,r=y.$slideEl.offset().top+g/2-s,l=y.$imageEl[0].offsetWidth,d=y.$imageEl[0].offsetHeight,h=l*b.scale,p=d*b.scale,f=-(c=Math.min(m/2-h/2,0)),v=-(u=Math.min(g/2-p/2,0)),n=a*b.scale,o=r*b.scale,n<c&&(n=c),n>f&&(n=f),o<u&&(o=u),o>v&&(o=v)):(n=0,o=0),y.$imageWrapEl.transition(300).transform("translate3d("+n+"px, "+o+"px,0)"),y.$imageEl.transition(300).transform("translate3d(0,0,0) scale("+b.scale+")"))},out:function(){var e=this.zoom,i=this.params.zoom,s=e.gesture;s.$slideEl||(s.$slideEl=this.clickedSlide?t(this.clickedSlide):this.slides.eq(this.activeIndex),s.$imageEl=s.$slideEl.find("img, svg, canvas"),s.$imageWrapEl=s.$imageEl.parent("."+i.containerClass)),s.$imageEl&&0!==s.$imageEl.length&&(e.scale=1,e.currentScale=1,s.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),s.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),s.$slideEl.removeClass(""+i.zoomedSlideClass),s.$slideEl=void 0)},enable:function(){var e=this,i=e.zoom;if(!i.enabled){i.enabled=!0;var s=e.slides,a=!("touchstart"!==e.touchEvents.start||!h.passiveListener||!e.params.passiveListeners)&&{passive:!0,capture:!1};h.gestures?(s.on("gesturestart",i.onGestureStart,a),s.on("gesturechange",i.onGestureChange,a),s.on("gestureend",i.onGestureEnd,a)):"touchstart"===e.touchEvents.start&&(s.on(e.touchEvents.start,i.onGestureStart,a),s.on(e.touchEvents.move,i.onGestureChange,a),s.on(e.touchEvents.end,i.onGestureEnd,a)),e.slides.each(function(s,a){var r=t(a);r.find("."+e.params.zoom.containerClass).length>0&&r.on(e.touchEvents.move,i.onTouchMove)})}},disable:function(){var e=this,i=e.zoom;if(i.enabled){e.zoom.enabled=!1;var s=e.slides,a=!("touchstart"!==e.touchEvents.start||!h.passiveListener||!e.params.passiveListeners)&&{passive:!0,capture:!1};h.gestures?(s.off("gesturestart",i.onGestureStart,a),s.off("gesturechange",i.onGestureChange,a),s.off("gestureend",i.onGestureEnd,a)):"touchstart"===e.touchEvents.start&&(s.off(e.touchEvents.start,i.onGestureStart,a),s.off(e.touchEvents.move,i.onGestureChange,a),s.off(e.touchEvents.end,i.onGestureEnd,a)),e.slides.each(function(s,a){var r=t(a);r.find("."+e.params.zoom.containerClass).length>0&&r.off(e.touchEvents.move,i.onTouchMove)})}}},q={loadInSlide:function(e,i){void 0===i&&(i=!0);var s=this,a=s.params.lazy;if(void 0!==e&&0!==s.slides.length){var r=s.virtual&&s.params.virtual.enabled?s.$wrapperEl.children("."+s.params.slideClass+'[data-swiper-slide-index="'+e+'"]'):s.slides.eq(e),n=r.find("."+a.elementClass+":not(."+a.loadedClass+"):not(."+a.loadingClass+")");!r.hasClass(a.elementClass)||r.hasClass(a.loadedClass)||r.hasClass(a.loadingClass)||(n=n.add(r[0])),0!==n.length&&n.each(function(e,n){var o=t(n);o.addClass(a.loadingClass);var l=o.attr("data-background"),d=o.attr("data-src"),h=o.attr("data-srcset"),p=o.attr("data-sizes");s.loadImage(o[0],d||l,h,p,!1,function(){if(void 0!==s&&null!==s&&s&&(!s||s.params)&&!s.destroyed){if(l?(o.css("background-image",'url("'+l+'")'),o.removeAttr("data-background")):(h&&(o.attr("srcset",h),o.removeAttr("data-srcset")),p&&(o.attr("sizes",p),o.removeAttr("data-sizes")),d&&(o.attr("src",d),o.removeAttr("data-src"))),o.addClass(a.loadedClass).removeClass(a.loadingClass),r.find("."+a.preloaderClass).remove(),s.params.loop&&i){var e=r.attr("data-swiper-slide-index");if(r.hasClass(s.params.slideDuplicateClass)){var t=s.$wrapperEl.children('[data-swiper-slide-index="'+e+'"]:not(.'+s.params.slideDuplicateClass+")");s.lazy.loadInSlide(t.index(),!1)}else{var n=s.$wrapperEl.children("."+s.params.slideDuplicateClass+'[data-swiper-slide-index="'+e+'"]');s.lazy.loadInSlide(n.index(),!1)}}s.emit("lazyImageReady",r[0],o[0])}}),s.emit("lazyImageLoad",r[0],o[0])})}},load:function(){var e=this,i=e.$wrapperEl,s=e.params,a=e.slides,r=e.activeIndex,n=e.virtual&&s.virtual.enabled,o=s.lazy,l=s.slidesPerView;function d(e){if(n){if(i.children("."+s.slideClass+'[data-swiper-slide-index="'+e+'"]').length)return!0}else if(a[e])return!0;return!1}function h(e){return n?t(e).attr("data-swiper-slide-index"):t(e).index()}if("auto"===l&&(l=0),e.lazy.initialImageLoaded||(e.lazy.initialImageLoaded=!0),e.params.watchSlidesVisibility)i.children("."+s.slideVisibleClass).each(function(i,s){var a=n?t(s).attr("data-swiper-slide-index"):t(s).index();e.lazy.loadInSlide(a)});else if(l>1)for(var p=r;p<r+l;p+=1)d(p)&&e.lazy.loadInSlide(p);else e.lazy.loadInSlide(r);if(o.loadPrevNext)if(l>1||o.loadPrevNextAmount&&o.loadPrevNextAmount>1){for(var c=o.loadPrevNextAmount,u=l,f=Math.min(r+u+Math.max(c,u),a.length),v=Math.max(r-Math.max(u,c),0),m=r+l;m<f;m+=1)d(m)&&e.lazy.loadInSlide(m);for(var g=v;g<r;g+=1)d(g)&&e.lazy.loadInSlide(g)}else{var b=i.children("."+s.slideNextClass);b.length>0&&e.lazy.loadInSlide(h(b));var w=i.children("."+s.slidePrevClass);w.length>0&&e.lazy.loadInSlide(h(w))}}},K={LinearSpline:function(e,t){var i,s,a,r,n,o=function(e,t){for(s=-1,i=e.length;i-s>1;)e[a=i+s>>1]<=t?s=a:i=a;return i};return this.x=e,this.y=t,this.lastIndex=e.length-1,this.interpolate=function(e){return e?(n=o(this.x,e),r=n-1,(e-this.x[r])*(this.y[n]-this.y[r])/(this.x[n]-this.x[r])+this.y[r]):0},this},getInterpolateFunction:function(e){this.controller.spline||(this.controller.spline=this.params.loop?new K.LinearSpline(this.slidesGrid,e.slidesGrid):new K.LinearSpline(this.snapGrid,e.snapGrid))},setTranslate:function(e,t){var i,s,a=this,r=a.controller.control;function n(e){var t=e.rtl&&"horizontal"===e.params.direction?-a.translate:a.translate;"slide"===a.params.controller.by&&(a.controller.getInterpolateFunction(e),s=-a.controller.spline.interpolate(-t)),s&&"container"!==a.params.controller.by||(i=(e.maxTranslate()-e.minTranslate())/(a.maxTranslate()-a.minTranslate()),s=(t-a.minTranslate())*i+e.minTranslate()),a.params.controller.inverse&&(s=e.maxTranslate()-s),e.updateProgress(s),e.setTranslate(s,a),e.updateActiveIndex(),e.updateSlidesClasses()}if(Array.isArray(r))for(var o=0;o<r.length;o+=1)r[o]!==t&&r[o]instanceof k&&n(r[o]);else r instanceof k&&t!==r&&n(r)},setTransition:function(e,t){var i,s=this,a=s.controller.control;function r(t){t.setTransition(e,s),0!==e&&(t.transitionStart(),t.$wrapperEl.transitionEnd(function(){a&&(t.params.loop&&"slide"===s.params.controller.by&&t.loopFix(),t.transitionEnd())}))}if(Array.isArray(a))for(i=0;i<a.length;i+=1)a[i]!==t&&a[i]instanceof k&&r(a[i]);else a instanceof k&&t!==a&&r(a)}},U={makeElFocusable:function(e){return e.attr("tabIndex","0"),e},addElRole:function(e,t){return e.attr("role",t),e},addElLabel:function(e,t){return e.attr("aria-label",t),e},disableEl:function(e){return e.attr("aria-disabled",!0),e},enableEl:function(e){return e.attr("aria-disabled",!1),e},onEnterKey:function(e){var i=this.params.a11y;if(13===e.keyCode){var s=t(e.target);this.navigation&&this.navigation.$nextEl&&s.is(this.navigation.$nextEl)&&(this.isEnd&&!this.params.loop||this.slideNext(),this.isEnd?this.a11y.notify(i.lastSlideMessage):this.a11y.notify(i.nextSlideMessage)),this.navigation&&this.navigation.$prevEl&&s.is(this.navigation.$prevEl)&&(this.isBeginning&&!this.params.loop||this.slidePrev(),this.isBeginning?this.a11y.notify(i.firstSlideMessage):this.a11y.notify(i.prevSlideMessage)),this.pagination&&s.is("."+this.params.pagination.bulletClass)&&s[0].click()}},notify:function(e){var t=this.a11y.liveRegion;0!==t.length&&(t.html(""),t.html(e))},updateNavigation:function(){if(!this.params.loop){var e=this.navigation,t=e.$nextEl,i=e.$prevEl;i&&i.length>0&&(this.isBeginning?this.a11y.disableEl(i):this.a11y.enableEl(i)),t&&t.length>0&&(this.isEnd?this.a11y.disableEl(t):this.a11y.enableEl(t))}},updatePagination:function(){var e=this,i=e.params.a11y;e.pagination&&e.params.pagination.clickable&&e.pagination.bullets&&e.pagination.bullets.length&&e.pagination.bullets.each(function(s,a){var r=t(a);e.a11y.makeElFocusable(r),e.a11y.addElRole(r,"button"),e.a11y.addElLabel(r,i.paginationBulletMessage.replace(/{{index}}/,r.index()+1))})},init:function(){this.$el.append(this.a11y.liveRegion);var e,t,i=this.params.a11y;this.navigation&&this.navigation.$nextEl&&(e=this.navigation.$nextEl),this.navigation&&this.navigation.$prevEl&&(t=this.navigation.$prevEl),e&&(this.a11y.makeElFocusable(e),this.a11y.addElRole(e,"button"),this.a11y.addElLabel(e,i.nextSlideMessage),e.on("keydown",this.a11y.onEnterKey)),t&&(this.a11y.makeElFocusable(t),this.a11y.addElRole(t,"button"),this.a11y.addElLabel(t,i.prevSlideMessage),t.on("keydown",this.a11y.onEnterKey)),this.pagination&&this.params.pagination.clickable&&this.pagination.bullets&&this.pagination.bullets.length&&this.pagination.$el.on("keydown","."+this.params.pagination.bulletClass,this.a11y.onEnterKey)},destroy:function(){var e,t;this.a11y.liveRegion&&this.a11y.liveRegion.length>0&&this.a11y.liveRegion.remove(),this.navigation&&this.navigation.$nextEl&&(e=this.navigation.$nextEl),this.navigation&&this.navigation.$prevEl&&(t=this.navigation.$prevEl),e&&e.off("keydown",this.a11y.onEnterKey),t&&t.off("keydown",this.a11y.onEnterKey),this.pagination&&this.params.pagination.clickable&&this.pagination.bullets&&this.pagination.bullets.length&&this.pagination.$el.off("keydown","."+this.params.pagination.bulletClass,this.a11y.onEnterKey)}},_={init:function(){if(this.params.history){if(!o.history||!o.history.pushState)return this.params.history.enabled=!1,void(this.params.hashNavigation.enabled=!0);var e=this.history;e.initialized=!0,e.paths=_.getPathValues(),(e.paths.key||e.paths.value)&&(e.scrollToSlide(0,e.paths.value,this.params.runCallbacksOnInit),this.params.history.replaceState||o.addEventListener("popstate",this.history.setHistoryPopState))}},destroy:function(){this.params.history.replaceState||o.removeEventListener("popstate",this.history.setHistoryPopState)},setHistoryPopState:function(){this.history.paths=_.getPathValues(),this.history.scrollToSlide(this.params.speed,this.history.paths.value,!1)},getPathValues:function(){var e=o.location.pathname.slice(1).split("/").filter(function(e){return""!==e}),t=e.length;return{key:e[t-2],value:e[t-1]}},setHistory:function(e,t){if(this.history.initialized&&this.params.history.enabled){var i=this.slides.eq(t),s=_.slugify(i.attr("data-history"));o.location.pathname.includes(e)||(s=e+"/"+s);var a=o.history.state;a&&a.value===s||(this.params.history.replaceState?o.history.replaceState({value:s},null,s):o.history.pushState({value:s},null,s))}},slugify:function(e){return e.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+/,"").replace(/-+$/,"")},scrollToSlide:function(e,t,i){if(t)for(var s=0,a=this.slides.length;s<a;s+=1){var r=this.slides.eq(s);if(_.slugify(r.attr("data-history"))===t&&!r.hasClass(this.params.slideDuplicateClass)){var n=r.index();this.slideTo(n,e,i)}}else this.slideTo(0,e,i)}},Z={onHashCange:function(){var e=d.location.hash.replace("#","");e!==this.slides.eq(this.activeIndex).attr("data-hash")&&this.slideTo(this.$wrapperEl.children("."+this.params.slideClass+'[data-hash="'+e+'"]').index())},setHash:function(){if(this.hashNavigation.initialized&&this.params.hashNavigation.enabled)if(this.params.hashNavigation.replaceState&&o.history&&o.history.replaceState)o.history.replaceState(null,null,"#"+this.slides.eq(this.activeIndex).attr("data-hash")||"");else{var e=this.slides.eq(this.activeIndex),t=e.attr("data-hash")||e.attr("data-history");d.location.hash=t||""}},init:function(){if(!(!this.params.hashNavigation.enabled||this.params.history&&this.params.history.enabled)){this.hashNavigation.initialized=!0;var e=d.location.hash.replace("#","");if(e)for(var i=0,s=this.slides.length;i<s;i+=1){var a=this.slides.eq(i);if((a.attr("data-hash")||a.attr("data-history"))===e&&!a.hasClass(this.params.slideDuplicateClass)){var r=a.index();this.slideTo(r,0,this.params.runCallbacksOnInit,!0)}}this.params.hashNavigation.watchState&&t(o).on("hashchange",this.hashNavigation.onHashCange)}},destroy:function(){this.params.hashNavigation.watchState&&t(o).off("hashchange",this.hashNavigation.onHashCange)}},Q={run:function(){var e=this,t=e.slides.eq(e.activeIndex),i=e.params.autoplay.delay;t.attr("data-swiper-autoplay")&&(i=t.attr("data-swiper-autoplay")||e.params.autoplay.delay),e.autoplay.timeout=l.nextTick(function(){e.params.autoplay.reverseDirection?e.params.loop?(e.loopFix(),e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.isBeginning?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(e.slideTo(e.slides.length-1,e.params.speed,!0,!0),e.emit("autoplay")):(e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.params.loop?(e.loopFix(),e.slideNext(e.params.speed,!0,!0),e.emit("autoplay")):e.isEnd?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(e.slideTo(0,e.params.speed,!0,!0),e.emit("autoplay")):(e.slideNext(e.params.speed,!0,!0),e.emit("autoplay"))},i)},start:function(){return void 0===this.autoplay.timeout&&(!this.autoplay.running&&(this.autoplay.running=!0,this.emit("autoplayStart"),this.autoplay.run(),!0))},stop:function(){return!!this.autoplay.running&&(void 0!==this.autoplay.timeout&&(this.autoplay.timeout&&(clearTimeout(this.autoplay.timeout),this.autoplay.timeout=void 0),this.autoplay.running=!1,this.emit("autoplayStop"),!0))},pause:function(e){var t=this;t.autoplay.running&&(t.autoplay.paused||(t.autoplay.timeout&&clearTimeout(t.autoplay.timeout),t.autoplay.paused=!0,0!==e&&t.params.autoplay.waitForTransition?t.$wrapperEl.transitionEnd(function(){t&&!t.destroyed&&(t.autoplay.paused=!1,t.autoplay.running?t.autoplay.run():t.autoplay.stop())}):(t.autoplay.paused=!1,t.autoplay.run())))}},J={setTranslate:function(){for(var e=this.slides,t=0;t<e.length;t+=1){var i=this.slides.eq(t),s=-i[0].swiperSlideOffset;this.params.virtualTranslate||(s-=this.translate);var a=0;this.isHorizontal()||(a=s,s=0);var r=this.params.fadeEffect.crossFade?Math.max(1-Math.abs(i[0].progress),0):1+Math.min(Math.max(i[0].progress,-1),0);i.css({opacity:r}).transform("translate3d("+s+"px, "+a+"px, 0px)")}},setTransition:function(e){var t=this,i=t.slides,s=t.$wrapperEl;if(i.transition(e),t.params.virtualTranslate&&0!==e){var a=!1;i.transitionEnd(function(){if(!a&&t&&!t.destroyed){a=!0,t.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],i=0;i<e.length;i+=1)s.trigger(e[i])}})}}},ee={setTranslate:function(){var e,i=this.$el,s=this.$wrapperEl,a=this.slides,r=this.width,n=this.height,o=this.rtl,l=this.size,d=this.params.cubeEffect,h=this.isHorizontal(),p=this.virtual&&this.params.virtual.enabled,c=0;d.shadow&&(h?(0===(e=s.find(".swiper-cube-shadow")).length&&(e=t('<div class="swiper-cube-shadow"></div>'),s.append(e)),e.css({height:r+"px"})):0===(e=i.find(".swiper-cube-shadow")).length&&(e=t('<div class="swiper-cube-shadow"></div>'),i.append(e)));for(var u=0;u<a.length;u+=1){var f=a.eq(u),v=u;p&&(v=parseInt(f.attr("data-swiper-slide-index"),10));var m=90*v,g=Math.floor(m/360);o&&(m=-m,g=Math.floor(-m/360));var b=Math.max(Math.min(f[0].progress,1),-1),w=0,y=0,x=0;v%4==0?(w=4*-g*l,x=0):(v-1)%4==0?(w=0,x=4*-g*l):(v-2)%4==0?(w=l+4*g*l,x=l):(v-3)%4==0&&(w=-l,x=3*l+4*l*g),o&&(w=-w),h||(y=w,w=0);var T="rotateX("+(h?0:-m)+"deg) rotateY("+(h?m:0)+"deg) translate3d("+w+"px, "+y+"px, "+x+"px)";if(b<=1&&b>-1&&(c=90*v+90*b,o&&(c=90*-v-90*b)),f.transform(T),d.slideShadows){var E=h?f.find(".swiper-slide-shadow-left"):f.find(".swiper-slide-shadow-top"),S=h?f.find(".swiper-slide-shadow-right"):f.find(".swiper-slide-shadow-bottom");0===E.length&&(E=t('<div class="swiper-slide-shadow-'+(h?"left":"top")+'"></div>'),f.append(E)),0===S.length&&(S=t('<div class="swiper-slide-shadow-'+(h?"right":"bottom")+'"></div>'),f.append(S)),E.length&&(E[0].style.opacity=Math.max(-b,0)),S.length&&(S[0].style.opacity=Math.max(b,0))}}if(s.css({"-webkit-transform-origin":"50% 50% -"+l/2+"px","-moz-transform-origin":"50% 50% -"+l/2+"px","-ms-transform-origin":"50% 50% -"+l/2+"px","transform-origin":"50% 50% -"+l/2+"px"}),d.shadow)if(h)e.transform("translate3d(0px, "+(r/2+d.shadowOffset)+"px, "+-r/2+"px) rotateX(90deg) rotateZ(0deg) scale("+d.shadowScale+")");else{var C=Math.abs(c)-90*Math.floor(Math.abs(c)/90),M=1.5-(Math.sin(2*C*Math.PI/360)/2+Math.cos(2*C*Math.PI/360)/2),z=d.shadowScale,P=d.shadowScale/M,k=d.shadowOffset;e.transform("scale3d("+z+", 1, "+P+") translate3d(0px, "+(n/2+k)+"px, "+-n/2/P+"px) rotateX(-90deg)")}var $=I.isSafari||I.isUiWebView?-l/2:0;s.transform("translate3d(0px,0,"+$+"px) rotateX("+(this.isHorizontal()?0:c)+"deg) rotateY("+(this.isHorizontal()?-c:0)+"deg)")},setTransition:function(e){var t=this.$el;this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),this.params.cubeEffect.shadow&&!this.isHorizontal()&&t.find(".swiper-cube-shadow").transition(e)}},te={setTranslate:function(){for(var e=this.slides,i=0;i<e.length;i+=1){var s=e.eq(i),a=s[0].progress;this.params.flipEffect.limitRotation&&(a=Math.max(Math.min(s[0].progress,1),-1));var r=-180*a,n=0,o=-s[0].swiperSlideOffset,l=0;if(this.isHorizontal()?this.rtl&&(r=-r):(l=o,o=0,n=-r,r=0),s[0].style.zIndex=-Math.abs(Math.round(a))+e.length,this.params.flipEffect.slideShadows){var d=this.isHorizontal()?s.find(".swiper-slide-shadow-left"):s.find(".swiper-slide-shadow-top"),h=this.isHorizontal()?s.find(".swiper-slide-shadow-right"):s.find(".swiper-slide-shadow-bottom");0===d.length&&(d=t('<div class="swiper-slide-shadow-'+(this.isHorizontal()?"left":"top")+'"></div>'),s.append(d)),0===h.length&&(h=t('<div class="swiper-slide-shadow-'+(this.isHorizontal()?"right":"bottom")+'"></div>'),s.append(h)),d.length&&(d[0].style.opacity=Math.max(-a,0)),h.length&&(h[0].style.opacity=Math.max(a,0))}s.transform("translate3d("+o+"px, "+l+"px, 0px) rotateX("+n+"deg) rotateY("+r+"deg)")}},setTransition:function(e){var t=this,i=t.slides,s=t.activeIndex,a=t.$wrapperEl;if(i.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),t.params.virtualTranslate&&0!==e){var r=!1;i.eq(s).transitionEnd(function(){if(!r&&t&&!t.destroyed){r=!0,t.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],i=0;i<e.length;i+=1)a.trigger(e[i])}})}}},ie={setTranslate:function(){for(var e=this.width,i=this.height,s=this.slides,a=this.$wrapperEl,r=this.slidesSizesGrid,n=this.params.coverflowEffect,o=this.isHorizontal(),l=this.translate,d=o?e/2-l:i/2-l,p=o?n.rotate:-n.rotate,c=n.depth,u=0,f=s.length;u<f;u+=1){var v=s.eq(u),m=r[u],g=(d-v[0].swiperSlideOffset-m/2)/m*n.modifier,b=o?p*g:0,w=o?0:p*g,y=-c*Math.abs(g),x=o?0:n.stretch*g,T=o?n.stretch*g:0;Math.abs(T)<.001&&(T=0),Math.abs(x)<.001&&(x=0),Math.abs(y)<.001&&(y=0),Math.abs(b)<.001&&(b=0),Math.abs(w)<.001&&(w=0);var E="translate3d("+T+"px,"+x+"px,"+y+"px)  rotateX("+w+"deg) rotateY("+b+"deg)";if(v.transform(E),v[0].style.zIndex=1-Math.abs(Math.round(g)),n.slideShadows){var S=o?v.find(".swiper-slide-shadow-left"):v.find(".swiper-slide-shadow-top"),C=o?v.find(".swiper-slide-shadow-right"):v.find(".swiper-slide-shadow-bottom");0===S.length&&(S=t('<div class="swiper-slide-shadow-'+(o?"left":"top")+'"></div>'),v.append(S)),0===C.length&&(C=t('<div class="swiper-slide-shadow-'+(o?"right":"bottom")+'"></div>'),v.append(C)),S.length&&(S[0].style.opacity=g>0?g:0),C.length&&(C[0].style.opacity=-g>0?-g:0)}}(h.pointerEvents||h.prefixedPointerEvents)&&(a[0].style.perspectiveOrigin=d+"px 50%")},setTransition:function(e){this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}},se=[$,L,D,O,H,X,G,{name:"mousewheel",params:{mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarged:"container"}},create:function(){l.extend(this,{mousewheel:{enabled:!1,enable:B.enable.bind(this),disable:B.disable.bind(this),handle:B.handle.bind(this),lastScrollTime:l.now()}})},on:{init:function(){this.params.mousewheel.enabled&&this.mousewheel.enable()},destroy:function(){this.mousewheel.enabled&&this.mousewheel.disable()}}},{name:"navigation",params:{navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock"}},create:function(){l.extend(this,{navigation:{init:V.init.bind(this),update:V.update.bind(this),destroy:V.destroy.bind(this)}})},on:{init:function(){this.navigation.init(),this.navigation.update()},toEdge:function(){this.navigation.update()},fromEdge:function(){this.navigation.update()},destroy:function(){this.navigation.destroy()},click:function(e){var i=this.navigation,s=i.$nextEl,a=i.$prevEl;!this.params.navigation.hideOnClick||t(e.target).is(a)||t(e.target).is(s)||(s&&s.toggleClass(this.params.navigation.hiddenClass),a&&a.toggleClass(this.params.navigation.hiddenClass))}}},{name:"pagination",params:{pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,type:"bullets",dynamicBullets:!1,bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",modifierClass:"swiper-pagination-",currentClass:"swiper-pagination-current",totalClass:"swiper-pagination-total",hiddenClass:"swiper-pagination-hidden",progressbarFillClass:"swiper-pagination-progressbar-fill",clickableClass:"swiper-pagination-clickable",lockClass:"swiper-pagination-lock"}},create:function(){l.extend(this,{pagination:{init:R.init.bind(this),render:R.render.bind(this),update:R.update.bind(this),destroy:R.destroy.bind(this)}})},on:{init:function(){this.pagination.init(),this.pagination.render(),this.pagination.update()},activeIndexChange:function(){this.params.loop?this.pagination.update():void 0===this.snapIndex&&this.pagination.update()},snapIndexChange:function(){this.params.loop||this.pagination.update()},slidesLengthChange:function(){this.params.loop&&(this.pagination.render(),this.pagination.update())},snapGridLengthChange:function(){this.params.loop||(this.pagination.render(),this.pagination.update())},destroy:function(){this.pagination.destroy()},click:function(e){this.params.pagination.el&&this.params.pagination.hideOnClick&&this.pagination.$el.length>0&&!t(e.target).hasClass(this.params.pagination.bulletClass)&&this.pagination.$el.toggleClass(this.params.pagination.hiddenClass)}}},{name:"scrollbar",params:{scrollbar:{el:null,dragSize:"auto",hide:!1,draggable:!1,snapOnRelease:!0,lockClass:"swiper-scrollbar-lock"}},create:function(){l.extend(this,{scrollbar:{init:F.init.bind(this),destroy:F.destroy.bind(this),updateSize:F.updateSize.bind(this),setTranslate:F.setTranslate.bind(this),setTransition:F.setTransition.bind(this),enableDraggable:F.enableDraggable.bind(this),disableDraggable:F.disableDraggable.bind(this),setDragPosition:F.setDragPosition.bind(this),onDragStart:F.onDragStart.bind(this),onDragMove:F.onDragMove.bind(this),onDragEnd:F.onDragEnd.bind(this),isTouched:!1,timeout:null,dragTimeout:null}})},on:{init:function(){this.scrollbar.init(),this.scrollbar.updateSize(),this.scrollbar.setTranslate()},update:function(){this.scrollbar.updateSize()},resize:function(){this.scrollbar.updateSize()},observerUpdate:function(){this.scrollbar.updateSize()},setTranslate:function(){this.scrollbar.setTranslate()},setTransition:function(e){this.scrollbar.setTransition(e)},destroy:function(){this.scrollbar.destroy()}}},{name:"parallax",params:{parallax:{enabled:!1}},create:function(){l.extend(this,{parallax:{setTransform:W.setTransform.bind(this),setTranslate:W.setTranslate.bind(this),setTransition:W.setTransition.bind(this)}})},on:{beforeInit:function(){this.params.watchSlidesProgress=!0},init:function(){this.params.parallax&&this.parallax.setTranslate()},setTranslate:function(){this.params.parallax&&this.parallax.setTranslate()},setTransition:function(e){this.params.parallax&&this.parallax.setTransition(e)}}},{name:"zoom",params:{zoom:{enabled:!1,maxRatio:3,minRatio:1,toggle:!0,containerClass:"swiper-zoom-container",zoomedSlideClass:"swiper-slide-zoomed"}},create:function(){var e=this,t={enabled:!1,scale:1,currentScale:1,isScaling:!1,gesture:{$slideEl:void 0,slideWidth:void 0,slideHeight:void 0,$imageEl:void 0,$imageWrapEl:void 0,maxRatio:3},image:{isTouched:void 0,isMoved:void 0,currentX:void 0,currentY:void 0,minX:void 0,minY:void 0,maxX:void 0,maxY:void 0,width:void 0,height:void 0,startX:void 0,startY:void 0,touchesStart:{},touchesCurrent:{}},velocity:{x:void 0,y:void 0,prevPositionX:void 0,prevPositionY:void 0,prevTime:void 0}};"onGestureStart onGestureChange onGestureEnd onTouchStart onTouchMove onTouchEnd onTransitionEnd toggle enable disable in out".split(" ").forEach(function(i){t[i]=j[i].bind(e)}),l.extend(e,{zoom:t})},on:{init:function(){this.params.zoom.enabled&&this.zoom.enable()},destroy:function(){this.zoom.disable()},touchStart:function(e){this.zoom.enabled&&this.zoom.onTouchStart(e)},touchEnd:function(e){this.zoom.enabled&&this.zoom.onTouchEnd(e)},doubleTap:function(e){this.params.zoom.enabled&&this.zoom.enabled&&this.params.zoom.toggle&&this.zoom.toggle(e)},transitionEnd:function(){this.zoom.enabled&&this.params.zoom.enabled&&this.zoom.onTransitionEnd()}}},{name:"lazy",params:{lazy:{enabled:!1,loadPrevNext:!1,loadPrevNextAmount:1,loadOnTransitionStart:!1,elementClass:"swiper-lazy",loadingClass:"swiper-lazy-loading",loadedClass:"swiper-lazy-loaded",preloaderClass:"swiper-lazy-preloader"}},create:function(){l.extend(this,{lazy:{initialImageLoaded:!1,load:q.load.bind(this),loadInSlide:q.loadInSlide.bind(this)}})},on:{beforeInit:function(){this.params.lazy.enabled&&this.params.preloadImages&&(this.params.preloadImages=!1)},init:function(){this.params.lazy.enabled&&!this.params.loop&&0===this.params.initialSlide&&this.lazy.load()},scroll:function(){this.params.freeMode&&!this.params.freeModeSticky&&this.lazy.load()},resize:function(){this.params.lazy.enabled&&this.lazy.load()},scrollbarDragMove:function(){this.params.lazy.enabled&&this.lazy.load()},transitionStart:function(){this.params.lazy.enabled&&(this.params.lazy.loadOnTransitionStart||!this.params.lazy.loadOnTransitionStart&&!this.lazy.initialImageLoaded)&&this.lazy.load()},transitionEnd:function(){this.params.lazy.enabled&&!this.params.lazy.loadOnTransitionStart&&this.lazy.load()}}},{name:"controller",params:{controller:{control:void 0,inverse:!1,by:"slide"}},create:function(){l.extend(this,{controller:{control:this.params.controller.control,getInterpolateFunction:K.getInterpolateFunction.bind(this),setTranslate:K.setTranslate.bind(this),setTransition:K.setTransition.bind(this)}})},on:{update:function(){this.controller.control&&this.controller.spline&&(this.controller.spline=void 0,delete this.controller.spline)},resize:function(){this.controller.control&&this.controller.spline&&(this.controller.spline=void 0,delete this.controller.spline)},observerUpdate:function(){this.controller.control&&this.controller.spline&&(this.controller.spline=void 0,delete this.controller.spline)},setTranslate:function(e,t){this.controller.control&&this.controller.setTranslate(e,t)},setTransition:function(e,t){this.controller.control&&this.controller.setTransition(e,t)}}},{name:"a11y",params:{a11y:{enabled:!1,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}"}},create:function(){var e=this;l.extend(e,{a11y:{liveRegion:t('<span class="'+e.params.a11y.notificationClass+'" aria-live="assertive" aria-atomic="true"></span>')}}),Object.keys(U).forEach(function(t){e.a11y[t]=U[t].bind(e)})},on:{init:function(){this.params.a11y.enabled&&(this.a11y.init(),this.a11y.updateNavigation())},toEdge:function(){this.params.a11y.enabled&&this.a11y.updateNavigation()},fromEdge:function(){this.params.a11y.enabled&&this.a11y.updateNavigation()},paginationUpdate:function(){this.params.a11y.enabled&&this.a11y.updatePagination()},destroy:function(){this.params.a11y.enabled&&this.a11y.destroy()}}},{name:"history",params:{history:{enabled:!1,replaceState:!1,key:"slides"}},create:function(){l.extend(this,{history:{init:_.init.bind(this),setHistory:_.setHistory.bind(this),setHistoryPopState:_.setHistoryPopState.bind(this),scrollToSlide:_.scrollToSlide.bind(this),destroy:_.destroy.bind(this)}})},on:{init:function(){this.params.history.enabled&&this.history.init()},destroy:function(){this.params.history.enabled&&this.history.destroy()},transitionEnd:function(){this.history.initialized&&this.history.setHistory(this.params.history.key,this.activeIndex)}}},{name:"hash-navigation",params:{hashNavigation:{enabled:!1,replaceState:!1,watchState:!1}},create:function(){l.extend(this,{hashNavigation:{initialized:!1,init:Z.init.bind(this),destroy:Z.destroy.bind(this),setHash:Z.setHash.bind(this),onHashCange:Z.onHashCange.bind(this)}})},on:{init:function(){this.params.hashNavigation.enabled&&this.hashNavigation.init()},destroy:function(){this.params.hashNavigation.enabled&&this.hashNavigation.destroy()},transitionEnd:function(){this.hashNavigation.initialized&&this.hashNavigation.setHash()}}},{name:"autoplay",params:{autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!0,stopOnLastSlide:!1,reverseDirection:!1}},create:function(){l.extend(this,{autoplay:{running:!1,paused:!1,run:Q.run.bind(this),start:Q.start.bind(this),stop:Q.stop.bind(this),pause:Q.pause.bind(this)}})},on:{init:function(){this.params.autoplay.enabled&&this.autoplay.start()},beforeTransitionStart:function(e,t){this.autoplay.running&&(t||!this.params.autoplay.disableOnInteraction?this.autoplay.pause(e):this.autoplay.stop())},sliderFirstMove:function(){this.autoplay.running&&(this.params.autoplay.disableOnInteraction?this.autoplay.stop():this.autoplay.pause())},destroy:function(){this.autoplay.running&&this.autoplay.stop()}}},{name:"effect-fade",params:{fadeEffect:{crossFade:!1}},create:function(){l.extend(this,{fadeEffect:{setTranslate:J.setTranslate.bind(this),setTransition:J.setTransition.bind(this)}})},on:{beforeInit:function(){if("fade"===this.params.effect){this.classNames.push(this.params.containerModifierClass+"fade");var e={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};l.extend(this.params,e),l.extend(this.originalParams,e)}},setTranslate:function(){"fade"===this.params.effect&&this.fadeEffect.setTranslate()},setTransition:function(e){"fade"===this.params.effect&&this.fadeEffect.setTransition(e)}}},{name:"effect-cube",params:{cubeEffect:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94}},create:function(){l.extend(this,{cubeEffect:{setTranslate:ee.setTranslate.bind(this),setTransition:ee.setTransition.bind(this)}})},on:{beforeInit:function(){if("cube"===this.params.effect){this.classNames.push(this.params.containerModifierClass+"cube"),this.classNames.push(this.params.containerModifierClass+"3d");var e={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,resistanceRatio:0,spaceBetween:0,centeredSlides:!1,virtualTranslate:!0};l.extend(this.params,e),l.extend(this.originalParams,e)}},setTranslate:function(){"cube"===this.params.effect&&this.cubeEffect.setTranslate()},setTransition:function(e){"cube"===this.params.effect&&this.cubeEffect.setTransition(e)}}},{name:"effect-flip",params:{flipEffect:{slideShadows:!0,limitRotation:!0}},create:function(){l.extend(this,{flipEffect:{setTranslate:te.setTranslate.bind(this),setTransition:te.setTransition.bind(this)}})},on:{beforeInit:function(){if("flip"===this.params.effect){this.classNames.push(this.params.containerModifierClass+"flip"),this.classNames.push(this.params.containerModifierClass+"3d");var e={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};l.extend(this.params,e),l.extend(this.originalParams,e)}},setTranslate:function(){"flip"===this.params.effect&&this.flipEffect.setTranslate()},setTransition:function(e){"flip"===this.params.effect&&this.flipEffect.setTransition(e)}}},{name:"effect-coverflow",params:{coverflowEffect:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0}},create:function(){l.extend(this,{coverflowEffect:{setTranslate:ie.setTranslate.bind(this),setTransition:ie.setTransition.bind(this)}})},on:{beforeInit:function(){"coverflow"===this.params.effect&&(this.classNames.push(this.params.containerModifierClass+"coverflow"),this.classNames.push(this.params.containerModifierClass+"3d"),this.params.watchSlidesProgress=!0,this.originalParams.watchSlidesProgress=!0)},setTranslate:function(){"coverflow"===this.params.effect&&this.coverflowEffect.setTranslate()},setTransition:function(e){"coverflow"===this.params.effect&&this.coverflowEffect.setTransition(e)}}}];return void 0===k.use&&(k.use=k.Class.use,k.installModule=k.Class.installModule),k.use(se),k});
//# sourceMappingURL=swiper.min.js.map

// ==================================================
// fancyBox v3.2.10
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
!function(t,e,n,o){"use strict";function i(t){var e=n(t.currentTarget),o=t.data?t.data.options:{},i=e.attr("data-fancybox")||"",a=0,s=[];t.isDefaultPrevented()||(t.preventDefault(),i?(s=o.selector?n(o.selector):t.data?t.data.items:[],s=s.length?s.filter('[data-fancybox="'+i+'"]'):n('[data-fancybox="'+i+'"]'),a=s.index(e),a<0&&(a=0)):s=[e],n.fancybox.open(s,o,a))}if(n){if(n.fn.fancybox)return void("console"in t&&console.log("fancyBox already initialized"));var a={loop:!1,margin:[44,0],gutter:50,keyboard:!0,arrows:!0,infobar:!0,toolbar:!0,buttons:["slideShow","fullScreen","thumbs","share","close"],idleTime:3,smallBtn:"auto",protect:!1,modal:!1,image:{preload:"auto"},ajax:{settings:{data:{fancybox:!0}}},iframe:{tpl:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',preload:!0,css:{},attr:{scrolling:"auto"}},defaultType:"image",animationEffect:"zoom",animationDuration:500,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="fancybox-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-infobar"><span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span></div><div class="fancybox-toolbar">{{buttons}}</div><div class="fancybox-navigation">{{arrows}}</div><div class="fancybox-stage"></div><div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div></div></div>',spinnerTpl:'<div class="fancybox-loading"></div>',errorTpl:'<div class="fancybox-error"><p>{{ERROR}}<p></div>',btnTpl:{download:'<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}"><svg viewBox="0 0 40 40"><path d="M20,23 L20,8 L20,23 L13,16 L20,23 L27,16 L20,23 M26,28 L13,28 L27,28 L14,28" /></svg></a>',zoom:'<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg viewBox="0 0 40 40"><path d="M 18,17 m-8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M25,23 L31,29 L25,23" /></svg></button>',close:'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg viewBox="0 0 40 40"><path d="M10,10 L30,30 M30,10 L10,30" /></svg></button>',smallBtn:'<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>',arrowLeft:'<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><svg viewBox="0 0 40 40"><path d="M10,20 L30,20 L10,20 L18,28 L10,20 L18,12 L10,20"></path></svg></button>',arrowRight:'<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><svg viewBox="0 0 40 40"><path d="M30,20 L10,20 L30,20 L22,28 L30,20 L22,12 L30,20"></path></svg></button>'},parentEl:"body",autoFocus:!1,backFocus:!0,trapFocus:!0,fullScreen:{autoStart:!1},touch:{vertical:!0,momentum:!0},hash:null,media:{},slideShow:{autoStart:!1,speed:4e3},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"},wheel:"auto",onInit:n.noop,beforeLoad:n.noop,afterLoad:n.noop,beforeShow:n.noop,afterShow:n.noop,beforeClose:n.noop,afterClose:n.noop,onActivate:n.noop,onDeactivate:n.noop,clickContent:function(t,e){return"image"===t.type&&"zoom"},clickSlide:"close",clickOutside:"close",dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1,mobile:{idleTime:!1,margin:0,clickContent:function(t,e){return"image"===t.type&&"toggleControls"},clickSlide:function(t,e){return"image"===t.type?"toggleControls":"close"},dblclickContent:function(t,e){return"image"===t.type&&"zoom"},dblclickSlide:function(t,e){return"image"===t.type&&"zoom"}},lang:"en",i18n:{en:{CLOSE:"Close",NEXT:"Next",PREV:"Previous",ERROR:"The requested content cannot be loaded. <br/> Please try again later.",PLAY_START:"Start slideshow",PLAY_STOP:"Pause slideshow",FULL_SCREEN:"Full screen",THUMBS:"Thumbnails",DOWNLOAD:"Download",SHARE:"Share",ZOOM:"Zoom"},de:{CLOSE:"Schliessen",NEXT:"Weiter",PREV:"Zurück",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Maßstab"}}},s=n(t),r=n(e),c=0,l=function(t){return t&&t.hasOwnProperty&&t instanceof n},u=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),d=function(){var t,n=e.createElement("fakeelement"),i={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in i)if(n.style[t]!==o)return i[t];return"transitionend"}(),f=function(t){return t&&t.length&&t[0].offsetHeight},p=function(t,o,i){var a=this;a.opts=n.extend(!0,{index:i},n.fancybox.defaults,o||{}),n.fancybox.isMobile&&(a.opts=n.extend(!0,{},a.opts,a.opts.mobile)),o&&n.isArray(o.buttons)&&(a.opts.buttons=o.buttons),a.id=a.opts.id||++c,a.group=[],a.currIndex=parseInt(a.opts.index,10)||0,a.prevIndex=null,a.prevPos=null,a.currPos=0,a.firstRun=null,a.createGroup(t),a.group.length&&(a.$lastFocus=n(e.activeElement).blur(),a.slides={},a.init())};n.extend(p.prototype,{init:function(){var i,a,s,c=this,l=c.group[c.currIndex],u=l.opts,d=n.fancybox.scrollbarWidth;c.scrollTop=r.scrollTop(),c.scrollLeft=r.scrollLeft(),n.fancybox.getInstance()||(n("body").addClass("fancybox-active"),/iPad|iPhone|iPod/.test(navigator.userAgent)&&!t.MSStream?"image"!==l.type&&n("body").css("top",n("body").scrollTop()*-1).addClass("fancybox-iosfix"):!n.fancybox.isMobile&&e.body.scrollHeight>t.innerHeight&&(d===o&&(i=n('<div style="width:50px;height:50px;overflow:scroll;" />').appendTo("body"),d=n.fancybox.scrollbarWidth=i[0].offsetWidth-i[0].clientWidth,i.remove()),n("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: '+d+"px; }</style>"),n("body").addClass("compensate-for-scrollbar"))),s="",n.each(u.buttons,function(t,e){s+=u.btnTpl[e]||""}),a=n(c.translate(c,u.baseTpl.replace("{{buttons}}",s).replace("{{arrows}}",u.btnTpl.arrowLeft+u.btnTpl.arrowRight))).attr("id","fancybox-container-"+c.id).addClass("fancybox-is-hidden").addClass(u.baseClass).data("FancyBox",c).appendTo(u.parentEl),c.$refs={container:a},["bg","inner","infobar","toolbar","stage","caption","navigation"].forEach(function(t){c.$refs[t]=a.find(".fancybox-"+t)}),c.trigger("onInit"),c.activate(),c.jumpTo(c.currIndex)},translate:function(t,e){var n=t.opts.i18n[t.opts.lang];return e.replace(/\{\{(\w+)\}\}/g,function(t,e){var i=n[e];return i===o?t:i})},createGroup:function(t){var e=this,i=n.makeArray(t);n.each(i,function(t,i){var a,s,r,c,l,u={},d={};n.isPlainObject(i)?(u=i,d=i.opts||i):"object"===n.type(i)&&n(i).length?(a=n(i),d=a.data(),d=n.extend({},d,d.options||{}),d.$orig=a,u.src=d.src||a.attr("href"),u.type||u.src||(u.type="inline",u.src=i)):u={type:"html",src:i+""},u.opts=n.extend(!0,{},e.opts,d),n.isArray(d.buttons)&&(u.opts.buttons=d.buttons),s=u.type||u.opts.type,c=u.src||"",!s&&c&&(c.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)?s="image":c.match(/\.(pdf)((\?|#).*)?$/i)?s="pdf":(r=c.match(/\.(mp4|mov|ogv)((\?|#).*)?$/i))?(s="video",u.opts.videoFormat||(u.opts.videoFormat="video/"+("ogv"===r[1]?"ogg":r[1]))):"#"===c.charAt(0)&&(s="inline")),s?u.type=s:e.trigger("objectNeedsType",u),u.index=e.group.length,u.opts.$orig&&!u.opts.$orig.length&&delete u.opts.$orig,!u.opts.$thumb&&u.opts.$orig&&(u.opts.$thumb=u.opts.$orig.find("img:first")),u.opts.$thumb&&!u.opts.$thumb.length&&delete u.opts.$thumb,"function"===n.type(u.opts.caption)&&(u.opts.caption=u.opts.caption.apply(i,[e,u])),"function"===n.type(e.opts.caption)&&(u.opts.caption=e.opts.caption.apply(i,[e,u])),u.opts.caption instanceof n||(u.opts.caption=u.opts.caption===o?"":u.opts.caption+""),"ajax"===s&&(l=c.split(/\s+/,2),l.length>1&&(u.src=l.shift(),u.opts.filter=l.shift())),"auto"==u.opts.smallBtn&&(n.inArray(s,["html","inline","ajax"])>-1?(u.opts.toolbar=!1,u.opts.smallBtn=!0):u.opts.smallBtn=!1),"pdf"===s&&(u.type="iframe",u.opts.iframe.preload=!1),u.opts.modal&&(u.opts=n.extend(!0,u.opts,{infobar:0,toolbar:0,smallBtn:0,keyboard:0,slideShow:0,fullScreen:0,thumbs:0,touch:0,clickContent:!1,clickSlide:!1,clickOutside:!1,dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1})),e.group.push(u)})},addEvents:function(){var o=this;o.removeEvents(),o.$refs.container.on("click.fb-close","[data-fancybox-close]",function(t){t.stopPropagation(),t.preventDefault(),o.close(t)}).on("click.fb-prev touchend.fb-prev","[data-fancybox-prev]",function(t){t.stopPropagation(),t.preventDefault(),o.previous()}).on("click.fb-next touchend.fb-next","[data-fancybox-next]",function(t){t.stopPropagation(),t.preventDefault(),o.next()}).on("click.fb","[data-fancybox-zoom]",function(t){o[o.isScaledDown()?"scaleToActual":"scaleToFit"]()}),s.on("orientationchange.fb resize.fb",function(t){t&&t.originalEvent&&"resize"===t.originalEvent.type?u(function(){o.update()}):(o.$refs.stage.hide(),setTimeout(function(){o.$refs.stage.show(),o.update()},600))}),r.on("focusin.fb",function(t){var i=n.fancybox?n.fancybox.getInstance():null;i.isClosing||!i.current||!i.current.opts.trapFocus||n(t.target).hasClass("fancybox-container")||n(t.target).is(e)||i&&"fixed"!==n(t.target).css("position")&&!i.$refs.container.has(t.target).length&&(t.stopPropagation(),i.focus(),s.scrollTop(o.scrollTop).scrollLeft(o.scrollLeft))}),r.on("keydown.fb",function(t){var e=o.current,i=t.keyCode||t.which;if(e&&e.opts.keyboard&&!n(t.target).is("input")&&!n(t.target).is("textarea"))return 8===i||27===i?(t.preventDefault(),void o.close(t)):37===i||38===i?(t.preventDefault(),void o.previous()):39===i||40===i?(t.preventDefault(),void o.next()):void o.trigger("afterKeydown",t,i)}),o.group[o.currIndex].opts.idleTime&&(o.idleSecondsCounter=0,r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",function(t){o.idleSecondsCounter=0,o.isIdle&&o.showControls(),o.isIdle=!1}),o.idleInterval=t.setInterval(function(){o.idleSecondsCounter++,o.idleSecondsCounter>=o.group[o.currIndex].opts.idleTime&&!o.isDragging&&(o.isIdle=!0,o.idleSecondsCounter=0,o.hideControls())},1e3))},removeEvents:function(){var e=this;s.off("orientationchange.fb resize.fb"),r.off("focusin.fb keydown.fb .fb-idle"),this.$refs.container.off(".fb-close .fb-prev .fb-next"),e.idleInterval&&(t.clearInterval(e.idleInterval),e.idleInterval=null)},previous:function(t){return this.jumpTo(this.currPos-1,t)},next:function(t){return this.jumpTo(this.currPos+1,t)},jumpTo:function(t,e,i){var a,s,r,c,l,u,d,p=this,h=p.group.length;if(!(p.isDragging||p.isClosing||p.isAnimating&&p.firstRun)){if(t=parseInt(t,10),s=p.current?p.current.opts.loop:p.opts.loop,!s&&(t<0||t>=h))return!1;if(a=p.firstRun=null===p.firstRun,!(h<2&&!a&&p.isDragging)){if(c=p.current,p.prevIndex=p.currIndex,p.prevPos=p.currPos,r=p.createSlide(t),h>1&&((s||r.index>0)&&p.createSlide(t-1),(s||r.index<h-1)&&p.createSlide(t+1)),p.current=r,p.currIndex=r.index,p.currPos=r.pos,p.trigger("beforeShow",a),p.updateControls(),u=n.fancybox.getTranslate(r.$slide),r.isMoved=(0!==u.left||0!==u.top)&&!r.$slide.hasClass("fancybox-animated"),r.forcedDuration=o,n.isNumeric(e)?r.forcedDuration=e:e=r.opts[a?"animationDuration":"transitionDuration"],e=parseInt(e,10),a)return r.opts.animationEffect&&e&&p.$refs.container.css("transition-duration",e+"ms"),p.$refs.container.removeClass("fancybox-is-hidden"),f(p.$refs.container),p.$refs.container.addClass("fancybox-is-open"),r.$slide.addClass("fancybox-slide--current"),p.loadSlide(r),void p.preload("image");n.each(p.slides,function(t,e){n.fancybox.stop(e.$slide)}),r.$slide.removeClass("fancybox-slide--next fancybox-slide--previous").addClass("fancybox-slide--current"),r.isMoved?(l=Math.round(r.$slide.width()),n.each(p.slides,function(t,o){var i=o.pos-r.pos;n.fancybox.animate(o.$slide,{top:0,left:i*l+i*o.opts.gutter},e,function(){o.$slide.removeAttr("style").removeClass("fancybox-slide--next fancybox-slide--previous"),o.pos===p.currPos&&(r.isMoved=!1,p.complete())})})):p.$refs.stage.children().removeAttr("style"),r.isLoaded?p.revealContent(r):p.loadSlide(r),p.preload("image"),c.pos!==r.pos&&(d="fancybox-slide--"+(c.pos>r.pos?"next":"previous"),c.$slide.removeClass("fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous"),c.isComplete=!1,e&&(r.isMoved||r.opts.transitionEffect)&&(r.isMoved?c.$slide.addClass(d):(d="fancybox-animated "+d+" fancybox-fx-"+r.opts.transitionEffect,n.fancybox.animate(c.$slide,d,e,function(){c.$slide.removeClass(d).removeAttr("style")}))))}}},createSlide:function(t){var e,o,i=this;return o=t%i.group.length,o=o<0?i.group.length+o:o,!i.slides[t]&&i.group[o]&&(e=n('<div class="fancybox-slide"></div>').appendTo(i.$refs.stage),i.slides[t]=n.extend(!0,{},i.group[o],{pos:t,$slide:e,isLoaded:!1}),i.updateSlide(i.slides[t])),i.slides[t]},scaleToActual:function(t,e,i){var a,s,r,c,l,u=this,d=u.current,f=d.$content,p=parseInt(d.$slide.width(),10),h=parseInt(d.$slide.height(),10),g=d.width,b=d.height;"image"!=d.type||d.hasError||!f||u.isAnimating||(n.fancybox.stop(f),u.isAnimating=!0,t=t===o?.5*p:t,e=e===o?.5*h:e,a=n.fancybox.getTranslate(f),c=g/a.width,l=b/a.height,s=.5*p-.5*g,r=.5*h-.5*b,g>p&&(s=a.left*c-(t*c-t),s>0&&(s=0),s<p-g&&(s=p-g)),b>h&&(r=a.top*l-(e*l-e),r>0&&(r=0),r<h-b&&(r=h-b)),u.updateCursor(g,b),n.fancybox.animate(f,{top:r,left:s,scaleX:c,scaleY:l},i||330,function(){u.isAnimating=!1}),u.SlideShow&&u.SlideShow.isActive&&u.SlideShow.stop())},scaleToFit:function(t){var e,o=this,i=o.current,a=i.$content;"image"!=i.type||i.hasError||!a||o.isAnimating||(n.fancybox.stop(a),o.isAnimating=!0,e=o.getFitPos(i),o.updateCursor(e.width,e.height),n.fancybox.animate(a,{top:e.top,left:e.left,scaleX:e.width/a.width(),scaleY:e.height/a.height()},t||330,function(){o.isAnimating=!1}))},getFitPos:function(t){var e,o,i,a,s,r=this,c=t.$content,l=t.width,u=t.height,d=t.opts.margin;return!(!c||!c.length||!l&&!u)&&("number"===n.type(d)&&(d=[d,d]),2==d.length&&(d=[d[0],d[1],d[0],d[1]]),e=parseInt(r.$refs.stage.width(),10)-(d[1]+d[3]),o=parseInt(r.$refs.stage.height(),10)-(d[0]+d[2]),i=Math.min(1,e/l,o/u),a=Math.floor(i*l),s=Math.floor(i*u),{top:Math.floor(.5*(o-s))+d[0],left:Math.floor(.5*(e-a))+d[3],width:a,height:s})},update:function(){var t=this;n.each(t.slides,function(e,n){t.updateSlide(n)})},updateSlide:function(t,e){var o=this,i=t&&t.$content;i&&(t.width||t.height)&&(o.isAnimating=!1,n.fancybox.stop(i),n.fancybox.setTranslate(i,o.getFitPos(t)),t.pos===o.currPos&&o.updateCursor()),t.$slide.trigger("refresh"),o.trigger("onUpdate",t)},centerSlide:function(t,e){var i,a,s=this;s.current&&(i=Math.round(t.$slide.width()),a=t.pos-s.current.pos,n.fancybox.animate(t.$slide,{top:0,left:a*i+a*t.opts.gutter,opacity:1},e===o?0:e,null,!1))},updateCursor:function(t,e){var n,i=this,a=i.$refs.container.removeClass("fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut");i.current&&!i.isClosing&&(i.isZoomable()?(a.addClass("fancybox-is-zoomable"),n=t!==o&&e!==o?t<i.current.width&&e<i.current.height:i.isScaledDown(),n?a.addClass("fancybox-can-zoomIn"):i.current.opts.touch?a.addClass("fancybox-can-drag"):a.addClass("fancybox-can-zoomOut")):i.current.opts.touch&&a.addClass("fancybox-can-drag"))},isZoomable:function(){var t,e=this,o=e.current;if(o&&!e.isClosing)return!!("image"===o.type&&o.isLoaded&&!o.hasError&&("zoom"===o.opts.clickContent||n.isFunction(o.opts.clickContent)&&"zoom"===o.opts.clickContent(o))&&(t=e.getFitPos(o),o.width>t.width||o.height>t.height))},isScaledDown:function(){var t=this,e=t.current,o=e.$content,i=!1;return o&&(i=n.fancybox.getTranslate(o),i=i.width<e.width||i.height<e.height),i},canPan:function(){var t=this,e=t.current,n=e.$content,o=!1;return n&&(o=t.getFitPos(e),o=Math.abs(n.width()-o.width)>1||Math.abs(n.height()-o.height)>1),o},loadSlide:function(t){var e,o,i,a=this;if(!t.isLoading&&!t.isLoaded){switch(t.isLoading=!0,a.trigger("beforeLoad",t),e=t.type,o=t.$slide,o.off("refresh").trigger("onReset").addClass("fancybox-slide--"+(e||"unknown")).addClass(t.opts.slideClass),e){case"image":a.setImage(t);break;case"iframe":a.setIframe(t);break;case"html":a.setContent(t,t.src||t.content);break;case"inline":n(t.src).length?a.setContent(t,n(t.src)):a.setError(t);break;case"ajax":a.showLoading(t),i=n.ajax(n.extend({},t.opts.ajax.settings,{url:t.src,success:function(e,n){"success"===n&&a.setContent(t,e)},error:function(e,n){e&&"abort"!==n&&a.setError(t)}})),o.one("onReset",function(){i.abort()});break;case"video":a.setContent(t,'<video controls><source src="'+t.src+'" type="'+t.opts.videoFormat+"\">Your browser doesn't support HTML5 video</video>");break;default:a.setError(t)}return!0}},setImage:function(e){var o,i,a,s,r=this,c=e.opts.srcset||e.opts.image.srcset;if(c){a=t.devicePixelRatio||1,s=t.innerWidth*a,i=c.split(",").map(function(t){var e={};return t.trim().split(/\s+/).forEach(function(t,n){var o=parseInt(t.substring(0,t.length-1),10);return 0===n?e.url=t:void(o&&(e.value=o,e.postfix=t[t.length-1]))}),e}),i.sort(function(t,e){return t.value-e.value});for(var l=0;l<i.length;l++){var u=i[l];if("w"===u.postfix&&u.value>=s||"x"===u.postfix&&u.value>=a){o=u;break}}!o&&i.length&&(o=i[i.length-1]),o&&(e.src=o.url,e.width&&e.height&&"w"==o.postfix&&(e.height=e.width/e.height*o.value,e.width=o.value))}e.$content=n('<div class="fancybox-image-wrap"></div>').addClass("fancybox-is-hidden").appendTo(e.$slide),e.opts.preload!==!1&&e.opts.width&&e.opts.height&&(e.opts.thumb||e.opts.$thumb)?(e.width=e.opts.width,e.height=e.opts.height,e.$ghost=n("<img />").one("error",function(){n(this).remove(),e.$ghost=null,r.setBigImage(e)}).one("load",function(){r.afterLoad(e),r.setBigImage(e)}).addClass("fancybox-image").appendTo(e.$content).attr("src",e.opts.thumb||e.opts.$thumb.attr("src"))):r.setBigImage(e)},setBigImage:function(t){var e=this,o=n("<img />");t.$image=o.one("error",function(){e.setError(t)}).one("load",function(){clearTimeout(t.timouts),t.timouts=null,e.isClosing||(t.width=t.opts.width||this.naturalWidth,t.height=t.opts.height||this.naturalHeight,t.opts.image.srcset&&o.attr("sizes","100vw").attr("srcset",t.opts.image.srcset),e.hideLoading(t),t.$ghost?t.timouts=setTimeout(function(){t.timouts=null,t.$ghost.hide()},Math.min(300,Math.max(1e3,t.height/1600))):e.afterLoad(t))}).addClass("fancybox-image").attr("src",t.src).appendTo(t.$content),(o[0].complete||"complete"==o[0].readyState)&&o[0].naturalWidth&&o[0].naturalHeight?o.trigger("load"):o[0].error?o.trigger("error"):t.timouts=setTimeout(function(){o[0].complete||t.hasError||e.showLoading(t)},100)},setIframe:function(t){var e,i=this,a=t.opts.iframe,s=t.$slide;t.$content=n('<div class="fancybox-content'+(a.preload?" fancybox-is-hidden":"")+'"></div>').css(a.css).appendTo(s),e=n(a.tpl.replace(/\{rnd\}/g,(new Date).getTime())).attr(a.attr).appendTo(t.$content),a.preload?(i.showLoading(t),e.on("load.fb error.fb",function(e){this.isReady=1,t.$slide.trigger("refresh"),i.afterLoad(t)}),s.on("refresh.fb",function(){var n,i,s,r=t.$content,c=a.css.width,l=a.css.height;if(1===e[0].isReady){try{i=e.contents(),s=i.find("body")}catch(t){}s&&s.length&&(c===o&&(n=e[0].contentWindow.document.documentElement.scrollWidth,c=Math.ceil(s.outerWidth(!0)+(r.width()-n)),c+=r.outerWidth()-r.innerWidth()),l===o&&(l=Math.ceil(s.outerHeight(!0)),l+=r.outerHeight()-r.innerHeight()),c&&r.width(c),l&&r.height(l)),r.removeClass("fancybox-is-hidden")}})):this.afterLoad(t),e.attr("src",t.src),t.opts.smallBtn===!0&&t.$content.prepend(i.translate(t,t.opts.btnTpl.smallBtn)),s.one("onReset",function(){try{n(this).find("iframe").hide().attr("src","//about:blank")}catch(t){}n(this).empty(),t.isLoaded=!1})},setContent:function(t,e){var o=this;o.isClosing||(o.hideLoading(t),t.$slide.empty(),l(e)&&e.parent().length?(e.parent(".fancybox-slide--inline").trigger("onReset"),t.$placeholder=n("<div></div>").hide().insertAfter(e),e.css("display","inline-block")):t.hasError||("string"===n.type(e)&&(e=n("<div>").append(n.trim(e)).contents(),3===e[0].nodeType&&(e=n("<div>").html(e))),t.opts.filter&&(e=n("<div>").html(e).find(t.opts.filter))),t.$slide.one("onReset",function(){n(this).find("video,audio").trigger("pause"),t.$placeholder&&(t.$placeholder.after(e.hide()).remove(),t.$placeholder=null),t.$smallBtn&&(t.$smallBtn.remove(),t.$smallBtn=null),t.hasError||(n(this).empty(),t.isLoaded=!1)}),t.$content=n(e).appendTo(t.$slide),this.afterLoad(t))},setError:function(t){t.hasError=!0,t.$slide.removeClass("fancybox-slide--"+t.type),this.setContent(t,this.translate(t,t.opts.errorTpl))},showLoading:function(t){var e=this;t=t||e.current,t&&!t.$spinner&&(t.$spinner=n(e.opts.spinnerTpl).appendTo(t.$slide))},hideLoading:function(t){var e=this;t=t||e.current,t&&t.$spinner&&(t.$spinner.remove(),delete t.$spinner)},afterLoad:function(t){var e=this;e.isClosing||(t.isLoading=!1,t.isLoaded=!0,e.trigger("afterLoad",t),e.hideLoading(t),t.opts.smallBtn&&!t.$smallBtn&&(t.$smallBtn=n(e.translate(t,t.opts.btnTpl.smallBtn)).appendTo(t.$content.filter("div,form").first())),t.opts.protect&&t.$content&&!t.hasError&&(t.$content.on("contextmenu.fb",function(t){return 2==t.button&&t.preventDefault(),!0}),"image"===t.type&&n('<div class="fancybox-spaceball"></div>').appendTo(t.$content)),e.revealContent(t))},revealContent:function(t){var e,i,a,s,r,c=this,l=t.$slide,u=!1;return e=t.opts[c.firstRun?"animationEffect":"transitionEffect"],a=t.opts[c.firstRun?"animationDuration":"transitionDuration"],a=parseInt(t.forcedDuration===o?a:t.forcedDuration,10),!t.isMoved&&t.pos===c.currPos&&a||(e=!1),"zoom"!==e||t.pos===c.currPos&&a&&"image"===t.type&&!t.hasError&&(u=c.getThumbPos(t))||(e="fade"),"zoom"===e?(r=c.getFitPos(t),r.scaleX=r.width/u.width,r.scaleY=r.height/u.height,delete r.width,delete r.height,s=t.opts.zoomOpacity,"auto"==s&&(s=Math.abs(t.width/t.height-u.width/u.height)>.1),s&&(u.opacity=.1,r.opacity=1),n.fancybox.setTranslate(t.$content.removeClass("fancybox-is-hidden"),u),f(t.$content),void n.fancybox.animate(t.$content,r,a,function(){c.complete()})):(c.updateSlide(t),e?(n.fancybox.stop(l),i="fancybox-animated fancybox-slide--"+(t.pos>=c.prevPos?"next":"previous")+" fancybox-fx-"+e,l.removeAttr("style").removeClass("fancybox-slide--current fancybox-slide--next fancybox-slide--previous").addClass(i),t.$content.removeClass("fancybox-is-hidden"),f(l),void n.fancybox.animate(l,"fancybox-slide--current",a,function(e){l.removeClass(i).removeAttr("style"),t.pos===c.currPos&&c.complete()},!0)):(f(l),t.$content.removeClass("fancybox-is-hidden"),void(t.pos===c.currPos&&c.complete())))},getThumbPos:function(o){var i,a=this,s=!1,r=function(e){for(var o,i=e[0],a=i.getBoundingClientRect(),s=[];null!==i.parentElement;)"hidden"!==n(i.parentElement).css("overflow")&&"auto"!==n(i.parentElement).css("overflow")||s.push(i.parentElement.getBoundingClientRect()),i=i.parentElement;return o=s.every(function(t){var e=Math.min(a.right,t.right)-Math.max(a.left,t.left),n=Math.min(a.bottom,t.bottom)-Math.max(a.top,t.top);return e>0&&n>0}),o&&a.bottom>0&&a.right>0&&a.left<n(t).width()&&a.top<n(t).height()},c=o.opts.$thumb,l=c?c.offset():0;return l&&c[0].ownerDocument===e&&r(c)&&(i=a.$refs.stage.offset(),s={top:l.top-i.top+parseFloat(c.css("border-top-width")||0),left:l.left-i.left+parseFloat(c.css("border-left-width")||0),width:c.width(),height:c.height(),scaleX:1,scaleY:1}),s},complete:function(){var t=this,o=t.current,i={};o.isMoved||!o.isLoaded||o.isComplete||(o.isComplete=!0,o.$slide.siblings().trigger("onReset"),t.preload("inline"),f(o.$slide),o.$slide.addClass("fancybox-slide--complete"),n.each(t.slides,function(e,o){o.pos>=t.currPos-1&&o.pos<=t.currPos+1?i[o.pos]=o:o&&(n.fancybox.stop(o.$slide),o.$slide.off().remove())}),t.slides=i,t.updateCursor(),t.trigger("afterShow"),o.$slide.find("video,audio").first().trigger("play"),(n(e.activeElement).is("[disabled]")||o.opts.autoFocus&&"image"!=o.type&&"iframe"!==o.type)&&t.focus())},preload:function(t){var e=this,n=e.slides[e.currPos+1],o=e.slides[e.currPos-1];n&&n.type===t&&e.loadSlide(n),o&&o.type===t&&e.loadSlide(o)},focus:function(){var t,e=this.current;this.isClosing||(e&&e.isComplete&&(t=e.$slide.find("input[autofocus]:enabled:visible:first"),t.length||(t=e.$slide.find("button,:input,[tabindex],a").filter(":enabled:visible:first"))),t=t&&t.length?t:this.$refs.container,t.focus())},activate:function(){var t=this;n(".fancybox-container").each(function(){var e=n(this).data("FancyBox");e&&e.id!==t.id&&!e.isClosing&&(e.trigger("onDeactivate"),e.removeEvents(),e.isVisible=!1)}),t.isVisible=!0,(t.current||t.isIdle)&&(t.update(),t.updateControls()),t.trigger("onActivate"),t.addEvents()},close:function(t,e){var o,i,a,s,r,c,l=this,p=l.current,h=function(){l.cleanUp(t)};return!l.isClosing&&(l.isClosing=!0,l.trigger("beforeClose",t)===!1?(l.isClosing=!1,u(function(){l.update()}),!1):(l.removeEvents(),p.timouts&&clearTimeout(p.timouts),a=p.$content,o=p.opts.animationEffect,i=n.isNumeric(e)?e:o?p.opts.animationDuration:0,p.$slide.off(d).removeClass("fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated"),p.$slide.siblings().trigger("onReset").remove(),i&&l.$refs.container.removeClass("fancybox-is-open").addClass("fancybox-is-closing"),l.hideLoading(p),l.hideControls(),l.updateCursor(),"zoom"!==o||t!==!0&&a&&i&&"image"===p.type&&!p.hasError&&(c=l.getThumbPos(p))||(o="fade"),"zoom"===o?(n.fancybox.stop(a),r=n.fancybox.getTranslate(a),r.width=r.width*r.scaleX,r.height=r.height*r.scaleY,s=p.opts.zoomOpacity,"auto"==s&&(s=Math.abs(p.width/p.height-c.width/c.height)>.1),s&&(c.opacity=0),r.scaleX=r.width/c.width,r.scaleY=r.height/c.height,r.width=c.width,r.height=c.height,n.fancybox.setTranslate(p.$content,r),f(p.$content),n.fancybox.animate(p.$content,c,i,h),!0):(o&&i?t===!0?setTimeout(h,i):n.fancybox.animate(p.$slide.removeClass("fancybox-slide--current"),"fancybox-animated fancybox-slide--previous fancybox-fx-"+o,i,h):h(),!0)))},cleanUp:function(t){var o,i,a=this,r=n("body");a.current.$slide.trigger("onReset"),a.$refs.container.empty().remove(),a.trigger("afterClose",t),a.$lastFocus&&a.current.opts.backFocus&&a.$lastFocus.focus(),a.current=null,o=n.fancybox.getInstance(),o?o.activate():(s.scrollTop(a.scrollTop).scrollLeft(a.scrollLeft),r.removeClass("fancybox-active compensate-for-scrollbar"),r.hasClass("fancybox-iosfix")&&(i=parseInt(e.body.style.top,10),r.removeClass("fancybox-iosfix").css("top","").scrollTop(i*-1)),n("#fancybox-style-noscroll").remove())},trigger:function(t,e){var o,i=Array.prototype.slice.call(arguments,1),a=this,s=e&&e.opts?e:a.current;return s?i.unshift(s):s=a,i.unshift(a),n.isFunction(s.opts[t])&&(o=s.opts[t].apply(s,i)),o===!1?o:void("afterClose"!==t&&a.$refs?a.$refs.container.trigger(t+".fb",i):r.trigger(t+".fb",i))},updateControls:function(t){var e=this,n=e.current,o=n.index,i=n.opts.caption,a=e.$refs.container,s=e.$refs.caption;n.$slide.trigger("refresh"),e.$caption=i&&i.length?s.html(i):null,e.isHiddenControls||e.isIdle||e.showControls(),a.find("[data-fancybox-count]").html(e.group.length),a.find("[data-fancybox-index]").html(o+1),a.find("[data-fancybox-prev]").prop("disabled",!n.opts.loop&&o<=0),a.find("[data-fancybox-next]").prop("disabled",!n.opts.loop&&o>=e.group.length-1),"image"===n.type?a.find("[data-fancybox-download]").attr("href",n.opts.image.src||n.src).show():a.find("[data-fancybox-download],[data-fancybox-zoom]").hide()},hideControls:function(){this.isHiddenControls=!0,this.$refs.container.removeClass("fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav")},showControls:function(){var t=this,e=t.current?t.current.opts:t.opts,n=t.$refs.container;t.isHiddenControls=!1,t.idleSecondsCounter=0,n.toggleClass("fancybox-show-toolbar",!(!e.toolbar||!e.buttons)).toggleClass("fancybox-show-infobar",!!(e.infobar&&t.group.length>1)).toggleClass("fancybox-show-nav",!!(e.arrows&&t.group.length>1)).toggleClass("fancybox-is-modal",!!e.modal),t.$caption?n.addClass("fancybox-show-caption "):n.removeClass("fancybox-show-caption")},toggleControls:function(){this.isHiddenControls?this.showControls():this.hideControls()}}),n.fancybox={version:"3.2.10",defaults:a,getInstance:function(t){var e=n('.fancybox-container:not(".fancybox-is-closing"):last').data("FancyBox"),o=Array.prototype.slice.call(arguments,1);return e instanceof p&&("string"===n.type(t)?e[t].apply(e,o):"function"===n.type(t)&&t.apply(e,o),e)},open:function(t,e,n){return new p(t,e,n)},close:function(t){var e=this.getInstance();e&&(e.close(),t===!0&&this.close())},destroy:function(){this.close(!0),r.off("click.fb-start")},isMobile:e.createTouch!==o&&/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:function(){var n=e.createElement("div");return t.getComputedStyle&&t.getComputedStyle(n).getPropertyValue("transform")&&!(e.documentMode&&e.documentMode<11)}(),getTranslate:function(t){var e;if(!t||!t.length)return!1;if(e=t.eq(0).css("transform"),e&&e.indexOf("matrix")!==-1?(e=e.split("(")[1],e=e.split(")")[0],e=e.split(",")):e=[],e.length)e=e.length>10?[e[13],e[12],e[0],e[5]]:[e[5],e[4],e[0],e[3]],e=e.map(parseFloat);else{e=[0,0,1,1];var n=/\.*translate\((.*)px,(.*)px\)/i,o=n.exec(t.eq(0).attr("style"));o&&(e[0]=parseFloat(o[2]),e[1]=parseFloat(o[1]))}return{top:e[0],left:e[1],scaleX:e[2],scaleY:e[3],opacity:parseFloat(t.css("opacity")),width:t.width(),height:t.height()}},setTranslate:function(t,e){var n="",i={};if(t&&e)return e.left===o&&e.top===o||(n=(e.left===o?t.position().left:e.left)+"px, "+(e.top===o?t.position().top:e.top)+"px",n=this.use3d?"translate3d("+n+", 0px)":"translate("+n+")"),e.scaleX!==o&&e.scaleY!==o&&(n=(n.length?n+" ":"")+"scale("+e.scaleX+", "+e.scaleY+")"),n.length&&(i.transform=n),e.opacity!==o&&(i.opacity=e.opacity),e.width!==o&&(i.width=e.width),e.height!==o&&(i.height=e.height),t.css(i)},animate:function(t,e,i,a,s){n.isFunction(i)&&(a=i,i=null),n.isPlainObject(e)||t.removeAttr("style"),t.on(d,function(i){(!i||!i.originalEvent||t.is(i.originalEvent.target)&&"z-index"!=i.originalEvent.propertyName)&&(n.fancybox.stop(t),n.isPlainObject(e)?(e.scaleX!==o&&e.scaleY!==o&&(t.css("transition-duration",""),e.width=Math.round(t.width()*e.scaleX),e.height=Math.round(t.height()*e.scaleY),e.scaleX=1,e.scaleY=1,n.fancybox.setTranslate(t,e)),s===!1&&t.removeAttr("style")):s!==!0&&t.removeClass(e),n.isFunction(a)&&a(i))}),n.isNumeric(i)&&t.css("transition-duration",i+"ms"),n.isPlainObject(e)?n.fancybox.setTranslate(t,e):t.addClass(e),e.scaleX&&t.hasClass("fancybox-image-wrap")&&t.parent().addClass("fancybox-is-scaling"),t.data("timer",setTimeout(function(){t.trigger("transitionend")},i+16))},stop:function(t){clearTimeout(t.data("timer")),t.off("transitionend").css("transition-duration",""),t.hasClass("fancybox-image-wrap")&&t.parent().removeClass("fancybox-is-scaling")}},n.fn.fancybox=function(t){var e;return t=t||{},e=t.selector||!1,e?n("body").off("click.fb-start",e).on("click.fb-start",e,{options:t},i):this.off("click.fb-start").on("click.fb-start",{items:this,options:t},i),this},r.on("click.fb-start","[data-fancybox]",i)}}(window,document,window.jQuery||jQuery),function(t){"use strict";var e=function(e,n,o){if(e)return o=o||"","object"===t.type(o)&&(o=t.param(o,!0)),t.each(n,function(t,n){e=e.replace("$"+t,n||"")}),o.length&&(e+=(e.indexOf("?")>0?"&":"?")+o),e},n={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"//www.youtube.com/embed/$4",thumb:"//img.youtube.com/vi/$4/hqdefault.jpg"
},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1,api:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},metacafe:{matcher:/metacafe.com\/watch\/(\d+)\/(.*)?/,type:"iframe",url:"//www.metacafe.com/embed/$1/?ap=1"},dailymotion:{matcher:/dailymotion.com\/video\/(.*)\/?(.*)/,params:{additionalInfos:0,autoStart:1},type:"iframe",url:"//www.dailymotion.com/embed/video/$1"},vine:{matcher:/vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,type:"iframe",url:"//vine.co/v/$1/embed/simple"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/?ll="+(t[9]?t[9]+"&z="+Math.floor(t[10])+(t[12]?t[12].replace(/^\//,"&"):""):t[12])+"&output="+(t[12]&&t[12].indexOf("layer=c")>0?"svembed":"embed")}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/maps?q="+t[5].replace("query=","q=").replace("api=1","")+"&output=embed"}}};t(document).on("objectNeedsType.fb",function(o,i,a){var s,r,c,l,u,d,f,p=a.src||"",h=!1;s=t.extend(!0,{},n,a.opts.media),t.each(s,function(n,o){if(c=p.match(o.matcher)){if(h=o.type,d={},o.paramPlace&&c[o.paramPlace]){u=c[o.paramPlace],"?"==u[0]&&(u=u.substring(1)),u=u.split("&");for(var i=0;i<u.length;++i){var s=u[i].split("=",2);2==s.length&&(d[s[0]]=decodeURIComponent(s[1].replace(/\+/g," ")))}}return l=t.extend(!0,{},o.params,a.opts[n],d),p="function"===t.type(o.url)?o.url.call(this,c,l,a):e(o.url,c,l),r="function"===t.type(o.thumb)?o.thumb.call(this,c,l,a):e(o.thumb,c),"vimeo"===n&&(p=p.replace("&%23","#")),!1}}),h?(a.src=p,a.type=h,a.opts.thumb||a.opts.$thumb&&a.opts.$thumb.length||(a.opts.thumb=r),"iframe"===h&&(t.extend(!0,a.opts,{iframe:{preload:!1,attr:{scrolling:"no"}}}),a.contentProvider=f,a.opts.slideClass+=" fancybox-slide--"+("gmap_place"==f||"gmap_search"==f?"map":"video"))):p&&(a.type=a.opts.defaultType)})}(window.jQuery||jQuery),function(t,e,n){"use strict";var o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),i=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),a=function(e){var n=[];e=e.originalEvent||e||t.e,e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var o in e)e[o].pageX?n.push({x:e[o].pageX,y:e[o].pageY}):e[o].clientX&&n.push({x:e[o].clientX,y:e[o].clientY});return n},s=function(t,e,n){return e&&t?"x"===n?t.x-e.x:"y"===n?t.y-e.y:Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)):0},r=function(t){if(t.is('a,area,button,[role="button"],input,label,select,summary,textarea')||n.isFunction(t.get(0).onclick)||t.data("selectable"))return!0;for(var e=0,o=t[0].attributes,i=o.length;e<i;e++)if("data-fancybox-"===o[e].nodeName.substr(0,14))return!0;return!1},c=function(e){var n=t.getComputedStyle(e)["overflow-y"],o=t.getComputedStyle(e)["overflow-x"],i=("scroll"===n||"auto"===n)&&e.scrollHeight>e.clientHeight,a=("scroll"===o||"auto"===o)&&e.scrollWidth>e.clientWidth;return i||a},l=function(t){for(var e=!1;;){if(e=c(t.get(0)))break;if(t=t.parent(),!t.length||t.hasClass("fancybox-stage")||t.is("body"))break}return e},u=function(t){var e=this;e.instance=t,e.$bg=t.$refs.bg,e.$stage=t.$refs.stage,e.$container=t.$refs.container,e.destroy(),e.$container.on("touchstart.fb.touch mousedown.fb.touch",n.proxy(e,"ontouchstart"))};u.prototype.destroy=function(){this.$container.off(".fb.touch")},u.prototype.ontouchstart=function(o){var i=this,c=n(o.target),u=i.instance,d=u.current,f=d.$content,p="touchstart"==o.type;if(p&&i.$container.off("mousedown.fb.touch"),(!o.originalEvent||2!=o.originalEvent.button)&&c.length&&!r(c)&&!r(c.parent())&&(c.is("img")||!(o.originalEvent.clientX>c[0].clientWidth+c.offset().left))){if(!d||i.instance.isAnimating||i.instance.isClosing)return o.stopPropagation(),void o.preventDefault();if(i.realPoints=i.startPoints=a(o),i.startPoints){if(o.stopPropagation(),i.startEvent=o,i.canTap=!0,i.$target=c,i.$content=f,i.opts=d.opts.touch,i.isPanning=!1,i.isSwiping=!1,i.isZooming=!1,i.isScrolling=!1,i.sliderStartPos=i.sliderLastPos||{top:0,left:0},i.contentStartPos=n.fancybox.getTranslate(i.$content),i.contentLastPos=null,i.startTime=(new Date).getTime(),i.distanceX=i.distanceY=i.distance=0,i.canvasWidth=Math.round(d.$slide[0].clientWidth),i.canvasHeight=Math.round(d.$slide[0].clientHeight),n(e).off(".fb.touch").on(p?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",n.proxy(i,"ontouchend")).on(p?"touchmove.fb.touch":"mousemove.fb.touch",n.proxy(i,"ontouchmove")),n.fancybox.isMobile&&e.addEventListener("scroll",i.onscroll,!0),!i.opts&&!u.canPan()||!c.is(i.$stage)&&!i.$stage.find(c).length)return void(c.is("img")&&o.preventDefault());n.fancybox.isMobile&&(l(c)||l(c.parent()))||o.preventDefault(),1===i.startPoints.length&&("image"===d.type&&(i.contentStartPos.width>i.canvasWidth+1||i.contentStartPos.height>i.canvasHeight+1)?(n.fancybox.stop(i.$content),i.$content.css("transition-duration",""),i.isPanning=!0):i.isSwiping=!0,i.$container.addClass("fancybox-controls--isGrabbing")),2!==i.startPoints.length||u.isAnimating||d.hasError||"image"!==d.type||!d.isLoaded&&!d.$ghost||(i.canTap=!1,i.isSwiping=!1,i.isPanning=!1,i.isZooming=!0,n.fancybox.stop(i.$content),i.$content.css("transition-duration",""),i.centerPointStartX=.5*(i.startPoints[0].x+i.startPoints[1].x)-n(t).scrollLeft(),i.centerPointStartY=.5*(i.startPoints[0].y+i.startPoints[1].y)-n(t).scrollTop(),i.percentageOfImageAtPinchPointX=(i.centerPointStartX-i.contentStartPos.left)/i.contentStartPos.width,i.percentageOfImageAtPinchPointY=(i.centerPointStartY-i.contentStartPos.top)/i.contentStartPos.height,i.startDistanceBetweenFingers=s(i.startPoints[0],i.startPoints[1]))}}},u.prototype.onscroll=function(t){self.isScrolling=!0},u.prototype.ontouchmove=function(t){var e=this,o=n(t.target);return e.isScrolling||!o.is(e.$stage)&&!e.$stage.find(o).length?void(e.canTap=!1):(e.newPoints=a(t),void((e.opts||e.instance.canPan())&&e.newPoints&&e.newPoints.length&&(e.isSwiping&&e.isSwiping===!0||t.preventDefault(),e.distanceX=s(e.newPoints[0],e.startPoints[0],"x"),e.distanceY=s(e.newPoints[0],e.startPoints[0],"y"),e.distance=s(e.newPoints[0],e.startPoints[0]),e.distance>0&&(e.isSwiping?e.onSwipe(t):e.isPanning?e.onPan():e.isZooming&&e.onZoom()))))},u.prototype.onSwipe=function(e){var a,s=this,r=s.isSwiping,c=s.sliderStartPos.left||0;if(r!==!0)"x"==r&&(s.distanceX>0&&(s.instance.group.length<2||0===s.instance.current.index&&!s.instance.current.opts.loop)?c+=Math.pow(s.distanceX,.8):s.distanceX<0&&(s.instance.group.length<2||s.instance.current.index===s.instance.group.length-1&&!s.instance.current.opts.loop)?c-=Math.pow(-s.distanceX,.8):c+=s.distanceX),s.sliderLastPos={top:"x"==r?0:s.sliderStartPos.top+s.distanceY,left:c},s.requestId&&(i(s.requestId),s.requestId=null),s.requestId=o(function(){s.sliderLastPos&&(n.each(s.instance.slides,function(t,e){var o=e.pos-s.instance.currPos;n.fancybox.setTranslate(e.$slide,{top:s.sliderLastPos.top,left:s.sliderLastPos.left+o*s.canvasWidth+o*e.opts.gutter})}),s.$container.addClass("fancybox-is-sliding"))});else if(Math.abs(s.distance)>10){if(s.canTap=!1,s.instance.group.length<2&&s.opts.vertical?s.isSwiping="y":s.instance.isDragging||s.opts.vertical===!1||"auto"===s.opts.vertical&&n(t).width()>800?s.isSwiping="x":(a=Math.abs(180*Math.atan2(s.distanceY,s.distanceX)/Math.PI),s.isSwiping=a>45&&a<135?"y":"x"),s.canTap=!1,"y"===s.isSwiping&&n.fancybox.isMobile&&(l(s.$target)||l(s.$target.parent())))return void(s.isScrolling=!0);s.instance.isDragging=s.isSwiping,s.startPoints=s.newPoints,n.each(s.instance.slides,function(t,e){n.fancybox.stop(e.$slide),e.$slide.css("transition-duration",""),e.inTransition=!1,e.pos===s.instance.current.pos&&(s.sliderStartPos.left=n.fancybox.getTranslate(e.$slide).left)}),s.instance.SlideShow&&s.instance.SlideShow.isActive&&s.instance.SlideShow.stop()}},u.prototype.onPan=function(){var t=this;return s(t.newPoints[0],t.realPoints[0])<(n.fancybox.isMobile?10:5)?void(t.startPoints=t.newPoints):(t.canTap=!1,t.contentLastPos=t.limitMovement(),t.requestId&&(i(t.requestId),t.requestId=null),void(t.requestId=o(function(){n.fancybox.setTranslate(t.$content,t.contentLastPos)})))},u.prototype.limitMovement=function(){var t,e,n,o,i,a,s=this,r=s.canvasWidth,c=s.canvasHeight,l=s.distanceX,u=s.distanceY,d=s.contentStartPos,f=d.left,p=d.top,h=d.width,g=d.height;return i=h>r?f+l:f,a=p+u,t=Math.max(0,.5*r-.5*h),e=Math.max(0,.5*c-.5*g),n=Math.min(r-h,.5*r-.5*h),o=Math.min(c-g,.5*c-.5*g),h>r&&(l>0&&i>t&&(i=t-1+Math.pow(-t+f+l,.8)||0),l<0&&i<n&&(i=n+1-Math.pow(n-f-l,.8)||0)),g>c&&(u>0&&a>e&&(a=e-1+Math.pow(-e+p+u,.8)||0),u<0&&a<o&&(a=o+1-Math.pow(o-p-u,.8)||0)),{top:a,left:i,scaleX:d.scaleX,scaleY:d.scaleY}},u.prototype.limitPosition=function(t,e,n,o){var i=this,a=i.canvasWidth,s=i.canvasHeight;return n>a?(t=t>0?0:t,t=t<a-n?a-n:t):t=Math.max(0,a/2-n/2),o>s?(e=e>0?0:e,e=e<s-o?s-o:e):e=Math.max(0,s/2-o/2),{top:e,left:t}},u.prototype.onZoom=function(){var e=this,a=e.contentStartPos.width,r=e.contentStartPos.height,c=e.contentStartPos.left,l=e.contentStartPos.top,u=s(e.newPoints[0],e.newPoints[1]),d=u/e.startDistanceBetweenFingers,f=Math.floor(a*d),p=Math.floor(r*d),h=(a-f)*e.percentageOfImageAtPinchPointX,g=(r-p)*e.percentageOfImageAtPinchPointY,b=(e.newPoints[0].x+e.newPoints[1].x)/2-n(t).scrollLeft(),m=(e.newPoints[0].y+e.newPoints[1].y)/2-n(t).scrollTop(),y=b-e.centerPointStartX,v=m-e.centerPointStartY,x=c+(h+y),w=l+(g+v),$={top:w,left:x,scaleX:e.contentStartPos.scaleX*d,scaleY:e.contentStartPos.scaleY*d};e.canTap=!1,e.newWidth=f,e.newHeight=p,e.contentLastPos=$,e.requestId&&(i(e.requestId),e.requestId=null),e.requestId=o(function(){n.fancybox.setTranslate(e.$content,e.contentLastPos)})},u.prototype.ontouchend=function(t){var o=this,s=Math.max((new Date).getTime()-o.startTime,1),r=o.isSwiping,c=o.isPanning,l=o.isZooming,u=o.isScrolling;return o.endPoints=a(t),o.$container.removeClass("fancybox-controls--isGrabbing"),n(e).off(".fb.touch"),e.removeEventListener("scroll",o.onscroll,!0),o.requestId&&(i(o.requestId),o.requestId=null),o.isSwiping=!1,o.isPanning=!1,o.isZooming=!1,o.isScrolling=!1,o.instance.isDragging=!1,o.canTap?o.onTap(t):(o.speed=366,o.velocityX=o.distanceX/s*.5,o.velocityY=o.distanceY/s*.5,o.speedX=Math.max(.5*o.speed,Math.min(1.5*o.speed,1/Math.abs(o.velocityX)*o.speed)),void(c?o.endPanning():l?o.endZooming():o.endSwiping(r,u)))},u.prototype.endSwiping=function(t,e){var o=this,i=!1,a=o.instance.group.length;o.sliderLastPos=null,"y"==t&&!e&&Math.abs(o.distanceY)>50?(n.fancybox.animate(o.instance.current.$slide,{top:o.sliderStartPos.top+o.distanceY+150*o.velocityY,opacity:0},150),i=o.instance.close(!0,300)):"x"==t&&o.distanceX>50&&a>1?i=o.instance.previous(o.speedX):"x"==t&&o.distanceX<-50&&a>1&&(i=o.instance.next(o.speedX)),i!==!1||"x"!=t&&"y"!=t||(e||a<2?o.instance.centerSlide(o.instance.current,150):o.instance.jumpTo(o.instance.current.index)),o.$container.removeClass("fancybox-is-sliding")},u.prototype.endPanning=function(){var t,e,o,i=this;i.contentLastPos&&(i.opts.momentum===!1?(t=i.contentLastPos.left,e=i.contentLastPos.top):(t=i.contentLastPos.left+i.velocityX*i.speed,e=i.contentLastPos.top+i.velocityY*i.speed),o=i.limitPosition(t,e,i.contentStartPos.width,i.contentStartPos.height),o.width=i.contentStartPos.width,o.height=i.contentStartPos.height,n.fancybox.animate(i.$content,o,330))},u.prototype.endZooming=function(){var t,e,o,i,a=this,s=a.instance.current,r=a.newWidth,c=a.newHeight;a.contentLastPos&&(t=a.contentLastPos.left,e=a.contentLastPos.top,i={top:e,left:t,width:r,height:c,scaleX:1,scaleY:1},n.fancybox.setTranslate(a.$content,i),r<a.canvasWidth&&c<a.canvasHeight?a.instance.scaleToFit(150):r>s.width||c>s.height?a.instance.scaleToActual(a.centerPointStartX,a.centerPointStartY,150):(o=a.limitPosition(t,e,r,c),n.fancybox.setTranslate(a.content,n.fancybox.getTranslate(a.$content)),n.fancybox.animate(a.$content,o,150)))},u.prototype.onTap=function(t){var e,o=this,i=n(t.target),s=o.instance,r=s.current,c=t&&a(t)||o.startPoints,l=c[0]?c[0].x-o.$stage.offset().left:0,u=c[0]?c[0].y-o.$stage.offset().top:0,d=function(e){var i=r.opts[e];if(n.isFunction(i)&&(i=i.apply(s,[r,t])),i)switch(i){case"close":s.close(o.startEvent);break;case"toggleControls":s.toggleControls(!0);break;case"next":s.next();break;case"nextOrClose":s.group.length>1?s.next():s.close(o.startEvent);break;case"zoom":"image"==r.type&&(r.isLoaded||r.$ghost)&&(s.canPan()?s.scaleToFit():s.isScaledDown()?s.scaleToActual(l,u):s.group.length<2&&s.close(o.startEvent))}};if((!t.originalEvent||2!=t.originalEvent.button)&&(i.is("img")||!(l>i[0].clientWidth+i.offset().left))){if(i.is(".fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container"))e="Outside";else if(i.is(".fancybox-slide"))e="Slide";else{if(!s.current.$content||!s.current.$content.find(i).addBack().filter(i).length)return;e="Content"}if(o.tapped){if(clearTimeout(o.tapped),o.tapped=null,Math.abs(l-o.tapX)>50||Math.abs(u-o.tapY)>50)return this;d("dblclick"+e)}else o.tapX=l,o.tapY=u,r.opts["dblclick"+e]&&r.opts["dblclick"+e]!==r.opts["click"+e]?o.tapped=setTimeout(function(){o.tapped=null,d("click"+e)},500):d("click"+e);return this}},n(e).on("onActivate.fb",function(t,e){e&&!e.Guestures&&(e.Guestures=new u(e))})}(window,document,window.jQuery||jQuery),function(t,e){"use strict";e.extend(!0,e.fancybox.defaults,{btnTpl:{slideShow:'<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"><svg viewBox="0 0 40 40"><path d="M13,12 L27,20 L13,27 Z" /><path d="M15,10 v19 M23,10 v19" /></svg></button>'},slideShow:{autoStart:!1,speed:3e3}});var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{timer:null,isActive:!1,$button:null,init:function(){var t=this;t.$button=t.instance.$refs.toolbar.find("[data-fancybox-play]").on("click",function(){t.toggle()}),(t.instance.group.length<2||!t.instance.group[t.instance.currIndex].opts.slideShow)&&t.$button.hide()},set:function(t){var e=this;e.instance&&e.instance.current&&(t===!0||e.instance.current.opts.loop||e.instance.currIndex<e.instance.group.length-1)?e.timer=setTimeout(function(){e.isActive&&e.instance.jumpTo((e.instance.currIndex+1)%e.instance.group.length)},e.instance.current.opts.slideShow.speed):(e.stop(),e.instance.idleSecondsCounter=0,e.instance.showControls())},clear:function(){var t=this;clearTimeout(t.timer),t.timer=null},start:function(){var t=this,e=t.instance.current;e&&(t.isActive=!0,t.$button.attr("title",e.opts.i18n[e.opts.lang].PLAY_STOP).removeClass("fancybox-button--play").addClass("fancybox-button--pause"),t.set(!0))},stop:function(){var t=this,e=t.instance.current;t.clear(),t.$button.attr("title",e.opts.i18n[e.opts.lang].PLAY_START).removeClass("fancybox-button--pause").addClass("fancybox-button--play"),t.isActive=!1},toggle:function(){var t=this;t.isActive?t.stop():t.start()}}),e(t).on({"onInit.fb":function(t,e){e&&!e.SlideShow&&(e.SlideShow=new n(e))},"beforeShow.fb":function(t,e,n,o){var i=e&&e.SlideShow;o?i&&n.opts.slideShow.autoStart&&i.start():i&&i.isActive&&i.clear()},"afterShow.fb":function(t,e,n){var o=e&&e.SlideShow;o&&o.isActive&&o.set()},"afterKeydown.fb":function(n,o,i,a,s){var r=o&&o.SlideShow;!r||!i.opts.slideShow||80!==s&&32!==s||e(t.activeElement).is("button,a,input")||(a.preventDefault(),r.toggle())},"beforeClose.fb onDeactivate.fb":function(t,e){var n=e&&e.SlideShow;n&&n.stop()}}),e(t).on("visibilitychange",function(){var n=e.fancybox.getInstance(),o=n&&n.SlideShow;o&&o.isActive&&(t.hidden?o.clear():o.set())})}(document,window.jQuery||jQuery),function(t,e){"use strict";var n=function(){var e,n,o,i=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],a={};for(n=0;n<i.length;n++)if(e=i[n],e&&e[1]in t){for(o=0;o<e.length;o++)a[i[0][o]]=e[o];return a}return!1}();if(!n)return void(e&&e.fancybox&&(e.fancybox.defaults.btnTpl.fullScreen=!1));var o={request:function(e){e=e||t.documentElement,e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)},exit:function(){t[n.exitFullscreen]()},toggle:function(e){e=e||t.documentElement,this.isFullscreen()?this.exit():this.request(e)},isFullscreen:function(){return Boolean(t[n.fullscreenElement])},enabled:function(){return Boolean(t[n.fullscreenEnabled])}};e.extend(!0,e.fancybox.defaults,{btnTpl:{fullScreen:'<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"><svg viewBox="0 0 40 40"><path d="M9,12 h22 v16 h-22 v-16 v16 h22 v-16 Z" /></svg></button>'},fullScreen:{autoStart:!1}}),e(t).on({"onInit.fb":function(t,e){var n;e&&e.group[e.currIndex].opts.fullScreen?(n=e.$refs.container,n.on("click.fb-fullscreen","[data-fancybox-fullscreen]",function(t){t.stopPropagation(),t.preventDefault(),o.toggle(n[0])}),e.opts.fullScreen&&e.opts.fullScreen.autoStart===!0&&o.request(n[0]),e.FullScreen=o):e&&e.$refs.toolbar.find("[data-fancybox-fullscreen]").hide()},"afterKeydown.fb":function(t,e,n,o,i){e&&e.FullScreen&&70===i&&(o.preventDefault(),e.FullScreen.toggle(e.$refs.container[0]))},"beforeClose.fb":function(t){t&&t.FullScreen&&o.exit()}}),e(t).on(n.fullscreenchange,function(){var t=o.isFullscreen(),n=e.fancybox.getInstance();n&&(n.current&&"image"===n.current.type&&n.isAnimating&&(n.current.$content.css("transition","none"),n.isAnimating=!1,n.update(!0,!0,0)),n.trigger("onFullscreenChange",t),n.$refs.container.toggleClass("fancybox-is-fullscreen",t))})}(document,window.jQuery||jQuery),function(t,e){"use strict";e.fancybox.defaults=e.extend(!0,{btnTpl:{thumbs:'<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"><svg viewBox="0 0 120 120"><path d="M30,30 h14 v14 h-14 Z M50,30 h14 v14 h-14 Z M70,30 h14 v14 h-14 Z M30,50 h14 v14 h-14 Z M50,50 h14 v14 h-14 Z M70,50 h14 v14 h-14 Z M30,70 h14 v14 h-14 Z M50,70 h14 v14 h-14 Z M70,70 h14 v14 h-14 Z" /></svg></button>'},thumbs:{autoStart:!1,hideOnClose:!0,parentEl:".fancybox-container",axis:"y"}},e.fancybox.defaults);var n=function(t){this.init(t)};e.extend(n.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,isActive:!1,init:function(t){var e=this;e.instance=t,t.Thumbs=e;var n=t.group[0],o=t.group[1];e.opts=t.group[t.currIndex].opts.thumbs,e.$button=t.$refs.toolbar.find("[data-fancybox-thumbs]"),e.opts&&n&&o&&("image"==n.type||n.opts.thumb||n.opts.$thumb)&&("image"==o.type||o.opts.thumb||o.opts.$thumb)?(e.$button.show().on("click",function(){e.toggle()}),e.isActive=!0):e.$button.hide()},create:function(){var t,n,o=this,i=o.instance,a=o.opts.parentEl;o.$grid=e('<div class="fancybox-thumbs fancybox-thumbs-'+o.opts.axis+'"></div>').appendTo(i.$refs.container.find(a).addBack().filter(a)),t="<ul>",e.each(i.group,function(e,o){n=o.opts.thumb||(o.opts.$thumb?o.opts.$thumb.attr("src"):null),n||"image"!==o.type||(n=o.src),n&&n.length&&(t+='<li data-index="'+e+'"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="'+n+'" /></li>')}),t+="</ul>",o.$list=e(t).appendTo(o.$grid).on("click","li",function(){i.jumpTo(e(this).data("index"))}),o.$list.find("img").hide().one("load",function(){var t,n,o,i,a=e(this).parent().removeClass("fancybox-thumbs-loading"),s=a.outerWidth(),r=a.outerHeight();t=this.naturalWidth||this.width,n=this.naturalHeight||this.height,o=t/s,i=n/r,o>=1&&i>=1&&(o>i?(t/=i,n=r):(t=s,n/=o)),e(this).css({width:Math.floor(t),height:Math.floor(n),"margin-top":n>r?Math.floor(.3*r-.3*n):Math.floor(.5*r-.5*n),"margin-left":Math.floor(.5*s-.5*t)}).show()}).each(function(){this.src=e(this).data("src")}),"x"===o.opts.axis&&o.$list.width(parseInt(o.$grid.css("padding-right"))+i.group.length*o.$list.children().eq(0).outerWidth(!0)+"px")},focus:function(t){var e,n,o=this,i=o.$list;o.instance.current&&(e=i.children().removeClass("fancybox-thumbs-active").filter('[data-index="'+o.instance.current.index+'"]').addClass("fancybox-thumbs-active"),n=e.position(),"y"===o.opts.axis&&(n.top<0||n.top>i.height()-e.outerHeight())?i.stop().animate({scrollTop:i.scrollTop()+n.top},t):"x"===o.opts.axis&&(n.left<i.parent().scrollLeft()||n.left>i.parent().scrollLeft()+(i.parent().width()-e.outerWidth()))&&i.parent().stop().animate({scrollLeft:n.left},t))},update:function(){this.instance.$refs.container.toggleClass("fancybox-show-thumbs",this.isVisible),this.isVisible?(this.$grid||this.create(),this.instance.trigger("onThumbsShow"),this.focus(0)):this.$grid&&this.instance.trigger("onThumbsHide"),this.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible=!this.isVisible,this.update()}}),e(t).on({"onInit.fb":function(t,e){var o;e&&!e.Thumbs&&(o=new n(e),o.isActive&&o.opts.autoStart===!0&&o.show())},"beforeShow.fb":function(t,e,n,o){var i=e&&e.Thumbs;i&&i.isVisible&&i.focus(o?0:250)},"afterKeydown.fb":function(t,e,n,o,i){var a=e&&e.Thumbs;a&&a.isActive&&71===i&&(o.preventDefault(),a.toggle())},"beforeClose.fb":function(t,e){var n=e&&e.Thumbs;n&&n.isVisible&&n.opts.hideOnClose!==!1&&n.$grid.hide()}})}(document,window.jQuery),function(t,e){"use strict";function n(t){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return String(t).replace(/[&<>"'`=\/]/g,function(t){return e[t]})}e.extend(!0,e.fancybox.defaults,{btnTpl:{share:'<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}"><svg viewBox="0 0 40 40"><path d="M6,30 C8,18 19,16 23,16 L23,16 L23,10 L33,20 L23,29 L23,24 C19,24 8,27 6,30 Z"></svg></button>'},share:{tpl:'<div class="fancybox-share"><h1>{{SHARE}}</h1><p class="fancybox-share__links"><a class="fancybox-share__button fancybox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="fancybox-share__button fancybox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a><a class="fancybox-share__button fancybox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a></p><p><input class="fancybox-share__input" type="text" value="{{url_raw}}" /></p></div>'}}),e(t).on("click","[data-fancybox-share]",function(){var t,o,i=e.fancybox.getInstance();i&&(t=i.current.opts.hash===!1?i.current.src:window.location,o=i.current.opts.share.tpl.replace(/\{\{media\}\}/g,"image"===i.current.type?encodeURIComponent(i.current.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g,n(t)).replace(/\{\{descr\}\}/g,i.$caption?encodeURIComponent(i.$caption.text()):""),e.fancybox.open({src:i.translate(i,o),type:"html",opts:{animationEffect:"fade",animationDuration:250,afterLoad:function(t,e){e.$content.find(".fancybox-share__links a").click(function(){return window.open(this.href,"Share","width=550, height=450"),!1})}}}))})}(document,window.jQuery||jQuery),function(t,e,n){"use strict";function o(){var t=e.location.hash.substr(1),n=t.split("-"),o=n.length>1&&/^\+?\d+$/.test(n[n.length-1])?parseInt(n.pop(-1),10)||1:1,i=n.join("-");return o<1&&(o=1),{hash:t,index:o,gallery:i}}function i(t){var e;""!==t.gallery&&(e=n("[data-fancybox='"+n.escapeSelector(t.gallery)+"']").eq(t.index-1),e.length||(e=n("#"+n.escapeSelector(t.gallery))),e.length&&(s=!1,e.trigger("click")))}function a(t){var e;return!!t&&(e=t.current?t.current.opts:t.opts,e.hash||(e.$orig?e.$orig.data("fancybox"):""))}n.escapeSelector||(n.escapeSelector=function(t){var e=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,n=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t};return(t+"").replace(e,n)});var s=!0,r=null,c=null;n(function(){n.fancybox.defaults.hash!==!1&&(n(t).on({"onInit.fb":function(t,e){var n,i;e.group[e.currIndex].opts.hash!==!1&&(n=o(),i=a(e),i&&n.gallery&&i==n.gallery&&(e.currIndex=n.index-1))},"beforeShow.fb":function(n,o,i){var l;i&&i.opts.hash!==!1&&(l=a(o),l&&""!==l&&(e.location.hash.indexOf(l)<0&&(o.opts.origHash=e.location.hash),r=l+(o.group.length>1?"-"+(i.index+1):""),"replaceState"in e.history?(c&&clearTimeout(c),c=setTimeout(function(){e.history[s?"pushState":"replaceState"]({},t.title,e.location.pathname+e.location.search+"#"+r),c=null,s=!1},300)):e.location.hash=r))},"beforeClose.fb":function(o,i,s){var l,u;c&&clearTimeout(c),s.opts.hash!==!1&&(l=a(i),u=i&&i.opts.origHash?i.opts.origHash:"",l&&""!==l&&("replaceState"in history?e.history.replaceState({},t.title,e.location.pathname+e.location.search+u):(e.location.hash=u,n(e).scrollTop(i.scrollTop).scrollLeft(i.scrollLeft))),r=null)}}),n(e).on("hashchange.fb",function(){var t=o();n.fancybox.getInstance()?!r||r===t.gallery+"-"+t.index||1===t.index&&r==t.gallery||(r=null,n.fancybox.close()):""!==t.gallery&&i(t)}),setTimeout(function(){i(o())},50))})}(document,window,window.jQuery||jQuery),function(t,e){"use strict";var n=(new Date).getTime();e(t).on({"onInit.fb":function(t,e,o){e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(t){var o=e.current,i=(new Date).getTime();e.group.length<1||o.opts.wheel===!1||"auto"===o.opts.wheel&&"image"!==o.type||(t.preventDefault(),t.stopPropagation(),o.$slide.hasClass("fancybox-animated")||(t=t.originalEvent||t,i-n<250||(n=i,e[(-t.deltaY||-t.deltaX||t.wheelDelta||-t.detail)<0?"next":"previous"]())))})}})}(document,window.jQuery||jQuery);




/*! iScroll v5.2.0 ~ (c) 2008-2016 Matteo Spinelli ~ http://cubiq.org/license */
!function(t,i,e){function s(e,s){this.wrapper="string"==typeof e?i.querySelector(e):e,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this.options={resizeScrollbars:!0,mouseWheelSpeed:20,snapThreshold:.334,disablePointer:!h.hasPointer,disableTouch:h.hasPointer||!h.hasTouch,disableMouse:h.hasPointer||h.hasTouch,startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT|LABEL)$/},HWCompositing:!0,useTransition:!0,useTransform:!0,bindToWrapper:"undefined"==typeof t.onmousedown};for(var o in s)this.options[o]=s[o];this.translateZ=this.options.HWCompositing&&h.hasPerspective?" translateZ(0)":"",this.options.useTransition=h.hasTransition&&this.options.useTransition,this.options.useTransform=h.hasTransform&&this.options.useTransform,this.options.eventPassthrough=this.options.eventPassthrough===!0?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault,this.options.scrollY="vertical"!=this.options.eventPassthrough&&this.options.scrollY,this.options.scrollX="horizontal"!=this.options.eventPassthrough&&this.options.scrollX,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,this.options.bounceEasing="string"==typeof this.options.bounceEasing?h.ease[this.options.bounceEasing]||h.ease.circular:this.options.bounceEasing,this.options.resizePolling=void 0===this.options.resizePolling?60:this.options.resizePolling,this.options.tap===!0&&(this.options.tap="tap"),this.options.useTransition||this.options.useTransform||/relative|absolute/i.test(this.scrollerStyle.position)||(this.scrollerStyle.position="relative"),"scale"==this.options.shrinkScrollbars&&(this.options.useTransition=!1),this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1,this.x=0,this.y=0,this.directionX=0,this.directionY=0,this._events={},this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY),this.enable()}function o(t,e,s){var o=i.createElement("div"),n=i.createElement("div");return s===!0&&(o.style.cssText="position:absolute;z-index:9999",n.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),n.className="iScrollIndicator","h"==t?(s===!0&&(o.style.cssText+=";height:7px;left:2px;right:2px;bottom:0",n.style.height="100%"),o.className="iScrollHorizontalScrollbar"):(s===!0&&(o.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px",n.style.width="100%"),o.className="iScrollVerticalScrollbar"),o.style.cssText+=";overflow:hidden",e||(o.style.pointerEvents="none"),o.appendChild(n),o}function n(e,s){this.wrapper="string"==typeof s.el?i.querySelector(s.el):s.el,this.wrapperStyle=this.wrapper.style,this.indicator=this.wrapper.children[0],this.indicatorStyle=this.indicator.style,this.scroller=e,this.options={listenX:!0,listenY:!0,interactive:!1,resize:!0,defaultScrollbars:!1,shrink:!1,fade:!1,speedRatioX:0,speedRatioY:0};for(var o in s)this.options[o]=s[o];if(this.sizeRatioX=1,this.sizeRatioY=1,this.maxPosX=0,this.maxPosY=0,this.options.interactive&&(this.options.disableTouch||(h.addEvent(this.indicator,"touchstart",this),h.addEvent(t,"touchend",this)),this.options.disablePointer||(h.addEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.addEvent(t,h.prefixPointerEvent("pointerup"),this)),this.options.disableMouse||(h.addEvent(this.indicator,"mousedown",this),h.addEvent(t,"mouseup",this))),this.options.fade){this.wrapperStyle[h.style.transform]=this.scroller.translateZ;var n=h.style.transitionDuration;if(!n)return;this.wrapperStyle[n]=h.isBadAndroid?"0.0001ms":"0ms";var a=this;h.isBadAndroid&&r(function(){"0.0001ms"===a.wrapperStyle[n]&&(a.wrapperStyle[n]="0s")}),this.wrapperStyle.opacity="0"}}var r=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(i){t.setTimeout(i,1e3/60)},h=function(){function s(t){return r!==!1&&(""===r?t:r+t.charAt(0).toUpperCase()+t.substr(1))}var o={},n=i.createElement("div").style,r=function(){for(var t,i=["t","webkitT","MozT","msT","OT"],e=0,s=i.length;e<s;e++)if(t=i[e]+"ransform",t in n)return i[e].substr(0,i[e].length-1);return!1}();o.getTime=Date.now||function(){return(new Date).getTime()},o.extend=function(t,i){for(var e in i)t[e]=i[e]},o.addEvent=function(t,i,e,s){t.addEventListener(i,e,!!s)},o.removeEvent=function(t,i,e,s){t.removeEventListener(i,e,!!s)},o.prefixPointerEvent=function(i){return t.MSPointerEvent?"MSPointer"+i.charAt(7).toUpperCase()+i.substr(8):i},o.momentum=function(t,i,s,o,n,r){var h,a,l=t-i,c=e.abs(l)/s;return r=void 0===r?6e-4:r,h=t+c*c/(2*r)*(l<0?-1:1),a=c/r,h<o?(h=n?o-n/2.5*(c/8):o,l=e.abs(h-t),a=l/c):h>0&&(h=n?n/2.5*(c/8):0,l=e.abs(t)+h,a=l/c),{destination:e.round(h),duration:a}};var h=s("transform");return o.extend(o,{hasTransform:h!==!1,hasPerspective:s("perspective")in n,hasTouch:"ontouchstart"in t,hasPointer:!(!t.PointerEvent&&!t.MSPointerEvent),hasTransition:s("transition")in n}),o.isBadAndroid=function(){var i=t.navigator.appVersion;if(/Android/.test(i)&&!/Chrome\/\d/.test(i)){var e=i.match(/Safari\/(\d+.\d)/);return!(e&&"object"==typeof e&&e.length>=2)||parseFloat(e[1])<535.19}return!1}(),o.extend(o.style={},{transform:h,transitionTimingFunction:s("transitionTimingFunction"),transitionDuration:s("transitionDuration"),transitionDelay:s("transitionDelay"),transformOrigin:s("transformOrigin")}),o.hasClass=function(t,i){var e=new RegExp("(^|\\s)"+i+"(\\s|$)");return e.test(t.className)},o.addClass=function(t,i){if(!o.hasClass(t,i)){var e=t.className.split(" ");e.push(i),t.className=e.join(" ")}},o.removeClass=function(t,i){if(o.hasClass(t,i)){var e=new RegExp("(^|\\s)"+i+"(\\s|$)","g");t.className=t.className.replace(e," ")}},o.offset=function(t){for(var i=-t.offsetLeft,e=-t.offsetTop;t=t.offsetParent;)i-=t.offsetLeft,e-=t.offsetTop;return{left:i,top:e}},o.preventDefaultException=function(t,i){for(var e in i)if(i[e].test(t[e]))return!0;return!1},o.extend(o.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3}),o.extend(o.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(t){return t*(2-t)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(t){return e.sqrt(1- --t*t)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(t){var i=4;return(t-=1)*t*((i+1)*t+i)+1}},bounce:{style:"",fn:function(t){return(t/=1)<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}},elastic:{style:"",fn:function(t){var i=.22,s=.4;return 0===t?0:1==t?1:s*e.pow(2,-10*t)*e.sin((t-i/4)*(2*e.PI)/i)+1}}}),o.tap=function(t,e){var s=i.createEvent("Event");s.initEvent(e,!0,!0),s.pageX=t.pageX,s.pageY=t.pageY,t.target.dispatchEvent(s)},o.click=function(e){var s,o=e.target;/(SELECT|INPUT|TEXTAREA)/i.test(o.tagName)||(s=i.createEvent(t.MouseEvent?"MouseEvents":"Event"),s.initEvent("click",!0,!0),s.view=e.view||t,s.detail=1,s.screenX=o.screenX||0,s.screenY=o.screenY||0,s.clientX=o.clientX||0,s.clientY=o.clientY||0,s.ctrlKey=!!e.ctrlKey,s.altKey=!!e.altKey,s.shiftKey=!!e.shiftKey,s.metaKey=!!e.metaKey,s.button=0,s.relatedTarget=null,s._constructed=!0,o.dispatchEvent(s))},o}();s.prototype={version:"5.2.0",_init:function(){this._initEvents(),(this.options.scrollbars||this.options.indicators)&&this._initIndicators(),this.options.mouseWheel&&this._initWheel(),this.options.snap&&this._initSnap(),this.options.keyBindings&&this._initKeys()},destroy:function(){this._initEvents(!0),clearTimeout(this.resizeTimeout),this.resizeTimeout=null,this._execEvent("destroy")},_transitionEnd:function(t){t.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,this._execEvent("scrollEnd")))},_start:function(t){if(1!=h.eventType[t.type]){var i;if(i=t.which?t.button:t.button<2?0:4==t.button?1:2,0!==i)return}if(this.enabled&&(!this.initiated||h.eventType[t.type]===this.initiated)){!this.options.preventDefault||h.isBadAndroid||h.preventDefaultException(t.target,this.options.preventDefaultException)||t.preventDefault();var s,o=t.touches?t.touches[0]:t;this.initiated=h.eventType[t.type],this.moved=!1,this.distX=0,this.distY=0,this.directionX=0,this.directionY=0,this.directionLocked=0,this.startTime=h.getTime(),this.options.useTransition&&this.isInTransition?(this._transitionTime(),this.isInTransition=!1,s=this.getComputedPosition(),this._translate(e.round(s.x),e.round(s.y)),this._execEvent("scrollEnd")):!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd")),this.startX=this.x,this.startY=this.y,this.absStartX=this.x,this.absStartY=this.y,this.pointX=o.pageX,this.pointY=o.pageY,this._execEvent("beforeScrollStart")}},_move:function(t){if(this.enabled&&h.eventType[t.type]===this.initiated){this.options.preventDefault&&t.preventDefault();var i,s,o,n,r=t.touches?t.touches[0]:t,a=r.pageX-this.pointX,l=r.pageY-this.pointY,c=h.getTime();if(this.pointX=r.pageX,this.pointY=r.pageY,this.distX+=a,this.distY+=l,o=e.abs(this.distX),n=e.abs(this.distY),!(c-this.endTime>300&&o<10&&n<10)){if(this.directionLocked||this.options.freeScroll||(o>n+this.options.directionLockThreshold?this.directionLocked="h":n>=o+this.options.directionLockThreshold?this.directionLocked="v":this.directionLocked="n"),"h"==this.directionLocked){if("vertical"==this.options.eventPassthrough)t.preventDefault();else if("horizontal"==this.options.eventPassthrough)return void(this.initiated=!1);l=0}else if("v"==this.directionLocked){if("horizontal"==this.options.eventPassthrough)t.preventDefault();else if("vertical"==this.options.eventPassthrough)return void(this.initiated=!1);a=0}a=this.hasHorizontalScroll?a:0,l=this.hasVerticalScroll?l:0,i=this.x+a,s=this.y+l,(i>0||i<this.maxScrollX)&&(i=this.options.bounce?this.x+a/3:i>0?0:this.maxScrollX),(s>0||s<this.maxScrollY)&&(s=this.options.bounce?this.y+l/3:s>0?0:this.maxScrollY),this.directionX=a>0?-1:a<0?1:0,this.directionY=l>0?-1:l<0?1:0,this.moved||this._execEvent("scrollStart"),this.moved=!0,this._translate(i,s),c-this.startTime>300&&(this.startTime=c,this.startX=this.x,this.startY=this.y)}}},_end:function(t){if(this.enabled&&h.eventType[t.type]===this.initiated){this.options.preventDefault&&!h.preventDefaultException(t.target,this.options.preventDefaultException)&&t.preventDefault();var i,s,o=(t.changedTouches?t.changedTouches[0]:t,h.getTime()-this.startTime),n=e.round(this.x),r=e.round(this.y),a=e.abs(n-this.startX),l=e.abs(r-this.startY),c=0,p="";if(this.isInTransition=0,this.initiated=0,this.endTime=h.getTime(),!this.resetPosition(this.options.bounceTime)){if(this.scrollTo(n,r),!this.moved)return this.options.tap&&h.tap(t,this.options.tap),this.options.click&&h.click(t),void this._execEvent("scrollCancel");if(this._events.flick&&o<200&&a<100&&l<100)return void this._execEvent("flick");if(this.options.momentum&&o<300&&(i=this.hasHorizontalScroll?h.momentum(this.x,this.startX,o,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:n,duration:0},s=this.hasVerticalScroll?h.momentum(this.y,this.startY,o,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:r,duration:0},n=i.destination,r=s.destination,c=e.max(i.duration,s.duration),this.isInTransition=1),this.options.snap){var d=this._nearestSnap(n,r);this.currentPage=d,c=this.options.snapSpeed||e.max(e.max(e.min(e.abs(n-d.x),1e3),e.min(e.abs(r-d.y),1e3)),300),n=d.x,r=d.y,this.directionX=0,this.directionY=0,p=this.options.bounceEasing}return n!=this.x||r!=this.y?((n>0||n<this.maxScrollX||r>0||r<this.maxScrollY)&&(p=h.ease.quadratic),void this.scrollTo(n,r,c,p)):void this._execEvent("scrollEnd")}}},_resize:function(){var t=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){t.refresh()},this.options.resizePolling)},resetPosition:function(t){var i=this.x,e=this.y;return t=t||0,!this.hasHorizontalScroll||this.x>0?i=0:this.x<this.maxScrollX&&(i=this.maxScrollX),!this.hasVerticalScroll||this.y>0?e=0:this.y<this.maxScrollY&&(e=this.maxScrollY),(i!=this.x||e!=this.y)&&(this.scrollTo(i,e,t,this.options.bounceEasing),!0)},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){this.wrapper.offsetHeight;this.wrapperWidth=this.wrapper.clientWidth,this.wrapperHeight=this.wrapper.clientHeight,this.scrollerWidth=this.scroller.offsetWidth,this.scrollerHeight=this.scroller.offsetHeight,this.maxScrollX=this.wrapperWidth-this.scrollerWidth,this.maxScrollY=this.wrapperHeight-this.scrollerHeight,this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),this.endTime=0,this.directionX=0,this.directionY=0,this.wrapperOffset=h.offset(this.wrapper),this._execEvent("refresh"),this.resetPosition()},on:function(t,i){this._events[t]||(this._events[t]=[]),this._events[t].push(i)},off:function(t,i){if(this._events[t]){var e=this._events[t].indexOf(i);e>-1&&this._events[t].splice(e,1)}},_execEvent:function(t){if(this._events[t]){var i=0,e=this._events[t].length;if(e)for(;i<e;i++)this._events[t][i].apply(this,[].slice.call(arguments,1))}},scrollBy:function(t,i,e,s){t=this.x+t,i=this.y+i,e=e||0,this.scrollTo(t,i,e,s)},scrollTo:function(t,i,e,s){s=s||h.ease.circular,this.isInTransition=this.options.useTransition&&e>0;var o=this.options.useTransition&&s.style;!e||o?(o&&(this._transitionTimingFunction(s.style),this._transitionTime(e)),this._translate(t,i)):this._animate(t,i,e,s.fn)},scrollToElement:function(t,i,s,o,n){if(t=t.nodeType?t:this.scroller.querySelector(t)){var r=h.offset(t);r.left-=this.wrapperOffset.left,r.top-=this.wrapperOffset.top,s===!0&&(s=e.round(t.offsetWidth/2-this.wrapper.offsetWidth/2)),o===!0&&(o=e.round(t.offsetHeight/2-this.wrapper.offsetHeight/2)),r.left-=s||0,r.top-=o||0,r.left=r.left>0?0:r.left<this.maxScrollX?this.maxScrollX:r.left,r.top=r.top>0?0:r.top<this.maxScrollY?this.maxScrollY:r.top,i=void 0===i||null===i||"auto"===i?e.max(e.abs(this.x-r.left),e.abs(this.y-r.top)):i,this.scrollTo(r.left,r.top,i,n)}},_transitionTime:function(t){if(this.options.useTransition){t=t||0;var i=h.style.transitionDuration;if(i){if(this.scrollerStyle[i]=t+"ms",!t&&h.isBadAndroid){this.scrollerStyle[i]="0.0001ms";var e=this;r(function(){"0.0001ms"===e.scrollerStyle[i]&&(e.scrollerStyle[i]="0s")})}if(this.indicators)for(var s=this.indicators.length;s--;)this.indicators[s].transitionTime(t)}}},_transitionTimingFunction:function(t){if(this.scrollerStyle[h.style.transitionTimingFunction]=t,this.indicators)for(var i=this.indicators.length;i--;)this.indicators[i].transitionTimingFunction(t)},_translate:function(t,i){if(this.options.useTransform?this.scrollerStyle[h.style.transform]="translate("+t+"px,"+i+"px)"+this.translateZ:(t=e.round(t),i=e.round(i),this.scrollerStyle.left=t+"px",this.scrollerStyle.top=i+"px"),this.x=t,this.y=i,this.indicators)for(var s=this.indicators.length;s--;)this.indicators[s].updatePosition()},_initEvents:function(i){var e=i?h.removeEvent:h.addEvent,s=this.options.bindToWrapper?this.wrapper:t;e(t,"orientationchange",this),e(t,"resize",this),this.options.click&&e(this.wrapper,"click",this,!0),this.options.disableMouse||(e(this.wrapper,"mousedown",this),e(s,"mousemove",this),e(s,"mousecancel",this),e(s,"mouseup",this)),h.hasPointer&&!this.options.disablePointer&&(e(this.wrapper,h.prefixPointerEvent("pointerdown"),this),e(s,h.prefixPointerEvent("pointermove"),this),e(s,h.prefixPointerEvent("pointercancel"),this),e(s,h.prefixPointerEvent("pointerup"),this)),h.hasTouch&&!this.options.disableTouch&&(e(this.wrapper,"touchstart",this),e(s,"touchmove",this),e(s,"touchcancel",this),e(s,"touchend",this)),e(this.scroller,"transitionend",this),e(this.scroller,"webkitTransitionEnd",this),e(this.scroller,"oTransitionEnd",this),e(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var i,e,s=t.getComputedStyle(this.scroller,null);return this.options.useTransform?(s=s[h.style.transform].split(")")[0].split(", "),i=+(s[12]||s[4]),e=+(s[13]||s[5])):(i=+s.left.replace(/[^-\d.]/g,""),e=+s.top.replace(/[^-\d.]/g,"")),{x:i,y:e}},_initIndicators:function(){function t(t){if(h.indicators)for(var i=h.indicators.length;i--;)t.call(h.indicators[i])}var i,e=this.options.interactiveScrollbars,s="string"!=typeof this.options.scrollbars,r=[],h=this;this.indicators=[],this.options.scrollbars&&(this.options.scrollY&&(i={el:o("v",e,this.options.scrollbars),interactive:e,defaultScrollbars:!0,customStyle:s,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenX:!1},this.wrapper.appendChild(i.el),r.push(i)),this.options.scrollX&&(i={el:o("h",e,this.options.scrollbars),interactive:e,defaultScrollbars:!0,customStyle:s,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenY:!1},this.wrapper.appendChild(i.el),r.push(i))),this.options.indicators&&(r=r.concat(this.options.indicators));for(var a=r.length;a--;)this.indicators.push(new n(this,r[a]));this.options.fadeScrollbars&&(this.on("scrollEnd",function(){t(function(){this.fade()})}),this.on("scrollCancel",function(){t(function(){this.fade()})}),this.on("scrollStart",function(){t(function(){this.fade(1)})}),this.on("beforeScrollStart",function(){t(function(){this.fade(1,!0)})})),this.on("refresh",function(){t(function(){this.refresh()})}),this.on("destroy",function(){t(function(){this.destroy()}),delete this.indicators})},_initWheel:function(){h.addEvent(this.wrapper,"wheel",this),h.addEvent(this.wrapper,"mousewheel",this),h.addEvent(this.wrapper,"DOMMouseScroll",this),this.on("destroy",function(){clearTimeout(this.wheelTimeout),this.wheelTimeout=null,h.removeEvent(this.wrapper,"wheel",this),h.removeEvent(this.wrapper,"mousewheel",this),h.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(t){if(this.enabled){var i,s,o,n,r=this;if(void 0===this.wheelTimeout&&r._execEvent("scrollStart"),clearTimeout(this.wheelTimeout),this.wheelTimeout=setTimeout(function(){r.options.snap||r._execEvent("scrollEnd"),r.wheelTimeout=void 0},400),"deltaX"in t)1===t.deltaMode?(i=-t.deltaX*this.options.mouseWheelSpeed,s=-t.deltaY*this.options.mouseWheelSpeed):(i=-t.deltaX,s=-t.deltaY);else if("wheelDeltaX"in t)i=t.wheelDeltaX/120*this.options.mouseWheelSpeed,s=t.wheelDeltaY/120*this.options.mouseWheelSpeed;else if("wheelDelta"in t)i=s=t.wheelDelta/120*this.options.mouseWheelSpeed;else{if(!("detail"in t))return;i=s=-t.detail/3*this.options.mouseWheelSpeed}if(i*=this.options.invertWheelDirection,s*=this.options.invertWheelDirection,this.hasVerticalScroll||(i=s,s=0),this.options.snap)return o=this.currentPage.pageX,n=this.currentPage.pageY,i>0?o--:i<0&&o++,s>0?n--:s<0&&n++,void this.goToPage(o,n);o=this.x+e.round(this.hasHorizontalScroll?i:0),n=this.y+e.round(this.hasVerticalScroll?s:0),this.directionX=i>0?-1:i<0?1:0,this.directionY=s>0?-1:s<0?1:0,o>0?o=0:o<this.maxScrollX&&(o=this.maxScrollX),n>0?n=0:n<this.maxScrollY&&(n=this.maxScrollY),this.scrollTo(o,n,0)}},_initSnap:function(){this.currentPage={},"string"==typeof this.options.snap&&(this.options.snap=this.scroller.querySelectorAll(this.options.snap)),this.on("refresh",function(){var t,i,s,o,n,r,h=0,a=0,l=0,c=this.options.snapStepX||this.wrapperWidth,p=this.options.snapStepY||this.wrapperHeight;if(this.pages=[],this.wrapperWidth&&this.wrapperHeight&&this.scrollerWidth&&this.scrollerHeight){if(this.options.snap===!0)for(s=e.round(c/2),o=e.round(p/2);l>-this.scrollerWidth;){for(this.pages[h]=[],t=0,n=0;n>-this.scrollerHeight;)this.pages[h][t]={x:e.max(l,this.maxScrollX),y:e.max(n,this.maxScrollY),width:c,height:p,cx:l-s,cy:n-o},n-=p,t++;l-=c,h++}else for(r=this.options.snap,t=r.length,i=-1;h<t;h++)(0===h||r[h].offsetLeft<=r[h-1].offsetLeft)&&(a=0,i++),this.pages[a]||(this.pages[a]=[]),l=e.max(-r[h].offsetLeft,this.maxScrollX),n=e.max(-r[h].offsetTop,this.maxScrollY),s=l-e.round(r[h].offsetWidth/2),o=n-e.round(r[h].offsetHeight/2),this.pages[a][i]={x:l,y:n,width:r[h].offsetWidth,height:r[h].offsetHeight,cx:s,cy:o},l>this.maxScrollX&&a++;this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0),this.options.snapThreshold%1===0?(this.snapThresholdX=this.options.snapThreshold,this.snapThresholdY=this.options.snapThreshold):(this.snapThresholdX=e.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold),this.snapThresholdY=e.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold))}}),this.on("flick",function(){var t=this.options.snapSpeed||e.max(e.max(e.min(e.abs(this.x-this.startX),1e3),e.min(e.abs(this.y-this.startY),1e3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,t)})},_nearestSnap:function(t,i){if(!this.pages.length)return{x:0,y:0,pageX:0,pageY:0};var s=0,o=this.pages.length,n=0;if(e.abs(t-this.absStartX)<this.snapThresholdX&&e.abs(i-this.absStartY)<this.snapThresholdY)return this.currentPage;for(t>0?t=0:t<this.maxScrollX&&(t=this.maxScrollX),i>0?i=0:i<this.maxScrollY&&(i=this.maxScrollY);s<o;s++)if(t>=this.pages[s][0].cx){t=this.pages[s][0].x;break}for(o=this.pages[s].length;n<o;n++)if(i>=this.pages[0][n].cy){i=this.pages[0][n].y;break}return s==this.currentPage.pageX&&(s+=this.directionX,s<0?s=0:s>=this.pages.length&&(s=this.pages.length-1),t=this.pages[s][0].x),n==this.currentPage.pageY&&(n+=this.directionY,n<0?n=0:n>=this.pages[0].length&&(n=this.pages[0].length-1),i=this.pages[0][n].y),{x:t,y:i,pageX:s,pageY:n}},goToPage:function(t,i,s,o){o=o||this.options.bounceEasing,t>=this.pages.length?t=this.pages.length-1:t<0&&(t=0),i>=this.pages[t].length?i=this.pages[t].length-1:i<0&&(i=0);var n=this.pages[t][i].x,r=this.pages[t][i].y;s=void 0===s?this.options.snapSpeed||e.max(e.max(e.min(e.abs(n-this.x),1e3),e.min(e.abs(r-this.y),1e3)),300):s,this.currentPage={x:n,y:r,pageX:t,pageY:i},this.scrollTo(n,r,s,o)},next:function(t,i){var e=this.currentPage.pageX,s=this.currentPage.pageY;e++,e>=this.pages.length&&this.hasVerticalScroll&&(e=0,s++),this.goToPage(e,s,t,i)},prev:function(t,i){var e=this.currentPage.pageX,s=this.currentPage.pageY;e--,e<0&&this.hasVerticalScroll&&(e=0,s--),this.goToPage(e,s,t,i)},_initKeys:function(i){var e,s={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40};if("object"==typeof this.options.keyBindings)for(e in this.options.keyBindings)"string"==typeof this.options.keyBindings[e]&&(this.options.keyBindings[e]=this.options.keyBindings[e].toUpperCase().charCodeAt(0));else this.options.keyBindings={};for(e in s)this.options.keyBindings[e]=this.options.keyBindings[e]||s[e];h.addEvent(t,"keydown",this),this.on("destroy",function(){h.removeEvent(t,"keydown",this)})},_key:function(t){if(this.enabled){var i,s=this.options.snap,o=s?this.currentPage.pageX:this.x,n=s?this.currentPage.pageY:this.y,r=h.getTime(),a=this.keyTime||0,l=.25;switch(this.options.useTransition&&this.isInTransition&&(i=this.getComputedPosition(),this._translate(e.round(i.x),e.round(i.y)),this.isInTransition=!1),this.keyAcceleration=r-a<200?e.min(this.keyAcceleration+l,50):0,t.keyCode){case this.options.keyBindings.pageUp:this.hasHorizontalScroll&&!this.hasVerticalScroll?o+=s?1:this.wrapperWidth:n+=s?1:this.wrapperHeight;break;case this.options.keyBindings.pageDown:this.hasHorizontalScroll&&!this.hasVerticalScroll?o-=s?1:this.wrapperWidth:n-=s?1:this.wrapperHeight;break;case this.options.keyBindings.end:o=s?this.pages.length-1:this.maxScrollX,n=s?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:o=0,n=0;break;case this.options.keyBindings.left:o+=s?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:n+=s?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:o-=s?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:n-=s?1:5+this.keyAcceleration>>0;break;default:return}if(s)return void this.goToPage(o,n);o>0?(o=0,this.keyAcceleration=0):o<this.maxScrollX&&(o=this.maxScrollX,this.keyAcceleration=0),n>0?(n=0,this.keyAcceleration=0):n<this.maxScrollY&&(n=this.maxScrollY,this.keyAcceleration=0),this.scrollTo(o,n,0),this.keyTime=r}},_animate:function(t,i,e,s){function o(){var d,u,f,m=h.getTime();return m>=p?(n.isAnimating=!1,n._translate(t,i),void(n.resetPosition(n.options.bounceTime)||n._execEvent("scrollEnd"))):(m=(m-c)/e,f=s(m),d=(t-a)*f+a,u=(i-l)*f+l,n._translate(d,u),void(n.isAnimating&&r(o)))}var n=this,a=this.x,l=this.y,c=h.getTime(),p=c+e;this.isAnimating=!0,o()},handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(t);break;case"wheel":case"DOMMouseScroll":case"mousewheel":this._wheel(t);break;case"keydown":this._key(t);break;case"click":this.enabled&&!t._constructed&&(t.preventDefault(),t.stopPropagation())}}},n.prototype={handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t)}},destroy:function(){this.options.fadeScrollbars&&(clearTimeout(this.fadeTimeout),this.fadeTimeout=null),this.options.interactive&&(h.removeEvent(this.indicator,"touchstart",this),h.removeEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.removeEvent(this.indicator,"mousedown",this),h.removeEvent(t,"touchmove",this),h.removeEvent(t,h.prefixPointerEvent("pointermove"),this),h.removeEvent(t,"mousemove",this),h.removeEvent(t,"touchend",this),h.removeEvent(t,h.prefixPointerEvent("pointerup"),this),h.removeEvent(t,"mouseup",this)),this.options.defaultScrollbars&&this.wrapper.parentNode.removeChild(this.wrapper)},_start:function(i){var e=i.touches?i.touches[0]:i;i.preventDefault(),i.stopPropagation(),this.transitionTime(),this.initiated=!0,this.moved=!1,this.lastPointX=e.pageX,this.lastPointY=e.pageY,this.startTime=h.getTime(),this.options.disableTouch||h.addEvent(t,"touchmove",this),this.options.disablePointer||h.addEvent(t,h.prefixPointerEvent("pointermove"),this),this.options.disableMouse||h.addEvent(t,"mousemove",this),this.scroller._execEvent("beforeScrollStart")},_move:function(t){var i,e,s,o,n=t.touches?t.touches[0]:t;h.getTime();this.moved||this.scroller._execEvent("scrollStart"),this.moved=!0,i=n.pageX-this.lastPointX,this.lastPointX=n.pageX,e=n.pageY-this.lastPointY,this.lastPointY=n.pageY,s=this.x+i,o=this.y+e,this._pos(s,o),t.preventDefault(),t.stopPropagation()},_end:function(i){if(this.initiated){if(this.initiated=!1,i.preventDefault(),i.stopPropagation(),h.removeEvent(t,"touchmove",this),h.removeEvent(t,h.prefixPointerEvent("pointermove"),this),h.removeEvent(t,"mousemove",this),this.scroller.options.snap){var s=this.scroller._nearestSnap(this.scroller.x,this.scroller.y),o=this.options.snapSpeed||e.max(e.max(e.min(e.abs(this.scroller.x-s.x),1e3),e.min(e.abs(this.scroller.y-s.y),1e3)),300);this.scroller.x==s.x&&this.scroller.y==s.y||(this.scroller.directionX=0,this.scroller.directionY=0,this.scroller.currentPage=s,this.scroller.scrollTo(s.x,s.y,o,this.scroller.options.bounceEasing))}this.moved&&this.scroller._execEvent("scrollEnd")}},transitionTime:function(t){t=t||0;var i=h.style.transitionDuration;if(i&&(this.indicatorStyle[i]=t+"ms",!t&&h.isBadAndroid)){this.indicatorStyle[i]="0.0001ms";var e=this;r(function(){"0.0001ms"===e.indicatorStyle[i]&&(e.indicatorStyle[i]="0s")})}},transitionTimingFunction:function(t){this.indicatorStyle[h.style.transitionTimingFunction]=t},refresh:function(){this.transitionTime(),this.options.listenX&&!this.options.listenY?this.indicatorStyle.display=this.scroller.hasHorizontalScroll?"block":"none":this.options.listenY&&!this.options.listenX?this.indicatorStyle.display=this.scroller.hasVerticalScroll?"block":"none":this.indicatorStyle.display=this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none",this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll?(h.addClass(this.wrapper,"iScrollBothScrollbars"),h.removeClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="8px":this.wrapper.style.bottom="8px")):(h.removeClass(this.wrapper,"iScrollBothScrollbars"),h.addClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="2px":this.wrapper.style.bottom="2px"));this.wrapper.offsetHeight;this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.options.resize?(this.indicatorWidth=e.max(e.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8),this.indicatorStyle.width=this.indicatorWidth+"px"):this.indicatorWidth=this.indicator.clientWidth,this.maxPosX=this.wrapperWidth-this.indicatorWidth,"clip"==this.options.shrink?(this.minBoundaryX=-this.indicatorWidth+8,this.maxBoundaryX=this.wrapperWidth-8):(this.minBoundaryX=0,this.maxBoundaryX=this.maxPosX),this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX),this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.options.resize?(this.indicatorHeight=e.max(e.round(this.wrapperHeight*this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8),this.indicatorStyle.height=this.indicatorHeight+"px"):this.indicatorHeight=this.indicator.clientHeight,this.maxPosY=this.wrapperHeight-this.indicatorHeight,"clip"==this.options.shrink?(this.minBoundaryY=-this.indicatorHeight+8,this.maxBoundaryY=this.wrapperHeight-8):(this.minBoundaryY=0,this.maxBoundaryY=this.maxPosY),this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY),this.updatePosition()},updatePosition:function(){var t=this.options.listenX&&e.round(this.sizeRatioX*this.scroller.x)||0,i=this.options.listenY&&e.round(this.sizeRatioY*this.scroller.y)||0;this.options.ignoreBoundaries||(t<this.minBoundaryX?("scale"==this.options.shrink&&(this.width=e.max(this.indicatorWidth+t,8),this.indicatorStyle.width=this.width+"px"),t=this.minBoundaryX):t>this.maxBoundaryX?"scale"==this.options.shrink?(this.width=e.max(this.indicatorWidth-(t-this.maxPosX),8),this.indicatorStyle.width=this.width+"px",t=this.maxPosX+this.indicatorWidth-this.width):t=this.maxBoundaryX:"scale"==this.options.shrink&&this.width!=this.indicatorWidth&&(this.width=this.indicatorWidth,this.indicatorStyle.width=this.width+"px"),i<this.minBoundaryY?("scale"==this.options.shrink&&(this.height=e.max(this.indicatorHeight+3*i,8),this.indicatorStyle.height=this.height+"px"),i=this.minBoundaryY):i>this.maxBoundaryY?"scale"==this.options.shrink?(this.height=e.max(this.indicatorHeight-3*(i-this.maxPosY),8),
        this.indicatorStyle.height=this.height+"px",i=this.maxPosY+this.indicatorHeight-this.height):i=this.maxBoundaryY:"scale"==this.options.shrink&&this.height!=this.indicatorHeight&&(this.height=this.indicatorHeight,this.indicatorStyle.height=this.height+"px")),this.x=t,this.y=i,this.scroller.options.useTransform?this.indicatorStyle[h.style.transform]="translate("+t+"px,"+i+"px)"+this.scroller.translateZ:(this.indicatorStyle.left=t+"px",this.indicatorStyle.top=i+"px")},_pos:function(t,i){t<0?t=0:t>this.maxPosX&&(t=this.maxPosX),i<0?i=0:i>this.maxPosY&&(i=this.maxPosY),t=this.options.listenX?e.round(t/this.sizeRatioX):this.scroller.x,i=this.options.listenY?e.round(i/this.sizeRatioY):this.scroller.y,this.scroller.scrollTo(t,i)},fade:function(t,i){if(!i||this.visible){clearTimeout(this.fadeTimeout),this.fadeTimeout=null;var e=t?250:500,s=t?0:300;t=t?"1":"0",this.wrapperStyle[h.style.transitionDuration]=e+"ms",this.fadeTimeout=setTimeout(function(t){this.wrapperStyle.opacity=t,this.visible=+t}.bind(this,t),s)}}},s.utils=h,"undefined"!=typeof module&&module.exports?module.exports=s:"function"==typeof define&&define.amd?define(function(){return s}):t.IScroll=s}(window,document,Math),/*!
 * fullPage ScrollOverflow
 * https://github.com/alvarotrigo/fullPage.js
 * @license MIT licensed
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
    function(t,i){var e="active",s="."+e,o="fp-section",n="."+o,r=n+s,h="fp-slide",a="."+h,l=a+s,c="fp-slides",p="."+c,d="fp-scrollable",u="."+d;"undefined"!=typeof IScroll&&(IScroll.prototype.wheelOn=function(){this.wrapper.addEventListener("wheel",this),this.wrapper.addEventListener("mousewheel",this),this.wrapper.addEventListener("DOMMouseScroll",this)},IScroll.prototype.wheelOff=function(){this.wrapper.removeEventListener("wheel",this),this.wrapper.removeEventListener("mousewheel",this),this.wrapper.removeEventListener("DOMMouseScroll",this)}),t.iscrollHandler={refreshId:null,iScrollInstances:[],toggleWheel:function(t){var e=i(r).find(u);e.each(function(){var e=i(this).data("iscrollInstance");"undefined"!=typeof e&&e&&(t?e.wheelOn():e.wheelOff())})},onLeave:function(){iscrollHandler.toggleWheel(!1)},beforeLeave:function(){iscrollHandler.onLeave()},afterLoad:function(){iscrollHandler.toggleWheel(!0)},create:function(t,e,s){var o=t.find(u);o.height(e),o.each(function(){var t=i(this),e=t.data("iscrollInstance");e&&i.each(iscrollHandler.iScrollInstances,function(){i(this).destroy()}),e=new IScroll(t.get(0),s),e.on("scrollEnd",function(){this.fp_isAtTop=this.y>-30,this.fp_isAtEnd=this.y-this.maxScrollY<30}),iscrollHandler.iScrollInstances.push(e),e.wheelOff(),t.data("iscrollInstance",e)})},isScrolled:function(t,i){var e=i.data("iscrollInstance");return!e||("top"===t?e.y>=0&&!i.scrollTop():"bottom"===t?0-e.y+i.scrollTop()+1+i.innerHeight()>=i[0].scrollHeight:void 0)},scrollable:function(t){return t.find(p).length?t.find(l).find(u):t.find(u)},scrollHeight:function(t){return t.find(u).children().first().get(0).scrollHeight},remove:function(t){var i=t.find(u);if(i.length){var e=i.data("iscrollInstance");e&&e.destroy(),i.data("iscrollInstance",null)}t.find(u).children().first().children().first().unwrap().unwrap()},update:function(t,e){clearTimeout(iscrollHandler.refreshId),iscrollHandler.refreshId=setTimeout(function(){i.each(iscrollHandler.iScrollInstances,function(){i(this).get(0).refresh()})},150),t.find(u).css("height",e+"px").parent().css("height",e+"px")},wrapContent:function(){return'<div class="'+d+'"><div class="fp-scroller"></div></div>'}}}(window,jQuery),function(t,i,e){e.fn.fp_scrolloverflow=function(){function s(){function s(){e("body").hasClass(y)?h():r(n)}function o(t){var i=t.closest(l);return i.length?parseInt(i.css("padding-bottom"))+parseInt(i.css("padding-top")):0}function n(i){if(!i.hasClass("fp-noscroll")){i.css("overflow","hidden");var s,n=a.options.scrollOverflowHandler,r=n.wrapContent(),h=i.closest(l),c=n.scrollable(i),p=o(h);c.length?s=n.scrollHeight(i):(s=i.get(0).scrollHeight-p,a.options.verticalCentered&&(s=i.find(g).get(0).scrollHeight-p));var d=e(t).height()-p;s>d?c.length?n.update(i,d):(a.options.verticalCentered?i.find(g).wrapInner(r):i.wrapInner(r),n.create(i,d,a.iscrollOptions)):n.remove(i),i.css("overflow","")}}function r(t){e(l).each(function(){var i=e(this).find(d);i.length?i.each(function(){t(e(this))}):t(e(this))})}function h(){var t=a.options.scrollOverflowHandler;r(function(i){i.closest(l).hasClass(x)&&t.remove(i)})}var a=this;a.options=null,a.init=function(o,n){return a.options=o,a.iscrollOptions=n,"complete"===i.readyState&&(s(),e.fn.fullpage.shared.afterRenderActions()),e(t).on("load",function(){s(),e.fn.fullpage.shared.afterRenderActions()}),a},a.createScrollBarForAll=s}var o="fp-scrollable",n="."+o,r="active",h="."+r,a="fp-section",l="."+a,c=l+h,p="fp-slide",d="."+p,u=d+h,f="fp-slides",m="."+f,v="fp-tableCell",g="."+v,y="fp-responsive",x="fp-auto-height-responsive";IScroll.prototype.wheelOn=function(){this.wrapper.addEventListener("wheel",this),this.wrapper.addEventListener("mousewheel",this),this.wrapper.addEventListener("DOMMouseScroll",this)},IScroll.prototype.wheelOff=function(){this.wrapper.removeEventListener("wheel",this),this.wrapper.removeEventListener("mousewheel",this),this.wrapper.removeEventListener("DOMMouseScroll",this)};var S={refreshId:null,iScrollInstances:[],iscrollOptions:{scrollbars:!0,mouseWheel:!0,hideScrollbars:!1,fadeScrollbars:!1,disableMouse:!0,interactiveScrollbars:!0},init:function(i){var o="ontouchstart"in t||navigator.msMaxTouchPoints>0||navigator.maxTouchPoints;return S.iscrollOptions.click=o,S.iscrollOptions=e.extend(S.iscrollOptions,i.scrollOverflowOptions),(new s).init(i,S.iscrollOptions)},toggleWheel:function(t){var i=e(c).find(n);i.each(function(){var i=e(this).data("iscrollInstance");"undefined"!=typeof i&&i&&(t?i.wheelOn():i.wheelOff())})},onLeave:function(){S.toggleWheel(!1)},beforeLeave:function(){S.onLeave()},afterLoad:function(){S.toggleWheel(!0)},create:function(t,i,s){var o=t.find(n);o.height(i),o.each(function(){var t=e(this),i=t.data("iscrollInstance");i&&e.each(S.iScrollInstances,function(){e(this).destroy()}),i=new IScroll(t.get(0),s),S.iScrollInstances.push(i),i.wheelOff(),t.data("iscrollInstance",i)})},isScrolled:function(t,i){var e=i.data("iscrollInstance");return!e||("top"===t?e.y>=0&&!i.scrollTop():"bottom"===t?0-e.y+i.scrollTop()+1+i.innerHeight()>=i[0].scrollHeight:void 0)},scrollable:function(t){return t.find(m).length?t.find(u).find(n):t.find(n)},scrollHeight:function(t){return t.find(n).children().first().get(0).scrollHeight},remove:function(t){var i=t.find(n);if(i.length){var e=i.data("iscrollInstance");e.destroy(),i.data("iscrollInstance",null)}t.find(n).children().first().children().first().unwrap().unwrap()},update:function(t,i){clearTimeout(S.refreshId),S.refreshId=setTimeout(function(){e.each(S.iScrollInstances,function(){e(this).get(0).refresh(),e.fn.fullpage.silentMoveTo(e(c).index()+1)})},150),t.find(n).css("height",i+"px").parent().css("height",i+getPaddings(t)+"px")},wrapContent:function(){return'<div class="'+o+'"><div class="fp-scroller"></div></div>'}};return{iscrollHandler:S}}()}(window,document,jQuery);
//# sourceMappingURL=scrolloverflow.min.js.map




/*! jQuery UI - v1.9.2 - 2014-03-21
* http://jqueryui.com
* Includes: jquery.ui.effect.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

jQuery.effects||function(e,t){var i=e.uiBackCompat!==!1,a="ui-effects-";e.effects={effect:{}},function(t,i){function a(e,t,i){var a=c[t.type]||{};return null==e?i||!t.def?null:t.def:(e=a.floor?~~e:parseFloat(e),isNaN(e)?t.def:a.mod?(e+a.mod)%a.mod:0>e?0:e>a.max?a.max:e)}function s(e){var a=u(),s=a._rgba=[];return e=e.toLowerCase(),m(l,function(t,n){var r,o=n.re.exec(e),h=o&&n.parse(o),l=n.space||"rgba";return h?(r=a[l](h),a[d[l].cache]=r[d[l].cache],s=a._rgba=r._rgba,!1):i}),s.length?("0,0,0,0"===s.join()&&t.extend(s,r.transparent),a):r[e]}function n(e,t,i){return i=(i+1)%1,1>6*i?e+6*(t-e)*i:1>2*i?t:2>3*i?e+6*(t-e)*(2/3-i):e}var r,o="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor".split(" "),h=/^([\-+])=\s*(\d+\.?\d*)/,l=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[e[1],e[2],e[3],e[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,parse:function(e){return[2.55*e[1],2.55*e[2],2.55*e[3],e[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(e){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(e){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(e){return[e[1],e[2]/100,e[3]/100,e[4]]}}],u=t.Color=function(e,i,a,s){return new t.Color.fn.parse(e,i,a,s)},d={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},c={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},p=u.support={},f=t("<p>")[0],m=t.each;f.style.cssText="background-color:rgba(1,1,1,.5)",p.rgba=f.style.backgroundColor.indexOf("rgba")>-1,m(d,function(e,t){t.cache="_"+e,t.props.alpha={idx:3,type:"percent",def:1}}),u.fn=t.extend(u.prototype,{parse:function(n,o,h,l){if(n===i)return this._rgba=[null,null,null,null],this;(n.jquery||n.nodeType)&&(n=t(n).css(o),o=i);var c=this,p=t.type(n),f=this._rgba=[];return o!==i&&(n=[n,o,h,l],p="array"),"string"===p?this.parse(s(n)||r._default):"array"===p?(m(d.rgba.props,function(e,t){f[t.idx]=a(n[t.idx],t)}),this):"object"===p?(n instanceof u?m(d,function(e,t){n[t.cache]&&(c[t.cache]=n[t.cache].slice())}):m(d,function(t,i){var s=i.cache;m(i.props,function(e,t){if(!c[s]&&i.to){if("alpha"===e||null==n[e])return;c[s]=i.to(c._rgba)}c[s][t.idx]=a(n[e],t,!0)}),c[s]&&0>e.inArray(null,c[s].slice(0,3))&&(c[s][3]=1,i.from&&(c._rgba=i.from(c[s])))}),this):i},is:function(e){var t=u(e),a=!0,s=this;return m(d,function(e,n){var r,o=t[n.cache];return o&&(r=s[n.cache]||n.to&&n.to(s._rgba)||[],m(n.props,function(e,t){return null!=o[t.idx]?a=o[t.idx]===r[t.idx]:i})),a}),a},_space:function(){var e=[],t=this;return m(d,function(i,a){t[a.cache]&&e.push(i)}),e.pop()},transition:function(e,t){var i=u(e),s=i._space(),n=d[s],r=0===this.alpha()?u("transparent"):this,o=r[n.cache]||n.to(r._rgba),h=o.slice();return i=i[n.cache],m(n.props,function(e,s){var n=s.idx,r=o[n],l=i[n],u=c[s.type]||{};null!==l&&(null===r?h[n]=l:(u.mod&&(l-r>u.mod/2?r+=u.mod:r-l>u.mod/2&&(r-=u.mod)),h[n]=a((l-r)*t+r,s)))}),this[s](h)},blend:function(e){if(1===this._rgba[3])return this;var i=this._rgba.slice(),a=i.pop(),s=u(e)._rgba;return u(t.map(i,function(e,t){return(1-a)*s[t]+a*e}))},toRgbaString:function(){var e="rgba(",i=t.map(this._rgba,function(e,t){return null==e?t>2?1:0:e});return 1===i[3]&&(i.pop(),e="rgb("),e+i.join()+")"},toHslaString:function(){var e="hsla(",i=t.map(this.hsla(),function(e,t){return null==e&&(e=t>2?1:0),t&&3>t&&(e=Math.round(100*e)+"%"),e});return 1===i[3]&&(i.pop(),e="hsl("),e+i.join()+")"},toHexString:function(e){var i=this._rgba.slice(),a=i.pop();return e&&i.push(~~(255*a)),"#"+t.map(i,function(e){return e=(e||0).toString(16),1===e.length?"0"+e:e}).join("")},toString:function(){return 0===this._rgba[3]?"transparent":this.toRgbaString()}}),u.fn.parse.prototype=u.fn,d.hsla.to=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t,i,a=e[0]/255,s=e[1]/255,n=e[2]/255,r=e[3],o=Math.max(a,s,n),h=Math.min(a,s,n),l=o-h,u=o+h,d=.5*u;return t=h===o?0:a===o?60*(s-n)/l+360:s===o?60*(n-a)/l+120:60*(a-s)/l+240,i=0===d||1===d?d:.5>=d?l/u:l/(2-u),[Math.round(t)%360,i,d,null==r?1:r]},d.hsla.from=function(e){if(null==e[0]||null==e[1]||null==e[2])return[null,null,null,e[3]];var t=e[0]/360,i=e[1],a=e[2],s=e[3],r=.5>=a?a*(1+i):a+i-a*i,o=2*a-r;return[Math.round(255*n(o,r,t+1/3)),Math.round(255*n(o,r,t)),Math.round(255*n(o,r,t-1/3)),s]},m(d,function(e,s){var n=s.props,r=s.cache,o=s.to,l=s.from;u.fn[e]=function(e){if(o&&!this[r]&&(this[r]=o(this._rgba)),e===i)return this[r].slice();var s,h=t.type(e),d="array"===h||"object"===h?e:arguments,c=this[r].slice();return m(n,function(e,t){var i=d["object"===h?e:t.idx];null==i&&(i=c[t.idx]),c[t.idx]=a(i,t)}),l?(s=u(l(c)),s[r]=c,s):u(c)},m(n,function(i,a){u.fn[i]||(u.fn[i]=function(s){var n,r=t.type(s),o="alpha"===i?this._hsla?"hsla":"rgba":e,l=this[o](),u=l[a.idx];return"undefined"===r?u:("function"===r&&(s=s.call(this,u),r=t.type(s)),null==s&&a.empty?this:("string"===r&&(n=h.exec(s),n&&(s=u+parseFloat(n[2])*("+"===n[1]?1:-1))),l[a.idx]=s,this[o](l)))})})}),m(o,function(e,i){t.cssHooks[i]={set:function(e,a){var n,r,o="";if("string"!==t.type(a)||(n=s(a))){if(a=u(n||a),!p.rgba&&1!==a._rgba[3]){for(r="backgroundColor"===i?e.parentNode:e;(""===o||"transparent"===o)&&r&&r.style;)try{o=t.css(r,"backgroundColor"),r=r.parentNode}catch(h){}a=a.blend(o&&"transparent"!==o?o:"_default")}a=a.toRgbaString()}try{e.style[i]=a}catch(l){}}},t.fx.step[i]=function(e){e.colorInit||(e.start=u(e.elem,i),e.end=u(e.end),e.colorInit=!0),t.cssHooks[i].set(e.elem,e.start.transition(e.end,e.pos))}}),t.cssHooks.borderColor={expand:function(e){var t={};return m(["Top","Right","Bottom","Left"],function(i,a){t["border"+a+"Color"]=e}),t}},r=t.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}}(jQuery),function(){function i(){var t,i,a=this.ownerDocument.defaultView?this.ownerDocument.defaultView.getComputedStyle(this,null):this.currentStyle,s={};if(a&&a.length&&a[0]&&a[a[0]])for(i=a.length;i--;)t=a[i],"string"==typeof a[t]&&(s[e.camelCase(t)]=a[t]);else for(t in a)"string"==typeof a[t]&&(s[t]=a[t]);return s}function a(t,i){var a,s,r={};for(a in i)s=i[a],t[a]!==s&&(n[a]||(e.fx.step[a]||!isNaN(parseFloat(s)))&&(r[a]=s));return r}var s=["add","remove","toggle"],n={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};e.each(["borderLeftStyle","borderRightStyle","borderBottomStyle","borderTopStyle"],function(t,i){e.fx.step[i]=function(e){("none"!==e.end&&!e.setAttr||1===e.pos&&!e.setAttr)&&(jQuery.style(e.elem,i,e.end),e.setAttr=!0)}}),e.effects.animateClass=function(t,n,r,o){var h=e.speed(n,r,o);return this.queue(function(){var n,r=e(this),o=r.attr("class")||"",l=h.children?r.find("*").andSelf():r;l=l.map(function(){var t=e(this);return{el:t,start:i.call(this)}}),n=function(){e.each(s,function(e,i){t[i]&&r[i+"Class"](t[i])})},n(),l=l.map(function(){return this.end=i.call(this.el[0]),this.diff=a(this.start,this.end),this}),r.attr("class",o),l=l.map(function(){var t=this,i=e.Deferred(),a=jQuery.extend({},h,{queue:!1,complete:function(){i.resolve(t)}});return this.el.animate(this.diff,a),i.promise()}),e.when.apply(e,l.get()).done(function(){n(),e.each(arguments,function(){var t=this.el;e.each(this.diff,function(e){t.css(e,"")})}),h.complete.call(r[0])})})},e.fn.extend({_addClass:e.fn.addClass,addClass:function(t,i,a,s){return i?e.effects.animateClass.call(this,{add:t},i,a,s):this._addClass(t)},_removeClass:e.fn.removeClass,removeClass:function(t,i,a,s){return i?e.effects.animateClass.call(this,{remove:t},i,a,s):this._removeClass(t)},_toggleClass:e.fn.toggleClass,toggleClass:function(i,a,s,n,r){return"boolean"==typeof a||a===t?s?e.effects.animateClass.call(this,a?{add:i}:{remove:i},s,n,r):this._toggleClass(i,a):e.effects.animateClass.call(this,{toggle:i},a,s,n)},switchClass:function(t,i,a,s,n){return e.effects.animateClass.call(this,{add:i,remove:t},a,s,n)}})}(),function(){function s(t,i,a,s){return e.isPlainObject(t)&&(i=t,t=t.effect),t={effect:t},null==i&&(i={}),e.isFunction(i)&&(s=i,a=null,i={}),("number"==typeof i||e.fx.speeds[i])&&(s=a,a=i,i={}),e.isFunction(a)&&(s=a,a=null),i&&e.extend(t,i),a=a||i.duration,t.duration=e.fx.off?0:"number"==typeof a?a:a in e.fx.speeds?e.fx.speeds[a]:e.fx.speeds._default,t.complete=s||i.complete,t}function n(t){return!t||"number"==typeof t||e.fx.speeds[t]?!0:"string"!=typeof t||e.effects.effect[t]?!1:i&&e.effects[t]?!1:!0}e.extend(e.effects,{version:"1.9.2",save:function(e,t){for(var i=0;t.length>i;i++)null!==t[i]&&e.data(a+t[i],e[0].style[t[i]])},restore:function(e,i){var s,n;for(n=0;i.length>n;n++)null!==i[n]&&(s=e.data(a+i[n]),s===t&&(s=""),e.css(i[n],s))},setMode:function(e,t){return"toggle"===t&&(t=e.is(":hidden")?"show":"hide"),t},getBaseline:function(e,t){var i,a;switch(e[0]){case"top":i=0;break;case"middle":i=.5;break;case"bottom":i=1;break;default:i=e[0]/t.height}switch(e[1]){case"left":a=0;break;case"center":a=.5;break;case"right":a=1;break;default:a=e[1]/t.width}return{x:a,y:i}},createWrapper:function(t){if(t.parent().is(".ui-effects-wrapper"))return t.parent();var i={width:t.outerWidth(!0),height:t.outerHeight(!0),"float":t.css("float")},a=e("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),s={width:t.width(),height:t.height()},n=document.activeElement;try{n.id}catch(r){n=document.body}return t.wrap(a),(t[0]===n||e.contains(t[0],n))&&e(n).focus(),a=t.parent(),"static"===t.css("position")?(a.css({position:"relative"}),t.css({position:"relative"})):(e.extend(i,{position:t.css("position"),zIndex:t.css("z-index")}),e.each(["top","left","bottom","right"],function(e,a){i[a]=t.css(a),isNaN(parseInt(i[a],10))&&(i[a]="auto")}),t.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),t.css(s),a.css(i).show()},removeWrapper:function(t){var i=document.activeElement;return t.parent().is(".ui-effects-wrapper")&&(t.parent().replaceWith(t),(t[0]===i||e.contains(t[0],i))&&e(i).focus()),t},setTransition:function(t,i,a,s){return s=s||{},e.each(i,function(e,i){var n=t.cssUnit(i);n[0]>0&&(s[i]=n[0]*a+n[1])}),s}}),e.fn.extend({effect:function(){function t(t){function i(){e.isFunction(n)&&n.call(s[0]),e.isFunction(t)&&t()}var s=e(this),n=a.complete,r=a.mode;(s.is(":hidden")?"hide"===r:"show"===r)?i():o.call(s[0],a,i)}var a=s.apply(this,arguments),n=a.mode,r=a.queue,o=e.effects.effect[a.effect],h=!o&&i&&e.effects[a.effect];return e.fx.off||!o&&!h?n?this[n](a.duration,a.complete):this.each(function(){a.complete&&a.complete.call(this)}):o?r===!1?this.each(t):this.queue(r||"fx",t):h.call(this,{options:a,duration:a.duration,callback:a.complete,mode:a.mode})},_show:e.fn.show,show:function(e){if(n(e))return this._show.apply(this,arguments);var t=s.apply(this,arguments);return t.mode="show",this.effect.call(this,t)},_hide:e.fn.hide,hide:function(e){if(n(e))return this._hide.apply(this,arguments);var t=s.apply(this,arguments);return t.mode="hide",this.effect.call(this,t)},__toggle:e.fn.toggle,toggle:function(t){if(n(t)||"boolean"==typeof t||e.isFunction(t))return this.__toggle.apply(this,arguments);var i=s.apply(this,arguments);return i.mode="toggle",this.effect.call(this,i)},cssUnit:function(t){var i=this.css(t),a=[];return e.each(["em","px","%","pt"],function(e,t){i.indexOf(t)>0&&(a=[parseFloat(i),t])}),a}})}(),function(){var t={};e.each(["Quad","Cubic","Quart","Quint","Expo"],function(e,i){t[i]=function(t){return Math.pow(t,e+2)}}),e.extend(t,{Sine:function(e){return 1-Math.cos(e*Math.PI/2)},Circ:function(e){return 1-Math.sqrt(1-e*e)},Elastic:function(e){return 0===e||1===e?e:-Math.pow(2,8*(e-1))*Math.sin((80*(e-1)-7.5)*Math.PI/15)},Back:function(e){return e*e*(3*e-2)},Bounce:function(e){for(var t,i=4;((t=Math.pow(2,--i))-1)/11>e;);return 1/Math.pow(4,3-i)-7.5625*Math.pow((3*t-2)/22-e,2)}}),e.each(t,function(t,i){e.easing["easeIn"+t]=i,e.easing["easeOut"+t]=function(e){return 1-i(1-e)},e.easing["easeInOut"+t]=function(e){return.5>e?i(2*e)/2:1-i(-2*e+2)/2}})}()}(jQuery);




/*!
 * fullPage 2.9.6
 * https://github.com/alvarotrigo/fullPage.js
 * @license MIT licensed
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
            return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports === "object" && exports) {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function($, window, document, Math, undefined) {
    'use strict';

    // keeping central set of classnames and selectors
    var WRAPPER =               'fullpage-wrapper';
    var WRAPPER_SEL =           '.' + WRAPPER;

    // slimscroll
    var SCROLLABLE =            'fp-scrollable';
    var SCROLLABLE_SEL =        '.' + SCROLLABLE;

    // util
    var RESPONSIVE =            'fp-responsive';
    var NO_TRANSITION =         'fp-notransition';
    var DESTROYED =             'fp-destroyed';
    var ENABLED =               'fp-enabled';
    var VIEWING_PREFIX =        'fp-viewing';
    var ACTIVE =                'active';
    var ACTIVE_SEL =            '.' + ACTIVE;
    var COMPLETELY =            'fp-completely';
    var COMPLETELY_SEL =        '.' + COMPLETELY;

    // section
    var SECTION_DEFAULT_SEL =   '.section';
    var SECTION =               'fp-section';
    var SECTION_SEL =           '.' + SECTION;
    var SECTION_ACTIVE_SEL =    SECTION_SEL + ACTIVE_SEL;
    var SECTION_FIRST_SEL =     SECTION_SEL + ':first';
    var SECTION_LAST_SEL =      SECTION_SEL + ':last';
    var TABLE_CELL =            'fp-tableCell';
    var TABLE_CELL_SEL =        '.' + TABLE_CELL;
    var AUTO_HEIGHT =           'fp-auto-height';
    var AUTO_HEIGHT_SEL =       '.fp-auto-height';
    var NORMAL_SCROLL =         'fp-normal-scroll';
    var NORMAL_SCROLL_SEL =     '.fp-normal-scroll';

    // section nav
    var SECTION_NAV =           'fp-nav';
    var SECTION_NAV_SEL =       '#' + SECTION_NAV;
    var SECTION_NAV_TOOLTIP =   'fp-tooltip';
    var SECTION_NAV_TOOLTIP_SEL='.'+SECTION_NAV_TOOLTIP;
    var SHOW_ACTIVE_TOOLTIP =   'fp-show-active';

    // slide
    var SLIDE_DEFAULT_SEL =     '.slide';
    var SLIDE =                 'fp-slide';
    var SLIDE_SEL =             '.' + SLIDE;
    var SLIDE_ACTIVE_SEL =      SLIDE_SEL + ACTIVE_SEL;
    var SLIDES_WRAPPER =        'fp-slides';
    var SLIDES_WRAPPER_SEL =    '.' + SLIDES_WRAPPER;
    var SLIDES_CONTAINER =      'fp-slidesContainer';
    var SLIDES_CONTAINER_SEL =  '.' + SLIDES_CONTAINER;
    var TABLE =                 'fp-table';

    // slide nav
    var SLIDES_NAV =            'fp-slidesNav';
    var SLIDES_NAV_SEL =        '.' + SLIDES_NAV;
    var SLIDES_NAV_LINK_SEL =   SLIDES_NAV_SEL + ' a';
    var SLIDES_ARROW =          'fp-controlArrow';
    var SLIDES_ARROW_SEL =      '.' + SLIDES_ARROW;
    var SLIDES_PREV =           'fp-prev';
    var SLIDES_PREV_SEL =       '.' + SLIDES_PREV;
    var SLIDES_ARROW_PREV =     SLIDES_ARROW + ' ' + SLIDES_PREV;
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
    var SLIDES_NEXT =           'fp-next';
    var SLIDES_NEXT_SEL =       '.' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT =     SLIDES_ARROW + ' ' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

    var $window = $(window);
    var $document = $(document);

    $.fn.fullpage = function(options) {
        //only once my friend!
        if($('html').hasClass(ENABLED)){ displayWarnings(); return; }

        // common jQuery objects
        var $htmlBody = $('html, body');
        var $body = $('body');

        var FP = $.fn.fullpage;

        // Creating some defaults, extending them with any options that were provided
        options = $.extend({
            //navigation
            menu: false,
            anchors:[],
            lockAnchors: false,
            navigation: false,
            navigationPosition: 'right',
            navigationTooltips: [],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            scrollBar: false,
            hybrid: false,

            //scrolling
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            fitToSectionDelay: 1000,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            continuousHorizontal: false,
            scrollHorizontally: false,
            interlockedSlides: false,
            dragAndMove: false,
            offsetSections: false,
            resetSliders: false,
            fadingEffect: false,
            normalScrollElements: null,
            scrollOverflow: false,
            scrollOverflowReset: false,
            scrollOverflowHandler: $.fn.fp_scrolloverflow ? $.fn.fp_scrolloverflow.iscrollHandler : null,
            scrollOverflowOptions: null,
            touchSensitivity: 5,
            normalScrollElementTouchThreshold: 5,
            bigSectionsDestination: null,

            //Accessibility
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,

            //design
            controlArrows: true,
            controlArrowColor: '#fff',
            verticalCentered: true,
            sectionsColor : [],
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            responsive: 0, //backwards compabitility with responsiveWiddth
            responsiveWidth: 0,
            responsiveHeight: 0,
            responsiveSlides: false,
            parallax: false,
            parallaxOptions: {
                type: 'reveal',
                percentage: 62,
                property: 'translate'
            },

            //Custom selectors
            sectionSelector: SECTION_DEFAULT_SEL,
            slideSelector: SLIDE_DEFAULT_SEL,

            //events
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null,
            afterResponsive: null,

            lazyLoading: true
        }, options);

        //flag to avoid very fast sliding for landscape sliders
        var slideMoving = false;

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var container = $(this);
        var windowsHeight = $window.height();
        var isResizing = false;
        var isWindowFocused = true;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var canScroll = true;
        var scrollings = [];
        var controlPressed;
        var startingSection;
        var isScrollAllowed = {};
        isScrollAllowed.m = {  'up':true, 'down':true, 'left':true, 'right':true };
        isScrollAllowed.k = $.extend(true,{}, isScrollAllowed.m);
        var MSPointer = getMSPointer();
        var events = {
            touchmove: 'ontouchmove' in window ? 'touchmove' :  MSPointer.move,
            touchstart: 'ontouchstart' in window ? 'touchstart' :  MSPointer.down
        };
        var scrollBarHandler;

        // taken from https://github.com/udacity/ud891/blob/gh-pages/lesson2-focus/07-modals-and-keyboard-traps/solution/modal.js
        var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

        //timeouts
        var resizeId;
        var afterSectionLoadsId;
        var afterSlideLoadsId;
        var scrollId;
        var scrollId2;
        var keydownId;
        var originals = $.extend(true, {}, options); //deep copy

        displayWarnings();

        //easeInOutCubic animation included in the plugin
        $.extend($.easing,{ easeInOutCubic: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;}});

        /**
         * Sets the autoScroll option.
         * It changes the scroll bar visibility and the history of the site as a result.
         */
        function setAutoScrolling(value, type){
            //removing the transformation
            if(!value){
                silentScroll(0);
            }

            setVariableState('autoScrolling', value, type);

            var element = $(SECTION_ACTIVE_SEL);

            if(options.autoScrolling && !options.scrollBar){
                $htmlBody.css({
                    'overflow' : 'hidden',
                    'height' : '100%'
                });

                setRecordHistory(originals.recordHistory, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });

                if(element.length){
                    //moving the container up
                    silentScroll(element.position().top);
                }

            }else{
                $htmlBody.css({
                    'overflow' : 'visible',
                    'height' : 'initial'
                });

                setRecordHistory(false, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': '',
                    'touch-action': ''
                });

                //scrolling the page to the section with no animation
                if (element.length) {
                    $htmlBody.scrollTop(element.position().top);
                }
            }
        }

        /**
         * Defines wheter to record the history for each hash change in the URL.
         */
        function setRecordHistory(value, type){
            setVariableState('recordHistory', value, type);
        }

        /**
         * Defines the scrolling speed
         */
        function setScrollingSpeed(value, type){
            setVariableState('scrollingSpeed', value, type);
        }

        /**
         * Sets fitToSection
         */
        function setFitToSection(value, type){
            setVariableState('fitToSection', value, type);
        }

        /**
         * Sets lockAnchors
         */
        function setLockAnchors(value){
            options.lockAnchors = value;
        }

        /**
         * Adds or remove the possibility of scrolling through sections by using the mouse wheel or the trackpad.
         */
        function setMouseWheelScrolling(value){
            if(value){
                addMouseWheelHandler();
                addMiddleWheelHandler();
            }else{
                removeMouseWheelHandler();
                removeMiddleWheelHandler();
            }
        }

        /**
         * Adds or remove the possibility of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
         * Optionally a second parameter can be used to specify the direction for which the action will be applied.
         *
         * @param directions string containing the direction or directions separated by comma.
         */
        function setAllowScrolling(value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'm');
                });
            }
            else{
                setIsScrollAllowed(value, 'all', 'm');

                if(value){
                    setMouseWheelScrolling(true);
                    addTouchHandler();
                }else{
                    setMouseWheelScrolling(false);
                    removeTouchHandler();
                }
            }
        }

        /**
         * Adds or remove the possibility of scrolling through sections by using the keyboard arrow keys
         */
        function setKeyboardScrolling(value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'k');
                });
            }else{
                setIsScrollAllowed(value, 'all', 'k');
                options.keyboardScrolling = value;
            }
        }

        /**
         * Moves the page up one section.
         */
        function moveSectionUp(){
            var prev = $(SECTION_ACTIVE_SEL).prev(SECTION_SEL);

            //looping to the bottom if there's no more sections above
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $(SECTION_SEL).last();
            }

            if (prev.length) {
                scrollPage(prev, null, true);
            }
        }

        /**
         * Moves the page down one section.
         */
        function moveSectionDown(){
            var next = $(SECTION_ACTIVE_SEL).next(SECTION_SEL);

            //looping to the top if there's no more sections below
            if(!next.length &&
                (options.loopBottom || options.continuousVertical)){
                next = $(SECTION_SEL).first();
            }

            if(next.length){
                scrollPage(next, null, false);
            }
        }

        /**
         * Moves the page to the given section and slide with no animation.
         * Anchors or index positions can be used as params.
         */
        function silentMoveTo(sectionAnchor, slideAnchor){
            setScrollingSpeed (0, 'internal');
            moveTo(sectionAnchor, slideAnchor);
            setScrollingSpeed (originals.scrollingSpeed, 'internal');
        }

        /**
         * Moves the page to the given section and slide.
         * Anchors or index positions can be used as params.
         */
        function moveTo(sectionAnchor, slideAnchor){
            var destiny = getSectionByAnchor(sectionAnchor);

            if (typeof slideAnchor !== 'undefined'){
                scrollPageAndSlide(sectionAnchor, slideAnchor);
            }else if(destiny.length > 0){
                scrollPage(destiny);
            }
        }

        /**
         * Slides right the slider of the active section.
         * Optional `section` param.
         */
        function moveSlideRight(section){
            moveSlide('right', section);
        }

        /**
         * Slides left the slider of the active section.
         * Optional `section` param.
         */
        function moveSlideLeft(section){
            moveSlide('left', section);
        }

        /**
         * When resizing is finished, we adjust the slides sizes and positions
         */
        function reBuild(resizing){
            if(container.hasClass(DESTROYED)){ return; }  //nothing to do if the plugin was destroyed

            isResizing = true;

            windowsHeight = $window.height();  //updating global var

            $(SECTION_SEL).each(function(){
                var slidesWrap = $(this).find(SLIDES_WRAPPER_SEL);
                var slides = $(this).find(SLIDE_SEL);

                //adjusting the height of the table-cell for IE and Firefox
                if(options.verticalCentered){
                    $(this).find(TABLE_CELL_SEL).css('height', getTableHeight($(this)) + 'px');
                }

                $(this).css('height', windowsHeight + 'px');

                //adjusting the position fo the FULL WIDTH slides...
                if (slides.length > 1) {
                    landscapeScroll(slidesWrap, slidesWrap.find(SLIDE_ACTIVE_SEL));
                }
            });

            if(options.scrollOverflow){
                scrollBarHandler.createScrollBarForAll();
            }

            var activeSection = $(SECTION_ACTIVE_SEL);
            var sectionIndex = activeSection.index(SECTION_SEL);

            //isn't it the first section?
            if(sectionIndex){
                //adjusting the position for the current section
                silentMoveTo(sectionIndex + 1);
            }

            isResizing = false;
            $.isFunction( options.afterResize ) && resizing && options.afterResize.call(container);
            $.isFunction( options.afterReBuild ) && !resizing && options.afterReBuild.call(container);
        }

        /**
         * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height`
         * are smaller than the set limit values.
         */
        function setResponsive(active){
            var isResponsive = $body.hasClass(RESPONSIVE);

            if(active){
                if(!isResponsive){
                    setAutoScrolling(false, 'internal');
                    setFitToSection(false, 'internal');
                    $(SECTION_NAV_SEL).hide();
                    $body.addClass(RESPONSIVE);
                    $.isFunction( options.afterResponsive ) && options.afterResponsive.call( container, active);
                }
            }
            else if(isResponsive){
                setAutoScrolling(originals.autoScrolling, 'internal');
                setFitToSection(originals.autoScrolling, 'internal');
                $(SECTION_NAV_SEL).show();
                $body.removeClass(RESPONSIVE);
                $.isFunction( options.afterResponsive ) && options.afterResponsive.call( container, active);
            }
        }

        if($(this).length){
            //public functions
            FP.version = '2.9.5';
            FP.setAutoScrolling = setAutoScrolling;
            FP.setRecordHistory = setRecordHistory;
            FP.setScrollingSpeed = setScrollingSpeed;
            FP.setFitToSection = setFitToSection;
            FP.setLockAnchors = setLockAnchors;
            FP.setMouseWheelScrolling = setMouseWheelScrolling;
            FP.setAllowScrolling = setAllowScrolling;
            FP.setKeyboardScrolling = setKeyboardScrolling;
            FP.moveSectionUp = moveSectionUp;
            FP.moveSectionDown = moveSectionDown;
            FP.silentMoveTo = silentMoveTo;
            FP.moveTo = moveTo;
            FP.moveSlideRight = moveSlideRight;
            FP.moveSlideLeft = moveSlideLeft;
            FP.fitToSection = fitToSection;
            FP.reBuild = reBuild;
            FP.setResponsive = setResponsive;
            FP.destroy = destroy;

            //functions we want to share across files but which are not
            //mean to be used on their own by developers
            FP.shared ={
                afterRenderActions: afterRenderActions
            };

            init();

            bindEvents();
        }

        function init(){
            //if css3 is not supported, it will use jQuery animations
            if(options.css3){
                options.css3 = support3d();
            }

            options.scrollBar = options.scrollBar || options.hybrid;

            setOptionsFromDOM();
            prepareDom();
            setAllowScrolling(true);
            setAutoScrolling(options.autoScrolling, 'internal');
            responsive();

            //setting the class for the body element
            setBodyClass();

            if(document.readyState === 'complete'){
                scrollToAnchor();
            }
            $window.on('load', scrollToAnchor);
        }

        function bindEvents(){
            $window
            //when scrolling...
                .on('scroll', scrollHandler)

                //detecting any change on the URL to scroll to the given anchor link
                //(a way to detect back history button as we play with the hashes on the URL)
                .on('hashchange', hashChangeHandler)

                //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
                .blur(blurHandler)

                //when resizing the site, we adjust the heights of the sections, slimScroll...
                .resize(resizeHandler);

            $document
            //Sliding with arrow keys, both, vertical and horizontal
                .keydown(keydownHandler)

                //to prevent scrolling while zooming
                .keyup(keyUpHandler)

                //Scrolls to the section when clicking the navigation bullet
                .on('click touchstart', SECTION_NAV_SEL + ' a', sectionBulletHandler)

                //Scrolls the slider to the given slide destination for the given section
                .on('click touchstart', SLIDES_NAV_LINK_SEL, slideBulletHandler)

                .on('click', SECTION_NAV_TOOLTIP_SEL, tooltipTextHandler);

            //Scrolling horizontally when clicking on the slider controls.
            $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, slideArrowHandler);

            /**
             * Applying normalScroll elements.
             * Ignoring the scrolls over the specified selectors.
             */
            if(options.normalScrollElements){
                $document.on('mouseenter touchstart', options.normalScrollElements, function () {
                    setAllowScrolling(false);
                });

                $document.on('mouseleave touchend', options.normalScrollElements, function(){
                    setAllowScrolling(true);
                });
            }
        }

        /**
         * Setting options from DOM elements if they are not provided.
         */
        function setOptionsFromDOM(){
            var sections = container.find(options.sectionSelector);

            //no anchors option? Checking for them in the DOM attributes
            if(!options.anchors.length){
                options.anchors = sections.filter('[data-anchor]').map(function(){
                    return $(this).data('anchor').toString();
                }).get();
            }

            //no tooltips option? Checking for them in the DOM attributes
            if(!options.navigationTooltips.length){
                options.navigationTooltips = sections.filter('[data-tooltip]').map(function(){
                    return $(this).data('tooltip').toString();
                }).get();
            }
        }

        /**
         * Works over the DOM structure to set it up for the current fullpage options.
         */
        function prepareDom(){
            container.css({
                'height': '100%',
                'position': 'relative'
            });

            //adding a class to recognize the container internally in the code
            container.addClass(WRAPPER);
            $('html').addClass(ENABLED);

            //due to https://github.com/alvarotrigo/fullPage.js/issues/1502
            windowsHeight = $window.height();

            container.removeClass(DESTROYED); //in case it was destroyed before initializing it again

            addInternalSelectors();

            //styling the sections / slides / menu
            $(SECTION_SEL).each(function(index){
                var section = $(this);
                var slides = section.find(SLIDE_SEL);
                var numSlides = slides.length;

                //caching the original styles to add them back on destroy('all')
                section.data('fp-styles', section.attr('style'));

                styleSection(section, index);
                styleMenu(section, index);

                // if there's any slide
                if (numSlides > 0) {
                    styleSlides(section, slides, numSlides);
                }else{
                    if(options.verticalCentered){
                        addTableClass(section);
                    }
                }
            });

            //fixed elements need to be moved out of the plugin container due to problems with CSS3.
            if(options.fixedElements && options.css3){
                $(options.fixedElements).appendTo($body);
            }

            //vertical centered of the navigation + active bullet
            if(options.navigation){
                addVerticalNavigation();
            }

            enableYoutubeAPI();

            if(options.scrollOverflow){
                scrollBarHandler = options.scrollOverflowHandler.init(options);
            }else{
                afterRenderActions();
            }
        }

        /**
         * Styles the horizontal slides for a section.
         */
        function styleSlides(section, slides, numSlides){
            var sliderWidth = numSlides * 100;
            var slideWidth = 100 / numSlides;

            slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
            slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');

            section.find(SLIDES_CONTAINER_SEL).css('width', sliderWidth + '%');

            if(numSlides > 1){
                if(options.controlArrows){
                    createSlideArrows(section);
                }

                if(options.slidesNavigation){
                    addSlidesNavigation(section, numSlides);
                }
            }

            slides.each(function(index) {
                $(this).css('width', slideWidth + '%');

                if(options.verticalCentered){
                    addTableClass($(this));
                }
            });

            var startingSlide = section.find(SLIDE_ACTIVE_SEL);

            //if the slide won't be an starting point, the default will be the first one
            //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            if( startingSlide.length &&  ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && startingSlide.index() !== 0))){
                silentLandscapeScroll(startingSlide, 'internal');
            }else{
                slides.eq(0).addClass(ACTIVE);
            }
        }

        /**
         * Styling vertical sections
         */
        function styleSection(section, index){
            //if no active section is defined, the 1st one will be the default one
            if(!index && $(SECTION_ACTIVE_SEL).length === 0) {
                section.addClass(ACTIVE);
            }
            startingSection = $(SECTION_ACTIVE_SEL);

            section.css('height', windowsHeight + 'px');

            if(options.paddingTop){
                section.css('padding-top', options.paddingTop);
            }

            if(options.paddingBottom){
                section.css('padding-bottom', options.paddingBottom);
            }

            if (typeof options.sectionsColor[index] !==  'undefined') {
                section.css('background-color', options.sectionsColor[index]);
            }

            if (typeof options.anchors[index] !== 'undefined') {
                section.attr('data-anchor', options.anchors[index]);
            }
        }

        /**
         * Sets the data-anchor attributes to the menu elements and activates the current one.
         */
        function styleMenu(section, index){
            if (typeof options.anchors[index] !== 'undefined') {
                //activating the menu / nav element on load
                if(section.hasClass(ACTIVE)){
                    activateMenuAndNav(options.anchors[index], index);
                }
            }

            //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
            if(options.menu && options.css3 && $(options.menu).closest(WRAPPER_SEL).length){
                $(options.menu).appendTo($body);
            }
        }

        /**
         * Adds internal classes to be able to provide customizable selectors
         * keeping the link with the style sheet.
         */
        function addInternalSelectors(){
            container.find(options.sectionSelector).addClass(SECTION);
            container.find(options.slideSelector).addClass(SLIDE);
        }

        /**
         * Creates the control arrows for the given section
         */
        function createSlideArrows(section){
            section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');

            if(options.controlArrowColor!='#fff'){
                section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
                section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
            }

            if(!options.loopHorizontal){
                section.find(SLIDES_ARROW_PREV_SEL).hide();
            }
        }

        /**
         * Creates a vertical navigation bar.
         */
        function addVerticalNavigation(){
            $body.append('<div id="' + SECTION_NAV + '"><ul></ul></div>');
            var nav = $(SECTION_NAV_SEL);

            nav.addClass(function() {
                return options.showActiveTooltip ? SHOW_ACTIVE_TOOLTIP + ' ' + options.navigationPosition : options.navigationPosition;
            });

            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }

                var li = '<li><a href="#' + link + '"><span></span></a>';

                // Only add tooltip if needed (defined by user)
                var tooltip = options.navigationTooltips[i];

                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' ' + options.navigationPosition + '">' + tooltip + '</div>';
                }

                li += '</li>';

                nav.find('ul').append(li);
            }

            //centering it vertically
            $(SECTION_NAV_SEL).css('margin-top', '-' + ($(SECTION_NAV_SEL).height()/2) + 'px');

            //activating the current active section
            $(SECTION_NAV_SEL).find('li').eq($(SECTION_ACTIVE_SEL).index(SECTION_SEL)).find('a').addClass(ACTIVE);
        }

        /*
        * Enables the Youtube videos API so we can control their flow if necessary.
        */
        function enableYoutubeAPI(){
            container.find('iframe[src*="youtube.com/embed/"]').each(function(){
                addURLParam($(this), 'enablejsapi=1');
            });
        }

        /**
         * Adds a new parameter and its value to the `src` of a given element
         */
        function addURLParam(element, newParam){
            var originalSrc = element.attr('src');
            element.attr('src', originalSrc + getUrlParamSign(originalSrc) + newParam);
        }

        /*
        * Returns the prefix sign to use for a new parameter in an existen URL.
        *
        * @return {String}  ? | &
        */
        function getUrlParamSign(url){
            return ( !/\?/.test( url ) ) ? '?' : '&';
        }

        /**
         * Actions and callbacks to fire afterRender
         */
        function afterRenderActions(){
            var section = $(SECTION_ACTIVE_SEL);

            section.addClass(COMPLETELY);

            lazyLoad(section);
            playMedia(section);

            if(options.scrollOverflow){
                options.scrollOverflowHandler.afterLoad();
            }

            if(isDestinyTheStartingSection()){
                $.isFunction( options.afterLoad ) && options.afterLoad.call(section, section.data('anchor'), (section.index(SECTION_SEL) + 1));
            }

            $.isFunction( options.afterRender ) && options.afterRender.call(container);
        }

        /**
         * Determines if the URL anchor destiny is the starting section (the one using 'active' class before initialization)
         */
        function isDestinyTheStartingSection(){
            var destinationSection = getSectionByAnchor(getAnchorsURL().section);
            return !destinationSection || destinationSection.length && destinationSection.index() === startingSection.index();
        }


        var isScrolling = false;
        var lastScroll = 0;

        //when scrolling...
        function scrollHandler(){
            var currentSection;

            if(!options.autoScrolling || options.scrollBar){
                var currentScroll = $window.scrollTop();
                var scrollDirection = getScrollDirection(currentScroll);
                var visibleSectionIndex = 0;
                var screen_mid = currentScroll + ($window.height() / 2.0);
                var isAtBottom = $body.height() - $window.height() === currentScroll;
                var sections =  document.querySelectorAll(SECTION_SEL);

                //when using `auto-height` for a small last section it won't be centered in the viewport
                if(isAtBottom){
                    visibleSectionIndex = sections.length - 1;
                }
                //is at top? when using `auto-height` for a small first section it won't be centered in the viewport
                else if(!currentScroll){
                    visibleSectionIndex = 0;
                }

                //taking the section which is showing more content in the viewport
                else{
                    for (var i = 0; i < sections.length; ++i) {
                        var section = sections[i];

                        // Pick the the last section which passes the middle line of the screen.
                        if (section.offsetTop <= screen_mid)
                        {
                            visibleSectionIndex = i;
                        }
                    }
                }

                if(isCompletelyInViewPort(scrollDirection)){
                    if(!$(SECTION_ACTIVE_SEL).hasClass(COMPLETELY)){
                        $(SECTION_ACTIVE_SEL).addClass(COMPLETELY).siblings().removeClass(COMPLETELY);
                    }
                }

                //geting the last one, the current one on the screen
                currentSection = $(sections).eq(visibleSectionIndex);

                //setting the visible section as active when manually scrolling
                //executing only once the first time we reach the section
                if(!currentSection.hasClass(ACTIVE)){
                    isScrolling = true;
                    var leavingSection = $(SECTION_ACTIVE_SEL);
                    var leavingSectionIndex = leavingSection.index(SECTION_SEL) + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink  = currentSection.data('anchor');
                    var sectionIndex = currentSection.index(SECTION_SEL) + 1;
                    var activeSlide = currentSection.find(SLIDE_ACTIVE_SEL);
                    var slideIndex;
                    var slideAnchorLink;

                    if(activeSlide.length){
                        slideAnchorLink = activeSlide.data('anchor');
                        slideIndex = activeSlide.index();
                    }

                    if(canScroll){
                        currentSection.addClass(ACTIVE).siblings().removeClass(ACTIVE);

                        $.isFunction( options.onLeave ) && options.onLeave.call( leavingSection, leavingSectionIndex, sectionIndex, yMovement);
                        $.isFunction( options.afterLoad ) && options.afterLoad.call( currentSection, anchorLink, sectionIndex);

                        stopMedia(leavingSection);
                        lazyLoad(currentSection);
                        playMedia(currentSection);

                        activateMenuAndNav(anchorLink, sectionIndex - 1);

                        if(options.anchors.length){
                            //needed to enter in hashChange event when using the menu with anchor links
                            lastScrolledDestiny = anchorLink;
                        }
                        setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                    }

                    //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function(){
                        isScrolling = false;
                    }, 100);
                }

                if(options.fitToSection){
                    //for the auto adjust of the viewport to fit a whole section
                    clearTimeout(scrollId2);

                    scrollId2 = setTimeout(function(){
                        //checking it again in case it changed during the delay
                        if(options.fitToSection &&

                            //is the destination element bigger than the viewport?
                            $(SECTION_ACTIVE_SEL).outerHeight() <= windowsHeight
                        ){
                            fitToSection();
                        }
                    }, options.fitToSectionDelay);
                }
            }
        }

        /**
         * Fits the site to the nearest active section
         */
        function fitToSection(){
            //checking fitToSection again in case it was set to false before the timeout delay
            if(canScroll){
                //allows to scroll to an active section and
                //if the section is already active, we prevent firing callbacks
                isResizing = true;

                scrollPage($(SECTION_ACTIVE_SEL));
                isResizing = false;
            }
        }

        /**
         * Determines whether the active section has seen in its whole or not.
         */
        function isCompletelyInViewPort(movement){
            var top = $(SECTION_ACTIVE_SEL).position().top;
            var bottom = top + $window.height();

            if(movement == 'up'){
                return bottom >= ($window.scrollTop() + $window.height());
            }
            return top <= $window.scrollTop();
        }

        /**
         * Gets the directon of the the scrolling fired by the scroll event.
         */
        function getScrollDirection(currentScroll){
            var direction = currentScroll > lastScroll ? 'down' : 'up';

            lastScroll = currentScroll;

            //needed for auto-height sections to determine if we want to scroll to the top or bottom of the destination
            previousDestTop = currentScroll;

            return direction;
        }

        /**
         * Determines the way of scrolling up or down:
         * by 'automatically' scrolling a section or by using the default and normal scrolling.
         */
        function scrolling(type){
            if (!isScrollAllowed.m[type]){
                return;
            }

            var scrollSection = (type === 'down') ? moveSectionDown : moveSectionUp;

            if(options.scrollOverflow){
                var scrollable = options.scrollOverflowHandler.scrollable($(SECTION_ACTIVE_SEL));
                var check = (type === 'down') ? 'bottom' : 'top';

                if(scrollable.length > 0 ){
                    //is the scrollbar at the start/end of the scroll?
                    if(options.scrollOverflowHandler.isScrolled(check, scrollable)){
                        scrollSection();
                    }else{
                        return true;
                    }
                }else{
                    // moved up/down
                    scrollSection();
                }
            }else{
                // moved up/down
                scrollSection();
            }
        }

        /*
        * Preventing bouncing in iOS #2285
        */
        function preventBouncing(event){
            var e = event.originalEvent;
            if(options.autoScrolling && isReallyTouch(e)){
                //preventing the easing on iOS devices
                event.preventDefault();
            }
        }

        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * This way, the touchstart and the touch moves shows an small difference between them which is the
        * used one to determine the direction.
        */
        function touchMoveHandler(event){
            var e = event.originalEvent;
            var activeSection = $(e.target).closest(SECTION_SEL);

            // additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
            if (isReallyTouch(e) ) {

                if(options.autoScrolling){
                    //preventing the easing on iOS devices
                    event.preventDefault();
                }

                var touchEvents = getEventsPage(e);

                touchEndY = touchEvents.y;
                touchEndX = touchEvents.x;

                //if movement in the X axys is greater than in the Y and the currect section has slides...
                if (activeSection.find(SLIDES_WRAPPER_SEL).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                    //is the movement greater than the minimum resistance to scroll?
                    if (!slideMoving && Math.abs(touchStartX - touchEndX) > ($window.outerWidth() / 100 * options.touchSensitivity)) {
                        if (touchStartX > touchEndX) {
                            if(isScrollAllowed.m.right){
                                moveSlideRight(activeSection); //next
                            }
                        } else {
                            if(isScrollAllowed.m.left){
                                moveSlideLeft(activeSection); //prev
                            }
                        }
                    }
                }

                //vertical scrolling (only when autoScrolling is enabled)
                else if(options.autoScrolling && canScroll){

                    //is the movement greater than the minimum resistance to scroll?
                    if (Math.abs(touchStartY - touchEndY) > ($window.height() / 100 * options.touchSensitivity)) {
                        if (touchStartY > touchEndY) {
                            scrolling('down');
                        } else if (touchEndY > touchStartY) {
                            scrolling('up');
                        }
                    }
                }
            }
        }

        /**
         * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
         * this way we make sure that is really a touch event what IE is detecting.
         */
        function isReallyTouch(e){
            //if is not IE   ||  IE is detecting `touch` or `pen`
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        /**
         * Handler for the touch start event.
         */
        function touchStartHandler(event){
            var e = event.originalEvent;

            //stopping the auto scroll to adjust to a section
            if(options.fitToSection){
                $htmlBody.stop();
            }

            if(isReallyTouch(e)){
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        /**
         * Gets the average of the last `number` elements of the given array.
         */
        function getAverage(elements, number){
            var sum = 0;

            //taking `number` elements from the end to make the average, if there are not enought, 1
            var lastElements = elements.slice(Math.max(elements.length - number, 1));

            for(var i = 0; i < lastElements.length; i++){
                sum = sum + lastElements[i];
            }

            return Math.ceil(sum/number);
        }

        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        var prevTime = new Date().getTime();

        function MouseWheelHandler(e) {
            var curTime = new Date().getTime();
            var isNormalScroll = $(COMPLETELY_SEL).hasClass(NORMAL_SCROLL);

            //autoscrolling and not zooming?
            if(options.autoScrolling && !controlPressed && !isNormalScroll){
                // cross-browser wheel delta
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));

                var horizontalDetection = typeof e.wheelDeltaX !== 'undefined' || typeof e.deltaX !== 'undefined';
                var isScrollingVertically = (Math.abs(e.wheelDeltaX) < Math.abs(e.wheelDelta)) || (Math.abs(e.deltaX ) < Math.abs(e.deltaY) || !horizontalDetection);

                //Limiting the array to 150 (lets not waste memory!)
                if(scrollings.length > 149){
                    scrollings.shift();
                }

                //keeping record of the previous scrollings
                scrollings.push(Math.abs(value));

                //preventing to scroll the site on mouse wheel when scrollbar is present
                if(options.scrollBar){
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                }

                //time difference between the last scroll and the current one
                var timeDiff = curTime-prevTime;
                prevTime = curTime;

                //haven't they scrolled in a while?
                //(enough to be consider a different scrolling action to scroll another section)
                if(timeDiff > 200){
                    //emptying the array, we dont care about old scrollings for our averages
                    scrollings = [];
                }

                if(canScroll){
                    var averageEnd = getAverage(scrollings, 10);
                    var averageMiddle = getAverage(scrollings, 70);
                    var isAccelerating = averageEnd >= averageMiddle;

                    //to avoid double swipes...
                    if(isAccelerating && isScrollingVertically){
                        //scrolling down?
                        if (delta < 0) {
                            scrolling('down');

                            //scrolling up?
                        }else {
                            scrolling('up');
                        }
                    }
                }

                return false;
            }

            if(options.fitToSection){
                //stopping the auto scroll to adjust to a section
                $htmlBody.stop();
            }
        }

        /**
         * Slides a slider to the given direction.
         * Optional `section` param.
         */
        function moveSlide(direction, section){
            var activeSection = typeof section === 'undefined' ? $(SECTION_ACTIVE_SEL) : section;
            var slides = activeSection.find(SLIDES_WRAPPER_SEL);
            var numSlides = slides.find(SLIDE_SEL).length;

            // more than one slide needed and nothing should be sliding
            if (!slides.length || slideMoving || numSlides < 2) {
                return;
            }

            var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
            var destiny = null;

            if(direction === 'left'){
                destiny = currentSlide.prev(SLIDE_SEL);
            }else{
                destiny = currentSlide.next(SLIDE_SEL);
            }

            //isn't there a next slide in the secuence?
            if(!destiny.length){
                //respect loopHorizontal settin
                if (!options.loopHorizontal) return;

                if(direction === 'left'){
                    destiny = currentSlide.siblings(':last');
                }else{
                    destiny = currentSlide.siblings(':first');
                }
            }

            slideMoving = true;

            landscapeScroll(slides, destiny, direction);
        }

        /**
         * Maintains the active slides in the viewport
         * (Because the `scroll` animation might get lost with some actions, such as when using continuousVertical)
         */
        function keepSlidesPosition(){
            $(SLIDE_ACTIVE_SEL).each(function(){
                silentLandscapeScroll($(this), 'internal');
            });
        }

        var previousDestTop = 0;
        /**
         * Returns the destination Y position based on the scrolling direction and
         * the height of the section.
         */
        function getDestinationPosition(element){
            var elemPosition = element.position();

            //top of the desination will be at the top of the viewport
            var position = elemPosition.top;
            var isScrollingDown =  elemPosition.top > previousDestTop;
            var sectionBottom = position - windowsHeight + element.outerHeight();
            var bigSectionsDestination = options.bigSectionsDestination;

            //is the destination element bigger than the viewport?
            if(element.outerHeight() > windowsHeight){
                //scrolling up?
                if(!isScrollingDown && !bigSectionsDestination || bigSectionsDestination === 'bottom' ){
                    position = sectionBottom;
                }
            }

            //sections equal or smaller than the viewport height && scrolling down? ||  is resizing and its in the last section
            else if(isScrollingDown || (isResizing && element.is(':last-child')) ){
                //The bottom of the destination will be at the bottom of the viewport
                position = sectionBottom;
            }

            /*
            Keeping record of the last scrolled position to determine the scrolling direction.
            No conventional methods can be used as the scroll bar might not be present
            AND the section might not be active if it is auto-height and didnt reach the middle
            of the viewport.
            */
            previousDestTop = position;
            return position;
        }

        /**
         * Scrolls the site to the given element and scrolls to the slide if a callback is given.
         */
        function scrollPage(element, callback, isMovementUp){
            if(typeof element === 'undefined'){ return; } //there's no element to scroll, leaving the function

            var dtop = getDestinationPosition(element);
            var slideAnchorLink;
            var slideIndex;

            //local variables
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dtop: dtop,
                yMovement: getYmovement(element),
                anchorLink: element.data('anchor'),
                sectionIndex: element.index(SECTION_SEL),
                activeSlide: element.find(SLIDE_ACTIVE_SEL),
                activeSection: $(SECTION_ACTIVE_SEL),
                leavingSection: $(SECTION_ACTIVE_SEL).index(SECTION_SEL) + 1,

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };

            //quiting when destination scroll is the same as the current one
            if((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $window.scrollTop() === v.dtop && !element.hasClass(AUTO_HEIGHT) )){ return; }

            if(v.activeSlide.length){
                slideAnchorLink = v.activeSlide.data('anchor');
                slideIndex = v.activeSlide.index();
            }

            //callback (onLeave) if the site is not just resizing and readjusting the slides
            if($.isFunction(options.onLeave) && !v.localIsResizing){
                if(options.onLeave.call(v.activeSection, v.leavingSection, (v.sectionIndex + 1), v.yMovement) === false){
                    return;
                }
            }

            // If continuousVertical && we need to wrap around
            if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
                ((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
                    (v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

                v = createInfiniteSections(v);
            }

            //pausing media of the leaving section (if we are not just resizing, as destinatino will be the same one)
            if(!v.localIsResizing){
                stopMedia(v.activeSection);
            }

            if(options.scrollOverflow){
                options.scrollOverflowHandler.beforeLeave();
            }

            element.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            lazyLoad(element);

            if(options.scrollOverflow){
                options.scrollOverflowHandler.onLeave();
            }

            //preventing from activating the MouseWheelHandler event
            //more than once if the page is scrolling
            canScroll = false;

            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

            performMovement(v);

            //flag to avoid callingn `scrollPage()` twice in case of using anchor links
            lastScrolledDestiny = v.anchorLink;

            //avoid firing it twice (as it does also on scroll)
            activateMenuAndNav(v.anchorLink, v.sectionIndex);
        }

        /**
         * Performs the vertical movement (by CSS3 or by jQuery)
         */
        function performMovement(v){
            // using CSS3 translate functionality
            if (options.css3 && options.autoScrolling && !options.scrollBar) {

                // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
                // that's why we round it to 0.
                var translate3d = 'translate3d(0px, -' + Math.round(v.dtop) + 'px, 0px)';
                transformContainer(translate3d, true);

                //even when the scrollingSpeed is 0 there's a little delay, which might cause the
                //scrollingSpeed to change in case of using silentMoveTo();
                if(options.scrollingSpeed){
                    clearTimeout(afterSectionLoadsId);
                    afterSectionLoadsId = setTimeout(function () {
                        afterSectionLoads(v);
                    }, options.scrollingSpeed);
                }else{
                    afterSectionLoads(v);
                }
            }

            // using jQuery animate
            else{
                var scrollSettings = getScrollSettings(v);

                $(scrollSettings.element).animate(
                    scrollSettings.options,
                    options.scrollingSpeed, options.easing).promise().done(function () { //only one single callback in case of animating  `html, body`
                    if(options.scrollBar){

                        /* Hack!
                        The timeout prevents setting the most dominant section in the viewport as "active" when the user
                        scrolled to a smaller section by using the mousewheel (auto scrolling) rather than draging the scroll bar.

                        When using scrollBar:true It seems like the scroll events still getting propagated even after the scrolling animation has finished.
                        */
                        setTimeout(function(){
                            afterSectionLoads(v);
                        },30);
                    }else{
                        afterSectionLoads(v);
                    }
                });
            }
        }

        /**
         * Gets the scrolling settings depending on the plugin autoScrolling option
         */
        function getScrollSettings(v){
            var scroll = {};

            if(options.autoScrolling && !options.scrollBar){
                scroll.options = { 'top': -v.dtop};
                scroll.element = WRAPPER_SEL;
            }else{
                scroll.options = { 'scrollTop': v.dtop};
                scroll.element = 'html, body';
            }

            return scroll;
        }

        /**
         * Adds sections before or after the current one to create the infinite effect.
         */
        function createInfiniteSections(v){
            // Scrolling down
            if (!v.isMovementUp) {
                // Move all previous sections to after the active section
                $(SECTION_ACTIVE_SEL).after(v.activeSection.prevAll(SECTION_SEL).get().reverse());
            }
            else { // Scrolling up
                // Move all next sections to before the active section
                $(SECTION_ACTIVE_SEL).before(v.activeSection.nextAll(SECTION_SEL));
            }

            // Maintain the displayed position (now that we changed the element order)
            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();

            // save for later the elements that still need to be reordered
            v.wrapAroundElements = v.activeSection;

            // Recalculate animation variables
            v.dtop = v.element.position().top;
            v.yMovement = getYmovement(v.element);

            //sections will temporally have another position in the DOM
            //updating this values in case we need them
            v.leavingSection = v.activeSection.index(SECTION_SEL) + 1;
            v.sectionIndex = v.element.index(SECTION_SEL);

            return v;
        }

        /**
         * Fix section order after continuousVertical changes have been animated
         */
        function continuousVerticalFixSectionOrder (v) {
            // If continuousVertical is in effect (and autoScrolling would also be in effect then),
            // finish moving the elements around so the direct navigation will function more simply
            if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
                return;
            }

            if (v.isMovementUp) {
                $(SECTION_FIRST_SEL).before(v.wrapAroundElements);
            }
            else {
                $(SECTION_LAST_SEL).after(v.wrapAroundElements);
            }

            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();
        }


        /**
         * Actions to do once the section is loaded.
         */
        function afterSectionLoads (v){
            continuousVerticalFixSectionOrder(v);

            //callback (afterLoad) if the site is not just resizing and readjusting the slides
            $.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(v.element, v.anchorLink, (v.sectionIndex + 1));

            if(options.scrollOverflow){
                options.scrollOverflowHandler.afterLoad();
            }

            if(!v.localIsResizing){
                playMedia(v.element);
            }

            v.element.addClass(COMPLETELY).siblings().removeClass(COMPLETELY);

            canScroll = true;

            $.isFunction(v.callback) && v.callback.call(this);
        }

        /**
         * Sets the value for the given attribute from the `data-` attribute with the same suffix
         * ie: data-srcset ==> srcset  |  data-src ==> src
         */
        function setSrc(element, attribute){
            element
                .attr(attribute, element.data(attribute))
                .removeAttr('data-' + attribute);
        }

        /**
         * Lazy loads image, video and audio elements.
         */
        function lazyLoad(destiny){
            if (!options.lazyLoading){
                return;
            }

            var panel = getSlideOrSection(destiny);
            var element;

            panel.find('img[data-src], img[data-srcset], source[data-src], source[data-srcset], video[data-src], audio[data-src], iframe[data-src]').each(function(){
                element = $(this);

                $.each(['src', 'srcset'], function(index, type){
                    var attribute = element.attr('data-' + type);
                    if(typeof attribute !== 'undefined' && attribute){
                        setSrc(element, type);
                    }
                });

                if(element.is('source')){
                    var typeToPlay = element.closest('video').length ? 'video' : 'audio';
                    element.closest(typeToPlay).get(0).load();
                }
            });
        }

        /**
         * Plays video and audio elements.
         */
        function playMedia(destiny){
            var panel = getSlideOrSection(destiny);

            //playing HTML5 media elements
            panel.find('video, audio').each(function(){
                var element = $(this).get(0);

                if( element.hasAttribute('data-autoplay') && typeof element.play === 'function' ) {
                    element.play();
                }
            });

            //youtube videos
            panel.find('iframe[src*="youtube.com/embed/"]').each(function(){
                var element = $(this).get(0);

                if ( element.hasAttribute('data-autoplay') ){
                    playYoutube(element);
                }

                //in case the URL was not loaded yet. On page load we need time for the new URL (with the API string) to load.
                element.onload = function() {
                    if ( element.hasAttribute('data-autoplay') ){
                        playYoutube(element);
                    }
                };
            });
        }

        /**
         * Plays a youtube video
         */
        function playYoutube(element){
            element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }

        /**
         * Stops video and audio elements.
         */
        function stopMedia(destiny){
            var panel = getSlideOrSection(destiny);

            //stopping HTML5 media elements
            panel.find('video, audio').each(function(){
                var element = $(this).get(0);

                if( !element.hasAttribute('data-keepplaying') && typeof element.pause === 'function' ) {
                    element.pause();
                }
            });

            //youtube videos
            panel.find('iframe[src*="youtube.com/embed/"]').each(function(){
                var element = $(this).get(0);

                if( /youtube\.com\/embed\//.test($(this).attr('src')) && !element.hasAttribute('data-keepplaying')){
                    $(this).get(0).contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
                }
            });
        }

        /**
         * Gets the active slide (or section) for the given section
         */
        function getSlideOrSection(destiny){
            var slide = destiny.find(SLIDE_ACTIVE_SEL);
            if( slide.length ) {
                destiny = $(slide);
            }

            return destiny;
        }

        /**
         * Scrolls to the anchor in the URL when loading the site
         */
        function scrollToAnchor(){
            var anchors =  getAnchorsURL();
            var sectionAnchor = anchors.section;
            var slideAnchor = anchors.slide;

            if(sectionAnchor){  //if theres any #
                if(options.animateAnchor){
                    scrollPageAndSlide(sectionAnchor, slideAnchor);
                }else{
                    silentMoveTo(sectionAnchor, slideAnchor);
                }
            }
        }

        /**
         * Detecting any change on the URL to scroll to the given anchor link
         * (a way to detect back history button as we play with the hashes on the URL)
         */
        function hashChangeHandler(){
            if(!isScrolling && !options.lockAnchors){
                var anchors = getAnchorsURL();
                var sectionAnchor = anchors.section;
                var slideAnchor = anchors.slide;

                //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
                var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slideAnchor === 'undefined' && !slideMoving);

                if(sectionAnchor.length){
                    /*in order to call scrollpage() only once for each destination at a time
                    It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                    event is fired on every scroll too.*/
                    if ((sectionAnchor && sectionAnchor !== lastScrolledDestiny) && !isFirstSlideMove
                        || isFirstScrollMove
                        || (!slideMoving && lastScrolledSlide != slideAnchor )){

                        scrollPageAndSlide(sectionAnchor, slideAnchor);
                    }
                }
            }
        }

        //gets the URL anchors (section and slide)
        function getAnchorsURL(){
            var section;
            var slide;
            var hash = window.location.hash;

            if(hash.length){
                //getting the anchor link in the URL and deleting the `#`
                var anchorsParts =  hash.replace('#', '').split('/');

                //using / for visual reasons and not as a section/slide separator #2803
                var isFunkyAnchor = hash.indexOf('#/') > -1;

                section = isFunkyAnchor ? '/' + anchorsParts[1] : decodeURIComponent(anchorsParts[0]);

                var slideAnchor = isFunkyAnchor ? anchorsParts[2] : anchorsParts[1];
                if(slideAnchor && slideAnchor.length){
                    slide = decodeURIComponent(slideAnchor);
                }
            }

            return {
                section: section,
                slide: slide
            }
        }

        //Sliding with arrow keys, both, vertical and horizontal
        function keydownHandler(e) {
            clearTimeout(keydownId);

            var activeElement = $(':focus');
            var keyCode = e.which;

            //tab?
            if(keyCode === 9){
                onTab(e);
            }

            else if(!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select') &&
                activeElement.attr('contentEditable') !== "true" && activeElement.attr('contentEditable') !== '' &&
                options.keyboardScrolling && options.autoScrolling){

                //preventing the scroll with arrow keys & spacebar & Page Up & Down keys
                var keyControls = [40, 38, 32, 33, 34];
                if($.inArray(keyCode, keyControls) > -1){
                    e.preventDefault();
                }

                controlPressed = e.ctrlKey;

                keydownId = setTimeout(function(){
                    onkeydown(e);
                },150);
            }
        }

        function tooltipTextHandler(){
            $(this).prev().trigger('click');
        }

        //to prevent scrolling while zooming
        function keyUpHandler(e){
            if(isWindowFocused){ //the keyup gets fired on new tab ctrl + t in Firefox
                controlPressed = e.ctrlKey;
            }
        }

        //binding the mousemove when the mouse's middle button is released
        function mouseDownHandler(e){
            //middle button
            if (e.which == 2){
                oldPageY = e.pageY;
                container.on('mousemove', mouseMoveHandler);
            }
        }

        //unbinding the mousemove when the mouse's middle button is released
        function mouseUpHandler(e){
            //middle button
            if (e.which == 2){
                container.off('mousemove');
            }
        }

        //Scrolling horizontally when clicking on the slider controls.
        function slideArrowHandler(){
            var section = $(this).closest(SECTION_SEL);

            if ($(this).hasClass(SLIDES_PREV)) {
                if(isScrollAllowed.m.left){
                    moveSlideLeft(section);
                }
            } else {
                if(isScrollAllowed.m.right){
                    moveSlideRight(section);
                }
            }
        }

        //when opening a new tab (ctrl + t), `control` won't be pressed when coming back.
        function blurHandler(){
            isWindowFocused = false;
            controlPressed = false;
        }

        //Scrolls to the section when clicking the navigation bullet
        function sectionBulletHandler(e){
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($(SECTION_SEL).eq(index));
        }

        //Scrolls the slider to the given slide destination for the given section
        function slideBulletHandler(e){
            e.preventDefault();
            var slides = $(this).closest(SECTION_SEL).find(SLIDES_WRAPPER_SEL);
            var destiny = slides.find(SLIDE_SEL).eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        }

        /**
         * Keydown event
         */
        function onkeydown(e){
            var shiftPressed = e.shiftKey;

            //do nothing if we can not scroll or we are not using horizotnal key arrows.
            if(!canScroll && [37,39].indexOf(e.which) < 0){
                return;
            }

            switch (e.which) {
                //up
                case 38:
                case 33:
                    if(isScrollAllowed.k.up){
                        moveSectionUp();
                    }
                    break;

                //down
                case 32: //spacebar
                    if(shiftPressed && isScrollAllowed.k.up){
                        moveSectionUp();
                        break;
                    }
                /* falls through */
                case 40:
                case 34:
                    if(isScrollAllowed.k.down){
                        moveSectionDown();
                    }
                    break;

                //Home
                case 36:
                    if(isScrollAllowed.k.up){
                        moveTo(1);
                    }
                    break;

                //End
                case 35:
                    if(isScrollAllowed.k.down){
                        moveTo( $(SECTION_SEL).length );
                    }
                    break;

                //left
                case 37:
                    if(isScrollAllowed.k.left){
                        moveSlideLeft();
                    }
                    break;

                //right
                case 39:
                    if(isScrollAllowed.k.right){
                        moveSlideRight();
                    }
                    break;

                default:
                    return; // exit this handler for other keys
            }
        }

        /**
         * Makes sure the tab key will only focus elements within the current section/slide
         * preventing this way from breaking the page.
         * Based on "Modals and keyboard traps"
         * from https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex
         */
        function onTab(e){
            var isShiftPressed = e.shiftKey;
            var activeElement = $(':focus');
            var activeSection = $(SECTION_ACTIVE_SEL);
            var activeSlide = activeSection.find(SLIDE_ACTIVE_SEL);
            var focusableWrapper = activeSlide.length ? activeSlide : activeSection;
            var focusableElements = focusableWrapper.find(focusableElementsString);

            function preventAndFocusFirst(e){
                e.preventDefault();
                return focusableElements.first().focus();
            }

            //is there an element with focus?
            if(activeElement.length){
                if(!activeElement.closest(SECTION_ACTIVE_SEL, SLIDE_ACTIVE_SEL).length){
                    activeElement = preventAndFocusFirst(e);
                }
            }

            //no element if focused? Let's focus the first one of the section/slide
            else{
                preventAndFocusFirst(e);
            }

            //when reached the first or last focusable element of the section/slide
            //we prevent the tab action to keep it in the last focusable element
            if(!isShiftPressed && activeElement.is(focusableElements.last()) ||
                isShiftPressed && activeElement.is(focusableElements.first())
            ){
                e.preventDefault();
            }
        }

        /**
         * Detecting the direction of the mouse movement.
         * Used only for the middle button of the mouse.
         */
        var oldPageY = 0;
        function mouseMoveHandler(e){
            if(canScroll){
                // moving up
                if (e.pageY < oldPageY && isScrollAllowed.m.up){
                    moveSectionUp();
                }

                // moving down
                else if(e.pageY > oldPageY && isScrollAllowed.m.down){
                    moveSectionDown();
                }
            }
            oldPageY = e.pageY;
        }

        /**
         * Scrolls horizontal sliders.
         */
        function landscapeScroll(slides, destiny, direction){
            var section = slides.closest(SECTION_SEL);
            var v = {
                slides: slides,
                destiny: destiny,
                direction: direction,
                destinyPos: destiny.position(),
                slideIndex: destiny.index(),
                section: section,
                sectionIndex: section.index(SECTION_SEL),
                anchorLink: section.data('anchor'),
                slidesNav: section.find(SLIDES_NAV_SEL),
                slideAnchor:  getAnchor(destiny),
                prevSlide: section.find(SLIDE_ACTIVE_SEL),
                prevSlideIndex: section.find(SLIDE_ACTIVE_SEL).index(),

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };
            v.xMovement = getXmovement(v.prevSlideIndex, v.slideIndex);

            //important!! Only do it when not resizing
            if(!v.localIsResizing){
                //preventing from scrolling to the next/prev section when using scrollHorizontally
                canScroll = false;
            }

            if(options.onSlideLeave){

                //if the site is not just resizing and readjusting the slides
                if(!v.localIsResizing && v.xMovement!=='none'){
                    if($.isFunction( options.onSlideLeave )){
                        if(options.onSlideLeave.call( v.prevSlide, v.anchorLink, (v.sectionIndex + 1), v.prevSlideIndex, v.direction, v.slideIndex ) === false){
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }

            destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);

            if(!v.localIsResizing){
                stopMedia(v.prevSlide);
                lazyLoad(destiny);
            }

            if(!options.loopHorizontal && options.controlArrows){
                //hidding it for the fist slide, showing for the rest
                section.find(SLIDES_ARROW_PREV_SEL).toggle(v.slideIndex!==0);

                //hidding it for the last slide, showing for the rest
                section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if(section.hasClass(ACTIVE) && !v.localIsResizing){
                setState(v.slideIndex, v.slideAnchor, v.anchorLink, v.sectionIndex);
            }

            performHorizontalMove(slides, v, true);
        }


        function afterSlideLoads(v){
            activeSlidesNavigation(v.slidesNav, v.slideIndex);

            //if the site is not just resizing and readjusting the slides
            if(!v.localIsResizing){
                $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( v.destiny, v.anchorLink, (v.sectionIndex + 1), v.slideAnchor, v.slideIndex);

                //needs to be inside the condition to prevent problems with continuousVertical and scrollHorizontally
                //and to prevent double scroll right after a windows resize
                canScroll = true;

                playMedia(v.destiny);
            }

            //letting them slide again
            slideMoving = false;
        }

        /**
         * Performs the horizontal movement. (CSS3 or jQuery)
         *
         * @param fireCallback {Bool} - determines whether or not to fire the callback
         */
        function performHorizontalMove(slides, v, fireCallback){
            var destinyPos = v.destinyPos;

            if(options.css3){
                var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';

                addAnimation(slides.find(SLIDES_CONTAINER_SEL)).css(getTransforms(translate3d));

                afterSlideLoadsId = setTimeout(function(){
                    fireCallback && afterSlideLoads(v);
                }, options.scrollingSpeed, options.easing);
            }else{
                slides.animate({
                    scrollLeft : Math.round(destinyPos.left)
                }, options.scrollingSpeed, options.easing, function() {

                    fireCallback && afterSlideLoads(v);
                });
            }
        }

        /**
         * Sets the state for the horizontal bullet navigations.
         */
        function activeSlidesNavigation(slidesNav, slideIndex){
            slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
            slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
        }

        var previousHeight = windowsHeight;

        //when resizing the site, we adjust the heights of the sections, slimScroll...
        function resizeHandler(){
            //checking if it needs to get responsive
            responsive();

            // rebuild immediately on touch devices
            if (isTouchDevice) {
                var activeElement = $(document.activeElement);

                //if the keyboard is NOT visible
                if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select')) {
                    var currentHeight = $window.height();

                    //making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
                    if( Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100) ){
                        reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            }else{
                //in order to call the functions only when the resize is finished
                //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
                clearTimeout(resizeId);

                resizeId = setTimeout(function(){
                    reBuild(true);
                }, 350);
            }
        }

        /**
         * Checks if the site needs to get responsive and disables autoScrolling if so.
         * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
         */
        function responsive(){
            var widthLimit = options.responsive || options.responsiveWidth; //backwards compatiblity
            var heightLimit = options.responsiveHeight;

            //only calculating what we need. Remember its called on the resize event.
            var isBreakingPointWidth = widthLimit && $window.outerWidth() < widthLimit;
            var isBreakingPointHeight = heightLimit && $window.height() < heightLimit;

            if(widthLimit && heightLimit){
                setResponsive(isBreakingPointWidth || isBreakingPointHeight);
            }
            else if(widthLimit){
                setResponsive(isBreakingPointWidth);
            }
            else if(heightLimit){
                setResponsive(isBreakingPointHeight);
            }
        }

        /**
         * Adds transition animations for the given element
         */
        function addAnimation(element){
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

            element.removeClass(NO_TRANSITION);
            return element.css({
                '-webkit-transition': transition,
                'transition': transition
            });
        }

        /**
         * Remove transition animations for the given element
         */
        function removeAnimation(element){
            return element.addClass(NO_TRANSITION);
        }

        /**
         * Activating the vertical navigation bullets according to the given slide name.
         */
        function activateNavDots(name, sectionIndex){
            if(options.navigation){
                $(SECTION_NAV_SEL).find(ACTIVE_SEL).removeClass(ACTIVE);
                if(name){
                    $(SECTION_NAV_SEL).find('a[href="#' + name + '"]').addClass(ACTIVE);
                }else{
                    $(SECTION_NAV_SEL).find('li').eq(sectionIndex).find('a').addClass(ACTIVE);
                }
            }
        }

        /**
         * Activating the website main menu elements according to the given slide name.
         */
        function activateMenuElement(name){
            if(options.menu){
                $(options.menu).find(ACTIVE_SEL).removeClass(ACTIVE);
                $(options.menu).find('[data-menuanchor="'+name+'"]').addClass(ACTIVE);
            }
        }

        /**
         * Sets to active the current menu and vertical nav items.
         */
        function activateMenuAndNav(anchor, index){
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        /**
         * Retuns `up` or `down` depending on the scrolling movement to reach its destination
         * from the current section.
         */
        function getYmovement(destiny){
            var fromIndex = $(SECTION_ACTIVE_SEL).index(SECTION_SEL);
            var toIndex = destiny.index(SECTION_SEL);
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
         * Retuns `right` or `left` depending on the scrolling movement to reach its destination
         * from the current slide.
         */
        function getXmovement(fromIndex, toIndex){
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }

        function addTableClass(element){
            //In case we are styling for the 2nd time as in with reponsiveSlides
            if(!element.hasClass(TABLE)){
                element.addClass(TABLE).wrapInner('<div class="' + TABLE_CELL + '" style="height:' + getTableHeight(element) + 'px;" />');
            }
        }

        function getTableHeight(element){
            var sectionHeight = windowsHeight;

            if(options.paddingTop || options.paddingBottom){
                var section = element;
                if(!section.hasClass(SECTION)){
                    section = element.closest(SECTION_SEL);
                }

                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
         * Adds a css3 transform property to the container class with or without animation depending on the animated param.
         */
        function transformContainer(translate3d, animated){
            if(animated){
                addAnimation(container);
            }else{
                removeAnimation(container);
            }

            container.css(getTransforms(translate3d));

            //syncronously removing the class after the animation has been applied.
            setTimeout(function(){
                container.removeClass(NO_TRANSITION);
            },10);
        }

        /**
         * Gets a section by its anchor / index
         */
        function getSectionByAnchor(sectionAnchor){
            var section = container.find(SECTION_SEL + '[data-anchor="'+sectionAnchor+'"]');
            if(!section.length){
                var sectionIndex = typeof sectionAnchor !== 'undefined' ? sectionAnchor -1 : 0;
                section = $(SECTION_SEL).eq(sectionIndex);
            }

            return section;
        }

        /**
         * Gets a slide inside a given section by its anchor / index
         */
        function getSlideByAnchor(slideAnchor, section){
            var slide = section.find(SLIDE_SEL + '[data-anchor="'+slideAnchor+'"]');
            if(!slide.length){
                slideAnchor = typeof slideAnchor !== 'undefined' ? slideAnchor : 0;
                slide = section.find(SLIDE_SEL).eq(slideAnchor);
            }

            return slide;
        }

        /**
         * Scrolls to the given section and slide anchors
         */
        function scrollPageAndSlide(sectionAnchor, slideAnchor){
            var section = getSectionByAnchor(sectionAnchor);

            //do nothing if there's no section with the given anchor name
            if(!section.length) return;

            var slide = getSlideByAnchor(slideAnchor, section);

            //we need to scroll to the section and then to the slide
            if (sectionAnchor !== lastScrolledDestiny && !section.hasClass(ACTIVE)){
                scrollPage(section, function(){
                    scrollSlider(slide);
                });
            }
            //if we were already in the section
            else{
                scrollSlider(slide);
            }
        }

        /**
         * Scrolls the slider to the given slide destination for the given section
         */
        function scrollSlider(slide){
            if(slide.length){
                landscapeScroll(slide.closest(SLIDES_WRAPPER_SEL), slide);
            }
        }

        /**
         * Creates a landscape navigation bar with dots for horizontal sliders.
         */
        function addSlidesNavigation(section, numSlides){
            section.append('<div class="' + SLIDES_NAV + '"><ul></ul></div>');
            var nav = section.find(SLIDES_NAV_SEL);

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width()/2) + 'px');

            nav.find('li').first().find('a').addClass(ACTIVE);
        }


        /**
         * Sets the state of the website depending on the active section/slide.
         * It changes the URL hash when needed and updates the body class.
         */
        function setState(slideIndex, slideAnchor, anchorLink, sectionIndex){
            var sectionHash = '';

            if(options.anchors.length && !options.lockAnchors){

                //isn't it the first slide?
                if(slideIndex){
                    if(typeof anchorLink !== 'undefined'){
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if(typeof slideAnchor === 'undefined'){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);

                    //first slide won't have slide anchor, just the section one
                }else if(typeof slideIndex !== 'undefined'){
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                }

                //section without slides
                else{
                    setUrlHash(anchorLink);
                }
            }

            setBodyClass();
        }

        /**
         * Sets the URL hash.
         */
        function setUrlHash(url){
            if(options.recordHistory){
                location.hash = url;
            }else{
                //Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
                if(isTouchDevice || isTouch){
                    window.history.replaceState(undefined, undefined, '#' + url);
                }else{
                    var baseUrl = window.location.href.split('#')[0];
                    window.location.replace( baseUrl + '#' + url );
                }
            }
        }

        /**
         * Gets the anchor for the given slide / section. Its index will be used if there's none.
         */
        function getAnchor(element){
            var anchor = element.data('anchor');
            var index = element.index();

            //Slide without anchor link? We take the index instead.
            if(typeof anchor === 'undefined'){
                anchor = index;
            }

            return anchor;
        }

        /**
         * Sets a class for the body of the page depending on the active section / slide
         */
        function setBodyClass(){
            var section = $(SECTION_ACTIVE_SEL);
            var slide = section.find(SLIDE_ACTIVE_SEL);

            var sectionAnchor = getAnchor(section);
            var slideAnchor = getAnchor(slide);

            var text = String(sectionAnchor);

            if(slide.length){
                text = text + '-' + slideAnchor;
            }

            //changing slash for dash to make it a valid CSS style
            text = text.replace('/', '-').replace('#','');

            //removing previous anchor classes
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body[0].className = $body[0].className.replace(classRe, '');

            //adding the current anchor
            $body.addClass(VIEWING_PREFIX + '-' + text);
        }

        /**
         * Checks for translate3d support
         * @return boolean
         * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
         */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        /**
         * Removes the auto scrolling action fired by the mouse wheel and trackpad.
         * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
         */
        function removeMouseWheelHandler(){
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
                document.removeEventListener('MozMousePixelScroll', MouseWheelHandler, false); //old Firefox
            } else {
                document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
         * Adds the auto scrolling action for the mouse wheel and trackpad.
         * After this function is called, the mousewheel and trackpad movements will scroll through sections
         * https://developer.mozilla.org/en-US/docs/Web/Events/wheel
         */
        function addMouseWheelHandler(){
            var prefix = '';
            var _addEventListener;

            if (window.addEventListener){
                _addEventListener = "addEventListener";
            }else{
                _addEventListener = "attachEvent";
                prefix = 'on';
            }

            // detect available wheel event
            var support = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
                    'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox


            if(support == 'DOMMouseScroll'){
                document[ _addEventListener ](prefix + 'MozMousePixelScroll', MouseWheelHandler, false);
            }

            //handle MozMousePixelScroll in older Firefox
            else{
                document[ _addEventListener ](prefix + support, MouseWheelHandler, false);
            }
        }

        /**
         * Binding the mousemove when the mouse's middle button is pressed
         */
        function addMiddleWheelHandler(){
            container
                .on('mousedown', mouseDownHandler)
                .on('mouseup', mouseUpHandler);
        }

        /**
         * Unbinding the mousemove when the mouse's middle button is released
         */
        function removeMiddleWheelHandler(){
            container
                .off('mousedown', mouseDownHandler)
                .off('mouseup', mouseUpHandler);
        }

        /**
         * Adds the possibility to auto scroll through sections on touch devices.
         */
        function addTouchHandler(){
            if(isTouchDevice || isTouch){
                if(options.autoScrolling){
                    $body.off(events.touchmove).on(events.touchmove, preventBouncing);
                }

                $(WRAPPER_SEL)
                    .off(events.touchstart).on(events.touchstart, touchStartHandler)
                    .off(events.touchmove).on(events.touchmove, touchMoveHandler);
            }
        }

        /**
         * Removes the auto scrolling for touch devices.
         */
        function removeTouchHandler(){
            if(isTouchDevice || isTouch){
                if(options.autoScrolling){
                    $body.off(events.touchmove);
                }

                $(WRAPPER_SEL)
                    .off(events.touchstart)
                    .off(events.touchmove);
            }
        }

        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer(){
            var pointer;

            //IE >= 11 & rest of browsers
            if(window.PointerEvent){
                pointer = { down: 'pointerdown', move: 'pointermove'};
            }

            //IE < 11
            else{
                pointer = { down: 'MSPointerDown', move: 'MSPointerMove'};
            }

            return pointer;
        }

        /**
         * Gets the pageX and pageY properties depending on the browser.
         * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
         */
        function getEventsPage(e){
            var events = [];

            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

            //in touch devices with scroll bar, e.pageY is detected, but we have to deal with touch events. #1008
            if(isTouch && isReallyTouch(e) && (options.scrollBar || !options.autoScrolling)){
                events.y = e.touches[0].pageY;
                events.x = e.touches[0].pageX;
            }

            return events;
        }

        /**
         * Slides silently (with no animation) the active slider to the given slide.
         * @param noCallback {bool} true or defined -> no callbacks
         */
        function silentLandscapeScroll(activeSlide, noCallbacks){
            setScrollingSpeed (0, 'internal');

            if(typeof noCallbacks !== 'undefined'){
                //preventing firing callbacks afterSlideLoad etc.
                isResizing = true;
            }

            landscapeScroll(activeSlide.closest(SLIDES_WRAPPER_SEL), activeSlide);

            if(typeof noCallbacks !== 'undefined'){
                isResizing = false;
            }

            setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        /**
         * Scrolls silently (with no animation) the page to the given Y position.
         */
        function silentScroll(top){
            // The first section can have a negative value in iOS 10. Not quite sure why: -0.0142822265625
            // that's why we round it to 0.
            var roundedTop = Math.round(top);

            if (options.css3 && options.autoScrolling && !options.scrollBar){
                var translate3d = 'translate3d(0px, -' + roundedTop + 'px, 0px)';
                transformContainer(translate3d, false);
            }
            else if(options.autoScrolling && !options.scrollBar){
                container.css('top', -roundedTop);
            }
            else{
                $htmlBody.scrollTop(roundedTop);
            }
        }

        /**
         * Returns the cross-browser transform string.
         */
        function getTransforms(translate3d){
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform':translate3d,
                'transform': translate3d
            };
        }

        /**
         * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
         * @type  m (mouse) or k (keyboard)
         */
        function setIsScrollAllowed(value, direction, type){
            //up, down, left, right
            if(direction !== 'all'){
                isScrollAllowed[type][direction] = value;
            }

            //all directions?
            else{
                $.each(Object.keys(isScrollAllowed[type]), function(index, key){
                    isScrollAllowed[type][key] = value;
                });
            }
        }

        /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        */
        function destroy(all){
            setAutoScrolling(false, 'internal');
            setAllowScrolling(false);
            setKeyboardScrolling(false);
            container.addClass(DESTROYED);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);
            clearTimeout(resizeId);
            clearTimeout(scrollId);
            clearTimeout(scrollId2);

            $window
                .off('scroll', scrollHandler)
                .off('hashchange', hashChangeHandler)
                .off('resize', resizeHandler);

            $document
                .off('click touchstart', SECTION_NAV_SEL + ' a')
                .off('mouseenter', SECTION_NAV_SEL + ' li')
                .off('mouseleave', SECTION_NAV_SEL + ' li')
                .off('click touchstart', SLIDES_NAV_LINK_SEL)
                .off('mouseover', options.normalScrollElements)
                .off('mouseout', options.normalScrollElements);

            $(SECTION_SEL)
                .off('click touchstart', SLIDES_ARROW_SEL);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);

            //lets make a mess!
            if(all){
                destroyStructure();
            }
        }

        /*
        * Removes inline styles added by fullpage.js
        */
        function destroyStructure(){
            //reseting the `top` or `translate` properties to 0
            silentScroll(0);

            //loading all the lazy load content
            container.find('img[data-src], source[data-src], audio[data-src], iframe[data-src]').each(function(){
                setSrc($(this), 'src');
            });

            container.find('img[data-srcset]').each(function(){
                setSrc($(this), 'srcset');
            });

            $(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL +  ', ' + SLIDES_ARROW_SEL).remove();

            //removing inline styles
            $(SECTION_SEL).css( {
                'height': '',
                'background-color' : '',
                'padding': ''
            });

            $(SLIDE_SEL).css( {
                'width': ''
            });

            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });

            $htmlBody.css({
                'overflow': '',
                'height': ''
            });

            // remove .fp-enabled class
            $('html').removeClass(ENABLED);

            // remove .fp-responsive class
            $body.removeClass(RESPONSIVE);

            // remove all of the .fp-viewing- classes
            $.each($body.get(0).className.split(/\s+/), function (index, className) {
                if (className.indexOf(VIEWING_PREFIX) === 0) {
                    $body.removeClass(className);
                }
            });

            //removing added classes
            $(SECTION_SEL + ', ' + SLIDE_SEL).each(function(){
                if(options.scrollOverflowHandler){
                    options.scrollOverflowHandler.remove($(this));
                }
                $(this).removeClass(TABLE + ' ' + ACTIVE);
                $(this).attr('style', $(this).data('fp-styles'));
            });

            removeAnimation(container);

            //Unwrapping content
            container.find(TABLE_CELL_SEL + ', ' + SLIDES_CONTAINER_SEL + ', ' + SLIDES_WRAPPER_SEL).each(function(){
                //unwrap not being use in case there's no child element inside and its just text
                $(this).replaceWith(this.childNodes);
            });

            //removing the applied transition from the fullpage wrapper
            container.css({
                '-webkit-transition': 'none',
                'transition': 'none'
            });

            //scrolling the page to the top with no animation
            $htmlBody.scrollTop(0);

            //removing selectors
            var usedSelectors = [SECTION, SLIDE, SLIDES_CONTAINER];
            $.each(usedSelectors, function(index, value){
                $('.' + value).removeClass(value);
            });
        }

        /*
        * Sets the state for a variable with multiple states (original, and temporal)
        * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
        * This function is used to keep track of both states, the original and the temporal one.
        * If type is not 'internal', then we assume the user is globally changing the variable.
        */
        function setVariableState(variable, value, type){
            options[variable] = value;
            if(type !== 'internal'){
                originals[variable] = value;
            }
        }

        /**
         * Displays warnings
         */
        function displayWarnings(){
            var extensions = ['fadingEffect', 'continuousHorizontal', 'scrollHorizontally', 'interlockedSlides', 'resetSliders', 'responsiveSlides', 'offsetSections', 'dragAndMove', 'scrollOverflowReset', 'parallax'];
            if($('html').hasClass(ENABLED)){
                showError('error', 'Fullpage.js can only be initialized once and you are doing it multiple times!');
                return;
            }

            // Disable mutually exclusive settings
            if (options.continuousVertical &&
                (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollBar && options.scrollOverflow){
                showError('warn', 'Option `scrollBar` is mutually exclusive with `scrollOverflow`. Sections with scrollOverflow might not work well in Firefox');
            }

            if(options.continuousVertical && (options.scrollBar || !options.autoScrolling)){
                options.continuousVertical = false;
                showError('warn', 'Scroll bars (`scrollBar:true` or `autoScrolling:false`) are mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollOverflow && !options.scrollOverflowHandler){
                options.scrollOverflow = false;
                showError('error', 'The option `scrollOverflow:true` requires the file `scrolloverflow.min.js`. Please include it before fullPage.js.');
            }

            //using extensions? Wrong file!
            $.each(extensions, function(index, extension){
                //is the option set to true?
                if(options[extension]){
                    showError('warn', 'fullpage.js extensions require jquery.fullpage.extensions.min.js file instead of the usual jquery.fullpage.js. Requested: '+ extension);
                }
            });

            //anchors can not have the same value as any element ID or NAME
            $.each(options.anchors, function(index, name){

                //case insensitive selectors (http://stackoverflow.com/a/19465187/1081396)
                var nameAttr = $document.find('[name]').filter(function() {
                    return $(this).attr('name') && $(this).attr('name').toLowerCase() == name.toLowerCase();
                });

                var idAttr = $document.find('[id]').filter(function() {
                    return $(this).attr('id') && $(this).attr('id').toLowerCase() == name.toLowerCase();
                });

                if(idAttr.length || nameAttr.length ){
                    showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                    idAttr.length && showError('error', '"' + name + '" is is being used by another element `id` property');
                    nameAttr.length && showError('error', '"' + name + '" is is being used by another element `name` property');
                }
            });
        }

        /**
         * Shows a message in the console of the given type.
         */
        function showError(type, text){
            console && console[type] && console[type]('fullPage: ' + text);
        }

    }; //end of $.fn.fullpage
});




/*! WOW wow.js - v1.3.0 - 2016-10-04
 * https://wowjs.uk
 * Copyright (c) 2016 Thomas Grainger; Licensed MIT */!function(a,b){if("function"==typeof define&&define.amd)define(["module","exports"],b);else if("undefined"!=typeof exports)b(module,exports);else{var c={exports:{}};b(c,c.exports),a.WOW=c.exports}}(this,function(a,b){"use strict";function c(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function d(a,b){return b.indexOf(a)>=0}function e(a,b){for(var c in b)if(null==a[c]){var d=b[c];a[c]=d}return a}function f(a){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a)}function g(a){var b=arguments.length<=1||void 0===arguments[1]?!1:arguments[1],c=arguments.length<=2||void 0===arguments[2]?!1:arguments[2],d=arguments.length<=3||void 0===arguments[3]?null:arguments[3],e=void 0;return null!=document.createEvent?(e=document.createEvent("CustomEvent"),e.initCustomEvent(a,b,c,d)):null!=document.createEventObject?(e=document.createEventObject(),e.eventType=a):e.eventName=a,e}function h(a,b){null!=a.dispatchEvent?a.dispatchEvent(b):b in(null!=a)?a[b]():"on"+b in(null!=a)&&a["on"+b]()}function i(a,b,c){null!=a.addEventListener?a.addEventListener(b,c,!1):null!=a.attachEvent?a.attachEvent("on"+b,c):a[b]=c}function j(a,b,c){null!=a.removeEventListener?a.removeEventListener(b,c,!1):null!=a.detachEvent?a.detachEvent("on"+b,c):delete a[b]}function k(){return"innerHeight"in window?window.innerHeight:document.documentElement.clientHeight}Object.defineProperty(b,"__esModule",{value:!0});var l,m,n=function(){function a(a,b){for(var c=0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1,d.configurable=!0,"value"in d&&(d.writable=!0),Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),o=window.WeakMap||window.MozWeakMap||function(){function a(){c(this,a),this.keys=[],this.values=[]}return n(a,[{key:"get",value:function(a){for(var b=0;b<this.keys.length;b++){var c=this.keys[b];if(c===a)return this.values[b]}}},{key:"set",value:function(a,b){for(var c=0;c<this.keys.length;c++){var d=this.keys[c];if(d===a)return this.values[c]=b,this}return this.keys.push(a),this.values.push(b),this}}]),a}(),p=window.MutationObserver||window.WebkitMutationObserver||window.MozMutationObserver||(m=l=function(){function a(){c(this,a),"undefined"!=typeof console&&null!==console&&(console.warn("MutationObserver is not supported by your browser."),console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content."))}return n(a,[{key:"observe",value:function(){}}]),a}(),l.notSupported=!0,m),q=window.getComputedStyle||function(a){var b=/(\-([a-z]){1})/g;return{getPropertyValue:function(c){"float"===c&&(c="styleFloat"),b.test(c)&&c.replace(b,function(a,b){return b.toUpperCase()});var d=a.currentStyle;return(null!=d?d[c]:void 0)||null}}},r=function(){function a(){var b=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];c(this,a),this.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0,callback:null,scrollContainer:null,resetAnimation:!0},this.animate=function(){return"requestAnimationFrame"in window?function(a){return window.requestAnimationFrame(a)}:function(a){return a()}}(),this.vendors=["moz","webkit"],this.start=this.start.bind(this),this.resetAnimation=this.resetAnimation.bind(this),this.scrollHandler=this.scrollHandler.bind(this),this.scrollCallback=this.scrollCallback.bind(this),this.scrolled=!0,this.config=e(b,this.defaults),null!=b.scrollContainer&&(this.config.scrollContainer=document.querySelector(b.scrollContainer)),this.animationNameCache=new o,this.wowEvent=g(this.config.boxClass)}return n(a,[{key:"init",value:function(){this.element=window.document.documentElement,d(document.readyState,["interactive","complete"])?this.start():i(document,"DOMContentLoaded",this.start),this.finished=[]}},{key:"start",value:function(){var a=this;if(this.stopped=!1,this.boxes=[].slice.call(this.element.querySelectorAll("."+this.config.boxClass)),this.all=this.boxes.slice(0),this.boxes.length)if(this.disabled())this.resetStyle();else for(var b=0;b<this.boxes.length;b++){var c=this.boxes[b];this.applyStyle(c,!0)}if(this.disabled()||(i(this.config.scrollContainer||window,"scroll",this.scrollHandler),i(window,"resize",this.scrollHandler),this.interval=setInterval(this.scrollCallback,50)),this.config.live){var d=new p(function(b){for(var c=0;c<b.length;c++)for(var d=b[c],e=0;e<d.addedNodes.length;e++){var f=d.addedNodes[e];a.doSync(f)}});d.observe(document.body,{childList:!0,subtree:!0})}}},{key:"stop",value:function(){this.stopped=!0,j(this.config.scrollContainer||window,"scroll",this.scrollHandler),j(window,"resize",this.scrollHandler),null!=this.interval&&clearInterval(this.interval)}},{key:"sync",value:function(){p.notSupported&&this.doSync(this.element)}},{key:"doSync",value:function(a){if("undefined"!=typeof a&&null!==a||(a=this.element),1===a.nodeType){a=a.parentNode||a;for(var b=a.querySelectorAll("."+this.config.boxClass),c=0;c<b.length;c++){var e=b[c];d(e,this.all)||(this.boxes.push(e),this.all.push(e),this.stopped||this.disabled()?this.resetStyle():this.applyStyle(e,!0),this.scrolled=!0)}}}},{key:"show",value:function(a){return this.applyStyle(a),a.className=a.className+" "+this.config.animateClass,null!=this.config.callback&&this.config.callback(a),h(a,this.wowEvent),this.config.resetAnimation&&(i(a,"animationend",this.resetAnimation),i(a,"oanimationend",this.resetAnimation),i(a,"webkitAnimationEnd",this.resetAnimation),i(a,"MSAnimationEnd",this.resetAnimation)),a}},{key:"applyStyle",value:function(a,b){var c=this,d=a.getAttribute("data-wow-duration"),e=a.getAttribute("data-wow-delay"),f=a.getAttribute("data-wow-iteration");return this.animate(function(){return c.customStyle(a,b,d,e,f)})}},{key:"resetStyle",value:function(){for(var a=0;a<this.boxes.length;a++){var b=this.boxes[a];b.style.visibility="visible"}}},{key:"resetAnimation",value:function(a){if(a.type.toLowerCase().indexOf("animationend")>=0){var b=a.target||a.srcElement;b.className=b.className.replace(this.config.animateClass,"").trim()}}},{key:"customStyle",value:function(a,b,c,d,e){return b&&this.cacheAnimationName(a),a.style.visibility=b?"hidden":"visible",c&&this.vendorSet(a.style,{animationDuration:c}),d&&this.vendorSet(a.style,{animationDelay:d}),e&&this.vendorSet(a.style,{animationIterationCount:e}),this.vendorSet(a.style,{animationName:b?"none":this.cachedAnimationName(a)}),a}},{key:"vendorSet",value:function(a,b){for(var c in b)if(b.hasOwnProperty(c)){var d=b[c];a[""+c]=d;for(var e=0;e<this.vendors.length;e++){var f=this.vendors[e];a[""+f+c.charAt(0).toUpperCase()+c.substr(1)]=d}}}},{key:"vendorCSS",value:function(a,b){for(var c=q(a),d=c.getPropertyCSSValue(b),e=0;e<this.vendors.length;e++){var f=this.vendors[e];d=d||c.getPropertyCSSValue("-"+f+"-"+b)}return d}},{key:"animationName",value:function(a){var b=void 0;try{b=this.vendorCSS(a,"animation-name").cssText}catch(c){b=q(a).getPropertyValue("animation-name")}return"none"===b?"":b}},{key:"cacheAnimationName",value:function(a){return this.animationNameCache.set(a,this.animationName(a))}},{key:"cachedAnimationName",value:function(a){return this.animationNameCache.get(a)}},{key:"scrollHandler",value:function(){this.scrolled=!0}},{key:"scrollCallback",value:function(){if(this.scrolled){this.scrolled=!1;for(var a=[],b=0;b<this.boxes.length;b++){var c=this.boxes[b];if(c){if(this.isVisible(c)){this.show(c);continue}a.push(c)}}this.boxes=a,this.boxes.length||this.config.live||this.stop()}}},{key:"offsetTop",value:function(a){for(;void 0===a.offsetTop;)a=a.parentNode;for(var b=a.offsetTop;a.offsetParent;)a=a.offsetParent,b+=a.offsetTop;return b}},{key:"isVisible",value:function(a){var b=a.getAttribute("data-wow-offset")||this.config.offset,c=this.config.scrollContainer&&this.config.scrollContainer.scrollTop||window.pageYOffset,d=c+Math.min(this.element.clientHeight,k())-b,e=this.offsetTop(a),f=e+a.clientHeight;return d>=e&&f>=c}},{key:"disabled",value:function(){return!this.config.mobile&&f(navigator.userAgent)}}]),a}();b["default"]=r,a.exports=b["default"]});


