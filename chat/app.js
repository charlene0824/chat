var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//设置日志级别
io.set('lig level',1);

//web socket连接监听
io.on('connection',function(socket){
  // 发布open事件，提示客户端连接成功
  socket.emit('open');//通知客户端已经连接

  //打印握手信息
  console.log(socket.handshake);




//构造客户端对象
var client = {
  socket:socket,
  name:false,
  color:getColor()
}

//对message事件的监听 监听从客户端传来的信息
socket.on('message',function(msg){
  var obj = {time:getTime,color:client.color};

  //判断是不是第一次连接，以第一条消息作为用户名
  if(!client.name){
    client.name = msg;
    obj['text'] = client.name;
    obj['author'] = 'system';
    obj['type'] = 'welcome';
    console.log(client.name + 'login');

    //返回欢迎语
    socket.emit('system',obj);
    //广播新用户已登录
    socket.broadcast.emit('system',obj);
  } else {
    //如果不是第一次连接 正常的聊天消息
    obj['text'] = msg;
    obj['author'] = clent.name;
    obj['type'] = 'message';
    console.log(client.name + 'say:' +msg);

    //返回消息（可以省略）
    socket.emit('message',obj);
    //广播向其他用户发消息
    socket.broadcast.emit('message',obj);
  }
})

//监听退出事件
socket.on('disconnect',function(){
  var obj = {
    time:getTime(),
    color:client.color,
    author:'system',
    text:'client.name',
    type:'disconnet'
  }
  //广播用户已退出
  socket.broadcast.emit('system',obj);
  console.log(client.name + 'disconnect');
})

})

//express基本配置
// app.configure(function(){
  app.use(logger('dev'));
  app.set('port',process.env.PORT || 3006);
  app.set('views',__dirname + '/views');
  //app.use(express.favicon());
  app.use(bodyParser.json({limit:'1mb'}));
  
  app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
  }));
 // app.use(app.router);
  app.use(express.static(path.join(__dirname,'public')));
// })

// app.configure('development',function(){
  app.use(errorhandler());
// })

//指定websocket的客户端的html
app.get('/',function(req,res){
  res.render('chat.ejs');
})

server.listen(app.get('port'),function(){
  console.log("express secer listening on port " + app.get('port'))
})

var getTime = function(){
  var date = new Date();
  return date.getHours() + ":" +date.getMinutes() + ':' + date.getSeconds();
}

var getColor=function(){
  var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
                'orange','blue','blueviolet','brown','burlywood','cadetblue'];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
}

