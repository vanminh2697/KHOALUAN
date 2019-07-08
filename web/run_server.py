from flask import Flask, url_for,request, render_template, make_response, jsonify
from redis import StrictRedis
import time 
import numpy 
import re
import codecs
import execjs
import os
import json
import gensim.downloader as api
app = Flask(__name__)
# connect with database
r = StrictRedis(host='localhost', port=6379, db=0)
word_vectors = api.load("glove-wiki-gigaword-100")  # load pre-trained word-vectors from gensim-data

def get_unmatching_word(words):
    for word in words:
        if not word in word_vectors.wv.vocab:
            print("Word is not in vocabulary:", word)
            return False
    return True
def similarity(tag):
    tag = tag.lower()
    tag = tag.split()
    if get_unmatching_word(tag) == False:
        return ' '.join(tag)
    else:
        score = 0
        lb = ""
        with open("data.txt") as f:
            for line in f:
                line = line.split(":")
                str = line[1].split()
                t = line[0].lower()
                t = t.split()
                sim = word_vectors.n_similarity(tag, t)
                if(sim > 0.6 and sim > score):
                    lb = t
                    score = sim
                for i in str:
                    i = i.lower()
                    i = i.split("-")
                    sim = word_vectors.n_similarity(tag, i)
                    #print("{:.4f}".format(sim))
                    if(sim > 0.6 and sim > score):
                        lb = t
                        score = sim
        return ' '.join(lb)

r = StrictRedis(host='localhost', port=6379, db=0)
def combineAspect_1(Aspects, Value):
        print("-----------")
        tag_temp = []
        tag_value = []
        check = 0
        for i in range(len(Aspects)):
            aspect = Aspects[i].lower()
            # print(aspect)
            tag = similarity(aspect)
            # print(tag)
            if(i == 0):
                tag_temp.append(tag)
                tag_value.append(Value[i])
            else:
                for j in tag_temp:
                    #print(j)
                    if tag == j:
                        check = 1
                        index = tag_temp.index(tag)
                        #print(index)
                        tag_value[index][0] += Value[i][0]
                        tag_value[index][1] += Value[i][1]
                        tag_value[index][2] += Value[i][2]
                        tag_value[index][3] += Value[i][3]
                if (check == 0):
                    tag_temp.append(tag)
                    tag_value.append(Value[i])
        return (tag_temp, tag_value)
