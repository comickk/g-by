var C_NodePool =  require("NodePool");
var FishMath = require('FishMath');
var global = require('Global');


//--------
var Ptype = cc.Enum({
	GUN:0,
	NET:-1,
	COIN:-1,
	BULLET:-1,
	COINNUM:-1,
	REWARD:-1,
	LIGHTNING:-1,
	LIGHTNINGBALL:-1,
	BOSSREWARD:-1,
});

var Audiotype =cc.Enum({
	COIN:0,
	GETCOIN:-1,
	LIGHTNING:-1,
	WARNING:-1,
});
cc.Class({
    extends: cc.Component,

    properties: {    
        
		v_server:cc.Node,
		
		v_guntype:1,
		v_fishlayer:cc.Node,		

		bgmag:cc.Node,	

		// 准备锁鱼
		v_readylock:{
			default:false,		
			visible:false
		},
		
		//--------------	
		v_guns:[cc.Node],
		prefab:[cc.Prefab],  //0  炮    1 网    2 金币	3 子弹  4 金币文字  5  奖金转盘     6 闪电链   7 闪电球  8 BOSS奖转盘

		gunseat:[cc.Node],
		
		v_sound:[cc.AudioClip],			
		v_fish:[cc.Prefab],
        
		
		//渔网图
		v_netsprite:[cc.SpriteFrame],			
	  
		
		//_playerinfo:[],
		_seatid:[],
		_roominfo:null,
		//----------------测试
		
		//--------------------
    },	
    // use this for initialization
    onLoad: function () {         
		global.game = this.node;
		global.mygunlv =1;
		//global.myseat =0;
		this._seatid = ['','','','',''];
	

        this.node.width= cc.Canvas.instance.node.width;
        this.node.height = cc.Canvas.instance.node.height;
         
		 //注册事件----------------
		 //触屏事件，玩家本人开火
        this.node.on('touchstart', this.Touch,this);
		this.node.on('touchmove',  this.Touch,this);	
        this.node.on('touchend',   this.TouchEnd,this);	
		this.node.on('touchcancel',this.TouchEnd,this);	
		//子弹碰撞
		this.node.on('collider',this.Collider,this);		
		//this.node.on('setgun',this.SetGunType,this);

		//锁鱼
		// this.node.on('readylock',function(){ this.v_readylock = !this.v_readylock;
		// 	if(!this.v_readylock) this.f_UnLockFish();
		// },this);
		this.node.on('lockstart',function(){ 
			this.v_readylock = true;
			var effect = this.gunseat[global.myseat-1].getChildByName("effect2");
			if(effect!=null)	effect.active = true;				
		},this);

		this.node.on('lockend',this.UnLockFish,this);

		this.node.on('lockfish',this.LockFish,this);
		this.node.on('cancellock',this.CancelLock,this);
		
		
		//服务器鱼消息
		//this.node.on('initfish',this.InitFish,this);
		//this.node.on('restfish',this.RestFish,this);
		//this.node.on('syncfish',this.SyncFish,this);
		//this.node.on('getfish' ,this.GetFish,this);
     
		
		this.InitNodePool();			
		
		//开启碰撞检测
		cc.director.getCollisionManager().enabled = true;
        
		// node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
		//  console.log('Mouse down');
		//  }, this);

       // node.on('touchstart', e_TouchDwon, this);	   

		global.socket.controller = this;
		//发送准备完毕消息
		 var p = {
			version: 102,
			method: 5005,
			seqId: Math.random() * 1000,
			timestamp: new Date().getTime()
		};
    	global.socket.ws.send(JSON.stringify(p));

	   //加载鱼的轨迹数据
	   	var xhr = new XMLHttpRequest();
 		xhr.onreadystatechange = function () {
     	if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
        	var response = xhr.responseText;
        	//console.log(response);

			//console.log('----')
			FishMath.fishpath = JSON.parse(response);
			//var data = JSON.parse(response);
			//console.log(data.ver);
		//	console.log(FishMath.fishpath.trail['1121'][2])
		
     	}
 	};
	 //xhr.open("GET", "http://192.168.2.173/assets/fish.trail.json", true);
	 xhr.open("GET", "http://118.190.89.153/assets/fish.trail.json", true);
 	xhr.send();

   },
    
    start:function(){            
    	// //初始化炮，跟据座位 设置炮位
    	// global.myseat =3;
	    // this.AddGun(global.myseat);
		  if(global.myseat>0 && global.myseat > 2) 	this.node.rotation =180;					
		 
    },

	  //消息处理
    MsgHandle:function(msg){

		// console.log(msg.data);
		 switch(msg.method){
          case 2002:   //1对1 聊天        
            break;
         
		  case 3002:  //进入房间消息     		
			break;			

		  case 3006://玩家退出
			this.DelGun(msg.data);
			break;
		
		case 5002:	//玩家发射子弹
			this.PlayerShot(msg.data);
		break;

		case 5004://接受爆炸消息
			this.GetFish(msg.data);
		break;

		  case 5006://进入场景的玩家已加载完毕
			//console.log('----------新建炮台--------------');    
			//console.log(msg.data);     
			this.AddGun(msg.data);
			break;
		 
		  case 5008://鱼同步消息
			this.SyncFish(msg.data);
			break;
		
		 case 5010://鱼潮
			//console.log('----------切换场景啦--------------');
			this.SwitchMap();
			break;

		 case 5012://使用道具
			this.UseProp(msg.data);
		  break;

		  case 5014://加减炮等级			
			this.SetGunType(msg.data);
		  break;

		  case 5016://解除道具
			this.ReleaseProp();
			break;

          default: 
           // console.log(data)
            break;       
        }
    },

    // update:function(dt){
    // //     //每帧处理 网络消息
    //     if(global.socket.msglist.length < 1) return;
    //    // console.log('--------------处理消息队列------------------'+ global.socket.msglist.length);
    //     for( let msg of global.socket.msglist){
    //         this.MsgHandle(msg);
    //         //console.log(msg);
    //         global.socket.msglist.pop();
    //     }
    // },
	
	onDestroy :function( ){

		this.node.targetOff(this);

		//global.pool_net.destroy();
		//global.pool_coin.destroy();
		//global.pool_bullet.destroy();
	},		
	AddGun:function(data){
		
		//console.log(  data);
		var userinfo = data[0];		

		//var group_info = data[1];
		//if(this._roominfo == null)
		this._roominfo = global.socket.MsgToObj(data[1]);
		global.backid = this._roominfo.back_id;

		
		data = data[2];//  座号1 ID1  座号2 ID2    座号3 ID3 .......				
		

		for(let i=0;i<data.length;i+=2){

			//s检测个人信息和坐位号是否合法
			//console.log(  global.myinfo);
			if(global.myinfo==null || global.myseat<0 || global.myseat >4) {			
				return false;
			}
			//检查是否是自己
			var seat = Number(data[i]);			

			//if( global.myinfo != null && data[i+1].split('::')[0] == global.myinfo.user_id  ){	
			if(global.myseat == seat){					
				//显示锁定和冰冻的数量
				global.ui.emit('settools');

				// if(global.myseat == 0){ //已设置过不再执行
				// 	global.myseat = data[i];					
				// 	if(global.myseat > 2) 	this.node.rotation =180;//自己座位号大于2 ，反转画面
				// }			
			}else{
				
				//添加其它玩家信息
				if(this._seatid[seat] != ''){

				}else{
					this._seatid[seat] = data[i+1].split('::')[0];					
				}
			}		
			var s = Number(data[i]-1);
			if(this.gunseat[s].active == false ){
				//console.log('---添加一个玩家的炮台' );			
				this.gunseat[s].active = true;			

				this.v_guns[s] = cc.instantiate(this.prefab[Ptype.GUN]);      
				this.v_guns[s].getComponent("gun").f_InitGun(data[i], this.node,this.gunseat[s].rotation-90,
															this.gunseat[s].x,this.gunseat[s].y);
				//this.gunseat[s].getChildByName("gun_lv_bg").zIndex = -1;
				//设置玩家面板信息
				var user ;
				for(let j =0;j<userinfo.length;j+=2){
					user = JSON.parse(userinfo[j]);
					if(user.id == this._seatid[seat]) break;
				}
				
				global.ui.emit('addplayer',{seat:data[i],name:'测试座号'+data[i],gold:user.score,diamond:0,level:1});//user.bullet_level}); 				
			}
		}	
		
		return true;
	},
	
	//去掉一个玩家的炮台
	DelGun:function(data){	
		var seat = 0;	
		//查找id对应的玩家坐位号
		for(let p of this._seatid){					
			if(p == data )	break;			
			seat++;
		}		

		if( seat == 0 || seat >4 ) 
			return false;
		else{
			this.v_guns[seat-1].destroy();
			this.v_guns[seat-1]=null;
			this.gunseat[seat-1].active = false;

			this._seatid[seat-1] ='';
			
			//删除对应ui
			global.ui.emit('delplayer',{seat:seat}); 	
			return true;	
		}	
	},		

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

	PlayerShot:function(data){
		var player =data[0];
		var bullet = global.socket.MsgToObj(data[1]);

		//console.log(data);
		//for( let i =0 ;i<data[1].length;i++)
		//	bullet[data[1][i]]= data[1][++i]; 
			
		if(player[0] == global.myid){
			//扣除金币
			global.ui.emit('setplayer',{seat:global.myseat,gold:player[1]});	
			//global.myinfo.score = Number(player[i]);			
			global.myinfo.score = player[1];
			//console.log(global.myinfo);
		} else{
			
			for(let i=1;i<5;i++){
				//取id 对应 座号	
				//console.log('---'+ i+'   ' +this._seatid[i]+ '  '+ player[0]);						
				if(this._seatid[i] == 	player[0] ){
					
					this.v_guns[i-1].emit( 'otherfire' ,{  	x:bullet.x*cc.Canvas.instance.node.width,
															y:bullet.y*cc.Canvas.instance.node.height,
															id: bullet.id}  );						
				
					//扣除金币
					global.ui.emit('setplayer',{seat:i,gold:player[1]});	
					break;
				}			
			}
		}          
	},

	Touch(event){		
		//console.log('-----------touch'+ event.getLocationX()+'    '+event.getLocationY());
		if(this.v_guns[global.myseat-1]==null) return;
		
		if(this.v_readylock) return;
		if(global.myinfo.score < global.mygunlv) return;
		let v2 = this.node.convertToNodeSpace( cc.v2( event.getLocationX(),event.getLocationY()));

		//console.log('----------- m pos ='+ v2 );		

		this.v_guns[global.myseat-1].emit( 'fire' ,{ x:v2.x,y:v2.y }  );
					
		//this.testgun.emit( 'otherfire' ,{ x:v2.x,y:v2.y }  );//{ x:event.getLocationX(),y:event.getLocationY() } );      	
	},
	
	TouchEnd(event){
		if(this.v_guns[global.myseat-1]==null) return;
		
		if(this.v_readylock) return;
		
		this.v_guns[global.myseat-1].emit( 'stopfire' );
	},
	
	InitNodePool:function(){

		global.pool_net= new C_NodePool();
		global.pool_net.f_Init(this.prefab[1],20);

		global.pool_coin= new C_NodePool();
		global.pool_coin.f_Init(this.prefab[2],20);

		global.pool_bullet = new C_NodePool();
		global.pool_bullet.f_Init(this.prefab[3],50);    	
	},		

	//碰撞事件处理
	Collider:function(event){		
		//生成鱼网  类型和初始位置		
		
		global.pool_net.f_GetNode(	this.node, event.detail.x, event.detail.y,0,
									this.v_netsprite[event.detail.type-1]).getComponent("net").f_InitNet( event.detail.type,
																										  event.detail.seat,this);				
		
		//不是自己的子弹打中的鱼不计算  不发送
		if(event.detail.seat != global.myseat)	return;

		//console.log(' ----客户端碰撞点 x ='+ event.detail.x +' y= '+event.detail.y);																								  
		//方式一    只传递子弹碰到的那一个鱼
		// this.v_server.emit('hitfish',{name:event.detail.fishname,
		// 							  seat:event.detail.seat,type:event.detail.type,
		// 							  x:event.detail.x/(this.node.width/2),y:event.detail.y/(this.node.height/2)});

		//console.log(this.node.width+'-----'+cc.Canvas.instance.node.width);

		//*//方式二    检测鱼网炸开范围内的鱼	--------------------------------	
		var netv = cc.v2(event.detail.x,event.detail.y);
		var dis = 0;
		var fishs = this.v_fishlayer.children;
		var catchfish = [];	

		for(let f of fishs)
		{
			dis = cc.pDistance(netv,cc.v2(f.x,f.y )) ;
			
			//最小鱼网半径 55，每级加 7
			//if(dis < 55 + 7*event.detail.type )
			//console.log('------'+dis+'  '+f.x+' '+f.y+'   '+ netv.x+'   '+netv.y);
			if(dis <70 )
			{
				catchfish.push(f.name);				

				//本地模拟
				// ---------抓 到鱼 取得金币--------------
				// if( cc.randomMinus1To1() >0 )
				// {
				// 	fishs[i].emit('dead');
				// 	var coin = this.v_coinpool.f_GetNode(this.node.parent,fishs[i].x,fishs[i].y);
					
					
				// 	var finished = cc.callFunc(this.f_CoinFinish, this, {node:coin,score:10});
				// 	var act = cc.sequence(cc.moveTo(1, -200, - this.node.height/2),finished);
				// 	coin.emit('GetCoin',{seat:event.detail.seat,action:act});

				// 	//this.scheduleOnce(function(){	coin.runAction(act);}, 1);					
				// 	//this.scheduleOnce( function() {	this.v_coinpool.f_PutNode(coin);
				// 	//								console.log('   加 10 金币');}, 1);							
				// }
				//-------------------------------------
			}
		}		
		//console.log(catchfish);
	//	*/
		if(catchfish.length==0) 	catchfish.push(event.detail.fishname);	

		var p = {
			version: 102,
			method: 5003,
			backendId: global.backid,//'112aba1ad4424e7891037028ef024645',//back_id,
			seqId: Math.random() * 1000,
			timestamp: new Date().getTime(),
			data: JSON.stringify( [{
				id: event.detail.id,//new Date().getTime(),
				x: event.detail.x/(this.node.width/2),
				y: event.detail.y/(this.node.height/2)},
				//[event.detail.fishname]]
				[catchfish]]
			)
		};
		global.socket.ws.send(JSON.stringify(p));			
		
		
		//向服务端发送鱼网炸开消息和范围内的鱼的信息
		//{send msg}
		//console.log('------这次抓了( '+catchfish.length+' )条鱼，名字是：( '+ catchfish.toString() +' )');			
	
	},
	//服器发来的鱼的消息------------
	InitFish:function(event){		
		
		//console.log('------id= '+event.detail.name+'     type= '+event.detail.type);
		var fish = cc.instantiate(this.v_fish[event.detail.type-1]);
		fish.parent = this.v_fishlayer;
		fish.name = 'fish'+event.detail.name;
		let v2 = cc.v2(event.detail.x*(this.node.width/2) ,event.detail.y*(this.node.height/2));
		
		fish.setPosition(v2);	
		fish.rotation = event.detail.r;		

		//boss不设R
		if(event.detail.type >=18)	{
			fish.rotation =0;
			if(global.myseat>2) fish.scaleY = -1;
		}
	},
	//重置 
	RestFish:function(event){
		var f = this.v_fishlayer.children
		for(var i =0;i<f.length;i++)
			if(f[i].name == 'fish'+event.detail.name){	
				f[i].stopAllActions();
				f[i].setPosition(event.detail.x*(cc.Canvas.instance.node.width/2) ,event.detail.y*(cc.Canvas.instance.node.height/2));	
				f[i].rotation = event.detail.r;
				//boss不设R
				if(event.detail.type >=18){
					f[i].rotation =0;
					if(global.myseat>2) f[i].scaleY = -1;
				}
				continue;
			}	
	},
	//同步
	SyncFish:function(data){
		// id: CreatUUID(1),
		// type: 0,
		// path: 0,
		// step: 0,
		// max: 222,
		// loop: true,
		// weight: 15
		//console.log('同步鱼');
		var a = {};


		// var str ='{';	
		// var i=0;
		for(let f of this.v_fishlayer.children){
			// str +='"'+ f.name+'":'+i+',';
			// i++;

			a[f.name] = i;
		}
		// str +='}';

		// console.log(str);
		// var list  =JSON.parse(str);

		var list = a;

		for(let d of data){
			
			// var ishave = false;
			// for(let f of this.v_fishlayer.children){
			// 	if(f.name == ( d.id+'' )) {
			// 		ishave = true;
			// 		break;
			// 	}
			// }

			//if(!ishave){
			if( typeof(list[d.id+'']) == 'undefined'){
				var fish = cc.instantiate(this.v_fish[ d.type+4]);
				fish.parent = this.v_fishlayer;		
				fish.name = d.id+'';		
				fish.emit('loadpath',{pathid:d.path,offstep:d.step,isloop:d.loop});	
				//fish.emit('loadpath',{pathid:'1121',offstep:d.step});	
			}	
			else{
				this.v_fishlayer.children[list[d.id+'']].emit('synchro',{step:d.step});
				//console.log('-----------'+d.step);

			}	
		}
	},
	//SyncFish:function(event){
		
		// var f = this.v_fishlayer.children
		// for(var i =0;i<f.length;i++)
		// 	if(f[i].name == 'fish'+event.detail.name){				
		// 		//f[i].emit('move',{x:event.detail.x*(cc.Canvas.instance.node.width/2) ,y:event.detail.y*(cc.Canvas.instance.node.height/2),r:event.detail.r);				
		// 		//f[i].stopAllActions();
					
		// 			//boss不设R,只设左右
		// 		if(event.detail.type >=18)	{
		// 			if(event.detail.x*(this.node.width/2) > f[i].x) f[i].scaleX =1;
		// 			else f[i].scaleX =-1;
		// 			f[i].runAction(cc.moveTo(0.25, event.detail.x*(this.node.width/2) ,event.detail.y*(this.node.height/2)));							
		// 		}else		
		// 			f[i].runAction(cc.spawn(cc.moveTo(0.25, event.detail.x*(this.node.width/2) ,event.detail.y*(this.node.height/2)),
		// 						cc.rotateTo (0.25,event.detail.r)));
				
		// 		//console.log('  ---鱼的位置 '+ event.detail.x*(this.node.width/2) +'   '+event.detail.y*(this.node.height/2));
		// 	}
	//},
	//捕到
		GetFish:function(data){
		var seat = this.GetPlayerSeat(data[1]);
		
		if(global.myseat>2){
    		if(seat > 2) seat -= 2;
    		else seat += 2;
		}	

		data =data[0];
		// console.log(data.fish_id);
		// console.log(data.tools[0].num);
		// console.log(data.tools[0].type);
		
		 let f = this.v_fishlayer.children
		for(let i =0;i<f.length;i++)
			if(f[i].name == data.id){		
				//消除该鱼				
				f[i].emit('dead');		

				//this.Lightning();		
					
				//播放金币声音
				var that = this;
				cc.audioEngine.setFinishCallback(cc.audioEngine.play(this.v_sound[0], false, 1), function () {   cc.audioEngine.play(that.v_sound[1], false, 0.7) });
				
				//console.log('  ---金币产生点='+ f[i].getPosition());
				
				if(data.money>0){//掉落的物品为金币

					var v2 = f[i].getPosition()	;
					if(this.node.rotation ==180){
						v2.x = -v2.x;
						v2.y = -v2.y;
					}
					
					//生成金币文字
					var ct = cc.instantiate(this.prefab[4]);
					ct.getComponent("cc.Label").string = data.money.toString();
					ct.parent = cc.Canvas.instance.node;
					ct.setPosition(v2.x+10,v2.y+30);				
					ct.runAction( cc.spawn (cc.moveTo(1, v2.x+10,v2.y+30+20),cc.fadeOut (1)) );
					
					var that  = this;
					var len = cc.pDistance(v2,that.gunseat[seat-1].getPosition())/400;
					//生成金币		
					var coins =10;
					if(data.money>100) conis =100;
					if(data.money>1000) conis =1000;
					if(data.money>10000) conis =10000;
					for(let j=0;j<data.money/coins;j++){							
						var coin = global.pool_coin.f_GetNode(this.node,v2.x+j*20,v2.y);					
						
						var finished = cc.callFunc(this.CoinFinish, this, {coin:coin,text:ct});
						//根据坐位确定金币去向
						//if(msg.seat ==1)gunseat
						
						var act = cc.sequence(cc.moveTo(len, that.gunseat[seat-1].x,that.gunseat[seat-1].y),finished);
						//var act = cc.sequence(cc.moveTo(1, -200, - this.node.height/2),finished);
						coin.emit('GetCoin',{action:act});	
					}
				}							
			}
	},
	// GetFish:function(event){
	// 	let msg = event.detail;
	// 	let f = this.v_fishlayer.children
	// 	for(let i =0;i<f.length;i++)
	// 		if(f[i].name == 'fish'+msg.id){		
	// 			//消除该鱼				
	// 			f[i].emit('dead');		

	// 			//this.Lightning();		
					
	// 			//播放金币声音
	// 			var that = this;
	// 			cc.audioEngine.setFinishCallback(cc.audioEngine.play(this.v_sound[0], false, 1), function () {   cc.audioEngine.play(that.v_sound[1], false, 0.7) });
				
	// 			//console.log('  ---金币产生点='+ f[i].getPosition());
				
	// 			var v2 = f[i].getPosition()	;
	// 			if(this.node.rotation ==180){
	// 				v2.x = -v2.x;
	// 				v2.y = -v2.y;
	// 			}
				
	// 			//生成金币文字
	// 			var ct = cc.instantiate(this.prefab[4]);
	// 			ct.getComponent("cc.Label").string = msg.coin.toString();
	// 			ct.parent = cc.Canvas.instance.node;
	// 			ct.setPosition(v2.x+10,v2.y+30);				
	// 			ct.runAction( cc.spawn (cc.moveTo(1, v2.x+10,v2.y+30+20),cc.fadeOut (1)) );
				
	// 			//生成金币		
	// 			for(let j=0;j<msg.coin/10;j++){							
	// 				var coin = global.pool_coin.f_GetNode(this.node,v2.x+j*20,v2.y);					
					
	// 				var finished = cc.callFunc(this.CoinFinish, this, {coin:coin,text:ct});
	// 				//根据坐位确定金币去向
	// 				//if(msg.seat ==1)
	// 				var act = cc.sequence(cc.moveTo(1, -200, - this.node.height/2),finished);
	// 				coin.emit('GetCoin',{action:act});	
	// 			}			
	// 		}
	// },
	//----------------------------------------
	LockFish:function(event){   //fish   seat
		if(!this.v_readylock) return;
		console.log(' ------开始锁定------');
		this.v_guns[global.myseat-1].emit('lockfish',{fish:event.detail.fish});
	},
	CancelLock:function(){  //seat
		console.log(' ------取消锁定------');//被锁定的鱼被打死
		this.v_guns[global.myseat-1].emit('cancellock');
		//this.v_readylock = true;
	},
	
	UnLockFish:function(){   //seat
		console.log(' ------解除锁定------');
		this.v_guns[global.myseat-1].emit('unlockfish');
		this.v_readylock = false;

		var effect = this.gunseat[global.myseat-1].getChildByName("effect2");
		if(effect!=null)	effect.active = false;
	},
	
	CoinFinish:function(target,data){
	
		global.pool_coin.f_PutNode(data.coin);
		data.text.destroy();
		//console.log('   加 '+ data.score+' 金币');
	},    	
  
    //------------
    KillFish:function(seat,fishs){
        
    },
	
	Exploded:function(seat,pos,bulletid){
        
    },
   
    f_Fire:function(seat,dir){
        
    },
	//使用道具
	UseProp:function(data){
		//console.log(data);
		var seat = this.GetPlayerSeat(data[0]);
		var num = data[1];
		var type = data[2];
		
		if(seat == global.myseat)
			global.myinfo.tool_1 = num;

		global.ui.emit('freeze');
	
		switch(type){
			case 1://冰冻			
			//如果是自己，自己的道具数减1 
			//
			for(var f of this.v_fishlayer.children)
				f.emit('freeze');
			break;

			case 2://锁定
			break;
		}
	},

	ReleaseProp:function(){
		//console.log(data);
		for(var f of this.v_fishlayer.children)
				f.emit('unfreeze');
	},

	SetGunType:function(data){			
		//console.log(data);
		var lv = data[1];
		var seat = this.GetPlayerSeat(data[0]);		

		global.ui.emit('setgunlevel',{seat:seat,level:lv});		
		if(lv>6) lv =6;

		if(seat == global.myseat)
			global.mygunlv = lv;		
		
		//给对应炮发消息，改变类型
		this.v_guns[seat-1].emit('changetype',{type:lv});	
		 
		var effect = this.gunseat[seat-1].getChildByName("effect");
		if(effect!=null){
			effect.active = true;
			effect.getComponent("cc.Animation").play();
		};		
	} ,


	//------------------特效类-----------------------------
	//冰冻

	//BOSS 警告
	BossWarning:function(){
		var n =this.node.getChildByName('bosswarning');
		cc.audioEngine.play(this.v_sound[Audiotype.WARNING], false, 0.7);
		n.active = true;

		var act = cc.repeat ( cc.sequence( cc.fadeTo(0.8, 125), 
                                           cc.fadeTo(0.8, 255)   ),3); 
		n.runAction( cc.sequence( act,cc.callFunc(function(){
			n.active = false;
		})));
	},

	//切换地图
	SwitchMap:function(){
		this.bgmag.emit('changemap');

		//this.v_server.getComponent('Server')._pause= true;
		//让鱼隐藏
		if(this.v_fishlayer.childrenCount< 1) return;
		for(let fish of this.v_fishlayer.children){
			fish.emit('hide');
		}
	},

	//大奖转盘
	Reward:function(seat){

		var n = cc.instantiate(this.prefab[Ptype.REWARD]);
		n.parent =this.node;
		if(global.myseat>2) n.rotation = 180;
		n.setPosition(0,0);

		// switch(seat)
		// {
		// 	case 1:
		// 		n.setPosition(0,0);
		// 		break;
		// }

		n.emit('show',{id:1,num:5000});
	},

	//boss 奖
	BossReward:function(){
		var n = cc.instantiate(this.prefab[Ptype.BOSSREWARD]);
		n.parent =global.ui;	
		n.setPosition(0,0);

		var num =n.getChildByName('num');
		num.scaleX = num.scaleY =0.25;
		num.opacity =1;
		num.runAction(cc.spawn(cc.scaleTo(0.5,1,1),cc.fadeTo(0.5,255)));
		var label =num.getComponent(cc.Label);
		label.string = '2000';		
		label.scheduleOnce(function() {
    		 this.node.parent.destroy();
 		}, 3);
		
	},

	//连锁闪电效果
	Lightning:function(){
		//遍历鱼，在鱼之间生成闪电

		if(this.v_fishlayer.childrenCount<2) return;
		//闪电音效
		cc.audioEngine.play(this.v_sound[Audiotype.LIGHTNING], false, 0.7);

		var sp = this.v_fishlayer.children[0].getPosition();
		var ep = sp; 
		//var fish = this.v_fishlayer.children;
		for(let i=1;i< this.v_fishlayer.childrenCount;i++){
			ep = this.v_fishlayer.children[i].getPosition();
			var v =cc.v2(ep.x - sp.x, ep.y - sp.y);
			//计算两点距离
			var l =	cc.pLength (v);
			//计算两点角度
			var r =cc.radiansToDegrees (cc.pToAngle(v)); 
			if(v.y>0) r= -Math.abs(r);
			else r = Math.abs(r);
			//生成闪电链
			var n = cc.instantiate(this.prefab[Ptype.LIGHTNING]);
			n.parent = this.node;
			n.setPosition(sp);
			n.rotation = r;
			n.scaleX = l/n.width;
			n.setSiblingIndex(1);
			
			//生成闪电球
			var n2 = cc.instantiate(this.prefab[Ptype.LIGHTNINGBALL]);
			n2.parent = this.node;
			n2.setPosition(ep);
			//n2.setSiblingIndex(n2.getSiblingIndex()+ this.v_fishlayer.childrenCount);
			
			
			//console.log('----'+n.getSiblingIndex()+'---'+n2.getSiblingIndex())
			
			//console.log('----['+ sp +']----['+ ep+ ']----['+v+']----['+ r +']----['+ l+']------['+ cc.pDistance(sp,ep) );

			sp = ep;

			n.getComponent('cc.Sprite').scheduleOnce(function() {
				this.node.destroy();
			}, 2);
			n2.getComponent('cc.Sprite').scheduleOnce(function() {
				this.node.destroy();
			}, 2);
		}
	},

	CreatFishGroup:function(){
	
		for(let i=0;i<10;i++){
		
			var fish = cc.instantiate(this.v_fish[4]);
			fish.parent = this.v_fishlayer;	
			
			fish.emit('loadpath',{pathid:'1121',offstep:i*10});
		}
	},

	test:function(data){
		console.log('============================='+data.method);
	},

	//跟据id变换为坐号
	GetPlayerSeat:function(id){
		var seat =0;
		if(global.myid == id){
			seat = global.myseat;
		}else{
			//查找座号				
			for(let i=1;i<5;i++){				
				if(this._seatid[i] == id){
					seat = i;				
					break;
				}
			}
		}	
		return seat;
	},

});
