import {
  getContract,
  formatEther,
  formatUnits,
  parseEther,
  formatGwei,
  toHex,
  encodePacked,
} from "viem";
import ABI_TOKEN from "../../abi/abi-token.json";
import ABI_ESCROW from "../../abi/abi-escrow.json";
import ABI_ROUTER from "../../abi/abi-router.json";
import ABI_FACTORY from "../../abi/abi-factory.json";
import ABI_UNIPAIR from "../../abi/abi-unipair.json";
import config from "../config";

const escrowAddress = config.escrowAddress;
const routerAddress = config.routerAddress;

const EscrowServices = {
  client: null,
  setClient: (publicClient) => {
    EscrowServices.client = publicClient;
  },

  ethToUsd: async () => {
    try {
      const priceEthURL =
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
      const resFetch = await fetch(priceEthURL);
      const price = await resFetch.json();
      return price["USD"];
    } catch (error) {
      console.error("Error fetching eth price:", error);
      return "0";
    }
  },

  fetchEthBalance: async (address) => {
    try {
      const balance = await EscrowServices.client.getBalance({
        address: address,
      });
      const balanceParse = parseFloat(formatEther(balance));
      const balanceRounded = balanceParse.toFixed(4);
      return balanceRounded;
    } catch (error) {
      console.error("Error fetching eth balance:", error);
      return "0";
    }
  },

  fetchTokenDetails: async (address, tokenAddress) => {
    try {
      const balance = await EscrowServices.client.readContract({
        address: tokenAddress,
        abi: ABI_TOKEN,
        functionName: "balanceOf",
        args: [address],
      });

      const balanceParse = parseFloat(formatEther(balance));
      const balanceRounded = balanceParse.toFixed(4);
      const balanceRoundedString = parseFloat(balanceRounded).toLocaleString(
        undefined,
        { minimumFractionDigits: 2 }
      );

      const tokenSymbol = await EscrowServices.client.readContract({
        address: tokenAddress,
        abi: ABI_TOKEN,
        functionName: "symbol",
      });

      const tokenName = await EscrowServices.client.readContract({
        address: tokenAddress,
        abi: ABI_TOKEN,
        functionName: "name",
      });

      const [priceInEth, timestamp] = await EscrowServices.fetchUniswapDetails(
        tokenAddress
      );

      return [
        balanceRoundedString,
        tokenSymbol,
        tokenName,
        priceInEth,
        timestamp,
      ];
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return "0";
    }
  },

  fetchUniswapDetails: async (tokenAddress) => {
    try {
      const factoryAddress = await EscrowServices.client.readContract({
        address: routerAddress,
        abi: ABI_ROUTER,
        functionName: "factory",
        args: [],
      });

      const wethAddress = await EscrowServices.client.readContract({
        address: routerAddress,
        abi: ABI_ROUTER,
        functionName: "WETH",
        args: [],
      });

      const pairAddress = await EscrowServices.client.readContract({
        address: factoryAddress,
        abi: ABI_FACTORY,
        functionName: "getPair",
        args: [tokenAddress, wethAddress],
      });

      // console.log("Pair Address:", pairAddress);
      // console.log("Token Address:", tokenAddress);

      // If no pair is found, return from the function
      if (pairAddress === "0x0000000000000000000000000000000000000000") {
        // console.log("No pair found for the given token address.");
        return ["0", "0"];
      }

      const [reserve0, reserve1, timestamp] =
        await EscrowServices.client.readContract({
          address: pairAddress,
          abi: ABI_UNIPAIR,
          functionName: "getReserves",
          args: [],
        });

      const priceInEth =
        parseFloat(formatEther(reserve0)) / parseFloat(formatEther(reserve1));

      // Convert to string and use regex to match the pattern
      let priceInEthString = priceInEth.toString();
      let match = priceInEthString.match(/(\d*\.\d{0,8}[1-9])/);

      // If a match is found, use it. Otherwise, use the original string
      let priceInEthRounded = match ? match[0] : priceInEthString;

      // ...
      // console.log("Price in ETH Rounded:", priceInEthRounded);
      // console.log("Price in ETH:", priceInEth);

      return [priceInEthRounded, timestamp];
    } catch (error) {
      console.error("Error fetching token balance:", error);
      return "0";
    }
  },

  createSingleTokenOffer: async (
    account,
    walletClient,
    ethAmount,
    amountOfTokens,
    chunkSize,
    tokenAddress
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const amountOfTokensInWei = parseEther(ethAmount);
        const chunkSizeInWei = parseEther(chunkSize);
        const chunkSizeString = chunkSizeInWei.toString();

        const numberOfChunks = amountOfTokensInWei / chunkSizeInWei;
        // return;
        const struct = [chunkSizeString, tokenAddress];

        const ethAmountInWei = parseEther(amountOfTokens);
        alert(ethAmountInWei);
        const { request } = await EscrowServices.client.simulateContract({
          account,
          address: escrowAddress,
          abi: ABI_ESCROW,
          functionName: "create_single_token_offer",
          value: parseEther("1"),
          args: [struct, numberOfChunks, ethAmount, heldAssetAddress],
        });

        const hash = await walletClient.writeContract(request);
        const transaction =
          await EscrowServices.client.waitForTransactionReceipt({ hash: hash });

        resolve(hash);
      } catch (e) {
        reject(e);
      }
    });
  },

  createSingleCoinOffer: async (
    account,
    walletClient,
    ethAmount,
    amountOfTokens,
    chunkSize,
    tokenAddress
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        const amountOfTokensInWei = parseEther(amountOfTokens);

        const chunkSizeInWei = parseEther(chunkSize);
        const chunkSizeString = chunkSizeInWei.toString();
        console.log("amountOfTokensInWei>>>", amountOfTokens);
        console.log("chunkSizeInWei>>>", chunkSizeInWei);
        console.log("tokenaddress >>>", tokenAddress);
        const numberOfChunks = amountOfTokensInWei / chunkSizeInWei;
        alert(numberOfChunks);

        const struct = [chunkSizeString, tokenAddress];

        const ethAmountInWei = parseEther(ethAmount);

        const { request } = await EscrowServices.client.simulateContract({
          account,
          address: escrowAddress,
          abi: ABI_ESCROW,
          functionName: "create_single_coin_offer",
          value: ethAmountInWei,
          args: [struct, numberOfChunks],
        });

        const hash = await walletClient.writeContract(request);
        const transaction =
          await EscrowServices.client.waitForTransactionReceipt({ hash: hash });

        resolve(hash);
      } catch (e) {
        reject(e);
      }
    });
  },
  cancelOffer: async (account, walletClient, offerId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { request } = await EscrowServices.client.simulateContract({
          account,
          address: escrowAddress,
          abi: ABI_ESCROW,
          functionName: "cancel_offer",
          args: [offerId],
        });

        const hash = await walletClient.writeContract(request);
        const transaction =
          await EscrowServices.client.waitForTransactionReceipt({ hash: hash });

        resolve(hash);
      } catch (e) {
        reject(e);
      }
    });
  },

  fetchTotalOffers: async () => {
    try {
      const totalOffers = await EscrowServices.client.readContract({
        address: escrowAddress,
        abi: ABI_ESCROW,
        functionName: "total_offers",
      });
      // console.log("Total Offers", totalOffers);
      return totalOffers;
    } catch (error) {
      console.error("Error fetching total offers:", error);
      return "0";
    }
  },

  readOffer: async (offerId) => {
    try {
      const offer = await EscrowServices.client.readContract({
        address: escrowAddress,
        abi: ABI_ESCROW,
        functionName: "read_offer",
        args: [offerId],
      });
      // console.log("Offer - in EscrowServices", offer);
      return [offerId, offer];
    } catch (error) {
      console.error("Error fetching offer:", error);
      return "0";
    }
  },

  acceptSingleOfferWithCoins: async (
    account,
    walletClient,
    offerId,
    tokenAmount
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("Converting to Wei...");
        const tokenAmountInWei = parseEther(tokenAmount);

        const { request } = await EscrowServices.client.simulateContract({
          account,
          address: escrowAddress,
          abi: ABI_ESCROW,
          functionName: "accept_single_offer_with_coins",
          value: tokenAmountInWei,
          args: [offerId],
        });

        const hash = await walletClient.writeContract(request);
        const transaction =
          await EscrowServices.client.waitForTransactionReceipt({ hash: hash });

        resolve(hash);
      } catch (e) {
        reject(e);
      }
    });
  },
};

export default EscrowServices;
