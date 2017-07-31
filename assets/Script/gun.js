//var C_NodePool =  require("NodePool");
var FishMath = require('FishMath');
var global = require('Global');

cc.Class({
    extends: cc.Component,

    properties: {
        
		v_seat:1,		
        v_type:   1,        
        v_bulletspeed:500,
		
		v_bulletpos:cc.Node,
		v_bullet: cc.Prefab, 
		
        v_anim: cc.Animation,		
		
		//是否已准备好发射，防止射速过快
		_isfire:false,
		_isready:true,
		
		
		v_gunsprite:[cc.SpriteFrame],
		v_bulletsprite:[cc.SpriteFrame],		
		
		v_locktarget:{
			default:null,
			type:cc.Node,
			visible:false
		},
		
		//v_nodepool:cc.Class,
		
		/*v_nodepool :{
			default:null,
			type:c_NodePool,
			visible:false
			},
		*/
		
		/*
		v_leftang:{ //炮口左方对角，
			default:0,
			visible:false
		}
		
		v_rightang:{ //炮口右方对角(画布右上角至炮的角度)
			default:0,
			visible:false
		},*/
		
		//画布高和宽
		v_cw:{
			default:0,
			visible:false
		},
		v_ch:{
			default:0,
			visible:false
		},
		
		//炮弹最远射程（跟据最远射程和角度，利用三角函数计算 该点X和Y 的值）
		v_range:{
			default:0,
			visible:false
		}, 		

		_mousepos:cc.v2,
    },
	
    // use this for initialization
    onLoad: function () {
	
		//console.log('我是一门炮');
		//this.v_gamecontroller = cc.find("Canvas/GameController").getComponent("GameController");
	
		this.v_cw= cc.Canvas.instance.node.width;
		this.v_ch = cc.Canvas.instance.node.height;
		
		//this.v_rightang = - Math.atan( (this.v_cw/2+this.node.x) / (this.v_ch/2 + this.node.y) )* (180/Math.PI);
		//this.v_lefttang = - Math.atan( (this.v_cw/2+this.node.x) / (this.v_ch/2 + this.node.y) )* (180/Math.PI);
		
		//计算炮台子弹最远射程（最远的对角）
		//var tx = this.v_cw/2+Math.abs(this.node.x);
		//var ty = this.v_ch/2+Math.abs(this.node.y);
		//斜边 = 邻边的平方 + 对边的平方的 平方根		
		//this.v_range = Math.sqrt(Math.pow(tx,2)+Math.pow(ty,2));
		//计算炮弹生命周期
		this.v_bulletlife = this.range/this.bulletspeed;
		
        this.v_anim = this.getComponent(cc.Animation);		
		this.node.zIndex =10;
		
		//添加事件				
		this.node.on('otherfire',this.f_OtherFire,this);
        this.node.on('fire',this.f_Fire,this);
		this.node.on('stopfire',function(){ this._isfire = false;},this);
		this.node.on('changetype',this.f_SetType,this);	
		
		this.node.on('lockfish',function(event){	
						if(this.v_locktarget!=null){//改变锁定对象
							this.v_locktarget.emit('unlock');							
						}
						this.v_locktarget = event.detail.fish;
						this.v_locktarget.emit('lock');
						this._isfire = true;
		},this);
		this.node.on('unlockfish',function(){
						if(this.v_locktarget!=null){
						this.v_locktarget.emit('unlock');
						this.v_locktarget = null;
						this._isfire = false;
					}
			},this);
		this.node.on('cancellock',function(){						
						this.v_locktarget = null;
						this._isfire = false;
		},this);		
    },

    onDestroy:function(){

		this.node.targetOff(this);    	
    },
    
    update: function (dt) {
		if(this._isfire && this._isready) this.f_AutoFire();
     },

    f_InitGun:function(seat,type,parent,r,x,y){
    	//console.log('-----------Init Gun' );	
    	 	
    	this.node.rotation = r;
    	this.node.setPosition(x,y);
    	this.node.parent = parent;
		this.v_seat = seat;    	
		
		this.v_type = type;
		//console.log('------'+level);
		this.node.getComponent(cc.Sprite).spriteFrame = this.v_gunsprite[this.v_type-1];
    },
    
   f_Fire:function(event){		
		//console.log('-----------my gun fire' );	
		var wx = this.v_cw/2+this.node.x;
		var wy = this.v_ch/2+this.node.y;

		//鼠标接触点
		this._mousepos = cc.v2(event.detail.x,event.detail.y);
		//console.log('----自己开火'+this._mousepos.x+'  '+this._mousepos.y);
		
		var r = FishMath.GetAngle(wx,wy,this._mousepos.x,this._mousepos.y);
		
		
		if( this.node.y >0  && r <= 0 )return;
		if( this.node.y <0  && r >= 0 )return;
		//if(this._isfire)	return;	
		this.node.rotation = r;	
		this._isfire = true;						
    },
	
	f_AutoFire:function(){			
	
		//有锁定的目标，自动攻击
		if(this.v_locktarget != null){
		
			if(this.v_locktarget.x > this.v_cw/2 || this.v_locktarget.x < -this.v_cw/2) return;
			if(this.v_locktarget.y > this.v_ch/2 || this.v_locktarget.y < -this.v_ch/2) return;
			
			var wx = this.v_cw/2+this.node.x;
			var wy = this.v_ch/2+this.node.y;

			//目标位置
			//console.log('-----------c t w'+ cc.Canvas.instance.node.convertToWorldSpace (this.v_locktarget.getPosition()));	
			
			var mp = cc.v2(this.v_locktarget.x+this.v_cw/2,this.v_locktarget.y+this.v_ch/2);
		
			this._mousepos = mp;
			var r = FishMath.GetAngle(wx,wy,mp.x,mp.y);
			this.node.rotation = r;	
		}		
		
		if(this.v_type<4){
			this.v_anim.play("gun"+this.v_type);  
		}else{
			this.v_anim.play('vipgun'+this.v_type-3);
		}
		
		global.ac.emit('fire');		

		var bid = FishMath.UUID(); //new Date().getTime()+'';
		
		//发送开火消息--------------
		var p = {
			version: 102,
			method: 5001,
			seqId: Math.random() * 1000,
			timestamp: new Date().getTime(), 
			data: JSON.stringify({
				id: bid,
				x: this._mousepos.x/cc.Canvas.instance.node.width,
				y: this._mousepos.y/cc.Canvas.instance.node.height,
				level: global.mygunlv,
			})
		};
		//console.log(p);
		var jsp= JSON.stringify(p);
		//console.log(jsp);
		global.socket.ws.send(jsp);  
		//------------------------------
		
		//计算炮弹的目标点		
		var tp = FishMath.GetFirePos(this.node.rotation,this.node.x,this.node.y,this.v_cw/2,this.v_ch/2);			
		
        //生成炮弹(从资源池中取并初始化)
		var v = this.v_bulletpos.convertToWorldSpace (this.v_bulletpos.getPosition());
		var v2 =this.node.parent.convertToWorldSpace(v);
       
		var sp_bullet = global.pool_bullet.f_GetNode( this.node.parent, -(this.v_cw/2) +v2.x,-(this.v_ch/2)+v2.y ,this.node.rotation,
													  this.v_bulletsprite[this.v_type-1]).getComponent("bullet");
													  
		sp_bullet.f_InitBullet(	this.v_type,this.v_seat,this.v_bulletspeed);	
		sp_bullet.node.name = bid;

		//cc.log("bullet Uuid: " + sp_bullet.uuid);

		if(this.v_locktarget != null) {//sp_bullet.emit('settarget',{name:this.v_locktarget.name});
			sp_bullet.v_locktarget = this.v_locktarget.name;
			sp_bullet.v_isrebound = false;//设定目标的子弹不反弹
		}
		else
			sp_bullet.v_isrebound = true;
		
		//执行动作		  
		var finished = cc.callFunc(function(){sp_bullet.ismoveing = false;},sp_bullet);
		sp_bullet.node.runAction(cc.sequence(cc.moveTo(tp[2]/this.v_bulletspeed,tp[0],tp[1]),finished));
		sp_bullet.ismoveing = true;
																
		this._isready = false;
		var that = this;
		this.scheduleOnce( function() {	that._isready = true;}, 0.2);
	},
	
	f_OtherFire(event){
	
		var wx = this.v_cw/2+this.node.x;
		var wy = this.v_ch/2+this.node.y;

		//鼠标接触点
		var mp = cc.v2(event.detail.x,event.detail.y);

		//console.log('-----------other gun fire' +mp.x+'   '+mp.y);	
		
		var r = FishMath.GetAngle(wx,wy,mp.x,mp.y);
		this.node.rotation = r;	
		
		this.v_anim.play("gun"+this.v_type);  		
	
		//计算炮弹的目标点
		var tp = FishMath.GetFirePos(this.node.rotation,this.node.x,this.node.y,this.v_cw/2,this.v_ch/2);	
		
		   		
		
        //生成炮弹(从资源池中取并初始化)
		var v = this.v_bulletpos.convertToWorldSpace (cc.v2(this.v_bulletpos.x, this.v_bulletpos.y));
		var v2 =this.node.parent.convertToWorldSpace(v);       
		
		var sp_bullet = global.pool_bullet.f_GetNode( 	this.node.parent, -(this.v_cw/2) +v2.x,-(this.v_ch/2)+v2.y ,this.node.rotation,
														this.v_bulletsprite[this.v_type-1]).getComponent("bullet");													  
		sp_bullet.f_InitBullet(	this.v_type,this.v_seat,this.v_bulletspeed);	
		sp_bullet.node.name = event.detail.id;
		//执行动作
		//var action = cc.moveTo(tp[2]/this.v_bulletspeed,tp[0],tp[1]);    

			//执行动作		  
		var finished = cc.callFunc(function(){sp_bullet.ismoveing = false;},sp_bullet);
		sp_bullet.node.runAction(cc.sequence(cc.moveTo(tp[2]/this.v_bulletspeed,tp[0],tp[1]),finished));
		sp_bullet.ismoveing = true;
	},
    //初始化炮类型
	//设置炮类型
    f_SetType:function(event){		
		global.ac.emit('change');
		this.v_type = event.detail.type;
		this.node.getComponent(cc.Sprite).spriteFrame = this.v_gunsprite[this.v_type-1];
		
		//console.log('----- ='+this.v_type);
    },    
});
