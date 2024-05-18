// https://www.youtube.com/watch?v=T7iNytkGIiQ
const fs = require("fs");
const corsConfig = require.resolve("s3rver/example/cors.xml");
const S3rver = require("s3rver");
let instance;

new S3rver({
  port: 9000,
  address: "127.0.0.1",
  accessKeyId: "root",
  accessKey: "password",
  silent: false,
  directory: "./data/s3",
  configureBuckets: [
    {
      name: "spend-snap",
      configs: [fs.readFileSync(corsConfig)],
    },
  ],
}).run();
