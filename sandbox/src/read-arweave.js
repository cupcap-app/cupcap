const arweave = require("arweave");

const arweaveClient = arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000, // Network request timeouts in milliseconds
  logging: true,
});

async function main() {
  const transactionData = await arweaveClient.transactions.getData(
    // トランザクションID
    "iG0oTEOZXfEE3dvwt4t8juqI7uPqCiSCwDYug3JSgvs"
  );

  console.log(
    "transaction data",
    Buffer.from(transactionData, "base64").toString()
  );
}

main().catch(console.error);
