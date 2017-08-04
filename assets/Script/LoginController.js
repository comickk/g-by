//var protobuf = require("protobuf_all_fixed");
//var jspb = require('google-protobuf');  
//var emag = require('emag');          
var global = require('Global'); 
var socket = require('Socket'); 
//var FishMath = require('FishMath');
//var plugin = require('PluginAnySdk');
//var uuid = require('index');
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

        BGM:cc.Node,

        _lastnick:'',
        _lastpass:'',       

        _loginnick:'',
        _loginpass:'',

        testlabel:cc.Label,
      //  testfish:cc.Node,
    },

    // use this for initialization
    onLoad: function () {      
         this.popwinlayer.on('touchend',function(){event.stopPropagation();});  

          cc.game.addPersistRootNode(this.BGM);

         this.node.on('getauthcode',this.GetAuthCode,this);
         this.node.on('setlastnick',function(event){
            this._lastnick = event.detail.nick;
            this._lastpass = event.detail.pass;
            this.ebLoginId.string = this._lastnick;
         },this);

        this.node.on('selectid',  this.btn_start,this);
       
        this.node.on('createid',function(event){
             this._lastnick = event.detail.nick;
             this._lastpass = event.detail.pass;
             this.ebLoginId.string = this._lastnick;
        },this);

        this.node.on('login',function(event){
           
            this.Send(event.detail.arg);
            this._loginnick = event.detail.nick;
            this._loginpass = event.detail.pass;

            this.Loading();            
        },this);

        //------any sdk event---------------
        this.node.on('event_iap',this.IapEvent,this);


         //初始化 anysdk
         if(!cc.isValid( global.anysdk))
            global.anysdk = require('PluginAnySdk').Init();

        // global.anysdk.controller = this.node;
        
        //获取socket
         global.socket = socket; 
        global.socket.controller = this;

        
         this._lastnick = cc.sys.localStorage.getItem('usernick');
          if( cc.isValid(this._lastnick )){
            
          //  console.log(this._lastnick);
            this.ebLoginId.string = this._lastnick;
            this._lastpass = cc.sys.localStorage.getItem('userpass');
        }       
        //this.ebLoginId.string= FishMath.UUID();     
       

             global.volume =0.5;//音效音量
            global.musicid = 0;//背景乐ID
            global.musicvol =0.5;//背景乐音量
    },

    //消息处理
    MsgHandle:function(msg){
        
        //console.log('---------------');
        // console.log(msg);
        switch(msg.method){
            case 1:                 
                global.myinfo = msg.data;//global.socket.MsgToObj(msg.data);  
                if(cc.isValid(global.myinfo)){              
                // global.myinfo = info;    
                //cc.log(global.myinfo);
                    global.myid = global.myinfo.id;//JSON.parse( info.extend_data)['id'];    
                
                    cc.director.preloadScene('hall', function () {
                        cc.director.loadScene('hall');
                    });     
                }  else{
                    this.win_tip.emit('settip',{type:2,msg:'登录异常'});
                }        
            break;
       
          default:           
            break;          
        }
    },

    // update:function(dt){
    //     //每帧处理 网络消息
    //     if(socket.msglist.length < 1) return;
    //     console.log('--------------处理消息队列------------------'+ socket.msglist.length);
    //     for( let msg of socket.msglist){
    //         this.MsgHandle();
    //         console.log(msg);
    //         socket.msglist.pop();
    //     }
    // },

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
        this.win_tip.emit('settip',{type:1,msg:''});
    },

    //获取账号开始游戏
    btn_start:function(){

        // var user = new proto.gws.model.UserProtobuf();  
        // user.setUserName('猫一八')
        // user.setUserPass('123321');

        // var req = new proto.gws.RequestProtobuf();
        // req.setVersion(101);
        // req.setMethod(1);
        // req.setSeqid(parseInt(Math.random() * 1000));
        // req.setTimestamp(new Date().getTime());
        // req.setData(user.serializeBinary());

        // console.log(req.serializeBinary());
        // console.log('====')

        // var resp = proto.gws.ResponseProtobuf;


        // socket.ws.send(req.serializeBinary());

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

        if(cc.isValid(this._lastnick)){
            var arg ="user_name="+this._lastnick;
            arg += "&user_pass="+this._lastpass;     
            
            this._loginnick = this._lastnick;
            this._loginpass = this._lastpass;

            this.Send(arg);

        //   cc.director.preloadScene('hall', function () {
        //           cc.director.loadScene('hall');
        //    });

            //显示正在登录提示条
            this.Loading();
        }
      //  this.logintip.string = '正在登录';
    },

    //客服
    btn_contactus:function(){
        this.win_kefu.active = true;
    },

    GetAuthCode:function(event){

       // console.log( event.detail );

        global.socket.Init(event.detail.server,event.detail.code); 

        //  cc.director.preloadScene('hall', function () {
        //        cc.director.loadScene('hall');
        // });        

        if(cc.sys.localStorage.getItem('usernick') != event.detail.nick){
            //存储此次登录账号
            cc.sys.localStorage.setItem('usernick', event.detail.nick);
            cc.sys.localStorage.setItem('userpass', event.detail.pass);
        }
        //--------账号记录-----------
        
        var namelist = JSON.parse(cc.sys.localStorage.getItem('userData'));

        // if(namelist==null){
        //     console.log('无法取得账号记录');
        //      this.popwinlayer.active = false;
        //     this.logintip.active = false;
        //     return;
        // }
        
        if(cc.isValid(namelist) && namelist.length >0 ){
            var ishave = false;
           // for(let n of namelist){
            for(let i=0;i<namelist.length;i++){
                let n = namelist[i];
                if(n.id == event.detail.nick){
                    ishave = true;
                    break;
                }
            }
            if(!ishave){               
                namelist.push( {
                    id:event.detail.nick,
                    pass:event.detail.pass
                });
                cc.sys.localStorage.setItem('userData', JSON.stringify(namelist));       
            }

        }else{
            var account=[];
            account.push( {
                id:event.detail.nick,
                pass:event.detail.pass
            });
            cc.sys.localStorage.setItem('userData', JSON.stringify(account));            
        }

        //     var write = {
        //         name: 'Tracer',
        //         level: 1,
        //         gold: 100
        //     };

        // cc.sys.localStorage.setItem('userData', JSON.stringify(write));
        // var load = JSON.parse(cc.sys.localStorage.getItem('userData'));
    },

    Send:function(arg){

        var self = this;
        
       //  var url ="http://192.168.2.173/client/user/login?";
       var url ='http://'+global.socket.URL +'/client/user/login?';
       var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                // console.log(response);
                var s = JSON.parse(response);            
                //console.log(s)

                if(cc.isValid(s.error)){
                    self.win_tip.active = true;
                    self.win_tip.emit('settip',{type:2,msg:'账号或密码错误'});
                    
                     self.unscheduleAllCallbacks(); 
                     self.popwinlayer.active = false;
                     self.logintip.active = false;                    

                //    switch(s.error.code){
                //        case '101':
                //        break;
                //    }
                }else{
                   
                    self.node.emit('getauthcode',{code:s.data[0],server:s.data[1],
                            nick:self._loginnick,
                            pass:self._loginpass});
                            //  nick:self._lastnick,
                            // pass:self._lastpass});

                        self.Loading();
                    // }else{
                    //     console.log('无法登录');
                    // }
                }
            }
        };
       // var url ='http://'+global.socket.URL +'/client/user/login?';
        xhr.open("POST", url+arg, true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send(arg);
    },

    SetTip:function(){
        this.win_tip.active = true;
        this.win_tip.emit('settip',{type:2,msg:'测试期间不开放注册!',scene:''});
    },
    // test:function(event, customEventData){
    //     console.log('--------'+customEventData);
    // }
    CloseSocket:function(){		
		//this.win_tip.active = true;
		//this.win_tip.emit('settip',{type:2,msg:'与服务器的联接已断开,请重新登录',scene:'login'});
    },  

    Loading:function(){
         this.popwinlayer.active = true;
         this.logintip.active = true;

        this.scheduleOnce(function(){
            this.popwinlayer.active = false;
            this.logintip.active = false;
         },5);
    },

    //
    test:function(){
        this.testfish.emit('hide');
    },
    Btn_TestLog:function(){
        this.testlabel.string= global.anysdk.log;
    },
    Btn_TestPay:function(){
       // (id,name,price,userid,usernick,userglod,vip) {
        global.anysdk.payForProduct( '1','gold_1','0.01','xxxxx','huangxin','999','10' );
    },

    IapEvent:function(event){
        var msg = event.detail;
        switch(msg.type){
            case 'pay'://支付一个商品
            this.testlabel.string = '---'+ msg.goods_id+'---'+ msg.goods_name+'---'+ msg.goods_price+'---'+ msg.user_id+'---'+ msg.user_nick+'---'+ msg.user_gold+'---'+ msg.user_vip;
            break;

            case 'kPaySuccess'://支付成功  
            break;

        }
    },
    

});
/*
    var t = {
        "d1":[  [0,0],
                [1,1],
                [2,2],
                [3,3],
                [2,4],
                [1,5],
            ],
        "d2":[  [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
                 [1,2,3,4,5],   
                [0,0,0,0,0],
                [0,0,0,0,0],
        ],
    }



    for(let i=0;i< jt.d2.length;i++){
       console.log('时间: '+i+' 产生的鱼为');
       for(let f of jt.d2[i]){
            if(f == 0)
                console.log('此时不产生鱼');
            else
                console.log( jt.d1[f][0]+ '其轨迹是 '+ jt.d1[f][1]);
       }
    }

    var msg= {	
	    id: 112312312,
	    fishes: ['yuid1','2']
    }
    var newFish = {
      id: utils.replaceAll(uuid.v1(), '-', ''),
      step: 0,
      type: k[0],
      path: k[1],
      probability: t.probability,
      weight: t.weight,
    };

    HitFish:function(msg){

        //取得子弹id对应的子弹信息
        var bullet = GetBullet(msg.id);
        
        for(let f of msg.fishes){
             
            //取得鱼id对应的鱼配置
            var fish = GetFish(f);

            var d =  Distance(   fish.path[fish.step].x, fish.path[fish.step].y, 
                                    bullet.x,bullet.y) ;

            //计算子弹位置与鱼当前位置 是否合法
            if(d < bullet.range ) //鱼坐标和子弹坐标 距离小于当前子弹的爆炸半径
            {//合法命中
               
               if(--fish.hp <= 0){      //生命值为0，按概率计算能否打死
                     //取得玩家信息
                    var p = GetPlayer(bullet.owner);
                    var r = Math.random();
                    if(r < fish.die + (1-fish.die)*p.lucky){   //随机值大于死亡率
                       
                        //检测玩家盈利率  本局玩家打到鱼赚的金币数 / 本局玩家消耗掉的金币 < 玩家盈利率
                        // if(  ){            }

                        //返回打到鱼的结果
                        return {
                            player_id:0,
                            fish_id:0,                            
                            fish_value:0,
                        };
                    }
               }//else{}//不处理

            }
            //else{}//非法命中，不处理
        }       
    }
    //计算两点间距离
    Distance:function(x1,y1,x2,y2){
        var xdiff = x2 - x1;
        var ydiff = y2 - y1;
      retrun  Math.abs(Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5));
    }
 */
