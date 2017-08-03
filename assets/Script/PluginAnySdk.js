

function PluginSdk(){}

//PluginSdk.prototype.ws=null;
PluginSdk.prototype.log='-----anysdk------\n';
PluginSdk.prototype.Init = function () {   

    if (typeof anysdk === 'undefined' || !cc.sys.isMobile)
    {
        //this.msg.string = '-----------------no anysdk';
        this.log +='-----------------no anysdk\n';
        console.log('-----------------no anysdk');
    }
    else
    {              
        //this.msg.string = '-----------------has anysdk';
            console.log('----------------has anysdk');
            this.log +='-----------------has anysdk\n';
        
        this.iapPlugin = anysdk.agentManager.getIAPPlugin();
        if (this.iapPlugin) {
            this.iapPlugin.setListener(this.onPayResult, this);
        }

        this.userPlugin = anysdk.agentManager.getUserPlugin();
        if (this.userPlugin) {
            this.userPlugin.setListener(this.onUserResult, this);
        }
    }
    return this;
    //global.anysdk = this;
    //cc.game.addPersistRootNode(this.node);
}

//---------------------支付类-----------------------------------------
//支付商品
PluginSdk.prototype.payForProduct=function () {
    if (!this.iapPlugin) {
        console.log('no support anysdk');
        //this.msg.string = '--------no support anysdk';
         this.log +='--------no support anysdk\n';
        return;
    }
     this.log +='--------start anysdk pay \n';
    var info = {
        'Product_Id': '1',                    //商品唯一标示符
        'Product_Name': 'three hearts',            //商品名称
        'Product_Price': '0.1',                    //商品单价
        'Product_Count': '1',                      //商品数量
        'Product_Desc': 'three hearts',            //商品描述 
        'Coin_Name': 'heart',                      //虚拟币名称
        'Coin_Rate': '3',                          //虚拟币兑换率
        'Role_Id': "id",    //角色唯一标示符
        'Role_Name': 'name',                      //角色名称
        'Role_Grade': '1',                         //角色等级
        'Role_Balance': "1",  //虚拟币余额
        'Vip_Level': '0',                          //VIP等级
        'Party_Name': 'null',                      //工会名称
        'Server_Id': '1',                          //服务器唯一标示符
        'Server_Name': '1',                        //服务器名称
        'EXT': 'Cocos Creator'                     //扩展字段
    };
    this.iapPlugin.payForProduct(info);
},
   
//获取订单号
PluginSdk.prototype.getOrderId = function () {
    if (!this.iapPlugin) {
        // console.log();
        return;
    }
    var orderId = this.iapPlugin.getOrderId();
    // console.log();
},

