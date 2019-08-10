$(function(){
    window.page = 1;
    /*解决 模板 无法访问外部变量的方案*/
   

    template.helper('getJquery',function () {
        return jQuery;
    });

    /*默认第一页显示*/
    var render = function(){
        getSecondCateData(function(data){
            /*渲染模板*/
            $('tbody').html(template('list',data));
              /*分页展示*/
            /*初始化分页组件*/
            $('.pagination').bootstrapPaginator({
                /*版本*/
                bootstrapMajorVersion:3,
                size:'small',
                currentPage:data.page,
                /*页总数*/
                totalPages:Math.ceil(data.total/data.size),
                /*按钮数量 默认5个*/
                numberOfPages:5,
                /*点击 页面渲染*/
                /*获取 点击的页码*/
                onPageClicked:function(event,originalEvent,type,page){
                    /*event jQuery对象*/
                    /*originalEvent 原生dom 事件对象*/
                    /*type 按钮类型*/
                    /*按钮对应页码*/
                    window.page = page;
                    render();
                }

            })
        })
    }

    render();
  
    /*点击 添加 分类*/
    getFirstCateData(function(data){
        $('.dropdown-menu').html(template('dropdown',data)).on('click','li',function(){
            var $curentA = $(this).find('a');
            /*显示名称*/
            $('.dropdown-text').html($curentA.html());
            /*Id赋值*/
            $('[name=categoryId]').val($curentA.attr('data-id'));
            /*改检验状态*/
            $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
        });
    });
    /*点击 确认 提交 */
      initFileUpload();

       
    $('#form').bootstrapValidator({
        /*校验插件默认会忽略  隐藏的表单元素
        不忽略任何情况的表单元素*/
        excluded:[],
        /*默认样式*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*校验的字段*/
        fields:{
            categoryId:{
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName:{
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            brandLogo:{
                validators: {
                    notEmpty: {
                        message: '请上传二级分类Logo'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        e.preventDefault();
        /*提交数据了*/
        var $form = $(e.target);
        console.log($form);
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                if(data.success){
                   
                    /*渲染第一页*/
                    window.page = 1;
                    render();
                     /*关闭模态框*/
                    $('#save').modal('hide');
                    /*重置表单数据和校验样式*/
                    // $form[0].reset();
                    // $form.data('bootstrapValidator').resetForm();
                    // $('.dropdown-text').html('请选择');
                    // $form.find('img').attr('src','images/none.png');
                }
            }
        });
    });
});




/*获取数据*/
var getSecondCateData = function(callback){
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:{
            page:window.page || 1,
            pageSize:2
        },
        dataType:'json',
        success:function(data){
            console.log(data);
            callback && callback(data);
        }
    });
}

var getFirstCateData = function(callback){
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{
            page: 1,
            pageSize:100
        },
        dataType:'json',
        success:function(data){
            console.log(data);
            callback && callback(data);
        }
    });
}

