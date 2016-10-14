
var placeSearch, autocomplete, lat, long, chart1, chart2, chart3;
var darkSky;

$(document).ready(function(){
       
    $("#chart-min").hide();
    $("#chart-hr").hide();
    $("#chart-day").hide();
    $("#navigation").hide();
    
    $(".btn-go").on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function(){
            window.location.hash = hash;
        });
        setTimeout(function () {
            console.log("Triggered");
            $(".hr-click").trigger("click");
        },3000);
        setTimeout(function () {
            console.log("Triggered");
            $(".day-click").trigger("click");
        },6000);
    });
    
    $(".hr-click").on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function(){
            window.location.hash = hash;
        });
    });
    
    $(".day-click").on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function(){
            window.location.hash = hash;
        });
    });
    
    $(".cover-click").on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function(){
            window.location.hash = hash;
        });
    });
    
    $("#navigation a[href^='#']").on('click', function(e) {
        e.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 300, function(){
            window.location.hash = hash;
        });
    });
    
    /* DARK SKY */
    
    darkSky = function(lat, long)
    {
         URL = "https://api.forecast.io/forecast/KEY/".concat(lat).concat(",").concat(long);
         console.log(URL);
         $.ajax({
              url: URL,
              data: {
                 format: 'json'
              },
              error: function() {
                 $('#info').html('<p>An error has occurred</p>');
              },
              dataType: 'jsonp',
              success: function(data) {
                if("hourly" in data){
                    $(".timezone").empty();
                    $(".timezone").append("Timezone: " + data.timezone);
                    $(".temperature").empty();
                    $(".temperature").append("Temperature: " + data.currently.temperature + " F");
                    $(".humidity").empty();
                    $(".humidity").append("Humidity: " + data.currently.humidity*100 + "%");
                    
                    chart1 = c3.generate({
                        bindto: '#chart-minutely',
                        data: {
                            json: data.minutely.data,
                            keys: {
                                value: ['precipProbability'],
                            },
                            names: {
                                precipProbability: 'Chance of rain',
                            }
                        },
                        axis: {
                            x: {
                                label: 'Minute'
                            },
                        }
                    }); 
                    
                    chart2 = c3.generate({
                        bindto: '#chart-hourly',
                        data: {
                            json: data.hourly.data,
                            keys: {
                                value: ['temperature','windSpeed'],
                            },
                            names: {
                                temperature: 'Temperature',
                                windSpeed: 'Wind Speed'
                            }
                        },
                        axis: {
                            x: {
                                label: 'Hour'
                            },
                        }
                    });
                    
                    
                    chart3 = c3.generate({
                        bindto: '#chart-daily',
                        data: {
                            json: data.daily.data,
                            keys: {
                                value: ['temperatureMin','temperatureMax'],
                            },
                            names: {
                                temperatureMin: 'Minimum Temperature',
                                temperatureMax: 'Maximum Temperature'
                            }
                        },
                        axis: {
                            x: {
                                label: 'Day'
                            },
                        }
                    });
                    
                    $(".btn-go").trigger("click");
                    
                }
                else
                    alert("fail");
              },
              type: 'GET'
       });
    }
})

/* MAP AUTOCOMPLETE */

function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        (document.getElementById('autocomplete')),
        {types: ['geocode']});
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        lat = place.geometry.location.lat();
        long = place.geometry.location.lng();
        $("#navigation").show();
        $("#chart-min").show();
        $("#chart-hr").show();
        $("#chart-day").show();
        darkSky(lat, long);
    });
}

function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
}






