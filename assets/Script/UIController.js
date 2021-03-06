var global = require('Global');
cc.Class({
    extends: require("Controller"),

    properties: {		
		
		playerInfo:[cc.Node],
		pos_btn:[cc.Node],
		playerbtn:cc.Node,
		btn:[cc.Node],		//0+  1-   2 out  3 sound off  4 sound on  5 lock 6 ice
		
		playertool:cc.Node,
		seattip:cc.Node,

		popwinbg:cc.Node,
		//win_unlockgun:cc.Node,
		msgtip:cc.Node,

		win_tip:cc.Node,
		win_shop:cc.Node,
		win_chat:cc.Node,
		win_vipgun:cc.Node,
		win_fishtype:cc.Node,
		win_setting:cc.Node,

		tipmenu:cc.Node,
		tipunlockgun:cc.Node,


		//mybg:cc.Node,
		//test var
		//guntype:1

		//-----------------
		_paytip:0,
    },

    // use this for initialization
    onLoad: function () {
		this._super();
		global.ui = this.node;		
		this.popwinbg.width = this.node.parent.width;
		this.popwinbg.height = this.node.parent.height;

		this.node.on('event_iap',this.IapEvent,this);

		this.node.on('addplayer',this.f_AddPlayer,this);
		this.node.on('delplayer',this.f_DelPlayer,this);
		this.node.on('setplayer',this.SetPlayer,this);
		this.node.on('settools',function(){
			this.btn[5].getChildByName('num').getComponent(cc.Label).string= global.roominfo.lock;
			this.btn[6].getChildByName('num').getComponent(cc.Label).string= global.roominfo.freeze;

		},this);

		this.node.on('exitgame',this.Menu_Back,this);

		
		this.node.on('socketclose',function(){
			this.win_tip.active = true;
			this.win_tip.emit('settip',{type:2,msg:'与服务器的联接已断开,请重新登录',callback:function(){
				var p = {
							version: 102,
							method: 3005,                       
							seqId: Math.random() * 1000,
							timestamp: new Date().getTime(),                     
						};
						global.socket.ws.send(JSON.stringify(p));	
			
						cc.director.preloadScene('login', function () {
							cc.audioEngine.stopAll();
							cc.director.loadScene('login');   
						})
			}  });
		},this);

		this.node.on('error',function(event){
			this.win_tip.active = true;
			this.win_tip.emit('settip',{type:2,msg:event.detail.msg,callback:function(){
				var p = {
							version: 102,
							method: 3005,                       
							seqId: Math.random() * 1000,
							timestamp: new Date().getTime(),                     
						};
						global.socket.ws.send(JSON.stringify(p));	
			
						cc.director.preloadScene('login', function () {
							cc.audioEngine.stopAll();
							cc.director.loadScene('login');   
						})
			}  });
		},this);

		//金币不足
		this.node.on('Recharge',function(){
			if(this._paytip>0) return;
			this._paytip++;
			this.tipmenu.emit('paytip');
			// this.win_tip.active = true;
			// this.win_tip.emit('settip',{type:2,msg:'您的金币不足哟！请前往金币商店充值',scene:'login'});
		},this);

		this.node.on('setgunlevel',function(event){
		
			var seat = event.detail.seat-1;
			if(global.myseat>2){
    			if(seat > 1) seat -= 2;
    			else seat += 2;
			}		

			//if(++this.guntype >7) this.guntype  =1;
			this.playerInfo[seat].emit('setgunlevel',{level: event.detail.level});
			//global.game.emit('setgun',{seat:global.myseat,type:this.guntype});
		},this);

		this.node.on('shop',function(){
			this.win_shop.active = true;
		},this);


		this.node.on('freeze',function(event){
			var msg =event.detail;
			var ice = global.game.getChildByName("ice");
			ice.active = true;
			ice.opacity= 100;
			ice.runAction(cc.fadeTo(1,255));

			var seat = msg.seat-0;
			if(seat == global.myseat){ //进入冰冻CD
				//this.btn[6].getChildByName('num').getComponent(cc.Label).string= event.detail.num;				
				//this.btn[6].getComponent(cc.Button).interactable = false;
				//冰冻进入CD
				this.SkillCD(6);
				global.myinfo.score = msg.gold;
			}					

			if(global.myseat>2)
			if(seat > 2) seat -= 2;
			else seat += 2;
			
			this.playerInfo[seat-1].emit('changegold',{gold:msg.gold});

			if(cc.isValid(this.playerInfo[seat-1]))
				this.playerInfo[seat-1].emit('freeze');

			// var that = this;
				this.scheduleOnce(function() { 
				ice.active = false; 
			// 	that.btn[6].getComponent(cc.Button).interactable = true;
				}, 9);
		},this);

		this.node.on('lock',function(event){
			var msg =event.detail;			

			var seat = msg.seat-0;
			if(seat == global.myseat){ //进入锁定				
				//this.SkillCD(6);
				global.myinfo.score = msg.gold;
			}					

			if(global.myseat>2)
			if(seat > 2) seat -= 2;
			else seat += 2;	
			
			this.playerInfo[seat-1].emit('changegold',{gold:msg.gold});
		},this);

		this.node.on('chat',function(event){
			var seat = event.detail.seat-1;
			if(global.myseat>2){
    			if(seat > 1) seat -= 2;
    			else seat += 2;
			}		
		
			this.playerInfo[seat].emit('chat',{msg:event.detail.msg});
			if(global.myseat != event.detail.seat-0)
				this.win_chat.emit('chat',{nick:event.detail.nick,msg:event.detail.msg});
			
		},this);

		this.node.on('fishtype',function(){
			this.win_fishtype.active = true;
		},this);
		this.node.on('setting',function(){
			this.win_setting.active = true;
		},this);

		this.popwinbg.on('touchend',function(){event.stopPropagation();}); 
    },

    f_AddPlayer:function(event){
    	var msg = event.detail;  

		//若玩家坐号为3  4 号，需转换座号，
		var seat =  msg.seat-0;		//实际位置 
		var ts = seat;				//相对位置 

		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  f_AddPlayer  '+ seat+'  '+ msg.seat);
			return;
		} 

		if(global.myseat>2){
    		if(ts > 2) ts -= 2;
    		else ts += 2;
		}		

		if(global.myseat == seat){

			//激活玩家面板
			this.btn[5].active = true;//锁定
			this.btn[6].active = true;//冰冻

			//激活加减炮 
			this.playerbtn.active = true;
			this.playerbtn.setPosition( this.pos_btn[ ts-1].getPosition() );

			this.tipmenu.emit('setdirect',{direct:2});//系统菜单
			//this.tipunlockgun.emit('setdirect',{direct:1});//解 锁炮菜单

			//添加位置提示
			this.playertool.active = true;
			this.seattip.active =true;
			this.playertool.x = this.seattip.x = -220;
			if(global.myseat%2 ==0 )
				this.playertool.x = this.seattip.x = 220;

			var  that  =this;
			this.scheduleOnce(function() {
				that.playertool.active = false;				
				that.seattip.active =false;
			}, 3);
		}    		
		
		this.playerInfo[ts-1].emit('playercome',{name:msg.name,gold:msg.gold,vip:msg.vip,lv_curr:msg.lv_curr,lv_max:msg.lv_max});
	},
	

    f_DelPlayer:function(event){
    	var msg = event.detail;

		var seat = msg.seat-0;	
		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  f_DelPlayer  '+ seat+'  '+ msg.seat);
			return;
		} 	
    	//若玩家坐号为3  4 号，需转换座号，
    	if(global.myseat>2){
    		if(seat > 2) seat -= 2;
    		else seat += 2;
    	}

    	this.playerInfo[seat-1].emit('playerquit');
	},
	
	SetPlayer:function(event){
		var msg = event.detail;

		var seat =  msg.seat-0;	
		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  SetPlayer  '+ seat+'  '+ msg.seat);
			return;
		} 
		if(msg.seat == global.myseat)
			global.myinfo.score = msg.gold;

    	//若玩家坐号为3  4 号，需转换座号，
    	if(global.myseat>2){
    		if(seat > 2) seat -= 2;
    		else seat += 2;
		}
		

    	this.playerInfo[seat-1].emit('changegold',{gold:msg.gold});
	},

	// f_SetGunBtn:function(event ){
		
	// 	this.playerbtn.setPosition( this.pos_btn[ event.detail.seat-1] );
	// },
	//加炮
	f_Btn_Add:function(){
		//向服务器发
		// console.log(global.mygunlv);
		//if(global.mygunlv >= global.myinfo.bullet_level)return ;
		//console.log( global.myinfo.bullet_level);
		var p = {
				version: 102,
				method: 5013,				
				seqId: Math.random() * 1000,
				timestamp: new Date().getTime(),
				data:global.mygunlv+1,
			};
		global.socket.ws.send(JSON.stringify(p));	


		//console.log(JSON.stringify(p));
		// //本地模拟
		// var seat = global.myseat-1;
		// if(seat>1) 	seat-=2;    	

		// if(++this.guntype >7) this.guntype  =1;
		// this.playerInfo[seat].emit('setgunlevel',{level:this.guntype*10});
		// global.game.emit('setgun',{seat:global.myseat,type:this.guntype});
	},
	Btn_ChangeGun:function(event,customEventData){
		var p = {
				version: 102,
				method: 5013,				
				seqId: Math.random() * 1000,
				timestamp: new Date().getTime(),
				data:JSON.stringify({level:global.mygunlv + (customEventData-0),style:global.mygunstyle}),
			};
		global.socket.ws.send(JSON.stringify(p));	
		//cc.log(p);
	},

	f_Btn_Sub:function(){
		//向服务器发
		// console.log(global.mygunlv);
		var lv =global.mygunlv-1;
		// if(global.mygunlv ==1 )
		// 	if( global.myinfo.bullet_level > 1)			
		// 		lv = global.myinfo.bullet_level;
		// 	else
		// 		return;		
		
		var p = {
				version: 102,
				method: 5013,				
				seqId: Math.random() * 1000,
				timestamp: new Date().getTime(),
				data:lv,
			};
		global.socket.ws.send(JSON.stringify(p));	
		//console.log(JSON.stringify(p));
		// //本地模拟
		// var seat = global.myseat-1;
		// if(seat>1) 	seat-=2;

		// if(--this.guntype <1) this.guntype  =7;
		// this.playerInfo[seat].emit('setgunlevel',{level:this.guntype*10});
		// global.game.emit('setgun',{seat:global.myseat,type:this.guntype});
	},
	//锁定--------------
	f_Btn_Lock:function(){
		
		// var p = {
		// 	version: 102,
		// 	method: 5011,				
		// 	seqId: Math.random() * 1000,
		// 	timestamp: new Date().getTime(),
		// 	data:1,
		// };
		// global.socket.ws.send(JSON.stringify(p));	
		//if(global.myinfo.tool_2 < 1 ) return;

		global.game.emit('lockstart');
		//锁定开关计时 进入CD
		
		this.SkillCD(5);
	},

	//冰冻-------------------
	f_btn_Ice:function(){		

		//if(global.myinfo.tool_1 < 1 ) return;		
		if(global.myinfo.score <  global.roominfo.freeze) {			
			//金币不足，发送提示	
			global.ui.emit('Recharge');
			return;
		}

		var p = {
			version: 102,
			method: 5011,	
			backendId:global.roominfo.back_id,			
			seqId: Math.random() * 1000,
			timestamp: new Date().getTime(),
			data:JSON.stringify( [1,{}]  ),
		};
		global.socket.ws.send(JSON.stringify(p));	

		//冰冻进入CD
		// this.btn[6].getComponent(cc.Button).interactable= false;
		// var mask = this.btn[6].getChildByName("btn_mask");
		// mask.active = true;
		// var sp = mask.getComponent(cc.Sprite);
		// sp.fillRange =1;

		// var that = this;
		// var spcallback = function () {
     	// 	if(sp.fillRange <=0){     			
		// 		sp.unschedule(spcallback);        
		// 		that.btn[6].getComponent(cc.Button).interactable= true;
		// 		sp.node.active = false;
        // 	}
        // 	else{
        // 		sp.fillRange -= 1/(9/0.1);
        // 	}
 		// }
		//  sp.schedule(  spcallback , 0.1);


		 

		// this.btn[6].getComponent(cc.Button).interactable = false;
		// var ice = global.game.getChildByName("ice");
		// ice.active = true;
		// ice.opacity= 100;
		// ice.runAction(cc.fadeTo(1,255));
			
		// this.scheduleOnce(function() { 
		// 	ice.active = false; 
		// 	this.btn[6].getComponent(cc.Button).interactable = true;
		// }, 8);
	},
	
	f_Btn_Out:function(){
		
	},
	
	f_Btn_Sound_Off:function(){
	
		this.btn[3].active = false;
		this.btn[4].active = true;
	
	},
	
	f_Btn_Sound_On:function(){			
		this.btn[3].active = true;
		this.btn[4].active = false;		
	},	

	Btn_UpGun:function(){
		//this.win_unlockgun.active = true;
		this.win_vipgun.active = true;
	},

	 WinTip:function(){
        this.win_tip.active = true;
        this.win_tip.emit('settip',{type:2,msg:'暂未开放，敬请期待'});
	},
	
	BtnPlayer:function(event, customEventData){
		 var s1 = customEventData-0;
		 var s2 =global.myseat;
		  
		 // cc.log('显示玩家信息'+s1);

		 if(global.myseat>2){
    	 	if(s2 > 2) s2 -= 2;
    	 	else s2 += 2;
		 }

		if(s1 == s2){//自己
			this.playertool.active = true;
			var  that  =this;
			this.scheduleOnce(function() {
				that.playertool.active = false;				
			}, 3);
		}else{			
			this.playerInfo[s1-1].emit('showinfo');
		}
	},
	
	Btn_Chat:function(){
		this.win_chat.active = true;
	},

	Btn_AutoFire:function(){
		global.game.emit('autofire');
	},

	SkillCD:function(type){  //5锁定   6 冰冻
		this.btn[type].getComponent(cc.Button).interactable= false;
		var mask = this.btn[type].getChildByName("btn_mask");
		mask.active = true;
		var sp = mask.getComponent(cc.Sprite);
		sp.fillRange =1;

		var that = this;
		var spcallback = function () {
			if(sp.fillRange <=0){     			
				sp.unschedule(spcallback);        
				that.btn[type].getComponent(cc.Button).interactable= true;
				sp.node.active = false;

				if(type == 5) global.game.emit('lockend');
			}
			else{
				sp.fillRange -= 1/(9/0.1);
			}
		}
		sp.schedule(  spcallback , 0.1);
	},	

	Btn_PayProduct:function(event,customEventData){
        if(!cc.isValid(global.anysdk)){
			this.win_tip.active = true;
            this.win_tip.emit('settip',{type:2,msg:'目前无法使用支付系统'});
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
                this.popwinbg.active = true;
                this.msgtip.active = true;
                this.msgtip.emit('settip',{msg:'支付成功,正在等待服务器发放商品...'});
            break;
			 case 'kPayFail1':
			 	this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'支付失败'});
            break;
			case 'kPayFail2':
				this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'支付系统网络异常,请稍侯再试'});
            break;
			case 'kPayFail3':
				this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'购买的商品信息可能已下架或信息不完整,请购买其它商品'});
            break;
			case  'kPayNowPaying'://支付进行中
				this.win_tip.active = true;
                this.win_tip.emit('settip',{type:2,msg:'一个已启用的支付订单正在处理中'});
            break;
        }
	},
	
	GetGoods:function(data){

         this.popwinbg.active = false;
         this.msgtip.active = false;

		 this.win_tip.active = true;
         this.win_tip.emit('settip',{type:2,msg:'购买成功',callback:function(){

		 }   });
	},
		
	Menu_Back:function(){
		this.win_tip.active = true;
		this.win_tip.emit('settip',{type:1,callback:function(){
			var p = {
                        version: 102,
                        method: 3005,                       
                        seqId: Math.random() * 1000,
                        timestamp: new Date().getTime(),                     
                    };
                    global.socket.ws.send(JSON.stringify(p));	
        
                    cc.director.preloadScene('hall', function () {
                        cc.audioEngine.stopAll();
                        cc.director.loadScene('hall');   
                    })
		}  });
	},

	  Event_Back:function(){
        this.Menu_Back();
    },
     Event_Pause:function(){
         this.Menu_Back();
    },
    Event_Home:function(){
         this.Menu_Back();
    },
});
