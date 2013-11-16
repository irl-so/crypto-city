//setting the map
var map = L.mapbox.map('map', 'lifewinning.map-53lvkbot', {zoomControl: false})
    .setView([39.1283, -76.7719], 15);
var ui = document.getElementById('map-ui');

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
//now when we scroll down through text the map won't zoom all crazylike unless we tell it to
map.scrollWheelZoom.disable();

//layer with all the buildings
var bldgstyle = {
    "color": "#ccc",
    "weight": 7,
    "opacity": 0.7
};

function popUp(f,l){
    var out = [];
    if (f.properties){
        for(key in f.properties){
            out.push(key+": "+f.properties[key]);
        }
        l.bindPopup(out.join("<br />"));
    }
}

map2002 = L.mapbox.tileLayer('occupy.2002_md');
map2006 = L.mapbox.tileLayer('occupy.satellite_tests');
map2013 = L.mapbox.tileLayer('lifewinning.map-0lnszm21');
bldgs = new L.geoJson.ajax("js/bldgs.geojson",  {onEachFeature: popUp, style: bldgstyle});

//here are the sattellite layers
addLayer(map2002, '2002', 'sat-2002');
addLayer(map2006, '2006', 'sat-2006');
addLayer(map2013, '2013', 'sat-2013');
addLayer(bldgs, 'Building Details', 'bldgs');

//this is the thing that controls all the layers, it's important
function addLayer(layer, name, id) {
    //generating a key of layers so viewer can select to add and remove at will
    var item = document.createElement('li');
    var link = document.createElement('a');

    link.href = '#';
    link.innerHTML = name;
    link.id = id;

    link.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            this.className = ''
        } else {
            map.addLayer(layer);
            this.className = 'active';
        }
    };

    item.appendChild(link);
    ui.appendChild(item);
    var layer_ids= document.getElementsByTagName('a');
    // it would be way cooler to do make the scrolling function happen here, but for now we will do something stupidly custom because I'm not sure how to do it the other way
}

//toggle visibility of text
$("#toggle").click(function(){
    $("article").slideToggle();
});

//scrolling triggers, some hella bespoke stuff in here

var articleHeight = $('article').height();

var transition01 = $("#transition-one").offset().top;

// var streetview = $('#streetview').offset().top;
// var streetviewHeight = $('#streetview').height();

var sat2002 = $('#sat-2002').offset().top;
var sat2002Height = $('#sat-2002').height();

var sat2006 = $('#sat-2006').offset().top;
var sat2006Height = $('#sat-2006').height();

var sat2013 = $('#sat-2013').offset().top;
var sat2013Height = $('#sat-2013').height();

var transition10 = $('#transition-10').offset().top;
var transition10Height = $('#transition-10').height();

$('article').scroll(function() {
    var scroll = $(this).scrollTop();

    //fadeout first image in series
    var opacity2002 = (sat2002-scroll)/700;
    $("#img-transition-one").css("opacity", opacity2002);
    if (opacity2002 < 0.1){ $("#img-transition-one").css("z-index", "0");}
    else{$('#img-transition-one').css("z-index", "997");}

    //determine movement of first image based on window size
    if ($(window).width() > 768 ) {
    $("#img-transition-one").css("height", "200%").css("top", -(scroll-transition01)/4);
    }
    else{
    $("#img-transition-one").css("top", -(scroll-transition01)/4);
    }
    //the first big one that introduces the map UI and such
    if ((scroll + articleHeight) > (sat2002 + sat2002Height)) {
        map.addLayer(map2002);
        $("#map-ui").css("z-index", 9999).css("position", "fixed").css("bottom", "20px");
       } 
    else {
        map.removeLayer(map2002);
        $("#img-transition-one").css("opacity", 1).css("z-index", 997);
        $("#map-ui").css("z-index", 0);
    }
    //these are fairly self-explanatory, less smoke/mirrors
    if ((scroll + articleHeight) > (sat2006 + sat2006Height)){map.addLayer(map2006);}
    else{map.removeLayer(map2006);}
    
    if ((scroll + articleHeight) > (sat2013 + sat2013Height)){map.addLayer(map2013);}
    else{map.removeLayer(map2013);}

    //transition out hyperlapse
   // panoOpacity = Math.max(0, (((transition10+transition10Height)-scroll)/300)-1);

   //  console.log("panOpacity "+panoOpacity);
   //  if ((scroll + articleHeight) > (transition10 + transition10Height)){
   //  $('#pano').css("opacity", panoOpacity);
   //  console.log ("DING DING DING");}

   //  if (panoOpacity < 0.1){
   //      $("#pano").css("z-index", "-9999");
   //  }



});

//add hashing, for figuring out exact pan and zoom points for things
var hash = new L.Hash(map);
