#!/usr/bin/env python
# coding: utf-8

import boto3
import os
import json

if not os.environ.get("prod"):
    session = boto3.Session(profile_name="stryvia")
    s3Client = session.client("s3")
    lambdaClient=session.client('lambda')
    from dotenv import load_dotenv
    load_dotenv()
else:
    s3Client = boto3.client("s3")
    lambdaClient=boto3.client('lambda')


def saveToS3(body, path):
    response = s3Client.put_object(
        Body=body,
        Bucket="ai-tutor-s3",
        Key=path,
    )


def getFromS3(path):
    bucket = "ai-tutor-s3"
    response = s3Client.get_object(Bucket=bucket, Key=path)
    return response["Body"]


query=None
renderIds=None


def invokeLambda(functionName,data):
    response = lambdaClient.invoke(
        FunctionName=functionName,
        InvocationType="RequestResponse",
        LogType="None",
        Payload=data,
    )


def saveStatus(status,key):
    print(status)
    saveToS3(json.dumps(dict(status=status,query=query,renderIds=renderIds)),f"status/{key}.json")


def main(query, key=os.environ.get("key")):
    print(key)
    saveStatus("init", key)
    invokeLambda("ai_tutor_phase1", json.dumps(dict(query=query, key=key)))
    saveStatus("phase1", key)
    invokeLambda("ai_tutor_voiceGen", json.dumps(dict(key=key)))
    saveStatus("voiceGen", key)
    invokeLambda("ai_tutor_phase2", json.dumps(dict(key=key)))
    saveStatus("phase2",key)
    invokeLambda("ai_tutor_processor", json.dumps(dict(key=key)))
    saveStatus("processed",key)


def lambda_handler(event, context):
    try:
        y=json.loads(event["body"])
    except:
        y=event
    
    query=y["query"]
    key=y["key"]
    main(query,key)
    
    return {
        'statusCode': 200,
    }

