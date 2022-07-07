(function () {
    $(function () {
        var e, r, n, t, a, o, s, i, c, l;
        return e = $("body"), r = $("#login_modal"), n = r.find(".modal__content"), s = !!document.createTouch, c = function (e) {
            var r, n;
            if (r = function (e, r) {
                    var n;
                    return "hidden" === (n = $(r)).attr("type") || n.attr("readonly") || n.attr("disabled")
                }, (n = e.find("input").not(r).first()).length) return setTimeout(function () {
                return n.focus()
            }, 100)
        }, l = function (t, i, l, u) {
            return n.html(u.responseText), r.addClass("modal--visible"), e.addClass("prevent-scrolling"), window.check_native_facebook(), s || c(n), o(), a()
        }, t = function () {
            return r.removeClass("modal--visible"), e.removeClass("prevent-scrolling")
        }, i = function () {
            var e;
            return (e = window.location.search.slice(1)).length > 0 ? Object.fromEntries(new URLSearchParams(e)) : null
        }, r.on("click", function (e) {
            if ($(e.target)[0] === r[0] || $(e.target).hasClass("modal__close")) return t()
        }), $(document).on("ajax:success", ".new_password, .new_registration, .new_session, .new_confirmation", l), $(document).on("ajax:error", ".new_password, .new_registration, .new_session, .new_confirmation", function () {
            return console.log("error from ajax request", arguments)
        }), $(document).on("ajax:before", function () {
            return window.Validate.removeErrors()
        }), $(document).on("ajax:success", ".new_registration", function () {
            var e;
            if (e = i()) return $("#referral_code").val(e.code)
        }), a = function () {
            return $(".custom-checkbox__label").off("click touch"), $(".custom-checkbox__label").on("click touch", function () {
                return $(this).toggleClass("custom-checkbox__label--active")
            })
        }, (o = function () {
            var e, r, n;
            return e = $(".reveal_wrapper__eye"), $(".reveal_wrapper").find("input"), r = $(".reveal_wrapper__password"), n = $(".reveal_wrapper__text"), e.on("click touch", function () {
                return $(this).parent().hasClass("reveal_wrapper__password") ? (e.addClass("reveal_wrapper__eye--active"), r.addClass("hidden"), n.removeClass("hidden")) : (e.removeClass("reveal_wrapper__eye--active"), r.removeClass("hidden"), n.addClass("hidden"))
            }), $(".reveal_password").keyup(function () {
                var e;
                return e = "", e = "text" === $(this).attr("type") ? ".reveal_wrapper__password" : ".reveal_wrapper__text", $(this).parent().parent().find(e + " input").val($(this).val())
            })
        })(), a()
    })
}).call(this);
