// pages/listEir/Eir.js
var base64 = require("../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    disabled: false,
    openid: wx.getStorageSync("userinfo").openid,
    items: [],
    order: [],

    prov: ["粤", "港", "桂", "琼", "赣", "闽", "浙", "苏", "皖", "沪", "豫", "翼", "湘", "鄂", "云", "贵", "鲁", "川", "渝", "青", "陕", "宁", "新", "甘", "晋", "蒙", "京", "津", "辽", "吉", "黑", "藏"],
    provValue: ["GD", "HK", "GX", "HQ", "JX", "FZ", "ZJ", "JS", "AH", "SH", "HN", "HB", "FN", "FB", "YN", "GZ", "SD", "SC", "CQ", "QH", "SX", "NX", "XJ", "GS", "SJ", "NM", "BJ", "TJ", "LN", "JL", "HJ", "XZ"],

    provCodeIndex: 0,

    colorCodes: ["黄", "蓝", "黑", "绿", "红", "白"],
    colorCodesValue: ["Y", "B", "D", "N", "R", "W"],

    tabs: ["操作专区", "客服专区"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  submit: function(e) {
  },

  handle: function(e) {

    var openid = wx.getStorageSync("userinfo").openid;
    var plate = wx.getStorageSync("userinfo").plate;
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: openid,
        plate: plate,
        formId: e.detail.formId
      },
      success: function(e) {},
      fail: function(e) {
        console.log(e)
      }
    })

    var name = e.currentTarget.dataset.name;

    console.log(e)

    if ("user" == name) {
      wx.navigateTo({
        url: '/pages/modifi_user/user',
      })
    }
    if ("eir" == name) {
      wx.navigateTo({
        url: '/pages/eirsearch/search',
      })
    }
    if ("cms" == name) {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    }
    if ("eirLess" == name) {
      wx.navigateTo({
        url: '/pages/history/historyorder',
      })
    }
    if ("customer" == name) {
      wx.makePhoneCall({
        phoneNumber: '075529022902',
      })
      // wx.navigateTo({
      //   url: '/pages/customer/customer',
      // })
    }
    if ("gr" == name) {
      console.log("抢单")
      wx.navigateTo({
        url: '/pages/imageUpload/upload',
      })
    }

    if ("sign" == name) {
      wx.showLoading({
        title: '正在为你处理，请稍后......',
      })

      console.log("签到")
      wx.request({
        url: getApp().data.servsers + 'sign',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: "POST",
        data: {
          plate: getApp().userInfo.userInfo.plate,
          openid: getApp().userInfo.userInfo.openid
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
              confirmText: "签到成功",             
              success: function (res) {
                if (res.confirm) {                

                } else {

                }

              }
            });
          }else{

            console.log(res.data.msg)
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
              confirmText: "签到失败",
              confirmColor: "#993300",    
              success: function (res) {
                if (res.confirm) {


                } else {

                }

              }
            });
          }
        },
        complete: function(e) {
          wx.hideLoading();
        }
      })


    }

    if ("sitemap" == name) {
     
      wx.navigateTo({
        url: '/pages/sitemap/sitemap',
      })
       
    }

    if("updateEta" == name){
      wx.request({
        url: getApp().data.servsers + 'getEta',
        data: {
          phone: getApp().userInfo.userInfo.phone
        },
        success: function (e) {
          console.log('bargelink返回的eta:' + e.data);
          wx.setStorageSync('eta', e.data);
          wx.navigateTo({
            url: '/pages/sitemap/sitemap',
          })
        }
      })
    }

    if("suggest" == name){
      wx.navigateTo({
        url: '/pages/suggest/suggest',
      })
    }

    if ("yardPlan" == name) {
      wx.navigateTo({
        url: '/pages/yardPlan/yardPlan',
      })
    }

    if ("guide" == name) {
      wx.navigateTo({
        url: '/pages/video/video',
      })
    }

    if ("introduce" == name) {
      wx.navigateTo({
        url: '/pages/introduce/introduce',
      })
    }

  },
  godetail: function(e) {
    var index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: '/pages/detail/detail?order=' + index,
    })
  },
  gocancel: function(e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/historydetail/detail?id=' + index,
    })
  },
  goAddEIR: function(e) {

    this.setData({
      disabled: true
    });
    var that = this;

    setTimeout(function() {
      that.setData({
        disabled: false
      });
    }, 1000);
    var openid = wx.getStorageSync("userinfo").openid;
    var plate = wx.getStorageSync("userinfo").plate;

    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: openid,
        plate: plate,
        formId: e.detail.formId
      },
      success: function(e) {},
      fail: function(e) {
        console.log("保存formid的时候未能连接服务器.")
        console.log(e)
      },
      complete: function(res) {
        console.log("结束连接")
        console.log(res)
      }
    })
    var items = this.data.items;

    //不参与计数的条数
    var count = 0;
    for (var i in items) {
      if (items[i].order.state == '3') {
        count = count + 1;
      }
    }
    if (items.length >= (4 + count)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '一个作业时间段内最多只能预约四个业务,请作业完成之后再预约',
        success: function() {
          that.setData({
            disabled: false
          });
        }
      })

      return;
    }
    //校验是否符合要求新建预约 

    wx.request({
      url: getApp().data.servsers + 'check',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      data: {
        openId: openid,
        plate: plate
      },
      success: function(res) {

        wx.setStorageSync("flush", false)

        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            disabled: false
          });
          
          var site=null;
          if (res.data.site != undefined){
            site = res.data.site;
          }
          wx.showModal({
            content: res.data.msg,
            showCancel: true,
            confirmText: "确认",
            cancelText: "修改车牌",
            success: function(res) {
              if (res.confirm) {

                var time = that.data.time;
                console.log("time:  " + time)

                wx.navigateTo({
                  url: '/pages/yuyue/yuyue?time=' + time+'&&site='+site,
                })

              } else {

                wx.navigateTo({
                  url: '/pages/modifi_user/user',
                })
              }

            }
          });

        } else {

          that.setData({
            disabled: false
          });
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            confirmText: "确定",

            success: function(res) {
              if (res.confirm) {}
            }
          });
        }

      },
      fail: function(res) {
        console.log("校验的时候未能连接服务器.")
        console.log(res)
        that.setData({
          disabled: false
        });
      }
    })

  },
  saveFormId: function(e) {
    var openid = wx.getStorageSync("userinfo").openid;
    var plate = wx.getStorageSync("userinfo").plate;
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: openid,
        plate: plate,
        formId: e.detail.formId
      },
      success: function(e) {


      },
      fail: function(e) {
        console.log(e)
      }
    })

    var index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: '/pages/detail/detail?order=' + index,
    })
  },


  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log("eir.js--onLoad--wx.getStorageSync('userinfo'):"+wx.getStorageSync('userinfo'));
    console.log("eir.js--onLoad--getApp().userInfo.userInfo:" + getApp().userInfo.userInfo);
    if (wx.getStorageSync('userinfo').userType == undefined || wx.getStorageSync("userinfo").userType == null
      || wx.getStorageSync('userinfo').userName == null || wx.getStorageSync('userinfo').userName == undefined){
      wx.clearStorageSync("userinfo");
      console.log("清除userinfo缓存");
    }
    var currentTime = getCurrentTime();

    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取微信昵称
          wx.getUserInfo({
            success(res) {
              console.log(res)
              wx.setStorageSync("nickName", res.userInfo.nickName)
            }
          })
        }
      }
    })
  
    
    if (wx.getStorageSync('userinfo')) {
      console.log("nickname:"+wx.getStorageSync("nickName"))
      //更新登录时间
      wx.request({
        url: getApp().data.servsers + "updateUser",
        data: {
          id: wx.getStorageSync("userinfo").id,
          lastLoginTime: currentTime,
          nickName: wx.getStorageSync("nickName")
        },
        success: function (res) {
          console.log("已更新登录时间：" + currentTime);
        }
      })



      console.log("userType:" + wx.getStorageSync("userinfo").userType)
      var plate = wx.getStorageSync("userinfo").plate;
      if (wx.getStorageSync("userinfo").userType == 'truck' || wx.getStorageSync("userinfo").userType == null) {
        console.log("显示拖车")
        that.setData({
          plate: plate,
          truck_lic: plate.substring(2, plate.length - 1),
          provCodeIndex: provIndex(plate.substring(0, 2), this.data.provValue),
          colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), this.data.colorCodesValue),
          
        })
      }
      //设置userType以显示首页
      that.setData({
        userType: wx.getStorageSync("userinfo").userType
      })

      console.log("userType:" + wx.getStorageSync("userinfo").userType);
    }else{

      // 登录
      wx.login({
        success: res => {
          //如果本地没有存储有用户信息
          console.log("login:进入页面");
          //wx.showLoading();
          console.log("res.code:" + res.code)

          wx.showLoading({
            title: '数据加载中',
          })
          var code = res.code;
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: getApp().data.servsers + 'userInfo/' + res.code,
            success: function (res) {
              console.log('请求成功，开始处理')
              console.log(res);

              if (res.data.id == null || res.data.id == '' || res.data.id == undefined) {
                console.log("未注册")
                wx.setStorageSync("infobase", res.data)
                var data = res.data;
                that.infobase = data;
                console.log(getApp().infobase)
                wx.hideLoading();
                wx.redirectTo({
                  // url: '/pages/VesselOrTruck/vesselOrTruck',
                  url: "/pages/InformaTion/user"
                })

              } else {

                //更新登录时间
                wx.request({
                  url: getApp().data.servsers + "updateUser",
                  data: {
                    id: wx.getStorageSync("userinfo").id,
                    lastLoginTime: currentTime
                  },
                  success: function (res) {
                    console.log("已更新登录时间：" + currentTime);
                  }
                })

                console.log('已注册')
                wx.setStorageSync('userinfo', res.data);
                wx.hideLoading();
                //that.userInfo.userInfo = res.data;
                //设置首页数据
                var plate = wx.getStorageSync("userinfo").plate;
                if (wx.getStorageSync("userinfo").userType == 'truck' || wx.getStorageSync("userinfo").userType == null) {
                  that.setData({
                    plate: plate,
                    truck_lic: plate.substring(2, plate.length - 1),
                    provCodeIndex: provIndex(plate.substring(0, 2), that.data.provValue),
                    colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), that.data.colorCodesValue),
                  })
                }
                //设置userType以显示首页
                that.setData({
                  userType: wx.getStorageSync("userinfo").userType
                })
                console.log("userType:" + wx.getStorageSync("userinfo").userType);
              }

            },
            fail: function (res) {

              console.log("fail:   " + getApp().data.servsers + 'userInfo/' + res.code)
              wx.showModal({
                content: '未能连接服务器',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: -1
                    })
                    console.log('未能连接服务器,用户点击确定')
                  }
                }
              });
            }


          });

          //如果未绑定，跳转用户绑定资料界面

          //如果已经绑定，跳转到飞单上传业务界面，并将用户信息储存到全局变量中

        },
        fail: function (res) {
          console.log("服务器暂不可用")
          wx.showModal({
            content: '网络似乎有点问题',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: -1
                })
                console.log('用户点击确定')
              }
            }
          });
        }
      })
    }






    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });


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
    console.log("eir.js--onShow--wx.getStorageSync('userinfo'):")
    console.log(wx.getStorageSync('userinfo'))
    //考虑到小程序非首次加载时只监听onShow函数，若小程序页面缓存失效，显示会异常，所以加入此行防止userType无值问题。
    if (wx.getStorageSync('userinfo')){
      this.setData({
        userType: wx.getStorageSync('userinfo').userType
      });
    
      console.log("onShow--userType:"+wx.getStorageSync('userinfo').userType);
      var that = this;

      wx.showLoading({
        title: '加载数据中...',
      })

      var openid = wx.getStorageSync("userinfo").openid;
      //var openid = this.data.openid;
      var plate = wx.getStorageSync("userinfo").plate;
      that.setData({
        plate: plate,
        truck_lic: plate.substring(2, plate.length - 1),
        provCodeIndex: provIndex(plate.substring(0, 2), this.data.provValue),
        colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), this.data.colorCodesValue)
      })
      wx.request({
        url: getApp().data.servsers + 'getOrder',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: "POST",
        data: {
          openId: openid
        },
        success: function (res) {
          that.setData({
            items: res.data.list,
            time: res.data.time,
            activityQuantity: res.data.activityQuantity,
            servsers: getApp().data.uploadurl,
          })
          getApp().order.order = res.data.list;

          for (var i in res.data.list) {
            if (res.data.list[i].order.eirImg == null) {
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '有预约未能成功上传照片，请修改重新上传!',
              })
            }
          }


        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            content: '未能连接服务器',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: -1
                })
                console.log('用户点击确定，onShow--getOrder()')
              }
            }
          });
        },
        complete: function () {
          wx.hideLoading();
        }
      });


      wx.request({
        url: getApp().data.servsers + 'listcancel',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: "POST",
        data: {
          openId: openid
        },
        success: function (res) {
          that.setData({
            ls: res.data.list,

          })
        }
      })
    }  


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
    console.log("下拉刷新");
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 9500);

    var that = this;



    var openid = wx.getStorageSync("userinfo").openid;
    //var openid = this.data.openid;
    wx.request({
      url: getApp().data.servsers + 'getOrder',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      data: {
        openId: openid
      },
      success: function(res) {

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新

        that.setData({
          items: res.data.list,
          time: res.data.time,
          activityQuantity: res.data.activityQuantity,
          servsers: getApp().data.uploadurl,
        })
        getApp().order.order = res.data.list;

        for (var i in res.data.list) {
          if (res.data.list[i].order.eirImg == null) {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '有预约未能成功上传照片，请修改重新上传!',
            })
          }
        }


      },
      fail: function() {

        wx.showModal({
          content: '未能连接服务器',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: -1
              })
              console.log('用户点击确定,onPullDownRefresh--getOrder')
            }
          }
        });
      },
      complete: function() {

      }
    });


    wx.request({
      url: getApp().data.servsers + 'listcancel',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      data: {
        openId: openid
      },
      success: function(res) {
        that.setData({
          ls: res.data.list,

        })
      }
    })

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

var getCurrentTime = function(){
  //获取当前时间
  var date = new Date();
  var currentMonth = date.getMonth() + 1;
  var currentDay = date.getDate();
  var currentHours = date.getHours();
  var currentMinute = date.getMinutes();
  var currentSeconds = date.getSeconds();
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
  if (currentSeconds < 10) {
    currentSeconds = "0" + currentSeconds;
  }
  var currentTime = date.getFullYear() + "-" + currentMonth + "-" + currentDay + " " + currentHours + ":" + currentMinute + ":" + currentSeconds;
  return currentTime;
}

var provIndex = function(prov, provValue, ) {
  for (var i in provValue) {
    if (provValue[i] == prov) {
      return i;
    }
  }

}
var colorIndex = function(color, colorCodesValue) {
  for (var i in colorCodesValue) {
    if (color == colorCodesValue[i]) {

      return i;
    }
  }
}