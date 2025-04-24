var setLang = function (code) {
    $.get($('#langURL').val() + '?lang=' + code, function (data) {
        location.reload();
    });
}

var slideBox = function (px) {
    $('#goBox').scrollTo(px, { duration: 200 });
};