
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';

(async () => {

    let contract = new Contract('localhost', () => {

        // Read transaction
        contract.isOperational((error, result) => {
            display('Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: result }]);
        });

        // Write transaction
        contract.authorizeCaller((error, result) => {
            display('Authorizing calling AppContract', 'Authorize the AppContract', [{ label: 'Authorized the AppContract:', error: error, value: 'success' }]);
        });

        // User-submitted transaction (create a new flight)
        DOM.elid('submit-create-flight').addEventListener('click', () => {
            let flight = DOM.elid('flight-number').value;

            // Write transaction
            contract.registerFlight(flight, (error, result) => {
                display('RegisterFlight', 'Register a new flight', [{ label: 'Registered this flight:', error: error, value: result.flight + ' ' + result.timestamp }]);
            });
        })

        // User-buyes flight
        DOM.elid('submit-buy').addEventListener('click', () => {
            let flight = DOM.elid('flight-number1').value;
            let timestamp = DOM.elid('flight-timestamp1').value;
 
            contract.buy(flight, timestamp, (error, result) => {
                display('BuyFlight', 'Buy a new flight', [{ label: 'Bought the flight:', error: error, value: 'success' }]);
            });
        })

        // User-submitted transaction (submit to oracles)
        DOM.elid('submit-oracle').addEventListener('click', () => {
            let flight = DOM.elid('flight-number2').value;
            let timestamp = DOM.elid('flight-timestamp2').value;

            // Write transaction
            contract.fetchFlightStatus(flight, timestamp, (error, result) => {
                display('Oracles', 'Trigger oracles', [{ label: 'Fetched this flight status:', error: error, value: result.flight + ' ' + result.timestamp }]);
            });
        })

        // User-withdraw flight
        DOM.elid('submit-withdraw').addEventListener('click', () => {

            contract.withdraw((error, result) => {
                display('WithdrawFunds', 'Withdraw your Funds', [{ label: 'Withdrawn:', error: error, value: 'success' }]);
            });
        })
    });
})();


function display(title, description, results) {
    let displayDiv = DOM.elid("display-wrapper");
    let section = DOM.section();
    section.appendChild(DOM.h2(title));
    section.appendChild(DOM.h5(description));
    results.map((result) => {
        let row = section.appendChild(DOM.div({ className: 'row' }));
        row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
        row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, result.error ? String(result.error) : String(result.value)));
        section.appendChild(row);
    })
    displayDiv.append(section);
}







