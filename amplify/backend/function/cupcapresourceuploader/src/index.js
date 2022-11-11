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
  transaction.addTag("Content-Type", file.type);

  await arweaveClient.transactions.sign(transaction, key);
  await arweaveClient.transactions.post(transaction);
  await arweaveClient.transactions.getData(transaction.id);

  return transaction.id;
};

const uploadJSON = async (data) => {
  const key = await fetchArweaveKey();

  const transaction = await arweaveClient.createTransaction(
    {
      data: data,
    },
    key
  );
  transaction.addTag("Content-Type", "application/json");

  await arweaveClient.transactions.sign(transaction, key);
  await arweaveClient.transactions.post(transaction);
  await arweaveClient.transactions.getData(transaction.id);

  return transaction.id;
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      body: "ok",
      headers: {
        // FIXME: CORS対策、後で必ず直す
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "POST,OPTIONS,PATCH",
        "Access-Control-Allow-Methods": "content-type",
      },
    };
  }

  if (event.httpMethod != "POST") {
    return {
      statusCode: 500,
      body: "invalid_method",
      headers: {
        // FIXME: CORS対策、後で必ず直す
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "POST,OPTIONS,PATCH",
        "Access-Control-Allow-Methods": "content-type",
      },
    };
  }

  // files
  try {
    const parsedData = await parser.parse(event);
    if (parsedData && parsedData.files && parsedData.files.length >= 0) {
      const results = await Promise.all(
        parsedData.files.map((f) => uploadFile(f))
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          type: "files",
          ids: results,
        }),
        headers: {
          // FIXME: CORS対策、後で必ず直す
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "POST,OPTIONS,PATCH",
          "Access-Control-Allow-Methods": "content-type",
        },
      };
    }
  } catch (err) {
    console.error(err);
  }

  if (event.body) {
    const id = await uploadJSON(event.body);

    return {
      statusCode: 200,
      body: JSON.stringify({
        type: "json",
        ids: [id],
      }),
      headers: {
        // FIXME: CORS対策、後で必ず直す
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "POST,OPTIONS,PATCH",
        "Access-Control-Allow-Methods": "content-type",
      },
    };
  }

  return {
    statusCode: 500,
    body: "empty",
    headers: {
      // FIXME: CORS対策、後で必ず直す
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "POST,OPTIONS,PATCH",
      "Access-Control-Allow-Methods": "content-type",
    },
  };
};
