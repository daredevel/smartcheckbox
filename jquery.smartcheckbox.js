/**
 * jQuery SmartCheckbox
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.2
 */
smartcheckboxindex = 0;

(function($){

    $.fn.smartCheckbox = function(options) {

        var defaults = {
            attribute: 'id',
            cascade: false,
            onCheck: { },
            onUncheck: { },
            container: 'smartcheckbox'+'['+ smartcheckboxindex++ +']'
        };

        // build main options before element iteration
        var opts = $.extend(defaults, options);

        return this.each(function() {
            $(this).addClass(opts.container);
            $(this).bind('click', opts, change);
        });
    };

    this.change = function(ev, options) {
        if ($(this).attr('checked')) {
            check(ev.data.container, ev.data.attribute, $(this).attr(ev.data.attribute), ev.data.onCheck, ev.data.cascade);
        } else {
            check(ev.data.container, ev.data.attribute, $(this).attr(ev.data.attribute), ev.data.onUncheck, ev.data.cascade);
        }
    };

    this.check = function(container, attribute, i, lists, cascade) {
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

            for (j in toCheck) {
                // prevent loop coused by user's configuration like "onCheck X then check X"
                if (toCheck[j] == i) continue;

                if ($('input[type=checkbox][class=' + container + '][' + attribute + '=' + toCheck[j] + ']').attr('checked') == false) {
                    $('input[type=checkbox][class=' + container + '][' + attribute + '=' + toCheck[j] + ']').attr('checked', true);

                    if (cascade == true)
                        check(container, attribute, toCheck[j], lists, cascade);

                }

            }

        }

        if (toUncheck.length > 0) {
            var toUncheck = toUncheck.split(',');

            for (j in toUncheck) {
                // prevent loop coused by user's configuration like "onCheck X then check X"
                if (toUncheck[j] == i) continue;

                if ($('input[type=checkbox][class=' + container + '][' + attribute + '=' + toUncheck[j] + ']').attr('checked') == true) {
                    $('input[type=checkbox][class=' + container + '][' + attribute + '=' + toUncheck[j] + ']').attr('checked', false);

                    if (cascade == true)
                        check(container, attribute, toUncheck[j], lists, cascade);

                }

            }

        }
    }

    this.fetch = function(url, id)
    {
        var data = $.ajax({
                async: false,
            url: url,
            //data: ({id : id}),
            //dataType: "json",
            success: function(msg){
                //alert(msg);
            },
            fail: function(msg){
                alert('ajax error:' + msg);
            }
        }).responseText;

        eval('data = {' + data + '}');

        return data;
    }

})(jQuery);
