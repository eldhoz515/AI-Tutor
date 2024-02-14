import dotenv from 'dotenv';
import {renderMediaOnLambda} from '@remotion/lambda/client';
dotenv.config();

const response = await renderMediaOnLambda({
	region: 'us-east-1',
	functionName: process.env.remotionFunction,
	composition: 'HelloWorld',
	serveUrl: process.env.remotionServeUrl,
	codec: 'h264',
});

console.log(response);
