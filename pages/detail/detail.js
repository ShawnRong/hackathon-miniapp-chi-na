Page({
  data:{
    shop_detail:[],
    latitude: 23.099994,
    longitude: 113.324520,
    marks_name:''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var page = this

    wx.request({
      url: 'http://www.dianping.com/ajax/json/shop/wizard/BasicHideInfoAjaxFP',
      data: {
          shopId:options.shopId
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/json'
      }, // 设置请求的 header
      success: function(res){
        wx.showNavigationBarLoading()
        page.setData({
            shop_detail:res.data.msg.shopInfo,
            latitude:res.data.msg.shopInfo.glat,
            longitude:res.data.msg.shopInfo.glng,
            marks_name:res.data.msg.shopInfo.shopName
        })
      },
      fail: function() {
      },
      complete: function() {
        wx.hideNavigationBarLoading()
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
  },
  setFavorite:function(){
    var page = this;
    var store_id = page.data.shop_detail.shopId;
    var title = page.data.shop_detail.shopName;
    var address_info = page.data.shop_detail.address;
    var image_path = page.data.shop_detail.defaultPic;
    //id###title+###address###pic###num
    var store_info = store_id+"###"+title+"###"+address_info+"###"+image_path+"###"+"1";
    wx.getStorage({
      key: 'myfavorite',
      success: function(res) {
        if (res.data) {
          var data_array = res.data.split("|||");
          var this_id = -1;
          for (var i = 0; i < data_array.length; i++) {
            var store_detail_array = data_array[i].split("###");
            if (store_detail_array[0] == store_id) {
              this_id = i;
              store_detail_array[4] = parseInt(store_detail_array[4])+1;
              var store_detail = store_detail_array.join("###");
              data_array[i] = store_detail;
              var data_update = data_array.join("|||");
              data_update = data_update;
              break;
            };
          };
          if (this_id == -1) {
            res.data = res.data+"|||"+store_info;
            try {
              wx.setStorageSync('myfavorite', res.data);
              console.log(res.data);
            } catch (e) {
              console.log('Add new store fail');
            }
          }else{
            try {
              wx.setStorageSync('myfavorite', data_update);
              console.log(res.data);
            } catch (e) {
              console.log('Update new store fail');
            }
          }
        }
      },
      fail: function() {
        try {
            wx.setStorageSync('myfavorite', store_info);
            console.log(store_info);
        } catch (e) {
            console.log('Add new key fail');
        }

      }
    })

    wx.openLocation({
      latitude: page.data.latitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: page.data.longitude, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
      name: page.data.marks_name, // 位置名
      // address: 'address', // 地址的详细说明
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  goback:function(){
    wx.navigateBack()
  }
})
