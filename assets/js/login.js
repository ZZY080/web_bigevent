$(function () {
    //点击"去注册
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击"去登录"的链接
    $("#link_login").on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
})