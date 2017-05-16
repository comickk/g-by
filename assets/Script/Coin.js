cc.Class({
    extends: cc.Component,

    properties: {
       v_seat: {default:0,visiable:false},
	   v_action:{default:null,type:cc.Action,visiable:false},
    },

    // use this for initialization
    onLoad: function () {
	
		  this.node.on('GetCoin',this.f_GetCoin,this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
	
	f_GetCoin:function(event){
	
		this.node.parent = cc.Canvas.instance.node;
		this.v_action = event.detail.action;
		//var self = this;
		//coin.setPosition(x,y);
			
		this.scheduleOnce( function() {	this.node.runAction(this.v_action);}, 0.7);
	},	
});
