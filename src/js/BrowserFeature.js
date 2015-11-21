var BrowserFeature = function () {
    var ua = navigator.userAgent;
    var ual = ua.toLowerCase();
    
    this.isAndroid = /android/.test(ual);
    this.isIPhone = /iphone/.test(ual);
    this.isIPod = /ipod/.test(ual);
    this.isIPad = /ipad/.test(ual);
    this.isIOS = this.isIPhone || this.isIPod || this.isIPad;
    this.isTouch = this.isAndroid || this.isIOS;
    this.isPC = !this.isTouch;

    this.isChrome = /chrome/.test(ual); // SPのchromeも含まれる

    this.isIE = /msie/.test(ual);
    this.isIE6 = /msie 6/.test(ual);
    this.isIE7 = /msie 7/.test(ual);
    this.isIE8 = /msie 8/.test(ual);
    this.isIE9 = /msie 9/.test(ual);
    this.isIE10 = /msie 10/.test(ual);
    this.isIE11 = /Trident/.test(ua);

    this.isAndroid5 = /Android 5\.[0-9]/.test(ua);
    this.isAndroid4 = /Android 4\.[0-9]/.test(ua);
    this.isAndroid3 = /Android 3\.[0-9]/.test(ua);
    this.isAndroid2 = /Android 2\.[0-9]/.test(ua);

    this.isLegacy = this.isUnsupported || this.isIE8;
    this.isLegacyAndroid = this.isAndroid2 || this.isAndroid3;
    this.isModern = (!this.isLegacy && !this.isLegacyAndroid);
};