//支付结果
PluginSdk.prototype.onPayResult = function (code, msg) {
    cc.log(' PAY RESULT ########## code: ' + code + ',msg: ' + msg);
    switch (code) {
        case anysdk.PayResultCode.kPaySuccess:// 支付系统支付成功
            console.log(' kPaySuccess ');
            break;
        case anysdk.PayResultCode.kPayCancel:// 支付系统支付取消
            console.log(' kPayCancel ');
            break;
        case anysdk.PayResultCode.kPayFail:// 支付系统支付失败
        case anysdk.PayResultCode.kPayNetworkError:// 支付系统网络错误
        case anysdk.PayResultCode.kPayProductionInforIncomplete:// 支付系统支付信息不完整
            console.log(' kPayFail ');
            break;
        case anysdk.PayResultCode.kPayInitSuccess:// 支付系统初始化成功
            console.log(' kPayInitSuccess ');
            break;
        case anysdk.PayResultCode.kPayInitFail:// 支付系统初始化失败
            console.log(' kPayInitFail ');
            break;
        case anysdk.PayResultCode.kPayNowPaying:// 支付系统正在支付中
            console.log(' kPayNowPaying ');
            break;
        default:
            break;
    }

//--------------登录类----------------------------------------------
    

    PluginSdk.prototype.login=function () {
        if (!this.userPlugin) {
            SuspensionTips.init.showTips(' this.userPlugin is null  ');
            return;
        }
        this.userPlugin.login();
    }

    PluginSdk.prototype.isLogined= function () {
        if (!this.userPlugin) {
            SuspensionTips.init.showTips(' this.userPlugin is null  ');
            return;
        }
        var flag = this.userPlugin.isLogined();
        SuspensionTips.init.showTips(' isLogined ' + flag);
    }

    PluginSdk.prototype.logout= function () {
        if (!this.userPlugin || !this.userPlugin.logout) {
            SuspensionTips.init.showTips(' this.userPlugin is null or logout is not supported ');
            return;
        }
        this.userPlugin.logout();
    }

    PluginSdk.prototype.enterPlatform=function () {
        if (!this.userPlugin || !this.userPlugin.enterPlatform) {
            SuspensionTips.init.showTips(' this.userPlugin is null or enterPlatform is not supported ');
            return;
        }
        this.userPlugin.enterPlatform();
    }

    PluginSdk.prototype.showToolBar=function () {
        if (!this.userPlugin || !this.userPlugin.showToolBar) {
            SuspensionTips.init.showTips(' this.userPlugin is null or showToolBar is not supported ');
            return;
        }
        this.userPlugin.showToolBar(anysdk.ToolBarPlace.kToolBarTopLeft);
    },

    PluginSdk.prototype.hideToolBar= function () {
        if (!this.userPlugin || !this.userPlugin.hideToolBar) {
            SuspensionTips.init.showTips(' this.userPlugin is null or hideToolBar is not supported ');
            return;
        }
        this.userPlugin.hideToolBar();
    }

    PluginSdk.prototype.accountSwitch= function () {
        if (!this.userPlugin || !this.userPlugin.accountSwitch) {
            SuspensionTips.init.showTips(' this.userPlugin is null or accountSwitch is not supported ');
            return;
        }
        this.userPlugin.accountSwitch();
    }

   PluginSdk.prototype. realNameRegister= function () {
        if (!this.userPlugin || !this.userPlugin.realNameRegister) {
            SuspensionTips.init.showTips(' this.userPlugin is null or realNameRegister is not supported ');
            return;
        }
        this.userPlugin.realNameRegister();
    }

    PluginSdk.prototype.antiAddictionQuery= function () {
        if (!this.userPlugin || !this.userPlugin.antiAddictionQuery) {
            SuspensionTips.init.showTips(' this.userPlugin is null or antiAddictionQuery is not supported ');
            return;
        }
        this.userPlugin.antiAddictionQuery();
    }

   PluginSdk.prototype. submitLoginGameRole=function () {
        if (!this.userPlugin || !this.userPlugin.submitLoginGameRole) {
            SuspensionTips.init.showTips(' this.userPlugin is null or submitLoginGameRole is not supported ');
            return;
        }
        var data = {
            'roleId': '123456',
            'roleName': 'test',
            'roleLevel': '10',
            'zoneId': '123',
            'zoneName': 'test',
            'dataType': '1',
            'ext': 'login'
        };
        this.userPlugin.submitLoginGameRole(data);
    }

    PluginSdk.prototype.onUserResult=function (code, msg) {
        cc.log(' USER RESULT ########## code: ' + code + ',msg: ' + msg);
        switch (code) {
            case anysdk.UserActionResultCode.kInitSuccess:
                SuspensionTips.init.showTips(' kInitSuccess ');
                break;
            case anysdk.UserActionResultCode.kInitFail:
                SuspensionTips.init.showTips(' kInitFail ');
                break;
            case anysdk.UserActionResultCode.kLoginSuccess:
                SuspensionTips.init.showTips(' kLoginSuccess ');
                break;
            case anysdk.UserActionResultCode.kLoginNetworkError:
                SuspensionTips.init.showTips(' kLoginNetworkError ');
                break;
            case anysdk.UserActionResultCode.kLoginNoNeed:
                SuspensionTips.init.showTips(' kLoginNoNeed ');
                break;
            case anysdk.UserActionResultCode.kLoginFail:
                SuspensionTips.init.showTips(' kLoginFail ');
                break;
            case anysdk.UserActionResultCode.kLoginCancel:
                SuspensionTips.init.showTips(' kLoginCancel ');
                break;
            case anysdk.UserActionResultCode.kLogoutSuccess:
                SuspensionTips.init.showTips(' kLogoutSuccess ');
                break;
            case anysdk.UserActionResultCode.kLogoutFail:
                SuspensionTips.init.showTips(' kLogoutFail ');
                break;
            case anysdk.UserActionResultCode.kPlatformEnter:
                SuspensionTips.init.showTips(' kPlatformEnter ');
                break;
            case anysdk.UserActionResultCode.kPlatformBack:
                SuspensionTips.init.showTips(' kPlatformBack ');
                break;
            case anysdk.UserActionResultCode.kPausePage:
                SuspensionTips.init.showTips(' kPausePage ');
                break;
            case anysdk.UserActionResultCode.kExitPage:
                SuspensionTips.init.showTips(' kExitPage ');
                break;
            case anysdk.UserActionResultCode.kAntiAddictionQuery:
                SuspensionTips.init.showTips(' kAntiAddictionQuery ');
                break;
            case anysdk.UserActionResultCode.kRealNameRegister:
                SuspensionTips.init.showTips(' kRealNameRegister ');
                break;
            case anysdk.UserActionResultCode.kAccountSwitchSuccess:
                SuspensionTips.init.showTips(' kAccountSwitchSuccess ');
                break;
            case anysdk.UserActionResultCode.kAccountSwitchFail:
                SuspensionTips.init.showTips(' kAccountSwitchFail ');
                break;
            case anysdk.UserActionResultCode.kOpenShop:
                SuspensionTips.init.showTips(' kOpenShop ');
                break;
            default:
                break;
        }
    }
}
//var plugin = new PluginSdk();  
//module.exports =plugin.Init();
module.exports = new PluginSdk();  