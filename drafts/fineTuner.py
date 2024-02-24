#!/usr/bin/env python
# coding: utf-8

fileName="fineTunePhase2New.jsonl"
suffix="phase2"
model="ft:gpt-3.5-turbo-1106:personal:phase2:8prppVS9"
# model="gpt-3.5-turbo-1106"


from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("openAIKey"),
)


res = client.files.create(file=open(fileName, "rb"), purpose="fine-tune")
trainingDataId = res.id
client.fine_tuning.jobs.create(
    model=model,
    training_file=trainingDataId,
    suffix=suffix,
    hyperparameters={"n_epochs":10}
)

