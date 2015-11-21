import cgi, os
import gdata.photos.service
import gdata.media
import gdata.geo
from google.appengine.api import urlfetch
from google.appengine.api import images


##print "Content-Type: text/plain"
print "Content-Type: image/jpeg"
print ""
##print os.environ['PATH_INFO']

imageFileName = os.environ['PATH_INFO'].replace("/pic/", "", 1)
form = cgi.FieldStorage()
##if form.getFirst('height') != None:
##  print "height = "
height = form.getfirst('height')
width = form.getfirst('width')

##print ""
##print imageFileName
##print os.environ['SERVER_NAME']
url = "".join(["http://www.kustomjoes.com/static/images/gallery/", imageFileName])
result = urlfetch.fetch(url)
if result.status_code == 200:
##  print "".join(["Content-Type: ", result.headers["content-type"]])
##  print ""
  ##print result.headers["content-type"]
  if height != None and width != None:
    height = int(height)
    width = int(width)
##    print "height = "
##    print height
##    print "; width = "
##    print width
    print images.resize(result.content, width, height)
  else:
    print result.content

