// pages/InformaTion/user.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false, //防止用户重复按
    showTopTips: false,
    errormsg: "",



    prov: ["粤", "港", "桂", "琼", "赣", "闽", "浙", "苏", "皖", "沪", "豫", "翼", "湘", "鄂", "云", "贵", "鲁", "川", "渝", "青", "陕", "宁", "新", "甘", "晋", "蒙", "京", "津", "辽", "吉", "黑", "藏"],
    provValue: ["GD", "HK", "GX", "HQ", "JX", "FZ", "ZJ", "JS", "AH", "SH", "HN", "HB", "FN", "FB", "YN", "GZ", "SD", "SC", "CQ", "QH", "SX", "NX", "XJ", "GS", "SJ", "NM", "BJ", "TJ", "LN", "JL", "HJ", "XZ"],
    provCodeIndex: 0,

    colorCodes: ["黄", "蓝", "黑", "绿", "红", "白"],
    colorCodesValue: ["Y", "B", "D", "N", "R", "W"],
    colorCodeIndex: 0,


  },
  // saveFormId: function(e) {
  //   console.log("app.data.infobase")
  //   console.log(getApp().infobase)
  //   console.log(e.detail)
  //   wx.request({
  //     url: getApp().data.servsers + '/saveFormId',
  //     data: {
  //       openid: app.infobase.openid,
  //       plate: "null",
  //       formId: e.detail.formId
  //     },
  //     success: function(e) {
  //       console.log(e)
  //     },
  //     fail: function(e) {
  //       console.log(e)
  //     }
  //   })
  // },


  bindprovCodeChange: function(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      provCodeIndex: e.detail.value
    })
  },
  bindcolorCodeChange: function(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      colorCodeIndex: e.detail.value
    })
  },
  changinput: function(e) {
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (reg.test(e.detail.value)) {
      this.setData({
        showTopTips: true,
        errormsg: "车牌号码不能为中文"
      });
    }
    this.setData({
      truck_lic: e.detail.value.toLocaleUpperCase()
    })
  },
  SubMit: function(e) {
    wx.showLoading({
      title: '正在提交...',
    })

    var that = this;
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: app.infobase.openid,
        plate: "null",
        formId: e.detail.formId
      },
      success: function(e) {
        console.log(e)
      },
      fail: function(e) {
        console.log(e)
      }
    })

    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g;
    if (reg.test(e.detail.value.truck_lic)) {
      that.setData({
        showTopTips: true,
        errormsg: "车牌号码不能为中文"
      });
      wx.hideLoading();
      return;
    }

    var formData = e.detail.value;
    console.log(e);
    if (e.detail.value.phone_number == '' || e.detail.value.truck_lic == '' || e.detail.value.cardid == '') {

      that.setData({
        showTopTips: true,
        errormsg: "输入内容不能为空!"
      });
      //提示内容显示时间
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      return;
    }
    var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!reg.test(e.detail.value.phone_number)) {
      that.setData({
        showTopTips: true,
        errormsg: "输入的手机号码不正确"
      });
      //提示内容显示时间
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      return;
    }
    if (e.detail.value.phone_number.length != 11) {
      that.setData({
        showTopTips: true,
        errormsg: "输入的手机号码不正确"
      });



      //提示内容显示时间
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      /*
      var regphone = new RegExp('^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$');
        // regphone.exec()
      var rs = regphone.exec(e.detail.value.phone_number)
      console.log("结果  ：  " + rs )*/




      return;
    }


    reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
    if (!reg.test(e.detail.value.cardid)) {
      that.setData({
        showTopTips: true,
        errormsg: "输入身份证号码不正确!"
      });
      setTimeout(function() {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      return;
    }



    var plate = that.data.provValue[that.data.provCodeIndex] + e.detail.value.truck_lic + that.data.colorCodesValue[that.data.colorCodeIndex];
    //console.log(that.data.provValue[that.data.provCodeIndex])
    // console.log(e.detail.value.truck_lic)
    //console.log(e.detail.value.truck_lic)
    //console.log(plate)
    /** 
    wx.request({
      url: getApp().data.servsers+'/addUser/' + wx.getStorageSync('infobase').openid+'/'
        + e.detail.value.phone_number + '/' + plate + '/' + e.detail.value.cardid + '/' + e.detail.value.username,
       
      success:function(res){
        console.log(res.data);
        console.log("注册信息");
        wx.setStorageSync('userinfo', res.data);
        app.userInfo.userInfo=res.data;
        wx.switchTab({
          url: '/pages/index/index',
        })
        
        console.log('');
      }

    }) */


    console.log("add")
    wx.showLoading({
      title: '提交资料中...',
    })
    that.setData({
      disabled: true
    });
    wx.request({
      url: getApp().data.servsers + 'addUser',
      data: {
        openId: wx.getStorageSync('infobase').openid,
        phone: e.detail.value.phone_number,
        plate: plate,
        userCardId: e.detail.value.cardid,
        userName: e.detail.value.username,
        userType: 'truck'
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        console.log(res.data);
        wx.setStorageSync('userinfo', res.data);
        app.userInfo.userInfo = res.data;
        wx.redirectTo({
          url: '/pages/listEir/Eir'
        })
      },
      complete: function(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 2000)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})