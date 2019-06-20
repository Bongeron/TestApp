/*
 * このコードは、「alkn203さん」のコードを流用させて頂き作成しております。 
 * スクロールロジック・当たり判定など参考にさせて頂いています。
 */

phina.globalize();
// アセット設定
var ASSETS = {
  // イメージセット
  image: {
  //  'tomapiko': 'https://cdn.jsdelivr.net/npm/phina.js@0.2.3/assets/images/character/tomapiyo.png',
    'tomapiko': 'https://cdn.jsdelivr.net/npm/phina.js@0.2.3/assets/images/character/meropiyo.png',
},
  // アニメーションパターンセット
  spritesheet: {
    'tomapiko_ss': 'https://cdn.jsdelivr.net/gh/phinajs/phina.js@develop/assets/tmss/tomapiko.tmss',
  },
};
// グローバル変数定義
var GRID_SIZE     = 32; // グリッドサイズ定義
var GRID_X        = 32; // 横のマス数定義
var GRID_Y        = 20; // 縦のマス数定義
var SCREEN_WIDTH  = GRID_X * GRID_SIZE; // 画面サイズ横の定義(Todo:バーチャルコントローラー用に横の余白を作る。)
var SCREEN_HEIGHT = GRID_Y * GRID_SIZE; // 画面サイズ縦の定義(Todo:ステータス表示用に縦の余白を作る。)
var GRAVITY       = 9.8 / 18; // 重力
var JUMP_POWER    = 11;       // プレイヤーのジャンプ力定義
var PLAYER_SPEED  = 6;        // プレイヤーの移動速度定義(Todo: 各キャラクター種類毎にクラスで別定義にする)
var DEBUG = true;             // デバッグ用オプション
var COLORS = ["black","blue","red","green","yellow"];   // 背景用ブロックの色定義
var SCROLLING = false;        // スクロール中かどうかの判定用フラグ
var sindo = 0;                // ステージ読み込みテスト用のフリップフロップの変数

// ステージパターン定義(Todo: 20種類くらい作りたい + チュートリアル用 + ボス戦用)
var STAGE = [['44444444444444444444444444444444',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000001000001000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000000',
             '40000000000000000000000000000000',
             '44444444444444444444444444444444'],

             ['44444444444444444444444444444444',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40001111111111111100000000000004',
             '40000000000000111100111100000004',
             '40000000000000111100000000000004',
             '41111100000111111100000001111004',
             '40000000000000111100000000000004',
             '40000000000000111100000000000004',
             '40000000000000111100011110000004',
             '41111111110000111100000000000004',
             '40000000000000111100000000000004',
             '40000000000000111100000000000004',
             '40000111111111111100000000000004',
             '40000000000000111100000001111004',
             '40000000000000111100000000000004',
             '41111111110000111100000000000004',
             '40000000000000111100000000000000',
             '40000000000000111100000000000000',
             '44444444444444444444444444444444'],
            
             ['44444444444444444444444444444444',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000000000000000000004',
             '40000000000000011000000000000004',
             '40000000000000111100000000000004',
             '40000000000001111110000000000004',
             '40000000000011111111000000000004',
             '40000000000111111111100000000004',
             '40000000001111111111110000000004',
             '40000000011111111111111000000004',
             '40000000111111111111111100000004',
             '40000001111111111111111110000004',
             '40000011111111111111111111000004',
             '40000111111111111111111111100004',
             '00001111111111111111111111110000',
             '00001111111111111111111111110000',
             '44444444444444444444444444444444'],
            ];
