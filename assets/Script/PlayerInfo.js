cc.Class({
    extends: cc.Component,

    properties: {
      
        headImg:cc.Sprite,
        glod:cc.Label,
        diamond:cc.Label,
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
            this.glod.string = event.detail.gold.toString();
            this.diamond.string = event.detail.diamond.toString();

            this.gunlevel.string = event.detail.level;

        },this);

        this.node.on('playerquit',function(){
           this.wait.active = true;
           this.online.active = false;
        },this);


        this.node.on('setgunlevel',function(event){ this.gunlevel.string = event.detail.level},this);

        this.node.on('changegold',function(event){
            this.glod.string = event.detail.gold.toString();
        },this);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
