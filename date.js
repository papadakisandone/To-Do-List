//jshint esversion:6

 // kanoume export ti function gia na mporesoume na tin kalesoume

exports.getDate = function (){
    let today = new Date();
    let day = "";
    let options = {
      weekday:"long",
      day:"numeric",
      month:"long"
    };
    day = today.toLocaleDateString("en-US", options);
    return day;
}

exports.getDay = function(){
  let today = new Date();
  let day = "";
  let options = {
    weekday:"long",

  };
  day = today.toLocaleDateString("en-US", options);
  return day;
}
