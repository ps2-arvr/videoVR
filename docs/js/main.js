//�C�x���g�̐U�蕪��
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

  // �ϐ��̏�����
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

    // �R���e�i�̏���
    container = document.getElementById( 'canvas-frame' );

    container.addEventListener( 'click', function () {
      video.play();
    } );

    var select = document.getElementById( 'video_src' );
    select.addEventListener( 'change', function (e) {
      video.src = select.value;
      video.play();
    } );
    
    // video �v�f�𐶐�
    video = document.createElement( 'video' );
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.src = './video/BavarianAlps.mp4';
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
    video.setAttribute( 'playsinline', 'playsinline' );
    video.setAttribute( 'muted', 'muted' );
    video.play();

    // video ����e�N�X�`���𐶐�
    //1.texture��new����video��n�� 
    texture = new THREE.Texture( video );

    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.maxFilter = THREE.NearestFilter;
    texture.format = THREE.RGBFormat;

    // ����ɍ��킹�ăe�N�X�`�����X�V
    setInterval( function () {
      if ( video.readyState >= video.HAVE_CURRENT_DATA ) {
        texture.needsUpdate = true;
      }
    }, 1000 / 24 );

    // �J�����𐶐�
    camera = new THREE.PerspectiveCamera( 75, container.innerWidth / container.innerHeight, 1, 2000 );

    // 2.�V�[���𐶐�
    scene = new THREE.Scene();
    
    // ���̂��쐬���A�e�N�X�`���� video �����ɂ��Đ��������e�N�X�`����ݒ肵�܂�
    // 3. ���̂𐶐�����B���a500�A��60�A����40�ɐݒ肵�Ageometry�Ƃ������O�̕ϐ��Ɋi�[����B
    var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );

    // 4. 3.�ō�������̂̃X�P�[�����i-1,1,1�j�ɐݒ肷��
    geometry.scale( -1, 1, 1 );

    // 5. �쐬�������̂�1.�ō����texture��\��t��mesh�Ƃ������O�̕ϐ��Ɋi�[����B
    var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );

    // 6. 2.�ō쐬�����V�[����5.�ō쐬����mesh��ǉ�����
    scene.add( mesh );

    // �����_���[�𐶐�
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // �h���b�O�E�X���C�v�����ݒ�
    container.addEventListener( EVENT.TOUCH_START, onDocumentMouseDown, false );

    // ��ʂ̃��T�C�Y�ɑΉ�
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