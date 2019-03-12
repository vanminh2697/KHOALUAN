from flask import Flask, url_for,request, render_template, make_response
from redis import StrictRedis
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
    return render_template('main.minh',var1= var1)

@app.route("/hello")
def hello():
    return "hello"
@app.route("/user/<id>", methods = ['GET','POST'])
def finduserid(id):
    print(request.method)
    print(url_for('finduserid',id=11))
    return "hello user id :{0}".format(id)