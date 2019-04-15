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

var title = '压缩中，请稍候';

Page({


  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    checkday: '',
    checktime: '',
    site: 'null',
    item: [{
      workType: '',
      eir_img: [],
      seal_img: [],
      attach_img: [],
     
    }],

    items: [{
        workType: '',
        eir_img: [],
        seal_img: [],
        attach_img: [],
      },
    ],

    type_D: 0, //提作业的数量
    type_R: 0, //交作业的数量

    checked: false,
    tranTypeChecked: false,

    eirImg: '',
    sealImg: '',
    sealImg1: '',
    attachImg: '',
    attachImg1: '',

    files: '',

    // eirImgFail: true,
    // sealImgFail: true,
    // sealImg1Fail: true,
    // attachImgFail: true,
    // attachImg1Fail: true


  },

  chooseSite: function(e) {
    
    var that = this;
    this.setData({
      site: e.detail.value,
      tranTypeChecked: false
    })

    wx.request({
      url: getApp().data.servsers + 'checkSite',
      data: {
        site: e.detail.value
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  checked: false
                })
              }
            }
          })
        }
      }
    })

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
    var that = this;
    var site = this.data.site;
    if (site == 'null') {
      wx.showModal({
        title: '提示',
        content: '请先选择作业地点内贸或者外贸!',
        showCancel: false,
      })
      this.setData({
        disabled: false,
        tranTypeChecked: false
      });
      return;
    }
    wx.request({
      url: getApp().data.servsers + 'checkTranType',
      data: {
        site: site,
        tranType: e.detail.value
      },
      success: function (res) {
        if (res.data.code != 0) {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  tranTypeChecked: false
                })
              }
            }
          })
        }
      }
    })

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

    var list = getApp().order.order;

    for (var i in list) {


      if ((list[i].order.tranType == 'DE' || list[i].order.tranType == 'DF') && list[i].order.state != '3') {

        type_D = type_D + 1;
      }
      if ((list[i].order.tranType == 'RE' || list[i].order.tranType == 'RF') && list[i].order.state != '3') {

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
    var site = this.data.site;
    var that = this;
    that.setData({
      disabled: true
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
    if (site == 'null') {


      wx.showModal({
        title: '提示',
        content: '请先选择作业地点内贸或者外贸!',
        showCancel: false,

      })
      that.setData({
        disabled: false
      });

      return;

    }

    if (items.length == 0) {
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

    
    for (var i in items) {
      var count = 0; //计算总共有几张照片
      var item = items[i];

      if (item.eir_img.length != 0) {
        count = count + 1;
      }
      if (item.seal_img.length != 0) {
        count = count + item.seal_img.length;
      }
      if (item.attach_img.length != 0) {
        count = count + item.attach_img.length;
      }
      console.log("count" + count)
      item.count = count;
      if (item.workType == '') {
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

      if (item.seal_img.length == 0 && item.workType == 'RF') {
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
    var expireTime;
    console.log("time：" + time)
    if (time == 'null') {
      console.log("比较时间执行了!")
      appointmentTime = this.data.checkday + ' ' + this.data.checktime;
      expireTime = this.data.checkday + ' ' + this.data.expireTime;

      console.log(appointmentTime)
      console.log(expireTime)

      console.log("比较结果")

      console.log(new Date() > new Date(Date.parse(expireTime.replace(/\-/g, '/'))));
      if (new Date() > new Date(Date.parse(expireTime.replace(/\-/g, '/')))) {
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

    } else {
      //console.log("time.split:"+time.split("-")[3])
      appointmentTime = time;
      expireTime = time.split(" ")[0] + " " + time.split(" ")[1].split("-")[1];

    }

    wx.setStorageSync("flush", true) //首页刷新


    


    var openId = wx.getStorageSync("userinfo").openid;
    var phone = wx.getStorageSync("userinfo").phone;
    var plate = wx.getStorageSync("userinfo").plate;
    var userName = wx.getStorageSync("userinfo").userName;
    var site = that.data.site;

//提交预约数据
    for (var i in items) {
      var item = items[i];
      var num = i-1+2;
      console.log("sealImg------" + item.sealImg + "    " + item.sealImg1)
      if(that.data.eirImgFail == true){
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的单证照片未上传成功，请选择照片重新上传",
          success: function (res) {
          }
        })
        return;
      }
      if (that.data.sealImgFail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的封条照片未上传成功，请选择照片重新上传",
          success: function (res) {

          }
        })
        return;
      }
      if (that.data.sealImg1Fail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的封条照片未上传成功，请选择照片重新上传",
          success: function (res) {

          }
        })
        return;
      }
      if (that.data.attachImgFail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的附属证明照片未上传成功，请选择照片重新上传",
          success: function (res) {

          }
        })
        return;
      }
      if (that.data.attachImg1Fail == true) {
        wx.hideLoading();
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '飞单业务' + num + "的附属证明照片未上传成功，请选择照片重新上传",
          success: function (res) {

          }
        })
        return;
      }
      wx.request({
        url: getApp().data.servsers + 'addOrder',
        data: {
          openId: openId,
          phone: phone,
          plate: plate,
          userName: userName,
          operator: userName,
          appointmentTime: appointmentTime,
          tranType: items[i].workType,
          expireTime: expireTime,
          site: site,
          tranCount: that.data.type_R + ' 交' + that.data.type_D + ' 提',
          eirImg: item.eirImg,
          sealImg: item.sealImg == undefined ? '' : item.sealImg,
          sealImg1: item.sealImg1 == undefined ? '' : item.sealImg1,
          attachImg: item.attachImg == undefined ? '' : item.attachImg,
          attachImg1: item.attachImg1 == undefined ? '' : item.attachImg1,
          index: i, //标识数组下标
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '码头将于15分钟内通过微信推送预约结果，请在审核通过后再进闸作业.',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                  url: '../listEir/Eir',
                })
              }
            }
          })
        },
        fail: function () {
          console.log("addOrder fail.")
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '网络环境不佳，请确认网络连接正常并重新预约！',
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({
                 // url: '../listEir/Eir',
                })
              }
            }
          })
        },
        complete: function () {
          wx.hideLoading();
          that.setData({
            disabled: false
          });
        }
      })

    }





  },




  addBusines: function(e) {
    //var item = { 'workType': '', 'eir_img': '', 'seal_img': '', 'attacht_img': '' };
    var item = this.data.item;
    var items = this.data.items;
    var remain = this.data.remain - 1;

    //判断是否小于或者等于4

    //不参与计数的条数
    // var count = 0;
    // for (var i in items) {
    //   if (items[i].state == '3') {
    //     count = count + 1;
    //   }
    // }


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
    // that.setData({
    //   eirImgFail: true
    // })
    var items = that.data.items;
    console.log(index)
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有 compressed 是压缩图  original 是原图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: title,
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: res.tempFilePaths,
        });
        var filename = res.tempFilePaths;
        var file = res.tempFiles;
        wx.uploadFile({
          url: getApp().data.servsers + 'saveImage',
          filePath: filename[0],
          name: 'image',
          success: function (res1) {
            console.log(res1)
            var jsondata = JSON.parse(res1.data);
            var eirImg = jsondata.data.filename;
            if (eirImg == undefined){
              wx.hideLoading();
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '此照片未成功上传，请重新选择照片上传！',
                success: function (res) {
                  items[index].eir_img = '',
                    that.setData({
                      items: items,
                      eirImgFail: true
                    });
                }
              })
            }else{
              wx.hideLoading()
              console.log("上传成功并保存到了服务器")
              items[index].eirImg = eirImg;
              items[index].eir_img = filename,
              that.setData({
                items: items,
                eirImgFail: false
              })
            }
          },
          fail: function (res1) {
            console.log("上传文件连接服务器失败:")
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
              success: function (res) {
                items[index].eir_img = '',
                that.setData({
                  items: items,
                  eirImgFail: true
                });
              }
            })
          },
          complete: function (res) {
            console.log("结束上传")
            console.log(res)
          }

        })
      }
    })
  },
  chooseSealImage: function(e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    // that.setData({
    //   sealImgFail: true,
    //   sealImg1Fail: true
    // })
    var items = this.data.items;
    wx.chooseImage({
      count: 2,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: title,
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: res.tempFilePaths,
          });

        var filename = res.tempFilePaths;
        console.log("filename0----"+filename[0])
        console.log("filename1----" + filename[1])
        if(filename[0] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[0],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var sealImg = jsondata.data.filename;
              if(sealImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].seal_img = '',
                      that.setData({
                        items: items,
                        sealImgFail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].sealImg = sealImg;
                items[index].seal_img[0] = filename[0],
                that.setData({
                  items: items,
                  sealImgFail: false
                })
              }
              //console.log("upload:sealImg------" + items[0].sealImg + "    " + items[0].sealImg1)
            },
            fail: function (res1) {
              console.log("上传文件连接服务器失败:")
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].seal_img = '',
                    that.setData({
                      items: items,
                      sealImgFail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     sealImgFail: false
        //   })
        // }

        if(filename[1] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[1],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var sealImg = jsondata.data.filename;
              if(sealImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].seal_img = '',
                      that.setData({
                        items: items,
                        sealImg1Fail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].sealImg1 = sealImg;
                items[index].seal_img[1] = filename[1],
                that.setData({
                  items: items,
                  sealImg1Fail: false
                })
              }
              //console.log("upload:sealImg------" + items[0].sealImg + "    " + items[0].sealImg1)
            },
            fail: function (res1) {
              console.log("上传文件连接服务器失败:")
              wx.hideLoading()
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].seal_img = '',
                    that.setData({
                      items: items,
                      sealImg1Fail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     sealImg1Fail: false
        //   })
        // }

      }
    })
  },
  chooseAttachlImage: function(e) {
    var index = e.currentTarget.dataset.index
    var that = this;
    // that.setData({
    //   attachImgFail: true,
    //   attachImg1Fail: true
    // })
    var items = this.data.items;
    wx.chooseImage({
      count: 2,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        wx.showLoading({
          title: title,
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            files: res.tempFilePaths,
          });

        var filename = res.tempFilePaths;

        if(filename[0] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[0],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var attachImg = jsondata.data.filename;
              if(attachImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].attach_img = '',
                      that.setData({
                        items: items,
                        attachImgFail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].attachImg = attachImg;
                items[index].attach_img[0] = filename[0];
                that.setData({
                  items: items,
                  attachImgFail: false
                })
              }
            },
            fail: function (res1) {
              wx.hideLoading()
              console.log("上传文件连接服务器失败:")
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].attach_img = '',
                    that.setData({
                      items: items,
                      attachImgFail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     attachImgFail: false
        //   })
        // }

        if(filename[1] != undefined){
          wx.uploadFile({
            url: getApp().data.servsers + 'saveImage',
            filePath: filename[1],
            name: 'image',
            success: function (res1) {
              console.log("上传成功并保存到了服务器")
              console.log(res1)
              var jsondata = JSON.parse(res1.data);
              var attachImg = jsondata.data.filename;
              if(attachImg == undefined){
                wx.hideLoading()
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: '此照片未成功上传，请重新选择照片上传！',
                  success: function (res) {
                    items[index].attach_img = '',
                      that.setData({
                        items: items,
                        attachImg1Fail: true
                      });
                  }
                })
              }else{
                wx.hideLoading()
                items[index].attachImg1 = attachImg;
                items[index].attach_img[1] = filename[1];
                that.setData({
                  items: items,
                  attachImg1Fail: false
                })
              }
            },
            fail: function (res1) {
              wx.hideLoading()
              console.log("上传文件连接服务器失败:")
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: '网络环境不佳，照片未成功上传，请确认网络连接正常并重新预约！',
                success: function (res) {
                  items[index].attach_img = '',
                    that.setData({
                      items: items,
                      attachImg1Fail: true
                    });
                }
              })
            },
            complete: function (res) {
              console.log("结束上传")
              console.log(res)
            }

          })
        }
        // else{
        //   that.setData({
        //     attachImg1Fail: false
        //   })
        // }

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
    var site = options.site;
    console.log("预约界面的time:" + time)
    console.log("预约界面的site:" + site)
    if (time != undefined && time != 'undefined') {
      this.setData({
        time: time
      })
    } else {
      this.setData({
        time: 'null'
      })
    }
    if (site != undefined && site != 'undefined') {
      this.setData({
        site: site
      })
    } else {
      this.setData({
        site: 'null'
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
    var today = GetDatem(0);
    var tomorrow = GetDatem(1);


    console.log("today:" + today)
    console.log("tomorrow:" + tomorrow)
    //还可以预约几个
    var orders = getApp().order.order;
    // console.log("orders: "+orders.length)
    // console.log(4-orders.length)
    //var remain = 4 - orders.length;
    //不参与计数的条数
    var count = 0;
    for (var i in orders) {
      if (orders[i].order.state != '3') {
        count = count + 1;
      }
    }
    this.setData({
      today: today,
      tomorrow: tomorrow,
      remain: 4 - count,
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