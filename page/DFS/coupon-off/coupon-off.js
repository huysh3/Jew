Page({
  data: {
    tabStatus: wx.getStorageSync('tabStatus')
  },
  onShow: function() {
    this.setData({
      tabStatus: wx.getStorageSync('tabStatus')
    })
  }
})
