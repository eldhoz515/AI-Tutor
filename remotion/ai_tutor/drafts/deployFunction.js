import { deployFunction } from "@remotion/lambda";
import dotenv from 'dotenv';
dotenv.config();

const { functionName } = await deployFunction({
  region: process.env.region,
  timeoutInSeconds: 10*60,
  memorySizeInMb: 3008,
  createCloudWatchLogGroup: true,
  diskSizeInMb: 4096,
});
console.log(functionName);