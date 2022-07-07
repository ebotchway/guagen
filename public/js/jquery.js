/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */
function track_with_lead_and_continue(e, t) {
    window.clark.track_with_promise(t, {
        pathName: window.location.pathname
    }, e, createLeadAndProceed)
}

function checkIfLeadAndContinue() {
    createLeadAndProceed("app/appointment")
}

function createLeadAndProceed(e) {
    var t = !1;
    return $.ajax({
        type: "POST",
        beforeSend: function (e) {
            e.setRequestHeader("Accept", "application/vnd.clark-v2+json")
        },
        url: "/api/anonymous_lead",
        data: {
            adjust: createLeadWithSourceData()
        },
        success: function () {
            window.location = e
        },
        error: function (t, n, i) {
            "Conflict" === i && (window.location = e)
        }
    }), t
}

function createLeadWithSourceData() {
    var e = {
        network: "Organic",
        campaign: "",
        creative: ""
    };
    return e = injectAttributionData("utm_creative", "creative", e = injectAttributionData("utm_campaign", "campaign", e = injectAttributionData("utm_source", "network", e)))
}

function injectAttributionData(e, t, n) {
    var i = getParameterByName(e, window.location.href);
    return i && (n[t] = i), n
}

function getParameterByName(e, t) {
    if (!t) return !1;
    e = e.replace(/[\[\]]/g, "\\$&");
    var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
    return !!n && (!!n[2] && decodeURIComponent(n[2].replace(/\+/g, " ")))
}

function DynamicCookieBanner() {
    var e = this;
    this.CONSENT_COOKIE = "consent", this.selectors = {
        container: ".js-dcb__container",
        acceptBtn: ".js-dcb_accept_btn",
        acceptAllBtn: ".js-dcb_accept-all_btn",
        rejectAllBtn: ".js-dcb_reject-all_btn",
        saveBtn: ".js-dcb_save_btn",
        configureBtn: ".js-dcb__configure_btn",
        categoryList: ".js-dcb__category_list",
        second_level_desc: ".js-dcb__second_level_description",
        versionedText: ".js-dcb__versioned_text",
        form: ".js-dcb__form",
        version: ".js-dcb__version",
        preConsentPages: ".js-dcb__pre_consent_pages",
        footerLink: ".page-footer_cookie_banner"
    }, this.refs = {}, this.on = function (e, t) {
        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "click";
        e && e.addEventListener && e.addEventListener(n, t)
    }, this.handleAcceptBtn = function () {
        for (var t = e.prepareRawConsent(), n = 0; n < t.categories.length; n++) t.categories[n].checked = !0;
        e.submitConsent(t)
    }, this.handleRejectAllBtn = function () {
        for (var t = e.prepareRawConsent(), n = 0; n < t.categories.length; n++) t.categories[n].checked = t.categories[n].required;
        e.submitConsent(t)
    }, this.handleAcceptAllBtn = function () {
        e.handleAcceptBtn()
    }, this.handleSaveBtn = function () {
        e.submitConsent(e.prepareRawConsent())
    }, this.handleToggleCategoryOptions = function () {
        var t = "hidden";
        [e.refs.acceptBtn, e.refs.rejectAllBtn, e.refs.acceptAllBtn, e.refs.saveBtn, e.refs.versionedText, e.refs.categoryList, e.refs.second_level_desc, e.refs.configureBtn].forEach(e => e.classList.toggle(t))
    }, this.handleClickFooterLink = function (t) {
        t.preventDefault(), t.stopPropagation(), e.showCookieBanner()
    }, this.submitConsent = function (t) {
        var n = e.getCurrentUserOrLead(),
            i = e.serializeConsent(t);
        e.saveConsent(n, i), e.writeConsentAsCookie(i), e.hideCookieBanner(), e.reloadPage()
    }, this.askForConsent = function () {
        var t = this.readConsentFromLocalStorage() || {};
        if (e.preselectCategoryToggles(t), !e.isPreConsentPage()) {
            var n = this.readRequiredVersionFromBanner();
            t.version !== n && e.showCookieBanner()
        }
    }, this.preselectCategoryToggles = function (e) {
        e.categories !== undefined && e.categories.forEach(e => {
            document.querySelector(`input[name='${e.identifier}']`).checked = e.enabled
        })
    }, this.readRequiredVersionFromBanner = function () {
        if (this.refs.version) return Number.parseInt(this.refs.version.value)
    }, this.serializeConsent = function (e) {
        var t = {
            version: e.version,
            categories: []
        };
        return e.categories.forEach(e => {
            t.categories.push({
                identifier: e.name,
                enabled: e.checked
            })
        }), t
    }, this.writeConsentAsCookie = function (t) {
        var n = 31536e3;
        document.cookie = "".concat(e.CONSENT_COOKIE, "=", JSON.stringify(t), ";").concat("max-age", "=", n, ";").concat("path=/;")
    }, this.readConsentFromLocalStorage = function () {
        var t = document.cookie.split("; ").find(function (t) {
            return t.startsWith("".concat(e.CONSENT_COOKIE, "="))
        });
        if (t) try {
            return JSON.parse(t.split("=")[1])
        } catch (n) {
            console.error("Error Parsing consent Cookie", n)
        }
    }, this.hideCookieBanner = function () {
        e.refs.container.classList.add("hidden")
    }, this.showCookieBanner = function () {
        e.refs.container.classList.remove("hidden")
    }, this.reloadPage = function () {
        setTimeout(function () {
            window.location.reload()
        }, 50)
    }, this.prepareRawConsent = function () {
        var t = {
            categories: []
        };
        return e.refs.form.querySelectorAll('input[type="checkbox"]').forEach(e => {
            t.categories.push({
                name: e.name,
                checked: e.checked,
                required: e.disabled
            })
        }), t.version = e.readRequiredVersionFromBanner(), t
    }, this.bindSelectors = function () {
        Object.keys(e.selectors).forEach(function (t) {
            e.refs[t] = document.querySelector(e.selectors[t])
        })
    }, this.defineEventListeners = function () {
        e.on(e.refs.acceptBtn, e.handleAcceptBtn), e.on(e.refs.rejectAllBtn, e.handleRejectAllBtn), e.on(e.refs.acceptAllBtn, e.handleAcceptAllBtn), e.on(e.refs.saveBtn, e.handleSaveBtn), e.on(e.refs.configureBtn, e.handleToggleCategoryOptions), e.on(e.refs.footerLink, e.handleClickFooterLink)
    }, this.isAdminPage = function () {
        return null !== location.href.match(/\/admin($|\/)/)
    }, this.isPreConsentPage = function () {
        if (this.refs.preConsentPages) return pages = this.refs.preConsentPages.value.split(","), pages.includes(location.pathname)
    }, this.getCurrentUserOrLead = function () {
        var e;
        return $.ajax({
            type: "GET",
            url: "/api/current_user",
            async: !1,
            beforeSend: function (e) {
                e.setRequestHeader("Accept", "application/vnd.clark-v2+json")
            },
            success: function (t) {
                e = t.user || t.lead
            }
        }), e
    }, this.saveConsent = function (e, t) {
        e !== undefined && $.ajax({
            type: "POST",
            xhrFields: {
                withCredentials: !0
            },
            dataType: "json",
            contentType: "application/json",
            url: "/api/customer/current/consent",
            data: JSON.stringify({
                data: {
                    type: "consent",
                    attributes: t
                }
            }),
            beforeSend: function (e) {
                e.setRequestHeader("Accept", "application/vnd.clark-v5+json")
            },
            error: function (e) {
                console.error(e)
            }
        })
    }, this.init = function () {
        e.isAdminPage() || (e.bindSelectors(), e.defineEventListeners(), e.askForConsent())
    }, window.addEventListener("DOMContentLoaded", this.init)
}

function close_youtube_video() {
    $(".video-hero__youtube").fadeOut(), player.stopVideo()
}

function show_youtube_video() {
    window.track({
        event: "click_onvideo_video_hero"
    }), $(".video-hero__youtube").fadeIn(), player.playVideo()
}

function loadPlayer(e) {
    if ("undefined" == typeof YT || "undefined" == typeof YT.Player) {
        var t = document.createElement("script");
        t.src = "https://www.youtube.com/iframe_api";
        var n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(t, n), window.onYouTubePlayerAPIReady = function () {
            onYouTubePlayer(e)
        }
    } else onYouTubePlayer(e)
}

function onYouTubePlayer(e) {
    player = new YT.Player("ytplayer", {
        height: "490",
        videoId: e,
        frameborder: "0",
        gesture: "media",
        allowfullscreen: "",
        playerVars: {
            controls: 0,
            showinfo: 0,
            rel: 0,
            showsearch: 0,
            iv_load_policy: 3,
            enablejsapi: 1,
            autoplay: 0,
            modestbranding: 0
        },
        events: {
            onError: catchError,
            onStateChange: onPlayerStateChange
        }
    })
}

function catchError() {}

