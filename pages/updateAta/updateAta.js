//获取应用实例
const app = getApp()
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();


Page({
  data: {
    showButton:[
      "cancel",
    ]
  },

  onLoad: function () {
    
    this.setData({
      // showButton: wx.getStorageSync('showButton'),
      shipName: wx.getStorageSync('userinfo').userName,
      ltrschedule: wx.getStorageSync('ltrschedule')
    })
  },

  bindConfirmTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    var date = new Date();
    var isTakeStep = 'N';//默认不办手续
    var currentMonth = date.getMonth() + 1;
    var currentDay = date.getDate();
    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();
    // var showButton = wx.getStorageSync('showButton');
    // if (showButton.length == 0){
    //   showButton = []
    // }

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
    wx.showModal({
      title: '办联检手续',
      content: '请确认是否办理联检手续',
      showCancel: true,
      cancelText: '否',
      cancelColor: '#FF0000',
      confirmText: '是',
      confirmColor: '#008000',
      success: function (res) {
        wx.showLoading({
          title: '正在加载中',
        })
        if (res.confirm) {
          isTakeStep = 'Y';
          wx.request({
            url: app.data.servsers + 'saveAta',
            data: {
              ata: currentTime,
              comeHere: 'Y',
              phone: wx.getStorageSync("userinfo").phone,
              voyCd: wx.getStorageSync('ltrschedule')[index].voyCd,
              isTakeStep: isTakeStep
            },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data == true) {
                wx.showModal({
                  content: '报到成功,已收到您的信息，请关注后续的推送消息。',
                  showCancel: false
                })
                that.onPullDownRefresh();
              } else {
                wx.showModal({
                  title: '报到失败',
                  content: '资料不齐，请联系驳船计划组：0755-29022956',
                  showCancel: false
                })
              }
              console.log("It will takeStep.");
            },
            fail: function (res) {
              console.log("失败");
            }
          })
        } else {
          isTakeStep = 'N';
          wx.request({
            url: app.data.servsers + 'saveAta',
            data: {
              ata: currentTime,
              comeHere: 'Y',
              phone: wx.getStorageSync("userinfo").phone,
              voyCd: wx.getStorageSync('ltrschedule')[index].voyCd,
              isTakeStep: isTakeStep
            },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data == true) {
                wx.showModal({
                  content: '报到成功,已收到您的信息，请关注后续的推送消息。',
                  showCancel: false
                })
                that.onPullDownRefresh();
              } else {
                wx.showModal({
                  title: '报到失败',
                  content: '资料不齐，请联系驳船计划组：0755-29022956',
                  showCancel: false
                })
              }
              console.log("Not takeStep.");
            },
            fail: function (res) {
              console.log("失败");
            }
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })

  },

  
  bindCancelTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    // var showButton = wx.getStorageSync('showButton');
    // if (showButton.length == 0) {
    //   showButton = []
    // }
    wx.request({
      url: app.data.servsers + 'reSetAta',
      data: {
        ata: '0',//设置0 为取消状态
        comeHere: 'N',
        voyCd: wx.getStorageSync('ltrschedule')[index].voyCd,
        //phone: '13561409736'//test data
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == true) {
          wx.showModal({
            content: '已取消报到',
            showCancel: false
          })
          that.onPullDownRefresh();
        } else {
          that.setData({
            showTopTips: true,
            errormsg: "系统错误！"
          });
        }
        console.log("It's success!");
      },
      fail: function (res) {
        console.log("失败");
      }
    })
  },

  /**
  * 监听下拉刷新
  */
  onPullDownRefresh: function () {
    console.log('updateAta ==> 开始下拉刷新')
    var that = this;
    wx.request({
      url: getApp().data.servsers + 'checkPhoneIsExist',
      data: {
        phone: wx.getStorageSync("userinfo").phone
      },
      success: function (e) {
        if (e.data == 1) {
          wx.request({
            url: getApp().data.servsers + 'getEta',
            data: {
              phone: wx.getStorageSync("userinfo").phone,
              userName: wx.getStorageSync("userinfo").userName
            },
            success: function (e) {
              wx.setStorageSync('ltrschedule', e.data);
              that.onLoad();
            }
          })
        } else {
          wx.showModal({
            title: '更新驳船信息',
            content: '驳船预留手机号已更改，请更新对应的手机号。',
            showCancel: false,
            confirmText: '去更新',
            success(res) {
              wx.navigateTo({
                url: '/pages/modifi_user/user',
              })
            }
          })
        }
      }
    })

    wx.stopPullDownRefresh();
  }

})
