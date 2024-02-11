import json
import boto3

polly = boto3.client("polly")
s3_client = boto3.client("s3")


def saveToS3(buffer, path):
    response = s3_client.put_object(
        Body=buffer,
        Bucket="ai-tutor-s3",
        Key=path,
    )


def getAudio(speech, key):
    ssml = f"""<speak><prosody rate="120%">{speech}</prosody></speak>"""
    response = polly.synthesize_speech(
        Engine="neural",
        Text=ssml,
        OutputFormat="mp3",
        VoiceId="Matthew",
        TextType="ssml",
    )
    saveToS3(buffer=response["AudioStream"].read(), path=f"voices/{key}.mp3")


def getCaption(speech, key):
    ssml = f"""<speak><prosody rate="120%">{speech}</prosody></speak>"""
    response = polly.synthesize_speech(
        Engine="neural",
        Text=ssml,
        OutputFormat="json",
        VoiceId="Matthew",
        SpeechMarkTypes=["word", "sentence"],
        TextType="ssml",
    )
    saveToS3(buffer=response["AudioStream"].read(), path=f"speech_marks/{key}.jsonl")


def lambda_handler(event, context):
    # y=json.loads(event["body"])
    y = event
    speech = y["speech"]
    key = y["key"]
    getAudio(speech, key)
    getCaption(speech, key)
    return {
        "statusCode": 200,
    }
