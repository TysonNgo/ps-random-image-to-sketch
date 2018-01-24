/**
 * @file
 * This is a script that grabs a random image from
 * some website (picsum.photos was used), displays it
 * in Photoshop, and then hides it after some time. 
 *
 * The intention of using this script is for practicing
 * sketching. You would run the script, then try to draw
 * what you saw, keeping close attention to the important
 * details of the image.
 * 
 * Note: Photoshop CS5 was used.
 */


/**
 * This class gets a random image from some website and opens it
 * @constructor
 */
var RandomImage = function(){
    this.port = 80;

    // URL to get a random image from
    this.domain = "picsum.photos";
    this.getRandomImagePath = function(){
        return "/200/300/?image="+Math.floor(Math.random()*1001);
    };
    var resizeImage = function(document){
        var multiplier = 5;
        var width = document.width * multiplier;
        var height = document.height * multiplier;
        document.resizeImage(width, height);
        runMenuItem(app.charIDToTypeID("FtOn"));
    };

    this.openImage = function(){
        var socket = new Socket();
        // has to be http
        if (socket.open(this.domain+":"+this.port, "binary")) {
            // create temporary file to open
            var scriptDirectory = (new File($.fileName).parent.fsName).replace(/\\/g,'/');
            var tempFile = File(scriptDirectory+"/VGhpcyBpcyBhIHJhbmRvbSBpbWFnZS5qcGVn.jpg");
            tempFile.encoding = "binary";
            tempFile.open("w");

            // get image from website and open in Photoshop, then remove the temporary file
            socket.write("GET http://"+this.domain+this.getRandomImagePath()+" HTTP/1.0\n\n");
            var response = socket.read(999999);
            tempFile.write(removeHeaders(response));
            tempFile.close();
            socket.close();
            var doc = app.open(tempFile);
            resizeImage(doc);
            tempFile.remove();
        }
        return doc;
    };
}


/**
 * @fuction countdown
 * @description Hides the opened random image, and creates
 * a new layer to draw on after 10 seconds
 *
 * @param {Document} document Photoshop document
 */
function countdown(document){
    var count = 10;
    alert("You have "+count+" seconds to look at the image.");
    $.sleep(count*1000);

    var drawHere = document.artLayers.add();
    drawHere.name = "draw";
    document.artLayers.getByName("Background").visible = false;
}

app.preferences.rulerUnits = Units.PIXELS;
var image = new RandomImage();
var doc = image.openImage();
countdown(doc);


/////////////////////////////////////////////////////////////

// from https://forums.adobe.com/thread/1132540
// Remove header lines from HTTP response
function removeHeaders(binary){  
          var bContinue = true ; // flag for finding end of header
          var line = "";
          var httpheader = "";
          var nFirst = 0;
          var count = 0;
          while (bContinue) {
                    line = getLine(binary) ; // each header line  
                    httpheader = httpheader + line;  
                    bContinue = line.length >= 2 ; // blank header == end of header  
                    nFirst = line.length + 1 ;  
                    binary = binary.substr(nFirst) ;  
          }  
          if (httpheader.indexOf("Bad Request") != -1 || httpheader.indexOf("Not Found") != -1) {  
                    alert (requesthtml + request + httpheader);  
                    var binary = "";  
          }  
          //alert (requesthtml + request + httpheader + "\nFile length = " + binary.length);  
          return binary;  
};  


// Get a response line from the HTML  
function getLine(html){  
          var line = "" ;  
          for (var i = 0; html.charCodeAt(i) != 10; i++){ // finding line end  
                    line += html[i] ;  
          }  
          return line ;  
};
