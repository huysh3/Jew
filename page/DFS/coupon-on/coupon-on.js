var domain = 'https://72762681.qcloud.la/'
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');

Page({
  data: {
    qrcodeState: false,
    qrCodeSrc: '../../../image/QRCode1.png',
    inputStatus: true,
    tabStatus: wx.getStorageSync('tabStatus')
  },
  onShow: function() {
    var _this = this
    this.setData({
      tabStatus: wx.getStorageSync('tabStatus')
    })
  },
  judgeQrcode: function(e) {
    var _this = this
    if (e.detail.value === '330') {
      wx.hideKeyboard()
      wx.request({
        url: domain + 'Home/Coupon/couponChange',
        data: {
          uid: wx.getStorageSync('uid')
        },
        success(res) {
          _this.setData({
            qrcodeState: true,
            qrCodeSrc: 'https://om536p71r.qnssl.com/4444QRCODE4.4.png',
            inputStatus: false
          })
        },
        fail(error) {
          console.log(error)
        }
      })
    }
    setTimeout(function() {
      _this.setData({
        qrCodeSrc: '../../../image/QRCode1.png'
      })
    }, 300000)
  }
})
