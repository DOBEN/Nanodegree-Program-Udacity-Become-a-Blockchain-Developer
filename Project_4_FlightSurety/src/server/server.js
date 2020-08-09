import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
import 'babel-polyfill';

let config = Config['localhost'];
let web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];
let flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
let flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

web3.eth.getAccounts(async (error, accts) => {

  let owner = accts[0];

  const TEST_ORACLES_COUNT = 40;

  let fee = await flightSuretyApp.methods.REGISTRATION_FEE().call();

  flightSuretyData.methods.authorizeCaller(config.appAddress).send({ from: owner });

  for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
    await flightSuretyApp.methods.registerOracle().send({ from: accts[a], value: fee, gas: 1250000 });
    let result = await flightSuretyApp.methods.getMyIndexes().call({ from: accts[a], gas: 1000000 });
    console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
  }
})

flightSuretyApp.events.OracleRequest({ fromBlock: 0 }, async function (error, event) {
  if (error) console.log(error)

  var index = event.returnValues[0];
  var airline = event.returnValues[1];
  var flight_name = event.returnValues[2];
  var timestamp = event.returnValues[3];

  web3.eth.getAccounts(async (error, accts) => {

    const TEST_ORACLES_COUNT = 40;
    const STATUS_CODE = 20;

    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {

      // Get oracle information
 
      try {
        // Submit a response...it will only be accepted if there is an Index match
        var result = await flightSuretyApp.methods.submitOracleResponse(index, airline, flight_name, timestamp, STATUS_CODE).send({ from: accts[a], gas: 1000000 });

        //   FlightStatusInfo
        truffleAssert.eventEmitted(result, 'FlightStatusInfo', (event) => {
          console.log(`The final statuscode is: ${event[3]}`);
        }, 'The Statuscode was not changed correctly.');

      }
      catch (e) {
        // Enable this when debugging
        // console.log(e.data[])
        // console.log('\nError', oracleIndexes[idx].toNumber(), flight, timestamp);
      }
      // Enable this when debugging
      // var key = await flightSuretyApp.methods.getFlightKey(airline, flight_name, timestamp).call({ gas: 1000000 });
      // var result = await flightSuretyApp.methods.flights(key).call()
      // console.log(result.statusCode)
    }
  })
});

const app = express();
app.get('/api', (req, res) => {
  res.send({
    message: 'An API for use with your Dapp!'
  })
})

export default app;