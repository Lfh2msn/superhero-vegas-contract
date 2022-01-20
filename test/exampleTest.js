/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */
const chai = require('chai');
const assert = chai.assert;

const {Universal, MemoryAccount, Node} = require('@aeternity/aepp-sdk');

const NETWORKS = require('../config/network.json');
const NETWORK_NAME = "testnet";

const {defaultWallets: WALLETS} = require('../config/wallets.json');

const contractUtils = require('../utils/contract-utils');
const EXAMPLE_CONTRACT_SOURCE = './contracts/VegasMarketContact.aes';

describe('VegasMarketContact', () => {
    let contract;
    let marketId;
    before(async () => {
        const node = await Node({url: NETWORKS[NETWORK_NAME].nodeUrl});
        const client = await Universal({
            nodes: [
                {name: NETWORK_NAME, instance: node},
            ],
            compilerUrl: NETWORKS[NETWORK_NAME].compilerUrl,
            accounts: [MemoryAccount({keypair: WALLETS[3]})],
            address: WALLETS[3].publicKey
        });
        try {
            // a filesystem object must be passed to the compiler if the contract uses custom includes
            const filesystem = contractUtils.getFilesystem(EXAMPLE_CONTRACT_SOURCE);
            // get content of contract
            const contract_content = contractUtils.getContractContent(EXAMPLE_CONTRACT_SOURCE);
            // initialize the contract instance
            contract = await client.getContractInstance(contract_content, {filesystem});
            // contract = await client.getContractInstance(contract_content, {filesystem,contractAddress: "ct_2eedqnaUarwJ4Gf796hxXYqJhhsan2jows22RbQqsG67QrrU28"});
        } catch (err) {
            console.error(err);
            assert.fail('Could not initialize contract instance');
        }
    });

    it('Should deploy VegasMarketContact', async () => {
        let ctAddress = await contract.deploy([{
            oracle_trigger_count: 0,
            market_min_time: -1,
            market_max_time: 86400000 * 30,
        }]);
        console.log(ctAddress.address);
    });


    it('Should add_market VegasMarketContact', async () => {
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

    });
    //true is public ,false is private market
    if(true){



        it('Should add_aggregator_user VegasMarketContact', async () => {
            const result = await contract.methods.add_aggregator_user(WALLETS[3].publicKey,"Baixin");
            console.log(JSON.stringify(result.decodedResult));
        });
        //
        //
        //
        it('Should submit_answer VegasMarketContact', async () => {
            const result = await contract.methods.submit_answer(WALLETS[3].publicKey,marketId,1,{amount : 10});
            console.log(JSON.stringify(result.decodedEvents[0].decoded));
        });
        //
        //
        //
        it('Should update_market_progress_to_wait VegasMarketContact', async () => {
            const result = await contract.methods.update_market_progress_to_wait(WALLETS[3].publicKey,marketId);
            console.log(JSON.stringify(result.decodedResult));
        });
        //
        it('Should provide_answer VegasMarketContact', async () => {
            const result = await contract.methods.provide_answer(WALLETS[3].publicKey,marketId,1);
            console.log(JSON.stringify(result.decodedResult));
        });
        //
        it('Should update_market_progress_to_over VegasMarketContact', async () => {
            const result = await contract.methods.update_market_progress_to_over(WALLETS[3].publicKey,marketId);
            console.log(JSON.stringify(result.decodedResult));
        });


        it('Should receive_reward VegasMarketContact', async () => {
            try{
                const result = await contract.methods.receive_reward(WALLETS[3].publicKey,marketId);
                console.log(JSON.stringify(result));
            }catch (e) {
                console.log(e);
            }
        });
        //
        //
        //
        it('Should get_state VegasMarketContact', async () => {
            const result = await contract.methods.get_state();

            console.log(JSON.stringify(result.decodedResult));
        });
    }else{


        it('Should submit_answer VegasMarketContact', async () => {
            const result = await contract.methods.submit_answer(WALLETS[3].publicKey,marketId,1,{amount : 10});
            console.log(JSON.stringify(result.decodedEvents[0].decoded));
        });

        it('Should private_update_market_progress_to_over VegasMarketContact', async () => {
            const result = await contract.methods.private_update_market_progress_to_over(WALLETS[3].publicKey,marketId,1);
            console.log(JSON.stringify(result.decodedResult));
        });


        it('Should receive_reward VegasMarketContact', async () => {
            try{
                const result = await contract.methods.receive_reward(WALLETS[3].publicKey,marketId);
                console.log(JSON.stringify(result));
            }catch (e) {
                console.log(e);
            }
        });
        //
        //
        //
        it('Should get_state VegasMarketContact', async () => {
            const result = await contract.methods.get_state();

            console.log(JSON.stringify(result.decodedResult));
        });
    }

});
