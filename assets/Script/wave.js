cc.Class({
    extends: cc.Component,

//水波效果
    properties: {
		wave:cc.Prefab,
		showwave:true,
      
    },

    // use this for initialization
    onLoad: function () {
	
		if(!this.showwave) return;
	
		var w = this.node.width/4;
		var h = this.node.height/2;
		
		for(let i=-2;i<2;i++){
			for(let j=-1;j<1;j++){
				let n = cc.instantiate(this.wave);
				n.width = w;
				n.height = h;
				n.setPosition( i*w,j*h);
				n.parent = this.node;
			}			
		}

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
