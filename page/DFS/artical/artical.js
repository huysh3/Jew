var domain = 'https://72762681.qcloud.la/'

Page({
  data: {
    imageList: []
  },
  onLoad(options) {
    this.getArticalContent(options)
  },
  getArticalContent(options) {
    let _this = this
    wx.request({
      url: domain + '/V1/Weapp/getArticalById',
      data: {
        artical_id: options.artical_id
      },
      success(res) {
        console.log('------------------------------------');
        console.log(res.data);
        _this.setData({
          imageList: res.data.images
        })
        console.log('------------------------------------');
      }
    })
  }
})
