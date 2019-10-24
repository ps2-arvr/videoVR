var camera, renderer;
var effect, controls, docControls;
var camera_defx, camera_defy, camera_defz;
var isGyro = false;
var element, container;
var clock = new THREE.Clock();
var scene = new THREE.Scene();
var app = new App(scene);
var lon = 0, lat = 0, phi=0, theta = 0;
var video;
//THREE.Raycaster�p
var raycaster,scopedObj;
var cursor= new THREE.Vector2(0,0);

var videoNumber =0;

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

	this.defx =100 * Math.sin( phi ) * Math.cos( theta );
	this.defy =100 * Math.cos( phi );
	this.defz =100 * Math.sin( phi ) * Math.sin( theta );
	
	scene.add( camera );
	//test
	camera_doc=new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera_doc.position.set(0,0,0.01);
	camera_doc.lookAt(new THREE.Vector3(0,0,0));
	
	//camera.lookAt(new THREE.Vector3(10, 0, 0));
	//�}�E�X����
	controls = new THREE.OrbitControls( camera, element );
	
	controls.target.set(
		camera.position.x-20,
		camera.position.y-3,
		camera.position.z-0.1
	);
	//camera.rotation.y = 1.2 ;
	controls.noZoom = true;
	controls.noPan = true;
	//�W���C������ɐ؂�ւ�
	function setOrientationControls( e ) {
		if ( !e.alpha ) {
			return;
		}
		
		docControls=new THREE.DeviceOrientationControls(camera_doc);
		docControls.connect();

		docControls.update();
		camera_defx=camera_doc.rotation.x;
		camera_defy=camera_doc.rotation.y;
		camera_defz=camera_doc.rotation.z;
		isGyro = true;
	
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
	var blueMaterial = new THREE.MeshLambertMaterial( { color: 0xEFFBFB } );
	this.blueTorus = new THREE.Mesh( geometryTorus, blueMaterial );
	this.blueTorus.position.set( -30, 60, -230 );
	this.blueTorus.transparent=true
	this.scene.add( this.blueTorus );
	this.blueTorus.rotation.setFromRotationMatrix(this.camera.matrix);
	this.blueTorus.rotation.z =1.65;
}
//�Ԃ��z�b�g�X�|�b�g�������ɐ��������~��
function createRedTorus(){
	geometryTorus = new THREE.TorusGeometry( 45, 1.8, 3, 60, arcLen );
	var redMaterial = new THREE.MeshLambertMaterial( { color: 0xF7E897 } );
	this.redTorus = new THREE.Mesh( geometryTorus, redMaterial );
	this.redTorus.position.set( -30, 60, 230 );
	this.redTorus.transparent=true
	this.scene.add( this.redTorus );
	this.redTorus.rotation.setFromRotationMatrix(this.camera.matrix);
	this.redTorus.rotation.z =-1.65;
}
//�Â��~�ʂ��폜����
function disposeTorus(){
	//�~�ʂ̒����𒆒f���Ă����ꍇ�A�ߋ���torusCube��dispose����
	if(geometryTorus != null){
	scene.remove( this.blueTorus );
	scene.remove( this.redTorus );
	geometryTorus.dispose();
	}
}
function defaultPosition(){
camera.position.x = this.defx;
camera.position.y = this.defy;
camera.position.z = this.defz;
}
function updatacamera(){
	if(isGyro){
		camera.rotation.x=(camera_defx-camera_nowx)*-1;
		camera.rotation.y=(camera_defy-camera_nowy)*-1;
		camera.rotation.z=(camera_defz-camera_nowz)*-1;
	}
}
function render(dt) {
	//�z�b�g�X�|�b�g�ɒ����_�����킹�����̏���
	//camera.rotation.y = 5.2 ;
	
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
						videoNumber++;
							//index�ɓn��������" j "�̌��E�l����
							if( videoNumber == 4 ){
							videoNumber = 0;
							}
						//app.js���̃r�f�I�X�V�֐����Ăяo���A�~�ʂ�����������
						app.updateVideoTexture( videoNumber );
						//test
						updatacamera();

						defaultPosition();
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
						videoNumber--;
						//index�ɓn��������" j "�̌��E�l����
							if( videoNumber == -1){
							videoNumber = 3;
							}
						//app.js���̃r�f�I�X�V�֐����Ăяo���A�~�ʂ�����������
						app.updateVideoTexture( videoNumber );
						defaultPosition();
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
