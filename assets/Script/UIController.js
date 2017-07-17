var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {		
		
		playerInfo:[cc.Node],
		pos_btn:[cc.Node],
		playerbtn:cc.Node,
		btn:[cc.Node],		//0+  1-   2 out  3 sound off  4 sound on  5 lock 6 ice
		
		popwinbg:cc.Node,
		win_unlockgun:cc.Node,

		tipmenu:cc.Node,
		tipunlockgun:cc.Node,


		//mybg:cc.Node,
		//test var
		guntype:1
    },

    // use this for initialization
    onLoad: function () {
	
		global.ui = this.node;		

		this.node.on('addplayer',this.f_AddPlayer,this);
		this.node.on('delplayer',this.f_DelPlayer,this);

		this.popwinbg.width = this.node.parent.width;
		this.popwinbg.height = this.node.parent.height;
		this.popwinbg.on('touchend',function(){event.stopPropagation();}); 
    },

    f_AddPlayer:function(event){
    	var msg = event.detail;  

		//若玩家坐号为3  4 号，需转换座号，
		var seat = Number( msg.seat);		
		
    	if(global.myseat>2){
    		if(seat > 2) seat -= 2;
    		else seat += 2;
		}		

		//激活玩家面板
		
		this.playerInfo[seat-1].emit('playercome',{name:msg.name,gold:msg.gold});
		
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
    	//若玩家坐号为3  4 号，需转换座号，
    	if(global.myseat>2){
    		if(seat > 2) seat -= 2;
    		else seat += 2;
    	}

    	this.playerInfo[seat-1].emit('playerquit');
    },

	// f_SetGunBtn:function(event ){
		
	// 	this.playerbtn.setPosition( this.pos_btn[ event.detail.seat-1] );
	// },
	
	f_Btn_Add:function(){
		//向服务器发
		
		//本地模拟
		var seat = global.myseat-1;
		if(seat>1) 	seat-=2;    	

		if(++this.guntype >7) this.guntype  =1;
		this.playerInfo[seat].emit('setgunlevel',{level:this.guntype*10});
		global.game.emit('setgun',{seat:global.myseat,type:this.guntype});
	},
	
	f_Btn_Sub:function(){
		//向服务器发
		
		//本地模拟
		var seat = global.myseat-1;
		if(seat>1) 	seat-=2;

		if(--this.guntype <1) this.guntype  =7;
		this.playerInfo[seat].emit('setgunlevel',{level:this.guntype*10});
		global.game.emit('setgun',{seat:global.myseat,type:this.guntype});
	},
	
	f_Btn_Lock:function(){
	
		global.game.emit('lockstart');
		//锁定开关计时
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
        		sp.fillRange -= 1/(15/0.1);
        	}
 		}
 		sp.schedule(  spcallback , 0.1);

	},

	f_btn_Ice:function(){

		this.btn[6].getComponent(cc.Button).interactable = false;
		var ice = global.game.getChildByName("ice");
		ice.active = true;
		ice.opacity= 100;
		ice.runAction(cc.fadeTo(1,255));
			
		this.scheduleOnce(function() { 
			ice.active = false; 
			this.btn[6].getComponent(cc.Button).interactable = true;
		}, 3);
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
});
