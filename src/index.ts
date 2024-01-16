import { ethers } from 'ethers';
import * as dotenv from "dotenv"; 
import { Parser } from 'json2csv';
const fs = require('fs');

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
    console.log(" =================================== [Get Tx : Start] =================================== ");
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

    console.log(" =================================== [Get Tx : End] =================================== ");
    return transactions;
}

/**
 * 取得したトランザクションデータをCSVに変換する関数
 * @param jsonData トランザクションデータを格納したJsonファイル
 */
async function convert2Csv(jsonData: any) {
    console.log(" =================================== [Convert : Start] =================================== ");

    // JSONデータをCSVに変換
    const json2csvParser = new Parser();
    const csvData = json2csvParser.parse(jsonData);
    // CSVデータをファイルに書き込み
    fs.writeFileSync('./data/output.csv', csvData, 'utf-8');

    console.log('Conversion complete. CSV file created: data/output.csv');
    console.log(" =================================== [Convert : End] =================================== ");
}


/**
 * 任意の期間でのトランザクションデータを取得しCSVに変換するスクリプト
 */
async function main() {
    console.log(" =================================== [Start] =================================== ");

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

    await convert2Csv(JSON.parse(JSON.stringify(transactions)))

    console.log(" =================================== [End] =================================== ");
}

main()
    .catch((error) => {
        console.error("error:", error)
        process.exitCode = 1
    })