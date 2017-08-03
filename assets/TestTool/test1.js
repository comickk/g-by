cc.Class({
    extends: cc.Component,

    properties: {
      fish:cc.Node,

       _fishpath:null,
       _step:1,
       _pathid:9,

        _width:0,
		_height:0,
    },

    // use this for initialization
    onLoad: function () {

        this._width= cc.Canvas.instance.node.width/2;
        this._height = cc.Canvas.instance.node.height/2;

        //加载鱼的轨迹数据-----------------
        var that  = this;
	   	var xhr1 = new XMLHttpRequest();
 		xhr1.onreadystatechange = function () {
     	if (xhr1.readyState == 4 && (xhr1.status >= 200 && xhr1.status < 400)) {
        	var response = xhr1.responseText;
        	
            that._fishpath = JSON.parse(response);
            cc.log('load path finish');
     	}
 	};
		
		xhr1.open("GET", "http://118.190.89.153/assets/fish.trail.json?"+new Date().getTime(), true);
		xhr1.send();

    },

    Btn_test:function(){
      
        var id =this._pathid;
        cc.log('测试线路'+ this._pathid++);

        this.schedule(function() {
                //结束线路，重新开始
                var fp;
            if(this._step > this._fishpath.data[this._pathid].length-1 ) {
               
                    cc.log('move finish');
                   // this.node.destroy();     
                   this.unscheduleAllCallbacks();  
                   this._step=0;        
            }else{
                fp = this._fishpath.data[this._pathid][this._step];
              
                	this.fish.runAction(cc.spawn(cc.moveTo(0.1, fp[0]*this._width, fp[1]*this._height), 
					cc.rotateTo (this._steplen,fp[2])));    
                this._lasttime = new Date().getTime();
            }
            this._step++;
		}, 0.1);
    },
});
