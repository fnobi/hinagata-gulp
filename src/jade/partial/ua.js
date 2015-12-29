(function (ua, cn, w, h) {
    cn.push(/iphone|ipod|ipad|android/.test(ua) ? 'touch-mode' : 'mouse-mode');
    document.body.className = cn.join(' ');
})(navigator.userAgent.toLowerCase(), [], screen.width, screen.height);
