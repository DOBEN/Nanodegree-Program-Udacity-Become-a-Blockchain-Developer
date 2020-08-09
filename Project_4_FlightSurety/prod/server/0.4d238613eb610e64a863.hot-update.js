exports.id=0,exports.modules={"./src/server/server.js":function(e,r,t){"use strict";t.r(r);var n=t("./build/contracts/FlightSuretyApp.json"),o=t("./build/contracts/FlightSuretyData.json"),s=t("./src/server/config.json"),a=t("web3"),c=t.n(a),u=t("express"),i=t.n(u);t("babel-polyfill");function l(e,r,t,n,o,s,a){try{var c=e[s](a),u=c.value}catch(e){return void t(e)}c.done?r(u):Promise.resolve(u).then(n,o)}var d=s.localhost,p=new c.a(new c.a.providers.WebsocketProvider(d.url.replace("http","ws")));p.eth.defaultAccount=p.eth.accounts[0];var f=new p.eth.Contract(n.abi,d.appAddress),v=new p.eth.Contract(o.abi,d.dataAddress);p.eth.getAccounts(function(){var e,r=(e=regeneratorRuntime.mark((function e(r,t){var n,o,s,a;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t[0],console.log(n),o=20,e.next=5,f.methods.REGISTRATION_FEE().call();case 5:s=e.sent,v.methods.authorizeCaller(d.appAddress).send({from:n}),console.log(s),a=1;case 9:if(!(a<o)){e.next=15;break}return e.next=12,f.methods.registerOracle().send({from:t[a],value:s,gas:1e7});case 12:a++,e.next=9;break;case 15:case"end":return e.stop()}}),e)})),function(){var r=this,t=arguments;return new Promise((function(n,o){var s=e.apply(r,t);function a(e){l(s,n,o,a,c,"next",e)}function c(e){l(s,n,o,a,c,"throw",e)}a(void 0)}))});return function(e,t){return r.apply(this,arguments)}}()),f.events.OracleRequest({fromBlock:0},(function(e,r){e&&console.log(e)}));var h=i()();h.get("/api",(function(e,r){r.send({message:"An API for use with your Dapp!"})})),r.default=h}};