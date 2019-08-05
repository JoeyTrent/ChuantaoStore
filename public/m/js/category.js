$(function(){
   
   /*一级分类 第一个分类对应的二级分类*/
   getFirstCategory(function(data){
        $('.cate_left ul').html(template('firstTemplate',data));
        
        var categoryId=$('.cate_left ul li:first-child').find('a')
.attr('data-id');
      /*渲染第二级*/
      render(categoryId);
   });
   /*点击一级分类加载对应二级分类*/
      
       $('.cate_left ').on('tap','a',function(e){
            /*节流  重复点击不加载*/
            if($(this).hasClass('now')) return false;
            $('.cate_left li').removeClass('now');
            $(this).parent().addClass('now');
            // var categoryId=$(this).attr('data-id');
            render($(this).attr('data-id'));
       })
   });
var getFirstCategory=function(callback){
       $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:'',
        dataType:'json',
        success: function(data){
           callback&&callback(data);
         }
     })
}

var getSecondCategory=function(params,callback){
       $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:params,
        dataType:'json',
        success: function(data){
           callback&&callback(data);
         }
     })
}
/*渲染*/
var render= function(categoryId){
   getSecondCategory({
              id:categoryId
            },function(data){
              /*二级分类*/
               $('.cate_right ul').html(template('secondTemplate',data))
            })
}