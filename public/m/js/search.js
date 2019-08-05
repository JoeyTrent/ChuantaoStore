$(function(){

	/*初始化页面 渲染历史记录*/
	$('.ct_search input').val('');
	$('.ct_history').html(template('searchTemplate',{data: getSearchData()}))







	$('body').on('tap','.ct_search a',function(){
		/*跳转到搜索表页*/
		var key =$.trim($('input').val());
		console.log(key);
		/*判断 关键字*/
		if(!key){
			/* 不存在keymui 消息提示*/
			mui.toast('请输入关键字');
		}
		/*增加历史记录*/
		addSearchData(key);


		/*跳到searchlist.html*/
		location.href ='searchlist.html?key='+key;
	}).on('tap','.icon_clear',function(){
		/*清空*/
		localStorage.clear();
		$('.ct_history').html(template('searchTemplate',{data: getSearchData()}))

	}).on('tap','.icon_delete',function(){
		/*删除单条*/
		removeSearchData($(this).parent().find('[data-key]').attr('data-key'));
		$('.ct_history').html(template('searchTemplate',{data: getSearchData()}))

	}).on('tap','[data-key]',function(){
		// location.href = 
		console.log('跳转中')
	});



})


/*获取历史记录*/
var  getSearchData= function(){
	return JSON.parse(localStorage.getItem('leTaoSearchHistory')||'[]');
}
/*增加历史记录*/
var addSearchData = function(key){
	var list = getSearchData();
	$.each(list,function(i,item){
		if(item == key){
			list.splice(i,1);
		}
	})
	list.push(key);
	/*最多10条记录*/
	if(list.length > 10){
		list.splice(0,list.length-1);
	}

	/*存进localStorage*/
	localStorage.setItem('leTaoSearchHistory',JSON.stringify(list));
}
/*删除历史记录*/
var removeSearchData = function (key){
	var list = getSearchData();
	$.each(list,function(i,item){
		if(item == key){
			list.splice(i,1);
		}
		localStorage.setItem('leTaoSearchHistory',JSON.stringify(list));
	})
}