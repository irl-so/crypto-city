function init() {

    // http://www.browserleaks.com/webgl#howto-detect-webgl
    // Detect WebGL avaiable and turned on
    function webgl_detect(return_context) {
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                context = false;

                for(var i=0;i<4;i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // WebGL is enabled
                        if (return_context) {
                            // return WebGL object if the function's argument is present
                            return {name:names[i], gl:context};
                        }
                        // else, return just true
                        return true;
                    }
                } catch(e) {
                    // catch issues and return false
                    console.log(e);
                    return false;
                }
            }
            // WebGL is supported, but disabled
            return false;
        }
        // WebGL not supported
        return false;
    }

    if(webgl_detect(1)){
        console.log('WebGL good to go');
    }else{
        console.log('No WebGL, bummer');
        return false;
    }

    //hyperlapse stuff here! 

        var hyperlapse = new Hyperlapse(document.getElementById('pano'), {
            width: window.innerWidth,
            height: window.innerHeight,
            lookat: new google.maps.LatLng(37.81409525128964,-122.4775045005249),
            zoom: 1,
            fov: 120,
            millis: 300,
            distance_between_points: 10,
            use_lookat: true,
            elevation: 50
        });

        hyperlapse.onError = function(e) {
            console.log(e);
        };

        hyperlapse.onRouteComplete = function(e) {
            hyperlapse.load();
        };

        hyperlapse.onLoadComplete = function(e) {
        };

        // window.onclick = function(e){
        //  hyperlapse.pause();
        // };

        $('article').scroll(function(){
            var offset = $(this).scrollTop();
            var scroll = $(window).scrollTop();
            var articleHeight= $('article').height();
            var streetview = $('#streetview').offset().top;
            var streetviewHeight = $('#streetview').height();
            var transition10 = $('#transition-10').offset().top;
            var transition10Height = $('#transition-10').height();
            
            panoOpacity = Math.max(0, (((transition10+transition10Height)-scroll)/300)-1);

            console.log(offset-articleHeight);
            console.log(streetview+streetviewHeight+articleHeight);


           if ((offset-articleHeight)/2 > streetview+streetviewHeight+articleHeight){
            $("#pano").css("z-index", 997).css("opacity", (-(streetview)/100)+2);
            hyperlapse.play();

           }
           else{
           	$("#pano").css("z-index", "-10")
           }
           if ((scroll + articleHeight*2) > (transition10 + transition10Height)){
            $('#pano').css("opacity", panoOpacity);
            }
            else {
            // $("#pano").css("z-index", "9999")
            $("#pano").css("opacity", (-(streetview)/100)+2);
            hyperlapse.play();
            }
        
            if (panoOpacity < 0.2)  {
            $('#pano').css("z-index", -10);}
            
            
            

    

    });

        
        // Google Maps API stuff here...
        var directions_service = new google.maps.DirectionsService();

        var route = {
            request:{
                origin: new google.maps.LatLng(39.12177,-76.78015),
                destination: new google.maps.LatLng(39.13572,-76.76736),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }
        };

        directions_service.route(route.request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                hyperlapse.generate( {route:response} );
            } else {
                console.log(status);
            }
        });

    }

window.onload = init;
