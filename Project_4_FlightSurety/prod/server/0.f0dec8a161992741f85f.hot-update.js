exports.id=0,exports.modules={"./src/server/server.js":function(e,s,r){"use strict";r.r(s);var t=r("./build/contracts/FlightSuretyApp.json"),o=r("./src/server/config.json"),n=r("web3"),a=r.n(n),c=r("express"),l=r.n(c),u=o.localhost,i=new a.a(new a.a.providers.WebsocketProvider(u.url.replace("http","ws")));i.eth.defaultAccount=i.eth.accounts[0];var d=new i.eth.Contract(t.abi,u.appAddress);console.log(flightSuretyData.methods),flightSuretyData.methods.authorizeCaller(u.appAddress).send({from:self.owner}),d.events.OracleRequest({fromBlock:0},(function(e,s){e&&console.log(e),console.log(s)}));var p=l()();p.get("/api",(function(e,s){s.send({message:"An API for use with your Dapp!"})})),s.default=p}};