var domain = 'https://72762681.qcloud.la/'

Page({
  data: {
    shopList: []
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.city
    })
    this.getShopList(options)
  },
  getShopList(options) {
    let _this = this
    wx.request({
      url: domain + 'V1/Shop/getShopList',
      data: {
        city: options.city
      },
      success(res) {
        _this.setData({
          shopList: res.data
        })
        // console.log('------------------------------------');
        console.log(res.data);
        // console.log('------------------------------------');
      }
    })
  },
  phoneCall(event) {
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone //仅为示例，并非真实的电话号码
    })    
  }
})
