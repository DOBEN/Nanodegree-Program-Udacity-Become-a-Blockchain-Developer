pragma solidity ^0.4.25;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    bool operational =true;

    address private contractOwner;          // Account used to deploy contract

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;
        string flight_name;      
        address airline;
    }

    mapping(bytes32 => Flight) public flights;

    mapping(address =>bool) airlines_payed;

    mapping(bytes32 => mapping(address =>address[])) public multi_party_voting;

    FlightSuretyData flightSuretyData;

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
         // Modify to call data contract's status
        require(operational, "Contract is currently not operational");  
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier airline_funded(address airline){
        require(airlines_payed[airline]==true, "The airline has to be funded before it can be registered");
        _;
    }

    modifier multi_party_voting_modifier(bytes32 function_name, address party_to_approve, address approved_by){

        bool dublicated=false;
            for (uint256 k=0; k<multi_party_voting[function_name][party_to_approve].length; ++k) {
                if(multi_party_voting[function_name][party_to_approve][k]==approved_by){
                dublicated=true;
                break;
            }
        }

        if (dublicated==false){
            multi_party_voting[function_name][party_to_approve].push(approved_by);
        }
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */

    constructor
                                (address DataContractAddress, 
                                address firstAirline
                                ) 
                                public 
                                payable
    {
        require(msg.value>=10 ether, "Has to pay at least 10 Ether to register firstAirline.");
        
        contractOwner = msg.sender;
        flightSuretyData=FlightSuretyData(DataContractAddress);
        flightSuretyData.fund2.value(10 ether)();
        airlines_payed[firstAirline]=true;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;  // Modify to call data contract's status
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    function buy(address airline, string flight_name, uint256 timestamp) public payable{
        require(msg.value <= 1 ether,"You can only buy insurance up to 1 Ether");
        bytes32 key=keccak256(abi.encodePacked(airline, flight_name, timestamp));
        require(flights[key].isRegistered==true, "Flight has to exist to buy insurance for it");
        require(flights[key].statusCode==0, "Flight has to have statusCode 0 to buy insurance.");

        flightSuretyData.buy2.value(msg.value)(key, msg.sender);
    }
 
    function withdraw(address refund_address) public {
        uint256 reward= flightSuretyData.eligible_refund(refund_address);
        reward=reward.mul(3).div(2);

        flightSuretyData.withdraw2(refund_address,reward); 
    }

   /**
    * @dev Add an airline to the registration queue
    *
    */   
    function registerAirline
                            (
                                address airline
                            )
                            public
                            airline_funded(airline)
                            multi_party_voting_modifier('registerAirline', airline, msg.sender) returns(bool,uint256)
    {

    uint256 votes=multi_party_voting['registerAirline'][airline].length;
    uint256 num_registered_airlines=flightSuretyData.num_registered_airlines();

     if (num_registered_airlines>4){
            uint256 num_votes_needed=num_registered_airlines.div(2);
            if(votes>=num_votes_needed){
                flightSuretyData.registerAirline2( msg.sender, airline );
                 return (true, votes);
            }
            else{
                return (false, votes);
            }   
        }
        else{
            flightSuretyData.registerAirline2( msg.sender, airline );  
            return (true, 1);
        } 
    }

   /**
    * @dev Register a future flight for insuring.
    *
    */  
    function registerFlight
                                (
                                    address airline,
                                    string flight_name,
                                    uint256 timestamp
                                )
                               public                
    {
        bytes32 key=keccak256(abi.encodePacked(airline, flight_name, timestamp));
        flights[key]=Flight(true, 0, timestamp, flight_name, airline);
    }
    
   /**
    * @dev Called after oracle has updated flight status
    *
    */  
    function processFlightStatus
                                (
                                    address airline,
                                    string memory flight_name,
                                    uint256 timestamp,
                                    uint8 statusCode
                                )
                                internal
                                
    {
        bytes32 key=keccak256(abi.encodePacked(airline, flight_name, timestamp));
        flights[key].statusCode=statusCode;

        flightSuretyData.process_refund2(key);
    }


     /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            ( 
                                address airline 
                            )
                            requireIsOperational() 
                            public
                            payable
    {
        require(msg.value>=10 ether,"An airline has to pay at least 10 Ether initally.");

        if (airlines_payed[airline]==false){     
            flightSuretyData.fund2.value(msg.value)();
            airlines_payed[airline]=true;
       }
    }


    // Generate a request for oracles to fetch flight information
    function fetchFlightStatus
                        (
                            address airline,
                            string flight_name,
                            uint256 timestamp                            
                        )
                      public
    {
        bytes32 key2=keccak256(abi.encodePacked(airline, flight_name, timestamp));
        require(flights[key2].isRegistered==true, 'Require that flight is registered before you can fetch its status.');

        uint8 index = getRandomIndex(msg.sender);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight_name, timestamp));
        oracleResponses[key] = ResponseInfo({
                                                requester: msg.sender,
                                                isOpen: true
                                            });
        emit OracleRequest(index, airline, flight_name, timestamp);
    } 

