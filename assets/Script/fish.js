var global = require('Global');
var FishMath = require('FishMath');
cc.Class({
    extends: cc.Component,

    properties: {      
           
			v_islock: false,		

			body:cc.Node,
			v_lockicon:{
				default:null,
				type:cc.Node,
			},		
		
			v_islocal:true,		

			_select:false,//触摸时选中的标志

			_type:1,

			_pathID:0,
			//_path:[],
			_offstep:0,//轨迹偏移,  从第几个结点开始
			_isloop:true,//是否循环轨迹
			_step:1,//默认轨迹时间点，0为初始位置
			_steplen:0.3,//轨迹步长
			_stepwidth:1,//步宽

			_isice:false,
			_width:0,
			_height:0,

			_ishide:false,

			_shuimu:21,

			//-----测试----
			_lasttime:0,

    },

    // use this for initialization
    onLoad: function () {
		//this.node.on('move',this.f_Move,this);

     	this._width= cc.Canvas.instance.node.width/2;
        this._height = cc.Canvas.instance.node.height/2;

        this.node.on('flash',function(){                                           
                               var seq = cc.sequence( cc.tintTo(0,255,0,255) ,cc.tintTo(0.5,255,255,255));
                               this.body.runAction(seq);                               
        },this);
		

		var anim = this.body.getComponent(cc.Animation);
        this.node.on('dead',function(){                               
							  this.node.stopAllActions();
							  this.node.getComponent(cc.Collider).enabled =false;                              						 
                              anim.play(anim.getClips()[1].name);
		},this);
							
		var animdead = anim.getAnimationState(anim.getClips()[1].name);
		animdead.on('finished',   this.f_FishDead ,   this);//死亡动画结束时

		this.node.on('synchro',function(event){			
			if(!this._ishide)
				this._step = event.detail.step+1;			
		},this);

		this.node.on('freeze',this.Freeze,this);
		this.node.on('unfreeze',this.UnFreeze,this);
		
		

		this.node.on('hide',this.Hide,this);
		   
		//if(this.lockicon==null) return;			
		this.node.on('touchstart',this.f_SelectFish,this);
		this.node.on('touchend',   function(){this._select = false;},this);	
		this.node.on('touchcancel',function(){this._select = false;},this);			

		this.node.on('lock',function(){
			this.v_islock = true;
			this.v_lockicon.active = true;
		},this);			
		this.node.on('unlock',function(){
			this.v_islock = false;
			this.v_lockicon.active = false;
		},this);

		//读取指定轨迹文件
		this.node.on('loadpath',function(event){
				
			this.LoadPath(event.detail.type,event.detail.pathid,event.detail.offstep,event.detail.isloop);
		},this);

		//--
		//this.node.on('test',this.test2,this);


		//按轨迹移动
		// this.node.on('move',function(){
		// 	//console.log('------------------------');
		// 	//读取正常开始轨迹
		// 	if( this._path.length > 0 ){
		// 		this.schedule(function() {
		// 			this.FishMove();
 		// 		}, this._steplen);
		// 	}
		// },this);

		//this.LoadPath('x001');
    },

	onDestroy :function( ){	

		if(this.v_islock )	//该鱼在被锁定情况下打死，通知取消锁定			
			global.game.emit('cancellock');		

		//如果该对象为触摸时点中的对象
		if(this._select) 
			global.game.emit('touchend');	

		this.node.targetOff(this);
	},  

 
    f_SelectFish:function(){		
		this._select =true;		
		if(!cc.isValid(this.v_lockicon) || this.v_islock) return;	//非 高分目标   或 已被锁定  
		//console.log('---------------- '+this.node.name);

		// this._select =true;
		global.game.emit('lockfish',{fish:this.node});		
	},
   
    
    f_FishDead:function() {
		
		this.node.destroy();
    },	

	Hide:function(){
		this._ishide =true;
		this.node.getComponent(cc.Collider).enabled =false;        
	
		// var layer = cc.find("Canvas/GameController/DelFishLayer");
		// if(cc.isValid(layer))
		// 	this.node.parent = layer;
		//cc.log('----这条鱼要隐藏了---');
		//方案三 在当前方向一定范围内随机位置 角度，加速游出 
		var hidetime = 1.5;
		var len = 400;
		var dr =cc.randomMinus1To1()*80;
		var hu = (Math.PI/180)*(this.node.rotation+dr);
		var dy = -Math.sin(hu)*len;
		var dx = Math.cos(hu)*len;		

		//conslole.log('r ='+ dr +' x= '+' y= '+dy);
		/**
		var len = 100;
		for(var r = 0;r<360;r+=10){
		var hu_r = (Math.PI/180)*(r+40);
		var hu_l = (Math.PI/180)*(r-40);
		var ry = Math.sin(hu_r)*len;
		var rx = Math.cos(hu_r)*len;	
		var ly = Math.sin(hu_l)*len;
		var lx = Math.cos(hu_l)*len;	
		console.log('r ='+ r +'向右40度 x= '+rx+' y= '+ry +'向左40度 x= '+ lx+' y= '+ly);}
		 * 
		 */
		var anim = this.body.getComponent(cc.Animation);
		var clip = 	  anim.getClips()[0];
		if(cc.isValid(clip)){
			var animstate = anim.getAnimationState(anim.getClips()[0].name );		
			if( animstate != null) animstate.speed =4; 
		}
	
		this.unschedule (this.FishMove);
		//this.body.stopAllActions( );
		// this.body.runAction( cc.spawn( 	cc.moveBy(hidetime,dx,dy),
		// 								cc.rotateBy(hidetime/2,dr),
		// 								cc.fadeOut(hidetime) ));
		// var finished = cc.callFunc(function(){
		// 	this.node.destroy();
		// }, this);										  
		this.body.runAction( cc.sequence(	cc.spawn( 	cc.moveBy(hidetime,dx,dy),
		 												cc.rotateBy(hidetime/4,dr),
														cc.fadeOut(hidetime) ),
		 									cc.callFunc(function(){// cc.log('假装消失一下');
														 this.node.destroy(); },this)));	
		// this.scheduleOnce(function() {
     	//  	this.node.destroy();
		// }, hidetime);
		 
	//	cc.log('----3----');
			// var finished = cc.callFunc(this.CoinFinish, this, {coin:coin,text:ct});
			//var act = cc.sequence(cc.moveTo(len, that.gunseat[seat-1].x,that.gunseat[seat-1].y),finished);

		//轨迹超过 50%的 加速游走
		// if(this._step > FishMath.fishpath.data[this._pathID].length*0.6 ){
		// 	this._isloop = false;			
			
		// 	this._stepwidth= parseInt( (FishMath.fishpath.data[this._pathID].length - this._step)/4);

		// 	var anim = this.body.getComponent(cc.Animation);	
		// 	var as = anim.getAnimationState();
		// 	if(as!= null) as.speed =3; 

		// 	this.body.runAction(cc.fadeOut(1.2));
		
		// 	return;
		// }

		// //未超过的 原地隐藏
		// var anim = this.body.getComponent(cc.Animation);	
		
		// if(cc.isValid(anim.getClips()[2])){
		// 	var animclip = anim.getClips()[2];				

		// 	anim.play(animclip.name);
		// }else{
		// 	console.log('--no fish run anim--');
		// 	this.body.runAction(cc.fadeOut(0.8));
		// }
		// this.scheduleOnce(function() {
     	// 	this.node.destroy();
 		// }, 1);
	

		// //随机方向和角度
		// var r = 180* cc.randomMinus1To1();
		// var p = cc.v2(50+200*cc.randomMinus1To1(),50+200*cc.randomMinus1To1());
		// console.log('------'+r+'------'+p);
		// //渐隐
		// this.body.runAction(cc.fadeOut(0.8));
		// this.node.runAction(cc.sequence( cc.spawn(cc.moveBy(0.8,p.x,p.y),cc.rotateBy(0.8,r)),
		// 	cc.callFunc(function(){
		// 			this.node.destroy();
		// 	},this)
		// ));
	},

	//加载轨迹
	LoadPath:function(type,pathid,offstep,isloop){	
		
		if(pathid >= FishMath.fishpath.data.length ) return;
		if(offstep >= FishMath.fishpath.data[pathid].length) return;
		this._type = type;
		this._pathID = pathid;	
		this._offstep = offstep;
		this._step = this._offstep+1;
		this._isloop = isloop;
		
		//设定初始位置 
		var fp =  FishMath.fishpath.data[this._pathID][this._offstep];
		
		if(fp[0]){
			this.node.setPosition(fp[0]*this._width, fp[1]*this._height);
			//cc.log(this.node.fishtype + '  '+ this._shuimu);
			if(this.node.fishtype != this._shuimu)//水母方向向上
				this.node.rotation = fp[2];
			else{
				if(global.myseat >2)
					this.node.scaleY = -1;
			}
		}

		//开始按轨迹动运
		if( FishMath.fishpath.data[this._pathID].length > 1 ){
			this.FishMove();
			this.schedule(function() {
				this.FishMove();
			}, this._steplen);
		}

	
		//cc.log(animstate.name+'    '+animstate.speed)
		//this.node.emit('move');

		// var that  = this;
		// cc.loader.loadRes(pathid,function(err,data){
		// 	if(err)
		// 	{
		// 		cc.error(err.message || err);
		// 		return;
		// 	}
			
		// 	var path = data.toString().split('\n');
		// 	//console.log(path);
		// 	var i=0;
		// 	for(let line of path){
		// 		var p=line.split(' ');
		// 		var fp = [];
		// 		fp[0] = parseInt(p[0]);
		// 		fp[1] = parseFloat(p[1]);
		// 		fp[2] = parseFloat(p[2]);
		// 		fp[3] = parseFloat(p[3]);
				
		// 		that._path.push(fp);	
		// 		//console.log(fp);	
		// 	}

		// 	//设定初始位置 
		// 	var fp =  that._path[that._offstep];
		// 	if(!isNaN(fp[0])){
		// 		that.node.x= fp[1];
		// 		that.node.y = fp[2];
		// 		that.node.rotation = fp[3];
		// 	}

		// 	that.node.emit('move');
		// 	cc.loader.releaseRes(pathid);
		// 	//console.log(that._path);			
		// });	
	},

	FishMove:function(){
		if(this._isice) return;
		var fp ;//=  FishMath.fishpath.trail[this._pathID][this._step];
		//if(!isNaN(fp[0])){

		//结束线路，重新开始
		if(this._step > FishMath.fishpath.data[this._pathID].length-1 ) {
			if(this._isloop){
				this._step = 1;
				//恢复轨迹初始位置
				fp =  FishMath.fishpath.data[this._pathID][0];
				this.node.setPosition(fp[0]*this._width, fp[1]*this._height);
				if(this.node.fishtype != this._shuimu)//水母不设方向
					this.node.rotation = fp[2];
			}else{//不循环删除				
				
				this.node.destroy();
			}
		}else{
			fp = FishMath.fishpath.data[this._pathID][this._step];
			if(this.node.fishtype != this._shuimu)//水母不设方向
				this.node.runAction(cc.spawn(cc.moveTo(this._steplen, fp[0]*this._width, fp[1]*this._height), 
					cc.rotateTo (this._steplen,fp[2])));
			else
				this.node.runAction(cc.moveTo(this._steplen, fp[0]*this._width, fp[1]*this._height));
			//this.node.setPosition(fp[0]*this._width, fp[1]*this._height);
			this._lasttime = new Date().getTime();
		}
		
		this._step+= this._stepwidth;				
	},

	Freeze:function(){
		if(this._ishide) return;
		this._isice = true;

		this.node.pauseAllActions ( );
		//停止游动 动画
		var anim = this.body.getComponent(cc.Animation);	
		
		if(cc.isValid(anim.getClips()[0])){
			var animclip = anim.getClips()[0];	
			anim.pause(animclip.name);
		}//else console.log('你妈B,没找到动画体');		
	},
	UnFreeze:function(){
		this._isice = false;

		this.node.resumeAllActions(); 
		//继续游动 动画
		var anim = this.body.getComponent(cc.Animation);	
		
		if(cc.isValid(anim.getClips()[0])){
			var animclip = anim.getClips()[0];	
			anim.resume(animclip.name);
		}//else console.log('没找到动画体');	
	},
	
	test2:function(event){
		var msg = event.detail;
		var len = (new Date().getTime() -this._lasttime)/300;
		cc.log('------len ='+ len);

		var s0 = FishMath.fishpath.data[this._pathID][this._step-1];
		var s1 = FishMath.fishpath.data[this._pathID][this._step];
		var rx = s0[0]+(s1[0]-s0[0])*len;
		var ry = s1[1]+(s1[1]-s0[1])*len;

		cc.log('----根据路径点计算位置  = '+ rx+'  '+ry);
		cc.log('----实际位置   = '+ this.node.x/(cc.Canvas.instance.node.width/2)+'  '+this.node.y/(cc.Canvas.instance.node.height/2));

		var d1=	Math.sqrt(  Math.pow(msg.x/(cc.Canvas.instance.node.width/2)-rx,2)+ Math.pow(msg.y/(cc.Canvas.instance.node.height/2)-ry,2) );
		cc.log('------d1 = '+ d1);

	},

    test:function(event ) {
		//let x = cc.randomMinus1To1()* (cc.Canvas.instance.node.width/2 - 100);
		//let y = cc.randomMinus1To1()* (cc.Canvas.instance.node.height/2-100);			
		
		//本机运行，开始模拟位置
		if(this.v_islocal){			

				var targetPoint = this.node.parent.convertToNodeSpace (cc.v2(event.detail.x,event.detail.y));
				//console.log('     p1  ='+targetPoint+'    p2 ='+this.node.parent.convertToNodeSpace (targetPoint));					
				
				var thisPoint = cc.p(this.node.x, this.node.y);				
				// 求当前对象和目标两点间的距离
				var distance = cc.pDistance(thisPoint, targetPoint);						
				
				// 旋转相应的角度
				var x1 = thisPoint.x;
				var y1 = thisPoint.y;
				var deltaRotation = -Math.atan2(targetPoint.y-y1,targetPoint.x-x1)*180/Math.PI;
				
				deltaRotation -= this.node.rotation;
				
				if(deltaRotation > 0) 
					console.log('------  右转 '+ deltaRotation);
				else	
					console.log('------  左转 '+deltaRotation);
				
				//this.node.setRotation(deltaRotation);	
				
				this.node.runAction(cc.spawn(cc.moveTo(2, targetPoint.x, targetPoint.y), cc.rotateBy (2,deltaRotation)));
				
		}
		//----------------------------------
		/*
		var seq =  cc.repeatForever(cc.sequence(	cc.moveTo(6, (cc.Canvas.instance.node.width-100)/2, 
																	cc.randomMinus1To1()* (cc.Canvas.instance.node.height-100)/2), 
													cc.moveTo(6, -(cc.Canvas.instance.node.width-100)/2, 
																	cc.randomMinus1To1()* (cc.Canvas.instance.node.height-100)/2)));
													
		
		this.node.runAction(seq);
        */
        //var action = cc.moveBy(5,500,100);
       // this.node.runAction(action);
    }
	
    
});
/**
 * 
 *   幸运值  =   1 -（玩家目前的金币 / 玩家进入游戏时的金币数）
 *  
 */
