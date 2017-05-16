
cc.Class({
    extends: cc.Component,	
	
    properties: {		
		fishs:[],
		startfish:5,
		maxfish:10,	
		setp:0.5,
		idindex:0,
		lasttime:0,		
		game:cc.Node,
		
		_pause:false,
		//鱼的行动风格		
		habit:[]
    },

    // use this for initialization
    onLoad: function () {
		//               0刷率  1速度,  2最大转角,  3直线概率,  4最少直线   5转弯概率,   6最少转    7调头概率,   9最少调头
		//                                                       运行次数,                弯次数,                 次数
		this.habit=[ 	[0.93,   0.032,   15,         0.7,        5,          0.3,         3,        0.08,         5],   //1 虾
						[0.85,   0.040,   15,         0.7,        5,          0.3,         3,        0.08,         5],   //2 小绿纹
						[0.78,   0.034,   15,         0.7,        5,          0.3,         3,        0.08,         5],   //3 泡鳃
						[0.70,   0.034,   15,         0.7,        5,          0.3,         3,        0.08,         5],   //4 热带条纹
						[0.60,   0.035,   15,         0.7,        5,          0.3,         3,        0.08,         5], 	//5 小丑鱼
						[0.53,   0.036,   15,         0.7,        5,          0.3,         3,        0.08,         5],	//6 刺鱼
						[0.46,   0.033,   15,         0.7,        5,          0.3,         3,        0.08,         5], 	//7 蓝鱼 
						[0.41,   0.032,   15,         0.7,        5,          0.3,         3,        0.08,         5],	//8 灯笼
						[0.33,   0.030,   15,         0.7,        5,          0.3,         3,        0.08,         5], 	//9 三角 
						[0.26,   0.028,   10,         0.7,        5,          0.3,         3,        0.08,         5],	//10 海龟
						[0.21,   0.032,   10,         0.7,        5,          0.3,         3,        0.08,         5], 	//11 飞鱼
						[0.14,   0.030,   10,         0.7,        5,          0.3,         3,        0.08,         5],	//12 凤尾
						[0.115,  0.038,   10,         0.7,        5,          0.3,         3,        0.08,         5], 	//13 剑鱼
						[0.85,   0.030,   10,         0.7,        5,          0.3,         3,        0.08,         5],	//14 蝠鲼
						[0.07,   0.033,   10,         0.7,        6,          0.2,         2,        0.06,         4], 	//15 银鲨
						[0.055,  0.033,   10,         0.7,        6,          0.2,         2,        0.06,         4],	//16 金鲨
						[0.03,   0.036,   10,         0.8,        6,          0.2,         2,        0.06,         4], 	//17 海豚
						[0.01,   0.035,   10,         0.8,        7,          0.2,         2,        0.05,         4],  //18 龙
						[0.004,   0.035,   10,         0.8,        7,          0.2,         2,        0.05,         4],];  //19 李逵
		//取随机数R (R 的数值对应一个0~1的一段区间),依次从上至下比较是否大于刷率，大于则生成对应的鱼		
		//取得配置 选项   同一场 景中该类鱼数量，    尾随的同类鱼数量（形成鱼队）    打死后的金币   捕获难度
		
		
		this.node.on('hitfish',this.HitFish,this);		
		
		//console.log(this.habit[17][0]);
		this.fishs = new Array();
		
		for(let i =0;i< this.startfish;i++){					
			this.fishs.push(this.Fish(this.idindex++,0.04));
		}		
	},
	
	start:function(){
			
		for(let i=0; i < this.fishs.length;i++){
			this.game.emit('initfish',{ name:this.fishs[i].id,type:this.fishs[i].type,x:this.fishs[i].x,y:this.fishs[i].y,r:this.fishs[i].r} );
		}			
		this.schedule(this.SendPos, this.setp);
    },
	
	update: function (dt) {	
		//接收打到鱼消息
		//console.log('------------dt='+dt);		
		this.lasttime+=dt;		
	},
	
	HitFish:function(event){
		//从消息队列中取消息
		//对比碰撞位置和鱼的距离 		
		let msg = event.detail;		
		for(let i=0;i<this.fishs.length;i++){			
			if( 'fish'+this.fishs[i].id == msg.name){			
			
				let lt = this.lasttime/this.setp;//计算上一次运动后，到接收到该消息为止，已经过的时长占计时器步长的比率
				//由于客户端鱼的位置要慢于服务端一个步长的时间
				let rx = this.fishs[i].lx+(this.fishs[i].x - this.fishs[i].lx)*lt; 
				let ry = this.fishs[i].ly+(this.fishs[i].y - this.fishs[i].ly)*lt; 
				
				let d = Math.sqrt(  Math.pow(msg.x-rx,2)+ Math.pow(msg.y-ry,2) );
				
				//console.log('------------命中的鱼'+msg.name+' 位置 ( x = '+ rx + '  y= '+ ry +' ) 碰撞点位置 ( x='+
				//			 msg.x+' y= '+msg.y+' ) 距离 ='+d);
				
				if( d < 0.2){//确认子弹在鱼 附近(0.2)
					//console.log('------------子弹在正确位置');
					//根据子弹等级和鱼类型 判定是否能捕到鱼(概率、捕到鱼的金币 从配置读取)
					//测试按20%进行  金币统一 20
						if(Math.random()>0.8){
							this.game.emit('getfish',{id:this.fishs[i].id,   seat:msg.seat,   coin:20});
							//消除鱼
							//console.log('------------消除鱼');
							delete this.fishs.splice(i,1);
						}
				}
				break;
			}
		}	
	},
	
	
	//生成鱼
	Fish:function( _id,_speed){
	
		var fish = new Object;
		fish.id=_id;
		fish.type=1;
		fish.speed = _speed;
		fish.s_speed = _speed;//初始速度
		
		fish.x=0;
		fish.y=0;	
		//上次运动后的位置 
		fish.lx=0;
		fish.ly=0;
		
		fish.r =0;
		fish.lastr =0;//上次动动角度
		fish.range =10;//每次变动 角度最大转动范围
		fish.act=1;//动作类型 1 直线; 2 转弯; 3 返回  加减速 
		fish.actn=0;//当前动作执行次数，某一动作需达到次数才能变换，使动作连贯，防止频繁转弯
		//fish.habit =[];
		var that = this;
		
		//----------------------------------
		//创建 一条鱼			
		fish.Init = function(){
			fish.speed = fish.s_speed;
			if(cc.randomMinus1To1()>0) {
				fish.x = 1.1+Math.random()*0.1;
				fish.y = cc.randomMinus1To1();
			}else{
				fish.x = -1.1 -Math.random()*0.1;
				fish.y = cc.randomMinus1To1();
			}
			
			fish.lx = fish.x;
			fish.ly = fish.y;
			
			//根据初始位置 初始化角度---------
			//let d = cc.pDistance(cc.v2(fish.x,fish.y),cc.v2(0,0));
			let r =  -Math.atan2(fish.y,fish.x)*180/Math.PI +180;			
			if(r>180) r =r-360;
				fish.r= r;					
				
			//随机一个类型
			let rand = Math.random();
		
			for(let i=0;i<19;i++)
				if( rand > that.habit[i][0]){
					//console.log('------------habit '+ that.habit[i][0]);
					fish.type = 1+i;
					//	fish.type = 17;
					//fish.habit = this.habit[i][0] ;
					break;
				}			
			//fish.type = 1+Math.round(17*Math.random());	//跟据鱼的的类型设置或读取配置鱼 的速度和行动习惯		
			//console.log('------------生成的鱼类型为 '+ fish.type);	
			return fish;
		}
		
		fish.Move = function(){
			//console.log('------------同步计算中...');		
			//if(Math.random()>0.9){
				//console.log('------- 鱼 '+fish.id+ '  改变了一下动作');	
				//fish.r+= cc.randomMinus1To1()*fish.range;
			//}
			
			//根据当前动作，确定下次动动
			let rand = Math.random();
			switch(fish.act){
				case 1://当前在向前运动
					if(fish.actn < 5) {
						fish.Forward();	
						break;	
					}				
					if( 0.08 < rand ) fish.Back();
					else if( 0.2 < rand ) fish.Rotate();
						 else fish.Forward();	
					break;
				case 2://当前正在转弯
					if(fish.actn < 3) {
						fish.Rotate(0);
						break;
					}
					if(0.2 < Math.random() ) fish.Rotate(0);
					else fish.Forward();						
					break;
				case 3://当前正在调头
					if(fish.actn < 6) {
						fish.Back(0);
						break;
					}
					if(Math.random()>0.08) fish.Back(0);
					else fish.Forward();	
					break;
			}		
			fish.lx = fish.x;
			fish.ly = fish.y;
			
			fish.y += Math.sin( -fish.r *(Math.PI/180))*fish.speed;
			fish.x += Math.cos( -fish.r *(Math.PI/180))*fish.speed;
			
			if(fish.r > 180) fish.r =360 - fish.r;
			if(fish.r < -180) fish.r = 360+ fish.r;
			
			//if(fish.r >180)
			//	console.log('------- 这SB鱼 '+fish.id+ '  位置在 '+fish.x+'  '+fish.y+'  角度='+fish.r);	
			//console.log('------- 鱼动作为 '+fish.act);
		}		
		
		//向前
		fish.Forward = function(){
			if(fish.act ==1) fish.actn ++;
			else fish.actn =0;
			fish.act = 1;
			fish.speed = fish.s_speed;
			//fish.x += Math.sin( fish.r *(Math.PI/180))*fish.speed;
			//fish.y += Math.cos( fish.r *(Math.PI/180))*fish.speed;
		};
		//转弯
		fish.Rotate = function(r){
			if(fish.act ==2) fish.actn ++;
			else fish.actn =0;
			fish.act =2;
			if(r==null){
				if(fish.lastr >0){
					if(Math.random()>0.1)	fish.lastr = Math.random()*fish.range; //90% 和上次转弯正负方向相同
					else	fish.lastr = -Math.random()*fish.range;
				}else{
					if(Math.random()>0.1)	fish.lastr = -Math.random()*fish.range;
					else	fish.lastr = Math.random()*fish.range;
				}
			}
			fish.speed  = fish.s_speed*0.8;
			fish.r += fish.lastr; 			
		}	
		//调头
		fish.Back = function(r){
			if(fish.act ==3) fish.actn ++;
			else fish.actn =0;
			fish.act =3;
			if(r==null)	fish.lastr = cc.randomMinus1To1()*fish.range;
			fish.speed  = fish.s_speed*0.7;
			fish.r += fish.lastr; 
		}
		return fish.Init() ;
	},
	//发送鱼的位置
	SendPos:function(){
		//console.log('------------开始同步');	
		if(this._pause ) return;

		this.lasttime=0;
		
		for(var  i=0; i < this.fishs.length;i++){				
			//消除越界
			if(this.fishs[i].x >1.3 || this.fishs[i].x < -1.3 || this.fishs[i].y >1.3 || this.fishs[i].y< -1.3)	{
				//console.log('------- 鱼 '+this.fishs[i].id+ ' 越界了');	
				this.fishs[i].Init();
				this.game.emit('restfish',{ name:this.fishs[i].id,type:this.fishs[i].type, x:this.fishs[i].x, y:this.fishs[i].y, r:this.fishs[i].r} );	
			}else{			
				//更新鱼的位置			
				this.fishs[i].Move();		
				//发送
				this.game.emit('syncfish',{ name:this.fishs[i].id,type:this.fishs[i].type, x:this.fishs[i].x, y:this.fishs[i].y, r:this.fishs[i].r} );				
			}
		}

		//未达到鱼池最大鱼刷量，则随机刷新一只
		if(this.fishs.length < this.maxfish && Math.random() >0.5)	{
			var fish = this.Fish(this.idindex++,0.04);
			this.game.emit('initfish',{ name:fish.id,type:fish.type,x:fish.x,y:fish.y,r:fish.r} );
			this.fishs.push(fish);				
		}		
	}   
});
