//app.js
var util = require('./utils/WSCoordinate.js') //坐标转换
var that;
App({
  globalData: {
    collection: '',
    playlist:''
  },
  onLaunch: function () {
    that=this;
  },
 
getData: function (begin, end, carNum) {
  return new Promise(function (resolve, reject) {
    //从后台拉取数据
    wx.request({
      url: 'http://chatbylee.iask.in/collectionData/listByTimeAndCarNum',
      data: {
        begin: begin,
        end: end,
        carNum: carNum
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.code==0){
          that.globalData.collection = res.data.data;
          console.log(res.data.data)
          that.globalData.playlist = that.getPlayList();
          resolve(res.data.data);
        }else{
          alert("加载数据失败");
        }
       
      }
    })
  })
},

getPlayList: function () {
    var playlist=[];
    var collection = that.globalData.collection;
    for (var i = 0; i < collection.length; i++) {
      var point = util.transformFromWGSToGCJ(collection[i].lat, collection[i].lng)//坐标系转换
      playlist.push(point);
    }
    return playlist;
  },  
})