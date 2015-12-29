class CSSUtil
    TRANSITION_END: ['transitionend', 'webkitTransitionEnd'].join ' '
    ANIMATION_END: ['animationend', 'webkitAnimationEnd'].join ' '
    TRANSFORM: (param) ->
        properties = [];
        for prop, value of param
            properties.push "#{prop}(#{value})"
        'transform(' + properties.join(' ') + ')'










