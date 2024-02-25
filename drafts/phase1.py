#!/usr/bin/env python
# coding: utf-8

import boto3
import os
import json

if not os.environ.get("prod"):
    session = boto3.Session(profile_name="stryvia")
    s3Client = session.client("s3")
    from dotenv import load_dotenv
    load_dotenv()
else:
    s3Client = boto3.client("s3")


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


from openai import OpenAI
    
client = OpenAI(
    api_key=os.environ.get("openAIKey"),
)


def get_response(query):
    response = client.chat.completions.create(
        messages=[
            {
                "role":"system",
                "content":"You are a teacher who uses analogy for everything"
            },
            {
                "role": "user",
                "content": query,
            }
        ],
        model=os.environ.get("phase1Model"),
    )
    return str(response.choices[0].message.content)


def main(query,key=os.environ.get("key")):
    data = get_response(query)
    saveToS3(json.dumps(data),f"sentences/{key}.json")
    return data


def lambda_handler(event, context):
    try:
        y=json.loads(event["body"])
    except:
        y=event
    
    query=y["query"]
    key=y["key"]
    output=main(query,key)
    
    return {
        'statusCode': 200,
        'body': json.dumps(output)
    }

