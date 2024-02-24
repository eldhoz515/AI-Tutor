#!/usr/bin/env python
# coding: utf-8

import phase1,phase2,voiceGen,processor,downloadVideo,merger
import os,uuid,json


def main(query, key=os.environ.get("key")):
    phase1.main(query, key)
    voiceGen.main(key)
    phase2.main(key)
    processor.main(key)
    downloadVideo.main(key)
    merger.main(fileName=query, key=key)


main("diffie hellman key exchange",str(uuid.uuid4()))

