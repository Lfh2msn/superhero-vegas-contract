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
            accounts: [MemoryAccount({keypair: WALLETS[0]})],
            address: WALLETS[0].publicKey
        });
        try {
            // a filesystem object must be passed to the compiler if the contract uses custom includes
            const filesystem = contractUtils.getFilesystem(EXAMPLE_CONTRACT_SOURCE);
            // get content of contract
            const contract_content = contractUtils.getContractContent(EXAMPLE_CONTRACT_SOURCE);
            // initialize the contract instance
            contract = await client.getContractInstance(contract_content, {filesystem});
        } catch (err) {
            console.error(err);
            assert.fail('Could not initialize contract instance');
        }
    });

    it('Should deploy VegasMarketContact', async () => {
        let ctAddress = await contract.deploy([]);
        console.log(ctAddress.address);
    });


    it('Should add_market VegasMarketContact', async () => {
        const result = await contract.methods.add_market(
            "content",
            "source_url takes taking",
            1,
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

    it('Should add_aggregator_user VegasMarketContact', async () => {
        const result = await contract.methods.add_aggregator_user(WALLETS[0].publicKey,"Baixin");
        console.log(JSON.stringify(result.decodedResult));
    });



    it('Should submit_answer VegasMarketContact', async () => {
        const result = await contract.methods.submit_answer(WALLETS[0].publicKey,marketId,0,{amount : 10});
        console.log(JSON.stringify(result.decodedEvents[0].decoded));
    });



    it('Should update_market_progress_to_wait VegasMarketContact', async () => {
        const result = await contract.methods.update_market_progress_to_wait(WALLETS[0].publicKey,marketId);
        console.log(JSON.stringify(result.decodedResult));
    });

    it('Should provide_answer VegasMarketContact', async () => {
        const result = await contract.methods.provide_answer(WALLETS[0].publicKey,marketId,1);
        console.log(JSON.stringify(result.decodedResult));
    });

    it('Should update_market_progress_to_over VegasMarketContact', async () => {
        const result = await contract.methods.update_market_progress_to_over(WALLETS[0].publicKey,marketId,1);
        console.log(JSON.stringify(result.decodedResult));
    });



    it('Should receive_reward VegasMarketContact', async () => {
        const result = await contract.methods.receive_reward(WALLETS[0].publicKey,marketId);
        console.log(JSON.stringify(result));
    });



    it('Should get_state VegasMarketContact', async () => {
        const result = await contract.methods.get_state();

        console.log(JSON.stringify(result.decodedResult));
    });
    //86400000

    // it('Should check if hamster has been created', async () => {
    //     hamsterName = 'C.Hamster';
    //     await contract.methods.createHamster(hamsterName);
    //     const result = await contract.methods.nameExists(hamsterName);
    //     assert.isTrue(result.decodedResult, 'hamster has not been created');
    // });
    //
    // it('Should REVERT if hamster already exists', async () => {
    //     try {
    //         await contract.methods.createHamster('C.Hamster');
    //         assert.fail(`createHamster didn't fail`);
    //     } catch(err) {
    //         assert.include(err.message, 'Name is already taken', `expected error message doesn't exist`);
    //     }
    // });
    //
    // it('Should return false if name does not exist', async () => {
    //     hamsterName = 'DoesHamsterExist';
    //     const result = await contract.methods.nameExists(hamsterName);
    //     assert.isFalse(result.decodedResult);
    // });
    //
    // it('Should return true if the name exists', async () => {
    //     hamsterName = 'DoesHamsterExist';
    //     await contract.methods.createHamster(hamsterName)
    //     const result = await contract.methods.nameExists(hamsterName);
    //     assert.isTrue(result.decodedResult)
    // });
});
