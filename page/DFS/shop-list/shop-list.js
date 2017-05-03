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
      url: domain + 'Home/Shop/getShopList',
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
  }
})
