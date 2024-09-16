// const { connector: activeConnector, isConnected, address } = useAccount();
//   const { data: walletClient, isError, isLoading } = useWalletClient();
//   const publicClient = usePublicClient();

//   const [showPopup, setShowPopup] = useState(false);
//   const [ethBalance, setUserEthBalance] = useState();
//   const { chain: currentChain } = useNetwork();
//   const [showLoading, setShowLoading] = useState(false);
//   const [offerData, setOfferData] = useState({});
//   const [tokenMarketPriceInEth, setTokenMarketPriceInEth] = useState(0);
//   const [tokenPriceInEthTimestamp, setTokenPriceInEthTimestamp] = useState(0);
//   const [tokenBalance, setTokenBalance] = useState(0);
//   const [ethPrice, setEthPrice] = useState(0);

//   const priceDifference =
//     ((offerData.pricePerToken - tokenMarketPriceInEth) /
//       tokenMarketPriceInEth) *
//     100;

//   const loadStates = async () => {
//     EscrowServices.setClient(publicClient);
//     const ethBalance = await EscrowServices.fetchEthBalance(address);
//     setUserEthBalance(ethBalance);
//     await getData();
//     await fetchTokenDetails();

//     console.log("Loading states...");
//   };

//   useEffect(() => {
//     if (isConnected && currentChain?.id === config.arbitrumChainId) {
//       loadStates();

//       const img = new Image();
//       img.src = logoImage;
//       ethToUsd();

//       return () => {};
//     }
//   }, [address, isConnected, currentChain]);

//   const handleAcceptSingleOfferWithTokens = async () => {
//     const tokensToSendAddress = offer.requested_assets[0]?.asset_address;

//     try {
//       // setShowLoading(true);

//       const txHash = await EscrowServices.acceptSingleOfferWithTokens(
//         address,
//         walletClient,
//         offer.id,
//         sliderValue.toString(),
//         // (sliderValue * offerData.pricePerToken).toString(),
//         tokensToSendAddress
//       );

//       const txUrl = `${config.arbiscanUrl}${txHash}`;
//       toast.success(
//         <div>
//           Created ETH for Token Offer! <br /> <br />{" "}
//           <a href={txUrl} target="_blank" rel="noopener noreferrer">
//             View transaction
//           </a>
//         </div>
//       );
//       setShowLoading(false);
//       // console.log("Completed Transaction********...");
//       await loadStates();
//       updateOffer(offer.id);
//     } catch (error) {
//       toast.error(`${error.message}`);
//       setShowLoading(false);
//     }
//   };

//   const handleAcceptSingleOfferWithCoins = async () => {
//     try {
//       setShowLoading(true);

//       console.log("Accepting offer with ETH...");
//       const txHash = await EscrowServices.acceptSingleOfferWithCoins(
//         address,
//         walletClient,
//         offer.id,
//         sliderValue
//         // sliderValue * offerData.pricePerToken
//       );

//       const txUrl = `${config.arbiscanUrl}${txHash}`;
//       toast.success(
//         <div>
//           Created ETH for Token Offer! <br /> <br />{" "}
//           <a href={txUrl} target="_blank" rel="noopener noreferrer">
//             View transaction
//           </a>
//         </div>
//       );
//       setShowLoading(false);
//       // console.log("Completed Transaction********...");
//       await loadStates();
//       updateOffer(offer.id);
//     } catch (error) {
//       toast.error(`${error.message}`);
//       setShowLoading(false);
//     }
//   };

//   const handleCancelOffer = async () => {
//     try {
//       setShowLoading(true);
//       // console.log("Canceling Offer...");
//       const txHash = await EscrowServices.cancelOffer(
//         address,
//         walletClient,
//         offer.id
//       );
//       const txUrl = `${config.arbiscanUrl}${txHash}`;
//       toast.success(
//         <div>
//           Cancelled Offer! <br /> <br />{" "}
//           <a href={txUrl} target="_blank" rel="noopener noreferrer">
//             View transaction
//           </a>
//         </div>
//       );
//       setShowLoading(false);
//       // console.log("Completed Cancel Transaction********...");
//       await loadStates();
//       onBack();
//     } catch (error) {
//       toast.error(`${error.message}`);
//       setShowLoading(false);
//     }
//   };

//   const ethToUsd = async () => {
//     const priceEthURL =
//       "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
//     const resFetch = await fetch(priceEthURL);
//     const price = await resFetch.json();
//     setEthPrice(price["USD"]);
//     return;
//   };

//   function roundToLast4NonZeroDigits(num) {
//     let str = String(num);

//     // If the number is in exponential form, format it to have 4 decimal places
//     if (str.indexOf("e") !== -1) {
//       const [base, exponent] = str.split("e");
//       return `${parseFloat(base).toFixed(4)}e${exponent}`;
//     }

