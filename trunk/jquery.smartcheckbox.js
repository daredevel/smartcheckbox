/**
 * jQuery smartCheckbox
 * 
 * @version alpha
**/

(function($){

	$.fn.smartCheckbox = function(options) {

        var defaults = {
            toCheck: {
            },
            toUncheck: {
            }
        };

        // build main options before element iteration
        var opts = $.extend({}, $.fn.smartCheckbox.defaults, options);

        return this.each(function() {
            $(this).bind('click', {'toCheck': opts.toCheck, 'toUncheck': opts.toUncheck }, change);
        });
	};

    var change = function(ev, toCheck, toUncheck) {
        if ($(this).attr('checked')) {
            check($(this).attr('value'), ev.data.toCheck);
        } else {
            uncheck($(this).attr('value'), ev.data.toUncheck);
        }
    };


    // Check all checkbox with value contained in passed list
    var check = function(i, list) {
        if (i == undefined || list == undefined || list[i] == undefined) { 
            return i;
        }

        var list_split = list[i].split(',');

        for (list_i in list_split) {
//          alert('i = '+i+' list_i = '+list_i+' list_split['+list_i+'] = '+list_split[list_i]);
            if ($('input[type=checkbox][value=' + list_split[list_i] + ']').attr('checked') == false) {

                $('input[type=checkbox][value=' + list_split[list_i] + ']').attr('checked', true);
//                check(list_split[list_i], list);

            }

        }

    }
    
    // Uncheck all checkbox with value contained in passed list
    var uncheck = function(i, list) {
        if (i == undefined || list == undefined || list[i] == undefined) { 
            return i;
        }

        var list_split = list[i].split(',');

        for (list_i in list_split) {
            if ($('input[type=checkbox][value=' + list_split[list_i] + ']').attr('checked') == true) {

                $('input[type=checkbox][value=' + list_split[list_i] + ']').attr('checked', false);
//                uncheck(list_split[list_i], list);

            }

        }

    }

})(jQuery);
