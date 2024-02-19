import { getOrCreateBucket } from "@remotion/lambda";
import dotenv from 'dotenv';
dotenv.config();

const { bucketName } = await getOrCreateBucket({ region: process.env.region });

console.log(bucketName); 