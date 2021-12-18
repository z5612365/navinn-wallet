<template>
  <div class="home">
    <label
      >paymentKey(xNav memo field):
      <input v-model="paymentKey" label="paymentKey" />
    </label>
    <label
      >xNavAmount:
      <input v-model="xNavAmount" />
    </label>
    <button
      type="submit"
      class="btn btn-primary fas fa-search"
      @click="sendXNav"
    >
      Send xNav
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, getCurrentInstance } from "vue";

import {
  checkPaymentStatus,
  getBalance,
  getHistory,
  xNavCreateTransaction,
} from "@/utils/checkStatus";

export default defineComponent({
  components: {},
  setup() {
    var payWalletAddr = ref(
      "xNTcTFmckpKoR6YAYTwcu41gcE7DQiQkmm8S2HR6Y7sKSNXSzyTB6NKcYd3LGoQ4dwpRRsbqnEDtxecV4d31Df7Ka4a8N9ioMuUUAkh5NxW2ZTrP6Qm57HnBwpTgWPEm4jsir7u9zfp"
    );
    var paymentKey = ref();
    var xNavAmount = ref();

    const internalInstance = getCurrentInstance();
    const sendXNav = () => {
      if (
        internalInstance != null &&
        typeof paymentKey.value !== "undefined" &&
        typeof xNavAmount.value !== "undefined"
      ) {
        console.log("payWalletAddr.value "+payWalletAddr.value);
        console.log("paymentKey.value "+paymentKey.value);
        console.log("xNavAmount.value "+xNavAmount.value);
        const history = xNavCreateTransaction(
          internalInstance.appContext.config.globalProperties.$wallet,
          payWalletAddr.value,
          paymentKey.value,
          xNavAmount.value
        );
      } else {
        console.log("Please Input value.");
      }
    };
    return {
      sendXNav,
      payWalletAddr,
      paymentKey,
      xNavAmount,
    };
  },
});
</script>
