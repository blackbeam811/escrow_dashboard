import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  // bsc,
  // bscTestnet,
  // goerli,
  // mainnet,
  arbitrumSepolia,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    //bsc,
    // bscTestnet,
    // goerli,
    // mainnet,
    arbitrumSepolia,
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://arb-sepolia.g.alchemy.com/v2/MoQEod0sDR05X_0W6nlALI9ikmzlqPdv`,
      }),
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "OTC Dashboard",
  projectId: "fa413f02c51134e9d6718b63e91a8756",
  chains,
});

const wagmiClient = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

export function useRainbowkit() {
  return { wagmiClient, chains };
}
