/**
 * jQuery smartCheckbox Package
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.3.1
 */

/**
 * jQuery smartCheckbox
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.3
 */
(function($){

    var smartCheckboxIndex = 0;

    $.fn.smartCheckbox = function(options) {

        // build main options before element iteration
        var options = $.extend({
            attribute: 'id',
            cascade: false,
            container: 'smartcheckbox'+'['+ smartCheckboxIndex++ +']',
            onCheck: { check:{ }, uncheck: { }, url: { } },
            onUncheck: { check:{ }, uncheck:{ }, url:{ } }
        }, options);

        this.addClass(options.container);

        this.bind('click', options, function(ev) {
            list(ev.data, $(this).attr(ev.data.attribute), $(this).attr('checked'));
        });

        return this;
    };

    this.list = function(options, i, checked) {
        lists = (checked) ? options.onCheck : options.onUncheck;

        if (lists[i] == undefined) {
            return false;
        }

        var toCheck = toUncheck = '';

        if (lists[i].url != undefined) {
            var ajaxList = fetch(lists[i].url, i);
            toCheck   = toCheck + ajaxList.check;
            toUncheck = toUncheck + ajaxList.uncheck;
        }

        if (lists[i].check != undefined) {
            toCheck = (toCheck.length > 0) ? toCheck + ',' + lists[i].check : toCheck + lists[i].check;
        }

        if (lists[i].uncheck != undefined) {
            toUncheck = (toUncheck.length > 0) ? toUncheck + ',' + lists[i].uncheck : toUncheck + lists[i].uncheck;
        }

        elements = new Array();
        $('[class*=' + options.container + ']').each(function(){
            elements[$(this).attr(options.attribute)] = $(this);
        });

        if (toCheck.length > 0) {
            var toCheck = toCheck.split(',');

            for (j in toCheck) {
                if (toCheck[j] == i) continue; // prevent loop coused by user's configuration like "onCheck X then check X"
                elements[toCheck[j]].attr('checked', true);
                if (options.cascade == true) { list(options, toCheck[j], true); }
            }
        }

        if (toUncheck.length > 0) {
            var toUncheck = toUncheck.split(',');

            for (j in toUncheck) {
                if (toUncheck[j] == i) continue; // prevent loop coused by user's configuration like "onUncheck X then check X"
                elements[toUncheck[j]].attr('checked', false);
                if (options.cascade == true) { list(options, toUncheck[j], false); }
            }
        }

    }

    /**
     * Fetchs Json object from specified url.
     * Returned object must contain ...
     */
    this.fetch = function(url)
    {
        var data = $.ajax({
            async: false,
            url: url,
            success: function(msg) {
            },
            fail: function(msg) {
                alert('ajax error:' + msg);
            }
        }).responseText;

        eval('data = {' + data + '}');

        return data;
    }

})(jQuery);

/**
 * jQuery smartTreeCheckbox
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.2
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
            collapseDuration: 500,
            collapseEffect: 'slide',
            collapseImage: 'minus.png',
            container: 'smarttreecheckbox'+'['+ smartTreeCheckboxIndex++ +']',
            expandDuration: 500,
            expandEffect: 'slide',
            expandImage: 'plus.png',
            leafImage: 'blank.png'
        }, options);

        $("li", this).each(function() {

            if (options.collapsable) {
                var $img;

                if ($(this).is(":has(ul)")) {
                    if (options.collapsed) {
                        $(this).find("ul").hide();
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

                if ($.ui !== undefined) {
                    listItem.children("ul").show(options.expandEffect, {}, options.expandDuration);
                } else {
                    listItem.children("ul").show(options.expandDuration);
                }

                listItem.children("img").attr("src",options.collapseImage);
                $(this).data("collapsed",1)

            } else {

                if ($.ui !== undefined) {
                    listItem.children("ul").hide(options.collapseEffect, {}, options.collapseDuration);
                } else {
                    listItem.children("ul").hide(options.collapseDuration);
                }

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
    this.toggleChildren = function(checkbox)
    {
        checkbox.parents('li:first').find('li :checkbox').attr('checked',checkbox.attr('checked') ? 'checked' : '');
    }

})(jQuery);
