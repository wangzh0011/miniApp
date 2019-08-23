// pages/mobileQuery/query.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qccodes: []
  },

  /**
   * 图片预览
   */
  preview: function (e) {
    var qccode = this.data.qccodes;
    qccode[0] = this.data.qccode;
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: qccode // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '图片加载中',
    })
    var that = this;
    wx.downloadFile({
      url: getApp().data.uploadurl + "qccode.png",
      success(res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          console.log("图片下载成功")
          that.setData({
            qccode: res.tempFilePath
          })
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // wx.showLoading({
    //   title: '加载中',
    // })
    // setTimeout(function(){
    //   wx.hideLoading();
    // },1000);
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