// pages/addseal/seal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    errormsg: "",
    files: [],
    countries: ["00：00-8：00", "一个小时内", "一个半小时内", "两个小时内"],
    countryIndex: 0,
    openid: wx.getStorageSync("userinfo").openid,
    phone: wx.getStorageSync("userinfo").userNumber,
    plate: wx.getStorageSync("userinfo").plate,
    orderId: "null"
  },

  //保存formId
  saveFormId: function (e) {
    console.log(e.detail)
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: wx.getStorageSync("userinfo").openid,
        plate: wx.getStorageSync("userinfo").plate,
        formId: e.detail.formId
      },
      success: function (e) {
        console.log(e)
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },

  //提交照片
  savaOrder: function (e) {
    
    
    var that = this;
    //判断是否有照片
    if (this.data.files.length == 0) {
      
      this.setData({
        showTopTips: true,
        errormsg: "请添加照片"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    }
    for (var index in this.data.files) {
      console.log(this.data.files[index])
      wx.uploadFile({

        url: getApp().data.servsers + '/image',
        name: "image",
        filePath: this.data.files[index],
        formData: {
          orderId: that.data.orderId,
          openid: that.data.openid,
          phone: that.data.phone,
          plate: that.data.plate,
          serveType: "SEAL"

        },
        success: function (e) {
          wx.switchTab({
            url: '/pages/listEir/Eir',
          })
        },
        fail: function (e) {
          console.log("失败")
          console.log(e)
        }

      })
    }
  },

  //选择照片
  chooseImage: function (e) {
    // console.log(e.detail)
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: res.tempFilePaths        
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var orderid=options.orderid;
     console.log(orderid)
     if(orderid!=null){
       this.setData({
         orderId: orderid,
         openid: wx.getStorageSync("userinfo").openid,
         phone: wx.getStorageSync("userinfo").userNumber,
         plate: wx.getStorageSync("userinfo").plate,
       })
     }
     else{
       wx.redirectTo({
         url: 'pages/listEir/Eir',
       })
      /* wx.showModal({
         title: '单证照片上传完成',
         content: '如有封条请添加封条照片',
         cancelText:"添加",
         confirmText:'不添加',
         success:function(e){
           
           if(e.confirm){
             console.log('点击了确认按钮')
           }else{
             console.log('点击了取消认按钮')
           }
           

           
         },
         fail:function(e){
           
         },
         
       })*/
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