function onPlayerStateChange(e) {
    e.data == YT.PlayerState.ENDED && setTimeout(close_youtube_video, 200)
}
var player;
! function (e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
    "use strict";

    function n(e, t, n) {
        var i, r, o = (n = n || we).createElement("script");
        if (o.text = e, t)
            for (i in xe)(r = t[i] || t.getAttribute && t.getAttribute(i)) && o.setAttribute(i, r);
        n.head.appendChild(o).parentNode.removeChild(o)
    }

    function i(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? pe[he.call(e)] || "object" : typeof e
    }

    function r(e) {
        var t = !!e && "length" in e && e.length,
            n = i(e);
        return !be(e) && !_e(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function o(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }

    function a(e, t, n) {
        return be(t) ? Ce.grep(e, function (e, i) {
            return !!t.call(e, i, e) !== n
        }) : t.nodeType ? Ce.grep(e, function (e) {
            return e === t !== n
        }) : "string" != typeof t ? Ce.grep(e, function (e) {
            return fe.call(t, e) > -1 !== n
        }) : Ce.filter(t, e, n)
    }

    function s(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }

    function l(e) {
        var t = {};
        return Ce.each(e.match(Pe) || [], function (e, n) {
            t[n] = !0
        }), t
    }

    function c(e) {
        return e
    }

    function u(e) {
        throw e
    }

    function d(e, t, n, i) {
        var r;
        try {
            e && be(r = e.promise) ? r.call(e).done(t).fail(n) : e && be(r = e.then) ? r.call(e, t, n) : t.apply(undefined, [e].slice(i))
        } catch (e) {
            n.apply(undefined, [e])
        }
    }

    function f() {
        we.removeEventListener("DOMContentLoaded", f), e.removeEventListener("load", f), Ce.ready()
    }

    function p(e, t) {
        return t.toUpperCase()
    }

    function h(e) {
        return e.replace(Me, "ms-").replace(ze, p)
    }

    function m() {
        this.expando = Ce.expando + m.uid++
    }

    function g(e) {
        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : We.test(e) ? JSON.parse(e) : e)
    }

    function v(e, t, n) {
        var i;
        if (n === undefined && 1 === e.nodeType)
            if (i = "data-" + t.replace(Fe, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(i))) {
                try {
                    n = g(n)
                } catch (r) {}
                Be.set(e, t, n)
            } else n = undefined;
        return n
    }

    function y(e, t, n, i) {
        var r, o, a = 20,
            s = i ? function () {
                return i.cur()
            } : function () {
                return Ce.css(e, t, "")
            },
            l = s(),
            c = n && n[3] || (Ce.cssNumber[t] ? "" : "px"),
            u = e.nodeType && (Ce.cssNumber[t] || "px" !== c && +l) && Ue.exec(Ce.css(e, t));
        if (u && u[3] !== c) {
            for (l /= 2, c = c || u[3], u = +l || 1; a--;) Ce.style(e, t, u + c), (1 - o) * (1 - (o = s() / l || .5)) <= 0 && (a = 0), u /= o;
            u *= 2, Ce.style(e, t, u + c), n = n || []
        }
        return n && (u = +u || +l || 0, r = n[1] ? u + (n[1] + 1) * n[2] : +n[2], i && (i.unit = c, i.start = u, i.end = r)), r
    }

    function b(e) {
        var t, n = e.ownerDocument,
            i = e.nodeName,
            r = Ke[i];
        return r || (t = n.body.appendChild(n.createElement(i)), r = Ce.css(t, "display"), t.parentNode.removeChild(t), "none" === r && (r = "block"), Ke[i] = r, r)
    }

    function _(e, t) {
        for (var n, i, r = [], o = 0, a = e.length; o < a; o++)(i = e[o]).style && (n = i.style.display, t ? ("none" === n && (r[o] = Re.get(i, "display") || null, r[o] || (i.style.display = "")), "" === i.style.display && Ge(i) && (r[o] = b(i))) : "none" !== n && (r[o] = "none", Re.set(i, "display", n)));
        for (o = 0; o < a; o++) null != r[o] && (e[o].style.display = r[o]);
        return e
    }

    function w(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [], t === undefined || t && o(e, t) ? Ce.merge([e], n) : n
    }

    function x(e, t) {
        for (var n = 0, i = e.length; n < i; n++) Re.set(e[n], "globalEval", !t || Re.get(t[n], "globalEval"))
    }

    function k(e, t, n, r, o) {
        for (var a, s, l, c, u, d, f = t.createDocumentFragment(), p = [], h = 0, m = e.length; h < m; h++)
            if ((a = e[h]) || 0 === a)
                if ("object" === i(a)) Ce.merge(p, a.nodeType ? [a] : a);
                else if (ot.test(a)) {
            for (s = s || f.appendChild(t.createElement("div")), l = (nt.exec(a) || ["", ""])[1].toLowerCase(), c = rt[l] || rt._default, s.innerHTML = c[1] + Ce.htmlPrefilter(a) + c[2], d = c[0]; d--;) s = s.lastChild;
            Ce.merge(p, s.childNodes), (s = f.firstChild).textContent = ""
        } else p.push(t.createTextNode(a));
        for (f.textContent = "", h = 0; a = p[h++];)
            if (r && Ce.inArray(a, r) > -1) o && o.push(a);
            else if (u = Ye(a), s = w(f.appendChild(a), "script"), u && x(s), n)
            for (d = 0; a = s[d++];) it.test(a.type || "") && n.push(a);
        return f
    }

    function C() {
        return !0
    }

    function S() {
        return !1
    }

    function T(e, t) {
        return e === E() == ("focus" === t)
    }

    function E() {
        try {
            return we.activeElement
        } catch (e) {}
    }

    function $(e, t, n, i, r, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (i = i || n, n = undefined), t) $(e, s, n, i, t[s], o);
            return e
        }
        if (null == i && null == r ? (r = n, i = n = undefined) : null == r && ("string" == typeof n ? (r = i, i = undefined) : (r = i, i = n, n = undefined)), !1 === r) r = S;
        else if (!r) return e;
        return 1 === o && (a = r, (r = function (e) {
            return Ce().off(e), a.apply(this, arguments)
        }).guid = a.guid || (a.guid = Ce.guid++)), e.each(function () {
            Ce.event.add(this, t, r, i, n)
        })
    }

    function A(e, t, n) {
        n ? (Re.set(e, t, !1), Ce.event.add(e, t, {
            namespace: !1,
            handler: function (e) {
                var i, r, o = Re.get(this, t);
                if (1 & e.isTrigger && this[t]) {
                    if (o.length)(Ce.event.special[t] || {}).delegateType && e.stopPropagation();
                    else if (o = ce.call(arguments), Re.set(this, t, o), i = n(this, t), this[t](), o !== (r = Re.get(this, t)) || i ? Re.set(this, t, !1) : r = {}, o !== r) return e.stopImmediatePropagation(), e.preventDefault(), r.value
                } else o.length && (Re.set(this, t, {
                    value: Ce.event.trigger(Ce.extend(o[0], Ce.Event.prototype), o.slice(1), this)
                }), e.stopImmediatePropagation())
            }
        })) : Re.get(e, t) === undefined && Ce.event.add(e, t, C)
    }

    function j(e, t) {
        return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") && Ce(e).children("tbody")[0] || e
    }

    function D(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function N(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
    }

    function L(e, t) {
        var n, i, r, o, a, s;
        if (1 === t.nodeType) {
            if (Re.hasData(e) && (s = Re.get(e).events))
                for (r in Re.remove(t, "handle events"), s)
                    for (n = 0, i = s[r].length; n < i; n++) Ce.event.add(t, r, s[r][n]);
            Be.hasData(e) && (o = Be.access(e), a = Ce.extend({}, o), Be.set(t, a))
        }
    }

    function P(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && tt.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
    }

    function I(e, t, i, r) {
        t = ue(t);
        var o, a, s, l, c, u, d = 0,
            f = e.length,
            p = f - 1,
            h = t[0],
            m = be(h);
        if (m || f > 1 && "string" == typeof h && !ye.checkClone && ut.test(h)) return e.each(function (n) {
            var o = e.eq(n);
            m && (t[0] = h.call(this, n, o.html())), I(o, t, i, r)
        });
        if (f && (a = (o = k(t, e[0].ownerDocument, !1, e, r)).firstChild, 1 === o.childNodes.length && (o = a), a || r)) {
            for (l = (s = Ce.map(w(o, "script"), D)).length; d < f; d++) c = o, d !== p && (c = Ce.clone(c, !0, !0), l && Ce.merge(s, w(c, "script"))), i.call(e[d], c, d);
            if (l)
                for (u = s[s.length - 1].ownerDocument, Ce.map(s, N), d = 0; d < l; d++) c = s[d], it.test(c.type || "") && !Re.access(c, "globalEval") && Ce.contains(u, c) && (c.src && "module" !== (c.type || "").toLowerCase() ? Ce._evalUrl && !c.noModule && Ce._evalUrl(c.src, {
                    nonce: c.nonce || c.getAttribute("nonce")
                }, u) : n(c.textContent.replace(dt, ""), c, u))
        }
        return e
    }

    function q(e, t, n) {
        for (var i, r = t ? Ce.filter(t, e) : e, o = 0; null != (i = r[o]); o++) n || 1 !== i.nodeType || Ce.cleanData(w(i)), i.parentNode && (n && Ye(i) && x(w(i, "script")), i.parentNode.removeChild(i));
        return e
    }

    function O(e, t, n) {
        var i, r, o, a, s = e.style;
        return (n = n || pt(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || Ye(e) || (a = Ce.style(e, t)), !ye.pixelBoxStyles() && ft.test(a) && mt.test(t) && (i = s.width, r = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = i, s.minWidth = r, s.maxWidth = o)), a !== undefined ? a + "" : a
    }

    function M(e, t) {
        return {
            get: function () {
                if (!e()) return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }

    function z(e) {
        for (var t = e[0].toUpperCase() + e.slice(1), n = gt.length; n--;)
            if ((e = gt[n] + t) in vt) return e
    }

    function H(e) {
        var t = Ce.cssProps[e] || yt[e];
        return t || (e in vt ? e : yt[e] = z(e) || e)
    }

    function R(e, t, n) {
        var i = Ue.exec(t);
        return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
    }

    function B(e, t, n, i, r, o) {
        var a = "width" === t ? 1 : 0,
            s = 0,
            l = 0;
        if (n === (i ? "border" : "content")) return 0;
        for (; a < 4; a += 2) "margin" === n && (l += Ce.css(e, n + Qe[a], !0, r)), i ? ("content" === n && (l -= Ce.css(e, "padding" + Qe[a], !0, r)), "margin" !== n && (l -= Ce.css(e, "border" + Qe[a] + "Width", !0, r))) : (l += Ce.css(e, "padding" + Qe[a], !0, r), "padding" !== n ? l += Ce.css(e, "border" + Qe[a] + "Width", !0, r) : s += Ce.css(e, "border" + Qe[a] + "Width", !0, r));
        return !i && o >= 0 && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - l - s - .5)) || 0), l
    }

    function W(e, t, n) {
        var i = pt(e),
            r = (!ye.boxSizingReliable() || n) && "border-box" === Ce.css(e, "boxSizing", !1, i),
            a = r,
            s = O(e, t, i),
            l = "offset" + t[0].toUpperCase() + t.slice(1);
        if (ft.test(s)) {
            if (!n) return s;
            s = "auto"
        }
        return (!ye.boxSizingReliable() && r || !ye.reliableTrDimensions() && o(e, "tr") || "auto" === s || !parseFloat(s) && "inline" === Ce.css(e, "display", !1, i)) && e.getClientRects().length && (r = "border-box" === Ce.css(e, "boxSizing", !1, i), (a = l in e) && (s = e[l])), (s = parseFloat(s) || 0) + B(e, t, n || (r ? "border" : "content"), a, i, s) + "px"
    }

    function F(e, t, n, i, r) {
        return new F.prototype.init(e, t, n, i, r)
    }

    function V() {
        Ct && (!1 === we.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(V) : e.setTimeout(V, Ce.fx.interval), Ce.fx.tick())
    }

    function U() {
        return e.setTimeout(function () {
            kt = undefined
        }), kt = Date.now()
    }

    function Q(e, t) {
        var n, i = 0,
            r = {
                height: e
            };
        for (t = t ? 1 : 0; i < 4; i += 2 - t) r["margin" + (n = Qe[i])] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function X(e, t, n) {
        for (var i, r = (G.tweeners[t] || []).concat(G.tweeners["*"]), o = 0, a = r.length; o < a; o++)
            if (i = r[o].call(n, t, e)) return i
    }

    function Y(e, t, n) {
        var i, r, o, a, s, l, c, u, d = "width" in t || "height" in t,
            f = this,
            p = {},
            h = e.style,
            m = e.nodeType && Ge(e),
            g = Re.get(e, "fxshow");
        for (i in n.queue || (null == (a = Ce._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () {
                a.unqueued || s()
            }), a.unqueued++, f.always(function () {
                f.always(function () {
                    a.unqueued--, Ce.queue(e, "fx").length || a.empty.fire()
                })
            })), t)
            if (r = t[i], St.test(r)) {
                if (delete t[i], o = o || "toggle" === r, r === (m ? "hide" : "show")) {
                    if ("show" !== r || !g || g[i] === undefined) continue;
                    m = !0
                }
                p[i] = g && g[i] || Ce.style(e, i)
            } if ((l = !Ce.isEmptyObject(t)) || !Ce.isEmptyObject(p))
            for (i in d && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (c = g && g.display) && (c = Re.get(e, "display")), "none" === (u = Ce.css(e, "display")) && (c ? u = c : (_([e], !0), c = e.style.display || c, u = Ce.css(e, "display"), _([e]))), ("inline" === u || "inline-block" === u && null != c) && "none" === Ce.css(e, "float") && (l || (f.done(function () {
                    h.display = c
                }), null == c && (u = h.display, c = "none" === u ? "" : u)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", f.always(function () {
                    h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                })), l = !1, p) l || (g ? "hidden" in g && (m = g.hidden) : g = Re.access(e, "fxshow", {
                display: c
            }), o && (g.hidden = !m), m && _([e], !0), f.done(function () {
                for (i in m || _([e]), Re.remove(e, "fxshow"), p) Ce.style(e, i, p[i])
            })), l = X(m ? g[i] : 0, i, f), i in g || (g[i] = l.start, m && (l.end = l.start, l.start = 0))
    }

    function J(e, t) {
        var n, i, r, o, a;
        for (n in e)
            if (r = t[i = h(n)], o = e[n], Array.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), (a = Ce.cssHooks[i]) && "expand" in a)
                for (n in o = a.expand(o), delete e[i], o) n in e || (e[n] = o[n], t[n] = r);
            else t[i] = r
    }

    function G(e, t, n) {
        var i, r, o = 0,
            a = G.prefilters.length,
            s = Ce.Deferred().always(function () {
                delete l.elem
            }),
            l = function () {
                if (r) return !1;
                for (var t = kt || U(), n = Math.max(0, c.startTime + c.duration - t), i = 1 - (n / c.duration || 0), o = 0, a = c.tweens.length; o < a; o++) c.tweens[o].run(i);
                return s.notifyWith(e, [c, i, n]), i < 1 && a ? n : (a || s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c]), !1)
            },
            c = s.promise({
                elem: e,
                props: Ce.extend({}, t),
                opts: Ce.extend(!0, {
                    specialEasing: {},
                    easing: Ce.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: kt || U(),
                duration: n.duration,
                tweens: [],
                createTween: function (t, n) {
                    var i = Ce.Tween(e, c.opts, t, n, c.opts.specialEasing[t] || c.opts.easing);
                    return c.tweens.push(i), i
                },
                stop: function (t) {
                    var n = 0,
                        i = t ? c.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; n < i; n++) c.tweens[n].run(1);
                    return t ? (s.notifyWith(e, [c, 1, 0]), s.resolveWith(e, [c, t])) : s.rejectWith(e, [c, t]), this
                }
            }),
            u = c.props;
        for (J(u, c.opts.specialEasing); o < a; o++)
            if (i = G.prefilters[o].call(c, e, u, c.opts)) return be(i.stop) && (Ce._queueHooks(c.elem, c.opts.queue).stop = i.stop.bind(i)), i;
        return Ce.map(u, X, c), be(c.opts.start) && c.opts.start.call(e, c), c.progress(c.opts.progress).done(c.opts.done, c.opts.complete).fail(c.opts.fail).always(c.opts.always), Ce.fx.timer(Ce.extend(l, {
            elem: e,
            anim: c,
            queue: c.opts.queue
        })), c
    }

    function K(e) {
        return (e.match(Pe) || []).join(" ")
    }

    function Z(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }

    function ee(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(Pe) || []
    }

    function te(e, t, n, r) {
        var o;
        if (Array.isArray(t)) Ce.each(t, function (t, i) {
            n || Ot.test(e) ? r(e, i) : te(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
        });
        else if (n || "object" !== i(t)) r(e, t);
        else
            for (o in t) te(e + "[" + o + "]", t[o], n, r)
    }

    function ne(e) {
        return function (t, n) {
            "string" != typeof t && (n = t, t = "*");
            var i, r = 0,
                o = t.toLowerCase().match(Pe) || [];
            if (be(n))
                for (; i = o[r++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }

    function ie(e, t, n, i) {
        function r(s) {
            var l;
            return o[s] = !0, Ce.each(e[s] || [], function (e, s) {
                var c = s(t, n, i);
                return "string" != typeof c || a || o[c] ? a ? !(l = c) : void 0 : (t.dataTypes.unshift(c), r(c), !1)
            }), l
        }
        var o = {},
            a = e === Yt;
        return r(t.dataTypes[0]) || !o["*"] && r("*")
    }

    function re(e, t) {
        var n, i, r = Ce.ajaxSettings.flatOptions || {};
        for (n in t) t[n] !== undefined && ((r[n] ? e : i || (i = {}))[n] = t[n]);
        return i && Ce.extend(!0, e, i), e
    }

    function oe(e, t, n) {
        for (var i, r, o, a, s = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), i === undefined && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i)
            for (r in s)
                if (s[r] && s[r].test(i)) {
                    l.unshift(r);
                    break
                } if (l[0] in n) o = l[0];
        else {
            for (r in n) {
                if (!l[0] || e.converters[r + " " + l[0]]) {
                    o = r;
                    break
                }
                a || (a = r)
            }
            o = o || a
        }
        if (o) return o !== l[0] && l.unshift(o), n[o]
    }

    function ae(e, t, n, i) {
        var r, o, a, s, l, c = {},
            u = e.dataTypes.slice();
        if (u[1])
            for (a in e.converters) c[a.toLowerCase()] = e.converters[a];
        for (o = u.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = u.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
            if (!(a = c[l + " " + o] || c["* " + o]))
                for (r in c)
                    if ((s = r.split(" "))[1] === o && (a = c[l + " " + s[0]] || c["* " + s[0]])) {
                        !0 === a ? a = c[r] : !0 !== c[r] && (o = s[0], u.unshift(s[1]));
                        break
                    } if (!0 !== a)
                if (a && e.throws) t = a(t);
                else try {
                    t = a(t)
                } catch (d) {
                    return {
                        state: "parsererror",
                        error: a ? d : "No conversion from " + l + " to " + o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }
    var se = [],
        le = Object.getPrototypeOf,
        ce = se.slice,
        ue = se.flat ? function (e) {
            return se.flat.call(e)
        } : function (e) {
            return se.concat.apply([], e)
        },
        de = se.push,
        fe = se.indexOf,
        pe = {},
        he = pe.toString,
        me = pe.hasOwnProperty,
        ge = me.toString,
        ve = ge.call(Object),
        ye = {},
        be = function (e) {
            return "function" == typeof e && "number" != typeof e.nodeType
        },
        _e = function (e) {
            return null != e && e === e.window
        },
        we = e.document,
        xe = {
            type: !0,
            src: !0,
            nonce: !0,
            noModule: !0
        },
        ke = "3.5.1",
        Ce = function (e, t) {
            return new Ce.fn.init(e, t)
        };
    Ce.fn = Ce.prototype = {
        jquery: ke,
        constructor: Ce,
        length: 0,
        toArray: function () {
            return ce.call(this)
        },
        get: function (e) {
            return null == e ? ce.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function (e) {
            var t = Ce.merge(this.constructor(), e);
            return t.prevObject = this, t
        },
        each: function (e) {
            return Ce.each(this, e)
        },
        map: function (e) {
            return this.pushStack(Ce.map(this, function (t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function () {
            return this.pushStack(ce.apply(this, arguments))
        },
        first: function () {
            return this.eq(0)
        },
        last: function () {
            return this.eq(-1)
        },
        even: function () {
            return this.pushStack(Ce.grep(this, function (e, t) {
                return (t + 1) % 2
            }))
        },
        odd: function () {
            return this.pushStack(Ce.grep(this, function (e, t) {
                return t % 2
            }))
        },
        eq: function (e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function () {
            return this.prevObject || this.constructor()
        },
        push: de,
        sort: se.sort,
        splice: se.splice
    }, Ce.extend = Ce.fn.extend = function () {
        var e, t, n, i, r, o, a = arguments[0] || {},
            s = 1,
            l = arguments.length,
            c = !1;
        for ("boolean" == typeof a && (c = a, a = arguments[s] || {}, s++), "object" == typeof a || be(a) || (a = {}), s === l && (a = this, s--); s < l; s++)
            if (null != (e = arguments[s]))
                for (t in e) i = e[t], "__proto__" !== t && a !== i && (c && i && (Ce.isPlainObject(i) || (r = Array.isArray(i))) ? (n = a[t], o = r && !Array.isArray(n) ? [] : r || Ce.isPlainObject(n) ? n : {}, r = !1, a[t] = Ce.extend(c, o, i)) : i !== undefined && (a[t] = i));
        return a
    }, Ce.extend({
        expando: "jQuery" + (ke + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function (e) {
            throw new Error(e)
        },
        noop: function () {},
        isPlainObject: function (e) {
            var t, n;
            return !(!e || "[object Object]" !== he.call(e)) && (!(t = le(e)) || "function" == typeof (n = me.call(t, "constructor") && t.constructor) && ge.call(n) === ve)
        },
        isEmptyObject: function (e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        globalEval: function (e, t, i) {
            n(e, {
                nonce: t && t.nonce
            }, i)
        },
        each: function (e, t) {
            var n, i = 0;
            if (r(e))
                for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++);
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i])) break;
            return e
        },
        makeArray: function (e, t) {
            var n = t || [];
            return null != e && (r(Object(e)) ? Ce.merge(n, "string" == typeof e ? [e] : e) : de.call(n, e)), n
        },
        inArray: function (e, t, n) {
            return null == t ? -1 : fe.call(t, e, n)
        },
        merge: function (e, t) {
            for (var n = +t.length, i = 0, r = e.length; i < n; i++) e[r++] = t[i];
            return e.length = r, e
        },
        grep: function (e, t, n) {
            for (var i = [], r = 0, o = e.length, a = !n; r < o; r++) !t(e[r], r) !== a && i.push(e[r]);
            return i
        },
        map: function (e, t, n) {
            var i, o, a = 0,
                s = [];
            if (r(e))
                for (i = e.length; a < i; a++) null != (o = t(e[a], a, n)) && s.push(o);
            else
                for (a in e) null != (o = t(e[a], a, n)) && s.push(o);
            return ue(s)
        },
        guid: 1,
        support: ye
    }), "function" == typeof Symbol && (Ce.fn[Symbol.iterator] = se[Symbol.iterator]), Ce.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
        pe["[object " + t + "]"] = t.toLowerCase()
    });
    var Se =
        /*!
         * Sizzle CSS Selector Engine v2.3.5
         * https://sizzlejs.com/
         *
         * Copyright JS Foundation and other contributors
         * Released under the MIT license
         * https://js.foundation/
         *
         * Date: 2020-03-14
         */
        function (e) {
            function t(e, t, n, i) {
                var r, o, a, s, l, c, u, f = t && t.ownerDocument,
                    h = t ? t.nodeType : 9;
                if (n = n || [], "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h) return n;
                if (!i && (N(t), t = t || L, I)) {
                    if (11 !== h && (l = be.exec(e)))
                        if (r = l[1]) {
                            if (9 === h) {
                                if (!(a = t.getElementById(r))) return n;
                                if (a.id === r) return n.push(a), n
                            } else if (f && (a = f.getElementById(r)) && z(t, a) && a.id === r) return n.push(a), n
                        } else {
                            if (l[2]) return Z.apply(n, t.getElementsByTagName(e)), n;
                            if ((r = l[3]) && x.getElementsByClassName && t.getElementsByClassName) return Z.apply(n, t.getElementsByClassName(r)), n
                        } if (x.qsa && !Q[e + " "] && (!q || !q.test(e)) && (1 !== h || "object" !== t.nodeName.toLowerCase())) {
                        if (u = e, f = t, 1 === h && (de.test(e) || ue.test(e))) {
                            for ((f = _e.test(e) && d(t.parentNode) || t) === t && x.scope || ((s = t.getAttribute("id")) ? s = s.replace(ke, Ce) : t.setAttribute("id", s = H)), o = (c = T(e)).length; o--;) c[o] = (s ? "#" + s : ":scope") + " " + p(c[o]);
                            u = c.join(",")
                        }
                        try {
                            return Z.apply(n, f.querySelectorAll(u)), n
                        } catch (m) {
                            Q(e, !0)
                        } finally {
                            s === H && t.removeAttribute("id")
                        }
                    }
                }
                return $(e.replace(le, "$1"), t, n, i)
            }

            function n() {
                function e(n, i) {
                    return t.push(n + " ") > k.cacheLength && delete e[t.shift()], e[n + " "] = i
                }
                var t = [];
                return e
            }

            function i(e) {
                return e[H] = !0, e
            }

            function r(e) {
                var t = L.createElement("fieldset");
                try {
                    return !!e(t)
                } catch (n) {
                    return !1
                } finally {
                    t.parentNode && t.parentNode.removeChild(t), t = null
                }
            }

            function o(e, t) {
                for (var n = e.split("|"), i = n.length; i--;) k.attrHandle[n[i]] = t
            }

            function a(e, t) {
                var n = t && e,
                    i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
                if (i) return i;
                if (n)
                    for (; n = n.nextSibling;)
                        if (n === t) return -1;
                return e ? 1 : -1
            }

            function s(e) {
                return function (t) {
                    return "input" === t.nodeName.toLowerCase() && t.type === e
                }
            }

            function l(e) {
                return function (t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e
                }
            }

            function c(e) {
                return function (t) {
                    return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Te(t) === e : t.disabled === e : "label" in t && t.disabled === e
                }
            }

            function u(e) {
                return i(function (t) {
                    return t = +t, i(function (n, i) {
                        for (var r, o = e([], n.length, t), a = o.length; a--;) n[r = o[a]] && (n[r] = !(i[r] = n[r]))
                    })
                })
            }

            function d(e) {
                return e && "undefined" != typeof e.getElementsByTagName && e
            }

            function f() {}

            function p(e) {
                for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
                return i
            }

            function h(e, t, n) {
                var i = t.dir,
                    r = t.next,
                    o = r || i,
                    a = n && "parentNode" === o,
                    s = W++;
                return t.first ? function (t, n, r) {
                    for (; t = t[i];)
                        if (1 === t.nodeType || a) return e(t, n, r);
                    return !1
                } : function (t, n, l) {
                    var c, u, d, f = [B, s];
                    if (l) {
                        for (; t = t[i];)
                            if ((1 === t.nodeType || a) && e(t, n, l)) return !0
                    } else
                        for (; t = t[i];)
                            if (1 === t.nodeType || a)
                                if (u = (d = t[H] || (t[H] = {}))[t.uniqueID] || (d[t.uniqueID] = {}), r && r === t.nodeName.toLowerCase()) t = t[i] || t;
                                else {
                                    if ((c = u[o]) && c[0] === B && c[1] === s) return f[2] = c[2];
                                    if (u[o] = f, f[2] = e(t, n, l)) return !0
                                } return !1
                }
            }

            function m(e) {
                return e.length > 1 ? function (t, n, i) {
                    for (var r = e.length; r--;)
                        if (!e[r](t, n, i)) return !1;
                    return !0
                } : e[0]
            }

            function g(e, n, i) {
                for (var r = 0, o = n.length; r < o; r++) t(e, n[r], i);
                return i
            }

            function v(e, t, n, i, r) {
                for (var o, a = [], s = 0, l = e.length, c = null != t; s < l; s++)(o = e[s]) && (n && !n(o, i, r) || (a.push(o), c && t.push(s)));
                return a
            }

            function y(e, t, n, r, o, a) {
                return r && !r[H] && (r = y(r)), o && !o[H] && (o = y(o, a)), i(function (i, a, s, l) {
                    var c, u, d, f = [],
                        p = [],
                        h = a.length,
                        m = i || g(t || "*", s.nodeType ? [s] : s, []),
                        y = !e || !i && t ? m : v(m, f, e, s, l),
                        b = n ? o || (i ? e : h || r) ? [] : a : y;
                    if (n && n(y, b, s, l), r)
                        for (c = v(b, p), r(c, [], s, l), u = c.length; u--;)(d = c[u]) && (b[p[u]] = !(y[p[u]] = d));
                    if (i) {
                        if (o || e) {
                            if (o) {
                                for (c = [], u = b.length; u--;)(d = b[u]) && c.push(y[u] = d);
                                o(null, b = [], c, l)
                            }
                            for (u = b.length; u--;)(d = b[u]) && (c = o ? te(i, d) : f[u]) > -1 && (i[c] = !(a[c] = d))
                        }
                    } else b = v(b === a ? b.splice(h, b.length) : b), o ? o(null, a, b, l) : Z.apply(a, b)
                })
            }

            function b(e) {
                for (var t, n, i, r = e.length, o = k.relative[e[0].type], a = o || k.relative[" "], s = o ? 1 : 0, l = h(function (e) {
                        return e === t
                    }, a, !0), c = h(function (e) {
                        return te(t, e) > -1
                    }, a, !0), u = [function (e, n, i) {
                        var r = !o && (i || n !== A) || ((t = n).nodeType ? l(e, n, i) : c(e, n, i));
                        return t = null, r
                    }]; s < r; s++)
                    if (n = k.relative[e[s].type]) u = [h(m(u), n)];
                    else {
                        if ((n = k.filter[e[s].type].apply(null, e[s].matches))[H]) {
                            for (i = ++s; i < r && !k.relative[e[i].type]; i++);
                            return y(s > 1 && m(u), s > 1 && p(e.slice(0, s - 1).concat({
                                value: " " === e[s - 2].type ? "*" : ""
                            })).replace(le, "$1"), n, s < i && b(e.slice(s, i)), i < r && b(e = e.slice(i)), i < r && p(e))
                        }
                        u.push(n)
                    } return m(u)
            }

            function _(e, n) {
                var r = n.length > 0,
                    o = e.length > 0,
                    a = function (i, a, s, l, c) {
                        var u, d, f, p = 0,
                            h = "0",
                            m = i && [],
                            g = [],
                            y = A,
                            b = i || o && k.find.TAG("*", c),
                            _ = B += null == y ? 1 : Math.random() || .1,
                            w = b.length;
                        for (c && (A = a == L || a || c); h !== w && null != (u = b[h]); h++) {
                            if (o && u) {
                                for (d = 0, a || u.ownerDocument == L || (N(u), s = !I); f = e[d++];)
                                    if (f(u, a || L, s)) {
                                        l.push(u);
                                        break
                                    } c && (B = _)
                            }
                            r && ((u = !f && u) && p--, i && m.push(u))
                        }
                        if (p += h, r && h !== p) {
                            for (d = 0; f = n[d++];) f(m, g, a, s);
                            if (i) {
                                if (p > 0)
                                    for (; h--;) m[h] || g[h] || (g[h] = G.call(l));
                                g = v(g)
                            }
                            Z.apply(l, g), c && !i && g.length > 0 && p + n.length > 1 && t.uniqueSort(l)
                        }
                        return c && (B = _, A = y), m
                    };
                return r ? i(a) : a
            }
            var w, x, k, C, S, T, E, $, A, j, D, N, L, P, I, q, O, M, z, H = "sizzle" + 1 * new Date,
                R = e.document,
                B = 0,
                W = 0,
                F = n(),
                V = n(),
                U = n(),
                Q = n(),
                X = function (e, t) {
                    return e === t && (D = !0), 0
                },
                Y = {}.hasOwnProperty,
                J = [],
                G = J.pop,
                K = J.push,
                Z = J.push,
                ee = J.slice,
                te = function (e, t) {
                    for (var n = 0, i = e.length; n < i; n++)
                        if (e[n] === t) return n;
                    return -1
                },
                ne = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                ie = "[\\x20\\t\\r\\n\\f]",
                re = "(?:\\\\[\\da-fA-F]{1,6}" + ie + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
                oe = "\\[" + ie + "*(" + re + ")(?:" + ie + "*([*^$|!~]?=)" + ie + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + re + "))|)" + ie + "*\\]",
                ae = ":(" + re + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + oe + ")*)|.*)\\)|)",
                se = new RegExp(ie + "+", "g"),
                le = new RegExp("^" + ie + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ie + "+$", "g"),
                ce = new RegExp("^" + ie + "*," + ie + "*"),
                ue = new RegExp("^" + ie + "*([>+~]|" + ie + ")" + ie + "*"),
                de = new RegExp(ie + "|>"),
                fe = new RegExp(ae),
                pe = new RegExp("^" + re + "$"),
                he = {
                    ID: new RegExp("^#(" + re + ")"),
                    CLASS: new RegExp("^\\.(" + re + ")"),
                    TAG: new RegExp("^(" + re + "|[*])"),
                    ATTR: new RegExp("^" + oe),
                    PSEUDO: new RegExp("^" + ae),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ie + "*(even|odd|(([+-]|)(\\d*)n|)" + ie + "*(?:([+-]|)" + ie + "*(\\d+)|))" + ie + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + ne + ")$", "i"),
                    needsContext: new RegExp("^" + ie + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ie + "*((?:-\\d)?\\d*)" + ie + "*\\)|)(?=[^-]|$)", "i")
                },
                me = /HTML$/i,
                ge = /^(?:input|select|textarea|button)$/i,
                ve = /^h\d$/i,
                ye = /^[^{]+\{\s*\[native \w/,
                be = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                _e = /[+~]/,
                we = new RegExp("\\\\[\\da-fA-F]{1,6}" + ie + "?|\\\\([^\\r\\n\\f])", "g"),
                xe = function (e, t) {
                    var n = "0x" + e.slice(1) - 65536;
                    return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320))
                },
                ke = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                Ce = function (e, t) {
                    return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
                },
                Se = function () {
                    N()
                },
                Te = h(function (e) {
                    return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
                }, {
                    dir: "parentNode",
                    next: "legend"
                });
            try {
                Z.apply(J = ee.call(R.childNodes), R.childNodes), J[R.childNodes.length].nodeType
            } catch (Ee) {
                Z = {
                    apply: J.length ? function (e, t) {
                        K.apply(e, ee.call(t))
                    } : function (e, t) {
                        for (var n = e.length, i = 0; e[n++] = t[i++];);
                        e.length = n - 1
                    }
                }
            }
            for (w in x = t.support = {}, S = t.isXML = function (e) {
                    var t = e.namespaceURI,
                        n = (e.ownerDocument || e).documentElement;
                    return !me.test(t || n && n.nodeName || "HTML")
                }, N = t.setDocument = function (e) {
                    var t, n, i = e ? e.ownerDocument || e : R;
                    return i != L && 9 === i.nodeType && i.documentElement ? (P = (L = i).documentElement, I = !S(L), R != L && (n = L.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Se, !1) : n.attachEvent && n.attachEvent("onunload", Se)), x.scope = r(function (e) {
                        return P.appendChild(e).appendChild(L.createElement("div")), "undefined" != typeof e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
                    }), x.attributes = r(function (e) {
                        return e.className = "i", !e.getAttribute("className")
                    }), x.getElementsByTagName = r(function (e) {
                        return e.appendChild(L.createComment("")), !e.getElementsByTagName("*").length
                    }), x.getElementsByClassName = ye.test(L.getElementsByClassName), x.getById = r(function (e) {
                        return P.appendChild(e).id = H, !L.getElementsByName || !L.getElementsByName(H).length
                    }), x.getById ? (k.filter.ID = function (e) {
                        var t = e.replace(we, xe);
                        return function (e) {
                            return e.getAttribute("id") === t
                        }
                    }, k.find.ID = function (e, t) {
                        if ("undefined" != typeof t.getElementById && I) {
                            var n = t.getElementById(e);
                            return n ? [n] : []
                        }
                    }) : (k.filter.ID = function (e) {
                        var t = e.replace(we, xe);
                        return function (e) {
                            var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                            return n && n.value === t
                        }
                    }, k.find.ID = function (e, t) {
                        if ("undefined" != typeof t.getElementById && I) {
                            var n, i, r, o = t.getElementById(e);
                            if (o) {
                                if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
                                for (r = t.getElementsByName(e), i = 0; o = r[i++];)
                                    if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
                            }
                            return []
                        }
                    }), k.find.TAG = x.getElementsByTagName ? function (e, t) {
                        return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : x.qsa ? t.querySelectorAll(e) : void 0
                    } : function (e, t) {
                        var n, i = [],
                            r = 0,
                            o = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; n = o[r++];) 1 === n.nodeType && i.push(n);
                            return i
                        }
                        return o
                    }, k.find.CLASS = x.getElementsByClassName && function (e, t) {
                        if ("undefined" != typeof t.getElementsByClassName && I) return t.getElementsByClassName(e)
                    }, O = [], q = [], (x.qsa = ye.test(L.querySelectorAll)) && (r(function (e) {
                        var t;
                        P.appendChild(e).innerHTML = "<a id='" + H + "'></a><select id='" + H + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + ie + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || q.push("\\[" + ie + "*(?:value|" + ne + ")"), e.querySelectorAll("[id~=" + H + "-]").length || q.push("~="), (t = L.createElement("input")).setAttribute("name", ""), e.appendChild(t), e.querySelectorAll("[name='']").length || q.push("\\[" + ie + "*name" + ie + "*=" + ie + "*(?:''|\"\")"), e.querySelectorAll(":checked").length || q.push(":checked"), e.querySelectorAll("a#" + H + "+*").length || q.push(".#.+[+~]"), e.querySelectorAll("\\\f"), q.push("[\\r\\n\\f]")
                    }), r(function (e) {
                        e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                        var t = L.createElement("input");
                        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && q.push("name" + ie + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && q.push(":enabled", ":disabled"), P.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && q.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), q.push(",.*:")
                    })), (x.matchesSelector = ye.test(M = P.matches || P.webkitMatchesSelector || P.mozMatchesSelector || P.oMatchesSelector || P.msMatchesSelector)) && r(function (e) {
                        x.disconnectedMatch = M.call(e, "*"), M.call(e, "[s!='']:x"), O.push("!=", ae)
                    }), q = q.length && new RegExp(q.join("|")), O = O.length && new RegExp(O.join("|")), t = ye.test(P.compareDocumentPosition), z = t || ye.test(P.contains) ? function (e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                            i = t && t.parentNode;
                        return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                    } : function (e, t) {
                        if (t)
                            for (; t = t.parentNode;)
                                if (t === e) return !0;
                        return !1
                    }, X = t ? function (e, t) {
                        if (e === t) return D = !0, 0;
                        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !x.sortDetached && t.compareDocumentPosition(e) === n ? e == L || e.ownerDocument == R && z(R, e) ? -1 : t == L || t.ownerDocument == R && z(R, t) ? 1 : j ? te(j, e) - te(j, t) : 0 : 4 & n ? -1 : 1)
                    } : function (e, t) {
                        if (e === t) return D = !0, 0;
                        var n, i = 0,
                            r = e.parentNode,
                            o = t.parentNode,
                            s = [e],
                            l = [t];
                        if (!r || !o) return e == L ? -1 : t == L ? 1 : r ? -1 : o ? 1 : j ? te(j, e) - te(j, t) : 0;
                        if (r === o) return a(e, t);
                        for (n = e; n = n.parentNode;) s.unshift(n);
                        for (n = t; n = n.parentNode;) l.unshift(n);
                        for (; s[i] === l[i];) i++;
                        return i ? a(s[i], l[i]) : s[i] == R ? -1 : l[i] == R ? 1 : 0
                    }, L) : L
                }, t.matches = function (e, n) {
                    return t(e, null, null, n)
                }, t.matchesSelector = function (e, n) {
                    if (N(e), x.matchesSelector && I && !Q[n + " "] && (!O || !O.test(n)) && (!q || !q.test(n))) try {
                        var i = M.call(e, n);
                        if (i || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                    } catch (Ee) {
                        Q(n, !0)
                    }
                    return t(n, L, null, [e]).length > 0
                }, t.contains = function (e, t) {
                    return (e.ownerDocument || e) != L && N(e), z(e, t)
                }, t.attr = function (e, t) {
                    (e.ownerDocument || e) != L && N(e);
                    var n = k.attrHandle[t.toLowerCase()],
                        i = n && Y.call(k.attrHandle, t.toLowerCase()) ? n(e, t, !I) : undefined;
                    return i !== undefined ? i : x.attributes || !I ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
                }, t.escape = function (e) {
                    return (e + "").replace(ke, Ce)
                }, t.error = function (e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }, t.uniqueSort = function (e) {
                    var t, n = [],
                        i = 0,
                        r = 0;
                    if (D = !x.detectDuplicates, j = !x.sortStable && e.slice(0), e.sort(X), D) {
                        for (; t = e[r++];) t === e[r] && (i = n.push(r));
                        for (; i--;) e.splice(n[i], 1)
                    }
                    return j = null, e
                }, C = t.getText = function (e) {
                    var t, n = "",
                        i = 0,
                        r = e.nodeType;
                    if (r) {
                        if (1 === r || 9 === r || 11 === r) {
                            if ("string" == typeof e.textContent) return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling) n += C(e)
                        } else if (3 === r || 4 === r) return e.nodeValue
                    } else
                        for (; t = e[i++];) n += C(t);
                    return n
                }, (k = t.selectors = {
                    cacheLength: 50,
                    createPseudo: i,
                    match: he,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function (e) {
                            return e[1] = e[1].replace(we, xe), e[3] = (e[3] || e[4] || e[5] || "").replace(we, xe), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                        },
                        CHILD: function (e) {
                            return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                        },
                        PSEUDO: function (e) {
                            var t, n = !e[6] && e[2];
                            return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && fe.test(n) && (t = T(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function (e) {
                            var t = e.replace(we, xe).toLowerCase();
                            return "*" === e ? function () {
                                return !0
                            } : function (e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function (e) {
                            var t = F[e + " "];
                            return t || (t = new RegExp("(^|" + ie + ")" + e + "(" + ie + "|$)")) && F(e, function (e) {
                                return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function (e, n, i) {
                            return function (r) {
                                var o = t.attr(r, e);
                                return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === i : "!=" === n ? o !== i : "^=" === n ? i && 0 === o.indexOf(i) : "*=" === n ? i && o.indexOf(i) > -1 : "$=" === n ? i && o.slice(-i.length) === i : "~=" === n ? (" " + o.replace(se, " ") + " ").indexOf(i) > -1 : "|=" === n && (o === i || o.slice(0, i.length + 1) === i + "-"))
                            }
                        },
                        CHILD: function (e, t, n, i, r) {
                            var o = "nth" !== e.slice(0, 3),
                                a = "last" !== e.slice(-4),
                                s = "of-type" === t;
                            return 1 === i && 0 === r ? function (e) {
                                return !!e.parentNode
                            } : function (t, n, l) {
                                var c, u, d, f, p, h, m = o !== a ? "nextSibling" : "previousSibling",
                                    g = t.parentNode,
                                    v = s && t.nodeName.toLowerCase(),
                                    y = !l && !s,
                                    b = !1;
                                if (g) {
                                    if (o) {
                                        for (; m;) {
                                            for (f = t; f = f[m];)
                                                if (s ? f.nodeName.toLowerCase() === v : 1 === f.nodeType) return !1;
                                            h = m = "only" === e && !h && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (h = [a ? g.firstChild : g.lastChild], a && y) {
                                        for (b = (p = (c = (u = (d = (f = g)[H] || (f[H] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] || [])[0] === B && c[1]) && c[2], f = p && g.childNodes[p]; f = ++p && f && f[m] || (b = p = 0) || h.pop();)
                                            if (1 === f.nodeType && ++b && f === t) {
                                                u[e] = [B, p, b];
                                                break
                                            }
                                    } else if (y && (b = p = (c = (u = (d = (f = t)[H] || (f[H] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] || [])[0] === B && c[1]), !1 === b)
                                        for (;
                                            (f = ++p && f && f[m] || (b = p = 0) || h.pop()) && ((s ? f.nodeName.toLowerCase() !== v : 1 !== f.nodeType) || !++b || (y && ((u = (d = f[H] || (f[H] = {}))[f.uniqueID] || (d[f.uniqueID] = {}))[e] = [B, b]), f !== t)););
                                    return (b -= r) === i || b % i == 0 && b / i >= 0
                                }
                            }
                        },
                        PSEUDO: function (e, n) {
                            var r, o = k.pseudos[e] || k.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                            return o[H] ? o(n) : o.length > 1 ? (r = [e, e, "", n], k.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, t) {
                                for (var i, r = o(e, n), a = r.length; a--;) e[i = te(e, r[a])] = !(t[i] = r[a])
                            }) : function (e) {
                                return o(e, 0, r)
                            }) : o
                        }
                    },
                    pseudos: {
                        not: i(function (e) {
                            var t = [],
                                n = [],
                                r = E(e.replace(le, "$1"));
                            return r[H] ? i(function (e, t, n, i) {
                                for (var o, a = r(e, null, i, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                            }) : function (e, i, o) {
                                return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
                            }
                        }),
                        has: i(function (e) {
                            return function (n) {
                                return t(e, n).length > 0
                            }
                        }),
                        contains: i(function (e) {
                            return e = e.replace(we, xe),
                                function (t) {
                                    return (t.textContent || C(t)).indexOf(e) > -1
                                }
                        }),
                        lang: i(function (e) {
                            return pe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(we, xe).toLowerCase(),
                                function (t) {
                                    var n;
                                    do {
                                        if (n = I ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                    } while ((t = t.parentNode) && 1 === t.nodeType);
                                    return !1
                                }
                        }),
                        target: function (t) {
                            var n = e.location && e.location.hash;
                            return n && n.slice(1) === t.id
                        },
                        root: function (e) {
                            return e === P
                        },
                        focus: function (e) {
                            return e === L.activeElement && (!L.hasFocus || L.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: c(!1),
                        disabled: c(!0),
                        checked: function (e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && !!e.checked || "option" === t && !!e.selected
                        },
                        selected: function (e) {
                            return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                        },
                        empty: function (e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6) return !1;
                            return !0
                        },
                        parent: function (e) {
                            return !k.pseudos.empty(e)
                        },
                        header: function (e) {
                            return ve.test(e.nodeName)
                        },
                        input: function (e) {
                            return ge.test(e.nodeName)
                        },
                        button: function (e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && "button" === e.type || "button" === t
                        },
                        text: function (e) {
                            var t;
                            return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                        },
                        first: u(function () {
                            return [0]
                        }),
                        last: u(function (e, t) {
                            return [t - 1]
                        }),
                        eq: u(function (e, t, n) {
                            return [n < 0 ? n + t : n]
                        }),
                        even: u(function (e, t) {
                            for (var n = 0; n < t; n += 2) e.push(n);
                            return e
                        }),
                        odd: u(function (e, t) {
                            for (var n = 1; n < t; n += 2) e.push(n);
                            return e
                        }),
                        lt: u(function (e, t, n) {
                            for (var i = n < 0 ? n + t : n > t ? t : n; --i >= 0;) e.push(i);
                            return e
                        }),
                        gt: u(function (e, t, n) {
                            for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                            return e
                        })
                    }
                }).pseudos.nth = k.pseudos.eq, {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) k.pseudos[w] = s(w);
            for (w in {
                    submit: !0,
                    reset: !0
                }) k.pseudos[w] = l(w);
            return f.prototype = k.filters = k.pseudos, k.setFilters = new f, T = t.tokenize = function (e, n) {
                var i, r, o, a, s, l, c, u = V[e + " "];
                if (u) return n ? 0 : u.slice(0);
                for (s = e, l = [], c = k.preFilter; s;) {
                    for (a in i && !(r = ce.exec(s)) || (r && (s = s.slice(r[0].length) || s), l.push(o = [])), i = !1, (r = ue.exec(s)) && (i = r.shift(), o.push({
                            value: i,
                            type: r[0].replace(le, " ")
                        }), s = s.slice(i.length)), k.filter) !(r = he[a].exec(s)) || c[a] && !(r = c[a](r)) || (i = r.shift(), o.push({
                        value: i,
                        type: a,
                        matches: r
                    }), s = s.slice(i.length));
                    if (!i) break
                }
                return n ? s.length : s ? t.error(e) : V(e, l).slice(0)
            }, E = t.compile = function (e, t) {
                var n, i = [],
                    r = [],
                    o = U[e + " "];
                if (!o) {
                    for (t || (t = T(e)), n = t.length; n--;)(o = b(t[n]))[H] ? i.push(o) : r.push(o);
                    (o = U(e, _(r, i))).selector = e
                }
                return o
            }, $ = t.select = function (e, t, n, i) {
                var r, o, a, s, l, c = "function" == typeof e && e,
                    u = !i && T(e = c.selector || e);
                if (n = n || [], 1 === u.length) {
                    if ((o = u[0] = u[0].slice(0)).length > 2 && "ID" === (a = o[0]).type && 9 === t.nodeType && I && k.relative[o[1].type]) {
                        if (!(t = (k.find.ID(a.matches[0].replace(we, xe), t) || [])[0])) return n;
                        c && (t = t.parentNode), e = e.slice(o.shift().value.length)
                    }
                    for (r = he.needsContext.test(e) ? 0 : o.length; r-- && (a = o[r], !k.relative[s = a.type]);)
                        if ((l = k.find[s]) && (i = l(a.matches[0].replace(we, xe), _e.test(o[0].type) && d(t.parentNode) || t))) {
                            if (o.splice(r, 1), !(e = i.length && p(o))) return Z.apply(n, i), n;
                            break
                        }
                }
                return (c || E(e, u))(i, t, !I, n, !t || _e.test(e) && d(t.parentNode) || t), n
            }, x.sortStable = H.split("").sort(X).join("") === H, x.detectDuplicates = !!D, N(), x.sortDetached = r(function (e) {
                return 1 & e.compareDocumentPosition(L.createElement("fieldset"))
            }), r(function (e) {
                return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
            }) || o("type|href|height|width", function (e, t, n) {
                if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
            }), x.attributes && r(function (e) {
                return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
            }) || o("value", function (e, t, n) {
                if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
            }), r(function (e) {
                return null == e.getAttribute("disabled")
            }) || o(ne, function (e, t, n) {
                var i;
                if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }), t
        }(e);
    Ce.find = Se, Ce.expr = Se.selectors, Ce.expr[":"] = Ce.expr.pseudos, Ce.uniqueSort = Ce.unique = Se.uniqueSort, Ce.text = Se.getText, Ce.isXMLDoc = Se.isXML, Ce.contains = Se.contains, Ce.escapeSelector = Se.escape;
    var Te = function (e, t, n) {
            for (var i = [], r = n !== undefined;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (r && Ce(e).is(n)) break;
                    i.push(e)
                } return i
        },
        Ee = function (e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        $e = Ce.expr.match.needsContext,
        Ae = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    Ce.filter = function (e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? Ce.find.matchesSelector(i, e) ? [i] : [] : Ce.find.matches(e, Ce.grep(t, function (e) {
            return 1 === e.nodeType
        }))
    }, Ce.fn.extend({
        find: function (e) {
            var t, n, i = this.length,
                r = this;
            if ("string" != typeof e) return this.pushStack(Ce(e).filter(function () {
                for (t = 0; t < i; t++)
                    if (Ce.contains(r[t], this)) return !0
            }));
            for (n = this.pushStack([]), t = 0; t < i; t++) Ce.find(e, r[t], n);
            return i > 1 ? Ce.uniqueSort(n) : n
        },
        filter: function (e) {
            return this.pushStack(a(this, e || [], !1))
        },
        not: function (e) {
            return this.pushStack(a(this, e || [], !0))
        },
        is: function (e) {
            return !!a(this, "string" == typeof e && $e.test(e) ? Ce(e) : e || [], !1).length
        }
    });
    var je, De = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (Ce.fn.init = function (e, t, n) {
        var i, r;
        if (!e) return this;
        if (n = n || je, "string" == typeof e) {
            if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : De.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (i[1]) {
                if (t = t instanceof Ce ? t[0] : t, Ce.merge(this, Ce.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : we, !0)), Ae.test(i[1]) && Ce.isPlainObject(t))
                    for (i in t) be(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                return this
            }
            return (r = we.getElementById(i[2])) && (this[0] = r, this.length = 1), this
        }
        return e.nodeType ? (this[0] = e, this.length = 1, this) : be(e) ? n.ready !== undefined ? n.ready(e) : e(Ce) : Ce.makeArray(e, this)
    }).prototype = Ce.fn, je = Ce(we);
    var Ne = /^(?:parents|prev(?:Until|All))/,
        Le = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    Ce.fn.extend({
        has: function (e) {
            var t = Ce(e, this),
                n = t.length;
            return this.filter(function () {
                for (var e = 0; e < n; e++)
                    if (Ce.contains(this, t[e])) return !0
            })
        },
        closest: function (e, t) {
            var n, i = 0,
                r = this.length,
                o = [],
                a = "string" != typeof e && Ce(e);
            if (!$e.test(e))
                for (; i < r; i++)
                    for (n = this[i]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && Ce.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        } return this.pushStack(o.length > 1 ? Ce.uniqueSort(o) : o)
        },
        index: function (e) {
            return e ? "string" == typeof e ? fe.call(Ce(e), this[0]) : fe.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function (e, t) {
            return this.pushStack(Ce.uniqueSort(Ce.merge(this.get(), Ce(e, t))))
        },
        addBack: function (e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), Ce.each({
        parent: function (e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function (e) {
            return Te(e, "parentNode")
        },
        parentsUntil: function (e, t, n) {
            return Te(e, "parentNode", n)
        },
        next: function (e) {
            return s(e, "nextSibling")
        },
        prev: function (e) {
            return s(e, "previousSibling")
        },
        nextAll: function (e) {
            return Te(e, "nextSibling")
        },
        prevAll: function (e) {
            return Te(e, "previousSibling")
        },
        nextUntil: function (e, t, n) {
            return Te(e, "nextSibling", n)
        },
        prevUntil: function (e, t, n) {
            return Te(e, "previousSibling", n)
        },
        siblings: function (e) {
            return Ee((e.parentNode || {}).firstChild, e)
        },
        children: function (e) {
            return Ee(e.firstChild)
        },
        contents: function (e) {
            return null != e.contentDocument && le(e.contentDocument) ? e.contentDocument : (o(e, "template") && (e = e.content || e), Ce.merge([], e.childNodes))
        }
    }, function (e, t) {
        Ce.fn[e] = function (n, i) {
            var r = Ce.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = Ce.filter(i, r)), this.length > 1 && (Le[e] || Ce.uniqueSort(r), Ne.test(e) && r.reverse()), this.pushStack(r)
        }
    });
    var Pe = /[^\x20\t\r\n\f]+/g;
    Ce.Callbacks = function (e) {
        e = "string" == typeof e ? l(e) : Ce.extend({}, e);
        var t, n, r, o, a = [],
            s = [],
            c = -1,
            u = function () {
                for (o = o || e.once, r = t = !0; s.length; c = -1)
                    for (n = s.shift(); ++c < a.length;) !1 === a[c].apply(n[0], n[1]) && e.stopOnFalse && (c = a.length, n = !1);
                e.memory || (n = !1), t = !1, o && (a = n ? [] : "")
            },
            d = {
                add: function () {
                    return a && (n && !t && (c = a.length - 1, s.push(n)), function r(t) {
                        Ce.each(t, function (t, n) {
                            be(n) ? e.unique && d.has(n) || a.push(n) : n && n.length && "string" !== i(n) && r(n)
                        })
                    }(arguments), n && !t && u()), this
                },
                remove: function () {
                    return Ce.each(arguments, function (e, t) {
                        for (var n;
                            (n = Ce.inArray(t, a, n)) > -1;) a.splice(n, 1), n <= c && c--
                    }), this
                },
                has: function (e) {
                    return e ? Ce.inArray(e, a) > -1 : a.length > 0
                },
                empty: function () {
                    return a && (a = []), this
                },
                disable: function () {
                    return o = s = [], a = n = "", this
                },
                disabled: function () {
                    return !a
                },
                lock: function () {
                    return o = s = [], n || t || (a = n = ""), this
                },
                locked: function () {
                    return !!o
                },
                fireWith: function (e, n) {
                    return o || (n = [e, (n = n || []).slice ? n.slice() : n], s.push(n), t || u()), this
                },
                fire: function () {
                    return d.fireWith(this, arguments), this
                },
                fired: function () {
                    return !!r
                }
            };
        return d
    }, Ce.extend({
        Deferred: function (t) {
            var n = [
                    ["notify", "progress", Ce.Callbacks("memory"), Ce.Callbacks("memory"), 2],
                    ["resolve", "done", Ce.Callbacks("once memory"), Ce.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", Ce.Callbacks("once memory"), Ce.Callbacks("once memory"), 1, "rejected"]
                ],
                i = "pending",
                r = {
                    state: function () {
                        return i
                    },
                    always: function () {
                        return o.done(arguments).fail(arguments), this
                    },
                    "catch": function (e) {
                        return r.then(null, e)
                    },
                    pipe: function () {
                        var e = arguments;
                        return Ce.Deferred(function (t) {
                            Ce.each(n, function (n, i) {
                                var r = be(e[i[4]]) && e[i[4]];
                                o[i[1]](function () {
                                    var e = r && r.apply(this, arguments);
                                    e && be(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[i[0] + "With"](this, r ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    then: function (t, i, r) {
                        function o(t, n, i, r) {
                            return function () {
                                var s = this,
                                    l = arguments,
                                    d = function () {
                                        var e, d;
                                        if (!(t < a)) {
                                            if ((e = i.apply(s, l)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                            d = e && ("object" == typeof e || "function" == typeof e) && e.then, be(d) ? r ? d.call(e, o(a, n, c, r), o(a, n, u, r)) : (a++, d.call(e, o(a, n, c, r), o(a, n, u, r), o(a, n, c, n.notifyWith))) : (i !== c && (s = undefined, l = [e]), (r || n.resolveWith)(s, l))
                                        }
                                    },
                                    f = r ? d : function () {
                                        try {
                                            d()
                                        } catch (e) {
                                            Ce.Deferred.exceptionHook && Ce.Deferred.exceptionHook(e, f.stackTrace), t + 1 >= a && (i !== u && (s = undefined, l = [e]), n.rejectWith(s, l))
                                        }
                                    };
                                t ? f() : (Ce.Deferred.getStackHook && (f.stackTrace = Ce.Deferred.getStackHook()), e.setTimeout(f))
                            }
                        }
                        var a = 0;
                        return Ce.Deferred(function (e) {
                            n[0][3].add(o(0, e, be(r) ? r : c, e.notifyWith)), n[1][3].add(o(0, e, be(t) ? t : c)), n[2][3].add(o(0, e, be(i) ? i : u))
                        }).promise()
                    },
                    promise: function (e) {
                        return null != e ? Ce.extend(e, r) : r
                    }
                },
                o = {};
            return Ce.each(n, function (e, t) {
                var a = t[2],
                    s = t[5];
                r[t[1]] = a.add, s && a.add(function () {
                    i = s
                }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock), a.add(t[3].fire), o[t[0]] = function () {
                    return o[t[0] + "With"](this === o ? undefined : this, arguments), this
                }, o[t[0] + "With"] = a.fireWith
            }), r.promise(o), t && t.call(o, o), o
        },
        when: function (e) {
            var t = arguments.length,
                n = t,
                i = Array(n),
                r = ce.call(arguments),
                o = Ce.Deferred(),
                a = function (e) {
                    return function (n) {
                        i[e] = this, r[e] = arguments.length > 1 ? ce.call(arguments) : n, --t || o.resolveWith(i, r)
                    }
                };
            if (t <= 1 && (d(e, o.done(a(n)).resolve, o.reject, !t), "pending" === o.state() || be(r[n] && r[n].then))) return o.then();
            for (; n--;) d(r[n], a(n), o.reject);
            return o.promise()
        }
    });
    var Ie = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    Ce.Deferred.exceptionHook = function (t, n) {
        e.console && e.console.warn && t && Ie.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }, Ce.readyException = function (t) {
        e.setTimeout(function () {
            throw t
        })
    };
    var qe = Ce.Deferred();
    Ce.fn.ready = function (e) {
        return qe.then(e)["catch"](function (e) {
            Ce.readyException(e)
        }), this
    }, Ce.extend({
        isReady: !1,
        readyWait: 1,
        ready: function (e) {
            (!0 === e ? --Ce.readyWait : Ce.isReady) || (Ce.isReady = !0, !0 !== e && --Ce.readyWait > 0 || qe.resolveWith(we, [Ce]))
        }
    }), Ce.ready.then = qe.then, "complete" === we.readyState || "loading" !== we.readyState && !we.documentElement.doScroll ? e.setTimeout(Ce.ready) : (we.addEventListener("DOMContentLoaded", f), e.addEventListener("load", f));
    var Oe = function (e, t, n, r, o, a, s) {
            var l = 0,
                c = e.length,
                u = null == n;
            if ("object" === i(n))
                for (l in o = !0, n) Oe(e, t, l, n[l], !0, a, s);
            else if (r !== undefined && (o = !0, be(r) || (s = !0), u && (s ? (t.call(e, r), t = null) : (u = t, t = function (e, t, n) {
                    return u.call(Ce(e), n)
                })), t))
                for (; l < c; l++) t(e[l], n, s ? r : r.call(e[l], l, t(e[l], n)));
            return o ? e : u ? t.call(e) : c ? t(e[0], n) : a
        },
        Me = /^-ms-/,
        ze = /-([a-z])/g,
        He = function (e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
        };
    m.uid = 1, m.prototype = {
        cache: function (e) {
            var t = e[this.expando];
            return t || (t = {}, He(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function (e, t, n) {
            var i, r = this.cache(e);
            if ("string" == typeof t) r[h(t)] = n;
            else
                for (i in t) r[h(i)] = t[i];
            return r
        },
        get: function (e, t) {
            return t === undefined ? this.cache(e) : e[this.expando] && e[this.expando][h(t)]
        },
        access: function (e, t, n) {
            return t === undefined || t && "string" == typeof t && n === undefined ? this.get(e, t) : (this.set(e, t, n), n !== undefined ? n : t)
        },
        remove: function (e, t) {
            var n, i = e[this.expando];
            if (i !== undefined) {
                if (t !== undefined) {
                    n = (t = Array.isArray(t) ? t.map(h) : (t = h(t)) in i ? [t] : t.match(Pe) || []).length;
                    for (; n--;) delete i[t[n]]
                }(t === undefined || Ce.isEmptyObject(i)) && (e.nodeType ? e[this.expando] = undefined : delete e[this.expando])
            }
        },
        hasData: function (e) {
            var t = e[this.expando];
            return t !== undefined && !Ce.isEmptyObject(t)
        }
    };
    var Re = new m,
        Be = new m,
        We = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Fe = /[A-Z]/g;
    Ce.extend({
        hasData: function (e) {
            return Be.hasData(e) || Re.hasData(e)
        },
        data: function (e, t, n) {
            return Be.access(e, t, n)
        },
        removeData: function (e, t) {
            Be.remove(e, t)
        },
        _data: function (e, t, n) {
            return Re.access(e, t, n)
        },
        _removeData: function (e, t) {
            Re.remove(e, t)
        }
    }), Ce.fn.extend({
        data: function (e, t) {
            var n, i, r, o = this[0],
                a = o && o.attributes;
            if (e === undefined) {
                if (this.length && (r = Be.get(o), 1 === o.nodeType && !Re.get(o, "hasDataAttrs"))) {
                    for (n = a.length; n--;) a[n] && 0 === (i = a[n].name).indexOf("data-") && (i = h(i.slice(5)), v(o, i, r[i]));
                    Re.set(o, "hasDataAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function () {
                Be.set(this, e)
            }) : Oe(this, function (t) {
                var n;
                if (o && t === undefined) return (n = Be.get(o, e)) !== undefined ? n : (n = v(o, e)) !== undefined ? n : void 0;
                this.each(function () {
                    Be.set(this, e, t)
                })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function (e) {
            return this.each(function () {
                Be.remove(this, e)
            })
        }
    }), Ce.extend({
        queue: function (e, t, n) {
            var i;
            if (e) return t = (t || "fx") + "queue", i = Re.get(e, t), n && (!i || Array.isArray(n) ? i = Re.access(e, t, Ce.makeArray(n)) : i.push(n)), i || []
        },
        dequeue: function (e, t) {
            t = t || "fx";
            var n = Ce.queue(e, t),
                i = n.length,
                r = n.shift(),
                o = Ce._queueHooks(e, t),
                a = function () {
                    Ce.dequeue(e, t)
                };
            "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, a, o)), !i && o && o.empty.fire()
        },
        _queueHooks: function (e, t) {
            var n = t + "queueHooks";
            return Re.get(e, n) || Re.access(e, n, {
                empty: Ce.Callbacks("once memory").add(function () {
                    Re.remove(e, [t + "queue", n])
                })
            })
        }
    }), Ce.fn.extend({
        queue: function (e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? Ce.queue(this[0], e) : t === undefined ? this : this.each(function () {
                var n = Ce.queue(this, e, t);
                Ce._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && Ce.dequeue(this, e)
            })
        },
        dequeue: function (e) {
            return this.each(function () {
                Ce.dequeue(this, e)
            })
        },
        clearQueue: function (e) {
            return this.queue(e || "fx", [])
        },
        promise: function (e, t) {
            var n, i = 1,
                r = Ce.Deferred(),
                o = this,
                a = this.length,
                s = function () {
                    --i || r.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = undefined), e = e || "fx"; a--;)(n = Re.get(o[a], e + "queueHooks")) && n.empty && (i++, n.empty.add(s));
            return s(), r.promise(t)
        }
    });
    var Ve = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        Ue = new RegExp("^(?:([+-])=|)(" + Ve + ")([a-z%]*)$", "i"),
        Qe = ["Top", "Right", "Bottom", "Left"],
        Xe = we.documentElement,
        Ye = function (e) {
            return Ce.contains(e.ownerDocument, e)
        },
        Je = {
            composed: !0
        };
    Xe.getRootNode && (Ye = function (e) {
        return Ce.contains(e.ownerDocument, e) || e.getRootNode(Je) === e.ownerDocument
    });
    var Ge = function (e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && Ye(e) && "none" === Ce.css(e, "display")
        },
        Ke = {};
    Ce.fn.extend({
        show: function () {
            return _(this, !0)
        },
        hide: function () {
            return _(this)
        },
        toggle: function (e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
                Ge(this) ? Ce(this).show() : Ce(this).hide()
            })
        }
    });
    var Ze, et, tt = /^(?:checkbox|radio)$/i,
        nt = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
        it = /^$|^module$|\/(?:java|ecma)script/i;
    Ze = we.createDocumentFragment().appendChild(we.createElement("div")), (et = we.createElement("input")).setAttribute("type", "radio"), et.setAttribute("checked", "checked"), et.setAttribute("name", "t"), Ze.appendChild(et), ye.checkClone = Ze.cloneNode(!0).cloneNode(!0).lastChild.checked, Ze.innerHTML = "<textarea>x</textarea>", ye.noCloneChecked = !!Ze.cloneNode(!0).lastChild.defaultValue, Ze.innerHTML = "<option></option>", ye.option = !!Ze.lastChild;
    var rt = {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    rt.tbody = rt.tfoot = rt.colgroup = rt.caption = rt.thead,
        rt.th = rt.td, ye.option || (rt.optgroup = rt.option = [1, "<select multiple='multiple'>", "</select>"]);
    var ot = /<|&#?\w+;/,
        at = /^key/,
        st = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        lt = /^([^.]*)(?:\.(.+)|)/;
    Ce.event = {
        global: {},
        add: function (e, t, n, i, r) {
            var o, a, s, l, c, u, d, f, p, h, m, g = Re.get(e);
            if (He(e))
                for (n.handler && (n = (o = n).handler, r = o.selector), r && Ce.find.matchesSelector(Xe, r), n.guid || (n.guid = Ce.guid++), (l = g.events) || (l = g.events = Object.create(null)), (a = g.handle) || (a = g.handle = function (t) {
                        return void 0 !== Ce && Ce.event.triggered !== t.type ? Ce.event.dispatch.apply(e, arguments) : undefined
                    }), c = (t = (t || "").match(Pe) || [""]).length; c--;) p = m = (s = lt.exec(t[c]) || [])[1], h = (s[2] || "").split(".").sort(), p && (d = Ce.event.special[p] || {}, p = (r ? d.delegateType : d.bindType) || p, d = Ce.event.special[p] || {}, u = Ce.extend({
                    type: p,
                    origType: m,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && Ce.expr.match.needsContext.test(r),
                    namespace: h.join(".")
                }, o), (f = l[p]) || ((f = l[p] = []).delegateCount = 0, d.setup && !1 !== d.setup.call(e, i, h, a) || e.addEventListener && e.addEventListener(p, a)), d.add && (d.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)), r ? f.splice(f.delegateCount++, 0, u) : f.push(u), Ce.event.global[p] = !0)
        },
        remove: function (e, t, n, i, r) {
            var o, a, s, l, c, u, d, f, p, h, m, g = Re.hasData(e) && Re.get(e);
            if (g && (l = g.events)) {
                for (c = (t = (t || "").match(Pe) || [""]).length; c--;)
                    if (p = m = (s = lt.exec(t[c]) || [])[1], h = (s[2] || "").split(".").sort(), p) {
                        for (d = Ce.event.special[p] || {}, f = l[p = (i ? d.delegateType : d.bindType) || p] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = f.length; o--;) u = f[o], !r && m !== u.origType || n && n.guid !== u.guid || s && !s.test(u.namespace) || i && i !== u.selector && ("**" !== i || !u.selector) || (f.splice(o, 1), u.selector && f.delegateCount--, d.remove && d.remove.call(e, u));
                        a && !f.length && (d.teardown && !1 !== d.teardown.call(e, h, g.handle) || Ce.removeEvent(e, p, g.handle), delete l[p])
                    } else
                        for (p in l) Ce.event.remove(e, p + t[c], n, i, !0);
                Ce.isEmptyObject(l) && Re.remove(e, "handle events")
            }
        },
        dispatch: function (e) {
            var t, n, i, r, o, a, s = new Array(arguments.length),
                l = Ce.event.fix(e),
                c = (Re.get(this, "events") || Object.create(null))[l.type] || [],
                u = Ce.event.special[l.type] || {};
            for (s[0] = l, t = 1; t < arguments.length; t++) s[t] = arguments[t];
            if (l.delegateTarget = this, !u.preDispatch || !1 !== u.preDispatch.call(this, l)) {
                for (a = Ce.event.handlers.call(this, l, c), t = 0;
                    (r = a[t++]) && !l.isPropagationStopped();)
                    for (l.currentTarget = r.elem, n = 0;
                        (o = r.handlers[n++]) && !l.isImmediatePropagationStopped();) l.rnamespace && !1 !== o.namespace && !l.rnamespace.test(o.namespace) || (l.handleObj = o, l.data = o.data, (i = ((Ce.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, s)) !== undefined && !1 === (l.result = i) && (l.preventDefault(), l.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, l), l.result
            }
        },
        handlers: function (e, t) {
            var n, i, r, o, a, s = [],
                l = t.delegateCount,
                c = e.target;
            if (l && c.nodeType && !("click" === e.type && e.button >= 1))
                for (; c !== this; c = c.parentNode || this)
                    if (1 === c.nodeType && ("click" !== e.type || !0 !== c.disabled)) {
                        for (o = [], a = {}, n = 0; n < l; n++) a[r = (i = t[n]).selector + " "] === undefined && (a[r] = i.needsContext ? Ce(r, this).index(c) > -1 : Ce.find(r, this, null, [c]).length), a[r] && o.push(i);
                        o.length && s.push({
                            elem: c,
                            handlers: o
                        })
                    } return c = this, l < t.length && s.push({
                elem: c,
                handlers: t.slice(l)
            }), s
        },
        addProp: function (e, t) {
            Object.defineProperty(Ce.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: be(t) ? function () {
                    if (this.originalEvent) return t(this.originalEvent)
                } : function () {
                    if (this.originalEvent) return this.originalEvent[e]
                },
                set: function (t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function (e) {
            return e[Ce.expando] ? e : new Ce.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function (e) {
                    var t = this || e;
                    return tt.test(t.type) && t.click && o(t, "input") && A(t, "click", C), !1
                },
                trigger: function (e) {
                    var t = this || e;
                    return tt.test(t.type) && t.click && o(t, "input") && A(t, "click"), !0
                },
                _default: function (e) {
                    var t = e.target;
                    return tt.test(t.type) && t.click && o(t, "input") && Re.get(t, "click") || o(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function (e) {
                    e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    }, Ce.removeEvent = function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }, Ce.Event = function (e, t) {
        if (!(this instanceof Ce.Event)) return new Ce.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && !1 === e.returnValue ? C : S, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && Ce.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[Ce.expando] = !0
    }, Ce.Event.prototype = {
        constructor: Ce.Event,
        isDefaultPrevented: S,
        isPropagationStopped: S,
        isImmediatePropagationStopped: S,
        isSimulated: !1,
        preventDefault: function () {
            var e = this.originalEvent;
            this.isDefaultPrevented = C, e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function () {
            var e = this.originalEvent;
            this.isPropagationStopped = C, e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function () {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = C, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, Ce.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function (e) {
            var t = e.button;
            return null == e.which && at.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && t !== undefined && st.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, Ce.event.addProp), Ce.each({
        focus: "focusin",
        blur: "focusout"
    }, function (e, t) {
        Ce.event.special[e] = {
            setup: function () {
                return A(this, e, T), !1
            },
            trigger: function () {
                return A(this, e), !0
            },
            delegateType: t
        }
    }), Ce.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (e, t) {
        Ce.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function (e) {
                var n, i = this,
                    r = e.relatedTarget,
                    o = e.handleObj;
                return r && (r === i || Ce.contains(i, r)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), Ce.fn.extend({
        on: function (e, t, n, i) {
            return $(this, e, t, n, i)
        },
        one: function (e, t, n, i) {
            return $(this, e, t, n, i, 1)
        },
        off: function (e, t, n) {
            var i, r;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, Ce(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (r in e) this.off(r, t, e[r]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = undefined), !1 === n && (n = S), this.each(function () {
                Ce.event.remove(this, e, n, t)
            })
        }
    });
    var ct = /<script|<style|<link/i,
        ut = /checked\s*(?:[^=]|=\s*.checked.)/i,
        dt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    Ce.extend({
        htmlPrefilter: function (e) {
            return e
        },
        clone: function (e, t, n) {
            var i, r, o, a, s = e.cloneNode(!0),
                l = Ye(e);
            if (!(ye.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Ce.isXMLDoc(e)))
                for (a = w(s), i = 0, r = (o = w(e)).length; i < r; i++) P(o[i], a[i]);
            if (t)
                if (n)
                    for (o = o || w(e), a = a || w(s), i = 0, r = o.length; i < r; i++) L(o[i], a[i]);
                else L(e, s);
            return (a = w(s, "script")).length > 0 && x(a, !l && w(e, "script")), s
        },
        cleanData: function (e) {
            for (var t, n, i, r = Ce.event.special, o = 0;
                (n = e[o]) !== undefined; o++)
                if (He(n)) {
                    if (t = n[Re.expando]) {
                        if (t.events)
                            for (i in t.events) r[i] ? Ce.event.remove(n, i) : Ce.removeEvent(n, i, t.handle);
                        n[Re.expando] = undefined
                    }
                    n[Be.expando] && (n[Be.expando] = undefined)
                }
        }
    }), Ce.fn.extend({
        detach: function (e) {
            return q(this, e, !0)
        },
        remove: function (e) {
            return q(this, e)
        },
        text: function (e) {
            return Oe(this, function (e) {
                return e === undefined ? Ce.text(this) : this.empty().each(function () {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function () {
            return I(this, arguments, function (e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || j(this, e).appendChild(e)
            })
        },
        prepend: function () {
            return I(this, arguments, function (e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = j(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function () {
            return I(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function () {
            return I(this, arguments, function (e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function () {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (Ce.cleanData(w(e, !1)), e.textContent = "");
            return this
        },
        clone: function (e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function () {
                return Ce.clone(this, e, t)
            })
        },
        html: function (e) {
            return Oe(this, function (e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (e === undefined && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !ct.test(e) && !rt[(nt.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = Ce.htmlPrefilter(e);
                    try {
                        for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (Ce.cleanData(w(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (r) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function () {
            var e = [];
            return I(this, arguments, function (t) {
                var n = this.parentNode;
                Ce.inArray(this, e) < 0 && (Ce.cleanData(w(this)), n && n.replaceChild(t, this))
            }, e)
        }
    }), Ce.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, t) {
        Ce.fn[e] = function (e) {
            for (var n, i = [], r = Ce(e), o = r.length - 1, a = 0; a <= o; a++) n = a === o ? this : this.clone(!0), Ce(r[a])[t](n), de.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var ft = new RegExp("^(" + Ve + ")(?!px)[a-z%]+$", "i"),
        pt = function (t) {
            var n = t.ownerDocument.defaultView;
            return n && n.opener || (n = e), n.getComputedStyle(t)
        },
        ht = function (e, t, n) {
            var i, r, o = {};
            for (r in t) o[r] = e.style[r], e.style[r] = t[r];
            for (r in i = n.call(e), t) e.style[r] = o[r];
            return i
        },
        mt = new RegExp(Qe.join("|"), "i");
    ! function () {
        function t() {
            if (u) {
                c.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", Xe.appendChild(c).appendChild(u);
                var t = e.getComputedStyle(u);
                i = "1%" !== t.top, l = 12 === n(t.marginLeft), u.style.right = "60%", a = 36 === n(t.right), r = 36 === n(t.width), u.style.position = "absolute", o = 12 === n(u.offsetWidth / 3), Xe.removeChild(c), u = null
            }
        }

        function n(e) {
            return Math.round(parseFloat(e))
        }
        var i, r, o, a, s, l, c = we.createElement("div"),
            u = we.createElement("div");
        u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", ye.clearCloneStyle = "content-box" === u.style.backgroundClip, Ce.extend(ye, {
            boxSizingReliable: function () {
                return t(), r
            },
            pixelBoxStyles: function () {
                return t(), a
            },
            pixelPosition: function () {
                return t(), i
            },
            reliableMarginLeft: function () {
                return t(), l
            },
            scrollboxSize: function () {
                return t(), o
            },
            reliableTrDimensions: function () {
                var t, n, i, r;
                return null == s && (t = we.createElement("table"), n = we.createElement("tr"), i = we.createElement("div"), t.style.cssText = "position:absolute;left:-11111px", n.style.height = "1px", i.style.height = "9px", Xe.appendChild(t).appendChild(n).appendChild(i), r = e.getComputedStyle(n), s = parseInt(r.height) > 3, Xe.removeChild(t)), s
            }
        }))
    }();
    var gt = ["Webkit", "Moz", "ms"],
        vt = we.createElement("div").style,
        yt = {},
        bt = /^(none|table(?!-c[ea]).+)/,
        _t = /^--/,
        wt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        xt = {
            letterSpacing: "0",
            fontWeight: "400"
        };
    Ce.extend({
        cssHooks: {
            opacity: {
                get: function (e, t) {
                    if (t) {
                        var n = O(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function (e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, a, s = h(t),
                    l = _t.test(t),
                    c = e.style;
                if (l || (t = H(s)), a = Ce.cssHooks[t] || Ce.cssHooks[s], n === undefined) return a && "get" in a && (r = a.get(e, !1, i)) !== undefined ? r : c[t];
                "string" === (o = typeof n) && (r = Ue.exec(n)) && r[1] && (n = y(e, t, r), o = "number"), null != n && n == n && ("number" !== o || l || (n += r && r[3] || (Ce.cssNumber[s] ? "" : "px")), ye.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (c[t] = "inherit"), a && "set" in a && (n = a.set(e, n, i)) === undefined || (l ? c.setProperty(t, n) : c[t] = n))
            }
        },
        css: function (e, t, n, i) {
            var r, o, a, s = h(t);
            return _t.test(t) || (t = H(s)), (a = Ce.cssHooks[t] || Ce.cssHooks[s]) && "get" in a && (r = a.get(e, !0, n)), r === undefined && (r = O(e, t, i)), "normal" === r && t in xt && (r = xt[t]), "" === n || n ? (o = parseFloat(r), !0 === n || isFinite(o) ? o || 0 : r) : r
        }
    }), Ce.each(["height", "width"], function (e, t) {
        Ce.cssHooks[t] = {
            get: function (e, n, i) {
                if (n) return !bt.test(Ce.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? W(e, t, i) : ht(e, wt, function () {
                    return W(e, t, i)
                })
            },
            set: function (e, n, i) {
                var r, o = pt(e),
                    a = !ye.scrollboxSize() && "absolute" === o.position,
                    s = (a || i) && "border-box" === Ce.css(e, "boxSizing", !1, o),
                    l = i ? B(e, t, i, s, o) : 0;
                return s && a && (l -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - B(e, t, "border", !1, o) - .5)), l && (r = Ue.exec(n)) && "px" !== (r[3] || "px") && (e.style[t] = n, n = Ce.css(e, t)), R(e, n, l)
            }
        }
    }), Ce.cssHooks.marginLeft = M(ye.reliableMarginLeft, function (e, t) {
        if (t) return (parseFloat(O(e, "marginLeft")) || e.getBoundingClientRect().left - ht(e, {
            marginLeft: 0
        }, function () {
            return e.getBoundingClientRect().left
        })) + "px"
    }), Ce.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function (e, t) {
        Ce.cssHooks[e + t] = {
            expand: function (n) {
                for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) r[e + Qe[i] + t] = o[i] || o[i - 2] || o[0];
                return r
            }
        }, "margin" !== e && (Ce.cssHooks[e + t].set = R)
    }), Ce.fn.extend({
        css: function (e, t) {
            return Oe(this, function (e, t, n) {
                var i, r, o = {},
                    a = 0;
                if (Array.isArray(t)) {
                    for (i = pt(e), r = t.length; a < r; a++) o[t[a]] = Ce.css(e, t[a], !1, i);
                    return o
                }
                return n !== undefined ? Ce.style(e, t, n) : Ce.css(e, t)
            }, e, t, arguments.length > 1)
        }
    }), Ce.Tween = F, F.prototype = {
        constructor: F,
        init: function (e, t, n, i, r, o) {
            this.elem = e, this.prop = n, this.easing = r || Ce.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (Ce.cssNumber[n] ? "" : "px")
        },
        cur: function () {
            var e = F.propHooks[this.prop];
            return e && e.get ? e.get(this) : F.propHooks._default.get(this)
        },
        run: function (e) {
            var t, n = F.propHooks[this.prop];
            return this.options.duration ? this.pos = t = Ce.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : F.propHooks._default.set(this), this
        }
    }, F.prototype.init.prototype = F.prototype, F.propHooks = {
        _default: {
            get: function (e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = Ce.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function (e) {
                Ce.fx.step[e.prop] ? Ce.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !Ce.cssHooks[e.prop] && null == e.elem.style[H(e.prop)] ? e.elem[e.prop] = e.now : Ce.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, F.propHooks.scrollTop = F.propHooks.scrollLeft = {
        set: function (e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, Ce.easing = {
        linear: function (e) {
            return e
        },
        swing: function (e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, Ce.fx = F.prototype.init, Ce.fx.step = {};
    var kt, Ct, St = /^(?:toggle|show|hide)$/,
        Tt = /queueHooks$/;
    Ce.Animation = Ce.extend(G, {
            tweeners: {
                "*": [function (e, t) {
                    var n = this.createTween(e, t);
                    return y(n.elem, e, Ue.exec(t), n), n
                }]
            },
            tweener: function (e, t) {
                be(e) ? (t = e, e = ["*"]) : e = e.match(Pe);
                for (var n, i = 0, r = e.length; i < r; i++) n = e[i], G.tweeners[n] = G.tweeners[n] || [], G.tweeners[n].unshift(t)
            },
            prefilters: [Y],
            prefilter: function (e, t) {
                t ? G.prefilters.unshift(e) : G.prefilters.push(e)
            }
        }), Ce.speed = function (e, t, n) {
            var i = e && "object" == typeof e ? Ce.extend({}, e) : {
                complete: n || !n && t || be(e) && e,
                duration: e,
                easing: n && t || t && !be(t) && t
            };
            return Ce.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in Ce.fx.speeds ? i.duration = Ce.fx.speeds[i.duration] : i.duration = Ce.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function () {
                be(i.old) && i.old.call(this), i.queue && Ce.dequeue(this, i.queue)
            }, i
        }, Ce.fn.extend({
            fadeTo: function (e, t, n, i) {
                return this.filter(Ge).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, i)
            },
            animate: function (e, t, n, i) {
                var r = Ce.isEmptyObject(e),
                    o = Ce.speed(t, n, i),
                    a = function () {
                        var t = G(this, Ce.extend({}, e), o);
                        (r || Re.get(this, "finish")) && t.stop(!0)
                    };
                return a.finish = a, r || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
            },
            stop: function (e, t, n) {
                var i = function (e) {
                    var t = e.stop;
                    delete e.stop, t(n)
                };
                return "string" != typeof e && (n = t, t = e, e = undefined), t && this.queue(e || "fx", []), this.each(function () {
                    var t = !0,
                        r = null != e && e + "queueHooks",
                        o = Ce.timers,
                        a = Re.get(this);
                    if (r) a[r] && a[r].stop && i(a[r]);
                    else
                        for (r in a) a[r] && a[r].stop && Tt.test(r) && i(a[r]);
                    for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
                    !t && n || Ce.dequeue(this, e)
                })
            },
            finish: function (e) {
                return !1 !== e && (e = e || "fx"), this.each(function () {
                    var t, n = Re.get(this),
                        i = n[e + "queue"],
                        r = n[e + "queueHooks"],
                        o = Ce.timers,
                        a = i ? i.length : 0;
                    for (n.finish = !0, Ce.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                    for (t = 0; t < a; t++) i[t] && i[t].finish && i[t].finish.call(this);
                    delete n.finish
                })
            }
        }), Ce.each(["toggle", "show", "hide"], function (e, t) {
            var n = Ce.fn[t];
            Ce.fn[t] = function (e, i, r) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(Q(t, !0), e, i, r)
            }
        }), Ce.each({
            slideDown: Q("show"),
            slideUp: Q("hide"),
            slideToggle: Q("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function (e, t) {
            Ce.fn[e] = function (e, n, i) {
                return this.animate(t, e, n, i)
            }
        }), Ce.timers = [], Ce.fx.tick = function () {
            var e, t = 0,
                n = Ce.timers;
            for (kt = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
            n.length || Ce.fx.stop(), kt = undefined
        }, Ce.fx.timer = function (e) {
            Ce.timers.push(e), Ce.fx.start()
        }, Ce.fx.interval = 13, Ce.fx.start = function () {
            Ct || (Ct = !0, V())
        }, Ce.fx.stop = function () {
            Ct = null
        }, Ce.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, Ce.fn.delay = function (t, n) {
            return t = Ce.fx && Ce.fx.speeds[t] || t, n = n || "fx", this.queue(n, function (n, i) {
                var r = e.setTimeout(n, t);
                i.stop = function () {
                    e.clearTimeout(r)
                }
            })
        },
        function () {
            var e = we.createElement("input"),
                t = we.createElement("select").appendChild(we.createElement("option"));
            e.type = "checkbox", ye.checkOn = "" !== e.value, ye.optSelected = t.selected, (e = we.createElement("input")).value = "t", e.type = "radio", ye.radioValue = "t" === e.value
        }();
    var Et, $t = Ce.expr.attrHandle;
    Ce.fn.extend({
        attr: function (e, t) {
            return Oe(this, Ce.attr, e, t, arguments.length > 1)
        },
        removeAttr: function (e) {
            return this.each(function () {
                Ce.removeAttr(this, e)
            })
        }
    }), Ce.extend({
        attr: function (e, t, n) {
            var i, r, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? Ce.prop(e, t, n) : (1 === o && Ce.isXMLDoc(e) || (r = Ce.attrHooks[t.toLowerCase()] || (Ce.expr.match.bool.test(t) ? Et : undefined)), n !== undefined ? null === n ? void Ce.removeAttr(e, t) : r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : (e.setAttribute(t, n + ""), n) : r && "get" in r && null !== (i = r.get(e, t)) ? i : null == (i = Ce.find.attr(e, t)) ? undefined : i)
        },
        attrHooks: {
            type: {
                set: function (e, t) {
                    if (!ye.radioValue && "radio" === t && o(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function (e, t) {
            var n, i = 0,
                r = t && t.match(Pe);
            if (r && 1 === e.nodeType)
                for (; n = r[i++];) e.removeAttribute(n)
        }
    }), Et = {
        set: function (e, t, n) {
            return !1 === t ? Ce.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, Ce.each(Ce.expr.match.bool.source.match(/\w+/g), function (e, t) {
        var n = $t[t] || Ce.find.attr;
        $t[t] = function (e, t, i) {
            var r, o, a = t.toLowerCase();
            return i || (o = $t[a], $t[a] = r, r = null != n(e, t, i) ? a : null, $t[a] = o), r
        }
    });
    var At = /^(?:input|select|textarea|button)$/i,
        jt = /^(?:a|area)$/i;
    Ce.fn.extend({
        prop: function (e, t) {
            return Oe(this, Ce.prop, e, t, arguments.length > 1)
        },
        removeProp: function (e) {
            return this.each(function () {
                delete this[Ce.propFix[e] || e]
            })
        }
    }), Ce.extend({
        prop: function (e, t, n) {
            var i, r, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return 1 === o && Ce.isXMLDoc(e) || (t = Ce.propFix[t] || t, r = Ce.propHooks[t]), n !== undefined ? r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function (e) {
                    var t = Ce.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : At.test(e.nodeName) || jt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), ye.optSelected || (Ce.propHooks.selected = {
        get: function (e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        },
        set: function (e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), Ce.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        Ce.propFix[this.toLowerCase()] = this
    }), Ce.fn.extend({
        addClass: function (e) {
            var t, n, i, r, o, a, s, l = 0;
            if (be(e)) return this.each(function (t) {
                Ce(this).addClass(e.call(this, t, Z(this)))
            });
            if ((t = ee(e)).length)
                for (; n = this[l++];)
                    if (r = Z(n), i = 1 === n.nodeType && " " + K(r) + " ") {
                        for (a = 0; o = t[a++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        r !== (s = K(i)) && n.setAttribute("class", s)
                    } return this
        },
        removeClass: function (e) {
            var t, n, i, r, o, a, s, l = 0;
            if (be(e)) return this.each(function (t) {
                Ce(this).removeClass(e.call(this, t, Z(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ((t = ee(e)).length)
                for (; n = this[l++];)
                    if (r = Z(n), i = 1 === n.nodeType && " " + K(r) + " ") {
                        for (a = 0; o = t[a++];)
                            for (; i.indexOf(" " + o + " ") > -1;) i = i.replace(" " + o + " ", " ");
                        r !== (s = K(i)) && n.setAttribute("class", s)
                    } return this
        },
        toggleClass: function (e, t) {
            var n = typeof e,
                i = "string" === n || Array.isArray(e);
            return "boolean" == typeof t && i ? t ? this.addClass(e) : this.removeClass(e) : be(e) ? this.each(function (n) {
                Ce(this).toggleClass(e.call(this, n, Z(this), t), t)
            }) : this.each(function () {
                var t, r, o, a;
                if (i)
                    for (r = 0, o = Ce(this), a = ee(e); t = a[r++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                else e !== undefined && "boolean" !== n || ((t = Z(this)) && Re.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Re.get(this, "__className__") || ""))
            })
        },
        hasClass: function (e) {
            var t, n, i = 0;
            for (t = " " + e + " "; n = this[i++];)
                if (1 === n.nodeType && (" " + K(Z(n)) + " ").indexOf(t) > -1) return !0;
            return !1
        }
    });
    var Dt = /\r/g;
    Ce.fn.extend({
        val: function (e) {
            var t, n, i, r = this[0];
            return arguments.length ? (i = be(e), this.each(function (n) {
                var r;
                1 === this.nodeType && (null == (r = i ? e.call(this, n, Ce(this).val()) : e) ? r = "" : "number" == typeof r ? r += "" : Array.isArray(r) && (r = Ce.map(r, function (e) {
                    return null == e ? "" : e + ""
                })), (t = Ce.valHooks[this.type] || Ce.valHooks[this.nodeName.toLowerCase()]) && "set" in t && t.set(this, r, "value") !== undefined || (this.value = r))
            })) : r ? (t = Ce.valHooks[r.type] || Ce.valHooks[r.nodeName.toLowerCase()]) && "get" in t && (n = t.get(r, "value")) !== undefined ? n : "string" == typeof (n = r.value) ? n.replace(Dt, "") : null == n ? "" : n : void 0
        }
    }), Ce.extend({
        valHooks: {
            option: {
                get: function (e) {
                    var t = Ce.find.attr(e, "value");
                    return null != t ? t : K(Ce.text(e))
                }
            },
            select: {
                get: function (e) {
                    var t, n, i, r = e.options,
                        a = e.selectedIndex,
                        s = "select-one" === e.type,
                        l = s ? null : [],
                        c = s ? a + 1 : r.length;
                    for (i = a < 0 ? c : s ? a : 0; i < c; i++)
                        if (((n = r[i]).selected || i === a) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
                            if (t = Ce(n).val(), s) return t;
                            l.push(t)
                        } return l
                },
                set: function (e, t) {
                    for (var n, i, r = e.options, o = Ce.makeArray(t), a = r.length; a--;)((i = r[a]).selected = Ce.inArray(Ce.valHooks.option.get(i), o) > -1) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        }
    }), Ce.each(["radio", "checkbox"], function () {
        Ce.valHooks[this] = {
            set: function (e, t) {
                if (Array.isArray(t)) return e.checked = Ce.inArray(Ce(e).val(), t) > -1
            }
        }, ye.checkOn || (Ce.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), ye.focusin = "onfocusin" in e;
    var Nt = /^(?:focusinfocus|focusoutblur)$/,
        Lt = function (e) {
            e.stopPropagation()
        };
    Ce.extend(Ce.event, {
        trigger: function (t, n, i, r) {
            var o, a, s, l, c, u, d, f, p = [i || we],
                h = me.call(t, "type") ? t.type : t,
                m = me.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = f = s = i = i || we, 3 !== i.nodeType && 8 !== i.nodeType && !Nt.test(h + Ce.event.triggered) && (h.indexOf(".") > -1 && (h = (m = h.split(".")).shift(), m.sort()), c = h.indexOf(":") < 0 && "on" + h, (t = t[Ce.expando] ? t : new Ce.Event(h, "object" == typeof t && t)).isTrigger = r ? 2 : 3, t.namespace = m.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = undefined, t.target || (t.target = i), n = null == n ? [t] : Ce.makeArray(n, [t]), d = Ce.event.special[h] || {}, r || !d.trigger || !1 !== d.trigger.apply(i, n))) {
                if (!r && !d.noBubble && !_e(i)) {
                    for (l = d.delegateType || h, Nt.test(l + h) || (a = a.parentNode); a; a = a.parentNode) p.push(a), s = a;
                    s === (i.ownerDocument || we) && p.push(s.defaultView || s.parentWindow || e)
                }
                for (o = 0;
                    (a = p[o++]) && !t.isPropagationStopped();) f = a, t.type = o > 1 ? l : d.bindType || h, (u = (Re.get(a, "events") || Object.create(null))[t.type] && Re.get(a, "handle")) && u.apply(a, n), (u = c && a[c]) && u.apply && He(a) && (t.result = u.apply(a, n), !1 === t.result && t.preventDefault());
                return t.type = h, r || t.isDefaultPrevented() || d._default && !1 !== d._default.apply(p.pop(), n) || !He(i) || c && be(i[h]) && !_e(i) && ((s = i[c]) && (i[c] = null), Ce.event.triggered = h, t.isPropagationStopped() && f.addEventListener(h, Lt), i[h](), t.isPropagationStopped() && f.removeEventListener(h, Lt), Ce.event.triggered = undefined, s && (i[c] = s)), t.result
            }
        },
        simulate: function (e, t, n) {
            var i = Ce.extend(new Ce.Event, n, {
                type: e,
                isSimulated: !0
            });
            Ce.event.trigger(i, null, t)
        }
    }), Ce.fn.extend({
        trigger: function (e, t) {
            return this.each(function () {
                Ce.event.trigger(e, t, this)
            })
        },
        triggerHandler: function (e, t) {
            var n = this[0];
            if (n) return Ce.event.trigger(e, t, n, !0)
        }
    }), ye.focusin || Ce.each({
        focus: "focusin",
        blur: "focusout"
    }, function (e, t) {
        var n = function (e) {
            Ce.event.simulate(t, e.target, Ce.event.fix(e))
        };
        Ce.event.special[t] = {
            setup: function () {
                var i = this.ownerDocument || this.document || this,
                    r = Re.access(i, t);
                r || i.addEventListener(e, n, !0), Re.access(i, t, (r || 0) + 1)
            },
            teardown: function () {
                var i = this.ownerDocument || this.document || this,
                    r = Re.access(i, t) - 1;
                r ? Re.access(i, t, r) : (i.removeEventListener(e, n, !0), Re.remove(i, t))
            }
        }
    });
    var Pt = e.location,
        It = {
            guid: Date.now()
        },
        qt = /\?/;
    Ce.parseXML = function (t) {
        var n;
        if (!t || "string" != typeof t) return null;
        try {
            n = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (i) {
            n = undefined
        }
        return n && !n.getElementsByTagName("parsererror").length || Ce.error("Invalid XML: " + t), n
    };
    var Ot = /\[\]$/,
        Mt = /\r?\n/g,
        zt = /^(?:submit|button|image|reset|file)$/i,
        Ht = /^(?:input|select|textarea|keygen)/i;
    Ce.param = function (e, t) {
        var n, i = [],
            r = function (e, t) {
                var n = be(t) ? t() : t;
                i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
            };
        if (null == e) return "";
        if (Array.isArray(e) || e.jquery && !Ce.isPlainObject(e)) Ce.each(e, function () {
            r(this.name, this.value)
        });
        else
            for (n in e) te(n, e[n], t, r);
        return i.join("&")
    }, Ce.fn.extend({
        serialize: function () {
            return Ce.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                var e = Ce.prop(this, "elements");
                return e ? Ce.makeArray(e) : this
            }).filter(function () {
                var e = this.type;
                return this.name && !Ce(this).is(":disabled") && Ht.test(this.nodeName) && !zt.test(e) && (this.checked || !tt.test(e))
            }).map(function (e, t) {
                var n = Ce(this).val();
                return null == n ? null : Array.isArray(n) ? Ce.map(n, function (e) {
                    return {
                        name: t.name,
                        value: e.replace(Mt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Mt, "\r\n")
                }
            }).get()
        }
    });
    var Rt = /%20/g,
        Bt = /#.*$/,
        Wt = /([?&])_=[^&]*/,
        Ft = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Vt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Ut = /^(?:GET|HEAD)$/,
        Qt = /^\/\//,
        Xt = {},
        Yt = {},
        Jt = "*/".concat("*"),
        Gt = we.createElement("a");
    Gt.href = Pt.href, Ce.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Pt.href,
            type: "GET",
            isLocal: Vt.test(Pt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Jt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": Ce.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function (e, t) {
            return t ? re(re(e, Ce.ajaxSettings), t) : re(Ce.ajaxSettings, e)
        },
        ajaxPrefilter: ne(Xt),
        ajaxTransport: ne(Yt),
        ajax: function (t, n) {
            function i(t, n, i, s) {
                var c, f, p, _, w, x = n;
                u || (u = !0, l && e.clearTimeout(l), r = undefined, a = s || "", k.readyState = t > 0 ? 4 : 0, c = t >= 200 && t < 300 || 304 === t, i && (_ = oe(h, k, i)), !c && Ce.inArray("script", h.dataTypes) > -1 && (h.converters["text script"] = function () {}), _ = ae(h, _, k, c), c ? (h.ifModified && ((w = k.getResponseHeader("Last-Modified")) && (Ce.lastModified[o] = w), (w = k.getResponseHeader("etag")) && (Ce.etag[o] = w)), 204 === t || "HEAD" === h.type ? x = "nocontent" : 304 === t ? x = "notmodified" : (x = _.state, f = _.data, c = !(p = _.error))) : (p = x, !t && x || (x = "error", t < 0 && (t = 0))), k.status = t, k.statusText = (n || x) + "", c ? v.resolveWith(m, [f, x, k]) : v.rejectWith(m, [k, x, p]), k.statusCode(b), b = undefined, d && g.trigger(c ? "ajaxSuccess" : "ajaxError", [k, h, c ? f : p]), y.fireWith(m, [k, x]), d && (g.trigger("ajaxComplete", [k, h]), --Ce.active || Ce.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t, t = undefined), n = n || {};
            var r, o, a, s, l, c, u, d, f, p, h = Ce.ajaxSetup({}, n),
                m = h.context || h,
                g = h.context && (m.nodeType || m.jquery) ? Ce(m) : Ce.event,
                v = Ce.Deferred(),
                y = Ce.Callbacks("once memory"),
                b = h.statusCode || {},
                _ = {},
                w = {},
                x = "canceled",
                k = {
                    readyState: 0,
                    getResponseHeader: function (e) {
                        var t;
                        if (u) {
                            if (!s)
                                for (s = {}; t = Ft.exec(a);) s[t[1].toLowerCase() + " "] = (s[t[1].toLowerCase() + " "] || []).concat(t[2]);
                            t = s[e.toLowerCase() + " "]
                        }
                        return null == t ? null : t.join(", ")
                    },
                    getAllResponseHeaders: function () {
                        return u ? a : null
                    },
                    setRequestHeader: function (e, t) {
                        return null == u && (e = w[e.toLowerCase()] = w[e.toLowerCase()] || e, _[e] = t), this
                    },
                    overrideMimeType: function (e) {
                        return null == u && (h.mimeType = e), this
                    },
                    statusCode: function (e) {
                        var t;
                        if (e)
                            if (u) k.always(e[k.status]);
                            else
                                for (t in e) b[t] = [b[t], e[t]];
                        return this
                    },
                    abort: function (e) {
                        var t = e || x;
                        return r && r.abort(t), i(0, t), this
                    }
                };
            if (v.promise(k), h.url = ((t || h.url || Pt.href) + "").replace(Qt, Pt.protocol + "//"), h.type = n.method || n.type || h.method || h.type, h.dataTypes = (h.dataType || "*").toLowerCase().match(Pe) || [""], null == h.crossDomain) {
                c = we.createElement("a");
                try {
                    c.href = h.url, c.href = c.href, h.crossDomain = Gt.protocol + "//" + Gt.host != c.protocol + "//" + c.host
                } catch (C) {
                    h.crossDomain = !0
                }
            }
            if (h.data && h.processData && "string" != typeof h.data && (h.data = Ce.param(h.data, h.traditional)), ie(Xt, h, n, k), u) return k;
            for (f in (d = Ce.event && h.global) && 0 == Ce.active++ && Ce.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !Ut.test(h.type), o = h.url.replace(Bt, ""), h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(Rt, "+")) : (p = h.url.slice(o.length), h.data && (h.processData || "string" == typeof h.data) && (o += (qt.test(o) ? "&" : "?") + h.data, delete h.data), !1 === h.cache && (o = o.replace(Wt, "$1"), p = (qt.test(o) ? "&" : "?") + "_=" + It.guid++ + p), h.url = o + p), h.ifModified && (Ce.lastModified[o] && k.setRequestHeader("If-Modified-Since", Ce.lastModified[o]), Ce.etag[o] && k.setRequestHeader("If-None-Match", Ce.etag[o])), (h.data && h.hasContent && !1 !== h.contentType || n.contentType) && k.setRequestHeader("Content-Type", h.contentType), k.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Jt + "; q=0.01" : "") : h.accepts["*"]), h.headers) k.setRequestHeader(f, h.headers[f]);
            if (h.beforeSend && (!1 === h.beforeSend.call(m, k, h) || u)) return k.abort();
            if (x = "abort", y.add(h.complete), k.done(h.success), k.fail(h.error), r = ie(Yt, h, n, k)) {
                if (k.readyState = 1, d && g.trigger("ajaxSend", [k, h]), u) return k;
                h.async && h.timeout > 0 && (l = e.setTimeout(function () {
                    k.abort("timeout")
                }, h.timeout));
                try {
                    u = !1, r.send(_, i)
                } catch (C) {
                    if (u) throw C;
                    i(-1, C)
                }
            } else i(-1, "No Transport");
            return k
        },
        getJSON: function (e, t, n) {
            return Ce.get(e, t, n, "json")
        },
        getScript: function (e, t) {
            return Ce.get(e, undefined, t, "script")
        }
    }), Ce.each(["get", "post"], function (e, t) {
        Ce[t] = function (e, n, i, r) {
            return be(n) && (r = r || i, i = n, n = undefined), Ce.ajax(Ce.extend({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: i
            }, Ce.isPlainObject(e) && e))
        }
    }), Ce.ajaxPrefilter(function (e) {
        var t;
        for (t in e.headers) "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
    }), Ce._evalUrl = function (e, t, n) {
        return Ce.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function () {}
            },
            dataFilter: function (e) {
                Ce.globalEval(e, t, n)
            }
        })
    }, Ce.fn.extend({
        wrapAll: function (e) {
            var t;
            return this[0] && (be(e) && (e = e.call(this[0])), t = Ce(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                return e
            }).append(this)), this
        },
        wrapInner: function (e) {
            return be(e) ? this.each(function (t) {
                Ce(this).wrapInner(e.call(this, t))
            }) : this.each(function () {
                var t = Ce(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function (e) {
            var t = be(e);
            return this.each(function (n) {
                Ce(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function (e) {
            return this.parent(e).not("body").each(function () {
                Ce(this).replaceWith(this.childNodes)
            }), this
        }
    }), Ce.expr.pseudos.hidden = function (e) {
        return !Ce.expr.pseudos.visible(e)
    }, Ce.expr.pseudos.visible = function (e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }, Ce.ajaxSettings.xhr = function () {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    };
    var Kt = {
            0: 200,
            1223: 204
        },
        Zt = Ce.ajaxSettings.xhr();
    ye.cors = !!Zt && "withCredentials" in Zt, ye.ajax = Zt = !!Zt, Ce.ajaxTransport(function (t) {
        var n, i;
        if (ye.cors || Zt && !t.crossDomain) return {
            send: function (r, o) {
                var a, s = t.xhr();
                if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                    for (a in t.xhrFields) s[a] = t.xhrFields[a];
                for (a in t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest"), r) s.setRequestHeader(a, r[a]);
                n = function (e) {
                    return function () {
                        n && (n = i = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null, "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(Kt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                            binary: s.response
                        } : {
                            text: s.responseText
                        }, s.getAllResponseHeaders()))
                    }
                }, s.onload = n(), i = s.onerror = s.ontimeout = n("error"), s.onabort !== undefined ? s.onabort = i : s.onreadystatechange = function () {
                    4 === s.readyState && e.setTimeout(function () {
                        n && i()
                    })
                }, n = n("abort");
                try {
                    s.send(t.hasContent && t.data || null)
                } catch (l) {
                    if (n) throw l
                }
            },
            abort: function () {
                n && n()
            }
        }
    }), Ce.ajaxPrefilter(function (e) {
        e.crossDomain && (e.contents.script = !1)
    }), Ce.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function (e) {
                return Ce.globalEval(e), e
            }
        }
    }), Ce.ajaxPrefilter("script", function (e) {
        e.cache === undefined && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), Ce.ajaxTransport("script", function (e) {
        var t, n;
        if (e.crossDomain || e.scriptAttrs) return {
            send: function (i, r) {
                t = Ce("<script>").attr(e.scriptAttrs || {}).prop({
                    charset: e.scriptCharset,
                    src: e.url
                }).on("load error", n = function (e) {
                    t.remove(), n = null, e && r("error" === e.type ? 404 : 200, e.type)
                }), we.head.appendChild(t[0])
            },
            abort: function () {
                n && n()
            }
        }
    });
    var en, tn = [],
        nn = /(=)\?(?=&|$)|\?\?/;
    Ce.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function () {
            var e = tn.pop() || Ce.expando + "_" + It.guid++;
            return this[e] = !0, e
        }
    }), Ce.ajaxPrefilter("json jsonp", function (t, n, i) {
        var r, o, a, s = !1 !== t.jsonp && (nn.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && nn.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0]) return r = t.jsonpCallback = be(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(nn, "$1" + r) : !1 !== t.jsonp && (t.url += (qt.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function () {
            return a || Ce.error(r + " was not called"), a[0]
        }, t.dataTypes[0] = "json", o = e[r], e[r] = function () {
            a = arguments
        }, i.always(function () {
            o === undefined ? Ce(e).removeProp(r) : e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, tn.push(r)), a && be(o) && o(a[0]), a = o = undefined
        }), "script"
    }), ye.createHTMLDocument = ((en = we.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === en.childNodes.length), Ce.parseHTML = function (e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (ye.createHTMLDocument ? ((i = (t = we.implementation.createHTMLDocument("")).createElement("base")).href = we.location.href, t.head.appendChild(i)) : t = we), o = !n && [], (r = Ae.exec(e)) ? [t.createElement(r[1])] : (r = k([e], t, o), o && o.length && Ce(o).remove(), Ce.merge([], r.childNodes)));
        var i, r, o
    }, Ce.fn.load = function (e, t, n) {
        var i, r, o, a = this,
            s = e.indexOf(" ");
        return s > -1 && (i = K(e.slice(s)), e = e.slice(0, s)), be(t) ? (n = t, t = undefined) : t && "object" == typeof t && (r = "POST"), a.length > 0 && Ce.ajax({
            url: e,
            type: r || "GET",
            dataType: "html",
            data: t
        }).done(function (e) {
            o = arguments, a.html(i ? Ce("<div>").append(Ce.parseHTML(e)).find(i) : e)
        }).always(n && function (e, t) {
            a.each(function () {
                n.apply(this, o || [e.responseText, t, e])
            })
        }), this
    }, Ce.expr.pseudos.animated = function (e) {
        return Ce.grep(Ce.timers, function (t) {
            return e === t.elem
        }).length
    }, Ce.offset = {
        setOffset: function (e, t, n) {
            var i, r, o, a, s, l, c = Ce.css(e, "position"),
                u = Ce(e),
                d = {};
            "static" === c && (e.style.position = "relative"), s = u.offset(), o = Ce.css(e, "top"), l = Ce.css(e, "left"), ("absolute" === c || "fixed" === c) && (o + l).indexOf("auto") > -1 ? (a = (i = u.position()).top, r = i.left) : (a = parseFloat(o) || 0, r = parseFloat(l) || 0), be(t) && (t = t.call(e, n, Ce.extend({}, s))), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + r), "using" in t ? t.using.call(e, d) : ("number" == typeof d.top && (d.top += "px"), "number" == typeof d.left && (d.left += "px"), u.css(d))
        }
    }, Ce.fn.extend({
        offset: function (e) {
            if (arguments.length) return e === undefined ? this : this.each(function (t) {
                Ce.offset.setOffset(this, e, t)
            });
            var t, n, i = this[0];
            return i ? i.getClientRects().length ? (t = i.getBoundingClientRect(), n = i.ownerDocument.defaultView, {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function () {
            if (this[0]) {
                var e, t, n, i = this[0],
                    r = {
                        top: 0,
                        left: 0
                    };
                if ("fixed" === Ce.css(i, "position")) t = i.getBoundingClientRect();
                else {
                    for (t = this.offset(), n = i.ownerDocument, e = i.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === Ce.css(e, "position");) e = e.parentNode;
                    e && e !== i && 1 === e.nodeType && ((r = Ce(e).offset()).top += Ce.css(e, "borderTopWidth", !0), r.left += Ce.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - r.top - Ce.css(i, "marginTop", !0),
                    left: t.left - r.left - Ce.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function () {
            return this.map(function () {
                for (var e = this.offsetParent; e && "static" === Ce.css(e, "position");) e = e.offsetParent;
                return e || Xe
            })
        }
    }), Ce.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function (e, t) {
        var n = "pageYOffset" === t;
        Ce.fn[e] = function (i) {
            return Oe(this, function (e, i, r) {
                var o;
                if (_e(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), r === undefined) return o ? o[t] : e[i];
                o ? o.scrollTo(n ? o.pageXOffset : r, n ? r : o.pageYOffset) : e[i] = r
            }, e, i, arguments.length)
        }
    }), Ce.each(["top", "left"], function (e, t) {
        Ce.cssHooks[t] = M(ye.pixelPosition, function (e, n) {
            if (n) return n = O(e, t), ft.test(n) ? Ce(e).position()[t] + "px" : n
        })
    }), Ce.each({
        Height: "height",
        Width: "width"
    }, function (e, t) {
        Ce.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function (n, i) {
            Ce.fn[i] = function (r, o) {
                var a = arguments.length && (n || "boolean" != typeof r),
                    s = n || (!0 === r || !0 === o ? "margin" : "border");
                return Oe(this, function (t, n, r) {
                    var o;
                    return _e(t) ? 0 === i.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : r === undefined ? Ce.css(t, n, s) : Ce.style(t, n, r, s)
                }, t, a ? r : undefined, a)
            }
        })
    }), Ce.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
        Ce.fn[t] = function (e) {
            return this.on(t, e)
        }
    }), Ce.fn.extend({
        bind: function (e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function (e, t) {
            return this.off(e, null, t)
        },
        delegate: function (e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function (e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        },
        hover: function (e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), Ce.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (e, t) {
        Ce.fn[t] = function (e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    });
    var rn = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    Ce.proxy = function (e, t) {
        var n, i, r;
        return "string" == typeof t && (n = e[t], t = e, e = n), be(e) ? (i = ce.call(arguments, 2), (r = function () {
            return e.apply(t || this, i.concat(ce.call(arguments)))
        }).guid = e.guid = e.guid || Ce.guid++, r) : undefined
    }, Ce.holdReady = function (e) {
        e ? Ce.readyWait++ : Ce.ready(!0)
    }, Ce.isArray = Array.isArray, Ce.parseJSON = JSON.parse, Ce.nodeName = o, Ce.isFunction = be, Ce.isWindow = _e, Ce.camelCase = h, Ce.type = i, Ce.now = Date.now, Ce.isNumeric = function (e) {
        var t = Ce.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }, Ce.trim = function (e) {
        return null == e ? "" : (e + "").replace(rn, "")
    }, "function" == typeof define && define.amd && define("jquery", [], function () {
        return Ce
    });
    var on = e.jQuery,
        an = e.$;
    return Ce.noConflict = function (t) {
        return e.$ === Ce && (e.$ = an), t && e.jQuery === Ce && (e.jQuery = on), Ce
    }, void 0 === t && (e.jQuery = e.$ = Ce), Ce
}),
/*! jQuery Migrate v3.0.1 | (c) jQuery Foundation and other contributors | jquery.org/license */
void 0 === jQuery.migrateMute && (jQuery.migrateMute = !0),
    function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], window, e) : "object" == typeof module && module.exports ? module.exports = e(require("jquery"), window) : e(jQuery, window)
    }(function (e, t) {
        "use strict";

        function n(n) {
            var i = t.console;
            o[n] || (o[n] = !0, e.migrateWarnings.push(n), i && i.warn && !e.migrateMute && (i.warn("JQMIGRATE: " + n), e.migrateTrace && i.trace && i.trace()))
        }

        function i(e, t, i, r) {
            Object.defineProperty(e, t, {
                configurable: !0,
                enumerable: !0,
                get: function () {
                    return n(r), i
                },
                set: function (e) {
                    n(r), i = e
                }
            })
        }

        function r(e, t, i, r) {
            e[t] = function () {
                return n(r), i.apply(this, arguments)
            }
        }
        e.migrateVersion = "3.0.1",
            function () {
                var n = /^[12]\./;
                t.console && t.console.log && (e && !n.test(e.fn.jquery) || t.console.log("JQMIGRATE: jQuery 3.0.0+ REQUIRED"), e.migrateWarnings && t.console.log("JQMIGRATE: Migrate plugin loaded multiple times"), t.console.log("JQMIGRATE: Migrate is installed" + (e.migrateMute ? "" : " with logging active") + ", version " + e.migrateVersion))
            }();
        var o = {};
        e.migrateWarnings = [], void 0 === e.migrateTrace && (e.migrateTrace = !0), e.migrateReset = function () {
            o = {}, e.migrateWarnings.length = 0
        }, "BackCompat" === t.document.compatMode && n("jQuery is not compatible with Quirks Mode");
        var a, s = e.fn.init,
            l = e.isNumeric,
            c = e.find,
            u = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/,
            d = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g;
        for (a in e.fn.init = function (e) {
                var t = Array.prototype.slice.call(arguments);
                return "string" == typeof e && "#" === e && (n("jQuery( '#' ) is not a valid selector"), t[0] = []), s.apply(this, t)
            }, e.fn.init.prototype = e.fn, e.find = function (e) {
                var i = Array.prototype.slice.call(arguments);
                if ("string" == typeof e && u.test(e)) try {
                    t.document.querySelector(e)
                } catch (r) {
                    e = e.replace(d, function (e, t, n, i) {
                        return "[" + t + n + '"' + i + '"]'
                    });
                    try {
                        t.document.querySelector(e), n("Attribute selector with '#' must be quoted: " + i[0]), i[0] = e
                    } catch (e) {
                        n("Attribute selector with '#' was not fixed: " + i[0])
                    }
                }
                return c.apply(this, i)
            }, c) Object.prototype.hasOwnProperty.call(c, a) && (e.find[a] = c[a]);
        e.fn.size = function () {
            return n("jQuery.fn.size() is deprecated and removed; use the .length property"), this.length
        }, e.parseJSON = function () {
            return n("jQuery.parseJSON is deprecated; use JSON.parse"), JSON.parse.apply(null, arguments)
        }, e.isNumeric = function (t) {
            var i = l(t),
                r = function (t) {
                    var n = t && t.toString();
                    return !e.isArray(t) && n - parseFloat(n) + 1 >= 0
                }(t);
            return i !== r && n("jQuery.isNumeric() should not be called on constructed objects"), r
        }, r(e, "holdReady", e.holdReady, "jQuery.holdReady is deprecated"), r(e, "unique", e.uniqueSort, "jQuery.unique is deprecated; use jQuery.uniqueSort"), i(e.expr, "filters", e.expr.pseudos, "jQuery.expr.filters is deprecated; use jQuery.expr.pseudos"), i(e.expr, ":", e.expr.pseudos, "jQuery.expr[':'] is deprecated; use jQuery.expr.pseudos");
        var f = e.ajax;
        e.ajax = function () {
            var e = f.apply(this, arguments);
            return e.promise && (r(e, "success", e.done, "jQXHR.success is deprecated and removed"), r(e, "error", e.fail, "jQXHR.error is deprecated and removed"), r(e, "complete", e.always, "jQXHR.complete is deprecated and removed")), e
        };
        var p = e.fn.removeAttr,
            h = e.fn.toggleClass,
            m = /\S+/g;
        e.fn.removeAttr = function (t) {
            var i = this;
            return e.each(t.match(m), function (t, r) {
                e.expr.match.bool.test(r) && (n("jQuery.fn.removeAttr no longer sets boolean properties: " + r), i.prop(r, !1))
            }), p.apply(this, arguments)
        }, e.fn.toggleClass = function (t) {
            return void 0 !== t && "boolean" != typeof t ? h.apply(this, arguments) : (n("jQuery.fn.toggleClass( boolean ) is deprecated"), this.each(function () {
                var n = this.getAttribute && this.getAttribute("class") || "";
                n && e.data(this, "__className__", n), this.setAttribute && this.setAttribute("class", n || !1 === t ? "" : e.data(this, "__className__") || "")
            }))
        };
        var g = !1;
        e.swap && e.each(["height", "width", "reliableMarginRight"], function (t, n) {
            var i = e.cssHooks[n] && e.cssHooks[n].get;
            i && (e.cssHooks[n].get = function () {
                var e;
                return g = !0, e = i.apply(this, arguments), g = !1, e
            })
        }), e.swap = function (e, t, i, r) {
            var o, a, s = {};
            for (a in g || n("jQuery.swap() is undocumented and deprecated"), t) s[a] = e.style[a], e.style[a] = t[a];
            for (a in o = i.apply(e, r || []), t) e.style[a] = s[a];
            return o
        };
        var v = e.data;
        e.data = function (t, i, r) {
            var o;
            if (i && "object" == typeof i && 2 === arguments.length) {
                o = e.hasData(t) && v.call(this, t);
                var a = {};
                for (var s in i) s !== e.camelCase(s) ? (n("jQuery.data() always sets/gets camelCased names: " + s), o[s] = i[s]) : a[s] = i[s];
                return v.call(this, t, a), i
            }
            return i && "string" == typeof i && i !== e.camelCase(i) && (o = e.hasData(t) && v.call(this, t)) && i in o ? (n("jQuery.data() always sets/gets camelCased names: " + i), arguments.length > 2 && (o[i] = r), o[i]) : v.apply(this, arguments)
        };
        var y = e.Tween.prototype.run,
            b = function (e) {
                return e
            };
        e.Tween.prototype.run = function () {
            e.easing[this.easing].length > 1 && (n("'jQuery.easing." + this.easing.toString() + "' should use only one argument"), e.easing[this.easing] = b), y.apply(this, arguments)
        }, e.fx.interval = e.fx.interval || 13, t.requestAnimationFrame && i(e.fx, "interval", e.fx.interval, "jQuery.fx.interval is deprecated");
        var _ = e.fn.load,
            w = e.event.add,
            x = e.event.fix;
        e.event.props = [], e.event.fixHooks = {}, i(e.event.props, "concat", e.event.props.concat, "jQuery.event.props.concat() is deprecated and removed"), e.event.fix = function (t) {
            var i, r = t.type,
                o = this.fixHooks[r],
                a = e.event.props;
            if (a.length)
                for (n("jQuery.event.props are deprecated and removed: " + a.join()); a.length;) e.event.addProp(a.pop());
            if (o && !o._migrated_ && (o._migrated_ = !0, n("jQuery.event.fixHooks are deprecated and removed: " + r), (a = o.props) && a.length))
                for (; a.length;) e.event.addProp(a.pop());
            return i = x.call(this, t), o && o.filter ? o.filter(i, t) : i
        }, e.event.add = function (e, i) {
            return e === t && "load" === i && "complete" === t.document.readyState && n("jQuery(window).on('load'...) called after load event occurred"), w.apply(this, arguments)
        }, e.each(["load", "unload", "error"], function (t, i) {
            e.fn[i] = function () {
                var e = Array.prototype.slice.call(arguments, 0);
                return "load" === i && "string" == typeof e[0] ? _.apply(this, e) : (n("jQuery.fn." + i + "() is deprecated"), e.splice(0, 0, i), arguments.length ? this.on.apply(this, e) : (this.triggerHandler.apply(this, e), this))
            }
        }), e.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (t, i) {
            e.fn[i] = function (e, t) {
                return n("jQuery.fn." + i + "() event shorthand is deprecated"), arguments.length > 0 ? this.on(i, null, e, t) : this.trigger(i)
            }
        }), e(function () {
            e(t.document).triggerHandler("ready")
        }), e.event.special.ready = {
            setup: function () {
                this === t.document && n("'ready' event is deprecated")
            }
        }, e.fn.extend({
            bind: function (e, t, i) {
                return n("jQuery.fn.bind() is deprecated"), this.on(e, null, t, i)
            },
            unbind: function (e, t) {
                return n("jQuery.fn.unbind() is deprecated"), this.off(e, null, t)
            },
            delegate: function (e, t, i, r) {
                return n("jQuery.fn.delegate() is deprecated"), this.on(t, e, i, r)
            },
            undelegate: function (e, t, i) {
                return n("jQuery.fn.undelegate() is deprecated"), 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", i)
            },
            hover: function (e, t) {
                return n("jQuery.fn.hover() is deprecated"), this.on("mouseenter", e).on("mouseleave", t || e)
            }
        });
        var k = e.fn.offset;
        e.fn.offset = function () {
            var i, r = this[0],
                o = {
                    top: 0,
                    left: 0
                };
            return r && r.nodeType ? (i = (r.ownerDocument || t.document).documentElement, e.contains(i, r) ? k.apply(this, arguments) : (n("jQuery.fn.offset() requires an element connected to a document"), o)) : (n("jQuery.fn.offset() requires a valid DOM element"), o)
        };
        var C = e.param;
        e.param = function (t, i) {
            var r = e.ajaxSettings && e.ajaxSettings.traditional;
            return void 0 === i && r && (n("jQuery.param() no longer uses jQuery.ajaxSettings.traditional"), i = r), C.call(this, t, i)
        };
        var S = e.fn.andSelf || e.fn.addBack;
        e.fn.andSelf = function () {
            return n("jQuery.fn.andSelf() is deprecated and removed, use jQuery.fn.addBack()"), S.apply(this, arguments)
        };
        var T = e.Deferred,
            E = [
                ["resolve", "done", e.Callbacks("once memory"), e.Callbacks("once memory"), "resolved"],
                ["reject", "fail", e.Callbacks("once memory"), e.Callbacks("once memory"), "rejected"],
                ["notify", "progress", e.Callbacks("memory"), e.Callbacks("memory")]
            ];
        return e.Deferred = function (t) {
            var i = T(),
                r = i.promise();
            return i.pipe = r.pipe = function () {
                var t = arguments;
                return n("deferred.pipe() is deprecated"), e.Deferred(function (n) {
                    e.each(E, function (o, a) {
                        var s = e.isFunction(t[o]) && t[o];
                        i[a[1]](function () {
                            var t = s && s.apply(this, arguments);
                            t && e.isFunction(t.promise) ? t.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a[0] + "With"](this === r ? n.promise() : this, s ? [t] : arguments)
                        })
                    }), t = null
                }).promise()
            }, t && t.call(i, i), i
        }, e.Deferred.exceptionHook = T.exceptionHook, e
    }),
    function (e, t) {
        "use strict";
        var n;
        e.rails !== t && e.error("jquery-ujs has already been loaded!");
        var i = e(document);
        e.rails = n = {
            linkClickSelector: "a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]",
            buttonClickSelector: "button[data-remote]:not([form]):not(form button), button[data-confirm]:not([form]):not(form button)",
            inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]",
            formSubmitSelector: "form",
            formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])",
            disableSelector: "input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled",
            enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled",
            requiredInputSelector: "input[name][required]:not([disabled]), textarea[name][required]:not([disabled])",
            fileInputSelector: "input[name][type=file]:not([disabled])",
            linkDisableSelector: "a[data-disable-with], a[data-disable]",
            buttonDisableSelector: "button[data-remote][data-disable-with], button[data-remote][data-disable]",
            csrfToken: function () {
                return e("meta[name=csrf-token]").attr("content")
            },
            csrfParam: function () {
                return e("meta[name=csrf-param]").attr("content")
            },
            CSRFProtection: function (e) {
                var t = n.csrfToken();
                t && e.setRequestHeader("X-CSRF-Token", t)
            },
            refreshCSRFTokens: function () {
                e('form input[name="' + n.csrfParam() + '"]').val(n.csrfToken())
            },
            fire: function (t, n, i) {
                var r = e.Event(n);
                return t.trigger(r, i), !1 !== r.result
            },
            confirm: function (e) {
                return confirm(e)
            },
            ajax: function (t) {
                return e.ajax(t)
            },
            href: function (e) {
                return e[0].href
            },
            isRemote: function (e) {
                return e.data("remote") !== t && !1 !== e.data("remote")
            },
            handleRemote: function (i) {
                var r, o, a, s, l, c;
                if (n.fire(i, "ajax:before")) {
                    if (s = i.data("with-credentials") || null, l = i.data("type") || e.ajaxSettings && e.ajaxSettings.dataType, i.is("form")) {
                        r = i.data("ujs:submit-button-formmethod") || i.attr("method"), o = i.data("ujs:submit-button-formaction") || i.attr("action"), a = e(i[0]).serializeArray();
                        var u = i.data("ujs:submit-button");
                        u && (a.push(u), i.data("ujs:submit-button", null)), i.data("ujs:submit-button-formmethod", null), i.data("ujs:submit-button-formaction", null)
                    } else i.is(n.inputChangeSelector) ? (r = i.data("method"), o = i.data("url"), a = i.serialize(), i.data("params") && (a = a + "&" + i.data("params"))) : i.is(n.buttonClickSelector) ? (r = i.data("method") || "get", o = i.data("url"), a = i.serialize(), i.data("params") && (a = a + "&" + i.data("params"))) : (r = i.data("method"), o = n.href(i), a = i.data("params") || null);
                    return c = {
                        type: r || "GET",
                        data: a,
                        dataType: l,
                        beforeSend: function (e, r) {
                            if (r.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + r.accepts.script), !n.fire(i, "ajax:beforeSend", [e, r])) return !1;
                            i.trigger("ajax:send", e)
                        },
                        success: function (e, t, n) {
                            i.trigger("ajax:success", [e, t, n])
                        },
                        complete: function (e, t) {
                            i.trigger("ajax:complete", [e, t])
                        },
                        error: function (e, t, n) {
                            i.trigger("ajax:error", [e, t, n])
                        },
                        crossDomain: n.isCrossDomain(o)
                    }, s && (c.xhrFields = {
                        withCredentials: s
                    }), o && (c.url = o), n.ajax(c)
                }
                return !1
            },
            isCrossDomain: function (e) {
                var t = document.createElement("a");
                t.href = location.href;
                var n = document.createElement("a");
                try {
                    return n.href = e, n.href = n.href, !((!n.protocol || ":" === n.protocol) && !n.host || t.protocol + "//" + t.host == n.protocol + "//" + n.host)
                } catch (i) {
                    return !0
                }
            },
            handleMethod: function (i) {
                var r = n.href(i),
                    o = i.data("method"),
                    a = i.attr("target"),
                    s = n.csrfToken(),
                    l = n.csrfParam(),
                    c = e('<form method="post" action="' + r + '"></form>'),
                    u = '<input name="_method" value="' + o + '" type="hidden" />';
                l === t || s === t || n.isCrossDomain(r) || (u += '<input name="' + l + '" value="' + s + '" type="hidden" />'), a && c.attr("target", a), c.hide().append(u).appendTo("body"), c.submit()
            },
            formElements: function (t, n) {
                return t.is("form") ? e(t[0].elements).filter(n) : t.find(n)
            },
            disableFormElements: function (t) {
                n.formElements(t, n.disableSelector).each(function () {
                    n.disableFormElement(e(this))
                })
            },
            disableFormElement: function (e) {
                var n, i;
                n = e.is("button") ? "html" : "val", (i = e.data("disable-with")) !== t && (e.data("ujs:enable-with", e[n]()), e[n](i)), e.prop("disabled", !0), e.data("ujs:disabled", !0)
            },
            enableFormElements: function (t) {
                n.formElements(t, n.enableSelector).each(function () {
                    n.enableFormElement(e(this))
                })
            },
            enableFormElement: function (e) {
                var n = e.is("button") ? "html" : "val";
                e.data("ujs:enable-with") !== t && (e[n](e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.prop("disabled", !1), e.removeData("ujs:disabled")
            },
            allowAction: function (e) {
                var t, i = e.data("confirm"),
                    r = !1;
                if (!i) return !0;
                if (n.fire(e, "confirm")) {
                    try {
                        r = n.confirm(i)
                    } catch (o) {
                        (console.error || console.log).call(console, o.stack || o)
                    }
                    t = n.fire(e, "confirm:complete", [r])
                }
                return r && t
            },
            blankInputs: function (t, n, i) {
                var r, o, a, s = e(),
                    l = n || "input,textarea",
                    c = t.find(l),
                    u = {};
                return c.each(function () {
                    (r = e(this)).is("input[type=radio]") ? (a = r.attr("name"), u[a] || (0 === t.find('input[type=radio]:checked[name="' + a + '"]').length && (o = t.find('input[type=radio][name="' + a + '"]'), s = s.add(o)), u[a] = a)) : (r.is("input[type=checkbox],input[type=radio]") ? r.is(":checked") : !!r.val()) === i && (s = s.add(r))
                }), !!s.length && s
            },
            nonBlankInputs: function (e, t) {
                return n.blankInputs(e, t, !0)
            },
            stopEverything: function (t) {
                return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
            },
            disableElement: function (e) {
                var i = e.data("disable-with");
                i !== t && (e.data("ujs:enable-with", e.html()), e.html(i)), e.bind("click.railsDisable", function (e) {
                    return n.stopEverything(e)
                }), e.data("ujs:disabled", !0)
            },
            enableElement: function (e) {
                e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.removeData("ujs:enable-with")), e.unbind("click.railsDisable"), e.removeData("ujs:disabled")
            }
        }, n.fire(i, "rails:attachBindings") && (e.ajaxPrefilter(function (e, t, i) {
            e.crossDomain || n.CSRFProtection(i)
        }), e(window).on("pageshow.rails", function () {
            e(e.rails.enableSelector).each(function () {
                var t = e(this);
                t.data("ujs:disabled") && e.rails.enableFormElement(t)
            }), e(e.rails.linkDisableSelector).each(function () {
                var t = e(this);
                t.data("ujs:disabled") && e.rails.enableElement(t)
            })
        }), i.on("ajax:complete", n.linkDisableSelector, function () {
            n.enableElement(e(this))
        }), i.on("ajax:complete", n.buttonDisableSelector, function () {
            n.enableFormElement(e(this))
        }), i.on("click.rails", n.linkClickSelector, function (t) {
            var i = e(this),
                r = i.data("method"),
                o = i.data("params"),
                a = t.metaKey || t.ctrlKey;
            if (!n.allowAction(i)) return n.stopEverything(t);
            if (!a && i.is(n.linkDisableSelector) && n.disableElement(i), n.isRemote(i)) {
                if (a && (!r || "GET" === r) && !o) return !0;
                var s = n.handleRemote(i);
                return !1 === s ? n.enableElement(i) : s.fail(function () {
                    n.enableElement(i)
                }), !1
            }
            return r ? (n.handleMethod(i), !1) : void 0
        }), i.on("click.rails", n.buttonClickSelector, function (t) {
            var i = e(this);
            if (!n.allowAction(i) || !n.isRemote(i)) return n.stopEverything(t);
            i.is(n.buttonDisableSelector) && n.disableFormElement(i);
            var r = n.handleRemote(i);
            return !1 === r ? n.enableFormElement(i) : r.fail(function () {
                n.enableFormElement(i)
            }), !1
        }), i.on("change.rails", n.inputChangeSelector, function (t) {
            var i = e(this);
            return n.allowAction(i) && n.isRemote(i) ? (n.handleRemote(i), !1) : n.stopEverything(t)
        }), i.on("submit.rails", n.formSubmitSelector, function (i) {
            var r, o, a = e(this),
                s = n.isRemote(a);
            if (!n.allowAction(a)) return n.stopEverything(i);
            if (a.attr("novalidate") === t)
                if (a.data("ujs:formnovalidate-button") === t) {
                    if ((r = n.blankInputs(a, n.requiredInputSelector, !1)) && n.fire(a, "ajax:aborted:required", [r])) return n.stopEverything(i)
                } else a.data("ujs:formnovalidate-button", t);
            if (s) {
                if (o = n.nonBlankInputs(a, n.fileInputSelector)) {
                    setTimeout(function () {
                        n.disableFormElements(a)
                    }, 13);
                    var l = n.fire(a, "ajax:aborted:file", [o]);
                    return l || setTimeout(function () {
                        n.enableFormElements(a)
                    }, 13), l
                }
                return n.handleRemote(a), !1
            }
            setTimeout(function () {
                n.disableFormElements(a)
            }, 13)
        }), i.on("click.rails", n.formInputClickSelector, function (t) {
            var i = e(this);
            if (!n.allowAction(i)) return n.stopEverything(t);
            var r = i.attr("name"),
                o = r ? {
                    name: r,
                    value: i.val()
                } : null,
                a = i.closest("form");
            0 === a.length && (a = e("#" + i.attr("form"))), a.data("ujs:submit-button", o), a.data("ujs:formnovalidate-button", i.attr("formnovalidate")), a.data("ujs:submit-button-formaction", i.attr("formaction")), a.data("ujs:submit-button-formmethod", i.attr("formmethod"))
        }), i.on("ajax:send.rails", n.formSubmitSelector, function (t) {
            this === t.target && n.disableFormElements(e(this))
        }), i.on("ajax:complete.rails", n.formSubmitSelector, function (t) {
            this === t.target && n.enableFormElements(e(this))
        }), e(function () {
            n.refreshCSRFTokens()
        }))
    }(jQuery),
    function () {
        $(function () {
            var e, t, n, i, r, o, a, s, l, c;
            return e = $("body"), t = $("#login_modal"), n = t.find(".modal__content"), a = !!document.createTouch, l = function (e) {
                var t, n;
                if (t = function (e, t) {
                        var n;
                        return "hidden" === (n = $(t)).attr("type") || n.attr("readonly") || n.attr("disabled")
                    }, (n = e.find("input").not(t).first()).length) return setTimeout(function () {
                    return n.focus()
                }, 100)
            }, c = function (i, s, c, u) {
                return n.html(u.responseText), t.addClass("modal--visible"), e.addClass("prevent-scrolling"), window.check_native_facebook(), a || l(n), o(), r()
            }, i = function () {
                return t.removeClass("modal--visible"), e.removeClass("prevent-scrolling")
            }, s = function () {
                var e;
                return (e = window.location.search.slice(1)).length > 0 ? Object.fromEntries(new URLSearchParams(e)) : null
            }, t.on("click", function (e) {
                if ($(e.target)[0] === t[0] || $(e.target).hasClass("modal__close")) return i()
            }), $(document).on("ajax:success", ".new_password, .new_registration, .new_session, .new_confirmation", c), $(document).on("ajax:error", ".new_password, .new_registration, .new_session, .new_confirmation", function () {
                return console.log("error from ajax request", arguments)
            }), $(document).on("ajax:before", function () {
                return window.Validate.removeErrors()
            }), $(document).on("ajax:success", ".new_registration", function () {
                var e;
                if (e = s()) return $("#referral_code").val(e.code)
            }), r = function () {
                return $(".custom-checkbox__label").off("click touch"), $(".custom-checkbox__label").on("click touch", function () {
                    return $(this).toggleClass("custom-checkbox__label--active")
                })
            }, (o = function () {
                var e, t, n;
                return e = $(".reveal_wrapper__eye"), $(".reveal_wrapper").find("input"), t = $(".reveal_wrapper__password"), n = $(".reveal_wrapper__text"), e.on("click touch", function () {
                    return $(this).parent().hasClass("reveal_wrapper__password") ? (e.addClass("reveal_wrapper__eye--active"), t.addClass("hidden"), n.removeClass("hidden")) : (e.removeClass("reveal_wrapper__eye--active"), t.removeClass("hidden"), n.addClass("hidden"))
                }), $(".reveal_password").keyup(function () {
                    var e;
                    return e = "", e = "text" === $(this).attr("type") ? ".reveal_wrapper__password" : ".reveal_wrapper__text", $(this).parent().parent().find(e + " input").val($(this).val())
                })
            })(), r()
        })
    }.call(this),
    function (e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = e || self).ahoy = t()
    }(this, function () {
        "use strict";

        function e() {
            return M.urlPrefix + M.visitsUrl
        }

        function t() {
            return M.urlPrefix + M.eventsUrl
        }

        function n(e) {
            return 0 === Object.keys(e).length
        }

        function i() {
            return (M.useBeacon || M.trackNow) && n(M.headers) && U && "undefined" != typeof window.navigator.sendBeacon && !M.withCredentials
        }

        function r(e, t, n) {
            O.set(e, t, n, M.cookieDomain || M.domain)
        }

        function o(e) {
            return O.get(e)
        }

        function a(e) {
            O.set(e, "", -1)
        }

        function s(e) {
            o("ahoy_debug") && window.console.log(e)
        }

        function l() {
            for (var e; e = V.shift();) e();
            F = !0
        }

        function c(e, t) {
            var n = e.matches || e.matchesSelector || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector || e.webkitMatchesSelector;
            return n ? n.apply(e, [t]) ? e : e.parentElement ? c(e.parentElement, t) : null : (s("Unable to match"), null)
        }

        function u(e, t, n) {
            document.addEventListener(e, function (e) {
                var i = c(e.target, t);
                i && n.call(i, e)
            })
        }

        function d(e) {
            "interactive" === document.readyState || "complete" === document.readyState ? setTimeout(e, 0) : document.addEventListener("DOMContentLoaded", e)
        }

        function f() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
                var t = 16 * Math.random() | 0;
                return ("x" == e ? t : 3 & t | 8).toString(16)
            })
        }

        function p() {
            M.cookies && U && r("ahoy_events", JSON.stringify(Q), 1)
        }

        function h() {
            var e = document.querySelector("meta[name=csrf-token]");
            return e && e.content
        }

        function m() {
            var e = document.querySelector("meta[name=csrf-param]");
            return e && e.content
        }

        function g(e) {
            var t = h();
            t && e.setRequestHeader("X-CSRF-Token", t)
        }

        function v(e, t, n) {
            if (U)
                if (W && W.ajax) W.ajax({
                    type: "POST",
                    url: e,
                    data: JSON.stringify(t),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    beforeSend: g,
                    success: n,
                    headers: M.headers,
                    xhrFields: {
                        withCredentials: M.withCredentials
                    }
                });
                else {
                    var i = new XMLHttpRequest;
                    for (var r in i.open("POST", e, !0), i.withCredentials = M.withCredentials, i.setRequestHeader("Content-Type", "application/json"), M.headers) M.headers.hasOwnProperty(r) && i.setRequestHeader(r, M.headers[r]);
                    i.onload = function () {
                        200 === i.status && n()
                    }, g(i), i.send(JSON.stringify(t))
                }
        }

        function y(e) {
            var t = {
                events: [e]
            };
            return M.cookies && (t.visit_token = e.visit_token, t.visitor_token = e.visitor_token), delete e.visit_token, delete e.visitor_token, t
        }

        function b(e) {
            z.ready(function () {
                v(t(), y(e), function () {
                    for (var t = 0; t < Q.length; t++)
                        if (Q[t].id == e.id) {
                            Q.splice(t, 1);
                            break
                        } p()
                })
            })
        }

        function _(e) {
            z.ready(function () {
                var n = y(e),
                    i = m(),
                    r = h();
                i && r && (n[i] = r), n.events_json = JSON.stringify(n.events), delete n.events, window.navigator.sendBeacon(t(), q(n))
            })
        }

        function w() {
            return M.page || window.location.pathname
        }

        function x(e) {
            return e && e.length > 0 ? e : null
        }

        function k(e) {
            for (var t in e) e.hasOwnProperty(t) && null === e[t] && delete e[t];
            return e
        }

        function C() {
            return k({
                tag: this.tagName.toLowerCase(),
                id: x(this.id),
                "class": x(this.className),
                page: w(),
                section: S(this)
            })
        }

        function S(e) {
            for (; e && e !== document; e = e.parentNode)
                if (e.hasAttribute("data-section")) return e.getAttribute("data-section");
            return null
        }

        function T() {
            if (F = !1, H = z.getVisitId(), R = z.getVisitorId(), B = o("ahoy_track"), !1 === M.cookies || !1 === M.trackVisits) s("Visit tracking disabled"), l();
            else if (H && R && !B) s("Active visit"), l();
            else if (H || r("ahoy_visit", H = f(), M.visitDuration), o("ahoy_visit")) {
                s("Visit started"), R || r("ahoy_visitor", R = f(), M.visitorDuration);
                var t = {
                    visit_token: H,
                    visitor_token: R,
                    platform: M.platform,
                    landing_page: window.location.href,
                    screen_width: window.screen.width,
                    screen_height: window.screen.height,
                    js: !0
                };
                for (var n in document.referrer.length > 0 && (t.referrer = document.referrer), M.visitParams) M.visitParams.hasOwnProperty(n) && (t[n] = M.visitParams[n]);
                s(t), v(e(), t, function () {
                    a("ahoy_track"), l()
                })
            } else s("Cookies disabled"), l()
        }
        var E = function (e) {
                return e === undefined
            },
            $ = function (e) {
                return null === e
            },
            A = function (e) {
                return "boolean" == typeof e
            },
            j = function (e) {
                return e === Object(e)
            },
            D = function (e) {
                return Array.isArray(e)
            },
            N = function (e) {
                return e instanceof Date
            },
            L = function (e) {
                return e && "number" == typeof e.size && "string" == typeof e.type && "function" == typeof e.slice
            },
            P = function (e) {
                return L(e) && "string" == typeof e.name && ("object" == typeof e.lastModifiedDate || "number" == typeof e.lastModified)
            },
            I = function (e, t, n, i) {
                return (t = t || {}).indices = !E(t.indices) && t.indices, t.nullsAsUndefineds = !E(t.nullsAsUndefineds) && t.nullsAsUndefineds, t.booleansAsIntegers = !E(t.booleansAsIntegers) && t.booleansAsIntegers, t.allowEmptyArrays = !E(t.allowEmptyArrays) && t.allowEmptyArrays, n = n || new FormData, E(e) ? n : ($(e) ? t.nullsAsUndefineds || n.append(i, "") : A(e) ? t.booleansAsIntegers ? n.append(i, e ? 1 : 0) : n.append(i, e) : D(e) ? e.length ? e.forEach(function (e, r) {
                    var o = i + "[" + (t.indices ? r : "") + "]";
                    I(e, t, n, o)
                }) : t.allowEmptyArrays && n.append(i + "[]", "") : N(e) ? n.append(i, e.toISOString()) : !j(e) || P(e) || L(e) ? n.append(i, e) : Object.keys(e).forEach(function (r) {
                    var o = e[r];
                    if (D(o))
                        for (; r.length > 2 && r.lastIndexOf("[]") === r.length - 2;) r = r.substring(0, r.length - 2);
                    I(o, t, n, i ? i + "[" + r + "]" : r)
                }), n)
            },
            q = {
                serialize: I
            }.serialize,
            O = {
                set: function (e, t, n, i) {
                    var r = "",
                        o = "";
                    if (n) {
                        var a = new Date;
                        a.setTime(a.getTime() + 60 * n * 1e3), r = "; expires=" + a.toGMTString()
                    }
                    i && (o = "; domain=" + i), document.cookie = e + "=" + escape(t) + r + o + "; path=/"
                },
                get: function (e) {
                    var t, n, i = e + "=",
                        r = document.cookie.split(";");
                    for (t = 0; t < r.length; t++) {
                        for (n = r[t];
                            " " === n.charAt(0);) n = n.substring(1, n.length);
                        if (0 === n.indexOf(i)) return unescape(n.substring(i.length, n.length))
                    }
                    return null
                }
            },
            M = {
                urlPrefix: "",
                visitsUrl: "/ahoy/visits",
                eventsUrl: "/ahoy/events",
                page: null,
                platform: "Web",
                useBeacon: !0,
                startOnReady: !0,
                trackVisits: !0,
                cookies: !0,
                cookieDomain: null,
                headers: {},
                visitParams: {},
                withCredentials: !1,
                visitDuration: 240,
                visitorDuration: 1051200
            },
            z = window.ahoy || window.Ahoy || {};
        z.configure = function (e) {
            for (var t in e) e.hasOwnProperty(t) && (M[t] = e[t])
        }, z.configure(z);
        var H, R, B, W = window.jQuery || window.Zepto || window.$,
            F = !1,
            V = [],
            U = "undefined" != typeof JSON && "undefined" != typeof JSON.stringify,
            Q = [];
        z.ready = function (e) {
            F ? e() : V.push(e)
        }, z.getVisitId = z.getVisitToken = function () {
            return o("ahoy_visit")
        }, z.getVisitorId = z.getVisitorToken = function () {
            return o("ahoy_visitor")
        }, z.reset = function () {
            return a("ahoy_visit"), a("ahoy_visitor"), a("ahoy_events"), a("ahoy_track"), !0
        }, z.debug = function (e) {
            return !1 === e ? a("ahoy_debug") : r("ahoy_debug", "t", 525600), !0
        }, z.track = function (e, t) {
            var n = {
                name: e,
                properties: t || {},
                time: (new Date).getTime() / 1e3,
                id: f(),
                js: !0
            };
            return z.ready(function () {
                M.cookies && !z.getVisitId() && T(), z.ready(function () {
                    s(n), n.visit_token = z.getVisitId(), n.visitor_token = z.getVisitorId(), i() ? _(n) : (Q.push(n), p(), setTimeout(function () {
                        b(n)
                    }, 1e3))
                })
            }), !0
        }, z.trackView = function (e) {
            var t = {
                url: window.location.href,
                title: document.title,
                page: w()
            };
            if (e)
                for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
            z.track("$view", t)
        }, z.trackClicks = function () {
            u("click", "a, button, input[type=submit]", function (e) {
                var t = C.call(this, e);
                t.text = "input" == t.tag ? this.value : (this.textContent || this.innerText || this.innerHTML).replace(/[\s\r\n]+/g, " ").trim(), t.href = this.href, z.track("$click", t)
            })
        }, z.trackSubmits = function () {
            u("submit", "form", function (e) {
                var t = C.call(this, e);
                z.track("$submit", t)
            })
        }, z.trackChanges = function () {
            u("change", "input, textarea, select", function (e) {
                var t = C.call(this, e);
                z.track("$change", t)
            })
        }, z.trackAll = function () {
            z.trackView(), z.trackClicks(), z.trackSubmits(), z.trackChanges()
        };
        try {
            Q = JSON.parse(o("ahoy_events") || "[]")
        } catch (Y) {}
        for (var X = 0; X < Q.length; X++) b(Q[X]);
        return z.start = function () {
            T(), z.start = function () {}
        }, d(function () {
            M.startOnReady && z.start()
        }), z
    }),
    function () {
        function e(e, t) {
            t.forEach(function (t) {
                const n = document.querySelector("." + t.selector);
                n && n.classList[e](t.selector + "--scrolled")
            })
        }

        function t(t) {
            e((document.body.scrollTop || document.documentElement.scrollTop) > 0 ? "add" : "remove", t)
        }

        function n(e, t) {
            l && window.clearTimeout(l), t.classList[e]("shown")
        }

        function i(e) {
            l = window.setTimeout(n.bind(this, "remove", e), 800)
        }

        function r(e) {
            const t = document.querySelector("." + e.selector + "__mega-nav-container"),
                r = document.querySelector("." + e.selector + "__mega-nav");
            t && r && (t.addEventListener("mouseenter", n.bind(this, "add", r)), t.addEventListener("mouseleave", i.bind(this, r)))
        }

        function o(e) {
            document.querySelector("body").classList.toggle(e.selector + "__body-draw-open"), document.querySelector("." + e.selector + "__draw").classList.toggle(e.selector + "__draw--open")
        }

        function a(e) {
            const t = document.querySelector("." + e.selector + "__mobile-nav-close"),
                n = document.querySelector("." + e.selector + "__burger-icon");
            n && t && (n.addEventListener("click", o.bind(this, e)), t.addEventListener("click", o.bind(this, e)))
        }

        function s(e) {
            const t = document.querySelector("." + e.selector + "__accordion__item__label");
            if (!t) return;
            const n = t.parentElement;
            n && t.addEventListener("click", function (e) {
                return e.preventDefault(), n.classList.toggle("open"), !1
            })
        }
        let l;
        document.addEventListener("DOMContentLoaded", function () {
            const e = [{
                selector: "page-header",
                megaNav: !1,
                mobileDraw: !1
            }, {
                selector: "app-header",
                megaNav: !0,
                mobileDraw: !0
            }];
            if (!e.filter(function (e) {
                    return document.querySelector("." + e.selector)
                })[0]) return;
            t(e), document.addEventListener("scroll", t.bind(this, e)), e.forEach(function (e) {
                e.megaNav && (r(e), s(e)), e.mobileDraw && a(e)
            });
            const n = document.querySelector(".nested-button");
            n && n.addEventListener("click", function (e) {
                return e.preventDefault(), window.location = n.getAttribute("href"), !1
            })
        })
    }(),
    function (e) {
        "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
    }(function (e) {
        function t(e) {
            window.console && console.warn && console.warn(e)
        }
        var n = function (t, i) {
            n._registry.push(this), this.$textarea = t, this.$textCopy = e("<span />"), this.$clone = e("<pre class='expanding-clone'><br /></pre>").prepend(this.$textCopy), t.wrap(e("<div class='expanding-wrapper' style='position:relative' />")).after(this.$clone), this.attach(), this.setStyles(), this.update(), i.update && t.bind("update.expanding", i.update)
        };
        n._registry = [], n.getExpandingInstance = function (t) {
            var i = e.map(n._registry, function (e) {
                    return e.$textarea[0]
                }),
                r = e.inArray(t, i);
            return r > -1 ? n._registry[r] : null
        };
        var i = function () {
                var e = -1;
                if ("Microsoft Internet Explorer" === navigator.appName) {
                    var t = navigator.userAgent;
                    null !== new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})").exec(t) && (e = parseFloat(RegExp.$1))
                }
                return e
            }(),
            r = "oninput" in document.createElement("input") && 9 !== i;
        n.prototype = {
            attach: function () {
                var e = "input.expanding change.expanding",
                    t = this;
                r || (e += " keyup.expanding"), this.$textarea.bind(e, function () {
                    t.update()
                })
            },
            update: function () {
                this.$textCopy.text(this.$textarea.val().replace(/\r\n/g, "\n")), this.$textarea.triggerHandler("update.expanding")
            },
            destroy: function () {
                this.$clone.remove(), this.$textarea.unwrap().attr("style", this._oldTextareaStyles || ""), delete this._oldTextareaStyles;
                var t = e.inArray(this, n._registry);
                t > -1 && n._registry.splice(t, 1), this.$textarea.unbind("input.expanding change.expanding keyup.expanding update.expanding")
            },
            setStyles: function () {
                this._resetStyles(), this._setCloneStyles(), this._setTextareaStyles()
            },
            _resetStyles: function () {
                this._oldTextareaStyles = this.$textarea.attr("style"), this.$textarea.add(this.$clone).css({
                    margin: 0,
                    webkitBoxSizing: "border-box",
                    mozBoxSizing: "border-box",
                    boxSizing: "border-box",
                    width: "100%"
                })
            },
            _setCloneStyles: function () {
                var e = {
                    display: "block",
                    border: "0 solid",
                    visibility: "hidden",
                    minHeight: this.$textarea.outerHeight()
                };
                "off" === this.$textarea.attr("wrap") ? e.overflowX = "scroll" : e.whiteSpace = "pre-wrap", this.$clone.css(e), this._copyTextareaStylesToClone()
            },
            _copyTextareaStylesToClone: function () {
                var t = this,
                    n = ["lineHeight", "textDecoration", "letterSpacing", "fontSize", "fontFamily", "fontStyle", "fontWeight", "textTransform", "textAlign", "direction", "wordSpacing", "fontSizeAdjust", "wordWrap", "word-break", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "maxHeight"];
                e.each(n, function (e, n) {
                    var i = t.$textarea.css(n);
                    t.$clone.css(n) !== i && (t.$clone.css(n, i), "maxHeight" === n && "none" !== i && t.$clone.css("overflow", "hidden"))
                })
            },
            _setTextareaStyles: function () {
                this.$textarea.css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    resize: "none",
                    overflow: "auto"
                })
            }
        }, e.expanding = e.extend({
            autoInitialize: !0,
            initialSelector: "textarea.expanding",
            opts: {
                update: function () {}
            }
        }, e.expanding || {}), e.fn.expanding = function (i) {
            if ("destroy" === i) return this.each(function () {
                var e = n.getExpandingInstance(this);
                e && e.destroy()
            }), this;
            if ("active" === i) return !!this.filter(function () {
                return !!n.getExpandingInstance(this)
            }).length;
            if ("refresh" === i) return this.each(function () {
                var e = n.getExpandingInstance(this);
                e && e.setStyles()
            }), this;
            var r = e.extend({}, e.expanding.opts, i);
            return this.filter("textarea").each(function () {
                var i = this.offsetWidth > 0 || this.offsetHeight > 0,
                    o = n.getExpandingInstance(this);
                i && !o ? new n(e(this), r) : (i || t("ExpandingTextareas: attempt to initialize an invisible textarea. Call expanding() again once it has been inserted into the page and/or is visible."), o && t("ExpandingTextareas: attempt to initialize a textarea that has already been initialized. Subsequent calls are ignored."))
            }), this
        }, e(function () {
            e.expanding.autoInitialize && e(e.expanding.initialSelector).expanding()
        })
    }),
    /*!
     * Lazy Load - jQuery plugin for lazy loading images
     *
     * Copyright (c) 2007-2015 Mika Tuupola
     *
     * Licensed under the MIT license:
     *   http://www.opensource.org/licenses/mit-license.php
     *
     * Project home:
     *   http://www.appelsiini.net/projects/lazyload
     *
     * Version:  1.9.7
     *
     */
    function (e, t, n, i) {
        var r = e(t);
        e.fn.lazyload = function (o) {
            function a() {
                var t = 0;
                l.each(function () {
                    var n = e(this);
                    if (!c.skip_invisible || n.is(":visible"))
                        if (e.abovethetop(this, c) || e.leftofbegin(this, c));
                        else if (e.belowthefold(this, c) || e.rightoffold(this, c)) {
                        if (++t > c.failure_limit) return !1
                    } else n.trigger("appear"), t = 0
                })
            }
            var s, l = this,
                c = {
                    threshold: 0,
                    failure_limit: 0,
                    event: "scroll",
                    effect: "show",
                    container: t,
                    data_attribute: "original",
                    skip_invisible: !1,
                    appear: null,
                    load: null,
                    placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
                };
            return o && (i !== o.failurelimit && (o.failure_limit = o.failurelimit, delete o.failurelimit), i !== o.effectspeed && (o.effect_speed = o.effectspeed, delete o.effectspeed), e.extend(c, o)), s = c.container === i || c.container === t ? r : e(c.container), 0 === c.event.indexOf("scroll") && s.bind(c.event, function () {
                return a()
            }), this.each(function () {
                var t = this,
                    n = e(t);
                t.loaded = !1, n.attr("src") !== i && !1 !== n.attr("src") || n.is("img") && n.attr("src", c.placeholder), n.one("appear", function () {
                    if (!this.loaded) {
                        if (c.appear) {
                            var i = l.length;
                            c.appear.call(t, i, c)
                        }
                        e("<img />").bind("load", function () {
                            var i = n.attr("data-" + c.data_attribute);
                            n.hide(), n.is("img") ? n.attr("src", i) : n.css("background-image", "url('" + i + "')"), n[c.effect](c.effect_speed), t.loaded = !0;
                            var r = e.grep(l, function (e) {
                                return !e.loaded
                            });
                            if (l = e(r), c.load) {
                                var o = l.length;
                                c.load.call(t, o, c)
                            }
                        }).attr("src", n.attr("data-" + c.data_attribute))
                    }
                }), 0 !== c.event.indexOf("scroll") && n.bind(c.event, function () {
                    t.loaded || n.trigger("appear")
                })
            }), r.bind("resize", function () {
                a()
            }), /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && r.bind("pageshow", function (t) {
                t.originalEvent && t.originalEvent.persisted && l.each(function () {
                    e(this).trigger("appear")
                })
            }), e(n).ready(function () {
                a()
            }), this
        }, e.belowthefold = function (n, o) {
            return (o.container === i || o.container === t ? (t.innerHeight ? t.innerHeight : r.height()) + r.scrollTop() : e(o.container).offset().top + e(o.container).height()) <= e(n).offset().top - o.threshold
        }, e.rightoffold = function (n, o) {
            return (o.container === i || o.container === t ? r.width() + r.scrollLeft() : e(o.container).offset().left + e(o.container).width()) <= e(n).offset().left - o.threshold
        }, e.abovethetop = function (n, o) {
            return (o.container === i || o.container === t ? r.scrollTop() : e(o.container).offset().top) >= e(n).offset().top + o.threshold + e(n).height()
        }, e.leftofbegin = function (n, o) {
            return (o.container === i || o.container === t ? r.scrollLeft() : e(o.container).offset().left) >= e(n).offset().left + o.threshold + e(n).width()
        }, e.inviewport = function (t, n) {
            return !(e.rightoffold(t, n) || e.leftofbegin(t, n) || e.belowthefold(t, n) || e.abovethetop(t, n))
        }, e.extend(e.expr[":"], {
            "below-the-fold": function (t) {
                return e.belowthefold(t, {
                    threshold: 0
                })
            },
            "above-the-top": function (t) {
                return !e.belowthefold(t, {
                    threshold: 0
                })
            },
            "right-of-screen": function (t) {
                return e.rightoffold(t, {
                    threshold: 0
                })
            },
            "left-of-screen": function (t) {
                return !e.rightoffold(t, {
                    threshold: 0
                })
            },
            "in-viewport": function (t) {
                return e.inviewport(t, {
                    threshold: 0
                })
            },
            "above-the-fold": function (t) {
                return !e.belowthefold(t, {
                    threshold: 0
                })
            },
            "right-of-fold": function (t) {
                return e.rightoffold(t, {
                    threshold: 0
                })
            },
            "left-of-fold": function (t) {
                return !e.rightoffold(t, {
                    threshold: 0
                })
            }
        })
    }(jQuery, window, document),
    function (e, t) {
        var n = function () {
            t(e.lazySizes), e.removeEventListener("lazyunveilread", n, !0)
        };
        t = t.bind(null, e, e.document), "object" == typeof module && module.exports ? t(require("lazysizes")) : e.lazySizes ? n() : e.addEventListener("lazyunveilread", n, !0)
    }(window, function (e, t, n) {
        "use strict";
        if (e.addEventListener) {
            var i = /\s+/g,
                r = /\s*\|\s+|\s+\|\s*/g,
                o = /^(.+?)(?:\s+\[\s*(.+?)\s*\])?$/,
                a = /\(|\)|'/,
                s = {
                    contain: 1,
                    cover: 1
                },
                l = function (e) {
                    var t = n.gW(e, e.parentNode);
                    return (!e._lazysizesWidth || t > e._lazysizesWidth) && (e._lazysizesWidth = t), e._lazysizesWidth
                },
                c = function (e) {
                    var t;
                    return t = (getComputedStyle(e) || {
                        getPropertyValue: function () {}
                    }).getPropertyValue("background-size"), !s[t] && s[e.style.backgroundSize] && (t = e.style.backgroundSize), t
                },
                u = function (e, n, a) {
                    var s = t.createElement("picture"),
                        l = n.getAttribute(lazySizesConfig.sizesAttr),
                        c = n.getAttribute("data-ratio"),
                        u = n.getAttribute("data-optimumx");
                    n._lazybgset && n._lazybgset.parentNode == n && n.removeChild(n._lazybgset), Object.defineProperty(a, "_lazybgset", {
                        value: n,
                        writable: !0
                    }), Object.defineProperty(n, "_lazybgset", {
                        value: s,
                        writable: !0
                    }), e = e.replace(i, " ").split(r), s.style.display = "none", a.className = lazySizesConfig.lazyClass, 1 != e.length || l || (l = "auto"), e.forEach(function (e) {
                        var n, i = t.createElement("source");
                        l && "auto" != l && i.setAttribute("sizes", l), (n = e.match(o)) && (i.setAttribute(lazySizesConfig.srcsetAttr, n[1]), n[2] && i.setAttribute("media", lazySizesConfig.customMedia[n[2]] || n[2])), s.appendChild(i)
                    }), l && (a.setAttribute(lazySizesConfig.sizesAttr, l), n.removeAttribute(lazySizesConfig.sizesAttr), n.removeAttribute("sizes")), u && a.setAttribute("data-optimumx", u), c && a.setAttribute("data-ratio", c), s.appendChild(a), n.appendChild(s)
                },
                d = function (e) {
                    if (e.target._lazybgset) {
                        var t = e.target,
                            i = t._lazybgset,
                            r = t.currentSrc || t.src;
                        r && (i.style.backgroundImage = "url(" + (a.test(r) ? JSON.stringify(r) : r) + ")"), t._lazybgsetLoading && (n.fire(i, "_lazyloaded", {}, !1, !0), delete t._lazybgsetLoading)
                    }
                };
            addEventListener("lazybeforeunveil", function (e) {
                var i, r, o;
                !e.defaultPrevented && (i = e.target.getAttribute("data-bgset")) && (o = e.target, (r = t.createElement("img")).alt = "", r._lazybgsetLoading = !0, e.detail.firesLoad = !0, u(i, o, r), setTimeout(function () {
                    n.loader.unveil(r), n.rAF(function () {
                        n.fire(r, "_lazyloaded", {}, !0, !0), r.complete && d({
                            target: r
                        })
                    })
                }))
            }), t.addEventListener("load", d, !0), e.addEventListener("lazybeforesizes", function (e) {
                if (e.detail.instance == n && e.target._lazybgset && e.detail.dataAttr) {
                    var t = e.target._lazybgset,
                        i = c(t);
                    s[i] && (e.target._lazysizesParentFit = i, n.rAF(function () {
                        e.target.setAttribute("data-parent-fit", i), e.target._lazysizesParentFit && delete e.target._lazysizesParentFit
                    }))
                }
            }, !0), t.documentElement.addEventListener("lazybeforesizes", function (e) {
                !e.defaultPrevented && e.target._lazybgset && e.detail.instance == n && (e.detail.width = l(e.target._lazybgset))
            })
        }
    }),
    function (e, t) {
        var n = t(e, e.document);
        e.lazySizes = n, "object" == typeof module && module.exports && (module.exports = n)
    }(window, function (e, t) {
        "use strict";
        if (t.getElementsByClassName) {
            var n, i, r = t.documentElement,
                o = e.Date,
                a = e.HTMLPictureElement,
                s = "addEventListener",
                l = "getAttribute",
                c = e[s],
                u = e.setTimeout,
                d = e.requestAnimationFrame || u,
                f = e.requestIdleCallback,
                p = /^picture$/i,
                h = ["load", "error", "lazyincluded", "_lazyloaded"],
                m = {},
                g = Array.prototype.forEach,
                v = function (e, t) {
                    return m[t] || (m[t] = new RegExp("(\\s|^)" + t + "(\\s|$)")), m[t].test(e[l]("class") || "") && m[t]
                },
                y = function (e, t) {
                    v(e, t) || e.setAttribute("class", (e[l]("class") || "").trim() + " " + t)
                },
                b = function (e, t) {
                    var n;
                    (n = v(e, t)) && e.setAttribute("class", (e[l]("class") || "").replace(n, " "))
                },
                _ = function (e, t, n) {
                    var i = n ? s : "removeEventListener";
                    n && _(e, t), h.forEach(function (n) {
                        e[i](n, t)
                    })
                },
                w = function (e, i, r, o, a) {
                    var s = t.createEvent("CustomEvent");
                    return r || (r = {}), r.instance = n, s.initCustomEvent(i, !o, !a, r), e.dispatchEvent(s), s
                },
                x = function (t, n) {
                    var r;
                    !a && (r = e.picturefill || i.pf) ? r({
                        reevaluate: !0,
                        elements: [t]
                    }) : n && n.src && (t.src = n.src)
                },
                k = function (e, t) {
                    return (getComputedStyle(e, null) || {})[t]
                },
                C = function (e, t, n) {
                    for (n = n || e.offsetWidth; n < i.minSize && t && !e._lazysizesWidth;) n = t.offsetWidth, t = t.parentNode;
                    return n
                },
                S = function () {
                    var e, n, i = [],
                        r = [],
                        o = i,
                        a = function () {
                            var t = o;
                            for (o = i.length ? r : i, e = !0, n = !1; t.length;) t.shift()();
                            e = !1
                        },
                        s = function (i, r) {
                            e && !r ? i.apply(this, arguments) : (o.push(i), n || (n = !0, (t.hidden ? u : d)(a)))
                        };
                    return s._lsFlush = a, s
                }(),
                T = function (e, t) {
                    return t ? function () {
                        S(e)
                    } : function () {
                        var t = this,
                            n = arguments;
                        S(function () {
                            e.apply(t, n)
                        })
                    }
                },
                E = function (e) {
                    var t, n = 0,
                        r = 125,
                        a = i.ricTimeout,
                        s = function () {
                            t = !1, n = o.now(), e()
                        },
                        l = f && i.ricTimeout ? function () {
                            f(s, {
                                timeout: a
                            }), a !== i.ricTimeout && (a = i.ricTimeout)
                        } : T(function () {
                            u(s)
                        }, !0);
                    return function (e) {
                        var i;
                        (e = !0 === e) && (a = 33), t || (t = !0, 0 > (i = r - (o.now() - n)) && (i = 0), e || 9 > i && f ? l() : u(l, i))
                    }
                },
                $ = function (e) {
                    var t, n, i = 99,
                        r = function () {
                            t = null, e()
                        },
                        a = function () {
                            var e = o.now() - n;
                            i > e ? u(a, i - e) : (f || r)(r)
                        };
                    return function () {
                        n = o.now(), t || (t = u(a, i))
                    }
                };
            ! function () {
                var t, n = {
                    lazyClass: "lazyload",
                    loadedClass: "lazyloaded",
                    loadingClass: "lazyloading",
                    preloadClass: "lazypreload",
                    errorClass: "lazyerror",
                    autosizesClass: "lazyautosizes",
                    srcAttr: "data-src",
                    srcsetAttr: "data-srcset",
                    sizesAttr: "data-sizes",
                    minSize: 40,
                    customMedia: {},
                    init: !0,
                    expFactor: 1.5,
                    hFac: .8,
                    loadMode: 2,
                    loadHidden: !0,
                    ricTimeout: 300
                };
                for (t in i = e.lazySizesConfig || e.lazysizesConfig || {}, n) t in i || (i[t] = n[t]);
                e.lazySizesConfig = i, u(function () {
                    i.init && D()
                })
            }();
            var A = function () {
                    var a, d, f, h, m, C, A, D, N, L, P, I, q, O, M = /^img$/i,
                        z = /^iframe$/i,
                        H = "onscroll" in e && !/glebot/.test(navigator.userAgent),
                        R = 0,
                        B = 0,
                        W = 0,
                        F = -1,
                        V = function (e) {
                            W--, e && e.target && _(e.target, V), (!e || 0 > W || !e.target) && (W = 0)
                        },
                        U = function (e, n) {
                            var i, o = e,
                                a = "hidden" == k(t.body, "visibility") || "hidden" != k(e, "visibility");
                            for (D -= n, P += n, N -= n, L += n; a && (o = o.offsetParent) && o != t.body && o != r;)(a = (k(o, "opacity") || 1) > 0) && "visible" != k(o, "overflow") && (i = o.getBoundingClientRect(), a = L > i.left && N < i.right && P > i.top - 1 && D < i.bottom + 1);
                            return a
                        },
                        Q = function () {
                            var e, o, s, c, u, f, p, m, g, v = n.elements;
                            if ((h = i.loadMode) && 8 > W && (e = v.length)) {
                                o = 0, F++, null == q && ("expand" in i || (i.expand = r.clientHeight > 500 && r.clientWidth > 500 ? 500 : 370), I = i.expand, q = I * i.expFactor), q > B && 1 > W && F > 2 && h > 2 && !t.hidden ? (B = q, F = 0) : B = h > 1 && F > 1 && 6 > W ? I : R;
                                for (; e > o; o++)
                                    if (v[o] && !v[o]._lazyRace)
                                        if (H)
                                            if ((m = v[o][l]("data-expand")) && (f = 1 * m) || (f = B), g !== f && (C = innerWidth + f * O, A = innerHeight + f, p = -1 * f, g = f), s = v[o].getBoundingClientRect(), (P = s.bottom) >= p && (D = s.top) <= A && (L = s.right) >= p * O && (N = s.left) <= C && (P || L || N || D) && (i.loadHidden || "hidden" != k(v[o], "visibility")) && (d && 3 > W && !m && (3 > h || 4 > F) || U(v[o], f))) {
                                                if (te(v[o]), u = !0, W > 9) break
                                            } else !u && d && !c && 4 > W && 4 > F && h > 2 && (a[0] || i.preloadAfterLoad) && (a[0] || !m && (P || L || N || D || "auto" != v[o][l](i.sizesAttr))) && (c = a[0] || v[o]);
                                else te(v[o]);
                                c && !u && te(c)
                            }
                        },
                        X = E(Q),
                        Y = function (e) {
                            y(e.target, i.loadedClass), b(e.target, i.loadingClass), _(e.target, G), w(e.target, "lazyloaded")
                        },
                        J = T(Y),
                        G = function (e) {
                            J({
                                target: e.target
                            })
                        },
                        K = function (e, t) {
                            try {
                                e.contentWindow.location.replace(t)
                            } catch (n) {
                                e.src = t
                            }
                        },
                        Z = function (e) {
                            var t, n = e[l](i.srcsetAttr);
                            (t = i.customMedia[e[l]("data-media") || e[l]("media")]) && e.setAttribute("media", t), n && e.setAttribute("srcset", n)
                        },
                        ee = T(function (e, t, n, r, o) {
                            var a, s, c, d, h, m;
                            (h = w(e, "lazybeforeunveil", t)).defaultPrevented || (r && (n ? y(e, i.autosizesClass) : e.setAttribute("sizes", r)), s = e[l](i.srcsetAttr), a = e[l](i.srcAttr), o && (d = (c = e.parentNode) && p.test(c.nodeName || "")), m = t.firesLoad || "src" in e && (s || a || d), h = {
                                target: e
                            }, m && (_(e, V, !0), clearTimeout(f), f = u(V, 2500), y(e, i.loadingClass), _(e, G, !0)), d && g.call(c.getElementsByTagName("source"), Z), s ? e.setAttribute("srcset", s) : a && !d && (z.test(e.nodeName) ? K(e, a) : e.src = a), o && (s || d) && x(e, {
                                src: a
                            })), e._lazyRace && delete e._lazyRace, b(e, i.lazyClass), S(function () {
                                (!m || e.complete && e.naturalWidth > 1) && (m ? V(h) : W--, Y(h))
                            }, !0)
                        }),
                        te = function (e) {
                            var t, n = M.test(e.nodeName),
                                r = n && (e[l](i.sizesAttr) || e[l]("sizes")),
                                o = "auto" == r;
                            (!o && d || !n || !e[l]("src") && !e.srcset || e.complete || v(e, i.errorClass) || !v(e, i.lazyClass)) && (t = w(e, "lazyunveilread").detail, o && j.updateElem(e, !0, e.offsetWidth), e._lazyRace = !0, W++, ee(e, t, o, r, n))
                        },
                        ne = function () {
                            if (!d) {
                                if (o.now() - m < 999) return void u(ne, 999);
                                var e = $(function () {
                                    i.loadMode = 3, X()
                                });
                                d = !0, i.loadMode = 3, X(), c("scroll", function () {
                                    3 == i.loadMode && (i.loadMode = 2), e()
                                }, !0)
                            }
                        };
                    return {
                        _: function () {
                            m = o.now(), n.elements = t.getElementsByClassName(i.lazyClass), a = t.getElementsByClassName(i.lazyClass + " " + i.preloadClass), O = i.hFac, c("scroll", X, !0), c("resize", X, !0), e.MutationObserver ? new MutationObserver(X).observe(r, {
                                childList: !0,
                                subtree: !0,
                                attributes: !0
                            }) : (r[s]("DOMNodeInserted", X, !0), r[s]("DOMAttrModified", X, !0), setInterval(X, 999)), c("hashchange", X, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (e) {
                                t[s](e, X, !0)
                            }), /d$|^c/.test(t.readyState) ? ne() : (c("load", ne), t[s]("DOMContentLoaded", X), u(ne, 2e4)), n.elements.length ? (Q(), S._lsFlush()) : X()
                        },
                        checkElems: X,
                        unveil: te
                    }
                }(),
                j = function () {
                    var e, n = T(function (e, t, n, i) {
                            var r, o, a;
                            if (e._lazysizesWidth = i, i += "px", e.setAttribute("sizes", i), p.test(t.nodeName || ""))
                                for (o = 0, a = (r = t.getElementsByTagName("source")).length; a > o; o++) r[o].setAttribute("sizes", i);
                            n.detail.dataAttr || x(e, n.detail)
                        }),
                        r = function (e, t, i) {
                            var r, o = e.parentNode;
                            o && (i = C(e, o, i), (r = w(e, "lazybeforesizes", {
                                width: i,
                                dataAttr: !!t
                            })).defaultPrevented || (i = r.detail.width) && i !== e._lazysizesWidth && n(e, o, r, i))
                        },
                        o = $(function () {
                            var t, n = e.length;
                            if (n)
                                for (t = 0; n > t; t++) r(e[t])
                        });
                    return {
                        _: function () {
                            e = t.getElementsByClassName(i.autosizesClass), c("resize", o)
                        },
                        checkElems: o,
                        updateElem: r
                    }
                }(),
                D = function () {
                    D.i || (D.i = !0, j._(), A._())
                };
            return n = {
                cfg: i,
                autoSizer: j,
                loader: A,
                init: D,
                uP: x,
                aC: y,
                rC: b,
                hC: v,
                fire: w,
                gW: C,
                rAF: S
            }
        }
    }), window.clark || (window.clark = {}), $(window).ready(function () {
        window.clark.setUpAccordion(), window.clark.setUpClarkordion()
    }), window.clark.setUpAccordion = function () {
        function e() {
            t.find(".accordion__item__header").removeClass("active"), t.find(".accordion__item__content").slideUp(300).removeClass("open")
        }
        var t;
        $(".accordion__item__header").unbind("click"), $(".accordion__item__header").click(function (n) {
            t = $(this).closest(".accordion"), $(this).hasClass("active") ? e() : (e(), $(this).addClass("active"), $(this).siblings(".accordion__item__content").slideDown(300).addClass("open")), n.preventDefault()
        })
    }, window.clark.setUpClarkordion = function (e) {
        function t() {
            n.find(".clarkordion__item__header").removeClass("clarkordion__item__header--active"), n.find(".clarkordion__item__content").slideUp(300).removeClass("clarkordion__item__content--open")
        }
        var n;
        e = e || !1, $(".clarkordion__item__header").unbind("click"), e || $(".clarkordion").addClass("clarkordion--close-on-large"), $(".clarkordion__item__header").click(function (i) {
            if (n = $(this).closest(".clarkordion"), i.preventDefault(), !e && $(window).innerWidth() >= 1e3) return !1;
            $(this).hasClass("clarkordion__item__header--active") ? t() : (t(), $(this).addClass("clarkordion__item__header--active"), $(this).siblings(".clarkordion__item__content").slideDown(300).addClass("clarkordion__item__content--open"))
        })
    },
    function () {
        var e, t, n, i, r, o, a, s, l, c, u;
        t = null, e = null, r = null, o = null, i = null, n = null, s = null, a = null, l = null, u = function () {
            window.clearTimeout(l), l = window.setTimeout(window.detectTargetingInView, 10)
        }, c = function () {
            if (0 !== $(".fixed-top-flag").length && (o = $(".fixed-top-flag"), r = $(".fixed-top-item"), o.css("min-height", o.innerHeight())), 0 !== $(".fixed-bottom-flag").length && (i = $(".fixed-bottom-flag"), n = $(".fixed-bottom-item")), 0 !== $(".next-fixed-flag").length && (t = $(".next-fixed-flag"), e = $(".next-fixed-btn")), 0 !== $(".search-fixed-flag").length && (s = $(".search-fixed-flag"), a = $(".search-fixed-field")), a || e || r || n) return $(window).scroll(u), $(window).scroll()
        }, $(function () {
            return initFixedElementScroll(), window.setTimeout(window.detectTargetingInView, 5e3)
        }), window.initFixedElementScroll = function () {
            return $(window).off("scroll", u), t = null, e = null, r = null, o = null, i = null, n = null, s = null, a = null, l = null, c()
        }, window.detectTargetingInView = function () {
            if (e && $.each(t, function (t, n) {
                    var i;
                    if (window.isElementInViewport(n)) return $(e[t]).removeClass("next-fixed-btn--fixed");
                    if ((i = $(".page-footer--white-label")).length || (i = $(".page-footer")), i.length) {
                        if (!e[t]) return;
                        return $(window).scrollTop() < $(e[t]).offset().top ? $(e[t]).addClass("next-fixed-btn--fixed") : $(e[t]).removeClass("next-fixed-btn--fixed")
                    }
                    return $(e[t]).addClass("next-fixed-btn--fixed")
                }), a && $.each(s, function (e, t) {
                    return window.isElementInViewport(t) ? $(a[e]).removeClass("search-fixed-field--fixed") : $(a[e]).addClass("search-fixed-field--fixed")
                }), r && $.each(o, function (e, t) {
                    var n, i;
                    return window.isElementInViewport(t) ? $(r[e]).removeClass("fixed-top-item--fixed") : ($(r[e]).addClass("fixed-top-item--fixed"), (n = $(".page-footer")).length && (i = $(r[e]).innerHeight(), $(document).height() - $(window).scrollTop() - n.height() < i) ? $(r[e]).removeClass("fixed-top-item--fixed") : void 0)
                }), n) return $.each(i, function (e, t) {
                if (window.isElementInViewport(t)) return $(n[e]).removeClass("fixed-bottom-item--fixed");
                if ($(".page-footer").length) {
                    if (!n[e]) return;
                    return $(window).scrollTop() < $(n[e]).offset().top ? $(n[e]).addClass("fixed-bottom-item--fixed") : $(n[e]).removeClass("fixed-bottom-item--fixed")
                }
                return $(n[e]).addClass("fixed-bottom-item--fixed")
            })
        }
    }.call(this),
    function () {
        "use strict";

        function e(e) {
            var t = JSON.parse(window.clark.localStorage.getItem(e));
            return null !== t && t
        }

        function t(e, t) {
            window.clark.localStorage.setItem(e, JSON.stringify(t))
        }
        window.clark = window.clark || {},
            function (e) {
                function t() {}
                var n = {};
                t.prototype.getItem = function (e) {
                    return e in n ? n[e] : null
                }, t.prototype.setItem = function (e, t) {
                    n[e] = t
                }, t.prototype.key = function (e) {
                    return Object.keys(n)[e]
                }, t.prototype.get = function () {
                    return n
                }, t.prototype.removeItem = function (e) {
                    n && n[e] && delete n[e]
                }, Object.defineProperty(t.prototype, "length", {
                    get: function () {
                        return Object.keys(n).length
                    }
                });
                var i = "__storage_test__";
                try {
                    localStorage.setItem(i, i), localStorage.removeItem(i), e.clark.localStorage = localStorage
                } catch (r) {
                    e.clark.localStorage = new t
                }
            }(window), window.localData = {
                storeData: function (e, n) {
                    t(e, n)
                },
                getData: function (t, n) {
                    var i = e(t);
                    return i === undefined ? n : i
                },
                setAttr: function (n, i, r) {
                    var o = e(n) || {};
                    "delete" === r ? delete o[i] : o[i] = r, t(n, o)
                },
                getAttr: function (t, n, i) {
                    var r = e(t);
                    return (r = r[n]) !== undefined ? r : i
                },
                deleteAll: function (e) {
                    window.clark.localStorage.removeItem(e)
                },
                getAllNamespaces: function () {
                    for (var e = [], t = 0; t < window.clark.localStorage.length; t++) e.push(window.clark.localStorage.key(t));
                    return e
                }
            }
    }(),
    function () {
        "use strict";

        function e(e) {
            var t = JSON.parse(window.clark.sessionStorage.getItem(e));
            return null !== t && t
        }

        function t(e, t) {
            window.clark.sessionStorage.setItem(e, JSON.stringify(t))
        }! function (e) {
            function t() {}
            var n = {};
            t.prototype.getItem = function (e) {
                return e in n ? n[e] : null
            }, t.prototype.setItem = function (e, t) {
                n[e] = t
            }, t.prototype.key = function (e) {
                return Object.keys(n)[e]
            }, t.prototype.get = function () {
                return n
            }, t.prototype.removeItem = function (e) {
                n && n[e] && delete n[e]
            }, Object.defineProperty(t.prototype, "length", {
                get: function () {
                    return Object.keys(n).length
                }
            });
            var i = "__storage_test__";
            try {
                sessionStorage.setItem(i, i), sessionStorage.removeItem(i), e.clark.sessionStorage = sessionStorage
            } catch (r) {
                e.clark.sessionStorage = new t
            }
        }(window), window.sessionData = {
            setAttr: function (n, i, r) {
                var o = e(n) || {};
                "delete" === r ? delete o[i] : o[i] = r, t(n, o)
            },
            getAttr: function (t, n, i) {
                var r = e(t);
                return (r = r[n]) !== undefined ? r : i
            },
            getData: function (t) {
                return e(t)
            },
            deleteAll: function (e) {
                window.clark.sessionStorage.removeItem(e)
            }
        }
    }(),
    function () {
        $(function () {
            var e, t;
            if ((e = $("#request_app_link__form")).length) return e.submit(function () {
                if (!t()) return !1
            }), t = function () {
                var e, t;
                if (window.Validate.removeErrors(), e = "request_app_link__input", "" === (t = $("#" + e).val())) return window.Validate.setErrorOnInput(e, "Bitte gebe eine g\xfcltige Email-Adresse oder deutsche Handynummer ein."), !1;
                if (t.indexOf("@") > -1) {
                    if (!window.Validate.validateEmailOnly(t)) return window.Validate.setErrorOnInput(e, "Keine g\xfcltige Email-Adresse."), !1
                } else if (!window.Validate.validatePhoneNumber(t)) return window.Validate.setErrorOnInput(e, "Keine g\xfcltige Telefonnummer."), !1;
                return !0
            }
        })
    }.call(this),
    function () {
        function e() {
            r && window.clearTimeout(r), r = window.setTimeout(t.bind(this), 300)
        }

        function t() {
            var e = $(window).width();
            n(e < 550 ? "small" : e < 1e3 ? "mid" : "large")
        }

        function n(e) {
            $.each(i, function (t, n) {
                $(n).attr("data-original", $(n).attr("data-" + e))
            }), $(".homepage__bg-image__image").lazyload({})
        }
        var i, r;
        $(document).ready(function () {
            if (!(i = $(".homepage__bg-image__image")).length) return !1;
            $(window).resize(e.bind(this))
        })
    }(),
    function () {
        function e() {
            var e = $("body").attr("class");
            return !!e && (-1 !== e.indexOf("-ios") || -1 !== e.indexOf("-android"))
        }

        function t() {
            window.sessionStorage && window.sessionStorage.setItem("homepage__disruptor--visited", "ok")
        }

        function n() {
            return !!window.sessionStorage && "ok" === window.sessionStorage.getItem("homepage__disruptor--visited")
        }

        function i() {
            var e = $(".zopim:last");
            return e && e.is(":visible")
        }

        function r() {
            $(".zopim:first").hide()
        }

        function o() {
            $(".zopim:first").show()
        }

        function a() {
            i() || n() || e() || (r(), u.animate({
                bottom: "-300px"
            }, 0, function () {
                u.animate({
                    bottom: 0
                }, f), u.show(), d.css("marginBottom", 80)
            }))
        }

        function s(e) {
            e && e.preventDefault(), u.animate({
                bottom: "-300px"
            }, f, function () {
                u.hide(), o(), t(), d.css("marginBottom", 0)
            })
        }

        function l() {
            window.track({
                event: "disruptor_clicked"
            })
        }

        function c() {
            a(), $(".homepage__disruptor__close").click(s), $(".homepage__disruptor__cta a").click(l)
        }
        var u, d, f = 1e3,
            p = 3e3;
        $(document).ready(function () {
            (u = $(".homepage__disruptor")).length > 0 && (d = $(".page-footer__minor"), setTimeout(c, p))
        })
    }(),
    function () {
        function e() {
            a && window.clearTimeout(a), a = window.setTimeout(t.bind(this), 300)
        }

        function t() {
            var e = $(window).width();
            r(e < 550 ? "small" : e < 1e3 ? "mid" : "large")
        }

        function n(e, t) {
            window.track({
                event: "CTA_Click",
                heroSlide: t
            });
            i(e)
        }

        function i(e) {
            window.location = e
        }

        function r(e) {
            o = $(".home-slider__hero-slider__slides li"), $.each(o, function (t, n) {
                var i = $(n).find("img")[0];
                $(n).css({
                    backgroundImage: 'url("' + encodeURI($(i).attr("data-" + e)) + '")',
                    width: $(window).innerWidth()
                })
            });
            var t = $("#hero-slider").data("flexslider");
            t && t.resize()
        }
        var o, a, s, l;
        $(document).ready(function () {
            if (!(o = $(".flex-hero-slider-image")).length) return !1;
            l = $(".home-slider"), s = $(".home-slider__wrapper__stamp__image");
            for (var i = 0; i < s.length; i++) "" !== s[i].src && l.addClass("home-slider--increased-height");
            t(), $(".home-slider__hero-slider").flexslider({
                slideshowSpeed: 6e3,
                allowOneSlide: !1,
                animation: "slide",
                animationSpeed: 600,
                slideshow: !0,
                controlNav: !0,
                directionNav: !0,
                touch: !0,
                namespace: "flex-",
                controlsContainer: $(".home-slider__hero-controls-container"),
                customDirectionNav: $(".custom-navigation a"),
                start: function () {
                    t(), $(".home-slider__hero-controls-container ol.flex-control-nav li").addClass("flex-nav-border");
                    for (var e = $(".flex-nav-border"), i = 0; i < e.length; i++) e[i].addEventListener("click", function () {
                        setTimeout(function () {
                            var e = $(".flex-active-slide").attr("data-tracking");
                            window.track({
                                event: "slide_click",
                                landedOn: e
                            })
                        }, 500)
                    }, !1);
                    for (var r = $(".flex-direction-nav li a"), o = 0; o < r.length; o++) r[o].addEventListener("click", function () {
                        setTimeout(function () {
                            var e = $(".flex-active-slide").attr("data-tracking");
                            window.track({
                                event: "header_click",
                                landedOn: e
                            })
                        }, 500)
                    }, !1);
                    for (var a = $(".home-slider__wrapper__inner__cta"), s = 0; s < a.length; s++) a[s].addEventListener("click", function () {
                        n($(this).attr("data-href"), $(this).attr("data-tracking"))
                    }, !1)
                }
            }), $(window).resize(e.bind(this))
        })
    }(),
    function () {
        var e, t = !0;
        $(document).ready(function () {
            function n() {
                e = setTimeout(function () {
                    t && window.clark.hide_product_menu()
                }, 700)
            }

            function i() {
                n()
            }
            $(".toggle_product-sub-menu").hover(function () {
                $(window).width() > 730 && ($(".toggle_product-sub-menu").addClass("active"), $(".products-sub-menu").addClass("is-active"))
            }), $(".toggle_product-sub-menu").mouseleave(function () {
                $(window).width() > 730 && i()
            }), $(".toggle_product-sub-menu").click(function (e) {
                e.stopImmediatePropagation(), $(".toggle_product-sub-menu").addClass("active"), $(".products-sub-menu").addClass("is-active")
            }), $(".products-sub-menu__header").click(function () {
                window.clark.hide_product_menu()
            }), $(".products-sub-menu").hover(function () {
                t = !1, clearTimeout(e)
            }), $(".products-sub-menu").mouseleave(function () {
                $(window).width() > 730 && (t = !0, n())
            })
        })
    }(), $("#insurances_for_quick_select li .quick_select__card").click(function () {
        $(this).find(".quick_select__card__bottom").toggleClass("miles_calculator__card__bottom--home-quick-select--toggled"), $(this).find(".quick_select__card__top__check").toggleClass("miles_calculator__card__top__check--toggled")
    }), $(document).ready(function () {
        "ontouchstart" in window || navigator.maxTouchPoints || $(this).find(".miles_calculator__card__bottom").addClass(".miles_calculator__card__bottom__hover--home-quick-select");
        var e = "homepage__quick-select__list__item",
            t = document.querySelectorAll("." + e);
        if (t.length > 0) {
            var n = document.querySelector("#miles"),
                i = document.querySelector("#milesDiff"),
                r = i ? parseInt(i.innerText) : 0,
                o = n && r;
            [].forEach.call(t, function (t) {
                t.addEventListener("click", function () {
                    t.classList.toggle(e + "--active"), o && (n.innerText = document.querySelectorAll("." + e + "--active").length * r)
                })
            })
        }
        var a = document.querySelector(".homepage__quick-select__cta");
        a && a.addEventListener("click", function () {
            window.track({
                event: "quick_selection_cta",
                quick_selection_box: document.querySelectorAll("." + e + "--active").length
            })
        })
    }),
    function () {
        function e() {
            r && window.clearTimeout(r), r = window.setTimeout(t.bind(this), 10)
        }

        function t() {
            $.each(n, function (e, t) {
                var n = $(t);
                n.hasClass("homepage__messages__messages__message--animated") || window.isElementInViewport(n) && window.setTimeout(function () {
                    $(t).addClass("homepage__messages__messages__message--animated")
                }, 40)
            }), $.each(i, function (e, t) {
                var n = $(t);
                n.hasClass("homepage__mobile-popout__phone__card--animated") || window.isElementInViewport(n) && window.setTimeout(function () {
                    $(t).addClass("homepage__mobile-popout__phone__card--animated")
                }, 40)
            })
        }
        var n, i, r;
        $(document).ready(function () {
            if (n = $(".homepage__messages__messages__message"), i = $(".homepage__mobile-popout__phone__card"), !n.length) return !1;
            $(window).scroll(e.bind(this)), $(window).bind("touchmove", e.bind(this))
        })
    }(),
    function () {
        function e() {
            n && window.clearTimeout(n), n = window.setTimeout(t.bind(this), 1200)
        }

        function t() {
            if ($(window).width() >= 730) {
                if (r) return;
                r = !0;
                var e = i.attr("data-bg");
                i.css("background-image", e)
            } else {
                if (!r) return;
                r = !1, i.css("background-image", "none")
            }
        }
        var n, i, r = !1;
        $(document).ready(function () {
            (i = $(".partner-hero__wrapper")).length && ($(window).resize(e.bind(this)), t())
        })
    }(),
    function (e) {
        var t = !0;
        e.flexslider = function (n, i) {
            var r = e(n);
            r.vars = e.extend({}, e.flexslider.defaults, i);
            var o, a = r.vars.namespace,
                s = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
                l = ("ontouchstart" in window || s || window.DocumentTouch && document instanceof DocumentTouch) && r.vars.touch,
                c = "click touchend MSPointerUp keyup",
                u = "",
                d = "vertical" === r.vars.direction,
                f = r.vars.reverse,
                p = r.vars.itemWidth > 0,
                h = "fade" === r.vars.animation,
                m = "" !== r.vars.asNavFor,
                g = {};
            e.data(n, "flexslider", r), g = {
                init: function () {
                    r.animating = !1, r.currentSlide = parseInt(r.vars.startAt ? r.vars.startAt : 0, 10), isNaN(r.currentSlide) && (r.currentSlide = 0), r.animatingTo = r.currentSlide, r.atEnd = 0 === r.currentSlide || r.currentSlide === r.last, r.containerSelector = r.vars.selector.substr(0, r.vars.selector.search(" ")), r.slides = e(r.vars.selector, r), r.container = e(r.containerSelector, r), r.count = r.slides.length, r.syncExists = e(r.vars.sync).length > 0, "slide" === r.vars.animation && (r.vars.animation = "swing"), r.prop = d ? "top" : "marginLeft", r.args = {}, r.manualPause = !1, r.stopped = !1, r.started = !1, r.startTimeout = null, r.transitions = !r.vars.video && !h && r.vars.useCSS && function () {
                        var e = document.createElement("div"),
                            t = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                        for (var n in t)
                            if (e.style[t[n]] !== undefined) return r.pfx = t[n].replace("Perspective", "").toLowerCase(), r.prop = "-" + r.pfx + "-transform", !0;
                        return !1
                    }(), r.ensureAnimationEnd = "", "" !== r.vars.controlsContainer && (r.controlsContainer = e(r.vars.controlsContainer).length > 0 && e(r.vars.controlsContainer)), "" !== r.vars.manualControls && (r.manualControls = e(r.vars.manualControls).length > 0 && e(r.vars.manualControls)), "" !== r.vars.customDirectionNav && (r.customDirectionNav = 2 === e(r.vars.customDirectionNav).length && e(r.vars.customDirectionNav)), r.vars.randomize && (r.slides.sort(function () {
                        return Math.round(Math.random()) - .5
                    }), r.container.empty().append(r.slides)), r.doMath(), r.setup("init"), r.vars.controlNav && g.controlNav.setup(), r.vars.directionNav && g.directionNav.setup(), r.vars.keyboard && (1 === e(r.containerSelector).length || r.vars.multipleKeyboard) && e(document).bind("keyup", function (e) {
                        var t = e.keyCode;
                        if (!r.animating && (39 === t || 37 === t)) {
                            var n = 39 === t ? r.getTarget("next") : 37 === t && r.getTarget("prev");
                            r.flexAnimate(n, r.vars.pauseOnAction)
                        }
                    }), r.vars.mousewheel && r.bind("mousewheel", function (e, t) {
                        e.preventDefault();
                        var n = t < 0 ? r.getTarget("next") : r.getTarget("prev");
                        r.flexAnimate(n, r.vars.pauseOnAction)
                    }), r.vars.pausePlay && g.pausePlay.setup(), r.vars.slideshow && r.vars.pauseInvisible && g.pauseInvisible.init(), r.vars.slideshow && (r.vars.pauseOnHover && r.hover(function () {
                        r.manualPlay || r.manualPause || r.pause()
                    }, function () {
                        r.manualPause || r.manualPlay || r.stopped || r.play()
                    }), r.vars.pauseInvisible && g.pauseInvisible.isHidden() || (r.vars.initDelay > 0 ? r.startTimeout = setTimeout(r.play, r.vars.initDelay) : r.play())), m && g.asNav.setup(), l && r.vars.touch && g.touch(), (!h || h && r.vars.smoothHeight) && e(window).bind("resize orientationchange focus", g.resize), r.find("img").attr("draggable", "false"), setTimeout(function () {
                        r.vars.start(r)
                    }, 200)
                },
                asNav: {
                    setup: function () {
                        r.asNav = !0, r.animatingTo = Math.floor(r.currentSlide / r.move), r.currentItem = r.currentSlide, r.slides.removeClass(a + "active-slide").eq(r.currentItem).addClass(a + "active-slide"), s ? (n._slider = r, r.slides.each(function () {
                            var t = this;
                            t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", function (e) {
                                e.preventDefault(), e.currentTarget._gesture && e.currentTarget._gesture.addPointer(e.pointerId)
                            }, !1), t.addEventListener("MSGestureTap", function (t) {
                                t.preventDefault();
                                var n = e(this),
                                    i = n.index();
                                e(r.vars.asNavFor).data("flexslider").animating || n.hasClass("active") || (r.direction = r.currentItem < i ? "next" : "prev", r.flexAnimate(i, r.vars.pauseOnAction, !1, !0, !0))
                            })
                        })) : r.slides.on(c, function (t) {
                            t.preventDefault();
                            var n = e(this),
                                i = n.index();
                            n.offset().left - e(r).scrollLeft() <= 0 && n.hasClass(a + "active-slide") ? r.flexAnimate(r.getTarget("prev"), !0) : e(r.vars.asNavFor).data("flexslider").animating || n.hasClass(a + "active-slide") || (r.direction = r.currentItem < i ? "next" : "prev", r.flexAnimate(i, r.vars.pauseOnAction, !1, !0, !0))
                        })
                    }
                },
                controlNav: {
                    setup: function () {
                        r.manualControls ? g.controlNav.setupManual() : g.controlNav.setupPaging()
                    },
                    setupPaging: function () {
                        var t, n, i = "thumbnails" === r.vars.controlNav ? "control-thumbs" : "control-paging",
                            o = 1;
                        if (r.controlNavScaffold = e('<ol class="' + a + "control-nav " + a + i + '"></ol>'), r.pagingCount > 1)
                            for (var s = 0; s < r.pagingCount; s++) {
                                n = r.slides.eq(s), undefined === n.attr("data-thumb-alt") && n.attr("data-thumb-alt", "");
                                var l = "" !== n.attr("data-thumb-alt") ? l = ' alt="' + n.attr("data-thumb-alt") + '"' : "";
                                if (t = "thumbnails" === r.vars.controlNav ? '<img src="' + n.attr("data-thumb") + '"' + l + "/>" : '<a href="#">' + o + "</a>", "thumbnails" === r.vars.controlNav && !0 === r.vars.thumbCaptions) {
                                    var d = n.attr("data-thumbcaption");
                                    "" !== d && undefined !== d && (t += '<span class="' + a + 'caption">' + d + "</span>")
                                }
                                r.controlNavScaffold.append("<li>" + t + "</li>"), o++
                            }
                        r.controlsContainer ? e(r.controlsContainer).append(r.controlNavScaffold) : r.append(r.controlNavScaffold), g.controlNav.set(), g.controlNav.active(), r.controlNavScaffold.delegate("a, img", c, function (t) {
                            if (t.preventDefault(), "" === u || u === t.type) {
                                var n = e(this),
                                    i = r.controlNav.index(n);
                                n.hasClass(a + "active") || (r.direction = i > r.currentSlide ? "next" : "prev", r.flexAnimate(i, r.vars.pauseOnAction))
                            }
                            "" === u && (u = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    setupManual: function () {
                        r.controlNav = r.manualControls, g.controlNav.active(), r.controlNav.bind(c, function (t) {
                            if (t.preventDefault(), "" === u || u === t.type) {
                                var n = e(this),
                                    i = r.controlNav.index(n);
                                n.hasClass(a + "active") || (i > r.currentSlide ? r.direction = "next" : r.direction = "prev", r.flexAnimate(i, r.vars.pauseOnAction))
                            }
                            "" === u && (u = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    set: function () {
                        var t = "thumbnails" === r.vars.controlNav ? "img" : "a";
                        r.controlNav = e("." + a + "control-nav li " + t, r.controlsContainer ? r.controlsContainer : r)
                    },
                    active: function () {
                        r.controlNav.removeClass(a + "active").eq(r.animatingTo).addClass(a + "active")
                    },
                    update: function (t, n) {
                        r.pagingCount > 1 && "add" === t ? r.controlNavScaffold.append(e('<li><a href="#">' + r.count + "</a></li>")) : 1 === r.pagingCount ? r.controlNavScaffold.find("li").remove() : r.controlNav.eq(n).closest("li").remove(), g.controlNav.set(), r.pagingCount > 1 && r.pagingCount !== r.controlNav.length ? r.update(n, t) : g.controlNav.active()
                    }
                },
                directionNav: {
                    setup: function () {
                        var t = e('<ul class="' + a + 'direction-nav"><li class="' + a + 'nav-prev"><a class="' + a + 'prev" href="#">' + r.vars.prevText + '</a></li><li class="' + a + 'nav-next"><a class="' + a + 'next" href="#">' + r.vars.nextText + "</a></li></ul>");
                        r.customDirectionNav ? r.directionNav = r.customDirectionNav : r.controlsContainer ? (e(r.controlsContainer).append(t), r.directionNav = e("." + a + "direction-nav li a", r.controlsContainer)) : (r.append(t), r.directionNav = e("." + a + "direction-nav li a", r)), g.directionNav.update(), r.directionNav.bind(c, function (t) {
                            var n;
                            t.preventDefault(), "" !== u && u !== t.type || (n = e(this).hasClass(a + "next") ? r.getTarget("next") : r.getTarget("prev"), r.flexAnimate(n, r.vars.pauseOnAction)), "" === u && (u = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    update: function () {
                        var e = a + "disabled";
                        1 === r.pagingCount ? r.directionNav.addClass(e).attr("tabindex", "-1") : r.vars.animationLoop ? r.directionNav.removeClass(e).removeAttr("tabindex") : 0 === r.animatingTo ? r.directionNav.removeClass(e).filter("." + a + "prev").addClass(e).attr("tabindex", "-1") : r.animatingTo === r.last ? r.directionNav.removeClass(e).filter("." + a + "next").addClass(e).attr("tabindex", "-1") : r.directionNav.removeClass(e).removeAttr("tabindex")
                    }
                },
                pausePlay: {
                    setup: function () {
                        var t = e('<div class="' + a + 'pauseplay"><a href="#"></a></div>');
                        r.controlsContainer ? (r.controlsContainer.append(t), r.pausePlay = e("." + a + "pauseplay a", r.controlsContainer)) : (r.append(t), r.pausePlay = e("." + a + "pauseplay a", r)), g.pausePlay.update(r.vars.slideshow ? a + "pause" : a + "play"), r.pausePlay.bind(c, function (t) {
                            t.preventDefault(), "" !== u && u !== t.type || (e(this).hasClass(a + "pause") ? (r.manualPause = !0, r.manualPlay = !1, r.pause()) : (r.manualPause = !1, r.manualPlay = !0, r.play())), "" === u && (u = t.type), g.setToClearWatchedEvent()
                        })
                    },
                    update: function (e) {
                        "play" === e ? r.pausePlay.removeClass(a + "pause").addClass(a + "play").html(r.vars.playText) : r.pausePlay.removeClass(a + "play").addClass(a + "pause").html(r.vars.pauseText)
                    }
                },
                touch: function () {
                    var e, t, i, o, a, l, c, u, m, g = !1,
                        v = 0,
                        y = 0,
                        b = 0;
                    if (s) {
                        function _(e) {
                            e.stopPropagation(), r.animating ? e.preventDefault() : (r.pause(), n._gesture.addPointer(e.pointerId), b = 0, o = d ? r.h : r.w, l = Number(new Date), i = p && f && r.animatingTo === r.last ? 0 : p && f ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : p && r.currentSlide === r.last ? r.limit : p ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : f ? (r.last - r.currentSlide + r.cloneOffset) * o : (r.currentSlide + r.cloneOffset) * o)
                        }

                        function w(e) {
                            e.stopPropagation();
                            var t = e.target._slider;
                            if (t) {
                                var r = -e.translationX,
                                    s = -e.translationY;
                                a = b += d ? s : r, g = d ? Math.abs(b) < Math.abs(-r) : Math.abs(b) < Math.abs(-s), e.detail !== e.MSGESTURE_FLAG_INERTIA ? (!g || Number(new Date) - l > 500) && (e.preventDefault(), !h && t.transitions && (t.vars.animationLoop || (a = b / (0 === t.currentSlide && b < 0 || t.currentSlide === t.last && b > 0 ? Math.abs(b) / o + 2 : 1)), t.setProps(i + a, "setTouch"))) : setImmediate(function () {
                                    n._gesture.stop()
                                })
                            }
                        }

                        function x(n) {
                            n.stopPropagation();
                            var r = n.target._slider;
                            if (r) {
                                if (r.animatingTo === r.currentSlide && !g && null !== a) {
                                    var s = f ? -a : a,
                                        c = s > 0 ? r.getTarget("next") : r.getTarget("prev");
                                    r.canAdvance(c) && (Number(new Date) - l < 550 && Math.abs(s) > 50 || Math.abs(s) > o / 2) ? r.flexAnimate(c, r.vars.pauseOnAction) : h || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0)
                                }
                                e = null, t = null, a = null, i = null, b = 0
                            }
                        }
                        n.style.msTouchAction = "none", n._gesture = new MSGesture, n._gesture.target = n, n.addEventListener("MSPointerDown", _, !1), n._slider = r, n.addEventListener("MSGestureChange", w, !1), n.addEventListener("MSGestureEnd", x, !1)
                    } else c = function (a) {
                        r.animating ? a.preventDefault() : (window.navigator.msPointerEnabled || 1 === a.touches.length) && (r.pause(), o = d ? r.h : r.w, l = Number(new Date), v = a.touches[0].pageX, y = a.touches[0].pageY, i = p && f && r.animatingTo === r.last ? 0 : p && f ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : p && r.currentSlide === r.last ? r.limit : p ? (r.itemW + r.vars.itemMargin) * r.move * r.currentSlide : f ? (r.last - r.currentSlide + r.cloneOffset) * o : (r.currentSlide + r.cloneOffset) * o, e = d ? y : v, t = d ? v : y, n.addEventListener("touchmove", u, !1), n.addEventListener("touchend", m, !1))
                    }, u = function (s) {
                        a = d ? e - s.touches[0].pageY : e - s.touches[0].pageX, !(g = d ? Math.abs(a) < Math.abs(s.touches[0].pageX - t) : Math.abs(a) < Math.abs(s.touches[0].pageY - t)) || Number(new Date) - l > 500 ? (s.preventDefault(), !h && r.transitions && (r.vars.animationLoop || (a /= 0 === r.currentSlide && a < 0 || r.currentSlide === r.last && a > 0 ? Math.abs(a) / o + 2 : 1), r.setProps(i + a, "setTouch"))) : n.removeEventListener("touchmove", u, !1)
                    }, m = function () {
                        if (n.removeEventListener("touchmove", u, !1), r.animatingTo === r.currentSlide && !g && null !== a) {
                            var s = f ? -a : a,
                                c = s > 0 ? r.getTarget("next") : r.getTarget("prev");
                            r.canAdvance(c) && (Number(new Date) - l < 200 && Math.abs(s) > 50 || Math.abs(s) > o / 2) ? r.flexAnimate(c, r.vars.pauseOnAction) : h || r.flexAnimate(r.currentSlide, r.vars.pauseOnAction, !0)
                        }
                        n.removeEventListener("touchend", m, !1), e = null, t = null, a = null, i = null
                    }, n.addEventListener("touchstart", c, !1)
                },
                resize: function () {
                    !r.animating && r.is(":visible") && (p || r.doMath(), h ? g.smoothHeight() : p ? (r.slides.width(r.computedW), r.update(r.pagingCount), r.setProps()) : d ? (r.viewport.height(r.h), r.setProps(r.h, "setTotal")) : (r.vars.smoothHeight && g.smoothHeight(), r.newSlides.width(r.computedW), r.setProps(r.computedW, "setTotal")))
                },
                smoothHeight: function () {
                    d && !h || (h ? r : r.viewport).animate({
                        height: r.slides.eq(r.animatingTo).innerHeight()
                    }, 500)
                },
                sync: function (t) {
                    var n = e(r.vars.sync).data("flexslider"),
                        i = r.animatingTo;
                    switch (t) {
                        case "animate":
                            n.flexAnimate(i, r.vars.pauseOnAction, !1, !0);
                            break;
                        case "play":
                            n.playing || n.asNav || n.play();
                            break;
                        case "pause":
                            n.pause()
                    }
                },
                uniqueID: function (t) {
                    return t.filter("[id]").add(t.find("[id]")).each(function () {
                        var t = e(this);
                        t.attr("id", t.attr("id") + "_clone")
                    }), t
                },
                pauseInvisible: {
                    visProp: null,
                    init: function () {
                        var e = g.pauseInvisible.getHiddenProp();
                        if (e) {
                            var t = e.replace(/[H|h]idden/, "") + "visibilitychange";
                            document.addEventListener(t, function () {
                                g.pauseInvisible.isHidden() ? r.startTimeout ? clearTimeout(r.startTimeout) : r.pause() : r.started ? r.play() : r.vars.initDelay > 0 ? setTimeout(r.play, r.vars.initDelay) : r.play()
                            })
                        }
                    },
                    isHidden: function () {
                        var e = g.pauseInvisible.getHiddenProp();
                        return !!e && document[e]
                    },
                    getHiddenProp: function () {
                        var e = ["webkit", "moz", "ms", "o"];
                        if ("hidden" in document) return "hidden";
                        for (var t = 0; t < e.length; t++)
                            if (e[t] + "Hidden" in document) return e[t] + "Hidden";
                        return null
                    }
                },
                setToClearWatchedEvent: function () {
                    clearTimeout(o), o = setTimeout(function () {
                        u = ""
                    }, 3e3)
                }
            }, r.flexAnimate = function (t, n, i, o, s) {
                if (r.vars.animationLoop || t === r.currentSlide || (r.direction = t > r.currentSlide ? "next" : "prev"), m && 1 === r.pagingCount && (r.direction = r.currentItem < t ? "next" : "prev"), !r.animating && (r.canAdvance(t, s) || i) && r.is(":visible")) {
                    if (m && o) {
                        var c = e(r.vars.asNavFor).data("flexslider");
                        if (r.atEnd = 0 === t || t === r.count - 1, c.flexAnimate(t, !0, !1, !0, s), r.direction = r.currentItem < t ? "next" : "prev", c.direction = r.direction, Math.ceil((t + 1) / r.visible) - 1 === r.currentSlide || 0 === t) return r.currentItem = t, r.slides.removeClass(a + "active-slide").eq(t).addClass(a + "active-slide"), !1;
                        r.currentItem = t, r.slides.removeClass(a + "active-slide").eq(t).addClass(a + "active-slide"), t = Math.floor(t / r.visible)
                    }
                    if (r.animating = !0, r.animatingTo = t, n && r.pause(), r.vars.before(r), r.syncExists && !s && g.sync("animate"), r.vars.controlNav && g.controlNav.active(), p || r.slides.removeClass(a + "active-slide").eq(t).addClass(a + "active-slide"), r.atEnd = 0 === t || t === r.last, r.vars.directionNav && g.directionNav.update(), t === r.last && (r.vars.end(r), r.vars.animationLoop || r.pause()), h) l ? (r.slides.eq(r.currentSlide).css({
                        opacity: 0,
                        zIndex: 1
                    }), r.slides.eq(t).css({
                        opacity: 1,
                        zIndex: 2
                    }), r.wrapup(b)) : (r.slides.eq(r.currentSlide).css({
                        zIndex: 1
                    }).animate({
                        opacity: 0
                    }, r.vars.animationSpeed, r.vars.easing), r.slides.eq(t).css({
                        zIndex: 2
                    }).animate({
                        opacity: 1
                    }, r.vars.animationSpeed, r.vars.easing, r.wrapup));
                    else {
                        var u, v, y, b = d ? r.slides.filter(":first").height() : r.computedW;
                        p ? (u = r.vars.itemMargin, v = (y = (r.itemW + u) * r.move * r.animatingTo) > r.limit && 1 !== r.visible ? r.limit : y) : v = 0 === r.currentSlide && t === r.count - 1 && r.vars.animationLoop && "next" !== r.direction ? f ? (r.count + r.cloneOffset) * b : 0 : r.currentSlide === r.last && 0 === t && r.vars.animationLoop && "prev" !== r.direction ? f ? 0 : (r.count + 1) * b : f ? (r.count - 1 - t + r.cloneOffset) * b : (t + r.cloneOffset) * b, r.setProps(v, "", r.vars.animationSpeed), r.transitions ? (r.vars.animationLoop && r.atEnd || (r.animating = !1, r.currentSlide = r.animatingTo), r.container.unbind("webkitTransitionEnd transitionend"), r.container.bind("webkitTransitionEnd transitionend", function () {
                            clearTimeout(r.ensureAnimationEnd), r.wrapup(b)
                        }), clearTimeout(r.ensureAnimationEnd), r.ensureAnimationEnd = setTimeout(function () {
                            r.wrapup(b)
                        }, r.vars.animationSpeed + 100)) : r.container.animate(r.args, r.vars.animationSpeed, r.vars.easing, function () {
                            r.wrapup(b)
                        })
                    }
                    r.vars.smoothHeight && g.smoothHeight(r.vars.animationSpeed)
                }
            }, r.wrapup = function (e) {
                h || p || (0 === r.currentSlide && r.animatingTo === r.last && r.vars.animationLoop ? r.setProps(e, "jumpEnd") : r.currentSlide === r.last && 0 === r.animatingTo && r.vars.animationLoop && r.setProps(e, "jumpStart")), r.animating = !1, r.currentSlide = r.animatingTo, r.vars.after(r)
            }, r.animateSlides = function () {
                !r.animating && t && r.flexAnimate(r.getTarget("next"))
            }, r.pause = function () {
                clearInterval(r.animatedSlides), r.animatedSlides = null, r.playing = !1, r.vars.pausePlay && g.pausePlay.update("play"), r.syncExists && g.sync("pause")
            }, r.play = function () {
                r.playing && clearInterval(r.animatedSlides), r.animatedSlides = r.animatedSlides || setInterval(r.animateSlides, r.vars.slideshowSpeed), r.started = r.playing = !0, r.vars.pausePlay && g.pausePlay.update("pause"), r.syncExists && g.sync("play")
            }, r.stop = function () {
                r.pause(), r.stopped = !0
            }, r.canAdvance = function (e, t) {
                var n = m ? r.pagingCount - 1 : r.last;
                return !!t || (!(!m || r.currentItem !== r.count - 1 || 0 !== e || "prev" !== r.direction) || (!m || 0 !== r.currentItem || e !== r.pagingCount - 1 || "next" === r.direction) && (!(e === r.currentSlide && !m) && (!!r.vars.animationLoop || (!r.atEnd || 0 !== r.currentSlide || e !== n || "next" === r.direction) && (!r.atEnd || r.currentSlide !== n || 0 !== e || "next" !== r.direction))))
            }, r.getTarget = function (e) {
                return r.direction = e, "next" === e ? r.currentSlide === r.last ? 0 : r.currentSlide + 1 : 0 === r.currentSlide ? r.last : r.currentSlide - 1
            }, r.setProps = function (e, t, n) {
                var i, o = (i = e || (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo, -1 * function () {
                    if (p) return "setTouch" === t ? e : f && r.animatingTo === r.last ? 0 : f ? r.limit - (r.itemW + r.vars.itemMargin) * r.move * r.animatingTo : r.animatingTo === r.last ? r.limit : i;
                    switch (t) {
                        case "setTotal":
                            return f ? (r.count - 1 - r.currentSlide + r.cloneOffset) * e : (r.currentSlide + r.cloneOffset) * e;
                        case "setTouch":
                            return e;
                        case "jumpEnd":
                            return f ? e : r.count * e;
                        case "jumpStart":
                            return f ? r.count * e : e;
                        default:
                            return e
                    }
                }() + "px");
                r.transitions && (o = d ? "translate3d(0," + o + ",0)" : "translate3d(" + o + ",0,0)", n = n !== undefined ? n / 1e3 + "s" : "0s", r.container.css("-" + r.pfx + "-transition-duration", n), r.container.css("transition-duration", n)), r.args[r.prop] = o, (r.transitions || n === undefined) && r.container.css(r.args), r.container.css("transform", o)
            }, r.setup = function (t) {
                var n, i;
                h ? (r.slides.css({
                    width: "100%",
                    float: "left",
                    marginRight: "-100%",
                    position: "relative"
                }), "init" === t && (l ? r.slides.css({
                    opacity: 0,
                    display: "block",
                    webkitTransition: "opacity " + r.vars.animationSpeed / 1e3 + "s ease",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    opacity: 1,
                    zIndex: 2
                }) : 0 == r.vars.fadeFirstSlide ? r.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    zIndex: 2
                }).css({
                    opacity: 1
                }) : r.slides.css({
                    opacity: 0,
                    display: "block",
                    zIndex: 1
                }).eq(r.currentSlide).css({
                    zIndex: 2
                }).animate({
                    opacity: 1
                }, r.vars.animationSpeed, r.vars.easing)), r.vars.smoothHeight && g.smoothHeight()) : ("init" === t && (r.viewport = e('<div class="' + a + 'viewport"></div>').css({
                    overflow: "hidden",
                    position: "relative"
                }).appendTo(r).append(r.container), r.cloneCount = 0, r.cloneOffset = 0, f && (i = e.makeArray(r.slides).reverse(), r.slides = e(i), r.container.empty().append(r.slides))), r.vars.animationLoop && !p && (r.cloneCount = 2, r.cloneOffset = 1, "init" !== t && r.container.find(".clone").remove(), r.container.append(g.uniqueID(r.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(g.uniqueID(r.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))), r.newSlides = e(r.vars.selector, r), n = f ? r.count - 1 - r.currentSlide + r.cloneOffset : r.currentSlide + r.cloneOffset, d && !p ? (r.container.height(200 * (r.count + r.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function () {
                    r.newSlides.css({
                        display: "block"
                    }), r.doMath(), r.viewport.height(r.h), r.setProps(n * r.h, "init")
                }, "init" === t ? 100 : 0)) : (r.container.width(200 * (r.count + r.cloneCount) + "%"), r.setProps(n * r.computedW, "init"), setTimeout(function () {
                    r.doMath(), r.newSlides.css({
                        width: r.computedW,
                        marginRight: r.computedM,
                        float: "left",
                        display: "block"
                    }), r.vars.smoothHeight && g.smoothHeight()
                }, "init" === t ? 100 : 0)));
                p || r.slides.removeClass(a + "active-slide").eq(r.currentSlide).addClass(a + "active-slide"), r.vars.init(r)
            }, r.doMath = function () {
                var e = r.slides.first(),
                    t = r.vars.itemMargin,
                    n = r.vars.minItems,
                    i = r.vars.maxItems;
                r.w = r.viewport === undefined ? r.width() : r.viewport.width(), r.h = e.height(), r.boxPadding = e.outerWidth() - e.width(), p ? (r.itemT = r.vars.itemWidth + t, r.itemM = t, r.minW = n ? n * r.itemT : r.w, r.maxW = i ? i * r.itemT - t : r.w, r.itemW = r.minW > r.w ? (r.w - t * (n - 1)) / n : r.maxW < r.w ? (r.w - t * (i - 1)) / i : r.vars.itemWidth > r.w ? r.w : r.vars.itemWidth, r.visible = Math.floor(r.w / r.itemW), r.move = r.vars.move > 0 && r.vars.move < r.visible ? r.vars.move : r.visible, r.pagingCount = Math.ceil((r.count - r.visible) / r.move + 1), r.last = r.pagingCount - 1, r.limit = 1 === r.pagingCount ? 0 : r.vars.itemWidth > r.w ? r.itemW * (r.count - 1) + t * (r.count - 1) : (r.itemW + t) * r.count - r.w - t) : (r.itemW = r.w, r.itemM = t, r.pagingCount = r.count, r.last = r.count - 1), r.computedW = r.itemW - r.boxPadding, r.computedM = r.itemM
            }, r.update = function (e, t) {
                r.doMath(), p || (e < r.currentSlide ? r.currentSlide += 1 : e <= r.currentSlide && 0 !== e && (r.currentSlide -= 1), r.animatingTo = r.currentSlide), r.vars.controlNav && !r.manualControls && ("add" === t && !p || r.pagingCount > r.controlNav.length ? g.controlNav.update("add") : ("remove" === t && !p || r.pagingCount < r.controlNav.length) && (p && r.currentSlide > r.last && (r.currentSlide -= 1, r.animatingTo -= 1), g.controlNav.update("remove", r.last))), r.vars.directionNav && g.directionNav.update()
            }, r.addSlide = function (t, n) {
                var i = e(t);
                r.count += 1, r.last = r.count - 1, d && f ? n !== undefined ? r.slides.eq(r.count - n).after(i) : r.container.prepend(i) : n !== undefined ? r.slides.eq(n).before(i) : r.container.append(i), r.update(n, "add"), r.slides = e(r.vars.selector + ":not(.clone)", r), r.setup(), r.vars.added(r)
            }, r.removeSlide = function (t) {
                var n = isNaN(t) ? r.slides.index(e(t)) : t;
                r.count -= 1, r.last = r.count - 1, isNaN(t) ? e(t, r.slides).remove() : d && f ? r.slides.eq(r.last).remove() : r.slides.eq(t).remove(), r.doMath(), r.update(n, "remove"), r.slides = e(r.vars.selector + ":not(.clone)", r), r.setup(), r.vars.removed(r)
            }, g.init()
        }, e(window).blur(function () {
            t = !1
        }).focus(function () {
            t = !0
        }), e.flexslider.defaults = {
            namespace: "flex-",
            selector: ".slides > li",
            animation: "fade",
            easing: "swing",
            direction: "horizontal",
            reverse: !1,
            animationLoop: !0,
            smoothHeight: !1,
            startAt: 0,
            slideshow: !0,
            slideshowSpeed: 7e3,
            animationSpeed: 600,
            initDelay: 0,
            randomize: !1,
            fadeFirstSlide: !0,
            thumbCaptions: !1,
            pauseOnAction: !0,
            pauseOnHover: !1,
            pauseInvisible: !0,
            useCSS: !0,
            touch: !0,
            video: !1,
            controlNav: !0,
            directionNav: !0,
            prevText: "Previous",
            nextText: "Next",
            keyboard: !0,
            multipleKeyboard: !1,
            mousewheel: !1,
            pausePlay: !1,
            pauseText: "Pause",
            playText: "Play",
            controlsContainer: "",
            manualControls: "",
            customDirectionNav: "",
            sync: "",
            asNavFor: "",
            itemWidth: 0,
            itemMargin: 0,
            minItems: 1,
            maxItems: 0,
            move: 0,
            allowOneSlide: !0,
            start: function () {},
            before: function () {},
            after: function () {},
            end: function () {},
            added: function () {},
            removed: function () {},
            init: function () {}
        }, e.fn.flexslider = function (t) {
            if (t === undefined && (t = {}), "object" == typeof t) return this.each(function () {
                var n = e(this),
                    i = t.selector ? t.selector : ".slides > li",
                    r = n.find(i);
                1 === r.length && !1 === t.allowOneSlide || 0 === r.length ? (r.fadeIn(400), t.start && t.start(n)) : n.data("flexslider") === undefined && new e.flexslider(this, t)
            });
            var n = e(this).data("flexslider");
            switch (t) {
                case "play":
                    n.play();
                    break;
                case "pause":
                    n.pause();
                    break;
                case "stop":
                    n.stop();
                    break;
                case "next":
                    n.flexAnimate(n.getTarget("next"), !0);
                    break;
                case "prev":
                case "previous":
                    n.flexAnimate(n.getTarget("prev"), !0);
                    break;
                default:
                    "number" == typeof t && n.flexAnimate(t, !0)
            }
        }
    }(jQuery),
    function (e) {
        var t = {
            mode: "horizontal",
            slideSelector: "",
            infiniteLoop: !0,
            hideControlOnEnd: !1,
            speed: 500,
            easing: null,
            slideMargin: 0,
            startSlide: 0,
            randomStart: !1,
            captions: !1,
            ticker: !1,
            tickerHover: !1,
            adaptiveHeight: !1,
            adaptiveHeightSpeed: 500,
            video: !1,
            useCSS: !0,
            preloadImages: "visible",
            responsive: !0,
            slideZIndex: 50,
            wrapperClass: "bx-wrapper",
            touchEnabled: !0,
            swipeThreshold: 50,
            oneToOneTouch: !0,
            preventDefaultSwipeX: !0,
            preventDefaultSwipeY: !1,
            ariaLive: !0,
            ariaHidden: !0,
            keyboardEnabled: !1,
            pager: !0,
            pagerType: "full",
            pagerShortSeparator: " / ",
            pagerSelector: null,
            buildPager: null,
            pagerCustom: null,
            controls: !0,
            nextText: "Next",
            prevText: "Prev",
            nextSelector: null,
            prevSelector: null,
            autoControls: !1,
            startText: "Start",
            stopText: "Stop",
            autoControlsCombine: !1,
            autoControlsSelector: null,
            auto: !1,
            pause: 4e3,
            autoStart: !0,
            autoDirection: "next",
            stopAutoOnClick: !1,
            autoHover: !1,
            autoDelay: 0,
            autoSlideForOnePage: !1,
            minSlides: 1,
            maxSlides: 1,
            moveSlides: 0,
            slideWidth: 0,
            shrinkItems: !1,
            onSliderLoad: function () {
                return !0
            },
            onSlideBefore: function () {
                return !0
            },
            onSlideAfter: function () {
                return !0
            },
            onSlideNext: function () {
                return !0
            },
            onSlidePrev: function () {
                return !0
            },
            onSliderResize: function () {
                return !0
            },
            onAutoChange: function () {
                return !0
            }
        };
        e.fn.bxSlider = function (n) {
            if (0 === this.length) return this;
            if (this.length > 1) return this.each(function () {
                e(this).bxSlider(n)
            }), this;
            var r = {},
                o = this,
                a = e(window).width(),
                s = e(window).height();
            if (!e(o).data("bxSlider")) {
                var l = function () {
                        e(o).data("bxSlider") || (r.settings = e.extend({}, t, n), r.settings.slideWidth = parseInt(r.settings.slideWidth), r.children = o.children(r.settings.slideSelector), r.children.length < r.settings.minSlides && (r.settings.minSlides = r.children.length), r.children.length < r.settings.maxSlides && (r.settings.maxSlides = r.children.length), r.settings.randomStart && (r.settings.startSlide = Math.floor(Math.random() * r.children.length)), r.active = {
                            index: r.settings.startSlide
                        }, r.carousel = r.settings.minSlides > 1 || r.settings.maxSlides > 1, r.carousel && (r.settings.preloadImages = "all"), r.minThreshold = r.settings.minSlides * r.settings.slideWidth + (r.settings.minSlides - 1) * r.settings.slideMargin, r.maxThreshold = r.settings.maxSlides * r.settings.slideWidth + (r.settings.maxSlides - 1) * r.settings.slideMargin, r.working = !1, r.controls = {}, r.interval = null, r.animProp = "vertical" === r.settings.mode ? "top" : "left", r.usingCSS = r.settings.useCSS && "fade" !== r.settings.mode && function () {
                            for (var e = document.createElement("div"), t = ["WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"], n = 0; n < t.length; n++)
                                if (e.style[t[n]] !== undefined) return r.cssPrefix = t[n].replace("Perspective", "").toLowerCase(), r.animProp = "-" + r.cssPrefix + "-transform", !0;
                            return !1
                        }(), "vertical" === r.settings.mode && (r.settings.maxSlides = r.settings.minSlides), o.data("origStyle", o.attr("style")), o.children(r.settings.slideSelector).each(function () {
                            e(this).data("origStyle", e(this).attr("style"))
                        }), c())
                    },
                    c = function () {
                        var t = r.children.eq(r.settings.startSlide);
                        o.wrap('<div class="' + r.settings.wrapperClass + '"><div class="bx-viewport"></div></div>'), r.viewport = o.parent(), r.settings.ariaLive && !r.settings.ticker && r.viewport.attr("aria-live", "polite"), r.loader = e('<div class="bx-loading" />'), r.viewport.prepend(r.loader), o.css({
                            width: "horizontal" === r.settings.mode ? 1e3 * r.children.length + 215 + "%" : "auto",
                            position: "relative"
                        }), r.usingCSS && r.settings.easing ? o.css("-" + r.cssPrefix + "-transition-timing-function", r.settings.easing) : r.settings.easing || (r.settings.easing = "swing"), r.viewport.css({
                            width: "100%",
                            overflow: "hidden",
                            position: "relative"
                        }), r.viewport.parent().css({
                            maxWidth: p()
                        }), r.children.css({
                            float: "horizontal" === r.settings.mode ? "left" : "none",
                            listStyle: "none",
                            position: "relative"
                        }), r.children.css("width", h()), "horizontal" === r.settings.mode && r.settings.slideMargin > 0 && r.children.css("marginRight", r.settings.slideMargin), "vertical" === r.settings.mode && r.settings.slideMargin > 0 && r.children.css("marginBottom", r.settings.slideMargin), "fade" === r.settings.mode && (r.children.css({
                            position: "absolute",
                            zIndex: 0,
                            display: "none"
                        }), r.children.eq(r.settings.startSlide).css({
                            zIndex: r.settings.slideZIndex,
                            display: "block"
                        })), r.controls.el = e('<div class="bx-controls" />'), r.settings.captions && C(), r.active.last = r.settings.startSlide === g() - 1, r.settings.video && o.fitVids(), ("all" === r.settings.preloadImages || r.settings.ticker) && (t = r.children), r.settings.ticker ? r.settings.pager = !1 : (r.settings.controls && x(), r.settings.auto && r.settings.autoControls && k(), r.settings.pager && w(), (r.settings.controls || r.settings.autoControls || r.settings.pager) && r.viewport.after(r.controls.el)), u(t, d)
                    },
                    u = function (t, n) {
                        var i = t.find('img:not([src=""]), iframe').length,
                            r = 0;
                        0 !== i ? t.find('img:not([src=""]), iframe').each(function () {
                            e(this).one("load error", function () {
                                ++r === i && n()
                            }).each(function () {
                                (this.complete || "" == this.src) && e(this).trigger("load")
                            })
                        }) : n()
                    },
                    d = function () {
                        if (r.settings.infiniteLoop && "fade" !== r.settings.mode && !r.settings.ticker) {
                            var t = "vertical" === r.settings.mode ? r.settings.minSlides : r.settings.maxSlides,
                                n = r.children.slice(0, t).clone(!0).addClass("bx-clone"),
                                i = r.children.slice(-t).clone(!0).addClass("bx-clone");
                            r.settings.ariaHidden && (n.attr("aria-hidden", !0), i.attr("aria-hidden", !0)), o.append(n).prepend(i)
                        }
                        r.loader.remove(), y(), "vertical" === r.settings.mode && (r.settings.adaptiveHeight = !0), r.viewport.height(f()), o.redrawSlider(), r.settings.onSliderLoad.call(o, r.active.index), r.initialized = !0, r.settings.responsive && e(window).bind("resize", U), r.settings.auto && r.settings.autoStart && (g() > 1 || r.settings.autoSlideForOnePage) && q(), r.settings.ticker && O(), r.settings.pager && j(r.settings.startSlide), r.settings.controls && L(), r.settings.touchEnabled && !r.settings.ticker && R(), r.settings.keyboardEnabled && !r.settings.ticker && e(document).keydown(H)
                    },
                    f = function () {
                        var t = 0,
                            n = e();
                        if ("vertical" === r.settings.mode || r.settings.adaptiveHeight)
                            if (r.carousel) {
                                var o = 1 === r.settings.moveSlides ? r.active.index : r.active.index * v();
                                for (n = r.children.eq(o), i = 1; i <= r.settings.maxSlides - 1; i++) n = o + i >= r.children.length ? n.add(r.children.eq(i - 1)) : n.add(r.children.eq(o + i))
                            } else n = r.children.eq(r.active.index);
                        else n = r.children;
                        return "vertical" === r.settings.mode ? (n.each(function () {
                            t += e(this).outerHeight()
                        }), r.settings.slideMargin > 0 && (t += r.settings.slideMargin * (r.settings.minSlides - 1))) : t = Math.max.apply(Math, n.map(function () {
                            return e(this).outerHeight(!1)
                        }).get()), "border-box" === r.viewport.css("box-sizing") ? t += parseFloat(r.viewport.css("padding-top")) + parseFloat(r.viewport.css("padding-bottom")) + parseFloat(r.viewport.css("border-top-width")) + parseFloat(r.viewport.css("border-bottom-width")) : "padding-box" === r.viewport.css("box-sizing") && (t += parseFloat(r.viewport.css("padding-top")) + parseFloat(r.viewport.css("padding-bottom"))), t
                    },
                    p = function () {
                        var e = "100%";
                        return r.settings.slideWidth > 0 && (e = "horizontal" === r.settings.mode ? r.settings.maxSlides * r.settings.slideWidth + (r.settings.maxSlides - 1) * r.settings.slideMargin : r.settings.slideWidth), e
                    },
                    h = function () {
                        var e = r.settings.slideWidth,
                            t = r.viewport.width();
                        if (0 === r.settings.slideWidth || r.settings.slideWidth > t && !r.carousel || "vertical" === r.settings.mode) e = t;
                        else if (r.settings.maxSlides > 1 && "horizontal" === r.settings.mode) {
                            if (t > r.maxThreshold) return e;
                            t < r.minThreshold ? e = (t - r.settings.slideMargin * (r.settings.minSlides - 1)) / r.settings.minSlides : r.settings.shrinkItems && (e = Math.floor((t + r.settings.slideMargin) / Math.ceil((t + r.settings.slideMargin) / (e + r.settings.slideMargin)) - r.settings.slideMargin))
                        }
                        return e
                    },
                    m = function () {
                        var e = 1,
                            t = null;
                        return "horizontal" === r.settings.mode && r.settings.slideWidth > 0 ? r.viewport.width() < r.minThreshold ? e = r.settings.minSlides : r.viewport.width() > r.maxThreshold ? e = r.settings.maxSlides : (t = r.children.first().width() + r.settings.slideMargin, e = Math.floor((r.viewport.width() + r.settings.slideMargin) / t) || 1) : "vertical" === r.settings.mode && (e = r.settings.minSlides), e
                    },
                    g = function () {
                        var e = 0,
                            t = 0,
                            n = 0;
                        if (r.settings.moveSlides > 0) {
                            if (!r.settings.infiniteLoop) {
                                for (; t < r.children.length;) ++e, t = n + m(), n += r.settings.moveSlides <= m() ? r.settings.moveSlides : m();
                                return n
                            }
                            e = Math.ceil(r.children.length / v())
                        } else e = Math.ceil(r.children.length / m());
                        return e
                    },
                    v = function () {
                        return r.settings.moveSlides > 0 && r.settings.moveSlides <= m() ? r.settings.moveSlides : m()
                    },
                    y = function () {
                        var e, t, n;
                        r.children.length > r.settings.maxSlides && r.active.last && !r.settings.infiniteLoop ? "horizontal" === r.settings.mode ? (e = (t = r.children.last()).position(), b(-(e.left - (r.viewport.width() - t.outerWidth())), "reset", 0)) : "vertical" === r.settings.mode && (n = r.children.length - r.settings.minSlides, e = r.children.eq(n).position(), b(-e.top, "reset", 0)) : (e = r.children.eq(r.active.index * v()).position(), r.active.index === g() - 1 && (r.active.last = !0), e !== undefined && ("horizontal" === r.settings.mode ? b(-e.left, "reset", 0) : "vertical" === r.settings.mode && b(-e.top, "reset", 0)))
                    },
                    b = function (t, n, i, a) {
                        var s, l;
                        r.usingCSS ? (l = "vertical" === r.settings.mode ? "translate3d(0, " + t + "px, 0)" : "translate3d(" + t + "px, 0, 0)", o.css("-" + r.cssPrefix + "-transition-duration", i / 1e3 + "s"), "slide" === n ? (o.css(r.animProp, l), 0 !== i ? o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (t) {
                            e(t.target).is(o) && (o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), D())
                        }) : D()) : "reset" === n ? o.css(r.animProp, l) : "ticker" === n && (o.css("-" + r.cssPrefix + "-transition-timing-function", "linear"), o.css(r.animProp, l), 0 !== i ? o.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function (t) {
                            e(t.target).is(o) && (o.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"), b(a.resetValue, "reset", 0), M())
                        }) : (b(a.resetValue, "reset", 0), M()))) : ((s = {})[r.animProp] = t, "slide" === n ? o.animate(s, i, r.settings.easing, function () {
                            D()
                        }) : "reset" === n ? o.css(r.animProp, t) : "ticker" === n && o.animate(s, i, "linear", function () {
                            b(a.resetValue, "reset", 0), M()
                        }))
                    },
                    _ = function () {
                        for (var t = "", n = "", i = g(), o = 0; o < i; o++) n = "", r.settings.buildPager && e.isFunction(r.settings.buildPager) || r.settings.pagerCustom ? (n = r.settings.buildPager(o), r.pagerEl.addClass("bx-custom-pager")) : (n = o + 1, r.pagerEl.addClass("bx-default-pager")), t += '<div class="bx-pager-item"><a href="" data-slide-index="' + o + '" class="bx-pager-link">' + n + "</a></div>";
                        r.pagerEl.html(t)
                    },
                    w = function () {
                        r.settings.pagerCustom ? r.pagerEl = e(r.settings.pagerCustom) : (r.pagerEl = e('<div class="bx-pager" />'), r.settings.pagerSelector ? e(r.settings.pagerSelector).html(r.pagerEl) : r.controls.el.addClass("bx-has-pager").append(r.pagerEl), _()), r.pagerEl.on("click touchend", "a", A)
                    },
                    x = function () {
                        r.controls.next = e('<a class="bx-next" href="">' + r.settings.nextText + "</a>"), r.controls.prev = e('<a class="bx-prev" href="">' + r.settings.prevText + "</a>"), r.controls.next.bind("click touchend", S), r.controls.prev.bind("click touchend", T), r.settings.nextSelector && e(r.settings.nextSelector).append(r.controls.next), r.settings.prevSelector && e(r.settings.prevSelector).append(r.controls.prev), r.settings.nextSelector || r.settings.prevSelector || (r.controls.directionEl = e('<div class="bx-controls-direction" />'), r.controls.directionEl.append(r.controls.prev).append(r.controls.next), r.controls.el.addClass("bx-has-controls-direction").append(r.controls.directionEl))
                    },
                    k = function () {
                        r.controls.start = e('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + r.settings.startText + "</a></div>"), r.controls.stop = e('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + r.settings.stopText + "</a></div>"), r.controls.autoEl = e('<div class="bx-controls-auto" />'), r.controls.autoEl.on("click", ".bx-start", E), r.controls.autoEl.on("click", ".bx-stop", $), r.settings.autoControlsCombine ? r.controls.autoEl.append(r.controls.start) : r.controls.autoEl.append(r.controls.start).append(r.controls.stop), r.settings.autoControlsSelector ? e(r.settings.autoControlsSelector).html(r.controls.autoEl) : r.controls.el.addClass("bx-has-controls-auto").append(r.controls.autoEl), N(r.settings.autoStart ? "stop" : "start")
                    },
                    C = function () {
                        r.children.each(function () {
                            var t = e(this).find("img:first").attr("title");
                            t !== undefined && ("" + t).length && e(this).append('<div class="bx-caption"><span>' + t + "</span></div>")
                        })
                    },
                    S = function (e) {
                        e.preventDefault(), r.controls.el.hasClass("disabled") || (r.settings.auto && r.settings.stopAutoOnClick && o.stopAuto(), o.goToNextSlide())
                    },
                    T = function (e) {
                        e.preventDefault(), r.controls.el.hasClass("disabled") || (r.settings.auto && r.settings.stopAutoOnClick && o.stopAuto(), o.goToPrevSlide())
                    },
                    E = function (e) {
                        o.startAuto(), e.preventDefault()
                    },
                    $ = function (e) {
                        o.stopAuto(), e.preventDefault()
                    },
                    A = function (t) {
                        var n, i;
                        t.preventDefault(), r.controls.el.hasClass("disabled") || (r.settings.auto && r.settings.stopAutoOnClick && o.stopAuto(), (n = e(t.currentTarget)).attr("data-slide-index") !== undefined && (i = parseInt(n.attr("data-slide-index"))) !== r.active.index && o.goToSlide(i))
                    },
                    j = function (t) {
                        var n = r.children.length;
                        if ("short" === r.settings.pagerType) return r.settings.maxSlides > 1 && (n = Math.ceil(r.children.length / r.settings.maxSlides)), void r.pagerEl.html(t + 1 + r.settings.pagerShortSeparator + n);
                        r.pagerEl.find("a").removeClass("active"), r.pagerEl.each(function (n, i) {
                            e(i).find("a").eq(t).addClass("active")
                        })
                    },
                    D = function () {
                        if (r.settings.infiniteLoop) {
                            var e = "";
                            0 === r.active.index ? e = r.children.eq(0).position() : r.active.index === g() - 1 && r.carousel ? e = r.children.eq((g() - 1) * v()).position() : r.active.index === r.children.length - 1 && (e = r.children.eq(r.children.length - 1).position()), e && ("horizontal" === r.settings.mode ? b(-e.left, "reset", 0) : "vertical" === r.settings.mode && b(-e.top, "reset", 0))
                        }
                        r.working = !1, r.settings.onSlideAfter.call(o, r.children.eq(r.active.index), r.oldIndex, r.active.index)
                    },
                    N = function (e) {
                        r.settings.autoControlsCombine ? r.controls.autoEl.html(r.controls[e]) : (r.controls.autoEl.find("a").removeClass("active"), r.controls.autoEl.find("a:not(.bx-" + e + ")").addClass("active"))
                    },
                    L = function () {
                        1 === g() ? (r.controls.prev.addClass("disabled"), r.controls.next.addClass("disabled")) : !r.settings.infiniteLoop && r.settings.hideControlOnEnd && (0 === r.active.index ? (r.controls.prev.addClass("disabled"), r.controls.next.removeClass("disabled")) : r.active.index === g() - 1 ? (r.controls.next.addClass("disabled"), r.controls.prev.removeClass("disabled")) : (r.controls.prev.removeClass("disabled"), r.controls.next.removeClass("disabled")))
                    },
                    P = function () {
                        o.startAuto()
                    },
                    I = function () {
                        o.stopAuto()
                    },
                    q = function () {
                        if (r.settings.autoDelay > 0) setTimeout(o.startAuto, r.settings.autoDelay);
                        else o.startAuto(), e(window).focus(P).blur(I);
                        r.settings.autoHover && o.hover(function () {
                            r.interval && (o.stopAuto(!0), r.autoPaused = !0)
                        }, function () {
                            r.autoPaused && (o.startAuto(!0), r.autoPaused = null)
                        })
                    },
                    O = function () {
                        var t, n, i, a, s, l, c, u, d = 0;
                        "next" === r.settings.autoDirection ? o.append(r.children.clone().addClass("bx-clone")) : (o.prepend(r.children.clone().addClass("bx-clone")), t = r.children.first().position(), d = "horizontal" === r.settings.mode ? -t.left : -t.top), b(d, "reset", 0), r.settings.pager = !1, r.settings.controls = !1, r.settings.autoControls = !1, r.settings.tickerHover && (r.usingCSS ? (a = "horizontal" === r.settings.mode ? 4 : 5, r.viewport.hover(function () {
                            n = o.css("-" + r.cssPrefix + "-transform"), i = parseFloat(n.split(",")[a]), b(i, "reset", 0)
                        }, function () {
                            u = 0, r.children.each(function () {
                                u += "horizontal" === r.settings.mode ? e(this).outerWidth(!0) : e(this).outerHeight(!0)
                            }), s = r.settings.speed / u, l = "horizontal" === r.settings.mode ? "left" : "top", c = s * (u - Math.abs(parseInt(i))), M(c)
                        })) : r.viewport.hover(function () {
                            o.stop()
                        }, function () {
                            u = 0, r.children.each(function () {
                                u += "horizontal" === r.settings.mode ? e(this).outerWidth(!0) : e(this).outerHeight(!0)
                            }), s = r.settings.speed / u, l = "horizontal" === r.settings.mode ? "left" : "top", c = s * (u - Math.abs(parseInt(o.css(l)))), M(c)
                        })), M()
                    },
                    M = function (e) {
                        var t, n, i = e || r.settings.speed,
                            a = {
                                left: 0,
                                top: 0
                            },
                            s = {
                                left: 0,
                                top: 0
                            };
                        "next" === r.settings.autoDirection ? a = o.find(".bx-clone").first().position() : s = r.children.first().position(), t = "horizontal" === r.settings.mode ? -a.left : -a.top, n = "horizontal" === r.settings.mode ? -s.left : -s.top, b(t, "ticker", i, {
                            resetValue: n
                        })
                    },
                    z = function (t) {
                        var n = e(window),
                            i = {
                                top: n.scrollTop(),
                                left: n.scrollLeft()
                            },
                            r = t.offset();
                        return i.right = i.left + n.width(), i.bottom = i.top + n.height(), r.right = r.left + t.outerWidth(), r.bottom = r.top + t.outerHeight(), !(i.right < r.left || i.left > r.right || i.bottom < r.top || i.top > r.bottom)
                    },
                    H = function (e) {
                        var t = document.activeElement.tagName.toLowerCase(),
                            n = "input|textarea";
                        if (null == new RegExp(t, ["i"]).exec(n) && z(o)) {
                            if (39 === e.keyCode) return S(e), !1;
                            if (37 === e.keyCode) return T(e), !1
                        }
                    },
                    R = function () {
                        r.touch = {
                            start: {
                                x: 0,
                                y: 0
                            },
                            end: {
                                x: 0,
                                y: 0
                            }
                        }, r.viewport.bind("touchstart MSPointerDown pointerdown", B), r.viewport.on("click", ".bxslider a", function (e) {
                            r.viewport.hasClass("click-disabled") && (e.preventDefault(), r.viewport.removeClass("click-disabled"))
                        })
                    },
                    B = function (e) {
                        if (r.controls.el.addClass("disabled"), r.working) e.preventDefault(), r.controls.el.removeClass("disabled");
                        else {
                            r.touch.originalPos = o.position();
                            var t = e.originalEvent,
                                n = "undefined" != typeof t.changedTouches ? t.changedTouches : [t];
                            if ("function" == typeof PointerEvent && t.pointerId === undefined) return;
                            r.touch.start.x = n[0].pageX, r.touch.start.y = n[0].pageY, r.viewport.get(0).setPointerCapture && (r.pointerId = t.pointerId, r.viewport.get(0).setPointerCapture(r.pointerId)), r.viewport.bind("touchmove MSPointerMove pointermove", F), r.viewport.bind("touchend MSPointerUp pointerup", V), r.viewport.bind("MSPointerCancel pointercancel", W)
                        }
                    },
                    W = function () {
                        b(r.touch.originalPos.left, "reset", 0), r.controls.el.removeClass("disabled"), r.viewport.unbind("MSPointerCancel pointercancel", W), r.viewport.unbind("touchmove MSPointerMove pointermove", F), r.viewport.unbind("touchend MSPointerUp pointerup", V), r.viewport.get(0).releasePointerCapture && r.viewport.get(0).releasePointerCapture(r.pointerId)
                    },
                    F = function (e) {
                        var t = e.originalEvent,
                            n = "undefined" != typeof t.changedTouches ? t.changedTouches : [t],
                            i = Math.abs(n[0].pageX - r.touch.start.x),
                            o = Math.abs(n[0].pageY - r.touch.start.y),
                            a = 0,
                            s = 0;
                        3 * i > o && r.settings.preventDefaultSwipeX ? e.preventDefault() : 3 * o > i && r.settings.preventDefaultSwipeY && e.preventDefault(), "fade" !== r.settings.mode && r.settings.oneToOneTouch && ("horizontal" === r.settings.mode ? (s = n[0].pageX - r.touch.start.x, a = r.touch.originalPos.left + s) : (s = n[0].pageY - r.touch.start.y, a = r.touch.originalPos.top + s), b(a, "reset", 0))
                    },
                    V = function (e) {
                        r.viewport.unbind("touchmove MSPointerMove pointermove", F), r.controls.el.removeClass("disabled");
                        var t = e.originalEvent,
                            n = "undefined" != typeof t.changedTouches ? t.changedTouches : [t],
                            i = 0,
                            a = 0;
                        r.touch.end.x = n[0].pageX, r.touch.end.y = n[0].pageY, "fade" === r.settings.mode ? (a = Math.abs(r.touch.start.x - r.touch.end.x)) >= r.settings.swipeThreshold && (r.touch.start.x > r.touch.end.x ? o.goToNextSlide() : o.goToPrevSlide(), o.stopAuto()) : ("horizontal" === r.settings.mode ? (a = r.touch.end.x - r.touch.start.x, i = r.touch.originalPos.left) : (a = r.touch.end.y - r.touch.start.y, i = r.touch.originalPos.top), !r.settings.infiniteLoop && (0 === r.active.index && a > 0 || r.active.last && a < 0) ? b(i, "reset", 200) : Math.abs(a) >= r.settings.swipeThreshold ? (a < 0 ? o.goToNextSlide() : o.goToPrevSlide(), o.stopAuto()) : b(i, "reset", 200)), r.viewport.unbind("touchend MSPointerUp pointerup", V), r.viewport.get(0).releasePointerCapture && r.viewport.get(0).releasePointerCapture(r.pointerId)
                    },
                    U = function () {
                        if (r.initialized)
                            if (r.working) window.setTimeout(U, 10);
                            else {
                                var t = e(window).width(),
                                    n = e(window).height();
                                a === t && s === n || (a = t, s = n, o.redrawSlider(), r.settings.onSliderResize.call(o, r.active.index))
                            }
                    },
                    Q = function (e) {
                        var t = m();
                        r.settings.ariaHidden && !r.settings.ticker && (r.children.attr("aria-hidden", "true"), r.children.slice(e, e + t).attr("aria-hidden", "false"))
                    },
                    X = function (e) {
                        return e < 0 ? r.settings.infiniteLoop ? g() - 1 : r.active.index : e >= g() ? r.settings.infiniteLoop ? 0 : r.active.index : e
                    };
                return o.goToSlide = function (t, n) {
                    var i, a, s, l, c = !0,
                        u = 0,
                        d = {
                            left: 0,
                            top: 0
                        },
                        p = null;
                    if (r.oldIndex = r.active.index, r.active.index = X(t), !r.working && r.active.index !== r.oldIndex) {
                        if (r.working = !0, void 0 !== (c = r.settings.onSlideBefore.call(o, r.children.eq(r.active.index), r.oldIndex, r.active.index)) && !c) return r.active.index = r.oldIndex, void(r.working = !1);
                        "next" === n ? r.settings.onSlideNext.call(o, r.children.eq(r.active.index), r.oldIndex, r.active.index) || (c = !1) : "prev" === n && (r.settings.onSlidePrev.call(o, r.children.eq(r.active.index), r.oldIndex, r.active.index) || (c = !1)), r.active.last = r.active.index >= g() - 1, (r.settings.pager || r.settings.pagerCustom) && j(r.active.index), r.settings.controls && L(), "fade" === r.settings.mode ? (r.settings.adaptiveHeight && r.viewport.height() !== f() && r.viewport.animate({
                            height: f()
                        }, r.settings.adaptiveHeightSpeed), r.children.filter(":visible").fadeOut(r.settings.speed).css({
                            zIndex: 0
                        }), r.children.eq(r.active.index).css("zIndex", r.settings.slideZIndex + 1).fadeIn(r.settings.speed, function () {
                            e(this).css("zIndex", r.settings.slideZIndex), D()
                        })) : (r.settings.adaptiveHeight && r.viewport.height() !== f() && r.viewport.animate({
                            height: f()
                        }, r.settings.adaptiveHeightSpeed), !r.settings.infiniteLoop && r.carousel && r.active.last ? "horizontal" === r.settings.mode ? (d = (p = r.children.eq(r.children.length - 1)).position(), u = r.viewport.width() - p.outerWidth()) : (i = r.children.length - r.settings.minSlides, d = r.children.eq(i).position()) : r.carousel && r.active.last && "prev" === n ? (a = 1 === r.settings.moveSlides ? r.settings.maxSlides - v() : (g() - 1) * v() - (r.children.length - r.settings.maxSlides), d = (p = o.children(".bx-clone").eq(a)).position()) : "next" === n && 0 === r.active.index ? (d = o.find("> .bx-clone").eq(r.settings.maxSlides).position(), r.active.last = !1) : t >= 0 && (l = t * parseInt(v()), d = r.children.eq(l).position()), void 0 !== d && (s = "horizontal" === r.settings.mode ? -(d.left - u) : -d.top, b(s, "slide", r.settings.speed)), r.working = !1), r.settings.ariaHidden && Q(r.active.index * v())
                    }
                }, o.goToNextSlide = function () {
                    if ((r.settings.infiniteLoop || !r.active.last) && 1 != r.working) {
                        var e = parseInt(r.active.index) + 1;
                        o.goToSlide(e, "next")
                    }
                }, o.goToPrevSlide = function () {
                    if ((r.settings.infiniteLoop || 0 !== r.active.index) && 1 != r.working) {
                        var e = parseInt(r.active.index) - 1;
                        o.goToSlide(e, "prev")
                    }
                }, o.startAuto = function (e) {
                    r.interval || (r.interval = setInterval(function () {
                        "next" === r.settings.autoDirection ? o.goToNextSlide() : o.goToPrevSlide()
                    }, r.settings.pause), r.settings.onAutoChange.call(o, !0), r.settings.autoControls && !0 !== e && N("stop"))
                }, o.stopAuto = function (e) {
                    r.interval && (clearInterval(r.interval), r.interval = null, r.settings.onAutoChange.call(o, !1), r.settings.autoControls && !0 !== e && N("start"))
                }, o.getCurrentSlide = function () {
                    return r.active.index
                }, o.getCurrentSlideElement = function () {
                    return r.children.eq(r.active.index)
                }, o.getSlideElement = function (e) {
                    return r.children.eq(e)
                }, o.getSlideCount = function () {
                    return r.children.length
                }, o.isWorking = function () {
                    return r.working
                }, o.redrawSlider = function () {
                    r.children.add(o.find(".bx-clone")).outerWidth(h()), r.viewport.css("height", f()), r.settings.ticker || y(), r.active.last && (r.active.index = g() - 1), r.active.index >= g() && (r.active.last = !0), r.settings.pager && !r.settings.pagerCustom && (_(), j(r.active.index)), r.settings.ariaHidden && Q(r.active.index * v())
                }, o.destroySlider = function () {
                    r.initialized && (r.initialized = !1, e(".bx-clone", this).remove(), r.children.each(function () {
                        e(this).data("origStyle") !== undefined ? e(this).attr("style", e(this).data("origStyle")) : e(this).removeAttr("style")
                    }), e(this).data("origStyle") !== undefined ? this.attr("style", e(this).data("origStyle")) : e(this).removeAttr("style"), e(this).unwrap().unwrap(), r.controls.el && r.controls.el.remove(), r.controls.next && r.controls.next.remove(), r.controls.prev && r.controls.prev.remove(), r.pagerEl && r.settings.controls && !r.settings.pagerCustom && r.pagerEl.remove(), e(".bx-caption", this).remove(), r.controls.autoEl && r.controls.autoEl.remove(), clearInterval(r.interval), r.settings.responsive && e(window).unbind("resize", U), r.settings.keyboardEnabled && e(document).unbind("keydown", H), e(this).removeData("bxSlider"), e(window).off("blur", I).off("focus", P))
                }, o.reloadSlider = function (t) {
                    t !== undefined && (n = t), o.destroySlider(), l(), e(o).data("bxSlider", this)
                }, l(), e(o).data("bxSlider", this), this
            }
        }
    }(jQuery), $(".hero_element_scrolling-btn").click(function () {
        $("html,body").animate({
            scrollTop: $(".zahn__comparison--large").offset().top + 130
        }, "slow")
    }), $(".hero_element_scrolling-btn-mob").click(function () {
        $("html,body").animate({
            scrollTop: $(".slides").offset().top + 100
        }, "slow")
    }),
    function () {
        function e() {
            $(".category-ratings--additional").slideDown()
        }

        function t() {
            $(".category-ratings--additional").slideUp()
        }
        if ($(".category-ratings").length) {
            var n = !1;
            $(".category-ratings--toggle").click(function (i) {
                i.preventDefault(), n ? ($(this).removeClass("show-more"), t()) : ($(this).addClass("show-more"), e()), n = !n
            })
        }
    }(),
    function () {
        function e(e) {
            for (var t = e; t >= 0; t--) {
                var n = $("#" + t + "_digit_mam");
                n.text("0"), n.removeClass("miles_calculator__calculation__digit--digit_with_value")
            }
        }
        var t = 0,
            n = 0;
        $("#insurances_for_miles_and_more li .miles_calculator__card").click(function () {
            window.track({
                event: "insurance_card_clicked"
            });
            var i = $(this).find(".miles_calculator__card__bottom");
            i.hasClass("miles_calculator__card__bottom--toggled") ? t -= n : t += n, i.toggleClass("miles_calculator__card__bottom--toggled"), $(this).find(".miles_calculator__card__top__check").toggleClass("miles_calculator__card__top__check--toggled"), $(this).find(".miles_calculator__card__bottom__text").toggleClass("miles_calculator__card__bottom__text--toggled");
            var r = t.toString(),
                o = 0;
            switch (r.length) {
                case 1:
                    e(4);
                    break;
                case 2:
                    e(3);
                    break;
                case 3:
                    e(2);
                    break;
                case 4:
                    e(1);
                    break;
                case 5:
                    e(0)
            }
            if (1 !== r.length && "0" !== t)
                for (var a = 4; a >= 0; a--) {
                    var s = $("#" + a + "_digit_mam");
                    if (s.text(r[r.length - 1 - o]), s.hasClass(".miles_calculator__card__bottom__text--digit_with_value") || s.addClass("miles_calculator__calculation__digit--digit_with_value"), ++o === r.length) break
                }
        }), $(document).ready(function () {
            (n = parseInt($("#milesDiff").text()), "ontouchstart" in window || navigator.maxTouchPoints) || $(this).find(".miles_calculator__card__bottom").addClass("miles_calculator__card__bottom__hover")
        }), $(".miles_calculator__bottom__cta-section__cta").click(function () {
            window.track({
                event: "miles_calculator_cta_clicked"
            })
        })
    }(),
    function () {
        function e(e, t) {
            return e.find("[index=" + t + "]")
        }

        function t(e, t) {
            return e.find(".answer[for=" + t + "]")
        }
        $(".category-tab_presenter").length && $(".tab_presenter_item").click(function () {
            var n = $(this),
                i = n.parents(".category-tab_presenter--desktop"),
                r = parseInt(n.attr("index")),
                o = parseInt(i.find(".tab_presenter_item.active").attr("index"));
            r !== o && (e(i, o).removeClass("active"), e(i, r).addClass("active"), t(i, o).fadeOut(150, function () {
                t(i, r).fadeIn(150)
            }), o = r)
        })
    }(), window.clark = window.clark || {}, window.clark.track_with_promise = function (e, t, n, i) {
        var r = null;
        (t = t || {}).callback_id = Date.now(), ahoy.track(e, t);
        var o = function () {
                $(document).off("ajaxSuccess", a), $(document).off("ajaxError", a)
            },
            a = function (e, a, s) {
                var l = JSON.parse(s.data);
                l.events[0] && (l.events[0].properties.callback_id === t.callback_id && (i && i(n), window.clearTimeout(r), o()))
            };
        $(document).on("ajaxSuccess", a), $(document).on("ajaxError", a), r = setTimeout(i.bind(this, n), 3e3)
    },
    function () {
        var e = {
            ".ahoy_logo_header": "click_logo_header",
            ".ahoy_logo_footer": "click_logo_footer"
        };
        $(document).ready(function () {
            for (var t in e) 0 !== $(t).length && function (e) {
                $(t).click(function () {
                    window.track({
                        event: e
                    })
                })
            }(e[t])
        })
    }(), $(document).ready(function () {
        if (0 !== $(".install-app-banner").length) {
            var e = "showInstallAppBanner",
                t = "with-install-app-banner--visible",
                n = $("body");
            "false" !== window.clark.localStorage.getItem(e) && (n.addClass(t), $(".install-app-banner__close-icon").click(function (i) {
                i.preventDefault(), n.removeClass(t), window.clark.localStorage.setItem(e, !1)
            }))
        }
    }),
    function () {
        function e() {
            var e, t = this,
                n = {
                    ACCEPT: {
                        UNCOLLAPSED: "customer/tracking/accept:uncollapsed",
                        COLLAPSED: "customer/tracking/accept:collapsed",
                        CLOSE: "customer/tracking/accept:close"
                    },
                    MORE_INFORMATION: "customer/tracking/information:visit",
                    BANNER_LOADED: "customer/tracking/load:initial",
                    MARKETING: {
                        ACTIVATE: "customer/tracking/marketing:activate",
                        DEACTIVATE: "customer/tracking/marketing:deactivate"
                    }
                },
                i = 730,
                r = "opt_in_tracking_cookies",
                o = "opt_out_tracking_cookies",
                a = "hide-cookies-banner",
                s = "tracking-analytics",
                l = "tracking-marketing",
                c = "tracking-set-at",
                u = !1,
                d = !1,
                f = !1;
            this.refs = {
                containerEl: ".cookies-banner__container",
                formEl: ".cookies-banner__container form",
                collapseEl: ".cookies-banner__collapse",
                closeIconEl: ".cookies-banner__close-icon",
                configureButtonEl: ".cookies-banner__configure",
                retriggerButtonEl: ".cookies-banner__retrigger",
                marketingInputEl: 'input[name="tracking-marketing"]',
                moreInfoEl: ".cookies-banner__more-information",
                footerLink: ".page-footer_cookie_banner"
            }, this.setTrackService = function (e) {
                t.track = e || window.track
            }, this.init = function () {
                if (!t.isAdminPage()) return t.setElementsRefs(), t.setTrackService(), t.refs.containerEl && t.doBannerJS(), t
            }, this.isAdminPage = function () {
                return null !== location.href.match(/\/admin($|\/)/)
            }, this.setElementsRefs = function () {
                var e = this;
                Object.keys(this.refs).forEach(function (t) {
                    e.refs[t] = document.querySelector(e.refs[t])
                })
            }, this.on = function (e, t, n = "click") {
                e && e.addEventListener && e.addEventListener(n, t)
            }, this.addEventListeners = function () {
                this.on(t.refs.configureButtonEl, t.handleToggleCollapse), this.on(t.refs.retriggerButtonEl, t.handleRetriggerButton), this.on(t.refs.closeIconEl, t.handleClickCloseIcon), this.on(t.refs.moreInfoEl, t.handleMoreInformation), this.on(t.refs.marketingInputEl, t.handleToggleMarketing), this.on(t.refs.formEl, t.handleClickOk, "submit"), this.on(t.refs.footerLink, t.handleClickFooterLink)
            }, this.sawBanner = function () {
                var e = t.getCookie(a);
                return e || (t.addCookie(a, !1), e = !1), "true" === e
            }, this.doBannerJS = function () {
                t.addEventListeners(), t.fetchSettings()
            }, this.handleToggleBanner = function () {
                t.sawBanner() && t.setCurrentValues(), t.refs.containerEl.classList.contains("hidden") ? t.refs.containerEl.classList.remove("hidden") : t.refs.containerEl.classList.add("hidden")
            }, this.handleHideBanner = function () {
                t.setShowBannerCookie(), t.refs.containerEl.classList.add("hidden")
            }, this.handleToggleCollapse = function (e) {
                u = !0, e && (e.preventDefault(), e.stopPropagation()), t.sawBanner() || (t.refs.marketingInputEl.checked = undefined), t.refs.collapseEl.classList.contains("hidden") ? (t.handleShowCollapse(), t.refs.configureButtonEl.classList.add("active")) : (t.handleHideCollapse(), t.refs.configureButtonEl.classList.remove("active"))
            }, this.handleHideCollapse = function () {
                this.refs.collapseEl.classList.contains("hidden") || this.refs.collapseEl.classList.add("hidden")
            }, this.handleClickFooterLink = function (e) {
                e.preventDefault(), e.stopPropagation(), t.handleToggleBanner()
            }, this.handleShowCollapse = function () {
                this.refs.collapseEl.classList.contains("hidden") && this.refs.collapseEl.classList.remove("hidden")
            }, this.handleMoreInformation = function (e) {
                window.open(e.currentTarget.dataset.url || "/de/datenschutz", "_blank")
            }, this.handleClickCloseIcon = function (e) {
                e && (e.preventDefault(), e.stopPropagation()), u || d || (t.refs.marketingInputEl.checked = !1), t.track({
                    event: n.ACCEPT.CLOSE
                }), t.optIn(), t.updateCookiesToApi()
            }, this.handleToggleMarketing = function (e) {
                t.track({
                    event: e.target.checked ? n.MARKETING.ACTIVATE : n.MARKETING.DEACTIVATE
                })
            }, this.handleClickOk = function (e) {
                e && (e.preventDefault(), e.stopPropagation()), t.track({
                    event: r
                }), t.track({
                    event: t.refs.collapseEl.classList.contains("hidden") ? n.ACCEPT.COLLAPSED : n.ACCEPT.UNCOLLAPSED
                }), t.optIn(), t.updateCookiesToApi()
            }, this.handleRetriggerButton = function () {
                t.handleToggleBanner()
            }, this.optIn = function () {
                t.setNewValues(), t.setShowBannerCookie(), t.handleHideCollapse(), t.handleHideBanner()
            }, this.reduceFormInputsToObject = function (e, t) {
                return e[t.name] = "on" === t.value, e
            }, this.setCurrentValues = function () {
                var e = "true" === this.getCookie(l);
                d = e, this.refs.marketingInputEl.checked = e
            }, this.setNewValues = function () {
                var e = !!this.refs.marketingInputEl.checked;
                this.addCookie(s, !0), this.addCookie(l, e), this.addCookie(c, (new Date).toISOString())
            }, this.setShowBannerCookie = function () {
                var e = !(arguments.length > 0 && arguments[0] !== undefined) || arguments[0];
                this.addCookie(a, e)
            }, this.track = function (e) {
                t.track && t.track(e)
            }, this.optOutViaURL = function () {
                t.track({
                    event: o
                }), t.setShowBannerCookie(), t.handleHideBanner()
            }, this.fetchSettings = function () {
                $.ajax({
                    type: "GET",
                    beforeSend: function (e) {
                        e.setRequestHeader("Accept", "application/vnd.clark-v5+json")
                    },
                    url: "/api/customer/current/privacy_settings",
                    data: {},
                    success: function (i) {
                        i.data && i.data.attributes && (e = i.data.attributes.thirdPartyTracking, f = !0, e && t.updateCookiesFromAPI(!0, e.enabled, e.accepted_at, e.valid_until)), t.sawBanner() || (t.handleToggleBanner(), t.track({
                            event: n.BANNER_LOADED
                        }))
                    },
                    error: function (e, i, r) {
                        console.error(r), t.sawBanner() || (t.handleToggleBanner(), t.track({
                            event: n.BANNER_LOADED
                        }))
                    }
                })
            }, this.updateCookiesFromAPI = function (e, n, i, r) {
                t.addCookie(s, e, r), t.addCookie(l, n, r), t.addCookie(c, i, r), t.addCookie(a, !0)
            }, this.updateCookiesToApi = function () {
                var e = this.getCookie(l),
                    n = this.getCookie(c);
                f ? $.ajax({
                    type: "POST",
                    beforeSend: function (e) {
                        e.setRequestHeader("Accept", "application/vnd.clark-v5+json")
                    },
                    url: "/api/customer/current/privacy_settings",
                    data: {
                        third_party_tracking: {
                            enabled: e,
                            accepted_at: n
                        }
                    },
                    success: function () {
                        t.onAfterUpdateApiReload()
                    },
                    error: function () {
                        t.onAfterUpdateApiReload()
                    }
                }) : t.onAfterUpdateApiReload()
            }, this.onAfterUpdateApiReload = function () {
                setTimeout(function () {
                    window.location.reload()
                }, 50)
            }, this.showErrorState = function () {
                document.querySelector(".cookies-banner__copy--error").classList.remove("hidden"), document.querySelector(".cookies-banner__copy--standard").classList.add("hidden")
            }, this.addCookie = function (e, t, n) {
                var r = new Date;
                r.setTime(r.getTime() + 864e5 * i), n && (r = new Date(n)), document.cookie = e + "=" + t + ";path=/;expires=" + r.toUTCString()
            }, this.getCookie = function (e) {
                var t = document.cookie.match("(^|;) ?" + e + "=([^;]*)(;|$)");
                return t ? t[2] : null
            }, this.delCookie = function (e) {
                t.setCookie(e, "", -1)
            }, window.addEventListener("DOMContentLoaded", this.init)
        }
        window.CookieBuddy = new e
    }(), window.DynamicCookieBanner = new DynamicCookieBanner,
    function () {
        function e() {
            (v = document.querySelector(".request-appointment__cta")).disabled = !0, d(), m = document.getElementById("request-appointment-terms-error"), g = document.getElementById("request-appointment-general-error"), y = document.getElementById("request-appointment-api-error"), b = [m, g, y], document.querySelector(".request-appointment__form").addEventListener("submit", t), document.getElementById("closeConfirmationModal").addEventListener("click", h)
        }

        function t(e) {
            e.preventDefault(), document.getElementById("request-app-terms-checkbox").checked ? (p(), v.disabled = !0, _ ? o() : s()) : f(m)
        }

        function n() {
            $.each($(".request-appointment__form").serializeArray(), function (e, t) {
                w[t.name] = t.value
            }), _ && (w.id = _.mandate.id), delete w.terms
        }

        function i() {
            w = {
                id: _.mandate.id,
                first_name: _.mandate.first_name,
                last_name: _.mandate.last_name,
                phone: _.mandate.phone,
                email: _.email,
                gender: _.mandate.gender
            }, Object.keys(w).forEach(function (e) {
                var t = document.querySelector('input[name="' + e + '"');
                t && (t.value = w[e])
            }), document.getElementById("request-appointment-gender").value = w.gender
        }

        function r() {
            var e = document.querySelectorAll('.request-appointment__form input[type="text"]');
            [].forEach.call(e, function (e) {
                e.value = ""
            }), document.querySelector('.request-appointment__form input[type="email"]').value = "", document.getElementById("request-appointment-gender").value = "male"
        }

        function o() {
            n(), $.ajax({
                type: "PUT",
                beforeSend: function (e) {
                    e.setRequestHeader("Accept", "application/vnd.clark-v2+json")
                },
                url: "/api/mandates/" + w.id + "/non_binding_appointment",
                data: w,
                success: function () {
                    window.track && window.track({
                        event: x
                    }), p(), r(), h(), v.disabled = !1
                },
                error: function (e) {
                    v.disabled = !1;
                    var t = JSON.parse(e.responseText);
                    t.errors && t.errors.mandate ? a(t.errors.mandate) : (console.error(t), f(g))
                }
            })
        }

        function a(e) {
            var t = "<span>";
            Object.keys(e).forEach(function (n) {
                t += e[n]
            }), t += "</span>", y.innerHTML = t, f(y)
        }

        function s() {
            $.ajax({
                type: "POST",
                beforeSend: function (e) {
                    e.setRequestHeader("Accept", "application/vnd.clark-v2+json")
                },
                data: {
                    adjust: l()
                },
                url: "/api/anonymous_lead",
                success: function (e) {
                    _ = e.lead, o()
                },
                error: function (e, t, n) {
                    console.error(n), f(g)
                }
            })
        }

        function l() {
            var e = {
                network: "Organic",
                campaign: "",
                creative: ""
            };
            return e = c("utm_creative", "creative", e = c("utm_campaign", "campaign", e = c("utm_source", "network", e)))
        }

        function c(e, t, n) {
            var i = u(e, window.location.href);
            return i && (n[t] = i), n
        }

        function u(e, t) {
            if (!t) return !1;
            e = e.replace(/[\[\]]/g, "\\$&");
            var n = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
            return !!n && (!!n[2] && decodeURIComponent(n[2].replace(/\+/g, " ")))
        }

        function d() {
            $.ajax({
                type: "GET",
                beforeSend: function (e) {
                    e.setRequestHeader("Accept", "application/vnd.clark-v2+json")
                },
                url: "/api/current_user",
                success: function (e) {
                    v.disabled = !1, _ = e.user || e.lead, i()
                },
                error: function () {
                    v.disabled = !1
                }
            })
        }

        function f(e) {
            e.classList.remove("request-appointment__form__error--hidden")
        }

        function p() {
            b.forEach(function (e) {
                e.classList.add("request-appointment__form__error--hidden")
            })
        }

        function h() {
            document.getElementById("confirmationModal").classList.toggle("ember-modal--visible"), document.querySelector("body").classList.toggle("modal-open")
        }
        var m, g, v, y, b, _, w = {},
            x = "request_callback_submission";
        $(document).ready(function () {
            document.querySelector(".request-appointment") && e()
        })
    }(), $(document).ready(function () {
        var e = document.querySelectorAll(".scroll-bottom-cta");
        [].forEach.call(e, function (e) {
            e.addEventListener("click", function (e) {
                return e.preventDefault(), e.stopPropagation(), $("html, body").animate({
                    scrollTop: $(".page-main section:last-of-type").offset().top - 60
                }, 300), !1
            })
        })
    }),
    function () {
        function e() {
            s.playVideo && (window.track({
                event: "click_cms_video_start"
            }), n(), s.playVideo())
        }

        function t() {
            s.stopVideo && (n(), s.stopVideo())
        }

        function n() {
            u.classList.toggle("hidden"), d.classList.toggle("hidden")
        }

        function i() {
            if ("undefined" == typeof YT || "undefined" == typeof YT.Player) {
                var e = document.createElement("script");
                e.src = "https://www.youtube.com/iframe_api";
                var t = document.getElementsByTagName("script")[0];
                t.parentNode.insertBefore(e, t), window.onYouTubePlayerAPIReady = function () {
                    r()
                }
            } else r()
        }

        function r() {
            s = new YT.Player("ytplayerEmbed", {
                height: "490",
                videoId: l.dataset.id,
                frameborder: "0",
                gesture: "media",
                allowfullscreen: "",
                host: parseInt(l.dataset.nocookies) ? "https://www.youtube-nocookie.com" : "https://www.youtube.com",
                playerVars: {
                    controls: parseInt(l.dataset.controls),
                    showinfo: 0,
                    rel: 0,
                    showsearch: 0,
                    iv_load_policy: 3,
                    enablejsapi: 1,
                    autoplay: 0,
                    loops: parseInt(l.dataset.loops),
                    modestbranding: 0
                },
                events: {
                    onError: o,
                    onStateChange: a
                }
            }), c.addEventListener("click", e), f.addEventListener("click", t)
        }

        function o() {}

        function a(e) {
            e.data == YT.PlayerState.ENDED && t()
        }
        var s, l = document.getElementById("ytplayerEmbed"),
            c = document.querySelector(".youtube_video__banner__play"),
            u = document.querySelector(".youtube_video__banner"),
            d = document.querySelector(".youtube_video__video-container"),
            f = document.querySelector(".youtube_video__video-container__close");
        $(document).ready(function () {
            l && c && u && d && i()
        })
    }(),
    function () {
        $(function () {
            return $("#reSendConfirmation").click(function () {
                return $.ajax($(this).attr("data-url"), {
                    type: "POST",
                    error: function (e, t) {
                        return console.log("AJAX Error: " + t)
                    },
                    success: function () {
                        return $(".insurances__email-item__cta").remove(), $(".insurances__email-item__descr--sent").show(), $(".insurances__email-item__descr--not-sent").hide()
                    }
                })
            })
        })
    }.call(this),
    function () {
        $(function () {
            $(".list__item--dismiss").click(function () {
                return window.setCookie("dashboard_indicator", "false", 356), $(this).parent().slideUp()
            })
        })
    }.call(this),
    function () {
        var e, t, n, i, r, o, a, s, l, c, u;
        r = [], i = [], e = [], n = [], c = "manage_with_clark", $(function () {
            var t, i, r, a, d, f, p, h, m;
            if ((i = $(".manage-with-clark__categories__category")).length > 0 && ($(".btn-primary").click(function (e) {
                    return e.preventDefault(), !$(this).attr("disabled") && (o(), $("#createInquiries").submit())
                }), (t = $(".manage-with-clark__list")).length > 0 && (t.slideUp(), $(".manage-with-clark__categories__toggle-benefits__cta").click(function () {
                    return $(".manage-with-clark__categories__toggle-benefits").toggleClass("manage-with-clark__categories__toggle-benefits--active"), t.slideToggle()
                })), i.each(function () {
                    var e, t, n;
                    if (n = $(this).parent().attr("id"), t = window.sessionData.getAttr(c, n, !1)) return e = $(this).parent().find(".answers__inner"), $(this).parent().addClass("answers__item--active"), t.forEach(function (t) {
                        return e.append("<li class='flex flex__column flex--center manage-with-clark__categories__company__item'> <a data-category-id='" + n + "' data-company-id='" + t.company_id + "' class='btn btn-outline manage-with-clark__categories__company'> " + t.company_name + " <i class='manage-with-clark__categories__company__icon'></i> </a> <a class='btn btn--text btn--text-underline manage-with-clark__categories__company__number-link " + (t.product_number ? "manage-with-clark__categories__company__number-link--hidden" : "") + "'>Versicherungsnummer parat?</a> <input type='text' placeholder='Versicherungsnummer' value='" + (t.product_number || "") + "' class='form-list__item__input manage-with-clark__categories__company__number " + (t.product_number ? "manage-with-clark__categories__company__number--visible" : "") + "' data-category-id='" + n + "' data-company-id='" + t.company_id + "' /> </li>")
                    })
                }), $(".btn-primary").attr("disabled", 0 === $(".manage-with-clark__categories__company").length), h = void 0, m = function () {
                    var e, t, n, i, r;
                    return t = (e = this).attr("data-category-id"), i = e.attr("data-company-id"), r = "" === e.val() ? null : e.val(), (n = window.sessionData.getAttr(c, t, !1)).some(function (e) {
                        if (i === e.company_id) return e.product_number = r, !0
                    }), window.sessionData.setAttr(c, t, n), $(".manage-with-clark__categories__company__number").attr("disabled", !1), e.parent().removeClass("manage-with-clark__categories__company__item--saving"), e.parent().addClass("manage-with-clark__categories__company__item--saved"), window.setTimeout(function () {
                        return $(this).parent().removeClass("manage-with-clark__categories__company__item--saved")
                    }.bind(e), 500)
                }, $(".manage-with-clark__categories__company__number").on("keydown change", function () {
                    return $(".manage-with-clark__categories__company__number").not($(this)).attr("disabled", "disabled"), $(this).parent().addClass("manage-with-clark__categories__company__item--saving"), window.clearTimeout(h), h = window.setTimeout(m.bind($(this)), 2e3)
                }), $(".manage-with-clark__categories__company__number").blur(function () {
                    return window.clearTimeout(h), m.call($(this))
                }), $(".manage-with-clark__categories__company__number-link").click(function () {
                    return $(this).next().addClass("manage-with-clark__categories__company__number--visible"), $(this).hide()
                }), $(".manage-with-clark__categories__company__icon").click(function () {
                    var e, t, n;
                    return n = (e = $(this).parent()).attr("data-category-id"), (t = window.sessionData.getAttr(c, n, !1)) && (0 !== (t = l(t, e.attr("data-company-id"))).length ? window.sessionData.setAttr(c, n, t) : (window.sessionData.setAttr(c, n, "delete"), $("#" + n).removeClass("answers__item--active"))), e.parent().remove(), $(".btn-primary").attr("disabled", 0 === $(".manage-with-clark__categories__company").length)
                })), (e = $(".manage-with-clark__companies__company")).length > 0 && (d = $(".manage-with-clark__companies").attr("data-category-id"), f = window.sessionData.getAttr(c, d, []), $(".btn-primary").click(function (e) {
                    return e.preventDefault(), !$(this).attr("disabled") && (window.sessionData.setAttr(c, d, f), window.location = $(this).attr("data-path"))
                }), a = "manage-with-clark__companies__company--active", p = function () {
                    return $(".btn-primary").attr("disabled", 0 === $("." + a).length)
                }, e.each(function (e, t) {
                    var i, r, o;
                    o = this, r = $(t).attr("data-company-name"), i = $(t).attr("data-company-id"), n.push(r), u(r), f.forEach(function (e) {
                        e.company_id === i && $(o).addClass(a)
                    })
                }), p(), $("#search_input").keyup(function () {
                    return s($(this).val())
                }), e.click(function () {
                    var e, t;
                    return $(this).toggleClass(a), e = $(this).attr("data-company-id"), $(this).hasClass(a) ? (t = {
                        company_name: $(this).attr("data-company-name"),
                        company_id: e,
                        product_number: null
                    }, f.push(t)) : f = l(f, e), p()
                })), $(".manage-with-clark__confirm").length > 0 && window.sessionData.deleteAll(c), $(".manage-with-clark__missing").length > 0) return (r = $(".manage-with-clark__missing__confirmed")).hide(), $(".manage-with-clark__missing__submit").click(function (e) {
                return e.preventDefault(), window.Validate.removeErrors(), "" === $("#missingCompany").val() ? (window.Validate.setErrorOnInput("missingCompany", "Bitte Gesellschaft eintragen."), !1) : $.ajax($(this).attr("data-post-path"), {
                    type: "POST",
                    data: {
                        company_missing: $("#missingCompany").val()
                    },
                    error: function (e, t, n) {
                        return window.Validate.setErrorOnInput("missingCompany", "" + n)
                    },
                    success: function () {
                        return r.show(), $(".manage-with-clark__missing__unconfirmed").hide()
                    }
                })
            })
        }), o = function () {
            var e, t, n, i, r, o, a, s, l, u, d, f, p;
            for (r in (e = $("#inquiries")).empty(), p = {}, d = window.sessionData.getData(c))
                for (s = 0, l = (i = d[r]).length; s < l; s++) p[u = (o = i[s]).company_id] || (p[u] = []), p[o.company_id].push({
                    id: r,
                    product_number: o.product_number
                });
            for (a in f = [], p) t = p[a], e.append("<input type='hidden' name='inquiries[][company_id]' value='" + a + "' />"), f.push(function () {
                var i, r, o;
                for (o = [], i = 0, r = t.length; i < r; i++) n = t[i], e.append("<input type='hidden' name='inquiries[][inquiry_categories_attributes][][category_id]' value='" + n.id + "' />"), o.push(e.append("<input type='hidden' name='inquiries[][inquiry_categories_attributes][][product_number]' value='" + n.product_number + "' />"));
                return o
            }());
            return f
        }, l = function (e, t) {
            var n;
            for (n = 0; n < e.length;) e[n].company_id === t && e.splice(n, 1), n++;
            return e
        }, a = function (e, n) {
            var i, r, o;
            return !!((o = (r = e.toLowerCase()).split(" ")).length > 1 && t(o, n)) || (!!((i = r.split("")).length > 1 && t(i, n)) || new RegExp("^" + e, "i").test(n))
        }, t = function (e, t) {
            var n;
            return n = !0, e.forEach(function (e) {
                var r;
                if (r = e.length > 1 ? e.charAt(0) : e, -1 === i[t].indexOf(r)) return n = !1
            }), n
        }, u = function (e) {
            (r = e.split(" ")).length > 1 ? (i[e] = [], r.forEach(function (t) {
                i[e].push(t.charAt(0).toLowerCase())
            })) : i[e] = [e.charAt(0).toLowerCase()]
        }, s = function (t) {
            var i, r;
            if ("" !== t) {
                for (i = 0, r = []; i < n.length;) a(t, n[i]) ? $(e[i]).show() : $(e[i]).hasClass("manage-with-clark__companies__company--active") || $(e[i]).hide(), r.push(i++);
                return r
            }
            e.show()
        }
    }.call(this),
    function () {
        var e, t, n;
        $(function () {
            var e, n, i, r;
            if (i = $("#choose_modal"), e = $("#abort_modal"), n = $("body"), r = function (e, t) {
                    if ($(t.target)[0] === e[0] || $(t.target).hasClass("modal__close") || $(t.target).hasClass("modal__close-btn")) return e.removeClass("modal--visible"), n.removeClass("prevent-scrolling")
                }, i.length || e.length) return $(".btn--abort").on("click", function (t) {
                return t.preventDefault(), e.addClass("modal--visible"), n.addClass("prevent-scrolling")
            }), $(".btn--choose").on("click", function (e) {
                return e.preventDefault(), i.addClass("modal--visible"), n.addClass("prevent-scrolling"), i.find(".offer").html($(this).data("choose")), i.find(".hidden_id").val($(this).data("option-id"))
            }), i.on("click", r.bind(this, i)), e.on("click", r.bind(this, e)), t(), $(window).resize(t)
        }), e = function () {
            var e, t, n, i;
            return (i = $(".header .col")).removeClass("active"), i.removeClass("spacer"), n = $(this).index(), $(this).addClass("active"), $(".active").removeClass("active"), $(".col_" + n).addClass("active"), e = $(".recommended_background"), t = $(".recommended_background p"), 2 === n ? ($(".row_0 .col_2").addClass("spacer"), e.removeClass("normal"), e.addClass("recommend"), t.removeClass("hidden")) : (e.removeClass("recommend"), e.addClass("normal"), t.addClass("hidden"))
        }, t = function () {
            var t, i, r;
            return n(), t = $(".recommended_background"), i = $(".recommended_background p"), r = $(".header .col"), "0px" !== t.css("left") ? (r.off("click", e), t.removeClass("normal"), t.addClass("recommend"), i.removeClass("hidden"), $(".row_0 .col_2").addClass("spacer")) : (r.on("click", e), $(".col_2").hasClass("active") ? void 0 : (i.addClass("hidden"), $(".row_0 .col_2").removeClass("spacer")))
        }, n = function () {
            var e;
            return e = $(".row_1").outerHeight(!0) + $(".row_2").outerHeight(!0) + $(".row_3").outerHeight(), $(".box").css("height", e)
        }
    }.call(this),
    function () {}.call(this),
    function () {}.call(this),
    function () {
        $(function () {
            var e, t, n, i, r, o, a, s, l, c, u;
            return t = $(".bot-chat__message-box"), i = $(".toggle_all_messages"), e = $(".bot-chat__message-box__footer__rating"), n = $(".bot-chat__answer-box"), i.on("click", function () {
                return t.addClass("bot-chat__message-box--show"), $(this).remove()
            }), l = void 0, u = !1, c = !1, $(".modal").on("click", function (e) {
                if ($(e.target)[0] === $(this)[0] || $(e.target).hasClass("modal__close")) return $("body").removeClass("modal-open"), $(this).removeClass("modal--visible")
            }), $(".modal-toggle").on("click", function (e) {
                return e.preventDefault(), $("#" + $(this).attr("data-modal")).toggleClass("modal--visible"), $("body").toggleClass("modal-open")
            }), r = function () {
                var e, t, n, i, r, o, a;
                if (e = $(".product_details__stats__graphs__item__bar-chart__bars__bar__block"), t = $(".product_details__stats__graphs__item__bar-chart__bars__bar__value em"), 2 === e.length) return a = [parseInt($(e[0]).attr("data-value")), parseInt($(e[1]).attr("data-value"))], i = [], r = 1e3, n = Math.max(a[0], a[1]), i.push(a[0] / n * 100), i.push(a[1] / n * 100), o = parseInt(a[0] / 20), window.animateNumbers(0, a[0], $(t[0]), r, o), $(e[0]).css("height", i[0]), setTimeout(function () {
                    var n;
                    if (o = parseInt(a[1] / 20), window.animateNumbers(0, a[1], $(t[1]), r, o), $(e[1]).css("height", i[1]), a[1] > a[0]) return n = 10 * i[0], setTimeout(function () {
                        return $(e[1]).addClass("product_details__stats__graphs__item__bar-chart__bars__bar__block--over-paying"), $($(".product_details__stats__graphs__item__bar-chart__icons__icon")[1]).addClass("product_details__stats__graphs__item__bar-chart__icons__icon--over-paying")
                    }, n)
                }, r)
            }, o = function () {
                var e, t, n;
                if (0 !== (e = $("#map-svg")).length) return n = e.attr("data-value"), t = 2e3, window.animateNumbers(0, n, $(".product_details__stats__graphs__item__map__percentage em"), t, 2), $(".map-rectangle").velocity({
                    y: 100 - n + "%"
                }, t)
            }, a = function () {
                var e, t;
                if (!u) {
                    if (!(t = $(".product_details__stats__graphs__item__map")).length) return;
                    window.isElementInViewport(t) && (o(), u = !0)
                }
                if (!c) {
                    if (!(e = $(".product_details__stats__graphs__item__bar-chart")).length) return;
                    window.isElementInViewport(e) && (r(), c = !0)
                }
            }, $(window).scroll(function () {
                window.clearTimeout(l), l = window.setTimeout(a, 300)
            }), $(".accordion__item__header").on("click", function () {
                return setTimeout(a, 400)
            }), "" !== (s = window.location.hash) && $(s).length && ($(s).click(), window.setTimeout(function () {
                return $("html, body").animate({
                    scrollTop: $(s).offset().top
                }, 300)
            }, 1e3)), $(".rate-us-cta").click(function (e) {
                if (e.preventDefault(), clark.nativeapp) return clark.nativeapp.openAppInStore(), window.localData.setAttr("app", "rated", !0), $("#rate_us_modal").removeClass("modal--visible"), $("body").removeClass("modal-open")
            }), $(".product_details__details__more-details .btn").on("click", function (e) {
                return e.preventDefault(), $(".product_details__details__list--extra").removeClass("hidden"), $(this).addClass("hidden")
            }), e.on("click", function () {
                var e, t, n;
                return e = $(this).closest(".bot-chat__message-box__footer"), n = $(this).hasClass("positive"), t = function () {
                    return e.slideUp(500, function () {
                        if (n && $(".page-main--mobile").length && !1 === window.localData.getAttr("app", "rated", !1)) return $("#rate_us_modal").addClass("modal--visible"), $("body").addClass("modal-open")
                    })
                }, $.ajax({
                    url: e.data("url"),
                    method: "PATCH",
                    data: {
                        helpful: n
                    },
                    success: function () {
                        return e.html("Danke!"), setTimeout(t, 1e3)
                    }
                })
            }), n.on("ajax:success", function () {
                var e, t, n;
                return t = $(this).find("#message_content"), e = $('<p class="bot-chat__message-box__content">').append(t.val().replace(/\n\r?/g, "<br />")), n = $('<div class="bot-chat__message-box bot-chat__message-box--show">').append(e), $(this).before(n), $(this).find(".expanding-clone span").html(""), t.val("")
            }), !1
        })
    }.call(this),
    function () {}.call(this),
    function () {
        $(function () {
            if ($(".recommendations__item--expandable .recommendations__item__descr").slideUp(), $(".recommendations__item__expand-icon").click(function (e) {
                    e.preventDefault(), $(this).parent().find(".recommendations__item__descr").slideToggle(), $(this).parent().toggleClass("recommendations__item--open"), $(this).find(".recommendations__item__expand-icon__spinner-inner").toggleClass("recommendations__item__expand-icon__spinner-inner--open")
                }), window.triggerTypeform = function () {
                    return $(".body--mobile-ios").length > 0 ? window.location = $("#typeform_modal").find("iframe").attr("src") : ($("#typeform_modal").addClass("modal--visible"), $(".recommendations--app").addClass("hide"), $("#offers_split_modal").removeClass("modal--visible"))
                }, $(".modal-toggle").on("click", function (e) {
                    var t;
                    if (e.preventDefault(), $("#" + $(this).attr("data-modal")).toggleClass("modal--visible"), $("body").toggleClass("modal-open"), "" !== (t = $(this).attr("data-topic"))) return $("#topic").val(t)
                }), $(".modal-toggle-with-data").on("click", function () {
                    var e, t, n, i, r, o;
                    if (t = (e = $(this)).data("url"), o = e.data("typeform-host"), "/" !== t.slice(0) && (t = "/" + t), "" !== t && "" !== o) return r = e.data("responseid"), i = e.data("originalurl"), n = "https://" + o + "/to" + t + "?id=" + r + "&redirect=" + e.data("redirect") + "&landingpage=" + i, $("#typeform_modal iframe").attr("src", n)
                }), $(".modal").on("click", function (e) {
                    if ($(e.target)[0] === $(this)[0] || $(e.target).hasClass("modal__close")) return $("body").removeClass("modal-open"), $(".recommendations--app").removeClass("hide"), $(this).removeClass("modal--visible")
                }), $(".list__item--dismiss").click(function () {
                    return window.localData.setAttr("todolist", "indicator", "false"), $(".hidden_section").slideUp()
                }), "true" === window.localData.getAttr("todolist", "indicator", "true")) return $(".hidden_section").removeClass("hidden")
        })
    }.call(this), $(document).ready(function () {
        $("section").hasClass("youtube-clark-video") && loadPlayer($("#ytplayer").data("video"))
    });
var addContentProviderParams = function (e) {
    function t(e) {
        return e.split("?")[0] + i
    }

    function n(e) {
        var t = /'(https?:)?\/\/[^']+'|"(https?:)?\/\/[^"]+"/.exec(e);
        return t ? t[0].slice(1, -1) : null
    }
    var i = window.location.search;
    if (i && e) {
        for (var r = document.querySelectorAll(e + " a"), o = document.querySelectorAll(e + " button"), a = 0; a < r.length; a++) {
            var s = r[a],
                l = s.getAttribute("href");
            s.setAttribute("href", t(l))
        }
        for (a = 0; a < o.length; a++) {
            var c = o[a],
                u = c.getAttribute("onclick");
            (l = n(u)) && c.setAttribute("onclick", u.replace(l, t(l)))
        }
    }
};
window.addEventListener("DOMContentLoaded", function () {
        addContentProviderParams(".campaign-tracking-scope")
    }), window.addEventListener("DOMContentLoaded", function () {
        var e = document.querySelector(".page-header");
        e && document.addEventListener("scroll", function () {
            var t = document.documentElement;
            (window.pageYOffset || t.scrollTop) - (t.clientTop || 0) > 0 ? e.classList.add("page-header--scrolled") : e.classList.remove("page-header--scrolled")
        })
    }), window.addEventListener("DOMContentLoaded", function () {
        var e = document.querySelector("#retirement-calculation-form");
        if (e) {
            var t = 16,
                n = 67,
                i = (new Date).getFullYear(),
                r = document.getElementById("how-to-clark-retirement-birthday");

            function o(e, t) {
                var n = document.getElementById("how-to-clark-retirement-" + e + "-error");
                n.style.display = "block", n.textContent = t
            }

            function a(e) {
                var t = document.querySelector(".retirement-result");
                document.querySelector(".retirement-calculation").style.display = "none", t.style.display = "flex";
                var n = Math.min(100, Math.round(e.net_state_income / e.net_recommended_income * 100));
                document.querySelector(".pension-amount__total").textContent = s(e.net_recommended_income), document.querySelector(".pension-amount__recommendation-suggested").textContent = s(e.net_state_income), document.querySelector(".retirement-legend__net-pension .amount").textContent = s(e.net_state_income), document.querySelector(".retirement-legend__pension-gap .amount").textContent = s(Math.max(0, e.net_recommended_income - e.net_state_income).toFixed(2)), document.querySelector(".retirement-ring .pension-amount").style.animationName = "progress-" + n
            }

            function s(e) {
                return ("" + e).replace(".", ",")
            }
            r.min = i - n + "-01-01", r.max = i - t + "-12-31", e.addEventListener("submit", function (e) {
                e.preventDefault(), document.getElementById("how-to-clark-retirement-gross_salary-error").style.display = "none", document.getElementById("how-to-clark-retirement-date_of_birth-error").style.display = "none";
                var t = new XMLHttpRequest;
                t.addEventListener("load", function () {
                    var e = JSON.parse(t.responseText);
                    200 === t.status ? a(e) : e.errors && e.errors.api && (e.errors.api.gross_salary && o("gross_salary", e.errors.api.gross_salary), e.errors.api.date_of_birth && o("date_of_birth", e.errors.api.date_of_birth))
                });
                var n = "gross_salary=" + document.getElementById("how-to-clark-retirement-income").value + "&date_of_birth=" + document.getElementById("how-to-clark-retirement-birthday").value;
                t.open("GET", "/api/retirement/acquisition/net_retirement_calculation?" + n), t.setRequestHeader("Accept", "application/vnd.clark-v4+json"), t.setRequestHeader("Content-Type", "application/json"), t.send()
            })
        }
    }), window.addEventListener("DOMContentLoaded", function () {
        var e = document.querySelector(".how-to-clark-saving-calculator_quick-selector--shrink__list");
        if (e) {
            var t = document.querySelector(".how-to-clark-saving-calculator__saving-potential-amount"),
                n = "how-to-clark-saving-calculator_quick-selector--shrink__card",
                i = n + "--active";

            function r() {
                for (var n = e.querySelectorAll("li"), r = 0, o = 0; o < n.length; o++) {
                    var a = n[o];
                    a.classList.contains(i) && (r += parseFloat(a.dataset.amount))
                }
                t.textContent = r.toFixed(2).replace(".", ",")
            }
            e.addEventListener("mousedown", function (e) {
                var t;
                e.target.classList.contains(n) ? t = e.target : e.target.classList.contains(n + "__link") ? t = e.target.parentNode : (e.target.classList.contains(n + "__tick") || e.target.classList.contains(n + "__icon") || e.target.classList.contains(n + "__title")) && (t = e.target.parentNode.parentNode), t && (t.classList.toggle(i), r())
            })
        }
    }),
    function () {
        window.getParameterByName = function (e) {
            var t;
            return e = e.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"), null === (t = new RegExp("[\\?&]" + e + "=([^&#]*)").exec(location.search)) ? "" : decodeURIComponent(t[1].replace(/\+/g, " "))
        }, window.isElementInViewport = function (e) {
            var t, n;
            return "function" == typeof jQuery && e instanceof jQuery && (e = e[0]), t = (n = e.getBoundingClientRect()).top >= 0 && n.left >= 0 && n.bottom <= (window.innerHeight || document.documentElement.clientHeight) && n.right <= (window.innerWidth || document.documentElement.clientWidth), $(e).is(":visible") && t
        }, window.track = function (e) {
            var t;
            return void 0 !== window.ahoy && (t = Object.keys(e).reduce(function (t, n) {
                return "event" !== n && (t[n] = e[n]), t
            }, {}), window.ahoy.track(e.event, t)), void 0 !== window.dataLayer && window.dataLayer.push(e), !0
        }, window.setCookie = function (e, t, n) {
            var i, r;
            return (i = new Date).setTime(i.getTime() + 24 * n * 60 * 60 * 1e3), r = "expires=" + i.toUTCString(), document.cookie = e + "=" + t + "; " + r + ";path=/"
        }, window.check_native_facebook = function () {
            if ($(".body--mobile-android").length || $(".body--mobile-ios").length) return $(".btn--facebook").click(function (e) {
                return e.preventDefault(), e.stopPropagation(), clark.nativeapp.requestFacebookLogin()
            })
        }, window.clark.hide_product_menu = function () {
            return $(".toggle_product-sub-menu").removeClass("active"), $(".products-sub-menu").removeClass("is-active")
        }, $(function () {
            return "true" === getParameterByName("userAuthenticationComplete") && window.clark.runFunctionWhenReady("userAuthenticationComplete"), $("img.lazy").lazyload({
                effect: "fadeIn"
            }), $(".rails-ember-link").click(function (e) {
                if (window.clark && window.clark.webapp && window.clark.webapp.transitionTo) return e.preventDefault(), window.clark.webapp.transitionTo($(this).attr("href"))
            }), $(".page-navigation__toggle").click(function (e) {
                return e.preventDefault(), $(".page-container").toggleClass("is-active"), $("body").toggleClass("side-menu-active"), window.clark.hide_product_menu()
            }), $(".page-navigation li.list__item .page-navigation__link").click(function () {
                return $(".page-container").removeClass("is-active"), $("body").removeClass("side-menu-active")
            }), $(".submits-form").click(function () {
                return $(this).parentsUntil("form").submit()
            }), $(".custom-radio span").click(function () {
                return $(this).next().click()
            }), $(".page-header__flash--success").delay(5e3).slideUp(300), "undefined" != typeof navigator && navigator.userAgent.indexOf("Clark") >= 0 && $(".not-app").css("display", "none"), window.check_native_facebook()
        })
    }.call(this);
