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
    orderList: [],
    shopInfo: wx.getStorageSync('shopInfo'),
    footbarState: {
      tabStatus: 'historyOrders',
      cartBadgeNum: wx.getStorageSync('cartBadgeNum')
    }
  },
  onShow() {
    var _this = this
    wx.setStorageSync('tabStatus', 'historyOrders')
    this.setData({ "footbarState.cartBadgeNum": wx.getStorageSync('cartBadgeNum') })
    this.setData({ 'shopInfo': wx.getStorageSync('shopInfo') })
    wx.request({
      url: domain + 'V1/weapp/order_list',
      data: {
        uid: wx.getStorageSync('uid')
      },
      // login: true,
      success(res) {
        _this.setData({
          indexList: res.data
        })
      }
    })
  },
  routerGoOrder() {
    wx.navigateTo({
      url: "../history-order/history-order"
    })
  },
  routerGoHome: function() {
    wx.redirectTo({
      url: '../home/home'
    })
  }
})