//     let nonZeroCount = 0;
//     let result = "";
//     let decimalFound = false;

//     for (let i = 0; i < str.length; i++) {
//       result += str[i];
//       if (str[i] !== "0" && str[i] !== ".") {
//         nonZeroCount++;
//       }
//       if (str[i] === ".") {
//         decimalFound = true;
//       }
//       if (nonZeroCount === 4 && decimalFound) {
//         break;
//       }
//     }

//     return parseFloat(result);
//   }

//   function shortenAddress(address) {
//     return address.slice(0, 8) + "...." + address.slice(-8);
//   }

//   function copyToClipboard(text) {
//     navigator.clipboard.writeText(text).then(
//       function () {
//         toast.success(<div>Copied to clipboard!</div>);
//         // console.log("Copying to clipboard was successful!");
//       },
//       function (err) {
//         console.error("Could not copy text: ", err);
//       }
//     );
//   }
//   console.log(offer);
//   const isOwner = offer.owner === address;

//   const forEther = swapOrder
//     ? offer.requested_assets?.asset_address ==
//       "0x0000000000000000000000000000000000000000"
//     : offer.owned_asset.asset_address ==
//       "0x0000000000000000000000000000000000000000";
//   if (swapOrder) {
//   }
//   const getData = async () => {
//     alert(forEther);
//     console.log("forEther >>>>", forEther);
//     // setShowLoading(true);
//     if (!forEther) {
//       console.log("****getting data for non-ether offer");
//       const offerAddress = toString(offer.owned_asset.asset_address);
//       const forAddress = offer.requested_assets[0]?.asset_address;
//       const token =
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? tokenMetadata
//             ? tokenMetadata.name
//             : offer.owned_asset.asset_address
//           : forAddress
//           ? forAddress.name
//           : offer.requested_assets[0]?.asset_address;
//       const tokenAddress =
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? offer.owned_asset.asset_address
//           : offer.requested_assets[0]?.asset_address;
//       const totalChunks = offer.amount / offer.owned_asset.chunk_size;
//       const offering = `${roundToLast4NonZeroDigits(
//         formatEther(offer.owned_asset.chunk_size * totalChunks)
//       )} ${
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? tokenMetadata
//             ? tokenMetadata.symbol
//             : offer.owned_asset.asset_address
//           : "ETH"
//       }`;

//       const forOffer = `${roundToLast4NonZeroDigits(
//         formatEther(offer.requested_assets[0]?.chunk_size * totalChunks)
//       )} ${
//         tokenMetadata
//           ? tokenMetadata.symbol
//           : forAddress !== "0x0000000000000000000000000000000000000000"
//           ? forAddress
//           : "ETH"
//       }`;
//       const offeringSymbol = `${
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? tokenMetadata
//             ? tokenMetadata.symbol
//             : offer.owned_asset.asset_address
//           : "ETH"
//       }`;
//       const totalRequested = formatEther(
//         offer.requested_assets[0]?.chunk_size * totalChunks
//       );
//       const nonEthTokenChunkSize =
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? offer.amount / totalChunks
//           : offer.requested_assets[0]?.chunk_size;
//       const ethTokenChunkSize =
//         offer.owned_asset.asset_address ===
//         "0x0000000000000000000000000000000000000000"
//           ? offer.amount / totalChunks
//           : offer.requested_assets[0]?.chunk_size;
//       const ethTokenChunkSizeInEth = formatEther(ethTokenChunkSize);
//       const nonEthTokenChunkSizeInEth = formatEther(nonEthTokenChunkSize);
//       const pricePerToken = roundToLast4NonZeroDigits(
//         ethTokenChunkSizeInEth / nonEthTokenChunkSizeInEth
//       );

//       const newOfferData = {
//         offerAddress: offerAddress,
//         forAddress: forAddress,
//         token: token,
//         tokenAddress: tokenAddress,
//         totalChunks: totalChunks,
//         offering: offering,
//         forOffer: forOffer,
//         offeringSymbol: offeringSymbol,
//         totalRequested: totalRequested,
//         nonEthTokenChunkSize: nonEthTokenChunkSize,
//         ethTokenChunkSize: ethTokenChunkSize,
//         ethTokenChunkSizeInEth: ethTokenChunkSizeInEth,
//         nonEthTokenChunkSizeInEth: nonEthTokenChunkSizeInEth,
//         pricePerToken: pricePerToken,
//       };
//       console.log(newOfferData);
//       console.log("dfsdf", ethTokenChunkSizeInEth);
//       setOfferData(newOfferData);
//       setSliderValue(nonEthTokenChunkSizeInEth);
//     } else {
//       console.log("****getting data for ether offer");

