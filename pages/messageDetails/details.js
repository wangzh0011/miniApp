// pages/messageDetails/details.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data1: '',
    data2: '',
    data3: '',
    data4: '',
    data5: '',
    title1: '',
    title2: '',
    title3: '',
    title4: '',
    title5: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var type = options.type;
    this.getOrder(id,type);
  },
  
  /**
   * 获取预约结果详情
   */
  getOrder: function (id,type) {
    var that = this;
    wx.request({
      url: app.data.servsers + 'getDetails',
      data: {
        id: id,
        type: type
      },
      success: function (res) {
        var data = res.data.data;
        console.log(data)
        if(type == 'appointment') {
          that.setData({
            title1: '预约结果',
            title2: '预约地点',
            title3: '预约时段',
            title4: '车牌号码',
            title5: '备注',
            data1: data.state == '2' ? '通过' : '不通过',
            data2: data.site == 'D' ? '内贸堆场' : '外贸堆场',
            data3: data.appointmentTime,
            data4: data.plate,
            data5: data.remark
          })
        } else if (type == 'suggest') {
          that.setData({
            title1: '反馈内容',
            title2: '提交时间',
            title3: '回复内容',
            title4: '处理时间',
            data1: data.suggest,
            data2: data.createTime,
            data3: data.remark,
            data4: data.handleTime,
          })
        } else if (type == 'yardplan') {
          that.setData({
            title1: '车牌号码',
            title2: '堆场位置',
            title3: '机械问题',
            title4: '处理时间',
            title5: '备注',
            data1: data.plate,
            data2: data.location,
            data3: data.issueType,
            data4: data.handleTime,
            data5: data.remark
          })
        } 
      }
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