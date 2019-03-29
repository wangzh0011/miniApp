  
 App(
  {
    //全局变量
    data: {
      uploadurl: 

    //  "https://wxxcx.dcblink.com/upload/",
      //  "https://olddcblink.dcblink.com/upload/",
   "http://127.0.0.1:8081/upload/",
    // "https://wxxcx.dcblink.com/upload/",
       //"https://olddcblink.dcblink.com/upload/",
   //"http://127.0.0.1:8081/upload/",
      //"https://10.10.11.26:9301/upload/", 
      //"https://10.10.11.34:443/upload/",
      //"https://olddcblink.dcblink.com:8080/upload/",
      servsers:
  //  "https://wxxcx.dcblink.com/miniApp/",
    //  "https://olddcblink.dcblink.com/miniApp/" ,
     "http://127.0.0.1:8081/miniApp/", 

   // "https://wxxcx.dcblink.com/miniApp/",
     //"https://olddcblink.dcblink.com/miniApp/" ,
    // "http://127.0.0.1:8081/miniApp/",       

       //"https://10.10.11.26:9301/miniApp/", 
       //"https://10.10.11.34:443/miniApp/",
      //https://olddcblink.dcblink.com/   127.0.0.1:443  https://wxxcx.dcblink.com/"
      
    },

  onLaunch: function () {
      

    var that = this;
   
   wx.showLoading({
    title: '初始化中...',
   })
   
   
  

   
   
   
    // 登录
    wx.login({      
      success: res => {
        //如果本地没有存储有用户信息
        console.log("login:进入页面");
        //wx.showLoading();
        console.log("res.code:"+res.code)
        console.log(getApp().data.servsers + 'userInfo/' + res.code)

          wx.showToast({
            title: '程序数据加载中',
            icon: 'loading',
            duration: 6000
          });
        var code = res.code;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: getApp().data.servsers +'userInfo/'+res.code,
          success: function(res) {
            console.log('请求成功，开始处理') 
            console.log(res);
            console.log(res.data);
            console.log(res.data.id);
            
            if (res.data.id==null || res.data.id=='' || res.data.id == undefined){
              console.log("未注册")
              wx.setStorageSync("infobase", res.data)
              var data = res.data;
              that.infobase = data;
              //console.log("this.infobase")
              console.log(getApp().infobase )
              wx.redirectTo({
                url: '/pages/VesselOrTruck/vesselOrTruck',
                })
              
            }else{
              console.log('已注册')
              wx.setStorageSync('userinfo', res.data);
              that.userInfo.userInfo = res.data;
              if(that.callback){
                that.callback();
              }
            }
            
            wx.hideToast();

            },
            fail:function(res){

              console.log(res)
              console.log("fail:   "+getApp().data.servsers + 'userInfo/' + res.code)
              wx.hideToast();
              wx.showModal({
                content: '未能连接服务器',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta:-1
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
      fail:function(res){
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
    }
    )
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
