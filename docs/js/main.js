var camera, renderer;
var effect, controls;
var element, container;
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var app = new App(scene);
var lon = 0, lat = 0, phi=0, theta = 0;
var video;
//THREE.Raycaster�p
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

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000 );//��ψʒu?
	lat = Math.max( - 85, Math.min( 85, lat ) );//
	phi = THREE.Math.degToRad( 40 - lat );//�㉺����?
	theta = THREE.Math.degToRad( lon );
	camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = 100 * Math.cos( phi );
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
	
	scene.add( camera );
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	//�}�E�X����
	controls = new THREE.OrbitControls( camera, element );
	//controls.rotateUp(Math.PI / 9);
	controls.target.set(
		camera.position.x-20,
		camera.position.y,
		camera.position.z+0.1
	);
	controls.noZoom = true;
	controls.noPan = true;
	//�W���C������ɐ؂�ւ�
	function setOrientationControls( e ) {
		if ( !e.alpha ) {
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

	renderer.setSize( width, height );

	effect.setSize( width, height );
}
function update(dt) {
	resize();
	camera.updateProjectionMatrix();
	controls.update(dt);
	app.update(dt);

}
//�~�ʊp�̏����l
var arcLen = 0;
var geometryTorus;
//���z�b�g�X�|�b�g�������ɐ��������~��
function createBlueTorus(){
	geometryTorus = new THREE.TorusGeometry( 45, 1.8, 3, 60, arcLen );
	materialTorus = new THREE.MeshLambertMaterial( { color: 0xEFFBFB } );
	this.torusCube = new THREE.Mesh( geometryTorus, materialTorus );
	this.torusCube.position.set( -30, 60, -230 );
	this.torusCube.transparent=true
	this.scene.add( this.torusCube );
	this.torusCube.rotation.setFromRotationMatrix(this.camera.matrix);
	this.torusCube.rotation.z =1.65;
}
//�Ԃ��z�b�g�X�|�b�g�������ɐ��������~��
function createRedTorus(){
	geometryTorus = new THREE.TorusGeometry( 45, 1.8, 3, 60, arcLen );
	secondMaterial = new THREE.MeshLambertMaterial( { color: 0xF7E897 } );
	this.secondCube = new THREE.Mesh( geometryTorus, secondMaterial );
	this.secondCube.position.set( -30, 60, 230 );
	this.secondCube.transparent=true
	this.scene.add( this.secondCube );
	this.secondCube.rotation.setFromRotationMatrix(this.camera.matrix);
	this.secondCube.rotation.z =-1.65;
}
//�Â��~�ʂ��폜����
function disposeTorus(){
	//�~�ʂ̒����𒆒f���Ă����ꍇ�A�ߋ���torusCube��dispose����
	if(geometryTorus != null){
	scene.remove( this.torusCube );
	scene.remove( this.secondCube );
	geometryTorus.dispose();
	}
}
function render(dt) {
	//�z�b�g�X�|�b�g�ɒ����_�����킹�����̏���
	raycaster.setFromCamera( cursor, camera );
	var intersects = raycaster.intersectObjects( scene.children, true );
	if ( intersects.length > 1 ) {
		for(var i=0; i < intersects.length; i++){
			//���z�b�g�X�|�b�g�̒����C�x���g�A�~�ʂ𐶐�����B
			if ( intersects[i].object.name == 'loadTorus') {
			//�~�ʂ̒����𒆒f���Ă����ꍇ�A�ߋ���torusCube��dispose����
			disposeTorus();
			//�~�ʊp�̃p�����[�^�𑝂₷
  			arcLen -=0.02;
			//���~�ʂ̐����֐�
  			createBlueTorus();
				//�~�ʂ����_�ɓ��B�������𔻒肵�Aindex�ɓn���z��ԍ����X�V����
				if(arcLen<-6.5){
				j++;
					//index�ɓn��������" j "�̌��E�l����
					if( j == 4 ){
					j=0;
					}
				//app.js���̃r�f�I�X�V�֐����Ăяo���A�~�ʂ�����������
				app.updateVideoTexture( j );
				arcLen = 0;
				}

			//�Ԃ��z�b�g�X�|�b�g�̒����C�x���g
			}else if(intersects[i].object.name == 'secondLoad'){
			//�~�ʂ̒����𒆒f�����ۂɁAdispose���s��
			disposeTorus();
			//�Ԃ��z�b�g�X�|�b�g�������ɕ\�������A�~�ʂ̃p�����[�^
  			arcLen -=0.02;
			//�Ԃ��~�ʂ̐����֐�
  			createRedTorus();
				//�~�ʂ����_�ɓ��B�������𔻒肵�A���於���p�����[�^�ɓn���y�[�W���X�V����
				if(arcLen<-6.5){
				j--;
					//index�ɓn��������" j "�̌��E�l����
					if( j == -1){
					j=3;
					}
				//app.js���̃r�f�I�X�V�֐����Ăяo���A�~�ʂ�����������
				app.updateVideoTexture( j );
				arcLen = 0;
				}
			}
		}
	}else if ( intersects.length == 1){
	//�~�ʂ̒����𒆒f�����ۂɁAdispose���s��
	disposeTorus();
		//�r���܂ő��₵���~�ʂ��A�����l�܂Ō���������
		if ( 0 > arcLen ){
		arcLen +=0.009;
		//���~�ʂ̐����֐�
		createBlueTorus();
		//�Ԃ��~�ʂ̐����֐�
		createRedTorus();	
		}
	}
	app.render(dt);
	effect.render( scene, camera );
}
function animate(t) {
	requestAnimationFrame( animate );

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
