'use strict'


Page({
  data: {
    locationSrc: '../../image/icon_index_white.png',
    latitude:'',
    longitude:'',
    address:'',
    nearby:[],
    shops:[],
    random_shop_id:'',
    random_shop_name:'',
    myAddressPicker: {
      array: ['家', '单位'],
      index: 0
    },
    myAddress:[],
    loadStatus:'fail'
  },
  bindKeyInput: function(e) {
    var page = this;
    this.setData({
      address: e.detail.value
    })
    console.log(page.data.address);
  },
  bindPickerChange: function(e) {
    var page = this;
    var this_address = '';
    if (typeof(page.data.myAddress[e.detail.value]) != "undefined" && page.data.myAddress[e.detail.value] != '') {
      this_address = page.data.myAddress[e.detail.value];
    }else{
      this_address = "和邦大厦";
    }
    this.setData({
      address: this_address
    })
  },

  onShow:function(options){
    var page = this;
    // var myAddressdata = "0###家###印象城|||1###公司###和邦大厦";
    // console.log(myAddressdata);
    // var data_result = new Array();
    // var data_array = myAddressdata.split("|||");
    // for (var i = data_array.length-1; i >=0 ; i--) {
    //   var store_detail_array = data_array[i].split("###");
    //   data_result[data_array.length-i-1] = store_detail_array;
    // };
    // page.data.myAddress = data_result;


    wx.getStorage({
      key: 'myaddress',
      success: function(res) {
        if (res.data) {
          var data_result = new Array();
          var data_array = res.data.split("|||");
          for (var i = 0; i < data_array.length ; i++) {
            var store_detail_array = data_array[i].split("###");
            data_result[i] = store_detail_array[2];
          };
          page.data.myAddress = data_result;
          console.log(data_result);
        }else{
          console.log('None');
        };
      },
      fail: function() {
        console.log('Fail');
      }
    })

    wx.getLocation({

      type: 'wgs84',
      success: function(res) {
        wx.showNavigationBarLoading()
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
              nearby:res,
              address:res.data.result.addressComponent.street,
              loadStatus:"success"
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
            wx.hideNavigationBarLoading()
          }
        })
      }
    })
  },

  randomShop: function(e) {
    var page = this
    var keyword = page.data.address

    var status = page.data.loadStatus
    if(status=="success"){
      page.setData({
        loadStatus:"fail"
      })
      wx.request({
      url: 'https://wechatcitdevhfzdlijkdc.devcloud.acquia-sites.com/search/map/ajax/json',
      data:{
        cityId:11,
        cityEnName:'ningbo',
        shopType:10,
        categoryId:10,
        shopSortItem:1,
        keyword:keyword,
        searchType:1
      },
      // data: 'cityId=11&cityEnName=ningbo&shopType=10&categoryId=10&shopSortItem=1&keyword='+keyword+'&searchType=1',
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/json'
      }, // 设置请求的 header
      success: function(res){
        // success
        // console.log('success')
        page.setData({
            shops: res.data.shopRecordBeanList
        })
          //生成0到19的随机数
        var randomNum = Math.ceil(Math.random()*19)

        console.log(page.data.shops[randomNum].shopId)
        page.setData({
          random_shop_id:page.data.shops[randomNum].shopId,
          random_shop_name:page.data.shops[randomNum].shopName,
          loadStatus:"success"
        })
        var targetUrl = '/pages/detail/detail'
        if(page.data.shops[randomNum].shopId != null){
          targetUrl = targetUrl + '?shopId=' + page.data.shops[randomNum].shopId
          wx.navigateTo({
            url: targetUrl,
            success: function(res){
              // success
            // page.setData({
            //   loadStatus:"success"
            // })
            }
          })
        }
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
          page.setData({
            loadStatus:"success"
          })
      },
      complete: function() {
              // complete
          
      }
    })
     

    }



  },

  //选择位置
  locationTap: function(e){
    var page = this
    wx.chooseLocation({
      success: function(res){
        // success
        // console.log(res.address)
        page.setData({
          address:res.name
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
