// pages/listEir/Eir.js
var base64 = require("../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    openid: wx.getStorageSync("userinfo").openid,     
    items: [],
    order: [],

    prov: ["粤", "港", "桂", "琼", "赣", "闽", "浙", "苏", "皖", "沪", "豫", "翼", "湘", "鄂", "云", "贵", "鲁", "川", "渝", "青", "陕", "宁", "新", "甘", "晋", "蒙", "京", "津", "辽", "吉", "黑", "藏"],
    provValue: ["GD", "HK", "GX", "HQ", "JX", "FZ", "ZJ", "JS", "AH", "SH", "HN", "HB", "FN", "FB", "YN", "GZ", "SD", "SC", "CQ", "QH", "SX", "NX", "XJ", "GS", "SJ", "NM", "BJ", "TJ", "LN", "JL", "HJ", "XZ"],

    provCodeIndex: 0,

    colorCodes: ["黄", "蓝", "黑", "绿", "红", "白"],
    colorCodesValue: ["Y", "B", "D", "N", "R", "W"],
  },

  submit: function(e) {
    console.log("ada")
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
    }
    if ("gr" == name) {
      console.log("抢单")
      wx.navigateTo({
        url: '/pages/imageUpload/upload',
      })
    }
    if ("sitemap" == name) {
      wx.request({
        url: getApp().data.servsers + 'getEta',
        data: {
          phone: '13561409736'
        },
        success:function(e) {
          console.log('bargelink返回的eta:'+e.data);
          wx.setStorageSync('eta', e.data);
          wx.navigateTo({
            url: '/pages/sitemap/sitemap',
          })
        }
      })
    }
  },
  godetail: function(e) {
    console.log(e)
    //console.log(e.currentTarget.dataset.index)
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
    var count=0;
    for( var i in items){
      if (items[i].order.state == '3'){
        count = count + 1;
      }
    }
    console.log(items.length )
    console.log(count)
    if ( items.length >= (4+count) ) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '一个作业时间段内最多只能预约四个业务,请作业完成之后之后再预约',
        success: function() {
          that.setData({
            disabled: false
          });
        }
      })

      return;
    }
    //校验是否符合要求新建预约 

    console.log(openid)
    console.log(plate)
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
                  url: '/pages/yuyue/yuyue?time=' + time,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log("test");
    console.log(wx.getStorageSync('userinfo'));
    console.log("test");


    var that = this;

    wx.showLoading({
      title: '加载数据中...',
    })

    var openid = wx.getStorageSync("userinfo").openid;
    //var openid = this.data.openid;
    var plate = wx.getStorageSync("userinfo").plate;
    that.setData({
      plate: plate,
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
              console.log('用户点击确定')
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

    if (getApp().userInfo.userInfo) {

      if (wx.getStorageSync("userinfo").userType == 'truck') {
        this.setData({
          plate: plate,
          truck_lic: plate.substring(2, plate.length - 1),
          provCodeIndex: provIndex(plate.substring(0, 2), this.data.provValue),
          colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), this.data.colorCodesValue),
        })
      }

      this.setData({
        userType: wx.getStorageSync("userinfo").userType
      })
    } else {
      getApp().callback = () => {
        if (getApp().userInfo.userInfo.userType == 'truck') {
          this.setData({
            plate: plate,
            truck_lic: plate.substring(2, plate.length - 1),
            provCodeIndex: provIndex(plate.substring(0, 2), this.data.provValue),
            colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), this.data.colorCodesValue),
          })
        }

        this.setData({
          userType: getApp().userInfo.userInfo.userType
        })
      }
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
              console.log('用户点击确定')
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




var provIndex = function(prov, provValue, ) {
  for (var i in provValue) {
    if (provValue[i] == prov) {
      console.log("provCodeIndex：" + i)
      return i;
    }
  }

}
var colorIndex = function(color, colorCodesValue) {
  console.log(color)
  for (var i in colorCodesValue) {
    if (color == colorCodesValue[i]) {

      console.log("colorCodeIndex" + i)
      return i;
    }
  }
}