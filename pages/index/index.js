'use strict'


Page({
  data: {
    locationSrc: '../../image/icon_index_white.png',
    addressSrc: '../../image/icon_address_white.png',
    latitude:'',
    longitude:'',
    address:'',
    nearby:[],
    shops:[],
    random_shop_id:'',
    random_shop_name:''
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  onLoad:function(options){
    var page = this
        wx.getLocation({
      type: 'wgs84',
      success: function(res) {
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
            var keyword = page.data.nearby.data.result.addressComponent.street
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
              },
              complete: function() {
                // complete
              }
            })
          }
        })
      }
    })
  },
  randomShop: function(e) {
   var page = this

   //生成0到19的随机数
   var randomNum = Math.ceil(Math.random()*19)
   
   console.log(page.data.shops[randomNum].shopId)
   page.setData({
     random_shop_id:page.data.shops[randomNum].shopId,
     random_shop_name:page.data.shops[randomNum].shopName
   })

    var targetUrl = '/pages/detail/detail'
    if(e.currentTarget.dataset.shopId != null)
      targetUrl = targetUrl + '?shopId=' + e.currentTarget.dataset.shopId+'&shopName='+e.currentTarget.dataset.shopName
    wx.navigateTo({
      url: targetUrl
    })

  },

  //选择位置
  locationTap: function(e){
    var page = this
    wx.chooseLocation({
      success: function(res){
        // success
        // console.log(res.address)
        page.setData({
          address:res.address
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