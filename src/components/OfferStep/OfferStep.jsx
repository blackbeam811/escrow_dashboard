import { GetStart } from "./Components/GetStart/GetStart";
import { OfferDetails } from "./Components/OfferDetails/OfferDetails";
import { Offer } from "./Components/Offer/Offer";

import React, { useState, useEffect, useRef } from "react";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useBalance,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { toast } from "react-toastify";
// import logoImage from "../images/logoLoad.png";
import logoImage from "../../images/logoLoad.png";
import EscrowServices from "../services/EscrowServices.js";
import config from "../config.js";
import LinearProgress from "@mui/material/LinearProgress";
import { redirect } from "react-router-dom";

export const OfferStep = () => {
  const [active, setActive] = useState(0);
  const [userEthBalance, setUserEthBalance] = useState(0);
  const { connector: activeConnector, isConnected, address } = useAccount();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const publicClient = usePublicClient();
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [forTokenBalance, setForTokenBalance] = useState(0);
  // const [tokenSymbol, setTokenSymbol] = useState("-");
  // const [offeringTokenName, setOfferingTokenName] = useState("-");
  // const [forTokenName, setForTokenName] = useState("-");
  // const [offerTokenPriceInEth, setOfferTokenPriceInEth] = useState(0);
  const [forTokenPriceInEth, setForTokenPriceInEth] = useState(0);
  // const [tokenPriceInEthTimestamp, setTokenPriceInEthTimestamp] = useState(0);
  const [ethAmountInput, setEthAmountInput] = useState("");
  const [tokenAmountInput, setTokenAmountInput] = useState("");
  const [chunkSizeInput, setChunkSizeInput] = useState("1");
  // const [showPopup, setShowPopup] = useState(false);
  // const [ethBalance, setUserEthBalance] = useState();
  const { chain: currentChain } = useNetwork();
  const [offertoken, setOffertoken] = useState("-");
  const [fortoken, setFortoken] = useState("-");
  const [offeringAddress, setOfferingAddress] = useState("");
  const [forAddress, setForAddress] = useState("");

  const loadStates = async () => {
    EscrowServices.setClient(publicClient);
    const ethBalance = await EscrowServices.fetchEthBalance(address);
    setUserEthBalance(ethBalance);

    console.log("Loading states...");
  };

  useEffect(() => {
    if (isConnected && currentChain?.id === config.arbitrumChainId) {
      loadStates();
      const img = new Image();
      img.src = logoImage;

      return () => {};
    }
  }, [address, isConnected, currentChain]);

  // Call fetchTokenBalance whenever tokenAddress or address changes
  useEffect(() => {
    fetchTokenDetails();
  }, [offeringAddress, forAddress, address]);

  const fetchTokenDetails = async () => {
    if (offeringAddress !== "" && address !== "" && isAddressValid === true) {
      if (offeringAddress === "0x0000000000000000000000000000000000000000") {
        setOffertoken("ETH");
      } else {
        const [balance, tokenSymbol, tokenName, priceInEth] =
          await EscrowServices.fetchTokenDetails(address, offeringAddress);
        setOffertoken(tokenSymbol);
      }
      // setOfferTokenPriceInEth(priceInEth);
    }

    if (forAddress !== "" && address !== "" && isAddressValid === true) {
      if (forAddress === "0x0000000000000000000000000000000000000000") {
        setFortoken("ETH");

        setForTokenBalance(userEthBalance);
      } else {
        const [balance, tokenSymbol, tokenName, priceInEth] =
          await EscrowServices.fetchTokenDetails(address, forAddress);
        setForTokenBalance(balance);
        setFortoken(tokenSymbol);
        setForTokenPriceInEth(priceInEth);
      }
    }
  };
  const handle = () => {
    if (offeringAddress === "0x0000000000000000000000000000000000000000")
      handleCreateSingleCoinOffer();
    else handleCreateSingleTokenOffer();
  };
  const handleCreateSingleCoinOffer = async () => {
    try {
      //setShowLoading(true)
      console.log(ethAmountInput);
      console.log(tokenAmountInput);
      alert(address);
      alert(forAddress);
      const txHash = await EscrowServices.createSingleCoinOffer(
        address,
        walletClient,
        tokenAmountInput,
        ethAmountInput,
        chunkSizeInput,
        forAddress
      );
      const txUrl = `${config.arbiscanUrl}${txHash}`;
      toast.success(
        <div>
          Created ETH for Token Offer! <br /> <br />{" "}
          <a href={txUrl} target="_blank" rel="noopener noreferrer">
            View transaction
          </a>
        </div>
      );
      //setShowLoading(false)
      await loadStates();
    } catch (error) {
      toast.error(`${error.message}`);
      //setShowLoading(false)
    }
  };
  const handleCreateSingleTokenOffer = async () => {
    try {
      //setShowLoading(true)
      // alert(ethAmountInput);
      // alert(tokenAmountInput);
      // alert(offeringAddress);
      // alert(forAddress);
      const txHash = await EscrowServices.createSingleTokenOffer(
        address,
        walletClient,
        ethAmountInput,
        tokenAmountInput,
        chunkSizeInput,
        forAddress
      );
      const txUrl = `${config.arbiscanUrl}${txHash}`;
      toast.success(
        <div>
          {redirect("/offer-step")}
          Created ETH for Token Offer! <br /> <br />{" "}
          <a href={txUrl} target="_blank" rel="noopener noreferrer">
            View transaction
          </a>
        </div>
      );
      //setShowLoading(false)
      await loadStates();
    } catch (error) {
      toast.error(`${error.message}`);
      //setShowLoading(false)
    }
  };
  const isValidToken = () => {
    if (tokenName === "-" || tokenName === null || tokenName === undefined) {
      return false;
    } else {
      return true;
    }
  };

  const isValidEthereumAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const checkAddress = (t, address) => {
    if (!t) setOfferingAddress(address);
    else setForAddress(address);
    setIsAddressValid(isValidEthereumAddress(address));
  };

  const offerPrice = ethAmountInput / tokenAmountInput;

  const STEP = [
    {
      title: "Get Started",
      content: <GetStart setActive={setActive} />,
    },
    {
      title: "Offer Details ",
      content: (
        <OfferDetails
          setActive={setActive}
          submitAddress={checkAddress}
          setTokenAmountInput={setTokenAmountInput}
          setEthAmountInput={setEthAmountInput}
          isAddressValid={isAddressValid}
          offertoken={offertoken}
          fortoken={fortoken}
          setOffertoken={setOffertoken}
          setFortoken={setFortoken}
          forTokenBalance={forTokenBalance}
        />
      ),
    },
    {
      title:
        "You want to Offer " +
        tokenAmountInput +
        " " +
        offertoken +
        " for " +
        ethAmountInput +
        "ETH",
      content: (
        <Offer
          setActive={setActive}
          offerToken={offertoken}
          forToken={fortoken}
          tokenAmountInput={tokenAmountInput}
          ethAmountInput={ethAmountInput}
          offerPrice={offerPrice}
          handleCreateSingleCoinOffer={handle}
        />
      ),
    },
  ];
  return (
    <div className="bg-[#363A41] pb-[31px] rounded-[8px] px-[52px] py-[12px] w-[710px] ">
      <div className="flex justify-between">
        <h1 className="text-white text-[25px] not-italic font-semibold leading-[normal]">
          {STEP[active].title}
        </h1>
        {/* <div className="py-[9px] bg-[#101116] rounded-[6px] px-[22px]">
          <p className="text-white text-xs not-italic font-normal leading-[normal]">
            Step {STEP.length}/{active + 1} Done
          </p>
        </div> */}
      </div>
      <div className="w-full flex justify-center my-5">
        <div className="relative border-2 border-gray-300 h-[6px] px-[45%]">
          <div
            className={
              "absolute top-[-500%] left-[-2%] w-6 h-6 rounded-[999px] bg-[#15161B] border-2 border-gray-300 flex justify-center items-center text-gray-300 text-md font-bold bg-gre" +
              (active >= 0 && " bg-green-500 border-none")
            }
          >
            1
          </div>

          <div
            className={
              "absolute top-[-500%] left-[48%] w-6 h-6 rounded-[999px] bg-[#15161B] border-2 border-gray-300 flex justify-center items-center text-gray-300 text-md font-bold bg-gre" +
              (active >= 1 && " bg-green-500 border-none")
            }
          >
            2
          </div>
          <div
            className={
              "absolute top-[-500%] left-[100%] w-6 h-6 rounded-[999px] bg-[#15161B] border-2 border-gray-300 flex justify-center items-center text-gray-300 text-md font-bold bg-gre" +
              (active >= 2 && " bg-green-500 border-none")
            }
          >
            3
          </div>
        </div>
      </div>
      {STEP[active].content}
    </div>
  );
};
