// pages/modifi_user/user.js
var app = getApp();
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    errormsg: "",

    


   // prov: ["粤", "港", "桂", "琼","赣"],
   // provValue: ["GD", "HK", "GX", "HQ", "JX"],
    
    prov: ["粤", "港", "桂", "琼", "赣", "闽", "浙", "苏", "皖", "沪", "豫", "翼", "湘", "鄂", "云", "贵", "鲁", "川", "渝", "青", "陕", "宁", "新", "甘", "晋", "蒙", "京", "津", "辽", "吉", "黑", "藏"],
    provValue: ["GD", "HK", "GX", "HQ", "JX", "FZ", "ZJ", "JS", "AH", "SH", "HN", "HB", "FN", "FB", "YN", "GZ", "SD", "SC", "CQ", "QH", "SX", "NX", "XJ", "GS", "SJ", "NM", "BJ", "TJ", "LN", "JL", "HJ", "XZ"],
    
    provCodeIndex: 0,

    colorCodes: ["黄", "蓝", "黑", "绿", "红","白"],
    colorCodesValue: ["Y", "B", "D", "N", "R", "W"],
    colorCodeIndex: 0,
    
  
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
  changinput:function(e){   
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;//Unicode编码中的汉字范围
    if (reg.test(e.detail.value)) {

      this.setData({
        showTopTips: true,
        errormsg: "车牌号码不能为中文"
      });
    }

    this.setData({
      truck_lic: e.detail.value.toLocaleUpperCase()
    })
  },
  saveFormId: function (e) {
    console.log(e.detail)
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: getApp().userInfo.userInfo.openid,
        plate: getApp().userInfo.userInfo.plate,
        formId: e.detail.formId
      },
      success: function (e) {
        console.log(e)
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  SubMit:function(e){
    wx.showLoading({
      title: '正在提交...',
    })
    setTimeout(function(){
      wx.hideLoading()
    },3000);
    var that= this;
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: getApp().userInfo.userInfo.openid,
        plate: getApp().userInfo.userInfo.plate,
        formId: e.detail.formId
      },
      success: function (e) {
        console.log(e)
      },
      fail: function (e) {
        console.log(e)
      }
    })

   
    if (e.detail.value.userName == '' ||e.detail.value.phone_number == '' || e.detail.value.truck_lic == '' || e.detail.value.cardid == '') {

      this.setData({
        showTopTips: true,
        errormsg: "输入内容不能为空!"
      });
      //提示内容显示时间
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      wx.hideLoading();
      return;
    }
    

    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (reg.test(e.detail.value.truck_lic)) {
      this.setData({
        showTopTips: true,
        errormsg: "车牌号码不能为中文"
      });
      wx.hideLoading();
      return;
    }

 
     reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!reg.test(e.detail.value.phone_number)) {
      this.setData({
        showTopTips: true,
        errormsg: "输入的手机号码不正确"
      });
      wx.hideLoading();
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
     
      return ;
    }
     
    reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/;
    if (!reg.test(e.detail.value.cardid)) {
      this.setData({
        showTopTips: true,
        errormsg: "输入身份证号码不正确11"
      });
      wx.hideLoading();
      setTimeout(function () {
        that.setData({
          showTopTips: false
        });
      }, 3000);
      return;
    }













    var that = this;

    wx.request({
      url: getApp().data.servsers + '/checkUser',
      data:{
        openid: getApp().userInfo.userInfo.openid,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success:function(res){
        if(res.data.code==0){

          //console.log(that.data.provValue[that.data.provCodeIndex] + e.detail.value.truck_lic + that.data.colorCodesValue[that.data.colorCodeIndex])
          wx.request({
            url: getApp().data.servsers + '/updateUser',
            data: {
              id: getApp().userInfo.userInfo.id,
              phone: e.detail.value.phone_number,
              plate: that.data.provValue[that.data.provCodeIndex] + e.detail.value.truck_lic + that.data.colorCodesValue[that.data.colorCodeIndex],
              name: e.detail.value.userName,
              cardId: e.detail.value.cardid,

            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              wx.hideLoading();
              wx.setStorageSync('userinfo', res.data)
              getApp().userInfo.userInfo = wx.getStorageSync("userinfo")
              wx.switchTab({
                url: '/pages/index/index',
              })
            },
            fail: function () {
              wx.hideLoading();
              wx.showModal({
                title: '通知',
                content: '提交失败，请重试',
              })
            }
          })

        }else{
          wx.hideLoading();
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.msg,
          })

          return;
        }
      }
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("用户信息")
    //var provCodeIndex = provIndex(plate.substring(0, 2), this.data.provValue);
    //var colorCodeIndex = colorIndex(plate.substring( 
     // plate.length - 1, plate.length), this.data.colorCodesValue);

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
    console.log("用户信息")
    console.log(getApp().userInfo.userInfo.plate)
    var plate = getApp().userInfo.userInfo.plate;
    this.setData({
      userName: getApp().userInfo.userInfo.userName,
      openid: getApp().userInfo.userInfo.openid,
      createTime: getApp().userInfo.userInfo.createTime,
      userCardId: getApp().userInfo.userInfo.userCardId,
      plate: plate,
      userNumber: getApp().userInfo.userInfo.phone,
      truck_lic: plate.substring(2, plate.length - 1),
       provCodeIndex: provIndex(plate.substring(0, 2), this.data.provValue),
       colorCodeIndex: colorIndex(plate.substring(plate.length - 1, plate.length), this.data.colorCodesValue)
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
var provIndex = function (prov, provValue, ){
  //var prov = plate.substring(0, 2);
  //var truck_lic = plate.substring(plate.length - 1, plate.length);
  //var color = plate.substring(2, plate.length - 1);
 // var provValue = this.data.provValue;
  //var colorCodesValue = this.data.colorCodesValue;
  for (var i in provValue){
    if (provValue[i] == prov){
       
       console.log("provCodeIndex："+i)
       return i;
    }
  }
  
}
var colorIndex = function (color, colorCodesValue){
  console.log(color)
  for (var i in colorCodesValue) {
    if (color == colorCodesValue[i]) {
      
      console.log("colorCodeIndex" + i)
      return i;
    }
  }
}