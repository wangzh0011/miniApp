// pages/yuyue/yuyue.js
function GetDatem(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var d = (Array(2).join("0") + dd.getDate()).slice(-2);
  var m = (Array(2).join("0") + (dd.getMonth() +1)).slice(-2);
  var date = y + '-' + m + '-' + d;
  return date;
};


function GetDate(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return d;
};
//删除元素
function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

function saveImage(path) {
  var data;
  wx.uploadFile({
    url: getApp().data.servsers + 'saveImage',
    filePath: path,
    name: 'image',
    formData: {
      openid: "openid",
    },
    success: function(res) {
      console.log(res.data)

      data = res;
      //return res;
    },
    fail: function(res) {

    }
  })
  return data;
}

var title = '压缩中，请稍候';
var app = getApp();

Page({


  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    checkday: '',
    checktime: '',
    site: 'null',
    item: [{
      workType: '',
      eir_img: [],
      seal_img: [],
      attach_img: [],
     
    }],

    items: [{
        workType: '',
        eir_img: [],
        seal_img: [],
        attach_img: [],
      },
    ],

    type_D: 0, //提作业的数量
    type_R: 0, //交作业的数量

    checked: false,
    tranTypeChecked: false,

    eirImg: '',
    sealImg: '',
    sealImg1: '',
    attachImg: '',
    attachImg1: '',

    files: '',

    showMask: false,
    showTimeList: false,
    RE_NUM: 0,
    RF_NUM: 0,
    DE_NUM: 0,
    DF_NUM: 0,
    timeQuantum: "请选择"

    // eirImgFail: true,
    // sealImgFail: true,
    // sealImg1Fail: true,
    // attachImgFail: true,
    // attachImg1Fail: true


  },

  /**
   * 选择作业地点
   * @param {*} e 
   */
  chooseSite: function(e) {
    
    var that = this;
    var site = e.detail.value
    this.setData({
      site: site,
      tranTypeChecked: false
    })

    wx.request({
      url: getApp().data.servsers + 'checkSite',
      data: {
        site: site
      },
      success: function (res) {
        //判断此作业地点是否可以预约
        if (res.data.code != 0) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  checked: false
                })
              }
            }
          })
        } else {
          var dateTime = that.data.dateTime;
          var timeQuantum = that.data.timeQuantum
          if (dateTime != undefined && dateTime != null && dateTime != '') {
            that.calSurplusRequest(site,timeQuantum,dateTime)
          }
        }
      }
    })

  },
  deleteBusines: function(e) {
    var items = this.data.items;
    var index = e.currentTarget.dataset.index;
    var item = items[index];

    removeByValue(items, item);

    //重新计算几交几提
    var type_D = 0;
    var type_R = 0;

    for (var i in items) {
      if (items[i].workType == 'DE' || items[i].workType == 'DF') {

        type_D = type_D + 1;
      }
      if (items[i].workType == 'RE' || items[i].workType == 'RF') {

        type_R = type_R + 1;
      }
    }
    this.setData({
      items: items,
      type_D: type_D,
      type_R: type_R,
    })

  },

  /**
   * 选择作业类型
   */
  type_Radios: function(e) {
    var that = this;
    var site = this.data.site;
    if (site == 'null') {
      wx.showModal({
        title: '提示',
        content: '请先选择作业地点内贸或者外贸!',
        showCancel: false,
      })
      this.setData({
        disabled: false,
        tranTypeChecked: false
      });
      return;
    }
    wx.request({
      url: getApp().data.servsers + 'checkTranType',
      data: {
        site: site,
        tranType: e.detail.value
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  tranTypeChecked: false
                })
              }
            }
          })
          return;
        }
      }
    })

    var index = e.currentTarget.dataset.index;
    var items = this.data.items;
    var value = e.detail.value;
    items[index].workType = value;
    //计算几交几提
    var type_D = 0;
    var type_R = 0;
    var DE = 0;
    var DF = 0;
    var RE = 0;
    var RF = 0;
    var DE_NUM = this.data.DE_NUM;
    var DF_NUM = this.data.DF_NUM;
    var RE_NUM = this.data.RE_NUM;
    var RF_NUM = this.data.RF_NUM;
    var checktime = this.data.checktime;
    console.log(items)
    for (var i in items) {
      if (items[i].workType == 'DE') {
        DE += 1;
        type_D = type_D + 1;
      } else if (items[i].workType == 'DF') {
        DF += 1;
        type_D = type_D + 1;
      } else if (items[i].workType == 'RE') {
        RE += 1;
        type_R = type_R + 1;
      } else if (items[i].workType == 'RF') {
        RF += 1;
        type_R = type_R + 1;
      }

    }

    //判断车牌号是否为vip
    wx.request({
      url: getApp().data.servsers + 'isVipPlate',
      data: {
        plate: wx.getStorageSync("userinfo").plate
      },
      success: function (res) {
        //不是vip车牌则判断是否还有余量
        if (res.data.code != 0) {
          //如果需预约数量大于余量则给出提示
          if (DE > DE_NUM) {
            this.showTips(checktime, "提空")
            return;
          }
          if (DF > DF_NUM) {
            this.showTips(checktime, "提重")
            return;
          }
          if (RE > RE_NUM) {
            this.showTips(checktime, "交空")
            return;
          }
          if (RF > RF_NUM) {
            this.showTips(checktime, "交重")
            return;
          }
        }
      }
    })

    

    var list = getApp().order.order;

    for (var i in list) {


      if ((list[i].order.tranType == 'DE' || list[i].order.tranType == 'DF') && list[i].order.state != '3') {

        type_D = type_D + 1;
      }
      if ((list[i].order.tranType == 'RE' || list[i].order.tranType == 'RF') && list[i].order.state != '3') {

        type_R = type_R + 1;
      }

    }


    this.setData({
      items: items,
      type_D: type_D,
      type_R: type_R,
    })

  },

  /**
   * 显示余量不足提示
   * @param {*} checktime 
   * @param {*} tranType 
   */
  showTips: function (checktime,tranType) {
    wx.showModal({
      title: '系统提示',
      content: checktime + '时间内的' + tranType + '已被预约完，请选择其他时段',
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#3CC51F',
    });
  },

  /**
   * 提交之后先订阅消息
   */
  addOrder: function () {

    var that = this;
    wx.requestSubscribeMessage({//app.tmplIds.serverStopId, app.tmplIds.eeirId,
      tmplIds: [app.tmplIds.appointmentId, app.tmplIds.eeirId, app.tmplIds.cmsId],
      success(res) {
        var reg = RegExp(/accept/)
        var reg1 = RegExp(/reject/)
        if (JSON.stringify(res).match(reg1)) {

          wx.showModal({
            title: '温馨提示',
            content: '未订阅相关消息，请订阅此消息或到小程序设置里面开启订阅消息',
          })
          return;

        }
        if (JSON.stringify(res).match(reg)) {

          //订阅消息后 进入预约流程
          that.addOrdertmp();

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

  //提交
  addOrdertmp: function(e) {
    //判断是否选择了日期
    // console.log(this.data.checkday)
    var time = this.data.time;
    var items = this.data.items;
    var site = this.data.site;
    var that = this;
    that.setData({
      disabled: true
    });
    if (time == 'null') {

      if (this.data.checkday == '' || this.data.checktime == '') {
        wx.showModal({
          title: '提示',
          content: '请先选择时间!',
          showCancel: false,

        })
        that.setData({
          disabled: false
        });

        return;
      }
    }
    if (site == 'null') {


      wx.showModal({
        title: '提示',
        content: '请先选择作业地点内贸或者外贸!',
        showCancel: false,

      })
      that.setData({
        disabled: false
      });

      return;

    }

    if (items.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请添加作业信息',
        showCancel: false,

      })
      that.setData({
        disabled: false
      });

      return;
    }

    
    for (var i in items) {
      var count = 0; //计算总共有几张照片
      var item = items[i];

      if (item.eir_img.length != 0) {
        count = count + 1;
      }
      if (item.seal_img.length != 0) {
        count = count + item.seal_img.length;
      }
      if (item.attach_img.length != 0) {
        count = count + item.attach_img.length;
      }
      console.log("count" + count)
      item.count = count;
      if (item.workType == '') {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请选择作业类型!',

        })
        that.setData({
          disabled: false
        });
        return;
      }

      if (item.eir_img[0] != null && item.eir_img[0] != undefined && item.eir_img[0] != "") {

      } else {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请添加单证照片!',

        })
        that.setData({
          disabled: false
        });
        return;
      }

      if (item.seal_img.length == 0 && item.workType == 'RF') {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '交重请添加封条照片!',

        })
        that.setData({
          disabled: false
        });
        return;
      }

    }


    //判断是否选择了作业类型，和照片等


    var appointmentTime;
    var expireTime;
    console.log("time：" + time)
    if (time == 'null') {
      console.log("比较时间执行了!")
      appointmentTime = this.data.checkday + ' ' + this.data.checktime;
      expireTime = this.data.checkday + ' ' + this.data.expireTime;

      console.log(appointmentTime)
      console.log(expireTime)

      console.log("比较结果")

      console.log(new Date() > new Date(Date.parse(expireTime.replace(/\-/g, '/'))));
      if (new Date() > new Date(Date.parse(expireTime.replace(/\-/g, '/')))) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请选择正确的预约时间.',

        })
        that.setData({
          disabled: false
        });
        return;
      }

    } else {
      //console.log("time.split:"+time.split("-")[3])
      appointmentTime = time;
      expireTime = time.split(" ")[0] + " " + time.split(" ")[1].split("-")[1];

    }

    wx.setStorageSync("flush", true) //首页刷新


    


    var openId = wx.getStorageSync("userinfo").openid;
    var phone = wx.getStorageSync("userinfo").phone;
    var plate = wx.getStorageSync("userinfo").plate;
    var userName = wx.getStorageSync("userinfo").userName;
    var site = that.data.site;

