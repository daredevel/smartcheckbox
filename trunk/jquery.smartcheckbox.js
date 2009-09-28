/**
 * jQuery SmartCheckbox
 *
 * @author Valerio Galano <valerio.galano@gmail.com>
 *
 * @version 0.1 alpha
 */

(function($){

    $.fn.smartCheckbox = function(options) {

        var defaults = {
            attribute: 'id',
            cascade: false,
            onCheck: {
                check: { },
                uncheck: { }
            },
            onUncheck: {
                check: { },
                uncheck: { }
            },
            container: 'smartcheckbox'
        };

        // build main options before element iteration
        var opts = $.extend(defaults, options);

        return this.each(function() {
            $(this).addClass(opts.container);
            $(this).bind('click', opts, change);
        });
    };

    var change = function(ev, options) {
//        alert(ev.data.container);
        if ($(this).attr('checked')) {
            check(ev.data.container, ev.data.attribute, $(this).attr(ev.data.attribute), ev.data.onCheck, ev.data.cascade);
        } else {
            check(ev.data.container, ev.data.attribute, $(this).attr(ev.data.attribute), ev.data.onUncheck, ev.data.cascade);
        }
    };

    var check = function(container, attribute, i, lists, cascade) {
        if (i == undefined || lists[i] == undefined) {
            return i;
        }

        if (lists[i].check != undefined) {
            var toCheck = lists[i].check.split(',');

            for (j in toCheck) {
                // prevent loop coused by user's configuration like "onCheck X then check X"
                if (toCheck[j] == i) continue;
//                alert('input[type=checkbox][class=' + container + '][' + attribute + '=' + toCheck[j] + ']');
                if ($('input[type=checkbox][class=' + container + '][' + attribute + '=' + toCheck[j] + ']').attr('checked') == false) {
                    $('input[type=checkbox][class=' + container + '][' + attribute + '=' + toCheck[j] + ']').attr('checked', true);

                    if (cascade == true)
                        check(container, attribute, toCheck[j], lists, cascade);

                }

            }

        }

        if (lists[i].uncheck != undefined) {
            var toUncheck = lists[i].uncheck.split(',');

            for (j in toUncheck) {
                // prevent loop coused by user's configuration like "onCheck X then check X"
                if (toUncheck[j] == i) continue;
//                alert('input[type=checkbox][class=' + container + '][' + attribute + '=' + toUncheck[j] + ']');
                if ($('input[type=checkbox][class=' + container + '][' + attribute + '=' + toUncheck[j] + ']').attr('checked') == true) {
                    $('input[type=checkbox][class=' + container + '][' + attribute + '=' + toUncheck[j] + ']').attr('checked', false);

                    if (cascade == true)
                        check(container, attribute, toUncheck[j], lists, cascade);

                }

            }

        }
    }
})(jQuery);
