#!/usr/bin/env python
# coding: utf-8

import jsonlines

# Open the JSONL file for reading
with jsonlines.open('fineTunePhase2.jsonl') as reader:
    with jsonlines.open('fineTunePhase3.jsonl','w') as writer:
        # Iterate through each line in the JSONL file
        for obj in reader:
            example=obj['messages']
            for index,sentence in enumerate(example[1]['content'].split('.')):
                try:
                    output={'messages':[]}
                    output['messages'].append({'role': 'system', 'content': ''})
                    output['messages'].append({'role':'user','content':f"{sentence}."})
                    output['messages'].append({'role':'assistant','content':f"{example[2]['content'].split('.')[index]}."})
                    writer.write(output)
                except:
                    continue
            



import jsonlines, json
sentences=[]
with jsonlines.open('test1.jsonl') as data:
    for obj in data:
        if obj['type']=='sentence':
            sentences.append(obj['value'])
print(json.dumps(sentences))




