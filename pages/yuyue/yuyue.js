// pages/yuyue/yuyue.js
function GetDatem(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getFullYear() + '-' + (dd.getMonth() + 1) + '-' + dd.getDate();
  var d = dd.getDate();
  return m;
};


function GetDate(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return d;
};
//删除元素
function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

function saveImage(path) {
  var data;
  wx.uploadFile({
    url: getApp().data.servsers + 'saveImage',
    filePath: path,
    name: 'image',
    formData: {
      openid: "openid",
    },
    success: function(res) {
      console.log(res.data)

      data = res;
      //return res;
    },
    fail: function(res) {

    }
  })
  return data;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled:false,
    checkday: '',
    checktime: '',
    item: [{
      workType: '',
      eir_img: [],
      seal_img: [],
      attach_img: []
    }],

    items: [{
        workType: '',
        eir_img: [],
        seal_img: [],
        attach_img: []
      },

    ],

    type_D: 0, //提作业的数量
    type_R: 0, //交作业的数量

  },


  deleteBusines: function(e) {
    var items = this.data.items;
    var index = e.currentTarget.dataset.index;
    var item = items[index];

    removeByValue(items, item);

    //重新计算几交几提
    var type_D = 0;
    var type_R = 0;

    for (var i in items) {
      if (items[i].workType == 'DE' || items[i].workType == 'DF') {

        type_D = type_D + 1;
      }
      if (items[i].workType == 'RE' || items[i].workType == 'RF') {

        type_R = type_R + 1;
      }
    }
    this.setData({
      items: items,
      type_D: type_D,
      type_R: type_R,
    })

  },

  type_Radios: function(e) {
    var index = e.currentTarget.dataset.index;
    var items = this.data.items;
    var value = e.detail.value;
    items[index].workType = value;
    //计算几交几提
    var type_D = 0;
    var type_R = 0;
    for (var i in items) {
      if (items[i].workType == 'DE' || items[i].workType == 'DF') {

        type_D = type_D + 1;
      }
      if (items[i].workType == 'RE' || items[i].workType == 'RF') {

        type_R = type_R + 1;
      }
      
    }

    var list =   getApp().order.order;
    
    for(var i in list){
      

      if (list[i].order.tranType == 'DE' || list[i].order.tranType == 'DF') {
        
        type_D = type_D + 1;
      }
      if (list[i].order.tranType == 'RE' || list[i].order.tranType == 'RF') {

        type_R = type_R + 1;
      }

    }


    this.setData({
      items: items,
      type_D: type_D,
      type_R: type_R,
    })

  },
  //提交
  addOrder: function(e) {
    //判断是否选择了日期
    // console.log(this.data.checkday)
    var time = this.data.time;  
    var items = this.data.items;  
    var that = this;
    that.setData({
      disabled:true
    });
    if (time == 'null') {

      if (this.data.checkday == '' || this.data.checktime == '') {
        wx.showModal({
          title: '提示',
          content: '请先选择时间!',
          showCancel: false,

        })
        that.setData({
          disabled: false
        });

        return;
      }
    }
    
    if(items.length == 0){
      wx.showModal({
        title: '提示',
        content: '请添加作业信息',
        showCancel: false,

      })
      that.setData({
        disabled: false
      });

      return;
    }
    
    var count=0; //计算总共有几张照片
    var sucess=0;
    for (var i in items) {
      var item = items[i];
      
      if (item.eir_img.length !=0){
        count = count+1;
      }
      if (item.seal_img.length != 0) {
        count = count + 1;
      }
      if (item.attach_img.length != 0) {
        count = count + 1;
      }

      if (item.workType==''){
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请选择作业类型!',

        })
        that.setData({
          disabled: false
        });
        return;
      }
       
      if (item.eir_img[0] != null && item.eir_img[0] != undefined && item.eir_img[0] != "") {

      } else {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请添加单证照片!',

        })
        that.setData({
          disabled: false
        });
        return;
      }

      if (item.seal_img.length == 0 && item.workType == 'RF'){
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '交重请添加封条照片!',

        })
        that.setData({
          disabled: false
        });
        return;
      }

    }


    //判断是否选择了作业类型，和照片等


    var appointmentTime;
    var expireTime ;
    console.log("time："+time)
    if(time=='null'){
      console.log("比较时间执行了!")
      appointmentTime = this.data.checkday + ' ' + this.data.checktime;
      expireTime = this.data.checkday + ' ' + this.data.expireTime;
      
      console.log(appointmentTime)
      console.log(expireTime)

      console.log("比较结果")

      console.log(new Date() > new Date(Date.parse(expireTime.replace(/\-/g, '/'))));
      if (new Date() > new Date(Date.parse(expireTime.replace(/\-/g, '/')))){
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请选择正确的预约时间.',

        })
        that.setData({
          disabled: false
        });
        return;
      }

    }else{
      //console.log("time.split:"+time.split("-")[3])
      appointmentTime=time;
      expireTime = time.split(" ")[0]+" "+time.split(" ")[1].split("-")[1];

    }

    wx.setStorageSync("flush", true) //首页刷新
    

    wx.showLoading({
      title: '照片上传中，请稍等。。',
    })

    
    var openId = wx.getStorageSync("userinfo").openid;
    var phone = wx.getStorageSync("userinfo").phone;
    var plate= wx.getStorageSync("userinfo").plate;
    var userName=wx.getStorageSync("userinfo").userName;
     
    
    
    for (var i in items) { 
      wx.request({
        url: getApp().data.servsers + 'addOrder',
        data: {
          openId: openId ,
          phone: phone,
          plate: plate,
          userName: userName,
          operator: userName,
          appointmentTime: appointmentTime ,
          tranType: items[i].workType,
          expireTime: expireTime,
          site:'D',//内贸
          tranCount: that.data.type_R +' 交'+that.data.type_D +' 提',

          index:i, //标识数组下标
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function(res) {
         
          var order = res.data;

          var item = items[order.remark];
          console.log("item")
          console.log(item)

          if (item.eir_img[0] != null && item.eir_img[0] != undefined && item.eir_img[0] != "") {
            var filename = item.eir_img[0];
            console.log("开始上传eir照片:" + filename)
            wx.uploadFile({
              url: getApp().data.servsers + 'saveImage',
              filePath: filename,
              name: 'image',

              success: function(res1) {
                console.log("上传成功并保存到了服务器" )
                console.log(res1)
                sucess=sucess+1;

                console.log(res1)
                var jsondata = JSON.parse(res1.data);
                
                wx.request({
                  url: getApp().data.servsers + 'updateOrderImg',
                  data: {
                    orderId: order.id ,
                    address: jsondata.data.filename,
                    typeImg: "eirImg"
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function(res2) {
                    console.log("eirImg 上传成功。" + jsondata.data.filename)
                    console.log(res2)
                    if (sucess == count) {
                      wx.hideLoading();
                      console.log("sucess:" + sucess + " count：" + count)
                      wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '码头将于15分钟内通过微信推送预约结果，请在审核通过后再进闸作业.',
                        success: function (res) {
                          if (res.confirm) {
                            wx.switchTab({
                              url: '../listEir/Eir',
                            })
                          }
                        }

                      })
                    }


                    if (res2.data.code != 0) {
                      wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '单证照片上传失败,请重试!',

                        success: function (res) {
                          return;
                        }
                      })
                    }else{
                      
                    }


                  }
                })


              },
              fail: function(res1) {
                console.log("上传文件连接服务器失败:" )
                    console.log(res1)
              },
              complete:function(res){
                console.log("结束上传" )
                console.log(res)
              }

            })

          }
          if ((item.seal_img[0] != null && item.seal_img[0] != undefined && item.seal_img[0] != "") && item.workType !='RE') {
            //console.log("item.seal_img: " + item.seal_img[0])
            //eirImg = saveImage(item.eir_img[0])
            var filename = item.seal_img[0];
            console.log("开始上传seal照片:" )
            wx.uploadFile({
              url: getApp().data.servsers + 'saveImage',
              filePath: filename,
              name: 'image',
              success: function(res1) {
                sucess = sucess + 1;
                var jsondata = JSON.parse(res1.data);
                order.sealImg = jsondata.data.filename
                wx.request({
                  url: getApp().data.servsers + 'updateOrderImg',
                  data: {
                    orderId: order.id,
                    address: order.sealImg,
                    typeImg: "sealImg"
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function(res2) {
                    console.log("sealImg 上传成功。")
                    console.log(res2)
                    if (sucess == count) {
                      wx.hideLoading();

                      console.log("sucess:"+sucess+" count："+count)
                      wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '码头将于15分钟内通过微信推送预约结果，请在审核通过后再进闸作业.',
                        success: function (res) {
                          if (res.confirm) {
                            wx.switchTab({
                              url: '../listEir/Eir',
                            })
                          }
                        }

                      })
                    }
                  },
                  fail:function(res1){
                    console.log("seal上传连接服务器失败:")
                    console.log(res1)     
                  }
                })
              },
              fail: function(res1) {}
            })

          }
          if (item.attach_img[0] != null && item.attach_img[0] != undefined && item.attach_img[0] != "") {
            var filename = item.attach_img[0];
            console.log("开始上传attach照片:" + filename)
            wx.uploadFile({
              url: getApp().data.servsers + 'saveImage',
              filePath: filename,
              name: 'image',
              success: function(res1) {
                console.log(res1)
                sucess = sucess + 1;
                var jsondata = JSON.parse(res1.data);
                order.attachImg = jsondata.data.filename;
                console.log(order.attachImg)
                //更新数据
                wx.request({
                  url: getApp().data.servsers + 'updateOrderImg',
                  formData:{

                  },
                  data: {
                    orderId: order.id ,
                    address: order.attachImg,
                    typeImg: "attachImg"
                  },
                  method: "POST",
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  success: function(res2) {
                    console.log("attachImg 上传成功。")
                    console.log(res2) 

                    if(sucess==count){
                      wx.hideLoading();
                      console.log("sucess:" + sucess + " count：" + count)
                      wx.showModal({
                        showCancel: false,
                        title: '提示',
                        content: '码头将于15分钟内通过微信推送预约结果，请在审核通过后再进闸作业.',
                        success: function (res) {
                          if (res.confirm) {
                            wx.switchTab({
                              url: '../listEir/Eir',
                            })
                          }
                        }

                      })
                    }
                  },
                  fail:function(res1){
                    console.log("attachImg连接服务器失败:")
                    console.log(res1)
                  }

                })
              },
              fail: function(res1) {
                
              }
            })
          }
          


        },
        complete:function(){

        }
      })

    }
     
    setTimeout(function () {
      //提交完成
      wx.hideLoading();
      console.log("sucess:" + sucess + " count：" + count)
      
      if(sucess != count){ //照片未全部上传
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '照片可能未全部上传，请再检查重新上传.',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../listEir/Eir',
            })
          }
        }

      })}

    }, 65000)





  },

  


  addBusines: function(e) {
    //var item = { 'workType': '', 'eir_img': '', 'seal_img': '', 'attacht_img': '' };
    var item = this.data.item;
    var items = this.data.items;
    var remain=this.data.remain-1;

    //判断是否小于或者等于4
    if (items.length > remain) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '一次预约最多只能两交两提！',
      })
      return;
    }

    items.push(item[0]);
    this.setData({
      items: items,
    })


  },

  dayradios: function(e) {
    console.log(e)
    this.setData({
      checkday: e.detail.value,
    })

  },
  timeradios: function(e) {
    console.log(e)
    var expire = e.detail.value;    
    var expireTime = expire.split("-")[1];
    this.setData({
      checktime: e.detail.value,
      expireTime: expireTime,
    })
    console.log(this.data.checkday + " " + this.data.checktime)
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  chooseEirImage: function(e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    var items = this.data.items;
    console.log(index)
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 compressed 是压缩图  original 是原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log("adad")
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        items[index].eir_img = res.tempFilePaths,
          that.setData({
            files: res.tempFilePaths,
            items: items
          });
      }
    })
  },
  chooseSealImage: function(e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    var items = this.data.items;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        items[index].seal_img = res.tempFilePaths,
          that.setData({
            files: res.tempFilePaths,
            items: items
          });
      }
    })
  },
  chooseAttachlImage: function(e) {
    var index = e.currentTarget.dataset.index

    var that = this;
    var items = this.data.items;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        items[index].attach_img = res.tempFilePaths,
          that.setData({
            files: res.tempFilePaths,
            items: items
          });
      }
    })
  },
  clicks: function(e) {
    let index = e.currentTarget.dataset.index;
    let arrs = this.data.checks;
    if (arrs[index].checked == false) {
      arrs[index].checked = true;
    } else {
      arrs[index].checked = false;
    }
    this.setData({
      checks: arrs
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var time = options.time;
    console.log("预约界面的time:"+time)
    if (time != undefined && time !='undefined') {
      this.setData({
        time: time
      })
    } else {
      this.setData({
        time: 'null'
      })
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
    var today = GetDatem(0) ;
    var tomorrow = GetDatem(1);


    console.log("today:" + today)
    console.log("tomorrow:" + tomorrow)
    //还可以预约几个
    var orders = getApp().order.order;
   // console.log("orders: "+orders.length)
   // console.log(4-orders.length)
    //var remain = 4 - orders.length;

    this.setData({
      today: today,
      tomorrow: tomorrow,
      remain: 4 - orders.length,
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