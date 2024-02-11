import json, os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("openAIKey"),
)


def get_response(query):
    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a teacher who uses analogy for everything",
            },
            {
                "role": "user",
                "content": query,
            },
        ],
        model=os.environ.get("phase1Model"),
    )
    return str(response.choices[0].message.content)


def lambda_handler(event, context):
    # y=json.loads(event["body"])
    y = event

    query = y["query"]
    output = get_response(query)

    return {"statusCode": 200, "body": json.dumps(output)}
