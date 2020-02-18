window.TWC = window.TWC || {},
window.utag_data = window.utag_data || {},
jQuery.extend(TWC, {
    callbacks: {},
    JSONPCounter: 0,
    Events: {
        setEvent: function(e) {
            TWC.Events.createEvent(e)
        },
        createEvent: function(e) {
            return TWC.Events[e] = TWC.Events[e] || jQuery.Deferred()
        },
        ifReady: function(e) {
            var t = jQuery.map(e, jQuery.proxy(function(e, t) {
                return this.getEvent(e)
            }, this));
            return jQuery.when.apply(this, t)
        },
        getEvent: function(e) {
            return TWC.Events[e] || TWC.Events.createEvent(e),
            TWC.Events[e]
        },
        exists: function(e) {
            return !!TWC.Events[e]
        },
        removeEvent: function(e) {
            for (var t in TWC.Events)
                if (t === e) {
                    delete TWC.Events[t];
                    break
                }
        },
        fetchEvent: function(e) {
            return TWC.Events[e]
        },
        getDummyDeferredEvent: function() {
            return jQuery.Deferred(function(e) {
                e.resolve()
            }).promise()
        }
    },
    LocalStorage: {
        persistValue: function(e, t, n) {
            var a = jQuery.Deferred();
            return n = n || 0,
            e ? (jQuery.jStorage.listenKeyChange(e, function(e, t) {
                jQuery.jStorage.stopListening(e, this),
                a.resolve()
            }),
            jQuery.jStorage.set(e, t),
            n > 0 && jQuery.jStorage.setTTL(e, n),
            a.promise()) : (a.reject(),
            a.promise())
        },
        getPersistedValue: function(e) {
            return jQuery.jStorage.get(e)
        },
        removePersistedValue: function(e) {
            return jQuery.jStorage.deleteKey(e)
        },
        isPersistedKey: function(e) {
            return "undefined" != typeof getPersistedValue(e) && null != getPersistedValue(e)
        }
    },
    PcoUtils: {
        capitalize: function(e, t, n) {
            var a, o, r, i, s, c, d;
            if (e = String(e),
            d = n ? new RegExp("[\\s-',]","g") : new RegExp("[\\s]","g"),
            t) {
                for (a = e.split(d),
                s = []; null !== (c = d.exec(e)); )
                    s.push(c[0]);
                for (o = "",
                r = 0; r < a.length; r++)
                    i = r < a.length - 1 ? s[r] : "",
                    o += "s" === a[r] && r > 0 && "'" === s[r - 1] ? "s" + i : a[r].charAt(0).toUpperCase() + a[r].slice(1).toLowerCase() + i;
                return o
            }
            return e && e.charAt(0).toUpperCase() + e.slice(1)
        },
        tokenReplace: function(e, t) {
            return e.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(e, n) {
                return t[n]
            })
        },
        getURLParameter: function(e, t) {
            var n = new RegExp("[?&]" + e + "=([^&]*)").exec(t ? t : window.location.search);
            return n && decodeURIComponent(n[1].replace(/\+/g, " "))
        },
        generateUUID: function() {
            var e = (new Date).getTime()
              , t = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                var n = (e + 16 * Math.random()) % 16 | 0;
                return e = Math.floor(e / 16),
                ("x" == t ? n : 3 & n | 8).toString(16)
            });
            return t
        },
        removeURLParameter: function(e, t) {
            var n = e.indexOf(t + "=");
            if (n === -1)
                return e;
            var a = e.substring(0, n)
              , o = e.substring(n).indexOf("&")
              , r = o === -1 ? "" : e.substring(n + o + 1);
            return r || (a = a.replace(/[\&\?]$/, "")),
            a + r
        },
        getPathInfo: function() {
            return window.location.pathname.substr(window.location.pathname.lastIndexOf("index.html") + 1)
        },
        getURLlocid: function() {
            if (window.explicit_location)
                return window.explicit_location;
            var e = location.pathname;
            if (e) {
                var t = decodeURIComponent(e).match("(.*)/([^?#&]+)")
                  , n = t && 3 === t.length ? t[2] : null;
                return n && !n.match(/:/) && n.indexOf(",") === -1 && (isNaN(n) || (n += ":4:US")),
                n
            }
            return null
        },
        genRandStr: function(e, t) {
            for (var n = t ? t : "0123456789", a = e ? e : 16, o = "", r = 0; r < a; r++)
                o += n.charAt(Math.floor(Math.random() * n.length) % n.length);
            return o
        },
        restrictExtend: function(e) {
            "preventExtensions"in Object && Object.preventExtensions(e)
        },
        get_dsx_records: function(e, t) {
            if (t) {
                var n = 0;
                jQuery.each(TWC.callbacks, function(e, a) {
                    0 === e.indexOf(t) && n++
                }),
                t = t + "_" + n
            }
            if (navigator.userAgent.indexOf("Firefox") > -1)
                var a = (new Date).getTime()
                  , o = TWC.Configs.dsx.host + (jQuery.isArray(e) ? "(" + e.join(";") + ")" : e) + "?_=" + a + "&jsonp=?"
                  , r = this
                  , i = new Date
                  , s = t ? t : "_" + TWC.JSONPCounter++
                  , c = jQuery.Deferred();
            else
                var o = TWC.Configs.dsx.host + (jQuery.isArray(e) ? "(" + e.join(";") + ")" : e) + "?jsonp=?"
                  , r = this
                  , i = new Date
                  , s = t ? t : "_" + TWC.JSONPCounter++
                  , c = jQuery.Deferred();
            this.performanceNode = this.performanceNode || window.twcperf || {
                log_dsx_call: function() {}
            },
            TWC.callbacks[s] = function(e) {
                t && TWC.PcoUtils.setTiming("callbackCalledAt", (new Date).getTime()),
                c.resolve(e)
            }
            ;
            var d = {
                url: o,
                dataType: "jsonp",
                contentType: "application/json",
                data: {
                    api: TWC.Configs.dsx.apiKey
                },
                cache: !0,
                timeout: 1e4,
                jsonpCallback: "TWC.callbacks." + s
            }
              , l = jQuery.ajax(d);
            l.always(function() {
                var t = ((new Date).getTime() - i.getTime()) / 1e3;
                r.performanceNode.log_dsx_call("/" + e, !1, t),
                "resolved" !== c.state() && c.reject()
            });
            var u = c.promise();
            return u.success = function(e) {
                u.then(e)
            }
            ,
            u.error = function(e) {
                u.fail(e)
            }
            ,
            u
        },
        debugMode: function(e) {
            var t = new Date((new Date).getTime() + 864e5);
            angular.element.cookie("debug", e, {
                path: "/",
                domain: ".weather.com",
                expires: t
            })
        },
        setTiming: function(e, t) {
            window.windowRenderStartTime && (window.utag_data["adtiming." + e] = t - window.windowRenderStartTime)
        },
        toISOTimeFormat: function(e, t) {
            var n = "+"
              , a = "00";
            t < 0 && (n = "-",
            t *= -1);
            var o = t > 9 ? "" : "0";
            return t % 1 !== 0 && (t = parseInt(t),
            a = "30"),
            e.replace(" ", "T") + n + o + t + ":" + a
        },
        fromISOToDate: function() {
            var e = "2011-11-24T09:00:27+0200"
              , t = Date.parse(e);
            if (1322118027e3 === t)
                return function(e) {
                    return new Date(Date.parse(e))
                }
                ;
            var n = function(e) {
                var t = jQuery.map(e.slice(0, -5).split(/\D/), function(e) {
                    return parseInt(e, 10) || 0
                });
                t[1] -= 1,
                t = new Date(Date.UTC.apply(Date, t));
                var n = e.slice(-5)
                  , a = parseInt(n, 10) / 100;
                return "+" === n.slice(0, 1) && (a *= -1),
                t.setHours(t.getHours() + a),
                t
            };
            return 1322118027e3 === n(e) ? n : function(e) {
                var t, n, a = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):?(\d\d))?$/, o = a.exec(e) || [];
                return o[1] ? (t = jQuery.map(o[1].split(/\D/), function(e) {
                    return parseInt(e, 10) || 0
                }),
                t[1] -= 1,
                t = new Date(Date.UTC.apply(Date, t)),
                t.getDate() ? (o[5] && (n = parseInt(o[5], 10) / 100 * 60,
                o[6] && (n += parseInt(o[6], 10)),
                "+" === o[4] && (n *= -1),
                n && t.setUTCMinutes(t.getUTCMinutes() + n)),
                t) : NaN) : NaN
            }
        }(),
        getTzOffset: function(e) {
            var t = e.substr(e.length - 6, 1)
              , n = parseInt(e.substr(e.length - 5, 2))
              , a = 0 === parseInt(e.substr(e.length - 2, 2)) ? 0 : .5;
            return (n + a) * ("-" === t ? -1 : 1)
        },
        getDateTimeISO: function() {
            var e, t = this.getURLlocid();
            t.match(/:/) || t.indexOf(",") !== -1 || (t += ":4:US");
            var n = jQuery.Deferred()
              , a = TWC.PcoUtils.get_dsx_records("cs/v2/datetime/en_US/" + t);
            return a.success(function(t) {
                return e = t && t.body && t.body.datetime ? t.body.datetime : (new Date).toISOString(),
                n.resolve(e)
            }),
            a.error(function() {
                return e = (new Date).toISOString(),
                n.resolve(e)
            }),
            n
        },
        Utf8ArrayToStr: function(e) {
            var t, n, a, o, r, i;
            for (t = "",
            a = e.length,
            n = 0; n < a; )
                switch (o = e[n++],
                o >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    t += String.fromCharCode(o);
                    break;
                case 12:
                case 13:
                    r = e[n++],
                    t += String.fromCharCode((31 & o) << 6 | 63 & r);
                    break;
                case 14:
                    r = e[n++],
                    i = e[n++],
                    t += String.fromCharCode((15 & o) << 12 | (63 & r) << 6 | (63 & i) << 0)
                }
            return t
        },
        getDecodedSaml: function(e) {
            if ("undefined" != typeof pako && pako && e) {
                var t = decodeURIComponent(e)
                  , n = atob(t)
                  , a = pako.inflateRaw(n)
                  , o = this.Utf8ArrayToStr(a);
                return o
            }
        }
    }
}),
Function.prototype.createSubClass = function(e) {
    var t = this
      , n = function() {
        return t.apply(this, arguments)
    };
    jQuery.extend(n, t);
    var a = function() {
        this.constructor = n
    };
    return a.prototype = t.prototype,
    n.prototype = new a,
    e && jQuery.extend(n.prototype, e),
    n.__super__ = t.prototype,
    n
}
,
Function.prototype.getKey = function(e, t) {
    return Object.keys(e).filter(function(n) {
        return e[n] === t
    })[0]
}
,
Function.prototype.throttle = function(e) {
    var t = this
      , n = null
      , a = e;
    return function() {
        var e = this
          , o = arguments
          , r = Date.now();
        (!n || r - n >= a) && (n = r,
        t.apply(e, o))
    }
}
,
Function.prototype.debounce = function(e) {
    var t = this
      , n = null
      , a = e;
    return function() {
        function e() {
            t.apply(o, r),
            n = null
        }
        var o = this
          , r = arguments;
        n && clearTimeout(n),
        n = setTimeout(e, a)
    }
}
,
Function.prototype.getKey = function(e, t) {
    return Object.keys(e).filter(function(n) {
        return e[n] === t
    })[0]
}
,
Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
    var t = this.length >>> 0
      , n = Number(arguments[1]) || 0;
    for (n = n < 0 ? Math.ceil(n) : Math.floor(n),
    n < 0 && (n += t); n < t; n++)
        if (n in this && this[n] === e)
            return n;
    return -1
}
),
Array.prototype.map || (Array.prototype.map = function(e, t) {
    var n, a, o;
    if (null == this)
        throw new TypeError(" this is null or not defined");
    var r = Object(this)
      , i = r.length >>> 0;
    if ("function" != typeof e)
        throw new TypeError(e + " is not a function");
    for (t && (n = t),
    a = new Array(i),
    o = 0; o < i; ) {
        var s, c;
        o in r && (s = r[o],
        c = e.call(n, s, o, r),
        a[o] = c),
        o++
    }
    return a
}
),
"function" != typeof String.prototype.trim && (String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "")
}
),
Object.keys || (Object.keys = function() {
    var e = Object.prototype.hasOwnProperty
      , t = !{
        toString: null
    }.propertyIsEnumerable("toString")
      , n = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"]
      , a = n.length;
    return function(o) {
        if ("object" != typeof o && "function" != typeof o || null === o)
            throw new TypeError("Object.keys called on non-object");
        var r = [];
        for (var i in o)
            e.call(o, i) && r.push(i);
        if (t)
            for (var s = 0; s < a; s++)
                e.call(o, n[s]) && r.push(n[s]);
        return r
    }
}()),
Array.prototype.filter || (Array.prototype.filter = function(e) {
    "use strict";
    if (void 0 === this || null === this)
        throw new TypeError;
    var t = Object(this)
      , n = t.length >>> 0;
    if ("function" != typeof e)
        throw new TypeError;
    for (var a = [], o = arguments.length >= 2 ? arguments[1] : void 0, r = 0; r < n; r++)
        if (r in t) {
            var i = t[r];
            e.call(o, i, r, t) && a.push(i)
        }
    return a
}
),
console = window.console || {},
jQuery.isEmptyObject(console) && (console.log = function() {}
),
jQuery.fn.inViewport = function(e, t) {
    null != e && "undefined" != typeof e || (e = 1),
    null != t && "undefined" != typeof t || (t = 1);
    var n = jQuery(window)
      , a = {
        top: n.scrollTop(),
        left: n.scrollLeft()
    };
    a.right = a.left + n.width(),
    a.bottom = a.top + n.height();
    var o = this.outerHeight()
      , r = this.outerWidth();
    if (!r || !o)
        return !1;
    var i = this.offset();
    i.right = i.left + r,
    i.bottom = i.top + o;
    var s = !(a.right < i.left || a.left > i.right || a.bottom < i.top || a.top > i.bottom);
    if (!s)
        return !1;
    var c = {
        top: Math.min(1, (i.bottom - a.top) / o),
        bottom: Math.min(1, (a.bottom - i.top) / o),
        left: Math.min(1, (i.right - a.left) / r),
        right: Math.min(1, (a.right - i.left) / r)
    };
    return c.left * c.right >= e && c.top * c.bottom >= t
}
,
Date.prototype.toISOString || (Date.prototype.toISOString = function() {
    function e(e, t) {
        var n = "0000";
        return e = "" + e,
        n.substr(0, t - e.length) + e
    }
    var t = this
      , n = t.getUTCFullYear()
      , a = e(t.getUTCMonth() + 1, 2)
      , o = e(t.getUTCDate(), 2)
      , r = e(t.getUTCHours(), 2)
      , i = e(t.getUTCMinutes(), 2)
      , s = e(t.getUTCSeconds(), 2)
      , c = e(t.getUTCMilliseconds(), 3);
    return n + "-" + a + "-" + o + "T" + r + ":" + i + ":" + s + "." + c + "Z"
}
),
function() {
    if (!window.addEventListener) {
        Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
            if (0 === this.length)
                return -1;
            var t = 0;
            if (arguments.length > 1 && (t = Number(arguments[1]),
            isNaN(t) ? t = 0 : 0 !== t && t !== 1 / 0 && t !== -(1 / 0) && (t = (t > 0 || -1) * Math.floor(Math.abs(t)))),
            t >= this.length)
                return -1;
            for (var n = t >= 0 ? t : Math.max(this.length - Math.abs(t), 0); n < this.length; ) {
                if (n in this && this[n] === e)
                    return n;
                ++n
            }
            return -1
        }
        ),
        Array.prototype.filter || (Array.prototype.filter = function(e) {
            if (void 0 === this || null === this)
                throw new TypeError;
            var t = Object(this)
              , n = t.length >>> 0;
            if ("function" != typeof e)
                throw new TypeError;
            for (var a = [], o = arguments.length >= 2 ? arguments[1] : void 0, r = 0; r < n; r++)
                if (r in t) {
                    var i = t[r];
                    e.call(o, i, r, t) && a.push(i)
                }
            return a
        }
        ),
        Array.isArray || (Array.isArray = function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
        ),
        Array.prototype.every || (Array.prototype.every = function(e, t) {
            "use strict";
            var n, a;
            if (null == this)
                throw new TypeError("this is null or not defined");
            var o = Object(this)
              , r = o.length >>> 0;
            if ("function" != typeof e)
                throw new TypeError;
            for (arguments.length > 1 && (n = t),
            a = 0; a < r; ) {
                var i;
                if (a in o) {
                    i = o[a];
                    var s = e.call(n, i, a, o);
                    if (!s)
                        return !1
                }
                a++
            }
            return !0
        }
        ),
        Object.create || (Object.create = function() {
            var e = function() {};
            return function(t) {
                if (arguments.length > 1)
                    throw new Error("Second argument not supported");
                if ("object" != typeof t)
                    throw new TypeError("Argument must be an object");
                e.prototype = t;
                var n = new e;
                return e.prototype = null,
                n
            }
        }()),
        Array.prototype.forEach || (Array.prototype.forEach = function(e) {
            if (void 0 === this || null === this)
                throw new TypeError;
            var t = Object(this)
              , n = t.length >>> 0;
            if ("function" != typeof e)
                throw new TypeError;
            for (var a = arguments.length >= 2 ? arguments[1] : void 0, o = 0; o < n; ++o)
                o in t && e.call(a, t[o], o, t)
        }
        ),
        String.prototype.trim || (String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/gm, "")
        }
        ),
        Date.now || (Date.now = function() {
            return (new Date).getTime()
        }
        ),
        Function.prototype.bind || (Function.prototype.bind = function(e) {
            if ("function" != typeof this)
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            var t = Array.prototype.slice.call(arguments, 1)
              , n = this
              , a = function() {}
              , o = function() {
                return n.apply(this instanceof a && e ? this : e, t.concat(Array.prototype.slice.call(arguments)))
            };
            return a.prototype = this.prototype,
            o.prototype = new a,
            o
        }
        ),
        Object.keys || (Object.keys = function(e) {
            var t = [];
            for (var n in e)
                e.hasOwnProperty(n) && t.push(n);
            return t
        }
        ),
        Object.getPrototypeOf || (Object.getPrototypeOf = function(e) {
            return e.__proto__ || e.constructor.prototype
        }
        ),
        window.XMLHttpRequest || (window.XMLHttpRequest = function() {
            var e = new ActiveXObject("Microsoft.XMLHTTP")
              , t = {
                isFake: !0,
                send: function(t) {
                    return e.send(t)
                },
                open: function(t, n, a, o, r) {
                    return e.open(t, n, a, o, r)
                },
                abort: function() {
                    return e.abort()
                },
                setRequestHeader: function(t, n) {
                    return e.setRequestHeader(t, n)
                },
                getResponseHeader: function(t) {
                    return e.getResponseHeader(t)
                },
                getAllResponseHeaders: function() {
                    return e.getAllResponseHeaders()
                },
                overrideMimeType: function(t) {
                    return e.overrideMimeType(t)
                }
            };
            return e.onreadystatechange = function() {
                t.readyState = e.readyState,
                4 === e.readyState && 200 === e.status && (t.status = e.status,
                t.responseText = e.responseText,
                t.responseXML = e.responseXML,
                t.statusText = e.statusText,
                t.onload && t.onload.apply(this, arguments)),
                t.onreadystatechange && t.onreadystatechange.apply(this, arguments)
            }
            ,
            t
        }
        );
        var e = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            this.onreadystatechange || (this.onreadystatechange = function() {
                4 === this.readyState && this.onload && this.onload()
            }
            ),
            e.apply(this, arguments)
        }
        ,
        Object.create = function() {
            var e = function() {};
            return function(t) {
                if (arguments.length > 1)
                    throw Error("Second argument not supported");
                if ("object" != typeof t)
                    throw TypeError("Argument must be an object");
                e.prototype = t;
                var n = new e;
                return e.prototype = null,
                n
            }
        }(),
        "function" != typeof Object.getPrototypeOf && (Object.getPrototypeOf = "".__proto__ === String.prototype ? function(e) {
            return e.__proto__
        }
        : function(e) {
            return e.constructor.prototype
        }
        ),
        function() {
            var e = function(t) {
                var n, a = "", o = 0, r = t.nodeType;
                if (r) {
                    if (1 === r || 9 === r || 11 === r)
                        for (t = t.firstChild; t; t = t.nextSibling)
                            a += e(t);
                    else if (3 === r || 4 === r)
                        return t.nodeValue
                } else
                    for (; n = t[o++]; )
                        a += e(n);
                return a
            };
            if (Object.defineProperty && Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(Element.prototype, "textContent") && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
                Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
                Object.defineProperty(Element.prototype, "textContent", {
                    get: function() {
                        return e(this)
                    },
                    set: function(e) {
                        for (; this.hasChildNodes(); )
                            this.removeChild(this.lastChild);
                        return this.appendChild((this && this.ownerDocument || document).createTextNode(e))
                    }
                })
            }
        }(),
        !window.addEventListener && function(e, t, n, a, o, r, i) {
            e[a] = t[a] = n[a] = function(e, t) {
                var n = this;
                if (i.unshift([n, e, t, function(e) {
                    e.currentTarget = n,
                    e.preventDefault = function() {
                        e.returnValue = !1
                    }
                    ,
                    e.stopPropagation = function() {
                        e.cancelBubble = !0
                    }
                    ,
                    e.target = e.srcElement || n,
                    t.call(n, e)
                }
                ]),
                "load" === e && this.tagName && "SCRIPT" === this.tagName) {
                    var a = i[0][3];
                    this.onreadystatechange = function(e) {
                        "loaded" !== this.readyState && "complete" !== this.readyState || a.call(this, {
                            type: "load"
                        })
                    }
                } else
                    this.attachEvent("on" + e, i[0][3])
            }
            ,
            e[o] = t[o] = n[o] = function(e, t) {
                for (var n, a = 0; n = i[a]; ++a)
                    if (n[0] == this && n[1] == e && n[2] == t)
                        return "load" === e && this.tagName && "SCRIPT" === this.tagName && (this.onreadystatechange = null),
                        this.detachEvent("on" + e, i.splice(a, 1)[0][3])
            }
            ,
            e[r] = t[r] = n[r] = function(e) {
                return this.fireEvent("on" + e.type, e)
            }
        }(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", [])
    }
}(),
TWC.Events.getEvent("core-util-is-loaded").resolve(),
function(e, t) {
    //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    return;

    window.utag_data = window.utag_data || {},
    window.amznads = window.amznads || {};
    var n = t && t.Configs && t.Configs.dsx && t.Configs.dsx.locale
      , a = "de_DE" === n && "3128" || "1004";
    amznads.asyncParams = {
        id: a,
        callbackFn: function() {
            var e = amznads.getTargeting();
            return amznads.hasAds() && utag_data && e ? (utag_data["js_page.amznslots"] = e.amznslots instanceof Array && e.amznslots.join(",") || "",
            e.amzn_vid && e.amzn_vid instanceof Array && (utag_data["js_page.amzn_vid"] = e.amzn_vid.join(",")),
            e.amzn_vid ? utag_data["js_page.amzn_vid"] = e.amzn_vid : utag_data["js_page.amzn_vid"] = "",
            void t.Events.getEvent("amznslotsReady").resolve()) : void t.Events.getEvent("amznslotsReady").resolve()
        },
        timeout: 2e3
    },
    "de_DE" !== n && (t.PcoUtils.setTiming("amznslotsStart", (new Date).getTime()),
    e.ajax({
        url: "https://c.amazon-adsystem.com/aax2/amzn_ads.js",
        dataType: "script"
    }))
}(jQuery, TWC),
function(e, t) {

  //TODO
  return;

    var n = t && t.Events
      , a = n.getEvent && t.Events.getEvent("criteoReady");
    setTimeout(function() {
        a.resolve()
    }, 5e3),
    t.PcoUtils.setTiming("criteoStart", (new Date).getTime()),
    e.ajax({
        url: "https://rtax.criteo.com/delivery/rta/rta.js?netId=2305&cookieName=cto_weather&varName=crtg_content",
        dataType: "script",
        success: function() {
            a.resolve()
        }
    })
}(jQuery, TWC),
function(e, t) {

  //TODO
  return;

    var n = t && t.Configs && t.Configs.dsx && t.Configs.dsx.locale
      , a = t && t.Events
      , o = t.Events.getEvent("wfxtgReady");
    "de_DE" !== n && "http:" === window.location.protocol ? a.getEvent("pcoReady").done(function() {
        var n = e.jStorage.get("user")
          , a = t && t.pco && t.pco.getNodeValue && t.pco.getNodeValue("page", "currentLocation")
          , r = a && a.zipCd || n && n.lastVisitedLocation && n.lastVisitedLocation.zipCd || n && n.savedLocations && e.isArray(n.savedLocations) && n.savedLocations[0] && n.savedLocations[0].zipCd || n && n.recentSearchLocations && e.isArray(n.recentSearchLocations) && n.recentSearchLocations[0] && n.recentSearchLocations[0].zipCd || ""
          , i = r
          , s = (n && n.currentLocation && n.currentLocation.zipCd || "",
        function(e, t, n) {
            return e[t] && e[t][n] && e[t][n][0] && e[t][n][0].segments || []
        }
        );
        e.ajax("https://triggers.wfxtriggers.com/json/?resp_type=json&acctid=5E2FB6&current=true&zcs=" + r + "&nzcs=" + i, {
            dataType: "jsonp",
            timeout: 5e3,
            success: function(n) {
                var a = n && n.wfxtg
                  , o = e.isArray(n.wfxtg.current) && n.wfxtg.current.join(",") || ""
                  , r = e.isArray(a.scatterSegs) && a.scatterSegs
                  , i = s(r, 0, "zcs")
                  , c = s(r, 1, "nzcs")
                  , d = i.join(",")
                  , l = c.join(",");
                window.utag_data = window.utag_data || {},
                utag_data["js_page.wfxtg"] = o,
                utag_data["js_page.scatter_zcs"] = d,
                utag_data["js_page.scatter_nzcs"] = l,
                t.Events.getEvent("wfxtgReady").resolve()
            },
            error: function() {
                o.resolve()
            }
        })
    }) : o.resolve()
}(jQuery, TWC),
function(e, t) {

  //TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  return;

    var n = t && t.Configs && t.Configs.dsx && t.Configs.dsx.locale
      , a = t && t.Events
      , o = a.getEvent("lotameReady");
    "de_DE" !== n ? a.getEvent("pcoReady").done(function() {
        var n = "https://ad.crwdcntrl.net/5/c=2215/pe=y/callback=?";
        e.ajax({
            url: n,
            dataType: "jsonp",
            cache: !0,
            type: "GET",
            timeout: 5e3,
            success: function(e) {
                t.Events.getEvent("pcoReady").done(function() {
                    var n, a, r, i, s;
                    if (s = t.pco.getNodeValue("user", "lotame") || {},
                    n = s.lot_tpid = e && e.Profile && e.Profile.tpid || s.lot_tpid,
                    a = s.lot_tpid = e && e.Profile && e.Profile.pid || s.lot_pid,
                    r = s && s.lot_abbr || "",
                    i = s && s.lot_id || "",
                    audienceLength = e && e.Profile && e.Profile.Audiences && e.Profile.Audiences.Audience && e.Profile.Audiences.Audience.length,
                    audienceLength > 0) {
                        r = "",
                        i = "";
                        for (var c = 0; c < audienceLength; c++)
                            r += e.Profile.Audiences.Audience[c].abbr + (c < audienceLength - 1 ? "," : ""),
                            i += e.Profile.Audiences.Audience[c].id + (c < audienceLength - 1 ? "," : "");
                        s.lot_abbr = r,
                        s.lot_id = i
                    }
                    if (t.pco.setNodeValue("user", "lotame", s),
                    utag_data && (utag_data["js_page.tpid"] = n,
                    utag_data["js_page.lpid"] = a,
                    utag_data["js_page.sg"] = i),
                    window._cc1884) {
                        var d = t && t.pco && t.pco.getNodeValue;
                        if (t.pco.get("user")) {
                            var l = d("user", "age") || ""
                              , u = d("user", "gender") || "";
                            l && _cc1884.add("seg", "a_" + l),
                            u && _cc1884.add("seg", "g_" + u),
                            t.pco.get("metrics") && (_cc1884.add("seg", "level1_" + d("metrics", "level1")),
                            _cc1884.add("seg", "level2_" + d("metrics", "level2")),
                            _cc1884.add("seg", "level3_" + d("metrics", "level3")),
                            _cc1884.add("seg", "level4_" + d("metrics", "level4"))),
                            t.pco.get("ad") && (d("ad", "location") && _cc1884.add("seg", "dma_" + d("ad", "location").dmaCd),
                            _cc1884.add("seg", "zone_" + d("ad", "zone"))),
                            t.pco.get("page") && _cc1884.add("seg", "lang_" + d("page", "lang")),
                            _cc1884.bcp()
                        }
                        o.resolve()
                    }
                })
            },
            error: function() {
                o.resolve(!1)
            }
        })
    }) : o.resolve()
}(jQuery, TWC),
TWC.tealium = TWC.tealium || {},
window.utag_data = window.utag_data || {},
// TWC.Events.ifReady(["pcoReady", "amznslotsReady", "lotameReady", "criteoReady", "wfxtgReady"]).done(function() {
TWC.Events.ifReady(["pcoReady", "lotameReady"]).done(function() {
    var e = TWC.pco.getNodeValue
      , t = (TWC.pco.setNodeValue,
    jQuery)
      , n = e("page", "content")
      , a = e("page", "screenSize")
      , o = "mobileSized" === a
      , r = "tabletSized" === a
      , i = o && "mobile" || r && "tablet" || "desktop"
      , s = navigator && navigator.userAgent
      , c = s && s.match(/chrome|firefox|safari|trident/i);
    if (c && jQuery.isArray(c))
        switch (c[0].toLowerCase()) {
        case "chrome":
            utag_data.brwsr = "twcchrome";
            break;
        case "firefox":
            utag_data.brwsr = "twcff";
            break;
        case "safari":
            utag_data.brwsr = "twcsafari";
            break;
        case "trident":
            utag_data.brwsr = "twcie";
            break;
        default:
            utag_data.brwsr = "twcnative"
        }
    var d = jQuery.cookie("uplogin") ? "logged in" : "not logged in";
    utag_data["js_page.loggedin"] = d,
    utag_data["js_page.isMobile"] = !1,
    e("page", "variant") ? utag_data["js_page.isMobile"] = "big" !== e("page", "variant") : "mobile" === i && (utag_data["js_page.isMobile"] = !0),
    e("page", "currentLocation") && !e("page", "currentLocation").error && (utag_data["js_page.locTypeIdName"] = e("page", "currentLocation").locType + ":" + e("page", "currentLocation").locId + ":" + e("page", "currentLocation").cityNm.replace(/ /g, "_")),
    utag_data["js_page.fromStr"] = utag_data["js_page.fromStr2"] = e("page", "fromStr"),
    utag_data["js_page.impression_id"] = e("ad", "impression_id"),
    utag_data["js_page.pagename"] = utag_data["js_page.pagename2"] = e("metrics", "level1") + ":" + e("metrics", "pagename"),
    utag_data["js_page.level1"] = utag_data["js_page.level1_2"] = utag_data["js_page.channel"] = e("metrics", "level1"),
    utag_data["js_page.contentSection"] = utag_data["js_page.contentSection2"] = e("metrics", "contentSection"),
    utag_data["js_page.contentFamily"] = utag_data["js_page.contentFamily2"] = e("metrics", "contentFamily"),
    utag_data["js_page.contentChannel"] = utag_data["js_page.contentChannel2"] = e("metrics", "contentChannel"),
    utag_data["js_page.timeframe"] = e("metrics", "level1") || "nl",
    utag_data["js_page.contentType"] = e("metrics", "contentType"),
    utag_data["js_page.current_url"] = document.location.href;
    var l, u, p, g = e("ad", "location"), f = e("page", "locale");
    g && (utag_data["js_page.lat"] = "" + g.lat,
    utag_data["js_page.lon"] = "" + g.long,
    p = f.split("-"),
    t.isArray(p) && p.length > 1 ? (p[1] = p[1].toUpperCase(),
    f = p.join("-")) : f = "en-US",
    utag_data["js_page.locale"] = f,
    utag_data["js_page.locid"] = 4 !== g.locType ? g.locId + "$" + g.locType : g.locId,
    utag_data["js_page.gpr"] = g._gprId,
    4 === g.locType ? utag_data["js_page.ent"] = "zip" : 1 === g.locType && (utag_data["js_page.ent"] = "city"),
    utag_data["js_page.dma"] = utag_data["js_page.dma2"] = g.dmaCd + "",
    utag_data["js_page.city"] = l = g.cityNm,
    utag_data["js_page.state"] = u = g.stCd,
    utag_data["js_page.zip"] = utag_data["js_page.zip2"] = g.zipCd,
    utag_data["js_page.cntryCd"] = g.cntryCd,
    utag_data["js_page.countyName"] = g.cntyNm,
    utag_data["js_page.locCityStateCountry"] = utag_data["js_page.locCityStateCountry2"] = l + ":" + u + ":" + g.cntryCd),
    utag_data["js_page.cond"] = utag_data["js_page.cond2"] = e("wx", "cond"),
    utag_data["js_page.pollen"] = e("wx", "pollen"),
    utag_data["js_page.temp"] = e("wx", "temp"),
    utag_data["js_page.tempc"] = e("wx", "tempc") + "",
    utag_data["js_page.tempR"] = e("wx", "tempR"),
    utag_data.tempRC = e("wx", "tempRC"),
    utag_data["js_page.fhi"] = e("wx", "fcst") && e("wx", "fcst").tempH || "",
    utag_data["js_page.fhr"] = e("wx", "fcst") && e("wx", "fcst").tempHR || "",
    utag_data["js_page.fli"] = e("wx", "fcst") && e("wx", "fcst").tempL || "",
    utag_data["js_page.flr"] = e("wx", "fcst") && e("wx", "fcst").tempLR || "",
    utag_data["js_page.fhic"] = e("wx", "fcst") && e("wx", "fcst").tempCH + "" || "",
    utag_data["js_page.floc"] = e("wx", "fcst") && e("wx", "fcst").tempCL + "" || "",
    utag_data["js_page.fltmpc"] = e("wx", "flsLkC") + "",
    utag_data["js_page.wind"] = e("wx", "wind"),
    utag_data["js_page.uv"] = e("wx", "uv"),
    utag_data["js_page.hum"] = e("wx", "hum"),
    utag_data["js_page.snw"] = e("wx", "snw"),
    utag_data["js_page.baroTendency"] = e("wx", "baroTendency"),
    utag_data["js_page.fsnw"] = e("wx", "fcst") && e("wx", "fcst").fsnw + "",
    utag_data["js_page.prcp"] = e("wx", "fcst") && e("wx", "fcst").prcp && e("wx", "fcst").prcp.prcpStr || "",
    utag_data["js_page.fc1"] = e("wx", "fcst") && e("wx", "fcst").cond && e("wx", "fcst").cond.fc1 || "",
    utag_data["js_page.fc2"] = e("wx", "fcst") && e("wx", "fcst").cond && e("wx", "fcst").cond.fc2 || "",
    utag_data["js_page.fc3"] = e("wx", "fcst") && e("wx", "fcst").cond && e("wx", "fcst").cond.fc3 || "",
    utag_data["js_page.d1"] = e("wx", "fcst") && e("wx", "fcst").fiveDay && e("wx", "fcst").fiveDay.d1 || "",
    utag_data["js_page.d2"] = e("wx", "fcst") && e("wx", "fcst").fiveDay && e("wx", "fcst").fiveDay.d2 || "",
    utag_data["js_page.d3"] = e("wx", "fcst") && e("wx", "fcst").fiveDay && e("wx", "fcst").fiveDay.d3 || "",
    utag_data["js_page.d4"] = e("wx", "fcst") && e("wx", "fcst").fiveDay && e("wx", "fcst").fiveDay.d4 || "",
    utag_data["js_page.d5"] = e("wx", "fcst") && e("wx", "fcst").fiveDay && e("wx", "fcst").fiveDay.d5 || "",
    utag_data["js_page.ord"] = utag_data["js_page.rmid"] = "" + e("user", "rmid"),
    utag_data["js_page.lang"] = e("page", "lang"),
    utag_data["js_page.primaryDecl"] = utag_data["js_page.primaryDecl2"] = "object" == typeof e("user", "declarations") && e("user", "declarations")[0];
    var h = String(window.location.pathname);
    if (h.indexOf("?") > -1) {
        var m = h.indexOf("?");
        h = h.substring(0, m)
    }
    if (h.indexOf("#") > -1) {
        var _ = h.indexOf("#");
        h = h.substring(0, _)
    }
    if ("/index.html" === h || "/" === h || "" === h)
        h = "index.html";
    else if (0 === h.indexOf("/interact/photogallery"))
        h = "/interact/photogallery";
    else if (0 === h.indexOf("/common/drilldown")) {
        for (var y = h.split("index.html"), v = 0; v < y.length; v++)
            "common" === v && "drilldown" === v || y.pop();
        h = y.join("index.html")
    } else if (h.indexOf(".html") > -1)
        ;
    else {
        var w = h.split("index.html");
        totalNum = w.length - 1;
        var T = w[totalNum];
        (T.match(/[A-Z]/) || T.match(/[0-9]/) || T.match(/[@#$%&!*:]/) || "" === T) && w.pop(),
        h = w.join("index.html")
    }
    utag_data["js_page.anonymizedURL"] = h;
    var C = e("metrics", "meta") && e("metrics", "meta").provider
      , j = e("metrics", "meta") && e("metrics", "meta").author && e("metrics", "meta").author.match(/(By )?([^()]*)(\(.*\))?/)[2];
    j && (j = j && j.replace(/ /, "_"),
    j = "By_" + j,
    utag_data["js_page.provider_author"] = utag_data["js_page.provider_author2"] = j && C ? C + ":" + j : null),
    utag_data["js_page.template"] = e("metrics", "meta") && e("metrics", "meta").page_template,
    utag_data["js_page.partner"] = e("page", "parStr") ? e("page", "partner") : "",
    utag_data["js_page.partner2"] = e("user", "partner") || "",
    utag_data["js_page.partner3"] = e("page", "partner") || "",
    utag_data["js_page.partnerSite"] = e("page", "partnerSite"),
    utag_data["js_page.partner_ilabel"] = e("page", "partner_ilabel");
    var b = e("page", "cm_ven")
      , x = e("page", "cm_cat")
      , S = e("page", "cm_pla")
      , L = e("page", "cm_ite");
    utag_data["js_page.campaign"] = utag_data["js_page.campaign2"] = utag_data["js_page.campaign3"] = b + x + S + L,
    e("page", "cm_ven") && (utag_data["js_page.campaignCode"] = e("metrics", "pagename") + "?cm_ven=" + e("page", "cm_ven")),
    utag_data["js_page.event_name"] = "event2",
    utag_data["js_page.severe"] = e("ad", "severe"),
    utag_data["js_page.assetId"] = e("page", "assetId"),
    utag_data["js_page.assetType"] = e("page", "assetType"),
    utag_data["js_page.DFP_Network_Code"] = 7646,
    utag_data["js_page.site"] = (utag_data["js_page.isMobile"],
    "web_intellicast_us");
    var W = e("ad", "adstest")
      , D = utag_data["js_page.site"];
    D = W ? "test_" + D : D,
    utag_data["js_page.ad_unit"] = "/" + utag_data["js_page.DFP_Network_Code"] + "/" + D;
    var A = e("ad", "zone");
    utag_data["js_page.zone"] = A && A.replace(/ /g, ""),
    utag_data["js_page.ugcLookup"] = e("ad", "ugcLookup"),
    utag_data["js_page.contains_videoplayer"] = e("page", "contains_videoplayer");
    var E = new Date;
    utag_data["js_page.date"] = E.getMonth() + 1 + "-" + E.getDate() + "-" + E.getFullYear(),
    utag_data["js_page.refurl"] = e("ad", "refurl") || "";
    var O = TWC.PcoUtils.getURLParameter("layers");
    layer = O && O.indexOf(",") === -1 ? O : O && O.split(",")[1],
    layer && (utag_data["js_page.mlayer"] = layer),
    utag_data["js_page.site"] && utag_data["js_page.site"].match(/web_intellicast_us/) ? utag_data["js_page.plat"] = "icast" : utag_data["js_page.plat"] = "icast_mw",
    utag_data["js_page.cobrand"] = e("user", "cobrand") || "",
    utag_data["js_page.env"] = e("page", "env") || "",
    utag_data["js_page.age"] = e("user", "age") || "",
    utag_data["js_page.flash"] = e("user", "flash") && e("user", "flash").version || "",
    utag_data["js_page.gender"] = e("user", "gender");
    for (var P = e("user", "savedLocations"), R = P && P.length || 0, N = [], I = 0; I < R; I++)
        N.push(P[I].loc);
    utag_data["js_page.savedLocs"] = R + "^" + N.join(",");
    for (var U = e("user", "recentSearchLocations"), k = U && U.length || 0, M = [], z = 0; z < k; z++)
        M.push(U[z].loc);
    utag_data["js_page.recentLocs"] = k + "^" + M.join(","),
    utag_data["js_page.preferredLocation"] = e("user", "preferredLocation") && e("user", "preferredLocation").loc;
    for (var Q = e("metrics", "level1") || "", F = "level", V = 2; V < 5; V++)
        F = "level" + V,
        Q += e("metrics", F) ? "-" + e("metrics", F) : "";
    utag_data["js_page.hier1"] = Q,
    utag_data["js_page.pos"] = [],
    utag_data["js_page.sizes"] = [],
    utag_data["js_page.sponstory"] = e("ad", "sponstory"),
    window._sf_startpt = (new Date).getTime(),
    "video" === n && (utag_data.cable_provider = jQuery.cookie("twcSignonAuth_mvpd") || ""),
    TWC.Events.getEvent("utag_dataReady").resolve()
}),
window.TWC = window.TWC || {},
TWC.validators = {
    NO_VALIDATOR: function(e, t) {
        return !0
    },
    NOT_NULL_VALIDATOR: function(e, t) {
        return !!e
    },
    OBJECT_VALIDATOR: function(e, t) {
        return "object" === jQuery.type(val)
    },
    ARRAY_VALIDATOR: function(e, t) {
        return "array" === t.type(val)
    }
},
TWC.node_rules = function() {
    var e = {
        user: {
            allowedAttributes: {
                age: null,
                currentLocation: TWC.validators.OBJECT_VALIDATOR,
                declarations: TWC.validators.ARRAY_VALIDATOR,
                preferredLocation: TWC.validators.OBJECT_VALIDATOR,
                date: null,
                day: null,
                browser: null,
                flash: null,
                gender: null,
                lotame: null,
                lastVisitedLocation: null,
                partner: null,
                locale: null,
                rmid: null,
                signedIn: null,
                site: null,
                time: null,
                tzOffset: null,
                unit: null,
                currentBackTo: TWC.validators.OBJECT_VALIDATOR,
                backTo: TWC.validators.OBJECT_VALIDATOR,
                savedLocations: TWC.validators.ARRAY_VALIDATOR,
                recentSearchLocations: TWC.validators.ARRAY_VALIDATOR,
                local_suite_bg: TWC.validators.OBJECT_VALIDATOR,
                titan_local_suite_bgwt: TWC.validators.OBJECT_VALIDATOR,
                titan_local_suite_bgwp: TWC.validators.OBJECT_VALIDATOR,
                article_bg: TWC.validators.OBJECT_VALIDATOR,
                preferredSite: null
            }
        }
    };
    return {
        getNodeConfig: function(t) {
            return e[t]
        }
    }
}(),
TWC.PcoUtils.setTiming("pcoLoad", (new Date).getTime()),
window.TWC = window.TWC || {},
TWC.Node = function() {
    this.nodeName = "node",
    this.attributes = {},
    this.promises = [],
    this.isPersisted = !1,
    this.restrictExtend = !1,
    this.init(jQuery, arguments),
    this.postInit(jQuery, arguments),
    this.process(jQuery, arguments),
    this.restrictExtendBehavior(jQuery),
    this.writeTimer,
    this.storageWritePromises = []
}
,
TWC.Node.prototype = {
    postInit: function(e, arguments) {
        if (this.isPersisted) {
            var t = TWC.LocalStorage.getPersistedValue(this.getPersistKey());
            t && ("expirationTime"in t && t.expirationTime && !(t.expirationTime > (new Date).getTime()) || e.extend(this.attributes, t))
        }
        arguments && arguments.length > 0 && e.extend(this.attributes, arguments[0])
    },
    restrictExtendBehavior: function(e) {
        if (this.restrictExtend) {
            var t = this;
            e.when.apply(e, this.promises).done(function() {
                TWC.PcoUtils.restrictExtend(t)
            })
        }
    },
    getNodeName: function() {
        return this.nodeName
    },
    getPromises: function() {
        return this.promises
    },
    getAttributes: function() {
        return this.attributes
    },
    get: function(e) {
        return this.attributes[e]
    },
    getTransformedValue: function(e, t) {
        var n;
        if ("config"in this && "NULL_KEYNAME"in this.config && (n = this.config.NULL_KEYNAME),
        !t)
            return n;
        var a = this.transform_rules[e](t, jQuery);
        return a ? a : n
    },
    set: function(e, t) {
        var n, a = "overrideSet" + TWC.PcoUtils.capitalize(e);
        return a in this ? this[a](jQuery, t) : this.attributes[e] = "transform_rules"in this && e in this.transform_rules ? this.getTransformedValue(e, t) : t,
        n = this.persistAttributes(e),
        this.checkEventTriggers(e),
        n
    },
    deleteKey: function(e) {
        delete this.attributes[e]
    },
    getPersistKey: function() {
        return "persistKey"in this ? this.persistKey : this.nodeName
    },
    deleteKeyIfNotAllowed: function(e, t) {
        t in e || delete this.attributes[t]
    },
    cleanUpObject: function(e, t) {
        if (t)
            this.deleteKeyIfNotAllowed(e, t);
        else
            for (var n in this.attributes)
                this.deleteKeyIfNotAllowed(e, n)
    },
    persistAttributes: function(e) {
        if (this.isPersisted) {
            var t = TWC.node_rules.getNodeConfig(this.nodeName);
            this.restrictExtend && t && t.allowedAttributes && this.cleanUpObject(t.allowedAttributes, e),
            this.localStorageWrite()
        }
    },
    localStorageWrite: function(e) {
        var t = this
          , n = jQuery.Deferred();
        return this.writeTimer && (clearTimeout(this.writeTimer),
        this.writeTimer = void 0),
        this.storageWritePromises || (this.storageWritePromises = []),
        this.storageWritePromises.push(n),
        this.writeTimer = setTimeout(function() {
            var n = TWC.LocalStorage.persistValue(t.getPersistKey(), e || t.attributes);
            n.then(function() {
                jQuery.each(t.storageWritePromises, function(e, t) {
                    t.resolve()
                }),
                t.storageWritePromises = []
            }, function() {
                jQuery.each(t.storageWritePromises, function(e, t) {
                    t.reject()
                }),
                t.storageWritePromises = []
            })
        }, 500),
        n.promise()
    },
    setAttributes: function(e) {
        this.attributes = e,
        this.persistAttributes();
        var t = this;
        jQuery.each(this.attributes, function(e, n) {
            t.checkEventTriggers(e)
        })
    },
    checkEventTriggers: function(e) {
        if (e && "eventTriggers"in this && e in this.eventTriggers) {
            var t = this.eventTriggers[e]
              , n = TWC.Events.getEvent(t);
            n.notify({
                key: e,
                locations: this.attributes[e]
            })
        }
    }
},
TWC.Profile = TWC.Node.createSubClass({
    init: function() {
        this.nodeName = "profile"
    },
    process: function(e) {
        this.setUpProfile(e)
    },
    setUpProfile: function(e) {
        if (e.isEmptyObject(this.attributes)) {
            var t = e.cookie("uplogin")
              , n = t && decodeURIComponent(t)
              , a = n && n.split("^")
              , o = a && a.length;
            a && o && o >= 4 && (this.set("uphostname", a[0]),
            this.set("lastmodified", a[1]),
            this.set("userid", a[2]),
            this.set("username", a[3]),
            this.set("addlparams", a.slice(4)))
        }
    }
}),
TWC.Page = TWC.Node.createSubClass({
    init: function(e, arguments) {
        this.nodeName = "page"
    },
    process: function(e, arguments) {
        this.setScreenSize(e),
        this.setUpPage(e, arguments)
    },
    setScreenSize: function(e) {
        var t = e(window).width()
          , n = t < 768
          , a = t >= 768 && t < 1025
          , o = t > 1024
          , r = n && "mobileSized" || a && "tabletSized" || o && "desktopSized";
        this.set("screenSize", r)
    },
    setUpPage: function(e, arguments) {
        var t, n = {}, a = this, o = arguments.length > 1 ? arguments[1] : {}, r = this.get("locale"), i = r.split("-").join("_"), s = TWC && TWC.Titan && TWC.Titan.locale && TWC.Titan.locale.split("_") && TWC.Titan.locale.split("_")[0] || this.get("locale") && this.get("locale").split("-") && this.get("locale").split("-")[0] || "en", c = e.Deferred(), d = (!(!window.explicit_location || !window.explicit_location_obj),
        window.TWC && TWC.PcoUtils), l = d.getURLParameter("location", null);
        r = r.indexOf("_") ? r.split("_").join("-") : r,
        this.set("locale", r),
        this.set("lang", s),
        l ? (t = l + ":1:US",
        a.set("currentLocId", t),
        promise = TWC.PcoUtils.get_dsx_records(["wxd/v2/loc/" + i + "/" + t, "cs/v2/datetime/" + i + "/" + t]),
        promise.success(function(t, r, i) {
            if (t && t.body && e.isArray(t.body) && t.body.length > 0) {
                var s = t.body[0];
                s && s.doc && "locId"in s.doc && (n = s.doc,
                n.loc = n.locId + ":" + n.locType + ":" + n.cntryCd,
                n.datetime = t.body[1].doc.datetime,
                a.set("currentLocation", n),
                o.setLastVisitedLocation && o.setLastVisitedLocation(n))
            } else
                a.set("currentLocation", {
                    error: "LOCATION_UNAVAILABLE"
                });
            c.resolve()
        }),
        promise.error(function() {
            a.set("currentLocation", {
                error: "LOCATION_UNAVAILABLE"
            }),
            c.resolve()
        })) : (a.set("currentLocation", {
            error: "LOCATION_UNAVAILABLE"
        }),
        c.resolve()),
        this.promises.push(c)
    }
}),
TWC.Products = TWC.Node.createSubClass({
    init: function(e, arguments) {
        this.nodeName = "products",
        this.isPersisted = !0,
        this.eventTriggers = {
            products: "products_changed"
        }
    },
    process: function(e) {
        this.setUpProducts(e)
    },
    setUpProducts: function(e) {
        var t = e.Deferred();
        t.resolve()
    }
}),
TWC.User = TWC.Node.createSubClass({
    init: function() {
        this.nodeName = "user",
        this.isPersisted = !0,
        this.attributes.savedLocations = [],
        this.attributes.recentSearchLocations = [],
        this.restrictExtend = !0,
        this.eventTriggers = {
            savedLocations: "locations_changed",
            recentSearchLocations: "locations_changed",
            preferredLocation: "preferred_location_change"
        },
        this.transform_rules = {
            preferredLocation: function(e) {
                return e && e.locId && e.locType && e.cntryCd && (e.loc = [e.locId, ":", e.locType, ":", e.cntryCd].join("")),
                e
            }
        },
        this.postInit = function(e, arguments) {
            if (this.isPersisted) {
                var t = TWC.LocalStorage.getPersistedValue(this.getPersistKey());
                t && t.claritas && (t = this.pco2ToPco3(t)),
                t = this.cleanUpPcoObjects(t, e),
                t && e.extend(this.attributes, t)
            }
            arguments && arguments.length > 0 && e.extend(this.attributes, arguments[0])
        }
    },
    setLastVisitedLocation: function(e) {
        var t = this.truncateSingleLoc(e)
          , n = this.get("savedLocations")
          , a = this.get("recentSearchLocations");
        this.set("lastVisitedLocation", t),
        !this.isLocationPresent(n, t) && !this.isLocationPresent(a, t) && function(e) {
            a.unshift(t),
            e.set("recentSearchLocations", a)
        }(this)
    },
    isLocationPresent: function(e, t) {
        return jQuery(e || []).filter(function(e, n) {
            return t && t.loc === n.loc
        }).length
    },
    setGlueSavedLocations: function(arguments) {
        glue = arguments.length > 1 ? arguments[1] : {},
        glue.gauge("com.weather.gauge.favoritelocations", this.get("savedLocations").length, "items")
    },
    process: function(e, arguments) {
        this.updateLocationObject(e),
        this.setUpLocale(e),
        this.setUpBrowserInfo(e),
        this.setSignedIn(e),
        this.setUnit(e),
        this.setCurrentLocation(e),
        this.setPlaceIQ(e),
        this.setRMID(e),
        this.setPreferredLocation(e),
        this.setBackTo(e),
        this.setAgeGender(e)
    },
    updateLocationObject: function(e) {
        var t = (e.Deferred(),
        this.get("savedLocations"))
          , n = this.get("recentSearchLocations")
          , a = t && t.length > 0 ? t : n;
        if (a && a[0] && !a[0]._gprId) {
            var o = a[0]
              , r = o.loc
              , i = TWC.PcoUtils.get_dsx_records("wxd/v2/loc/" + TWC.Configs.dsx.locale + "/" + r);
            i.then(function(e) {
                e && e.body && (o._gprId = e.body._gprId,
                o.dmaCd = e.body.dmaCd,
                o.cntyNm = e.body.cntyNm,
                o.lat = e.body.lat,
                o.long = e.body.long,
                o.zipCd = e.body.zipCd,
                o.tmZnAbbr = e.body.tmZnAbbr)
            })
        }
    },
    setUpLocale: function(e) {
        var t = TWC && TWC.Configs && TWC.Configs.dsx && TWC.Configs.dsx.locale || "en_US";
        this.set("locale", t)
    },
    setUpBrowserInfo: function(e) {
        var t = e.extend({}, e.browser);
        t.ltIE9 = t.msie && parseInt(t.version, 10) < 9,
        t.lteIE9 = t.msie && parseInt(t.version, 10) <= 9,
        this.set("browser", t),
        this.set("flash", t)
    },
    setSignedIn: function(e) {
        var t = e.cookie("Ticket_web");
        this.set("signedIn", t)
    },
    setDateTime: function(e) {
        var t = new Date
          , n = t.getFullYear()
          , a = t.getMonth() + 1
          , o = t.getDate()
          , r = t.getDay()
          , i = t.getHours()
          , s = i > 12 ? i - 12 : 0 == i ? 12 : i
          , c = t.getMinutes()
          , d = t.getSeconds() + ""
          , d = d.length > 1 ? d : "0" + d
          , l = (t.getTime(),
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][r])
          , u = t.getTimezoneOffset() / 60;
        this.set("date", [a, "index.html", o, "index.html", n].join("")),
        this.set("time", [s, ":", c, ":", d].join("")),
        this.set("day", l),
        this.set("tzOffset", u)
    },
    setUnit: function(e) {
        var t = TWC && TWC.Configs && TWC.Configs.dsx && TWC.Configs.dsx.locale
          , n = TWC && TWC.Titan && TWC.Titan.locale
          , a = n || t
          , o = "en_US" !== a && "es_US" !== a
          , r = this.get("unit")
          , i = o && !r ? "m" : r || "e";
        TWC && TWC.Titan && TWC.Titan.temp && (i = TWC.Titan.temp),
        this.set("unit", i)
    },
    setCurrentLocation: function(e) {
        var t = e.Deferred()
          , n = e.Deferred()
          , a = this
          , o = TWC.Configs.dsx && TWC.Configs.dsx.locale || "en_US";
        if (!this.attributes.currentLocation || !this.attributes.currentLocation.expirationTime || this.attributes.currentLocation.expirationTime < (new Date).getTime())
            if ("de_DE" === o) {
                var r = {
                    locid: "GMXX0007:1:GM"
                };
                this.promises.push(n),
                a.getDSXLocation(e, r, t, !0),
                jQuery('meta[name="pagecode"]') && "home" === jQuery('meta[name="pagecode"]').attr("value") ? a.getHTML5Location(e, n) : n.resolve()
            } else
                a.getGIPLocation(e, t);
        else
            t.resolve();
        this.promises.push(t),
        t.done(function() {
            var e = a.get("savedLocations")
              , t = a.get("recentSearchLocations");
            if (0 === e.length && 0 === t.length && !window.explicit_location) {
                var n = a.get("currentLocation");
                n && "cityNm"in n && (a.get("currentLocation").cityNm = TWC.PcoUtils.capitalize(n.cityNm, !0),
                a.set("recentSearchLocations", [a.get("currentLocation")]))
            }
        }),
        n.done(function() {
            var e = (a.get("savedLocations"),
            a.get("recentSearchLocations"),
            a.get("currentLocation"));
            e && "cityNm"in e && (a.get("currentLocation").cityNm = TWC.PcoUtils.capitalize(e.cityNm, !0),
            a.set("recentSearchLocations", [a.get("currentLocation")]),
            a.setPreferredLocation())
        })
    },
    getGIPLocation: function(e, t) {
        var n = this
          , a = "../gip.imwx.com/wxdata/gip/get5481.js?cb=?"
          , o = e.ajax({
            url: a,
            dataType: "jsonp",
            contentType: "application/json",
            cache: !0
        });
        TWC && TWC.Configs && TWC.Configs.dsx && TWC.Configs.dsx.locale || "en_US";
        o.then(function(a) {
            n.getDSXLocation(e, a, t)
        })
    },
    getHTML5Location: function(e, t) {
        var n = this
          , a = !1;
        navigator.geolocation.getCurrentPosition(function(o) {
            var r = o.coords.latitude.toFixed(2)
              , i = o.coords.longitude.toFixed(2)
              , s = {
                lat: r,
                lng: i
            };
            n.getDSXLocation(e, s, t),
            a = !0
        }, function(e) {
            t.resolve(),
            a = !0
        });
        setTimeout(function() {
            a || t.resolve()
        }, 1e4)
    },
    getDSXLocation: function(e, t, n, a) {
        var o = this;
        if (a && (!t || !t.locid) || !a && (!t || !t.lat || !t.lng))
            return this.set("currentLocation", {
                gipResponse: t
            }),
            void n.resolve();
        var r = TWC.Configs.dsx && TWC.Configs.dsx.locale || "en_US"
          , i = "";
        if (a)
            i = t.locid;
        else {
            var s = t.lat
              , c = t.lng
              , d = e.isNumeric(t.lat) ? Number(t.lat).toFixed(2) : t.lat
              , l = e.isNumeric(t.lng) ? Number(t.lng).toFixed(2) : t.lng;
            i = d + "," + l
        }
        var u, p = TWC.PcoUtils.get_dsx_records(["wxd/loc/" + r + "/" + i]);
        p.success(function(t, n, a) {
            if (t && t.body && e.isArray(t.body) && t.body.length > 0) {
                var r = t.body[0];
                if (r && r.doc && "locId"in r.doc) {
                    var i = r.doc;
                    u = o.set("currentLocation", i),
                    o.get("currentLocation").lat = s,
                    o.get("currentLocation").long = c,
                    o.get("currentLocation").loc = (i.locId || "") + ":" + (i.locType || "") + ":" + (i.cntryCd || ""),
                    o.get("currentLocation").expirationTime = (new Date).getTime() + 9e5
                }
            }
            return u
        }),
        p.error(function() {
            return u = o.set("currentLocation", {
                error: !0
            })
        }),
        p.always(function() {
            return n.resolve(),
            TWC.PcoUtils.setTiming("gipEnd", (new Date).getTime()),
            u
        })
    },
    setPlaceIQ: function(e) {},
    setRMID: function(e) {
        var t = this.get("rmid");
        t || (t = TWC.PcoUtils.generateUUID()),
        this.set("rmid", t)
    },
    setBackTo: function(e) {
        var t = this.get("currentBackTo")
          , n = window.location.href;
        t && t.url && t.url !== n && this.set("backTo", t),
        this.set("currentBackTo", {
            url: n,
            pagetype: "N/A"
        })
    },
    setSavedAndRecentLocations: function(e) {
        if (this.isPersisted) {
            var t = TWC.LocalStorage.getPersistedValue(this.nodeName) || {};
            t && e.extend(this.attributes, t)
        }
    },
    setPreferredLocation: function(e) {
        var t = this
          , n = t.get("savedLocations")
          , a = t.get("recentSearchLocations");
        n && n.length > 0 ? t.set("preferredLocation", n[0]) : a && a.length > 0 ? t.set("preferredLocation", a[0]) : t.deleteKey("preferredLocation")
    },
    overrideSetSavedLocations: function(e, t) {
        this.attributes.savedLocations = t,
        this.setPreferredLocation(e)
    },
    overrideSetRecentSearchLocations: function(e, t) {
        this.attributes.recentSearchLocations = t,
        this.setPreferredLocation(e)
    },
    truncateSingleLoc: function(e) {
        return {
            key: e.key || "",
            locId: e.locId || "",
            locType: e.locType || "",
            cntryCd: e.cntryCd || "",
            cityNm: e.cityNm && TWC.PcoUtils.capitalize(e.cityNm, !0, !0) || "",
            nickname: e.nickname || "",
            loc: [e.locId, ":", e.locType, ":", e.cntryCd].join(""),
            lat: e.lat || "",
            long: e.long || "",
            cntyNm: e.cntyNm || "",
            _gprId: e._gprId || "",
            prsntNm: e.prsntNm || "",
            _country: e._country || "",
            stNm: e.stNm || "",
            stCd: e.stCd || "",
            zipCd: e.zipCd || "",
            tmZnAbbr: e.tmZnAbbr || "",
            dmaCd: e.dmaCd || ""
        }
    },
    truncateLoc: function(e) {
        var t, n, a = [];
        if (e && e.length > 0) {
            for (var o = 0, r = e.length; o < r; o++)
                t = e[o],
                n = this.truncateSingleLoc(t),
                a.push(n);
            return a
        }
    },
    updateLocation: function(e, t) {
        var n = this.attributes.savedLocations;
        n && jQuery.isArray(n) && n.length > e && (n[e] = t,
        this.set("savedLocations", n))
    },
    cleanUpPcoObjects: function(e, t) {
        if (e) {
            var n = ["preferredLocation", "recentSearchLocations", "savedLocations"];
            return t.each(n, function(n, a) {
                var o = e[a]
                  , r = []
                  , i = t.isArray(o);
                o = i ? o : [o];
                for (var s = 0, c = o.length; s < c; s++)
                    o[s] && o[s].locId && r.push(o[s]);
                e[a] = i ? r : r[0]
            }),
            e
        }
    },
    pco2ToPco3: function(e) {
        if (e.claritas) {
            var t, n, a, o, r, i, s, c = ["preferredLocation", "recentSearchLocations", "savedLocations", "unit", "rmid"], d = {
                countryName: "_country",
                city: "cityNm",
                country: "cntryCd",
                locid: "locId",
                loctype: "locType",
                state: "stCd",
                prsntNm: "prsntNm",
                nickname: "nickname",
                loc: "loc"
            }, u = ["preferredLocation", "recentSearchLocations", "savedLocations"], p = {}, g = [], f = !1;
            if (e)
                for (n = 0,
                l = c.length; n < l; n++)
                    r = c[n],
                    p[r] = e[r];
            for (n = 0,
            l = u.length; n < l; n++) {
                for (s = u[n],
                f = !1,
                i = p[s] || [],
                jQuery.isArray(i) || (i = [i],
                f = !0),
                g = [],
                a = 0,
                o = i.length; a < o; a++) {
                    for (r in d)
                        t = i[a],
                        d.hasOwnProperty(r) && (t[d[r]] = "nickname" === r && t[r] ? t[r].replace(/\+/, " ") : t[r],
                        r !== d[r] && delete t[r]),
                        "locid" === r && t.locId && (t.locId = t.locId.split(":")[0]);
                    t.locId && (t.loc = [t.locId, t.locType, t.cntryCd].join(":"),
                    t.prsntNm = t.cityNm + "," + ("US" === t.cntryCd ? t.stCd : t._country),
                    t.nickname = t.nickname || "",
                    g.push(t))
                }
                p[s] = f ? g[0] : g
            }
            return p
        }
    },
    persistAttributes: function(e) {
        if (this.isPersisted) {
            var t = TWC.node_rules.getNodeConfig(this.nodeName)
              , n = jQuery.extend({}, this.attributes);
            this.restrictExtend && t && t.allowedAttributes && this.cleanUpObject(t.allowedAttributes, e),
            n && n.savedLocations && n.savedLocations.length > 0 && (n.savedLocations = this.truncateLoc(n.savedLocations)),
            n && n.recentSearchLocations && n.recentSearchLocations.length > 0 && (n.recentSearchLocations = this.truncateLoc(n.recentSearchLocations));
            var a = n.preferredLocation ? n.preferredLocation : null;
            return a && (n.preferredLocation = {
                key: a.key || "",
                locId: a.locId || "",
                locType: a.locType || "",
                cntryCd: a.cntryCd || "",
                cityNm: a.cityNm || "",
                nickname: a.nickname || "",
                loc: [a.locId, ":", a.locType, ":", a.cntryCd].join(""),
                lat: a.lat || "",
                long: a.long || "",
                cntyNm: a.cntyNm || "",
                _gprId: a._gprId || "",
                prsntNm: a.prsntNm || "",
                _country: a._country || "",
                stNm: a.stNm || "",
                stCd: a.stCd || "",
                zipCd: a.zipCd || "",
                tmZnAbbr: a.tmZnAbbr || "",
                dmaCd: a.dmaCd || ""
            }),
            this.localStorageWrite(n)
        }
    },
    setAgeGender: function(e) {
        var t = e.cookie("updataxfer") || ""
          , n = decodeURIComponent(t)
          , a = n && n.split("|")
          , o = e.isArray(a) && a[0] || ""
          , r = o && a.length > 1 && a[1] || "";
        n && (this.set("age", o),
        this.set("gender", r),
        e.removeCookie("updataxfer", {
            path: "/",
            domain: ".weather.com"
        }))
    }
}),
TWC.Device = TWC.Node.createSubClass({
    init: function(e, arguments) {
        this.nodeName = "device",
        this.persistKey = "pcoDeviceNode",
        this.isPersisted = !0
    },
    process: function(e) {
        this.setUpDevice(e),
        this.setUpDeviceWidth(e)
    },
    setUpDevice: function(e) {
        var t = this.attributes
          , n = {
            UserAgent: navigator.userAgent,
            dClass: "www",
            deviceWidth: window.innerWidth,
            deviceHeight: window.innerHeight,
            OpenDDRCrawler: null,
            OpenDDRJS: null,
            OpenDDRWireless: null,
            OpenDDRDisplay: "" + window.innerWidth + "x" + window.innerHeight,
            OpenDDRId: window.innerWidth < 768 && "mobileDevice" || window.innerWidth >= 768 && window.innerWidth < 1025 && "tabletDevice" || window.innerWidth > 1024 && "desktopDevice"
        };
        n.OpenDDRTablet = "tabletDevice" === n.OpenDDRId || !1,
        n.OpenDDRDesktop = "desktopDevice" === n.OpenDDRId || !1,
        this.setAttributes(e.extend(t, n))
    },
    setUpDeviceWidth: function(e) {
        this.set("deviceWidth", window.browserWidth)
    }
}),
TWC.WeatherInfo = TWC.Node.createSubClass({
    init: function(e, arguments) {
        TWC.PcoUtils.setTiming("wxDataStart", (new Date).getTime());
        var t = this;
        arguments.length > 1 && (this.adRef = arguments.length > 1 ? arguments[1] : {},
        this.userRef = arguments.length > 2 ? arguments[2] : {},
        this.pageRef = arguments.length > 3 ? arguments[3] : {}),
        TWC.Events.getEvent("ad_location_changed").progress(function() {
            "pending" !== t.adRef.promises[0].state() && t.setUpWeatherInfo(e)
        }),
        this.customPromise = e.Deferred(),
        this.customPromise.done(function() {
            TWC.PcoUtils.setTiming("wxResolved", (new Date).getTime())
        }),
        this.nodeName = "wx",
        this.config = {
            NULL_KEYNAME: "nl"
        },
        this.persistKey = "pcoWxNode",
        this.isPersisted = !0,
        this.transform_rules = {
            hum: function(e) {
                return e >= 61 ? "hi" : "lo"
            },
            wind: function(e) {
                return e >= 6 && e <= 29 ? "lo" : e >= 30 ? "hi" : void 0
            },
            uv: function(e) {
                if (e >= 5)
                    return "hi"
            },
            getTempInc: function(e, t) {
                if ("undefined" == typeof t)
                    return "fnnl";
                if ("f" === t)
                    return "undefined" == typeof e ? "fnnl" : e < 20 ? "fnnl" : e >= 20 && e <= 24 ? "20l" : e >= 25 && e <= 29 ? "20h" : e >= 30 && e <= 34 ? "30l" : e >= 35 && e <= 39 ? "30h" : e >= 40 && e <= 44 ? "40l" : e >= 45 && e <= 49 ? "40h" : e >= 50 && e <= 54 ? "50l" : e >= 55 && e <= 59 ? "50h" : e >= 60 && e <= 64 ? "60l" : e >= 65 && e <= 69 ? "60h" : e >= 70 && e <= 74 ? "70l" : e >= 75 && e <= 79 ? "70h" : e >= 80 && e <= 84 ? "80l" : e >= 85 && e <= 89 ? "80h" : e >= 90 && e <= 94 ? "90l" : e >= 95 && e <= 100 ? "90h" : e > 100 ? "fpnl" : "fnnl";
                if ("c" === t) {
                    if ("undefined" == typeof e)
                        return "cnnl";
                    var n = "cpnl";
                    return n = e > 60 ? "cpnl" : e % 2 == 0 && e >= 0 ? e + 1 + "ci" : e % 2 != 0 && e >= 0 ? e + "ci" : e % 2 == 0 && e < 0 && e > -9 ? e * -1 + "nci" : "cnnl"
                }
            },
            temp: function(e, t) {
                if (t.isArray(e) && 2 === e.length) {
                    var n = e[0]
                      , a = e[1]
                      , o = this.getTempInc(n, "f")
                      , r = n >= 0 ? n + "f" : n * -1 + "nf"
                      , i = a >= 0 ? a + "c" : a * -1 + "nc"
                      , s = "cpnl";
                    return s = a > 60 ? "cpnl" : a % 2 == 0 && a >= 0 ? a + 1 + "ci" : a % 2 != 0 && a >= 0 ? a + "ci" : a % 2 == 0 && a < 0 && a > -9 ? a * -1 + "nci" : "cnnl",
                    o + "," + r + "," + i + "," + s
                }
                return e
            },
            tempR: function(e) {
                var t = e.scale
                  , n = e.val;
                return "c" === t && (n = 9 * n / 5 + 32),
                "undefined" == typeof n ? "nl" : n <= 31 ? "icy" : n >= 32 && n <= 40 ? "cold" : n >= 41 && n <= 55 ? "thaw" : n >= 56 && n <= 69 ? "cool" : n >= 70 && n <= 79 ? "mod" : n >= 80 && n <= 89 ? "warm" : n >= 90 && n <= 100 ? "hot" : n >= 101 ? "xhot" : void 0
            },
            tempRC: function(e) {
                var t = e.val;
                return "undefined" == typeof t ? "nl" : t <= 0 ? "icy" : t >= 1 && t <= 4 ? "cold" : t >= 5 && t <= 12 ? "thaw" : t >= 13 && t <= 20 ? "cool" : t >= 21 && t <= 25 ? "mod" : t >= 26 && t <= 31 ? "warm" : t >= 32 && t <= 38 ? "hot" : t >= 39 ? "xhot" : void 0
            },
            snowR: function(e) {
                return "undefined" == typeof e ? "nl" : e >= 1 && e < 3 ? "1" : e >= 3 ? "3" : "nl"
            },
            cond: function(e) {
                return [31, 33].indexOf(e) != -1 ? "clr" : [26, 27, 28, 29, 30].indexOf(e) != -1 ? "cld" : [1, 2, 5, 6, 9, 11, 12, 39, 40, 45].indexOf(e) != -1 ? "rain" : [13, 14, 15, 16, 41, 42, 43, 46].indexOf(e) != -1 ? "snow" : [7, 8, 10, 18].indexOf(e) != -1 ? "ice" : [32, 34, 36].indexOf(e) != -1 ? "sun" : [0, 3, 4, 17, 35, 37, 38, 47].indexOf(e) != -1 ? "thdr" : void 0
            },
            baroTendency: function(e) {
                return 0 == e ? "stdy" : 1 == e ? "rsng" : 2 == e ? "fllng" : void 0
            },
            snw: function(e) {
                return e >= 1 && e < 3 ? "1" : e >= 3 ? "3" : void 0
            },
            fcst: function(e, t) {
                var n, a, o, r, i, s, c, d, l = {}, u = {}, p = {}, g = {};
                if (u.prcpStr = "",
                e && t.isArray(e) && e.length > 2) {
                    for (var f = e.slice(0, 3), h = 0, m = f.length > 3 ? 3 : f.length; h < m; h++) {
                        var _ = f[h];
                        n = _.pOP12 ? _.pOP12 : "nl",
                        o = 2 * h + 1,
                        u[o + ""] = n,
                        u.prcpStr += n < 50 ? o + "_0," : o + "_50,",
                        a = _.pOP24 ? _.pOP24 : "nl",
                        o = 2 * h + 2,
                        u[o + ""] = a,
                        u.prcpStr += a < 50 ? o + "_0," : o + "_50,";
                        var y = this.cond(_.sky12)
                          , v = this.cond(_.sky12_24);
                        p["fc" + (2 * h + 1)] = y ? y : "nl",
                        p["fc" + (2 * h + 2)] = v ? v : "nl",
                        (!r || _.hiTmpF > r) && (r = _.hiTmpF),
                        r = !r || _.hiTmpF > r ? _.hiTmpF : r,
                        i = !i || _.loTmpF < i ? _.loTmpF : i,
                        (!s || _.hiTmpC > s) && (s = _.hiTmpC),
                        s = !s || _.hiTmpC > s ? _.hiTmpC : s,
                        c = !c || _.loTmpC > c ? _.loTmpC : c;
                        var w = _.snwQpf12
                          , T = _.snwQpf12_24;
                        d = !d || w > d ? w : d,
                        d = !d || T < d ? T : d
                    }
                    u.prcpStr = u.prcpStr.substr(0, u.prcpStr.length - 1),
                    l.prcp = u,
                    l.cond = p,
                    l.tempH = this.getTempInc(r, "f"),
                    l.tempL = this.getTempInc(i, "f"),
                    l.tempHR = this.tempR({
                        val: r
                    }),
                    l.tempLR = this.tempR({
                        val: i
                    }),
                    l.tempCH = s,
                    l.tempCL = c,
                    l.tempCHR = this.tempR({
                        val: s,
                        scale: "c"
                    }),
                    l.tempCLR = this.tempR({
                        val: c,
                        scale: "c"
                    }),
                    l.fsnw = this.snowR(d)
                }
                if (e && t.isArray(e) && e.length > 4) {
                    for (var C = e.slice(0, 5), h = 0, m = C.length > 5 ? 5 : C.length; h < m; h++) {
                        var _ = C[h];
                        g["d" + (h + 1)] = _.wrlsWx12 ? _.wrlsWx12 : "nl"
                    }
                    l.fiveDay = g
                }
                return l
            },
            severe: function(e, t) {
                if (e && t.isArray(e) && e.length > 0) {
                    for (var n = [], a = 0, o = e.length; a < o; a++) {
                        var r = e[a];
                        if (r && "BEHdr"in r && "bEvent"in r.BEHdr) {
                            var i = r.BEHdr.bEvent;
                            if ("eSgnfcnc"in i && "ePhenom"in i)
                                for (var s = i.ePhenom, c = i.eSgnfcnc, d = [{
                                    regex: /(^|\s)(CF|LS|FA|FL|EL|FF|HY|TS|RP|TCL|TCO|TGR|TLM|TRA|TCW)(\s|$)/,
                                    key: "fld"
                                }, {
                                    regex: /(^|\s)(HU|HI|TI|TR|TTP|TY)(\s|$)/,
                                    key: "trop"
                                }, {
                                    regex: /(^|\s)(WC|SU|EW|FG|MF|AF|MH|BW|DS|DU|EC|EH|EW|FG|MF|FR|FW|FZ|GL|HF|HT|HW|HZ|LO|LW|MA|SE|MS|SM|UP|WI|ZF|TAD|TCA|TTW|TCD|TCE|TEQ|TEV|TLC|TLA|RB|SC|SI|SW|TNM|TST|TNS|TNU|TOF|TRE|TRF|TRH|TSS|TSG|TSL|TSP|TSF|TNO|TVO|TZO|TOZ|TAQ|TAP|TWA|THT|TFF|TWX)(\s|$)/,
                                    key: "oth"
                                }, {
                                    regex: /(^|\s)(SV|SW|SR|TLM|TSA|TRA|TTS)(\s|$)/,
                                    key: "thdr"
                                }, {
                                    regex: /(^|\s)(TO)(\s|$)/,
                                    key: "tor"
                                }, {
                                    regex: /(^|\s)(BZ|HS|IS|LB|LE|WS|ZR|TAV|WW|TSI|TFA|TLT|TAA)(\s|$)/,
                                    key: "wint"
                                }], l = 0, u = d.length; l < u; l++)
                                    if (s.match(d[l].regex)) {
                                        var p = d[l].key;
                                        n.push(p),
                                        n.push(p + s + c);
                                        break
                                    }
                        }
                    }
                    return n
                }
                return "nl"
            },
            pollen: function(e, t) {
                var n;
                if (t.each(e, function(e, a) {
                    a && t.isArray(a) && a.length > 0 && "idxPrt1"in a[0] && (n = "undefined" == typeof n || n < a[0].idxPrt1 ? a[0].idxPrt1 : n)
                }),
                "undefined" != typeof n) {
                    if (n >= 4)
                        return "hi";
                    if (2 === n || 3 === n)
                        return "me";
                    if (n < 2)
                        return "lo"
                }
                return "nl"
            }
        }
    },
    process: function(e) {
        this.setUpWeatherInfo(e)
    },
    setUpWeatherInfo: function(e) {
        var t, n = this, a = function(e, t) {
            var n = t;
            return e.generatedTime && e.cacheMaxSeconds && e.currentTime && (n = e.cacheMaxSeconds - (e.currentTime - e.generatedTime)),
            n < t ? n : t
        }, o = function(t) {
            if (t && t.body && e.isArray(t.body) && t.body.length > 0) {
                for (var o = {}, r = t.body, i = 0, s = r.length; i < s; i++) {
                    var c = 300
                      , d = r[i];
                    d.id && d.id.match(/^\/wxd\/v\d{1}\/MORecord\//) ? (o.obs = d.doc && d.doc.MOData ? d.doc.MOData : {},
                    c = a(d, c)) : d.id && d.id.match(/^\/wxd\/v\d{1}\/BERecord\//) ? (o.wxalerts = d.doc ? d.doc : [],
                    c = a(d, c)) : d.id && d.id.match(/^\/wxd\/v\d{1}\/DFRecord\//) ? (o.daily = d.doc && d.doc.DFData ? d.doc.DFData : {},
                    c = a(d, c)) : d.id && d.id.match(/^\/wxd\/v\d{1}\/IDRecord\//) && (o.indexData = o.indexData || {},
                    d.id.match(/^\/wxd\/v\d{1}\/IDRecord\/(.*)\/11\//) ? (o.indexData.treepollen = d.doc && d.doc.IDData ? d.doc.IDData : {},
                    c = a(d, c)) : d.id.match(/^\/wxd\/v\d{1}\/IDRecord\/(.*)\/12\//) ? (o.indexData.grasspollen = d.doc && d.doc.IDData ? d.doc.IDData : {},
                    c = a(d, c)) : d.id.match(/^\/wxd\/v\d{1}\/IDRecord\/(.*)\/13\//) && (o.indexData.weedpollen = d.doc && d.doc.IDData ? d.doc.IDData : {},
                    c = a(d, c))),
                    n.set("secondsToCache", c),
                    n.set("expirationTime", (new Date).getTime() + 1e3 * c)
                }
                if (o.obs) {
                    var l = o.obs;
                    n.userRef.get && "e" === n.userRef.get("unit");
                    n.set("dayNight", l.dyNght),
                    n.set("relativeHumidity", l.rH),
                    n.set("hum", l.rH),
                    n.set("windSpeed", l.wSpdM),
                    n.set("wind", l.wSpdM),
                    n.set("uvIndex", l.uvIdx),
                    n.set("uv", l.uvIdx),
                    n.set("realTemp", l.tmpF),
                    n.set("temp", [l.tmpF, l.tmpC]),
                    n.set("tempc", l.tmpC),
                    n.set("tempR", {
                        val: l.tmpF
                    }),
                    n.set("tempRC", {
                        val: l.tmpC
                    }),
                    n.set("wxIcon", l.sky),
                    n.set("flsLkF", l.flsLkIdxF),
                    n.set("flsLkC", l.flsLkIdxC),
                    l.iconExt && n.set("wxExtIcon", l.iconExt),
                    n.set("cond", l.sky),
                    n.set("baroTendency", l.baroTrnd),
                    n.set("snw", l.snwDep)
                }
                o.daily && n.set("fcst", o.daily),
                o.wxalerts && n.set("severe", o.wxalerts),
                o.indexData && n.set("pollen", o.indexData)
            }
        }, r = function(e) {
            var t = TWC && TWC.Configs && TWC.Configs.dsx && TWC.Configs.dsx.locale || "en_US"
              , a = TWC.PcoUtils.get_dsx_records(["wxd/v2/MORecord/" + t + "/" + e, "wxd/v2/DFRecord/" + t + "/" + e, "wxd/v2/BERecord/" + t + "/" + e, "wxd/v2/IDRecord/" + t + "/11/" + e, "wxd/v2/IDRecord/" + t + "/12/" + e, "wxd/v2/IDRecord/" + t + "/13/" + e], "wxdata_callback");
            a.then(function(e) {
                o(e)
            }),
            a.fail(function() {
                n.setAttributes({
                    error: !0
                })
            }),
            a.always(function() {
                "resolved" === n.customPromise.state() ? TWC.Events.getEvent("wx_data_updated").notify() : (n.customPromise.resolve(),
                TWC.PcoUtils.setTiming("wxResolved", (new Date).getTime()))
            })
        };
        e.when.apply(e, [].concat(n.adRef.promises || [])).done(function() {
            if (window.wxdata_callback = function(e) {
                o(e),
                n.customPromise.resolve()
            }
            ,
            t = n.adRef.get("location"),
            !t)
                return void n.customPromise.resolve();
            if (t instanceof Object && null !== t && ("_id"in t || "locId"in t && "locType"in t && "cntryCd"in t || "lat"in t && "lng"in t)) {
                var e = "_id"in t ? t._id : function() {
                    return "locId"in t && "locType"in t && "cntryCd"in t ? t.locId + ":" + t.locType + ":" + t.cntryCd : t.lat + "," + t.lng
                }()
                  , a = n.get("locId");
                if (a === e)
                    return void n.customPromise.resolve();
                n.set("locId", e),
                r(e)
            } else
                n.customPromise.resolve()
        }),
        this.promises.push(n.customPromise)
    }
}),
TWC.Ad = TWC.Node.createSubClass({
    init: function(e, arguments) {
        this.nodeName = "ad",
        this.isPersisted = !0,
        this.eventTriggers = {
            location: "ad_location_changed"
        },
        this.WX_WindowShadeTransform = {
            default: "WX_WindowShade",
            tablet: "WX_Leaderboard"
        },
        this.WX_Driver1Transform = {
            default: "WX_Driver1",
            tablet: "WX_DriverTablet"
        },
        this.WX_DriverUnitTransform = {
            default: "WX_DriverUnit",
            tablet: "WX_DriverUnitTablet"
        },
        this.WX_EditorialLGTransform = {
            default: "WX_EditorialLG",
            tablet: "WX_EditorialSM"
        },
        this.possible_ad_modules = {
            admodule: {
                adtype_param: "admodule",
                ad_position_key: "",
                control: "server"
            },
            admodule_burda: {
                adtype_param: "admodule_burda",
                ad_position_key: "",
                control: "server"
            },
            admodule_companion: {
                adtype_param: "admodule_companion",
                ad_position_key: "",
                control: "client"
            },
            content_media: {
                atype_param: "content_media",
                ad_position_key: "",
                control: "server"
            },
            wxnode_slideshow: {
                adtype_param: "slideshow",
                ad_position_key: "wxnode_slideshow_ad_pos",
                control: "client"
            },
            wxnode_content_inset: {
                adtype_param: "wxnode_content_inset",
                ad_position_key: "",
                control: "server"
            },
            delivery_units: {
                adtype_param: "delivery_units",
                ad_position_key: "",
                control: "client",
                collection: "hpdu"
            },
            hp_dl_stormdata: {
                adtype_param: "hp_dl_stormdata",
                ad_position_key: "",
                control: "client"
            },
            commutercast_map: {
                adtype_param: "commutercast_map",
                ad_position_key: "",
                control: "client"
            },
            commutercast_leftrail: {
                adtype_param: "commutercast_leftrail",
                ad_position_key: "",
                control: "client"
            },
            hp_countdown: {
                adtype_param: "hp_countdown",
                ad_position_key: "",
                control: "client"
            },
            video_player: {
                adtype_param: "video_player",
                ad_position_key: "",
                control: "client"
            },
            wxnode_video_player: {
                adtype_param: "wxnode_video_player",
                ad_position_key: "",
                control: "client"
            },
            haircast: {
                adtype_param: "haircast",
                ad_position_key: "",
                control: "server",
                collection: "adpositions"
            },
            photos_details: {
                adtype_param: "photos_details",
                ad_position_key: "",
                control: "client"
            },
            photos_collection_feed: {
                adtype_param: "photos_collection_feed",
                ad_position_key: "",
                control: "client"
            },
            title_video_collection: {
                adtype_param: "title_video_collection",
                ad_position_key: "",
                control: "client"
            },
            title_collection_index: {
                adtype_param: "title_collection_index",
                ad_position_key: "",
                control: "client"
            },
            title_image_ad: {
                adtype_param: "title_image_ad",
                ad_position_key: "",
                control: "client"
            },
            pollencast_teaser: {
                adtype_param: "pollencast_teaser",
                ad_position_key: "",
                control: "client"
            },
            lifestyle_teaser: {
                adtype_param: "lifestyle_teaser",
                ad_position_key: "",
                control: "client"
            },
            forecast_weekend: {
                adtype_param: "forecast_weekend",
                ad_position_key: "",
                control: "client"
            },
            storm_hero: {
                adtype_param: "storm_hero",
                ad_position_key: "",
                control: "server"
            },
            gm_delivery_units: {
                adtype_param: "gm_delivery_units",
                ad_position_key: "",
                control: "client",
                collection: "hpdu"
            },
            report_and_recover_sidebar: {
                adtype_param: "report_and_recover_sidebar",
                ad_position_key: "",
                control: "client"
            }
        }
    },
    process: function(e, arguments) {
        this.setUpLocalParams(e),
        this.setUpCustomParams(e),
        this.setUpAd(e, arguments),
        this.setUpSevere(e),
        this.setUpUGC(),
        this.setAdsTestCookie(e),
        this.setAdImpressionObj(e, arguments),
        this.setUpGlueAdMetrics()
    },
    setUpLocalParams: function(e) {
        var t, n, a, o;
        if (t = document.referrer.match(/http[s]?:\/\/([a-z\.\-]+)/),
        n = t ? t[1] : "",
        n && n.indexOf(".") != -1 && (a = n.split("."),
        o = a.length,
        o > 1)) {
            var r = "www" == a[0] ? 1 : 0
              , i = a.splice(r, o - r - 1).join(".");
            this.set("refurl", i)
        }
    },
    setUpCustomParams: function(e) {
        var t = this;
        TWC.Events.getEvent("wx_data_updated").progress(function() {
            var e, n, a, o, r = t.get("cust_params"), i = {};
            for (r = decodeURIComponent(r),
            a = r.split("&"),
            o = 0,
            l = a.length; o < l; o++) {
                var s = a[o].split("=");
                i[s[0]] = s[1]
            }
            e = TWC && TWC.pco && TWC.pco.get("wx") && TWC.pco.get("wx").attributes,
            n = t.get("location"),
            i.fsnw = e.fcst.fsnw,
            i.cnd = e.cond,
            i.loc = n.locId,
            i.dma = n.dmaCd,
            i.ct = n.cityNm,
            i.st = n.stCd,
            i.cc = n.cntryCd,
            i.cnty = n.cntyNm,
            i.zip = n.zipCd,
            i.lat = n.lat,
            i.lon = n.long,
            i.tmp = e.temp,
            i.tmpr = e.tempR,
            i.plln = e.pollen,
            i.wind = e.wind,
            i.uv = e.uv,
            i.hmid = e.hum,
            i.sev = e.severe,
            i.baro = e.baroTendency,
            i.snw = e.snw,
            i.fc1 = e.fcst.cond.fc1,
            i.fc2 = e.fcst.cond.fc2,
            i.fc3 = e.fcst.cond.fc3,
            i.d1 = e.fcst.fiveDay.d1,
            i.d2 = e.fcst.fiveDay.d2,
            i.d3 = e.fcst.fiveDay.d3,
            i.d4 = e.fcst.fiveDay.d4,
            i.d5 = e.fcst.fiveDay.d5,
            r = JSON.stringify(i),
            r = r.replace(/,\"/g, '&"'),
            r = r.replace(/[{}]/g, ""),
            r = r.replace(/"/g, ""),
            r = r.replace(/:/g, "="),
            r = encodeURIComponent(r),
            TWC.pco.setNodeValue("ad", "cust_params", r),
            TWC.Events.getEvent("ad_cust_params_changed").resolve()
        })
    },
    setUpAd: function(e, arguments) {
        var t, n, a, o = e.Deferred(), r = this, i = arguments.length > 1 ? arguments[1] : {}, s = arguments.length > 2 ? arguments[2] : {}, c = arguments.length > 3 ? arguments[3] : {};
        r.promises.push(o),
        o.resolve();
        var d, l, u, p, g, f, h, m, _, y, v, w, T, C = [], j = {}, b = {}, x = {}, S = r.possible_ad_modules, L = [], W = window.Drupal && Drupal.settings && Drupal.settings.twc, D = W && W.modules, A = W && W.contexts, E = W && W.instance, O = A && A.node && A.node.type || i && i.attributes && i.attributes.content, P = e(window).width(), R = P < 768, N = P > 768 && P < 1025, I = R && "mobile" || N && "tablet" || "desktop";
        r.set("ord", TWC.PcoUtils.genRandStr(16, "0123456789")),
        r.set("zone", e("[name=adsmetrics_zone]").attr("value"));
        var U = [].concat(c.promises)
          , k = window.explicit_location
          , M = i.get("currentLocation")
          , z = s.get("lastVisitedLocation");
        k && !M ? U = U.concat(i.promises) : TWC && TWC.Titan && TWC.Titan.locid && (U = U.concat(i.promises)),
        U.length > 1 || z || (U = U.concat(s.promises)),
        e.when.apply(e, U).then(function() {
            if (M = i.get("currentLocation"),
            z = s.get("lastVisitedLocation"),
            r.set("location", M && !M.error ? M : z || s.get("currentLocation") || null),
            n = function(t) {
                g = T.selectedadpos,
                "object" == typeof g && g.length && g.length > 0 ? (_ = e.inArray(t.default, g),
                _ !== -1 && (g[_] = t.tablet)) : g === t.default && (g = t.tablet),
                e(document).ready(function() {
                    e("#" + t.default).attr("id", t.tablet)
                })
            }
            ,
            a = function(t) {
                y = T.selectedadpos,
                "object" == typeof y && y.length && y.length > 0 && (_ = e.inArray(t.default, y),
                _ !== -1 && (y[_] = void 0)),
                y === t.default && (y = void 0)
            }
            ,
            t = function(e, t, o, i) {
                var s, d, l, u, p;
                return s = o ? o : "default",
                e.adtype = e.adtype ? e.adtype : s,
                e.refresh = !!e.refresh && e.refresh,
                e.refresh = "client" === t || e.refresh,
                e.selectedadpos = i ? e[i] : e.selectedadpos,
                e.control = t,
                g = e.selectedadpos,
                g = "object" == typeof g && g.length && g.length > 0 ? g[0] : g,
                l = c && c.get("OpenDDRDisplay") && c.get("OpenDDRDisplay").split("x"),
                u = 90 === Math.abs(window.orientation) ? 1 : 0,
                d = "true" === c.get("OpenDDRTablet"),
                v = g + "Transform",
                r[v] && g === r[v].default && (d && l[u] >>> 0 < 768 ? a(r[v]) : d && g === r[v].default && n(r[v]),
                d && l[u] >>> 0 >= 768 && d && l[u] >>> 0 < 1024 && n(r[v]),
                p = jQuery(window).width(),
                !d && p < 1064 && p >= 970 && "WX_Driver1" === g && n(r[v]),
                !d && p < 970 && p >= 768 && "WX_DriverUnit" !== g ? n(r[v]) : !d && p < 768 && a(r[v]),
                !d && p >= 768 && p < 1024 && "WX_DriverUnit" === g && n(r[v]),
                !d && p >= 768 && p < 1024 && "WX_EditorialLG" === g && n(r[v])),
                e
            }
            ,
            D && D.page_keywords) {
                var W = D.page_keywords[0];
                if (W && E && E[W] && E[W].article_node) {
                    var P = E[W].article_node;
                    if (P && A && A[P]) {
                        var R = A[P];
                        R && R.field_keywords && r.set("sponstory", R.field_keywords)
                    }
                }
            }
            for (ad in S)
                if (S.hasOwnProperty(ad) && (h = D && D[ad] || [],
                f = S[ad].control,
                h.length > 0)) {
                    for (d = h.length - 1; d >= 0; d--) {
                        if (T = E[h[d]],
                        T.adtype = T.adtype || "",
                        m = S[ad].collection,
                        m && T[m] && T[m].length)
                            for (w = h[d],
                            l = 0,
                            u = T[m].length; l < u; l++)
                                T[m][l].selectedadpos && (w = 0 === l ? h[d] : h[d] + "-" + l,
                                T[m][l][m] = T[m],
                                T[m][l].module_id = T.module_id,
                                t(T[m][l], f, T.adtype),
                                E[w] = T[m][l],
                                h[l] = w,
                                T = T[m][l]);
                        else
                            T = S[ad].ad_position_key ? t(T, f, T.adtype, S[ad].ad_position_key) : t(T, f, T.adtype);
                        !T.selectedadpos || "object" == typeof T.selectedadpos && T.selectedadpos.length && T.selectedadpos.length > 0 && !T.selectedadpos[0] ? h.splice(d, 1) : TWC && TWC.Configs && TWC.Configs.respPages && TWC.Configs.respPages.indexOf(O) >= 0 && ((ad.match(/video/) || ad.match(/slideshow/) || ad.match(/photos/)) && (T.desktop = T.mobile = T.tablet = 1),
                        T.desktop || T.mobile || T.tablet || (T.desktop = T.tablet = 1),
                        T[I] || h.splice(d, 1))
                    }
                    L = L.concat(h)
                }
            if (!L || 0 === L.length)
                return void o.resolve();
            for (d = 0,
            p = L.length; d < p; d++)
                if (T = E[L[d]],
                !(T && "include_ad"in T && 0 === T.include_ad))
                    for (g = T && T.selectedadpos && "string" == typeof T.selectedadpos ? [T.selectedadpos] : T && T.selectedadpos && "object" == typeof T.selectedadpos && T.selectedadpos.length && T.selectedadpos.length > 0 ? T.selectedadpos : [],
                    l = 0,
                    u = g.length; l < u; l++)
                        C.push(g[l]),
                        T && T.adtype && T.adtype.match(/companion/) && (j[g[l]] = {
                            adtype: T.adtype
                        }),
                        T && "client" === T.control && (x[g[l]] = {
                            adtype: T.adtype
                        }),
                        b[g[l]] = {
                            adtype: T.adtype,
                            refresh: T.refresh
                        };
            r.set("all_ad_positions", C),
            e.isEmptyObject(j) ? null : r.set("ad_video_companions", j),
            e.isEmptyObject(x) ? null : r.set("ads_ctrld_clientside", x),
            r.set("DFPSlots", b),
            o.resolve()
        }, function() {
            r.set("location", null),
            o.resolve()
        }),
        TWC.Events.getEvent("dfpLoaded").done(function() {
            var e, t, n = r.get("DFPSlots"), a = r.get("all_ad_positions"), o = !0, i = r.get("ads_ctrld_clientside"), s = a && a.slice(0), c = TWC.Events.getEvent("slotRefreshReady");
            for (e in i)
                t = s.indexOf(e),
                t >= 0 && s.splice(t, 1);
            for (var d = [], l = 0, u = s && s.length || 0; l < u; l++)
                "NONE" !== s[l] && d.push(s[l]);
            googletag.pubads().addEventListener("slotRenderEnded", function(e) {
                if (o) {
                    var t = e.slot.getSlotId().getDomId();
                    n[t].slot = e.slot,
                    t === d[d.length - 1] && (o = !1,
                    c.resolve())
                }
            }),
            s || c.resolve()
        })
    },
    setUpGlueAdMetrics: function() {
        var e = window.googletag || {};
        e.cmd = e.cmd || [],
        e.cmd.push(function() {
            window.glue && glue.timer("ad.request", "Time it takes to fire ad call and get back a rendered ad")
        }),
        TWC.Events.getEvent("slotRefreshReady").then(function() {
            window.glue && glue.timer("ad.request").end()
        })
    },
    setUpSevere: function(e) {
        if (!this.get("severe")) {
            var t = this
              , n = (TWC.PcoUtils.genRandStr(),
            TWC.PcoUtils.get_dsx_records(["cms/settings/content-mode"]))
              , a = e.Deferred();
            this.promises.push(a),
            n.success(function(e, n, o) {
                if (e && e.body && e.body.length && e.body.length > 0 && "severe2" === e.body[0].doc.mode ? t.set("severe", "y") : t.set("severe", "n"),
                e && e.body && e.body.length && e.body.length > 0) {
                    var r = e.body[0];
                    if (r.generatedTime && r.cacheMaxSeconds && r.currentTime) {
                        var i = r.cacheMaxSeconds - (r.currentTime - r.generatedTime);
                        i && i < 0 && (i = 300),
                        t.set("expirationTime", (new Date).getTime() + 1e3 * i)
                    }
                }
                a.resolve()
            }),
            n.error(function() {
                a.resolve()
            })
        }
    },
    setUpUGC: function() {
        var e = window.location.href
          , t = e.match(/photos\/collection(.*)/);
        t && t.length && t.length > 1 && this.set("ugcLookup", t[1])
    },
    setAdsTestCookie: function(e) {
        var t = e.cookie("adstest");
        this.set("adstest", t)
    },
    persistAttributes: function(e) {
        !this.isPersisted || "severe" !== e && "expirationTime" !== e || TWC.LocalStorage.persistValue(this.getPersistKey(), {
            severe: this.attributes.severe,
            expirationTime: this.attributes.expirationTime
        })
    },
    setAdImpressionObj: function(e, arguments) {
        var t = {}
          , n = arguments.length > 3 ? arguments[3] : {}
          , a = TWC.PcoUtils.generateUUID();
        this.set("impression_id", a),
        TWC.Events.ifReady(["drupalSettingsReady", "awsReady"]).done(function() {
            e.when.apply(e, n.promises).done(function() {
                var o, r = n && n.attributes && n.attributes.OpenDDRId, i = "/" !== window.location.pathname && window.location.pathname || e('meta[name="pagecode"]').attr("value"), s = Drupal && Drupal.settings && Drupal.settings.twc && Drupal.settings.twc.modules, c = [];
                for (o in s)
                    c.push(o);
                t.eventType = "ImpressionBeacon",
                t.eventData = [{
                    impressionId: a,
                    pageId: i,
                    context: c
                }],
                t.platform = "web",
                t.version = 1,
                t.wxdId = r,
                AWS.config.update({
                    region: "us-east-1",
                    accessKeyId: TWC.AWS.aws_bk_ai,
                    secretAccessKey: TWC.AWS.aws_tk_ai
                });
                var d = new AWS.SQS
                  , l = {
                    MessageBody: JSON.stringify(t),
                    QueueUrl: TWC.AWS.sqs_url_prefix + TWC.AWS.aws_acct + "/" + TWC.AWS.aws_queue_ai,
                    DelaySeconds: 0
                };
                d.sendMessage(l, function(e, t) {})
            })
        })
    }
}),
TWC.Metrics = TWC.Node.createSubClass({
    init: function(e, arguments) {
        this.nodeName = "metrics"
    },
    process: function(e, arguments) {
        this.setUpMetrics(e, arguments),
        this.setPageId(e, arguments)
    },
    setUpMetrics: function(e, arguments) {
        var t = e("[name=metrics_levels]").attr("value")
          , n = t ? t.split("index.html") : null
          , a = e("[name=pagecode]").attr("value")
          , o = this
          , r = e.Deferred();
        e.isEmptyObject(this.attributes) && (this.set("pagename", a),
        n && (this.set("level1", n[0]),
        this.set("level2", n[1]),
        this.set("level3", n[2]),
        this.set("level4", n[3])),
        this.set("contentFamily", this.get("level1") + "-" + this.get("level2")),
        this.set("contentChannel", this.get("contentFamily") + "-" + this.get("level3")),
        this.set("contentSection", this.get("contentChannel") + "-" + this.get("level4"))),
        TWC.Events.ifReady(["drupalSettingsReady"]).done(function() {
            var e = Drupal.settings && Drupal.settings.twc || null
              , t = e && e.meta || null;
            e && e.modules || null;
            t && o.set("meta", t),
            r.resolve(),
            TWC.PcoUtils.setTiming("metricsResolved", (new Date).getTime())
        }),
        this.promises.push(r)
    },
    setPageId: function(e, arguments) {
        var t = arguments && arguments.length > 1 && arguments[1]
          , n = t && t.get("pathname") || "";
        page_id = this.get("pagename") + "/" + n,
        this.set("page_id", page_id)
    }
}),
TWC.Log = TWC.Node.createSubClass(function() {
    function e(e, n) {
        var a = t[e];
        n && n.length > 0 && a && !a.limitExceeded && a.logs.push(Array.prototype.slice.call(n, 0)),
        a.logs.length !== a.size || a.limitExceeded || (a.limitExceeded = !0,
        a.logs.push(["Memory limit reached. Logging will be stopped."]))
    }
    var t = {
        error: {
            logs: [],
            size: 1e3,
            limitExceeded: !1
        },
        debug: {
            logs: [],
            size: 1e3,
            limitExceeded: !1
        }
    };
    return {
        init: function(e, arguments) {
            this.nodeName = "twclog",
            this.restrictExtend = !0
        },
        process: function(e) {},
        debug: function() {
            e("debug", arguments)
        },
        error: function() {
            e("error", arguments)
        },
        print: function(e) {
            var n = e ? t[e].logs : null;
            n && jQuery.isArray(n) && jQuery.each(n, function(t, n) {
                "log"in console && ("object" == typeof console.log ? console.log([e.toUpperCase() + ": "].concat(n)) : console.log.apply(console, [e.toUpperCase() + ": "].concat(n)))
            })
        }
    }
}()),
TWC.Performance = TWC.Node.createSubClass(function() {
    function e(e) {
        t.length <= 1e3 && t.push(e)
    }
    var t = [];
    return {
        init: function(e, arguments) {
            this.nodeName = "performance",
            this.restrictExtend = !0
        },
        process: function(e) {},
        log: function(t, n, a) {
            e({
                type: t,
                operation: n,
                comment: a,
                timing: (new Date).getTime()
            })
        },
        log_dsx_call: function(e, t, n) {
            this.log("DSX_CALL", e, (t ? "CACHED" : "NETWORK") + (n ? " (completed in " + n + "secs)" : ""))
        },
        format: function(e) {
            return e.type + " : " + e.operation + " : " + e.comment + " (SNAPSHOT TIME:" + e.timing + ")"
        },
        print: function(e) {
            var n = e ? jQuery.filter(t, function(t) {
                return t.type === e
            }) : t
              , a = this;
            n && n.length > 0 && jQuery.each(n, function(e, t) {
                "log"in console && console.log(a.format(t))
            })
        },
        getAll: function(e) {
            return t.slice(0)
        }
    }
}()),
TWC.Glue = TWC.Node.createSubClass(function() {
    function e(e, t) {
        var n = "";
        Object.keys(t).map(function(e) {
            var a = t[e];
            "string" != typeof a && "number" != typeof a && (a = a.result),
            n = n + e + ": " + a + "; "
        }),
        console.log("GLUE", e, "-", n)
    }
    function t() {
        var e = "release.html"
          , t = jQuery;
        t.ajax({
            url: e,
            contentType: "text/plain"
        }).done(function(e) {
            var n = e.match(/Web (release-.*)/i)
              , a = e.match(/Tag:(.*)\n/);
            r.appVersion = t.isArray(n) && n.length > 1 && n[1] || "Web Release not found in release.txt",
            r.svcCommit = t.isArray(a) && a.length > 1 && a[1] || "Tag: not found in release.txt",
            r.svcCommit = r.svcCommit.replace(/\s/g, "")
        })
    }
    function n(e) {
        TWC.Events.ifReady(["glueReady", "awsReady", "slotRefreshReady"]).done(function() {
            AWS.config.update({
                region: "us-east-1",
                accessKeyId: TWC.AWS.aws_bk_glue,
                secretAccessKey: TWC.AWS.aws_tk_glue
            });
            var t = new AWS.SQS
              , n = TWC.AWS.sqs_url_prefix
              , r = TWC.AWS.aws_acct
              , i = TWC.AWS.aws_queue_glue
              , s = Math.floor(1e3 * Math.random()) + 1
              , c = 10 * e.get("percentage")
              , d = {
                MessageBody: a(o),
                QueueUrl: n + r + "/" + i,
                DelaySeconds: 0
            };
            s >= 1e3 - c && t.sendMessage(d, function(e, t) {
                console.log(t)
            })
        })
    }
    function a(e) {
        var t = TWC.pco.getNodeValue
          , n = (new Date).getTime()
          , a = {
            nameSpace: "com.weather",
            startDateTime: new Date(window.windowRenderStartTime),
            endDateTime: new Date(n),
            startEpochSec: window.windowRenderStartTime,
            endEpochSec: n,
            os: {
                platform: t("device", "browserOS")
            },
            browser: {
                name: t("device", "browserName")
            },
            twcRelease: r,
            currentLocation: {
                timezoneOffset: t("user", "currentLocation").gmtDiff,
                coords: {
                    lat: t("user", "currentLocation").lat,
                    lon: t("user", "currentLocation").long
                }
            },
            placeNames: {
                city: t("user", "currentLocation").cityNm,
                state: t("user", "currentLocation").stCd,
                country: t("user", "currentLocation").cntryCd
            },
            metrics: {
                timers: [],
                counters: [],
                gauges: []
            }
        };
        return Object.keys(e.timers).forEach(function(t) {
            a.metrics.timers.push({
                name: t,
                startEpochSec: e.timers[t].startTime,
                endEpochSec: e.timers[t].endTime,
                duration: e.timers[t].result
            })
        }),
        Object.keys(e.gauges).forEach(function(t) {
            a.metrics.gauges.push({
                name: t,
                epoch: e.gauges[t].epoch,
                val: e.gauges[t].val,
                units: e.gauges[t].units
            })
        }),
        JSON.stringify(a)
    }
    var o = {
        timers: {},
        counters: {},
        gauges: {}
    }
      , r = {
        appName: "web",
        appVersion: "Web Release not found in release.txt",
        svcCommit: "Tag: not found in release.txt"
    };
    return {
        init: function() {
            this.nodeName = "glue",
            this.restrictExtend = !0
        },
        process: function() {
            var e = this;
            t(),
            navigator.userAgent.match(/iPhone/) && navigator.userAgent.match(/Safari/) || navigator.userAgent.match(/Android/i) ? jQuery(window).load(function() {
                n(e)
            }) : window.addEventListener("beforeunload", function() {
                n(e)
            })
        },
        timer: function(e, t, n) {
            var a = e;
            return o.timers[a] = o.timers[a] || {},
            o.timers[a].description = o.timers[a].description || t || "",
            o.timers[a].startTime = o.timers[a].startTime || n || (new Date).getTime(),
            {
                start: function() {
                    o.timers[a].startTime = (new Date).getTime()
                },
                end: function() {
                    o.timers[a].endTime = (new Date).getTime(),
                    o.timers[a].result = o.timers[a].endTime - o.timers[a].startTime
                },
                result: function() {
                    return o.timers[a].result
                }
            }
        },
        counter: function(e, t) {
            var n = e;
            return o.counters[n] || (o.counters[n] = t || 0),
            {
                inc: function() {
                    o.counters[n]++
                }
            }
        },
        gauge: function(e, t, n) {
            o.gauges[e] = o.gauges[e] || {},
            o.gauges[e].epoch = o.gauges[e].epoch || (new Date).getTime(),
            o.gauges[e].val = o.gauges[e].val || 0,
            o.gauges[e].units = o.gauges[e].units || n,
            o.gauges[e].result = o.gauges[e].val + " " + o.gauges[e].units
        },
        summary: function() {
            Object.keys(o).forEach(function(t) {
                e(t, o[t])
            })
        }
    }
}()),
TWC.initpco = function(e, t, n, a, o) {
    var r = t || {}
      , i = {}
      , s = function(e, t, n) {
        e[t] = n
    }
      , c = function(t, n) {
        e.each(n, function(e, n) {
            s(t, n.getNodeName(), n)
        })
    }
      , d = {};
    d.get = function(e) {
        return i[e]
    }
    ,
    d.setNodeValue = function(e, t, n) {
        return d.get(e).set(t, n)
    }
    ,
    d.getNodeValue = function(e, t) {
        return d.get(e).get(t)
    }
    ;
    var l = new TWC.User({})
      , u = new TWC.Page(r.page ? r.page : {},l)
      , p = new TWC.Device({})
      , g = new TWC.Ad({},u,l,p)
      , f = new TWC.WeatherInfo({},g,l,u)
      , h = new TWC.Metrics({},u)
      , m = new TWC.Products({});
    window.twclog = new TWC.Log({}),
    c(i, [u, l, p, f, g, h, m, twclog]);
    for (var _ = [TWC.Events.getDummyDeferredEvent()].concat(u.promises, l.promises, p.promises, f.promises, g.promises), y = [].concat(TWC.node_hooks || []), v = 0; v < y.length; v++)
        y[v](d, jQuery, _);
    return TWC.PcoUtils.setTiming("pcoWaitForReady", (new Date).getTime()),
    e.when.apply(e, u.promises).done(function() {
        TWC.PcoUtils.setTiming("pageResolved", (new Date).getTime())
    }),
    e.when.apply(e, l.promises).done(function() {
        TWC.PcoUtils.setTiming("userResolved", (new Date).getTime())
    }),
    e.when.apply(e, p.promises).done(function() {
        TWC.PcoUtils.setTiming("deviceResolved", (new Date).getTime())
    }),
    e.when.apply(e, f.promises).done(function() {
        TWC.PcoUtils.setTiming("wxResolved", (new Date).getTime())
    }),
    e.when.apply(e, g.promises).done(function() {
        TWC.PcoUtils.setTiming("adResolved", (new Date).getTime())
    }),
    e.when.apply(e, h.promises).done(function() {
        TWC.PcoUtils.setTiming("metricsResolved", (new Date).getTime())
    }),
    e.when.apply(e, _).done(function() {
        TWC.PcoUtils.setTiming("pcoReady", (new Date).getTime()),
        TWC.Events.getEvent("pcoReady").resolve()
    }),
    "preventExtensions"in Object && Object.preventExtensions(d),
    d
}
,
!function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
}(function(e) {
    function t(e) {
        return o.raw ? e : decodeURIComponent(e.replace(a, " "))
    }
    function n(e) {
        0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")),
        e = t(e);
        try {
            return o.json ? JSON.parse(e) : e
        } catch (e) {}
    }
    var a = /\+/g
      , o = e.cookie = function(a, r, i) {
        if (void 0 !== r) {
            if (i = e.extend({}, o.defaults, i),
            "number" == typeof i.expires) {
                var s = i.expires
                  , c = i.expires = new Date;
                c.setDate(c.getDate() + s)
            }
            return r = o.json ? JSON.stringify(r) : String(r),
            document.cookie = [o.raw ? a : encodeURIComponent(a), "=", o.raw ? r : encodeURIComponent(r), i.expires ? "; expires=" + i.expires.toUTCString() : "", i.path ? "; path=" + i.path : "", i.domain ? "; domain=" + i.domain : "", i.secure ? "; secure" : ""].join("")
        }
        for (var d = document.cookie.split("; "), l = a ? void 0 : {}, u = 0, p = d.length; p > u; u++) {
            var g = d[u].split("=")
              , f = t(g.shift())
              , h = g.join("=");
            if (a && a === f) {
                l = n(h);
                break
            }
            a || (l[f] = n(h))
        }
        return l
    }
    ;
    o.defaults = {},
    e.removeCookie = function(t, n) {
        return void 0 !== e.cookie(t) && (e.cookie(t, null, e.extend({}, n, {
            expires: -1
        })),
        !0)
    }
}),
function() {
    function e() {
        var e = "{}";
        if ("userDataBehavior" == m) {
            f.load("jStorage");
            try {
                e = f.getAttribute("jStorage")
            } catch (e) {}
            try {
                v = f.getAttribute("jStorage_update")
            } catch (e) {}
            g.jStorage = e
        }
        o(),
        s(),
        c()
    }
    function t() {
        var t;
        clearTimeout(y),
        y = setTimeout(function() {
            if ("localStorage" == m || "globalStorage" == m)
                t = g.jStorage_update;
            else if ("userDataBehavior" == m) {
                f.load("jStorage");
                try {
                    t = f.getAttribute("jStorage_update")
                } catch (e) {}
            }
            if (t && t != v) {
                v = t;
                var a, o = l.parse(l.stringify(p.__jstorage_meta.CRC32));
                e(),
                a = l.parse(l.stringify(p.__jstorage_meta.CRC32));
                var r, i = [], s = [];
                for (r in o)
                    o.hasOwnProperty(r) && (a[r] ? o[r] != a[r] && "2." == String(o[r]).substr(0, 2) && i.push(r) : s.push(r));
                for (r in a)
                    a.hasOwnProperty(r) && (o[r] || i.push(r));
                n(i, "updated"),
                n(s, "deleted")
            }
        }, 25)
    }
    function n(e, t) {
        if (e = [].concat(e || []),
        "flushed" == t) {
            e = [];
            for (var n in _)
                _.hasOwnProperty(n) && e.push(n);
            t = "deleted"
        }
        n = 0;
        for (var a = e.length; n < a; n++) {
            if (_[e[n]])
                for (var o = 0, r = _[e[n]].length; o < r; o++)
                    _[e[n]][o](e[n], t);
            if (_["*"])
                for (o = 0,
                r = _["*"].length; o < r; o++)
                    _["*"][o](e[n], t)
        }
    }
    function a() {
        var e = (+new Date).toString();
        if ("localStorage" == m || "globalStorage" == m)
            try {
                g.jStorage_update = e
            } catch (e) {
                m = !1
            }
        else
            "userDataBehavior" == m && (f.setAttribute("jStorage_update", e),
            f.save("jStorage"));
        t()
    }
    function o() {
        if (g.jStorage)
            try {
                p = l.parse(String(g.jStorage))
            } catch (e) {
                g.jStorage = "{}"
            }
        else
            g.jStorage = "{}";
        h = g.jStorage ? String(g.jStorage).length : 0,
        p.__jstorage_meta || (p.__jstorage_meta = {}),
        p.__jstorage_meta.CRC32 || (p.__jstorage_meta.CRC32 = {})
    }
    function r() {
        if (p.__jstorage_meta.PubSub) {
            for (var e = +new Date - 2e3, t = 0, n = p.__jstorage_meta.PubSub.length; t < n; t++)
                if (p.__jstorage_meta.PubSub[t][0] <= e) {
                    p.__jstorage_meta.PubSub.splice(t, p.__jstorage_meta.PubSub.length - t);
                    break
                }
            p.__jstorage_meta.PubSub.length || delete p.__jstorage_meta.PubSub
        }
        try {
            g.jStorage = l.stringify(p),
            f && (f.setAttribute("jStorage", g.jStorage),
            f.save("jStorage")),
            h = g.jStorage ? String(g.jStorage).length : 0
        } catch (e) {}
    }
    function i(e) {
        if (!e || "string" != typeof e && "number" != typeof e)
            throw new TypeError("Key name must be string or numeric");
        if ("__jstorage_meta" == e)
            throw new TypeError("Reserved key name");
        return !0
    }
    function s() {
        var e, t, o, i, c = 1 / 0, d = !1, l = [];
        if (clearTimeout(u),
        p.__jstorage_meta && "object" == typeof p.__jstorage_meta.TTL) {
            e = +new Date,
            o = p.__jstorage_meta.TTL,
            i = p.__jstorage_meta.CRC32;
            for (t in o)
                o.hasOwnProperty(t) && (o[t] <= e ? (delete o[t],
                delete i[t],
                delete p[t],
                d = !0,
                l.push(t)) : o[t] < c && (c = o[t]));
            1 / 0 != c && (u = setTimeout(s, c - e)),
            d && (r(),
            a(),
            n(l, "deleted"))
        }
    }
    function c() {
        var e;
        if (p.__jstorage_meta.PubSub) {
            var t, n = T;
            for (e = p.__jstorage_meta.PubSub.length - 1; 0 <= e; e--)
                if (t = p.__jstorage_meta.PubSub[e],
                t[0] > T) {
                    var n = t[0]
                      , a = t[1];
                    if (t = t[2],
                    w[a])
                        for (var o = 0, r = w[a].length; o < r; o++)
                            w[a][o](a, l.parse(l.stringify(t)))
                }
            T = n
        }
    }
    var d = window.jQuery || window.$ || (window.$ = {})
      , l = {
        parse: window.JSON && (window.JSON.parse || window.JSON.decode) || String.prototype.evalJSON && function(e) {
            return String(e).evalJSON()
        }
        || d.parseJSON || d.evalJSON,
        stringify: Object.toJSON || window.JSON && (window.JSON.stringify || window.JSON.encode) || d.toJSON
    };
    if (!("parse"in l && "stringify"in l))
        throw Error("No JSON support found, include //cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js to page");
    var u, p = {
        __jstorage_meta: {
            CRC32: {}
        }
    }, g = {
        jStorage: "{}"
    }, f = null, h = 0, m = !1, _ = {}, y = !1, v = 0, w = {}, T = +new Date, C = {
        isXML: function(e) {
            return !!(e = (e ? e.ownerDocument || e : 0).documentElement) && "HTML" !== e.nodeName
        },
        encode: function(e) {
            if (!this.isXML(e))
                return !1;
            try {
                return (new XMLSerializer).serializeToString(e)
            } catch (t) {
                try {
                    return e.xml
                } catch (e) {}
            }
            return !1
        },
        decode: function(e) {
            var t = "DOMParser"in window && (new DOMParser).parseFromString || window.ActiveXObject && function(e) {
                var t = new ActiveXObject("Microsoft.XMLDOM");
                return t.async = "false",
                t.loadXML(e),
                t
            }
            ;
            return !!t && (e = t.call("DOMParser"in window && new DOMParser || window, e, "text/xml"),
            !!this.isXML(e) && e)
        }
    };
    d.jStorage = {
        version: "0.4.4",
        set: function(e, t, a) {
            if (i(e),
            a = a || {},
            "undefined" == typeof t)
                return this.deleteKey(e),
                t;
            if (C.isXML(t))
                t = {
                    _is_xml: !0,
                    xml: C.encode(t)
                };
            else {
                if ("function" == typeof t)
                    return;
                t && "object" == typeof t && (t = l.parse(l.stringify(t)))
            }
            p[e] = t;
            for (var o, r = p.__jstorage_meta.CRC32, s = l.stringify(t), c = s.length, d = 2538058380 ^ c, u = 0; 4 <= c; )
                o = 255 & s.charCodeAt(u) | (255 & s.charCodeAt(++u)) << 8 | (255 & s.charCodeAt(++u)) << 16 | (255 & s.charCodeAt(++u)) << 24,
                o = 1540483477 * (65535 & o) + ((1540483477 * (o >>> 16) & 65535) << 16),
                o ^= o >>> 24,
                o = 1540483477 * (65535 & o) + ((1540483477 * (o >>> 16) & 65535) << 16),
                d = 1540483477 * (65535 & d) + ((1540483477 * (d >>> 16) & 65535) << 16) ^ o,
                c -= 4,
                ++u;
            switch (c) {
            case 3:
                d ^= (255 & s.charCodeAt(u + 2)) << 16;
            case 2:
                d ^= (255 & s.charCodeAt(u + 1)) << 8;
            case 1:
                d ^= 255 & s.charCodeAt(u),
                d = 1540483477 * (65535 & d) + ((1540483477 * (d >>> 16) & 65535) << 16)
            }
            return d ^= d >>> 13,
            d = 1540483477 * (65535 & d) + ((1540483477 * (d >>> 16) & 65535) << 16),
            r[e] = "2." + ((d ^ d >>> 15) >>> 0),
            this.setTTL(e, a.TTL || 0),
            n(e, "updated"),
            t
        },
        get: function(e, t) {
            return i(e),
            e in p ? p[e] && "object" == typeof p[e] && p[e]._is_xml ? C.decode(p[e].xml) : p[e] : "undefined" == typeof t ? null : t
        },
        deleteKey: function(e) {
            return i(e),
            e in p && (delete p[e],
            "object" == typeof p.__jstorage_meta.TTL && e in p.__jstorage_meta.TTL && delete p.__jstorage_meta.TTL[e],
            delete p.__jstorage_meta.CRC32[e],
            r(),
            a(),
            n(e, "deleted"),
            !0)
        },
        setTTL: function(e, t) {
            var n = +new Date;
            return i(e),
            t = Number(t) || 0,
            e in p && (p.__jstorage_meta.TTL || (p.__jstorage_meta.TTL = {}),
            0 < t ? p.__jstorage_meta.TTL[e] = n + t : delete p.__jstorage_meta.TTL[e],
            r(),
            s(),
            a(),
            !0)
        },
        getTTL: function(e) {
            var t = +new Date;
            return i(e),
            e in p && p.__jstorage_meta.TTL && p.__jstorage_meta.TTL[e] ? (e = p.__jstorage_meta.TTL[e] - t) || 0 : 0
        },
        flush: function() {
            return p = {
                __jstorage_meta: {
                    CRC32: {}
                }
            },
            r(),
            a(),
            n(null, "flushed"),
            !0
        },
        storageObj: function() {
            function e() {}
            return e.prototype = p,
            new e
        },
        index: function() {
            var e, t = [];
            for (e in p)
                p.hasOwnProperty(e) && "__jstorage_meta" != e && t.push(e);
            return t
        },
        storageSize: function() {
            return h
        },
        currentBackend: function() {
            return m
        },
        storageAvailable: function() {
            return !!m
        },
        listenKeyChange: function(e, t) {
            i(e),
            _[e] || (_[e] = []),
            _[e].push(t)
        },
        stopListening: function(e, t) {
            if (i(e),
            _[e])
                if (t)
                    for (var n = _[e].length - 1; 0 <= n; n--)
                        _[e][n] == t && _[e].splice(n, 1);
                else
                    delete _[e]
        },
        subscribe: function(e, t) {
            if (e = (e || "").toString(),
            !e)
                throw new TypeError("Channel not defined");
            w[e] || (w[e] = []),
            w[e].push(t)
        },
        publish: function(e, t) {
            if (e = (e || "").toString(),
            !e)
                throw new TypeError("Channel not defined");
            p.__jstorage_meta || (p.__jstorage_meta = {}),
            p.__jstorage_meta.PubSub || (p.__jstorage_meta.PubSub = []),
            p.__jstorage_meta.PubSub.unshift([+new Date, e, t]),
            r(),
            a()
        },
        reInit: function() {
            e()
        }
    },
    function() {
        var e = !1;
        if ("localStorage"in window)
            try {
                window.localStorage.setItem("_tmptest", "tmpval"),
                e = !0,
                window.localStorage.removeItem("_tmptest")
            } catch (e) {}
        if (e)
            try {
                window.localStorage && (g = window.localStorage,
                m = "localStorage",
                v = g.jStorage_update)
            } catch (e) {}
        else if ("globalStorage"in window)
            try {
                window.globalStorage && (g = "localhost" == window.location.hostname ? window.globalStorage["localhost.localdomain"] : window.globalStorage[window.location.hostname],
                m = "globalStorage",
                v = g.jStorage_update)
            } catch (e) {}
        else {
            if (f = document.createElement("link"),
            !f.addBehavior)
                return void (f = null);
            f.style.behavior = "url(#default#userData)",
            document.getElementsByTagName("head")[0].appendChild(f);
            try {
                f.load("jStorage")
            } catch (e) {
                f.setAttribute("jStorage", "{}"),
                f.save("jStorage"),
                f.load("jStorage")
            }
            e = "{}";
            try {
                e = f.getAttribute("jStorage")
            } catch (e) {}
            try {
                v = f.getAttribute("jStorage_update")
            } catch (e) {}
            g.jStorage = e,
            m = "userDataBehavior"
        }
        o(),
        s(),
        "localStorage" == m || "globalStorage" == m ? "addEventListener"in window ? window.addEventListener("storage", t, !1) : document.attachEvent("onstorage", t) : "userDataBehavior" == m && setInterval(t, 1e3),
        c(),
        "addEventListener"in window && window.addEventListener("pageshow", function(e) {
            e.persisted && t()
        }, !1)
    }()
}();
