var domain = 'https://72762681.qcloud.la/'
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');

var pageObject = {
  data: {
    "lists": [],
    "tabStatus": wx.getStorageSync('tabStatus'),
    shopInfo: wx.getStorageSync('shopInfo'),
    "class_name": ''
  },
  onShow: function() {
    this.setData({
      "tabStatus": wx.getStorageSync('tabStatus')
    })
    this.setData({ 'shopInfo': wx.getStorageSync('shopInfo') })
  },
  onLoad: function(options) {
    this.setData({
      'class_name': options.class_name
    })
    console.log(options.class_name)
    wx.setNavigationBarTitle({
      title: '商品列表'
    })
    this.getProductList(options)
  },
  onPullDownRefresh: function() {
    this.getProductList()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1000
    })
  },
  getProductList: function(options) {
    var _this = this
    wx.request({
      url: domain + 'V1/weapp/product_list',
      data: {
        class_name: options.class_name,
        shop_id: wx.getStorageSync('shop_id')
      },
      success(res) {
        _this.setData({lists: res.data})
      },
      fail(error) {
      }
    })
  },
  routerGoHome: function() {
    wx.redirectTo({
      url: '../home/home'
    })
  }
  // onShareAppMessage: function () {
  //   var _this = this
  //   return {
  //     title: 'DFS购物商品列表',
  //     path: '/page/DFS/product-list/product-list?class_name=' + _this.data.class_name,
  //     success: function(res) {
  //       // 分享成功
  //     },
  //     fail: function(res) {
  //       // 分享失败
  //     }
  //   }
  // }
}

Page(pageObject)
