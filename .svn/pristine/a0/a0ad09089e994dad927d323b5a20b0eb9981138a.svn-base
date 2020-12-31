// pages/cosido/cosido.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    docref: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  inputTap: function (e) {
    var docref = e.detail.value;
    this.setData({
      docref: docref
    })
  }, 

  onTap: function () {
    var that = this;
    var docref = this.data.docref;
    if(docref.trim() == ""){
      wx.showToast({
        title: '请输入提单号',
        icon: 'none'
      })
      this.setData({
        docref: ""
      })
      return;
    }
    wx.request({
      url: getApp().data.servsers + 'cosido',
      data: {
        docref: docref
      },
      success: function (res) {
        console.log(res.data)
        if(res.data != null && res.data != ""){
          that.setData({
            cosido: res.data,
            nodata: 'no'
          })
        }else{
          that.setData({
            nodata: 'yes'
          })
        }
      },
      fail: function () {
        that.setData({
          nodata: 'yes'
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