pragma solidity ^0.8.0;

contract EVCharging {
    struct ChargingSession {
        address user;
        uint256 startTime;
        uint256 endTime;
        uint256 amountPaid;
    }
    mapping(uint256 => ChargingSession) public sessions;
    mapping(uint256 => uint256) public prices;
    function startCharging(uint256 stationId) public {
        // Şarj işlemini başlatma kodu
    }
    function stopCharging(uint256 stationId) public {
        // Şarj işlemini durdurma kodu
    }
    function payForCharging(uint256 stationId) public payable {
        sessions[stationId].amountPaid = msg.value;
    }
    function setPrice(uint256 stationId, uint256 price) public {
        prices[stationId] = price;
    }
    function reserveStation(uint256 stationId) public {
        // Rezervasyon işlemi kodu
    }
}


