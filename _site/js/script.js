//setting the map
var map = L.mapbox.map('map', 'lifewinning.map-53lvkbot', {zoomControl: false})
    .setView([39.1283, -76.7719], 15);
var ui = document.getElementById('map-ui');

new L.Control.Zoom({ position: 'bottomright' }).addTo(map);
//now when we scroll down through text the map won't zoom all crazylike unless we tell it to
map.scrollWheelZoom.disable();

//layer with all the buildings
var bldgstyle = {
    "color": "#4B6E88",
    "weight": 7,
    "opacity": 0.7
};

function popUp(f,l){
    var popUpcontent = '<h2>'+f.properties.Name+'</h2><hr><strong>Construction Date: </strong>'+ f.properties.constructionDate +'<br><strong>Square Feet: </strong>'+ f.properties.squareFeet + '<br><strong>Tenants: </strong>'+ f.properties.Tenant ;
    l.bindPopup(popUpcontent);
    };

baselayer = L.mapbox.tileLayer('lifewinning.map-53lvkbot');
map2002 = L.mapbox.tileLayer('occupy.2002_md');
map2006 = L.mapbox.tileLayer('occupy.satellite_tests');
map2013 = L.mapbox.tileLayer('lifewinning.map-0lnszm21');
nas = L.mapbox.tileLayer('occupy.NBP_NAS');
bldgs = new L.geoJson.ajax("js/bldgs.geojson",  {onEachFeature: popUp, style: bldgstyle});

//here are the sattellite layers
addLayer(map2002, '2002', 'sat_2002');
addLayer(map2006, '2006', 'sat_2006');
addLayer(map2013, '2013', 'sat_2013');
addLayer(bldgs, 'Building Details', 'bldgs');
addLayer(nas, "1996 (drawing)", 'nas_1996')

//this is the thing that controls all the layers, it's important
function addLayer(layer, name, id) {
    //generating a key of layers so viewer can select to add and remove at will
    var item = document.createElement('li');
    var link = document.createElement('a');

    item.className= 'nav clearfix';
    link.href = '#';
    link.innerHTML = name;
    link.id = id;
    
    $('article').scroll(function(){
        if(map.hasLayer(layer)){
        item.className = 'nav active clearfix';
    }
        else{
        item.className = 'nav clearfix';
        }

    });


    item.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (map.hasLayer(layer)) {
            map.removeLayer(layer);
            this.className = 'nav clearfix'
        } else {
            map.addLayer(layer);
            this.className = 'nav active clearfix';
        }
    };

    item.appendChild(link);
    ui.appendChild(item);
    var layer_ids= document.getElementsByTagName('a');
  
}

//navigation 
var pull = $('#pull');
var nav = $('#map-ui');

navHeight  = nav.height();

$(pull).on('click', function(e) {  
        e.preventDefault();  
        nav.slideToggle();  
    }); 

$(window).resize(function(){  
    var w = $(window).width();  
    if(w > 320 && nav.is(':hidden')) {  
        nav.removeAttr('style');
    }  
});  

//toggle visibility of text
$("#toggle").click(function(){
    $("article").slideToggle();
});

    var articleHeight = $('article').height()/2;
    var center= $(window).height()/2;

    var sat2002 = $('#sat-2002').offset().top;
   
    var sat2006 = $('#sat-2006').offset().top;
   
    var sat2013 = $('#sat-2013').offset().top;
    
    var jessup = $('#coordinateleap-jessup').offset().top;

    var streetview = $('#streetview').offset().top;

    var transition10 = $('#transition-10').offset().top;
    var transition10Height = $('#transition-10').height();


//scrolling triggers, some hella bespoke stuff in here

$('article').scroll(function() {

    var scroll = $(this).scrollTop();

    if ((scroll + center) > (sat2002)) {
        map.addLayer(map2002);
 } 
    else {
        map.removeLayer(map2002);
    }
    if ((scroll + center) > (sat2006)){
        map.addLayer(map2006);
        }
    else{map.removeLayer(map2006);}
    
    if ((scroll + center) > (sat2013)){
        map.addLayer(map2013);}
    else{map.removeLayer(map2013);}

    if ((scroll + center) > (jessup)){
        map.removeLayer(map2002);
        map.removeLayer(map2006);
    //     map.setView([39.1442,-76.7770], 16);}
    // else{map.setView([39.1283, -76.7719], 15);
    }

    if ((scroll + center) > (transition10 + transition10Height)){
        map.removeLayer(map2013);
        map.removeLayer(map2006);
        map.removeLayer(map2002);
        }
    else{
      //map.removeLayer(baselayer);
        }

});

//add hashing, for figuring out exact pan and zoom points for things
//var hash = new L.Hash(map);
