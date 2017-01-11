var geometry;
var cube;
function getRenderer() {
    width = $('#canvas')[0].clientWidth;
    height = $('#canvas')[0].clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias : true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xFFFFFF, 1.0);
    $('#canvas')[0].appendChild(renderer.domElement);
    return renderer;
}
function getStats(){
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	$('#canvas')[0].appendChild( stats.domElement );
	return stats;
}
function getCamera() {
	width = $('#canvas')[0].clientWidth;
    height = $('#canvas')[0].clientHeight;
    camera = new THREE.PerspectiveCamera( 70, width / height, 1, 120);
    camera.position.set(30,30,80)
    return camera;
}
function getScene() {
    scene = new THREE.Scene();
    return scene
}
function getLight(){
	var light = new THREE.PointLight( 0xffffff, 1.5 );
	light.position.set( 1000, 1000, 2000 );
	return light;
}
function getLine(x,y,z,color){
	var material = new THREE.LineBasicMaterial({
		color: color
	});
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
			new THREE.Vector3( 0, 0, 0 ),
			new THREE.Vector3( x, y, z )
		);

	var line = new THREE.Line( geometry, material );
	return line;
}
function CubeGeometry(x,y,z){
	var renderer = getRenderer();
	var scene = getScene();
	var camera = getCamera();
	var light = getLight();
	scene.add(camera);
	scene.add(light);
	
	geometry = new THREE.CubeGeometry( x, y, z );
	var material = new THREE.MeshBasicMaterial( { color: 0x808080, } );
	cube = new THREE.Mesh( geometry, material );
	cube.geometry.dynamic = true;
	cube.geometry.verticesNeedUpdate = true;
	cube.geometry.normalsNeedUpdate = true;
	
	scene.add( cube );
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	

	var render = function () {
		id = requestAnimationFrame( render );

		controls.update();
		
		renderer.render(scene, camera);
	};
	
	render();
}
function changeGeometry(x,y,z){
	renderer.clear();
	cancelAnimationFrame(id);
	cube.geometry.parameters.width = parseInt(x);
	cube.geometry.parameters.height = parseInt(y);
	cube.geometry.parameters.depth = parseInt(z);
	var render = function () {
		id = requestAnimationFrame( render );

		controls.update();
		
		renderer.render(scene, camera);
	};
	
	render();
}