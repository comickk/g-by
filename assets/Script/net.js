var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {			
		v_life:1,//显示时长 

		v_type: {default:1,visiable:false},
		v_seat: {default:0,visiable:false},				
    },	   

    onEnable:function() {
    		var rep = cc.repeat(cc.sequence( cc.scaleTo(0.1,1.2,1.2) ,cc.scaleTo(0.1,1,1)),2);
           	this.node.runAction(rep); 
    },
	
	f_InitNet:function(type,seat,gc){		
		
		this.v_type = type;		
		this.v_seat = seat;								
		this.v_gamecontroller = gc;

		this.scheduleOnce(this.timeCallback, this.v_life);
	},
	//定时回收
	timeCallback : function (dt) {
		//cc.log("time: " + dt);
		//this.node.destroy();			
		global.pool_net.f_PutNode(this.node);	
	},   	
});
