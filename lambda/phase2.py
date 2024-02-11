import json
from openai import OpenAI
import os, threading

client = OpenAI(
    api_key=os.environ.get("openAIKey"),
)

expressions = dict()
threads = []


def convert_sentence(i, sentence):
    print(i)
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "Convert given sentence to simple expression",
            },
            {
                "role": "user",
                "content": sentence,
            },
        ],
        model=os.environ.get("phase2Model"),
    )
    expressions[f"{i}"] = str(response.choices[0].message.content)


def get_expressions(sentences):
    for i, sentence in enumerate(sentences):
        t = threading.Thread(
            target=convert_sentence,
            args=(
                i,
                sentence,
            ),
        )
        threads.append(t)
        t.start()
    for t in threads:
        t.join()
    output = []
    for i in range(len(sentences)):
        output.append(expressions[f"{i}"])
    return output


def lambda_handler(event, context):
    # y=json.loads(event["body"])
    y = event
    sentences = y["sentences"]
    output = get_expressions(sentences)
    return {"statusCode": 200, "body": json.dumps(output)}
