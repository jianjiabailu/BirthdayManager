// miniprogram/pages/detail/detail.js

const api = require('../../unitl/lunar.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 路由传参
    id: '',
    identity: '',
    // 用户详情信息
    detailInfo: {},
    lunar: true,
    databases: {
      'friend': 'friends_list',
      'mine': 'user_list'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.params){
      this.setData(JSON.parse(options.params))
      if(this.data.identity == 'mine'){
        wx.setNavigationBarTitle({
          title: '信息详情',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getStorage({
      key: 'updateInfo',
      success: function (res) {
        that.updateInfo(res.data)
        wx.removeStorageSync('updateInfo')
      }
    })

    this.getAvatar()
   
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

  },

  // 获取详情信息
  getDetail: function () {
    let that = this;
    let dbs = this.data.databases;
    let key = this.data.identity;
    wx.showLoading({ title: '正在加载' })
    // 调用云函数获取数据
    wx.cloud.callFunction({
      name: dbs[key],
      data: {
        action: 'getDetail',
        id: that.data.id
      },
      success: res => {
        wx.hideLoading()
        console.log('getDetail', res)
        let origin = res.result.data[0];
        let detailInfo = that.dataTransform(origin)
        // 处理后的数据
        that.setData({ detailInfo })
      }, fail: err => {
        wx.hideLoading();
        console.error('[云函数]调用失败', err)
      }
    })
  },

  // 源数据处理
  dataTransform: function (data) {
    // 获取当前时间
    let today = new Date()
    // 当前年份
    let year = today.getFullYear()
    // 源数据
    let origin = data;
    // 获取今天的年月日（公历）
    let todayArr = [year, today.getMonth() + 1, today.getDate()];
    // 字符串转数组格式
    let birthdate = (origin.birthdate).split("-");
    let birthdate_next = (origin.birthdate).split("-");
    // 农历转公历
    let solar = api.toSolar(birthdate[0], birthdate[1], birthdate[2])
    // 定义相差天数的参数：days
    let days = 0;
    if (solar[1] == todayArr[1] && solar[2] == todayArr[2]) {
      days = 0;
    } else if (solar[1] * 1 > birthdate[1] || solar[1] * 1 === birthdate[1] && solar[2] * 1 < birthdate[2]) {
      // 设置下一次生日日期并格式化
      birthdate_next = [year, solar[1], solar[2]];
      // 计算天数差
      days = api.dateDiff(birthdate_next.join('-'), todayArr.join('-'));
    } else {
      birthdate_next = [year + 1, solar[1], solar[2]];
      days = api.dateDiff(birthdate_next.join('-'), todayArr.join('-'));
    }
    // 农历生日
    origin.birthdate = birthdate;
    // 下一次生日
    origin.next_birth = birthdate_next;
    // 下一次公历生日
    let birth_solar = api.toSolar(birthdate_next[0], birthdate_next[1], birthdate_next[2]);
    origin.next_birth_solar = birth_solar[0] + '年' + birth_solar[1] + '月' + birth_solar[2] + '日'
    // 距离下一次生日的天数
    origin.days = days;
    // 年龄
    origin.age = year - birthdate[0];
    // 中文生日
    origin.birthday = api.chineseMonth(birthdate[1]) + api.chineseDay(birthdate[2]);
    // 星座
    origin.zodiac_en = api.zodiac_sign(solar[1], solar[2])
    // 生肖
    origin.zodiac_cn = api.zodiacYear(birthdate[0])

    return origin
  },

  // 阴阳历显示
  lunisolar: function(){
    let lunar = this.data.lunar;
    if (lunar){
      this.setData({ lunar: false })
    }else{
      this.setData({ lunar: true })
    }
  },

  // 删除好友
  deleteInfo: function(){
    let that = this;
    let dbs = this.data.databases;
    let key = this.data.identity;
    wx.showModal({
      title: '提示',
      content: '真的要删除好友吗？',
      success: function (res) {
        if (res.confirm){
          console.log('正在删除')
          // 调用云函数获取数据
          wx.cloud.callFunction({
            name: dbs[key],
            data: {
              action: 'deleteInfo',
              id: that.data.id
            },
            success: res => {
              console.log('deleteInfo', res)
              wx.setStorageSync('update', true)
              wx.navigateBack({delta: 1})
            }, fail: err => {
              console.error('[云函数]调用失败', err)
            }
          })
        }
      }
    })
  },

  // 修改好友信息
  alterInfo: function(e){
    let friendInfo = this.data.detailInfo;
    let params = {
      id: this.data.id,
      key: e.currentTarget.dataset.key,
      val: friendInfo[e.currentTarget.dataset.key]
    }
    wx.navigateTo({
      url: '../../pages/alter/alter?params=' + JSON.stringify(params)
    })
  },

  // 更新信息
  updateInfo: function (dataJson){
    let that = this;
    let dbs = this.data.databases;
    let key = this.data.identity;
    // 调用云函数获取数据
    wx.cloud.callFunction({
      name: dbs[key],
      data: {
        action: 'updateInfo',
        id: that.data.id,
        dataJson: dataJson
      },
      success: res => {
        console.log('updateInfo', res)
        wx.setStorageSync('update', true)
        // 刷新页面数据
        that.onReady()
      }, fail: err => {
        console.error('[云函数]调用失败', err)
      }
    })
  },

  // 选择用户头像
  selectAvatar() {
    wx.navigateTo({ url: '../selectAvatar/selectAvatar' })
  },
  // 获取用户头像
  getAvatar: function () {
    let that = this;
    wx.getStorage({
      key: 'user_avatar',
      success: function (res) {
        let avatar = res.data;
        wx.removeStorageSync('user_avatar')
        let data = { avatarUrl: avatar }
        that.updateInfo(data)
      }
    })
  },
})