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
import threading, jsonlines, io

client = OpenAI(
    api_key=os.environ.get("openAIKey"),
)


expressions=dict()
threads=[]


def convert_sentence(i,sentence):
    response = client.chat.completions.create(
    messages=[
        {
            "role":"system",
            "content":"Convert given sentence to simple expression"
        },
        {
            "role": "user",
            "content": sentence,
        }
    ],
    model=os.environ.get("phase2Model"),
    )
    expressions[f"{i}"]=str(response.choices[0].message.content)


def get_expressions(sentences):
    for i,sentence in enumerate(sentences):
        t=threading.Thread(target=convert_sentence,args=(i,sentence,))
        threads.append(t)
        t.start()
    for i,t in enumerate(threads):
        print(f"Converting sentence {i+1}/{len(threads)}")
        t.join()
    output=[]
    for i in range(len(sentences)):
        output.append(expressions[f"{i}"])
    return output
    


def getSentences(key):
    sentences=[]
    buffer=getFromS3(f"speech_marks/{key}.jsonl")
    with io.BytesIO(buffer.read()) as file:
        with jsonlines.Reader(file) as data:
            for obj in data:
                if obj['type']=='sentence':
                    sentences.append(obj['value'])
    return sentences


def main(key=os.environ.get("key")):
    sentences = getSentences(key)
    output = get_expressions(sentences)
    saveToS3(json.dumps(output),f"expressions/{key}.json")


def lambda_handler(event, context):
    try:
        y = json.loads(event["body"])
    except:
        y = event
    key = y["key"]
    main(key)
    return {"statusCode": 200}

