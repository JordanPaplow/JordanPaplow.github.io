var $textfade = $('.textfade');

$textfade.waypoint(function(direction) {
    if (direction == 'down') {
        $textfade.addClass('js-textfade-animate');
    } else {
    $textfade.removeClass('js-textfade-animate');
    }
}, { offset:'70%'});

var $textfade2 = $('.textfade2');

$textfade2.waypoint(function(direction) {
    if (direction == 'down') {
        $textfade2.addClass('js-textfade-animate');
    } else {
    $textfade2.removeClass('js-textfade-animate');
    }
}, { offset:'70%'});






