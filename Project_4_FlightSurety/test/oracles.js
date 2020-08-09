var Test = require('../config/testConfig.js');
const truffleAssert = require('truffle-assertions');

contract('Oracles', async (accounts) => {

  const TEST_ORACLES_COUNT = 40;
  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address, { from: config.owner });

    // Watch contract events
    const STATUS_CODE_UNKNOWN = 0;
    const STATUS_CODE_ON_TIME = 10;
    const STATUS_CODE_LATE_AIRLINE = 20;
    const STATUS_CODE_LATE_WEATHER = 30;
    const STATUS_CODE_LATE_TECHNICAL = 40;
    const STATUS_CODE_LATE_OTHER = 50;
  });

  it('can register oracles', async () => {

    // ARRANGE
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

    // ACT
    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      await config.flightSuretyApp.registerOracle({ from: accounts[a], value: fee });
      let result = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
      console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]}`);
    }
  });

  it('If flight is delayed due to airline fault, passenger receives credit of 1.5X the amount they paid', async () => {
    var STATUS_CODE_TEST = 20;

    // ARRANGE
    let flight_name = 'ND1309'; // Course number
    let timestamp = Math.floor(Date.now() / 1000);
    let person_buying_insurance = accounts[10];

    await config.flightSuretyApp.registerFlight(config.firstAirline, flight_name, timestamp);
    await config.flightSuretyApp.buy(config.firstAirline, flight_name, timestamp, { value: 1000000000000000000, from: person_buying_insurance })

    // Submit a request for oracles to get status information for a flight
    var result = await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight_name, timestamp);

    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      // Get oracle information
      let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
      for (let idx = 0; idx < 3; idx++) {
        try {
          // Submit a response...it will only be accepted if there is an Index match
          var result = await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight_name, timestamp, STATUS_CODE_TEST, { from: accounts[a] });

        }
        catch (e) {
          // Enable this when debugging
          // console.log('\nError', oracleIndexes[idx].toNumber(), flight, timestamp);
        }
      }
    }

    var balance_before = web3.utils.fromWei(await web3.eth.getBalance(person_buying_insurance), 'ether');
    await config.flightSuretyApp.withdraw(person_buying_insurance);
    var balance_after = web3.utils.fromWei(await web3.eth.getBalance(person_buying_insurance), 'ether');
    var end = balance_after - balance_before;

    assert.equal(end, 1.5, "Couldn't withdraw the correct amount of money.")
  });



  it('check events during while requesting flight status, submitting oracle responses, and withdrawing insurance refund', async () => {
    var STATUS_CODE_TEST = 20;

    // ARRANGE
    let flight_name = 'My_Flight2'; // Course number
    let timestamp = Math.floor(Date.now() / 1000);
    let person_buying_insurance = accounts[10];

    await config.flightSuretyApp.registerFlight(config.firstAirline, flight_name, timestamp);
    await config.flightSuretyApp.buy(config.firstAirline, flight_name, timestamp, { value: 1000000000000000000, from: person_buying_insurance })

    // Submit a request for oracles to get status information for a flight
    var result = await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight_name, timestamp);

    // ACT
    truffleAssert.eventEmitted(result, 'OracleRequest');
    truffleAssert.prettyPrintEmittedEvents(result);

    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      // Get oracle information
      let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
      for (let idx = 0; idx < 3; idx++) {
        try {
          // Submit a response...it will only be accepted if there is an Index match
          var result = await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight_name, timestamp, STATUS_CODE_TEST, { from: accounts[a] });

          //   FlightStatusInfo
          truffleAssert.eventEmitted(result, 'FlightStatusInfo', (event) => {
            console.log(`The final statuscode is: ${event[3]}`);
          }, 'The Statuscode was not changed correctly.');
        }
        catch (e) {
          // Enable this when debugging
          // console.log('\nError', oracleIndexes[idx].toNumber(), flight, timestamp);
        }
      }
    }

    var balance_before = web3.utils.fromWei(await web3.eth.getBalance(person_buying_insurance), 'ether');
    await config.flightSuretyApp.withdraw(person_buying_insurance);
    var balance_after = web3.utils.fromWei(await web3.eth.getBalance(person_buying_insurance), 'ether');
    var end = balance_after - balance_before;

    assert.equal(end, 1.5, "Couldn't withdraw the money correctly.")
  });




  it('Passenger can withdraw any funds owed to them as a result of receiving credit for insurance payout', async () => {
    //let the costumer buy 3 insurances and then refund all of them

    var STATUS_CODE_TEST = 20;

    // ARRANGE
    let flight_name1 = 'ND1309';
    let timestamp1 = Math.floor(Date.now() / 1000);
    let flight_name2 = 'ND1309';
    let timestamp2 = Math.floor(Date.now() / 1000);
    let flight_name3 = 'ND1309';
    let timestamp3 = Math.floor(Date.now() / 1000);
    let person_buying_insurance = accounts[10];

    await config.flightSuretyApp.registerFlight(config.firstAirline, flight_name1, timestamp1);
    await config.flightSuretyApp.buy(config.firstAirline, flight_name1, timestamp1, { value: 1000000000000000000, from: person_buying_insurance })
    await config.flightSuretyApp.registerFlight(config.firstAirline, flight_name2, timestamp2);
    await config.flightSuretyApp.buy(config.firstAirline, flight_name2, timestamp2, { value: 1000000000000000000, from: person_buying_insurance })
    await config.flightSuretyApp.registerFlight(config.firstAirline, flight_name3, timestamp3);
    await config.flightSuretyApp.buy(config.firstAirline, flight_name3, timestamp3, { value: 1000000000000000000, from: person_buying_insurance })

    // Submit a request for oracles to get status information for a flight
    await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight_name1, timestamp1);
    await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight_name2, timestamp2);
    await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, flight_name3, timestamp3);

    for (let a = 1; a < TEST_ORACLES_COUNT; a++) {
      // Get oracle information
      let oracleIndexes = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a] });
      for (let idx = 0; idx < 3; idx++) {
        try {
          // Submit a response...it will only be accepted if there is an Index match
          await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight_name1, timestamp1, STATUS_CODE_TEST, { from: accounts[a] });
          await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight_name2, timestamp2, STATUS_CODE_TEST, { from: accounts[a] });
          await config.flightSuretyApp.submitOracleResponse(oracleIndexes[idx], config.firstAirline, flight_name3, timestamp3, STATUS_CODE_TEST, { from: accounts[a] });

        }
        catch (e) {
          // Enable this when debugging
          // console.log('\nError', oracleIndexes[idx].toNumber(), flight, timestamp);
        }
      }
    }

    var balance_before = web3.utils.fromWei(await web3.eth.getBalance(person_buying_insurance), 'ether');
    await config.flightSuretyApp.withdraw(person_buying_insurance);
    var balance_after = web3.utils.fromWei(await web3.eth.getBalance(person_buying_insurance), 'ether');
    var end = balance_after - balance_before;

    assert.equal(end, 4.5, "Couldn't withdraw the correct amount of money.")
  });
});
