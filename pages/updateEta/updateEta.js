//获取应用实例
const app = getApp()
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    eta: '',
    startDate: "请选择日期",
    multiArray: [['今天', '明天'], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2]],
    multiIndex: [0, 0, 0],
    showTips: true,
    showMask: false,
    showDetails: false,
  },

  onLoad: function () {
    var ltrschedule = wx.getStorageSync('ltrschedule');
    // console.log(ltrschedule[0].eta)
    for (var i in ltrschedule){
      var etaOfBarge = ltrschedule[i].eta
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
      if (etaOfBarge == "") {
        ltrschedule[i].eta = currentTime;
      }else {
        ltrschedule[i].eta = etaOfBarge.substring(0, 4) + "-" + etaOfBarge.substring(4, 6) + "-" + etaOfBarge.substring(6, 8) + " " + etaOfBarge.substring(8, 10) + ":" + etaOfBarge.substring(10, 12);
      }
    }
    //设置好eta格式之后，更新缓存
    wx.setStorageSync("ltrscheduleForPick", ltrschedule);
    // console.log(ltrschedule[0].eta)
    this.setData({
      shipName: wx.getStorageSync("userinfo").userName,
      // voyCd: wx.getStorageSync("voyCd")
      ltrschedule: ltrschedule
    })
    
  },

  /**
   * 拉起订阅消息  获取下发权限  驳船预约
   */
  subscribeMessageVesselTap: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.requestSubscribeMessage({//app.tmplIds.serverStopId, app.tmplIds.eeirId,
      tmplIds: [app.tmplIds.berthingId],
      success(res) {
        var reg = RegExp(/accept/)
        var reg1 = RegExp(/reject/)
        if (JSON.stringify(res).match(reg1)) {

          wx.showModal({
            title: '温馨提示',
            content: '未订阅相关消息，请订阅此消息或到小程序设置里面开启订阅消息',
            showCancel: false,
            success(res) {
              wx.redirectTo({
                url: '/pages/updateEta/updateEta',
              })
            }
          })
          return;

        }
        
        if (JSON.stringify(res).match(reg)) {
          that.setData({
            showTips: false//提示点击修改或确认
          })
          //记录提前预报时间
          that.updatePreEtaTap(index);
          //订阅消息后 进入修改eta流程
          that.pickerTap();
          return;
        } 

      },
      fail(res) {
        //表示关闭了订阅消息
        wx.showModal({
          title: '温馨提示',
          content: '未订阅相关消息，请订阅此消息或到小程序设置里面开启订阅消息',
        })
      }
    })
  },

  /**
   * 记录提前预报时间
   */
  updatePreEtaTap: function(index) {
    var ltrschedule = wx.getStorageSync('ltrscheduleForPick');
    wx.request({
      url: app.data.servsers + 'updatePreEta',
      data: {
        voyCd: ltrschedule[index].voyCd,
      },
    })
  },

  /**
   * 查看箱量详情
   */
  showDetailsTap: function(e) {
    var ltrschedule = wx.getStorageSync('ltrscheduleForPick');
    var index = e.currentTarget.dataset.index;
    var showTips = this.data.showTips;
    var that = this;
    if(showTips == true) {
      wx.showModal({
        title: '温馨提示',
        content: '请确定或修改预计到港时间后查询箱量详情',
        showCancel: false
      })
    } else {
      //接口请求
      wx.request({
        url: app.data.servsers + 'showDetails',
        data: {
          voyCd: ltrschedule[index].voyCd,
        },
        success(res) {
          //卸量详情
          var dMap = res.data.map.dMap;
          if(dMap.msg == ""){
            //拼接箱量
            var dData = dMap.data;
            var dMsg = that.concatBox(dData)
            that.setData({
              dMsg: dMsg
            })
          }else{
            that.setData({
              dMsg: dMap.msg
            })
          }
          //装量详情
          var lMap = res.data.map.lMap;
          if (lMap.msg == "") {
            var lData = lMap.data;
            var lMsg = that.concatBox(lData)
            that.setData({
              lMsg: lMsg
            })
          } else {
            that.setData({
              lMsg: lMap.msg
            })
          }
          //码头下单情况
          var dOrdInd = res.data.map.dOrdInd;//卸
          var lOrdInd = res.data.map.lOrdInd;//装
          that.setData({
            dOrdInd: dOrdInd,
            lOrdInd: lOrdInd
          })
        }
      })

      this.setData({
        showMask: true,
        showDetails: true
      })
    }
  },

  /**
   * 拼接箱量
   */
  concatBox: function(data) {
    var msg = "";
    if (data.f20 != "0") {
      msg = msg + data.f20 + "x20'F," 
    }
    if (data.f40 != "0") {
      msg = msg + data.f40 + "x40'F,"
    }
    if (data.f45 != "0") {
      msg = msg + data.f45 + "x45'F,"
    }
    if (data.f48 != "0") {
      msg = msg + data.f48 + "x48'F,"
    }
    if (data.f53 != "0") {
      msg = msg + data.f53 + "x53'F,"
    }
    
    if (data.e20 != "0") {
      msg = msg + data.e20 + "x20'E,"
    }
    if (data.e40 != "0") {
      msg = msg + data.e40 + "x40'E,"
    }
    if (data.e45 != "0") {
      msg = msg + data.e45 + "x45'E,"
    }
    if (data.e48 != "0") {
      msg = msg + data.e48 + "x48'E,"
    }
    if (data.e53 != "0") {
      msg = msg + data.e53 + "x53'E,"
    }
    return msg;
  },

  /**
   * 查看箱量详情点击确定
   */
  confirmTap: function() {
    this.setData({
      showMask: false,
      showDetails: false
    })
  },

  //以下为日期时间选择代码
  pickerTap: function () {
    // this.pickerTap();
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },

  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute < 60) {
      minuteIndex = currentMinute;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 1) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 1) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 1) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute < 60) {
      minuteIndex = currentMinute;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 1) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];
    var index = e.currentTarget.dataset.index;
    var ltrschedule = wx.getStorageSync('ltrscheduleForPick');

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      monthDay = month + "-" + day;
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      var month = date1.getMonth() + 1;
      var day = date1.getDate();
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      monthDay = month + "-" + day;

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      if (month < 10) {
        month = "0" + month
      }
      if (day < 10) {
        day = "0" + day
      }
      monthDay = month + "-" + day;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    var eta = date.getFullYear() + "-" + monthDay + " " + hours + ":" + minute;
    ltrschedule[index].eta = eta;
    that.setData({
      ltrschedule: ltrschedule
    }),

      //bindEtaTap 修改预计到港时间

      wx.request({
        url: app.data.servsers + 'saveEta',
        data: {
          eta: eta,
          voyCd: ltrschedule[index].voyCd,
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data == true) {
            wx.showModal({
              content: '修改成功,已收到您的信息，请关注后续的推送消息。',
              showCancel: false
            })
          } else {
            that.setData({
              showTopTips: true,
              errormsg: "系统错误！"
            });
          }
        },
        fail: function (res) {
          console.log("失败");
        }
      })

  },

  /**
   * 监听下拉刷新
   */
  onPullDownRefresh: function() {
    console.log('updateEta ==> 开始下拉刷新')
    var that = this;
    wx.request({
      url: getApp().data.servsers + 'checkPhoneIsExist',
      data: {
        phone: wx.getStorageSync("userinfo").phone,
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
