// pages/introduce/introduce.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    introduceImg: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var cacheImage1 = wx.getStorageSync("cacheImage1");
    // console.log("cacheImage1:" + cacheImage1)
    var cacheImage2 = wx.getStorageSync("cacheImage2");
    console.log("cacheImage2:" + cacheImage2)
    if (cacheImage2 != null && cacheImage2 != undefined && cacheImage2 != ""){
        console.log("读取图片缓存")
      that.setData({
        // introduce1: cacheImage1,
        introduce2: cacheImage2
      })
    }else{
      
      console.log("I'm come in ")
      // wx.downloadFile({
      //   url: getApp().data.uploadurl + "introduce1.png",
      //   success (res) {
      //     if(res.statusCode == 200 ) {
      //       console.log("图片下载成功" + res.tempFilePath)
      //       that.setData({
      //         introduce1: res.tempFilePath
      //       })
      //       wx.setStorageSync("cacheImage1", res.tempFilePath);
      //       // var fs = wx.getFileSystemManager();
      //       // console.log("fs"+fs)
      //       // fs.saveFile({
      //       //   tempFilePath: res.tempFilePath,
      //       //   success (res) {
      //       //     console.log("图片缓存成功" + res.savedFilePath)
      //       //     wx.setStorageSync("cacheImage1", res.savedFilePath);
      //       //   }
      //       // })
      //     }
      //   }
      // })
      wx.downloadFile({
        url: getApp().data.uploadurl + "introduce2.png",
        success(res) {
          if (res.statusCode == 200) {
            console.log("图片2下载成功")
            that.setData({
              introduce2: res.tempFilePath
            })
            wx.setStorageSync("cacheImage2", res.tempFilePath);
            // var fs = wx.getFileSystemManager();
            // fs.saveFile({
            //   tempFilePath: res.tempFilePath,
            //   success(res) {
            //     console.log("图片2：" + res.savedFilePath)
            //     wx.setStorageSync("cacheImage2", res.savedFilePath);
            //   }
            // })
          }
        }
      })
      
    }
    
  },

  /**
   * 预览图片
   */
  previewImage: function (e) {
    var introduceImg = this.data.introduceImg;
    // introduceImg[0] = this.data.introduce1;
    introduceImg[0] = this.data.introduce2;
    wx.previewImage({
      current: e.currentTarget.id,
      urls: introduceImg,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      },
    })
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