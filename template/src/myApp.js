var MyLayer = cc.Layer.extend({
    helloLabel:null,
    sprite:null,
    soa:null,
    _bullets:null,
    _targets:null,

    init:function () {
        console.log("执行");
        //////////////////////////////
        // 1. super init first
        this._super();
        // 用来装子弹的数组
        this._bullets = [];
        // 用来装敌机
        this._targets = [];
        // 获得游戏可视的尺寸
        var winSize = cc.director.getWinSize();
        // 获取屏幕坐标原点
        var origin = cc.director.getVisibleOrigin();
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            s_CloseNormal,
            s_CloseSelected,
            function () {
                cc.log("closezzz");
            },this);
        closeItem.setAnchorPoint(0.5, 0.5);

        var menu = new cc.Menu(closeItem);
        menu.setPosition(0, 0);
        this.addChild(menu, 1);
        closeItem.setPosition(size.width - 20, 20);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        this.helloLabel = new cc.LabelTTF("Hello World", "Impact", 38);
        // position the label on the center of the screen
        this.helloLabel.setPosition(size.width / 2, size.height - 40);
        // add the label as a child to this layer
        this.addChild(this.helloLabel, 5);

        //新添加
        this.soa =new cc.Sprite(s_CloseSelected_2);
        this.soa.x = 200;
        this.soa.y = 300;
        this.addChild(this.soa);

        //每5秒执行一次，无次数限制
      this.schedule(this.notRepeat,0.2);
        // 添加增加敌机的定时器
      this.schedule(this.addTarget,0.4);
      // 添加碰撞检测，不加第二个参数，默认为每帧执行一次
      this.schedule(this.updateGame);

      var listener1 = cc.EventListener.create({//添加点击移动飞机
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,                        // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
        onTouchBegan: function (touch, event) {        //实现 onTouchBegan 事件处理回调函数
          var target = event.getCurrentTarget();    // 获取事件所绑定的 target, 通常是cc.Node及其子类

          // 获取当前触摸点相对于按钮所在的坐标
          var locationInNode = target.convertToNodeSpace(touch.getLocation());
          var s = target.getContentSize();
          var rect = cc.rect(0, 0, s.width, s.height);

          if (cc.rectContainsPoint(rect, locationInNode)) {        // 判断触摸点是否在按钮范围内
            cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
            target.opacity = 180;
            return true;
          }
          return false;
        },
        onTouchMoved: function (touch, event) {            //实现onTouchMoved事件处理回调函数, 触摸移动时触发
          // 移动当前按钮精灵的坐标位置
          var target = event.getCurrentTarget();
          var delta = touch.getDelta();              //获取事件数据: delta
          target.x += delta.x;
          target.y += delta.y;
        },
        onTouchEnded: function (touch, event) {            // 实现onTouchEnded事件处理回调函数
          var target = event.getCurrentTarget();
          cc.log("sprite onTouchesEnded.. ");
          target.setOpacity(255);
          /*if (target == this.soa) {
            this.soa.setLocalZOrder(100);            // 重新设置 ZOrder，显示的前后顺序将会改变
          } else if (target == sprite1) {
            this.soa.setLocalZOrder(0);
          }*/
        }
        });
      cc.eventManager.addListener(listener1, this.soa);


    },
    notRepeat: function() {//监视移动
      /*var winSize =cc.Director.getInstance().getWinSize();
      var origin = cc.Director.getInstance().getVisibleOrigin();*/
        // 获得游戏可视的尺寸
        var winSize = cc.director.getWinSize();
        // 获取屏幕坐标原点
        var origin = cc.director.getVisibleOrigin();

      /*var size = cc.Director.getInstance().getWinSize();*/
      /*var sizePx = cc.Director.getInstance().getWinSizeInPixels();*/
      // 获得飞机的位置
      var planePosition = this.soa.getPosition();
      // 子弹穿越屏幕要花费的秒数
      var bulletDuration = 1;

      // 创建一个子弹
      var bullet = new cc.Sprite(zidan);
      //new cc.Sprite(s_HelloWorld);

      // 根据飞机的位置，初始化子弹的位置
      bullet.setPosition(cc.p(planePosition.x,planePosition.y+bullet.getContentSize().height));

      // 一个移动的动作
      // 第一个参数为移动到目标所需要花费的秒数，为了保持速度不变，需要按移动的距离与屏幕高度按比例计算出花费的秒数
      var actionMove = cc.MoveTo.create(bulletDuration * ((winSize.height - planePosition.y - bullet.getContentSize().height/2)/winSize.height),
        cc.p(planePosition.x,
          origin.y + winSize.height + bullet.getContentSize().height/2));
      // 设置一个回调函数，移动完毕后回调spriteMoveFinished（）方法。
      var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished,this);
      // 让子弹执行动作
      bullet.runAction(cc.Sequence.create(actionMove,actionMoveDone));
      // 为子弹设置标签，以后可以根据这个标签判断是否这个元素为子弹
      bullet.setTag(6);

      this._bullets.push(bullet);
      this.addChild(bullet,0);
      cc.log("每0.2秒执行一次");
    },
    spriteMoveFinished:function(sprite){
      // 将元素移除出Layer
      this.removeChild(sprite, true);
      if(sprite.getTag()==6){
        // 把子弹从数组中移除
        var index = this._bullets.indexOf(sprite);
        if (index > -1) {
          this._bullets.splice(index, 1);
        }
      }
    },
    //添加敌机
    addTarget:function(){

        var target = new cc.Sprite(diji);
        target.setTag(1);

        var winSize = cc.director.getWinSize();

        // 设置敌机随机出现的X轴的值
        var minX = target.getContentSize().width/2;
        var maxX = winSize.width - target.getContentSize().width/2;
        var rangeX = maxX - minX;
        var actualX = Math.random() * rangeX + minX;
        // 在一定范围内随机敌机的速度
        var minDuration = 2.5;
        var maxDuration = 4;
        var rangeDuration = maxDuration - minDuration;
        var actualDuration = Math.random() * rangeDuration + minDuration;

        target.setPosition(cc.p(actualX, winSize.height + target.getContentSize().height/2));

        var actionMove = cc.MoveTo.create(actualDuration ,cc.p(actualX, 0 - target.getContentSize().height));
        var actionMoveDone = cc.CallFunc.create(this.spriteMoveFinished,this);

        target.runAction(cc.Sequence.create(actionMove,actionMoveDone));

        this.addChild(target,1);
        this._targets.push(target);
    },
    spriteMoveFinished:function(sprite){
        // 将元素移除出Layer
        this.removeChild(sprite, true);
        if(sprite.getTag()==1){
            // 把目标从数组中移除
            var index = this._targets.indexOf(sprite);
            if (index > -1) {
                this._targets.splice(index, 1);
            }
        } else if(sprite.getTag()==6){
            // 把子弹从数组中移除
            var index = this._bullets.indexOf(sprite);
            if (index > -1) {
                this._bullets.splice(index, 1);
            }
        }
    },
    //击中敌机
    updateGame:function(){
        var targets2Delete = [];

        var i ;
        //遍历屏幕上的每个敌机
        for( i in this._targets ){
            //console.log("targetIterator");
            var target = this._targets[ i ];
            // 获得敌机的碰撞矩形
            var targetRect = target.getBoundingBox();

            var bullets2Delete = [];
            // 对于每个敌机，遍历每个屏幕上的子弹，判断是否碰撞
            for(i in this._bullets){
                var bullet = this._bullets[ i ];
                var bulletRect = bullet.getBoundingBox();
                // 判断两个矩形是否碰撞
                if(cc.rectIntersectsRect(bulletRect,targetRect)){
                    // 碰撞则将子弹加入待删除列表
                    bullets2Delete.push(bullet);
                }
            }
            // 如果待删除的子弹数组的内容大于零，说明敌机碰到了子弹，将敌机加入待删除数组
            if(bullets2Delete.length > 0){
                targets2Delete.push(target);
            }

            //删除发生碰撞的每个子弹
            for(i in bullets2Delete){
                var bullet = bullets2Delete[ i ];
                var index = this._bullets.indexOf(bullet);
                if (index > -1) {
                    this._bullets.splice(index, 1);
                }
                this.removeChild(bullet);
            }

            bullets2Delete = null;
        }
        //删除发生碰撞的每个敌机
        for( i in targets2Delete){
            var target = targets2Delete[ i ];

            var index = this._targets.indexOf(target);
            if (index > -1) {
                this._targets.splice(index, 1);
            }

            this.removeChild(target);
        }

        targets2Delete = null;

    }
});

var MyScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MyLayer();
        this.addChild(layer);
        layer.init();
    }
});
