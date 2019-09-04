// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type;
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      },
    })

    if(type == 'customer'){
      this.setData({
        srcUrl: getApp().data.uploadurl + "introduce_customer.mp4",
        imgUrl: getApp().data.uploadurl + "introduce_customer.png"
      })
      return;
    }
  
    var userType = wx.getStorageSync("userinfo").userType;
    if(userType == 'truck'){
      this.setData({
        srcUrl: getApp().data.uploadurl + "introduce.mp4",
        imgUrl: getApp().data.uploadurl + "introduce.png"
      })
    }else if(userType == 'vessel'){
      this.setData({
        srcUrl: getApp().data.uploadurl + "introduce_vessel.mp4",
        imgUrl: getApp().data.uploadurl + "introduce_vessel.png"
      })
    }
    
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