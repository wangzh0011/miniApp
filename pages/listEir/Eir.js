// pages/listEir/Eir.js
var base64 = require("../images/base64");
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp();
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
    sliderLeft: 0,
    modalHidden: true,
    hover_stay_time: 200, //按钮手指松开后点击保留时间
    showTips: false,
    showMessage: true,
    showMask: true,
    timeout: false//预约超时标识
  },

  /**
   * 关闭广告
   */
  modalConfirm: function () {
    this.setData({
      modalHidden: true
    })
  },

  submit: function (e) {
  },

  handle: function (e) {

    var openid = wx.getStorageSync("userinfo").openid;
    var plate = wx.getStorageSync("userinfo").plate;

    var name = e.currentTarget.dataset.name;
    wx.showLoading({
      title: '加载中',
    })
    //判断点击的功能是否关闭
    wx.request({
      url: getApp().data.servsers + 'wxSwitch',
      data: {
        functionCode: name
      },
      success: function (res) {
        wx.hideLoading();
        //关闭则显示通知
        if (res.data.wxFunction.wxSwitch == '0') {
          wx.showModal({
            title: '系统通知',
            content: res.data.wxFunction.notice,
            showCancel: false
          })
        } else {
          //未关闭则跳转相应页面
          if ("user" == name) {
            wx.navigateTo({
              url: '/pages/modifi_user/user',
            })
          } else if ("eir" == name) {
            wx.navigateTo({
              url: '/pages/eirsearch/search',
            })
          } else if ("cms" == name) {
            wx.navigateTo({
              url: '/pages/search/search',
            })
          } else if ("eirLess" == name) {
            wx.navigateTo({
              url: '/pages/history/historyorder',
            })
          } else if ("customer" == name) {
            // wx.makePhoneCall({
            //   phoneNumber: '075529022902',
            // })
            wx.showModal({
              title: '电话列表',
              content: '外贸飞单：0755-2902 2906\r\n内贸飞单：0755-2902 2055\r\n驳船报到：0755-2902 2956\r\n热线电话：0755-2902 2902\r\n外贸财务：0755-2902 2231\r\n内贸财务：0755-2902 2056',
              showCancel: false
            })
          } else if ("gr" == name) {
            console.log("抢单")
            wx.navigateTo({
              url: '/pages/imageUpload/upload',
            })
          } else if ("sign" == name) {
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
                } else {

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
              complete: function (e) {
                wx.hideLoading();
              }
            })


          } else if ("updateAta" == name) {
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
                      console.log('bargelink返回的data:' + e.data);
                      wx.setStorageSync('ltrschedule', e.data);
                      wx.navigateTo({
                        url: '/pages/updateAta/updateAta',
                      })
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

          } else if ("updateEta" == name) {

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
                      console.log('bargelink返回的data:' + e.data);
                      wx.setStorageSync('ltrschedule', e.data);
                      wx.navigateTo({
                        url: '/pages/updateEta/updateEta',
                      })
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

          } else if ("suggest" == name) {
            // wx.showModal({
            //   title: '功能维护中',
            //   content: '敬请期待！',
            //   showCancel: false
            // })
            wx.navigateTo({
              url: '/pages/suggest/suggest',
            })
          } else if ("yardPlan" == name) {
            wx.navigateTo({
              url: '/pages/yardPlan/yardPlan',
            })
          } else if ("video" == name) {
            wx.navigateTo({
              url: '/pages/video/video',
            })
          } else if ("video_customer" == name) {
            wx.navigateTo({
              url: '/pages/video/video?type=customer',
            })
          } else if ("picture" == name) {
            wx.navigateTo({
              url: '/pages/introduce/introduce',
            })
          } else if ("notice" == name) {
            wx.showLoading({
              title: '加载中',
            })
            wx.setStorageSync("hasView", "Y")

            wx.request({
              url: getApp().data.servsers + 'getAllNotice',
              success: function (e) {
                wx.hideLoading();
                wx.setStorageSync("operNotice", e.data);
                wx.navigateTo({
                  url: '/pages/operNotice/notice',
                })
              },
              fail: function (e) {
                wx.showModal({
                  title: '系统异常',
                  content: '请退出小程序重试！',
                })
              }
            })
          } else if ("mobileQuery" == name) {
            wx.navigateTo({
              url: '/pages/mobileQuery/query',
            })
          } else if ("cosido" == name) {
            wx.navigateTo({
              url: '/pages/cosido/cosido',
            })
          }

        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res)
      }
    })

    

  },
  godetail: function (e) {
    var index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: '/pages/detail/detail?order=' + index,
    })
  },
  gocancel: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/historydetail/detail?id=' + index,
    })
  },

  /**
   * 预约流程
   */
  goAddEIR: function (e) {

    this.setData({
      disabled: true
    });
    var that = this;

    setTimeout(function () {
      that.setData({
        disabled: false
      });
    }, 1000);
    var openid = wx.getStorageSync("userinfo").openid;
    var plate = wx.getStorageSync("userinfo").plate;
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
        success: function () {
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
      success: function (res) {

        wx.setStorageSync("flush", false)

        console.log(res)
        if (res.data.code == 0) {
          that.setData({
            disabled: false
          });

          var site = null;
          if (res.data.site != undefined) {
            site = res.data.site;
          }
          wx.showModal({
            content: res.data.msg,
            showCancel: true,
            confirmText: "确认",
            cancelText: "修改车牌",
            success: function (res) {
              if (res.confirm) {

                var time = that.data.time;
                console.log("time:  " + time)

                wx.navigateTo({
                  url: '/pages/yuyue/yuyue?time=' + time + '&&site=' + site,
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

            success: function (res) {
              if (res.confirm) { }
            }
          });
        }

      },
      fail: function (res) {
        console.log("校验的时候未能连接服务器.")
        console.log(res)
        that.setData({
          disabled: false
        });
      }
    })

  },

  /**
   * 拉起订阅消息  获取下发权限 拖车预约
   */
  subscribeMessageTap: function () {
    var that = this;
    var timeout = that.data.timeout
    //预约超时，给出提示
    if(timeout){
      wx.showModal({
        title: '温馨提示',
        content: '存在超时的预约单，请处理后再进行预约操作',
      })
      return; 
    } 
    wx.requestSubscribeMessage({//app.tmplIds.serverStopId, app.tmplIds.eeirId,
      tmplIds: [app.tmplIds.appointmentId, app.tmplIds.signInId, app.tmplIds.cmsId],
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
        if(JSON.stringify(res).match(reg)) {

          //订阅消息后 进入预约流程
          that.goAddEIR();
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
   * 拉起订阅消息  获取下发权限  驳船预约
   */
  subscribeMessageVesselTap: function () {
    var that = this;
    wx.requestSubscribeMessage({//app.tmplIds.serverStopId, app.tmplIds.eeirId,
      tmplIds: [app.tmplIds.berthingId],
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

          //温馨提示
          that.setData({
            showTips: true,
            showMessage: false
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
   * 关闭温馨提示框
   */
  closeTips: function() {
    this.setData({
      showTips: false,
      showMask: false
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
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    console.log("eir.js--onLoad--wx.getStorageSync('userinfo'):" + wx.getStorageSync('userinfo'));
    console.log("eir.js--onLoad--getApp().userInfo.userInfo:" + getApp().userInfo.userInfo);
    if (wx.getStorageSync('userinfo').userType == undefined || wx.getStorageSync("userinfo").userType == null
      || wx.getStorageSync('userinfo').userName == null || wx.getStorageSync('userinfo').userName == undefined
      || wx.getStorageSync('userinfo').openid == null || wx.getStorageSync('userinfo').openid == undefined
      || wx.getStorageSync('userinfo').openid == 'undefined' || wx.getStorageSync('userinfo').id == null
      || wx.getStorageSync('userinfo').id == undefined || wx.getStorageSync('userinfo').id == 'undefined') {
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
              var nickName = res.userInfo.nickName;
              wx.setStorageSync("nickName", nickName);
            }
          })

        }
      }
    })


    console.log("调用登录接口")
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
                url: '/pages/VesselOrTruck/vesselOrTruck',
                // url: "/pages/InformaTion/user"
              })

            } else {
              console.log('已注册')
              wx.setStorageSync('userinfo', res.data);
              wx.hideLoading();

              //更新登录时间
              wx.request({
                url: getApp().data.servsers + "updateUser",
                data: {
                  id: res.data.id,
                  lastLoginTime: currentTime,
                  nickName: wx.getStorageSync("nickName")
                },
                success: function (res) {
                  console.log("已更新登录时间：" + currentTime);
                }
              })

              //that.userInfo.userInfo = res.data;
              //设置首页数据
              if (wx.getStorageSync("userinfo").userType == 'truck' || wx.getStorageSync("userinfo").userType == null) {
                var plate = wx.getStorageSync("userinfo").plate;
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
    // }


    //计算tab下面横条的中间位置
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    //判断首页的功能是否显示
    this.showFunction()

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
    var that = this;
    console.log("eir.js--onShow--wx.getStorageSync('userinfo'):")
    console.log(wx.getStorageSync('userinfo'))
    //考虑到小程序非首次加载时只监听onShow函数，若小程序页面缓存失效，显示会异常，所以加入此行防止userType无值问题。
    if (wx.getStorageSync('userinfo')) {
      var userType = wx.getStorageSync('userinfo').userType;
      this.setData({
        userType: userType
      });

      console.log("onShow--userType:" + wx.getStorageSync('userinfo').userType);

      // wx.showLoading({
      //   title: '加载数据中...',
      // })

      var openid = wx.getStorageSync("userinfo").openid;
      if (userType == 'truck') {
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

            //根据预约时间显示不同描述
            if(that.data.time != null && that.data.time != undefined) {
              that.showDescByTime(res.data.time);
            } else {
              that.setData({
                timeout: false
              })
            }  
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
            // wx.hideLoading();
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
    }


    //获取操作通知数据
    wx.request({
      url: getApp().data.servsers + 'getNoticeNum',
      success: function (e) {
        var num = e.data;
        if (wx.getStorageSync("noticeNum")) {
          //获取缓存中操作通知数量
          var oldNoticeNum = wx.getStorageSync("noticeNum");
          //更新缓存
          wx.setStorageSync("noticeNum", num);
          //判断用户是否已查看
          if (wx.getStorageSync("hasView") == 'Y') {

            if (num < oldNoticeNum) {
              that.setData({
                noticeNum: 1
              })
            } else {
              //最新的通知数量
              var notice = num - oldNoticeNum;
              that.setData({
                noticeNum: notice
              })
            }
          } else {
            that.setData({
              noticeNum: num
            })
          }
        } else {
          wx.setStorageSync("noticeNum", num);
          that.setData({
            noticeNum: num
          })
        }

      }
    })

    

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
    console.log("下拉刷新");
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function () {
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
      success: function (res) {

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
      fail: function () {

        wx.showModal({
          content: '未能连接服务器',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: -1
              })
              console.log('用户点击确定,onPullDownRefresh--getOrder')
            }
          }
        });
      },
      complete: function () {

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

    this.showFunction();

    if(this.data.time != null && this.data.time != undefined) {
      this.showDescByTime(this.data.time);
    } else {
      this.setData({
        timeout: false
      })
    }  


  },

  /**
   * 根据进闸时间判断显示哪种信息
   * 【待审核】及【审核通过】状态下
      正常时间：如不能及时到达，请点击修改到港时间 【绿色字体】
      半小时内：即将到达预约时间，如不能到港，请点击修改。【红色字体】
      超时：已超时，请点击修改到港时间或取消预约。【深红色字体】
   * @param {*} time 
   */
  showDescByTime: function(time) {
    //传入的时间格式2020-04-09 18:00-20:00  IOS机器上不支持这种格式换算时间戳 所以改成/
    var time = time.replace(/-/g,"/")
    //将时间段分离
    var times = time.split(" ")
    //开始时间
    var appointmentBegin = times[0] + " " + times[1].split("/")[0]
    //结束时间
    var appointmentEnd = ""
    if(times[1].split("/")[1] == "24:00") {
      appointmentEnd = times[0] + " " + "23:59"//真机上24：00计算不出时间戳
    } else {
      appointmentEnd = times[0] + " " + times[1].split("/")[1]
    }
    var that = this;
    //当前时间转成时间戳
    var nowTimeStamp = new Date().getTime();
    //传入的时间字符串转成时间戳
    var appointmentBeginTimeStamp = new Date(appointmentBegin).getTime()
    var appointmentEndTimeStamp = new Date(appointmentEnd).getTime()
    //计算当前时间和预约时间的差值
    var beginValue = appointmentBeginTimeStamp - nowTimeStamp
    var endValue = appointmentEndTimeStamp - nowTimeStamp
    console.log("appointmentEnd ==> " + appointmentEnd)
    console.log("appointmentEndTimeStamp ==> " + appointmentEndTimeStamp)
    console.log("nowTimeStamp ==> " + nowTimeStamp)
    console.log("endValue ==> " + endValue)
    if(endValue < 0) {//超时
      that.setData({
        desc: "已超时，请点击修改到港时间或取消预约>>",
        color: "#C00000",
        timeout: true
      })
    } else if(beginValue < 1800 && beginValue > 0) {//半小时内
      that.setData({
        desc: "即将到达预约时间，如不能到港，请点击修改>>",
        color: "#FF0000",
        timeout: false
      })
    } else {//正常时间
      that.setData({
        desc: "如不能及时到达，请点击修改到港时间>>",
        color: "#00B050",
        timeout: false
      })
    }
  },

  /**
   * 修改预约时间
   */
  updateAppointmentTime: function() {
    var that = this;
    //获取预约订单
    var items = that.data.items
    //提取订单中的作业类型
    var tranType = [];
    for (var i = 0; i < items.length; i++) {
      tranType[i] = items[i].tranType
    }
    //获取预约时间
    var time = that.data.time
    wx.navigateTo({
      url: '/pages/updateAppointmentTime/update?site=' + items[0].order.site + '&time=' + time + '&tranType=' + tranType,
    });

  },

  /**
   * 判断首页的功能是否显示
   */
  showFunction: function() {
    var that = this;
    wx.request({
      url: getApp().data.servsers + 'getFunctionList',
      success: function (res) {
        wx.hideLoading();
        var list = res.data;
        for (var i in list) {
          if (list[i].functionCode == 'user') {
            that.setData({
              showUser: list[i].isShow
            })
          } else if (list[i].functionCode == 'eir') {
            that.setData({
              showEir: list[i].isShow
            })
          } else if (list[i].functionCode == 'cms') {
            that.setData({
              showCms: list[i].isShow
            })
          } else if (list[i].functionCode == 'eirLess') {
            that.setData({
              showEirLess: list[i].isShow
            })
          } else if (list[i].functionCode == 'gr') {
            that.setData({
              showGr: list[i].isShow
            })
          } else if (list[i].functionCode == 'video') {
            that.setData({
              showVideo: list[i].isShow
            })
          } else if (list[i].functionCode == 'video_customer') {
            that.setData({
              showVideo_customer: list[i].isShow
            })
          } else if (list[i].functionCode == 'picture') {
            that.setData({
              showPicture: list[i].isShow
            })
          } else if (list[i].functionCode == 'updateEta') {
            that.setData({
              showUpdateEta: list[i].isShow
            })
          } else if (list[i].functionCode == 'updateAta') {
            that.setData({
              showUpdateAta: list[i].isShow
            })
          } else if (list[i].functionCode == 'yardPlan') {
            that.setData({
              showYardPlan: list[i].isShow
            })
          } else if (list[i].functionCode == 'notice') {
            that.setData({
              showNotice: list[i].isShow
            })
          } else if (list[i].functionCode == 'suggest') {
            that.setData({
              showSuggest: list[i].isShow
            })
          } else if (list[i].functionCode == 'customer') {
            that.setData({
              showCustomer: list[i].isShow
            })
          } else if (list[i].functionCode == 'mobileQuery') {
            that.setData({
              showMobileQuery: list[i].isShow
            })
          } else if (list[i].functionCode == 'add') {//首页广告显示
            if (list[i].isShow == '1') {
              that.setData({
                modalHidden: false//显示
              })
            } else {
              that.setData({
                modalHidden: true//隐藏
              })
            }
          }
        }
      }
    })
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

  },


})



var getCurrentTime = function () {
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

var provIndex = function (prov, provValue, ) {
  for (var i in provValue) {
    if (provValue[i] == prov) {
      return i;
    }
  }

}
var colorIndex = function (color, colorCodesValue) {
  for (var i in colorCodesValue) {
    if (color == colorCodesValue[i]) {

      return i;
    }
  }
}