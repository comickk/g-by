var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        
			v_ID:0,
            v_type:   1,
            v_speed:  1,
            v_value:  1,
            v_islive: true,
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

			_isboss:false,
    },

    // use this for initialization
    onLoad: function () {
		//this.node.on('move',this.f_Move,this);

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
    },

	onDestroy :function( ){	

		this.node.targetOff(this);
	},  

 
    f_SelectFish:function(){		
    	this.v_select =true;
		if(this.v_lockicon==null || this.v_islock) return;	//非 高分目标   或 已被锁定  
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

		this.node.getComponent(cc.Collider).enabled =false;          

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
