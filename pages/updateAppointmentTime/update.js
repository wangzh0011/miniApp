// pages/updateAppointmentTime/update.js

var server = getApp().data.servsers;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeQuantumList: [],
    siteDesc: '',
    time: '',
    tranType: '',
    dateTime: '',
    timeQuantum: '',
    site: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var site = options.site
    var time = options.time
    var tranType = options.tranType
    var that = this;
    //获取时间段对象
    wx.request({
      url: server + 'getTimeQuantum',
      data: {
        site: site
      },
      success: (result)=>{
        var timeQuantumList = result.data.list
        that.setData({
          timeQuantumList: timeQuantumList
        })
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });

    this.setData({
      siteDesc: site == 'D' ? '内贸' : '外贸',
      time: time,
      tranType: tranType,
      site: site
    })
  },

  /**
   * 选择预约时间
   * @param {*} e 
   */
  chooseAppointmentTime: function(e) {
    console.log(e)
    //选中项的值  时间
    var value = e.detail.value;
    //选中的时间和日期
    var dateTime = value.split(" ")[0]
    var timeQuantum = value.split(" ")[1]
    //设置选中日期和时间数据
    this.setData({
      dateTime: dateTime,
      timeQuantum: timeQuantum
    })
  },

  /**
   * 修改预约时间
   */
  updateAppointmentTime: function () {
    var that = this;
    var dateTime = this.data.dateTime
    var timeQuantum = this.data.timeQuantum
    var site = this.data.site
    var time = this.data.time
    wx.showModal({
      title: '确认修改信息',
      content: '是否确认将预约时间\n【' + time + '】\n修改为\n【' + dateTime + ' ' + timeQuantum + '】',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          that.updateAppointmentTimeRequest(dateTime,timeQuantum,site)
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    
  },

  /**
   * 修改预约时间请求
   */
  updateAppointmentTimeRequest: function(dateTime,timeQuantum,site) {
    wx.request({
      url: server + 'updateAppointmentTime',
      data: {
        openid: wx.getStorageSync("userinfo").openid,
        dateTime: dateTime,
        timeQuantum: timeQuantum,
        site: site
      },
      success: (result)=>{
        if(result.data.code == 0) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 3000,
            mask: false,
            success: (result)=>{
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/listEir/Eir',
                });
              }, 1500);
            },
          });
        } else {
          wx.showModal({
            title: '系统提示',
            content: result.data.msg,
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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