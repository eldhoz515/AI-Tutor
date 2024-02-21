#!/usr/bin/env python
# coding: utf-8

from moviepy.editor import *
import os
from dotenv import load_dotenv

load_dotenv()


def main(fileName, key=os.environ.get("key")):
    fileName = fileName.replace(" ", "_")

    path = f"../renders/{key}"
    files = os.listdir(path)

    files.sort(key=lambda a: int(a.split(".")[0]))
    clips = []

    for file in files:
        clip = VideoFileClip(f"{path}/{file}")
        clips.append(clip)
    final = concatenate_videoclips(clips)

    final.write_videofile(f"{path}/{fileName}.mp4")

