var Test = require('../config/testConfig.js');

contract('Flight Surety Tests', async (accounts) => {

    var config;
    before('setup contract', async () => {
        config = await Test.Config(accounts);
        await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address, { from: config.owner });
    });

    /****************************************************************************************/
    /* Operations and Settings                                                              */
    /****************************************************************************************/

    it(`(multiparty) has correct initial isOperational() value`, async function () {

        // Get operating status
        let status = await config.flightSuretyData.isOperational.call();
        assert.equal(status, true, "Incorrect initial operating status value");

    });

    it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

        // Ensure that access is denied for non-Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
    });

    it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

        // Ensure that access is allowed for Contract Owner account
        let accessDenied = false;
        try {
            await config.flightSuretyData.setOperatingStatus(false);
        }
        catch (e) {
            accessDenied = true;
        }
        assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
    });

    it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

        await config.flightSuretyData.setOperatingStatus(false);

        let reverted = false;
        try {
            await config.flightSuretyData.authorizeCaller(testAddresses[7])
        }
        catch (e) {
            reverted = true;
        }
        assert.equal(reverted, true, "Access not blocked for requireIsOperational");

        // Set it back for other tests to work
        await config.flightSuretyData.setOperatingStatus(true);
    });

    it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {

        // ARRANGE
        let newAirline = accounts[2];

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(newAirline, { from: config.firstAirline });
        }
        catch (e) {
        }
        let result = await config.flightSuretyData.isAirline.call(newAirline);

        // ASSERT
        assert.equal(result, false, "Airline should not be able to register another airline if it hasn't provided funding");
    });


    it('register a new flight', async () => {

        let flight_name = 'My_Flight';
        let timestamp = 1234;
        // ACT
        try {
            await config.flightSuretyApp.registerFlight(config.firstAirline, flight_name, timestamp);
        }
        catch (e) {
            console.log(e)
        }
        let key = await config.flightSuretyApp.getFlightKey.call(config.firstAirline, flight_name, timestamp)
        let result = await config.flightSuretyApp.flights.call(key);

        // ASSERT
        assert.equal(result.isRegistered, true, "A new flight was not registered correctly.")


    });

    it('Only existing airline may register a new airline until there are at least four airlines registered', async () => {

        let newAirline1 = accounts[5];
        let newAirline2 = accounts[6];
        let newAirline3 = accounts[7];
        let newAirline4 = accounts[8];

        // check if only an already registered airlines can add a new airline
        // ACT   
        try {
            await config.flightSuretyApp.fund(newAirline1, { from: newAirline1, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline1, { from: accounts[15] });
        }
        catch (e) {
            //console.log(e)

        }
        // ASSERT

        let result = await config.flightSuretyData.isAirline.call(newAirline1);

        assert(result == false, "Only an already registered airlines should be able to add a new airline.")

        // check if 4 airlines can be added without multi_party_voting       
        // ACT
        try {
            await config.flightSuretyApp.fund(newAirline1, { from: newAirline1, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline1, { from: config.firstAirline });

            await config.flightSuretyApp.fund(newAirline2, { from: newAirline2, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline2, { from: config.firstAirline });

            await config.flightSuretyApp.fund(newAirline3, { from: newAirline3, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline3, { from: config.firstAirline });

            await config.flightSuretyApp.fund(newAirline4, { from: newAirline4, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline4, { from: config.firstAirline });
        }
        catch (e) {
            console.log(e)
            // reverted = true;
        }

        let result1 = await config.flightSuretyData.isAirline.call(newAirline1);
        let result2 = await config.flightSuretyData.isAirline.call(newAirline2);
        let result3 = await config.flightSuretyData.isAirline.call(newAirline3);
        let result4 = await config.flightSuretyData.isAirline.call(newAirline3);

        // ASSERT
        assert(result1 == true, "newAirline1 should be registered correctly.")
        assert(result2 == true, "newAirline2 should be registered correctly.")
        assert(result3 == true, "newAirline3 should be registered correctly.")
        assert(result4 == true, "newAirline4 should be registered correctly.")
    });

    it('Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines', async () => {

        let newAirline1 = accounts[5];
        let newAirline2 = accounts[6];
        let newAirline3 = accounts[7];
        let newAirline4 = accounts[8];

        // newAirline5 with_multi_party_voting ;
        let newAirline5 = accounts[9];

        // check if 5th airline can be added with multi_party_voting       
        // ACT
        try {
            await config.flightSuretyApp.fund(newAirline1, { from: newAirline1, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline1, { from: config.firstAirline });

            await config.flightSuretyApp.fund(newAirline2, { from: newAirline2, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline2, { from: config.firstAirline });

            await config.flightSuretyApp.fund(newAirline3, { from: newAirline3, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline3, { from: config.firstAirline });

            await config.flightSuretyApp.fund(newAirline4, { from: newAirline4, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline4, { from: config.firstAirline });

            await config.flightSuretyApp.fund(newAirline5, { from: newAirline5, value: 10000000000000000000 });
            await config.flightSuretyApp.registerAirline(newAirline5, { from: config.firstAirline });
        }
        catch (e) {
            console.log(e)
            //reverted = true;
        }
        // ASSERT

        let result5 = await config.flightSuretyData.isAirline.call(newAirline5);
        assert(result5 == false, "newAirline5 should only be registered after 2 votes have been submitted.")

        // ACT
        try {
            await config.flightSuretyApp.registerAirline(newAirline5, { from: newAirline1 });
        }
        catch (e) {
            console.log(e)
        }
        // ASSERT
        result5 = await config.flightSuretyData.isAirline.call(newAirline5);
        assert(result5 == true, "newAirline5 should be registered correctly.")
    });
    
    it(`can buy insurance`, async function () {
        let flight_name = "My_Flight2"
        let timestamp = 12345;

        try {
            await config.flightSuretyApp.registerFlight(config.firstAirline, flight_name, timestamp);
            await config.flightSuretyApp.buy(config.firstAirline, flight_name, timestamp, { value: 1000000000000000000 })
            var key = await config.flightSuretyData.getFlightKey.call(config.firstAirline, flight_name, timestamp)
            var result = await config.flightSuretyApp.flights.call(key);
            var balance = await config.flightSuretyData.bet.call(config.owner, key);
            balance = web3.utils.fromWei(balance.toString(), "ether")
        }
        catch (e) {
            console.log(e)
        }
        assert(result[3] == flight_name, "Flight didn't register properly.")
        assert(balance == 1, "The flight couldn't been bought correctly.")
    });
});
