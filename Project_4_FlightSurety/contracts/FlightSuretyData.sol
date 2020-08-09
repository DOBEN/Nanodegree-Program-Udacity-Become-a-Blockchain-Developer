pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false
    address[] public contracts_allowed_to_access_data =new address[](0);

    mapping(address => bool) public registered_airlines;
    uint256 public num_registered_airlines=0;

    mapping(address =>mapping(bytes32=>uint256)) public bet;

    mapping(address =>uint256) public eligible_refund;

    mapping(bytes32 => address[]) public bettors_for_flights;
 
    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                    address firstAirline
                                ) 
                                public 
    {
        contractOwner = msg.sender;
        registered_airlines[firstAirline]=true;
        num_registered_airlines++;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    modifier is_registered_airline(address function_caller){
        if (num_registered_airlines>=1){
            require (registered_airlines[function_caller]==true, "This function should be called by a registered airline");
        }
        _;
    }

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier only_permissioned_contract_addresses()
    {
        bool found = false;

        for (uint i=0;i<contracts_allowed_to_access_data.length;i++){
            if (contracts_allowed_to_access_data[i]==msg.sender){
                found=true;
                break;
            }   
        }
        require(found==true, "Only permissioned Contract Addresses are allowed to access the Data Contract.");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isAirline(address airline) view public returns (bool){
        return registered_airlines[airline];
    }

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }

    function authorizeCaller(address contract_address) 
                            public
                            requireContractOwner()
                            requireIsOperational() 
    {
        contracts_allowed_to_access_data.push(contract_address);
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            public
                            requireContractOwner()
    {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline2
                            (
                                // uint256 votes,
                                 address approver,
                                 address airline
                            )
                            only_permissioned_contract_addresses()
                            requireIsOperational() 
                            is_registered_airline(approver)
                            public
                         
    {

        registered_airlines[airline]=true;
        num_registered_airlines=num_registered_airlines.add(1);
     
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy2
                            (   
                                bytes32 key,
                                address buyer                         
                            )
                            requireIsOperational() 
                            only_permissioned_contract_addresses()
                            public
                            payable
                            returns (bool return_value)
    { 
        return_value=address(this).call.value(msg.value)();
        bet[buyer][key]=msg.value;
        bettors_for_flights[key].push(buyer);
    }

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function withdraw2
                       (
                           address refund_address,
                           uint256 reward
                           
                        )
                        requireIsOperational() 
                        only_permissioned_contract_addresses()
                        public                            
    {
        require(reward <= address(this).balance,"Too less funding");
        eligible_refund[refund_address]=0;
        refund_address.transfer(reward);
    }


     function process_refund2
                       (
                           bytes32 key
                          
                        )
                        requireIsOperational() 
                        only_permissioned_contract_addresses()
                        public                         
    {
        for (uint256 i=0;i<bettors_for_flights[key].length;i++){
            address refund_address=bettors_for_flights[key][i];
            eligible_refund[refund_address]=eligible_refund[refund_address].add(bet[refund_address][key]);
        }
    }
    
    function getFlightKey
                        ( 
                            address airline,
                            string flight_name,  
                            uint256 timestamp
                        )
                        pure
                        public
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight_name, timestamp));
    }

    function fund2() public payable                           
    {
       address(this).call.value(msg.value);
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            public
                            payable                  
    {
        address(this).call.value(msg.value);
    }
}