/*初始化上传插件*/
var initFileUpload = function(){
    $('[name="pic1"]').fileupload({
        url:'/category/addSecondCategoryPic',
        dataType:'json',
        done:function (e, data) {
            /*预览*/
            $('#uploadImg').attr('src',data.result.picAddr);
            /*设置表单的值*/
            $('[name="brandLogo"]').val(data.result.picAddr);
            /*显示合法的提示*/
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });

}








































// $(function () {
//     /*1.默认首页渲染*/
//     var currPage = 1;
//     var render = function () {
//         getCategorySecondData({
//             page: currPage,
//             pageSize: 5
//         }, function (data) {
//             /*渲染列表*/
//             $('tbody').html(template('template', data));
//             /*设置分页  对分页按钮进行绑定*/
//             setPaginator(data.page, Math.ceil(data.total / data.size), render);
//         });
//     };
//     render();
//     /*2.实现分页渲染*/
//     var setPaginator = function (pageCurr, pageSum, callback) {
//         /*获取需要初始的元素 使用bootstrapPaginator方法*/
//         $('.pagination').bootstrapPaginator({
//             /*当前使用的是3版本的bootstrap*/
//             bootstrapMajorVersion: 3,
//             /*配置的字体大小是小号*/
//             size: 'small',
//             /*当前页*/
//             currentPage: pageCurr,
//             /*一共多少页*/
//             totalPages: pageSum,
//             /*点击页面事件*/
//             onPageClicked: function (event, originalEvent, type, page) {
//                 /*改变当前页再渲染 page当前点击的按钮的页面*/
//                 currPage = page;
//                 callback && callback();
//             }
//         });
//     }
//     /*3.添加二级分类*/
//     $('#addBtn').on('click', function () {
//         $('#addModal').modal('show');
//     });
//     /*初始化模态框功能*/
//     initDropDown();
//     initUpload();
//     /*确定  提交的数据名称  一级分类ID categoryId  二级分类名称 brandName 二级分类Logo brandLogo */
//     /*校验*/
//     $('#form').bootstrapValidator({
//         /*校验插件默认会忽略  隐藏的表单元素
//         不忽略任何情况的表单元素*/
//         excluded:[],
//         /*默认样式*/
//         feedbackIcons: {
//             valid: 'glyphicon glyphicon-ok',
//             invalid: 'glyphicon glyphicon-remove',
//             validating: 'glyphicon glyphicon-refresh'
//         },
//         /*校验的字段*/
//         fields:{
//             categoryId:{
//                 validators: {
//                     notEmpty: {
//                         message: '请选择一级分类'
//                     }
//                 }
//             },
//             brandName:{
//                 validators: {
//                     notEmpty: {
//                         message: '请输入二级分类名称'
//                     }
//                 }
//             },
//             brandLogo:{
//                 validators: {
//                     notEmpty: {
//                         message: '请上传二级分类Logo'
//                     }
//                 }
//             }
//         }
//     }).on('success.form.bv', function(e) {
//         e.preventDefault();
//         /*提交数据了*/
//         var $form = $(e.target);
//         $.ajax({
//             type:'post',
//             url:'/category/addSecondCategory',
//             data:$form.serialize(),
//             dataType:'json',
//             success:function (data) {
//                 if(data.success){
//                     /*关闭模态框*/
//                     $('#addModal').modal('hide');
//                     /*渲染第一页*/
//                     currPage = 1;
//                     render();
//                     /*重置表单数据和校验样式*/
//                     $form[0].reset();
//                     $form.data('bootstrapValidator').resetForm();
//                     $('.dropdown-text').html('请选择');
//                     $form.find('img').attr('src','images/none.png');
//                 }
//             }
//         });
//     });
// });
// /*1.获取二级分类分页数据*/
// var getCategorySecondData = function (params, callback) {
//     $.ajax({
//         type: 'get',
//         url: '/category/querySecondCategoryPaging',
//         data: params,
//         dataType: 'json',
//         success: function (data) {
//             callback && callback(data);
//         }
//     });
// }
// /*1.下拉选择*/
// var initDropDown = function () {
//     var $dropDown = $('.dropdown-menu');
//     $.ajax({
//         type: 'get',
//         url: '/category/queryTopCategoryPaging',
//         data: {
//             page: 1,
//             pageSize: 100
//         },
//         dataType: 'json',
//         success: function (data) {
//             /*data.rows 就是选项*/
//             var html = [];
//             $.each(data.rows,function (i, item) {
//                 html.push('<li><a data-id="'+item.id+'" href="javascript:;">'+item.categoryName+'</a></li>');
//             })
//             $dropDown.html(html.join(''));
//         }
//     });
//     $dropDown.on('click','a',function () {
//         /*显示选中*/
//         $('.dropdown-text').html($(this).html());
//         /*设置表单的值*/
//         $('[name="categoryId"]').val($(this).data('id'));
//         /*显示合法的提示*/
//         $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
//     });
// }
// /*2.图片上传*/
// var initUpload = function () {
//     $('[name="pic1"]').fileupload({
//         dataType:'json',
//         done:function (e, data) {
//             /*预览*/
//             $(this).parent().parent().next().find('img').attr('src',data.result.picAddr);
//             /*设置表单的值*/
//             $('[name="brandLogo"]').val(data.result.picAddr);
//             /*显示合法的提示*/
//             $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
//         }
//     });
// }