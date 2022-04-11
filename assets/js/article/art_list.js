$(function () {
    //定义一个查询的参数对象，将来请求数据的时候
    //需要将请求参数对象提交到服务器
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1,//页码值 默认请求第一页的参数
        pagesize: 2,//每页显示几条数据 默认每页显示2条
        cate_id: '',//文章分类得id
        state:'',//文章得发布状态
    }

    initTable();
    initCate();
    //定义美化时间得过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero( dt.getMonth());
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }
    //定义补零得函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    //获取文章列表数据得方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表页失败');
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                //调用渲染分页得方法
                renderPage(res.total);
            }
        })
    }

    //初始化文章分类得方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                //调用模板引擎渲染分类得可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        //获取表单中选中项得值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询参数对象q中对应得属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //根据最新得筛选条件，重新渲染表格数据
        initTable();
    })
    //定义渲染分页得方法
    function renderPage(total,first) {
       
        //调用laypage.render()方法渲染分页得结构
        laypage.render({
            elem: 'pageBox',//分页容器的id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页参数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits:[2,3,5,10],
            //分页发生切换的时候 触发jump回调
            //1.点击页码的时候，会触发jump回调
            //2.只要调用了laypage.render()方法，就会触发jump回调
            //如果first 的值为true 证明是方式2触发 否则为方式1触发
            jump: function (obj,first) {
               
                //把最新的页码值，赋值到q这个查询对象中
                q.pagenum = obj.curr;
                //根据最新的q获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable();
                }
            }
        })
    }
    //通过代理的形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $(".btn-delete").length;
        //获取文章id
        var id = $(this).attr('data-id');
        //询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功');
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余的数据，让页码值-1之后
                    //再重新调用initTable方法
                    if (len == 1) {
                        //如果len的值等于一，证明删除完毕之后，页面就没有任何数据
                        //页码值最小为一
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
          });
        
    })
})