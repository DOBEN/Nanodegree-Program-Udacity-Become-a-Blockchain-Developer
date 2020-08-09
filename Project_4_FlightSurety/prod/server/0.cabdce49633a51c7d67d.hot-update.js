exports.id=0,exports.modules={"./src/server/server.js":function(e,t,r){"use strict";r.r(t);var n=r("./build/contracts/FlightSuretyApp.json"),s=r("./build/contracts/FlightSuretyData.json"),o=r("./src/server/config.json"),a=r("web3"),c=r.n(a),u=r("express"),i=r.n(u);r("babel-polyfill");function l(e,t,r,n,s,o,a){try{var c=e[o](a),u=c.value}catch(e){return void r(e)}c.done?t(u):Promise.resolve(u).then(n,s)}var d=o.localhost,f=new c.a(new c.a.providers.WebsocketProvider(d.url.replace("http","ws")));f.eth.defaultAccount=f.eth.accounts[0];var p=new f.eth.Contract(n.abi,d.appAddress),h=new f.eth.Contract(s.abi,d.dataAddress);f.eth.getAccounts(function(){var e,t=(e=regeneratorRuntime.mark((function e(t,r){var n,s,o,a,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=r[0],s=20,e.next=4,p.methods.REGISTRATION_FEE().call();case 4:o=e.sent,h.methods.authorizeCaller(d.appAddress).send({from:n}),a=1;case 7:if(!(a<s)){e.next=17;break}return e.next=10,p.methods.registerOracle().send({from:r[a],value:o,gas:1e6});case 10:return e.next=12,p.methods.getMyIndexes().call({from:r[a]});case 12:c=e.sent,console.log("Oracle Registered: ".concat(c[0],", ").concat(c[1],", ").concat(c[2]));case 14:a++,e.next=7;break;case 17:case"end":return e.stop()}}),e)})),function(){var t=this,r=arguments;return new Promise((function(n,s){var o=e.apply(t,r);function a(e){l(o,n,s,a,c,"next",e)}function c(e){l(o,n,s,a,c,"throw",e)}a(void 0)}))});return function(e,r){return t.apply(this,arguments)}}()),p.events.OracleRequest({fromBlock:0},(function(e,t){e&&console.log(e)}));var v=i()();v.get("/api",(function(e,t){t.send({message:"An API for use with your Dapp!"})})),t.default=v}};