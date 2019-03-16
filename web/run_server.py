from flask import Flask, url_for,request, render_template, make_response
from redis import StrictRedis
import time 
import numpy 
app = Flask(__name__)
# connect with database

r = StrictRedis(host='localhost', port=6379, db=0)
def pre_process(X):
    # handing double space
    string = []
    for i in X: 
        if i != "" and i !="\n":
            string.append(i)
    return string

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
                while j < len(rs) and rs[j] !='O':
                   tempt.append(string[j])
                   j += 1 
                aspect  = " ".join(tempt)
                if aspect not in Aspects: 
                    Aspects.append(aspect)
            j +=1
    
    # calucation Value
    # 1: positive 
    # 0: Negative 
    # 2: neutral
    n = len(Aspects)
    m = 3
    Value = numpy.zeros((n, m+1))
    for i in range(n):
        name = Aspects[i].split(" ")[0]
        for j in range(len(keys)):
            seq = keys[j].split(' ')
            if name in seq:
                index = seq.index(name)
                rs = results[j].split(' ')
                pol = rs[index].split('-')[1]
                # print(pol)
                if pol == 'POS':
                    Value[i][1] += 1
                    Value[i][3] += 1
                elif pol == 'NEG':
                    Value[i][0] += 1
                    Value[i][3] += 1
                else :
                    Value[i][2] += 1
                    Value[i][3] += 1
    
    for i in range(n):
        print (Aspects[i],Value[i][0]/Value[i][3],Value[i][1]/Value[i][3],Value[i][2]/Value[i][3])

    return Aspects


@app.route("/", methods = ['GET','POST'])
def index():
    # delete all key in redis
    r.flushall()

    # save seq to database
    text = 'It is supper flast and outstanding graphics. I enjoy having apple products 9. I never go back to a pc again. sound is not good. battery life is good. graphics is bad'

    # if request.method =="POST":
    #     text = request.form["text"]
    #     k = text.split(". ")
    #     print("len text ",len(k))
    #     for i in k:
    #         tempt = i.split(" ")
    #         z = pre_process(tempt)
    #         # print(z)
    #         if len(z) < 83 and len(z)>1 :
    #             #print(len(z))
    #             string = " ".join(z)
    #             print(string)
    #             r.set(string,"")
    #         # else: print (len(z))
    # var1 = text 
    

    k = text.split(". ")
    for i in k:
        r.set(i,"")

    keys = r.keys('*')
    x = 0
    while True:
        temp = r.get(keys[0])
        if (len(temp.split())>1):
            results = []
            value = []
            for i in keys: 
                rs = r.get(i)
                temp = {"key": i ,"value": rs}
                value.append(rs)
                results.append(temp)
            if len(results)>0:
                var1 = results
                break 
        x +=1 
        time.sleep(1)
    A = caculation(keys, value)
    return render_template('main.minh',var1= var1,var2 =A)

@app.route("/hello")
def hello():
    return "hello"
@app.route("/user/<id>", methods = ['GET','POST'])
def finduserid(id):
    print(request.method)
    print(url_for('finduserid',id=11))
    return "hello user id :{0}".format(id)