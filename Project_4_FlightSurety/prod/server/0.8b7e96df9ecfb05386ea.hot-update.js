exports.id=0,exports.modules={"./src/server/server.js":function(e,s,r){"use strict";r.r(s);var o=r("./build/contracts/FlightSuretyApp.json"),t=r("./src/server/config.json"),n=r("web3"),a=r.n(n),c=r("express"),l=r.n(c),u=t.localhost,p=new a.a(new a.a.providers.WebsocketProvider(u.url.replace("http","ws")));p.eth.defaultAccount=p.eth.accounts[0];var d=new p.eth.Contract(o.abi,u.appAddress);d.methods.authorizeCaller(u.appAddress).send({from:self.owner}),d.events.OracleRequest({fromBlock:0},(function(e,s){e&&console.log(e),console.log(s)}));var i=l()();i.get("/api",(function(e,s){s.send({message:"An API for use with your Dapp!"})})),s.default=i}};