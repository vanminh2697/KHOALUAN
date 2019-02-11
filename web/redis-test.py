from redis import StrictRedis
r = StrictRedis(host='localhost', port=6379, db=0)
k = r.keys('*')
print(len(k))