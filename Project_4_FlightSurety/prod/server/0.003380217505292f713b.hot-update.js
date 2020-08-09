exports.id=0,exports.modules={"./src/server/server.js":function(e,t,r){"use strict";r.r(t);var n=r("./build/contracts/FlightSuretyApp.json"),s=r("./build/contracts/FlightSuretyData.json"),a=r("./src/server/config.json"),o=r("web3"),c=r.n(o),u=r("express"),i=r.n(u);r("babel-polyfill");function l(e,t,r,n,s,a,o){try{var c=e[a](o),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,s)}function f(e){return function(){var t=this,r=arguments;return new Promise((function(n,s){var a=e.apply(t,r);function o(e){l(a,n,s,o,c,"next",e)}function c(e){l(a,n,s,o,c,"throw",e)}o(void 0)}))}}var p=a.localhost,d=new c.a(new c.a.providers.WebsocketProvider(p.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var h=new d.eth.Contract(n.abi,p.appAddress),g=new d.eth.Contract(s.abi,p.dataAddress);d.eth.getAccounts(function(){var e=f(regeneratorRuntime.mark((function e(t,r){var n,s,a,o,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=r[0],s=20,e.next=4,h.methods.REGISTRATION_FEE().call();case 4:a=e.sent,g.methods.authorizeCaller(p.appAddress).send({from:n}),o=1;case 7:if(!(o<s)){e.next=17;break}return e.next=10,h.methods.registerOracle().send({from:r[o],value:a,gas:125e4});case 10:return e.next=12,h.methods.getMyIndexes().call({from:r[o],gas:1e6});case 12:c=e.sent,console.log("Oracle Registered: ".concat(c[0],", ").concat(c[1],", ").concat(c[2]));case 14:o++,e.next=7;break;case 17:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}()),h.events.OracleRequest({fromBlock:0},function(){var e=f(regeneratorRuntime.mark((function e(t,r){var n,s,a,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t&&console.log(t),n=r.returnValues[0],s=r.returnValues[1],a=r.returnValues[2],o=r.returnValues[3],console.log(n),console.log(s),console.log(a),console.log(o),d.eth.getAccounts(function(){var e=f(regeneratorRuntime.mark((function e(t,r){var c,u,i,l,f;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:c=20,u=20,i=1;case 3:if(!(i<c)){e.next=27;break}return e.next=6,h.methods.getMyIndexes().call({from:r[i],gas:1e6});case 6:e.sent,l=0;case 8:if(!(l<3)){e.next=24;break}return e.prev=9,e.next=12,h.methods.submitOracleResponse(n,s,a,o,u,{from:accounts[i]});case 12:e.sent,e.next=17;break;case 15:e.prev=15,e.t0=e.catch(9);case 17:return e.next=19,h.methods.getFlightKey(s,a,o).call({gas:1e6});case 19:f=e.sent,console.log(f);case 21:l++,e.next=8;break;case 24:i++,e.next=3;break;case 27:case"end":return e.stop()}}),e,null,[[9,15]])})));return function(t,r){return e.apply(this,arguments)}}());case 10:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}());var v=i()();v.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=v}};