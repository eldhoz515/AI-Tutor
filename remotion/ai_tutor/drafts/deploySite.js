import { deploySite } from "@remotion/lambda";
import { enableTailwind } from "@remotion/tailwind";
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

const webpackOverride = (currentConfiguration) => {
  return enableTailwind(currentConfiguration);
};

const { serveUrl } = await deploySite({
  entryPoint: path.resolve(process.cwd(), "../src/index.ts"),
  bucketName: process.env.bucketName,
  region: process.env.region,
  siteName:'AiTutor',
  options: {
    webpackOverride,
    onBundleProgress: (progress) => {
      // Progress is between 0 and 100
      console.log(`Bundle progress: ${progress}%`);
    },
    onUploadProgress: ({
      totalFiles,
      filesUploaded,
      totalSize,
      sizeUploaded,
    }) => {
      console.log(
        `Upload progress: Total files ${totalFiles}, Files uploaded ${filesUploaded}, Total size ${totalSize}, Size uploaded ${sizeUploaded}`,
      );
    },
  },
});
console.log(serveUrl);