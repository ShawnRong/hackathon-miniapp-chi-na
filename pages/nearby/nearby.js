Page({
  data:{
    latitude:'',
    longitude:'',
    nearby:[],
    shops:[]
  },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var page = this

    //获取当前位置
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        // success
        console.log(res.latitude)
        console.log(res.longitude)
        page.setData({
            latitude :res.latitude,
            longitude :res.longitude
        })

        wx.request({
          url: 'http://api.map.baidu.com/geocoder/v2/',
          data:{
            location:page.data.latitude+','+page.data.longitude,
            output:'json',
            pois:1,
            ak:'RGOaR2I5rcjRGy5k8Rg5Wa3C'
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
          'Content-Type': 'application/json'
          }, // 设置请求的 header
          success: function(res){
            page.setData({
              nearby:res
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
            //获取地理关键字
            // console.log(page.data.nearby.data.result.addressComponent.street)
            var keyword = page.data.nearby.data.result.addressComponent.street
            var keyword_encode = encodeURIComponent(keyword)
            wx.request({
              url: 'http://www.dianping.com/search/map/ajax/json',
              data: {
                cityId:11,
                cityEnName:'ningbo',
                promoId:0,
                shopType:1,
                categoryId:1,
                shopSortItem:1,
                keyword:keyword_encode,
                searchType:1,
                branchGroupId:0,
                shippingTypeFilterValue:0,
                page:1
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }, // 设置请求的 header
              success: function(res){
                // success
                console.log('success')
                page.setData({
                  shops: res
                })
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
          }
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  
  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
    
  },
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  }
})