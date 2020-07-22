//fundebug插件
var fundebug = require('./libs/fundebug.1.2.1.min.js');
fundebug.init(
  {
    apikey: 'cb2157ae38b6352c5619c371e61b6acc372a9a4e5d74e178d50bb11ef3e50cee'
  })

App(
  {
    //全局变量
    data: {
      uploadurl:
        //  "https://wxxcx.dcblink.com/upload/",   // PROD
        //  "https://olddcblink.dcblink.com/upload/",  // UAT  废弃
        "https://mtest.dcblink.com/upload/",//  UAT
        // "http://127.0.0.1:8081/upload/",

      servsers:
        //  "https://wxxcx.dcblink.com/miniApp/",   // PROD
        //  "https://olddcblink.dcblink.com/miniApp/" ,  // UAT  废弃
        "https://mtest.dcblink.com:9300/miniApp/",//  UAT
        // "http://127.0.0.1:8081/miniApp/",

    },

    onLaunch: function () {


      var that = this;

      wx.showLoading({
        title: '初始化中...',
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


      // 展示本地存储能力
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)


    },
    infobase: {
      infobase: null
    },
    globalData: {
      userInfo: null

    },
    userInfo: {
      userInfo: ''
    },
    order: {
      order: []
    },

    tmplIds: {
      yardPlanId: 'UlqEK0LWvJsmwiIJs8N2-J1aD3w4pCPoYSrPA-MF1nA',
      suggestId: 'jSNTj57YGHTFVyRNEgL4ArQKoRp1pdiVDsrSmpHrEXA',
      berthingId: 'rs9wg12satDvKzTleCPFC_vPaEs1FBcuOWsqqeoCJIs',
      serverStopId: 'hI0MW3AKr7yfLZ70eW0gHzlhzTNVQ9bwyaqYC9hGVOI',
      signInId: '9GyHdXrvxPMfMOoObwYQ4cY95SUZvaAOtgusx_54fjE',
      appointmentId: 'SO_UlSQEJcvZUx-fBcDfytEm5tpzB9B6kjRJlbWKoGo',
      eeirId: '2ndiSWmz1u6AxmGdFgYi8ouHOd1cnj4qtELam3GJ44w',
      cmsId: '-1_eAQzTJrClavV8uWDsIcstGaAkpOO4ELOSZvjvioE'
    }

  }
)
