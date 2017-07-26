cc.Class({
    extends: cc.Component,

    properties: {
        fishdeadspeak:[cc.AudioClip],
    },

    // use this for initialization
    onLoad: function () {

        this.node.on('dead',function(event){

            if(Math.random() < 0.6) return;

            var r = Math.random();
            if(event.detail.type > 12 )
                r = Math.round(r*3);
            else
                r = 4+Math.round(r*3);
            cc.audioEngine.play(this.fishdeadspeak[r], false, 0.8);
        },this);

    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
