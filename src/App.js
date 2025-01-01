import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import SmoothieToken from './contracts/SmoothieToken.json';
import MyTokenSale from './contracts/MyTokenSale.json';
import KycContract from './contracts/KycContract.json';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [tokenInstance, setTokenInstance] = useState(null);
  const [tokenSaleInstance, setTokenSaleInstance] = useState(null);
  const [kycInstance, setKycInstance] = useState(null);
  const [kycAddress, setKycAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccounts(accounts);
          const networkId = await web3.eth.net.getId();
          
          const tokenInstance = new web3.eth.Contract(
            SmoothieToken.abi,
            SmoothieToken.networks[networkId] && SmoothieToken.networks[networkId].address,
          );
          const tokenSaleAddress = MyTokenSale.networks[networkId] && MyTokenSale.networks[networkId].address;
          if (!tokenSaleAddress) {
            throw new Error("Token sale contract not deployed on this network");
          }
          const tokenSaleInstance = new web3.eth.Contract(
            MyTokenSale.abi,
            tokenSaleAddress,
          );
          const kycInstance = new web3.eth.Contract(
            KycContract.abi,
            KycContract.networks[networkId] && KycContract.networks[networkId].address,
          );
          setTokenInstance(tokenInstance);
          setTokenSaleInstance(tokenSaleInstance);
          setKycInstance(kycInstance);
        } catch (error) {
          console.error("Could not connect to wallet", error);
        }
      } else {
        console.error("No Ethereum browser extension detected");
      }
    };
    initWeb3();
  }, []);

  const handleKycWhitelisting = async () => {
    await kycInstance.methods.setKycCompleted(kycAddress).send({ from: accounts[0] });
    alert(`${kycAddress} is now whitelisted`);
  };

  const handleCheckBalance = async () => {
    const balance = await tokenInstance.methods.balanceOf(accounts[0]).call();
    setTokenBalance(balance);
    alert(`Your token balance is ${balance}`);
  };

  const handleBuyTokens = async () => {
    await tokenSaleInstance.methods.buyTokens(accounts[0]).send({ from: accounts[0], value: web3.utils.toWei("1", "wei") });
    alert("Bought 1 Smoothie Token");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Smoothie Token Sale</h1>
        <h3>Get your tokens today</h3>
        <p>Kyc whitelisting</p>
        <div className='inputAddress'>
          Address to allow: <input type='text' onChange={(e) => setKycAddress(e.target.value)} value={kycAddress} />
          <button onClick={handleKycWhitelisting}>Whitelist Account</button>
        </div>
        <button className="checkBalanceButton" onClick={handleCheckBalance}>Check My Token Balance</button>
        <button className="buyTokensButton" onClick={handleBuyTokens}>Buy Tokens</button>
        <p>Your token balance: {tokenBalance}</p>
      </header>
    </div>
  );
}

export default App;
