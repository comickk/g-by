cc.Class({
    extends: cc.Component,

    properties: {
        _id:1,
        _num:1,
        _cost:1,
      goods_num:cc.Label,
      goods_cost:cc.Label,
      goods_icon:cc.Sprite,
      goods_spf:cc.SpriteFrame,      
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('setgoods',function(event){
            var msg = event.detail;
            this._id = msg.id;
            this._num = msg.num;
            this._cost = msg.cost;

            this.goods_num.string = this._num/10000;
            this.goods_cost.string = this._cost;

        },this);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
