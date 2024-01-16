import { ethers } from 'ethers';
import * as dotenv from "dotenv"; 

dotenv.config();

/**
 * 過去のブロックデータを取得する関数
 * @param startBlock 取得開始ブロック
 * @param endBlock 取得終了ブロック
 */
async function getTransactionsInDay(
    provider: any,
    startBlock: number, 
    endBlock: number
): Promise<any> {
    // トランザクション用の配列
    let transactions: any = [];

    for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
      try {
        // get block Info
        const block = await provider.getBlockWithTransactions(blockNumber);
        
        if (block && block.transactions) {
          for (const txHash of block.transactions) {
            console.log("txHash:", txHash.hash)
            const transaction = await provider.getTransaction(txHash.hash);
            transactions.push(transaction);
          }
        }
      } catch (error: any) {
        console.error(`Error fetching block ${blockNumber}: ${error.message}`);
      }
    }

    return transactions;
}

/**
 * 任意の期間でのトランザクションデータを取得するスクリプト
 */
async function main() {
    console.log(" =================================== [Get Tx : Start] =================================== ");

    const infuraUrl = `https://sepolia.infura.io/v3/${process.env.API_KEY}`;
    // イーサリアムプロバイダーの作成
    const provider = new ethers.providers.JsonRpcProvider(infuraUrl);

    // 取得するブロック範囲を定義する。
    const secondsInDay = 0.0000001 * 60 * 60;
    const currentBlockNumber = await provider.getBlockNumber();
    const blocksPerDay = Math.ceil(secondsInDay / 15); // イーサリアムのブロック時間は約15秒
    const startBlockNumber = currentBlockNumber - blocksPerDay;
    // 開始ブロックから現在のブロックまでのトランザクションデータを取得
    const transactions = await getTransactionsInDay(provider, startBlockNumber, currentBlockNumber);

    console.log(`${JSON.stringify(transactions)}`)

    console.log(" =================================== [Get Tx : End] =================================== ");
}

main()
    .catch((error) => {
        console.error("error:", error)
        process.exitCode = 1
    })