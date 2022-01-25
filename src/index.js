
import * as THREE from 'three';
import Stats from './Stats.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



let container, stats;
			let camera, scene, raycaster, renderer;

			let INTERSECTED;
			let theta = 0;

			const pointer = new THREE.Vector2();
			const radius = 100;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xf0f0f0 );

				const light = new THREE.DirectionalLight( 0xffffff, 1 );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );

				const geometry = new THREE.BoxGeometry( 20, 20, 20 );

				for ( let i = 0; i < 2000; i ++ ) {

					const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

					object.position.x = Math.random() * 800 - 400;
					object.position.y = Math.random() * 800 - 400;
					object.position.z = Math.random() * 800 - 400;

					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;

					object.scale.x = Math.random() + 0.5;
					object.scale.y = Math.random() + 0.5;
					object.scale.z = Math.random() + 0.5;

					scene.add( object );

				}

				raycaster = new THREE.Raycaster();

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				stats = new Stats();
				container.appendChild( stats.dom );

				document.addEventListener( 'mousemove', onPointerMove );

				//

				window.addEventListener( 'resize', onWindowResize );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onPointerMove( event ) {

				pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				theta += 0.2;

				camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
				camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
				camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
				camera.lookAt( scene.position );

				camera.updateMatrixWorld();

				// find intersections

				raycaster.setFromCamera( pointer, camera );

				const intersects = raycaster.intersectObjects( scene.children, false );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
						INTERSECTED.material.emissive.setHex( 0xff0000 );

					}

				} else {

					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

				}

				renderer.render( scene, camera );

			}

			

			// for the bg music 
      // create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'bgMusic.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.3 );
	sound.play();
  
  sound.autoplay(true);

});

      /*  This is my other project, just ignore this pls

// I need 3 things here to first setup    :Scene ,Camera, Renderer

const scene = new THREE.Scene();    // Scene == Container to hold all cameras and light

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);  // Camera to see things inside hte scnene
//There are different Camera, but most common one is Perspective camera, that mimics human eye
//  Argumentts ---(feildofview, AspectRatio,view frustrum)

//render ===Draw
const renderer = new THREE.WebGLRenderer({  //To render actual graphics to scene
  canvas: document.querySelector('#bg'),      
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// adding objects to this shit(Geometry(x,y,z))

const geometry = new THREE.TorusGeometry(10,2, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xa9a9a9 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const geometry1 = new THREE.TorusGeometry(13,2, 18, 100);
const material1 = new THREE.MeshStandardMaterial({ color: 0x000000 });
const torus1 = new THREE.Mesh(geometry1, material1);

scene.add(torus1);
const geometry2 = new THREE.OctahedronGeometry(5,1, 1, 100);
const material2 = new THREE.MeshStandardMaterial({ color: 0x808080 });
const dodeca = new THREE.Mesh(geometry2, material2);

scene.add(dodeca);


// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}


Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.png');
scene.background = spaceTexture;

// Avatar

const jeffTexture = new THREE.TextureLoader().load('satwi.jpeg');

const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load('white1.jpg');
const normalTexture = new THREE.TextureLoader().load('d.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
const moon1 = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
      normalMap: normalTexture,
    })
  );
  const moon2 = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({
      map: moonTexture,
      normalMap: normalTexture,
    })
  );
    
scene.add(moon);scene.add(moon1);scene.add(moon2);

moon.position.z = 30;
moon.position.setX(-10);
moon1.position.z = 0;
moon1.position.setX(-50);
moon2.position.z = 70;
moon2.position.setX(-70);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;
  moon1.rotation.x += 0.05;
  moon1.rotation.y += 0.075;
  moon1.rotation.z += 0.05;
  moon2.rotation.x += 0.05;
  moon2.rotation.y += 0.075;
  moon2.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  torus1.rotation.x -= 0.02;
  torus1.rotation.y -= 0.007;
  torus1.rotation.z -= 0.08;

  dodeca.rotation.x -= 0.02;
  dodeca.rotation.y -= 0.007;
  dodeca.rotation.z -= 0.08;


  moon.rotation.x += 0.05;
  moon1.rotation.x += 0.05;
  moon2.rotation.x += 0.05;

  // controls.update();

  renderer.render(scene, camera);
}

animate();**/