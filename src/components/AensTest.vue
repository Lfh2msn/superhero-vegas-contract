<template>
    <div class="hello">

        ctAddress: <input type="text" ref="ctAddress" value="ct_3qFaQQyvnCucbjaXFZKjb4M6khU7HJoD6VNtenc3vywZZRVyZ" />
        aensName: <input type="text" ref="aensName" value="qwqwqwqwqwqm.chain" />

        <button @click="getSign">get_sign</button>
        <div>{{ delegationSignature }}</div>
        <br />
        <button @click="putName">putName</button>
        <button @click="raiseName">raiseName</button>
    </div>
</template>

<script>


import {MemoryAccount, Node, Universal} from '@aeternity/aepp-sdk/'


const NETWORKS = require('../config/network.json');
const DEFAULT_NETWORK_NAME = 'mainnet';
const {defaultWallets: WALLETS} = require('../config/wallets.json');
const AensMarketContract = require('../contracts/AensMarketContract.json');


// let contract;
let sdkInstance;
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        return {delegationSignature: ""}
    },
    mounted: function () {
    },

    methods: {
        deploy: async function () {
            await this.test();
        },
        getSign: async function () {
            let nodeInstance = await Node({url: NETWORKS[DEFAULT_NETWORK_NAME].nodeUrl});
            sdkInstance = await Universal({
                compilerUrl: NETWORKS[DEFAULT_NETWORK_NAME].compilerUrl,
                nodes: [{name: DEFAULT_NETWORK_NAME, instance: nodeInstance}],
                accounts: [MemoryAccount({keypair: WALLETS[0]})],
            });
            this.delegationSignature = await sdkInstance.createAensDelegationSignature(
                {
                    contractId: this.$refs.ctAddress.value,
                    name: this.$refs.aensName.value,
                }, {onAccount: WALLETS[0].publicKey}
            )
        },

        putName: async function () {
            let nodeInstance = await Node({url: NETWORKS[DEFAULT_NETWORK_NAME].nodeUrl});
            sdkInstance = await Universal({
                compilerUrl: NETWORKS[DEFAULT_NETWORK_NAME].compilerUrl,
                nodes: [{name: DEFAULT_NETWORK_NAME, instance: nodeInstance}],
                accounts: [MemoryAccount({keypair: WALLETS[0]})],
            });
            // console.log(JSON.stringify(AensMarketContract));
            // console.log(JSON.stringify(this.$refs.ctAddress.value));
            let contract = await sdkInstance.getContractInstance({
                aci: AensMarketContract,
                contractAddress: this.$refs.ctAddress.value
            })
            this.delegationSignature = await sdkInstance.createAensDelegationSignature(
                {
                    contractId: this.$refs.ctAddress.value,
                    name: this.$refs.aensName.value,
                }, {onAccount: WALLETS[0].publicKey}
            )
            await contract.methods.put_name(this.$refs.aensName.value, this.delegationSignature, 1000000, 100, {
                gasPrice: 1000000000,
                gas: 600000
            });

            const result = await contract.methods.get_state({gasPrice: 1000000000, gas: 600000});
            console.log(JSON.stringify(result.decodedResult, (_, v) => typeof v === 'bigint' ? v.toString() : v));


        },
        raiseName: async function () {
            let nodeInstance = await Node({url: NETWORKS[DEFAULT_NETWORK_NAME].nodeUrl});
            sdkInstance = await Universal({
                compilerUrl: NETWORKS[DEFAULT_NETWORK_NAME].compilerUrl,
                nodes: [{name: DEFAULT_NETWORK_NAME, instance: nodeInstance}],
                accounts: [MemoryAccount({keypair: WALLETS[0]})],
            });
            // console.log(JSON.stringify(AensMarketContract));
            // console.log(JSON.stringify(this.$refs.ctAddress.value));
            let contract = await sdkInstance.getContractInstance({
                aci: AensMarketContract,
                contractAddress: this.$refs.ctAddress.value
            })

            for (let i = 0; i < 10; i++) {

                let nameOrderDecode = await contract.methods.get_name_order(this.$refs.aensName.value);
                let nameOrder = nameOrderDecode.decodedResult;
                console.log(JSON.stringify(nameOrder, (_, v) => typeof v === 'bigint' ? v.toString() : v));

                let getNameNextRaisePriceDecode = await contract.methods.get_name_next_raise_price(nameOrder.left_amount);
                let getNameNextRaisePrice = getNameNextRaisePriceDecode.decodedResult
                console.log(getNameNextRaisePrice);

                let raiseNameDecode = await contract.methods.raise_name(this.$refs.aensName.value,{amount: Number(getNameNextRaisePrice)});
                let raiseName = raiseNameDecode.decodedResult
                console.log(raiseName);

            }
            let nameOrderDecode = await contract.methods.get_name_order(this.$refs.aensName.value);
            let nameOrder = nameOrderDecode.decodedResult;
            console.log(JSON.stringify(nameOrder, (_, v) => typeof v === 'bigint' ? v.toString() : v));

            // this.delegationSignature = await sdkInstance.createAensDelegationSignature(
            //     {
            //         contractId: this.$refs.ctAddress.value,
            //         name: this.$refs.aensName.value,
            //     }, {onAccount: WALLETS[0].publicKey}
            // )
            // await contract.methods.raise_name(this.$refs.aensName.value, this.delegationSignature, 1000, 100, {
            //     gasPrice: 1000000000,
            //     gas: 600000
            // });


        },

    }

}
</script>
