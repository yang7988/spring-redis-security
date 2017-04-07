/**
 * @author liyue
 */
(function($) {
    $.fn.getCaretPosition = function() {
        var input = this.get(0);
        // No (input) element found
        if (!input)
            return;
        // Standard-compliant browsers
        if ('selectionStart' in input) {
            return input.selectionStart;
        }
        // IE Support
        else if (document.selection) {
            input.focus();

            var oSel = document.selection.createRange();
            var oSelLen = document.selection.createRange().text.length;

            oSel.moveStart('character', -input.value.length);

            return oSel.text.length - oSelLen;
        }
    };
    $.fn.doSetCaretPosition = function(iCaretPos) {
        var input = this.get(0);
        // No (input) element found
        if (!input)
            return;
        // IE Support
        if (document.selection) {

            // Set focus on the element
            input.focus();

            // Create empty selection range
            var oSel = document.selection.createRange();

            // Move selection start and end to 0 position
            oSel.moveStart('character', -input.value.length);

            // Move selection start and end to desired position
            oSel.moveStart('character', iCaretPos);
            oSel.moveEnd('character', 0);
            oSel.select();
        }

        // Firefox support
        else if (input.selectionStart || input.selectionStart == '0') {
            input.selectionStart = iCaretPos;
            input.selectionEnd = iCaretPos;
            input.focus();
        }
    };
})(jQuery);
