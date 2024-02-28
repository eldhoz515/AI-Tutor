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


def saveStatus(status, key, query):
    print(status)
    saveToS3(
        json.dumps(dict(status=status, query=query, renderIds=None)),
        f"status/{key}.json",
    )


def invokeSlave(data):
    response = lambdaClient.invoke(
        FunctionName="ai_tutor_slave",
        InvocationType="Event",
        LogType="None",
        Payload=data,
    )


def main(query, key=os.environ.get("key")):
    print(key)
    try:
        saveStatus("init", key, query)
        invokeSlave(json.dumps(dict(query=query, key=key)))
    except:
        saveStatus("error", key, query)


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

