// components/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题
    title: String,
    // 初始状态
    hide: Boolean,
    // 是否可展开收起
    extensible: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    status: false,
    icon: 'icon_down.png'
  },
  ready: function () {
    this.setData({
      status: this.data.hide
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 改变状态
    changeStatus: function () {
      let status = this.data.status;
      status = !status;
      this.setData({
        status,
        icon: status ? 'icon_up.png': 'icon_down.png'
      })
    },
  }
})
