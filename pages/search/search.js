// pages/search/search.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    plate: wx.getStorageSync("userinfo").plate,


    //prov: ["粤", "港", "桂", "琼", "赣"],
    //provValue: ["GD", "HK", "GX", "HQ", "JX"],
    
    prov: ["粤", "港", "桂", "琼", "赣", "闽", "浙", "苏", "皖", "沪", "豫", "翼", "湘", "鄂", "云", "贵", "鲁", "川", "渝", "青", "陕", "宁", "新", "甘", "晋", "蒙", "京", "津", "辽", "吉", "黑", "藏"],
    provValue: ["GD", "HK", "GX", "HQ", "JX", "FZ", "ZJ", "JS", "AH", "SH", "HN", "HB", "FN", "FB", "YN", "GZ", "SD", "SC", "CQ", "QH", "SX", "NX", "XJ", "GS", "SJ", "NM", "BJ", "TJ", "LN", "JL", "HJ", "XZ"],
    provCodeIndex: 0,

    colorCodes: ["黄", "蓝", "黑", "绿", "红", "白"],
    colorCodesValue: ["Y", "B", "D", "N", "R", "W"],
    colorCodeIndex: 0,
  },
  changinput: function (e) {
    console.log(e)
    this.setData({
      truck_lic: e.detail.value.toLocaleUpperCase()
    })
  },
  bindprovCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      provCodeIndex: e.detail.value
    })
  },
  bindcolorCodeChange: function (e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);

    this.setData({
      colorCodeIndex: e.detail.value
    })
  },
  // saveFormId: function (e) {
  //   console.log(e.detail)
  //   var that = this;
  //   var plate = that.data.provValue[that.data.provCodeIndex] + e.detail.value.truck_lic + that.data.colorCodesValue[that.data.colorCodeIndex];
    
  //   console.log(plate);
  //   wx.request({
  //     url: getApp().data.servsers + '/saveFormId',
  //     data: {
  //       openid: wx.getStorageSync("userinfo").openid,
  //       plate: plate,
  //       formId: e.detail.formId
  //     },
  //     success: function (e) {
  //       console.log(e)
  //     },
  //     fail: function (e) {
  //       console.log(e)
  //     }
  //   })
  // },

  gocms:function(e){
    var that = this;
    var plate = that.data.provValue[that.data.provCodeIndex] + that.data.truck_lic + that.data.colorCodesValue[that.data.colorCodeIndex];
    // var formId = e.detail.formId;
    // wx.request({
    //   url: getApp().data.servsers + '/saveFormId',
    //   data: {
    //     openid: that.data.openid,
    //     plate: plate,
    //     formId: formId,
    //   },
    //   success: function (e) {
    //     console.log("save FormId sucess!")
    //     console.log(e)
    //   },
    //   fail: function (e) {
    //     console.log(e)
    //   }
    // })
    
    /**
     * 订阅消息
     */
    wx.requestSubscribeMessage({

      tmplIds: [app.tmplIds.cmsId, app.tmplIds.eeirId, app.tmplIds.serverStopId],
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

          wx.navigateTo({
            url: '/pages/cms/cms?plate=' + plate,
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
  changePleta:function(e){
    console.log("changePleta")
    console.log(e)
   this.setData({

   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var openid = wx.getStorageSync("userinfo").openid;

    // if (openid == undefined) {
    //   wx.login({
    //     success: res => {
    //       //如果本地没有存储有用户信息

    //       wx.showToast({
    //         title: '程序数据加载中',
    //         icon: 'loading',
    //         duration: 6000
    //       });
    //       var code = res.code;
    //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //       wx.request({
    //         url: getApp().data.servsers + 'userInfo/' + res.code,
    //         success: function (res) {
    //           console.log('请求成功，开始处理')
    //           console.log(res);
    //           console.log(res.data);
    //           console.log(res.data.id);

    //           if (res.data.id == null || res.data.id == '') {
    //             wx.setStorageSync("infobase", res.data)
    //             var data = res.data;
    //             // that.infobase = data;
    //             if (data.openid == undefined) {
    //               wx.hideToast();
    //               wx.showModal({
    //                 content: '未能正确获取数据，请退出程序重进',
    //                 showCancel: false,
    //                 success: function (res) {
    //                   if (res.confirm) {
    //                   }
    //                 }
    //               });
    //             }
    //             console.log(getApp().infobase)
    //             wx.redirectTo({
    //               url: '/pages/InformaTion/user',
    //             })

    //           } else {
    //             console.log('已注册')
    //             wx.setStorageSync('userinfo', res.data);

    //             that.userInfo.userInfo = res.data

    //           }

    //           wx.hideToast();


    //         },



    //       });

    //     },

    //   }
    //   )
    // }
    
    if (options.plate != undefined && options.plate.length > 5) {
      var plate = options.plate;
      
      this.setData({
        plate: plate,
        truck_lic: plate.substring(2, plate.length - 1),
        provCodeIndex: provIndex(plate.substring(0, 2), this.data.provValue),
        colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), this.data.colorCodesValue),
      })
    }
    else {
      var plate = wx.getStorageSync("userinfo").plate;
      console.log(plate)
      if(plate == undefined){
        this.setData({
          plate: "",
          truck_lic: "",
          provCodeIndex: 0,
          colorCodeIndex: 0         
        })
      }else{
        this.setData({
          plate: plate,
          truck_lic: plate.substring(2, plate.length - 1),
          provCodeIndex: provIndex(plate.substring(0, 2), this.data.provValue),
          colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), this.data.colorCodesValue),
          openid: wx.getStorageSync("userinfo").openid,
        })
    }}
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

var provIndex = function (prov, provValue, ) {
  //var prov = plate.substring(0, 2);
  //var truck_lic = plate.substring(plate.length - 1, plate.length);
  //var color = plate.substring(2, plate.length - 1);
  // var provValue = this.data.provValue;
  //var colorCodesValue = this.data.colorCodesValue;
  for (var i in provValue) {
    if (provValue[i] == prov) {

      console.log("provCodeIndex：" + i)
      return i;
    }
  }

}
var colorIndex = function (color, colorCodesValue) {
  console.log(color)
  for (var i in colorCodesValue) {
    if (color == colorCodesValue[i]) {

      console.log("colorCodeIndex" + i)
      return i;
    }
  }
}