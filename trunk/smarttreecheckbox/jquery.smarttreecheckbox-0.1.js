/**
 * jQuery smartTreeCheckbox
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.1
 */
(function($){

    var smartTreeCheckboxIndex = 0;

    $.fn.smartTreeCheckbox = function(options) {

        // build main options before element iteration
        var options = $.extend({
            checkChildren: false,
            checkParents: false,
            collapsable: false,
            collapsed: false,
            collapseEffect: 'slide',
            collapseImage: 'minus.png',
            container: 'smarttreecheckbox'+'['+ smartTreeCheckboxIndex++ +']',
            expandeEffect: 'slide',
            expandImage: 'plus.png',
            leafImage: 'blank.png'
        }, options);

        $("li", this).each(function() {

            if (options.collapsable) {
                var $img;

                if ($(this).is(":has(ul)")) {
                    if (options.collapsed) {
                        $(this).find("ul").hide(options.collapseEffect);
                        $img = $('<img src="'+options.expandImage+'" />').data("collapsed",0);
                    } else {
                        $img = $('<img src="'+options.collapseImage+'" />').data("collapsed",1)
                    }
                } else {
                     $img = $('<img src="'+options.leafImage+'" />');
                }

                $(this).prepend($img);
            }
        });

        this.find('img').bind("click", function(e, a){
            var listItem = $(this).parents("li:first");

            if ($(this).data("collapsed") == undefined) {
                return;
            }
            if ($(this).data("collapsed") === 0) {
                listItem.children("ul").show(options.expandeEffect);
                listItem.children("img").attr("src",options.collapseImage);
                $(this).data("collapsed",1)
            } else {
                listItem.children("ul").hide(options.collapseEffect);
                listItem.children("img").attr("src",options.expandImage);
                $(this).data("collapsed",0)
            }
        });

        this.find(':checkbox').bind("click", function(e, a) {

            if (options.checkChildren) {
                toggleChildren($(this));
            }

            if (options.checkParents && $(this).is(":checked")) {
                checkParents($(this), options);
            }

        });

        this.addClass(options.container);

        // add css class
        this.addClass('smartTreeCheckbox');

        return this;
    };


    /**
     * Recursively check parents of passed checkbox
     */
    this.checkParents = function(checkbox, options)
    {
        var parentCheckbox = checkbox.parents("li:first").parents("li:first").find(" :checkbox:first");

        if (!parentCheckbox.is(":checked")) {
            parentCheckbox.attr("checked","checked");
        }

        if (parentCheckbox.parents('[class*=' + options.container + ']').attr('class') != undefined) {
            checkParents(parentCheckbox, options);
        }

    }

    /**
     * Check/uncheck children of passed checkbox
     */
    this.toggleChildren = function(checkbox) {
        checkbox.parent().find('li :checkbox').attr('checked',checkbox.attr('checked') ? 'checked' : '');
    }

})(jQuery);
