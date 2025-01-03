import{r as o,j as r}from"./index-D2MUXnTG.js";import{V as v,C as R,P as j,M as w,a as g,u as S,A as P}from"./MouseHandler-BtVpYj15.js";import{u as F}from"./leva.esm-CCW7ngY5.js";const A="attribute float color;varying float vColor;void main(){vColor=color;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;gl_PointSize=(1.0-vColor)*15.0+2.0;}",V="uniform vec3 uNearColor;uniform vec3 uFarColor;varying float vColor;void main(){float distance=length(gl_PointCoord-vec2(0.5));float alpha=1.0-smoothstep(0.4,0.5,distance);if(alpha<0.0){discard;}vec3 color=mix(uNearColor,uFarColor,vColor);gl_FragColor=vec4(color,alpha);}",k=()=>{const{radius:u,nearColor:n,farColor:i}=F({radius:{value:1,min:1,max:3,step:1},nearColor:"#ffb600",farColor:"#0000ff"}),c=o.useRef(new v);return r.jsxs(R,{className:"cursor-crosshair bg-dark",children:[r.jsx(j,{makeDefault:!0,position:[0,0,10]}),r.jsx(w,{mousePositionRef:c}),r.jsx(z,{radius:u,nearColor:n,farColor:i,mousePos:c.current})]})},z=({radius:u,nearColor:n,farColor:i,mousePos:c,particleCount:a=5e3})=>{const l=o.useRef(null),f=o.useRef(null),d=o.useRef(new Float32Array(a*3)),x=o.useRef(new Float32Array(a)),C=o.useRef(new v),b=o.useMemo(()=>{const h=[];for(let s=0;s<a;s++)h.push({position:new v(Math.random()*15-7.5,Math.random()*10-5,0),velocity:new v(Math.random()*.5,Math.random()*.5,0)});return h},[]),M=o.useMemo(()=>({uNearColor:{value:new g(n)},uFarColor:{value:new g(i)}}),[]);return o.useEffect(()=>{f.current&&(f.current.uniforms.uNearColor.value.set(n),f.current.uniforms.uFarColor.value.set(i))},[n,i]),S((h,s)=>{if(l.current){for(let t=0;t<a;t++){const e=b[t],m=e.position.distanceTo(c),y=C.current.copy(c).sub(e.position).normalize();if(m<=u){const p=u-m;e.position.addScaledVector(y.negate(),p*10*s)}else{const p=1/Math.pow(m,2);e.velocity.addScaledVector(y,p),e.velocity.multiplyScalar(1-p*s*10)}e.position.addScaledVector(e.velocity,s),d.current[t*3]=e.position.x,d.current[t*3+1]=e.position.y,d.current[t*3+2]=e.position.z,x.current[t]=Math.min(100,m)/10}l.current.geometry.attributes.color.needsUpdate=!0,l.current.geometry.attributes.position.needsUpdate=!0}}),r.jsxs("points",{ref:l,children:[r.jsxs("bufferGeometry",{children:[r.jsx("bufferAttribute",{attach:"attributes-position",array:d.current,itemSize:3,count:a}),r.jsx("bufferAttribute",{attach:"attributes-color",array:x.current,itemSize:1,count:a})]}),r.jsx("shaderMaterial",{ref:f,blending:P,uniforms:M,fragmentShader:V,vertexShader:A})]})};export{k as default};