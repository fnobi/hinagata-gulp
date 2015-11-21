var CSSUtil = {
    TRANSITION_END: ['transitionend', 'webkitTransitionEnd'].join(' '),
    ANIMATION_END: ['animationend', 'webkitAnimationEnd'].join(' '),
    TRANSFORM: function (param) {
        var properties = [];
        for (var i in param) {
            properties.push(i + '(' + param[i] + ')');
        }
        return 'transform(' + properties.join(' ') + ')';
    }
};









