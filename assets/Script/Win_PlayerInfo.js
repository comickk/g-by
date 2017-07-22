var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {

        head:cc.Sprite,
        nick:cc.Label,
        level:cc.ProgressBar,
        golds:cc.Label,
        Diamonds:cc.Label,
        bag:cc.Node,

        viplv:cc.Label,
        viptime:cc.Label,

        items:[cc.Sprite],        
        itemimg:[cc.SpriteFrame],
        itemnum:cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {

        // for(let i=0;i<9;i++)
        //     this.SetItem(i,i,i+1);      

    },

    start:function(){
        if(global.myinfo ==  null ) return;
        this.nick.string = global.myinfo.nickname;
        this.golds.string = global.myinfo.score;
        this.Diamonds.string = '0';

        //console.log( '--------------'+global.myinfo['tool_'+'1']);

        for(let i =0;i<9;i++){
           // global.myinfo.tool_1 = 
            this.SetItem(i,i,global.myinfo['tool_'+(i+1).toString()]);
        }
    },

    SetItem:function(soltid,itemid,num){
        if(num < 1) return;
        this.items[soltid].spriteFrame = this.itemimg[itemid];
        var l = cc.instantiate(this.itemnum);
        l.parent = this.items[soltid].node;
        l.setPosition(20,-30);
        l.getComponent(cc.Label).string = num;
    },    
});
