// pages/imageUpload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://ect1.portx.cn/rob/index.html#/Entry?" //goEir.action
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // var plate = wx.getStorageSync("userinfo").plate;
    //plate ="GDBCW309Y";
   // console.log("截取 ： "+plate.substring(0, 2))
   // console.log(plate.substring(plate.length - 1, plate.length))
   // console.log(plate.substring(2, plate.length - 1))
   // console.log("http://m.dcblink.com/Cms.action?truck_lic=" + plate.substring(2, plate.length - 1) + "&prov=" + plate.substring(0, 2) + "&color=" + plate.substring(plate.length - 1, plate.length) + "&")
   // this.setData({
     // url: "http://m.dcblink.com/Cms.action?truck_lic=" + plate.substring(2, plate.length - 1) + "&prov=" + plate.substring(0, 2) + "&//color=" + plate.substring(plate.length - 1, plate.length)+"&",
   // });
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
    var openid = wx.getStorageSync("userinfo").openid;
    var truckNumber = wx.getStorageSync("userinfo").plate;
    var idcard = wx.getStorageSync("userinfo").userCardId;
    var phone = wx.getStorageSync("userinfo").phone;
    var name = wx.getStorageSync("userinfo").userName;
    
    var url=this.data.url;
    url = url + "?idCard=" + idcard + "&name=" + name + "&truckNumber=" + truckNumber +"&phone="+phone
    this.setData({
      url:url
    })
    
    console.log(url)


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