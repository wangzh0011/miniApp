// pages/history/historyorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: wx.getStorageSync("userinfo").openid,
    items: [],
  },


  saveFormId: function (e) {

    if (e.detail.formId == '' || e.detail.formId == 'undefined') {
      console.log('获取表单id为无效')
      return 0;
    }
    var openid = wx.getStorageSync("userinfo").openid;
    var plate = wx.getStorageSync("userinfo").plate;
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: openid,
        plate: plate,
        formId: e.detail.formId
      },
      success: function (e) {
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  godetail: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: '/pages/historydetail/detail?id=' + index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var openId = wx.getStorageSync("userinfo").openid;
    wx.request({
      url: getApp().data.servsers + 'getOrderAll',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      data:{
        openId: openId,
      },
      success: function (e) {
        console.log(e)
        that.setData({
          items: e.data
        })
        
      }
    })
  
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
    this.setData({
      servsers: getApp().data.uploadurl,
    })
  
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