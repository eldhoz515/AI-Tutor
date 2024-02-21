#!/usr/bin/env python
# coding: utf-8

import boto3
import os
import json, io, time

session = boto3.Session(profile_name="stryvia")
s3Client = session.client("s3")
from dotenv import load_dotenv

load_dotenv()


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


def getRenderIds(key):
    buffer=getFromS3(f"renderIds/{key}.json")
    with io.BytesIO(buffer.read()) as file:
        return json.load(file)


def isThereError(renderId):
    response = s3Client.list_objects(
        Bucket=os.environ.get("remotionBucket"), Prefix=f"renders/{renderId}/errors"
    )
    return len(response.get("Contents", [])) > 0


def downloadVideo(i, key, renderId):
    try:
        if not os.path.exists(f"../renders/{key}"):
            os.mkdir(f"../renders/{key}")
        s3Client.download_file(
            os.environ.get("remotionBucket"),
            f"renders/{renderId}/out.mp4",
            f"../renders/{key}/{i}.mp4",
        )
    except Exception as e:
        print(e, renderId)
        if isThereError(renderId):
            print("Fatal error")
            return
        time.sleep(20)
        downloadVideo(i, key, renderId)


def main(key=os.environ.get("key")):
    renderIds = getRenderIds(key)
    for i,renderId in enumerate(renderIds):
        print(f"Downloading {i+1}/{len(renderIds)}")
        downloadVideo(i,key,renderId)

