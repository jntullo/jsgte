

var container, stats;

var camera, controls, scene, renderer;

var cross;

var Width=700;
var Height=750;

/*init();
animate();*/



function init() {
    
    camera = new THREE.PerspectiveCamera( 60, Width / Height, 1, 1000 );
    camera.position.z = 500;
    camera.position.y = 150;
    camera.position.x = 100;
    
    controls = new THREE.TrackballControls( camera );
    
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    
    controls.noZoom = false;
    controls.noPan = false;
    
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    
    controls.keys = [];
    
    //camera.lookAt=(new THREE.Vector3(100,150,1000));
    
    

    
    // world
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    
   /* var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
    var material =  new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );
    
    for ( var i = 0; i < 500; i ++ ) {
        
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = ( Math.random() - 0.5 ) * 1000;
        mesh.position.y = ( Math.random() - 0.5 ) * 1000;
        mesh.position.z = ( Math.random() - 0.5 ) * 1000;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add( mesh );
        
    }*/
    
    var triangleGeometry;
    
    
    var triangleMaterial = new THREE.MeshBasicMaterial({
                                                       vertexColors:THREE.VertexColors,
                                                       side:THREE.DoubleSide,
                                                       color:0x000088
                                                       });
    
    
    
    for (var i=0;i<11;i++){
        triangleGeometry = new THREE.Geometry();
        triangleGeometry.vertices.push(new THREE.Vector3(200,Number(i*23+20), 0));
        triangleGeometry.vertices.push(new THREE.Vector3(0, Number(i*23+20), 0));
        triangleGeometry.vertices.push(new THREE.Vector3( 100,Number(i*23+20), -170));
        triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
        
        triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);
        triangleMesh.position.set(5.0, 0, 0.0);
        scene.add(triangleMesh);
    }
    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push( new THREE.Vector3(200,Number(20), 0) );
    geometry2.vertices.push( new THREE.Vector3(200,Number(250), 0) );
    var line = new THREE.Line( geometry2, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1 } ) );
    scene.add( line );
    
    geometry2 = new THREE.Geometry();
    geometry2.vertices.push( new THREE.Vector3(0,Number(20), 0) );
    geometry2.vertices.push( new THREE.Vector3(0,Number(250), 0) );
    line = new THREE.Line( geometry2, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1 } ) );
    scene.add( line );
    geometry2 = new THREE.Geometry();
    geometry2.vertices.push( new THREE.Vector3(100,Number(20), -170) );
    geometry2.vertices.push( new THREE.Vector3(100,Number(250), -170) );
    line = new THREE.Line( geometry2, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1 } ) );
    scene.add( line );
    
    // lights
    /*
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    scene.add( light );
    
    light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );*/
    
    
    // renderer
    
    renderer = new THREE.SVGRenderer();
    renderer.setClearColor( scene.fog.color );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( Width, Height);
    renderer.domElement.addEventListener( 'mouseover', down, false );
    //container = document.getElementById( 'container' );
    GTE.svg.appendChild( renderer.domElement );
    GTE.svg.insertBefore(GTE.svg.firstChild, renderer.domElement );
    
    /*stats = new Stats();
    GTE.svg.appendChild( stats.dom );*/
    
    //
    
    window.addEventListener( 'resize', onWindowResize, false );
    //
    
    render();
    
}
function ini_control(){
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );
}

function down (event){
    event.preventDefault();
    ini_control();
    event.currentTarget.addEventListener("mouseout", up);
    event.currentTarget.removeEventListener("mouseover", down);
}

function up (event){
    event.preventDefault();
    controls.keys = [ ];
    
    controls.removeEventListener( 'change', render );
    event.currentTarget.removeEventListener("mouseout", up);
    event.currentTarget.addEventListener("mouseover", down);
}

function onWindowResize() {
    
    camera.aspect = Width / Height;
    camera.updateProjectionMatrix();
    
    renderer.setSize( Width, Height );
    
    controls.handleResize();
    
    render();
    
}

function animate() {
    
    requestAnimationFrame( animate );
    controls.update();
    
}

function render() {
    
    renderer.render( scene, camera );
    
}
