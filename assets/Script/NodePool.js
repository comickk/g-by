var NodePool = cc.Class({
   //extends: cc.Component,

    properties: {
		v_prefab:[cc.Prefab],
		//v_bullet:cc.Prefab,
		//v_new:cc.Prefab,	   
	
		v_maxnode:50,
		//v_maxbullet:50,
		//v_maxnet:50,
	
		v_nodepool:cc.NodePool,
		//v_netpool:cc.NodePool,
		//v_bulletpool :cc.NodePool	   
    },		
	
	f_Init:function(prefab,nodenum){
		
		this.v_prefab = prefab;
		this.v_maxnode = nodenum;
		
		this.v_nodepool = new cc.NodePool;
		
		for(let i=0;i<this.v_maxnode;i++)
		{
			let b = cc.instantiate(this.v_prefab);
			this.v_nodepool.put(b);
		}
	},
	
	f_GetNode:function(parent,x,y,r,frame,action){
		
		let n =null;
		if(this.v_nodepool.size()>0)
			n= this.v_nodepool.get();
		else
			n =cc.instantiate(this.v_prefab);
			//this.v_nodepool.get(b);
		
		n.parent = parent;

		//console.log('-----------'+x+'   '+y);
		n.setPosition(x,y);

		if(r!=null) n.rotation= r;
		if(frame!=null) n.getComponent(cc.Sprite).spriteFrame = frame;
		if(action!=null) n.runAction(action);

		return n;			
	},
	
	f_PutNode:function(node){					
		
		this.v_nodepool.put(node);
	},	
	
	onDestroy:function(){
	
		this.v_nodepool.clear();
		//this.v_netpool.clear();
		//this.v_bulletpool.clear();
	}
   
});
module.exports = NodePool;