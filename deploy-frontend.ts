import fs from "fs";             // File system
import {promisify} from "util";  // Utilities
import AWS from "aws-sdk";       // Amazon Web Services SDK
import mime from "mime-types";   // MIME types for ContentType
import yaml from "js-yaml";      // Parse .yaml files for config info
const stat = promisify(fs.stat); // Promisify file statistics

type PutObjects = Promise<AWS.S3.PutObjectOutput>;
interface Config {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  s3Bucket: string;
  CloudFrontDistributionId: string;
}

const config = yaml.load(fs.readFileSync("config.yml", "utf-8")) as Config;

// Configure AWS SDK
AWS.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});

const s3        : AWS.S3         = new AWS.S3({apiVersion: "2006-03-01"});
const cloudfront: AWS.CloudFront = new AWS.CloudFront({apiVersion: "2019-03-26"});

async function GetFiles(currentPath: string, promises: PutObjects[] = []): Promise<PutObjects[]> {
  for (const obj of fs.readdirSync(currentPath)) {
    const localPath = `${currentPath}/${obj}`;
    const stats: fs.Stats = await stat(localPath);
    let remotePath: string|string[] = localPath.split("/");
    remotePath.shift();
    remotePath = remotePath.join("/");

    if (stats.isDirectory()) {
      promises = await GetFiles(localPath, promises);
    } else {
      const putObject: PutObjects = s3.putObject({
        Bucket: config.s3Bucket,
        Key: `${remotePath}`,
        Body: fs.readFileSync(localPath),
        ContentType: mime.lookup(obj) as string,
        ACL: "public-read",
        StorageClass: "STANDARD",
        ServerSideEncryption: "AES256"
      }).promise();

      promises.push(putObject);
    }
  }
  return promises;
}

async function Main(): Promise<void> {
  let isTruncated = true;
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: config.s3Bucket,
    MaxKeys: 1000
  };

  console.log("Getting files...");

  while (isTruncated) {
    const data: AWS.S3.ListObjectsV2Output = await s3.listObjectsV2(params).promise();
    isTruncated = data.IsTruncated;

    const params2: AWS.S3.DeleteObjectsRequest = {
      Bucket: config.s3Bucket,
      Delete: {
        Objects: [],
        Quiet: false
      }
    };

    for (const obj of data.Contents) {
      params2.Delete.Objects.push({Key: obj.Key});
    }

    if (params2.Delete.Objects.length) {
      console.log("Deleting files...");
      await s3.deleteObjects(params2).promise();
    }
  }

  console.log("Uploading files...");
  const promises: PutObjects[] = await GetFiles("dist");
  await Promise.all(promises);
  console.log("...done");
  console.log("Creating invalidation");

  await cloudfront.createInvalidation({
    DistributionId: config.CloudFrontDistributionId,
    InvalidationBatch: {
      CallerReference: Date.now().toString(),
      Paths: {
        Quantity: 1,
        Items: ["/*"]
      }
    }
  }).promise();
}

Main();
