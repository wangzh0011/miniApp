// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    orderVo: null,
    eirUrl: [],
    sealUrl: [],
    attachUrl: [],

  },
  update: function(e) {
    console.log(this.data.eirUrl)
    var that = this;
    that.setData({
      disabled:true
    });
    

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
    
    
    var index = e.currentTarget.dataset.index;

    wx.request({
      url: getApp().data.servsers +'isupdate',
      data: {
        id: that.data.orderVo.order.id,
      },
      success:function(res){
        
        if(res.data.code==0){
          wx.navigateTo({
            url: '/pages/updateorder/updateorder?id=' + index,
          })
        }else{
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

                that.setData({
                  disabled: false
                });
                wx.navigateBack({
                  url: '/pages/listEir/Eir',
                })
                // wx.switchTab({
                //   url: '/pages/listEir/Eir',
                // })
              }
            }
          });
            
        }
       
      }


    })






  },
  cancel: function(e) {
    
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

    var that = this;
    that.setData({
      disabled: true
    });
    wx.request({
      url: getApp().data.servsers + 'cancel',
      data: {
        id: that.data.orderVo.order.id,
      },
      success:function(res){
        if(res.data.code=='0'){
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  url: '/pages/listEir/Eir',
                })
                // wx.switchTab({
                //   url: '/pages/listEir/Eir',
                // })
              }
            }
          });
        }
        else{
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  disabled: false
                });
                wx.navigateBack({
                  url: '/pages/listEir/Eir',
                })
                // wx.switchTab({
                //   url: '/pages/listEir/Eir',
                // })
              }
            }
          });
        }
      }
      
    })
  },
  addSeal: function(e) {

    var orderid = this.data.orderVo.orderId;
    wx.navigateTo({
      url: '/pages/addseal/seal?orderid=' + orderid,
    })
  },
  previewImage: function(e) {
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
  onLoad: function(options) {

    var orderVo = getApp().order.order[options.order];

    this.setData({
      orderVo: orderVo,
      eirUrl: [getApp().data.uploadurl + orderVo.order.eirImg],
      servsers: getApp().data.servsers,
    })

    if (orderVo.order.sealImg != null) {
      this.setData({
        sealUrl: [getApp().data.uploadurl + orderVo.order.sealImg],
      })
    }
    if (orderVo.order.attachImg != null) {
      this.setData({
        attachUrl: [getApp().data.uploadurl + orderVo.order.attachImg],
      })
    }
    var that = this;



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})