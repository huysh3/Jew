import services from '../../../util/services'

var domain = 'https://72762681.qcloud.la/'
var qcloud = require('../../../vendor/qcloud-weapp-client-sdk/index');

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
    unfinishedOrderList: '',
    historyOrderList: '',
    indexOrderList: [],
    orderList: [],
    shopInfo: wx.getStorageSync('shopInfo'),    
    leftPartClass: 'header-left-part active',
    rightPartClass: 'header-right-part',
    tabState: 'left',
    total_price: '0',
    total_price_rmb: '0',
    inputPhoneNumber: '',
    inputName: '',
    inputAddr: '',
    doneModalStatus: false,
    inputModalState: false,
    needPay: false,
    receipt: '0',
    modalProps: {
      text: ''
    },
    footbarState: {
      tabStatus: 'orderCenter',
      cartBadgeNum: wx.getStorageSync('cartBadgeNum')
    }
  },
  onShow: function() {
    var _this = this
    this.getCartList()
    wx.setStorageSync('tabStatus', 'orderCenter')
    this.setData({ 'shopInfo': wx.getStorageSync('shopInfo') })
    this.setData({ "footbarState.cartBadgeNum": wx.getStorageSync('cartBadgeNum') })
  },
  onLoad: function() {
  },
  getCartList: function() {
    var orderLists = []
    var _this = this
    wx.request({
      url: domain + 'Home/weapp/cart_list',
      data: {
        uid: wx.getStorageSync('uid'),
        shop_id: wx.getStorageSync('shop_id')
      },
      success(res) {
        if (res.data.length == 0) {
          return false;
        }
        var temp = 0
        var temp_rmb = 0
        res.data.map(function(index) {
          temp = temp + parseInt(index.order.price)
          temp_rmb = temp_rmb + parseInt(index.product.RMB) * parseInt(index.order.number)
        })
        _this.setData({
          orderList: res.data,
          total_price: temp,
          total_price_rmb: temp_rmb
        })
      },
      error(res) {
        console.log(res.data)
      }
    })
  },
  showHistoryOrderList: function() {
    this.setData({indexOrderList: this.data.historyOrderList})
    this.setData({
      rightPartClass: 'header-right-part active',
      leftPartClass: 'header-right-part',
      tabState: 'right'
    })
  },
  showUnfinishedOrderList: function() {
    this.setData({indexOrderList: this.data.unfinishedOrderList})
    this.setData({
      rightPartClass: 'header-right-part',
      leftPartClass: 'header-right-part active',
      tabState: 'left'
    })
  },
  // 需要支付
  // 需要弹窗
  handleConfirmBtn: function() {
      var _this = this
      if (this.data.orderList.length == 0) {
          showModel('尚无商品', '请先去商品目录挑选商品');
          return false;
      }
      _this.setData({
        inputModalState: true
      })
  },
  checkboxChange: function(e) {
    if (e.detail.value[0] == 'receipt') {
      this.setData({
        receipt: '1'
      })
    } else {
      this.setData({
        receipt: '0'
      })      
    }
  },
  combineOrder: function() {
    var _this = this
    showBusy('正在通信..');
    wx.request({
      url: domain + 'V1/order/combineOrder',
      data: {
          uid: wx.getStorageSync('uid'),
          consignee: _this.data.inputName,
          phone: _this.data.inputPhoneNumber,
          address: _this.data.inputAddr,
          receipt: _this.data.receipt
      },
      success(res) {
          if (res.data) {
            _this.setData({
              inputModalState: false,
              inputAddr: '',
              inputName: '',
              inputPhoneNumber: '',
              receipt: '0'
            })            
            if (res.data.errcode == '1') {
              _this.callPay(res.data.order_id)
            } else {
              showModel('支付失败', res.data.errmsg)
            }
          }
      }
    })    
  },
  // 无需支付
  // 预购订单用confirm，手机号弹窗
  handleCombineBtn: function() {
    if (this.data.orderList.length == 0) {
      showModel('尚无商品', '请先去商品目录挑选商品');
      return false;
    }
    this.setData({
      inputModalState: true,
      needPay: false
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
  confirmOrder: function() {
      showBusy('正在通信..');
      var _this = this
      wx.request({
          url: domain + 'V1/order/confirmOrder',
          data: {
              phone: _this.data.inputPhoneNumber,
              uid: wx.getStorageSync('uid'),
              shop_id: wx.getStorageSync('shop_id')        
          },
          success(res) {
              if (res.data) {
                  // showSuccess('订单已提交');
                  wx.setStorageSync('cartBadgeNum', 0)
                  _this.setData({
                      orderList: '',
                      total_price: 0,
                      total_price_rmb: 0,
                      "footbarState.cartBadgeNum": 0
                  })
                  wx.hideToast();
                  _this.setData({
                      "modalProps.text": '谢谢惠顾！如有任何问题请与客服联系。',
                      doneModalStatus: true
                  })
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
              uid: wx.getStorageSync('uid'),
              shop_id: wx.getStorageSync('shop_id')
          },
          success(res) {
              _this.setData({
                inputModalState: false
              })            
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
                          wx.setStorageSync('cartBadgeNum', 0)
                          _this.setData({
                              orderList: '',
                              total_price: 0,
                              total_price_rmb: 0,
                              "footbarState.cartBadgeNum": 0
                          })
                          _this.setData({
                              "modalProps.text": '谢谢惠顾！如有任何问题请与客服联系。',
                              doneModalStatus: true
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
  },
  emptyCartEvent() {
    var _this = this
    wx.showModal({
      title: '确认清空购物车？',
      content: '清空购物车后，商品需要重新选购',
      success: function(res) {
        if (res.confirm) {
          _this.emptyCart()
        }
      }
    })
  },
  orderChange(event) {
    var _this = this
    var _id = event.currentTarget.dataset.id
    var _option = event.currentTarget.dataset.option
    var _index = event.currentTarget.dataset.index
    wx.request({
      url: domain + 'V1/order/changeCartNumber',
      data: {
        id: _id,
        option: _option,
        shop_id: wx.getStorageSync('shop_id')        
      },
      success(res) {
        console.log(res)
        if (res.data != 'success') {
          showModel('操作失败', res.data)
          return false;
        }
        var tempOrderList = _this.data.orderList
        // 如果减不了了
        if (tempOrderList[_index].order.number <=1 && _option == '-1') {
          _this.deleteOrder({ currentTarget: { dataset: { id: _id } } })
        }
        // 如果还能减
        tempOrderList[_index].order.number = parseInt(tempOrderList[_index].order.number) + parseInt(_option)
        _this.setData({
          orderList: tempOrderList
        })
        _this.priceReload(tempOrderList)
      }
    })
  },
  deleteOrder(event) {
    var _this = this
    var targetId = event.currentTarget.dataset.id
    showBusy('通信中..')
    wx.request({
      url: domain + 'V1/order/deleteOrder',
      data: {
        id : targetId,
        shop_id: wx.getStorageSync('shop_id')
      },
      success(res) {
        if (res.data == 'success') {
          var newOrderList = []
          _this.data.orderList.map(function(item) {
            if (item.order.id == targetId) {
            } else {
              newOrderList.push(item)
            }
          })
          _this.priceReload(newOrderList)
          wx.setStorageSync('cartBadgeNum', parseInt(wx.getStorageSync('cartBadgeNum')) - 1)
          showSuccess('删除完成')
          _this.setData({
            orderList: newOrderList,
            "footbarState.cartBadgeNum": wx.getStorageSync('cartBadgeNum')
          })          
        }
      },
      error(res) {
        console.log(res)
      }
    })
  },
  priceReload(newOrderList) {
    var _this = this
    var temp = 0
    var temp_rmb = 0
    newOrderList.map(function(index) {
      temp = temp + parseInt(index.product.price) * parseInt(index.order.number)
      temp_rmb = temp_rmb + parseInt(index.product.RMB) * parseInt(index.order.number)
    })
    _this.setData({
      total_price: temp,
      total_price_rmb: temp_rmb,
    })
  },
  modalHide() {
    this.setData({
      doneModalStatus: false
    })
  },
  routerGoHistoryOrders() {
    wx.navigateTo({
      url: "../history-orders/history-orders"
    })
  },
  routerGoHome: function() {
    wx.redirectTo({
      url: '../home/home'
    })
  }
}

Page(pageObject)
