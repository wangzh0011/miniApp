// pages/listEir/Eir.js
var base64 = require("../images/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    openid: wx.getStorageSync("userinfo").openid,
    items:[],
    order: [],
  },
  //下拉刷新
  //onPullDownRefresh: function () {
    //console.log("导航栏")
   
    //wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    //setTimeout(function () {
      // complete
      //wx.hideNavigationBarLoading() //完成停止加载
      //wx.stopPullDownRefresh() //停止下拉刷新
    //}, 5000);
  //},
  godetail: function(e) {
    console.log(e)
    //console.log(e.currentTarget.dataset.index)
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
  goAddEIR: function(e) {
    
    this.setData({
      disabled: true
    });
    var that = this;

    setTimeout(function(){
      that.setData({
        disabled: false
      });
    },1000);
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
        console.log("保存formid的时候未能连接服务器.")
        console.log(e)
      },
      complete:function(res){
        console.log("结束连接")
        console.log(res)
      }
    })
  var items =this.data.items;
  
  

   if(items.length>=4){
     wx.showModal({
       showCancel: false,
       title: '提示',
       content: '一个作业时间段内最多只能预约四个业务,请作业完成之后之后再预约',
       success:function(){
         that.setData({
           disabled: false
         });
       }
     })
     
     return ;
   }
   //校验是否符合要求新建预约 
  
  console.log(openid)
  console.log(plate)
   wx.request({
     url: getApp().data.servsers +'check',
     header: {
       'content-type': 'application/x-www-form-urlencoded' // 默认值
     },
     method: "POST",
     data: {
       openId: openid,
       plate:plate
     },
     success:function(res){

       wx.setStorageSync("flush", false)

       console.log(res)
       if(res.data.code==0){
         that.setData({
           disabled: false
         });

         wx.showModal({
           content: res.data.msg,
           showCancel: true,
           confirmText:"确认",
           cancelText:"修改车牌",
           success: function (res) {
             if (res.confirm) {

               var time = that.data.time;
               console.log("time:  " + time)
               
               wx.navigateTo({
                 url: '/pages/yuyue/yuyue?time=' + time,
               })

             }else{

               wx.navigateTo({
                 url: '/pages/modifi_user/user',
               })
             }

           }
         }); 

       }else{

         that.setData({
           disabled: false
         });
         wx.showModal({
           content: res.data.msg,
           showCancel: false,
           confirmText: "确定",
           
           success: function (res) {
             if (res.confirm) {
             }
           }
         });
       }
       
     },
     fail:function(res){
       console.log("校验的时候未能连接服务器.")
       console.log(res)
       that.setData({
         disabled: false
       });
     }
   })
    
  },
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

    var index = e.currentTarget.dataset.index;

    wx.navigateTo({
      url: '/pages/detail/detail?order=' + index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  var flag=wx.getStorageSync("flush");
  var that = this;
  

    wx.showLoading({
      title: '加载数据中...',
    })

  
   
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
       wx.setStorageSync("flush", false);
        that.setData({
          items: res.data.list,
          time: res.data.time,
          activityQuantity: res.data.activityQuantity,
          servsers: getApp().data.uploadurl,
        })

        getApp().order.order = res.data.list;

       


        for(var i in res.data.list){
          if (res.data.list[i].order.eirImg==null){
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '有预约未能成功上传照片，请修改重新上传!',
            })
          }
        }
        

      },
      fail:function(){
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
      complete:function(){
        wx.hideLoading();
      }
    });
   
  
    wx.request({
      url: getApp().data.servsers +'listcancel',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      data: {
        openId: openid
      },
      success:function(res){
        that.setData({
          ls: res.data.list,

        })
      }
    })

  

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