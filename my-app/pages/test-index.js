import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Home from ".";
import Head from "next/head";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";


export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [presaleStarted, setPresaleStarted]=useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [presaleEnded, setPresaleEnded]=useState(false);
  const [loading, setLoading]=useState(false);
  const [numTokenMinted, setNumTokensMinted]=useState("0");


  const getNumMintTokens=async()=>{
    try{
      const provider=await getProviderOrSigner();
      const nftContract=new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
      const nftTokens=await nftContract.tokenId();
      setNumTokensMinted(nftTokens.toString());
    }catch(error){
      console.log(error);
    }

  }


  const presaleMint=async()=>{
    setLoading(true);
    try{
      const signer=await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      //nftContract.presaleMint - call from contract and pass object 
      const txn= await nftContract.presaleMint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You successfully minted a Crypto Dev!");
    }catch(error){
      console.log(error);
    }
    setLoading(false);
  }


  const publicMint=async()=>{
    setLoading(true);
    try{
      const signer=await getProviderOrSigner(true);
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      //nftContract.Mint - call from contract and pass object 
      const txn= await nftContract.mint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You successfully minted a Crypto Dev!");
    }catch(error){
      console.log(error);
    }
    setLoading(false);
  }


  //kind of helper fun to get owner for starting presale
  const getOwner=async()=>{
    try{
        const provider = await getProviderOrSigner();
        const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
        const _owner = await nftContract.owner();
        const signer = await getProviderOrSigner(true);
        const address = await signer.getAddress();
        if (address.toLowerCase() === _owner.toLowerCase()) {
            setIsOwner(true);
          }    

    }catch(error){
        console.log(error);
    }

  }


  const startPresale=async()=>{
    setLoading(true);
    try{
        const signer=await getProviderOrSigner(true);
        const nftContract=new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
        const txn=await nftContract.startPresale();
        await txn.wait();
        setPresaleStarted(true);
    }catch(error){
        console.log(error);
    }
    setLoading(false);
  }


  const checkIfPresaleStarted=async()=>{
    try{
        const provider=await getProviderOrSigner();
        //get instance of contract
        const nftContract= new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
        const isPresaleStarted= await nftContract.presaleStarted();
        setPresaleStarted(isPresaleStarted);
        return isPresaleStarted;
    }catch(error){
     console.log(error);
     return false;
    }
  }


  const checkIfPresaleEnded= async()=>{
    try{
       const provider=await getProviderOrSigner();
       const nftContract= new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
       const _presaleEnded = await nftContract.presaleEnded();
       const hasEnded = _presaleEnded.lt(Math.floor(Date.now() / 1000));
       if (hasEnded) {
         setPresaleEnded(true);
       } else {
         setPresaleEnded(false);
       }
       return hasEnded;        

    }catch(error){
        console.log(error);
    }

  }


  //when state variable changes (user intereacts) then useeffect gets called and web3modal connects wallet
  const connectWallet = async () => {
    try{
        await getProviderOrSigner();//call helper function
        setWalletConnected(true);
    }catch(error){
        console.log(error);
    }
  };
  

  const getProviderOrSigner=async(needSigner=false)=>{        
    //gain access to provider/signer from metamask
    const provider=await web3ModalRef.current.connect(); //to popup metamask
    const web3Provider=new providers.Web3Provider(provider); //etherjs provides much more functionalities to intereact with wallets
    //correct chain connection condition
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    if(needSigner){
        const signer=web3Provider.getSigner();
        return signer;
    }
  }


  const onPageLoad=async()=>{
     await connectWallet();
     await getOwner();
     const presaleStarted= await checkIfPresaleStarted();
     if(presaleStarted){
      await checkIfPresaleEnded();
     }
     //
     await getNumMintTokens();
     //track ststus of presale in real time after 5sec
     const presaleEndedInterval = setInterval(async function () {
      const _presaleStarted = await checkIfPresaleStarted();
      if (_presaleStarted) {
        const _presaleEnded = await checkIfPresaleEnded();
        if (_presaleEnded) {
          clearInterval(presaleEndedInterval);
        }
      }
    }, 5 * 1000);
    //
    //track no. of minted NFT's in 5sec each
    setInterval(async function () {
      await getNumMintTokens();
    }, 5 * 1000);

  }


  useEffect(() => {
    if (!walletConnected) {
        //web3Modal reference
        web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    //for any change state variable --refer onPageLoad function further
    //we want to check presale started after user connects their wallet
        onPageLoad();
  }
  }, []);


  //---function for conditional rendering---
  function renderBody(){
    //
    //btn to connect
    if(!walletConnected){
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connect Your wallet
        </button>
      );
    }

    //
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    //
    //btn to start presale
    if(isOwner && !presaleStarted){
      return(
        <button onClick={startPresale} className={styles.button}>
          Start presale
        </button>
      )
    }

    //
    if(!presaleStarted){
      return (
        <div>
          <div className={styles.description}>Presale hasnt started!</div>
        </div>
      );
    }
    
    //
    if(presaleStarted && !presaleEnded){
      return (
        <div>
          <div className={styles.description}>
            Presale has started!!! If your address is whitelisted, Mint a Crypto
            Dev 🥳
          </div>
          <button className={styles.button} onClick={presaleMint}>
            Presale Mint 🚀
          </button>
        </div>
      );
    }
    
    //
    if (presaleStarted && presaleEnded) {
      return (
        <button className={styles.button} onClick={publicMint}>
          Public Mint 🚀
        </button>
      );
    }

  }


  return (
    <div>
      <Head>
        <title>Crypto Devs</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>

        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/20 have been minted
          </div>
          {renderButton()}
        </div>

        <div>
          <img className={styles.image} src="./cryptodevs/0.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );


}
