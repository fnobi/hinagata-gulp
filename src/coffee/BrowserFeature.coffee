class BrowserFeature
    @ua = navigator.userAgent
    @ual = @ua.toLowerCase()
    
    isAndroid: /android/.test @ual
    isIPhone: /iphone/.test @ual
    isIPod: /ipod/.test @ual
    isIPad: /ipad/.test @ual
    isIOS: @isIPhone or @isIPod or @isIPad
    isTouch: @isAndroid or @isIOS
    isPC: !@isTouch

    isChrome: /chrome/.test @ual # SPのchromeも含まれる

    isIE: /msie/.test @ual
    isIE6: /msie 6/.test @ual
    isIE7: /msie 7/.test @ual
    isIE8: /msie 8/.test @ual
    isIE9: /msie 9/.test @ual
    isIE10: /msie 10/.test @ual
    isIE11: /Trident/.test @ua

    isAndroid5: /Android 5\.[0-9]/.test @ua
    isAndroid4: /Android 4\.[0-9]/.test @ua
    isAndroid3: /Android 3\.[0-9]/.test @ua
    isAndroid2: /Android 2\.[0-9]/.test @ua

    isLegacy: @isUnsupported || @isIE8
    isLegacyAndroid: @isAndroid2 || @isAndroid3
    isModern: !@isLegacy and !@isLegacyAndroid
