import { deployFunction } from "@remotion/lambda";
import dotenv from 'dotenv';
dotenv.config();

const { functionName } = await deployFunction({
  region: process.env.region,
  timeoutInSeconds: 120,
  memorySizeInMb: 2048,
  createCloudWatchLogGroup: true,
  diskSizeInMb: 2048,
});
console.log(functionName);