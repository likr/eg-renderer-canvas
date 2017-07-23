!function(t){function e(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var r={};e.m=t,e.c=r,e.i=function(t){return t},e.d=function(t,r,o){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=6)}([function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){var r=[],o=!0,n=!1,i=void 0;try{for(var a,l=t[Symbol.iterator]();!(o=(a=l.next()).done)&&(r.push(a.value),!e||r.length!==e);o=!0);}catch(t){n=!0,i=t}finally{try{!o&&l.return&&l.return()}finally{if(n)throw i}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),n=function(t,e,r,o,n,i,a){var l=a/2;if(t===r)return[0,i/2+l];var u=Math.abs((e-o)/(t-r)),s=Math.atan(u);if(s<Math.atan2(i/2,n/2+l))return[n/2+l,Math.tan(s)*(n/2+l)];if(s>Math.atan2(i/2+l,n/2))return[Math.tan(Math.PI/2-s)*(i/2+l),i/2+l];var c=-1,f=e-u*t,h=t+n/2,d=e+i/2,y=u*h+c*d+f,p=Math.sqrt((Math.pow(u,2)+Math.pow(c,2))*Math.pow(l,2)-Math.pow(y,2));return[(-u*y-c*p)/(Math.pow(u,2)+Math.pow(c,2))+h-t,(1*y+u*p)/(Math.pow(u,2)+Math.pow(c,2))+d-e]},i=function(t,e,r,o,n,i,a){var l=2*a/3;if(t===r)return[0,i/2+l];var u=Math.abs((e-o)/(t-r)),s=Math.atan(u);return s<Math.atan2(i/2,n/2)?[n/2+Math.cos(s)*l,Math.tan(s)*n/2+Math.sin(s)*l]:[Math.tan(Math.PI/2-s)*i/2+Math.sin(Math.PI/2-s)*l,i/2+Math.cos(Math.PI/2-s)*l]},a=function(t,e,r,o,n,i,a){var l=a/2;if(t===r)return[0,i/2+l];var u=n/2,s=i/2,c=Math.abs((e-o)/(t-r)),f=Math.atan(c),h=u*s/Math.sqrt(Math.pow(c,2)*Math.pow(u,2)+Math.pow(s,2)),d=c*h;return[h+l*Math.cos(f),d+l*Math.sin(f)]},l=function(t,e,r,o,n,i,a){var l=2*a/3;if(t===r)return[0,i/2+l];var u=n/2,s=i/2,c=Math.abs((e-o)/(t-r)),f=Math.atan(c),h=u*s/Math.sqrt(Math.pow(c,2)*Math.pow(u,2)+Math.pow(s,2)),d=c*h;return[h+l*Math.cos(f),d+l*Math.sin(f)]},u=function(t,e,r,o,n,i){return r<n?o<i?[r+t,o+e]:[r+t,o-e]:o<i?[r-t,o+e]:[r-t,o-e]},s=function(t,e){return"circle"===t&&"rect"===e?n:"triangle"===t&&"rect"===e?i:"circle"===t&&"circle"===e?a:"triangle"===t&&"circle"===e?l:function(){return[0,0]}};e.adjustEdge=function(t,e,r){var n=t.points,i=t.sourceMarkerShape,a=t.sourceMarkerSize,l=t.targetMarkerShape,c=t.targetMarkerSize,f=s(i,e.type),h=f(e.x,e.y,r.x,r.y,e.width,e.height,a),d=o(h,2),y=d[0],p=d[1];n[0]=u(y,p,e.x,e.y,r.x,r.y);var k=s(l,r.type),b=k(r.x,r.y,e.x,e.y,r.width,r.height,c),g=o(b,2),v=g[0],S=g[1];n[n.length-1]=u(v,S,r.x,r.y,e.x,e.y)}},function(t,e){t.exports=d3},function(t,e,r){"use strict";function o(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}return Array.from(t)}Object.defineProperty(e,"__esModule",{value:!0});e.layoutRect=function(t){var e=t.vertices,r=Math.min.apply(Math,o(e.map(function(t){return t.x-t.width/2}))),n=Math.max.apply(Math,o(e.map(function(t){return t.x+t.width/2}))),i=Math.min.apply(Math,o(e.map(function(t){return t.y-t.height/2})));return{left:r,top:i,layoutWidth:n-r,layoutHeight:Math.max.apply(Math,o(e.map(function(t){return t.y+t.height/2})))-i}},e.centerTransform=function(t,e,r,o,n,i,a){var l=n-2*a,u=i-2*a,s=l/t,c=u/e,f=Math.min(s,c);return{x:s<c?0:(l-t*f)/2,y:c<s?0:(u-e*f)/2,k:f}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){var r=[],o=!0,n=!1,i=void 0;try{for(var a,l=t[Symbol.iterator]();!(o=(a=l.next()).done)&&(r.push(a.value),!e||r.length!==e);o=!0);}catch(t){n=!0,i=t}finally{try{!o&&l.return&&l.return()}finally{if(n)throw i}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),n=function(t,e,r){return(e-t)*r+t},i=function(t,e,r){var o=["u","type","fillColor","strokeColor","strokeOpacity","strokeWidth","label","labelFillColor","labelStrokeColor","labelStrokeWidth","d"],i=["x","y","width","height"],a={},l=!0,u=!1,s=void 0;try{for(var c,f=o[Symbol.iterator]();!(l=(c=f.next()).done);l=!0){var h=c.value;a[h]=e[h]}}catch(t){u=!0,s=t}finally{try{!l&&f.return&&f.return()}finally{if(u)throw s}}var d=!0,y=!1,p=void 0;try{for(var k,b=i[Symbol.iterator]();!(d=(k=b.next()).done);d=!0){var g=k.value;a[g]=n(t[g],e[g],r)}}catch(t){y=!0,p=t}finally{try{!d&&b.return&&b.return()}finally{if(y)throw p}}return a},a=function(t,e,r){var i=["u","v","type","strokeColor","strokeOpacity","sourceMarkerShape","sourceMarkerSize","targetMarkerShape","targetMarkerSize","label","labelFillColor","labelStrokeColor","labelStrokeWidth","d"],a=[],l={},u=!0,s=!1,c=void 0;try{for(var f,h=i[Symbol.iterator]();!(u=(f=h.next()).done);u=!0){var d=f.value;l[d]=e[d]}}catch(t){s=!0,c=t}finally{try{!u&&h.return&&h.return()}finally{if(s)throw c}}var y=!0,p=!1,k=void 0;try{for(var b,g=a[Symbol.iterator]();!(y=(b=g.next()).done);y=!0){var v=b.value;l[v]=n(t[v],e[v],r)}}catch(t){p=!0,k=t}finally{try{!y&&g.return&&g.return()}finally{if(p)throw k}}return l.points=t.points.map(function(t,i){var a=o(t,2),l=a[0],u=a[1];return[n(l,e.points[i][0],r),n(u,e.points[i][1],r)]}),l},l=(e.interpolateLayout=function(t,e,r){return r>1?e:{vertices:e.vertices.map(function(e){var o=e.u;return i(t.vertices.get(o),e,r)}),edges:e.edges.map(function(e){var o=e.u,n=e.v;return a(t.edges.get(o).get(n),e,r)})}},function(t,e,r,n){if(t)return t;if(r&&n)return Object.assign({},e,{points:[[r.x,r.y],[n.x,n.y]]});if(r){var i=r.x,a=r.y,l=e.points;return Object.assign({},e,{points:[[i,a],[l[1][0],0]]})}if(n){var u=n.x,s=n.y,c=e.points;return Object.assign({},e,{points:[[c[1][0],0],[u,s]]})}return Object.assign({},e,{points:e.points.map(function(t){return[o(t,1)[0],0]})})}),u=function(t,e,r,n){if(t)return t;if(r){var i=r.x,a=r.y,l=r.width,u=e.points;return Object.assign({},e,{points:[[i+l/2,a],[i+l/2,a],[u[2][0],0],[u[3][0],0],[u[4][0],0],[u[5][0],0]]})}if(n){var s=n.x,c=n.y,f=n.width,h=e.points;return Object.assign({},e,{points:[[h[0][0],0],[h[1][0],0],[h[2][0],0],[h[3][0],0],[s-f/2,c],[s-f/2,c]]})}return Object.assign({},e,{points:e.points.map(function(t){return[o(t,1)[0],0]})})},s=function(t,e){var r=t.u,o=t.v;if(!e.has(r))return null;var n=e.get(r);if(!n.has(o))return null;var i=n.get(o);return i.type===t.type?i:null};e.diff=function(t,e){var r=new Map(e.vertices.map(function(t){return[t.u,new Map]})),o=!0,n=!1,i=void 0;try{for(var a,c=e.edges[Symbol.iterator]();!(o=(a=c.next()).done);o=!0){var f=a.value,h=f.u,d=f.v,y=t.vertices.has(h)?t.vertices.get(h):null,p=t.vertices.has(d)?t.vertices.get(h):null,k=s(f,t.edges);"hierarchy"===f.type&&r.get(h).set(d,u(k,f,y,p)),r.get(h).set(d,l(k,f,y,p))}}catch(t){n=!0,i=t}finally{try{!o&&c.return&&c.return()}finally{if(n)throw i}}return{vertices:new Map(e.vertices.map(function(e){var r=e.u;return t.vertices.has(r)?[r,t.vertices.get(r)]:[r,Object.assign({},e,{y:0})]})),edges:r}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){var r=[],o=!0,n=!1,i=void 0;try{for(var a,l=t[Symbol.iterator]();!(o=(a=l.next()).done)&&(r.push(a.value),!e||r.length!==e);o=!0);}catch(t){n=!0,i=t}finally{try{!o&&l.return&&l.return()}finally{if(n)throw i}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),n=function(t,e){t.save(),e(),t.restore()},i=function(t,e){var r=e.fillColor,o=e.strokeColor,n=e.strokeWidth;t.fillStyle=r,t.strokeStyle=o,t.lineWidth=n},a=function(t,e){var r=e.strokeColor,o=e.strokeWidth;t.strokeStyle=r,t.lineWidth=o},l=function(t,e){var r=e.labelFillColor,o=e.labelStrokeColor,n=e.labelStrokeWidth;t.fillStyle=r,t.strokeStyle=o,t.lineWidth=n},u=function(t,e){var r=e.u,o=e.x,a=e.y,u=e.width,s=e.height,c=e.label,f=e.strokeWidth;n(t,function(){t.translate(o,a),n(t,function(){i(t,e),t.beginPath(),t.moveTo(-u/2,-s/2),t.lineTo(u/2,-s/2),t.lineTo(u/2,s/2),t.lineTo(-u/2,s/2),t.closePath(),t.fill(),f>0&&t.stroke()}),t.addHitRegion&&t.addHitRegion({id:r}),c&&(l(t,e),t.textAlign="center",e.labelStrokeWidth>0&&t.strokeText(c,0,4),t.fillText(c,0,4))})},s=function(t,e){var r=e.u,o=e.x,a=e.y,u=e.width,s=e.height,c=e.label,f=e.strokeWidth;n(t,function(){t.translate(o,a),n(t,function(){i(t,e),t.beginPath(),t.ellipse(0,0,u/2,s/2,0,0,2*Math.PI),t.closePath(),t.fill(),f>0&&t.stroke()}),t.addHitRegion&&t.addHitRegion({id:r}),c&&(l(t,e),t.textAlign="center",e.labelStrokeWidth>0&&t.strokeText(c,0,4),t.fillText(c,0,4))})},c=(e.renderVertex=function(t,e){switch(e.type){case"circle":s(t,e);break;case"rect":u(t,e)}},function(t,e){var r=e.points,i=e.label,u=e.sourceMarkerShape,s=e.sourceMarkerSize,c=e.targetMarkerShape,f=e.targetMarkerSize;n(t,function(){switch(n(t,function(){a(t,e),t.beginPath(),t.moveTo(r[0][0],r[0][1]);for(var o=1;o<r.length;++o)t.lineTo(r[o][0],r[o][1]);t.stroke()}),u){case"circle":n(t,function(){var n=o(r[0],2),i=n[0],a=n[1],l=s/2;t.fillStyle=e.strokeColor,t.translate(i,a),t.beginPath(),t.ellipse(0,0,l,l,0,0,2*Math.PI),t.fill()});break;case"triangle":n(t,function(){var n=o(r[0],2),i=n[0],a=n[1],l=o(r[1],2),u=l[0],s=l[1],c=Math.atan2(a-s,i-u),h=2*f/3;t.fillStyle=e.strokeColor,t.beginPath(),t.moveTo(i+Math.cos(c)*h,a+Math.sin(c)*h),t.lineTo(i+Math.cos(c+2*Math.PI/3)*h,a+Math.sin(c+2*Math.PI/3)*h),t.lineTo(i+Math.cos(c+4*Math.PI/3)*h,a+Math.sin(c+4*Math.PI/3)*h),t.closePath(),t.fill()})}switch(c){case"circle":n(t,function(){var n=o(r[r.length-1],2),i=n[0],a=n[1],l=f/2;t.fillStyle=e.strokeColor,t.translate(i,a),t.beginPath(),t.ellipse(0,0,l,l,0,0,2*Math.PI),t.fill()});break;case"triangle":n(t,function(){var n=o(r[r.length-1],2),i=n[0],a=n[1],l=o(r[r.length-2],2),u=l[0],s=l[1],c=Math.atan2(a-s,i-u),h=2*f/3;t.fillStyle=e.strokeColor,t.beginPath(),t.moveTo(i+Math.cos(c)*h,a+Math.sin(c)*h),t.lineTo(i+Math.cos(c+2*Math.PI/3)*h,a+Math.sin(c+2*Math.PI/3)*h),t.lineTo(i+Math.cos(c+4*Math.PI/3)*h,a+Math.sin(c+4*Math.PI/3)*h),t.closePath(),t.fill()})}if(i){var h=(r[0][0]+r[r.length-1][0])/2,d=(r[0][1]+r[r.length-1][1])/2;t.translate(h,d),l(t,e),t.textAlign="center",e.labelStrokeWidth>0&&t.strokeText(i,0,4),t.fillText(i,0,4)}})}),f=function(t,e,r,o,n){var i=o-e,a=n-r;t.quadraticCurveTo(e+i/4,r,e+i/2,r+a/2),t.quadraticCurveTo(e+3*i/4,n,o,n)},h=function(t,e){var r=e.points;n(t,function(){a(t,e),t.beginPath(),t.moveTo(r[0][0],r[0][1]),t.lineTo(r[1][0],r[1][1]),f(t,r[1][0],r[1][1],r[2][0],r[2][1]),t.lineTo(r[3][0],r[3][1]),f(t,r[3][0],r[3][1],r[4][0],r[4][1]),t.lineTo(r[5][0],r[5][1]),t.stroke()})},d=function(t,e){var r=e.points,o=r[1][0]-r[0][0],i=r[1][1]-r[0][1],l=Math.sqrt(o*o+i+i)/2,u=(r[0][0]+r[1][0])/2,s=(r[0][1]+r[1][1])/2,c=Math.atan(i/o);n(t,function(){a(t,e),t.beginPath(),t.arc(u,s,l,c,c+Math.PI),t.stroke()})};e.renderEdge=function(t,e){switch(e.type){case"arc":d(t,e);break;case"hierarchy":h(t,e);break;case"line":c(t,e)}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.zoom=void 0;var o=r(1),n=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}(o),i=r(0),a=function(t,e){var r=new window.CustomEvent("nodemovestart",{detail:{id:e}});t.dispatchEvent(r)},l=function(t,e){var r=e.u,o=e.x,n=e.y,i=new window.CustomEvent("nodemove",{detail:{id:r,x:o,y:n}});t.dispatchEvent(i)},u=function(t,e){var r=new window.CustomEvent("nodemoveend",{detail:{id:e}});t.dispatchEvent(r)};e.zoom=function(t,e){var r={region:null,x0:0,y0:0},o=!1,s=n.zoom();return s.on("start",function(){if(!t.canZoom||t.canDragNode&&n.event.sourceEvent&&n.event.sourceEvent.region){var e=n.event.sourceEvent?n.event.sourceEvent.region:null,o=n.event.transform,i=o.x,l=o.y,u=o.k;r.region=e,r.x0=i/u,r.y0=l/u,e&&a(t,e)}}).on("zoom",function(){var o=n.event.transform,a=o.x,u=o.y,s=o.k;if(t.canDragNode&&r.region){var c=r.region,f=a/s-r.x0,h=u/s-r.y0,d=e.data,y=d.vertices[d.indices.get(c)];y.x+=f,y.y+=h;var p=!0,k=!1,b=void 0;try{for(var g,v=y.outEdges[Symbol.iterator]();!(p=(g=v.next()).done);p=!0){var S=g.value,M=S.points;M[0][0]+=f,M[0][1]+=h,(0,i.adjustEdge)(S,y,d.vertices[d.indices.get(S.v)])}}catch(t){k=!0,b=t}finally{try{!p&&v.return&&v.return()}finally{if(k)throw b}}var m=!0,w=!1,P=void 0;try{for(var A,L=y.inEdges[Symbol.iterator]();!(m=(A=L.next()).done);m=!0){var x=A.value,M=x.points;M[M.length-1][0]+=f,M[M.length-1][1]+=h,(0,i.adjustEdge)(x,d.vertices[d.indices.get(x.u)],y)}}catch(t){w=!0,P=t}finally{try{!m&&L.return&&L.return()}finally{if(w)throw P}}r.x0=a/s,r.y0=u/s,l(t,y)}else!t.canZoom&&n.event.sourceEvent||Object.assign(e.transform,{x:a,y:u,k:s})}).on("end",function(){if(!o&&(!t.canZoom||r.region)){var i=r.region;r.region=null,o=!0,n.select(this).call(s.transform,n.zoomIdentity.translate(e.transform.x,e.transform.y).scale(e.transform.k)),o=!1,i&&u(t,i)}}),s}},function(t,e,r){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}}(),l=r(1),u=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}(l),s=r(2),c=r(3),f=r(4),h=r(5),d=r(0),y=function(){return window.devicePixelRatio||1},p=function(t,e,r){return t.hasOwnProperty(e)?t[e]:r},k=new WeakMap,b=function(t,e){var r=k.get(t);r.canvas.width=e*y(),r.canvas.style.width=e+"px"},g=function(t,e){var r=k.get(t);r.canvas.height=e*y(),r.canvas.style.height=e+"px"},v=function(t,e,r){return t.hasAttribute(e)?t.getAttribute(e):r},S=function(t){function e(){o(this,e);var t=n(this,(e.__proto__||Object.getPrototypeOf(e)).call(this)),r={canvas:document.createElement("canvas"),data:{vertices:[],edges:[]},transform:{x:0,y:0,k:1},highlightedVertex:null,layoutResult:{vertices:new Map,edges:new Map},margin:10,layoutTime:0};return r.zoom=(0,h.zoom)(t,r),k.set(t,r),u.select(r.canvas).call(r.zoom),r.canvas.addEventListener("mousemove",function(e){t.canDragNode&&e.region?(r.canvas.style.cursor="pointer",r.highlightedVertex=e.region):t.canZoom?(r.canvas.style.cursor="move",r.highlightedVertex=null):r.canvas.style.cursor="default"}),t}return i(e,t),a(e,null,[{key:"observedAttributes",get:function(){return["src","width","height"]}}]),a(e,[{key:"connectedCallback",value:function(){var t=this,e=k.get(this);this.appendChild(e.canvas);!function r(){var o=new Date,n=t.transitionDuration,i=(o-e.layoutTime)/n,a=(0,c.interpolateLayout)(e.layoutResult,e.data,i),l=e.canvas.getContext("2d");l.save(),l.clearRect(0,0,e.canvas.width,e.canvas.height),l.scale(y(),y()),l.translate(e.margin,e.margin),l.translate(e.transform.x,e.transform.y),l.scale(e.transform.k,e.transform.k);var u=!0,s=!1,h=void 0;try{for(var d,p=a.edges[Symbol.iterator]();!(u=(d=p.next()).done);u=!0){var k=d.value;(0,f.renderEdge)(l,k)}}catch(t){s=!0,h=t}finally{try{!u&&p.return&&p.return()}finally{if(s)throw h}}var b=!0,g=!1,v=void 0;try{for(var S,M=a.vertices[Symbol.iterator]();!(b=(S=M.next()).done);b=!0){var m=S.value;(0,f.renderVertex)(l,m)}}catch(t){g=!0,v=t}finally{try{!b&&M.return&&M.return()}finally{if(g)throw v}}l.restore(),window.requestAnimationFrame(r)}()}},{key:"attributeChangedCallback",value:function(t,e,r){var o=this;switch(t){case"src":window.fetch(r).then(function(t){return t.json()}).then(function(t){o.load(t)});break;case"width":b(this,r);break;case"height":g(this,r)}}},{key:"layout",value:function(){var t=k.get(this),e=t.data;this.onLayout(e);var r=!0,o=!1,n=void 0;try{for(var i,a=e.edges[Symbol.iterator]();!(r=(i=a.next()).done);r=!0){var l=i.value,u=l.u,s=l.v,f=e.vertices[e.indices.get(u)],h=e.vertices[e.indices.get(s)];(0,d.adjustEdge)(l,f,h)}}catch(t){o=!0,n=t}finally{try{!r&&a.return&&a.return()}finally{if(o)throw n}}return t.layoutResult=(0,c.diff)(t.layoutResult,e),t.layoutTime=new Date,this.autoCentering&&this.center(),this}},{key:"center",value:function(){var t=k.get(this),e=t.canvas,r=t.data,o=t.margin,n=t.zoom,i=(0,s.layoutRect)(r),a=i.layoutWidth,l=i.layoutHeight,c=i.left,f=i.top,h=e.width/y(),d=e.height/y(),p=(0,s.centerTransform)(a,l,c,f,h,d,o),b=p.x,g=p.y,v=p.k;return n.transform(u.select(e),u.zoomIdentity.translate(b,g).scale(v).translate(-c,-f)),this}},{key:"load",value:function(t){var e=this,r=t[this.graphNodesProperty].map(function(t,r){var o=u.color(p(t,e.nodeFillColorProperty,e.defaultNodeFillColor));o.opacity=+p(t,e.nodeFillOpacityProperty,e.defaultNodeFillOpacity);var n=u.color(p(t,e.nodeStrokeColorProperty,e.defaultNodeStrokeColor));n.opacity=+p(t,e.nodeStrokeOpacityProperty,e.defaultNodeStrokeOpacity);var i=u.color(p(t,e.nodeLabelFillColorProperty,e.defaultNodeLabelFillColor));i.opacity=+p(t,e.nodeLabelFillOpacityProperty,e.defaultNodeLabelFillOpacity);var a=u.color(p(t,e.nodeLabelStrokeColorProperty,e.defaultNodeLabelStrokeColor));return a.opacity=+p(t,e.nodeLabelStrokeOpacityProperty,e.defaultNodeLabelStrokeOpacity),{u:("$index"===e.nodeIdProperty?r:t[e.nodeIdProperty]).toString(),x:+p(t,e.nodeXProperty,e.defaultNodeX),y:+p(t,e.nodeYProperty,e.defaultNodeY),width:+p(t,e.nodeWidthProperty,e.defaultNodeWidth),height:+p(t,e.nodeHeightProperty,e.defaultNodeHeight),type:p(t,e.nodeTypeProperty,e.defaultNodeType),fillColor:o.toString(),strokeColor:n.toString(),strokeWidth:+p(t,e.nodeStrokeWidthProperty,e.defaultNodeStrokeWidth),label:p(t,e.nodeLabelProperty,e.defaultNodeLabel),labelFillColor:i.toString(),labelStrokeColor:a.toString(),labelStrokeWidth:+p(t,e.nodeLabelStrokeWidthProperty,e.defaultNodeLabelStrokeWidth),inEdges:[],outEdges:[],d:t}}),o=new Map(r.map(function(t,e){return[t.u,e]})),n=t[this.graphLinksProperty].map(function(t){var n=t[e.linkSourceProperty].toString(),i=t[e.linkTargetProperty].toString(),a=u.color(p(t,e.linkStrokeColorProperty,e.defaultLinkStrokeColor));a.opacity=+p(t,e.linkStrokeOpacityProperty,e.defaultLinkStrokeOpacity),u.color(p(t,e.linkLabelFillColorProperty,e.defaultLinkLabelFillColor)).opacity=+p(t,e.linkLabelFillOpacityProperty,e.defaultLinkLabelFillOpacity),u.color(p(t,e.linkLabelStrokeColorProperty,e.defaultLinkLabelStrokeColor)).opacity=+p(t,e.linkLabelStrokeOpacityProperty,e.defaultLinkLabelStrokeOpacity);var l=r[o.get(n)],s=r[o.get(i)],c=[[l.x,l.y],[s.x,s.y]],f={u:n,v:i,points:c,type:"line",strokeColor:a.toString(),strokeWidth:+p(t,e.linkStrokeWidthProperty,e.defaultLinkStrokeWidth),sourceMarkerShape:p(t,e.linkSourceMarkerShapeProperty,e.defaultLinkSourceMarkerShape),sourceMarkerSize:+p(t,e.linkSourceMarkerSizeProperty,e.defaultLinkSourceMarkerSize),targetMarkerShape:p(t,e.linkTargetMarkerShapeProperty,e.defaultLinkTargetMarkerShape),targetMarkerSize:+p(t,e.linkTargetMarkerSizeProperty,e.defaultLinkTargetMarkerSize),label:p(t,e.linkLabelProperty,e.defaultLinkLabel),labelFillColor:p(t,e.linkLabelFillColorProperty,e.defaultLinkLabelFillColor),labelStrokeColor:p(t,e.linkLabelStrokeColorProperty,e.defaultLinkLabelStrokeColor),labelStrokeWidth:+p(t,e.linkLabelStrokeWidthProperty,e.defaultLinkLabelStrokeWidth),d:t};return l.outEdges.push(f),s.inEdges.push(f),f});return k.get(this).data={vertices:r,edges:n,indices:o},this.autoUpdate&&this.layout(),this}},{key:"onLayout",value:function(){}},{key:"autoUpdate",get:function(){return!this.hasAttribute("no-auto-update")},set:function(t){t?this.removeAttribute("no-auto-update"):this.setAttribute("no-auto-update","")}},{key:"autoCentering",get:function(){return!this.hasAttribute("no-auto-centering")},set:function(t){t?this.removeAttribute("no-auto-centering"):this.setAttribute("no-auto-centering","")}},{key:"canZoom",get:function(){return!this.hasAttribute("no-zoom")},set:function(t){t?this.removeAttribute("no-zoom"):this.setAttribute("no-zoom","")}},{key:"canDragNode",get:function(){return!this.hasAttribute("no-drag-node")},set:function(t){t?this.removeAttribute("no-drag-node"):this.setAttribute("no-drag-node","")}},{key:"src",get:function(){return v(this,"src",null)},set:function(t){this.setAttribute("src",t)}},{key:"width",get:function(){return v(this,"width",300)},set:function(t){this.setAttribute("width",t)}},{key:"height",get:function(){return v(this,"height",150)},set:function(t){this.setAttribute("height",t)}},{key:"transitionDuration",get:function(){return v(this,"transition-duration",0)},set:function(t){this.setAttribute("transition-duration",t)}},{key:"graphNodesProperty",get:function(){return v(this,"graph-nodes-property","nodes")},set:function(t){this.setAttribute("graph-nodes-property",t)}},{key:"graphLinksProperty",get:function(){return v(this,"graph-links-property","links")},set:function(t){this.setAttribute("graph-links-property",t)}},{key:"nodeIdProperty",get:function(){return v(this,"node-id-property","$index")},set:function(t){this.setAttribute("node-id-property",t)}},{key:"nodeXProperty",get:function(){return v(this,"node-x-property","x")},set:function(t){this.setAttribute("node-x-property",t)}},{key:"nodeYProperty",get:function(){return v(this,"node-y-property","y")},set:function(t){this.setAttribute("node-y-property",t)}},{key:"nodeWidthProperty",get:function(){return v(this,"node-width-property","width")},set:function(t){this.setAttribute("node-width-property",t)}},{key:"nodeHeightProperty",get:function(){return v(this,"node-height-property","height")},set:function(t){this.setAttribute("node-height-property",t)}},{key:"nodeFillColorProperty",get:function(){return v(this,"node-fill-color-property","fillColor")},set:function(t){this.setAttribute("node-fill-color-property",t)}},{key:"nodeFillOpacityProperty",get:function(){return v(this,"node-fill-opacity-property","fillOpacity")},set:function(t){this.setAttribute("node-fill-opacity-property",t)}},{key:"nodeStrokeColorProperty",get:function(){return v(this,"node-stroke-color-property","strokeColor")},set:function(t){this.setAttribute("node-stroke-color-property",t)}},{key:"nodeStrokeOpacityProperty",get:function(){return v(this,"node-stroke-opacity-property","strokeOpacity")},set:function(t){this.setAttribute("node-stroke-opacity-property",t)}},{key:"nodeStrokeWidthProperty",get:function(){return v(this,"node-stroke-width-property","strokeWidth")},set:function(t){this.setAttribute("node-stroke-width-property",t)}},{key:"nodeTypeProperty",get:function(){return v(this,"node-type-property","type")},set:function(t){this.setAttribute("node-type-property",t)}},{key:"nodeLabelProperty",get:function(){return v(this,"node-label-property","label")},set:function(t){this.setAttribute("node-label-property",t)}},{key:"nodeLabelFillColorProperty",get:function(){return v(this,"node-label-fill-color-property","labelFillColor")},set:function(t){this.setAttribute("node-label-fill-color-property",t)}},{key:"nodeLabelFillOpacityProperty",get:function(){return v(this,"node-label-fill-opacity-property","labelFillOpacity")},set:function(t){this.setAttribute("node-label-fill-opacity-property",t)}},{key:"nodeLabelStrokeColorProperty",get:function(){return v(this,"node-label-stroke-color-property","labelStrokeColor")},set:function(t){this.setAttribute("node-label-stroke-color-property",t)}},{key:"nodeLabelStrokeOpacityProperty",get:function(){return v(this,"node-label-stroke-opacity-property","labelStrokeOpacity")},set:function(t){this.setAttribute("node-label-stroke-opacity-property",t)}},{key:"nodeLabelStrokeWidthProperty",get:function(){return v(this,"node-label-stroke-width-property","labelStrokeWidth")},set:function(t){this.setAttribute("node-label-stroke-width-property",t)}},{key:"linkSourceProperty",get:function(){return v(this,"link-source-property","source")},set:function(t){this.setAttribute("link-source-property",t)}},{key:"linkTargetProperty",get:function(){return v(this,"link-target-property","target")},set:function(t){this.setAttribute("link-target-property",t)}},{key:"linkStrokeColorProperty",get:function(){return v(this,"link-stroke-color-property","strokeColor")},set:function(t){this.setAttribute("link-stroke-color-property",t)}},{key:"linkStrokeOpacityProperty",get:function(){return v(this,"link-stroke-opacity-property","strokeOpacity")},set:function(t){this.setAttribute("link-stroke-opacity-property",t)}},{key:"linkStrokeWidthProperty",get:function(){return v(this,"link-stroke-width-property","strokeWidth")},set:function(t){this.setAttribute("link-stroke-width-property",t)}},{key:"linkSourceMarkerShapeProperty",get:function(){return v(this,"link-source-marker-shape-property","sourceMarkerShape")},set:function(t){this.setAttribute("link-source-marker-shape-property",t)}},{key:"linkSourceMarkerSizeProperty",get:function(){return v(this,"link-source-marker-size-property","sourceMarkerSize")},set:function(t){this.setAttribute("link-source-marker-size-property",t)}},{key:"linkTargetMarkerShapeProperty",get:function(){return v(this,"link-target-marker-shape-property","targetMarkerShape")},set:function(t){this.setAttribute("link-target-marker-shape-property",t)}},{key:"linkTargetMarkerSizeProperty",get:function(){return v(this,"link-target-marker-size-property","targetMarkerSize")},set:function(t){this.setAttribute("link-target-marker-size-property",t)}},{key:"linkLabelProperty",get:function(){return v(this,"link-label-property","label")},set:function(t){this.setAttribute("link-label-property",t)}},{key:"linkLabelFillColorProperty",get:function(){return v(this,"link-label-fill-color-property","labelFillColor")},set:function(t){this.setAttribute("link-label-fill-color-property",t)}},{key:"linkLabelFillOpacityProperty",get:function(){return v(this,"link-label-fill-opacity-property","labelFillOpacity")},set:function(t){this.setAttribute("link-label-fill-opacity-property",t)}},{key:"linkLabelStrokeColorProperty",get:function(){return v(this,"link-label-stroke-color-property","labelStrokeColor")},set:function(t){this.setAttribute("link-label-stroke-color-property",t)}},{key:"linkLabelStrokeOpacityProperty",get:function(){return v(this,"link-label-stroke-opacity-property","labelStrokeOpacity")},set:function(t){this.setAttribute("link-label-stroke-opacity-property",t)}},{key:"linkLabelStrokeWidthProperty",get:function(){return v(this,"link-label-stroke-width-property","labelStrokeWidth")},set:function(t){this.setAttribute("link-label-stroke-width-property",t)}},{key:"defaultNodeX",get:function(){return v(this,"default-node-x",0)},set:function(t){this.setAttribute("default-node-x",t)}},{key:"defaultNodeY",get:function(){return v(this,"default-node-y",0)},set:function(t){this.setAttribute("default-node-y",t)}},{key:"defaultNodeWidth",get:function(){return v(this,"default-node-width",10)},set:function(t){this.setAttribute("default-node-width",t)}},{key:"defaultNodeHeight",get:function(){return v(this,"default-node-height",10)},set:function(t){this.setAttribute("default-node-height",t)}},{key:"defaultNodeFillColor",get:function(){return v(this,"default-node-fill-color","#fff")},set:function(t){this.setAttribute("default-node-fill-color",t)}},{key:"defaultNodeFillOpacity",get:function(){return v(this,"default-node-fill-opacity",1)},set:function(t){this.setAttribute("default-node-fill-opacity",t)}},{key:"defaultNodeStrokeColor",get:function(){return v(this,"default-node-stroke-color","#000")},set:function(t){this.setAttribute("default-node-stroke-color",t)}},{key:"defaultNodeStrokeOpacity",get:function(){return v(this,"default-node-stroke-opacity",1)},set:function(t){this.setAttribute("default-node-stroke-opacity",t)}},{key:"defaultNodeStrokeWidth",get:function(){return v(this,"default-node-stroke-width",1)},set:function(t){this.setAttribute("default-node-stroke-width",t)}},{key:"defaultNodeType",get:function(){return v(this,"default-node-type","circle")},set:function(t){this.setAttribute("default-node-type",t)}},{key:"defaultNodeLabel",get:function(){return v(this,"default-node-label","")},set:function(t){this.setAttribute("default-node-label",t)}},{key:"defaultNodeLabelFillColor",get:function(){return v(this,"default-node-label-fill-color","#000")},set:function(t){this.setAttribute("default-node-label-fill-color",t)}},{key:"defaultNodeLabelFillOpacity",get:function(){return v(this,"default-node-label-fill-opacity",1)},set:function(t){this.setAttribute("default-node-label-fill-opacity",t)}},{key:"defaultNodeLabelStrokeColor",get:function(){return v(this,"default-node-label-stroke-color","#fff")},set:function(t){this.setAttribute("default-node-label-stroke-color",t)}},{key:"defaultNodeLabelStrokeOpacity",get:function(){return v(this,"default-node-label-stroke-opacity",1)},set:function(t){this.setAttribute("default-node-label-stroke-opacity",t)}},{key:"defaultNodeLabelStrokeWidth",get:function(){return v(this,"default-node-label-stroke-width",0)},set:function(t){this.setAttribute("default-node-label-stroke-width",t)}},{key:"defaultLinkStrokeColor",get:function(){return v(this,"default-link-stroke-color","#000")},set:function(t){this.setAttribute("default-link-stroke-color",t)}},{key:"defaultLinkStrokeOpacity",get:function(){return v(this,"default-link-stroke-opacity",1)},set:function(t){this.setAttribute("default-link-stroke-opacity",t)}},{key:"defaultLinkStrokeWidth",get:function(){return v(this,"default-link-stroke-width",1)},set:function(t){this.setAttribute("default-link-stroke-width",t)}},{key:"defaultLinkSourceMarkerShape",get:function(){return v(this,"default-link-source-marker-shape","none")},set:function(t){this.setAttribute("default-link-source-marker-shape",t)}},{key:"defaultLinkSourceMarkerSize",get:function(){return v(this,"default-link-source-marker-size",5)},set:function(t){this.setAttribute("default-link-source-marker-size",t)}},{key:"defaultLinkTargetMarkerShape",get:function(){return v(this,"default-link-target-marker-shape","none")},set:function(t){this.setAttribute("default-link-target-marker-shape",t)}},{key:"defaultLinkTargetMarkerSize",get:function(){return v(this,"default-link-target-marker-size",5)},set:function(t){this.setAttribute("default-link-target-marker-size",t)}},{key:"defaultLinkLabel",get:function(){return v(this,"default-link-label","")},set:function(t){this.setAttribute("default-link-label",t)}},{key:"defaultLinkLabelFillColor",get:function(){return v(this,"default-link-label-fill-color","#000")},set:function(t){this.setAttribute("default-link-label-fill-color",t)}},{key:"defaultLinkLabelFillOpacity",get:function(){return v(this,"default-link-label-fill-opacity",1)},set:function(t){this.setAttribute("default-link-label-fill-opacity",t)}},{key:"defaultLinkLabelStrokeColor",get:function(){return v(this,"default-link-label-stroke-color","#fff")},set:function(t){this.setAttribute("default-link-label-stroke-color",t)}},{key:"defaultLinkLabelStrokeOpacity",get:function(){return v(this,"default-link-label-stroke-opacity",1)},set:function(t){this.setAttribute("default-link-label-stroke-opacity",t)}},{key:"defaultLinkLabelStrokeWidth",get:function(){return v(this,"default-link-label-stroke-width",0)},set:function(t){this.setAttribute("default-link-label-stroke-width",t)}}]),e}(window.HTMLElement);window.customElements.define("eg-renderer",S)}]);