            /*
            *
            *
            */          
            var container;
            var stats;
            var camera;
            var controls;
            var scene;
            var renderer;
            var GUIcontrol;
            var cross;
            var meshGroup;

            init();
            animate();

            function init() {

                camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 1000 );
                //camera = new THREE.OrthographicCamera( window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000);
                camera.position.z = 100;

                

                // world

                scene = new THREE.Scene();
                //scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

                var geometry = new THREE.BoxGeometry(6, 6, 6);//new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
                var material = new THREE.MeshLambertMaterial({color: 0xff0000, transparent:true, opacity:0.6, wireframe:true});
                //new THREE.MeshPhongMaterial( { color:0xA1A1A1, shading: THREE.FlatShading } );
                meshGroup = [];
                for ( var i = 0; i < 10; i ++ ) {

                    meshGroup[i] = new THREE.Mesh( geometry, material );
                    meshGroup[i].position.x = ( Math.random() - 0.5 ) * 100;
                    meshGroup[i].position.y = ( Math.random() - 0.5 ) * 100;
                    meshGroup[i].position.z = ( Math.random() - 0.5 ) * 100;
                    meshGroup[i].updateMatrix();
                    meshGroup[i].matrixAutoUpdate = false;
                    scene.add( meshGroup[i] );

                }


                // lights

                //light = new THREE.DirectionalLight( 0xffffff );
                //light.position.set( 1, 1, 1 );
                //scene.add( light );

                //light = new THREE.DirectionalLight( 0x002288 );
                //light.position.set( -1, -1, -1 );
                //scene.add( light );

                light = new THREE.AmbientLight( 0xffffff );
                scene.add( light );




                // setup the control object for the control gui
                GUIcontrol = new function() {
                    this.moveIncrement = 1;
                    this.wireframe = true;
                    this.opacity = 0.8;
                    //this.bottomColor = planeMaterial.color.getHex();
                    this.colorCube = material.color.getHex();
                    this.ApplyChange=function(){applyChange();
                    };
                };

                // add extras
                addControlGui(GUIcontrol);







                // renderer
                renderer = new THREE.WebGLRenderer( { antialias: false } );
                //renderer.setClearColor( scene.fog.color );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );

                container = document.getElementById( 'container' );
                container.appendChild( renderer.domElement );

                addStatsObject();
                addCoords(10);                

                window.addEventListener( 'resize', onWindowResize, false );  

                //camera controls
                controls = new THREE.TrackballControls( camera, renderer.domElement  );

                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;

                controls.noZoom = false;
                controls.noPan = false;

                controls.staticMoving = true;
                controls.dynamicDampingFactor = 0.3;

                controls.keys = [ 65, 83, 68 ];

                controls.addEventListener( 'change', render );             

                render();

            }

            /*
            *   handle the resize behaviour
            */
            function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

                controls.handleResize();

                render();

            }

            function animate() {

                requestAnimationFrame( animate );
                stats.update();
                controls.update();

            }

            function render() {

                // change opacity
                //scene.getObjectByName('cube').material.opacity = GUIcontrol.opacity;
                // change color
                //scene.getObjectByName('cube').material.color = new THREE.Color(GUIcontrol.color);
                

                renderer.render( scene, camera );            
                

            }

            /*
            *   Add coordinate for better orientation
            *
            */
            function addCoords(sizeCoords){                
                var CoordsXArrow =  new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), sizeCoords, 0xFF0000);
                var CoordsYArrow =  new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), sizeCoords, 0x00FF00);
                var CoordsZArrow =  new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(0,0,0), sizeCoords, 0x0000FF);

                scene.add(CoordsXArrow);
                scene.add(CoordsYArrow);
                scene.add(CoordsZArrow);
            }

            /*
            *       add statistic object
            *       fps,ms to render frame and mb usage
            */
            function addStatsObject() {
                stats = new Stats();
                stats.setMode(0);

                stats.domElement.style.position = 'absolute';
                stats.domElement.style.left = '0px';
                stats.domElement.style.top = '0px';

                document.body.appendChild( stats.domElement );
            }

            /*
            *   add GUI to control the scene
            */
            function addControlGui(controlObject) {
                var gui = new dat.GUI();
                var f1 = gui.addFolder('Scene');
                f1.add(controlObject, 'moveIncrement', 0.1, 4);
                

                var f2 = gui.addFolder('Objects');
                f2.add(controlObject, 'wireframe');
                f2.add(controlObject, 'opacity', 0.1, 1);
                f2.addColor(controlObject, 'colorCube');

                gui.add(controlObject, "ApplyChange");
            }

            function applyChange(){
                for (var i = meshGroup.length - 1; i >= 0; i--) {
                    meshGroup[i].material.color = new THREE.Color(GUIcontrol.colorCube);
                    meshGroup[i].material.wireframe = GUIcontrol.wireframe;
                    meshGroup[i].material.opacity = GUIcontrol.opacity;
                };
                render();
            }