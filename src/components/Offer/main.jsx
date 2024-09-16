import Card from "./Card";

import OfferReducer, {
  setOffer,
  setTokenMetadata,
} from "../../redux/reducers/OfferReducer.js";

import refresh from "../../assets/imgs/refresh.png";
import { CiSearch } from "react-icons/ci";
import { RiFilter3Line, RiArrowDropDownLine } from "react-icons/ri";
import { BiSortAlt2 } from "react-icons/bi";
import useOutsideDetector from "../dropdown";
import { useState, useEffect, useRef } from "react";

import config from "../config.js";
import ABI_ESCROW from "../../abi/abi-escrow.json";
import EscrowServices from "../services/EscrowServices.js";

import { Network, Alchemy } from "alchemy-sdk";
import { useDispatch, useSelector } from "react-redux";
import {
  setOffers,
  setTokenMetadatas,
  setLoadedTokens,
} from "../../redux/reducers/OfferReducer.js";
import { FaArrowDown, FaArrowUp, FaCheck } from "react-icons/fa";
import PuffLoader from "react-spinners/PuffLoader.js";
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

const escrowAddress = config.escrowAddress;
const explorerUrl = config.arbiscanUrl;
const alchemyKey = config.alchemyKey;

const settings = {
  apiKey: alchemyKey, // Replace with your Alchemy API Key.
  network: Network.ARB_SEPOLIA, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const Main = ({ handleShowDetails }) => {
  // const offers = useSelector((store) => store.OfferReducer.offers);
  // const tokenMetadata = useSelector(
  //   (store) => store.OfferReducer.tokenMetadata
  // );
  // const loadedTokens = useSelector((store) => store.OfferReducer.loadedTokens);

  // const [showLoading, setShowLoading] = useState(false);
  // const { connector: activeConnector, isConnected, address } = useAccount();
  // const publicClient = usePublicClient();
  // const [tokenAddress, setTokenAddress] = useState("");
  // const dispatch = useDispatch();

  // const { chain: currentChain } = useNetwork();
  // const [loadedOffers, setLoadedOffers] = useState(false);
  // const [isCardView, setIsCardView] = useState(true);
  // const [ethPrice, setEthPrice] = useState(0);
  // const [recentOrders, setRecentOrders] = useState({});
  // const [sortedOffers, setSortedOffers] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const { connector: activeConnector, isConnected, address } = useAccount();
  const publicClient = usePublicClient();
  const [tokenAddress, setTokenAddress] = useState("");
  const [offers, setOffers] = useState([]);
  const [tokenMetadata, setTokenMetadata] = useState({});
  const [loadedTokens, setLoadedTokens] = useState({});
  const { chain: currentChain } = useNetwork();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedOffers, setLoadedOffers] = useState(false);
  const [isCardView, setIsCardView] = useState(true);
  const [ethPrice, setEthPrice] = useState(0);
  console.log("publicClient = " + publicClient);
  const loadStates = async () => {
    EscrowServices.setClient(publicClient);
  };

  useEffect(() => {
    setShowLoading(true);
    if (offers?.length === 0) return;
    console.log("useEffect is running - MAIN");
    console.log("showloading:", showLoading);

    const fetchTokenMetadata = async () => {
      const newTokenMetadata = { ...tokenMetadata };
      const newLoadedTokens = { ...loadedTokens };

      for (const offer of offers) {
        if (
          offer.owned_asset.asset_address !==
            "0x0000000000000000000000000000000000000000" &&
          !newTokenMetadata[offer.owned_asset.asset_address]
        ) {
          console.log("offer.forEach is running");
          try {
            const assetAddress = await alchemy.core.getTokenMetadata(
              offer.owned_asset.asset_address
            );
            const {
              name: tokenName,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
            } = assetAddress;

            console.log("Token Name:", tokenName);
            console.log("Token Symbol:", tokenSymbol);
            console.log("Token Decimals:", tokenDecimals);

            const [marketPrice, timestamp] =
              await EscrowServices.fetchUniswapDetails(
                offer.owned_asset.asset_address
              );
            console.log("Market Price:", marketPrice);

            newTokenMetadata[offer.owned_asset.asset_address] = {
              name: tokenName,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              marketPrice: marketPrice,
            };
          } catch (error) {
            console.error(error);
          }
        }

        for (const requestedAsset of offer.requested_assets) {
          if (
            requestedAsset.asset_address !==
              "0x0000000000000000000000000000000000000000" &&
            !newTokenMetadata[requestedAsset.asset_address] &&
            !newLoadedTokens[requestedAsset.asset_address]
          ) {
            console.log("offer.requested_assets.forEach is running");

            try {
              const equivalentAssetAddress =
                await alchemy.core.getTokenMetadata(
                  requestedAsset.asset_address
                );
              const {
                name: tokenName,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
              } = equivalentAssetAddress;

              console.log("Token Name:", tokenName);
              console.log("Token Symbol:", tokenSymbol);
              console.log("Token Decimals:", tokenDecimals);

              const [marketPrice, timestamp] =
                await EscrowServices.fetchUniswapDetails(
                  requestedAsset.asset_address
                );
              console.log("Market Price:", marketPrice);

              newLoadedTokens[requestedAsset.asset_address] = true;
              newTokenMetadata[requestedAsset.asset_address] = {
                name: tokenName,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
                marketPrice: marketPrice,
              };
            } catch (error) {
              console.error(error);
            }
          }
        }
      }

      setTokenMetadata(newTokenMetadata);
      setLoadedTokens(newLoadedTokens);
      setShowLoading(false);
    };

    fetchTokenMetadata();
  }, [offers]);

  useEffect(() => {
    if (isConnected && currentChain?.id === config.arbitrumChainId) {
      loadStates();
      const img = new Image();
      img.src = img;

      ethToUsd();
    }
  }, [address, isConnected, currentChain]);

  useEffect(() => {
    setShowLoading(true);
    if (!loadedOffers && isConnected) {
      setLoadedOffers(true);
      console.log("");
      const fetchPastOffers = async () => {
        // Get the total number of offers
        const totalOffers = await EscrowServices.fetchTotalOffers();

        // Create a temporary array to store the offers
        const tempOffers = [];
        console.log("totalOffers = " + totalOffers);

        // Fetch each offer
        for (let i = 1; i <= totalOffers; i++) {
          const [offerId, offerData] = await EscrowServices.readOffer(i);
          const offer = { ...offerData, id: offerId };
          tempOffers.push(offer);
          console.log("#$#offer.owned_asset", offer.owned_asset);
        }

        // Update the offers state once with the complete array of offers
        setOffers(tempOffers);
      };

      fetchPastOffers();

      const handleEventLogs = (logs) => {
        console.log(logs);
        //loadStates();
        loadData();
      };

      // Watching for contract events
      const unwatch = EscrowServices.client.watchContractEvent({
        address: escrowAddress,
        abi: ABI_ESCROW,
        eventName: "SingleOfferCreated",
        onLogs: handleEventLogs,
      });

      return () => {
        unwatch();
      };
    }
  }, []);

  const toggleView = () => {
    setIsCardView(!isCardView);
  };

  const ethToUsd = async () => {
    const priceEthURL =
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
    const resFetch = await fetch(priceEthURL);
    const price = await resFetch.json();
    setEthPrice(price["USD"]);
    return;
  };
  const sortedOffers = [...offers].sort((a, b) => b.id - a.id);

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
  // const handleClick = (offer, tmp) => {
  //   // dispatch(setOffer({ offer: offer }));
  //   // dispatch(setTokenMetadata({ tokenMetadata: tmp }));
  //   console.log("offer", offer);
  //   console.log("tmp", tmp);
  //   // handleShowDetails(offer, tmp);
  // };

  const odRef = useRef(null);
  const [os, setOs] = useState(0);
  const [ls, setLs] = useState(0);
  const [orderDropState, setOrderDropState] = useState(false);
  const [sortOrder, setSortOrder] = useState(1);
  const [orderType, setorderType] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const bgBlue = "bg-blue-700";
  // const bgPrimary = "bg-[#363A41]";
  const basicStyle =
    "flex justify-center items-center bg-[#363A41] p-2 font-medium text-sm hover:cursor-pointer transition-[bgColor] ease-in-out delay-500 select-none ";
  const basicListStyle =
    "bg-[#363A41] flex justify-center items-center p-2 text-sm font-medium hover:cursor-pointer select-none ";
  const orderStyle =
    "absolute top-0 left-0 mt-2 w-full text-center bg-[#363A41] rounded-[5px] hidden transition-all ease-in-out delay-1000 select-none";
  const orderActive =
    "absolute top-[100%] mt-2 left-0 w-full text-center rounded-[5px] block select-none z-[1000]";
  const handle = () => {
    setOrderDropState(false);
  };
  const [offerName, setOfferName] = useState([]);
  const [forName, setForName] = useState([]);
  useEffect(() => {
    if (!offers?.length) return;
    const k = orderType ? -1 : 1;
    // let tmp = offers.filter(
    //   (x) => x.owner.toLowerCase().search(inputValue.toLowerCase()) > -1
    // );
    console.log("offers", offers);
    let tmp = [...offers];

    // offers.forEach((offer) => {
    //   const offeringMetadata =
    //     tokenMetadata[offer?.owned_asset[0]?.asset_address];
    // const forMetadata =
    //   tokenMetadata[offer.requested_assets[0]?.asset_address];
    // const token =
    //   offer.owned_asset &&
    //   offer.owned_asset.asset_address !==
    //     "0x0000000000000000000000000000000000000000"
    //     ? offeringMetadata
    //       ? offeringMetadata.name
    //       : offer.owned_asset.asset_address
    //     : "";
    // console.log("token", token);
    //   let tmp1 = [...offerName];
    //   const existingOffer = offerName.find((item) => item.id === offer.id);
    //   if (!existingOffer) {
    //     tmp1.push({
    //       id: offer.id,
    //       name: offeringMetadata
    //         ? offeringMetadata.name
    //         : offer.owned_asset.asset_address,
    //     });
    //     setOfferName(tmp1);
    //   }
    // });
    // console.log("offerName", offerName);
    // switch (sortOrder) {
    //   case 0:
    //     tmp.sort((a, b) => {
    //       tmp.sort(
    //         (a, b) =>
    //           k *
    //           (tokenMetadata[a.owned_asset.asset_address] -
    //             tokenMetadata[b.owned_asset.asset_address])
    //       );
    //     });
    //     break;
    //   case 1:
    //     tmp.sort((a, b) => k * (a.id - b.id));
    //     break;
    //   case 2:
    //     tmp.sort(
    //       (a, b) =>
    //         k *
    //         (a.requested_assets[0]?.asset_address -
    //           b.requested_assets[0]?.asset_address)
    //     );
    //     break;
    //   default:
    //     tmp.sort((a, b) => k * (a.id - b.id));
    // }
    // console.log("tmp", tmp);
    // setSortedOffers(tmp);
  }, [sortOrder, orderType, inputValue, offers]);

  // useOutsideDetector([odRef], handle);
  return (
    <>
      {showLoading ? (
        isConnected && (
          <div className="absolute w-full h-[calc(100vh-103px)] z-[100000]">
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] backdrop-blur-[100px] rounded-full overflow-hidden">
              <div
                style={{
                  alignItems: "center",
                  height: "200px",
                  width: "200px",
                }}
              >
                <img
                  src="/LoadingLogo.webp"
                  alt="Logo"
                  style={{
                    position: "absolute",
                    height: "auto",
                    width: "100px",
                    opacity: "1",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
            </div>
          </div>
        )
      ) : isConnected ? (
        <div className="w-full">
          <div className=" w-full flex flex-wrap space-x-3 justify-center items-center">
            <div className="bg-[#363A41] flex justify-center  rounded-[5px] text-white">
              <div
                className={
                  os === 0
                    ? basicStyle + bgBlue + " rounded-l-[5px]"
                    : basicStyle + " rounded-l-[5px]"
                }
                onClick={() => setOs(0)}
              >
                Open
              </div>
              <div
                className={os === 1 ? basicStyle + bgBlue : basicStyle}
                onClick={() => setOs(1)}
              >
                100% Filled
              </div>
              <div
                className={
                  os === 2
                    ? basicStyle + bgBlue + " rounded-r-[5px]"
                    : basicStyle + " rounded-r-[5px]"
                }
                onClick={() => setOs(2)}
              >
                Closed
              </div>
            </div>
            <div className="bg-[#363A41] flex justify-center  rounded-[5px] text-white">
              <div
                className={
                  ls === 0
                    ? basicListStyle + bgBlue + " rounded-l-[5px]"
                    : basicListStyle + " rounded-l-[5px]"
                }
                onClick={() => {
                  setLs(0);
                }}
              >
                Strict List
              </div>
              <div
                className={
                  ls === 1
                    ? basicListStyle + bgBlue + " rounded-r-[5px]"
                    : basicListStyle + " rounded-r-[5px]"
                }
                onClick={() => {
                  setLs(1);
                }}
              >
                All
              </div>
            </div>
            <div className=" w-96 bg-[#101116] border border-[#363A41] flex justify-start items-center  rounded-[5px] text-white px-3 space-x-2">
              <CiSearch className=" w-6 h-auto text-gray-500" />
              <div className="relative w-full">
                <input
                  type="text"
                  className=" bg-transparent p-[5px] focus:outline-none w-full"
                  placeholder="Enter token name or contract address"
                  onChange={(e) => setInputValue(e.target.value)}
                  value={inputValue}
                />
              </div>
            </div>

            <div
              className="relative w-[230px] bg-[#363A41] flex justify-center items-center  rounded-[5px] text-[#808080] px-2 hover:cursor-pointer"
              onClick={() => setOrderDropState(!orderDropState)}
              ref={odRef}
            >
              <BiSortAlt2 className="w-6 h-auto" />
              <div className="text-[#808080] text-sm p-2 whitespace-nowrap">
                {sortOrder === 0 ? "Created" : "Name"} :{" "}
                {orderType === 0 ? "Ascending" : "Descending"}
              </div>
              <RiArrowDropDownLine className="w-8 h-auto" />

              <div
                className={
                  orderDropState
                    ? orderActive + " bg-[#363A41]"
                    : orderStyle + " bg-[#363A41]"
                }
              >
                <div>
                  <div
                    className="p-2 hover:bg-blue-700 hover:text-white flex justify-between items-center text-md space-x-2 transition duration-300"
                    onClick={() => setSortOrder(0)}
                  >
                    <div>Created</div>
                    {sortOrder === 0 ? <FaCheck /> : <></>}
                  </div>
                  <div
                    className="p-2 hover:bg-blue-700 hover:text-white flex justify-between items-center text-md space-x-2 transition duration-300"
                    onClick={() => setSortOrder(1)}
                  >
                    <div>Offer Name</div>
                    {sortOrder === 1 ? <FaCheck /> : <></>}
                  </div>
                  <div
                    className="p-2 hover:bg-blue-700 hover:text-white flex justify-between items-center text-md space-x-2 transition duration-300"
                    onClick={() => setSortOrder(2)}
                  >
                    <div>For Name</div>
                    {sortOrder === 2 ? <FaCheck /> : <></>}
                  </div>
                </div>
                <div className="mt-5">
                  <div
                    className="p-2  hover:bg-blue-700 hover:text-white flex justify-between items-center text-md space-x-2 transition duration-300"
                    onClick={() => setorderType(0)}
                  >
                    <div className="flex items-center space-x-2.5">
                      <FaArrowUp />
                      <div>Ascending</div>
                    </div>
                    {orderType === 0 ? <FaCheck /> : <></>}
                  </div>
                  <div
                    className="p-2  hover:bg-blue-700 hover:text-white flex justify-between items-center text-md space-x-2 transition duration-300"
                    onClick={() => setorderType(1)}
                  >
                    <div className="flex items-center space-x-2.5">
                      <FaArrowDown />
                      <div>Descending</div>
                    </div>
                    {orderType === 1 ? <FaCheck /> : <></>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3 mt-5 ">
            {sortedOffers
              .filter(
                (offer) =>
                  offer &&
                  offer.owner !== "0x0000000000000000000000000000000000000000"
              )
              .filter((offer) => {
                if (inputValue === "") return true;
                const offeringMetadata =
                  tokenMetadata[offer.owned_asset.asset_address];
                const forMetadata =
                  tokenMetadata[offer.requested_assets[0]?.asset_address];
                const token =
                  offer.owned_asset &&
                  offer.owned_asset.asset_address !==
                    "0x0000000000000000000000000000000000000000"
                    ? offeringMetadata
                      ? offeringMetadata.name
                      : offer.owned_asset.asset_address
                    : forMetadata
                    ? forMetadata.name
                    : offer.requested_assets[0]?.asset_address;
                const tokenAddress =
                  offer.owned_asset.asset_address !==
                  "0x0000000000000000000000000000000000000000"
                    ? offer.owned_asset.asset_address
                    : offer.requested_assets[0]?.asset_address;
                return (
                  token.toLowerCase().includes(inputValue.toLowerCase()) ||
                  tokenAddress.toLowerCase().includes(inputValue.toLowerCase())
                );
              })
              .map((offer, index) => {
                const offerId = offer.id.toString();
                // offer.owned_asset.asset_address ===
                //   "0x0000000000000000000000000000000000000000" &&
                //   alert(offerId);
                const offeringMetadata =
                  tokenMetadata[offer.owned_asset.asset_address];
                const forMetadata =
                  tokenMetadata[offer.requested_assets[0]?.asset_address];
                const token =
                  offer.owned_asset &&
                  offer.owned_asset.asset_address !==
                    "0x0000000000000000000000000000000000000000"
                    ? offeringMetadata
                      ? offeringMetadata.name
                      : offer.owned_asset.asset_address
                    : forMetadata
                    ? forMetadata.name
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
                  offeringMetadata
                    ? offeringMetadata.symbol
                    : offer.owned_asset.asset_address !==
                      "0x0000000000000000000000000000000000000000"
                    ? offer.owned_asset.asset_address
                    : "ETH"
                }`;
                const forOffer = `${roundToLast4NonZeroDigits(
                  formatEther(
                    offer.requested_assets[0]?.chunk_size * totalChunks
                  )
                )} ${
                  forMetadata
                    ? forMetadata.symbol
                    : offer.requested_assets[0]?.asset_address !==
                      "0x0000000000000000000000000000000000000000"
                    ? offer.requested_assets[0]?.asset_address
                    : "ETH"
                }`;

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
                const nonEthTokenChunkSizeInEth =
                  formatEther(nonEthTokenChunkSize);
                const pricePerToken = roundToLast4NonZeroDigits(
                  ethTokenChunkSizeInEth / nonEthTokenChunkSizeInEth
                );
                const pricePerTokenWei =
                  ethTokenChunkSizeInEth / nonEthTokenChunkSizeInEth;
                const isOwner = offer.owner === address;
                const nonEthAddress =
                  offer.requested_assets[0]?.asset_address ===
                  "0x0000000000000000000000000000000000000000"
                    ? offer.owned_asset.asset_address
                    : offer.requested_assets[0]?.asset_address;
                // setRecentOrders({
                //   ...recentOrders,
                //   timeStamp: timestamp,
                //   amount: offer.amount,
                // });
                // console.log("tokenmetadata", tokenMetadata);
                const data = {
                  isOwner: isOwner,
                  offerId: offerId,
                  token: token,
                  offering: offering,
                  forOffer: forOffer,
                  pricePerToken: pricePerToken,
                  offer: offer,
                  nonEthAddress: nonEthAddress,
                  tokenAddress: tokenAddress,
                };

                return (
                  <div key={index}>
                    <Card
                      isOwner={isOwner === true ? 1 : 0}
                      data={data}
                      submit={() => {
                        handleShowDetails(offer, tokenMetadata[nonEthAddress]);
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="w-full"></div>
      )}
      {/* <div className="w-full text-center font-semibold text-[30px] text-white my-2">
        Token List
      </div> */}
      {/* {console.log(offers)} */}
    </>
  );
};

export default Main;
