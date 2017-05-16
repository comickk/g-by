cc.Class({
    extends: cc.Component,

    properties: {
       
        //动作类型
        acttype:0,//0  没动作 1 左滑出  2上滑出   3 右滑出   4下滑出
        time:0.5,
        
        //目的地边距
        b_left:false,
        left:0,

        b_top:false,
        top:0,
        b_right:false,
        right:0,

        b_bottom:false,
        bottom:0,
        
        //对齐
        ah:false,//  水平对齐
        av:false,//  垂直对齐
    },

    // use this for initialization
    onLoad: function () {

        if(this.ah) {
            this.node.y =0;
            this.b_top = this.b_bottom = false;
            //this.node.y = (this.node.parent.height-this.node.height)/2;           
        }
        if(this.av) {
            this.node.x =0;
            this.b_left= this.b_right = false;
            //this.node.x =  (this.node.parent.width-this.node.width)/2;            
        }

        //if(!this.av && !this.ah){
           // if(this.b_left) this.node.x = this.
       // }
    },

    //  出场 动态效果
    onEnable:function(){

        if(this.b_left) this.node.x = -(this.node.parent.width -this.node.width)/2 +this.left;

        var tx = 0;
        var ty = 0;
        switch(this.acttype){            
            case 1://左                
                this.node.x = -this.node.parent.width/2-this.node.width/2;
                tx = this.node.x+this.node.width+this.left;
                ty = this.node.y;
                break;
            case 2://上
                this.node.y = this.node.parent.height/2+this.node.height/2;
                tx = this.node.x;
                ty = this.node.y+this.node.height-this.top;
                break;
            case 3://右                
                this.node.x = this.right;
                tx = 0;
                ty = this.node.y;
                break;
            case 4://下                
                this.node.y = -this.node.parent.height/2-this.node.height/2;
                tx = this.node.x;
                ty = this.node.y+this.node.height+this.bottom;
                break;
        }

        this.node.opacity = 50;
        this.node.runAction(cc.spawn(cc.fadeIn(this.time*0.75),cc.moveTo(this.time,tx,ty)));

    }
});
