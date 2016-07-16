# chat
使用socket.io实现简易聊天室
这里总结一下socket.io中emit的几种方式<br/>
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

