var camera, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var app = new App(scene);
var lon = 0, lat = 0, phi=0, theta = 0;
var video;

//THREE.Raycaster用
var raycaster,scopedObj;
var cursor= new THREE.Vector2(0,0);

var j =0;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	element = renderer.domElement;
	container = document.getElementById('example');
	container.appendChild(element);

	effect = new THREE.StereoEffect(renderer);
	//THREE.Raycaster
	raycaster = new THREE.Raycaster();

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000 );//主観位置?
	lat = Math.max( - 85, Math.min( 85, lat ) );//
	phi = THREE.Math.degToRad( 40 - lat );//上下調整?
	theta = THREE.Math.degToRad( lon );
	camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = 100 * Math.cos( phi );
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
	
	scene.add(camera);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	//マウス操作
	controls = new THREE.OrbitControls(camera, element);
	//controls.rotateUp(Math.PI / 9);
	controls.target.set(
		camera.position.x-20,
		camera.position.y,
		camera.position.z+0.1
	);
	controls.noZoom = true;
	controls.noPan = true;
	//ジャイロ操作に切り替え
	function setOrientationControls(e) {
		if (!e.alpha) {
			return;
		}

		controls = new THREE.DeviceOrientationControls(camera, true);
		controls.connect();
		controls.update();

		element.addEventListener('click', fullscreen, false);

		window.removeEventListener('deviceorientation', setOrientationControls, true);
	}
	window.addEventListener('deviceorientation', setOrientationControls, true);
	window.addEventListener('resize', resize, false);
	setTimeout(resize, 1);
	app.init(camera);
}

var width = 0;
var height = 0;

function resize() {
	width = container.offsetWidth;
	height = container.offsetHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize(width, height);

	effect.setSize(width, height);
}

function update(dt) {
	resize();

	camera.updateProjectionMatrix();

	controls.update(dt);
	app.update(dt);
}
	
	var arcLen = 0;
	var materialTorus = new THREE.MeshLambertMaterial( { color: 0xEFFBFB } );
	var geometryTorus;
function render(dt) {
	//ホットスポットに注視点を合わせた時の処理
	raycaster.setFromCamera( cursor, camera );
	var intersects = raycaster.intersectObjects(scene.children, true);
	if ( intersects.length > 1 ) {
		for(var i=0; i < intersects.length; i++){
			//オブジェクトが中央に来たとき、円弧のパラメータを変化させる
			if ( intersects[i].object.name == 'loadTorus') {
			//円弧の注視を中断していた場合、過去のtorusCubeをdisposeする
			if(geometryTorus != null){
			scene.remove( this.torusCube );
			geometryTorus.dispose();
			}
  			arcLen +=0.02;
  			geometryTorus = new THREE.TorusGeometry(45, 1.8,3, 60,arcLen);
			this.torusCube = new THREE.Mesh( geometryTorus, materialTorus );
			this.torusCube.position.set(-30, 60, -230);
			this.torusCube.transparent=true
			this.scene.add( this.torusCube );
			this.torusCube.rotation.setFromRotationMatrix(this.camera.matrix);
			//this.torusCube.rotation.z = 2.1;
				//円弧が頂点に到達した時を判定し、動画名をパラメータに渡しページを更新する
				if(arcLen>6.5){
				j++;
					if( j == 4 ){
					j=0;
					}
				app.updateVideoTexture(j);
				arcLen = 0;
				}
			//二つ目のホットスポットの注視イベント
			}else if(intersects[i].object.name == 'secondLoad'){
			if(geometryTorus != null){
			scene.remove( this.torusCube );
			geometryTorus.dispose();
			}
  			arcLen +=0.02;
  			geometryTorus = new THREE.TorusGeometry(45, 1.8,3, 60,arcLen);
			this.torusCube = new THREE.Mesh( geometryTorus, materialTorus );
			this.torusCube.position.set(-30, 60, 230);
			this.torusCube.transparent=true
			this.scene.add( this.torusCube );
			this.torusCube.rotation.setFromRotationMatrix(this.camera.matrix);
			//this.torusCube.rotation.z = 2.1;
				//円弧が頂点に到達した時を判定し、動画名をパラメータに渡しページを更新する
				if(arcLen>6.5){
				j--;
					if( j == -1){
					j=3;
					}
				app.updateVideoTexture(j);
				arcLen = 0;
				}
			}
		}
	//円弧の注視を中断した際に、disposeを行う
	}else if (intersects.length == 1){
		if(geometryTorus != null){
			scene.remove( this.torusCube );
			geometryTorus.dispose();
			if (0 < arcLen ){
				arcLen -=0.009;
				geometryTorus = new THREE.TorusGeometry(45, 1.8,3, 60,arcLen);
				this.torusCube = new THREE.Mesh( geometryTorus, materialTorus );
				this.torusCube.position.set(-30, 60, -230);
				this.torusCube.transparent=true
				this.scene.add( this.torusCube );
				this.torusCube.rotation.setFromRotationMatrix(this.camera.matrix);
			}
		}
	}
	app.render(dt);
	effect.render(scene, camera);
}

function animate(t) {
	requestAnimationFrame(animate);

	update(clock.getDelta());
	render(clock.getDelta());
}

function fullscreen() {
	if (container.requestFullscreen) {
		container.requestFullscreen();
	} else if (container.msRequestFullscreen) {
		container.msRequestFullscreen();
	} else if (container.mozRequestFullScreen) {
		container.mozRequestFullScreen();
	} else if (container.webkitRequestFullscreen) {
		container.webkitRequestFullscreen();
	}

}
