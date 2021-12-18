const ENC_HEX = "hex";

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

export async function xNavCreateTransaction(
  wallet: any,
  payWalletAddr: string,
  paymentKey: string,
  xNavAmount: number
) {
  try {
    const txs = await wallet.xNavCreateTransaction(
      payWalletAddr,
      xNavAmount * 1e8,
      paymentKey
    );
    console.log(txs);
    const tx = await wallet.SendTransaction(txs.tx);
  } catch (e) {
    console.log(`error sending: ${e}`);
  }
}

export async function checkPaymentStatus(
  wallet: any,
  paymentKey: string,
  totalPrice: number
): Promise<string> {
  const history = await wallet.GetHistory();

  console.log(`history ${JSON.stringify(history)}`);
  console.log("history[0].memos " + history[0].memos);
  for (const index in history) {
    console.log("txn: " + JSON.stringify(history[index].memos));
    console.log("txn: " + history[index].amount);

    /*
    ,"amount":2500000000000
,"type":"xnav"
,"memos":{"in":[],"out":[""]}
*/
  }
  return new Promise<string>((resolve, reject) => {
    //resolve(history.data.success);
    resolve(history[0].memos === "0000" ? "Paid" : "Not Paid");
    // Or reject() if something wrong happened
    reject("Failed Update");
  });
}
async function updateWalletList(njs: any) {
  const wallets = await njs.wallet.WalletFile.ListWallets();
}

export async function getBalance(wallet: any) {
  const balance = JSON.stringify(await wallet.GetBalance());
  //console.log(`Balance ${balance}`);
  return balance;
  //return await wallet.GetBalance();
}

export async function getHistory(wallet: any) {
  const history = JSON.stringify(await wallet.GetHistory());
  //console.log(`history ${JSON.stringify(history)}`);
  return history;
}

export async function loadWallet(wallet: any, njs: any) {
  try {
    wallet.on("db_load_error", async (e: string) => {
      console.log("db_load_error");
    });

    wallet.on("db_closed", async () => {
      console.log("db_closed");
    });

    wallet.on("loaded", async () => {
      const history = await wallet.GetHistory();
      console.log("loaded");
      console.log(history);

      await wallet.Connect();
    });

    wallet.on("new_staking_address", async (a: any, b: any) => {
      console.log("new_staking_address");
    });

    wallet.on("sync_status", async (progress: number, pending: number) => {
      if (pending % 50 == 0) {
        const history: IWalletHistory[] = await wallet.GetHistory();
      }
    });

    wallet.on("sync_finished", async () => {
      const history: IWalletHistory[] = await wallet.GetHistory();
      console.log("sync_finished");
      console.log(history);
    });

    wallet.on("connected", (server: string) =>
      console.log(`connected to ${server}. waiting for sync`)
    );

    wallet.on("new_mnemonic", async (mnemonic: string) => {
      await updateWalletList(njs);
      console.log("new_mnemonic");
    });

    wallet.on("new_tx", async (entry: IWalletHistory) => {
      //console.log(entry);
      console.log("new_tx");
    });

    wallet.on("new_block", (height: number) => {
      console.log("new_block");
    });

    await wallet.Load({ bootstrap: njs.wallet.xNavBootstrap });
  } catch (e) {
    console.log(e);
  }
}
