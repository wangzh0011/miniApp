// pages/cms/cms.js
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
    console.log("1111")
    console.log(options.plate)
    wx.showLoading({
      title: '数据加载中...',

    });
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)
    wx.request({
      url: getApp().data.servsers + 'getCms/' + options.plate,
      success:function(e){
        wx.hideLoading();
        console.log(e.data)
        if (e.data == "cms is null"){
          that.setData({
            msg: '您输入的车牌号码' + options.plate+'查无记录'
          }) 
        }else{
          
            that.setData({
              msg: null,
              document: e.data.document
            }) 
            
          
        }
        
        console.log(e.data.document)
        console.log(e)
      },
      fail:function(){
        wx.hideLoading();
        wx.showModal({
          content: '未能连接服务器',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: -1
              })
              console.log('用户点击确定')
            }
          }
        });
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