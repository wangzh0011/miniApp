//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    plate: wx.getStorageSync("userinfo").plate,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },




  tiaozhuan: function (e) {
    wx.navigateTo({
      url: '/pages/listcms/cms?id=1',
    })
  },
  //保存formId
  saveFormId: function (e) {
    var openid = wx.getStorageSync("userinfo").openid;
    var plate = wx.getStorageSync("userinfo").plate;
    wx.request({
      url: getApp().data.servsers + '/saveFormId',
      data: {
        openid: openid,
        plate: plate,
        formId: e.detail.formId
      },
      success: function (e) { 
      },
      fail: function (e) {
        console.log(e)
      }
    })
   console.log(e)
    var name = e.currentTarget.dataset.name;
    
    if("user"==name){
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
 




  },
  //事件处理函数
  bindViewTap: function () {

    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function (e) {
    
    if (wx.getStorageSync("userinfo").plate != undefined) {
      this.setData({
        plate: wx.getStorageSync("userinfo").plate,
      })
    } else {
      var that = getApp();
      // that.userInfo.userInfo = wx.getStorageSync("userinfo")
      /*
       wx.request({
         url: 'http://172.25.35.114:8081/cmsaction.action',
         method:'post',
         data:{
           trucklic: 'GDBCW309Y'
         },
         success(e){
           console.log(e)
         },
         fail(e){
           console.log(e)
         }
       })
     */
      wx.showLoading({
        title: '初始化中...',

      })




      console.log('开始')

      // console.log(this.data.user)
      //var data1=wx.getStorageSync("userinfo")
      //console.log(data1.openid)
      // 登录
      wx.login({

        success: res => {
          //如果本地没有存储有用户信息
          console.log('开始2')
          //wx.showLoading();
          console.log(res.code)
          console.log(getApp().data.servsers + 'userInfo/' + res.code)


          /*
          if (wx.getStorageSync("userinfo").openid == null || wx.getStorageSync("userinfo").openid == '' || 
          wx.getStorageSync("userinfo").openid == undefined){*/

          wx.showToast({
            title: '程序数据加载中',
            icon: 'loading',
            duration: 6000
          });
          var code = res.code;
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: getApp().data.servsers + 'userInfo/' + res.code,
            success: function (res) {
              console.log('请求成功，开始处理')
              console.log(res.data);
              console.log(res.data.id);

              if (res.data.id == null || res.data.id == '') {
                console.log('未注册sdasd')
                wx.setStorageSync("infobase", res.data)
                that.infobase = res.data
                console.log("this.infobase")
                console.log(getApp().infobase)
                wx.redirectTo({
                  url: '/pages/InformaTion/user',
                })
              } else {


                wx.setStorageSync('userinfo', res.data);
                that.userInfo.userInfo = res.data
                //console.log("全局变量：  " + this.userInfo.userInfo)
                /*wx.redirectTo({
                  
                  url: '/pages/index/index',
                })*/
              }

              wx.hideToast();
              /* wx.setStorage({
                 key: 'userinfo',
                 data: {
                   openid:res.data.openid,
                   session_key: res.data.session_key
                 },
                 
                 
   
               })*/

            },
            fail: function (res) {
              console.log("fail:   " + getApp().data.servsers + 'userInfo/' + res.code)
              wx.hideToast();
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
            }


          });
          /*
          }else{
            console.log('1已注册')
            that.userInfo.userInfo = wx.getStorageSync("userinfo")
            console.log(getApp().userInfo.userInfo)
            
          }*/


          //判断是否已经绑定资料

          /*wx.request({
            url: 'http://127.0.0.1:8080/getUser/' + wx.getStorageSync("userinfo").openid,
            success:function(res){
              console.log("获取用户信息")
             console.log(res.data)
             if (res.data == null || res.data==''){
               console.log("无用户信息asdasd") 
             }
             else{
               console.log("有用户信息") 
               //wx.setStorageSync(key, data)
               //console.log("用户信息："+this.data.user)
               wx.setStorageSync("user", res.data)
               wx.redirectTo({
                 url:'pages/index/index',
                 success:function(res){
                   console.log("跳转成功")
                 },
               })
               /*wx.navigateTo({
                 url: 'pages/logs/logs',
                 success:function(res){
                   console.log("跳转成功")
                 }
               })
             }
            },
            fail:function(res){
              wx.showToast({
                title: '系统发生错误，错误代码111，请退出重试',
                duration: 3000
              })
            }
          })*/



          //如果未绑定，跳转用户绑定资料界面

          //如果已经绑定，跳转到飞单上传业务界面，并将用户信息储存到全局变量中

        }
      })
      
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)

      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })

    }



  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: '075529022902',
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
