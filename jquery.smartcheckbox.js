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
            onCheck: { 
                check: { },
                uncheck: { }
            },
            onUncheck: {
                check: { },
                uncheck: { }
            },
            recursive: false
        };

        // build main options before element iteration
        var opts = $.extend({}, $.fn.smartCheckbox.defaults, options);

        return this.each(function() {
            $(this).bind('click', opts, change);
        });
	};

    var change = function(ev, options) {
        if ($(this).attr('checked')) {
            check(ev.data.attribute, $(this).attr(ev.data.attribute), ev.data.onCheck, ev.data.recursive);
        } else {
            check(ev.data.attribute, $(this).attr(ev.data.attribute), ev.data.onUncheck, ev.data.recursive);
        }
    };

    var check = function(attribute, i, lists, recursive) {
        if (i == undefined || lists[i] == undefined) { 
            return i;
        }

        if (lists[i].check != undefined) {
            var toCheck = lists[i].check.split(',');
            
            for (j in toCheck) {
                if (toCheck[j] == i) continue;

                if ($('input[type=checkbox][' + attribute + '=' + toCheck[j] + ']').attr('checked') == false) {
                    $('input[type=checkbox][' + attribute + '=' + toCheck[j] + ']').attr('checked', true);

                    if (recursive == true)
                        check(attribute, toCheck[j], lists, recursive);
                
                }
            
            }
        
        }

        if (lists[i].uncheck != undefined) {
            var toUncheck = lists[i].uncheck.split(',');

            for (j in toUncheck) {
                if (toUncheck[j] == i) continue;

                if ($('input[type=checkbox][' + attribute + '=' + toUncheck[j] + ']').attr('checked') == true) {
                    $('input[type=checkbox][' + attribute + '=' + toUncheck[j] + ']').attr('checked', false);
                
                    if (recursive == true)
                        check(attribute, toUncheck[j], lists, recursive);
                
                }
            
            }
        
        }
    }
})(jQuery);
