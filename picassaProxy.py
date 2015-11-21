#!/usr/bin/python

import cgi
import os
import sys
import gdata.photos.service
import gdata.media
import gdata.geo
import gdata.service
import gdata.urlfetch

#albumId = "5282283817703072369"
#albumId = "5282297364093886609"
#Gallery 1
#albumId = "5291699969296772897"
#Gallery 2
#albumId = "5291703125750052241"
albumId = ""
username = "realistictaxidermyMn"
# Use urlfetch instead of httplib
gdata.service.http_request_handler = gdata.urlfetch

print "Content-Type: text/plain"
print ""

form = cgi.FieldStorage()
if (form.has_key("albumId")):
  albumId = form["albumId"].value

gd_client = gdata.photos.service.PhotosService()

##gd_client = gdata.photos.service.PhotosService()
#albums = gd_client.GetFeed(uri="http://picasaweb.google.com/data/feed/api/user/tpiere")
albums = gd_client.GetUserFeed(user=username)

##
if (albumId == ""):
  jsonAlbumArray = []
  for album in albums.entry:
    jsonAlbumArray.append('{"title": "%s", "count": "%s", "id": "%s", "thumbnail":"%s"}' % (album.title.text,
      album.numphotos.text, album.gphoto_id.text, album.media.thumbnail[0].url))
  print "[" + ",".join(jsonAlbumArray) + "]"
else:
  jsonPhotoArray = []
  photos = gd_client.GetFeed('/data/feed/api/user/%s/albumid/%s?kind=photo' % (username, albumId))
  for photo in photos.entry:
    jsonPhotoArray.append('{"title":"%s", "width":"%s", "height":"%s", "url":"%s", "thumbnail":{"width":"%s", "height":"%s", "url":"%s"}}' %
                            (photo.title.text, photo.width.text, photo.height.text, photo.media.content[0].url, photo.media.thumbnail[0].width, photo.media.thumbnail[0].height, photo.media.thumbnail[0].url))
  print "[" + ",".join(jsonPhotoArray) + "]"
