// pages/test/test.js

const plugin = requirePlugin("WechatSI")

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
    var that = this;
    plugin.textToSpeech({
      lang: "zh_CN",
      tts: true,
      content: "一个常见的需求",
      success: function (res) {
        if (res.retcode == 0) {

          that.setAudioPlay(res.filename)

          console.log(res.filename)

        } else {
          console.warn("语音合成失败", res, item)
        }
      },
      fail: function (res) {
        console.log("fail tts", res)
      }
    })
  },

  /**
   * 播放音频
   */
  setAudioPlay(filename) {
    let adctx = wx.createInnerAudioContext()
    adctx.autoplay = true
    adctx.loop = true
    adctx.src = filename
    adctx.onPlay(() => {
      console.log('开始播放')
      adctx.play()
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