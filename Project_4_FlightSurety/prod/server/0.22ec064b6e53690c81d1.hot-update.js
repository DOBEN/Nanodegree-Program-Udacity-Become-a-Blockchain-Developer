exports.id=0,exports.modules={"./src/server/server.js":function(e,r,t){"use strict";t.r(r);var s=t("./build/contracts/FlightSuretyApp.json"),o=t("./build/contracts/FlightSuretyData.json"),a=t("./src/server/config.json"),n=t("web3"),c=t.n(n),d=t("express"),u=t.n(d),i=a.localhost,l=new c.a(new c.a.providers.WebsocketProvider(i.url.replace("http","ws")));l.eth.defaultAccount=l.eth.accounts[0];var p=new l.eth.Contract(s.abi,i.appAddress);new l.eth.Contract(o.abi,i.dataAddress).methods.authorizeCaller(i.appAddress).send({from:i.owner}),p.events.OracleRequest({fromBlock:0},(function(e,r){e&&console.log(e)}));var h=u()();h.get("/api",(function(e,r){r.send({message:"An API for use with your Dapp!"})})),r.default=h}};