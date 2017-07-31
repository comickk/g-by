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
	BIGFISHDEAD:-1,
	PROP:-1
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
		
		//AC:cc.Node,
		//v_server:cc.Node,		
		
		fishlayer:cc.Node,	
		delfishlayer:cc.Node,	

		bgmag:cc.Node,	
		
		//--------------	
		v_guns:[cc.Node],
		prefab:[cc.Prefab],  //0  炮    1 网    2 金币	3 子弹  4 金币文字  5  奖金转盘     6 闪电链   7 闪电球  8 BOSS奖转盘 9 大鱼死亡爆炸效果 10掉落道具

		gunseat:[cc.Node],		
		
		v_fish:[cc.Prefab],        
		
		//渔网图
		v_netsprite:[cc.SpriteFrame],			
	  
		// 准备锁鱼		
		_readylock:false,					
		//_playerinfo:[],
		_seatid:[],
		_roominfo:null,
		
		_gunstyle:null,
		_gunstyle_fixed:1,

		//_playerinfo:[],
		//----------------测试
		log:cc.Label,
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

		var that =this;	

		//子弹碰撞
		this.node.on('collider',this.Collider,this);		
		//this.node.on('setgun',this.SetGunType,this);

		//锁鱼
		// this.node.on('readylock',function(){ this.v_readylock = !this.v_readylock;
		// 	if(!this.v_readylock) this.f_UnLockFish();
		// },this);
		
		//接收按钮信息，开始锁鱼时间，技能进入CD-------
		this.node.on('lockstart',function(){ 
			this._readylock = true;
			var effect = this.gunseat[global.myseat-1].getChildByName("effect2");
			if(effect!=null)	effect.active = true;				
		},this);

		//选中一条鱼
		this.node.on('lockfish',this.LockFish,this);
		this.node.on('lockend',this.UnLockFish,this); //锁定时间结束
		this.node.on('cancellock',this.CancelLock,this); 
		//----------------------


		this.node.on('ready',function(){
			if(!cc.isValid(this._gunstyle) || !cc.isValid(FishMath.fishpath))	return;		

			if(cc.isValid(global.socket)){//发送准备信息
				global.socket.controller = this;
				//发送准备完毕消息
				var p = {
					version: 102,
					method: 5005,
					seqId: Math.random() * 1000,
					timestamp: new Date().getTime()
				};
				global.socket.ws.send(JSON.stringify(p));
			}
		},this);
		
		
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
	
	   
	   //加载鱼的轨迹数据-----------------
	   	var xhr1 = new XMLHttpRequest();
 		xhr1.onreadystatechange = function () {
     	if (xhr1.readyState == 4 && (xhr1.status >= 200 && xhr1.status < 400)) {
        	var response = xhr1.responseText;
        	//console.log(response);

			//console.log('----')
			FishMath.fishpath = JSON.parse(response);
			//var data = JSON.parse(response);
			//console.log(data.ver);
			//	console.log(FishMath.fishpath.trail['1121'][2])

		 	that.node.emit('ready');
		
     	}
 	};
	 //xhr.open("GET", "http://192.168.2.173/assets/fish.trail.json", true);
	 xhr1.open("GET", "http://"+global.socket.URL +"/assets/fish.trail.json?"+new Date().getTime(), true);
	 xhr1.send();
	 
	 //读取炮样式-----------
	
	  var xhr2 = new XMLHttpRequest();
	 xhr2.onreadystatechange = function () {
     	if (xhr2.readyState == 4 && (xhr2.status >= 200 && xhr2.status < 400)) {
        	var response = xhr2.responseText;
			
			that._gunstyle = JSON.parse(response);					
			
			that.node.emit('ready');
     	}
 	};	
	xhr2.open("GET", "http://"+global.socket.URL +"/client/cfg/bullet?"+new Date().getTime(), true);
	xhr2.send();

	//this._log = cc.find('console').getComponent(cc.Label);	

   },
    
    start:function(){            
    	// //初始化炮，跟据座位 设置炮位
    	// global.myseat =3;
		// this.AddGun(global.myseat);			

		if(global.myseat>0 && global.myseat > 2) 	this.node.rotation =180;		 
		
		//cc.log('---------start finish----------');
    },

	  //消息处理
    MsgHandle:function(msg){

		// console.log(msg.data);
		 switch(msg.method){
          case 2002:   //1对1 聊天        
			break;
		case 2004://群聊
			//data [0]用户信息  [1]发送的文字内容			
			this.PlayerChat(msg.data);
	
			break;
         
		  case 3002:  //进入房间消息     		
			break;			

		  case 3006://玩家退出
			this.DelGun(msg.data);
			break;
		
		case 5002:	//玩家发射子弹
			//console.log(msg.data);
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

		if(!cc.isValid(global.myinfo) || global.myseat<0 || global.myseat >4) {	
			global.ui.emit('error',{msg:'未能与服务器同步,请重新登录'});		
			return ;
		}		
		
		var userinfo = data[0];				

		//var group_info = data[1];
		//if(this._roominfo == null)
		this._roominfo = global.socket.MsgToObj(data[1]);		
		global.backid = this._roominfo.back_id;

		this._gunstyle_fixed = this.GetGunStyle(this._roominfo.type);

		
		data = data[2];// [0]座号1  [1]ID1   [2]座号2   [3]ID2 .......			
		
		//s检测个人信息和坐位号是否合法					

		//遍历该桌玩家信息
		for(let i=0;i<data.length;i+=2){			
		
			var id =data[i+1].split('::')[0];
			var seat = data[i]-0;	
			var s = seat-1;
			
			if(!this.gunseat[s].active){//座上没人			
				
				if(global.myseat == seat){			//检查是否是自己		
					
					//检查是否已加载鱼轨迹和炮台 配置					
					if(!cc.isValid(this._gunstyle.data) || !cc.isValid(FishMath.fishpath.data)){
						global.ui.emit('error',{msg:'读取配置文件失败,请重新登录'});												
						return;
					}					

					//显示锁定和冰冻的数量
					var cost = this.GetPropCost(this._roominfo.type);		
						
					global.ui.emit('settools',{ice:cost,lock:cost});							
				}else{
					this._seatid[seat] = id;//data[i+1].split('::')[0];						
				}
				
				//取出玩家信息
				var user ;
				var level=1;
				for(let j =0;j<userinfo.length;j+=3){
					user = JSON.parse(userinfo[j]);
					if(user.id == id ){// 
						level = userinfo[j+2]-0;//取得炮等级 
						if(user.id == global.myid)								
							global.mygunlv =level;						
						break;						
					}						
				}
				//cc.log(user);						

				var style = this._gunstyle_fixed;
				//if( cc.isValid( this._gunstyle.data[level-1])) 
				//	style = this._gunstyle.data[level-1].style;
				this.v_guns[s] = cc.instantiate(this.prefab[Ptype.GUN-0]);      
				this.v_guns[s].getComponent('gun').f_InitGun(seat,style, this.node,this.gunseat[s].rotation-90,
					this.gunseat[s].x,this.gunseat[s].y);

				
				//设置玩家面板信息			
				// cc.log('玩家加入 '+seat);
				// cc.log('-----'+ this._gunstyle.data[level-1].cost);
				// cc.log('-----'+ this._gunstyle.data[user.bullet_level-1].cost);

				this.gunseat[s].active = true;	//console.log('---添加一个玩家的炮台' );

				// var s = JSON.stringify(this._gunstyle.data);
				// this.log.string='-------1------------\n';
				// this.log.string+= s+'\n';
			
				global.ui.emit('addplayer',{seat:seat,name:user.nickname,gold:user.score,diamond:user.diamond,
					lv_curr: this._gunstyle.data[level-1].cost,lv_max:this._gunstyle.data[user.bullet_level-1].cost});
			}
		}					
		return;
	},
	
	//去掉一个玩家的炮台
	DelGun:function(data){	
		var seat = this.GetPlayerSeat(data);

		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  DelGun  '+ seat+'  '+ data);
			return false;
		}else{
			if(!cc.isValid(this.v_guns[seat-1])  ){
				console.log('炮台数据错误 '+'  DelGun  this.v_guns'+ (seat-1).toString());
				return false;
			}					
			this.v_guns[seat-1].destroy();
			this.v_guns[seat-1]=null;

			this.gunseat[seat-1].active = false;
			this._seatid[seat] ='';
			
			//删除对应ui
			global.ui.emit('delplayer',{seat:seat}); 
			
			cc.log('玩家退出  '+data+'  '+seat);
			return true;	
		}	
	},		

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

	PlayerShot:function(data){
		//console.log(data);
		//var player =data[0];
		var bullet = global.socket.MsgToObj(data);

		//console.log(bullet);
		//for( let i =0 ;i<data[1].length;i++)
		//	bullet[data[1][i]]= data[1][++i]; 
			
		if(bullet.user_id == global.myid){
			//扣除金币
			global.ui.emit('setplayer',{seat:global.myseat,gold:bullet.user_score});	
			//global.myinfo.score = Number(player[i]);			
			global.myinfo.score =bullet.user_score-0;
			//console.log(global.myinfo);
		}else{
			var seat = this.GetPlayerSeat(bullet.user_id);	
			if(seat<1 || seat >4){
				console.log('坐号错误 '+'  PlayerShot  '+ seat+'  '+ bullet.user_id);
				return;
			} 	
			
			if(!cc.isValid(this.v_guns[seat-1] ) ){
				console.log('炮台数据错误 '+'  PlayerShot  this.v_guns '+ (seat-1).toString());
				return ;
			}	
			this.v_guns[seat-1].emit( 'otherfire' ,{  	x:bullet.x*cc.Canvas.instance.node.width,
														y:bullet.y*cc.Canvas.instance.node.height,
														id: bullet.id}  );		
			//扣除金币
			global.ui.emit('setplayer',{seat:seat,gold:bullet.user_score});					
		}          
	},

	Touch(event){		
		//console.log('-----------touch'+ event.getLocationX()+'    '+event.getLocationY());	
		//if(this.v_guns[global.myseat-1]==null) return;	
		
		if(this._readylock) return;
		
		if(global.myinfo.score <   this._gunstyle.data[global.mygunlv-1].cost) {
			//console.log('-----------  4'+  typeof(global.myinfo.score) +'  '+ typeof(global.mygunlv));	
			return;
		}
		
		let v2 = this.node.convertToNodeSpace( cc.v2( event.getLocationX(),event.getLocationY()));

		//console.log('----------- m pos ='+ v2 );		

		this.v_guns[global.myseat-1].emit( 'fire' ,{ x:v2.x,y:v2.y }  );
		
		//this.testgun.emit( 'otherfire' ,{ x:v2.x,y:v2.y }  );//{ x:event.getLocationX(),y:event.getLocationY() } );      	
	},
	
	TouchEnd(event){
		
		if(!cc.isValid(this.v_guns[global.myseat-1])) return;
		
		
		if(this._readylock) return;
		
		this.v_guns[global.myseat-1].emit( 'stopfire' );		
	},
	
	InitNodePool:function(){

		global.pool_net= new C_NodePool();
		global.pool_net.f_Init(this.prefab[Ptype.NET],20);

		global.pool_coin= new C_NodePool();
		global.pool_coin.f_Init(this.prefab[Ptype.COIN],20);

		global.pool_bullet = new C_NodePool();
		global.pool_bullet.f_Init(this.prefab[Ptype.BULLET],50);    	
	},		

	//碰撞事件处理
	Collider:function(event){		
		//生成鱼网  类型和初始位置		
		
		global.pool_net.f_GetNode(	this.node, event.detail.x, event.detail.y,0,
									this.v_netsprite[event.detail.type-1]).getComponent("net").f_InitNet( event.detail.type,
																										  event.detail.seat,this);				
		
		//不是自己的子弹打中的鱼不计算  不发送
		if(event.detail.seat-0 != global.myseat)	return;

		//console.log(' ----客户端碰撞点 x ='+ event.detail.x +' y= '+event.detail.y);																								  
		//方式一    只传递子弹碰到的那一个鱼
		// this.v_server.emit('hitfish',{name:event.detail.fishname,
		// 							  seat:event.detail.seat,type:event.detail.type,
		// 							  x:event.detail.x/(this.node.width/2),y:event.detail.y/(this.node.height/2)});

		//console.log(this.node.width+'-----'+cc.Canvas.instance.node.width);

		//*//方式二    检测鱼网炸开范围内的鱼	--------------------------------	
		var netv = cc.v2(event.detail.x,event.detail.y);
		var dis = 0;
		var fishs = this.fishlayer.children;
		var catchfish = [];	

		
	//	for(let f of fishs)
		for(let i=0;i<fishs.length;i++)
		{
			let f =fishs[i];
			
			dis = cc.pDistance(netv,cc.v2(f.x,f.y )) ;
			
			//最小鱼网半径 55，每级加 7
			//if(dis < 55 + 7*event.detail.type )
			//console.log('------'+dis+'  '+f.x+' '+f.y+'   '+ netv.x+'   '+netv.y);
			if(dis <70 )
			{
				//f.emit('test',{x:netv.x,y:netv.y});
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
	//	console.log(catchfish);
		
		//向服务端发送鱼网炸开消息和范围内的鱼的信息
		//{send msg}
		//console.log('------这次抓了( '+catchfish.length+' )条鱼，名字是：( '+ catchfish.toString() +' )');			
	
	},
	//服器发来的鱼的消息------------
	InitFish:function(event){		
		
		//console.log('------id= '+event.detail.name+'     type= '+event.detail.type);
		var fish = cc.instantiate(this.v_fish[event.detail.type-1]);
		fish.parent = this.fishlayer;
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
		var f = this.fishlayer.children
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
		
		var list = {};

		
		//for(let f of this.fishlayer.children){
		for(let i = 0;i<this.fishlayer.children.length;i++)	{
			let f = this.fishlayer.children[i];		
			list[f.name] = i;
		//	i++;
		}	

		//for(let d of data){
		for(let i=0;i<data.length;i++){
			let d = data[i];
			if(d.type <0  || d.type >23 ){
				console.log('--SyncFish   类型错误--'+ d.type);
				
				continue;
			}			
		
			if( !cc.isValid(list[d.id+'']) ){
				
				//console.log('鱼的等级为 '+d.type);
				var fish = cc.instantiate(this.v_fish[ d.type-0]);
				var attrs = { fishtype: d.type };
				fish.attr(attrs);
				fish.parent = this.fishlayer;		
				fish.name = d.id+'';		
				fish.emit('loadpath',{type:d.type,pathid:d.path,offstep:d.step,isloop:d.loop});	
				//fish.emit('loadpath',{pathid:'1121',offstep:d.step});	
			}	
			else{
				
				if(this.fishlayer.children[i])
					this.fishlayer.children[i].emit('synchro',{step:d.step});
				//console.log('-----------'+d.step);
			}	
		}
	},
	//SyncFish:function(event){
		
		// var f = this.fishlayer.children
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


	CoinFinish:function(target,data){
		global.ac.emit('getcoin');
		global.pool_coin.f_PutNode(data.coin);
		data.text.destroy();
		//console.log('   加 '+ data.score+' 金币');
	},    

	//捕到
	GetFish:function(data){
		//console.log(data);
		var seat =  this.GetPlayerSeat(data[0]);
		
		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  GetFish  '+ seat+'  '+ data[0]);
			return;
		} 
		var s = seat;
		if(global.myseat>2){
    		if(seat > 2) seat -= 2;
    		else seat += 2;
		}	

		//data =data[0];
		// console.log(data.fish_id);
		// console.log(data.tools[0].num);
		// console.log(data.tools[0].type);
		var delfish=[];
		 let f = this.fishlayer.children
		for(let i =0;i<f.length;i++)
			if(f[i].name == data[1]){						

				//this.Lightning();		
					
				//播放金币声音
				var that = this;
				global.ac.emit('popcoin');				
				
				//console.log('  ---金币产生点='+ f[i].getPosition());
				
				if(data[2]>0){//掉落的  金币

					var v2 = f[i].getPosition()	;
					if(this.node.rotation ==180){
						v2.x = -v2.x;
						v2.y = -v2.y;
					}
					
					//生成金币文字
					var ct = cc.instantiate(this.prefab[Ptype.COINNUM-0]);
					ct.getComponent("cc.Label").string = data[2].toString();
					ct.parent = cc.Canvas.instance.node;
					ct.setPosition(v2.x+10,v2.y+30);				
					ct.runAction( cc.spawn (cc.moveBy(1.5, 0,50),cc.fadeOut (1.5)) );
					
					var that  = this;
					var len = cc.pDistance(v2,that.gunseat[seat-1].getPosition())/600;
					//生成金币		及数量
					var coins =1;
					if(data[2]>=10) coins =10;
					if(data[2]>=100) coins =100;
					if(data[2]>=1000) coins =1000;
					if(data[2]>=10000) coins =10000;
					for(let j=0;j<data[2]/coins;j++){							
						var coin = global.pool_coin.f_GetNode(this.node,v2.x+j*20,v2.y);					
						
						var finished = cc.callFunc(this.CoinFinish, this, {coin:coin,text:ct});
						//根据坐位确定金币去向
						//if(msg.seat ==1)gunseat
						
						var act = cc.sequence(cc.moveTo(len, that.gunseat[seat-1].x,that.gunseat[seat-1].y),finished);
						//var act = cc.sequence(cc.moveTo(1, -200, - this.node.height/2),finished);
						coin.emit('GetCoin',{action:act});	
					}
					if(!cc.isValid(f[i])){
						cc.log('一条不存在的鱼');
						continue;
					}
					if(data[0] == global.myid)
						global.ac.emit('dead',{type:f[i].fishtype});					


					if((data[4]-0)>0){
							var jj = cc.instantiate(this.prefab[Ptype.PROP-0]);						
							jj.parent = cc.Canvas.instance.node;
							jj.setPosition(v2.x+10,v2.y+30);						
							jj.emit('pop',{type:1,num:data[4]-0,x:this.gunseat[seat-1].x,y:this.gunseat[seat-1].y});
					}

					//爆炸闪光特效
					if(f[i].fishtype ){
						if(f[i].fishtype >12 ){	
						//大鱼死亡爆炸效果
						var e = cc.instantiate(this.prefab[Ptype.BIGFISHDEAD-0]);
						e.parent =this.node;	
						e.setPosition(f[i].getPosition());
						}	
						//奖金特效
						if(f[i].fishtype >17 ){						

							//console.log('-奖金 鱼类型 '+ f[i].fishtype);
							if(f[i].fishtype == 24){
								if(s== global.myseat)
									this.BossReward(data[2]);
							}else{
								this.Reward(seat,f[i].fishtype,data[2]);
							}						
						} 

						// if( Math.random()>0.6){
						// 	var jj = cc.instantiate(this.prefab[Ptype.PROP-0]);						
						// 	jj.parent = cc.Canvas.instance.node;
						// 	jj.setPosition(v2.x+10,v2.y+30);			
							
						// 	jj.emit('pop',{type:1,num:2,x:this.gunseat[seat-1].x,y:this.gunseat[seat-1].y});
						// }
					}
					global.ui.emit('setplayer',{seat:seat,gold:data[3]});			
				}	
				
				//消除该鱼				
				delfish.push(f[i]);//f[i].emit('dead');	
			}

			for(let i=0;i<delfish.length;i++)
				delfish[i].emit('dead');
	},

	//----------------------------------------
	LockFish:function(event){   //fish   seat
		if(!this._readylock) return;
		console.log(' ------已锁定一条鱼------');
		this.v_guns[global.myseat-1].emit('lockfish',{fish:event.detail.fish});
	},
	CancelLock:function(){  //seat
		console.log(' ------取消锁定------');//被锁定的鱼被打死
		this.v_guns[global.myseat-1].emit('cancellock');
		//this._readylock = true;
	},
	
	UnLockFish:function(){   //seat
		console.log(' ------锁定时间结束------');
		this.v_guns[global.myseat-1].emit('unlockfish');
		this._readylock = false;

		var effect = this.gunseat[global.myseat-1].getChildByName("effect2");
		if(effect!=null)	effect.active = false;
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
		console.log(data);
		var seat = this.GetPlayerSeat(data[0]);
		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  UseProp  '+ seat+'  '+ data[0]);
			return;
		} 
		var num = data[1];
		var type = data[2];
		
		if(seat == global.myseat)
			global.myinfo.tool_1 = num;	
	
		switch(type){
			case 1://冰冻			
			//如果是自己，自己的道具数减1 
			//
			//for(var f of this.fishlayer.children)
			global.ui.emit('freeze',{seat:seat,num:num,type:type});
			global.ac.emit('freeze');
			for(let i=0;i<this.fishlayer.children.length;i++)
				this.fishlayer.children[i].emit('freeze');//f.emit('freeze');
			break;

			case 2://锁定
			break;
		}
	},

	ReleaseProp:function(){
		//console.log(data);
		for(let i=0;i<this.fishlayer.children.length;i++)
				this.fishlayer.children[i].emit('unfreeze');
		// for(var f of this.fishlayer.children)
		// 		f.emit('unfreeze');
	},

	SetGunType:function(data){			
		
		var lv = data[1];
		var seat = this.GetPlayerSeat(data[0]);	

		if(seat<1 || seat >4){
			console.log('坐号错误 '+'  SetGun  '+ seat+'  '+ data[0]);
			return;
		} 

		if(lv>this._gunstyle.data.length) lv =this._gunstyle.data.length;
		global.ui.emit('setgunlevel',{seat:seat,level:this._gunstyle.data[lv-1].cost});			

		if(seat == global.myseat)
			global.mygunlv =lv-0;		
		
		//给对应炮发消息，改变类型
		//console.log(this._gunstyle);
		//7-30炮样式以房间类型和VIP等级决定
		var style = this._gunstyle_fixed;
		//if(this._gunstyle.data[lv-1].style>0)
		//	style = this._gunstyle.data[lv-1].style;
		//console.log('-----------'+style);

		this.v_guns[seat-1].emit('changetype',{type:style});	
		 
		var effect = this.gunseat[seat-1].getChildByName("effect");
		if(effect!=null){
			effect.active = true;
			effect.getComponent("cc.Animation").play();
		};		
	} ,

	PlayerChat:function(data){		
		var user =JSON.parse(data[0]);
		var seat = this.GetPlayerSeat(user.id);	
		//cc.log(user);	
		global.ui.emit('chat',{seat:seat,nick:user.nickname,msg:data[1]});
	},

	CloseSocket:function(){		
		global.ui.emit('socketclose');
	},


	//------------------特效类-----------------------------
	//冰冻

	//BOSS 警告
	BossWarning:function(){
		var n =this.node.getChildByName('bosswarning');		
		n.active = true;
		global.ac.emit('warning');		

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
		if(this.fishlayer.childrenCount< 1) return;
	

		for(let i=0;i<this.fishlayer.children.length;i++){
			
				this.fishlayer.children[i].emit('hide');
		}
		// for(let fish of this.fishlayer.children){
		// 	fish.emit('hide');
		// }
	},

	//大奖转盘
	Reward:function(seat,id,num){

		var n = cc.instantiate(this.prefab[Ptype.REWARD-0]);
		n.parent =global.ui;
		//if(global.myseat>2) n.rotation = 180;
		//n.setPosition(0,0);

		 switch(seat)
		 {
			case 1:
				n.setPosition(-220,-150);
				break;
			case 2:
				n.setPosition(220,-150);
				break;
			case 3:
				//n.rotation =180;
				n.setPosition(220,150);
				break;
			case 4:
				//n.rotation =180;
				n.setPosition(-220,150);
				break;
		}

		n.emit('show',{id:id,num:num});
		global.ac.emit('reward');
	},

	//boss 奖
	BossReward:function(gold){
		var n = cc.instantiate(this.prefab[Ptype.BOSSREWARD-0]);
		n.parent =global.ui;	
		n.setPosition(0,0);

		var num =n.getChildByName('num');
		num.scaleX = num.scaleY =0.25;
		num.opacity =1;
		num.runAction(cc.spawn(cc.scaleTo(0.5,1,1),cc.fadeTo(0.5,255)));
		var label =num.getComponent(cc.Label);
		label.string = gold;		
		label.scheduleOnce(function() {
    		 this.node.parent.destroy();
		 }, 3);
			
		 global.ac.emit('bossdie');
		
	},

	//连锁闪电效果
	Lightning:function(){
		//遍历鱼，在鱼之间生成闪电

		if(this.fishlayer.childrenCount<2) return;
		//闪电音效
		global.ac.emit('lighting');		

		var sp = this.fishlayer.children[0].getPosition();
		var ep = sp; 
		//var fish = this.fishlayer.children;
		for(let i=1;i< this.fishlayer.childrenCount;i++){
			ep = this.fishlayer.children[i].getPosition();
			var v =cc.v2(ep.x - sp.x, ep.y - sp.y);
			//计算两点距离
			var l =	cc.pLength (v);
			//计算两点角度
			var r =cc.radiansToDegrees (cc.pToAngle(v)); 
			if(v.y>0) r= -Math.abs(r);
			else r = Math.abs(r);
			//生成闪电链
			var n = cc.instantiate(this.prefab[Ptype.LIGHTNING-0]);
			n.parent = this.node;
			n.setPosition(sp);
			n.rotation = r;
			n.scaleX = l/n.width;
			n.setSiblingIndex(1);
			
			//生成闪电球
			var n2 = cc.instantiate(this.prefab[Ptype.LIGHTNINGBALL-0]);
			n2.parent = this.node;
			n2.setPosition(ep);
			//n2.setSiblingIndex(n2.getSiblingIndex()+ this.fishlayer.childrenCount);
			
			
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
		
			var fish = cc.instantiate(this.v_fish[4-0]);
			fish.parent = this.fishlayer;	
			
			fish.emit('loadpath',{pathid:'1121',offstep:i*10});
		}
	},

	test:function(data){
		console.log('============================='+data.method);
	},

	GetPropCost:function(roomtype){
		var cost =1;
		switch(roomtype){
			case 'qingtong':
			cost =100;
			break;
			case 'baiyin':
			cost=1000;
			break;
			case 'huangjin':
			cost =10000;
			break;
		}
		return cost;
	},

	GetGunStyle:function(roomtype){
		var type =1;
		switch(roomtype){
			case 'qingtong':
			type =1;
			break;
			case 'baiyin':
			type=2;
			break;
			case 'huangjin':
			type =3;
			break;
		}
		return type;
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
