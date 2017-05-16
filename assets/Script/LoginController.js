//var protobuf = require("protobuf_all_fixed");
//var jspb = require('google-protobuf');  
//var emag = require('emag');          
var global = require('Global'); 
var socket = require('Socket'); 
//var plugin = require('PluginAnySdk');
cc.Class({
    extends: cc.Component,

    properties: {     
       
       ebLoginId:cc.EditBox,
        win_tip:cc.Node,
        win_creatid:cc.Node,
        win_selectid:cc.Node,
        win_login:cc.Node,

        win_kefu:cc.Node,

        popwinlayer:cc.Node,

        logintip:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
         this.popwinlayer.on('touchend',function(){event.stopPropagation();});  
       
         //初始化 anysdk
        global.anysdk = require('PluginAnySdk').Init();
        
        //获取socket
        global.socket = socket; 
      
    },

    //消息处理
    MsgHandle:function(){

    },

    update:function(dt){
        //每帧处理 网络消息
        if(socket.msglist.length < 1) return;
        console.log('--------------处理消息队列------------------'+ socket.msglist.length);
        for( let msg of socket.msglist){
            this.MsgHandle();
            console.log(msg);
            socket.msglist.pop();
        }
    },

   //切换账号
    btn_switchid:function(){
       
        this.win_selectid.active= true;
    },


    //昵称登录
    btn_nicklogin:function(){
       
     //   global.anysdk.payForProduct();
      this.win_login.active = true;
        
    },

    //创建账号
    btn_createid:function(){

        this.win_selectid.active = false;//('hide');
        this.win_creatid.active = true;  
    },

    //退出
    btn_exit:function(){
     
        this.win_tip.active = true;
        this.win_tip.emit('settip',{type:1,msg:'这是新设的提示'});
    },

    //获取账号开始游戏
    btn_start:function(){
   
        var user = new proto.gws.model.UserProtobuf();  
        user.setUserName('猫一八')
        user.setUserPass('123321');

        var req = new proto.gws.RequestProtobuf();
        req.setVersion(101);
        req.setMethod(1);
        req.setSeqid(parseInt(Math.random() * 1000));
        req.setTimestamp(new Date().getTime());
        req.setData(user.serializeBinary());

        console.log(req.serializeBinary());
        console.log('====')

        var resp = proto.gws.ResponseProtobuf;


        socket.ws.send(req.serializeBinary());

        //   var socket = new WebSocket('ws://118.190.89.153/s/68/');
        //   socket.binaryType = 'arraybuffer';

        //   socket.onopen = function(evt){
        //     socket.send(req.serializeBinary());
        //   };

        //   socket.onmessage = function(evt){
        //     var data = evt.data;
        //     var type = typeof data;

        //     console.log(data)
        //     console.log('++++')

        //     var result = resp.deserializeBinary(data);

        //     console.log(result.getVersion())
        //     console.log(result.getMethod())
        //     console.log(result.getSeqid())
        //     console.log(result.getTimestamp())

        //     console.log('----')
        //     var _user = proto.gws.model.UserProtobuf;
        //     var _result = _user.deserializeBinary(result.getData());
        //     console.log(_result.getId())
        //     console.log(_result.getUserName())
        //     console.log(_result.getUserPass())

        //     socket.close();
        //   };

        //   socket.onclose = function(evt){
        //     console.log('client notified socket has closed.', evt);
        //   };

                /*
                登录成功时记录该次ID
                var write = {
                    name: 'Tracer',
                    level: 1,
                    gold: 100
                };

        cc.sys.localStorage.setItem('userData', JSON.stringify(write));
        var load = JSON.parse(cc.sys.localStorage.getItem('userData'));
        console.log('-----------'+load.gold);
        //cc.sys.localStorage.removeItem(key)
        */

        cc.director.preloadScene('hall', function () {
               cc.director.loadScene('hall');
        });

        this.popwinlayer.active = true;
        this.logintip.active = true;
      //  this.logintip.string = '正在登录';
    },

    //客服
    btn_contactus:function(){
        this.win_kefu.active = true;
    },

});
