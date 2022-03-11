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

    <br/>
    <button @click="aex9_balance">aex9_balance</button>
  </div>
</template>

<script>


import {MemoryAccount, Node, Universal} from '@aeternity/aepp-sdk/'
import VegasMarketContract from "@/contracts/VegasMarketContract";


const NETWORKS = require('../config/network.json');
// const VegasMarketContractACI = require('../contracts/VegasMarketContract.json');
// const AEX9_ACI = require('../contracts/AEX9.json');

const DEFAULT_NETWORK_NAME = 'mainnet';

const {defaultWallets: WALLETS} = require('../config/wallets.json');



let contract;
let marketId;
let sdkInstance;
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted: function () {

  },

  methods: {
    deploy: async function () {
      let nodeInstance = await Node({url: NETWORKS[DEFAULT_NETWORK_NAME].nodeUrl});
      sdkInstance = await Universal({
        compilerUrl: NETWORKS[DEFAULT_NETWORK_NAME].compilerUrl,
        nodes: [{name: DEFAULT_NETWORK_NAME, instance: nodeInstance}],
        accounts: [MemoryAccount({keypair: WALLETS[0]})],
      });
      // contract = await sdkInstance.getContractInstance( {source:listTestContract});
      contract = await sdkInstance.getContractInstance( VegasMarketContract)
      // contract = await sdkInstance.getContractInstance( VegasMarketContract,{ contractAddress: "ct_tESY1ihBJzvKDgGu8rgrevpPd1EF6rSJs7oeVH16A2cW4F9ct" });
      // contract = await sdkInstance.getContractInstance({aci:AEX9_ACI, contractAddress: "ct_7UfopTwsRuLGFEcsScbYgQ6YnySXuyMxQWhw6fjycnzS5Nyzq" });
      // contract = await sdkInstance.getContractInstance(VegasMarketContract,{ aci: VegasMarketContractACI, contractAddress: "ct_MApycLJfLz8yxCkUkmUvCC1Lo9VkEDyAkrR8iaJAeny35KB89" });

      // let contractAci = await sdkInstance.contractGetACI( listTestContract);
      // console.log(JSON.stringify(contractAci));
      // console.log(contractAci);
      console.log(contract);


      // let ctAddress = await contract.deploy();
      // console.log(ctAddress.address);

      //
      let ctAddress = await contract.deploy([{
        oracle_trigger_count: 1,
        market_min_height: 1,
        market_max_height: 480 * 30,
        record_max_count: 3,
      }]);
      console.log(ctAddress.address);

      // await this.add_market();
      // await this.get_state();
      // await this.submit_answer();
      // await this.get_state();
      // await this.add_aggregator_user();
      // await this.get_state();
      // await this.update_market_progress_to_wait();
      // await this.get_state();
      // await this.provide_answer();
      // await this.get_state();
      // await this.update_market_progress_to_over();
      // await this.get_state();
      //
      // await this.receive_reward();
      // await this.get_state();


      // const result = await contract.methods.get_state();
      // console.log( result.decodedResult);
    },
    aex9_balance: async function () {
      const result = await contract.methods.balance("ak_idkx6m3bgRr7WiKXuB8EBYBoRqVsaSc6qo4dsd23HKgj3qiCF");
      console.log( result.decodedResult);
    },
    add_market: async function () {
      const height = await sdkInstance.height() + 480;
      const result = await contract.methods.add_market(
          "content",
          "source_url takes taking",
          10,
          height,
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
