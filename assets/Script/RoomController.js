var global = require('Global');

//var plugin = require('anysdk');
cc.Class({
    extends: cc.Component,

    properties: {
       
       room:[cc.Node],      
       _currentroom:2,

        popwinlayer:cc.Node,//弹窗遮罩层

        win_playerinfo:cc.Node,

        win_web:cc.Node,//账号中心
        win_shop:cc.Node,
        win_excshop:cc.Node,
        win_gift:cc.Node,
        win_vip:cc.Node,
        win_rotary:cc.Node,

        win_tip:cc.Node,

        loadprog:cc.Node,

        username:cc.Label,
        usergold:cc.Label,
        userdiamond:cc.Label,

        btn_play:cc.Node,
    },

    // use this for initialization
    onLoad: function () {


        this.popwinlayer.on('touchend',function(){event.stopPropagation();});  

        for(let i = 0;i<this.room.length;i++){
            this.room[i].on('touchstart',this.SelectRoom,this);
          
          if(this._currentroom == i+1)
            this.SetRoom(i,true);       
          else 
            this.SetRoom(i,false);
        }       

        global.socket.controller = this;
        //this.win_rotary.active = true;//每日登录奖励转盘

       //开启socket心跳发送
       this.schedule(function() {
        // 这里的 this 指向 component
        var p = {
                version: 102,
                method: 666,                       
                seqId: Math.random() * 1000,
                timestamp: new Date().getTime(),                     
            };
            global.socket.ws.send(JSON.stringify(p));	
         }, 10);
    },

    start:function(){
        //设置玩家基本信息
        //console.log(global.myinfo);
        this.username.string = global.myinfo.nickname;//JSON.parse( global.myinfo.extend_data)['nickname'];
        this.usergold.string =global.myinfo.score;
        this.userdiamond.string='0';        
    },

    //消息处理
    MsgHandle:function( msg){
        
         switch(msg.method){
          case 2002: {  //1对1 聊天
           // random();

            break;
          }
          case 3002: { //进入房间消息
          
            this.EnterGame(msg.data);
            break;
          }
          default: {
           // console.log(data)
            break;
          }
        }
    },

    EnterGame:function(data ){
         //启动加载捕鱼场景
            var info = data[0];//所在组的所有人的信息
            var seat = data[1];//所在组的所有人坐位号    

            for(let i=0;i<seat.length;i+=2){
                          
                //取得自己的坐位号
                if( global.myinfo != null && seat[i+1].split('::')[0] == global.myid  )	                         
                    global.myseat = seat[i]-0;	                       
            }

            //console.log(global.myinfo);
            if(global.myseat>4 || global.myseat<1  ) {
                console.log('--未取得用户信息--');
                return;
            }
             //console.log('---------'+global.myseat +'  '+global.myid);
          
            this.loadprog.active = true;
            var loadsp = this.loadprog.children[2].getComponent(cc.Sprite);
            cc.loader.onProgress = function (completedCount, totalCount, item) {           
               
                var progress =  ( (completedCount+1) / (totalCount+1) ).toFixed(2);
                loadsp.fillRange = progress;                
               
               // cc.log(progress + '%');
            }
            cc.director.preloadScene('game_base', function () {
                  //  cc.loader.onProgress=null;
                   cc.director.loadScene('game_base');
            });
    },

    // update:function(dt){
    //     //每帧处理 网络消息
    //     if(global.socket.msglist.length < 1) return;
    //    // console.log('--------------处理消息队列------------------'+ global.socket.msglist.length);
    //     for( let msg of global.socket.msglist){
    //         this.MsgHandle(msg);
           
    //         global.socket.msglist.pop();
    //     }
    // },

    WinTip:function(){
        this.win_tip.active = true;
        this.win_tip.emit('settip',{type:2,msg:'暂未开放，敬请期待',scene:''});
    },

    Btn_Fish:function(){
        //console.log('快速开始游戏');
        var room = 'qingtong';
       switch(this._currentroom){
           case 0:
           room = 'qingtong';
           break;
           case 1:
           room = 'baiyin';
           break;

           case 2:
           room = 'huangjin';
           break;
       }
        
        this.btn_play.interactable =false; 
         var p = {
            version: 102,
            method: 3001,
            seqId: Math.random() * 1000,
            timestamp: new Date().getTime(),
            data:room,
        };       

        global.socket.ws.send(JSON.stringify(p));

        // this.loadprog.active = true;
        // var loadsp = this.loadprog.children[2].getComponent(cc.Sprite);
        // cc.loader.onProgress = function (completedCount, totalCount, item) {
           
        //     var progress =  (100 * completedCount / totalCount).toFixed(2);
        //     loadsp.fillRange = progress;
        //    // cc.log(progress + '%');
        // }
        // cc.director.preloadScene('game_base', function () {
        //         cc.loader.onProgress=null;
        //        cc.director.loadScene('game_base');
        // });
    },

    Btn_Back:function(){
        //退回到登录场景
         cc.director.preloadScene('login', function () {
                 cc.loader.onProgress=null;
               cc.director.loadScene('login');               
        });
    },

    Btn_Shop:function(){
        this.win_shop.active = true;       
    },

    Btn_PlayerInfo:function(){
        this.win_playerinfo.active= true;
    },

    Btn_AccountCenter:function(){       
        this.win_web.active = true;
    },

    Btn_Gift:function(){
         if(this.win_playerinfo.active ==  true) 
            this.win_playerinfo.active = false;
        this.win_gift.active = true;
    },
    
    Btn_exchange:function(){
        this.win_excshop.active = true;
    },

    Btn_Vip:function(){
         if(this.win_playerinfo.active ==  true) 
            this.win_playerinfo.active = false;
        this.win_vip.active = true;
    },

    SelectRoom:function(event){

        if(event.target.name == this.room[this._currentroom].name) return;

        //点击左边房间  向右移动
        if(event.target.x < 0 ){

            for(let i=0;i<this.room.length;i++){
                let n = i+1;              
                if(n>=3) n=0;              

                if(event.target.name == this.room[i].name)
                    this.SetRoom(i,true,this.room[n].getPosition());
                else
                    this.SetRoom(i,false,this.room[n].getPosition());               
              
              // console.log('-----------'+this.room[i].getPosition()+'---'+ this.room[n].getPosition());
            }
        }
        else{//点击右边房间   向左移动
                
            for(let i=this.room.length-1; i>=0;i--){
                let n = i-1;              
                if(n<0) n=2;              

                 if(event.target.name == this.room[i].name)
                     this.SetRoom(i,true,this.room[n].getPosition());
                 else
                     this.SetRoom(i,false,this.room[n].getPosition());               
               
            }
        }         
    },

    SetRoom:function(id,isselect,pos){

        var scale =1;        
        if(isselect){
            this._currentroom = id;
            scale=1.2;
            this.room[id].color = cc.Color.WHITE;

            for(let i = 0;i<this.room[id].childrenCount;i++)
                this.room[id].children[i].color = cc.Color.WHITE;
            this.room[id].zIndex = 20;
        }
        else{
            scale=0.8;
            this.room[id].color = cc.Color.GRAY;

            for(let i = 0;i<this.room[id].childrenCount;i++)
                this.room[id].children[i].color = cc.Color.GRAY;
            this.room[id].zIndex = 10;
        }

        if(!pos) {        
        
            this.room[id].scaleX = this.room[id].scaleY=scale;
            return;
        }

        this.room[id].runAction(cc.spawn(cc.moveTo(0.3,pos.x,pos.y),cc.scaleTo(0.3,scale,scale)));
    },

    CloseSocket:function(){		
		this.win_tip.active = true;
		this.win_tip.emit('settip',{type:2,msg:'与服务器的联接已断开,请重新登录',scene:'login'});
	},
  

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
 
    // },
});
