var FishMath = require('FishMath');
var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
	
		//v_ID:   {default: 0,visiable:false},
        v_type: {default:1,visible:false},
		v_seat: {default:0,visible:false},
		v_speed:{default: 100,visible:false},
		v_locktarget:{default: '',visible:false},
		
		v_isrebound : true,//是否支持反弹
		v_maxrebound:0,//最大反弹次数（0 为不限）
		v_rebound : 0,//当前反弹次数
		
		v_cw:{default: 0,visiable:false},
		v_ch:{default:0,visiable:false},		
		
		//v_isclear:false,		
		ismoveing:true,		
		
		_collidemsg:true,
		//_id:0,
    },

    // use this for initialization
    onLoad: function () {							
		this.v_cw = cc.Canvas.instance.node.width/2;
		this.v_ch = cc.Canvas.instance.node.height/2;
    },
	
	ReBound:function(){		
		
		if(!this.v_isrebound  ||  (this.v_maxrebound>0 && this.v_rebound >=this.v_maxrebound)){
			//this.node.stopAllActions();		
			this.v_locktarget ='';				
			global.pool_bullet.f_PutNode(this.node);					
			return;
		}	
		
		this.node.stopAllActions();
		this.v_rebound++;
		var tp = FishMath.ReBound(this.node.rotation,this.node.x,this.node.y,this.v_cw,this.v_ch);
		
		this.node.rotation = tp[0];				
		
		//this.ismoveing = true;
		var finished = cc.callFunc(function(){this.ismoveing = false;},this);
		this.node.runAction(cc.sequence(cc.moveTo(tp[3]/this.v_speed,tp[1],tp[2]),finished));		
		
		this.ismoveing = true;
		//console.log('---'+tp);		
	},	
	lateUpdate: function (dt) {	
		
		if(!this.ismoveing) this.ReBound();
			
	},
    // called every frame, uncomment this function to activate update callback
    /*update: function (dt) {		
		
		if(this.v_isclear) return;
		//-------------检测反弹--------------			
		let cd =0;
		
		//是否碰到屏幕边界
		if( this.node.x >= this.v_cw ) cd =1;//右出界
		if( this.node.y >= this.v_ch ) cd =2;//上
		if( this.node.x <= -this.v_cw) cd =3; //左
		if( this.node.y <= -this.v_ch) cd =4; //下	
		
		
		 //子弹图片朝右水平为0度  向右转 角度为正，向左转为正负  
		 //		 
		if(cd >0 )
		{		
			//不支持碰撞，出界即回收
			if(!this.v_isrebound )
			{			
				this.v_isclear = true;
				return; 
			}
		
			//超过反弹次数，回收
			if(this.v_maxrebound>0 && this.v_rebound >=this.v_maxrebound) {					
				this.v_isclear = true;						
				return;
			}
		
			this.v_rebound++;
			//console.log("-------------反弹次数="+ this.v_rebound);	
			this.node.stopAllActions();
			//console.log("------out range-------------");
			//根据当前角度和位置计算反弹后角度和目标点	  
			let x=this.node.x;
			let y =this.node.y;
			let t=2;
			let r= this.node.rotation;
			
			//计算三角函数时的边长 a为角对边，b 为角邻边
			let a  =0;
			let b = 0;
			
			//console.log('-------- r = '+ this.node.rotation);
			switch(cd)
			{
			case 1://右碰撞反弹
				this.node.x = this.v_cw-20;
				if( this.node.rotation < 0)//炮弹水平线上方
				{			
					r=  -180 -this.node.rotation;					
					b = this.v_ch - y;
					a = b * Math.tan( Math.abs( r+90) * (Math.PI/180) );
					x = this.v_cw -a;
					y = this.v_ch + 1;									
				}else{						//炮弹水平线下方
					r= 180 - this.node.rotation;
					b = this.v_ch + y;
					a = b * Math.tan(( r-90 )* (Math.PI/180) );
					x = this.v_cw -a;
					y = -this.v_ch - 1;	
				}				
				break;
			case 2://上碰撞反弹				
				this.node.y = this.v_ch-20;
				r = -this.node.rotation;
				
				if( this.node.rotation > -90) //炮弹垂直线右方
				{			
					b = this.v_cw - x;
					a = b * Math.tan( r * (Math.PI/180) );
					y = this.v_ch - a;								
					x = this.v_cw+1;
				}else{						//炮弹垂直线左方
					b = this.v_cw + x;
					a = b * Math.tan( ( 180-r )* (Math.PI/180) ) ;		
					y = this.v_ch - a ;					
					x = -this.v_cw-1;	
				}	
				break;
			case 3://左碰撞反弹
				this.node.x = -this.v_cw+20;				
				if( this.node.rotation < 0)//炮弹水平线上方
				{			
					r=  -180 -this.node.rotation;					
					b = this.v_ch - y;
					a = b * Math.tan( Math.abs( r+90) * (Math.PI/180) );
					x = -this.v_cw +a;
					y = this.v_ch + 1;									
				}else{						//炮弹水平线下方
					r= 180 - this.node.rotation;
					b = this.v_ch + y;
					a = b * Math.tan(( 90-r )* (Math.PI/180) );
					x = -this.v_cw +a;
					y = -this.v_ch - 1;	
				}				
				break;
			case 4:				//下碰撞反弹
				r = -this.node.rotation ;
				this.node.y = -this.v_ch+20; //像素移动，僻免子弹在屏幕外					
				
				if( this.node.rotation < 90)
				{			
					b = this.v_cw - x;
					a = b * Math.tan( ( -r )* (Math.PI/180) );
					y = -this.v_ch + a;		
					//console.log('     a='+a +'     b= '+b+'       r= '+ (-r)+  '      tan (r)= '+ Math.tan( ( -r )* (Math.PI/180) ));	
					//console.log('  -------r='+r+'     tan r='+Math.tan( Math.abs(r )* (Math.PI/180))+'    x ='+(this.v_cw - x)+'    y ='+(y-this.v_ch));	
					x = this.v_cw+1;					
				}else{
					b = this.v_cw + x;
					a = b * Math.tan( Math.abs( 180+r )* (Math.PI/180) ) ;		
					y = -this.v_ch + a ;					
					//console.log('  -------r='+r+'     tan r='+Math.tan( Math.abs(180+r )* (Math.PI/180))+'    x ='+(this.v_cw + x)+'    y ='+(y-this.v_ch));	
					x = -this.v_cw-1;	
				}				
				break;
			}		
			
			//根据路径长度和速度计算行动时间 t 
			//let l =  Math.sqrt((a*a)+(b*b));
			t = Math.sqrt((a*a)+(b*b))/this.v_speed;
			//t = l /this.v_speed;
			//console.log('     -----------t='+t+'       l='+l+ '     a='+a +'     b= '+b);
			
			//重新设定角度和位置
			if( Math.abs(r)> 180)
			{
				if(r<0) r = r-360;
				if(r>0) r = 360 -r;
			}				
			
			this.node.rotation = r;		
			//console.log('------------ r = '+ r);
			var action = cc.moveTo(t,x,y);
			this.node.runAction(action);				
		}
     },	 
*/
	
	f_InitBullet:function(type,seat,speed,isself){
		this.v_rebound =0;
		this.ismoveing = false;
		//this.v_isclear = false;
		
	//	this._id = id;
		this.v_type = type;		
		this.v_seat = seat;
		this.v_speed = speed;			
		this._collidemsg = isself;//是否发送碰撞消息
	},
	 
	 //产生碰撞，将碰撞点信息发送到服务端,并消除子弹,等待服务器验证后生成爆炸点 
	onCollisionEnter: function (other, self) {
				
		if(this.v_locktarget !='' && this.v_locktarget != other.node.name)		return;
		
		
		//计算距离
		//console.log('-----'+ this.Distance(other.node.x,other.node.y,this.node.x,this.node.y));
		//console.log('-----'+ this.Distance( -0.914,-0.316,-0.8248570277028835,-0.27147475404180793));

		//console.log('====='+ this.Distance( other.node.x/(cc.Canvas.instance.node.width/2),other.node.y/(cc.Canvas.instance.node.height/2),
		//									this.node.x/(cc.Canvas.instance.node.width/2),this.node.y/(cc.Canvas.instance.node.height/2) ));


		//让鱼闪一下
	//	if(this._collidemsg){
			other.node.emit('flash');				
			global.game.emit('collider',{seat:this.v_seat,type:this.v_type,	x:this.node.x,y:this.node.y,r:this.node.rotation,
										id:this.node.name,fishname:other.node.name});
	//	}

		//消毁子弹(返回对象池)									
		this.node.stopAllActions();		
		this.v_locktarget ='';		
		global.pool_bullet.f_PutNode(this.node);			
	},
    
    f_GetBulletID:function(){
	
	},
    f_Exploded:function(){
        
	},
	
	  Distance:function(x1,y1,x2,y2){
        var xdiff = x2 - x1;
        var ydiff = y2 - y1;
      return  Math.abs(Math.pow((xdiff * xdiff + ydiff * ydiff), 0.5));
    }
    
});
