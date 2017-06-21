// 引入 QCloud 小程序增强 SDK
var qcloud = require('./vendor/qcloud-weapp-client-sdk/index');
var config = require('./config');
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

App({
  onShow: function () {
    qcloud.setLoginUrl(config.service.loginUrl);
    this.doLogin()
    this.getCartBadge()
    if (!wx.getStorageSync('shop_id')) {
      wx.setStorageSync('shop_id', '1')
    }
  },
  doLogin: function() {
      showBusy('正在登录');
      // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
      qcloud.login({
          success(result) {
              showSuccess('登录成功');
              console.log('登录成功', result);
              qcloud.request({
                url: 'https://72762681.qcloud.la/Home/weapp/getUid',
                success(response) {
                  console.log(response)
                  wx.setStorageSync('uid', response.data)
                }
              })
          },
          fail(error) {
              showModel('获取数据失败', '网络超时，请退出重试');
          }
      });
  },
  getCartBadge: function() {
    var _this = this
    wx.request({
      url: 'https://72762681.qcloud.la/Test/weapp/getCartNumber',
      data: {
        uid: wx.getStorageSync('uid')
      },
      success(res) {
        _this.cartBadgeNum = res.data
        wx.setStorageSync('cartBadgeNum', res.data)
      },
      fail(error) {
        showModel('获取数据失败', '网络超时，请退出重试')
      }
    });
  },
  cartBadgeNum: 0
})
