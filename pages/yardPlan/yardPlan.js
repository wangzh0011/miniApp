// pages/yardPlan/yardPlan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //hiddenmodalput: true,
    other: '其他',
    disabled: false
  },

  chooseSite: function(e) {
    var site = e.detail.value;
    this.setData({
      site: site
    })
  },

  type_Radios: function(e) {
    console.log(e)
    var issueType = e.detail.value;
    this.setData({
      issueType: issueType
    })
    if(issueType == 'other'){
      this.setData({
        showModal: true
      })
    }
  },

  
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.setData({
      showModal: false,
      showTips: false
    })
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function (e) {
    console.log(e)
    var value = this.data.otherText
    if(value == '' || value == undefined){
      this.setData({
        showTips: true,
        errorMsg: '输入的内容不能为空'
      })
      return;
    }
    this.setData({
      other: value,
      showModal: false,
      showTips: false
    })
  },
  /**
   * 获取弹出框文本
   */
  inputChange: function (e) {
    var otherText = e.detail.value
    this.setData({
      otherText: otherText.trim(),
    })
  },

  /**
   * 文本点击事件
   */
  clickTap: function(e){
    this.setData({
      showTips: false
    })
  },


  addOrder: function(e) {
    var site = this.data.site;
    console.log(e)
    var location1 = e.detail.value.location1;
    var location2 = e.detail.value.location2;
    var location = location1 + "-" + location2;
    var issueType = this.data.issueType;
    if (location1 == "" || location1 == undefined || location2 == "" || location2 == undefined){
      wx.showModal({
        title: '提示',
        content: '请输入完整的堆场位置',
        showCancel: false,
        confirmText: '确定'
      })
      return;
    }
    if(site == undefined){
      wx.showModal({
        title: '提示',
        content: '请选择作业地点',
        showCancel: false,
        confirmText: '确定'
      })
      return;
    }
    if(issueType == undefined){
      wx.showModal({
        title: '提示',
        content: '请选择机械问题',
        showCancel: false,
        confirmText: '确定'
      })
      return;
    }
    this.setData({
      disabled: true
    })
    var userInfo = wx.getStorageSync("userinfo");
    //保存formId
    wx.request({
      url: getApp().data.servsers + 'saveFormId',
      data: {
        openid: userInfo.openid,
        plate: userInfo.plate,
        formId: e.detail.formId
      },
      success: function (e) {console.log(e.data) },
      fail: function (e) {
        console.log(e)
      }
    })

    //获取当前时间
    var date = new Date();
    var currentMonth = date.getMonth() + 1;
    var currentDay = date.getDate();
    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();
    if (currentMonth < 10) {
      currentMonth = "0" + currentMonth;
    }
    if (currentDay < 10) {
      currentDay = "0" + currentDay;
    }
    if (currentHours < 10) {
      currentHours = "0" + currentHours;
    }
    if (currentMinute < 10) {
      currentMinute = "0" + currentMinute;
    }
    var currentTime = date.getFullYear() + "-" + currentMonth + "-" + currentDay + " " + currentHours + ":" + currentMinute;
    var other = this.data.other;//其他问题的text
    //提交堆场机械问题
    wx.request({
      url: getApp().data.servsers + "yardPlan",
      data: {
        openId: userInfo.openid,
        userName: userInfo.userName,
        phone: userInfo.phone,
        plate: userInfo.plate,
        site: site,
        issueType: issueType,
        createTime: currentTime,
        issue: other,
        location: location,
        status: "0" //待回复状态
      },
      success: function(res){
        if(res.data.code == 0){
          wx.showModal({
            title: '提示',
            content: '码头将于15分内通过微信服务通知推送机械安排结果，请您耐心等待！',
            confirmText: '确定',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/listEir/Eir',
                })
              }
            }
          })
        }else{
          wx.showModal({
            content: res.data.msg,
            confirmText: '确定',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/listEir/Eir',
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          content: '网络异常，请稍候重试。',
          showCancel: false,
          confirmText: '确定',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/listEir/Eir',
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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