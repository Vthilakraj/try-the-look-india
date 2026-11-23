import * as THREE from "./vendor/three.module.min.js";
import { createMannequin } from "./mannequins.js";

const runway = document.querySelector("runway-section");
if (runway) mountShowroom(runway);

function mountShowroom(runway) {
  const stage = runway.querySelector("#stage");
  const view = runway.querySelector("#webgl-view");
  const tools = runway.querySelector("#view-tools");
  const images = [...runway.querySelectorAll(".figure img")];
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:false, powerPreference:"high-performance"});
  } catch {
    const hint = document.createElement("p");
    hint.className = "runway-fallback";
    hint.textContent = "Outfit gallery · 3D requires WebGL";
    stage.append(hint);
    return;
  }

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;
  renderer.domElement.setAttribute("aria-label","Interactive 3D showroom");
  renderer.domElement.setAttribute("role","img");
  view.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#27211f");
  scene.fog = new THREE.Fog("#27211f",20,42);
  const camera = new THREE.PerspectiveCamera(43,1,.1,90);
  const focus = new THREE.Vector3(0,1.45,.8);
  const platform = new THREE.Group();
  const figures = new THREE.Group();
  const gallery = new THREE.Group();
  scene.add(platform,figures,gallery);

  const plaster = new THREE.MeshStandardMaterial({color:"#5e5148",roughness:.92});
  const floorMaterial = new THREE.MeshStandardMaterial({color:"#51453e",roughness:.85});
  const darkMetal = new THREE.MeshStandardMaterial({color:"#372b24",roughness:.45,metalness:.28});
  const deckMaterial = new THREE.MeshStandardMaterial({color:"#af9984",roughness:.79});
  const outerMaterial = new THREE.MeshStandardMaterial({color:"#a8553e",roughness:.54,metalness:.27});
  const glow = new THREE.MeshBasicMaterial({color:"#ffad77",toneMapped:false});
  const spotlightMaterial = new THREE.MeshBasicMaterial({color:"#ffe5c6",toneMapped:false});
  const ambient = new THREE.HemisphereLight("#fff0dd","#594134",2.1);
  const key = new THREE.DirectionalLight("#fff4e4",2.15);
  key.position.set(5,10,6);
  const fill = new THREE.DirectionalLight("#e6b6a1",.8);
  fill.position.set(-7,4,-5);
  scene.add(ambient,key,fill);

  function mesh(parent,geometry,material,x,y,z) {
    const object = new THREE.Mesh(geometry,material);
    object.position.set(x,y,z);
    parent.add(object);
    return object;
  }
  function disk(radius,height,y,material) {
    return mesh(platform,new THREE.CylinderGeometry(radius,radius,height,100),material,0,y,0);
  }
  function ring(radius,tube,y,material) {
    const item = mesh(platform,new THREE.TorusGeometry(radius,tube,10,128),material,0,y,0);
    item.rotation.x = -Math.PI / 2;
    return item;
  }

  const floor = mesh(gallery,new THREE.PlaneGeometry(75,75),floorMaterial,0,-.09,0);
  floor.rotation.x = -Math.PI / 2;
  disk(6.95,.22,.035,darkMetal);
  disk(6.58,.23,.21,outerMaterial);
  disk(6.36,.21,.38,deckMaterial);
  ring(6.56,.018,.321,glow);
  ring(5.96,.017,.491,darkMetal);
  ring(4.03,.012,.492,darkMetal);
  ring(1.73,.018,.493,outerMaterial);

  for (let i=0; i<48; i++) {
    const angle = i * Math.PI / 24;
    const line = mesh(platform,new THREE.BoxGeometry(.018,.008,.16),darkMetal,
      Math.sin(angle)*6.12,.49,Math.cos(angle)*6.12);
    line.rotation.y = angle;
  }

  const backWall = new THREE.Group();
  gallery.add(backWall);
  const wallGeometry = new THREE.BoxGeometry(2.55,7.5,.26);
  const seamGeometry = new THREE.BoxGeometry(.045,6.8,.32);
  for (let index=-3; index<=3; index++) {
    const x = index * 2.68;
    const z = -10.1 + Math.abs(index)*.47;
    const wall = mesh(backWall,wallGeometry,plaster,x,3.55,z);
    wall.rotation.y = -index*.052;
    const seam = mesh(backWall,seamGeometry,outerMaterial,x-1.22,3.08,z+.16);
    seam.rotation.y = wall.rotation.y;
  }
  for (const side of [-1,1]) {
    const support = mesh(gallery,new THREE.BoxGeometry(.39,6.5,.36),darkMetal,side*8.15,3.2,-5.6);
    support.rotation.y = side*.24;
    const vertical = mesh(gallery,new THREE.BoxGeometry(.035,4.8,.075),glow,side*8.12,3.63,-5.36);
    vertical.rotation.y = support.rotation.y;
  }

  const track = new THREE.Group();
  gallery.add(track);
  for (let index=0; index<5; index++) {
    const x = (index-2)*2.1;
    mesh(track,new THREE.BoxGeometry(1.32,.1,.25),darkMetal,x,6.4,-1);
    mesh(track,new THREE.BoxGeometry(1.20,.027,.16),spotlightMaterial,x,6.335,-1);
  }

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext("2d");
  const gradient = shadowContext.createRadialGradient(64,64,2,64,64,64);
  gradient.addColorStop(0,"#241912c4");
  gradient.addColorStop(.48,"#24191255");
  gradient.addColorStop(1,"#24191200");
  shadowContext.fillStyle = gradient;
  shadowContext.fillRect(0,0,128,128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowMaterial = new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});
  const podiumMaterial = new THREE.MeshStandardMaterial({color:"#b39b83",roughness:.75});
  const activeMaterial = new THREE.MeshStandardMaterial({color:"#edc39a",roughness:.67});
  const podiumGeometry = new THREE.CylinderGeometry(.66,.7,.095,48);
  const shadowGeometry = new THREE.PlaneGeometry(1.83,1.27);
  const textureLoader = new THREE.TextureLoader();
  const step = Math.PI * 2 / images.length;
  const radiusForFigures = 4.67;
  const panels = images.map((img,index) => {
    const angle = index * step;
    const holder = new THREE.Group();
    holder.position.set(Math.sin(angle)*radiusForFigures,.5,Math.cos(angle)*radiusForFigures);
    holder.rotation.y = angle;
    figures.add(holder);
    const podium = mesh(holder,podiumGeometry,podiumMaterial,0,.01,0);
    const shadow = mesh(holder,shadowGeometry,shadowMaterial,0,.072,0);
    shadow.rotation.x = -Math.PI / 2;
    const height = 3.65;
    const imageMaterial = new THREE.MeshBasicMaterial({
      transparent:false, alphaTest:.39, side:THREE.DoubleSide, toneMapped:false
    });
    const panel = mesh(holder,new THREE.PlaneGeometry(height,height),imageMaterial,0,height / 2 + .043,0);
    panel.scale.x = .42;
    panel.userData.lookIndex = index;
    podium.userData.lookIndex = index;
    textureLoader.load(img.src,(texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      imageMaterial.map = texture;
      imageMaterial.needsUpdate = true;
      panel.scale.x = texture.image.width / texture.image.height;
      panel.visible = !mannequinMode;
      render();
    });
    panel.visible = false;
    return {holder,panel,podium};
  });

  const displayButton = stage.querySelector("#display-mode");
  const displayLabel = stage.querySelector("#display-label");
  let mannequinMode = false;
  displayButton.addEventListener("click",() => {
    mannequinMode = !mannequinMode;
    displayButton.setAttribute("aria-pressed",String(mannequinMode));
    displayLabel.textContent = mannequinMode ? "Outfit silhouettes" : "Styled photography";
    panels.forEach((entry,index) => {
      if (mannequinMode && !entry.form) {
        entry.form = createMannequin(index);
        entry.form.position.y = .05;
        entry.holder.add(entry.form);
      }
      if (entry.form) entry.form.visible = mannequinMode;
      entry.panel.visible = !mannequinMode && entry.panel.material.map !== null;
    });
    render();
  });
  const cameraDefault = {yaw:0,pitch:.26,zoom:1};
  let yaw = cameraDefault.yaw;
  let pitch = cameraDefault.pitch;
  let zoom = cameraDefault.zoom;
  let baseRadius = 12.4;
  let targetRotation = 0;
  let rotation = 0;
  let activeIndex = runway.index;
  let drag = null;
  let frame = 0;
  let drawable = true;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function render() {
    if (!drawable) return;
    const radius = baseRadius * zoom;
    camera.position.set(
      focus.x + Math.sin(yaw)*Math.cos(pitch)*radius,
      focus.y + Math.sin(pitch)*radius,
      focus.z + Math.cos(yaw)*Math.cos(pitch)*radius
    );
    camera.lookAt(focus);
    figures.rotation.y = rotation;
    backWall.visible = Math.cos(yaw) > -.48;
    panels.forEach(({holder,panel},index) => {
      const globalAngle = index*step + rotation;
      const globalX = Math.sin(globalAngle)*radiusForFigures;
      const globalZ = Math.cos(globalAngle)*radiusForFigures;
      const direction = Math.atan2(camera.position.x-globalX,camera.position.z-globalZ);
      panel.rotation.y = direction - globalAngle;
      const frontness = (Math.cos(globalAngle-yaw)+1)/2;
      panel.material.color.setScalar(.52 + .48 * frontness);
      holder.visible = true;
    });
    renderer.render(scene,camera);
  }
  function tick() {
    frame = 0;
    const delta = targetRotation - rotation;
    rotation += reducedMotion.matches || Math.abs(delta)<.001 ? delta : delta*.15;
    render();
    if (rotation !== targetRotation) frame = requestAnimationFrame(tick);
  }
  function select(index) {
    activeIndex = index;
    const angle = -index * step;
    targetRotation = angle + Math.round((rotation-angle) / (2*Math.PI))*(2*Math.PI);
    panels.forEach(({podium},i) => { podium.material = i === index ? activeMaterial : podiumMaterial; });
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const width = view.clientWidth;
    const height = view.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    baseRadius = camera.aspect < .82 ? 14.9 : 12.65;
    camera.updateProjectionMatrix();
    renderer.setSize(width,height,false);
    render();
  }
  new ResizeObserver(resize).observe(view);
  select(activeIndex);
  runway.addEventListener("runway:look",(event) => select(event.detail));
  view.addEventListener("webglcontextlost",(event) => {
    event.preventDefault();
    drawable = false;
    stage.classList.remove("is-3d");
    tools.hidden = true;
    displayButton.hidden = true;
    displayLabel.hidden = true;
  },true);

  const canvas = renderer.domElement;
  const clamp = (number,min,max) => Math.min(max,Math.max(min,number));
  function changeZoom(amount) {
    zoom = clamp(zoom + amount,.75,1.55);
    render();
  }
  canvas.addEventListener("pointerdown",(event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    drag = {id:event.pointerId,x:event.clientX,y:event.clientY,yaw,pitch};
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove",(event) => {
    if (drag?.id !== event.pointerId) return;
    yaw = drag.yaw - (event.clientX - drag.x)*.009;
    pitch = clamp(drag.pitch + (event.clientY - drag.y)*.005,.07,1.1);
    render();
  });
  canvas.addEventListener("pointerup",(event) => {
    if (drag?.id !== event.pointerId) return;
    const moved = Math.hypot(event.clientX-drag.x,event.clientY-drag.y);
    drag = null;
    if (moved > 8) return;
    const bounds = canvas.getBoundingClientRect();
    pointer.set((event.clientX-bounds.left)/bounds.width*2-1,1-(event.clientY-bounds.top)/bounds.height*2);
    raycaster.setFromCamera(pointer,camera);
    const hits = raycaster.intersectObjects(panels.flatMap(({panel,podium}) => panel.visible ? [panel,podium] : [podium]));
    if (!hits.length) return;
    const index = hits[0].object.userData.lookIndex;
    if (index === activeIndex) runway.querySelector("#view-look").click();
    else runway.go(index);
  });
  canvas.addEventListener("pointercancel",() => { drag = null; });
  canvas.addEventListener("wheel",(event) => {
    event.preventDefault();
    changeZoom(Math.sign(event.deltaY)*.062);
  },{passive:false});
  const cameraActions = {
    left:() => { yaw -= .35; },
    right:() => { yaw += .35; },
    in:() => changeZoom(-.13),
    out:() => changeZoom(.13),
    reset:() => { ({yaw,pitch,zoom} = cameraDefault); }
  };
  tools.addEventListener("click",(event) => {
    const action = event.target.closest("[data-camera]")?.dataset.camera;
    if (action) { cameraActions[action](); render(); }
  });

  stage.classList.add("is-3d");
  tools.hidden = false;
  displayButton.hidden = false;
  displayLabel.hidden = false;
  resize();
}
