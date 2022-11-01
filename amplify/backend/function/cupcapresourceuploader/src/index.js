const aws = require("aws-sdk");
const parser = require("/opt/node_modules/lambda-multipart-parser");
const arweave = require("/opt/node_modules/arweave");

const BUCKET_NAME = process.env.BUCKET_NAME;
const ARWEAVE_KEY_FILE_NAME = process.env.ARWEAVE_KEY_FILE_NAME;

const s3 = new aws.S3({ apiVersion: "2006-03-01" });

const arweaveClient = arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000, // Network request timeouts in milliseconds
  logging: true,
});

const fetchArweaveKey = async () => {
  const { Body } = await s3
    .getObject({
      Bucket: BUCKET_NAME,
      Key: ARWEAVE_KEY_FILE_NAME,
    })
    .promise();

  return JSON.parse(Body.toString("utf-8"));
};

const uploadFile = async (file) => {
  const key = await fetchArweaveKey();

  const transaction = await arweaveClient.createTransaction(
    {
      data: file.content,
    },
    key
  );

  await arweaveClient.transactions.sign(transaction, key);
  await arweaveClient.transactions.post(transaction);
  await arweaveClient.transactions.getData(transaction.id);

  return transaction.id;
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  if (event.httpMethod != "POST") {
    return {
      statusCode: 500,
      body: "invalid_method",
    };
  }

  const parsedData = await parser.parse(event);

  if (!parsedData.files || parsedData.files.length === 0) {
    return {
      statusCode: 500,
      body: "no_files",
    };
  }

  const results = await Promise.all(parsedData.files.map((f) => uploadFile(f)));

  return {
    statusCode: 200,
    body: JSON.stringify(results),
  };
};
