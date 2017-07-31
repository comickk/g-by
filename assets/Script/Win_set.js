var global = require('Global');
cc.Class({
    extends: require("PopWin"),

    properties: {
        music_sli:cc.Slider,
        sound_sli:cc.Slider,
        music_bar:cc.ProgressBar,
        sound_bar:cc.ProgressBar,

        lab:cc.Node,
        
       // _broad:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        //this._broad = cc.find('Gloab_Broadcast');

    //    if(cc.isValid(this._broad)){
    //         this._broad.emit('settext',{text:'欢迎进入游戏'});          
    //    }         
       
    },

    SetMusic:function(){
        global.musicvol = this.music_bar.progress = this.music_sli.progress;
        cc.audioEngine.setVolume(global.musicid,global.musicvol);
    },

    SetSound:function(){
         global.volume = this.sound_bar.progress = this.sound_sli.progress;

    },
   
    Btn_Broad:function(event,customEventData){//-14  121
        if(customEventData =='on'){
            this.lab.x=-14;
            if(cc.isValid(global.broad) && !global._broad.active) global.broad.active = true;
        }
        if(customEventData == 'off'){
             this.lab.x=121;
             if(cc.isValid(global.broad) && global.broad.active) global.broad.active =false;
        }
    },

});