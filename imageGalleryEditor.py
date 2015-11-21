import cgi, os
from google.appengine.api import urlfetch
from google.appengine.api import images
from google.appengine.ext import db

print "Content-Type: text/plain"


class ImageMetadata(db.Model):
  imageMetadataJson = db.TextProperty(required=True)

imageDataFromDb = db.GqlQuery("SELECT * FROM ImageMetadata")
imageObject = None

if imageDataFromDb.count() > 0:
  imageObject = imageDataFromDb[0]
else:
  imageData = ImageMetadata(imageMetadataJson = "[]")
  imageData.put()
  imageDataFromDb = db.GqlQuery("SELECT * FROM ImageMetadata")
  imageObject = imageDataFromDb[0]                         

if os.environ["REQUEST_METHOD"] == "GET":
  print "Cache-Control: no-cache"
  print ""
  print cgi.escape(imageObject.imageMetadataJson)
else:
  print ""
  form = cgi.FieldStorage()
  #print cgi.escape(form.getfirst('jsonString'))
  imageObject.imageMetadataJson = cgi.escape(form.getfirst('jsonString'))
  db.put(imageObject)
  print "Successfully Updated!"

#imageObject.delete()
