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


import requests, os, re, threading, jsonlines, json, io, math
from collections import defaultdict
import time

splitSymbols = ["=", "+", "&", "->"]


renderIds=dict()
videos=dict()
images=dict()
sampleProps=[]


def getAssetUrl(query):
    # return os.environ.get("blackVideoUrl")
    url = f"https://api.pexels.com/videos/search?query={query}&per_page=1&size=small&orientation=landscape"
    headers = {"Authorization": os.environ.get("pexelsKey")}
    try:
        response = requests.get(url=url, headers=headers)
        data=response.json()
        return data['videos'][0]['video_files'][0]['link']
    except Exception as e:
        print(e)
        return os.environ.get("blackVideoUrl")


def getGoogleImage(query):
    # return os.environ.get("blackImageUrl")
    try:
        response=requests.post(os.environ.get("imageScraper"),json=dict(query=query))
        return response.json()
    except Exception as e:
        print(e)
        return os.environ.get("blackImageUrl")


def cleanExpression(expression):
    return expression.replace('.','').replace('(','').replace(')','').strip()


def processExpression(i, expression,fakeProcess=False):
    try:
        format = {}

        for symbol in splitSymbols:
            if symbol in expression:
                format["operation"] = symbol
                format["content"] = []
                for part in expression.split(symbol):
                    if len(part):
                        format["content"].append(processExpression(i, part, fakeProcess))
                return format

        if "\u201c" in expression:
            format["operation"] = "verb"
            format["content"] = []
            pattern = r"\u201c(.*?)\u201d"
            withoutVerb = re.sub(pattern, "$$", expression)
            format["verb"] = cleanExpression(re.findall(pattern, expression)[0])
            for part in withoutVerb.split("$$"):
                if len(part):
                    format["content"].append(processExpression(i, part, fakeProcess))
            return format
        if "'" in expression:
            format["operation"] = "verb"
            format["content"] = []
            pattern = r"\'(.*?)\'"
            withoutVerb = re.sub(pattern, "$$", expression)
            format["verb"] = cleanExpression(re.findall(pattern, expression)[0])
            for part in withoutVerb.split("$$"):
                if len(part):
                    format["content"].append(processExpression(i, part, fakeProcess))
            return format

        query = cleanExpression(expression)
        if not len(query):
            format["operation"] = "void"
            return format
        format["operation"] = "asset"
        format["expression"] = query
        if fakeProcess:
            videos[query]="NaN"
            images[query]="NaN"
        else:
            format["assetUrl"] = videos[query]
            format["googleImage"] = images[query]
        return format
    except Exception as e:
        print(e)
        return {"operation": "oops", "expression": expression}


def render(i, props, retry=0):
    # return i
    if retry > 10:
        return None
    try:
        response = requests.post(os.environ.get("rendererUrl"), json=dict(props=props))
        res = response.json()
        return res["renderId"]
    except Exception as e:
        print(e)
        time.sleep(20)
        print(f"Retrying for {i}")
        return render(i, props, retry + 1)


def worker(i, expression, speechMarks, key, fakeProcess=False):
    props = dict()
    props["speechMarks"] = speechMarks
    props["audioKey"] = key
    props["format"] = processExpression(i, cleanExpression(expression), fakeProcess)
    if fakeProcess:
        return
    sampleProps.append(dict(expression=expression, props=props))
    renderIds[f"{i}"] = render(i, props)
    props["renderId"] = renderIds[f"{i}"]


def getSpeechMarks(key):
    buffer=getFromS3(f"speech_marks/{key}.jsonl")
    data = []
    with io.BytesIO(buffer.read()) as file:
        with jsonlines.Reader(file) as reader:
            for line in reader:
                data.append(
                    dict(time=line["time"], type=line["type"], value=line["value"])
                )
    return data


def getSentenceSpeechMarks(speechMarks):
    speechMarks = speechMarks[1:]
    speechMarksBySentence = []
    time = 0
    idx = 0
    wordMarks = []
    for obj in speechMarks:
        if obj["type"] == "sentence":
            speechMarksBySentence.append(
                dict(
                    speechMarks=wordMarks,
                    duration=(obj["time"] - time) / 1000,
                    start=time / 1000,
                )
            )
            time = obj["time"]
            idx += 1
            wordMarks = []
        else:
            wordMarks.append(dict(time=obj["time"] - time, value=obj["value"]))
    speechMarksBySentence.append(
        dict(
            speechMarks=wordMarks,
            duration=(wordMarks[-1]["time"] + 1000) / 1000,
            start=time / 1000,
        )
    )
    return speechMarksBySentence


def getAsset(query):
    videos[query] = getAssetUrl(query)
    images[query] = getGoogleImage(query)


def fetchAssets():
    threads = []
    for query in list(videos.keys()):
        t = threading.Thread(
            target=getAsset,
            args=(query,),
        )
        threads.append(t)
        t.start()
    for i, t in enumerate(threads):
        print(f"Fetching asset {i+1}/{len(threads)}")
        t.join()


def processor(expressions, speechMarksBySentence, key, fakeProcess=False):
    print(f"#### {'Fake' if fakeProcess else 'Real'} processing ####")
    threads = []
    for i, expression in enumerate(expressions):
        t = threading.Thread(
            target=worker,
            args=(i, expression, speechMarksBySentence[i], key, fakeProcess),
        )
        threads.append(t)
        t.start()
    for i, t in enumerate(threads):
        print(f"Finishing worker {i+1}/{len(threads)}")
        t.join()


def master(expressions, key):
    speechMarks = getSpeechMarks(key)
    speechMarksBySentence=getSentenceSpeechMarks(speechMarks)
    processor(expressions,speechMarksBySentence,key,fakeProcess=True)
    fetchAssets()
    processor(expressions,speechMarksBySentence,key)
    output = []
    for i in range(len(expressions)):
        output.append(renderIds[f"{i}"])
    print(output)
    return output


def getExpressions(key):
    buffer=getFromS3(f"expressions/{key}.json")
    with io.BytesIO(buffer.read()) as file:
        return json.load(file)


def main(key=os.environ.get("key")):
    expressions=getExpressions(key)
    output= master(expressions,key)
    saveToS3(json.dumps(sampleProps),f"props/{key}.json")
    saveToS3(json.dumps(output),f"renderIds/{key}.json")
    return output


def lambda_handler(event, context):
    try:
        y = json.loads(event["body"])
    except:
        y = event
    key = y["key"]
    output = main(key)
    return {"statusCode": 200, "body": json.dumps(output)}

