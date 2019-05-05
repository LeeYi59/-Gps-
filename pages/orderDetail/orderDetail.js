var that;
var app=getApp();
Page({
  data: {
    showDialog: false,
    currentIndex: 0,
    orders:{},
    order:{
      index:"",
      carList:"",
      carNum:""
    }
  },
  onLoad: function () {
    that=this;
    wx.setNavigationBarTitle({
      title: '我的订单',
    });
    that.setData({
      orders: app.globalData.orders
    });
  },

  //列表点击事件
  onItemClick(e){
    that.setData({
      order:{
        index: e.currentTarget.id
      } 
    });
    var carList=[];
    if (that.data.orders[e.currentTarget.id].carNum.indexOf(",") >= 0){
      carList = that.data.orders[e.currentTarget.id].carNum.split(",");
    }
    else{
      carList[0] = that.data.orders[e.currentTarget.id].carNum;
    }
    that.setData({
    showDialog:!that.data.showDialog,
    'order.carList':carList
    })
  },
  //关闭弹窗事件
  dialogClose(){
    that.setData({
      showDialog: false
    })
  },
  //选择车辆事件
  radioChange(e){
    console.log(e)
    that.setData({
      'order.carNum': e.detail.value
    });
  },
  //回放跳转事件
  turnToPlayBack(){
    // app.globalData.order={
    //   startTime: that.data.orders[that.data.order.index].startTransportTime,
    //   endTime: that.data.orders[that.data.order.index].endTransportTime,
    //   carNum:that.data.order.carNum
    // };
    that.setData({
      showDialog:false
    });
    var start = that.data.orders[that.data.order.index].startTransportTime;
    var end = that.data.orders[that.data.order.index].endTransportTime;
    var carNum = that.data.order.carNum;

    app.getData(start, end, carNum).then((res) => {
      console.log(res)
      if(res!=null&&res.length!=0){
        wx.navigateTo({
          url: '/pages/playback/playback'
        });
      }else{
        wx.showToast({
          title: '无当前车辆行程记录',
          icon: 'none',
          duration: 2000
        });
      }
     
    });
    
  },//用户点击tab时调用
  titleClick: function (e) {
      that.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      });
      var orderlist=app.globalData.orders;
    //筛选订单列表  
    switch (e.currentTarget.dataset.idx){
      case "0":
        that.setData({
         orders:orderlist
        });
        break;
      case "1":
        that.setData({
          orders: that.getOrderListByStatus(200)
        });
        break;
      case "2":
        that.setData({
          orders: that.getOrderListByStatus(201)
        });
        break;
      case "3":
        that.setData({
          orders: that.getOrderListByStatus(202)
        });
        break;
      }
  },
  getOrderListByStatus:function(status){
    var orderlist = app.globalData.orders;
    var result = [];
    for (var i = 0; i < orderlist.length; i++) {
      if (orderlist[i].tradeStatus == status) {
        result.push(orderlist[i]);
      }
    }
    return result;
  }
})