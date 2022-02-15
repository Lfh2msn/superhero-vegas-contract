<template>
  <div class="hello">
    <button @click="deploy">deploy</button>

    <br/>
    <button @click="add_market">add_market</button>

    <br/>
    <button @click="add_aggregator_user">add_aggregator_user</button>

    <br/>
    <button @click="submit_answer">submit_answer</button>

    <br/>
    <button @click="update_market_progress_to_wait">update_market_progress_to_wait</button>
    <button @click="private_update_market_progress_to_over">private_update_market_progress_to_over</button>

    <br/>
    <button @click="provide_answer">provide_answer</button>


    <br/>
    <button @click="update_market_progress_to_over">update_market_progress_to_over</button>


    <br/>
    <button @click="receive_reward">receive_reward</button>

  </div>
</template>

<script>


import {MemoryAccount, Node, Universal} from '@aeternity/aepp-sdk/'

import VegasMarketContract from "../contracts/VegasMarketContract"

const NETWORKS = require('../config/network.json');

const DEFAULT_NETWORK_NAME = 'mainnet';

const {defaultWallets: WALLETS} = require('../config/wallets.json');

let contract;
let marketId;
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted: function () {

  },

  methods: {
    deploy: async function () {
      const nodeInstance = await Node({url: NETWORKS[DEFAULT_NETWORK_NAME].nodeUrl});
      const sdkInstance = await Universal({
        compilerUrl: NETWORKS[DEFAULT_NETWORK_NAME].compilerUrl,
        nodes: [{name: DEFAULT_NETWORK_NAME, instance: nodeInstance}],
        accounts: [MemoryAccount({keypair: WALLETS[3]})],
      });
      contract = await sdkInstance.getContractInstance(VegasMarketContract);
      let ctAddress = await contract.deploy([{
        oracle_trigger_count: 0,
        market_min_time: -1,
        market_max_time: 86400000 * 30,
      }]);
      console.log(ctAddress.address);
    },

    add_market: async function () {
      const result = await contract.methods.add_market(
          "content",
          "source_url takes taking",
          10,
          0,
          [{
            content: "answer_content0",
            count: 0,
          }, {
            content: "answer_content1",
            count: 0,
          }]);
      marketId = result.decodedResult.market_id;
      console.log(marketId);
    },

    add_aggregator_user: async function () {
      const result = await contract.methods.add_aggregator_user(WALLETS[3].publicKey, "Baixin");
      console.log(JSON.stringify(result.decodedResult));
    },

    submit_answer: async function () {
      const result = await contract.methods.submit_answer(WALLETS[3].publicKey, marketId, 1, {amount: 10});
      console.log(JSON.stringify(result.decodedEvents[0].decoded));
    },

    update_market_progress_to_wait: async function () {
      const result = await contract.methods.update_market_progress_to_wait(WALLETS[3].publicKey, marketId);
      console.log(JSON.stringify(result.decodedResult));
    },

    provide_answer: async function () {
      const result = await contract.methods.provide_answer(WALLETS[3].publicKey, marketId, 1);
      console.log(JSON.stringify(result.decodedResult));
    },

    update_market_progress_to_over: async function () {
      const result = await contract.methods.update_market_progress_to_over(WALLETS[3].publicKey, marketId);
      console.log(JSON.stringify(result.decodedResult));
    },

    receive_reward: async function () {
      const result = await contract.methods.receive_reward(WALLETS[3].publicKey, marketId);
      console.log(JSON.stringify(result));
    },


    private_update_market_progress_to_over: async function () {
      const result = await contract.methods.receive_reward(WALLETS[3].publicKey, marketId);
      console.log(JSON.stringify(result));
    },

    get_state: async function () {
      const result = await contract.methods.get_state();
      console.log(JSON.stringify(result.decodedResult));
    },

  }

}
</script>
