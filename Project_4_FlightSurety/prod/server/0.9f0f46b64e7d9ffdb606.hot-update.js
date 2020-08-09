exports.id=0,exports.modules={"./src/server/server.js":function(e,r,t){"use strict";t.r(r);var n=t("./build/contracts/FlightSuretyApp.json"),o=t("./build/contracts/FlightSuretyData.json"),s=t("./src/server/config.json"),a=t("web3"),c=t.n(a),u=t("express"),i=t.n(u);t("babel-polyfill");function l(e,r,t,n,o,s,a){try{var c=e[s](a),u=c.value}catch(e){return void t(e)}c.done?r(u):Promise.resolve(u).then(n,o)}function f(e){return function(){var r=this,t=arguments;return new Promise((function(n,o){var s=e.apply(r,t);function a(e){l(s,n,o,a,c,"next",e)}function c(e){l(s,n,o,a,c,"throw",e)}a(void 0)}))}}var p=s.localhost,d=new c.a(new c.a.providers.WebsocketProvider(p.url.replace("http","ws")));d.eth.defaultAccount=d.eth.accounts[0];var g=new d.eth.Contract(n.abi,p.appAddress),h=new d.eth.Contract(o.abi,p.dataAddress);d.eth.getAccounts(function(){var e=f(regeneratorRuntime.mark((function e(r,t){var n,o,s,a,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t[0],o=20,e.next=4,g.methods.REGISTRATION_FEE().call();case 4:s=e.sent,h.methods.authorizeCaller(p.appAddress).send({from:n}),a=1;case 7:if(!(a<o)){e.next=17;break}return e.next=10,g.methods.registerOracle().send({from:t[a],value:s,gas:1e6});case 10:return e.next=12,g.methods.getMyIndexes().call({from:t[a],gas:1e6});case 12:c=e.sent,console.log("Oracle Registered: ".concat(c[0],", ").concat(c[1],", ").concat(c[2]));case 14:a++,e.next=7;break;case 17:case"end":return e.stop()}}),e)})));return function(r,t){return e.apply(this,arguments)}}()),g.events.OracleRequest({fromBlock:0},function(){var e=f(regeneratorRuntime.mark((function e(r,t){var n,o,s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r&&console.log(r),n=t.returnValues[0],o=t.returnValues[1],s=t.returnValues[2],a=t.returnValues[3],console.log(n),console.log(o),console.log(s),console.log(a),d.eth.getAccounts(function(){var e=f(regeneratorRuntime.mark((function e(r,t){var n,o,s;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=20,20,o=1;case 3:if(!(o<n)){e.next=11;break}return e.next=6,g.methods.getMyIndexes().call({from:t[o],gas:1e6});case 6:for(e.sent,s=0;s<3;s++)console.log(key);case 8:o++,e.next=3;break;case 11:case"end":return e.stop()}}),e)})));return function(r,t){return e.apply(this,arguments)}}());case 10:case"end":return e.stop()}}),e)})));return function(r,t){return e.apply(this,arguments)}}());var v=i()();v.get("/api",(function(e,r){r.send({message:"An API for use with your Dapp!"})})),r.default=v}};