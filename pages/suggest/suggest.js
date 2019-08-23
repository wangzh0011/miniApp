// pages/suggest/suggest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNum: 0,
    disabled: false,
  },


  submitTap: function(e) {
    console.log("提交建议")
    var suggest = e.detail.value.suggest;
    if(suggest.trim() == ''){
      this.setData({
        showTopTips: true,
        errormsg: "提交的内容不能为空!"
      })
      return;
    }
    this.setData({
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
    console.log("log:"+suggest);
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
      success: function(res) {
        if(res.data.code == 0){
          wx.showModal({
            content: '感谢您提出的宝贵建议，请留意后续的消息推送。',
            confirmText: '确定',
            showCancel: false,
            success: function(res){
              if(res.confirm){
                wx.reLaunch({
                  url: '/pages/listEir/Eir',
                })
              }
            }
          })
        }
      },
      fail: function(res) {
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
  },

  cancelShowTop: function(e){
    var value = e.detail.value;
    var showTopTips = this.data.showTopTips;
    if(showTopTips){
      this.setData({
        showTopTips: false,
        value: ''
      })
    }
  },

  inputTap: function(e){
    var value = e.detail.value;
    var len = parseInt(value.length);
    this.setData({
      currentNum: len
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