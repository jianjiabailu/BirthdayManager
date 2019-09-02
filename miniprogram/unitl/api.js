
const lunar = require('./lunar.js')

module.exports = {
  // 下次生日日期，传参阴历生日的月和日
  nextBirthdate: function(y, m, d){
    // 获取当前时间
    let date = new Date()
    // 获取今天的年月日（公历）
    let today = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    // 获取今年的生日是阳历的哪一天
    let date1 = lunar.toSolar(today[0], m, d)
    // 获取明天的闰月是第几个月
    let leapMonth = lunar.leapMonth(today[0] + 1);
    // 获取明年的生日是阳历的哪一天
    let date2 = lunar.toSolar(today[0] + 1, leapMonth > m * 1 ? m : (m * 1 + 1), d)
    // 判断几今年的生日是否已经过去
    if ((new Date(date1.join('-'))).valueOf() > (new Date(today.join('-'))).valueOf()) {
      return {
        // 计算今天和今年生日相差的天数
        birthdate: date1, age: today[0] - y * 1,
        days: lunar.dateDiff(today.join('-'), date1.join('-'))
      }
    } else {
      return {
        // 计算今天和明年生日相差的天数
        birthdate: date2, age: today[0] - y * 1 + 1,
        days: lunar.dateDiff(today.join('-'), date2.join('-'))
      }
    }
  },
  // 阴历日历表，传参阴历的年份和月份
  setLunarCalendar : function (cy, cm) {
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
}