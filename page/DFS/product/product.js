import services from '../../../util/services'
var domain = 'https://72762681.qcloud.la/'
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');
var app = getApp()

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

var pageObject = {
  data: {
    "product": {},
    imgUrls: [],
    indicatorDots: true,
    countdown: 60,
    user: '',
    autoplay: true,
    interval: 5000,
    duration: 400,
    inputPhoneNumber: '',
    hasSend: false,
    // shop_id: '',
    product_id: '',
    price: '',
    total_price: '',
    inputCaptcha: '',
    buying_limitation: 0,
    stock: 0,
    counter: 1,
    carousels: [
      'https://om536p71r.qnssl.com/tips_pic%20white.png',
      'https://om536p71r.qnssl.com/new_Slide2.png'
    ],
    modalProps: {
      title: '操作成功',
      text: ''
    },
    inputPhoneNumber: '',
    inputName: '',
    inputAddr: '',
    receipt: '0',
    inputModalState: false,
    modalStatus: false
  },
  // onShareAppMessage: function () {
  //   var _this = this
  //   return {
  //     title: 'DFS购物超值商品',
  //     path: '/page/DFS/product/product?product_id=' + _this.data.product_id,
  //     success: function(res) {
  //       // 分享成功
  //     },
  //     fail: function(res) {
  //       // 分享失败
  //     }
  //   }
  // },
  onLoad: function(options) {
    wx.setNavigationBarTitle({title: '商品详情'})
    this.getProductInfo(options)
  },
  buyBtnEvent: function() {
    showBusy('正在通信..');
    var _this = this
    wx.request({
      url: domain + 'V1/order/addCart',
      method: 'get',
      data: {
        product_id: _this.data.product_id,
        price: _this.data.price,
        number: _this.data.counter,
        uid: wx.getStorageSync('uid')
      },
      success(res) {
        if (res.data == 'success') {
          wx.hideToast();
          _this.setData({
            orderList: '',
            total_price: 0,
            'modalProps.title': '已加入购物车',
            'modalProps.text': '请到购物车进行商品结算',
            modalStatus: true
          })
          wx.setStorageSync('cartBadgeNum', parseInt(wx.getStorageSync('cartBadgeNum')) + 1)
        } else {
          showModel('加车失败', res.data);
        }
      },
      fail(error) {
        showModel('请求失败', 'error');
      }
    })
  },
  decr: function() {
    var _this = this
    if (_this.data.counter > 1) {
      this.setData({
        counter: _this.data.counter - 1,
        total_price: _this.data.counter * this.data.price
      })
    }
  },
  incr: function() {
    var _this = this
    this.setData({
      counter: _this.data.counter + 1,
      total_price: _this.data.counter * this.data.price
    })
  },
  modalHide() {
    this.setData({
      modalStatus: false
    })
  },
  countDownEvent: function() {
    var _this = this
    var sendPhoneCodeInterval = setInterval(function() {
      if (_this.data.countdown == 0) {
        clearInterval(sendPhoneCodeInterval)
        _this.setData({
          countdown: 60,
          hasSend: false
        })
      } else {
        _this.setData({
          countdown: _this.data.countdown - 1
        })
      }
    }, 1000)
  },
  getProductInfo: function(options) {
    var _this = this
    wx.request({
        url: domain + 'V1/weapp/product_info',
        data: {
          product_id : options.product_id,
        },
        method: 'get',
        success: (response) => {
          _this.setData({
            product_id: response.data.id,
            price: response.data.price,
            buying_limitation: response.data.buying_limitation,
            stock: response.data.stock
          })
          _this.setData({product: response.data})
        },
        fail: (err) => {
        }
    });
  },
  previewImgs: function(e) {
    var _this = this
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: _this.data.product.banner_image_urls
    })
  },
  phoneCall: function() {
    var _this = this
    wx.makePhoneCall({
      phoneNumber: _this.data.product.shop.contact_phone //仅为示例，并非真实的电话号码
    })
  },
  bindNameInput: function(e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  bindPhoneInput: function(e) {
    this.setData({
      inputPhoneNumber: e.detail.value
    })
  },
  bindAddrInput: function(e) {
    this.setData({
      inputAddr: e.detail.value
    })
  },  
  inputModalCancel: function() {
    this.setData({
      inputModalState: false,
      inputAddr: '',
      inputName: '',
      inputPhoneNumber: '',
      receipt: '0'
    })
  },  
  buyNowEvent: function() {
    if (this.data.counter > this.data.stock) {
      showModel('下单失败', '超出库存, 当前库存：' + this.data.stock)
      return;
    }
    if (this.data.counter > this.data.buying_limitation) {
      showModel('下单失败', '超出限购, 当前限购数量：' + this.data.buying_limitation)
      return;
    }
    this.setData({
      inputModalState: true,
      inputAddr: '',
      inputName: '',
      inputPhoneNumber: '',
      receipt: '0'      
    })
  },
  buyNow: function() {
    var _this = this
    wx.request({
      url: domain + 'V1/order/buyNow',
      data: {
        product_id: _this.data.product_id,
        price: _this.data.price,
        number: _this.data.counter,
        uid: wx.getStorageSync('uid'),
        consignee: _this.data.inputName,
        phone: _this.data.inputPhoneNumber,
        address: _this.data.inputAddr,
        receipt: _this.data.receipt
      },
      success(res) {
        if (res.data.errcode == '1') {
          showBusy('正在通信..');
          _this.inputModalCancel()
          _this.callPay(res.data.order_id)
        } else {
          showModel('支付失败', res.data.errmsg)
        }
      }
    })
  },
  callPay(order_id) {
    var _this = this
    wx.request({
        url: domain + 'V1/Wechatpay/callPay',
        data: {
            order_id: order_id,
            uid: wx.getStorageSync('uid')
        },
        success(res) {
            wx.hideToast();
            console.log(res.data.data.timeStamp)
            if (res.data.result == 'success') {
                wx.requestPayment({
                    'timeStamp': res.data.data.timeStamp,
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data.package,
                    'signType': res.data.data.signType,
                    'paySign': res.data.data.paySign,
                    'success': function() {
                        // 支付成功
                        _this.setData({
                            "modalProps.title": '支付成功',
                            "modalProps.text": '订单已经生成，如有任何问题请与客服联系。谢谢惠顾！',
                            modalStatus: true
                        })
                    },
                    'fail': function(res) {
                        showModel('支付失败', '请重新尝试支付')
                    }
                })
            } else {
                showModel('拉起支付失败', res.data.result)
            }
        }
    })
  }
}

Page(pageObject)
