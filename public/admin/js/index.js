$(function(){
    barChart();
    pieChart();
});





var barChart = function(){
    var data =[
                {
                 name:'一月',
                 value:300
                },
                {
                 name:'二月',
                 value:400
                },
                {
                 name:'三月',
                 value:200
                },
                {
                 name:'四月',
                 value:600
                },
                {
                 name:'五月',
                 value:700
                }
              ];
var xdata = [], sdata = [];
 data.forEach(function(item,i){
    xdata.push(item.name);
    sdata.push(item.value);
});
    var box = document.querySelector('.picTable:first-child');
    var myCharts = echarts.init(box);
    var option = {
        color:['hotpink'],
        /*图标的标题*/
        title: {
            text: '2017年注册人数'
        },
        tooltip: {},
        legend: {
            data:['注册人数']
        },
        xAxis: [{
            data: ["1月","2月","3月","4月","5月","6月"]
        }],
        yAxis: {},
        series: [{
            name: '注册人数',
            type: 'bar',
            data: [1000, 2000, 3600, 1400, 1200, 2220]
        }]
    };
    // console.log(xdata);
    option.xAxis[0].data = xdata;
    option.series[0].data = sdata;
    /*1.7 渲染*/
    myCharts.setOption(option);

}


var pieChart = function(){
        var data =[
                {
                 name:'诺基亚',
                 value:300
                },
                {
                 name:'apple',
                 value:400
                },
                {
                 name:'索尼',
                 value:200
                },
                {
                 name:'大黄蜂',
                 value:600
                },
                {
                 name:'真田',
                 value:700
                }
              ];
    var namedata = [], valuedata = [];
    data.forEach(function(item,i){
       namedata.push(item.name);
       valuedata.push(item.value);
   });

    var box = document.querySelector('.picTable:last-child');
    var myCharts = echarts.init(box);
    var option = {
        title : {
            text: '热门品牌销售',
            subtext: '2017年6月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: [{
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','百伦','安踏','李宁']
        }],
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'耐克'},
                    {value:310, name:'阿迪'},
                    {value:234, name:'百伦'},
                    {value:135, name:'安踏'},
                    {value:1548, name:'李宁'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    option.legend[0].data = namedata;
    console.log(option.series[0].data);
    option.series[0].data = data;
    myCharts.setOption(option);
}


















