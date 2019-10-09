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

                // video 要素を生成
                var video = document.createElement( 'video' );
                video.crossOrigin = 'anonymous';
                video.loop = true;
                video.muted = true;

		//URLから動画パラメータを取得し、paramに保存する
		var param = location.search
		param = param.replace("?", "");

		//URLから取得したパラメータ(param)の内容によって、表示する動画を変更
		//読み込んだパスがerrorの場合、BavarianAlpsのパスに固定。trueの場合はパスの動画をそのまま表示
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

                // 動画に合わせてテクスチャを更新
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

                // 動画に合わせてテクスチャを更新
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
