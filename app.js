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
     "https://wxxcx.dcblink.com/upload/",   //UAT
      //  "https://olddcblink.dcblink.com/upload/",  //PROD
  //  "http://127.0.0.1:8081/upload/",

      servsers:
   "https://wxxcx.dcblink.com/miniApp/",   //UAT
    //  "https://olddcblink.dcblink.com/miniApp/" ,  //PROD
    //  "http://127.0.0.1:8081/miniApp/", 
      
    },

  onLaunch: function () {
      

    var that = this;
   
   wx.showLoading({
    title: '初始化中...',
   })
    
    wx.hideLoading()
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
    infobase:null
  },
  globalData: {
    userInfo: null
    
  },
  userInfo:{
    userInfo:''
  },
  order:{
    order:[]
  }

}
)