# def combineAspect(Aspects, Value):
#     listEng = ["es","s"]
#     for i in range(len(Aspects)):
#         aspect = Aspects[i]
#         if(aspect != "null"):
#             j = 2
#             while (j>0):
#                 temp = aspect[len(aspect)-j: len(aspect)]
#                 if(temp in listEng):
#                     aspectTemp = aspect[:len(aspect)-j]
#                     print(aspectTemp)
#                     for k in Aspects:
#                          if(k!= aspect and aspectTemp == k):
#                              index = Aspects.index(k)
#                              Value[index][0] = Value[index][0] + Value[i][0]
#                              Value[index][1] = Value[index][1] + Value[i][1]
#                              Value[index][2] = Value[index][2] + Value[i][2]
#                              Value[index][3] = Value[index][3] + Value[i][3]
#                              Aspects[i] = "null"
#                     break
#                 j -= 1
#     print(Aspects)
def caculation(keys,results):
    Aspects = []

    # get aspect

    for i in range(len(keys)):
        string = keys[i].split(' ')
        rs = results[i].split(' ')

        j = 0
        while j < len(rs):
            if rs[j] != 'O':
                tempt = []
                while j < len(rs) and rs[j] != 'O':
                   tempt.append(string[j])
                   j += 1 
                aspect  = " ".join(tempt)
                if aspect not in Aspects: 
                    Aspects.append(aspect)
            j +=1
    
    # print(Aspects)

    # calucation Value for Aspect

    # 1: positive 
    # 0: Negative 
    # 2: neutral
    n = len(Aspects)
    m = 3
   
    Value = numpy.zeros((n, m+1))
    

    for i in range(n):
        name = Aspects[i].split(' ')[0]
        for j in range(len(keys)):
            seq = keys[j]
            seq_split = seq.split(' ')  
            if Aspects[i] in seq and name in seq_split:
                count = seq_split.count(name)
                if count >1: 
                    rs = results[j].split(' ')
                    for k in range( len(seq_split)):
                        if(seq_split[k]==name):
                            if rs[k] !="O":
                                pol = rs[k].split('-')[1]
                                if pol == 'POS':
                                    Value[i][1] += 1
                                    Value[i][3] += 1
                                elif pol == 'NEG':
                                    Value[i][0] += 1
                                    Value[i][3] += 1
                                else :
                                    Value[i][2] += 1
                                    Value[i][3] += 1   
                else :
                    index = seq_split.index(name)
                    rs = results[j].split(' ')
                    if rs[index] !="O":
                        pol = rs[index].split('-')[1]
                        if pol == 'POS':
                            Value[i][1] += 1
                            Value[i][3] += 1
                        elif pol == 'NEG':
                            Value[i][0] += 1
                            Value[i][3] += 1
                        else :
                            Value[i][2] += 1
                            Value[i][3] += 1      
    json_results = [] 
    print("Aspect Minh") 
    print(Aspects)
    Aspects = [element.upper() for element in Aspects]
    Aspects , Value = combineAspect_1(Aspects,Value)
    print("Aspect Trang")
    print(Aspects)
    n = len(Aspects)
    Aspects = [element.upper() for element in Aspects]
    for i in range(n):
        x = round((Value[i][0]/Value[i][3])*100)
        y = round((Value[i][1]/Value[i][3])*100)
        z = round((Value[i][2]/Value[i][3])*100)
        temp = {"aspect": Aspects[i], "POS": y , "NEG": x , "NEU": z , "Total": Value[i][3]}
        json_results.append(temp)
    return json_results

def pre_process(str):
    # handing double space
    str = re.sub(r'([-()#$%^&*]+)', "", str)
    str = re.sub(r'([,?!.:]{2,})', r'.', str)
    str = re.sub(r'([,?!.:;])', r' \1 ', str)
    str = re.sub(r'\d{2,4}(\/\d{1,2})+|(\d{1,2}\/)+\d{2,4}', "", str)
    str = re.sub(r'\w+\@\w+(\.\w+)+', "", str)
    str = re.sub(r'[^\x00-\x7f]', "", str)
    str = re.sub(r'\"([\s\w]+)\"', r'\1', str)
    str = re.sub(r'(\'(\w{1,2})|(n\'t))', r' \1', str)
    str = re.sub("\"", " inch", str)
    str = re.sub("/", " / ", str)
    
    t = str.split(' ')
    string =[]
    for i in t: 
        if i !='' and i !="\n" and i !="." and i != ":":
            string.append(i.lower())
    k  = " ".join(string)
    k.lower()
    return k

    
@app.route("/", methods = ['GET','POST'])
def index():

    # delete all key in redis

    r.flushall()

    A = []

    # save seq to database
    if request.method == "POST":
        text = request.form["data"]
        # print(text)
        if text != '':
            k = text.split(". ")    
            for i in k:
                z = pre_process(i)
    # If sequence have "\n"
                z = z.splitlines()
                if len(z) > 1:
                    for j in z: 
                        if(j != " "):
                            A.append(j.split(' '))
                else:
                    A.append(z[0].split(' '))
                # A.append(z.split(' '))
                
            for i in A:
                size = len(i)
                if size <83 and size > 1:
                    string = " ".join(i)
                    r.set(string,"")
            keys = r.keys('*')
            x = 0
            value = []

            if(len(keys)> 0):
                while True:
                    temp = r.get(keys[0])
                    if (len(temp.split())>=1):
                        results = []
                        for i in keys: 
                            rs = r.get(i)
                            temp = {"key": i ,"value": rs}
                            value.append(rs)
                            results.append(temp)
                        if len(results)>0:
                            break 
                    x +=1 
                    time.sleep(1)
                    # print x
            json_results = caculation(keys, value)
            return json.dumps(json_results)
        else: 
            return "Can not find reviews from Web page"
