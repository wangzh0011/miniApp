//获取应用实例
const app = getApp()
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();


Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    eta: '',
    startDate: "请选择日期",
    multiArray: [['今天', '明天'], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2]],
    multiIndex: [0, 0, 0],
    radioItems: [
      { name: '是', value: '0' },
      { name: '否', value: '1', checked: true }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },

  onLoad: function () {
    var etaOfBarge = wx.getStorageSync('eta').toString();
    this.setData({
      eta: etaOfBarge.substring(0, 4) + "-" + etaOfBarge.substring(4, 6) + "-" + etaOfBarge.substring(6, 8) + " " + etaOfBarge.substring(8, 10) + ":" + etaOfBarge.substring(10, 12)
    }),
    this.setData({
      showButton: wx.getStorageSync('showButton')
    })
  },

  bindEtaTap: function () {
    
  },
  
  bindConfirmTap: function () {
    var that = this;
    var date = new Date();
    var isTakeStep = 0;//默认不办手续
    var currentMonth = date.getMonth() + 1;
    var currentDay = date.getDate();
    var currentHours = date.getHours();
    var currentMinute = date.getMinutes();
    if (currentMonth < 10){
      currentMonth = "0" + currentMonth;
    }
    if (currentDay < 10){
      currentDay = "0" + currentDay;
    }
    if (currentHours < 10){
      currentHours = "0" + currentHours;
    }
    if (currentMinute < 10){
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
      success: function(res) {
        if(res.confirm){
          isTakeStep = 1;
          wx.request({
            url: app.data.servsers + 'saveAta',
            data: {
              ata: currentTime,
              phone: getApp().userInfo.userInfo.phone,
              isTakeStep: isTakeStep
            },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(currentTime);
              if (res.data == true) {
                wx.setStorageSync('showButton', 'cancel');
                that.setData({
                  showButton: wx.getStorageSync('showButton')
                })
              } else {
                that.setData({
                  showTopTips: true,
                  errormsg: "系统错误！"
                });
              }
              console.log("It will takeStep.");
            },
            fail: function (res) {
              console.log("失败");
            }
          })
        }else{
          isTakeStep = 0;
          wx.request({
            url: app.data.servsers + 'saveAta',
            data: {
              ata: currentTime,
              phone: getApp().userInfo.userInfo.phone,
              isTakeStep: isTakeStep
            },
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(currentTime);
              if (res.data == true) {
                wx.setStorageSync('showButton', 'cancel');
                that.setData({
                  showButton: wx.getStorageSync('showButton')
                })
              } else {
                that.setData({
                  showTopTips: true,
                  errormsg: "系统错误！"
                });
              }
              console.log("Not takeStep.");
            },
            fail: function (res) {
              console.log("失败");
            }
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    
  },

//需后续修改。。。
  bindCancelTap: function () {
    var that = this;
    wx.request({
      url: app.data.servsers + 'reSetAta',
      data: {
        ata: '',
        phone: '13561409736'//test data
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == true) {
          wx.setStorageSync('showButton', 'confirm');
          that.setData({
            showButton: wx.getStorageSync('showButton')
          })
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

  //以下为日期时间选择代码
  pickerTap: function () {
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
    that.setData({
      eta: eta
    }),

    //bindEtaTap 修改预计到港时间

      wx.request({
        url: app.data.servsers + 'saveEta',
        data: {
          eta: this.data.eta,
          phone: getApp().userInfo.userInfo.phone
        },
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data == true) {
            wx.showModal({
              content: '修改成功',
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

  }
  

})
