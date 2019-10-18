var videoName = ['BavarianAlps','CrystalShower','DoiSuthep','Ayutthaya'];

class App {
	constructor(scene) {
		this.scene = scene;
	}
	init(camera) {
		this.camera = camera;
		var light = new THREE.DirectionalLight(0xFFFFFF);
		light.position.set(0, 0, 0);
		scene.add( light );

		var ambientLight = new THREE.AmbientLight(0xEFFBFB);
		scene.add( ambientLight );
		
		//URL���瓮��p�����[�^���擾���Aparam�ɕۑ�����
		var param = location.search
		param = param.replace("?", "");

		//�z�b�g�X�|�b�g�𐶐�
		var material = new THREE.MeshBasicMaterial( { color: 0xBAD3FF } );
      		this.mesh =new THREE.Mesh( new THREE.CircleGeometry( 20, 3, Math.PI / 1.5 ), material );
		this.mesh.position.set(-30, 60, -230);
     		scene.add( this.mesh );
		this.mesh.name='loadTorus';
		this.mesh.rotation.y = Math.PI/3;

		//�z�b�g�X�|�b�g�𐶐�
		var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
      		this.secondMesh =new THREE.Mesh( new THREE.CircleGeometry( 20, 3, Math.PI / 1.5 ), material );
		this.secondMesh.position.set(-30, 60, 230);
     		scene.add( this.secondMesh );
		this.secondMesh.name='secondLoad';
		this.secondMesh.rotation.y = Math.PI/2.5;


                var select = document.getElementById( 'video_src' );
                select.addEventListener( 'change', function (e) {
                  video.src = select.value;
                  video.play();
                } );
                // video �v�f�𐶐�
                var video = document.createElement( 'video' );
                video.crossOrigin = 'anonymous';
                video.loop = true;
                video.muted = true;

		//URL����擾�����p�����[�^(param)�̓��e�ɂ���āA�\�����铮���ύX
		//�ǂݍ��񂾃p�X��error�̏ꍇ�ABavarianAlps�̃p�X�ɌŒ�Btrue�̏ꍇ�̓p�X�̓�������̂܂ܕ\��

		video.src = './video/'+param+'.mp4';
		//�ُ�n�i�����ǂݍ��񂾍ۂ�error�𔻒�j�̏������J�n
		video.onerror = function() {
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

		var geometrySphere = new THREE.SphereGeometry(500, 60, 40);
                geometrySphere.scale(-1, 1, 1);
		var meshSphere = new THREE.Mesh( geometrySphere, new THREE.MeshBasicMaterial( { map: texture } ) );
		meshSphere.position.set(-100, 0, 0);
		this.scene.add( meshSphere );
   		 }
		
		//�������琳��n�̏������ĊJ�A�������e�Ƃ��Ă͓���
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
		this.meshSphere = new THREE.Mesh( this.geometrySphere, new THREE.MeshBasicMaterial( { map: texture } ) );
		this.meshSphere.position.set(-100, 0, 0);

		this.scene.add( this.meshSphere );
		//meshSphere.visible = false;
	}

	updateVideoTexture(index) {
		//this.meshSphere.visible = false;
		this.scene.remove( this.meshSphere );
		this.geometrySphere.dispose();

		 var select = document.getElementById( 'video_src' );
                select.addEventListener( 'change', function (e) {
                  video.src = select.value;
                  video.play();
                } );
		var video = document.createElement( 'video' );
                video.crossOrigin = 'anonymous';
                video.loop = true;
                video.muted = true;
        	video.src = './video/'+videoName[index]+'.mp4';
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

		var geometrySphere = new THREE.SphereGeometry(500, 60, 40);
                geometrySphere.scale(-1, 1, 1);
		var meshSphere = new THREE.Mesh( geometrySphere, new THREE.MeshBasicMaterial( { map: texture } ) );
		meshSphere.position.set(-100, 0, 0);
		this.scene.add( meshSphere );
   		 
	}

	update(dt) {
		//this.meshCube.rotation.x += dt * 0.8
		//this.meshCube.rotation.z += dt * 0.2
	}
	render(dt) {
		//�}�`���������ʂ������悤�ɂ���
		this.mesh.rotation.setFromRotationMatrix(this.camera.matrix);
		this.secondMesh.rotation.setFromRotationMatrix(this.camera.matrix);
	}
	


}