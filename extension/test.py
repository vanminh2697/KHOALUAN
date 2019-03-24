import execjs
import os 

execjs.get().name 
os.environ["EXECJS_RUNTIME"] = "test"
print(execjs.get().name)
