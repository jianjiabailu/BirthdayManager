// miniprogram/pages/alter/alter.js
const api = require('../../unitl/lunar.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 路由传参
    id: '',
    key: '',
    val: '',
    
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
    if (options.params){
      this.setData(JSON.parse(options.params))
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.key == 'birthdate'){
      let birthdate = this.data.val;
      let lunar_date = this.resetDate(birthdate[0], birthdate[1], birthdate[2])
      let multiArray = lunar_date.lunar;
      let multiArray_cn = lunar_date.lunar_cn;
      let birthdate_cn = birthdate[0] + '年' + api.chineseMonth(birthdate[1]) + api.chineseDay(birthdate[2]);
      // 定位初始下标
      let multiIndex = [];
      multiIndex[0] = multiArray[0].indexOf(birthdate[0] * 1);
      multiIndex[1] = multiArray[1].indexOf(birthdate[1] * 1);
      multiIndex[2] = multiArray[1].indexOf(birthdate[2] * 1);
      this.setData({ 
        multiIndex, 
        multiArray, 
        multiArray_cn, 
        birthdate_cn, 
        val: birthdate.join('-') 
      })
    }
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

  },

  // 切换性别
  switchGender: function(e){
    this.setData({val: e.detail.value ? 0 : 1})
  },


  // 获取输入值
  setValue: function(e){
    this.setData({val: e.detail.value})
  },
  
  // 修改资料
  alter: function(){
    let params = {};
    let key = this.data.key;
    params[key] = this.data.val;
    wx.setStorage({
      key: 'updateInfo',
      data: params,
      success: wx.navigateBack({delta: 1})
    })
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
    let multiIndex = this.data.multiIndex;
    let multiArray = this.data.multiArray;
    let multiArray_cn = this.data.multiArray_cn;
    multiIndex[column] = e.detail.value;
    let val = multiArray[0][multiIndex[0]] + '-' + multiArray[1][multiIndex[1]] + '-' + multiArray[2][multiIndex[2]];
    let birthdate_cn = multiArray[0][multiIndex[0]] + '年' + multiArray_cn[1][multiIndex[1]] + multiArray_cn[2][multiIndex[2]];
    this.setData({ val, birthdate_cn })
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