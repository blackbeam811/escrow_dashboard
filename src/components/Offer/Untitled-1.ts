// const loadStates = async () => {
//     EscrowServices.setClient(publicClient);
//   };

//   useEffect(() => {
//     if (isConnected && currentChain?.id === config.arbitrumChainId) {
//       loadStates();
//       const img = new Image();
//       img.src = img;

//       ethToUsd();
//     }
//   }, [address, isConnected, currentChain]);
//   useEffect(() => {
//     // if (!tokenMetadata.length) setShowLoading(true);
//     const fetchTokenMetadata = async () => {
//       const newTokenMetadata = { ...tokenMetadata };
//       const newLoadedTokens = { ...loadedTokens };
//       for (const offer of offers) {
//         if (
//           offer.owned_asset.asset_address !==
//             "0x0000000000000000000000000000000000000000" &&
//           !newTokenMetadata[offer.owned_asset.asset_address]
//         ) {
//           console.log("offer.forEach is running");
//           try {
//             const assetAddress = await alchemy.core.getTokenMetadata(
//               offer.owned_asset.asset_address
//             );
//             const {
//               name: tokenName,
//               symbol: tokenSymbol,
//               decimals: tokenDecimals,
//             } = assetAddress;

//             const [marketPrice, timestamp] =
//               await EscrowServices.fetchUniswapDetails(
//                 offer.owned_asset.asset_address
//               );
//             if (tokenName === "Token") console.log("token", tokenName);
//             newTokenMetadata[offer.owned_asset.asset_address] = {
//               name: tokenName,
//               symbol: tokenSymbol,
//               decimals: tokenDecimals,
//               marketPrice: marketPrice,
//               timestamp: timestamp,
//             };
//           } catch (error) {
//             console.error(error);
//           }
//         }

//         for (const requestedAsset of offer.requested_assets) {
//           if (
//             requestedAsset.asset_address !==
//               "0x0000000000000000000000000000000000000000" &&
//             !newTokenMetadata[requestedAsset.asset_address] &&
//             !newLoadedTokens[requestedAsset.asset_address]
//           ) {
//             console.log("offer.requested_assets.forEach is running");

//             try {
//               const equivalentAssetAddress =
//                 await alchemy.core.getTokenMetadata(
//                   requestedAsset.asset_address
//                 );
//               const {
//                 name: tokenName,
//                 symbol: tokenSymbol,
//                 decimals: tokenDecimals,
//               } = equivalentAssetAddress;

//               console.log("Token Name:", tokenName);
//               console.log("Token Symbol:", tokenSymbol);
//               console.log("Token Decimals:", tokenDecimals);
//               console.log("jan", requestedAsset.asset_address);
//               const [marketPrice, timestamp] =
//                 await EscrowServices.fetchUniswapDetails(
//                   requestedAsset.asset_address
//                 );

//               newLoadedTokens[requestedAsset.asset_address] = true;

//               newTokenMetadata[requestedAsset.asset_address] = {
//                 name: tokenName,
//                 symbol: tokenSymbol,
//                 decimals: tokenDecimals,
//                 marketPrice: marketPrice,
//                 timestamp: timestamp,
//               };
//             } catch (error) {
//               console.error(error);
//             }
//           }
//         }
//       }
//       // setSortedOffers([...offers].sort((a, b) => b.id - a.id));

//       Object.keys(newTokenMetadata).map((i) => {
//         if (i[0] !== "0") delete newTokenMetadata[i];
//       });

//       dispatch(setTokenMetadatas({ tokenMetadatas: newTokenMetadata }));
//       dispatch(setLoadedTokens({ newLoadedTokens: newLoadedTokens }));
//       // setTokenMetadata(newTokenMetadata);
//       // setLoadedTokens(newLoadedTokens);
//       setShowLoading(false);
//     };

//     if (offers?.length) fetchTokenMetadata();
//   }, [offers]);

//   useEffect(() => {
//     setSortOrder(0);
//     if (!offers?.length) setShowLoading(true);
//     if (!loadedOffers && isConnected) {
//       setLoadedOffers(true);
//       const fetchPastOffers = async () => {
//         const totalOffers = await EscrowServices.fetchTotalOffers();
//         const tempOffers = [];
//         for (let i = 1; i <= totalOffers; i++) {
//           const [offerId, offerData] = await EscrowServices.readOffer(i);
//           const offer = { ...offerData, id: offerId };
//           console.log("offer", offer);
//           tempOffers.push(offer);
//         }

//         console.log("tempoffers", tempOffers === "[]");
//         if (tempOffers) dispatch(setOffers({ offers: tempOffers }));
//         // setOffers(tempOffers);
//       };
//       fetchPastOffers();

//       const handleEventLogs = (logs) => {
//         // console.log(logs);
//         //loadStates();
//         loadData();
//       };

//       // Watching for contract events
//       const unwatch = EscrowServices.client.watchContractEvent({
//         address: escrowAddress,
//         abi: ABI_ESCROW,
//         eventName: "SingleOfferCreated",
//         onLogs: handleEventLogs,
//       });

//       return () => {
//         unwatch();
//       };
//     }
//   }, []);

//   const toggleView = () => {
//     setIsCardView(!isCardView);
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
//     // console.log("str", str);

//     // If the number is in exponential form, format it to have 4 decimal places
//     if (str.indexOf("e") !== -1) {
//       const [base, exponent] = str.split("e");
//       return `${parseFloat(base).toFixed(4)}e${exponent}`;
//     }

//     let nonZeroCount = 0;
//     let result = "";
//     let decimalFound = false;

//     for (let i = 0; i < str?.length; i++) {
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
