!function(t){function e(o){if(r[o])return r[o].exports;var i=r[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var r={};e.m=t,e.c=r,e.i=function(t){return t},e.d=function(t,r,o){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=6)}([function(t,e){t.exports=d3},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){var r=[],o=!0,i=!1,n=void 0;try{for(var a,l=t[Symbol.iterator]();!(o=(a=l.next()).done)&&(r.push(a.value),!e||r.length!==e);o=!0);}catch(t){i=!0,n=t}finally{try{!o&&l.return&&l.return()}finally{if(i)throw n}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=function(t,e,r,o,i,n,a){var l=a/2;if(t===r)return[0,n/2+l];var u=Math.abs((e-o)/(t-r)),s=Math.atan(u);if(s<Math.atan2(n/2,i/2+l))return[i/2+l,Math.tan(s)*(i/2+l)];if(s>Math.atan2(n/2+l,i/2))return[Math.tan(Math.PI/2-s)*(n/2+l),n/2+l];var c=-1,f=e-u*t,d=t+i/2,y=e+n/2,p=u*d+c*y+f,h=Math.sqrt((Math.pow(u,2)+Math.pow(c,2))*Math.pow(l,2)-Math.pow(p,2));return[(-u*p-c*h)/(Math.pow(u,2)+Math.pow(c,2))+d-t,(1*p+u*h)/(Math.pow(u,2)+Math.pow(c,2))+y-e]},n=function(t,e,r,o,i,n,a){var l=2*a/3;if(t===r)return[0,n/2+l];var u=Math.abs((e-o)/(t-r)),s=Math.atan(u);return s<Math.atan2(n/2,i/2)?[i/2+Math.cos(s)*l,Math.tan(s)*i/2+Math.sin(s)*l]:[Math.tan(Math.PI/2-s)*n/2+Math.sin(Math.PI/2-s)*l,n/2+Math.cos(Math.PI/2-s)*l]},a=function(t,e,r,o,i,n,a){var l=a/2;if(t===r)return[0,n/2+l];var u=i/2,s=n/2,c=Math.abs((e-o)/(t-r)),f=Math.atan(c),d=u*s/Math.sqrt(Math.pow(c,2)*Math.pow(u,2)+Math.pow(s,2)),y=c*d;return[d+l*Math.cos(f),y+l*Math.sin(f)]},l=function(t,e,r,o,i,n,a){var l=2*a/3;if(t===r)return[0,n/2+l];var u=i/2,s=n/2,c=Math.abs((e-o)/(t-r)),f=Math.atan(c),d=u*s/Math.sqrt(Math.pow(c,2)*Math.pow(u,2)+Math.pow(s,2)),y=c*d;return[d+l*Math.cos(f),y+l*Math.sin(f)]},u=function(t,e,r,o,i,n){return r<i?o<n?[r+t,o+e]:[r+t,o-e]:o<n?[r-t,o+e]:[r-t,o-e]},s=function(t,e){return"circle"===t&&"rect"===e?i:"triangle"===t&&"rect"===e?n:"circle"===t&&"circle"===e?a:"triangle"===t&&"circle"===e?l:function(){return[0,0]}};e.adjustEdge=function(t,e,r){var i=t.points,n=t.sourceMarkerShape,a=t.sourceMarkerSize,l=t.targetMarkerShape,c=t.targetMarkerSize,f=s(n,e.type),d=f(e.x,e.y,r.x,r.y,e.width,e.height,a),y=o(d,2),p=y[0],h=y[1];i[0]=u(p,h,e.x,e.y,r.x,r.y);var k=s(l,r.type),b=k(r.x,r.y,e.x,e.y,r.width,r.height,c),g=o(b,2),v=g[0],S=g[1];i[i.length-1]=u(v,S,r.x,r.y,e.x,e.y)}},function(t,e,r){"use strict";function o(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}return Array.from(t)}Object.defineProperty(e,"__esModule",{value:!0});e.layoutRect=function(t){var e=t.vertices,r=Math.min.apply(Math,o(e.map(function(t){return t.x-t.width/2}))),i=Math.max.apply(Math,o(e.map(function(t){return t.x+t.width/2}))),n=Math.min.apply(Math,o(e.map(function(t){return t.y-t.height/2})));return{left:r,top:n,layoutWidth:i-r,layoutHeight:Math.max.apply(Math,o(e.map(function(t){return t.y+t.height/2})))-n}},e.centerTransform=function(t,e,r,o,i,n,a){var l=i-2*a,u=n-2*a,s=l/t,c=u/e,f=Math.min(s,c);return{x:s<c?0:(l-t*f)/2,y:c<s?0:(u-e*f)/2,k:f}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.makeMap=e.diff=e.interpolateLayout=void 0;var o=function(){function t(t,e){var r=[],o=!0,i=!1,n=void 0;try{for(var a,l=t[Symbol.iterator]();!(o=(a=l.next()).done)&&(r.push(a.value),!e||r.length!==e);o=!0);}catch(t){i=!0,n=t}finally{try{!o&&l.return&&l.return()}finally{if(i)throw n}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=r(0),n=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}(i),a=function(t,e,r){return(e-t)*r+t},l=function(t,e,r){var o=["u","type","label","d"],i=["x","y","width","height","strokeWidth","labelStrokeWidth"],l=["fillColor","strokeColor","labelFillColor","labelStrokeColor"],u={},s=!0,c=!1,f=void 0;try{for(var d,y=o[Symbol.iterator]();!(s=(d=y.next()).done);s=!0){var p=d.value;u[p]=e[p]}}catch(t){c=!0,f=t}finally{try{!s&&y.return&&y.return()}finally{if(c)throw f}}var h=!0,k=!1,b=void 0;try{for(var g,v=i[Symbol.iterator]();!(h=(g=v.next()).done);h=!0){var S=g.value;u[S]=a(t[S],e[S],r)}}catch(t){k=!0,b=t}finally{try{!h&&v.return&&v.return()}finally{if(k)throw b}}var m=!0,w=!1,M=void 0;try{for(var P,A=l[Symbol.iterator]();!(m=(P=A.next()).done);m=!0){var L=P.value;u[L]=n.interpolateRgb(t[L],e[L])(r)}}catch(t){w=!0,M=t}finally{try{!m&&A.return&&A.return()}finally{if(w)throw M}}return u},u=function(t,e,r){var i=["u","v","type","sourceMarkerShape","targetMarkerShape","label","d"],l=["strokeWidth","sourceMarkerSize","targetMarkerSize","labelStrokeWidth"],u=["strokeColor","labelFillColor","labelStrokeColor"],s={},c=!0,f=!1,d=void 0;try{for(var y,p=i[Symbol.iterator]();!(c=(y=p.next()).done);c=!0){var h=y.value;s[h]=e[h]}}catch(t){f=!0,d=t}finally{try{!c&&p.return&&p.return()}finally{if(f)throw d}}var k=!0,b=!1,g=void 0;try{for(var v,S=l[Symbol.iterator]();!(k=(v=S.next()).done);k=!0){var m=v.value;s[m]=a(t[m],e[m],r)}}catch(t){b=!0,g=t}finally{try{!k&&S.return&&S.return()}finally{if(b)throw g}}var w=!0,M=!1,P=void 0;try{for(var A,L=u[Symbol.iterator]();!(w=(A=L.next()).done);w=!0){var x=A.value;s[x]=n.interpolateRgb(t[x],e[x])(r)}}catch(t){M=!0,P=t}finally{try{!w&&L.return&&L.return()}finally{if(M)throw P}}return s.points=t.points.map(function(t,i){var n=o(t,2),l=n[0],u=n[1];return[a(l,e.points[i][0],r),a(u,e.points[i][1],r)]}),s},s=(e.interpolateLayout=function(t,e,r){return r>1?e:{vertices:e.vertices.map(function(e){var o=e.u;return l(t.vertices.get(o),e,r)}),edges:e.edges.map(function(e){var o=e.u,i=e.v;return u(t.edges.get(o).get(i),e,r)})}},function(t,e,r,i){if(t)return t;if(r&&i)return Object.assign({},e,{points:[[r.x,r.y],[i.x,i.y]]});if(r){var n=r.x,a=r.y,l=e.points;return Object.assign({},e,{points:[[n,a],[l[1][0],0]]})}if(i){var u=i.x,s=i.y,c=e.points;return Object.assign({},e,{points:[[c[1][0],0],[u,s]]})}return Object.assign({},e,{points:e.points.map(function(t){return[o(t,1)[0],0]})})}),c=function(t,e,r,i){if(t)return t;if(r){var n=r.x,a=r.y,l=r.width,u=e.points;return Object.assign({},e,{points:[[n+l/2,a],[n+l/2,a],[u[2][0],0],[u[3][0],0],[u[4][0],0],[u[5][0],0]]})}if(i){var s=i.x,c=i.y,f=i.width,d=e.points;return Object.assign({},e,{points:[[d[0][0],0],[d[1][0],0],[d[2][0],0],[d[3][0],0],[s-f/2,c],[s-f/2,c]]})}return Object.assign({},e,{points:e.points.map(function(t){return[o(t,1)[0],0]})})},f=function(t,e){var r=t.u,o=t.v;if(!e.has(r))return null;var i=e.get(r);if(!i.has(o))return null;var n=i.get(o);return n.type===t.type?n:null};e.diff=function(t,e){var r=new Map(e.vertices.map(function(t){return[t.u,new Map]})),o=!0,i=!1,n=void 0;try{for(var a,l=e.edges[Symbol.iterator]();!(o=(a=l.next()).done);o=!0){var u=a.value,d=u.u,y=u.v,p=t.vertices.has(d)?t.vertices.get(d):null,h=t.vertices.has(y)?t.vertices.get(d):null,k=f(u,t.edges);"hierarchy"===u.type&&r.get(d).set(y,c(k,u,p,h)),r.get(d).set(y,s(k,u,p,h))}}catch(t){i=!0,n=t}finally{try{!o&&l.return&&l.return()}finally{if(i)throw n}}return{vertices:new Map(e.vertices.map(function(e){var r=e.u;return t.vertices.has(r)?[r,t.vertices.get(r)]:[r,Object.assign({},e,{y:0})]})),edges:r}},e.makeMap=function(t){var e=new Map(t.vertices.map(function(t){return[t.u,Object.assign({},t)]})),r=new Map(t.vertices.map(function(t){return[t.u,new Map]})),o=!0,i=!1,n=void 0;try{for(var a,l=t.edges[Symbol.iterator]();!(o=(a=l.next()).done);o=!0){var u=a.value,s=u.u,c=u.v;r.get(s).set(c,Object.assign({},u))}}catch(t){i=!0,n=t}finally{try{!o&&l.return&&l.return()}finally{if(i)throw n}}return{vertices:e,edges:r}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){var r=[],o=!0,i=!1,n=void 0;try{for(var a,l=t[Symbol.iterator]();!(o=(a=l.next()).done)&&(r.push(a.value),!e||r.length!==e);o=!0);}catch(t){i=!0,n=t}finally{try{!o&&l.return&&l.return()}finally{if(i)throw n}}return r}return function(e,r){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=function(t,e){t.save(),e(),t.restore()},n=function(t,e){var r=e.fillColor,o=e.strokeColor,i=e.strokeWidth;t.fillStyle=r.toString(),t.strokeStyle=o.toString(),t.lineWidth=i},a=function(t,e){var r=e.strokeColor,o=e.strokeWidth;t.strokeStyle=r.toString(),t.lineWidth=o},l=function(t,e){var r=e.labelFillColor,o=e.labelStrokeColor,i=e.labelStrokeWidth;t.fillStyle=r.toString(),t.strokeStyle=o.toString(),t.lineWidth=i},u=function(t,e){var r=e.u,o=e.x,a=e.y,u=e.width,s=e.height,c=e.label,f=e.strokeWidth;i(t,function(){t.translate(o,a),i(t,function(){n(t,e),t.beginPath(),t.moveTo(-u/2,-s/2),t.lineTo(u/2,-s/2),t.lineTo(u/2,s/2),t.lineTo(-u/2,s/2),t.closePath(),t.fill(),f>0&&t.stroke()}),t.addHitRegion&&t.addHitRegion({id:r}),c&&(l(t,e),t.textAlign="center",e.labelStrokeWidth>0&&t.strokeText(c,0,4),t.fillText(c,0,4))})},s=function(t,e){var r=e.u,o=e.x,a=e.y,u=e.width,s=e.height,c=e.label,f=e.strokeWidth;i(t,function(){t.translate(o,a),i(t,function(){n(t,e),t.beginPath(),t.ellipse(0,0,u/2,s/2,0,0,2*Math.PI),t.closePath(),t.fill(),f>0&&t.stroke()}),t.addHitRegion&&t.addHitRegion({id:r}),c&&(l(t,e),t.textAlign="center",e.labelStrokeWidth>0&&t.strokeText(c,0,4),t.fillText(c,0,4))})},c=(e.renderVertex=function(t,e){switch(e.type){case"circle":s(t,e);break;case"rect":u(t,e)}},function(t,e){var r=e.points,n=e.label,u=e.sourceMarkerShape,s=e.sourceMarkerSize,c=e.targetMarkerShape,f=e.targetMarkerSize;i(t,function(){switch(i(t,function(){a(t,e),t.beginPath(),t.moveTo(r[0][0],r[0][1]);for(var o=1;o<r.length;++o)t.lineTo(r[o][0],r[o][1]);t.stroke()}),u){case"circle":i(t,function(){var i=o(r[0],2),n=i[0],a=i[1],l=s/2;t.fillStyle=e.strokeColor.toString(),t.translate(n,a),t.beginPath(),t.ellipse(0,0,l,l,0,0,2*Math.PI),t.fill()});break;case"triangle":i(t,function(){var i=o(r[0],2),n=i[0],a=i[1],l=o(r[1],2),u=l[0],s=l[1],c=Math.atan2(a-s,n-u),d=2*f/3;t.fillStyle=e.strokeColor.toString(),t.beginPath(),t.moveTo(n+Math.cos(c)*d,a+Math.sin(c)*d),t.lineTo(n+Math.cos(c+2*Math.PI/3)*d,a+Math.sin(c+2*Math.PI/3)*d),t.lineTo(n+Math.cos(c+4*Math.PI/3)*d,a+Math.sin(c+4*Math.PI/3)*d),t.closePath(),t.fill()})}switch(c){case"circle":i(t,function(){var i=o(r[r.length-1],2),n=i[0],a=i[1],l=f/2;t.fillStyle=e.strokeColor.toString(),t.translate(n,a),t.beginPath(),t.ellipse(0,0,l,l,0,0,2*Math.PI),t.fill()});break;case"triangle":i(t,function(){var i=o(r[r.length-1],2),n=i[0],a=i[1],l=o(r[r.length-2],2),u=l[0],s=l[1],c=Math.atan2(a-s,n-u),d=2*f/3;t.fillStyle=e.strokeColor.toString(),t.beginPath(),t.moveTo(n+Math.cos(c)*d,a+Math.sin(c)*d),t.lineTo(n+Math.cos(c+2*Math.PI/3)*d,a+Math.sin(c+2*Math.PI/3)*d),t.lineTo(n+Math.cos(c+4*Math.PI/3)*d,a+Math.sin(c+4*Math.PI/3)*d),t.closePath(),t.fill()})}if(n){var d=(r[0][0]+r[r.length-1][0])/2,y=(r[0][1]+r[r.length-1][1])/2;t.translate(d,y),l(t,e),t.textAlign="center",e.labelStrokeWidth>0&&t.strokeText(n,0,4),t.fillText(n,0,4)}})}),f=function(t,e,r,o,i){var n=o-e,a=i-r;t.quadraticCurveTo(e+n/4,r,e+n/2,r+a/2),t.quadraticCurveTo(e+3*n/4,i,o,i)},d=function(t,e){var r=e.points;i(t,function(){a(t,e),t.beginPath(),t.moveTo(r[0][0],r[0][1]),t.lineTo(r[1][0],r[1][1]),f(t,r[1][0],r[1][1],r[2][0],r[2][1]),t.lineTo(r[3][0],r[3][1]),f(t,r[3][0],r[3][1],r[4][0],r[4][1]),t.lineTo(r[5][0],r[5][1]),t.stroke()})},y=function(t,e){var r=e.points,o=r[1][0]-r[0][0],n=r[1][1]-r[0][1],l=Math.sqrt(o*o+n+n)/2,u=(r[0][0]+r[1][0])/2,s=(r[0][1]+r[1][1])/2,c=Math.atan(n/o);i(t,function(){a(t,e),t.beginPath(),t.arc(u,s,l,c,c+Math.PI),t.stroke()})};e.renderEdge=function(t,e){switch(e.type){case"arc":y(t,e);break;case"hierarchy":d(t,e);break;case"line":c(t,e)}}},function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.zoom=void 0;var o=r(0),i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}(o),n=r(1),a=function(t,e){var r=new window.CustomEvent("nodemovestart",{detail:{id:e}});t.dispatchEvent(r)},l=function(t,e){var r=e.u,o=e.x,i=e.y,n=new window.CustomEvent("nodemove",{detail:{id:r,x:o,y:i}});t.dispatchEvent(n)},u=function(t,e){var r=new window.CustomEvent("nodemoveend",{detail:{id:e}});t.dispatchEvent(r)};e.zoom=function(t,e){var r={region:null,x0:0,y0:0},o=!1,s=i.zoom();return s.on("start",function(){if(!t.canZoom||t.canDragNode&&i.event.sourceEvent&&i.event.sourceEvent.region){var e=i.event.sourceEvent?i.event.sourceEvent.region:null,o=i.event.transform,n=o.x,l=o.y,u=o.k;r.region=e,r.x0=n/u,r.y0=l/u,e&&a(t,e)}}).on("zoom",function(){var o=i.event.transform,a=o.x,u=o.y,s=o.k;if(t.canDragNode&&r.region){var c=r.region,f=a/s-r.x0,d=u/s-r.y0,y=e.data,p=y.vertices[y.indices.get(c)];p.x+=f,p.y+=d,e.layoutResult.vertices.get(c).x+=f,e.layoutResult.vertices.get(c).y+=d;var h=!0,k=!1,b=void 0;try{for(var g,v=p.outEdges[Symbol.iterator]();!(h=(g=v.next()).done);h=!0){var S=g.value,m=S.points;m[0][0]+=f,m[0][1]+=d,(0,n.adjustEdge)(S,p,y.vertices[y.indices.get(S.v)])}}catch(t){k=!0,b=t}finally{try{!h&&v.return&&v.return()}finally{if(k)throw b}}var w=!0,M=!1,P=void 0;try{for(var A,L=p.inEdges[Symbol.iterator]();!(w=(A=L.next()).done);w=!0){var x=A.value,m=x.points;m[m.length-1][0]+=f,m[m.length-1][1]+=d,(0,n.adjustEdge)(x,y.vertices[y.indices.get(x.u)],p)}}catch(t){M=!0,P=t}finally{try{!w&&L.return&&L.return()}finally{if(M)throw P}}r.x0=a/s,r.y0=u/s,l(t,p)}else!t.canZoom&&i.event.sourceEvent||Object.assign(e.transform,{x:a,y:u,k:s})}).on("end",function(){if(!o&&(!t.canZoom||r.region)){var n=r.region;r.region=null,o=!0,i.select(this).call(s.transform,i.zoomIdentity.translate(e.transform.x,e.transform.y).scale(e.transform.k)),o=!1,n&&u(t,n)}}),s}},function(t,e,r){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function n(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var a=function(){function t(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,r,o){return r&&t(e.prototype,r),o&&t(e,o),e}}(),l=r(0),u=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e.default=t,e}(l),s=r(2),c=r(3),f=r(4),d=r(5),y=r(1),p=function(){return window.devicePixelRatio||1},h=function(){var t=arguments.length<=0?void 0:arguments[0],e=arguments.length<=1?void 0:arguments[1],r=e.split("."),o=!0,i=!1,n=void 0;try{for(var a,l=r[Symbol.iterator]();!(o=(a=l.next()).done);o=!0){var u=a.value;if(!t.hasOwnProperty(u)){if(2===arguments.length)throw new Error("Object doesn't have an attribute "+e);return arguments.length<=2?void 0:arguments[2]}t=t[u]}}catch(t){i=!0,n=t}finally{try{!o&&l.return&&l.return()}finally{if(i)throw n}}return t},k=new WeakMap,b=function(t,e){var r=k.get(t);r.canvas.width=e*p(),r.canvas.style.width=e+"px"},g=function(t,e){var r=k.get(t);r.canvas.height=e*p(),r.canvas.style.height=e+"px"},v=function(t,e,r){return t.hasAttribute(e)?t.getAttribute(e):r},S=function(t){function e(){o(this,e);var t=i(this,(e.__proto__||Object.getPrototypeOf(e)).call(this)),r={invalidate:!1,originalData:null,canvas:document.createElement("canvas"),data:{vertices:[],edges:[]},transform:{x:0,y:0,k:1},highlightedVertex:null,layoutResult:{vertices:new Map,edges:new Map},margin:10,layoutTime:0};return r.zoom=(0,d.zoom)(t,r),k.set(t,r),u.select(r.canvas).call(r.zoom),r.canvas.addEventListener("mousemove",function(e){t.canDragNode&&e.region?(r.canvas.style.cursor="pointer",r.highlightedVertex=e.region):t.canZoom?(r.canvas.style.cursor="move",r.highlightedVertex=null):r.canvas.style.cursor="default"}),t}return n(e,t),a(e,null,[{key:"observedAttributes",get:function(){return["src","width","height","graph-nodes-property","graph-links-property","node-id-property","node-x-property","node-y-property","node-width-property","node-height-property","node-type-property","node-fill-color-property","node-fill-opacity-property","node-stroke-color-property","node-stroke-opacity-property","node-stroke-width-property","node-label-property","node-label-fill-color-property","node-label-fill-opacity-property","node-label-stroke-color-property","node-label-stroke-opacity-property","node-label-stroke-width-property","link-source-property","link-target-property","link-stroke-color-property","link-stroke-opacity-property","link-stroke-width-property","link-source-marker-shape-property","link-source-marker-size-property","link-target-marker-shape-property","link-target-marker-size-property","link-label-property","link-label-fill-color-property","link-label-fill-opacity-property","link-label-stroke-color-property","link-label-stroke-opacity-property","link-label-stroke-width-property","default-node-x","default-node-y","default-node-width","default-node-height","default-node-type","default-node-fill-color","default-node-fill-opacity","default-node-stroke-color","default-node-stroke-opacity","default-node-stroke-width","default-node-label","default-node-label-fill-color","default-node-label-fill-opacity","default-node-label-stroke-color","default-node-label-stroke-opacity","default-node-label-stroke-width","default-link-stroke-color","default-link-stroke-opacity","default-link-stroke-width","default-link-source-marker-shape","default-link-source-marker-size","default-link-target-marker-shape","default-link-target-marker-size","default-link-label","default-link-label-fill-color","default-link-label-fill-opacity","default-link-label-stroke-color","default-link-label-stroke-opacity","default-link-label-stroke-width"]}}]),a(e,[{key:"connectedCallback",value:function(){var t=this,e=k.get(this);this.appendChild(e.canvas);!function r(){e.invalidate&&e.originalData&&t.update(!0),e.invalidate=!1;var o=new Date,i=t.transitionDuration,n=o>e.layoutTime?(o-e.layoutTime)/i:1/i,a=(0,c.interpolateLayout)(e.previousLayoutResult,e.data,n),l=e.canvas.getContext("2d");l.save(),l.clearRect(0,0,e.canvas.width,e.canvas.height),l.scale(p(),p()),l.translate(e.margin,e.margin),l.translate(e.transform.x,e.transform.y),l.scale(e.transform.k,e.transform.k);var u=!0,s=!1,d=void 0;try{for(var y,h=a.edges[Symbol.iterator]();!(u=(y=h.next()).done);u=!0){var k=y.value;(0,f.renderEdge)(l,k)}}catch(t){s=!0,d=t}finally{try{!u&&h.return&&h.return()}finally{if(s)throw d}}var b=!0,g=!1,v=void 0;try{for(var S,m=a.vertices[Symbol.iterator]();!(b=(S=m.next()).done);b=!0){var w=S.value;(0,f.renderVertex)(l,w)}}catch(t){g=!0,v=t}finally{try{!b&&m.return&&m.return()}finally{if(g)throw v}}l.restore(),window.requestAnimationFrame(r)}()}},{key:"attributeChangedCallback",value:function(t,e,r){var o=this;switch(t){case"src":window.fetch(r).then(function(t){return t.json()}).then(function(t){o.dispatchEvent(new window.CustomEvent("datafetchend",{detail:t})),o.load(t)});break;case"width":b(this,r);break;case"height":g(this,r);break;default:this.invalidate()}}},{key:"layout",value:function(){var t=k.get(this),e=t.data;this.onLayout(e);var r=!0,o=!1,i=void 0;try{for(var n,a=e.edges[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var l=n.value,u=l.u,s=l.v,f=e.vertices[e.indices.get(u)],d=e.vertices[e.indices.get(s)];(0,y.adjustEdge)(l,f,d)}}catch(t){o=!0,i=t}finally{try{!r&&a.return&&a.return()}finally{if(o)throw i}}return t.previousLayoutResult=(0,c.diff)(t.layoutResult,e),t.layoutResult=(0,c.makeMap)(e),t.layoutTime=new Date,this.autoCentering&&this.center(),this}},{key:"center",value:function(){var t=k.get(this),e=t.canvas,r=t.data,o=t.margin,i=t.zoom,n=(0,s.layoutRect)(r),a=n.layoutWidth,l=n.layoutHeight,c=n.left,f=n.top,d=e.width/p(),y=e.height/p(),h=(0,s.centerTransform)(a,l,c,f,d,y,o),b=h.x,g=h.y,v=h.k;return i.transform(u.select(e),u.zoomIdentity.translate(b,g).scale(v).translate(-c,-f)),this}},{key:"load",value:function(t){return k.get(this).originalData=t,this.update()}},{key:"update",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],r=k.get(this),o=r.originalData,i=h(o,this.graphNodesProperty).filter(function(e){return h(e,t.nodeVisibilityProperty,t.defaultNodeVisibility)}).map(function(o,i){var n=u.color(h(o,t.nodeFillColorProperty,t.defaultNodeFillColor));n.opacity=+h(o,t.nodeFillOpacityProperty,t.defaultNodeFillOpacity);var a=u.color(h(o,t.nodeStrokeColorProperty,t.defaultNodeStrokeColor));a.opacity=+h(o,t.nodeStrokeOpacityProperty,t.defaultNodeStrokeOpacity);var l=u.color(h(o,t.nodeLabelFillColorProperty,t.defaultNodeLabelFillColor));l.opacity=+h(o,t.nodeLabelFillOpacityProperty,t.defaultNodeLabelFillOpacity);var s=u.color(h(o,t.nodeLabelStrokeColorProperty,t.defaultNodeLabelStrokeColor));s.opacity=+h(o,t.nodeLabelStrokeOpacityProperty,t.defaultNodeLabelStrokeOpacity);var c=("$index"===t.nodeIdProperty?i:h(o,t.nodeIdProperty)).toString();return{u:c,x:e&&r.layoutResult.vertices.has(c)?r.layoutResult.vertices.get(c).x:+h(o,t.nodeXProperty,t.defaultNodeX),y:e&&r.layoutResult.vertices.has(c)?r.layoutResult.vertices.get(c).y:+h(o,t.nodeYProperty,t.defaultNodeY),width:+h(o,t.nodeWidthProperty,t.defaultNodeWidth),height:+h(o,t.nodeHeightProperty,t.defaultNodeHeight),type:h(o,t.nodeTypeProperty,t.defaultNodeType),fillColor:n,strokeColor:a,strokeWidth:+h(o,t.nodeStrokeWidthProperty,t.defaultNodeStrokeWidth),label:h(o,t.nodeLabelProperty,t.defaultNodeLabel),labelFillColor:l,labelStrokeColor:s,labelStrokeWidth:+h(o,t.nodeLabelStrokeWidthProperty,t.defaultNodeLabelStrokeWidth),inEdges:[],outEdges:[],d:o}}),n=new Map(i.map(function(t,e){return[t.u,e]})),a=h(o,this.graphLinksProperty).filter(function(e){return h(e,t.linkVisibilityProperty,t.defaultLinkVisibility)}).filter(function(e){var r=h(e,t.linkSourceProperty).toString(),o=h(e,t.linkTargetProperty).toString();return n.has(r)&&n.has(o)}).map(function(o){var a=h(o,t.linkSourceProperty).toString(),l=h(o,t.linkTargetProperty).toString(),s=u.color(h(o,t.linkStrokeColorProperty,t.defaultLinkStrokeColor));s.opacity=+h(o,t.linkStrokeOpacityProperty,t.defaultLinkStrokeOpacity),u.color(h(o,t.linkLabelFillColorProperty,t.defaultLinkLabelFillColor)).opacity=+h(o,t.linkLabelFillOpacityProperty,t.defaultLinkLabelFillOpacity),u.color(h(o,t.linkLabelStrokeColorProperty,t.defaultLinkLabelStrokeColor)).opacity=+h(o,t.linkLabelStrokeOpacityProperty,t.defaultLinkLabelStrokeOpacity);var c=i[n.get(a)],f=i[n.get(l)],d=e&&r.layoutResult.edges.has(a)&&r.layoutResult.edges.get(a).has(l)?r.layoutResult.edges.get(a).get(l).points:[[c.x,c.y],[f.x,f.y]],y={u:a,v:l,points:d,type:"line",strokeColor:s,strokeWidth:+h(o,t.linkStrokeWidthProperty,t.defaultLinkStrokeWidth),sourceMarkerShape:h(o,t.linkSourceMarkerShapeProperty,t.defaultLinkSourceMarkerShape),sourceMarkerSize:+h(o,t.linkSourceMarkerSizeProperty,t.defaultLinkSourceMarkerSize),targetMarkerShape:h(o,t.linkTargetMarkerShapeProperty,t.defaultLinkTargetMarkerShape),targetMarkerSize:+h(o,t.linkTargetMarkerSizeProperty,t.defaultLinkTargetMarkerSize),label:h(o,t.linkLabelProperty,t.defaultLinkLabel),labelFillColor:h(o,t.linkLabelFillColorProperty,t.defaultLinkLabelFillColor),labelStrokeColor:h(o,t.linkLabelStrokeColorProperty,t.defaultLinkLabelStrokeColor),labelStrokeWidth:+h(o,t.linkLabelStrokeWidthProperty,t.defaultLinkLabelStrokeWidth),d:o};return c.outEdges.push(y),f.inEdges.push(y),y});return r.data={vertices:i,edges:a,indices:n},this.autoUpdate&&this.layout(),this}},{key:"onLayout",value:function(){}},{key:"invalidate",value:function(){k.get(this).invalidate=!0}},{key:"autoUpdate",get:function(){return!this.hasAttribute("no-auto-update")},set:function(t){t?this.removeAttribute("no-auto-update"):this.setAttribute("no-auto-update","")}},{key:"autoCentering",get:function(){return!this.hasAttribute("no-auto-centering")},set:function(t){t?this.removeAttribute("no-auto-centering"):this.setAttribute("no-auto-centering","")}},{key:"canZoom",get:function(){return!this.hasAttribute("no-zoom")},set:function(t){t?this.removeAttribute("no-zoom"):this.setAttribute("no-zoom","")}},{key:"canDragNode",get:function(){return!this.hasAttribute("no-drag-node")},set:function(t){t?this.removeAttribute("no-drag-node"):this.setAttribute("no-drag-node","")}},{key:"src",get:function(){return v(this,"src",null)},set:function(t){this.setAttribute("src",t)}},{key:"width",get:function(){return v(this,"width",300)},set:function(t){this.setAttribute("width",t)}},{key:"height",get:function(){return v(this,"height",150)},set:function(t){this.setAttribute("height",t)}},{key:"transitionDuration",get:function(){return v(this,"transition-duration",0)},set:function(t){this.setAttribute("transition-duration",t)}},{key:"graphNodesProperty",get:function(){return v(this,"graph-nodes-property","nodes")},set:function(t){this.setAttribute("graph-nodes-property",t)}},{key:"graphLinksProperty",get:function(){return v(this,"graph-links-property","links")},set:function(t){this.setAttribute("graph-links-property",t)}},{key:"nodeIdProperty",get:function(){return v(this,"node-id-property","$index")},set:function(t){this.setAttribute("node-id-property",t)}},{key:"nodeXProperty",get:function(){return v(this,"node-x-property","x")},set:function(t){this.setAttribute("node-x-property",t)}},{key:"nodeYProperty",get:function(){return v(this,"node-y-property","y")},set:function(t){this.setAttribute("node-y-property",t)}},{key:"nodeWidthProperty",get:function(){return v(this,"node-width-property","width")},set:function(t){this.setAttribute("node-width-property",t)}},{key:"nodeHeightProperty",get:function(){return v(this,"node-height-property","height")},set:function(t){this.setAttribute("node-height-property",t)}},{key:"nodeFillColorProperty",get:function(){return v(this,"node-fill-color-property","fillColor")},set:function(t){this.setAttribute("node-fill-color-property",t)}},{key:"nodeFillOpacityProperty",get:function(){return v(this,"node-fill-opacity-property","fillOpacity")},set:function(t){this.setAttribute("node-fill-opacity-property",t)}},{key:"nodeStrokeColorProperty",get:function(){return v(this,"node-stroke-color-property","strokeColor")},set:function(t){this.setAttribute("node-stroke-color-property",t)}},{key:"nodeStrokeOpacityProperty",get:function(){return v(this,"node-stroke-opacity-property","strokeOpacity")},set:function(t){this.setAttribute("node-stroke-opacity-property",t)}},{key:"nodeStrokeWidthProperty",get:function(){return v(this,"node-stroke-width-property","strokeWidth")},set:function(t){this.setAttribute("node-stroke-width-property",t)}},{key:"nodeTypeProperty",get:function(){return v(this,"node-type-property","type")},set:function(t){this.setAttribute("node-type-property",t)}},{key:"nodeVisibilityProperty",get:function(){return v(this,"node-visibility-property","visibility")},set:function(t){this.setAttribute("node-visibility-property",t)}},{key:"nodeLabelProperty",get:function(){return v(this,"node-label-property","label")},set:function(t){this.setAttribute("node-label-property",t)}},{key:"nodeLabelFillColorProperty",get:function(){return v(this,"node-label-fill-color-property","labelFillColor")},set:function(t){this.setAttribute("node-label-fill-color-property",t)}},{key:"nodeLabelFillOpacityProperty",get:function(){return v(this,"node-label-fill-opacity-property","labelFillOpacity")},set:function(t){this.setAttribute("node-label-fill-opacity-property",t)}},{key:"nodeLabelStrokeColorProperty",get:function(){return v(this,"node-label-stroke-color-property","labelStrokeColor")},set:function(t){this.setAttribute("node-label-stroke-color-property",t)}},{key:"nodeLabelStrokeOpacityProperty",get:function(){return v(this,"node-label-stroke-opacity-property","labelStrokeOpacity")},set:function(t){this.setAttribute("node-label-stroke-opacity-property",t)}},{key:"nodeLabelStrokeWidthProperty",get:function(){return v(this,"node-label-stroke-width-property","labelStrokeWidth")},set:function(t){this.setAttribute("node-label-stroke-width-property",t)}},{key:"linkSourceProperty",get:function(){return v(this,"link-source-property","source")},set:function(t){this.setAttribute("link-source-property",t)}},{key:"linkTargetProperty",get:function(){return v(this,"link-target-property","target")},set:function(t){this.setAttribute("link-target-property",t)}},{key:"linkStrokeColorProperty",get:function(){return v(this,"link-stroke-color-property","strokeColor")},set:function(t){this.setAttribute("link-stroke-color-property",t)}},{key:"linkStrokeOpacityProperty",get:function(){return v(this,"link-stroke-opacity-property","strokeOpacity")},set:function(t){this.setAttribute("link-stroke-opacity-property",t)}},{key:"linkStrokeWidthProperty",get:function(){return v(this,"link-stroke-width-property","strokeWidth")},set:function(t){this.setAttribute("link-stroke-width-property",t)}},{key:"linkVisibilityProperty",get:function(){return v(this,"link-visibility-property","visibility")},set:function(t){this.setAttribute("link-visibility-property",t)}},{key:"linkSourceMarkerShapeProperty",get:function(){return v(this,"link-source-marker-shape-property","sourceMarkerShape")},set:function(t){this.setAttribute("link-source-marker-shape-property",t)}},{key:"linkSourceMarkerSizeProperty",get:function(){return v(this,"link-source-marker-size-property","sourceMarkerSize")},set:function(t){this.setAttribute("link-source-marker-size-property",t)}},{key:"linkTargetMarkerShapeProperty",get:function(){return v(this,"link-target-marker-shape-property","targetMarkerShape")},set:function(t){this.setAttribute("link-target-marker-shape-property",t)}},{key:"linkTargetMarkerSizeProperty",get:function(){return v(this,"link-target-marker-size-property","targetMarkerSize")},set:function(t){this.setAttribute("link-target-marker-size-property",t)}},{key:"linkLabelProperty",get:function(){return v(this,"link-label-property","label")},set:function(t){this.setAttribute("link-label-property",t)}},{key:"linkLabelFillColorProperty",get:function(){return v(this,"link-label-fill-color-property","labelFillColor")},set:function(t){this.setAttribute("link-label-fill-color-property",t)}},{key:"linkLabelFillOpacityProperty",get:function(){return v(this,"link-label-fill-opacity-property","labelFillOpacity")},set:function(t){this.setAttribute("link-label-fill-opacity-property",t)}},{key:"linkLabelStrokeColorProperty",get:function(){return v(this,"link-label-stroke-color-property","labelStrokeColor")},set:function(t){this.setAttribute("link-label-stroke-color-property",t)}},{key:"linkLabelStrokeOpacityProperty",get:function(){return v(this,"link-label-stroke-opacity-property","labelStrokeOpacity")},set:function(t){this.setAttribute("link-label-stroke-opacity-property",t)}},{key:"linkLabelStrokeWidthProperty",get:function(){return v(this,"link-label-stroke-width-property","labelStrokeWidth")},set:function(t){this.setAttribute("link-label-stroke-width-property",t)}},{key:"defaultNodeX",get:function(){return v(this,"default-node-x",0)},set:function(t){this.setAttribute("default-node-x",t)}},{key:"defaultNodeY",get:function(){return v(this,"default-node-y",0)},set:function(t){this.setAttribute("default-node-y",t)}},{key:"defaultNodeWidth",get:function(){return v(this,"default-node-width",10)},set:function(t){this.setAttribute("default-node-width",t)}},{key:"defaultNodeHeight",get:function(){return v(this,"default-node-height",10)},set:function(t){this.setAttribute("default-node-height",t)}},{key:"defaultNodeFillColor",get:function(){return v(this,"default-node-fill-color","#fff")},set:function(t){this.setAttribute("default-node-fill-color",t)}},{key:"defaultNodeFillOpacity",get:function(){return v(this,"default-node-fill-opacity",1)},set:function(t){this.setAttribute("default-node-fill-opacity",t)}},{key:"defaultNodeStrokeColor",get:function(){return v(this,"default-node-stroke-color","#000")},set:function(t){this.setAttribute("default-node-stroke-color",t)}},{key:"defaultNodeStrokeOpacity",get:function(){return v(this,"default-node-stroke-opacity",1)},set:function(t){this.setAttribute("default-node-stroke-opacity",t)}},{key:"defaultNodeStrokeWidth",get:function(){return v(this,"default-node-stroke-width",1)},set:function(t){this.setAttribute("default-node-stroke-width",t)}},{key:"defaultNodeType",get:function(){return v(this,"default-node-type","circle")},set:function(t){this.setAttribute("default-node-type",t)}},{key:"defaultNodeVisibility",get:function(){return v(this,"default-node-visibility",!0)},set:function(t){this.setAttribute("default-node-visibility",t)}},{key:"defaultNodeLabel",get:function(){return v(this,"default-node-label","")},set:function(t){this.setAttribute("default-node-label",t)}},{key:"defaultNodeLabelFillColor",get:function(){return v(this,"default-node-label-fill-color","#000")},set:function(t){this.setAttribute("default-node-label-fill-color",t)}},{key:"defaultNodeLabelFillOpacity",get:function(){return v(this,"default-node-label-fill-opacity",1)},set:function(t){this.setAttribute("default-node-label-fill-opacity",t)}},{key:"defaultNodeLabelStrokeColor",get:function(){return v(this,"default-node-label-stroke-color","#fff")},set:function(t){this.setAttribute("default-node-label-stroke-color",t)}},{key:"defaultNodeLabelStrokeOpacity",get:function(){return v(this,"default-node-label-stroke-opacity",1)},set:function(t){this.setAttribute("default-node-label-stroke-opacity",t)}},{key:"defaultNodeLabelStrokeWidth",get:function(){return v(this,"default-node-label-stroke-width",0)},set:function(t){this.setAttribute("default-node-label-stroke-width",t)}},{key:"defaultLinkStrokeColor",get:function(){return v(this,"default-link-stroke-color","#000")},set:function(t){this.setAttribute("default-link-stroke-color",t)}},{key:"defaultLinkStrokeOpacity",get:function(){return v(this,"default-link-stroke-opacity",1)},set:function(t){this.setAttribute("default-link-stroke-opacity",t)}},{key:"defaultLinkStrokeWidth",get:function(){return v(this,"default-link-stroke-width",1)},set:function(t){this.setAttribute("default-link-stroke-width",t)}},{key:"defaultLinkVisibility",get:function(){return v(this,"default-link-visibility",!0)},set:function(t){this.setAttribute("default-link-visibility",t)}},{key:"defaultLinkSourceMarkerShape",get:function(){return v(this,"default-link-source-marker-shape","none")},set:function(t){this.setAttribute("default-link-source-marker-shape",t)}},{key:"defaultLinkSourceMarkerSize",get:function(){return v(this,"default-link-source-marker-size",5)},set:function(t){this.setAttribute("default-link-source-marker-size",t)}},{key:"defaultLinkTargetMarkerShape",get:function(){return v(this,"default-link-target-marker-shape","none")},set:function(t){this.setAttribute("default-link-target-marker-shape",t)}},{key:"defaultLinkTargetMarkerSize",get:function(){return v(this,"default-link-target-marker-size",5)},set:function(t){this.setAttribute("default-link-target-marker-size",t)}},{key:"defaultLinkLabel",get:function(){return v(this,"default-link-label","")},set:function(t){this.setAttribute("default-link-label",t)}},{key:"defaultLinkLabelFillColor",get:function(){return v(this,"default-link-label-fill-color","#000")},set:function(t){this.setAttribute("default-link-label-fill-color",t)}},{key:"defaultLinkLabelFillOpacity",get:function(){return v(this,"default-link-label-fill-opacity",1)},set:function(t){this.setAttribute("default-link-label-fill-opacity",t)}},{key:"defaultLinkLabelStrokeColor",get:function(){return v(this,"default-link-label-stroke-color","#fff")},set:function(t){this.setAttribute("default-link-label-stroke-color",t)}},{key:"defaultLinkLabelStrokeOpacity",get:function(){return v(this,"default-link-label-stroke-opacity",1)},set:function(t){this.setAttribute("default-link-label-stroke-opacity",t)}},{key:"defaultLinkLabelStrokeWidth",get:function(){return v(this,"default-link-label-stroke-width",0)},set:function(t){this.setAttribute("default-link-label-stroke-width",t)}},{key:"data",get:function(){return k.get(this).originalData}}]),e}(window.HTMLElement);window.customElements.define("eg-renderer",S)}]);