// 
phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    // メインシーン初期化(Todo: 画面の端と移動可能領域の端を別に定義する必要あり。)
    this.superInit({
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    // シーンの背景を設定
    this.backgroundColor = 'skyblue';
    // グリッドサイズ、マス数を設定
    this.gx = Grid(SCREEN_WIDTH, GRID_X);
    this.gy = Grid(SCREEN_HEIGHT, GRID_Y);

    // DisplayElementを定義
    this.objectGroup = DisplayElement().addChildTo(this);

    // プレイヤーをシーンに登録
    this.player = Player().addChildTo(this);

    //初期位置を設定
    this.player.setPosition(this.gx.span(2), this.gy.span(17));

    //初回フロアの読み込みを実施
    this.setStage(STAGE[0],true);
  },
  // フロア表示処理
  setStage: function(stage,init) {
    var half = GRID_SIZE / 2;
    var self = this;

    //初期フロアか、次以降かを判定する
    var NextStage_Grid = (init) ? 0 : GRID_X;

    // ステージ配列情報を行単位で読み込む
    stage.each(function(arr, j) {
      // 行ごとに1文字単位で読み込み
      arr.toArray().each(function(id, i) {
        var x = self.gx.span(NextStage_Grid + i) + half;
        var y = self.gy.span(j) + half;

        // 取得した文字列が数値で1以上の場合、フロアの表示を実施
        if (isFinite(id) && id > 0) {
          //Todo: MAPチップ用のSpriteが出来たら、それに置き換え（希望）
          var elem = RectangleShape().addChildTo(self.objectGroup);
          
          elem.setPosition(x, y);
          elem.width = GRID_SIZE;
          elem.height = GRID_SIZE;
          elem.fill = COLORS[id];
          return;
        }
      });
    });
  },
  // シーンの更新処理
  update: function(app) {
    if (SCROLLING) return;
    this.checkState(app);
  },
  // 状況確認
  checkState: function(app) {
    var player = this.player;
    var stateV = this.player.verticalState;
    var stateH = this.player.horizontalState;
    var key = app.keyboard;
    
    if(stateH == 'MOVING_RIGHT') player.scaleX=1;
    if(stateH == 'MOVING_LEFT') player.scaleX=-1;

    // プレイヤーの状態によって、判断を分岐
    switch (stateV) {
      // 地面にいる状態の場合
      case 'STANDING' :
      case 'STOP' :
        // 地面があるかどうか確認、なければ落ちる
        if (!this.collisionY()) {
          player.moveY();
          player.verticalState = 'FALLING';
        } // 落ちてない時のみジャンプ有効
          else if (key.getKey('z')) {
          player.vy = -JUMP_POWER;
          player.verticalState = 'JUMPING';
          // ジャンプ時、飛ぶアニメーションに遷移
          player.anim.gotoAndPlay('fly');
        }
        // 横方向の状況を確認
        this.checkHorizonState(key);
        break;
    
    // ジャンプ中(上昇中)の場合
      case 'JUMPING':
        // 上向きの推進力を失ったら落ちるだけ
        if (player.vy > 0) {
          player.verticalState = 'FALLING';
        }
        else {
          player.moveY();
        }

        // 横方向の状況を確認
        this.checkHorizonState(key);
        break;
    
      // 落下中の場合  
      case 'FALLING':
        //地面に到達したら立ち状態に戻る
        if (this.collisionY()) {
          player.vy = 0;
          player.verticalState = 'STANDING';
        }
        else {
          // まだ落ちてるならはばたいて
          player.moveY();
          player.anim.gotoAndPlay('fly');
        }

        // 横方向の状況を確認
        this.checkHorizonState(key);
        break;
     
        // 多分この状況にはならないはず
    case 'STOP':
        break;
    }
  },

  // 横方向のキー押下・判定等の処理
  checkHorizonState: function(key){
    var player = this.player;
    var stateV = this.player.verticalState;
    var stateH = this.player.horizontalState;
    
    // 決めうちで右向きか左向きかでキャラクターの向きを指定
    if(stateH == 'MOVING_RIGHT') player.scaleX=1;
    if(stateH == 'MOVING_LEFT') player.scaleX=-1;
    
    // ジャンプ中か否かによって、横方向の移動量を制限する
    // ジャンプ中の横移動は可能だけど、半分しか横に動けない
    var jumpHosei = (stateV == 'JUMPING' || stateV == 'FALLING' ) ? 2 : 1;

    // 右キー押下時の処理
    if(key.getKey('right')) {
        player.x += (PLAYER_SPEED/jumpHosei);
        player.horizontalState = 'MOVING_RIGHT';
        if(jumpHosei != 2)
          player.anim.gotoAndPlay('left');

        this.collisionX();

        // 右方向の一方通行で画面スクロールが発生するため
        // 右のみ判断を行う
        if (player.x > SCREEN_WIDTH) {
          player.horizontalState = 'STOP';
          player.verticalState = 'STOP';
          player.vy = 0;
          this.scrollX();
        }    
    } else if(key.getKey('left')) {
        player.x -= (PLAYER_SPEED/jumpHosei);
        player.horizontalState = 'MOVING_LEFT';
        if(jumpHosei != 2)
         player.anim.gotoAndPlay('left');

        this.collisionX();
    } else {
        if(jumpHosei != 2)
          // ジャンプ中じゃないかつ移動が無い場合はアニメーションをとめる
	        player.anim.gotoAndStop('left'); 
    }
  },
  // 横方向の当たり判定を確認
  collisionX: function() {
    var player = this.player;
    var jumpHosei = (player.verticalState == 'JUMPING' || 
                     player.verticalState == 'FALLING' ) ? 2 : 1;

    // 当たり判定用のボックスを作る(
    if (player.horizontalState == 'MOVING_LEFT') 
      var rect = Rect(player.left - (PLAYER_SPEED/jumpHosei), 
                      player.top, 
                      player.width, 
                      player.height);
    else
      var rect = Rect(player.left + (PLAYER_SPEED/jumpHosei), 
                      player.top, 
                      player.width , 
                      player.height);

    var result = false;
    // プレイヤー以外の物体に対して当たり判定を確認
    this.objectGroup.children.some(function(obj) {
      // 四角同士の当たり判定チェック
      if (Collision.testRectRect(rect, obj)) {
      
        // 左からあたった場合
        if (rect.x < obj.x) player.right = obj.left;
        // 右からあたった場合
        if (obj.x < rect.x) player.left = obj.right; 
        
        result = true;
        return true;
      }
    });
    return result;
  },
  // 縦方向の当たり判定を確認
  collisionY: function() {
    var player = this.player;

    // ジャンプ中か否かで当たり判定の微調整を行う
    var vy = player.vy === 0 ? 4: player.vy;
    // 当たり判定用のボックスを作る
    if (player.verticalState == 'JUMPING') 
      var rect = Rect(player.left, player.top - vy, player.width, player.height);
    else
      var rect = Rect(player.left, player.top + vy, player.width, player.height);
    
      var result = false;
    // プレイヤー以外の物体に対して当たり判定を確認
    this.objectGroup.children.some(function(obj) {
      // 四角同士の当たり判定チェック
      if (Collision.testRectRect(rect, obj)) {
        // 上からあたった場合
        if (rect.y < obj.y) player.bottom = obj.top;
        
        // 下からあたった場合(これで頭ぶつけるはずなんだけど･･･かんつーしちゃう)
        if (rect.y > obj.y) player.top = obj.bottom;
        
        result = true;
        return true;
      }
    });
    return result;
  },
  // 次のフロアへの画面移動
  scrollX: function() {
    SCROLLING = true; //スクロール中フラグをON
    
    //フロア深度を加算(Todo)
    if(sindo === 0) sindo = 2;
    else sindo = 0;
    
    //Todo: Stage情報を複数作成
    //Todo: 20種類 + チュートリアル + ボス用
    this.setStage(STAGE[sindo],false);

    var player = this.player;
    var flows = [];
    var self = this;

    // MAPを画面移動させるフローを登録する
    this.objectGroup.children.each(function(obj) {
      var flow = Flow(function(resolve) {
        obj.tweener.by({x: -SCREEN_WIDTH}, 1000)
                   .call(function() {
                     resolve();
                   }).play();
      });
      // flow配列に登録
      flows.push(flow);
    });
    // プレイヤーもMAPと一緒に画面移動するフローを登録する
    var flow = Flow(function(resolve) {
      SCREEN_WIDTH
      player.tweener.to({x: self.gx.span(2),}, 1000)  // ２升目に移動させる。
                    .call(function() {
                      resolve();
                    }).play();
    });
    var half = GRID_SIZE/2;
    // flow配列に登録
    flows.push(flow);
    // 先ほど登録したTweenを一括起動させる
    Flow.all(flows).then(function() {

      (2).times(function(i){
        var elem = RectangleShape().addChildTo(self.objectGroup);
        elem.setPosition(self.gx.span(0)+ half, self.gy.span(17+i)+ half);
          elem.width = GRID_SIZE ;
          elem.height = GRID_SIZE;
          elem.fill = COLORS[3];
          elem.tweener.to({width:GRID_SIZE,
          height:GRID_SIZE,},2000)
          .call(function() {
            // 移動完了後の状態を作成する
            player.horizontalState = 'MOVING_RIGHT'; 
            player.verticalState = 'STANDING';
            SCROLLING = false;
          }).play();;  
      });
      
    });
  },
});
// プレイヤーの定義
phina.define('Player', {
  superClass: 'Sprite',
  // プレイヤー初期化
  init: function() {
    // プレイヤーキャラクターを設定(Todo: 複数のキャラクターから1種類選べるように修正)
    this.superInit('tomapiko', GRID_SIZE, GRID_SIZE);
    // アニメーションパターンを設定
    this.anim = FrameAnimation('tomapiko_ss').attachTo(this);

    // 初期アニメーションを設定
    this.anim.gotoAndStop('left');

    // 初期方向を設定
    this.scaleX = 1;
    
    // 縦方向の移動を設定(地面に接していれば0)
    this.vy = 0;
    // 横方向の状態を設定
    this.horizontalState = 'MOVING_RIGHT';
    // 縦方向の状態を設定
    this.verticalState = 'FALLING';
  },
  // 縦方向の移動を設定(重力)
  moveY: function() {
    this.vy += GRAVITY;
    this.y += this.vy;
  },
});
// メイン
phina.main(function() {
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    startLabel: 'main',
    // アセット読み込み
    assets: ASSETS,
  });
  
  app.run();
});
