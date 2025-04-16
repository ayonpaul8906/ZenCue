import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import './globals.css'


import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { sepolia } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'My App' }),
    walletConnect({ projectId: '86b83eeac6b83168e192bf784ba84428' }),
  ],
  transports: {
    [sepolia.id]: http(), // you can add your own RPC if needed
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider {...({ appId: import.meta.env.VITE_COINBASE_APP_ID } as any)}>
          <App />
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
