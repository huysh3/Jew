import services from '../../../util/services'

var pageObject = {
  data: {
    product: '',
    phoneNumber: ''
  },
  onLoad: function(options) {
    this.getProductInfo(options)
    try {
      this.setData({
        phoneNumber : wx.getStorageSync('user').username
      })
    } catch(e) {}
  },
  getProductInfo: function(options) {
    // getProduct
  },
  generateOrder: function() {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 5000
    })
  },
  getWxPayJson: function(bill_id) {
    var _this = this
    // getWxPayJson
  }
}

Page(pageObject)
