from flask import Flask, url_for,request, render_template, make_response
from redis import StrictRedis
app = Flask(__name__)
# connect with database

r = StrictRedis(host='localhost', port=6379, db=0)

@app.route("/", methods = ['GET','POST'])
def index():
    # delete all key in redis
    r.flushall()
    # save seq to database
    if request.method =="POST":
        text = request.form["text"]
        k = text.split(".")
        for i in k:
            r.set(i,"")
    
    var1 = text
    #return render_template('main.minh',var1= var1)

@app.route("/hello")
def hello():
    return "hello"
@app.route("/user/<id>", methods = ['GET','POST'])
def finduserid(id):
    print request.method
    print url_for('finduserid',id=11)
    return "hello user id :{0}".format(id)