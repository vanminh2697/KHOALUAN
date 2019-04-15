from flask import Flask, url_for,request, render_template, make_response, jsonify
from redis import StrictRedis
import time 
import numpy 
import re
import codecs
import execjs
import os
import json
app = Flask(__name__)
# connect with database

r = StrictRedis(host='localhost', port=6379, db=0)


def caculation(keys,results):
    Aspects = []

    # get aspect

    for i in range(len(keys)):
        string = keys[i].split(' ')
        rs = results[i].split(' ')
        print(string)
        print (rs)
        print (len(string))
        print (len(rs))
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
                    # if (aspect == "work"):
                    #     print (aspect)
                    #     print (string)
                    #     print(rs)
            j +=1
    
    print(Aspects)

    # calucation Value
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
    for i in range(n):
        aspect = Aspects[i]
        x = round((Value[i][0]/Value[i][3])*100)
        y = round((Value[i][1]/Value[i][3])*100)
        z = round((Value[i][2]/Value[i][3])*100)
        temp = {"aspect": Aspects[i], "POS": y , "NEG": x , "NEU": z}
        json_results.append(temp)
    return json_results


def pre_process(str):
    # # handing double space
    str = re.sub(r'([-()#$%^&*]+)', "", str)
    str = re.sub(r'([,?!.:]{2,})', r'.', str)
    str = re.sub(r'([,?!.:])', r' \1 ', str)
    str = re.sub(r'\d{2,4}(\/\d{1,2})+|(\d{1,2}\/)+\d{2,4}', "", str)
    str = re.sub(r'\w+\@\w+(\.\w+)+', "", str)
    str = re.sub(r'[^\x00-\x7f]', "", str)
    str = re.sub(r'\"([\s\w]+)\"', r'\1', str)
    str = re.sub(r'(\'(\w{1,2})|(n\'t))', r' \1', str)
    str = re.sub("\"", " inch", str)
    str = re.sub("/", " / ", str)
    t = str.split(" ")
    print("################")
    print (t)
    string =[]
    for i in t: 
        if i !='' and i !="\n":
            string.append(i)

    k  = " ".join(string) 
    return k

    
@app.route("/", methods = ['GET','POST'])
def index():

    # delete all key in redis

    r.flushall()

    A = []
    # save seq to database
    
    if request.method == "POST":
        text = request.form["data"]
        if text != '':
            k = text.split(". ")
            print("len text ",len(k))       
            for i in k:
                z = pre_process(i)
                z = z.split('. ')
                if len(z) > 1:
                    for j in z: 
                        A.append(j.split(' '))
                else:
                    A.append(z[0].split(' '))

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
                    if (len(temp.split())>1):
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
            json_results = caculation(keys, value)
            # print(json_results)
            return json.dumps(json_results)
        else: 
            return "Can not find reviews from Web page"