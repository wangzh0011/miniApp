

function GetDatem (AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);
  var y = dd.getFullYear();
  var m = dd.getFullYear() + '-' + (dd.getMonth() + 1) + '-' + dd.getDate();
  var d = dd.getDate();
  return m ;
};
function GetDate(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期
  var d = dd.getDate();
  return  d;
};
// pages/picture/picture.js
Page({
  
  
 
  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    errormsg: "",
    files: [],
    countries: ["今天("+(new Date().getMonth()+1) +"月"+ new Date().getDate()+"日) 00:00-07:59", 
      "今天(" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日) 08:00-15:59",
      "明天(" + GetDatem(1) + "月" + GetDate(1) +"日) 00:00-07:59",
      "明天(" + GetDatem(1) + "月" + GetDate(1)+ "日) 08:00-15:59",],
    countryIndex: 0,
    openid: wx.getStorageSync("userinfo").openid,
    phone: wx.getStorageSync("userinfo").phone,
    plate: wx.getStorageSync("userinfo").plate,
    name: wx.getStorageSync("userinfo").userName,
    orderId:"null"
  },
  
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: wx.getStorageSync("userinfo").phone,
      plate: wx.getStorageSync("userinfo").plate,
      name: wx.getStorageSync("userinfo").userName,
    })
  
  },
  bindCountryChange: function (e) {
    console.log('picker country 发生选择改变，携带值为', e.detail.value);

    this.setData({
      countryIndex: e.detail.value
    })
  },
  //保存formId
  saveFormId: function (e) {
    console.log(e.detail)
    wx.request({
      url: getApp().data.servsers +'/saveFormId',
      data:{
        openid: wx.getStorageSync("userinfo").openid,
        plate: wx.getStorageSync("userinfo").plate,
        formId: e.detail.formId
      },
      success:function(e){
        console.log(e)
      },
      fail:function(e){
        console.log(e)
      }
    })
  },

  //提交照片
  savaOrder:function(e){
    
    //判断是否有照片
    if (this.data.files.length==0){
      var that = this;
      this.setData({
        showTopTips: true,
        errormsg:"请添加照片"
      });
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
    }
   var  openid = wx.getStorageSync("userinfo").openid;
   var  phone = wx.getStorageSync("userinfo").phone;
   var  plate= wx.getStorageSync("userinfo").plate;
   var  name= wx.getStorageSync("userinfo").userName;
    wx.showToast({
      title: '正在上传',
      icon: 'loading',
      duration: 5000
    });
    for (var index in this.data.files){
      console.log(this.data.files[index])
      wx.uploadFile({
        
        url: getApp().data.servsers + '/image',
        name:"image",
        filePath: this.data.files[index],
        formData: {
          openid: openid,
          phone: phone,
          plate: plate,
          name: name,
          serveType: "EIR",
          arrive: this.data.countries[this.data.countryIndex]


        },       
        success:function(e){
          wx.hideLoading();

          if(e.data.code==-1){
            wx.showModal({
              content: e.data.msg,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          }
          console.log("单证照片上传完成")
          console.log(e)
          var orderId = JSON.parse(e.data).orderId;
          wx.showModal({
            title: '单证照片上传完成',
            content: '如有封条请添加封条照片',
            cancelText: '不添加',
            confirmText: '添加',
            success: function (e) {
             
              if (e.confirm) {
                console.log('点击了确认按钮');
                wx.redirectTo({
                  url: '/pages/addseal/seal?orderid=' + orderId,
                })
              } else {
                wx.switchTab({
                  url: '/pages/listEir/Eir',
                })
                console.log('点击了取消认按钮')
              }
            },
            fail: function (e) {

            },

          })
        },
        fail:function(e){
          console.log("失败")
          console.log(e)
        }
        
      }) 
    }
  },


  chooseImage: function (e) {
   // console.log(e.detail)
    var that = this;
    
    
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: res.tempFilePaths
          //files: that.data.files.concat(res.tempFilePaths)
        });
       // console.log(res.tempFilePaths[0])
       // console.log(res.tempFiles)

        
        
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
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