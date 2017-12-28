var MyLayer = cc.Layer.extend({
    helloLabel:null,
    sprite:null,
    soa:null,
    _bullets:null,

    init:function () {
        console.log("执行");
        //////////////////////////////
        // 1. super init first
        this._super();

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
    notRepeat: function() {
      /*var winSize =cc.Director.getInstance().getWinSize();
      var origin = cc.Director.getInstance().getVisibleOrigin();*/
      var winSize =cc.Director.getInstance().getWinSize();
      var origin = cc.Director.getInstance().getWinSizeInPixels();

      /*var size = cc.Director.getInstance().getWinSize();*/
      /*var sizePx = cc.Director.getInstance().getWinSizeInPixels();*/
      // 获得飞机的位置
      var planePosition = this.soa.getPosition();
      // 子弹穿越屏幕要花费的秒数
      var bulletDuration = 1;

      // 创建一个子弹
      var bullet = cc.Sprite.create(zidan,cc.rect(66,237,7,20));

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
      cc.log("每5秒执行一次");
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
