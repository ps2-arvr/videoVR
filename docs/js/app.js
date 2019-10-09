class App {
	constructor(scene) {
		this.scene = scene;
	}

	init() {
		var light = new THREE.DirectionalLight(0xFFFFFF);
		light.position.set(2, 2, 0);
		scene.add( light );

		var ambientLight = new THREE.AmbientLight(0x888888);
		scene.add( ambientLight );

		this.meshCube = new THREE.Mesh();
		var geometryCube = new THREE.BoxGeometry(10, 10, 10);
		var materialCube = new THREE.MeshLambertMaterial( { color: 0x00ff88 } );
		this.meshCube = new THREE.Mesh( geometryCube, materialCube );
		this.meshCube.position.set(0, 0, 50);
		this.scene.add( this.meshCube );
	
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

		//URL���瓮��p�����[�^���擾���Aparam�ɕۑ�����
		var param = location.search
		param = param.replace("?", "");

		//URL����擾�����p�����[�^(param)�̓��e�ɂ���āA�\�����铮���ύX
		//�ǂݍ��񂾃p�X��error�̏ꍇ�ABavarianAlps�̃p�X�ɌŒ�Btrue�̏ꍇ�̓p�X�̓�������̂܂ܕ\��
		video.src = './video/'+param+'.mp4';

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
		this.meshCube.rotation.x += dt * 0.8
		this.meshCube.rotation.z += dt * 0.2
	}

	render(dt) {

	}
}
