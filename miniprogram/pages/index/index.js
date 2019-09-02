//index.js
const app = getApp()
const api = require('../../unitl/lunar.js')

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    male: '../../images/male.png',
    female: '../../images/female.png',
    friends: []
  },

  onLoad: function() {
    this.getFriends()
  },
  onShow: function() {
    let that = this;
    wx.getStorage({
      key: 'update',
      success: function (res) {
        that.getFriends();
        wx.removeStorageSync('update')
      }
    })
  },

  // 获取好友列表
  getFriends: function(){
    let that = this;
    if (wx.cloud){
      wx.showLoading({
        title: '正在加载',
      })
      // 调用云函数获取数据
      wx.cloud.callFunction({
        name: 'friends_list',
        data: {
          action: 'getList',
          openid: wx.getStorageSync('openid')
        },
        success: res => {
          wx.hideLoading()
          console.log('getList', res)
          let relations = res.result.data;
          let transform = that.dataTransform(relations)
          that.setData({
            friendsList: transform, // 处理后的数据
            origin: relations   // 原始数据
          })
        }, fail: err => {
          wx.hideLoading(); 
          console.error('[云函数]调用失败', err)
        }
      })
    }else{
      console.log('error')
    }
    
  },

  // 源数据处理
  dataTransform: function(origin_data){
    // 获取当前日期
    let today = new Date()
    let year = today.getFullYear()
    // 格式化今天的日期
    let todayStr = [year, today.getMonth() + 1, today.getDate()].join('-');
    for (let item of origin_data) {
      let date = item.birthdate.split("-")
      let dd = api.toSolar(date[0] * 1, date[1] * 1, date[2] * 1)
      let days, birthdate;
      if (dd[1] === today.getMonth() + 1 && dd[2] == today.getDate()) {
        days = 0;
      } else if (dd[1] > today.getMonth() + 1 || dd[1] === today.getMonth() + 1 && dd[2] < today.getDate()) {
        // 设置下一次生日日期并格式化
        birthdate = [year, dd[1], dd[2]].join('-');
        // 计算天数差
        days = api.dateDiff(birthdate, todayStr);
      } else {
        birthdate = [year + 1, dd[1], dd[2]].join('-');
        days = api.dateDiff(birthdate, todayStr);
      }
      item.days = days;
      item.age = year - dd[0];
      item.birthday = api.chineseMonth(date[1]) + api.chineseDay(date[2]);
    }
    return origin_data
  },

  // 查看详情
  detail: function (e){
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../../pages/detail/detail?params=' + JSON.stringify({
        id: item._id,
        identity: 'friend'
      })
    })
  },

  // 添加好友
  create: function(){
    wx.navigateTo({
      url: '../../pages/register/register?action=newFriend'
    })
  },

  // 姓名快速查找
  quickSearch: function(e){
    let value = (e.detail.value).replace(/\s*/g, "");
    let origin = this.data.origin;
    let box = []
    for(let item of origin){
      if (item.name.indexOf(value) >= 0){
        box.push(item)
      }
    }
    if (box.length > 0){
      let transform = this.dataTransform(box)
      // 处理后的数据
      this.setData({friendsList: transform})
    }
  }

})
