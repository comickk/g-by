var global = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        fishdeadspeak:[cc.AudioClip],

        gun:[cc.AudioClip],

        coins:[cc.AudioClip],

        //效果音效
        effect:[cc.AudioClip],//0 - 切换  1-冰冻  2 警告   3 闪电    4 大鱼爆炸  5奖金鱼转盘 6发大财了
    },

    // use this for initialization
    onLoad: function () {
        global.ac = this.node;
        this.node.on('dead',function(event){

            if(Math.random() < 0.6) return;

            var r = Math.random();
            if(event.detail.type > 12 )
                r = Math.round(r*3);
            else
                r = 4+Math.round(r*3);
            cc.audioEngine.play(this.fishdeadspeak[r], false, global.volume);
        },this);

        //  炮声音
        this.node.on('fire',function(){
            cc.audioEngine.play(this.gun[0], false,global.volume);
        },this);

         this.node.on('change',function(){
            cc.audioEngine.play(this.gun[1], false,global.volume);
        },this);

        //金币声音
        this.node.on('popcoin',function(){
            cc.audioEngine.play(this.coins[0], false,global.volume);
        },this);
        this.node.on('getcoin',function(){
            cc.audioEngine.play(this.coins[1], false,global.volume);
        },this);
        //切换地图
        this.node.on('switchbg',function(){
            cc.audioEngine.play(this.effect[0], false,global.volume);
        },this);
        
        //特效音
         this.node.on('freeze',function(){
            cc.audioEngine.play(this.effect[1], false,global.volume);
        },this);

         this.node.on('lighting',function(){
            cc.audioEngine.play(this.effect[3], false,global.volume);
        },this);

        this.node.on('warning',function(){
            cc.audioEngine.play(this.effect[2], false,global.volume);
        },this);

        this.node.on('fishdie',function(){
             cc.audioEngine.play(this.effect[4], false,global.volume);
        },this);

         this.node.on('reward',function(){
             cc.audioEngine.play(this.effect[5], false,global.volume);
        },this);

         this.node.on('bossdie',function(){
             cc.audioEngine.play(this.effect[6], false,global.volume);
        },this);
    },

    //cc.audioEngine.uncache(filePath);

   



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
