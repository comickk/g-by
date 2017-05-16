cc.Class({
    extends: require("PopWin"),

    properties: {
       
       item:cc.Prefab,
       layout:cc.Node,
       currlv:3,
    },

    // use this for initialization
    onLoad: function () {

                     
        var that  = this;
        this.node.on('animfinish',function(event){

            //console.log('--------------'+ that.layout.childrenCount );
            event.stopPropagation();
            that.currlv++;
            //删除一个
           that.layout.children[0].destroy();

            //设置 一个
           that.layout.children[3].emit('setitem',{islock:true,gunlv:(that.currlv+1).toString(),isselect:true,gift:'100',cost:'10'});

             //新增一个
            var n = cc.instantiate(that.item);
            n.parent = that.layout;
         
           // islock  gunlv  isselect gift   cost
           n.emit('setitem',{islock:true,gunlv:(that.currlv+3).toString(),isselect:false,gift:'100',cost:'10'});

        });

        //当前炮等级       
        for(let i=this.currlv-1;i<=this.currlv+3;i++){
            var n = cc.instantiate(this.item);
            n.parent = this.layout;
           
            var is= false;
            var lock= false;
            if(i == this.currlv+1) is = true;
            if(i >this.currlv) lock = true;

            // islock  gunlv  isselect gift   cost
            n.emit('setitem',{islock:lock,gunlv:i.toString(),isselect:is,gift:'100',cost:'10'});
        }        

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
