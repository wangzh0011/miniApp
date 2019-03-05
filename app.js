  
 App(
  {
    //全局变量
    data: {
      uploadurl: 
     //"https://wxxcx.dcblink.com/upload/",
       //"https://olddcblink.dcblink.com/upload/",
   "http://127.0.0.1:8081/upload/",
      //"https://10.10.11.26:9301/upload/", 
      //"https://10.10.11.34:443/upload/",
      //"https://olddcblink.dcblink.com:8080/upload/",
      servsers:
    //"https://wxxcx.dcblink.com/miniApp/",
     //"https://olddcblink.dcblink.com/miniApp/" ,
     "http://127.0.0.1:8081/miniApp/",       
       //"https://10.10.11.26:9301/miniApp/", 
       //"https://10.10.11.34:443/miniApp/",
      //https://olddcblink.dcblink.com/   127.0.0.1:443  https://wxxcx.dcblink.com/"
      
    },

  onLaunch: function () {
      

    var that = this;
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
   
   
  

   
   
   // console.log(this.data.user)
    //var data1=wx.getStorageSync("userinfo")
    //console.log(data1.openid)
    // 登录
    wx.login({      
      success: res => {
        //如果本地没有存储有用户信息
        
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
    userInfo:null
  },
  order:{
    order:[]
  }

}
)
