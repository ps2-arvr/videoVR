//イベントの振り分け
var EVENT = {};
if ('ontouchstart' in window) {
  EVENT.TOUCH_START = 'touchstart';
  EVENT.TOUCH_MOVE = 'touchmove';
  EVENT.TOUCH_END = 'touchend';
} else {
  EVENT.TOUCH_START = 'mousedown';
  EVENT.TOUCH_MOVE = 'mousemove';
  EVENT.TOUCH_END = 'mouseup';
}

(function () {

  // 変数の初期化
  var camera, scene, renderer, video, texture, container;
  var fov = 60,
  isUserInteracting = false,
  onMouseDownMouseX = 0, onMouseDownMouseY = 0,
  lon = 0, onMouseDownLon = 0,
  lat = 0, onMouseDownLat = 0,
  phi = 0, theta = 0;

  init();
  animate();

  function init() {

    // コンテナの準備
    container = document.getElementById( 'canvas-frame' );

    container.addEventListener( 'click', function () {
      video.play();
    } );

    var select = document.getElementById( 'video_src' );
    select.addEventListener( 'change', function (e) {
      video.src = select.value;
      video.play();
    } );
    //URLパラメータ文字を取得する。
    var param = location.search
    param = param.replace("?", ""); //?を取り除く

    // video 要素を生成
    video = document.createElement( 'video' );
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    if (param == "CrystalShower"){
	video.src = './video/CrystalShower.mp4';
   }else{
        video.src = './video/BavarianAlps.mp4';
   }
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    video.setAttribute( 'playsinline', 'playsinline' );
    video.setAttribute( 'muted', 'muted' );
    video.play();

    // video からテクスチャを生成
    //1.textureをnewしてvideoを渡す 
    texture = new THREE.Texture( video );

    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.maxFilter = THREE.NearestFilter;
    texture.format = THREE.RGBFormat;

    // 動画に合わせてテクスチャを更新
    setInterval( function () {
      if ( video.readyState >= video.HAVE_CURRENT_DATA ) {
        texture.needsUpdate = true;
      }
    }, 1000 / 24 );

    // カメラを生成
    camera = new THREE.PerspectiveCamera( 75, container.innerWidth / container.innerHeight, 1, 2000 );

    // 2.シーンを生成
    scene = new THREE.Scene();
    
    // 球体を作成し、テクスチャに video を元にして生成したテクスチャを設定します
    // 3. 球体を生成する。半径500、幅60、高さ40に設定し、geometryという名前の変数に格納する。
    var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );

    // 4. 3.で作った球体のスケールを（-1,1,1）に設定する
    geometry.scale( -1, 1, 1 );

    // 5. 作成した球体に1.で作ったtextureを貼り付けmeshという名前の変数に格納する。
    var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );

    // 6. 2.で作成したシーンに5.で作成したmeshを追加する
    scene.add( mesh );

    // レンダラーを生成
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // ドラッグ・スワイプ操作を設定
    container.addEventListener( EVENT.TOUCH_START, onDocumentMouseDown, false );

    // 画面のリサイズに対応
    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize( null );
  }
  function onWindowResize ( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }
  function onDocumentMouseDown( event ) {
    event.preventDefault();
    if(event.clientX) {
      onMouseDownMouseX = event.clientX;
      onMouseDownMouseY = event.clientY;
    } else if(event.touches) {
      onMouseDownMouseX = event.touches[0].clientX
      onMouseDownMouseY = event.touches[0].clientY;
    } else {
      onMouseDownMouseX = event.changedTouches[0].clientX
      onMouseDownMouseY = event.changedTouches[0].clientY
    }
    onMouseDownLon = lon;
    onMouseDownLat = lat;
    document.addEventListener( EVENT.TOUCH_MOVE, onDocumentMouseMove, false );
    document.addEventListener( EVENT.TOUCH_END, onDocumentMouseUp, false );
  }
  function onDocumentMouseMove( event ) {
    event.preventDefault();
    if(event.clientX) {
      var touchClientX = event.clientX;
      var touchClientY = event.clientY;
    } else if(event.touches) {
      var touchClientX = event.touches[0].clientX
      var touchClientY = event.touches[0].clientY;
    } else {
      var touchClientX = event.changedTouches[0].clientX
      var touchClientY = event.changedTouches[0].clientY
    }
    lon = ( touchClientX - onMouseDownMouseX ) * -0.15 + onMouseDownLon;
    lat = ( touchClientY - onMouseDownMouseY ) * -0.15 + onMouseDownLat;
  }
  function onDocumentMouseUp( event ) {
    document.removeEventListener( EVENT.TOUCH_MOVE, onDocumentMouseMove, false );
    document.removeEventListener( EVENT.TOUCH_END, onDocumentMouseUp, false );
  }
  function animate() {
    renderer.setAnimationLoop( render );
  }
  function render() {
    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.Math.degToRad( 90 - lat );
    theta = THREE.Math.degToRad( lon );
    camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = 100 * Math.cos( phi );
    camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
  }

})();
