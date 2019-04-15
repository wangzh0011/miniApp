// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderVo: null,
    eirUrl: [],
    sealUrl: [],
    attachUrl: [],
    eir_img: [],
    seal_img: [],
    attach_img: []
    
  },
  
  type_Radios:function(e){
    var value = e.detail.value;
    console.log(value)
    var orderVo = this.data.orderVo;
    orderVo.order.tranType = value;
    this.setData({
      orderVo: orderVo,
    })
  },
//修改
  confirm:function(e){
    var that = this;

    if (that.data.orderVo.order.tranType == "RF" && that.data.sealUrl.length==0){
      wx.showModal({
        title: '提示',
        content: '交重请添加单证照片!',
      })

      return ;
    }

    
    
    wx.showLoading({
      title: '上传中...',
    })
   
    
    wx.request({
      url: getApp().data.servsers+'updateOrder',  //修改该预约
      data:{
        id: that.data.orderVo.order.id,
        tranType: that.data.orderVo.order.tranType,
        state:'1',

      },
      success:function(res){
        console.log(res)
        console.log(res.data.code)
        if (res.data.code == 0){
          var order = that.data.orderVo.order;
          console.log(that.data.eirUrl[0].indexOf(order.eirImg))
          if ( that.data.eirUrl[0].indexOf(order.eirImg) == -1){           console.log("上传单照片")

            wx.uploadFile({
              url: getApp().data.servsers + 'saveImage',
              filePath:that.data.eirUrl[0],
              name: 'image',
              success:function(res){
                console.log(res.data)
                var jsondata = JSON.parse(res.data);
                  
                 wx.request({
                   url: getApp().data.servsers + 'updateOrderImg',
                   data: {
                     orderId: order.id,
                     address: jsondata.data.filename,
                     typeImg: "eirImg",
                     state:"1",
                     
                   },
                   success: function (res) {
                     console.log("eirImg更新上传成功。" + jsondata.data.filename)                     
                   }
                 })

              },
              fail:function(e){
               wx.showToast({
                 title: '上传单证照片失败',
               })
              }
            })
          }


          if (that.data.sealUrl.length>0){

            if (that.data.sealUrl[0].indexOf(that.data.orderVo.order.sealImg) == -1) {
              wx.uploadFile({
                url: getApp().data.servsers + 'saveImage',
                filePath: that.data.sealUrl[0],
                name: 'image',
                success: function (res) {
                  var jsondata = JSON.parse(res.data);

                  wx.request({
                    url: getApp().data.servsers + 'updateOrderImg',
                    data: {
                      orderId: order.id,
                      address: jsondata.data.filename,
                      typeImg: "sealImg"
                    },
                    success: function (res2) {
                      console.log("sealImg 上传成功。" + jsondata.data.filename)                      
                    }
                  })

                },
                fail: function (e) {
                  wx.showToast({
                    title: '上传单证照片失败',
                  })
                }
              })
            }

            if (that.data.sealUrl[1] != null && that.data.sealUrl[1] != undefined && that.data.sealUrl[1].indexOf(that.data.orderVo.order.sealImg1) == -1) {
              wx.uploadFile({
                url: getApp().data.servsers + 'saveImage',
                filePath: that.data.sealUrl[1],
                name: 'image',
                success: function (res) {
                  var jsondata = JSON.parse(res.data);

                  wx.request({
                    url: getApp().data.servsers + 'updateOrderImg',
                    data: {
                      orderId: order.id,
                      address: jsondata.data.filename,
                      typeImg: "sealImg1"
                    },
                    success: function (res2) {
                      console.log("sealImg 上传成功。" + jsondata.data.filename)
                    }
                  })

                },
                fail: function (e) {
                  wx.showToast({
                    title: '上传单证照片失败',
                  })
                }
              })
            }

          }



          if (that.data.attachUrl.length > 0) {

            if (that.data.attachUrl[0].indexOf(that.data.orderVo.order.attachImg) == -1) {
              wx.uploadFile({
                url: getApp().data.servsers + 'saveImage',
                filePath: that.data.attachUrl[0],
                name: 'image',
                success: function (res) {
                  var jsondata = JSON.parse(res.data);

                  wx.request({
                    url: getApp().data.servsers + 'updateOrderImg',
                    data: {
                      orderId: order.id,
                      address: jsondata.data.filename,
                      typeImg: "attachImg"
                    },
                    success: function (res2) {
                      console.log("attachImg上传成功。" + jsondata.data.filename)
                    }
                  })

                },
                fail: function (e) {
                  wx.showToast({
                    title: '上传单证照片失败',
                  })
                }
              })
            }

            if (that.data.attachUrl[1] != null && that.data.attachUrl[1] != undefined && that.data.attachUrl[1].indexOf(that.data.orderVo.order.attachImg1) == -1) {
              wx.uploadFile({
                url: getApp().data.servsers + 'saveImage',
                filePath: that.data.attachUrl[1],
                name: 'image',
                success: function (res) {
                  var jsondata = JSON.parse(res.data);

                  wx.request({
                    url: getApp().data.servsers + 'updateOrderImg',
                    data: {
                      orderId: order.id,
                      address: jsondata.data.filename,
                      typeImg: "attachImg1"
                    },
                    success: function (res2) {
                      console.log("attachImg上传成功。" + jsondata.data.filename)
                    }
                  })

                },
                fail: function (e) {
                  wx.showToast({
                    title: '上传单证照片失败',
                  })
                }
              })
            }  
          }
           
           
            setTimeout(function(){
            wx.hideLoading();

            wx.navigateTo({
              url: '../listEir/Eir',
            })
            //  console.log("跳转网页")
            //   wx.switchTab({
            //     url: '/pages/listEir/Eir',
            //   })
            },3000);        


          
        }else{

        }
      }
      
    })

     

  },

  chooseEirImage: function (e) {   
    
    var that = this;  
    wx.chooseImage({
      count: 1,
      sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 compressed 是压缩图  original 是原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {        
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片        
          that.setData({
            files: res.tempFilePaths,
            eirUrl: res.tempFilePaths,
            //files: that.data.files.concat(res.tempFilePaths)
          });
        // console.log(res.tempFilePaths[0])
        // console.log(res.tempFiles)

      }
    })
  },
  chooseSealImage: function (e) {    
    var that = this;
    wx.chooseImage({
      count: 2,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片        
          that.setData({
            files: res.tempFilePaths,
            sealUrl: res.tempFilePaths,
            //files: that.data.files.concat(res.tempFilePaths)
          });  
      }
    })
  },
  chooseAttachlImage: function (e) {    
    var that = this; 
    wx.chooseImage({
      count: 2,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片        
          that.setData({
            files: res.tempFilePaths,
          attachUrl: res.tempFilePaths,
            //files: that.data.files.concat(res.tempFilePaths)
          });
        // console.log(res.tempFilePaths[0])
        // console.log(res.tempFiles)
      }
    })
  },
  addSeal: function (e) {

    var orderid = this.data.orderVo.orderId;
    wx.navigateTo({
      url: '/pages/addseal/seal?orderid=' + orderid,
    })
  },
  previewImage: function (e) {
    //console.log(e)
    if ("eir" == e.currentTarget.dataset.type) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.eirUrl // 需要预览的图片http链接列表
      })
    }
    if ("seal" == e.currentTarget.dataset.type) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.sealUrl // 需要预览的图片http链接列表
      })
    }
    if ("attach" == e.currentTarget.dataset.type) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.attachUrl // 需要预览的图片http链接列表
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var id = options.id;
    wx.request({
      url: getApp().data.servsers + 'getOrderById',
      data: {
        Id: id,
      },
      success: function (res) {
        console.log(res)
        console.log(res.data)
        that.setData({
          orderVo: res.data,
        })
        var orderVo = res.data;
        var url = getApp().data.uploadurl;      
        var sealUrl = that.data.sealUrl; 
        var attachUrl = that.data.attachUrl;
        console.log(orderVo)
        that.setData({
          tranType:orderVo.order.tranType,
          eirUrl: [url + orderVo.order.eirImg],
          servsers: getApp().data.servsers,
        })

        if (orderVo.order.sealImg != null) {
          sealUrl[0] = url + orderVo.order.sealImg;
          that.setData({
            sealUrl: sealUrl,
          })
        }
        if (orderVo.order.sealImg1 != null) {
          sealUrl[1] = url + orderVo.order.sealImg1;
          that.setData({
            sealUrl: sealUrl,
          })
        }
        if (orderVo.order.attachImg != null) {
          attachUrl[0] = url + orderVo.order.attachImg;
          that.setData({
            attachUrl: attachUrl,
          })
        }
        if (orderVo.order.attachImg1 != null) {
          attachUrl[1] = url + orderVo.order.attachImg1;
          that.setData({
            attachUrl: attachUrl,
          })
        }
       

      },
    })



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