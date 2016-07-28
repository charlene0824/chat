# chat
使用socket.io实现简易聊天室
##socket连接通信的整个过程
*  客户端通过发送io.connect(url)连接请求与服务器端进行连接（若不适用socket.io库，使用new WebSocket(url)可以发送连接请求）
*  服务器端通过监听‘connection’事件处理连接请求io.on('connection',function(socket){//发送open事件}）
*  客户端通过监听open事件确认是否与服务器端进行连接
*  客户端通过send方法向服务器端发送信息
*  服务器端通过监听message方法监听send的发送信息，并处理发送信息（将信息广播给其他聊天室成员和自己）
*  服务器端通过监听disconnect方法判断客户端请求是否断开

##socket.io中emit的几种方式
<b>socket.emit('message',data)</b>信息传输对象为当前socket对应的client,各个client socket相互不影响<br/>
<b>socket.broadcast.emit</b>信息传输对象为所有client，排除当前socket对应的client<br/>
<b>io.socket.emit</b>信息传输的对象为所有的client

##分组数据传输
socket.io可以使用分组方法，socket.join(),以及与之对应的socket.leave（）

    io.sockets.on('connection', function (socket) {
      socket.on('firefox', function (data) {
        socket.join('firefox');
      });
      socket.on('chrome',function(data){
        socket.join('chrome');
      });
    });
    
向一个分组传输消息有两种方式
  
    socket.broadcast.to('chrome').emit('event_name', data);
    //emit to 'room' except this socket client
    io.sockets.in('chrome').emit('event_name', data)
    //emit to all socket client in the room

