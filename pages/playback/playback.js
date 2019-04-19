//index.js
//获取应用实例
const app = getApp()
var that;
var playlist = []; //坐标列表
var collection=[];//总数据
var s = 1000; //默认速度
var speed = 1000;
var num = 0; //时间计数器
var t; //定时器
var isSlider;//是否进度条拉拽，true为是。false为否
Page({
  data: {
    map: {
      lat: "",
      lng: "",
      markers: [],
      polyline: [],
      isShow: false
    },
    img: {
      fronUrl: "",
      afterUrl: "",
      isShow: false
    },
    progress:{
      now:"",
      total:"",
      isPlay:false
    },
    picker:{
      index:0,
      array:[1,2,4,8,16]
    }
  },
  onLoad: function() {
    that = this;
    wx.setNavigationBarTitle({title:"轨迹回放"});
   
    that.initData();
    t = that.playHistory(num);
  },


  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  //开始
  startAnimation: function() {
    t = that.playHistory();
    that.setData({
      'progress.isPlay': true
    });

  },
  //暂停
  pauseAnimation: function () {
    clearInterval(t);
    that.setData({
      'progress.isPlay': false
    });
  },

  // //停止
  // stopAnimation: function() {
  //   clearInterval(t);
  //   num = 0;
  //   getPoint(num);
  //   that.setData({
  //     'progress.now': num,
  //     'progress.isPlay': false
  //   });
  // },

  //初始化数据
  initData() {
    collection = app.globalData.collection;
    playlist = app.globalData.playlist;
    that.getPoint(0);
    that.getPolyLine();
    that.setData({
      progress: {
        now: num,
        total: playlist.length
      }
    });
  },


  //画点
  getPoint(num) {
    //重置map
    // that.setData({'map.isShow': false})

    var lat = playlist[num].latitude;
    var lng = playlist[num].longitude;
    //设置小车方向
    var angle;
    if (num != playlist.length - 1) {
      angle = that.getRotation(playlist[num], playlist[num+1]);
    } else {
      angle = 0;
    }
    that.setData({
      'map.lat': lat,
      'map.lng': lng,
      'map.markers': [{
        iconPath: '/resources/red_90.gif',
        id: 0,
        latitude: lat,
        longitude: lng,
        width: 20,
        height: 20,
        rotate: angle,
        anchor:{x:.5,y:.5},
        callout: {
          content: that.getCallOutContent(),
          fontSize: 10,
          bgColor: "#FFF",
          borderWidth: 1,
          borderColor: "#CCC",
          padding: 4,
          display: "ALWAYS",
        
        }

      }],
      'map.isShow': true,
      'img.fronUrl': collection[num].fronUrl,
      'img.afterUrl': collection[num].afterUrl,
      'img.isShow': true
    });
  },
  //画线
  getPolyLine: function() {
    //重置map
    that.setData({
      'map.isShow': false
    });
    that.setData({
      'map.polyline': [{
        points: playlist,
        color: '#FF0000DD',
        width: 5,
        arrowLine: true
      }],
      'map.isShow': true
    });
  },

  //图片方向
  getRotation: function(p1, p2) {
    // debugger
    var px1 = p1.longitude;
    var py1 = p1.latitude;
    var px2 = p2.longitude;
    var py2 = p2.latitude;
    var x = px2 - px1;
    var y = py2 - py1;
    var long = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var cos = x / long;
    var rad = Math.acos(cos);
    var deg = 180 / (Math.PI / rad);
    if (y > 0) {
      deg = -deg;
    } else if ((y == 0) && (x < 0)) {
      deg = 180;
    }
    return deg;

  },

  getCallOutContent:function(){
    var trip = collection[num];
    var content ="";
    content += "接收时间:" + trip.gpstime + "\n";
    content += "速度:" + trip.speed + "km/h" + "\n";
    content += "方向:" + trip.direction + "\n";
    content += "回放里程:" + trip.currentDistance + "km" + "\n";
    content += "位置:" + trip.ps ;
    return content;
  },

  //定时器运动
  playHistory: function() {
    var t1 = setInterval(function() {
      if (num < playlist.length) {
        //画点
        that.getPoint(num);
        num++;
        //改变进度
        that.setData({
          'progress.now': num,
          'progress.isPlay':true
        });

      } else {
        clearInterval(t1);
        that.setData({
          'progress.isPlay': false
        });
      }
    }, speed);
    return t1;
  },
  setSliderChange(e){
    if (isSlider){
      clearInterval(t);
      t = that.playHistory();
    } 
  },
  setSliderChanging(e){
    if (num != e.detail.value) {  
      num = e.detail.value;
      //改变进度
      that.setData({
        'progress.now': num,
        'progress.isPlay': true
      });
      isSlider=true; 
    }
   
  },
  setSpeed: function (e) {
    that.setData({
      'picker.index': e.detail.value
    });
    speed = s / that.data.picker.array[e.detail.value];
    clearInterval(t);
    t = that.playHistory();
  }





})