//       const offerAddress = toString(offer.owned_asset.asset_address);
//       const forAddress = offer.requested_assets[0]?.asset_address;
//       const token =
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? tokenMetadata
//             ? tokenMetadata.name
//             : offer.owned_asset.asset_address
//           : forAddress
//           ? forAddress.name
//           : offer.requested_assets[0]?.asset_address;
//       const tokenAddress =
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? offer.owned_asset.asset_address
//           : offer.requested_assets[0]?.asset_address;
//       const totalChunks = offer.amount / offer.owned_asset.chunk_size;
//       const offering = `${roundToLast4NonZeroDigits(
//         formatEther(offer.owned_asset.chunk_size * totalChunks)
//       )} ${
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? tokenMetadata
//             ? tokenMetadata.symbol
//             : offer.owned_asset.asset_address
//           : "ETH"
//       }`;

//       const forOffer = `${roundToLast4NonZeroDigits(
//         formatEther(offer.requested_assets[0]?.chunk_size * totalChunks)
//       )} ETH`;
//       const offeringSymbol = `${
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? tokenMetadata
//             ? tokenMetadata.symbol
//             : offer.owned_asset.asset_address
//           : "ETH"
//       }`;
//       const totalRequested = formatEther(
//         offer.requested_assets[0]?.chunk_size * totalChunks
//       );
//       const nonEthTokenChunkSize =
//         offer.owned_asset.asset_address !==
//         "0x0000000000000000000000000000000000000000"
//           ? offer.amount / totalChunks
//           : offer.requested_assets[0]?.chunk_size;
//       const ethTokenChunkSize =
//         offer.owned_asset.asset_address ===
//         "0x0000000000000000000000000000000000000000"
//           ? offer.amount / totalChunks
//           : offer.requested_assets[0]?.chunk_size;
//       const ethTokenChunkSizeInEth = formatEther(ethTokenChunkSize);
//       const nonEthTokenChunkSizeInEth = formatEther(nonEthTokenChunkSize);
//       const pricePerToken = roundToLast4NonZeroDigits(
//         ethTokenChunkSizeInEth / nonEthTokenChunkSizeInEth
//       );

//       const newOfferData = {
//         offerAddress: offerAddress,
//         forAddress: forAddress,
//         token: token,
//         tokenAddress: tokenAddress,
//         totalChunks: totalChunks,
//         offering: offering,
//         forOffer: forOffer,
//         offeringSymbol: offeringSymbol,
//         totalRequested: totalRequested,
//         nonEthTokenChunkSize: nonEthTokenChunkSize,
//         ethTokenChunkSize: ethTokenChunkSize,
//         ethTokenChunkSizeInEth: ethTokenChunkSizeInEth,
//         nonEthTokenChunkSizeInEth: nonEthTokenChunkSizeInEth,
//         pricePerToken: pricePerToken,
//       };
//       setOfferData(newOfferData);
//       setSliderValue(ethTokenChunkSizeInEth);
//     }
//     console.log("here ?????", offerData.totalRequested);
//     setShowLoading(false);
//   };

//   const fetchTokenDetails = async () => {
//     if (!forEther) {
//       const [balance, tokenSymbol, tokenName, priceInEth, timestamp] =
//         await EscrowServices.fetchTokenDetails(
//           address,
//           offer?.requested_assets[0]?.asset_address
//         );
//       setTokenBalance(balance);
//       setTokenMarketPriceInEth(priceInEth);
//       setTokenPriceInEthTimestamp(timestamp);
//     } else {
//       const [balance, tokenSymbol, tokenName, priceInEth, timestamp] =
//         await EscrowServices.fetchTokenDetails(
//           address,
//           offer?.owned_asset[0]?.asset_address
//         );
//       setTokenBalance(balance);
//       setTokenMarketPriceInEth(priceInEth);
//       setTokenPriceInEthTimestamp(timestamp);
//     }
//   };

//   const handleTakeOffer = () => {
//     alert(sliderValue);
//     alert(offerData.totalRequested);

//     console.log("pricedifference", priceDifference);
//     console.log("forether", forEther);
//     if (priceDifference < -5) {
//       setShowPopup(true);
//     } else {
//       if (!forEther) {
//         alert();
//         handleAcceptSingleOfferWithTokens();
//       } else {
//         handleAcceptSingleOfferWithCoins();
//       }
//     }
//   };

//   const handleYesClick = () => {
//     setShowPopup(false);
//     if (!forEther) {
//       handleAcceptSingleOfferWithTokens();
//     } else {
//       handleAcceptSingleOfferWithCoins();
//     }
//   };

//   const handleCancelClick = () => {
//     setShowPopup(false);
//   };

//   const offerPriceInUsd = offerData.pricePerToken * ethPrice;
//   const tokenMarketPriceInUsd = tokenMarketPriceInEth * ethPrice;
