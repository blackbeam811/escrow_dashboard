import React, { useState, useEffect, useRef } from "react";
import logoImage from "../../images/logoLoad.png";
import { LineStep } from "./Components/LineStep/LineStep";
import { TfiWorld } from "react-icons/tfi";
import { redirect, useNavigate } from "react-router-dom";
import { FiArrowRightCircle } from "react-icons/fi";
import { RiTwitterXFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import { SiEthereum } from "react-icons/si";
import { LuArrowDownCircle } from "react-icons/lu";
import logo from "../../assets/imgs/logo 20.png";
import { toast } from "react-toastify";

import config from "../config.js";
import EscrowServices from "../services/EscrowServices.js";
import OfferReducer from "../../redux/reducers/OfferReducer.js";
import {
  getContract,
  formatEther,
  formatUnits,
  parseEther,
  formatGwei,
  toHex,
  encodePacked,
} from "viem";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useBalance,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { keyframes } from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Slider } from "@mui/material";
import { slider } from "@material-tailwind/react";
// import { CircularProgressbar } from "react-circular-progressbar";

const AboutElement = ({ title, description }) => {
  if (title === "Price Difference:") {
    description = Math.abs(description.toFixed(2));
    description < 0
      ? (description += " Below Market")
      : (description += " Above Market");
  }
  return (
    <div className="flex justify-between overflow-hidden">
      <p className="text-white text-md not-italic font-normal leading-[normal]">
        {title}
      </p>

      <p className="text-[#808080] text-md not-italic font-normal leading-[normal]">
        {description}
      </p>
    </div>
  );
};
export const BuyOffer = ({ offer, tokenMetadata, updateOffer }) => {
  const [swapOrder, setSwapOrder] = useState(1);
  const [sliderValue, setSliderValue] = useState(0);
  // const offer = useSelector((store) => store.OfferReducer.offer);

  // const tokenMetadata = useSelector(
  //   (store) => store.OfferReducer.tokenMetadata
  // );
  console.log("offerd", offer);
  console.log("tpoken", tokenMetadata);
  // if (!offer) location.href = "/";

  const navigate = useNavigate();
  console.log(offer);
  if (!offer) {
    return <div>Select an offer to see its details.</div>;
  }

  const { connector: activeConnector, isConnected, address } = useAccount();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const publicClient = usePublicClient();

  const [showPopup, setShowPopup] = useState(false);
  const [ethBalance, setUserEthBalance] = useState();
  const { chain: currentChain } = useNetwork();
  // const [sliderValue, setSliderValue] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [offerData, setOfferData] = useState({});
  const [tokenMarketPriceInEth, setTokenMarketPriceInEth] = useState(0);
  const [tokenPriceInEthTimestamp, setTokenPriceInEthTimestamp] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);

  const priceDifference =
    ((offerData.pricePerToken - tokenMarketPriceInEth) /
      tokenMarketPriceInEth) *
    100;

  const loadStates = async () => {
    EscrowServices.setClient(publicClient);
    const ethBalance = await EscrowServices.fetchEthBalance(address);
    setUserEthBalance(ethBalance);
    await getData();
    await fetchTokenDetails();

    console.log("Loading states...");
  };

  useEffect(() => {
    if (isConnected && currentChain?.id === config.arbitrumChainId) {
      loadStates();

      const img = new Image();
      img.src = logoImage;
      ethToUsd();

      return () => {};
    }
  }, [address, isConnected, currentChain]);

  const handleAcceptSingleOfferWithTokens = async () => {
    const tokensToSendAddress = offer.requested_assets[0]?.asset_address;

    try {
      setShowLoading(true);
      console.log("Accepting offer with tokens...");
      const txHash = await EscrowServices.acceptSingleOfferWithTokens(
        address,
        walletClient,
        offer.id,
        sliderValue,
        tokensToSendAddress
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
      setShowLoading(false);
      console.log("Completed Transaction********...");
      await loadStates();
      updateOffer(offer.id);
    } catch (error) {
      toast.error(`${error.message}`);
      setShowLoading(false);
    }
  };

  const handleAcceptSingleOfferWithCoins = async () => {
    try {
      setShowLoading(true);
      console.log("Accepting offer with ETH...");

      const txHash = await EscrowServices.acceptSingleOfferWithCoins(
        address,
        walletClient,
        offer.id,
        sliderValue
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
      setShowLoading(false);
      console.log("Completed Transaction********...");
      await loadStates();
      updateOffer(offer.id);
    } catch (error) {
      toast.error(`${error.message}`);
      setShowLoading(false);
    }
  };

  const handleCancelOffer = async () => {
    try {
      setShowLoading(true);
      console.log("Canceling Offer...");
      const txHash = await EscrowServices.cancelOffer(
        address,
        walletClient,
        offer.id
      );
      const txUrl = `${config.arbiscanUrl}${txHash}`;
      toast.success(
        <div>
          Cancelled Offer! <br /> <br />{" "}
          <a href={txUrl} target="_blank" rel="noopener noreferrer">
            View transaction
          </a>
        </div>
      );
      setShowLoading(false);
      console.log("Completed Cancel Transaction********...");
      await loadStates();
      onBack();
    } catch (error) {
      toast.error(`${error.message}`);
      setShowLoading(false);
    }
  };

  const ethToUsd = async () => {
    const priceEthURL =
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
    const resFetch = await fetch(priceEthURL);
    const price = await resFetch.json();
    setEthPrice(price["USD"]);
    return;
  };

  function roundToLast4NonZeroDigits(num) {
    let str = String(num);

    // If the number is in exponential form, format it to have 4 decimal places
    if (str.indexOf("e") !== -1) {
      const [base, exponent] = str.split("e");
      return `${parseFloat(base).toFixed(4)}e${exponent}`;
    }

    let nonZeroCount = 0;
    let result = "";
    let decimalFound = false;

    for (let i = 0; i < str.length; i++) {
      result += str[i];
      if (str[i] !== "0" && str[i] !== ".") {
        nonZeroCount++;
      }
      if (str[i] === ".") {
        decimalFound = true;
      }
      if (nonZeroCount === 4 && decimalFound) {
        break;
      }
    }

    return parseFloat(result);
  }

  function shortenAddress(address) {
    return address.slice(0, 8) + "...." + address.slice(-8);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
      function () {
        toast.success(<div>Copied to clipboard!</div>);
        console.log("Copying to clipboard was successful!");
      },
      function (err) {
        console.error("Could not copy text: ", err);
      }
    );
  }

  const isOwner = offer.owner === address;
  const forEther = swapOrder
    ? offer.requested_assets[0]?.asset_address ==
      "0x0000000000000000000000000000000000000000"
    : offer.owned_asset.asset_address ==
      "0x0000000000000000000000000000000000000000";
  const getData = async () => {
    setShowLoading(true);
    if (!forEther) {
      console.log("****getting data for non-ether offer");
      const offerAddress = toString(offer.owned_asset.asset_address);
      const forAddress = offer.requested_assets[0]?.asset_address;
      const token =
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? tokenMetadata
            ? tokenMetadata.name
            : offer.owned_asset.asset_address
          : forAddress
          ? forAddress.name
          : offer.requested_assets[0]?.asset_address;
      const tokenAddress =
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? offer.owned_asset.asset_address
          : offer.requested_assets[0]?.asset_address;
      const totalChunks = offer.amount / offer.owned_asset.chunk_size;
      const offering = `${roundToLast4NonZeroDigits(
        formatEther(offer.owned_asset.chunk_size * totalChunks)
      )} ${
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? tokenMetadata
            ? tokenMetadata.symbol
            : offer.owned_asset.asset_address
          : "ETH"
      }`;
      const forOffer = `${roundToLast4NonZeroDigits(
        formatEther(offer.requested_assets[0]?.chunk_size * totalChunks)
      )} ${
        tokenMetadata
          ? tokenMetadata.symbol
          : forAddress !== "0x0000000000000000000000000000000000000000"
          ? forAddress
          : "ETH"
      }`;
      const offeringSymbol = `${
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? tokenMetadata
            ? tokenMetadata.symbol
            : offer.owned_asset.asset_address
          : "ETH"
      }`;
      const totalRequested = formatEther(
        offer.requested_assets[0]?.chunk_size * totalChunks
      );
      const nonEthTokenChunkSize =
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? offer.amount / totalChunks
          : offer.requested_assets[0]?.chunk_size;
      const ethTokenChunkSize =
        offer.owned_asset.asset_address ===
        "0x0000000000000000000000000000000000000000"
          ? offer.amount / totalChunks
          : offer.requested_assets[0]?.chunk_size;
      const ethTokenChunkSizeInEth = formatEther(ethTokenChunkSize);
      const nonEthTokenChunkSizeInEth = formatEther(nonEthTokenChunkSize);
      const pricePerToken = roundToLast4NonZeroDigits(
        ethTokenChunkSizeInEth / nonEthTokenChunkSizeInEth
      );

      const newOfferData = {
        offerAddress: offerAddress,
        forAddress: forAddress,
        token: token,
        tokenAddress: tokenAddress,
        totalChunks: totalChunks,
        offering: offering,
        forOffer: forOffer,
        offeringSymbol: offeringSymbol,
        totalRequested: totalRequested,
        nonEthTokenChunkSize: nonEthTokenChunkSize,
        ethTokenChunkSize: ethTokenChunkSize,
        ethTokenChunkSizeInEth: ethTokenChunkSizeInEth,
        nonEthTokenChunkSizeInEth: nonEthTokenChunkSizeInEth,
        pricePerToken: pricePerToken,
      };

      setOfferData(newOfferData);
      setSliderValue(nonEthTokenChunkSizeInEth);
    } else {
      console.log("****getting data for ether offer");

      const offerAddress = toString(offer.owned_asset.asset_address);
      const forAddress = offer.requested_assets[0]?.asset_address;
      const token =
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? tokenMetadata
            ? tokenMetadata.name
            : offer.owned_asset.asset_address
          : forAddress
          ? forAddress.name
          : offer.requested_assets[0]?.asset_address;
      const tokenAddress =
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? offer.owned_asset.asset_address
          : offer.requested_assets[0]?.asset_address;
      const totalChunks = offer.amount / offer.owned_asset.chunk_size;
      const offering = `${roundToLast4NonZeroDigits(
        formatEther(offer.owned_asset.chunk_size * totalChunks)
      )} ${
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? tokenMetadata
            ? tokenMetadata.symbol
            : offer.owned_asset.asset_address
          : "ETH"
      }`;
      const forOffer = `${roundToLast4NonZeroDigits(
        formatEther(offer.requested_assets[0]?.chunk_size * totalChunks)
      )} ETH`;
      const offeringSymbol = `${
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? tokenMetadata
            ? tokenMetadata.symbol
            : offer.owned_asset.asset_address
          : "ETH"
      }`;
      const totalRequested = formatEther(
        offer.requested_assets[0]?.chunk_size * totalChunks
      );
      const nonEthTokenChunkSize =
        offer.owned_asset.asset_address !==
        "0x0000000000000000000000000000000000000000"
          ? offer.amount / totalChunks
          : offer.requested_assets[0]?.chunk_size;
      const ethTokenChunkSize =
        offer.owned_asset.asset_address ===
        "0x0000000000000000000000000000000000000000"
          ? offer.amount / totalChunks
          : offer.requested_assets[0]?.chunk_size;
      const ethTokenChunkSizeInEth = formatEther(ethTokenChunkSize);
      const nonEthTokenChunkSizeInEth = formatEther(nonEthTokenChunkSize);
      const pricePerToken = roundToLast4NonZeroDigits(
        ethTokenChunkSizeInEth / nonEthTokenChunkSizeInEth
      );

      const newOfferData = {
        offerAddress: offerAddress,
        forAddress: forAddress,
        token: token,
        tokenAddress: tokenAddress,
        totalChunks: totalChunks,
        offering: offering,
        forOffer: forOffer,
        offeringSymbol: offeringSymbol,
        totalRequested: totalRequested,
        nonEthTokenChunkSize: nonEthTokenChunkSize,
        ethTokenChunkSize: ethTokenChunkSize,
        ethTokenChunkSizeInEth: ethTokenChunkSizeInEth,
        nonEthTokenChunkSizeInEth: nonEthTokenChunkSizeInEth,
        pricePerToken: pricePerToken,
      };

      setOfferData(newOfferData);
      setSliderValue(ethTokenChunkSizeInEth);
    }

    setShowLoading(false);
  };

  const fetchTokenDetails = async () => {
    if (!forEther) {
      const [balance, tokenSymbol, tokenName, priceInEth, timestamp] =
        await EscrowServices.fetchTokenDetails(
          address,
          offer.requested_assets[0]?.asset_address
        );
      setTokenBalance(balance);
      setTokenMarketPriceInEth(priceInEth);
      setTokenPriceInEthTimestamp(timestamp);
    } else {
      const [balance, tokenSymbol, tokenName, priceInEth, timestamp] =
        await EscrowServices.fetchTokenDetails(
          address,
          offer.owned_asset.asset_address
        );
      setTokenBalance(balance);
      setTokenMarketPriceInEth(priceInEth);
      setTokenPriceInEthTimestamp(timestamp);
    }
  };

  const handleTakeOffer = () => {
    if (priceDifference < -5) {
      setShowPopup(true);
    } else {
      if (!forEther) {
        handleAcceptSingleOfferWithTokens();
      } else {
        handleAcceptSingleOfferWithCoins();
      }
    }
  };

  const handleYesClick = () => {
    setShowPopup(false);
    if (!forEther) {
      handleAcceptSingleOfferWithTokens();
    } else {
      handleAcceptSingleOfferWithCoins();
    }
  };

  const handleCancelClick = () => {
    setShowPopup(false);
  };

  const offerPriceInUsd = offerData.pricePerToken * ethPrice;
  const tokenMarketPriceInUsd = tokenMarketPriceInEth * ethPrice;

  useEffect(() => {
    setSliderValue(0);
    loadStates();
  }, [swapOrder]);
  return (
    <div className="pb-40 w-full">
      <div className="w-full overflow-hidden">
        <div className="flex py-[30px] justify-center space-x-20 ">
          <div className="rounded-2xl w-[40%]">
            <div className="flex justify-between pt-5 px-8 bg-[#272a2f] rounded-t-2xl">
              <div className="flex items-center justify-between w-full">
                <div className="flex justify-start items-center text-[#EFEFEF] drop-shadow-cs">
                  <div className="w-[30px] h-[30px]">
                    <img
                      src={`/tokens/${offerData.tokenAddress}.png`}
                      alt="sdf"
                    />
                  </div>
                  <div className="ml-3 flex flex-col justify-center">
                    <div className="flex justify-start space-x-3 items-start">
                      <div className="text-2xl">{tokenMetadata.name}</div>
                      <div className="text-sm mt-1">#{offer.id}</div>
                    </div>
                    <div className="text-[10px] text-blue-700">
                      PARTIAL FILL
                    </div>
                  </div>
                </div>
                {/* <div className="w-9 h-9">
                  <CircularProgressbar
                    value={"40px"}
                    text={`${"40px"}`}
                    styles={buildStyles({
                      textSize: "36px",
                      textColor: "white",
                      trailColor: "black",
                    })}
                  />
                </div> */}
              </div>
              <div className="flex  gap-x-[6px] ">
                <button className=" text-[#ffffff7f] rounded-[4px] bg-[#181A1C] w-10 h-10 flex justify-center items-center">
                  <TfiWorld className="w-full h-auto p-2" />
                </button>
                <button className=" text-[#ffffff7f] rounded-[4px] bg-[#181A1C] w-10 h-10 flex justify-center items-center">
                  <RiTwitterXFill className="w-full h-auto p-2" />
                </button>
                <button className=" text-[#ffffff7f] rounded-[4px] bg-[#181A1C] w-10 h-10 flex justify-center items-center">
                  <FaTelegramPlane className="w-full h-auto p-2" />
                </button>
              </div>
            </div>
            <div className="py-[27px] border-b-2 border-b-black px-8 bg-[#272a2f]">
              {/* <Tokens /> */}
              <div>
                <div className="flex justify-between space-x-50 overflow-hidden">
                  <p className="text-white text-md not-italic font-normal leading-[normal]">
                    Token Name:
                  </p>
                  <p className=" text-[#808080] text-md not-italic font-normal leading-[normal]">
                    {tokenMetadata.name}
                  </p>
                </div>
                <div className="flex justify-between mt-[18px] overflow-hidden">
                  <p className="text-white text-md not-italic font-normal leading-[normal]">
                    Token Symbol:
                  </p>
                  <p className=" text-[#808080] text-md not-italic font-normal leading-[normal]">
                    {tokenMetadata.symbol}
                  </p>
                </div>
                <div className="flex justify-between mt-[18px]">
                  <p className="text-white text-md not-italic font-normal leading-[normal]">
                    Token Contract:
                  </p>
                  <div className=" text-[#808080] text-md not-italic font-normal leading-[normal]">
                    {offerData.tokenAddress}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center px-8 border-b-2 border-b-black bg-[#272a2f]">
              <div className="text-md my-7">
                <div className="text-[#808080]">Offering</div>
                <div className="text-white text-2ops flex space-x-1 mt-0.5">
                  <div>{offerData.offering}&nbsp;</div>
                  {/* <div className="w-[24px] h-[30px]">
                    <img src={logo} alt="token  .png" className="w-auto h-auto" />
                  </div> */}
                </div>
                <div className="text-[#808080] mt-0.5">Price / Token</div>
                <div className="text-white text-2ops flex space-x-1 mt-0.5">
                  <div>${offerData.pricePerToken}</div>
                </div>
              </div>
              <FiArrowRightCircle className="w-7 h-auto text-blue-700" />
              <div className=" text-md">
                <div className="text-[#808080]">For</div>
                <div className="text-white text-2ops flex space-x-1 mt-0.5">
                  <div>{offerData.forOffer}&nbsp;</div>
                  {/* <div className="w-[30px] h-[30px]">
                    <img src={`/tokens/${offerData.tokenAddress}.png`} alt="sdf" />
                  </div> */}
                </div>
                <div className="text-[#808080] mt-0.5">Created</div>
                <div className="text-white text-2ops flex space-x-1 mt-0.5">
                  <div>1h ago</div>
                </div>
              </div>
            </div>
            <div className=" px-8 py-5 bg-[#272a2f] ">
              <div className="flex  flex-col gap-y-[21px]">
                <AboutElement
                  title={"Remaining Tokens:"}
                  description={"60,000,000.00 M7"}
                />
                <AboutElement title={"Offer ID:"} description={offer.id} />
                <AboutElement title={"Creator:"} description={offer.owner} />
                <AboutElement
                  title={"Offer Price/Token:"}
                  description={offerData.pricePerToken + " ETH"}
                />
                <AboutElement
                  title={"Market Price/Token:"}
                  description={tokenMetadata.marketPrice + " ETH"}
                />
                <AboutElement
                  title={"Price Difference:"}
                  description={priceDifference}
                />
                <AboutElement
                  title={"Minimum Fill:"}
                  description={offerData.ethTokenChunkSizeInEth}
                />
              </div>
            </div>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="py-[17px] w-full bg-[#6c757d] cursor-pointer text-white text-md not-italic font-normal leading-[normal] rounded-b-2xl"
            >
              Back
            </button>
          </div>
          <div>
            <div className="w-[560px] bg-[#272a2f] rounded-2xl pt-3">
              <div className="flex justify-between border-b-[#000000] border-b-2 px-8 py-3">
                <div className="flex justify-start items-center">
                  <img src={logo} alt="logo.png" className="w-[30px] h-auto" />
                  <h1 className="text-[#EFEFEF] text-xl not-italic font-medium leading-[normal] ml-2">
                    {tokenMetadata.symbol} / ETH
                  </h1>
                </div>
                <div>
                  <div className="text-md text-[#808080]">Price/Token</div>
                  <div className="text-md text-white text-right">
                    ${offerData.pricePerToken}
                  </div>
                </div>
              </div>
              <div className="px-8 relative">
                <LuArrowDownCircle
                  className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[36px] h-auto bg-[#000000] rounded-[999px] text-blue-700 hover:cursor-pointer"
                  onClick={() => {
                    setSwapOrder(!swapOrder);
                  }}
                />
                <div className="mt-[20px] bg-[#101116] flex flex-col rounded-2xl ">
                  <div className=" py-2 px-10 rounded-t-2xl">
                    <div className="flex justify-between items-center space-x-10">
                      <div className="text-blue-700">BUYING</div>
                      <div className="text-[#48484d]">
                        Max:&nbsp;
                        {/* <span className="text-white">
                          {offerData.forOffer}&nbsp;
                        </span> */}
                        <span className="text-white">
                          {swapOrder ? offerData.forOffer : offerData.offering}
                        </span>
                      </div>
                    </div>
                    {swapOrder ? (
                      <div className="flex justify-between items-center mt-3">
                        <input
                          type="number"
                          className="bg-transparent border-none hover:cursor-pointer focus:outline-none text-white text-[32px]"
                          min={offerData.nonEthTokenChunkSizeInEth}
                          max={offerData.totalRequested + 1}
                          value={sliderValue}
                          step={offerData.nonEthTokenChunkSizeInEth}
                          onChange={(e) => setSliderValue(e.target.value)}
                        />
                        <div className="w-[30px] h-[30px]">
                          <img
                            src={`/tokens/${offerData.tokenAddress}.png`}
                            alt={offerData.name}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mt-3">
                        <input
                          type="number"
                          className="bg-transparent border-none hover:cursor-pointer focus:outline-none text-white text-[32px]"
                          min={offerData.ethTokenChunkSizeInEth}
                          max={parseFloat(
                            formatEther(
                              offer.owned_asset.chunk_size *
                                offerData.totalChunks
                            )
                          )}
                          step={offerData.ethTokenChunkSizeInEth}
                          value={sliderValue}
                          onChange={(e) => setSliderValue(e.target.value)}
                        />
                        <SiEthereum className=" w-[30px] h-auto text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="bg-[#101116] border-t-2 border-t-[#272a2f] py-2 px-10 rounded-b-2xl">
                    <div className="flex justify-between items-center">
                      <div className="text-blue-700">FOR</div>
                      <div className="text-[#48484d]">
                        Balance:{" "}
                        <span className="text-white">{tokenBalance}</span>
                      </div>
                    </div>
                    {swapOrder ? (
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-white text-[32px]">
                          {sliderValue * offerData.pricePerToken}
                        </div>

                        <SiEthereum className="w-[30px] h-auto text-gray-500" />
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mt-3">
                        <div className="text-white text-[32px]">
                          {sliderValue / offerData.pricePerToken}
                        </div>
                        <div className="w-[30px] h-[30px]">
                          <img
                            src={`/tokens/${offerData.tokenAddress}.png`}
                            alt="sdf"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-[50px] px-8">
                <input
                  type="range"
                  className="w-full"
                  min={
                    swapOrder
                      ? offerData.nonethTokenChunkSizeInEth
                      : offerData.ethTokenChunkSizeInEth
                  }
                  max={
                    swapOrder
                      ? offerData.totalRequested
                      : parseFloat(
                          formatEther(
                            offer.owned_asset.chunk_size * offerData.totalChunks
                          )
                        )
                  }
                  step={
                    swapOrder
                      ? offerData.nonethTokenChunkSizeInEth
                      : offerData.ethTokenChunkSizeInEth
                  }
                  value={sliderValue}
                  onChange={(e) => setSliderValue(e.target.value)}
                />
              </div>
              <button
                className="py-[17px] w-full bg-blue-700 mt-[26px] text-white text-xs not-italic font-normal leading-[normal] rounded-b-2xl hover:cursor-pointer hover:bg-white hover:text-blue-700 transition duration-200 hover:font-bold disabled:cursor-not-allowed"
                disabled={
                  Number(sliderValue) > Number(offerData.totalRequested)
                  // Number(sliderValue) > Number(ethBalance)
                }
                onClick={() => {
                  handleTakeOffer();
                }}
              >
                Execute Order
              </button>
            </div>
            <div className="mt-4 bg-[#272a2f] rounded-2xl flex flex-col">
              <div className="px-8 py-3 text-white">Recent Orders</div>

              <div className="relative overflow-x-auto rounded-b-2xl">
                <table className="w-full text-sm text-left rtl:text-right rounded-b-2xl">
                  <thead className="text-xs text-[#48484d] uppercase bg-[#101116]">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Timestamp
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Paid
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Taker
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {offers && offers.length > 0 ? (
                      offers.map((offer, index) =>
                        index < 4 ? (
                          <tr key={index}>
                            <td
                              scope="row"
                              className="px-6 text-md py-4 text-[#48484d]"
                            >
                              {offer.timestamp} ago
                            </td>
                            <td className="px-6 text-md py-4 text-white">
                              {offer.amount} M7
                            </td>
                            <td className="px-6 text-md py-4 text-white">
                              {""} ETH
                            </td>
                            <td className="px-6 text-md py-4 text-[#48484d]">
                              {""}
                            </td>
                          </tr>
                        ) : null
                      )
                    ) : (
                      <tr>
                        <td colSpan={4}>No offers available.</td>
                      </tr>
                    )} */}
                    <tr>
                      <td colSpan={4} className="px-6 text-md py-4 text-white">
                        No offers available.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
