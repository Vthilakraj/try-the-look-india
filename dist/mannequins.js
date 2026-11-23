import * as THREE from "./vendor/three.module.min.js";

const styles = [
  ["tee","#eee1cc","#86a1b4","#eee3d0"],
  ["jacket","#373739","#716344","#f3e7d1"],
  ["suit","#8c776c","#8c776c","#41342e"],
  ["kurta","#939976","#e7dcca","#bd8a53"],
  ["tee","#2d3e64","#2c3036","#eee9de"],
  ["veshti","#f1eee5","#e8ddc3","#b88b60"],
  ["jacket","#344760","#546a86","#ebe8da"],
  ["suit","#232631","#232631","#2c2522"],
  ["nehru","#a56c66","#eadfca","#9e6743"],
  ["vest","#37383b","#303139","#e8e4da"],
  ["knit","#d5c6a8","#b6a791","#574032"],
  ["sherwani","#302b25","#ece0c8","#c08c58"]
];

function material(color) {
  return new THREE.MeshStandardMaterial({color,roughness:.9});
}

const mannequin = material("#887365");
const stitch = material("#69564a");
const ivory = material("#eee4d6");
const brass = new THREE.MeshStandardMaterial({color:"#c69853",roughness:.52,metalness:.26});

function mesh(parent,geometry,surface,x,y,z) {
  const item = new THREE.Mesh(geometry,surface);
  item.position.set(x,y,z);
  parent.add(item);
  return item;
}

function profile(parent,points,depth,surface,x,y,z=0) {
  const geometry = new THREE.LatheGeometry(points.map(([height,radius]) => new THREE.Vector2(radius,height)),28);
  const item = mesh(parent,geometry,surface,x,y,z);
  item.scale.z = depth;
  return item;
}

function limb(parent,start,end,rStart,rEnd,surface) {
  const from = new THREE.Vector3(...start);
  const to = new THREE.Vector3(...end);
  const delta = to.clone().sub(from);
  const middle = from.clone().lerp(to,.5);
  const item = mesh(parent,new THREE.CylinderGeometry(rEnd,rStart,delta.length(),24,1),surface,middle.x,middle.y,middle.z);
  item.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
  return item;
}

function oval(parent,radii,surface,x,y,z) {
  const item = mesh(parent,new THREE.SphereGeometry(1,24,16),surface,x,y,z);
  item.scale.set(...radii);
  return item;
}

export function createMannequin(index) {
  const [kind,topColor,bottomColor,shoeColor] = styles[index];
  const group = new THREE.Group();
  const top = material(topColor);
  const bottom = material(bottomColor);
  const shoes = material(shoeColor);
  const traditional = ["kurta","nehru","sherwani"].includes(kind);
  const coat = ["jacket","suit","sherwani","nehru"].includes(kind);
  const longSleeve = traditional || ["jacket","suit","veshti","knit"].includes(kind);
  const shell = kind === "vest";
  const pantsTop = 1.72;

  for (const side of [-1,1]) {
    const x = side*.222;
    oval(group,[.158,.11,.303],shoes,x,.163,.115);
    oval(group,[.151,.034,.30],stitch,x,.085,.11);
    if (kind !== "veshti") {
      profile(group,[[0,.139],[.10,.158],[.63,.174],[1.05,.195],[1.51,.211],[1.61,.204]],.88,bottom,x,.24);
    }
  }

  if (kind === "veshti") {
    profile(group,[[0,.352],[.12,.348],[.92,.367],[1.55,.422]],.74,bottom,0,.23);
    profile(group,[[0,.354],[.039,.355]],.745,brass,0,.284);
    const pleat = mesh(group,new THREE.BoxGeometry(.035,1.31,.013),brass,.106,.98,.265);
    pleat.rotation.z = -.052;
  } else {
    profile(group,[[0,.327],[.23,.42],[.39,.39]],.68,bottom,0,pantsTop-.2);
  }

  const hem = traditional ? (kind === "nehru" ? 1.16 : 1.1) : 1.72;
  const bodyProfile = [[0,0],[0,.428],[.14,.427],[2.22-hem,.378],[2.65-hem,.44],[2.82-hem,.478],[2.96-hem,.368],[3.012-hem,.185],[3.014-hem,0]];
  profile(group,bodyProfile,.52,kind === "nehru" ? ivory : top,0,hem);
  if (kind === "nehru") {
    profile(group,[[0,0],[0,.41],[.2,.396],[.62,.454],[.92,.366],[.97,.182],[.98,0]],.56,top,0,2.052);
  }
  if (kind === "suit" || kind === "jacket") {
    const mid = kind === "suit" ? "#e7ded0" : "#e9dfca";
    const inset = new THREE.Shape();
    inset.moveTo(-.157,0);
    inset.lineTo(.157,0);
    inset.lineTo(.045,-.63);
    inset.lineTo(-.041,-.63);
    inset.closePath();
    mesh(group,new THREE.ShapeGeometry(inset),material(mid),0,2.94,.24);
  }
  if (coat || kind === "veshti") {
    const feature = kind === "sherwani" ? brass : stitch;
    const count = traditional ? 6 : 4;
    for (let i=0; i<count; i++) {
      const y = (kind === "nehru" ? 2.72 : 2.49) - i*(traditional ? .112 : .115);
      oval(group,[.021,.022,.012],feature,.025,y,.249);
    }
  }
  if (kind === "kurta" || kind === "sherwani") {
    for (let row=0; row<6; row++) {
      for (const side of [-1,1]) {
        oval(group,[.013,.015,.009],kind === "sherwani" ? brass : ivory,side*.143,1.36 + row*.20,.22);
      }
    }
  }

  for (const side of [-1,1]) {
    const shoulder = [side*.413,2.794,0];
    const elbow = [side*.534,2.325,.012];
    const wrist = [side*.576,1.905,.08];
    const sleeveSurface = kind === "knit" || kind === "nehru" ? ivory : top;
    oval(group,[.142,.147,.135],shell ? mannequin : sleeveSurface,...shoulder);
    if (longSleeve) {
      limb(group,shoulder,elbow,.137,.112,sleeveSurface);
      limb(group,elbow,wrist,.111,.073,sleeveSurface);
    } else {
      const cuff = [side*.49,2.57,0];
      if (!shell) limb(group,shoulder,cuff,.139,.121,top);
      limb(group,shell ? shoulder : cuff,elbow,shell ? .115 : .096,.099,mannequin);
      limb(group,elbow,wrist,.098,.071,mannequin);
    }
    oval(group,[.072,.128,.078],mannequin,side*.58,1.80,.092);
  }
  if (traditional || kind === "veshti") {
    profile(group,[[0,.168],[.13,.165]],.81,kind === "nehru" ? top : ivory,0,2.97);
  }
  limb(group,[0,2.99,0],[0,3.244,0],.113,.103,mannequin);
  oval(group,[.178,.242,.161],mannequin,0,3.375,.006);
  oval(group,[.081,.057,.052],mannequin,0,3.333,.132);
  return group;
}
