$(function () {
    //点击"去注册账号"的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    //点击"去登录"的链接
    $("#link_login").on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    //layui 中获取 form对象
    var form = layui.form;
    // layui中获取 layer对象
    var layer = layui.layer;
    //通过form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function (value) {
            //通过形参拿到的是确认密码框中的内容
            //还需要拿到密码框中的内容
            //然后进行一次等于判断
            //如果判断失败，则return一个提示消息
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致';
            }
        }
    })

    //监听注册表单的提交事件
    $("#form_reg").on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        //2.发起Ajax的POST请求
        var data={username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()}
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录', {
                icon: 1,
                time: 2000 //2秒关闭（如果不配置，默认是3秒）
              }, function(){
                $("#link_login").click();
              });   
        })
    })

    //监听登录表单的提交事件
    $('#form_login').on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            //快速获取表单中的数据  本质为查询字符串
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败,密码或账号错误', {
                        icon: 2,
                        time: 2000 //2秒关闭（如果不配置，默认是3秒）
                      }, function(){
                        //do something
                      });   
                }
                layer.msg('登录成功', {
                    icon: 1,
                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    //登录成功后得到的token字符串保存到 localStorage中
                    localStorage.setItem('token', res.token);
                    //跳到后台主页
                    location.href = '/index.html';
                  });   
            }
        })

    })
    
})