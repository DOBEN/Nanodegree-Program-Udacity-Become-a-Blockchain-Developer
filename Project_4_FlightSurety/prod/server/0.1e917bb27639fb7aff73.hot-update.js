exports.id=0,exports.modules={"./src/server/server.js":function(e,r,t){"use strict";t.r(r);var n=t("./build/contracts/FlightSuretyApp.json"),o=t("./build/contracts/FlightSuretyData.json"),s=t("./src/server/config.json"),a=t("web3"),c=t.n(a),i=t("express"),u=t.n(i);t("babel-polyfill");function l(e,r,t,n,o,s,a){try{var c=e[s](a),i=c.value}catch(e){return void t(e)}c.done?r(i):Promise.resolve(i).then(n,o)}var p=s.localhost,f=new c.a(new c.a.providers.WebsocketProvider(p.url.replace("http","ws")));f.eth.defaultAccount=f.eth.accounts[0];var d=new f.eth.Contract(n.abi,p.appAddress),v=new f.eth.Contract(o.abi,p.dataAddress);f.eth.getAccounts(function(){var e,r=(e=regeneratorRuntime.mark((function e(r,t){var n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(n=t[0],v.methods.authorizeCaller(p.appAddress).send({from:n}),o=1;o<20;o++);case 5:case"end":return e.stop()}}),e)})),function(){var r=this,t=arguments;return new Promise((function(n,o){var s=e.apply(r,t);function a(e){l(s,n,o,a,c,"next",e)}function c(e){l(s,n,o,a,c,"throw",e)}a(void 0)}))});return function(e,t){return r.apply(this,arguments)}}()),d.events.OracleRequest({fromBlock:0},(function(e,r){e&&console.log(e)}));var h=u()();h.get("/api",(function(e,r){r.send({message:"An API for use with your Dapp!"})})),r.default=h},"babel-polyfill":function(e,r){e.exports=require("babel-polyfill")}};