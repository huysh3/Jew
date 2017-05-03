Page({
  onShow: function() {
    wx.setStorageSync('tabStatus', 'orderCenter')
  },
  phoneCall: function() {
    wx.makePhoneCall({
      phoneNumber: '13602455397' //仅为示例，并非真实的电话号码
    })
  },
  routerGoHome: function() {
    wx.redirectTo({
      url: '../home/home'
    })
  }
})
