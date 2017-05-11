var domain = 'https://72762681.qcloud.la/'

Page({
  data: {
    cityList: [],
    hotList: ['上海','北京','广州','深圳','南京','成都']
  },
  onShow() {
    this.getCityList()
  },
  getCityList() {
    let _this = this
    wx.request({
      url: domain + 'V1/Shop/getCityList',
      success(res) {
        _this.setData({
          cityList: res.data
        })
        console.log('------------------------------------');
        console.log(res.data);
        console.log('------------------------------------');
      }
    })
  }
})
