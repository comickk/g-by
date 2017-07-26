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
			v_select:{
				default:false,
				visible:false
			},			
		
			v_islocal:true,		

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

		this.node.on('synchro',function(event){
			//console.log(this);
			if(!this._ishide)
				this._step = event.detail.step;
			//console.log('-----'+ this._step + '  ' + event.detail.step);
		},this);

		this.node.on('freeze',this.Freeze,this);
		this.node.on('unfreeze',this.UnFreeze,this);
		
		var animdead = anim.getAnimationState(anim.getClips()[1].name);
		animdead.on('finished',   this.f_FishDead ,   this);

		this.node.on('hide',this.Hide,this);
		   
		//if(this.lockicon==null) return;			
		this.node.on('touchstart',this.f_SelectFish,this);
		this.node.on('touchend',   function(){this.v_select = false;},this);	
		this.node.on('touchcancel',function(){this.v_select = false;},this);	

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

		this.node.targetOff(this);
	},  

 
    f_SelectFish:function(){		
    	this.v_select =true;
		if(cc.isValid(this.v_lockicon) || this.v_islock) return;	//非 高分目标   或 已被锁定  
		//console.log('---------------- '+this.node.name);
		
		global.game.emit('lockfish',{fish:this.node});		
	},
   
    
    f_FishDead:function() {
       // console.log('------这条鱼挂了------');
      //  this.node.stopAllActions(); 
	  
	  	if(this.v_islock )	//该鱼在被锁定情况下打死，通知取消锁定			
			global.game.emit('cancellock');		
		else
			if(this.v_select) global.game.emit('touchend');	
		
		this.node.destroy();
    },	

	Hide:function(){
		this._ishide =true;
		this.node.getComponent(cc.Collider).enabled =false;          

		if(this.v_islock )	//该鱼在被锁定情况下，通知取消锁定			
			global.game.emit('cancellock');		
		else
			if(this.v_select) global.game.emit('touchend');	

		// var layer = cc.find("Canvas/GameController/DelFishLayer");
		// if(cc.isValid(layer))
		// 	this.node.parent = layer;

		//轨迹超过 50%的 加速游走
		if(this._step > FishMath.fishpath.data[this._pathID].length*0.6 ){
			this._isloop = false;			
			
			this._stepwidth= parseInt( (FishMath.fishpath.data[this._pathID].length - this._step)/4);

			var anim = this.body.getComponent(cc.Animation);	
			var as = anim.getAnimationState();
			if(as!= null) as.speed =3; 

			this.body.runAction(cc.fadeOut(1.2));
		
			return;
		}

		//未超过的 原地隐藏
		var anim = this.body.getComponent(cc.Animation);	
		
		if(cc.isValid(anim.getClips()[2])){
			var animclip = anim.getClips()[2];				

			anim.play(animclip.name);
		}else{
			console.log('--no fish run anim--');
			this.body.runAction(cc.fadeOut(0.8));
		}
		this.scheduleOnce(function() {
     		this.node.destroy();
 		}, 1);
	

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
			this.node.rotation = fp[2];
		}

		//开始按轨迹动运
		if( FishMath.fishpath.data[this._pathID].length > 1 ){
			this.schedule(function() {
				this.FishMove();
			}, this._steplen);
		}
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
		var fp ;//=  FishMath.fishpath.trail[this._pathID][this._step];
		//if(!isNaN(fp[0])){

		//结束线路，重新开始
		if(this._step > FishMath.fishpath.data[this._pathID].length-1 ) {
			if(this._isloop){
				this._step = 1;
				//恢复轨迹初始位置
				fp =  FishMath.fishpath.data[this._pathID][0];
				this.node.setPosition(fp[0]*this._width, fp[1]*this._height);
				this.node.rotation = fp[2];
			}else{//不循环删除
				
				if(this.v_islock )	//该鱼在被锁定情况下，通知取消锁定			
					global.game.emit('cancellock');		
				else
					if(this.v_select) global.game.emit('touchend');	
				this.node.destroy();
			}
		}else{
			fp = FishMath.fishpath.data[this._pathID][this._step];
			this.node.runAction(cc.spawn(cc.moveTo(this._steplen, fp[0]*this._width, fp[1]*this._height), 
			cc.rotateTo (this._steplen,fp[2])));
			//this.node.setPosition(fp[0]*this._width, fp[1]*this._height);
		}
		if(!this._isice)
			this._step+= this._stepwidth;				
	},

	Freeze:function(){
		if(this._ishide) return;
		this._isice = true;

		//停止游动 动画
		var anim = this.body.getComponent(cc.Animation);	
		
		if(cc.isValid(anim.getClips()[0])){
			var animclip = anim.getClips()[0];	
			anim.pause(animclip.name);
		}//else console.log('你妈B,没找到动画体');		
	},
	UnFreeze:function(){
		this._isice = false;

		//停止游动 动画
		var anim = this.body.getComponent(cc.Animation);	
		
		if(cc.isValid(anim.getClips()[0])){
			var animclip = anim.getClips()[0];	
			anim.resume(animclip.name);
		}//else console.log('没找到动画体');	
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
