var videoName = ['BavarianAlps','CrystalShower','DoiSuthep','Ayutthaya'];

class App {
	constructor(scene) {
		this.scene = scene;
	}
	
	init() {
		var light = new THREE.DirectionalLight(0xFFFFFF);
		light.position.set(0, 0, 0);
		scene.add( light );

		var ambientLight = new THREE.AmbientLight(0xEFFBFB);
		scene.add( ambientLight );

		//URL���瓮��p�����[�^���擾���Aparam�ɕۑ�����
		//�g��Ȃ���������Ȃ��̂ŃR�����g�A�E�g
		//var param = location.search
		//param = param.replace("?", "");

		//�z�b�g�X�|�b�g�𐶐�
		var material = new THREE.MeshBasicMaterial( { color: 0xBAD3FF } );
      		this.mesh =new THREE.Mesh( new THREE.CircleGeometry( 30, 3, Math.PI / 1.5 ), material );
		this.mesh.position.set(-30, 60, -230);
     		scene.add( this.mesh );
		this.mesh.name='loadTorus';
		

		//�z�b�g�X�|�b�g�𐶐�
		var material = new THREE.MeshBasicMaterial( { color: 0xF7B897 } );
      		this.secondMesh =new THREE.Mesh( new THREE.CircleGeometry( 30, 3, Math.PI / 1.5 ), material );
		this.secondMesh.position.set(-30, 60, 230);
     		scene.add( this.secondMesh );
		this.secondMesh.name='secondLoad';

                var select = document.getElementById( 'video_src' );
                select.addEventListener( 'change', function (e) {
                  video.src = select.value;
                  video.play();
                } );
                // video �v�f�𐶐�
                var video = document.createElement( 'video' );
                video.crossOrigin = 'anonymous';
                video.loop = true;
                video.muted = false;
        	video.src = './video/BavarianAlps.mp4';
                video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
                video.setAttribute( 'playsinline', 'playsinline' );
                video.setAttribute( 'muted', 'muted' );
                video.play();
                
                var texture = new THREE.Texture( video );
                texture.generateMipmaps = false;
                texture.minFilter = THREE.NearestFilter;
                texture.maxFilter = THREE.NearestFilter;
                texture.format = THREE.RGBFormat;

                // ����ɍ��킹�ăe�N�X�`�����X�V
                setInterval( function () {
                  if ( video.readyState >= video.HAVE_CURRENT_DATA ) {
                    texture.needsUpdate = true;
                  }
                 } ,1000 / 24 );

		this.geometrySphere = new THREE.SphereGeometry(500, 60, 40);
                this.geometrySphere.scale(-1, 1, 1);
		this.material = new THREE.MeshBasicMaterial( { map: texture } ) ;
		this.meshSphere = new THREE.Mesh( this.geometrySphere, this.material);
		this.meshSphere.position.set(-100, 0, 0);
		this.scene.add( this.meshSphere );
	}
	//main.js��function render�ŌĂ΂��֐�(�r�f�I�؂�ւ�)�Bindex�ɂ͓���̔z��ԍ����n�����
	updateVideoTexture(index) {
		//�ŏ��̃r�f�I�؂�ւ����ɓǂݍ��ށB�W�I���g���[�f�[�^�̗L���𔻒肵�A�r�f�I�X�t�B�A��dispose����B
		if(this.geometrySphere != null ){
		this.scene.remove(this.meshSphere);
		this.geometrySphere.dispose(); 
		this.material.dispose();
		
		}
		//2��ڈȍ~�̃r�f�I�؂�ւ��Ő������ꂽ�X�t�B�A�̍폜���s���B
		if(this.secondSphere != null ){
		this.scene.remove( this.videoSphere );
		this.secondSphere.dispose(); 
		this.videoMaterial.dispose();

		}
		//�r�f�I�ݒ�
		 var select = document.getElementById( 'video_src' );
                select.addEventListener( 'change', function (e) {
                  video.src = select.value;
                  video.play();
                } );
		var video = document.createElement( 'video' );
                video.crossOrigin = 'anonymous';
                video.loop = true;
                video.muted = false;
        	video.src = './video/'+videoName[index]+'.mp4';
		video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
                video.setAttribute( 'playsinline', 'playsinline' );
                video.setAttribute( 'muted', 'muted' );
                video.play();
		//�I�����ꂽ����ɑΉ������r�f�I�̃e�N�X�`���𐶐�����
		var texture = new THREE.Texture( video );
                texture.generateMipmaps = false;
                texture.minFilter = THREE.NearestFilter;
                texture.maxFilter = THREE.NearestFilter;
                texture.format = THREE.RGBFormat;

                // ����ɍ��킹�ăe�N�X�`�����X�V
                setInterval( function () {
                	if ( video.readyState >= video.HAVE_CURRENT_DATA ) {
                 	texture.needsUpdate = true;
                	}
                	 } ,1000 / 24 );
		//�V�����X�t�B�A�𐶐�����
		this.secondSphere = new THREE.SphereGeometry(500, 60, 40);
                this.secondSphere.scale(-1, 1, 1);
		this.videoMaterial = new THREE.MeshBasicMaterial( { map: texture } );
		this.videoSphere = new THREE.Mesh( this.secondSphere , this.videoMaterial);
		this.videoSphere.position.set(-100, 0, 0);
		this.scene.add( this.videoSphere );
 

	}

	update(dt) {

	}
	render(dt) {
		//�}�`���������ʂ������悤�ɂ���
		this.mesh.rotation.setFromRotationMatrix(camera.matrix);
		this.secondMesh.rotation.setFromRotationMatrix(camera.matrix);
		//�Ԃ��X�|�b�g�̌����𒲐�����
		this.secondMesh.rotation.z = 2.06;
	}
	


}