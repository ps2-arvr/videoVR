var camera, renderer;
var effect, controls;
var element, container;

var clock = new THREE.Clock();
var scene = new THREE.Scene();
var app = new App(scene);

var lon = 0, lat = 0, phi=0, theta = 0;

init();
animate();

function init() {
	renderer = new THREE.WebGLRenderer();
	element = renderer.domElement;
	container = document.getElementById('example');
	container.appendChild(element);

	effect = new THREE.StereoEffect(renderer);

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000 );
	lat = Math.max( - 85, Math.min( 85, lat ) );	
	phi = THREE.Math.degToRad( 90 - lat );
	theta = THREE.Math.degToRad( lon );
	camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
	camera.position.y = 100 * Math.cos( phi );
	camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );
	scene.add(camera);

	controls = new THREE.OrbitControls(camera, element);
	controls.target.set(
		camera.position.x,
		camera.position.y,
		camera.position.z+0.1
	);
	controls.noZoom = true;
	controls.noPan = true;

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
	app.init();
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

function render(dt) {
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
