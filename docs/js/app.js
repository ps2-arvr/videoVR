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
		
		//回転するオブジェクトは一先ずコメントアウト
		//this.meshCube = new THREE.Mesh();
		//var geometryCube = new THREE.BoxGeometry(1, 10, 10);
		//var materialCube = new THREE.MeshLambertMaterial( { color: 0x00ff88 } );
		//this.meshCube = new THREE.Mesh( geometryCube, materialCube );
		//this.meshCube.position.set(10, 0, 0);
		//this.scene.add( this.meshCube );

		//ピン（円）を生成
		var material = new THREE.MeshBasicMaterial( { color: 0xeeee00 } );
      		this.mesh =new THREE.Mesh( new THREE.CircleGeometry( 15, 3, Math.PI / 1.5 ), material );
		this.mesh.position.set(-40, 60, -30);
     		scene.add( this.mesh );
		this.mesh.name='loadTorus';
		this.mesh.rotation.y = Math.PI/3;
		//mesh.rotation.y = 90;
	

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
		//異常系（動画を読み込んだ際のerrorを判定）の処理を開始
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

		//ここから正常系の処理を再開、処理内容としては同じ
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
		//this.meshCube.rotation.x += dt * 0.8
		//this.meshCube.rotation.z += dt * 0.2
	}

	render(dt) {
		//図形がいつも正面を向くようにする
		this.mesh.rotation.setFromRotationMatrix(this.camera.matrix);
		
	
	}
}
