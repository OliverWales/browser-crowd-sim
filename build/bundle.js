var CrowdSimulator;CrowdSimulator=(()=>{"use strict";var t={438:(t,i,o)=>{o.r(i),o.d(i,{init:()=>f,playPause:()=>x,reconfigure:()=>v,step:()=>m});var e=function(){function t(t){this._renderer=t,this._agents=[]}return t.prototype.init=function(t){this._agents=t.agents},t.prototype.update=function(t){var i=this;this._agents.forEach((function(o){o.update(t,i._agents)}))},t.prototype.draw=function(){var t=this;this._renderer.clear(),this._agents.forEach((function(i){t._renderer.drawAgent(i)}))},t}(),n=function(){function t(t){this._context=t.getContext("2d")}return t.prototype.clear=function(){this._context.fillStyle="white",this._context.fillRect(0,0,this._context.canvas.width,this._context.canvas.height)},t.prototype.drawAgent=function(t){var i=t.getPosition(),o=t.getDirection();if(this._context.beginPath(),this._context.arc(i.x,i.y,t.Radius,0,2*Math.PI),0!==o.dx||0!==o.dy){var e=Math.sqrt(Math.pow(o.dx,2)+Math.pow(o.dy,2));this._context.moveTo(i.x,i.y),this._context.lineTo(i.x+t.Radius*o.dx/e,i.y+t.Radius*o.dy/e)}this._context.stroke()},t}(),r=function(){function t(t,i,o,e){this.Id=t,this._position=i,this._goalPosition=o,this.Radius=e,this._direction={dx:0,dy:0},this._goalReached=!1}return t.prototype.getPosition=function(){return this._position},t.prototype.getDirection=function(){return this._direction},t.prototype.getGoalReached=function(){return this._goalReached},t.prototype.update=function(t,i){if(!this._goalReached){var o={x:this._goalPosition.x-this._position.x,y:this._goalPosition.y-this._position.y},e=Math.sqrt(Math.pow(o.x,2)+Math.pow(o.y,2));e>60*t/1e3?(this._direction.dx=o.x/e,this._direction.dy=o.y/e,this._position.x+=60*t/1e3*this._direction.dx,this._position.y+=60*t/1e3*this._direction.dy):(this._position.x=this._goalPosition.x,this._position.y=this._goalPosition.y,this._goalReached=!0)}},t}(),a=function(){function t(t,i,o,e){this.Id=t,this._position=i,this._goalPosition=o,this.Radius=e,this._direction={dx:0,dy:0},this._goalReached=!1}return t.prototype.getPosition=function(){return this._position},t.prototype.getDirection=function(){return this._direction},t.prototype.getGoalReached=function(){return this._goalReached},t.prototype.update=function(t,i){var o=this;if(!this._goalReached){var e={x:this._goalPosition.x-this._position.x,y:this._goalPosition.y-this._position.y},n=Math.sqrt(Math.pow(e.x,2)+Math.pow(e.y,2));if(n>60*t/1e3){this._direction.dx=e.x/n,this._direction.dy=e.y/n;var r=this._position.x+20*this._direction.dx,a=this._position.y+20*this._direction.dy,s=!1;i.forEach((function(t){t.Id!=o.Id&&o.collides(t,{x:r,y:a})&&(s=!0)})),s||(this._position.x+=60*t/1e3*this._direction.dx,this._position.y+=60*t/1e3*this._direction.dy)}else this._position.x=this._goalPosition.x,this._position.y=this._goalPosition.y,this._goalReached=!0}},t.prototype.collides=function(t,i){var o=i.x,e=i.y,n=this.Radius,r=t.getPosition().x,a=t.getPosition().y,s=t.Radius;return Math.sqrt(Math.pow(o-r,2)+Math.pow(e-a,2))<n+s},t}(),s=function(){function t(){}return t.RandomToRandom=function(t,i,o,e){for(var n=[],r=0;r<t;r++){var a=e(r,{x:i*Math.random(),y:o*Math.random()},{x:i*Math.random(),y:o*Math.random()},20);n.push(a)}return{agents:n}},t.RandomToLine=function(t,i,o,e){for(var n=[],r=0;r<t;r++){var a=e(r,{x:i*Math.random(),y:o*Math.random()},{x:(r+1)/(t+1)*i,y:o/2},20);n.push(a)}return{agents:n}},t.CircleToCircle=function(t,i,o,e){for(var n=[],r=i/2,a=o/2,s=o/2-25,h=0;h<t;h++){var d=2*Math.PI*h/t,c=e(h,{x:r+s*Math.cos(d),y:a+s*Math.sin(d)},{x:r+s*Math.cos(d+Math.PI),y:a+s*Math.sin(d+Math.PI)},20);n.push(c)}return{agents:n}},t}(),h=document.getElementById("config"),d=document.getElementById("agentType"),c=document.getElementById("numberOfAgents"),u=document.getElementById("canvas"),p=document.getElementById("framerate"),y=document.getElementById("playButton"),l=document.getElementById("stepButton"),_=new e(new n(u)),g=!1;function f(){this.reconfigure();var t=0,i=0,o=0;window.requestAnimationFrame((function e(n){var r=n-t;t=n,g&&_.update(r),_.draw(),o++,n-i>=250&&(p.textContent="FPS: "+(1e3*o/(n-i)).toFixed(1),o=0,i=n),window.requestAnimationFrame(e)}))}function x(){(g=!g)?(y.textContent="Pause",l.disabled=!0):(y.textContent="Play",l.disabled=!1)}function m(){_.update(1e3/60)}function v(){var t;g&&this.playPause();var i,o=h.value,e=d.value,n=null!==(t=parseInt(c.value))&&void 0!==t?t:0;switch(e){case"BasicAgent":i=function(t,i,o,e){return new r(t,i,o,e)};break;case"StopAgent":i=function(t,i,o,e){return new a(t,i,o,e)};break;default:throw new Error("Agent not implemented")}switch(o){case"RandomToRandom":_.init(s.RandomToRandom(n,u.width,u.height,i));break;case"RandomToLine":_.init(s.RandomToLine(n,u.width,u.height,i));break;case"CircleToCircle":_.init(s.CircleToCircle(n,u.width,u.height,i));break;default:throw new Error("Configuration not implemented")}}}},i={};function o(e){if(i[e])return i[e].exports;var n=i[e]={exports:{}};return t[e](n,n.exports,o),n.exports}return o.d=(t,i)=>{for(var e in i)o.o(i,e)&&!o.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:i[e]})},o.o=(t,i)=>Object.prototype.hasOwnProperty.call(t,i),o.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o(438)})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Dcm93ZFNpbXVsYXRvci8uL3NyYy9TaW11bGF0aW9uLnRzIiwid2VicGFjazovL0Nyb3dkU2ltdWxhdG9yLy4vc3JjL1JlbmRlcmVyMkQudHMiLCJ3ZWJwYWNrOi8vQ3Jvd2RTaW11bGF0b3IvLi9zcmMvQmFzaWNBZ2VudC50cyIsIndlYnBhY2s6Ly9Dcm93ZFNpbXVsYXRvci8uL3NyYy9TdG9wQWdlbnQudHMiLCJ3ZWJwYWNrOi8vQ3Jvd2RTaW11bGF0b3IvLi9zcmMvQ29uZmlndXJhdGlvbnMudHMiLCJ3ZWJwYWNrOi8vQ3Jvd2RTaW11bGF0b3IvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9Dcm93ZFNpbXVsYXRvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9Dcm93ZFNpbXVsYXRvci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vQ3Jvd2RTaW11bGF0b3Ivd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL0Nyb3dkU2ltdWxhdG9yL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQ3Jvd2RTaW11bGF0b3Ivd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCJdLCJuYW1lcyI6WyJyZW5kZXJlciIsInRoaXMiLCJfcmVuZGVyZXIiLCJfYWdlbnRzIiwiaW5pdCIsImNvbmZpZyIsImFnZW50cyIsInVwZGF0ZSIsImRlbHRhVCIsImZvckVhY2giLCJhZ2VudCIsImRyYXciLCJjbGVhciIsImRyYXdBZ2VudCIsImNhbnZhcyIsIl9jb250ZXh0IiwiZ2V0Q29udGV4dCIsImZpbGxTdHlsZSIsImZpbGxSZWN0Iiwid2lkdGgiLCJoZWlnaHQiLCJwb3NpdGlvbiIsImdldFBvc2l0aW9uIiwiZGlyZWN0aW9uIiwiZ2V0RGlyZWN0aW9uIiwiYmVnaW5QYXRoIiwiYXJjIiwieCIsInkiLCJSYWRpdXMiLCJNYXRoIiwiUEkiLCJkeCIsImR5IiwibWFnbml0dWRlIiwic3FydCIsIm1vdmVUbyIsImxpbmVUbyIsInN0cm9rZSIsImlkIiwic3RhcnRQb3NpdGlvbiIsImdvYWxQb3NpdGlvbiIsInJhZGl1cyIsIklkIiwiX3Bvc2l0aW9uIiwiX2dvYWxQb3NpdGlvbiIsIl9kaXJlY3Rpb24iLCJfZ29hbFJlYWNoZWQiLCJnZXRHb2FsUmVhY2hlZCIsImdvYWxEaXJlY3Rpb24iLCJnb2FsRGlzdGFuY2UiLCJjb2xsaWRlcyIsImExeCIsImExeSIsImExciIsImEyeCIsImEyeSIsImEyciIsIlJhbmRvbVRvUmFuZG9tIiwibiIsImFnZW50Q29uc3RydWN0b3IiLCJpIiwicmFuZG9tIiwicHVzaCIsIlJhbmRvbVRvTGluZSIsIkNpcmNsZVRvQ2lyY2xlIiwiY2VudHJlWCIsImNlbnRyZVkiLCJhbmdsZSIsImNvcyIsInNpbiIsImNvbmZpZ1NlbGVjdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJhZ2VudFR5cGVTZWxlY3QiLCJudW1iZXJPZkFnZW50c0lucHV0IiwiZnJhbWVyYXRlIiwicGxheUJ1dHRvbiIsInN0ZXBCdXR0b24iLCJzaW11bGF0aW9uIiwiU2ltdWxhdGlvbiIsIlJlbmRlcmVyMkQiLCJwbGF5IiwicmVjb25maWd1cmUiLCJsYXN0UmVuZGVyIiwibGFzdEZQUyIsImZyYW1lcyIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImxvb3AiLCJ0aW1lc3RhbXAiLCJ0ZXh0Q29udGVudCIsInRvRml4ZWQiLCJwbGF5UGF1c2UiLCJkaXNhYmxlZCIsInN0ZXAiLCJ2YWx1ZSIsImFnZW50VHlwZSIsInBhcnNlSW50IiwiQmFzaWNBZ2VudCIsIlN0b3BBZ2VudCIsIkVycm9yIiwiQ29uZmlndXJhdGlvbnMiLCJfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18iLCJfX3dlYnBhY2tfcmVxdWlyZV9fIiwibW9kdWxlSWQiLCJleHBvcnRzIiwibW9kdWxlIiwiX193ZWJwYWNrX21vZHVsZXNfXyIsImQiLCJkZWZpbml0aW9uIiwia2V5IiwibyIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZW51bWVyYWJsZSIsImdldCIsIm9iaiIsInByb3AiLCJwcm90b3R5cGUiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJyIiwiU3ltYm9sIiwidG9TdHJpbmdUYWciXSwibWFwcGluZ3MiOiJrSkFJQSxpQkFJRSxXQUFZQSxHQUNWQyxLQUFLQyxVQUFZRixFQUNqQkMsS0FBS0UsUUFBVSxHQW1CbkIsT0FoQkUsWUFBQUMsS0FBQSxTQUFLQyxHQUNISixLQUFLRSxRQUFVRSxFQUFPQyxRQUd4QixZQUFBQyxPQUFBLFNBQU9DLEdBQVAsV0FDRVAsS0FBS0UsUUFBUU0sU0FBUSxTQUFDQyxHQUNwQkEsRUFBTUgsT0FBT0MsRUFBUSxFQUFLTCxhQUk5QixZQUFBUSxLQUFBLHNCQUNFVixLQUFLQyxVQUFVVSxRQUNmWCxLQUFLRSxRQUFRTSxTQUFRLFNBQUNDLEdBQ3BCLEVBQUtSLFVBQVVXLFVBQVVILE9BRy9CLEVBekJBLEdDREEsYUFHRSxXQUFZSSxHQUNWYixLQUFLYyxTQUFXRCxFQUFPRSxXQUFXLE1BbUN0QyxPQWhDRSxZQUFBSixNQUFBLFdBQ0VYLEtBQUtjLFNBQVNFLFVBQVksUUFDMUJoQixLQUFLYyxTQUFTRyxTQUNaLEVBQ0EsRUFDQWpCLEtBQUtjLFNBQVNELE9BQU9LLE1BQ3JCbEIsS0FBS2MsU0FBU0QsT0FBT00sU0FJekIsWUFBQVAsVUFBQSxTQUFVSCxHQUNSLElBQUlXLEVBQVdYLEVBQU1ZLGNBQ2pCQyxFQUFZYixFQUFNYyxlQVF0QixHQU5BdkIsS0FBS2MsU0FBU1UsWUFHZHhCLEtBQUtjLFNBQVNXLElBQUlMLEVBQVNNLEVBQUdOLEVBQVNPLEVBQUdsQixFQUFNbUIsT0FBUSxFQUFHLEVBQUlDLEtBQUtDLElBRy9DLElBQWpCUixFQUFVUyxJQUE2QixJQUFqQlQsRUFBVVUsR0FBVSxDQUM1QyxJQUFJQyxFQUFZSixLQUFLSyxLQUFLLFNBQUFaLEVBQVVTLEdBQU0sR0FBSSxTQUFBVCxFQUFVVSxHQUFN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dW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQ29uZmlndXJhdGlvbiB9IGZyb20gXCIuL0NvbmZpZ3VyYXRpb25zXCI7XHJcbmltcG9ydCB7IElBZ2VudCB9IGZyb20gXCIuL0lBZ2VudFwiO1xyXG5pbXBvcnQgeyBJUmVuZGVyZXIgfSBmcm9tIFwiLi9JUmVuZGVyZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTaW11bGF0aW9uIHtcclxuICBfcmVuZGVyZXI6IElSZW5kZXJlcjtcclxuICBfYWdlbnRzOiBJQWdlbnRbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocmVuZGVyZXI6IElSZW5kZXJlcikge1xyXG4gICAgdGhpcy5fcmVuZGVyZXIgPSByZW5kZXJlcjtcclxuICAgIHRoaXMuX2FnZW50cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgaW5pdChjb25maWc6IElDb25maWd1cmF0aW9uKSB7XHJcbiAgICB0aGlzLl9hZ2VudHMgPSBjb25maWcuYWdlbnRzO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGRlbHRhVDogbnVtYmVyKSB7XHJcbiAgICB0aGlzLl9hZ2VudHMuZm9yRWFjaCgoYWdlbnQpID0+IHtcclxuICAgICAgYWdlbnQudXBkYXRlKGRlbHRhVCwgdGhpcy5fYWdlbnRzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZHJhdygpIHtcclxuICAgIHRoaXMuX3JlbmRlcmVyLmNsZWFyKCk7XHJcbiAgICB0aGlzLl9hZ2VudHMuZm9yRWFjaCgoYWdlbnQpID0+IHtcclxuICAgICAgdGhpcy5fcmVuZGVyZXIuZHJhd0FnZW50KGFnZW50KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJQWdlbnQgfSBmcm9tIFwiLi9JQWdlbnRcIjtcclxuaW1wb3J0IHsgSVJlbmRlcmVyIH0gZnJvbSBcIi4vSVJlbmRlcmVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyZXIyRCBpbXBsZW1lbnRzIElSZW5kZXJlciB7XHJcbiAgX2NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbiAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgdGhpcy5fY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgfVxyXG5cclxuICBjbGVhcigpOiB2b2lkIHtcclxuICAgIHRoaXMuX2NvbnRleHQuZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xyXG4gICAgdGhpcy5fY29udGV4dC5maWxsUmVjdChcclxuICAgICAgMCxcclxuICAgICAgMCxcclxuICAgICAgdGhpcy5fY29udGV4dC5jYW52YXMud2lkdGgsXHJcbiAgICAgIHRoaXMuX2NvbnRleHQuY2FudmFzLmhlaWdodFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGRyYXdBZ2VudChhZ2VudDogSUFnZW50KSB7XHJcbiAgICBsZXQgcG9zaXRpb24gPSBhZ2VudC5nZXRQb3NpdGlvbigpO1xyXG4gICAgbGV0IGRpcmVjdGlvbiA9IGFnZW50LmdldERpcmVjdGlvbigpO1xyXG5cclxuICAgIHRoaXMuX2NvbnRleHQuYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgLy8gZHJhdyBhZ2VudFxyXG4gICAgdGhpcy5fY29udGV4dC5hcmMocG9zaXRpb24ueCwgcG9zaXRpb24ueSwgYWdlbnQuUmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XHJcblxyXG4gICAgLy8gZHJhdyBkaXJlY3Rpb25cclxuICAgIGlmIChkaXJlY3Rpb24uZHggIT09IDAgfHwgZGlyZWN0aW9uLmR5ICE9PSAwKSB7XHJcbiAgICAgIGxldCBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoZGlyZWN0aW9uLmR4ICoqIDIgKyBkaXJlY3Rpb24uZHkgKiogMik7XHJcblxyXG4gICAgICB0aGlzLl9jb250ZXh0Lm1vdmVUbyhwb3NpdGlvbi54LCBwb3NpdGlvbi55KTtcclxuICAgICAgdGhpcy5fY29udGV4dC5saW5lVG8oXHJcbiAgICAgICAgcG9zaXRpb24ueCArIChhZ2VudC5SYWRpdXMgKiBkaXJlY3Rpb24uZHgpIC8gbWFnbml0dWRlLFxyXG4gICAgICAgIHBvc2l0aW9uLnkgKyAoYWdlbnQuUmFkaXVzICogZGlyZWN0aW9uLmR5KSAvIG1hZ25pdHVkZVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2NvbnRleHQuc3Ryb2tlKCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IElBZ2VudCB9IGZyb20gXCIuL0lBZ2VudFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2ljQWdlbnQgaW1wbGVtZW50cyBJQWdlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBJZDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBSYWRpdXM6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSBfcG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuICBwcml2YXRlIF9nb2FsUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuICBwcml2YXRlIF9kaXJlY3Rpb246IHsgZHg6IG51bWJlcjsgZHk6IG51bWJlciB9O1xyXG4gIHByaXZhdGUgX2dvYWxSZWFjaGVkOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGlkOiBudW1iZXIsXHJcbiAgICBzdGFydFBvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sXHJcbiAgICBnb2FsUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSxcclxuICAgIHJhZGl1czogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLklkID0gaWQ7XHJcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHN0YXJ0UG9zaXRpb247XHJcbiAgICB0aGlzLl9nb2FsUG9zaXRpb24gPSBnb2FsUG9zaXRpb247XHJcbiAgICB0aGlzLlJhZGl1cyA9IHJhZGl1cztcclxuXHJcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSB7IGR4OiAwLCBkeTogMCB9O1xyXG4gICAgdGhpcy5fZ29hbFJlYWNoZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldFBvc2l0aW9uKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcbiAgfVxyXG5cclxuICBnZXREaXJlY3Rpb24oKTogeyBkeDogbnVtYmVyOyBkeTogbnVtYmVyIH0ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIGdldEdvYWxSZWFjaGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2dvYWxSZWFjaGVkO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGRlbHRhVDogbnVtYmVyLCBhZ2VudHM6IElBZ2VudFtdKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fZ29hbFJlYWNoZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBnb2FsRGlyZWN0aW9uID0ge1xyXG4gICAgICB4OiB0aGlzLl9nb2FsUG9zaXRpb24ueCAtIHRoaXMuX3Bvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRoaXMuX2dvYWxQb3NpdGlvbi55IC0gdGhpcy5fcG9zaXRpb24ueSxcclxuICAgIH07XHJcbiAgICBsZXQgZ29hbERpc3RhbmNlID0gTWF0aC5zcXJ0KGdvYWxEaXJlY3Rpb24ueCAqKiAyICsgZ29hbERpcmVjdGlvbi55ICoqIDIpO1xyXG5cclxuICAgIGlmIChnb2FsRGlzdGFuY2UgPiAoZGVsdGFUICogNjApIC8gMTAwMCkge1xyXG4gICAgICB0aGlzLl9kaXJlY3Rpb24uZHggPSBnb2FsRGlyZWN0aW9uLnggLyBnb2FsRGlzdGFuY2U7XHJcbiAgICAgIHRoaXMuX2RpcmVjdGlvbi5keSA9IGdvYWxEaXJlY3Rpb24ueSAvIGdvYWxEaXN0YW5jZTtcclxuICAgICAgdGhpcy5fcG9zaXRpb24ueCArPSAoKGRlbHRhVCAqIDYwKSAvIDEwMDApICogdGhpcy5fZGlyZWN0aW9uLmR4O1xyXG4gICAgICB0aGlzLl9wb3NpdGlvbi55ICs9ICgoZGVsdGFUICogNjApIC8gMTAwMCkgKiB0aGlzLl9kaXJlY3Rpb24uZHk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9wb3NpdGlvbi54ID0gdGhpcy5fZ29hbFBvc2l0aW9uLng7XHJcbiAgICAgIHRoaXMuX3Bvc2l0aW9uLnkgPSB0aGlzLl9nb2FsUG9zaXRpb24ueTtcclxuICAgICAgdGhpcy5fZ29hbFJlYWNoZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJQWdlbnQgfSBmcm9tIFwiLi9JQWdlbnRcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTdG9wQWdlbnQgaW1wbGVtZW50cyBJQWdlbnQge1xyXG4gIHB1YmxpYyByZWFkb25seSBJZDogbnVtYmVyO1xyXG4gIHB1YmxpYyByZWFkb25seSBSYWRpdXM6IG51bWJlcjtcclxuXHJcbiAgcHJpdmF0ZSBfcG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuICBwcml2YXRlIF9nb2FsUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfTtcclxuICBwcml2YXRlIF9kaXJlY3Rpb246IHsgZHg6IG51bWJlcjsgZHk6IG51bWJlciB9O1xyXG4gIHByaXZhdGUgX2dvYWxSZWFjaGVkOiBib29sZWFuO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIGlkOiBudW1iZXIsXHJcbiAgICBzdGFydFBvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sXHJcbiAgICBnb2FsUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSxcclxuICAgIHJhZGl1czogbnVtYmVyXHJcbiAgKSB7XHJcbiAgICB0aGlzLklkID0gaWQ7XHJcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHN0YXJ0UG9zaXRpb247XHJcbiAgICB0aGlzLl9nb2FsUG9zaXRpb24gPSBnb2FsUG9zaXRpb247XHJcbiAgICB0aGlzLlJhZGl1cyA9IHJhZGl1cztcclxuXHJcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSB7IGR4OiAwLCBkeTogMCB9O1xyXG4gICAgdGhpcy5fZ29hbFJlYWNoZWQgPSBmYWxzZTtcclxuICB9XHJcblxyXG4gIGdldFBvc2l0aW9uKCk6IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSB7XHJcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcbiAgfVxyXG5cclxuICBnZXREaXJlY3Rpb24oKTogeyBkeDogbnVtYmVyOyBkeTogbnVtYmVyIH0ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcclxuICB9XHJcblxyXG4gIGdldEdvYWxSZWFjaGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2dvYWxSZWFjaGVkO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGRlbHRhVDogbnVtYmVyLCBhZ2VudHM6IElBZ2VudFtdKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fZ29hbFJlYWNoZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBnb2FsRGlyZWN0aW9uID0ge1xyXG4gICAgICB4OiB0aGlzLl9nb2FsUG9zaXRpb24ueCAtIHRoaXMuX3Bvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRoaXMuX2dvYWxQb3NpdGlvbi55IC0gdGhpcy5fcG9zaXRpb24ueSxcclxuICAgIH07XHJcbiAgICBsZXQgZ29hbERpc3RhbmNlID0gTWF0aC5zcXJ0KGdvYWxEaXJlY3Rpb24ueCAqKiAyICsgZ29hbERpcmVjdGlvbi55ICoqIDIpO1xyXG5cclxuICAgIGlmIChnb2FsRGlzdGFuY2UgPiAoZGVsdGFUICogNjApIC8gMTAwMCkge1xyXG4gICAgICB0aGlzLl9kaXJlY3Rpb24uZHggPSBnb2FsRGlyZWN0aW9uLnggLyBnb2FsRGlzdGFuY2U7XHJcbiAgICAgIHRoaXMuX2RpcmVjdGlvbi5keSA9IGdvYWxEaXJlY3Rpb24ueSAvIGdvYWxEaXN0YW5jZTtcclxuICAgICAgbGV0IGhlYWRpbmdYID0gdGhpcy5fcG9zaXRpb24ueCArIDIwICogdGhpcy5fZGlyZWN0aW9uLmR4O1xyXG4gICAgICBsZXQgaGVhZGluZ1kgPSB0aGlzLl9wb3NpdGlvbi55ICsgMjAgKiB0aGlzLl9kaXJlY3Rpb24uZHk7XHJcblxyXG4gICAgICBsZXQgY29sbGlkZXMgPSBmYWxzZTtcclxuICAgICAgYWdlbnRzLmZvckVhY2goKGFnZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKFxyXG4gICAgICAgICAgYWdlbnQuSWQgIT0gdGhpcy5JZCAmJlxyXG4gICAgICAgICAgdGhpcy5jb2xsaWRlcyhhZ2VudCwgeyB4OiBoZWFkaW5nWCwgeTogaGVhZGluZ1kgfSlcclxuICAgICAgICApIHtcclxuICAgICAgICAgIGNvbGxpZGVzID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKCFjb2xsaWRlcykge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uLnggKz0gKChkZWx0YVQgKiA2MCkgLyAxMDAwKSAqIHRoaXMuX2RpcmVjdGlvbi5keDtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbi55ICs9ICgoZGVsdGFUICogNjApIC8gMTAwMCkgKiB0aGlzLl9kaXJlY3Rpb24uZHk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3Bvc2l0aW9uLnggPSB0aGlzLl9nb2FsUG9zaXRpb24ueDtcclxuICAgICAgdGhpcy5fcG9zaXRpb24ueSA9IHRoaXMuX2dvYWxQb3NpdGlvbi55O1xyXG4gICAgICB0aGlzLl9nb2FsUmVhY2hlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb2xsaWRlcyhhZ2VudDogSUFnZW50LCBwb3NpdGlvbjogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KTogYm9vbGVhbiB7XHJcbiAgICBsZXQgYTF4ID0gcG9zaXRpb24ueDtcclxuICAgIGxldCBhMXkgPSBwb3NpdGlvbi55O1xyXG4gICAgbGV0IGExciA9IHRoaXMuUmFkaXVzO1xyXG4gICAgbGV0IGEyeCA9IGFnZW50LmdldFBvc2l0aW9uKCkueDtcclxuICAgIGxldCBhMnkgPSBhZ2VudC5nZXRQb3NpdGlvbigpLnk7XHJcbiAgICBsZXQgYTJyID0gYWdlbnQuUmFkaXVzO1xyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoKGExeCAtIGEyeCkgKiogMiArIChhMXkgLSBhMnkpICoqIDIpIDwgYTFyICsgYTJyO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJQWdlbnQgfSBmcm9tIFwiLi9JQWdlbnRcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNvbmZpZ3VyYXRpb24ge1xyXG4gIGFnZW50czogSUFnZW50W107XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDb25maWd1cmF0aW9ucyB7XHJcbiAgc3RhdGljIFJhbmRvbVRvUmFuZG9tKFxyXG4gICAgbjogbnVtYmVyLFxyXG4gICAgd2lkdGg6IG51bWJlcixcclxuICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgYWdlbnRDb25zdHJ1Y3RvcjogKFxyXG4gICAgICBpZDogbnVtYmVyLFxyXG4gICAgICBzdGFydFBvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sXHJcbiAgICAgIGdvYWxQb3NpdGlvbjogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9LFxyXG4gICAgICByYWRpdXM6IG51bWJlclxyXG4gICAgKSA9PiBJQWdlbnRcclxuICApIHtcclxuICAgIC8vIFJhbmRvbSBzdGFydCBwb3NpdGlvbiB0byByYW5kb20gZ29hbCBwb3NpdGlvblxyXG4gICAgbGV0IGFnZW50czogSUFnZW50W10gPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGFnZW50ID0gYWdlbnRDb25zdHJ1Y3RvcihcclxuICAgICAgICBpLFxyXG4gICAgICAgIHsgeDogd2lkdGggKiBNYXRoLnJhbmRvbSgpLCB5OiBoZWlnaHQgKiBNYXRoLnJhbmRvbSgpIH0sXHJcbiAgICAgICAgeyB4OiB3aWR0aCAqIE1hdGgucmFuZG9tKCksIHk6IGhlaWdodCAqIE1hdGgucmFuZG9tKCkgfSxcclxuICAgICAgICAyMFxyXG4gICAgICApO1xyXG4gICAgICBhZ2VudHMucHVzaChhZ2VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgYWdlbnRzOiBhZ2VudHMgfSBhcyBJQ29uZmlndXJhdGlvbjtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBSYW5kb21Ub0xpbmUoXHJcbiAgICBuOiBudW1iZXIsXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICBhZ2VudENvbnN0cnVjdG9yOiAoXHJcbiAgICAgIGlkOiBudW1iZXIsXHJcbiAgICAgIHN0YXJ0UG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSxcclxuICAgICAgZ29hbFBvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sXHJcbiAgICAgIHJhZGl1czogbnVtYmVyXHJcbiAgICApID0+IElBZ2VudFxyXG4gICkge1xyXG4gICAgLy8gUmFuZG9tIHN0YXJ0IHBvc2l0aW9uIHRvIGZpeGVkIHBvc2l0aW9uIG9uIGxpbmVcclxuICAgIGxldCBhZ2VudHM6IElBZ2VudFtdID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICBjb25zdCBhZ2VudCA9IGFnZW50Q29uc3RydWN0b3IoXHJcbiAgICAgICAgaSxcclxuICAgICAgICB7IHg6IHdpZHRoICogTWF0aC5yYW5kb20oKSwgeTogaGVpZ2h0ICogTWF0aC5yYW5kb20oKSB9LFxyXG4gICAgICAgIHsgeDogKChpICsgMSkgLyAobiArIDEpKSAqIHdpZHRoLCB5OiBoZWlnaHQgLyAyIH0sXHJcbiAgICAgICAgMjBcclxuICAgICAgKTtcclxuICAgICAgYWdlbnRzLnB1c2goYWdlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IGFnZW50czogYWdlbnRzIH0gYXMgSUNvbmZpZ3VyYXRpb247XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgQ2lyY2xlVG9DaXJjbGUoXHJcbiAgICBuOiBudW1iZXIsXHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICBhZ2VudENvbnN0cnVjdG9yOiAoXHJcbiAgICAgIGlkOiBudW1iZXIsXHJcbiAgICAgIHN0YXJ0UG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSxcclxuICAgICAgZ29hbFBvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sXHJcbiAgICAgIHJhZGl1czogbnVtYmVyXHJcbiAgICApID0+IElBZ2VudFxyXG4gICkge1xyXG4gICAgLy8gUG9zaXRpb24gb24gcmFkaXVzIG9mIGNpcmNsZSB0byBvcHBvc2l0ZSBwb2ludFxyXG4gICAgbGV0IGFnZW50czogSUFnZW50W10gPSBbXTtcclxuICAgIGNvbnN0IGNlbnRyZVggPSB3aWR0aCAvIDI7XHJcbiAgICBjb25zdCBjZW50cmVZID0gaGVpZ2h0IC8gMjtcclxuICAgIGNvbnN0IHJhZGl1cyA9IGhlaWdodCAvIDIgLSAyNTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkrKykge1xyXG4gICAgICBjb25zdCBhbmdsZSA9ICgyICogTWF0aC5QSSAqIGkpIC8gbjtcclxuICAgICAgY29uc3QgYWdlbnQgPSBhZ2VudENvbnN0cnVjdG9yKFxyXG4gICAgICAgIGksXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgeDogY2VudHJlWCArIHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSxcclxuICAgICAgICAgIHk6IGNlbnRyZVkgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSksXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICB4OiBjZW50cmVYICsgcmFkaXVzICogTWF0aC5jb3MoYW5nbGUgKyBNYXRoLlBJKSxcclxuICAgICAgICAgIHk6IGNlbnRyZVkgKyByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSArIE1hdGguUEkpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgMjBcclxuICAgICAgKTtcclxuICAgICAgYWdlbnRzLnB1c2goYWdlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IGFnZW50czogYWdlbnRzIH0gYXMgSUNvbmZpZ3VyYXRpb247XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFNpbXVsYXRpb24gfSBmcm9tIFwiLi9TaW11bGF0aW9uXCI7XHJcbmltcG9ydCB7IFJlbmRlcmVyMkQgfSBmcm9tIFwiLi9SZW5kZXJlcjJEXCI7XHJcblxyXG5pbXBvcnQgeyBCYXNpY0FnZW50IH0gZnJvbSBcIi4vQmFzaWNBZ2VudFwiO1xyXG5pbXBvcnQgeyBTdG9wQWdlbnQgfSBmcm9tIFwiLi9TdG9wQWdlbnRcIjtcclxuaW1wb3J0IHsgQ29uZmlndXJhdGlvbnMgfSBmcm9tIFwiLi9Db25maWd1cmF0aW9uc1wiO1xyXG5cclxuY29uc3QgY29uZmlnU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb25maWdcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbmNvbnN0IGFnZW50VHlwZVNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gIFwiYWdlbnRUeXBlXCJcclxuKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuY29uc3QgbnVtYmVyT2ZBZ2VudHNJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gIFwibnVtYmVyT2ZBZ2VudHNcIlxyXG4pIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG5jb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuY29uc3QgZnJhbWVyYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcmFtZXJhdGVcIikgYXMgSFRNTFBhcmFncmFwaEVsZW1lbnQ7XHJcbmNvbnN0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlCdXR0b25cIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbmNvbnN0IHN0ZXBCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0ZXBCdXR0b25cIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG5jb25zdCByZW5kZXJlciA9IG5ldyBSZW5kZXJlcjJEKGNhbnZhcyk7XHJcbmNvbnN0IHNpbXVsYXRpb24gPSBuZXcgU2ltdWxhdGlvbihyZW5kZXJlcik7XHJcbnZhciBwbGF5ID0gZmFsc2U7XHJcblxyXG4vLyBpbml0aWFsaXNlIHNpbXVsYXRpb24gYW5kIGJlZ2luIHVwZGF0ZS9yZW5kZXIgbG9vcFxyXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcclxuICB0aGlzLnJlY29uZmlndXJlKCk7XHJcblxyXG4gIGxldCBsYXN0UmVuZGVyID0gMDtcclxuICBsZXQgbGFzdEZQUyA9IDA7XHJcbiAgbGV0IGZyYW1lcyA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGxvb3AodGltZXN0YW1wOiBudW1iZXIpIHtcclxuICAgIGxldCBkZWx0YVQgPSB0aW1lc3RhbXAgLSBsYXN0UmVuZGVyO1xyXG4gICAgbGFzdFJlbmRlciA9IHRpbWVzdGFtcDtcclxuXHJcbiAgICAvLyB1cGRhdGVcclxuICAgIGlmIChwbGF5KSB7XHJcbiAgICAgIHNpbXVsYXRpb24udXBkYXRlKGRlbHRhVCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVuZGVyXHJcbiAgICBzaW11bGF0aW9uLmRyYXcoKTtcclxuICAgIGZyYW1lcysrO1xyXG5cclxuICAgIC8vIHJlY2FsY3VsYXRlIGZyYW1lcmF0ZSBldmVyeSAyNTBtc1xyXG4gICAgaWYgKHRpbWVzdGFtcCAtIGxhc3RGUFMgPj0gMjUwKSB7XHJcbiAgICAgIGZyYW1lcmF0ZS50ZXh0Q29udGVudCA9IGBGUFM6ICR7KFxyXG4gICAgICAgICgxMDAwICogZnJhbWVzKSAvXHJcbiAgICAgICAgKHRpbWVzdGFtcCAtIGxhc3RGUFMpXHJcbiAgICAgICkudG9GaXhlZCgxKX1gO1xyXG5cclxuICAgICAgZnJhbWVzID0gMDtcclxuICAgICAgbGFzdEZQUyA9IHRpbWVzdGFtcDtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xyXG4gIH1cclxuXHJcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcclxufVxyXG5cclxuLy8gdG9nZ2xlIHBsYXkvcGF1c2VcclxuZXhwb3J0IGZ1bmN0aW9uIHBsYXlQYXVzZSgpIHtcclxuICBwbGF5ID0gIXBsYXk7XHJcblxyXG4gIGlmIChwbGF5KSB7XHJcbiAgICBwbGF5QnV0dG9uLnRleHRDb250ZW50ID0gXCJQYXVzZVwiO1xyXG4gICAgc3RlcEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHBsYXlCdXR0b24udGV4dENvbnRlbnQgPSBcIlBsYXlcIjtcclxuICAgIHN0ZXBCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbi8vIHN0ZXAgc2ltdWxhdGlvbiBieSAxIGZyYW1lXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGVwKCkge1xyXG4gIHNpbXVsYXRpb24udXBkYXRlKDEwMDAgLyA2MCk7IC8vIEFzc3VtZXMgNjBGUFNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlY29uZmlndXJlKCkge1xyXG4gIGlmIChwbGF5KSB7XHJcbiAgICB0aGlzLnBsYXlQYXVzZSgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgY29uZmlnID0gY29uZmlnU2VsZWN0LnZhbHVlO1xyXG4gIGNvbnN0IGFnZW50VHlwZSA9IGFnZW50VHlwZVNlbGVjdC52YWx1ZTsgLy8gVE9ETzogd2lyZSB0aGlzIGluXHJcbiAgY29uc3QgbiA9IHBhcnNlSW50KG51bWJlck9mQWdlbnRzSW5wdXQudmFsdWUpID8/IDA7XHJcblxyXG4gIC8vIFNlbGVjdCBhZ2VudCBjb25zdHJ1Y3RvclxyXG4gIGxldCBhZ2VudENvbnN0cnVjdG9yO1xyXG4gIHN3aXRjaCAoYWdlbnRUeXBlKSB7XHJcbiAgICBjYXNlIFwiQmFzaWNBZ2VudFwiOlxyXG4gICAgICBhZ2VudENvbnN0cnVjdG9yID0gKFxyXG4gICAgICAgIGlkOiBudW1iZXIsXHJcbiAgICAgICAgcG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSxcclxuICAgICAgICBnb2FsUG9zaXRpb246IHsgeDogbnVtYmVyOyB5OiBudW1iZXIgfSxcclxuICAgICAgICByYWRpdXM6IG51bWJlclxyXG4gICAgICApID0+IG5ldyBCYXNpY0FnZW50KGlkLCBwb3NpdGlvbiwgZ29hbFBvc2l0aW9uLCByYWRpdXMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgXCJTdG9wQWdlbnRcIjpcclxuICAgICAgYWdlbnRDb25zdHJ1Y3RvciA9IChcclxuICAgICAgICBpZDogbnVtYmVyLFxyXG4gICAgICAgIHBvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sXHJcbiAgICAgICAgZ29hbFBvc2l0aW9uOiB7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0sXHJcbiAgICAgICAgcmFkaXVzOiBudW1iZXJcclxuICAgICAgKSA9PiBuZXcgU3RvcEFnZW50KGlkLCBwb3NpdGlvbiwgZ29hbFBvc2l0aW9uLCByYWRpdXMpO1xyXG4gICAgICBicmVhaztcclxuICAgIGRlZmF1bHQ6IHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWdlbnQgbm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2VsZWN0IGNvbmZpZ3VyYXRpb25cclxuICBzd2l0Y2ggKGNvbmZpZykge1xyXG4gICAgY2FzZSBcIlJhbmRvbVRvUmFuZG9tXCI6IHtcclxuICAgICAgc2ltdWxhdGlvbi5pbml0KFxyXG4gICAgICAgIENvbmZpZ3VyYXRpb25zLlJhbmRvbVRvUmFuZG9tKFxyXG4gICAgICAgICAgbixcclxuICAgICAgICAgIGNhbnZhcy53aWR0aCxcclxuICAgICAgICAgIGNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICBhZ2VudENvbnN0cnVjdG9yXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGNhc2UgXCJSYW5kb21Ub0xpbmVcIjoge1xyXG4gICAgICBzaW11bGF0aW9uLmluaXQoXHJcbiAgICAgICAgQ29uZmlndXJhdGlvbnMuUmFuZG9tVG9MaW5lKFxyXG4gICAgICAgICAgbixcclxuICAgICAgICAgIGNhbnZhcy53aWR0aCxcclxuICAgICAgICAgIGNhbnZhcy5oZWlnaHQsXHJcbiAgICAgICAgICBhZ2VudENvbnN0cnVjdG9yXHJcbiAgICAgICAgKVxyXG4gICAgICApO1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGNhc2UgXCJDaXJjbGVUb0NpcmNsZVwiOiB7XHJcbiAgICAgIHNpbXVsYXRpb24uaW5pdChcclxuICAgICAgICBDb25maWd1cmF0aW9ucy5DaXJjbGVUb0NpcmNsZShcclxuICAgICAgICAgIG4sXHJcbiAgICAgICAgICBjYW52YXMud2lkdGgsXHJcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0LFxyXG4gICAgICAgICAgYWdlbnRDb25zdHJ1Y3RvclxyXG4gICAgICAgIClcclxuICAgICAgKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBkZWZhdWx0OiB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbmZpZ3VyYXRpb24gbm90IGltcGxlbWVudGVkXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIG1vZHVsZSBleHBvcnRzIG11c3QgYmUgcmV0dXJuZWQgZnJvbSBydW50aW1lIHNvIGVudHJ5IGlubGluaW5nIGlzIGRpc2FibGVkXG4vLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbnJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDQzOCk7XG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyJdLCJzb3VyY2VSb290IjoiIn0=