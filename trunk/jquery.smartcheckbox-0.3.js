/**
 * jQuery SmartCheckbox
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.3
 */
smartcheckboxindex = 0;

(function($){

    $.fn.smartCheckbox = function(options) {

        var defaults = {
            attribute: 'id',
            cascade: false,
            onCheck: { check:{ }, uncheck:{ }, url:{ } },
            onUncheck: { check:{ }, uncheck:{ }, url:{ } },
            container: 'smartcheckbox'+'['+ smartcheckboxindex++ +']'
        };

        // build main options before element iteration
        var options = $.extend(defaults, options);

        this.each(function() {
            $(this).addClass(options.container);
            $(this).bind('click', options, change);
        });
    };

    this.change = function(ev, options) {
        check(ev.data, $(this).attr(ev.data.attribute), $(this).attr('checked'));
    };

    this.check = function(options, i, checked) {
        lists = (checked) ? options.onCheck : options.onUncheck;

        if (i == undefined || lists[i] == undefined) {
            return i;
        }

        var toCheck = '';
        var toUncheck = '';

        if (lists[i].url != undefined) {
            var ajaxList = fetch(lists[i].url, i);
            toCheck   = toCheck + ajaxList.check;
            toUncheck = toUncheck + ajaxList.uncheck;
        }

        if (lists[i].check != undefined) {
            if (toCheck.length > 0) {
                toCheck = toCheck + ',' + lists[i].check;
            } else {
                toCheck = toCheck + lists[i].check;
            }
        }

        if (lists[i].uncheck != undefined) {
            if (toCheck.length > 0) {
                toUncheck = toUncheck + ',' + lists[i].uncheck;
            } else {
                toUncheck = toUncheck + lists[i].uncheck;
            }
        }

        if (toCheck.length > 0) {
            var toCheck = toCheck.split(',');

            elements = $('[class=' + options.container + ']');
            for (j in toCheck) {
                // prevent loop coused by user's configuration like "onCheck X then check X"
                if (toCheck[j] == i) continue;

                element = elements.filter('[' + options.attribute + '=' + toCheck[j] + ']');
                if (element.attr('checked') == false) {
                    element.attr('checked', true);

                    if (options.cascade == true)
                        check(options, toCheck[j], true);

                }

            }

        }

        if (toUncheck.length > 0) {
            var toUncheck = toUncheck.split(',');

            elements = $('[class=' + options.container + ']');
            for (j in toUncheck) {
                // prevent loop coused by user's configuration like "onCheck X then check X"
                if (toUncheck[j] == i) continue;

                element = elements.filter('[' + options.attribute + '=' + toUncheck[j] + ']');
                if (element.attr('checked') == true) {
                    element.attr('checked', false);

                    if (options.cascade == true)
                        check(options, toUncheck[j], false);

                }

            }

        }
    }

    this.fetch = function(url, id)
    {
        var data = $.ajax({
            async: false,
            url: url,
            success: function(msg){
            },
            fail: function(msg){
                alert('ajax error:' + msg);
            }
        }).responseText;

        eval('data = {' + data + '}');

        return data;
    }

})(jQuery);
