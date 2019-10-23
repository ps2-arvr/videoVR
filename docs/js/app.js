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

		//URLから動画パラメータを取得し、paramに保存する
		//使わないかもしれないのでコメントアウト
		//var param = location.search
		//param = param.replace("?", "");

		//ホットスポットを生成
		var material = new THREE.MeshBasicMaterial( { color: 0xBAD3FF } );
      		this.mesh =new THREE.Mesh( new THREE.CircleGeometry( 30, 3, Math.PI / 1.5 ), material );
		this.mesh.position.set(-30, 60, -230);
     		scene.add( this.mesh );
		this.mesh.name='loadTorus';
		

		//ホットスポットを生成
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
                // video 要素を生成
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

                // 動画に合わせてテクスチャを更新
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
	//main.jsのfunction renderで呼ばれる関数(ビデオ切り替え)。indexには動画の配列番号が渡される
	updateVideoTexture(index) {
		//最初のビデオ切り替え時に読み込む。ジオメトリーデータの有無を判定し、ビデオスフィアをdisposeする。
		if(this.geometrySphere != null ){
		this.scene.remove(this.meshSphere);
		this.geometrySphere.dispose(); 
		this.material.dispose();
		
		}
		//2回目以降のビデオ切り替えで生成されたスフィアの削除を行う。
		if(this.secondSphere != null ){
		this.scene.remove( this.videoSphere );
		this.secondSphere.dispose(); 
		this.videoMaterial.dispose();

		}
		//ビデオ設定
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
		//選択された動画に対応したビデオのテクスチャを生成する
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
		//新しいスフィアを生成する
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
		//図形がいつも正面を向くようにする
		this.mesh.rotation.setFromRotationMatrix(camera.matrix);
		this.secondMesh.rotation.setFromRotationMatrix(camera.matrix);
		//赤いスポットの向きを調整する
		this.secondMesh.rotation.z = 2.06;
	}
	


}