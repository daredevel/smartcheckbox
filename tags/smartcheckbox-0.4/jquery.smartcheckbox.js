/**
 * jQuery smartCheckbox
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.4
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
