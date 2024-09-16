import "./App.css";
import { WagmiConfig } from "wagmi";
import { useRainbowkit } from "./components/services/rainbowkit";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Dashboard from "./components/Offer";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function EscrowApp() {
  const { wagmiClient, chains } = useRainbowkit();

  return (
    <WagmiConfig config={wagmiClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div className="App">
          <RainbowKitProvider chains={chains}>
            <Dashboard />
          </RainbowKitProvider>
        </div>
      </ThemeProvider>
    </WagmiConfig>
  );
}
