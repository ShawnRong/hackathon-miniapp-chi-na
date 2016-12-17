Page({
  data:{
    latitude:'',
    longitude:'',
    nearby:[],
    shops:[]
  },

  onItemClick(e){
    var targetUrl = '/pages/detail/detail'
    if(e.currentTarget.dataset.shopId != null)
      targetUrl = targetUrl + '?shopId=' + e.currentTarget.dataset.shopId+'&shopName='+e.currentTarget.dataset.shopName
    wx.navigateTo({
      url: targetUrl
    })
  },

  // pullUpLoadLatest(e){
  //   console.log('ss')
  // },

  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

  
  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
        var page = this

    //获取当前位置
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        // success
        // wx.showToast({
        //   title: '加载中',
        //   icon: 'loading',
        //   duration: 100000
        // })
        wx.showNavigationBarLoading()
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
            // var keyword_encode = encodeURIComponent(keyword)
            wx.request({
              url: 'http://www.dianping.com/search/map/ajax/json',
              data: 'cityId=11&cityEnName=ningbo&shopType=10&categoryId=10&shopSortItem=1&keyword='+keyword+'&searchType=1',
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }, // 设置请求的 header
              success: function(res){
                // success
                console.log('success')
                page.setData({
                  shops: res.data.shopRecordBeanList
                })
              },
              fail: function() {
                // fail
              wx.showModal({
                title: '网络错误',
                content: '网络挂了😢',
                success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  }
                }
              })
              },
              complete: function() {
                // complete
                // setTimeout(function(){
                //   wx.hideToast()
                // },20000)
                wx.hideNavigationBarLoading()
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
  onHide:function(){
    // 页面隐藏
    
  },
  onUnload:function(){
    // 页面关闭
    
  }
})