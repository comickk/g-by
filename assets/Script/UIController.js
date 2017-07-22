var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {		
		
		playerInfo:[cc.Node],
		pos_btn:[cc.Node],
		playerbtn:cc.Node,
		btn:[cc.Node],		//0+  1-   2 out  3 sound off  4 sound on  5 lock 6 ice
		
		playertool:cc.Node,
		seattip:cc.Node,

		popwinbg:cc.Node,
		win_unlockgun:cc.Node,
		win_tip:cc.Node,
		win_shop:cc.Node,
		win_chat:cc.Node,


		tipmenu:cc.Node,
		tipunlockgun:cc.Node,


		//mybg:cc.Node,
		//test var
		//guntype:1
    },

    // use this for initialization
    onLoad: function () {
	
		global.ui = this.node;		
		this.popwinbg.width = this.node.parent.width;
		this.popwinbg.height = this.node.parent.height;

		this.node.on('addplayer',this.f_AddPlayer,this);
		this.node.on('delplayer',this.f_DelPlayer,this);
		this.node.on('setplayer',this.SetPlayer,this);
		this.node.on('settools',function(){
			this.btn[5].getChildByName('num').getComponent(cc.Label).string= global.myinfo.tool_2;
			this.btn[6].getChildByName('num').getComponent(cc.Label).string= global.myinfo.tool_1;

		},this);

		this.node.on('exitgame',function(){
			this.win_tip.active = true;
			this.win_tip.emit('settip',{type:1,msg:'hall'});
		},this);

		
		this.node.on('socketclose',function(){
			this.win_tip.active = true;
			this.win_tip.emit('settip',{type:2,msg:'与服务器的联接已断开,请重新登录',scene:'login'});
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


		this.node.on('freeze',function(){
				
				var ice = global.game.getChildByName("ice");
				ice.active = true;
				ice.opacity= 100;
				ice.runAction(cc.fadeTo(1,255));

				//this.btn[6].getChildByName('num').getComponent(cc.Label).string= global.myinfo.tool_1;				
				//this.btn[6].getComponent(cc.Button).interactable = false;
				// var that = this;
				 this.scheduleOnce(function() { 
				 	ice.active = false; 
				// 	that.btn[6].getComponent(cc.Button).interactable = true;
				 }, 10);
		},this);

		this.node.on('chat',function(event){
			var seat = event.detail.seat-1;
			if(global.myseat>2){
    			if(seat > 1) seat -= 2;
    			else seat += 2;
			}		
			
			this.playerInfo[seat].emit('chat',{msg:event.detail.msg});
			
		},this);

	
		this.popwinbg.on('touchend',function(){event.stopPropagation();}); 
    },

    f_AddPlayer:function(event){
    	var msg = event.detail;  

		//若玩家坐号为3  4 号，需转换座号，
		var seat = Number( msg.seat);		
		
		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  f_AddPlayer  '+ seat+'  '+ msg.seat);
			return;
		} 

		if(global.myseat == seat){
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
    	if(global.myseat>2){
    		if(seat > 2) seat -= 2;
    		else seat += 2;
		}		

		//激活玩家面板
		
		this.playerInfo[seat-1].emit('playercome',{name:msg.name,gold:msg.gold,diamond:msg.diamond,level:msg.level});
		
		//添加自己
		if(global.myseat ==  msg.seat){
			this.btn[5].active = true;//锁定
			this.btn[6].active = true;//冰冻

			//激活加减炮 
			this.playerbtn.active = true;
			this.playerbtn.setPosition( this.pos_btn[ seat-1].getPosition() );

			this.tipmenu.emit('setdirect',{direct:2});//系统菜单
			this.tipunlockgun.emit('setdirect',{direct:1});//解 锁炮菜单

		}else{//添加其它玩家

		}		

    },
     f_DelPlayer:function(event){
    	var msg = event.detail;

		var seat = Number( msg.seat);	
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

		var seat = Number( msg.seat);	
		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  SetPlayer  '+ seat+'  '+ msg.seat);
			return;
		} 

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
		if(global.mygunlv >=global.myinfo.bullet_level)return ;
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
	
	f_Btn_Sub:function(){
		//向服务器发
		// console.log(global.mygunlv);
		var lv =global.mygunlv-1;
		if(global.mygunlv ==1)			
			lv = global.myinfo.bullet_level;		
		
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
		if(global.myinfo.tool_2 < 1 ) return;

		global.game.emit('lockstart');
		//锁定开关计时 进入CD
		
		this.btn[5].getComponent(cc.Button).interactable= false;
		var mask = this.btn[5].getChildByName("btn_mask");
		mask.active = true;
		var sp = mask.getComponent(cc.Sprite);
		sp.fillRange =1;

		var that = this;
		var spcallback = function () {
     		if(sp.fillRange <=0){     			
				sp.unschedule(spcallback);
				//锁定结束
				global.game.emit('lockend');
				that.btn[5].getComponent(cc.Button).interactable= true;
				sp.node.active = false;
        	}
        	else{
        		sp.fillRange -= 1/(10/0.1);
        	}
 		}
 		sp.schedule(  spcallback , 0.1);

	},

	//冰冻-------------------
	f_btn_Ice:function(){		

		if(global.myinfo.tool_1 < 1 ) return;		

		var p = {
			version: 102,
			method: 5011,	
			backendId: global.backid,			
			seqId: Math.random() * 1000,
			timestamp: new Date().getTime(),
			data:JSON.stringify( [1,{}]  ),
		};
		global.socket.ws.send(JSON.stringify(p));	

		//冰冻进入CD
		this.btn[6].getComponent(cc.Button).interactable= false;
		var mask = this.btn[6].getChildByName("btn_mask");
		mask.active = true;
		var sp = mask.getComponent(cc.Sprite);
		sp.fillRange =1;

		var that = this;
		var spcallback = function () {
     		if(sp.fillRange <=0){     			
				sp.unschedule(spcallback);        
				that.btn[6].getComponent(cc.Button).interactable= true;
				sp.node.active = false;
        	}
        	else{
        		sp.fillRange -= 1/(10/0.1);
        	}
 		}
 		sp.schedule(  spcallback , 0.1);
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
		this.win_unlockgun.active = true;
	},

	 WinTip:function(){
        this.win_tip.active = true;
        this.win_tip.emit('settip',{type:2,msg:'暂未开放，敬请期待',scene:''});
	},
	
	BtnPlayer:function(event, customEventData){
		 var s1 = Number(customEventData);
		 var s2 =global.myseat;
		if(global.myseat>2){
    		if(s2 > 2) s2 -= 2;
    		else s2 += 2;
		}

		if(s2 == s1){//自己
			this.playertool.active = true;
			var  that  =this;
			this.scheduleOnce(function() {
				that.playertool.active = false;				
			}, 3);
		}else{
			if(global.myseat>2){
				if(s1 > 2) s1 -= 2;
				else s1 += 2;
			}
			this.playerInfo[s1-1].emit('showinfo');
		}

		//cc.log('显示玩家信息');
	},
	
	Btn_Chat:function(){
		this.win_chat.active = true;
	},

});
