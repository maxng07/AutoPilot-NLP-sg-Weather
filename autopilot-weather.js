const axios = require('axios');
const date = require('date-and-time');

exports.handler = function(context, event, callback) 
    let memory = JSON.parse(event.Memory);
    let body = memory.twilio.collected_data.ask_area.answers.Area.answer;
    console.log(event.CurrentInput);
    console.log(body);
	
//obtain current UTC time with +GMT8 offset and shorten into a single variable with data.format and offset
    const now = date.format(date.addHours(new Date(), +8), 'YYYY-MM-DDTHH:mm:ss');  
    const addr = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time='+now ;
    console.log(addr);
	let jsonobj1 = [];
    console.log(jsonobj1);
	
	return axios.get(addr).then(response => {
    jsonobj = JSON.stringify(response.data.items).substr(1,JSON.stringify(response.data.items).length-2);
    console.log(jsonobj) ;
    jsonobj1 = JSON.parse(jsonobj);
    }).catch(error =>{
        console.log("There is an error");
        callback(null, {
              actions: [
                    {
                        say: "Sorry, there seems to be an error, please try again later";
                    }]
             });
        })
    .then(data => {
    var key = Body.toLowerCase(); //Converting body value to lowercase 
    var keyval = [] ; //the array to obtain the value property of the key 
    var msg = "" ; // the response message type to be send back
    var message = "";
    var keyarea = "" ; // to obtain the matched area
    var time = (jsonobj1.update_timestamp).substr(0,10) + " " + (jsonobj1.update_timestamp).substr(11,5) +"h" ;
    var timestamp = (jsonobj1.valid_period.end).substr(0,10) + " " + (jsonobj1.valid_period.end).substr(11,5) +"h" ; // print valid timestamp

//obtaining the value property of the key matched in the key-value array
for (var i = 0; i < jsonobj1.forecasts.length; i++){
     var obj =jsonobj1.forecasts[i] ;  
    //Check for a special key 
     if (key === "all") {
    // Print out the whole JS array 
        keyval = JSON.stringify(jsonobj1.forecasts) ;
        msg = 2 ;
        break ;
    }

    // check for key "area" to print out all the avail regions
    else if
    (key === "area") {
        var x = "area" ;
        var tempkeyval = {} ;
    for (x in jsonobj1.forecasts) {
     tempkeyval += jsonobj1.forecasts[x].area + " ";
     msg = 0  ; // set the variable to determine which message to send back
     console.log(tempkeyval) ;
     } break ;
    } 
    else if 
    // looping through the JSON Javascript object array
//for (var i = 0; i < jsonobj1.forecasts.length; i++){
//     var obj =jsonobj1.forecasts[i] ;
     (key === obj.area.toLowerCase()) { 
         keyval = obj.forecast ;
         keyarea = obj.area ;
         msg =1 ; //set the variable to determine which message to send back
         break ;
     } else {
         msg = 3 ;
     }
/*
     else if 
     (key !== "all" && key !== "area" && key !== obj.area.toLowerCase) {
      msg = 3 ;
      }
*/
}

//    keyval = jsonobj1.forecasts['key']; // this only work for JSON JS object but the imported file is JSON JS array instead
    console.log("The key is " + key +" , " + keyval);
    var resp3 = "You have use an invalid keyword, please key in Area or the Town name." + "\n" + "Type Area to obtain the list of towns, follow by town name of your choice" ;
    var resp2 = "The weather forecast in Singapore " +keyval +"\n" +"Valid till: " + timestamp ;
    var resp1 = "The areas for weather forecasts are: " + tempkeyval ;
    var resp = "The weather in " + keyarea + " is " +keyval + "\n" + "Last Update: " + time + "\n" + "Valid till: " + timestamp ; //constructing the message response, twilio twl does not support var within

    if (msg === 0) {
        message = resp1 ;
    }
    if (msg === 1) {
        message = resp ;
    }
    if (msg === 2) {
        message = resp2 ;
    }
    if (msg === 3) {
        message = resp3 ;
    }
   
    console.log(resp + " " + keyval);
    callback(null, {
              actions: [
                    {
                        say: message
                    }]
             });
    });
};  
