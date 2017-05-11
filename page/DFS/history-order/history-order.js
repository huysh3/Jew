var domain = 'https://72762681.qcloud.la/'
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();
    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};

Page({
  data: {
    indexList: [],
    orderInfo: {},
    shopInfo: wx.getStorageSync('shopInfo'),
    tabStatus: wx.getStorageSync('tabStatus')
  },
  onShow() {
    this.setData({
      tabStatus: wx.getStorageSync('tabStatus')
    })
    this.setData({ 'shopInfo': wx.getStorageSync('shopInfo') })
  },
  onLoad(options) {
    var _this = this
    wx.request({
      url: domain + 'V1/weapp/order_info',
      data: {
        order_id: options.order_id,
        uid: wx.getStorageSync('uid')
      },
      success(res) {
        console.log(res.data)
        _this.setData({
          orderInfo: res.data
        })
      }
    })
  },
  routerGoHome: function() {
    wx.redirectTo({
      url: '../home/home'
    })
  }
})
