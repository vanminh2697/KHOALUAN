from flask import Flask, url_for,request, render_template, make_response
from redis import StrictRedis
app = Flask(__name__)

r = StrictRedis(host='localhost', port=6379, db=0)

@app.route("/", methods = ['GET','POST'])
def index():
    # navs = [ 'minh', 'dep', 'trai']
    if request.method =="POST":
        print("THIS IS MY POST")
        text = request.form["text"]
        var1 = text
        # print(text)
        return render_template('main.minh',var1= var1)
    # if request.method =="GET":
    #     print("YESSS")
    #     return render_template('main.minh',var1= var1)

@app.route("/hello")
def hello():
    return "hello"
@app.route("/user/<id>", methods = ['GET','POST'])
def finduserid(id):
    print request.method
    print url_for('finduserid',id=11)
    return "hello user id :{0}".format(id)