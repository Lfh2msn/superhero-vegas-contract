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


    <br/>
    <button @click="get_state">get_state</button>


  </div>
</template>

<script>


import {MemoryAccount, Node, Universal} from '@aeternity/aepp-sdk/'
import VegasMarketContract from "@/contracts/VegasMarketContract";

// import VegasMarketContract from "../contracts/VegasMarketContract"

const NETWORKS = require('../config/network.json');
// const VegasMarketContractACI = require('../contracts/VegasMarketContract.json');

const DEFAULT_NETWORK_NAME = 'mainnet';

const {defaultWallets: WALLETS} = require('../config/wallets.json');


// const listTestContract = `
//
// @compiler >= 6
//
// include "String.aes"
// include "List.aes"
//
//
// contract CryptoHamster =
//
//     record state = {
//         hamster : map(int,hamster)}
//
//     record hamster = {
//         children : list(chlidrenHamster),
//         name : string}
//
//     record chlidrenHamster = {
//         id : int,
//         name : string}
//
//     stateful entrypoint init() =
//         { hamster = {} }
//
//     stateful entrypoint setHamster(hamsters : list(chlidrenHamster)) =
//        put(state {hamster[0].children = hamsters})
//        hamsters
//
//     entrypoint
//         get_state:()=>state
//         get_state() =
//             state
//
// `

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
        accounts: [MemoryAccount({keypair: WALLETS[0]})],
      });
      // contract = await sdkInstance.getContractInstance( {source:listTestContract});
      contract = await sdkInstance.getContractInstance( VegasMarketContract,{ contractAddress: "ct_bM6qsr3fv5qtn43zXAPofrhQumubhcG6xSm5s9A97LPpgTZrq" });
      // contract = await sdkInstance.getContractInstance({source:VegasMarketContract, contractAddress: "ct_MApycLJfLz8yxCkUkmUvCC1Lo9VkEDyAkrR8iaJAeny35KB89" });
      // contract = await sdkInstance.getContractInstance(VegasMarketContract,{ aci: VegasMarketContractACI, contractAddress: "ct_MApycLJfLz8yxCkUkmUvCC1Lo9VkEDyAkrR8iaJAeny35KB89" });

      // let contractAci = await sdkInstance.contractGetACI( VegasMarketContract);
      // console.log(JSON.stringify(contractAci));
      // console.log(contractAci);
      console.log(contract);


      // let ctAddress = await contract.deploy();
      // console.log(ctAddress.address);
      // const result = await contract.methods.get_state();
      // console.log( result.decodedResult);
      //
      // let ctAddress = await contract.deploy([{
      //   oracle_trigger_count: 0,
      //   market_min_time: -1,
      //   market_max_time: 86400000 * 30,
      // }]);
      // console.log(ctAddress.address);
      // const result = await contract.methods.get_state();
      // console.log( result.decodedResult);
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
      const result = await contract.methods.add_aggregator_user(WALLETS[0].publicKey, "Baixin");
      console.log(JSON.stringify(result.decodedResult));
    },

    submit_answer: async function () {
      const result = await contract.methods.submit_answer(WALLETS[0].publicKey, marketId, 1, {amount: 10});
      console.log(JSON.stringify(result.decodedEvents[0].decoded));
    },

    update_market_progress_to_wait: async function () {
      const result = await contract.methods.update_market_progress_to_wait(WALLETS[0].publicKey, marketId);
      console.log(JSON.stringify(result.decodedResult));
    },

    provide_answer: async function () {
      const result = await contract.methods.provide_answer(WALLETS[0].publicKey, marketId, 1);
      console.log(JSON.stringify(result.decodedResult));
    },

    update_market_progress_to_over: async function () {
      const result = await contract.methods.update_market_progress_to_over(WALLETS[0].publicKey, marketId);
      console.log(JSON.stringify(result.decodedResult));
    },

    receive_reward: async function () {
      const result = await contract.methods.receive_reward(WALLETS[0].publicKey, marketId);
      console.log(JSON.stringify(result));
    },


    private_update_market_progress_to_over: async function () {
      const result = await contract.methods.receive_reward(WALLETS[0].publicKey, marketId);
      console.log(JSON.stringify(result));
    },

    get_state: async function () {
      const result = await contract.methods.get_state({gasPrice:1000000000,gas:1000000});
      console.log(JSON.stringify(result.decodedResult));
    },

  }

}
</script>
