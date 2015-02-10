/* ========================================================================
 * HappyModals: jquery.happymodal.js v1.0.0
 * ========================================================================
 * Copyright 2013 Happycms.ru
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * ======================================================================== 
 */

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('happymodal', ['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    
    var VERSION = '1.0.0';
    
    // Create the defaults once
    var happymodal = 'happymodal',
        defaults = {
            backdropBlur: false,
            showCallback: function(el){
                
            },
            hideCallback: function(el){
                
            },
        };

    function Plugin( element, options ) {
        this.element = element;
        this.dialog = '.js__happymodal-dialog';
        this.content = '.js__happymodal-content';
        this.close = '.js__happymodal-close';
        this.backdrop = '.js__happymodal-backdrop';
        
        this.$elements = $('[data-happymodal]');
        this.$element = $(this.element);
        this.$dialog = this.$element.find(this.dialog);
        this.$content = this.$element.find(this.content);
        this.$close = this.$element.find(this.close);
        this.$backdrop = $(this.backdrop);
        this.transition = this.$element.css('transition');
        
        this.$body = $('body');
        this.modalBackdropTemplate = '<div class="js__happymodal-backdrop happymodal-backdrop backdrop-hide"></div>';

        this.options = $.extend( {
        }, defaults, options, $(this.element).data('happymodal-options')) ;
        
        this._defaults = defaults;
        this._name = happymodal;
        
        this.version = VERSION;
        this.show = this.show;
        this.hide = this.hide;
        
        this.init();
        
        this.bindMethods();
        this.bindEventListeners();
    }

    Plugin.prototype = {
        init: function() {
            this.render();    
        },

        render: function() {
            this.draw();
            
            if(this.$backdrop.length <= 0){
                this.$body.append(this.modalBackdropTemplate);
                this.$backdrop = $(this.backdrop);     
            }
        },
        
        draw: function() {
            if(!this.$element.is('.happymodal-open')){
                return false;
            }
            
            this.window = {
                width: $(window).width(),
                height: $(window).height(),
            };
            
            this.modal = {
                width: this.$dialog.width(),
                height: this.$dialog.outerHeight(true),
            };
            
            if(this.window.height < this.modal.height){
                this.$element.addClass('happymodal-static');
                this.$body.addClass('body-happymodal-static');
                this.$element.css('top', $(window).scrollTop());
            }else{
                this.$element.removeClass('happymodal-static');
                this.$body.removeClass('body-happymodal-static');
            }
        },
        
        show: function() {
            this.$elements.removeClass('happymodal-open');
            this.$element.css('display', 'block').height();
            this.$element.addClass('happymodal-open');
            this.$backdrop.removeClass('backdrop-hide');  
            
            if(this.options.backdropBlur){
                this.$body.find('> *').not('.happymodal-open').addClass('happymodal-blur');    
            }
            
            this.draw();
            
            this.options.showCallback(this);
        },
        
        hide: function(){
            var _this = this;
            this.$element.removeClass('happymodal-open');
            this.$backdrop.addClass('backdrop-hide');

            if(this.$body.is('.body-happymodal-static')){
                this.$element.css('top', '');
                this.$body.removeClass('body-happymodal-static');
            }

            if(this.options.backdropBlur){
                this.$body.find('> *').not('.happymodal-open').removeClass('happymodal-blur');   
            }

            setTimeout(function(){
                _this.$element.css('display', 'none');
            }, 300);
            
            this.draw();
            
            this.options.hideCallback(this);
        },
        
        onHandleCloseClick: function(e){
            this.hide();
            e.preventDefault();    
        },
        
        onHandleModalBackClick: function(e){
            if($(e.target).is('.happymodal-open')){
                this.hide();
                e.preventDefault();       
            }  
        },
        
        bindMethods: function(){
            this.onHandleCloseClick = bind(this.onHandleCloseClick, this);
            this.onHandleModalBackClick = bind(this.onHandleModalBackClick, this);
        },
        
        bindEventListeners: function(){
            addEventListener(this.$element, 'click', this.onHandleModalBackClick);
            addEventListener(this.$close, 'click', this.onHandleCloseClick);
        }
    };

    $.fn[happymodal] = function ( options ) {
        // global events
        onWindowResize = bind(onWindowResize, this); 
        onHandleModalOpenClick = bind(onHandleModalOpenClick, this);
        addEventListener($(window), 'load', onWindowResize); 
        addEventListener($(window), 'resize', onWindowResize);
        addEventListener($('[data-happymodal-open]'), 'click', onHandleModalOpenClick);
        
        return this.each(function () {
            if (!$.data(this, "plugin_" + happymodal)) {
                $.data(this, "plugin_" + happymodal,
                new Plugin( this, options ));
            }
        });
    };
    
    function onHandleModalOpenClick(e){
        var $modal = this.filter('[data-happymodal="' + $(e.target).attr('data-happymodal-open') + '"]');
        if($modal.length > 0){
            $.data($modal[0], "plugin_" + happymodal).show();    
        }else{
            console.log('happymodal', 'modal not exist');    
        }
        e.preventDefault(); 
    }
    
    function onWindowResize(e){
        this.each(function () {
            $.data(this, "plugin_" + happymodal).draw();  
        });
    }
    
    function bind(fn, context) {
        return function() {
            return fn.apply(context, arguments);
        };
    }
        
    function addEventListener(element, type, callback) {
        element.on(type, callback);
    }
        
    function removeEventListener(element, type, callback) {
        element.off(type, callback);
    }
    
    function dataInit(){
        if($('[data-happymodal]').length > 0){
            $('[data-happymodal]').happymodal();    
        }
    }
    
    $(function() {
        dataInit();
    });

}));