$(function(){
    mui('.mui-scroll-wrapper').scroll({
        indicators:false,
        bounce:true
    });
    mui('.mui-slider').slider({
        interval:2000,

    });
    /*上下拉*/
    mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            down: {
            	/*自动刷新*/
                auto:true,
                
                callback: function(){
         		 var that = this;
                 /* 拿到这个对象 用于下面的刷新*/
                 // window.down = this;
                 	 getCartdata(function(data){
                 	 	/*渲染页面*/
                 	 	
                        
                 	 	$('.mui-table-view').html(template('cart',data));
                 	   /*关闭加载图案*/

                  	  that.endPulldownToRefresh();
                      /*刷新按钮*/
      					$('.fa-refresh').off('tap').on('tap',function(){
                        that.pulldownLoading();
                        })
                 	  })
                     
                    }
                }, 
                 /*.上拉 加载下一页数据  没有数据弹出提示*/
            up: {
                callback:function(){
                   var that = this;
                 setTimeout(function(){
                 	 that.endPullupToRefresh();
                     },1000);
                    }
                }

            }
    });

    /*1. 点击编辑 弹出对话框 */
    $('.mui-table-view').on('tap','.mui-icon-compose',function(){
        var id = $(this).parent().attr('data-id');
        var item = LeTao.getItemById(window.cartData.data,id);
        console.log(item);
        var html = template('edit',item);
        mui.confirm(html.replace(/\n/g,''), '编辑商品', ['是', '否'], function(e) {
            if (e.index == 0) {
                /*location.href = LeTao.CART_URL;*/
                var size = $('.btn_size.now').html();
                var num = $('.p_number input').val();
                LeTao.ajax({
                    type:'post',
                    url:'/cart/updateCart',
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:'json',
                    success:function(data){
                        if(data.success == true){
                            /*关闭弹出框*/
                            /*列表更新*/
                            item.num = num;
                            item.size = size;
                            $('.mui-table-view').html(template('cart',window.cartData));
                            
                        }
                    }
                })
            } else {
                //TODO
            }
        })
    })

    $('body').on('tap','.btn_size',function(){
        $(this).addClass('now').siblings().removeClass('now');
        });

    $('body').on('tap','.p_number span',function(){
          var $input = $(this).siblings('input');
         var currNum = $input.val();
         /*字符串 转数字 */
         var maxNum = parseInt($input.attr('data-max'));
          if ($(this).hasClass('jian')) {

               if(currNum <= 1){
                    mui.toast('至少一件商品');
                    return false;
                 }
                 currNum--;
            } else {
                       /*不超库存*/
                     if(currNum >= maxNum){
                       /*消息框点击的时候会消失 正好和加号在一块  (击穿 tap,点击穿透)*/
                       setTimeout(function () {
                         mui.toast('库存不足');
                         },100);
                       return false;
                      }
                     currNum++;
                   }
         $input.val(currNum);
      })
    /*2.点击 删除 弹出确认框*/
      $('.mui-table-view').on('tap','.mui-icon-trash',function(){
          var $this = $(this);
          var id = $(this).parent().attr('data-id');
          var item = LeTao.getItemById(window.cartData.data,id);
          console.log(item);
          mui.confirm('确认删除该商品？', '删除商品', ['是', '否'], function(e) {
              if (e.index == 0) {
              /*location.href = LeTao.CART_URL;*/
              var size = $('.btn_size.now').html();
              var num = $('.p_number input').val();
              LeTao.ajax({
                  type:'get',
                  url:'/cart/deleteCart',
                  data:{
                      id:id,
                                     },
                  dataType:'json',
                  success:function(data){
                      if(data.success == true){
                          /*关闭弹出框*/
                          /*列表更新*/
                         $this.parent().parent().remove();
                         setAmount();
                      }
                  }
              })
          } else {
              //TODO
               }
        })
    })

    /*3.点击刷新 */
    $('.fa-refresh').on('tap',function(){
        $('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    })

    /*4.点击复选框 计算总金额*/
    $('.mui-table-view').on('change','[type=checkbox]',function(){
        /*计算总金额*/
        setAmount();
    })
});
  /*计算金额*/
 var setAmount = function(){
    /*选中的复选框*/
    var $checkedBox = $('[type=checkbox]:checked');
    var amountSum = 0;

    $checkedBox.each(function(i,item){
        var id = $(this).attr('data-id');

        var item = LeTao.getItemById(window.cartData.data,id);
         console.log(item);
        var num = item.num;
        var price = item.price;
        var amount = num * price;
        amountSum += amount;
    });
    if(Math.floor(amountSum * 100)%10){
        amountSum = Math.floor(amountSum * 100)/100;
    }else{
        amountSum = Math.floor(amountSum * 100)/100;
        amountSum = amountSum.toString()+'0';
    }
    $('#cartAmount').html(amountSum);
 }


var getCartdata = function(callback){
	LeTao.ajax({
		type:'get',
		url:'/cart/queryCartPaging',
		data:{
			page:1,
			pageSize:100
			},
		dataType:'json',
		success:function(data){
			window.cartData = data;
			callback && callback(data);
		}
	 })
}
