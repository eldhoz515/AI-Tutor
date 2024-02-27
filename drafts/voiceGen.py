#!/usr/bin/env python
# coding: utf-8

import boto3
import os
import json
import threading

if not os.environ.get("prod"):
    from dotenv import load_dotenv
    load_dotenv()
    session = boto3.Session(profile_name="stryvia")
    s3Client = session.client("s3")
    polly = session.client("polly")
else:
    s3Client = boto3.client("s3")
    polly = boto3.client("polly")


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


import io


def getAudio(speech,key):
    ssml=f"""<speak><prosody rate="100%">{speech}</prosody></speak>"""
    response = polly.synthesize_speech(
    Engine='neural',
    Text=ssml,
    OutputFormat="mp3",
    VoiceId="Matthew",
    TextType="ssml"
    )
    saveToS3(response["AudioStream"].read(),f"voices/{key}.mp3")


def getCaption(speech,key):
    ssml=f"""<speak><prosody rate="100%">{speech}</prosody></speak>"""
    response = polly.synthesize_speech(
    Engine='neural',
    Text=ssml,
    OutputFormat="json",
    VoiceId="Matthew",
    SpeechMarkTypes=["word","sentence"],
    TextType="ssml"
    )
    saveToS3(response["AudioStream"].read(),f"speech_marks/{key}.jsonl")


def getSpeech(key):
    buffer=getFromS3(f"sentences/{key}.json")
    with io.BytesIO(buffer.read()) as file:
        return json.load(file)


def main(key=os.environ.get("key")):
    speech = getSpeech(key)
    threads = []
    t1 = threading.Thread(target=getAudio, args=(speech, key))
    t1.start()
    print("Generating voice")
    t2 = threading.Thread(target=getCaption, args=(speech, key))
    t2.start()
    print("Generating caption")
    threads.extend([t1, t2])
    for t in threads:
        t.join()


def lambda_handler(event, context):
    try:
        y=json.loads(event["body"])
    except:
        y=event
    key=y["key"]
    main(key)
    return {
        'statusCode': 200,
    }