//提交预约数据
    for (var i in items) {
      var item = items[i];
      var num = i-1+2;
      console.log("sealImg------" + item.sealImg + "    " + item.sealImg1)
      if(that.data.eirImgFail == true){
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的单证照片未上传成功，请选择照片重新上传",
          success: function (res) {
            that.setData({
              disabled: false
            });
          }
        })
        return;
      }
      if (that.data.sealImgFail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的封条照片未上传成功，请选择照片重新上传",
          success: function (res) {
            that.setData({
              disabled: false
            });
          }
        })
        return;
      }
      if (that.data.sealImg1Fail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的封条照片未上传成功，请选择照片重新上传",
          success: function (res) {
            that.setData({
              disabled: false
            });
          }
        })
        return;
      }
      if (that.data.attachImgFail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的附属证明照片未上传成功，请选择照片重新上传",
          success: function (res) {
            that.setData({
              disabled: false
            });
          }
        })
        return;
      }
      if (that.data.attachImg1Fail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的附属证明照片未上传成功，请选择照片重新上传",
          success: function (res) {
            that.setData({
              disabled: false
            });
          }
        })
        return;
      }
      wx.request({
        url: getApp().data.servsers + 'addOrder',
        data: {
          openId: openId,
          phone: phone,
          plate: plate,
          userName: userName,
          operator: userName,
          appointmentTime: appointmentTime,
          tranType: items[i].workType,
          expireTime: expireTime,
          site: site,
          tranCount: that.data.type_R + ' 交' + that.data.type_D + ' 提',
          eirImg: item.eirImg,
          sealImg: item.sealImg == undefined ? '' : item.sealImg,
          sealImg1: item.sealImg1 == undefined ? '' : item.sealImg1,
          attachImg: item.attachImg == undefined ? '' : item.attachImg,
          attachImg1: item.attachImg1 == undefined ? '' : item.attachImg1,
          index: i, //标识数组下标
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if(res.data.code == 500){
            wx.showModal({
              title: '系统通知',
              content: res.data.msg,
              showCancel: false,
              success: (result) => {
                if(result.confirm){
                  
                }
              },
              fail: ()=>{},
              complete: ()=>{}
            });
          }else {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '码头将于15分钟内通过微信推送预约结果，请在审核通过后再进闸作业.',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    url: '../listEir/Eir',
                  })
                }
              }
            })
          }
        },
        fail: function () {
          console.log("addOrder fail.")
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '网络环境不佳，请确认网络连接正常并重新预约！',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  disabled: false
                });
              }
            }
          })
        },
        complete: function () {
          wx.hideLoading();
          that.setData({
            disabled: false
          });
        }
      })

    }





  },


  /**
   * 添加业务
   */
  addBusines: function(e) {
    var that = this;
    
    /**
    * 拉起订阅消息  获取下发权限
    */
    wx.requestSubscribeMessage({
      tmplIds: [app.tmplIds.appointmentId, app.tmplIds.signInId, app.tmplIds.cmsId],
      success(res) {
        //若订阅此消息，则下一步
        var reg = RegExp(/accept/);
        var reg1 = RegExp(/reject/)
        if (JSON.stringify(res).match(reg1)) {

          wx.showModal({
            title: '温馨提示',
            content: '未订阅相关消息，请订阅此消息或到小程序设置里面开启订阅消息',
          })
          return;

        }
        if (JSON.stringify(res).match(reg)) {
          //var item = { 'workType': '', 'eir_img': '', 'seal_img': '', 'attacht_img': '' };
          var item = that.data.item;
          var items = that.data.items;
          var remain = that.data.remain - 1;

          //判断是否小于或者等于4

          //不参与计数的条数
          // var count = 0;
          // for (var i in items) {
          //   if (items[i].state == '3') {
          //     count = count + 1;
          //   }
          // }


          if (items.length > remain) {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '一次预约最多只能两交两提！',
            })
            return;
          }

          items.push(item[0]);
          that.setData({
            items: items,
          })

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
   * 选择到港时间
   */
  chooseTime: function () {

    var that = this;
    //获取作业地点
    var site = that.data.site;
    if (site == "null") {
      wx.showModal({
        title: '提示',
        content: '请先选择作业地点内贸或者外贸!',
        showCancel: false,
      })
      that.setData({
        showMask: false,
        showTimeList: false
      })
      return;
    }

    console.log("开始选择到港时间")
    // wx.request({
    //   url: getApp().data.servsers + "chooseTime",
    //   success(res) {
        
    //     that.setData({
    //       showMask: true,
    //       showTimeList: true,
    //       timeList: res.data.timeList,
    //       lineIndex: res.data.lineIndex
    //     })

    //   }
    // })

    //获取时间段对象
    wx.request({
      url: getApp().data.servsers + 'getTimeQuantum',
      data: {
        site: site
      },
      success: (result) => {
        var timeQuantumList = result.data.list
        that.setData({
          showMask: true,
          showTimeList: true,
          timeQuantumList: timeQuantumList
        })

      },
      fail: () => { },
      complete: () => { }
    });

  },

  dayradios: function(e) {
    console.log(e)
    this.setData({
      checkday: e.detail.value,
    })

  },
  timeradios: function(e) {
    console.log(e)
    var expire = e.detail.value;
    var expireTime = expire.split("-")[1];
    this.setData({
      checktime: e.detail.value,
      expireTime: expireTime,
    })
    console.log(this.data.checkday + " " + this.data.checktime)
  },

  /**
   * 选择预约时间
   * @param {*} e 
   */
  chooseAppointmentTime: function (e) {
    console.log(e)
    //选中项的值  时间
    var value = e.detail.value.split(" ");
    //选中的时间和日期
    var dateTime = value[0]
    var timeQuantum = value[1]
    //设置选中日期和时间数据
    this.setData({
      showMask: false,
      showTimeList: false,
      dateTime: dateTime,
      timeQuantum: timeQuantum,
      checkday: dateTime,
      checktime: timeQuantum,
      expireTime: timeQuantum.split('-')[1],
      RE_NUM: value[2],
      RF_NUM: value[3],
      DE_NUM: value[4],
      DF_NUM: value[5],
    })
  },

  /**
   * 计算作业余量
   * @param {} e 
   */
  calSurplus: function(e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    var lineIndex = that.data.lineIndex;
    console.log(lineIndex)

    //获取作业地点
    var site = that.data.site;
    if(site == "null") {
      wx.showModal({
        title: '提示',
        content: '请先选择作业地点内贸或者外贸!',
        showCancel: false,
      })
      that.setData({
        showMask: false,
        showTimeList: false
      })
      return;
    }

    //选中分割线不做处理
    if(index == lineIndex) {
      return;
    }else if(index > lineIndex) {
      //选择的是第二天的时间段
      that.setData({
        checkday: that.data.tomorrow,
        checktime: that.data.timeList[index],
        expireTime: that.data.timeList[index].split('-')[1],
      })
    }else {
      //当天时间段
      that.setData({
        checkday: that.data.today,
        checktime: that.data.timeList[index],
        expireTime: that.data.timeList[index].split('-')[1],
      })
    }
    
    //根据作业地点和时间段返回作业余量
    var timeQuantum = that.data.timeList[index]
    var dateTime = index > lineIndex ? that.data.tomorrow : that.data.today
    this.calSurplusRequest(site,timeQuantum,dateTime)

  },

  /**
   * 计算作业余量的请求方法
   * @param {作业地点} site 
   * @param {时间段} timeQuantum 
   * @param {日期} dateTime 
   */
  calSurplusRequest: function(site,timeQuantum,dateTime) {
    var that = this;
    wx.request({
      url: getApp().data.servsers + "calSurplus",
      data: {
        site: site,
        timeQuantum: timeQuantum,
        dateTime: dateTime
      },
      success(res) {
        that.setData({
          showMask: false,
          showTimeList: false,
          RE_NUM: res.data.list.RE_NUM,
          RF_NUM: res.data.list.RF_NUM,
          DE_NUM: res.data.list.DE_NUM,
          DF_NUM: res.data.list.DF_NUM,
          timeQuantum: timeQuantum,
          dateTime: dateTime//用来判断是否选择了时间段，
        })
      }
    })
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  chooseEirImage: function(e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    // that.setData({
    //   eirImgFail: true
    // })
    var items = that.data.items;
    console.log(index)
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed','original'], // 可以指定是原图还是压缩图，默认二者都有 compressed 是压缩图  original 是原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: title,
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: res.tempFilePaths,
        });
        var filename = res.tempFilePaths;
        var file = res.tempFiles;
        wx.uploadFile({
          url: getApp().data.servsers + 'saveImage',
          filePath: filename[0],
          name: 'image',
          success: function (res1) {
            console.log(res1)
            var jsondata = JSON.parse(res1.data);
            var eirImg = jsondata.data.filename;
            if (eirImg == undefined){
              wx.hideLoading();
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '此照片未成功上传，请重新选择照片上传！',
                success: function (res) {
                  items[index].eir_img = '',
                    that.setData({
                      items: items,
                      eirImgFail: true
                    });
                }
              })
            }else{
              wx.hideLoading()
              console.log("上传成功并保存到了服务器")
              items[index].eirImg = eirImg;
              items[index].eir_img = filename,
              that.setData({
                items: items,
                eirImgFail: false
              })
            }
          },
          fail: function (res1) {
            console.log("上传文件连接服务器失败:")
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
              success: function (res) {
                items[index].eir_img = '',
                that.setData({
                  items: items,
                  eirImgFail: true
                });
              }
            })
          },
          complete: function (res) {
            console.log("结束上传")
            console.log(res)
          }

        })
      }
    })
  },
  chooseSealImage: function(e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    // that.setData({
    //   sealImgFail: true,
    //   sealImg1Fail: true
    // })
    var items = this.data.items;
    wx.chooseImage({
      count: 2,
      sizeType: ['compressed','original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: title,
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: res.tempFilePaths,
          });

        var filename = res.tempFilePaths;
        console.log("filename0----"+filename[0])
        console.log("filename1----" + filename[1])
        if(filename[0] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[0],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var sealImg = jsondata.data.filename;
              if(sealImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].seal_img = '',
                      that.setData({
                        items: items,
                        sealImgFail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].sealImg = sealImg;
                items[index].seal_img[0] = filename[0],
                that.setData({
                  items: items,
                  sealImgFail: false
                })
              }
              //console.log("upload:sealImg------" + items[0].sealImg + "    " + items[0].sealImg1)
            },
            fail: function (res1) {
              console.log("上传文件连接服务器失败:")
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].seal_img = '',
                    that.setData({
                      items: items,
                      sealImgFail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     sealImgFail: false
        //   })
        // }

        if(filename[1] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[1],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var sealImg = jsondata.data.filename;
              if(sealImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].seal_img = '',
                      that.setData({
                        items: items,
                        sealImg1Fail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].sealImg1 = sealImg;
                items[index].seal_img[1] = filename[1],
                that.setData({
                  items: items,
                  sealImg1Fail: false
                })
              }
              //console.log("upload:sealImg------" + items[0].sealImg + "    " + items[0].sealImg1)
            },
            fail: function (res1) {
              console.log("上传文件连接服务器失败:")
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].seal_img = '',
                    that.setData({
                      items: items,
                      sealImg1Fail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     sealImg1Fail: false
        //   })
        // }

      }
    })
  },
  chooseAttachlImage: function(e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    // that.setData({
    //   attachImgFail: true,
    //   attachImg1Fail: true
    // })
    var items = this.data.items;
    wx.chooseImage({
      count: 2,
      sizeType: ['compressed', 'original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: title,
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: res.tempFilePaths,
          });

        var filename = res.tempFilePaths;

        if(filename[0] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[0],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var attachImg = jsondata.data.filename;
              if(attachImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].attach_img = '',
                      that.setData({
                        items: items,
                        attachImgFail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].attachImg = attachImg;
                items[index].attach_img[0] = filename[0];
                that.setData({
                  items: items,
                  attachImgFail: false
                })
              }
            },
            fail: function (res1) {
              wx.hideLoading()
              console.log("上传文件连接服务器失败:")
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].attach_img = '',
                    that.setData({
                      items: items,
                      attachImgFail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     attachImgFail: false
        //   })
        // }

        if(filename[1] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[1],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var attachImg = jsondata.data.filename;
              if(attachImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].attach_img = '',
                      that.setData({
                        items: items,
                        attachImg1Fail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].attachImg1 = attachImg;
                items[index].attach_img[1] = filename[1];
                that.setData({
                  items: items,
                  attachImg1Fail: false
                })
              }
            },
            fail: function (res1) {
              wx.hideLoading()
              console.log("上传文件连接服务器失败:")
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].attach_img = '',
                    that.setData({
                      items: items,
                      attachImg1Fail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     attachImg1Fail: false
        //   })
        // }

      }
    })
  },
  clicks: function(e) {
    let index = e.currentTarget.dataset.index;
    let arrs = this.data.checks;
    if (arrs[index].checked == false) {
      arrs[index].checked = true;
    } else {
      arrs[index].checked = false;
    }
    this.setData({
      checks: arrs
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var time = options.time;
    var site = options.site;
    console.log("预约界面的time:" + time)
    console.log("预约界面的site:" + site)
    if (time != "null") {
      this.setData({
        time: time
      })

    } else {
      this.setData({
        time: 'null'
      })
    }
    if (site != "null") {
      this.setData({
        site: site
      })
    } else {
      this.setData({
        site: 'null'
      })
    }

    if (site != "null" && time != "null") {
      //计算作业余量
      this.calSurplusRequest(site,time.split(" ")[1],time.split(" ")[0])
    }

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
    var today = GetDatem(0);
    var tomorrow = GetDatem(1);


    console.log("today:" + today)
    console.log("tomorrow:" + tomorrow)
    //还可以预约几个
    var orders = getApp().order.order;
    // console.log("orders: "+orders.length)
    // console.log(4-orders.length)
    //var remain = 4 - orders.length;
    //不参与计数的条数
    var count = 0;
    for (var i in orders) {
      if (orders[i].order.state != '3') {
        count = count + 1;
      }
    }
    this.setData({
      today: today,
      tomorrow: tomorrow,
      remain: 4 - count,
    })

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