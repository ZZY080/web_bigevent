$(function () {
    var layer = layui.layer;
    var form=layui.form
    initCate();
    // 初始化富文本编辑器
    initEditor()
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);

                    return layer.msg('初始化文章分类失败');
                }
                //调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
      // 1. 初始化图片裁剪器
    var $image = $('#image')
    
    // 2. 裁剪选项
    var options = {
        aspectRatio: 1,
        preview: '.img-preview'
    }
    
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 为选择封面的按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //监听coverFile的change事件获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表数组
        var files = e.target.files;
        if (files.length == 0) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0]);
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })
    // 定义文章的发布状态
    var art_state = '已发布';
    //为存为草稿按钮 绑定点击事件处理函数
    $('#btnSave2').on('click', function(){
        art_state='';
    })
    //为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        //1.阻止表单的默认提交行为
        e.preventDefault();
        //2.基于form表单 快速创建一个FormData对象 要转化为dom对象
        var fd = new FormData($(this)[0])
        //3.将文章的发布状态存到fd中
        fd.append('state',art_state)
        // 4. 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5.将文件对象，储存到fd
                fd.append('cover_img', blob);
                //6.发起ajax请求数据
                publishArticle(fd);

            })
    })
    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url:'/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是FormData
            //必须添加两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status!== 0) {
                    return layer.msg('发布文章失败');
                }
                layer.msg('发布文章失败！');
                //发布文章成功后，跳转到文章列表页
                location.href = '/article/art_list.html';
            }
        })
    }

})