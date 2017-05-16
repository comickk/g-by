cc.Class({
    extends: cc.Component,

    properties: {
      wave:cc.Prefab,
      switchbg:cc.Node,
      map:[cc.SpriteFrame],
      music:[cc.AudioClip],

      _musicIndex:0,
      _mapIndex:0,
      _curAudioID:null,
    },

    // use this for initialization
    onLoad: function () {

        this.node.on('changemap',this.ChangeMap,this);
        this.ChangeMapFinish();
    },
 

    ChangeMap:function(){
        this.switchbg.active = true;
        this.switchbg.getComponent(cc.Sprite).spriteFrame  = this.map[this._mapIndex];
        this.switchbg.width = this.node.width;
        this.switchbg.height = this.node.height;
        this.switchbg.x =this.node.width/2;
        //this.switchbg.y =0; 

        var w =   cc.instantiate(this.wave);
        w.parent = this.switchbg;
        w.scaleX= w.scaleY =  this.node.height/w.height;    
        w.x =w.y=0;

        var that  =this;
        this.switchbg.runAction( cc.sequence(cc.moveTo(4,-this.node.width/2,0),
            cc.callFunc(function(){               
                w.destroy();
                that.switchbg.active = false;
                that.ChangeMapFinish();
            })
        ));      

        if(cc.isValid(this._curAudioID))
                cc.audioEngine.stop(this._curAudioID);
    },

    ChangeMapFinish:function(){
        
       this.node.getComponent(cc.Sprite).spriteFrame  = this.map[this._mapIndex++];

      
       this._curAudioID = cc.audioEngine.play(this.music[this._musicIndex++], true, 0.7);

        if(this._mapIndex>= this.map.length) this._mapIndex=0;
        if(this._musicIndex>= this.music.length) this._musicIndex=0;

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
