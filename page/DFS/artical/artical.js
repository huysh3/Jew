var domain = 'https://72762681.qcloud.la/'

Page({
  data: {
    imageList: []
  },
  onLoad() {
    this.getArticalContent()
  },
  getArticalContent() {
    let _this = this
    wx.request({
      url: domain + '/Test/Weapp/test',
      success(res) {
        console.log('------------------------------------');
        console.log(res.data);
        _this.setData({
          imageList: res.data
        })
        console.log('------------------------------------');
      }
    })
  }
})
