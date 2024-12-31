import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import SmoothieToken from './contracts/SmoothieToken.json';
import MyTokenSale from './contracts/MyTokenSale.json';
import KycContract from './contracts/KycContract.json';
import logo from './logo.svg';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [tokenInstance, setTokenInstance] = useState(null);
  const [tokenSaleInstance, setTokenSaleInstance] = useState(null);
  const [myTokenSaleAddress, setmyTokenSaleAddress] = useState(null);
  const [kycInstance, setKycInstance] = useState(null);
  const [kycAddress, setKycAddress] = useState(""); // State variable for input value
  const [networkId, setNetworkId] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0); // State variable for token balance

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        try {
          await window.ethereum.enable();
          
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
          setmyTokenSaleAddress(MyTokenSale.networks[networkId].address);
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
    alert("Account is now whitelisted");
  };

  const handleBuyTokens = async () => {
    await tokenSaleInstance.methods.buyTokens(accounts[0]).send({ from: accounts[0], value: 1 });
    alert("Tokens bought");
  };

  const handleCheckBalance = async () => {
    const balance = await tokenInstance.methods.balanceOf(accounts[0]).call();
    setTokenBalance(balance);
    alert(`Your token balance is ${balance}`);
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
        
        <button onClick={handleBuyTokens}>Buy Tokens</button>
        <div>Send 1 wei to this address {myTokenSaleAddress}</div>
        <button onClick={handleCheckBalance}>Check My Token Balance</button>
        <p>Your token balance: {tokenBalance}</p>
      </header>
    </div>
  );
}

export default App;
