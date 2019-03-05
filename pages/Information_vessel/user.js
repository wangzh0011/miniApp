// pages/Information_vessel/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false, //防止用户重复按
    showTopTips: false,
    errormsg: "",
  },
  
 
  SubMit: function (e) {
    wx.showLoading({
      title: '正在提交...',
    })

    var that = this;
    // wx.request({
    //   url: getApp().data.servsers + '/saveFormId',
    //   data: {
    //     openid: app.infobase.openid,
    //     plate: "null",
    //     formId: e.detail.formId
    //   },
    //   success: function (e) {
    //     console.log(e)
    //   },
    //   fail: function (e) {
    //     console.log(e)
    //   }
    // })


    var formData = e.detail.value;
    console.log(e);
    if (e.detail.value.phone_number == '' || e.detail.value.username == '') {

      this.setData({
        showTopTips: true,
        errormsg: "输入内容不能为空!"
      });
      //提示内容显示时间
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      return;
    }
    var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!reg.test(e.detail.value.phone_number)) {
      this.setData({
        showTopTips: true,
        errormsg: "输入的手机号码不正确"
      });
      //提示内容显示时间
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      return;
    }
    if (e.detail.value.phone_number.length != 11) {
      var that = this;
      this.setData({
        showTopTips: true,
        errormsg: "输入的手机号码不正确"
      });
      //提示内容显示时间
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      return;
    }


    console.log("add")
    wx.showLoading({
      title: '提交资料中...',
    })
    this.setData({
      disabled: true
    });
    wx.request({
      url: getApp().data.servsers + 'addUser',
      data: {
        openId: wx.getStorageSync('infobase').openid,
        phone: e.detail.value.phone_number,
        userName: e.detail.value.username,
        userType: 'vessel'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.setStorageSync('userinfo', res.data);
        app.userInfo.userInfo = res.data;
        wx.redirectTo({
          url: '/pages/listEir/Eir'
        })
      },
      complete: function (res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})