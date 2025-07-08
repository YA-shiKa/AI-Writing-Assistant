import React from "react";
import ReactDOM from "react-dom/client";
import img from "./images/ai.png";
import "./index.css";

import { PrivyProvider } from "@privy-io/react-auth";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cmcpr96vi01szl40mhxd6lrvt"
      config={{
        // Display email and wallet as login methods
        loginMethods: ["email", "wallet", "google", "github"],
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: img,
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);
// G4xxqB5uSeqrQ3vKeMCvhS3Kc56svSbPLUxLohvREfbQDDKnry8gmJhkAHaM3fTGFZ5NFeSTvkGG2KcGiBFAE4z
// cmcpr96vi01szl40mhxd6lrvt  
