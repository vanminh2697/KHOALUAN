from flask import Flask, url_for,request, render_template, make_response
from redis import StrictRedis
import re
import codecs
app = Flask(__name__)
# connect with database

#r = StrictRedis(host='localhost', port=6379, db=0)
def pre_process(str):
    # handing double space
    
    str = re.sub("’", "'", str)
    str = re.sub(r'([-()#$%^&*]+)', "", str)
    str = re.sub(r'([,?!.:]{2,})', r'.', str)
    str = re.sub(r'([,?!.:])', r' \1 ', str)
    str = re.sub(r'\d{2,4}(\/\d{1,2})+|(\d{1,2}\/)+\d{2,4}', "", str)
    str = re.sub(r'\w+\@\w+(\.\w+)+', "", str)
    str = re.sub(r'[^\x00-\x7f]', "", str)
    str = re.sub(r'\"([\s\w]+)\"', r'\1', str)
    str = re.sub(r'(\'(\w{1,2})|(n\'t))', r' \1', str)
    str = re.sub("\"", " inch", str)
    str = re.sub("\/", " / ", str)

    #print(str)
    t = str.split();
    #for i in X: 
        #if i != "" and i !="\n":
            #string.append(i)
    return t
@app.route("/", methods = ['GET','POST'])
def index():
    # delete all key in redis
    #r.flushall()

    # save seq to database
    if request.method =="POST":
        text = request.form["text"]
        k = text.split(". ")
        print("len text ",len(k))
        for i in k:
            #tempt = i.split(" ")
            z = pre_process(i)
            # print(z)
            if len(z) < 2: string = " ".join(z)
            if len(z) < 83 and len(z)>1 :
                #print(len(z))
                string = " ".join(z)
                print(string)
                #r.set(string,"")
            # else: print (len(z))
    var1 = text
    return render_template('main.minh',var1= var1)

@app.route("/hello")
def hello():
    return "hello"
@app.route("/user/<id>", methods = ['GET','POST'])
def finduserid(id):
    print(request.method)
    print(url_for('finduserid',id=11))
    return "hello user id :{0}".format(id)