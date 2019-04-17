//logs.js
const util = require('../../utils/util.js')//引用

Page({
  data: {
    logs: []//数据
  },
  onLoad: function () {//初始化方法
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
