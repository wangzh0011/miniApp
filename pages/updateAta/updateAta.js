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
      title: '提示',
      content: '请上传上一港装船缴费清单，若没有缴费则无需上传',
      showCancel: true,
      cancelText: '无清单',
      confirmText: '去上传',
      cancelColor: '#FF0000',
      confirmColor: '#008000',
      success: (res) => {
        if(res.confirm) {
          wx.chooseImage({
            success: function(res) {
              //上传图片
                wx.showLoading({
                  title: '正在上传',
                })
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                
                var filename = res.tempFilePaths;
              
                //上传图片
                that.uploadFile(filename,0,index)
                  
                //更新ata
                wx.hideLoading()
                wx.showToast({
                  title: '完成上传',
                })
                setTimeout(function() {
                  that.updateAta(index, isTakeStep, currentTime);
                },1800);
                
            },
          })
        }else {
          that.updateAta(index, isTakeStep, currentTime);
        }
      }
    })

  },

  /**
   * 上传图片
   */
  uploadFile: function (filename,index,ltrScheduleIndex) {
    var that = this;
    wx.uploadFile({
      url: getApp().data.servsers + 'saveImageOfVessel',
      filePath: filename[index],
      name: 'image',
      formData: {
        iVoyCd: wx.getStorageSync("ltrschedule")[ltrScheduleIndex].iVoyCd,
        oVoyCd: wx.getStorageSync("ltrschedule")[ltrScheduleIndex].oVoyCd,
        vesselName: wx.getStorageSync('userinfo').userName
      },
      success: function (res1) {
        var jsondata = JSON.parse(res1.data);
        var image = jsondata.data.filename;
        if (image == undefined) {
          wx.hideLoading();
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '此照片未成功上传，请重新选择照片上传！',
            success: function (res) {

            }
          })
        } else {
          console.log("上传成功并保存到了服务器" + image)
          that.setData({
            resuleMessage: '上传成功'
          })
          if (index < filename.length-1) {
            that.uploadFile(filename, index + 1, ltrScheduleIndex)
          } 
        }
      },
      fail: function (res1) {
        console.log("上传文件连接服务器失败:")
        wx.hideLoading()
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新上传！',
          success: function (res) {

          }
        })
      },
      complete: function (res) {
        console.log("结束上传")
      }

    })
  },

  /**
  *更新ata 
  */
  updateAta: function (index,isTakeStep,currentTime) {
    var that = this;
    //弹出办手续提示，并提交更新请求服务器
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
