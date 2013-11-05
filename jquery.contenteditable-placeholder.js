;(function ( $, window, document, undefined ) {
    "use strict";

    var pluginName = "contentEditablePlaceholder",
        defaults = {
            zIndex: 1,
            margin: '0 4px'
        };

    // constructor
    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {

            var $this = $(this.element);

            // don't do anything if element is not a content editable or has placeholder
            if( ! this.isEditable( $this.attr('contenteditable') ) ){ return; }
            if( ! this.hasPlaceHolder( $this.data('placeholder') ) ){ return; }

            var $wrap = $(document.createElement('div'))
                .addClass('content-wditable-wrap')
                .css('position', 'relative');

            var $placeholder = $( document.createElement('div') )
                .addClass('placeholder')
                .css({
                    'position'   : 'absolute',
                    'z-index'    : this.settings.zIndex,
                    'top'        : $this.css('padding-top'),
                    'line-height': $this.css('line-height'),
                    'margin'     : this.settings.margin
                })
                .on('click', function(e){
                    e.preventDefault();
                    $this.focus();
                });

            // check if text direction is right ot left
            if( $this.css('direction') === 'rtl' ){
                $placeholder.css({
                    'direction': 'rtl',
                    'right'    : $this.css('padding-right')
                });
            }
            else {
                $placeholder.css({
                    'left': $this.css('padding-left')
                });
            }

            $this
                .on('keydown keyup', function(){
                    $this.text().length > 0 ? $placeholder.hide() : $placeholder.show();
                })
                .wrap( $wrap );

            $this.before( $placeholder.text( $this.data('placeholder') ) );
        },
        /**
         * Check if $element is content editable
         * @param  {jQuery.attr}  attr
         * @return {Boolean}
         */
        isEditable: function ( attr ) {
            if( attr == 'false' ){
                return false;
            }
            return (typeof attr !== 'undefined' && attr !== false);
        },
        /**
         * Check if there is a placeholder
         * @param  {jQuery.data}  $element
         * @return {Boolean}
         */
        hasPlaceHolder: function ( data ) {
            return ( typeof data !== 'undefined' && data.length !== 0 );
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function(i) {
            if ( ! $.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });
    };

})( jQuery, window, document );