// region ORACLE MANAGEMENT

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;    

    // Fee to be paid when registering oracle
    uint256 public constant REGISTRATION_FEE = 1 ether;

    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;

    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;        
    }

    // Track all registered oracles
    mapping(address => Oracle) private oracles;

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
                                                        // This lets us group responses and identify
                                                        // the response that majority of the oracles
    }

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);

    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);

    // Register an oracle with the contract
    function registerOracle
                            (
                            )
                            public
                            payable
    {
        // Require registration fee
        require(msg.value >= REGISTRATION_FEE, "Registration fee is required"); //to do: every Oracle has to pay during the registration process.

        uint8[3] memory indexes = generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({
                                        isRegistered: true,
                                        indexes: indexes
                                    });
    }

    function getMyIndexes
                            (
                            )
                            view
                            public
                            returns(uint8[3])
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");
        return oracles[msg.sender].indexes;
    }

    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    function submitOracleResponse
                        (
                            uint8 index,
                            address airline,
                            string flight,
                            uint256 timestamp,
                            uint8 statusCode
                        )
                        public
    {
        require((oracles[msg.sender].indexes[0] == index) || (oracles[msg.sender].indexes[1] == index) || (oracles[msg.sender].indexes[2] == index), "Index does not match oracle request");

        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
        require(oracleResponses[key].requester!=address(0),"Flight or timestamp do not match oracle request"); 
        require(oracleResponses[key].isOpen, "Already enough oracle responses received.");

        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {
            emit FlightStatusInfo(airline, flight, timestamp, statusCode);

            // Handle flight status as appropriate
            processFlightStatus(airline, flight, timestamp, statusCode);

            oracleResponses[key].isOpen=false;
        }
    }

    function getFlightKey
                        (
                            address airline,
                            string flight,
                            uint256 timestamp
                        )
                        pure
                        public
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes
                            (                       
                                address account         
                            )
                            internal
                            returns(uint8[3])
    {
        uint8[3] memory indexes;
        indexes[0] = getRandomIndex(account);
        
        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            indexes[1] = getRandomIndex(account);
        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            indexes[2] = getRandomIndex(account);
        }

        return indexes;
    }

    // Returns array of three non-duplicating integers from 0-9
    function getRandomIndex
                            (
                                address account
                            )
                            internal
                            returns (uint8)
    {
        uint8 maxValue = 10;

        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);

        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }

        return random;
    }

}   

contract FlightSuretyData {
    function num_registered_airlines() view public returns (uint256);
    function eligible_refund(address refund_address)view public returns(uint256);
    function withdraw2( address refund_address,uint256 reward) public;
    function buy2(bytes32 key, address buyer) payable public;                        
    function registerAirline2(address approver, address airline) public;
    function fund2() public payable;
    function process_refund2(bytes32 key) public;
}