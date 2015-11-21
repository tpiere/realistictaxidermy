    //var  bookmarkedSection, querySection, initSection;
		var images, galleryInitialized, mapInitialized;
		var numberOfThumbnailsToDisplay = 7;
		var currentThumbnailOffset;
		var selectedThumbnail;
    var scale = -13.7;
		var maxDisplayImageHeight = 400;
		var maxDisplayImageWidth = 600;
		var sliderWidth = 695;
		var thumbnailsWidth;
		var initialThumbnailOffset;
		var slider;
		var sliderInitialized = false;
		
		function sliderInit() {
		  if (!sliderInitialized)
			{
   	  slider = YAHOO.widget.Slider.getHorizSlider("sliderbg", "sliderthumb", 0, sliderWidth);
		  slider.subscribe("change", displayNewValue);	
			var xOffset = YAHOO.util.Dom.getX("thumbnails");
			var yOffset = YAHOO.util.Dom.getY("thumbnails");
			initialThumbnailOffset =  {x:xOffset, y:yOffset};
			//alert(initialThumbnailOffset.x + ", " +  initialThumbnailOffset.y);
			sliderInitialized = true;
			}
			else
			{
					slider.setValue(0);
			}
			
		}

    function displayNewValue(offsetFromStart) {
		   // determine the actual value from the offset
	     var thumbnails = YAHOO.util.Dom.get("thumbnails");
			 scale = thumbnailsWidth / 750 * -1;
       var newVal = (offsetFromStart * scale) + initialThumbnailOffset.x;
			 //alert(offsetFromStart);
       //YAHOO.util.Dom.get("debug").innerHTML = slider.getThumb().getOffsetFromParent().toString() + "px";
   		 var myAnim = new YAHOO.util.Motion(thumbnails, { points : {to: [newVal,initialThumbnailOffset.y]}  }, 1, YAHOO.util.Easing.easeBoth);
			 myAnim.animate();
			 //YAHOO.util.Dom.setStyle(thumbnails, "left", newVal + "px");
       // If animation is turned on this event fires continuously during the animation.
       // You can evaluate the moveComplete property to determine if the animation
       // is complete.  Alternatively, use the slideEnd event.
       if (this.moveComplete) {
           //alert("moveComplete");
       }
    }

	
    		/*
     * AjaxObject is a hypothetical object that encapsulates the transaction
     *     request and callback logic.
     *
     * handleSuccess( ) provides success case logic
     * handleFailure( ) provides failure case logic
     * processResult( ) displays the results of the response from both the
     * success and failure handlers
     * call( ) calling this member starts the transaction request.
     */
    
    var AjaxObject = {
      
			albumId:"",
			
    	handleSuccess:function(o){
    		// This member handles the success response
    		// and passes the response object o to AjaxObject's
    		// processResult member.
    		this.processResult(o);
    	},
    
    	handleFailure:function(o){
    		alert("Error retrieving gallery data. ");
				hideLoadingBox();
    	},
    
    	processResult:function(o){
    		//alert(o.responseText);
    		try {
        		//images = YAHOO.lang.JSON.parse(o.responseText);
						//alert(o.responseText);
						var data =  YAHOO.lang.JSON.parse(o.responseText);
						if (this.albumId == ""){
							 displayAlbums(data);
						}
						else
						{
						   images = data;
							 loadAllThumbnails();
						}
        }
        catch (e) {
            alert("Invalid image data: " + e.message);
						hideLoadingBox();
        }
    
				/*
     		for (var i = 0; i < 7; i++)
    		{
    		 		var thumbnail = document.createElement("img");
    				thumbnail.src = "/pic/" + images[i] + "?height=100&width=100";
    				thumbnail.alt = images[i];
    				thumbnail.className = "thumbnail";
						YAHOO.util.Event.addListener(thumbnail, "click", thumbnailClickHandler); 
    				YAHOO.util.Dom.get("thumbnails").appendChild(thumbnail);
    		}
     		
				displayImage(images[0]);
    		*/
				//loadThumbnails(0);
    		//loadAllThumbnails();
			
			},
    
    	startRequest:function() {
			   var cachePreventer = Math.random() * 1000000;
    	   //YAHOO.util.Connect.asyncRequest('GET', '/imageGalleryEditor?reqId'+ cachePreventer, callback);
				 displayLoadingBox();
				 YAHOO.util.Connect.asyncRequest('GET', '/galleryData?albumId='+this.albumId+'&reqId'+ cachePreventer, callback);
    	}
    
    };
		
		function attachThumbnailEvents(thumbnail, imageData)
		{
		 		YAHOO.util.Event.addListener(thumbnail, "click", function(event){thumbnailClickHandler(event, imageData);});
				YAHOO.util.Event.addListener(thumbnail, "mouseover", function(event){YAHOO.util.Dom.setStyle(thumbnail, "opacity", 1);});
				YAHOO.util.Event.addListener(thumbnail, "mouseout", 
																								function(event)
																								{
																								 	  if (thumbnail !== selectedThumbnail)
																										{
																										   YAHOO.util.Dom.setStyle(thumbnail, "opacity", .7);
																									  }
																								}); 
		}
		
			function attachAlbumEvent(album, albumData)
		{
		 		YAHOO.util.Event.addListener(album, "click", function(event){albumClickHandler(event, albumData);return false;});
				album.onClick = function(){return false;};
				//YAHOO.util.Event.addListener(album, "mouseover", function(event){YAHOO.util.Dom.setStyle(album, "opacity", 1);});
				//YAHOO.util.Event.addListener(album, "mouseout", function(event){YAHOO.util.Dom.setStyle(album, "opacity", .7);}); 
		}
		/*
		function loadThumbnails(startPosition)
		{
		 		resetThumbnails();
		 		for (var i = startPosition; i < startPosition + numberOfThumbnailsToDisplay && i<images.length; i++)
    		{
    		 		var thumbnail = document.createElement("img");
    				thumbnail.src = "/static/images/gallery/thumbnails/" + images[i];
    				thumbnail.alt = images[i];
    				thumbnail.className = "thumbnail";
						YAHOO.util.Dom.setStyle(thumbnail, "opacity", .7);
						//YAHOO.util.Event.addListener(thumbnail, "click", thumbnailClickHandler);
						//YAHOO.util.Event.addListener(thumbnail, "mouseover", function(event){YAHOO.util.Dom.setStyle(thumbnail, "opacity", .5);});
						//YAHOO.util.Event.addListener(thumbnail, "click", thumbnailClickHandler);
						attachThumbnailEvents(thumbnail); 
    				YAHOO.util.Dom.get("thumbnails").appendChild(thumbnail);
    				if (i == startPosition)
						{
						   highlightSelectedThumbnail(thumbnail);
						}
				}
     		currentThumbnailOffset = startPosition;
				displayImage(images[startPosition]);
				if (currentThumbnailOffset === 0)
				{
				 	 YAHOO.util.Dom.get("previousArrow").style.display = "none";
				}
				else
				{
				 	 YAHOO.util.Dom.get("previousArrow").style.display = "block";
				}
				
				if (currentThumbnailOffset + numberOfThumbnailsToDisplay >= images.length)
				{
				 	 YAHOO.util.Dom.get("nextArrow").style.display = "none";
				}
				else
				{
				 	 YAHOO.util.Dom.get("nextArrow").style.display = "block";
				}
		
		}
		*/
		function displayLoadingBox()
		{		  
			 YAHOO.util.Dom.addClass("loadingBox", "displayed");
		}
		function hideLoadingBox()
		{		  
			 YAHOO.util.Dom.removeClass("loadingBox", "displayed");
		}
		
		function loadAllThumbnails()
		{
		 		clearGallery();
				
				YAHOO.util.Dom.setStyle("filmstrip", "display", "block");
				YAHOO.util.Dom.setStyle("slider", "display", "block");

				YAHOO.util.Dom.setStyle("backToAlbumsLink", "display", "block");
		 		displayImage(images[0]);
		 		resetThumbnails();
				var thumbnails = YAHOO.util.Dom.get("thumbnails");
				var imgMargin = 6;
				thumbnailsWidth = (images.length * imgMargin) +10; 
		 		for (var i = 0; i < images.length; i++)
    		{
    		 		var thumbnail = document.createElement("img");
    				//thumbnail.src = "/static/images/gallery/thumbnails/" + images[i].fileName;
    				//thumbnail.alt = images[i].fileName;
						thumbnail.src = images[i].thumbnail.url;
    				thumbnail.alt = images[i].title;
    				thumbnail.className = "thumbnail";
						thumbnailsWidth += Number(images[i].thumbnail.width);
						YAHOO.util.Dom.setStyle(thumbnail, "opacity", .7);
						attachThumbnailEvents(thumbnail, images[i]);
						thumbnails.appendChild(thumbnail);
    				if (i == 0)
						{
						   highlightSelectedThumbnail(thumbnail);
						}
				}
					
				YAHOO.util.Dom.setStyle(thumbnails, "width", thumbnailsWidth + "px");
				
				var nextArrow = YAHOO.util.Dom.get("nextArrow");
				var previousArrow = YAHOO.util.Dom.get("previousArrow");
				YAHOO.util.Event.addListener(nextArrow, "click", nextArrowClickHandler);
				YAHOO.util.Event.addListener(previousArrow, "click", previousArrowClickHandler);
				sliderInit();
				hideLoadingBox();
		}
		
		function resetThumbnails()
		{
		   var thumbnailsElement = YAHOO.util.Dom.get("thumbnails");
			 while (thumbnailsElement.firstChild)
			 {
			 	 thumbnailsElement.removeChild(thumbnailsElement.firstChild);
			 }
		}
		
		function highlightSelectedThumbnail(thumbnail)
		{
		 		removeSelectedThumbnailHighlight(selectedThumbnail);
		 		thumbnail.style.border = "2px solid red";
				YAHOO.util.Dom.setStyle(thumbnail, "opacity", 1);
				selectedThumbnail = thumbnail;
		}
		
		function removeSelectedThumbnailHighlight(thumbnail)
		{
		    if(thumbnail)
				{
		 			thumbnail.style.border = "none";
					YAHOO.util.Dom.setStyle(thumbnail, "opacity", .7);
				}
		}
		
		function nextArrowClickHandler(event)
		{
		 		//loadThumbnails(currentThumbnailOffset + numberOfThumbnailsToDisplay);
				var numClicks = thumbnailsWidth/750;
				var scrollPerClick = sliderWidth/numClicks;
				scrollThumbnails(scrollPerClick);
				//scrollThumbnails(54.3);
		}
		
		function previousArrowClickHandler(event)
		{
		 		var numClicks = thumbnailsWidth/750;
				var scrollPerClick = sliderWidth/numClicks;
				scrollThumbnails(scrollPerClick * -1);
		 		//scrollThumbnails(-54.3);
		 		//loadThumbnails(currentThumbnailOffset - numberOfThumbnailsToDisplay);
		}
		
		function scrollThumbnails(amountToScroll)
		{
		 	 var newVal = slider.getXValue() + amountToScroll;
			 //alert(newVal);
			 slider.setValue(newVal);		 
			 //var thumbnails = YAHOO.util.Dom.get("thumbnails");
			 //YAHOO.util.Dom.setStyle(thumbnails, "left", newVal + "
		}
		
		function thumbnailClickHandler(event, imageData)
		{
		 		var srcElement = event.srcElement ? event.srcElement : event.target;
				highlightSelectedThumbnail(srcElement);
				displayImage(imageData);
		}
    
		function albumClickHandler(event, albumData)
		{
		   AjaxObject.albumId = albumData.id;
			 AjaxObject.startRequest();
			 return false;
		}
    /*
     * Define the callback object for success and failure
     * handlers as well as object scope.
     */
    var callback =
    {
    	success:AjaxObject.handleSuccess,
    	failure:AjaxObject.handleFailure,
    	scope: AjaxObject
    };
		
		function loadImageData()
		{
		 	 AjaxObject.startRequest();
		}
		
		function initializeGallery()
		{
		 		loadImageData();
				galleryInitialized = true;

				YAHOO.util.Event.addListener("backToAlbumsLink", "click", function(){AjaxObject.albumId = "";loadImageData(); return false;});
   	}
		
		
		function displayAlbums(albumData)
		{
		 		clearGallery();
				YAHOO.util.Dom.setStyle("filmstrip", "display", "none");
				YAHOO.util.Dom.setStyle("slider", "display", "none");
				YAHOO.util.Dom.setStyle("backToAlbumsLink", "display", "none");
		 		var galleryArea = document.getElementById("displayImageArea");
		 		for (var i = 0; i < albumData.length; i++)
				{
				    var thumbnailElement = document.createElement("img");
						thumbnailElement.src = albumData[i].thumbnail;
				  	var albumLink = document.createElement("div");
						albumLink.className = "albumLink"
						var albumTitleNode = document.createElement("div");
						albumTitleNode.innerHTML = albumData[i].title;
						albumLink.appendChild(thumbnailElement);
						albumLink.appendChild(albumTitleNode);
						//albumLink.href = "#" + albumData[i].id;
						attachAlbumEvent(albumLink, albumData[i]);
						galleryArea.appendChild(albumLink)
				}
				hideLoadingBox();
		}
			
		function clearGallery()
		{
		  var area = YAHOO.util.Dom.get("displayImageArea");
			area.innerHTML = "";
		}
		
		function displayImage(imageData)
		{
		 		var newImage = document.createElement("img");
		
				newImage.src = imageData.url + "?imgmax=800";
				newImage.alt = "Gallery Photo";
				newImage.id = "displayImage"
				var scaledDimensions = scaleImage(imageData.width, imageData.height)
				//maxDisplayImageHeight = 400;
				//maxDisplayImageWidth = 600;
				
				newImage.height = scaledDimensions.height;
				newImage.width = scaledDimensions.width;
				
				
		 		var image = YAHOO.util.Dom.get("displayImage");
				if (!image)
				{				
					 var area = YAHOO.util.Dom.get("displayImageArea");
					 if (area)
					 {
					 		area.appendChild(newImage);
					 } 
				}
				else
				{
				 		image.parentNode.replaceChild(newImage, image);
				}
		}
		
		function scaleImage(width, height)
		{
		   var newHeight = height;
			 var newWidth = width;
			 
			 if (height > maxDisplayImageHeight)
			 {
			 	  var scale = maxDisplayImageHeight/height;
					newHeight = scale*height;
					newWidth = scale*width;
			 }
			 return {"width":newWidth, "height":newHeight};
		}


(function(){
	 if (!galleryInitialized)
	 {
	    initializeGallery();
	 }
})();
