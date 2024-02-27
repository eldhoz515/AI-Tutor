#!/usr/bin/env python
# coding: utf-8

import phase1,phase2,voiceGen,processor,downloadVideo,merger
import os,uuid,json,threading


def main(query, key=os.environ.get("key")):
    print(f"key : {key}")
    phase1.main(query, key)
    print(f"Phase1 completed")
    voiceGen.main(key)
    print(f"Voice generated")
    phase2.main(key)
    print(f"Phase2 completed")
    processor.main(key)
    print(f"Processing completed")
    downloadVideo.main(key)
    merger.main(fileName=query, key=key)


main("how api works",str(uuid.uuid4()))

