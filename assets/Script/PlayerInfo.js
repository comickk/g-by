cc.Class({
    extends: cc.Component,

    properties: {
      
        headImg:cc.Sprite,
        playername:cc.Label,
        playergold:cc.Label,
        gunlevel:cc.Label,
        online:cc.Node,
        wait:cc.Node, 
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('playercome',function(event){
            this.wait.active = false;
            //set head Img
            this.online.active = true;

           // this.playername.string = event.detail.name;
            this.playergold.string = event.detail.gold.toString();

            this.gunlevel.string = '10';

        },this);

        this.node.on('playerquit',function(){
           this.wait.active = true;
           this.online.active = false;
        },this);


        this.node.on('setgunlevel',function(event){ this.gunlevel.string = event.detail.level},this);

        this.node.on('changegole',function(){},this);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
