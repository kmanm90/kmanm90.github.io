//tutorial 1 code

                    
            var container;
            var stats;
            var camera;
            var controls;
            var scene;
            var renderer;
            var GUIcontrol;
            var cross;
            var mesh;

            init();
            animate();

            function init() {
                scene = new THREE.Scene();
                camera = new THREE.PerspectiveCamera( 75, (window.innerWidth/2) / (window.innerHeight/2), 1, 100 );
                //camera = new THREE.OrthographicCamera( window.innerWidth / - 10, window.innerWidth / 10, window.innerHeight / 10, window.innerHeight / - 10, 1, 1000);
                camera.position.set(-20,30,0);  
                camera.lookAt(scene.position);              
                //camera.rotation.y = Math.PI;
                //camera.rotation.y = Math.PI;      // Y first
                //camera.rotation.x = 0;     // X second
                //camera.rotation.z = 0;                
                

                // world
                //scene = new THREE.Scene();
                var geometry = new THREE.BoxGeometry(2, 2, 2);
                var material = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe:false});
                
                mesh = new THREE.Mesh( geometry, material );
                mesh.name='cube';
                mesh.castShadow = true;
                mesh.position.set(0,1,0);
                //mesh.updateMatrix();
                //mesh.geometry.dynamic = true;
                //mesh.matrixAutoUpdate = false;
                scene.add( mesh);

                var geometryPlane = new THREE.PlaneGeometry( 50, 50, 1,1 );
                var materialPlane = new THREE.MeshBasicMaterial( {color: 0x3355AA} ); //, side: THREE.DoubleSide
                var plane = new THREE.Mesh( geometryPlane, materialPlane );
                plane.name='plane';
                plane.receiveShadow = true;
                plane.position.set(0,0,0);                
               
                plane.rotation.x = -0.5 * Math.PI;
                //plane.updateMatrix();                               
                scene.add( plane);

                // add spotlight for the shadows
                //var spotLight = new THREE.SpotLight(0xffffff);
                //spotLight.position.set(0, 30, 0);
                //spotLight.shadowCameraNear = 20;
                //spotLight.shadowCameraFar = 50;
                //spotLight.castShadow = true;
                //scene.add(spotLight);
                light = new THREE.AmbientLight( 0xffffff );
                light.castShadow = true;
                scene.add( light );

                




                // setup the control object for the control gui
                GUIcontrol = new function() {                    
                    this.speed = 1;
                    this.x = 0;
                    this.z = 0;
                    this.wireframe = false;                    
                    this.colorCube = material.color.getHex();
                    this.ApplyChange=function(){applyChange();
                    };
                };

                // add extras
                addControlGui(GUIcontrol);


                // renderer
                renderer = new THREE.WebGLRenderer( {alpha: true, antialias: false } );
                renderer.setClearColor( 0x000000, 0 ); // the default
                //renderer.setClearColor( scene.fog.color );
                renderer.setPixelRatio( window.devicePixelRatio );
                //renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.setSize( (window.innerWidth/2) , (window.innerHeight/2));

                container = document.getElementById( 'webgl' );
                container.appendChild( renderer.domElement );

                addStatsObject();
                addCoords(8);                

                window.addEventListener( 'resize', onWindowResize, false );  

                //camera controls
                controls = new THREE.TrackballControls( camera, renderer.domElement  );

                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;

                controls.noZoom = false;
                controls.noPan = true;

                controls.staticMoving = true;
                controls.dynamicDampingFactor = 0.3;

                controls.keys = [ 65, 83, 68 ];

                controls.addEventListener( 'change', render );  

                //add key listener
                document.addEventListener("keydown", onDocumentKeyDown, false);            

                render();

            }

            /*
            *   handle the resize behaviour
            */
            function onWindowResize() {

                camera.aspect = (window.innerWidth/2) / (window.innerHeight/2);
                camera.updateProjectionMatrix();

                renderer.setSize( (window.innerWidth/2) , (window.innerHeight/2) );

                controls.handleResize();

                render();

            }

            function animate() {

                requestAnimationFrame( animate );
                stats.update();
                controls.update();
                //GUIcontrol.x = Math.random()*100;
                //GUIcontrol.z = Math.random()*100;


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
                var f1 = gui.addFolder('Bewegung');
                f1.add(controlObject, 'speed', 1, 5);
                f1.add(controlObject, 'x', 0, 100).listen();
                f1.add(controlObject, 'z', 0, 100).listen();
                f1.open();

                var f2 = gui.addFolder('Objects');
                f2.add(controlObject, 'wireframe');                
                f2.addColor(controlObject, 'colorCube');
                f2.add(controlObject, "ApplyChange");
            }





            function applyChange(){
                
                mesh.material.color = new THREE.Color(GUIcontrol.colorCube);
                mesh.material.wireframe = GUIcontrol.wireframe;               
                
                render();
            }

            /** 
      * This function is called, when a key is pushed down.
     */ 
    function onDocumentKeyDown(event){ 
        event.preventDefault();
        // Get the key code of the pressed key 
        var keyCode = event.which; 
        var step = GUIcontrol.speed;
        
        // Cursor up 
        if(keyCode == 38){             
            mesh.translateX(step);                       
        // Cursor down 
        } else if(keyCode == 40){                  
            mesh.translateX(-step);            
        // Cursor left 
        } else if(keyCode == 37){              
            mesh.translateZ(-step);            
        // Cursor right 
        } else if(keyCode == 39){              
            mesh.translateZ(step); 
        // space 
        } else if(keyCode == 32){
            camera.lookAt(scene.position);
        }

        render();
        GUIcontrol.x = mesh.position.x;
        GUIcontrol.z = mesh.position.z;
        
     } 