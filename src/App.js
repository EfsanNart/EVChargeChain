import React, { useEffect, useState } from "react";
import Web3 from "web3";
import EVCharging from "./contracts/EVCharging.json";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [chargeAmount, setChargeAmount] = useState("");
  const [reservation, setReservation] = useState({ stationId: "", time: "" });
  const [price, setPrice] = useState("");
  const [chargeStats, setChargeStats] = useState(0);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          const networkId = await web3.eth.net.getId();
          const networkData = EVCharging.networks[networkId];
          if (networkData) {
            const contract = new web3.eth.Contract(EVCharging.abi, networkData.address);
            setContract(contract);

            // Get initial charge stats
            const totalCharge = await contract.methods.getTotalChargeAmount().call();
            setChargeStats(Web3.utils.fromWei(totalCharge, "ether"));
          } else {
            window.alert("Smart contract not deployed to detected network.");
          }
        } catch (error) {
          console.error("User denied account access or error occurred", error);
        }
      } else {
        window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }
    };

    loadBlockchainData();
  }, []);

  const handleCharge = async (event) => {
    event.preventDefault();
    if (contract) {
      const amountInWei = Web3.utils.toWei(chargeAmount, "ether");
      await contract.methods.charge().send({ from: account, value: amountInWei });
      alert(`Charging initiated with ${chargeAmount} Ether.`);
      const totalCharge = await contract.methods.getTotalChargeAmount().call();
      setChargeStats(Web3.utils.fromWei(totalCharge, "ether"));
    }
  };

  const handleReservation = async (event) => {
    event.preventDefault();
    if (contract) {
      await contract.methods.reserveStation(reservation.stationId, reservation.time).send({ from: account });
      alert(`Station ${reservation.stationId} reserved at ${reservation.time }.`);
    }
  };

  const handlePriceUpdate = async (event) => {
    event.preventDefault();
    if (contract) {
      const priceInWei = Web3.utils.toWei(price, "ether");
      await contract.methods.setPrice(priceInWei).send({ from: account });
      alert(`Price updated to ${price} Ether.`);
    }
  };

  return (
    <div className="container">
      <h1>Electric Vehicle Charging DApp</h1>
      <p>Account: {account}</p>
      <form onSubmit={handleCharge}>
        <div className="form-group">
          <label>Charge Amount (in Ether):</label>
          <input
            type="text"
            className="form-control"
            value={chargeAmount}
            onChange={(e) => setChargeAmount(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Start Charging</button>
      </form>
      <form onSubmit={handleReservation}>
        <div className="form-group">
          <label>Station ID:</label>
          <input
            type="text"
            className="form-control"
            value={reservation.stationId}
            onChange={(e) => setReservation({ ...reservation, stationId: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Reservation Time:</label>
          <input
            type="text"
            className="form-control"
            value={reservation.time}
            onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-secondary">Reserve</button>
      </form>
      <form onSubmit={handlePriceUpdate}>
        <div className="form-group">
          <label>Set Price (in Ether):</label>
          <input
            type="text"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-info">Update Price</button>
      </form>
      <div>
        <h3>Charge Statistics</h3>
        <p>Total Charge Amount: {chargeStats} Ether</p>
      </div>
    </div>
  );
};

export default App;



