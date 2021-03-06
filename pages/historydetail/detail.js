// pages/historydetail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    eirUrl: [],
    sealUrl: [],
    attachUrl: [],
  },
  previewImage: function (e) {
    //console.log(e)
    if ("eir" == e.currentTarget.dataset.type) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.eirUrl // 需要预览的图片http链接列表
      })
    }
    if ("seal" == e.currentTarget.dataset.type) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.sealUrl // 需要预览的图片http链接列表
      })
    }
    if ("attach" == e.currentTarget.dataset.type) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.attachUrl // 需要预览的图片http链接列表
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    wx.request({
      url: getApp().data.servsers + 'getOrderById',
      data:{
        Id:id,
      },
      success:function(res){
        console.log(res)
         console.log(res.data)
         that.setData({
           orderVo:res.data,
         })
        var orderVo = res.data;
        var url = getApp().data.uploadurl;
        var sealUrl = that.data.sealUrl;
        var attachUrl = that.data.attachUrl;
        console.log("orderVo")
        console.log(orderVo)
        that.setData({
          
          eirUrl: [url + orderVo.order.eirImg],
          servsers: getApp().data.servsers,
        })

        if (orderVo.order.sealImg != null) {
          sealUrl[0] = url + orderVo.order.sealImg;
          that.setData({
            sealUrl: sealUrl,
          })
        }
        if (orderVo.order.sealImg1 != null) {
          sealUrl[1] = url + orderVo.order.sealImg1;
          that.setData({
            sealUrl: sealUrl,
          })
        }
        if (orderVo.order.attachImg != null) {
          attachUrl[0] = url + orderVo.order.attachImg;
          that.setData({
            attachUrl: attachUrl,
          })
        }
        if (orderVo.order.attachImg1 != null) {
          attachUrl[1] = url + orderVo.order.attachImg1;
          that.setData({
            attachUrl: attachUrl,
          })
        }
      },
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