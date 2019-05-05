//app.js
var util = require('./utils/WSCoordinate.js') //坐标转换
var that;
App({
  globalData: {
    collection: '',
    playlist:'',
    orders: [{
      id: 1,
      orderid:"abc",
      createtime: "2019-04-25",
      updatetime: "2019-04-25",
      startTransportTime: "2019-04-25",
      endTransportTime: "2019-04-26",
      receiver: "李艺",
      remark: "备注",
      seller: "李艺",
      carNum: "67828",
      totalDistance: 111,
      totalTon: 1111,
      tradeStatus: 201
    },
    {
      id: 1,
      orderid: "abcd",
      createtime: "2019-04-01",
      updatetime: "2019-04-30",
      startTransportTime: "2019-04-01",
      endTransportTime: "2019-04-30",
      receiver: "李艺",
      remark: "备注",
      seller: "李艺",
      carNum: "67828,68008",
      totalDistance: 111,
      totalTon: 1111,
      tradeStatus: 202
    },
    {
      id: 1,
      orderid: "asd",
      createtime: "2019-04-01",
      updatetime: "2019-04-30",
      startTransportTime: "2019-04-01",
      endTransportTime: "2019-04-30",
      receiver: "李艺",
      remark: "备注",
      seller: "李艺",
      carNum:"68007",
      totalDistance: 111,
      totalTon: 1111,
      tradeStatus: 201
    },
    {
      id: 1,
      orderid: "liyi",
      createtime: "2019-04-01",
      updatetime: "2019-04-30",
      startTransportTime: "2019-04-01",
      endTransportTime: "2019-04-30",
      receiver: "李艺",
      remark: "备注",
      seller: "李艺",
      carNum: "68007",
      totalDistance: 111,
      totalTon: 1111,
      tradeStatus: 202
    },
    {
      id: 1,
      orderid: "asdadasdads",
      createtime: "2019-04-01",
      updatetime: "2019-04-30",
      startTransportTime: "2019-04-01",
      endTransportTime: "2019-04-30",
      receiver: "李艺",
      remark: "备注",
      seller: "李艺",
      carNum: "68007",
      totalDistance: 111,
      totalTon: 1111,
      tradeStatus: 200
    },
    {
      id: 1,
      orderid: "asdadasd",
      createtime: "2019-04-01",
      updatetime: "2019-04-30",
      startTransportTime: "2019-04-01",
      endTransportTime: "2019-04-30",
      receiver: "李艺",
      remark: "备注",
      seller: "李艺",
      carNum: "68007",
      totalDistance: 111,
      totalTon: 1111,
      tradeStatus: 200
    }
    ],

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
        console.log(res)
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