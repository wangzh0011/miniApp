// pages/suggest/suggest.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNum: 0,
    disabled: false,
    value: ''
  },


  submitTap: function() {
    console.log(1)
    var that = this;
    wx.requestSubscribeMessage({

      tmplIds: [app.tmplIds.suggestId],
      success(res) {
        var reg = RegExp(/accept/)
        var reg1 = RegExp(/reject/)
        if (JSON.stringify(res).match(reg1)) {

          wx.showModal({
            title: '温馨提示',
            content: '未订阅相关消息，请订阅此消息或到小程序设置里面开启订阅消息',
          })
          return;

        }
        if (JSON.stringify(res).match(reg)) {

          console.log("提交建议")
          var suggest = that.data.value;
          if (suggest.trim() == '') {
            that.setData({
              showTopTips: true,
              errormsg: "提交的内容不能为空!"
            })
            return;
          }
          that.setData({
            disabled: true
          })
          var date = new Date();
          var currentMonth = date.getMonth() + 1;
          var currentDay = date.getDate();
          var currentHours = date.getHours();
          var currentMinute = date.getMinutes();
          if (currentMonth < 10) {
            currentMonth = "0" + currentMonth;
          }
          if (currentDay < 10) {
            currentDay = "0" + currentDay;
          }
          if (currentHours < 10) {
            currentHours = "0" + currentHours;
          }
          if (currentMinute < 10) {
            currentMinute = "0" + currentMinute;
          }
          var currentTime = date.getFullYear() + "-" + currentMonth + "-" + currentDay + " " + currentHours + ":" + currentMinute;
          console.log("log:" + suggest);
          var userInfo = wx.getStorageSync("userinfo");
          wx.request({
            url: getApp().data.servsers + 'suggest',
            data: {
              openId: userInfo.openid,
              userName: userInfo.userName,
              plate: userInfo.plate,
              phone: userInfo.phone,
              createTime: currentTime,
              suggest: suggest,
              status: "0"
            },
            success: function (res) {
              if (res.data.code == 0) {
                wx.showModal({
                  content: '感谢您提出的宝贵建议，请留意后续的消息推送。',
                  confirmText: '确定',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/pages/listEir/Eir',
                      })
                    }
                  }
                })
              }
            },
            fail: function (res) {
              wx.showModal({
                content: '网络异常，请稍候重试。',
                showCancel: false,
                confirmText: '确定',
                success: function (res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '/pages/listEir/Eir',
                    })
                  }
                }
              })
            }
          })

        }

      },
      fail(res) {
        //表示关闭了订阅消息
        wx.showModal({
          title: '温馨提示',
          content: '未订阅相关消息，请订阅此消息或到小程序设置里面开启订阅消息',
        })
      }

    })
    
  },

  cancelShowTop: function(e){
    var that = this;
    var value = e.detail.value;
    var showTopTips = that.data.showTopTips;
    if(showTopTips){
      that.setData({
        showTopTips: false,
        value: ''
      })
    }
  },

  inputTap: function(e){
    var that = this;
    var value = e.detail.value;
    var len = parseInt(value.length);
    that.setData({
      currentNum: len,
      value: value
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