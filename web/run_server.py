from flask import Flask, url_for,request, render_template, make_response
from redis import StrictRedis
import time 
app = Flask(__name__)
# connect with database

#r = StrictRedis(host='localhost', port=6379, db=0)
def pre_process(X):
    # handing double space
    string = []
    for i in X: 
        if i != "" and i !="\n":
            string.append(i)
    return string

def caculation(keys,results ):
    for i in keys:

    
    
@app.route("/", methods = ['GET','POST'])
def index():
    # delete all key in redis
    #r.flushall()

    # save seq to database
<<<<<<< HEAD
    text = 'It is supper flast and outstanding graphics. I enjoy having apple products. I never go back to a pc again. sound is not good. keyboard is not good'
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
     
    

    k = text.split(". ")
    for i in k:
        r.set(i,"")

    #var1 = text
    keys = r.keys('*')
    x = 0
    while True:
        temp = r.get(keys[0])
        if (len(temp.split())>1):
            results = []
            for i in keys: 
                rs = r.get(i)
                temp = {"key": i ,"value": rs}
                results.append(temp)
            print(results)
            if len(results)>0:
                var1 = results
                break 
        x +=1 
        time.sleep(1)
=======
    if request.method =="POST":
        text = request.form["text"]
        k = text.split(". ")
        print("len text ",len(k))
        for i in k:
            tempt = i.split(" ")
            z = pre_process(tempt)
            # print(z)
            if len(z) < 83 and len(z)>1 :
                #print(len(z))
                string = " ".join(z)
                print(string)
                #r.set(string,"")
            # else: print (len(z))
    var1 = text
>>>>>>> 6d0e2b7a9ba17476a2b2301d317bee62cabcaeca
    return render_template('main.minh',var1= var1)

@app.route("/hello")
def hello():
    return "hello"
@app.route("/user/<id>", methods = ['GET','POST'])
def finduserid(id):
    print(request.method)
    print(url_for('finduserid',id=11))
    return "hello user id :{0}".format(id)