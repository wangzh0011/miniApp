// pages/operNotice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operNotice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通知列表
    var operNotice = wx.getStorageSync("operNotice");
    this.setData({
      operNotice: operNotice,
      noticeLength: operNotice.length
    })
  },

  /**
   * 详情页
   */
  noticeDetailTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var operNotice = wx.getStorageSync("operNotice");
    var noticeDetail = operNotice[index];
    wx.setStorageSync("noticeDetail", noticeDetail);
    wx.request({
      url: getApp().data.servsers + 'updateViews',
      data: {
        id: noticeDetail.id
      },
      success: function () {
        wx.navigateTo({
          url: '/pages/operNotice/noticeDetail',
        })
      },
      fail: function () {
        wx.showModal({
          title: '系统异常',
          content: '请退出小程序重试！',
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