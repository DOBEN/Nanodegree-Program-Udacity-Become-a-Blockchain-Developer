import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json';
import Config from '../server/config.json';
import Web3 from 'web3';

var appAddress;
var current_account;

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];

        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        window.ethereum.enable();
        web3.eth.getAccounts(async (error, accts) => {
            current_account = accts[0];
        })

        appAddress = config.appAddress
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.flightSuretyData = new this.web3.eth.Contract(FlightSuretyData.abi, config.dataAddress);

        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {

            this.owner = accts[0];
            let counter = 1;

            while (this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while (this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
        let self = this;
        self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner }, callback);
    }

    registerFlight(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor((Date.now() + 100000) / 1000)
        }
        self.flightSuretyApp.methods
            .registerFlight(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner, gas: 1000000 }, (error, result) => {
                callback(error, payload);
            });
    }

    buy(flight, timestamp, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: timestamp
        }
        self.flightSuretyApp.methods
            .buy(payload.airline, payload.flight, payload.timestamp)
            .send({ from: current_account, gas: 1000000, value: 1000000000000000000 }, (error, result) => {
                callback(error, payload);
            });
    }

    withdraw(callback) {
        let self = this;
        let payload = {}
        self.flightSuretyApp.methods
            .withdraw(current_account)
            .send({ from: current_account, gas: 1000000 }, (error, result) => {
                callback(error, payload);
            });
    }

    authorizeCaller(callback) {
        let self = this;
        let payload = {}
        self.flightSuretyData.methods
            .authorizeCaller(appAddress)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }

    fetchFlightStatus(flight, timestamp, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: timestamp
        }
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner }, (error, result) => {
                callback(error, payload);
            });
    }
}