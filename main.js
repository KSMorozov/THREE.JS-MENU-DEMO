// uncomment line 75 of threex if shit hits the fan
// jshint ignore:start
(function () {
  var renderer      = Detector.webgl
                    ? new THREE.WebGLRenderer({ antialias : true, alpha: true })
                    : new THREE.CanvasRenderer();
  var scene         = new THREE.Scene();
  var camera        = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  var domEvents     = new THREEx.DomEvents(camera, renderer.domElement);
  var pink          = 0xF01377; // #F5619F
  var wave          = new THREE.Object3D();
  var holder        = new THREE.Object3D();
  var items         = new THREE.Object3D();
  holder.name       = 'WAVE.HOLDER'
  var menu          = false;
  camera.position.z = 90;


  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  function animate () {
    scene.traverse(function (node) {
      if (!(node instanceof THREE.Mesh)) return ;
      if (node.name === 'WAVE.PART') {
        if (menu) {
          if (node.material.opacity > 0) {
            node.material.opacity -= 0.001;
          }
          if (node.position.x < 100 && node.position.z < 100) {
            node.position.x       += 2;
            node.position.z       += 2;
          }
        }  else if (!menu) {
          if (node.material.opacity < 1) {
            node.material.opacity += 0.0004;
          }
          if (node.position.x > 0 && node.position.z > 0) {
            node.position.x       -= 2;
            node.position.z       -= 2;
          }
        }
      } else if (node.name === 'MENU.CIRCLE') {
        if (menu) {
          if (node.material.opacity < 1) {
            node.material.opacity += .1;
            node.scale.y          += .05;
            node.scale.x          += .05;
          }
          if (node.position.y > 0 && node.position.z > 0) {
            node.position.y       -= 2;
            node.position.z       -= 2;
          }
        } else if (!menu) {
          if (node.material.opacity > 0) {
            node.material.opacity -= .1;
            node.scale.y          -= .05;
            node.scale.x          -= .05;
          }
          if (node.position.y < 100 && node.position.z < 100) {
            node.position.y       += 2;
            node.position.z       += 2;
          }
        }
      }
    });
    holder.rotation.x -= .012;
  }

  function toggle   () {
    menu = !menu;
  }

  function attEvent (object, event, callback) {
    domEvents.addEventListener(object, event, callback, false);
  }

  (function init () {
    (function drawWave () {
      var material      = new THREE.MeshBasicMaterial({ color : pink});
      var amount        = 80;
      var yrotation     = 11;
      var zrotation     = 90;
      var drawPartial   = function (i, amount, yrotation, zrotation) {
        var geometry    = i < amount / 2
                        ? new THREE.CylinderGeometry(.4, .4, i / 1.8, 300)
                        : new THREE.CylinderGeometry(.4, .4, (amount - i) / 1.8, 300);
        var part        = new THREE.Mesh(geometry, material);
        part.name       = 'WAVE.PART'
        part.rotation.y = yrotation * i * Math.PI / 180;
        part.rotation.z = zrotation * Math.PI / 180;
        part.position.x = 0;
        part.position.y = i * .9;

        return part;
      };

      for (var i = 0; i <= amount; i++) {
        var partial = drawPartial(i, amount, yrotation, zrotation);
        wave.add(partial);
      }
      wave.rotation.z = 1.57;
      scene.add(wave);
    })();

    (function drawBox  () {
      var material      = new THREE.MeshBasicMaterial({ color : pink, transparent: true, opacity: 0 });
      var geometry      = new THREE.BoxGeometry( 70, 19, 20 );
      var box           = new THREE.Mesh(geometry, material);
      box.name          = 'EVENT.BOX';
      events            = [{
        event    : 'mouseover',
        callback : toggle
      }, {
        event    : 'mouseout',
        callback : toggle
      }]
      .forEach(function (e) {
        attEvent(box, e.event, e.callback);
      });

      scene.add(box);
    })();

    (function drawMenu () {
      var material      = new THREE.MeshBasicMaterial({ color : pink, opacity: 0 });
      var pos           = [-20, 4, 27]
      for (var i = 0; i < pos.length; i++) {
        var radius      = i === 1 ? 10 : 5;
        var geometry    = new THREE.CircleGeometry(radius, 32);
        var circle      = new THREE.Mesh(geometry, material);
        circle.name     = 'MENU.CIRCLE';
        circle.position.x = pos[i];
        scene.add(circle);
      }
    })();
    holder.add(wave);
    holder.position.x += 40;
    scene.add(holder);
  })();

  (function render () {
    requestAnimationFrame(render);
    animate();
    renderer.render(scene, camera);
  })();
})();
// jshint ignore:end
