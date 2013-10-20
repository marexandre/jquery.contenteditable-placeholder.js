;(function ( $, window, document, undefined ) {
    "use strict";

    var pluginName = "contentEditablePlaceholder",
        defaults = {};

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

            if( ! this.isEditable( $this.attr('contenteditable') ) ){ return; }
            if( ! this.hasPlaceHolder( $this.data('placeholder') ) ){ return; }

            var $wrap = $(document.createElement('div'))
                .addClass('content-wditable-wrap')
                .css('position', 'relative');

            var $placeholder = $( document.createElement('div') )
                .addClass('placeholder')
                .css({
                    'position': 'absolute',
                    'z-index' : 1,
                    'top'     : parseInt( $this.css('padding-top') || 0, 10 ),
                    'left'    : parseInt( $this.css('padding-left') || 0, 10) 
                })
                .on('click', function(e){
                    e.preventDefault();
                    $this.focus();    
                });

            $this
                .on('keyup', function(){
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