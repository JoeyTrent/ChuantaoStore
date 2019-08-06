$(function(){
	// 区域滚动
    mui('.mui-scroll-wrapper').scroll({
        indicators:false,
        bounce:true
    });
    /*1.初始化 关键字显示*/
    var urlParams = LeTao.getParamsByUrl();
        urlParams.key = decodeURI(urlParams.key);
        // console.log(urlParams);
    var $input = $('.ct_search input').val(urlParams.key || '');
/*****************************************************************/
        /*搜索关键字   多个KEY版本  上面那个是 只取 同一个key 会覆盖
         感觉覆盖更好点*/   
    // if(location.search){
    //     var strs = location.search.substr(1).split("&");
    //     // console.log(strs);
    //     window.proName='';
    //     for(var i = 0; i < strs.length; i ++) {
    //         var arr = strs[i].split("=");
    //         if(arr[0] == 'key'){
    //             /*urlcode 转码*/
    //             window.proName = decodeURI(arr[1]);
    //             // window.proName =window.proName+' '+decodeURI(arr[1]);
    //             $('.ct_search input').val(window.proName);
    //             break;

    //         }
    //     }
    // }

/*****************************************************************/

    /*2.查询数据  4条*/
    /*重复下拉auto 功能*/
    // getSearchData({
    //     proName:urlParams.key,
    //     page: 1,
    //     pageSize:4
    // },function(data){
    //     /*渲染数据*/
    //     $('.ct_product').html(template('list',data))
    // });

 

    /*3.点击搜索时 搜索商品*/

    $('.ct_search a').on('tap',function(){
        var key = $.trim($input.val());
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }
        getSearchData({
        proName:key,
        page: 1,
        pageSize:4
    },function(data){
        /*渲染数据*/
        $('.ct_product').html(template('list',data))
    });
    })

    /*4.点击排序时 排序  默认降序*/

    $('.ct_order a').on('tap',function(){
        /*改变样式*/
        var $this=$(this);
        if(!$this.hasClass('now')){
                /*其他不选中  箭头下*/
                $this.addClass('now').siblings().removeClass('now')
                .find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        }else{
            /*已经选中  改箭头方向*/
             if(($this).find('span').hasClass('fa-angle-down')){
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }


        /*获取当前点击的功能参数 price 1 2 num 1 2*/
        
            var order = $this.attr('data-order');
            // console.log(order);
            var orderVal = $this.find('span').hasClass('fa-angle-up') ? 1:2;
            var key = $.trim($input.val());
            if(!key){
                mui.toast('请输入关键字');
                return false;
              }

        /*获取数据*/
         var params = {
                       proName:key,
                       page: 1,
                       pageSize:4,
                       /*排序*/ 
                      };
            params[order] = orderVal;
       
          getSearchData(params,function(data){
              /*渲染数据*/
              $('.ct_product').html(template('list',data))
          });
          })
    /*5.下拉刷新  上拉功能重置 */
            mui.init({
        pullRefresh: {
            container: '.mui-scroll-wrapper',
            down: {
                auto:true,
                callback: function(){
                    var that = this;
                    /*获取数据*/
                      var key = $.trim($input.val());
                      if(!key){
                      mui.toast('请输入关键字');
                      return false;
                      }
                    /*重置 排序*/
                    $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

                      getSearchData({
                       proName:key,
                       page: 1,
                       pageSize:4
                       },function(data){
                        /*渲染数据*/
                           $('.ct_product').html(template('list',data));
                           /*结束刷新*/
                           that.endPulldownToRefresh();
                           /*上拉重置*/
                           that.refresh(true);

                        });
                 
                    }
                }, 
                 /*6.上拉 加载下一页数据  没有数据弹出提示*/
            up: {
                callback:function(){
                    window.page++;
                    var that = this;
                    /*组件对象*/
                      var key = $.trim($input.val());
                      if(!key){
                      mui.toast('请输入关键字');
                      return false;
                      }
                      /*排序参数*/
                       var order = $('.ct_order a.now').attr('data-order');
                     // console.log(order);
                       var orderVal = $('.ct_order a.now').hasClass('fa-angle-up') ? 1:2;
                        /*获取数据*/
                       var params = {
                                     proName:key,
                                     page: window.page,
                                     pageSize:4,
                                     /*排序*/ 
                                    };
                           params[order] = orderVal;

                      getSearchData(params,function(data){
                        /*渲染数据*/
                           $('.ct_product').append(template('list',data));
                           /*结束刷新*/
                           if(data.data.length){
                             that.endPullupToRefresh();
                         }else{
                             that.endPullupToRefresh(true);
                         }
                          
                        });
                }

            }
           
        }
    });



   
   
});

   var getSearchData = function(params,callback){
        $.ajax({
            url:'/product/queryProduct',
            type:'get',
            data:params,
            datatype:'json',
            success:function(data){
                window.page = data.page;
                callback && callback(data);
            }

        })
    }