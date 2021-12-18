import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import { loadWallet, getBalance } from "@/utils/checkStatus";

interface IWalletHistory {
  wallettxid: string;
  amount: number;
  type: string;
  confirmed: boolean;
  height: number;
  pos: number;
  timestamp: number;
  memos: string[];
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const njs = require("navcoin-js");

const walletFile = "wallet_dev2"; // File name of the wallet database, persistence using dexie db backend only works on the browser
const password = undefined; // Password used to encrypt and open the wallet database
const spendingPassword = undefined; // Password used to send transactions
const mnemonic =
  "play service glimpse prevent dream marble genre romance chef become rhythm razor"; // Mnemonic to import 'problem shrimp bottom mouse canyon moment dirt beyond cage hazard phrase animal';
const type = "navcoin-js-v1"; // Wallet type next, navcoin-core or navcoin-js-v1
const zapwallettxes = false; // Should the wallet be cleared of its history?
const log = true; // Log to console
const network = "testnet";

const app = createApp(App).use(store).use(router);
let wallet = undefined;
njs.wallet.Init().then(async () => {
  wallet = await new njs.wallet.WalletFile({
    file: walletFile,
    mnemonic: mnemonic,
    type: type,
    password: password,
    spendingPassword: spendingPassword,
    zapwallettxes: zapwallettxes,
    log: log,
    network: network,
  });
  console.log(`library initialised`);

  loadWallet(wallet, njs);
  console.log(`getBalance`);
  //getBalance(wallet);
  app.config.globalProperties.$wallet = wallet;
});

app.mount("#app");
