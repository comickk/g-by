var global = require('Global');

//var plugin = require('anysdk');
cc.Class({
    extends: cc.Component,

    properties: {
       
       room:[cc.Node],      
       _currentroom:2,

        popwinlayer:cc.Node,//弹窗遮罩层
        msgtip:cc.Node,

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
        viplevel:cc.Label,
        usergold:cc.Label,
        userdiamond:cc.Label,

        btn_play:cc.Node,

        sound:[cc.AudioClip],

        _running:true,

        _backtimeID:0,
    },

    // use this for initialization
    onLoad: function () {

        var that = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {           
            if(that._running){
                cc.log('----------game hide');
                that._running =false;
                // that.schedule(that.SocketTest,10);
                that._backtimeID = setInterval(that.SocketTest,10000);                
            }            
        });

         cc.game.on(cc.game.EVENT_SHOW, function () {
           
            if(!that._running){
                cc.log('----------game show');
                that._running = true;
                clearInterval(that._backtimeID);                
                //that.unschedule(that.SocketTest);
            }
        });

        var BGM = cc.find('BGM');
        if(cc.isValid(BGM) && !BGM.active)
            BGM.active =true;

        this.node.on('getprize',function(){
            this.usergold.string = global.myinfo.score + global.myinfo.wheel_of_fortune_bonus;
        },this);

        this.popwinlayer.on('touchend',function(){event.stopPropagation();});  

        for(let i = 0;i<this.room.length;i++){
            this.room[i].on('touchstart',this.SelectRoom,this);
          
          if(this._currentroom == i+1)
            this.SetRoom(i,true);       
          else 
            this.SetRoom(i,false);
        }       

        global.socket.controller = this;
        global.anysdk.controller = this.node;

          //------any sdk event---------------
        this.node.on('event_iap',this.IapEvent,this);
       
       //cc.log(global.myinfo);        

       //开启socket心跳发送
       this.schedule(this.SocketTest1,10);
           
    },

     SocketTest:function(){
        var p = {
                version: 102,
                method: 666,                       
                seqId: Math.random() * 1000,
                timestamp: new Date().getTime(),                     
            };
         global.socket.ws.send(JSON.stringify(p));
         cc.log(cc.sys.now());	
    } ,

    SocketTest1:function(){
        var p = {
                version: 102,
                method: 666,                       
                seqId: Math.random() * 1000,
                timestamp: new Date().getTime(),                     
            };
         global.socket.ws.send(JSON.stringify(p));	
    } ,

   

    start:function(){
        //设置玩家基本信息
        //console.log(global.myinfo);
       this.UpdataPlayerInfo();
        //-------转盘测试------------
       // this.win_rotary.active = true;//每日登录奖励转盘 
       // this.win_rotary.emit('setprize',{  id: 6,   num:1000});
         //-----------------
       
         // cc.log(global.myinfo);
        if(global.myinfo.wheel_of_fortune_cell-0 >0){
             this.win_rotary.active = true;//每日登录奖励转盘            

             this.win_rotary.emit('setprize',{  id: global.myinfo.wheel_of_fortune_cell-0,
                                                num: global.myinfo.wheel_of_fortune_bonus});
            
            global.myinfo.wheel_of_fortune_cell=0;
        }

    },

    UpdataPlayerInfo:function(){
        this.username.string = global.myinfo.nickname;//JSON.parse( global.myinfo.extend_data)['nickname'];
        this.usergold.string =global.myinfo.score;
        this.userdiamond.string=global.myinfo.gift_count;   

        if(global.myinfo.vip -0 >0 )
            this.viplevel.string = 'VIP '+global.myinfo.vip +' 级';           
    },

    //消息处理
    MsgHandle:function( msg){
        
         switch(msg.method){
             case 1008://服务器公告
			cc.log(msg.data);
            if(cc.isValid(global.broad))               
                global.broad.emit('settext',{text:msg.data});            
            break;

          case 1012://成功购买商品
          cc.log(msg.data);
            this.GetGoods(msg.data);
          break;
            
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
                var BGM = cc.find('BGM');
                    if(cc.isValid(BGM))
                        BGM.active =false;
                       // cc.game.removePersistRootNode(BGM);

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
        //global.socket.ClearMsg();//断开socket

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

    Btn_GetGift:function(){ 
        this.win_gift.active = false;
        this.win_shop.active = true;
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
        cc.audioEngine.play(this.sound[0], false,global.volume);
    },

    CloseSocket:function(){		
		this.win_tip.active = true;
		this.win_tip.emit('settip',{type:2,msg:'与服务器的联接已断开,请重新登录',scene:'login'});
	},
  
    Btn_PayProduct:function(event,customEventData){
        if(!cc.isValid(global.anysdk)){
            this.win_tip.active = true;
            this.win_tip.emit('settip',{type:2,msg:'目前无法使用支付系统',scene:''});
            return;
        }
        
        global.anysdk.payForProduct(customEventData+'','gold','0.01',global.myid+'',global.myinfo.nickname+'',global.myinfo.score+'',global.myinfo.vip+'');        
        
    },  
    IapEvent:function(event){
        var msg = event.detail;
        switch(msg.type){
            case 'pay'://支付一个商品
            //this.testlabel.string = '---'+ msg.goods_id+'---'+ msg.goods_name+'---'+ msg.goods_price+'---'+ msg.user_id+'---'+ msg.user_nick+'---'+ msg.user_gold+'---'+ msg.user_vip;
            break;

            case 'kPaySuccess'://支付成功  //进入等待服务器确认支付
                this.win_shop.active = false;
                this.popwinlayer.active = true;
                this.msgtip.active = true;
                this.msgtip.emit('settip',{msg:'支付成功,正在等待服务器发放商品...'});
                //超时处理
            break;
             case 'kPayFail1':
                this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'支付失败',scene:''});
            break;
            case 'kPayFail2':
                this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'支付系统网络异常,请稍侯再试',scene:''});
            break;
            case 'kPayFail3':
                this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'购买的商品信息可能已下架或信息不完整,请购买其它商品',scene:''});
            break;
            case  'kPayNowPaying'://支付进行中
                this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'一个已启用的支付订单正在处理中',scene:''});
            break;
        }
    },

    GetGoods:function(data){
       
         this.popwinlayer.active = false;
         this.msgtip.active = false;

         this.win_tip.active = true;
         this.win_tip.emit('settip',{type:2,msg:'购买成功',scene:''});

         //更新玩家数据
        // global.myinfo = data;
         this.UpdataPlayerInfo();
    },
});
