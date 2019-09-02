// miniprogram/pages/register/register.js
// 此页面功能：
// 1.新用户注册
// 2.添加好友信息
// 3.当功能为添加好友时，可分享给微信好友，由好友本人填写信息



const api = require('../../unitl/lunar.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 有效参数：'register','newFriend'
    action: 'newFriend',
    // 表单信息
    userInfo: {
      name: '',
      gender: 1,
      phone: '',
      birthdate: ''
    },
    // 用户头像
    avatar: {},
    // 默认选择城市
    region: ['广东省', '深圳市', '福田区'],
    // 农历生日列表
    multiArray: [],
    // 农历生日列表（中文格式）
    multiArray_cn: [],
    // 生日默认选择日期（对应列表下标）
    multiIndex: [0, 2, 0],
    // 中文生日
    birthdate_cn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.action == 'register') {
      let title = '新用户入驻';
      this.setData({ action: 'register' })
      wx.setNavigationBarTitle({ title })
    } else if (options.action == 'newFriend') {
      let title = '添加好友';
      this.setData({ action: 'newFriend' })
      wx.setNavigationBarTitle({ title })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let multiIndex = this.data.multiIndex;
    let userInfo = this.data.userInfo;
    let cy = 1949;
    let cm = multiIndex[1];
    let lunar_date = this.resetDate(cy, cm);
    let multiArray = lunar_date.lunar;
    let multiArray_cn = lunar_date.lunar_cn;
    userInfo.birthdate = cy + '-' + (cm + 1) + '-' + multiArray[2][multiIndex[2]];
    let birthdate_cn = multiArray_cn[0][multiIndex[0]] + multiArray_cn[1][multiIndex[1]] + multiArray_cn[2][multiIndex[2]];
    this.setData({ multiArray, multiArray_cn, userInfo, birthdate_cn })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getFriendAvatar()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '您的好友邀请你填写生日信息'
    }
  },

  // 输入姓名
  setName: function (e) {
    let userInfo = this.data.userInfo;
    userInfo.name = e.detail.value;
    this.setData({ userInfo })
  },
  // 选择性别
  setSex: function (e) {
    let userInfo = this.data.userInfo;
    userInfo.gender = e.detail.value;
    this.setData({ userInfo })
  },
  // 输入手机号
  setPhone: function (e) {
    let userInfo = this.data.userInfo;
    userInfo.phone = e.detail.value;
    this.setData({ userInfo })
  },
  // 输入个性签名
  setSign: function (e) {
    let userInfo = this.data.userInfo;
    userInfo.signature = e.detail.value;
    this.setData({ userInfo })
  },
  // 选择家乡
  bindNative: function(e){
    let userInfo = this.data.userInfo;
    userInfo.native = e.detail.value;
    this.setData({ userInfo })
  },
  // 输入现居地
  setAddress: function(e){
    let userInfo = this.data.userInfo;
    userInfo.address = e.detail.value;
    this.setData({ userInfo })
  },
  // 输入感情状况
  setEmotion: function (e) {
    let userInfo = this.data.userInfo;
    userInfo.emotion = e.detail.value;
    this.setData({ userInfo })
  },
  // 选择日期
  selectBirthdate: function (e) {
    let column = e.detail.column;
    let multiIndex = this.data.multiIndex;
    let multiArray = this.data.multiArray;
    multiIndex[column] = e.detail.value;
    this.setData({ multiIndex })
    if (column < 2) {
      let cy = multiArray[0][multiIndex[0]];
      let cm = multiArray[1][multiIndex[1]];
      let lunar_date = this.resetDate(cy, cm);
      let new_multiArray = lunar_date.lunar;
      let new_multiArray_cn = lunar_date.lunar_cn;
      this.setData({
        multiArray: new_multiArray,
        multiArray_cn: new_multiArray_cn
      })
    }
  },
  // 设置生日
  setBirthdate: function (e) {
    let column = e.detail.column;
    let userInfo = this.data.userInfo;
    let multiIndex = this.data.multiIndex;
    let multiArray = this.data.multiArray;
    let multiArray_cn = this.data.multiArray_cn;
    multiIndex[column] = e.detail.value;
    userInfo.birthdate = multiArray[0][multiIndex[0]] + '-' + multiArray[1][multiIndex[1]] + '-' + multiArray[2][multiIndex[2]];
    let birthdate_cn = multiArray_cn[0][multiIndex[0]] + multiArray_cn[1][multiIndex[1]] + multiArray_cn[2][multiIndex[2]];
    this.setData({ userInfo, birthdate_cn })
    console.log('当前选择日期:', userInfo.birthdate)
  },
  // 输入你们的关系
  setRelation: function (e) {
    let userInfo = this.data.userInfo;
    userInfo.relation = e.detail.value;
    this.setData({ userInfo })
  },
  // 选择用户头像
  selectAvatar() {
    wx.navigateTo({ url: '../selectAvatar/selectAvatar' })
  },
  // 获取用户头像
  getFriendAvatar: function () {
    let that = this;
    wx.getStorage({
      key: 'user_avatar',
      success: function (res) {
        let userInfo = that.data.userInfo;
        userInfo.avatarUrl = res.data;
        that.setData({ userInfo })
        wx.removeStorageSync('user_avatar')
      }
    })
  },

  // 提交保存
  submit() {
    let that = this;
    let action = this.data.action;
    if (this.isCompletely()){
      if (action == 'newFriend') {
        // 添加好友
        that.createFriend()
      } else if (action == 'register') {
        // 新用户注册
        that.register()
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '请完善信息',
        showCancel: false,
        confirmText: '好的'
      })
    }
  },

  // 上传图片
  uploadFile: function (filePath) {
    return new Promise((resolve, reject) => {
      // 将图片上传至云存储空间
      wx.cloud.uploadFile({
        // 指定上传到的云路径和文件名
        cloudPath: 'userAvatar/' + (new Date()).valueOf() + '.png',
        // 指定要上传的文件的小程序临时文件路径
        filePath: filePath,
        // 成功回调
        success: res => {
          console.log('上传成功', res)
          // 保存头像的云空间地址
          userInfo.avatarUrl = res.fileID;
          that.setData({ userInfo })
          // 异步回调
          resolve()
        }
      })
    });
  },

  // 检查用户信息是否完善
  isCompletely: function(type){
    let userInfo = this.data.userInfo;
    if (userInfo.name && userInfo.gender && userInfo.birthdate){
      return true
    }else{
      return false
    }
  },

  // 添加好友
  createFriend: function () {
    let userInfo = this.data.userInfo;
    // 调用云函数,添加数据
    wx.cloud.callFunction({
      name: 'friends_list',
      data: {
        action: 'createInfo',
        friendInfo: {
          name: userInfo.name,
          gender: userInfo.gender,
          phone: userInfo.phone,
          birthdate: userInfo.birthdate,
          avatarUrl: userInfo.avatarUrl,
          relation: userInfo.relation,
          openid: wx.getStorageSync('openid')
        }
      },
      success: res => {
        console.log('createInfo', res)
        wx.showToast({
          title: '添加成功',
          mask: true,
          success: function (res) {
            wx.setStorageSync('update', true)
            wx.navigateBack({ delta: 1 })
          }
        })
      },
      fail: err => console.error('[云函数]调用失败', err)
    })
  },

  // 新用户注册
  register: function(){
    let userInfo = this.data.userInfo;
    userInfo.openid = wx.getStorageSync('openid');
    console.log(userInfo)
    // 调用云函数,添加数据
    wx.cloud.callFunction({
      name: 'user_list',
      data: {
        action: 'createInfo',
        dataJson: userInfo
      },
      success: res => {
        console.log('createInfo', res)
        wx.showToast({
          title: '注册成功',
          mask: true,
          success: function (res) {
            wx.switchTab({url: '../../pages/mine/mine'})
          }
        })
      },
      fail: err => console.error('[云函数]调用失败', err)
    })
  },

  // 更新农历日期列表
  // cy表示当前选择的年份
  // cm表示当前选择的月份
  resetDate: function (cy, cm) {
    // 年份数组
    let years = [], years_cn = [];
    // 月份数组
    let months = [], months_cn = [];
    // 日数数组
    let days = [], days_cn = [];
    // 收集1949年到2100年的所有年份
    for (let y = 1949; y < 2100; y++) {
      years.push(y)
      // 判断是否闰年
      let leapYear = api.isLeapYear(y)
      // 查询天干地支年
      let lunarYear = api.lunarYear(y)
      years_cn.push(api.chineseYear(y))
      // 查询生肖年
      let zodiacYear = api.zodiacYear(y)
      // 查询闰月
      let leapMonth = api.leapMonth(y)
      // 查询每月的天数
      let lunarMonths = api.lunarMonths(y);
      // 获取当前年份的每一个月
      if (y == cy) {
        for (let m = 0; m < lunarMonths.length; m++) {
          // 闰月的处理
          if ((m + 1) > leapMonth) {
            months.push(m)
            let cn = m == leapMonth ? '闰' + api.chineseMonth(m) : api.chineseMonth(m);
            months_cn.push(cn)
          } else {
            months.push(m + 1)
            months_cn.push(api.chineseMonth(m + 1))
          }
          // 获取当前月份的每一天
          if (m == cm) {
            for (let d = 0; d < lunarMonths[m]; d++) {
              days.push(d + 1)
              days_cn.push(api.chineseDay(d + 1))
            }
          }
        }
        // 结束循环
      }
    }
    return {
      lunar: [years, months, days],
      lunar_cn: [years_cn, months_cn, days_cn]
    }
  }
})