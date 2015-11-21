from google.appengine.api import urlfetch

REST_ENDPOINT = 'http://flickr.com/services/rest'

# set these here or using flickr.API_KEY in your application
API_KEY = '487aa5e6034994d4dba298c5387207ca'
API_SECRET = '385fe1f0c7f70376'
email = None
password = None

tpiereNsid = "31419675@N07"

print "Content-Type: text/plain"
print ""

##find by user name -- get nsid
#url = "http://flickr.com/services/rest?method=flickr.people.findbyusername&api_key=487aa5e6034994d4dba298c5387207ca&username=tpiere&format=json"

##photosets.getList -- get list of photosets
#url = "http://flickr.com/services/rest?method=flickr.photosets.getList&api_key=487aa5e6034994d4dba298c5387207ca&user_id=31419675@N07&format=json"

##photosets.getPhotos -- get photos for photoset
url = "http://flickr.com/services/rest?method=flickr.photosets.getPhotos&api_key=487aa5e6034994d4dba298c5387207ca&photoset_id=72157608040829557&format=json"
result = urlfetch.fetch(url)

if result.status_code == 200:
    print result.content
else:
    print "Error contacting flickr api"
