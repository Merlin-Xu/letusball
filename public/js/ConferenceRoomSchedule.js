var currentPostion = false;
var path="./css/";
var indexBusy;
var countBusy;
var busyInfo=[];
var cancelBusyRoomInfo = [];
var busyInfoFromNJ=[];
var corpIDMeetingArr= new Array();
var dataResponse;
var currentDate;
var currentType = false;
function createIntervalArray(){
    var intervals = new Array();
    intervals[0]="06:00 AM";
    intervals[1]="06:30 AM";
    intervals[2]="07:00 AM";
    intervals[3]="07:30 AM";
    intervals[4]="08:00 AM";
    intervals[5]="08:30 AM";
    intervals[6]="09:00 AM";
    intervals[7]="09:30 AM";
    intervals[8]="10:00 AM";
    intervals[9]="10:30 AM";
    intervals[10]="11:00 AM";
    intervals[11]="11:30 AM";
    intervals[12]="12:00 PM";
    intervals[13]="12:30 PM";
    intervals[14]="01:00 PM";
    intervals[15]="01:30 PM";
    intervals[16]="02:00 PM";
    intervals[17]="02:30 PM";
    intervals[18]="03:00 PM";
    intervals[19]="03:30 PM";
    intervals[20]="04:00 PM";
    intervals[21]="04:30 PM";
    intervals[22]="05:00 PM";
    intervals[23]="05:30 PM";
    intervals[24]="06:00 PM";
    intervals[25]="06:30 PM";
    intervals[26]="07:00 PM";
    intervals[27]="07:30 PM";
    intervals[28]="08:00 PM";
    intervals[29]="08:30 PM";
    /*intervals[30]="09:00 PM";
     intervals[31]="09:30 PM";
     intervals[32]="10:00 PM";*/
    return intervals;
}
function getRoomsBySite(sitecode)
{
  console.log("aa"+sitecode);
  $.ajax({
          url: "http://localhost:8080/getRoomsBySite",
          data: {'siteCode':sitecode},
          type: "GET",
          contentType: "application/json; charset=utf-8",
          dataType: "jsonp",
          jsonpCallback:"success",
          error: function () {
             console.log("Unable to Get FreeBusy Data");
          },
          success: function (response) {
              console.log("What's Great"+'\n'+JSON.stringify(response));
              //var data = JSON.stringify(response);
              getRoomsByUI(response);
      }
  });

}
function getRoomsByUI(data)
{

  $("#roomsBySite").empty();
  $("#roomsBySite").append('<h3>Select a Room:</h3>');
  var crSiteSpan = $('<span>');
  crSiteSpan.attr("id", "siteDropDown");
  var crSiteDropDownlabel = $("<label for ='select-choice-0' class='select'>Select a Room:</label>");
  var crSiteDropDownSelect = $('<select>');
  crSiteDropDownSelect.attr("id", "select-choice-Room");
  crSiteDropDownSelect.attr("data-theme","a");
  var crSiteDropDownOption0 = $('<option>');
  crSiteDropDownOption0.attr("value", "Select a Room");
  crSiteDropDownOption0.append("Select a Room");
  crSiteDropDownSelect.append(crSiteDropDownOption0);
  $.each(data,function(key,val){
       var crSiteDropDownOption = $('<option>');
      crSiteDropDownOption.attr("value", val.outlookAlias);
      crSiteDropDownOption.append(val.roomName);
      crSiteDropDownSelect.append(crSiteDropDownOption);

  })
  crSiteSpan.append(crSiteDropDownSelect);
  $("#roomsBySite").append(crSiteSpan).trigger('create');
  $("#select-choice-Room").selectmenu( "refresh", true );
}
$(document).ready(function(){

                  var socket = io.connect('localhost');
                  //var socket = io.connect('http://10.179.89.40:8080');
                  var sessionId = '';
                  currentDate =  new Date().getDay();
                  socket.on('connect',  function(data) {
                            // $('#incomingChatMessages').append($('<li>'+data.message+'</li>'));
                            sessionId = socket.socket.sessionid;
                            socket.emit('newUser', {id: sessionId, name: 'Conf.XCE.Taishan'});
                            socket.on('message',function(data){

                                      //var dataFromNJ = JSON.parse(data.message);
                                      var dataFromNJ = data.message;
                                      currentType = dataFromNJ.newMark;
                                      //compare with 2 array from node js server
                                      if(currentType == true)
                                      {
                                          getNewBusyInfoFromNJ(dataFromNJ);
                                      }

                                      else if(currentDate == dataFromNJ.currentDate)
                                      {
                                          compareArrayFromNJ(dataFromNJ);
                                      }
                                      else
                                      {
                                         getNewBusyInfoFromNJ(dataFromNJ);
                                      }
                                      /*if((currentDate == dataFromNJ.currentDate)||(currentType == false))
                                      {

                                          compareArrayFromNJ(dataFromNJ);
                                      }
                                      else
                                      {
                                          getNewBusyInfoFromNJ(dataFromNJ)
                                      }*/
                                      currentDate = dataFromNJ.currentDate;

                                      console.log("data.currentDate:"+dataFromNJ+"//"+currentDate+"//currentType:"+currentType);
                                      //compareArrayFromNJ(dataFromNJ);
                                      });
                            socket.on('userDisconnected', function(msg) {});
                            });
                  setRoomScheduleUI();
                  socket.on('userDisconnected', function(msg) {

                  });
                  window.setInterval(createScheduleUIByTime, 1000*10);
                  $("#action_btn_start1").on('click', function(e) {
                                             $(this).css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
                                             });
                  $("#action_btn_start2").on('click', function(e) {
                                             $(this).css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
                                             });

                  $("#selectSite").on('change', function(e){
                                            getRoomsBySite($(this).val());
                                             });
                  $.mobile.document.on("change","#select-choice-Room", function(e){
                          console.log($(this).val());
                          //$(this).find("option:selected").text();
                          $('#header span').text($(this).find("option:selected").text());
                          var user = {id: socket.socket.sessionid,name:$(this).val()};
                          console.log("user:"+JSON.stringify(user)+"select name:"+$(this).find("option:selected").text());
                          socket.emit('resetting', user);
                 });
                  if(window.orientation == 0)
                  {
                  $("#action_btn_update").css("margin-left", "5px");
                  $("#action_btn_face").css("margin-left", "5px");
                  //$("#action_btn_face2").css("margin-left", "5px");
                  //$("#action_btn_report").css("margin-left", "5px");
                  }
                  else
                  {
                  $("#action_btn_update").css("margin-left", "20px");
                  $("#action_btn_face").css("margin-left", "20px");
                  //$("#action_btn_face2").css("margin-left", "20px");
                  //$("#action_btn_report").css("margin-left", "20px");
                  }
                  $(window).on('orientationchange', function(event){
                               if(event.orientation == 'portrait')
                               {
                               $("#action_btn_update").css("margin-left", "5px");
                               $("#action_btn_face").css("margin-left", "5px");
                               // $("#action_btn_face2").css("margin-left", "5px");
                               //$("#action_btn_report").css("margin-left", "5px");
                               }
                               else if(event.orientation == 'landscape')
                               {
                               $("#action_btn_update").css("margin-left", "20px");
                               $("#action_btn_face").css("margin-left", "20px");
                               // $("#action_btn_face2").css("margin-left", "20px");
                               //$("#action_btn_report").css("margin-left", "20px");
                               }
                    });

                  });
/**
 * compare start item with 2 array busyarray and Nodejsarray
 *@ return ture/false
 */
function compareStartItemFromNJ(data)
{
    var flag = true;
    $.each(busyInfoFromNJ,function(key,val){

           var tempStartItem = val.split("*")[4];
           if(parseInt(data,10) == parseInt(tempStartItem,10))
           {
           flag = false;
           }

           });
    return flag;
}
/**
 * get new busy info and dataResponse.freebusyIntervalAvailability
 */
 function getNewBusyInfoFromNJ(data)
 {
  dataResponse = data;
  console.log("getNewBusyInfoFromNJ:dataResponse="+dataResponse.freebusyIntervalAvailability);

  busyInfo.length =0;
  cancelBusyRoomInfo.length = 0;
  busyInfoFromNJ.length =0;
  if(typeof data.detailedFreebusydata  != 'undefined')
  {
    var tempI = 0;
    var tempBusyI = 0;
    if(data.detailedFreebusydata.length > 0)
    {
      $.each(data.detailedFreebusydata, function(f, kval) {
                   if((kval.busyType == 'Busy') ||(kval.busyType == 'Tentative'))
                   {

                   var timeSlot = getTimeSlotCount(kval.endTime,kval.startTime);
                   var tempTimeSlot = timeSlot;
                   var busySubject = kval.subject;
                   var meetingID = kval.id;
                   for(var i = tempI ;i < data.freebusyIntervalAvailability.length;i++)
                   {
                   if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
                   {
                   for (var k = 0;k < timeSlot;k++)
                   {
                   if(data.freebusyIntervalAvailability[i] == 'Free')
                   {
                   tempTimeSlot--;
                   }
                   i++;
                   }
                   i = i-timeSlot;
                   timeSlot = tempTimeSlot;
                   //mergeBusySubject(i,timeSlot);
                   busyInfoFromNJ[tempBusyI] =  i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
                   busyInfo[tempBusyI] =  i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
                   var tempJ = i+timeSlot;
                   for(var j = 0;j < timeSlot ;j++)
                   {
                   if(j > 0)
                   {
                   i = i+1;
                   }
                   /*if(((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))&& (busySubject != ""))
                    {
                    $("#free"+i).text(busySubject);

                    }*/
                   }
                   tempI = tempJ;
                   tempBusyI++;
                   break;
                   }
                   }
                   }
                   });
    }
    else
    {
      if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
      {

        var timeSlot = getTimeSlotCount(data.detailedFreebusydata.endTime,data.detailedFreebusydata.startTime);
        var busySubject = data.detailedFreebusydata.subject;
        for(var i = tempI ;i < data.freebusyIntervalAvailability.length;i++)
        {

          if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
          {
            for (var k = 0;k < timeSlot;k++)
            {
              if(data.freebusyIntervalAvailability[i] == 'Free')
              {
                tempTimeSlot--;
              }
              i++;
            }
            i = i-timeSlot;
            timeSlot = tempTimeSlot;
            //mergeBusySubject(i,timeSlot);
            busyInfoFromNJ[tempBusyI] = i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
            busyInfo[tempBusyI] =  i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
            var tempJ = i+timeSlot;
            for(var j = 0;j < timeSlot ;j++)
            {
              if(j > 0)
              {
                i = i+1;
              }
              /*if(((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative')) && (busySubject != ""))
                             {
                             $("#free"+i).text(busySubject);
                             }*/
            }
            tempI = tempJ;
            break;
          }
        }
      }
    }
  }
  console.log("busyInfo:"+busyInfo);
  console.log("busyInfoFromNJ:"+busyInfoFromNJ);
  setRoomScheduleUI();
  createScheduleUIByTime();
 }
/**
 * compare with 2 array busy info and dataResponse.freebusyIntervalAvailability
 */
function compareArrayFromNJ(data)
{
  if(typeof data.detailedFreebusydata  != 'undefined')
  {
    var tempI = 0;
    var tempBusyI = 0;
    if(data.detailedFreebusydata.length > 0)
    {
      $.each(data.detailedFreebusydata, function(f, kval) {
                   if((kval.busyType == 'Busy') ||(kval.busyType == 'Tentative'))
                   {

                   var timeSlot = getTimeSlotCount(kval.endTime,kval.startTime);
                   var tempTimeSlot = timeSlot;
                   var busySubject = kval.subject;
                   var meetingID = kval.id;
                   for(var i = tempI ;i < data.freebusyIntervalAvailability.length;i++)
                   {
                   if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
                   {
                   for (var k = 0;k < timeSlot;k++)
                   {
                   if(data.freebusyIntervalAvailability[i] == 'Free')
                   {
                   tempTimeSlot--;
                   }
                   i++;
                   }
                   i = i-timeSlot;
                   timeSlot = tempTimeSlot;
                   //mergeBusySubject(i,timeSlot);
                   busyInfoFromNJ[tempBusyI] =  i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
                   var tempJ = i+timeSlot;
                   for(var j = 0;j < timeSlot ;j++)
                   {
                   if(j > 0)
                   {
                   i = i+1;
                   }
                   /*if(((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))&& (busySubject != ""))
                    {
                    $("#free"+i).text(busySubject);

                    }*/
                   }
                   tempI = tempJ;
                   tempBusyI++;
                   break;
                   }
                   }
                   }
                   });
    }
    else
    {
      if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
      {

        var timeSlot = getTimeSlotCount(data.detailedFreebusydata.endTime,data.detailedFreebusydata.startTime);
        var busySubject = data.detailedFreebusydata.subject;
        for(var i = tempI ;i < data.freebusyIntervalAvailability.length;i++)
        {

          if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
          {
            for (var k = 0;k < timeSlot;k++)
            {
              if(data.freebusyIntervalAvailability[i] == 'Free')
              {
                tempTimeSlot--;
              }
              i++;
            }
            i = i-timeSlot;
            timeSlot = tempTimeSlot;
            //mergeBusySubject(i,timeSlot);
            busyInfoFromNJ[tempBusyI] = i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
            var tempJ = i+timeSlot;
            for(var j = 0;j < timeSlot ;j++)
            {
              if(j > 0)
              {
                i = i+1;
              }
              /*if(((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative')) && (busySubject != ""))
                             {
                             $("#free"+i).text(busySubject);
                             }*/
            }
            tempI = tempJ;
            break;
          }
        }
      }
    }
  }

    console.log("11111busyInfo:"+busyInfo);
    console.log("111111busyInfoFromNJ:"+busyInfoFromNJ);
    //the meeting is canceled from outlook
    $.each(busyInfo,function(key,val){
          console.log("val:"+val+"key:"+key);
           var tempStartItem = val.split("*")[4];
           var flag = compareStartItemFromNJ(tempStartItem);
           var _exist = $.inArray(val,busyInfoFromNJ);
           if((_exist < 0) && (flag == true))
           {
           var temp = val.split("*");
           var tempStart = temp[0];
           var tempCount = temp[1];
           var f = parseInt(tempStart,10);
           tempCount = f+ parseInt(tempCount,10);
           for (var i = f; i < tempCount; i++)
           {
           $('#free'+i).text("");
           dataResponse.freebusyIntervalAvailability[i] = "Free";
           }
           busyInfo.remove(key);
           }

           });
    //add a new meeting from outlook
    $.each(busyInfoFromNJ,function(key,val){
           var _exist = $.inArray(val,busyInfo);
           var tempStartItem = val.split("*")[4];
           var flag = compareStartItemFromNJ(tempStartItem);
           if((_exist < 0) && (flag == true))
           {
           //add a new meeting information into 2 array free/busy
           var _exist2 = $.inArray(val,cancelBusyRoomInfo);
           if(_exist2 < 0){
           addMeetingToArray(val);
           }
           }
           });
    //createScheduleUIByTime();
}
/**
 * add a new meeting information into 2 array free/busy
 */
function addMeetingToArray(data)
{
    var tempBusy = data;
    var indexBusy = tempBusy.split('*')[0];
    var countBusy = tempBusy.split('*')[1];
    var tempSubject = tempBusy.split('*')[2];
    var tempStatus = tempBusy.split('*')[3];

    //update free busy array
    var indexCount = parseInt(indexBusy,10)+parseInt(countBusy,10);
  for(var i = indexBusy;i<indexCount;i++)
  {
    $('#free'+i).css({"background-color":"#FEFACC","border":"solid 1px rgb(179, 179, 179)"});
    $('#free'+i).text(tempSubject);
    $('#free'+i).removeAttr("onclick");
    dataResponse.freebusyIntervalAvailability[i]='Busy';
  }
    mergeBusySubject(parseInt(indexBusy,10),parseInt(countBusy,10));
    //insert new booking info into busyinfo array
  for(var i= 0;i<busyInfo.length;i++ ){
    var temp = busyInfo[i].split("*");
    if(parseInt(indexBusy,10) < parseInt(temp[0],10))
    {
            busyInfo.splice(i,0,data);
      break;
    }
  }
}
/**
 * Set UI Schedule
 */
function setRoomScheduleUI(){
  $('#freeBusyResponse').empty();
  var intervals = createIntervalArray();
  var intervalsArray = [];
  var tRow = '';
  var currTimeLine;
  var timeLinePX;
  var curentMeetingLine,tempMeetingLine = 0;
  $.each(intervals, function(f, kval) {
           /*set current time line*/
           var flagTimeLine = getCurrentTimeLine(kval).split('|');
           if(flagTimeLine[0] == 'true')
           {
           currTimeLine = f;
           timeLinePX = flagTimeLine[1];
           curentMeetingLine = (f%2 == 0)?f:tempMeetingLine;
           }
           if( f%2 == 0)
           {
           tempMeetingLine = f;
           tRow += '<tr id = "timelinediv'+f+'" style="border-left:solid 1px #cdcbcb;text-shadow: none;height: 41px"><th id = "timeline'+f+'"  >'+kval+'</th><td  id = "free'+f+'" style="background-color:#DBDBDB;border:solid 1px rgb(179, 179, 179);font-weight: bold;vertical-align: middle;">&nbsp;</td></tr>';
           }
           else
           {
           tRow += '<tr id = "timelinediv'+f+'" style="border-left:solid 1px #cdcbcb;text-shadow: none;height: 41px"><th id = "timeline'+f+'"  ></th><td  id = "free'+f+'" style="background-color:#DBDBDB;border:solid 1px rgb(179, 179, 179);font-weight: bold;vertical-align: middle;">&nbsp;</td></tr>';
           }
           });
    $('#freeBusyResponse').append(tRow);

    // set current yellow line to display current time
    if (currTimeLine >= 0 )
    {
        $("#timeline"+currTimeLine).css({"background-image":"url("+path+"yellowline.png)","background-repeat":"repeat-x","background-position":"0px "+timeLinePX+"px"});
    }

    $.each(intervals, function(f, kval) {
           $("#timeline"+f).css({"text-align":"center","border-bottom":"1px solid #b3b3b3 ","border-top":"1px solid #b3b3b3","width":"30%","font-weight":"bold","background-color":"white","height":"30px","font-size":"larger","line-height":"30px"});
           });
    scrollToElement("#free"+curentMeetingLine);
    getFreeBusyByData("Taishan","Conf.XCE.Taishan");
    //createScheduleUIBySearch("Taishan",dataResponse);
    $("#schPanel").table( "rebuild" ).css('height', '100%');
}
/**
 * get time stamp
 */
function createEpochTimeStamp(year,month, day, hours, mins){
    var now = new Date();

    var zeropad = function (num) { return ((num < 10) ? '0' : '') + num; }
    var date = new Date(zeropad(year), zeropad(month),zeropad(day),zeropad(hours), zeropad(mins), zeropad(0));
    var epochDate = date.getTime()/1000;
    return epochDate;
}
/**
 * get current time
 * reture false/ture
 */
function getCurrentTimeArray(data){
  var d = new Date();
  var month = d.getMonth();
  var year = d.getFullYear();
  var day = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var staticTimeStamp = createEpochTimeStamp(year,month,day,'0','0');
  var currTimeStamp = createEpochTimeStamp(year,month,day,'0','0');
  if(staticTimeStamp == currTimeStamp)
  {

    var tempH = data.substr(0,2);
    var tempM = data.substr(3).substr(0,2);
    var am = data.substr(6,8);

    if((am == 'PM')&&(tempH != '12'))
    {
      tempH = parseInt(tempH,10);
      tempH += 12;
    }
    if (parseInt(hour,10) > parseInt(tempH,10)){
      return true;
    }
    else if(hour == tempH)
    {

      if(( parseInt(minute,10)>=0) && (parseInt(minute,10) <= 30) &&( tempM == '00'))
      {
        return false;
      }
      else if(( parseInt(minute,10)>30) &&( tempM == '00'))
      {
        return true;
      }
      else if(( parseInt(minute,10)>=0) && (parseInt(minute,10) <= 30) &&( tempM == '30'))
      {

        return false;
      }
      else if(( parseInt(minute,10)>30) &&( tempM == '30'))
      {

        return false;
      }
    }
    else
    {

      return false;
    }
  }
  else if(staticTimeStamp < currTimeStamp)
  {
    return true;
  } //set grey item in past time
  else
  {
    return false;
  }

}
/**
 * Gets the px value with yellow line image and whether is current time
 * param current time of array data
 * return px and ture or false.
 */
function getCurrentTimeLine(data){
  var d = new Date();
  var month = d.getMonth();
  var year = d.getFullYear();
  var day = d.getDate();
  var hour = d.getHours();
  var minute = d.getMinutes();

  var tempH = data.substr(0,2);
  var tempM = data.substr(3).substr(0,2);
  var am = data.substr(6,8);
  var timeLinePX = -1;
  if((am == 'PM')&&(tempH != '12'))
  {
    tempH = parseInt(tempH,10);
    tempH += 12;
  }
  if(tempM == '00')
  {
    if ((hour == tempH)&&(( parseInt(minute,10)>=0) && (parseInt(minute,10) <= 30)))
    {

      switch(parseInt(minute/5,10))
      {
                case 0:
                    timeLinePX=0;
                    break;
                case 1:
                    timeLinePX=5;
                    break;
                case 2:
                    timeLinePX=13;
                    break;
                case 3:
                    timeLinePX=19;
                    break;
                case 4:
                    timeLinePX=25;
                    break;
                case 5:
                    timeLinePX=32;
                    break;
                case 6:
                    timeLinePX=38;
                    break;
                default:

      }

      return 'true|'+timeLinePX;
    }
    else
    {
      return 'false|'+timeLinePX;
    }

  }
  else
  {
    if ((hour == tempH)&&(parseInt(minute,10) > 30))
    {

      switch(parseInt((minute-30)/5,10))
      {
                case 0:
                    timeLinePX=0;
                    break;
                case 1:
                    timeLinePX=5;
                    break;
                case 2:
                    timeLinePX=13;
                    break;
                case 3:
                    timeLinePX=19;
                    break;
                case 4:
                    timeLinePX=25;
                    break;
                case 5:
                    timeLinePX=32;
                    break;
                case 6:
                    timeLinePX=38;
                    break;
                default:

      }
      return 'true|'+timeLinePX;
    }
    else
    {
      return 'false|'+timeLinePX;
    }
  }
}
/**
 * Set error info,currently it doesn't call.
 * param room name
 */
function errorUIBySearch(data){
  $('#information').empty();
  $('#information').append("No schedule information is for your selected room - "+data);
  $('#information').css({"color":"red","font-weight":"bold"});
}
/**
 * Gets the meeting counts,e.g. 1.5hours = 3
 * param startTime and endTime
 * return the meeting counts
 */
function getTimeSlotCount(endTime,startTime){
  var tempE = endTime.split(":");
  var tempS = startTime.split(":");
  var tempE_Hour = parseInt(tempE[0],10);
  var tempE_Min = parseInt(tempE[1],10);
  var tempS_Hour = parseInt(tempS[0],10);
  var tempS_Min = parseInt(tempS[1],10);
  if(tempE_Hour == 0)
  {
    tempE_Hour = 24;
  }
  var hourCounts;
  if((tempE_Hour > tempS_Hour) || (tempE_Hour == tempS_Hour))
  {
    hourCounts = (tempE_Hour-tempS_Hour)*2;
  }
  else
  {
    hourCounts = (24 - tempS_Hour + tempE_Hour)*2;
  }
  if(((tempE_Min > 0) && (tempE_Min < 30)) && ((tempS_Min > 0) && (tempS_Min < 30)))
  {
    hourCounts++;
  }
  if(((tempE_Min > 30) && (tempE_Min < 60)) && ((tempS_Min > 30) && (tempS_Min < 60)))
  {
    hourCounts++;
  }
  if(((tempE_Min > 30) && (tempE_Min < 60)) && ((tempS_Min > 0) && (tempS_Min < 30)))
  {
    hourCounts = hourCounts + 2;
  }
  if((tempE_Min == 0) && (tempS_Min == 30))
  {
    hourCounts--;
  }
  if((tempE_Min == 30) && (tempS_Min == 0))
  {
    hourCounts++;
  }
  return hourCounts;
}
function closePanel()
{
    $( "#bookRoomPanel" ).panel( "close" );
}
function closeReportPanel()
{
    $( "#reportPanel" ).panel( "close" );
}

function openChangePanel()
{
    $( "#changePanel" ).panel( "open" );
}
function closeChangePanel()
{
    $( "#changePanel" ).panel( "close" );
}
/**
 * booking room
 * param the number of selecting startTime
 */
function bookBtn(index)
{
  var indexCount = parseInt(index,10)+parseInt($("#durationBook").val(),10);
    //set schedule styling
  for(var i = index;i<indexCount;i++)
  {
    $('#free'+i).css({"background-color":"#FEFACC","border":"solid 1px rgb(179, 179, 179)"});
    $('#free'+i).text($("#subject").val());
    $('#free'+i).removeAttr("onclick");
    dataResponse.freebusyIntervalAvailability[i]='Busy';
  }
  mergeBusySubject(parseInt(index,10),parseInt($("#durationBook").val(),10));

  //insert new booking info into busyinfo array
  for(var i= 0;i<busyInfo.length;i++ ){
    var temp = busyInfo[i].split("*");

    if(parseInt(index,10) < parseInt(temp[0],10))
    {
            if(currentPostion)
            {
                busyInfo.splice(i,0,index+"*"+$("#durationBook").val()+"*"+$("#subject").val()+"*Y"+"*ID"+"*N");
            }
            else
            {
                busyInfo.splice(i,0,index+"*"+$("#durationBook").val()+"*"+$("#subject").val()+"*N"+"*ID"+"*N");
            }
      break;
    }
  }
  //check book time is current time for update current info
  var intervals = createIntervalArray();
  $.each(intervals, function(f, kval) {
           //update right content
           var flagTimeLine = getCurrentTimeLine(kval).split('|');
           if((flagTimeLine[0] == 'true')&&(index == f))
           {

           getCurrentBusyInfo(kval,f);
           }
           //update click function in the schedule part
           if(dataResponse.freebusyIntervalAvailability[f] == 'Free')
           {
           var flag = getCurrentTimeArray(kval);
           if(!flag)
           {
           intervalsArray = getIntervalsFreeBusy(kval,intervals,dataResponse.freebusyIntervalAvailability);
           //$('#free'+f).removeAttr("onclick");
           //$('#free'+f).attr("onClick", "openBookingForm('"+kval+"','"+f+"','"+intervalsArray+"')");
           }


           }
           })
  //update next meeting info
  var intervals = createIntervalArray();
  $.each(intervals, function(f, kval) {
           var flagTimeLine = getCurrentTimeLine(kval).split('|');
           if(flagTimeLine[0] == 'true')
           {
           for(var i= 0;i<busyInfo.length;i++ )
           {
           var temp = busyInfo[i].split("*");
           if(temp[0] > f)
           {
           var tempa = temp[0];
           var tempb = temp[1];
           var tempc = parseInt(tempa,10)+parseInt(tempb,10);
           var checkFlag = checkTimeWithBusy(intervals[tempa]);
           if((parseInt(tempa,10)+parseInt(tempb,10)) >= intervals.length)
           {
           $('#getNextBusyInfo').empty();
           //$('#getNextBusyInfo').append("<p><span class='detailFontCls'>Meeting Time: From</span> "+intervals[tempa]+"<span class='detailFontCls' >to</span> 09:00 PM </p><p><span class='detailFontCls'>Meeting Subject: </span>"+$("#free"+tempa).text()+"</p>");
           //$('#getNextBusyInfo').append("<p>You can sign in 15 minutes before start meeting.</p><div id='action_btn_start2'><p class='action_btn_text'>Sign in</p></div>");
           $('#getNextBusyInfo').append("<p style='font-size: x-large;margin-bottom:0px'><b>NEXT: "+$("#free"+tempa).text()+"</b></p><div style='border:1px solid #389015;margin-top:0'></div>");
           $('#getNextBusyInfo').append("<p><span class='detailFontCls'>Meeting Time: From</span> "+intervals[tempa]+"<span class='detailFontCls' >to</span> 09:00 PM </p>");
           $('#getNextBusyInfo').append("<p>You can sign in 15 minutes before start meeting.</p><div id='action_btn_start2'><p class='action_btn_text'>Sign in</p></div>");
           }
           else
           {
           $('#getNextBusyInfo').empty();
           $('#getNextBusyInfo').append("<p style='font-size: x-large;margin-bottom:0px'><b>NEXT: "+$("#free"+tempa).text()+"</b></p><div style='border:1px solid #389015;margin-top:0'></div>");
           $('#getNextBusyInfo').append("<p><span class='detailFontCls'>Meeting Time: From</span> "+intervals[tempa]+" <span class='detailFontCls' >to</span> "+intervals[parseInt(tempa,10)+parseInt(tempb,10)]+"</p>");
           $('#getNextBusyInfo').append("<p>You can sign in 15 minutes before start meeting.</p><div id='action_btn_start2'><p class='action_btn_text'>Sign in</p></div>");

           }
           if(checkFlag)
           {
           $('#action_btn_start2').css({"background-color": "#389015","border":"1px solid #389015" });
           $('#action_btn_start2').attr("onClick", "actionNextStartBtn('"+tempa+"')");
           }
           break;
           }
           else
           {
           $('#getNextBusyInfo').empty();
           $('#getNextBusyInfo').append('<p style="font-size: larger;margin-bottom:0px"><b>NEXT: There is no meeting</b></p><div style="border:1px solid #389015;margin-top:0"></div>');
           }
           }
           }
           });
  closePanel();
}
/**
 * open booking page
 * param startTime,index of number,busy/free array contains 6 items
 */
function openBookingForm(startTime,index,intervalsArray)
{
  var selectDuration = new Array();
    selectDuration[0]="<option value='1'>30 min</option>";
    selectDuration[1]="<option value='2'>1 hour</option>";
    selectDuration[2]="<option value='3'>1.5 hours</option>";
    selectDuration[3]="<option value='4'>2 hours</option>";
    selectDuration[4]="<option value='5'>2.5 hours</option>";
    selectDuration[5]="<option value='6'>3 hours</option>";
    $("#durationBook").empty();
    $('#bookBtnDiv').empty();
    $("#startTime").text("Start Time: "+startTime);
    $("#organiser").val('');
    $("#password").val('');
    $("#subject").val('');
    $("#body").val('');
    $("#durationBook").append("<option value=1'>Select Duration</option>");
    for(var i = 0; i < intervalsArray.split(',').length;i++)
    {
        if(intervalsArray.split(',')[i] == 'Free')
        {
            $("#durationBook").append(selectDuration[i]);
        }
        else
        {
            break;
        }
    }
    $("#durationBook option[value='Select Duration']").attr("selected", true);
    $("#durationBook").selectmenu("refresh",true)
    $('#bookBtnDiv').append(" <div style='display: inline-block;'><div id='action_btn_book' ><p class='action_btn_text'>Book It</p></div><div id='action_btn_close' onclick='closePanel()'><p class='action_btn_text'>Close</p></div></div>");
    $('#action_btn_book').attr("onClick", "bookBtn('"+index+"')");
    $("#bookRoomPanel").panel("open");
}
/**
 * click sign in button within the current part
 * param index of numbers
 */
function actionCurrentStartBtn(index)
{
    //$(".face_register").show();
  var tempI;
  var flag = false;
  var status;
  //the current time is in the frist time item with busy room
  for(var i= 0;i<busyInfo.length;i++ )
  {
    var temp = busyInfo[i].split("*");
    if(parseInt(index,10) == parseInt(temp[0],10))
    {
      flag =true;
      tempI = i;
      var tempStart = temp[0];
      var tempCount = temp[1];
      var tempSubject = temp[2];
            var tempID = temp[4];
            var tempPreStart = temp[5];
      break;

    }
  }
    //the current time is not in the frist time item with busy room
  if(!flag)
  {
    for(var i= 0;i<busyInfo.length;i++ )
    {
      var temp = busyInfo[i].split("*");
      if(parseInt(temp[0],10) < parseInt(index,10))
      {
        tempI = i;
        var tempStart = temp[0];
        var tempCount = temp[1];
        var tempSubject = temp[2];
                var tempID = temp[4];
                var tempPreStart = temp[5];
      }
    }
  }
  busyInfo[tempI] = tempStart+"*"+tempCount+"*"+tempSubject+"*Y"+"*"+tempID+"*"+tempPreStart;
  $("#action_btn_start1").css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
  $("#bookRoomStatus").html('<span class="detailFontCls">Booking Room Status:</span> <span style="font-color:red">In Progress</span> <img class = "imgStatus" src="'+path+'icon-Admin1Green.png"/>');
  $("#action_btn_start1").removeAttr("onClick");
    $('#action_btn_face').css({"background-color": "#389015","border":"1px solid #389015" });
    $('#action_btn_face').attr("onClick", "actionCurrentFaceBtn('"+tempID+"','"+tempSubject+"')");
    $('#action_btn_report').css({"background-color": "#389015","border":"1px solid #389015" });
    $('#action_btn_report').attr("onClick", "actionCurrentReportBtn('"+tempID+"','"+tempSubject+"')");
}
/**
 * click report button
 * param the id and subject with meeting
 */
function actionCurrentReportBtn(id,subject)
{
    $("#reportPanel").panel("open");
    $("#meetingSubject").empty();
    $("#meetingSubject").append("Subject:"+subject);
    $("#reportContent").empty();

    var currentMeetingArr = [];
    for(var i=0;i<corpIDMeetingArr.length;i++){
        if(corpIDMeetingArr[i].substr(0,corpIDMeetingArr[i].indexOf('/'))==id){
            currentMeetingArr = corpIDMeetingArr[i].substr(corpIDMeetingArr[i].indexOf('/')+1).split(',');
            break;
        }

    }

    var tempLength = currentMeetingArr.length;
    if(parseInt(tempLength,10) == 0)
    {
        $("#reportContent").append("<p>Nobody attend this meeting currently.</p>")

    }
    else
    {
        $("#reportContent").append("<p>The attendees of the meeting as below:</p><br/>")
        $.each(currentMeetingArr,function(key,val){
               var tempI = parseInt(key,10)+1;
               $("#reportContent").append("<p>"+tempI+". A"+val+"</p>");
               });
    }
}
/**
 * click sign in button with in the next part
 * param the index of number
 */

function actionNextStartBtn(index,kval)
{
    var tempI;
    for(var i= 0;i<busyInfo.length;i++ )
    {
        var temp = busyInfo[i].split("*");
        if(parseInt(temp[0],10) == parseInt(index,10))
        {
            tempI = i;
            var tempStart = temp[0];
            var tempCount = temp[1];
            var tempSubject = temp[2];
            var tempID = temp[4];
            busyInfo[tempI] = tempStart+"*"+tempCount+"*"+tempSubject+"*Y"+"*"+tempID+"*Y";
            break;
        }
    }
    $('#action_btn_start2').css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
    //$("#action_btn_face2").css({"background-color": "#389015","border":"1px solid #389015" });
    // $('#action_btn_face2').attr("onClick", "actionCurrentFaceBtn2('"+tempID+"','"+tempSubject+"')");
    getCurrentBusyInfo(kval,index);
    getNextBusyInfo(index,kval);
    //updateNextMeeting(index);
}
function checkBusyInfoByIndex(f){

  var flag = false;
  for(var i= 0;i<busyInfo.length;i++ ){
        var tempI = busyInfo[i].split("*");
        if(f == tempI[0])
        {
            flag = true;
            break;
        }
    }
  return flag;
}
/**
 * cancel booking room info
 * param startTime,index of number
 */
function actionCurrentCancelBtn(kval,f)
{
    //$(".face_register").hide();
  var intervals = createIntervalArray();
  var rightTD = $("#free"+indexBusy);
  rightTD.removeAttr("rowSpan");
  var tempStart;
  var tempDelect;
  var temp;
  var tempSubject;
  var tempStatus;
  var tempPreStart;
  var tempID;
  var tempBusyStatus;
  tempBusyStatus = checkBusyInfoByIndex(f);
  if(tempBusyStatus)
  {
    for(var i= 0;i<busyInfo.length;i++ ){
      var tempI = busyInfo[i].split("*");

      if(parseInt(f,10) == parseInt(tempI[0],10))
      {
        tempStart = tempI[0];
        tempDelect = i;
        var tempBusy = busyInfo[i];
        indexBusy = tempBusy.split('*')[0];
        countBusy = tempBusy.split('*')[1];
        tempSubject = tempBusy.split('*')[2];
        tempStatus = tempBusy.split('*')[3];
        tempID = tempBusy.split('*')[4];
        tempPreStart = tempBusy.split('*')[5];
      }
    }
    //var tempCount = parseInt(f,10)-parseInt(tempStart,10);
    temp = parseInt(f,10)+parseInt(countBusy,10);
    //countBusy = tempCount;

  }
    // update busyInfo array info when the current time is not the frist time item
  else{
    //if(!currentPostion)
      for(var i= 0;i<busyInfo.length;i++ ){
        var tempI = busyInfo[i].split("*");

        if(parseInt(f,10) > parseInt(tempI[0],10))
        {
          tempStart = tempI[0];
          tempDelect = i;
          var tempBusy = busyInfo[i];
          indexBusy = tempBusy.split('*')[0];
          countBusy = tempBusy.split('*')[1];
          tempSubject = tempBusy.split('*')[2];
          tempStatus = tempBusy.split('*')[3];
          tempID = tempBusy.split('*')[4];
          tempPreStart = tempBusy.split('*')[5];
        }
      }
      var tempCount = parseInt(f,10)-parseInt(tempStart,10);
      temp = parseInt(f,10)+(parseInt(countBusy,10)- (parseInt(f,10)-parseInt(indexBusy,10)));
      countBusy = tempCount;
      busyInfo[tempDelect] = tempStart+'*'+tempCount+'*'+tempSubject+'*'+tempStatus+"*"+tempID+"*"+tempPreStart;
  }
  //console.log("tempStart:"+tempStart+"tempDelect:"+tempDelect+"tempBusy:"+tempBusy+"indexBusy:"+indexBusy+"countBusy:"+countBusy+"tempSubject:"+tempSubject+"f:"+f);
  //console.log("busyInfo[tempDelect]:"+busyInfo[tempDelect]);
    //re-set schedule styling
  var tempSubject = $('#free'+indexBusy).text();
  $("#free"+indexBusy).remove();
  for (var i = indexBusy; i < f; i++)//rad
  {
    $("#timelinediv"+i).append('<td  id = "free'+i+'" style="background-color:#FEFACC;border:solid 1px rgb(179, 179, 179);font-weight: bold;vertical-align: middle;">'+tempSubject+'</td>');
  }
    //re-set freebusyIntervalAvailability data
  if(indexBusy == f)
  {
    temp = parseInt(f,10)+(parseInt(countBusy,10)- (parseInt(f,10)-parseInt(indexBusy,10)));
  }

  for (var i = f; i < temp; i++)
  {
    $("#timelinediv"+i).append('<td  id = "free'+i+'" style="background-color:#389015;border:solid 1px rgb(179, 179, 179);font-weight: bold;vertical-align: middle;">&nbsp;</td>');
    $('#free'+i).text("");
    dataResponse.freebusyIntervalAvailability[i] = "Free";
  }
    //re-set onclick function on free item
  for (var i = f; i < temp; i++)
  {
    var tempArray = [];
    tempArray = getIntervalsFreeBusy(intervals[i],intervals,dataResponse.freebusyIntervalAvailability);
    //$('#free'+i).attr("onClick", "openBookingForm('"+intervals[i]+"','"+i+"','"+tempArray+"')");
  }
    //mergeBusySubject
    if(parseInt(tempCount,10) > 1)
    {
        // mergeBusySubject(tempStart,tempCount);
        var rightTD = $("#free"+tempStart);
        rightTD.attr('rowSpan', tempCount);
        for (var i = 0; i < tempCount; i++) {
            if (i>0)
                $("#free"+(parseInt(i,10)+parseInt(tempStart,10))).remove();
        }
    }
  var tempFF = parseInt(f,10)-1;
  if((tempPreStart == 'Y')&&(dataResponse.freebusyIntervalAvailability[tempFF] !="Free"))
  {
     var tempII;
      for(var i= 0;i<busyInfo.length;i++ ){
          var tempI = busyInfo[i].split("*");
          if(f == tempI[0])
          {
              tempII = i;
              break;
          }
    }
    tempII = parseInt(tempII,10)-1;
    var tempInfo = busyInfo[tempII].split("*");
    var tempStart = tempInfo[0];
    var intervals = createIntervalArray();
    getCurrentBusyInfo(intervals[tempStart],tempStart);

  }
  else
  {
   $('#getCurrentBusyInfo').empty();
   $('#getCurrentBusyInfo').append('<p style="font-size: x-large;margin-bottom:0px"><b>CURRENT: Available</b></p><div style="border:1px solid #389015;margin-top:0"></div>');
  }
    // update busyInfo array info when the current time is the frist time item
  for(var i= 0;i<busyInfo.length;i++ ){
        var tempI = busyInfo[i].split("*");
        if(f == tempI[0])
        {
            //save delete meeting info
            cancelBusyRoomInfo.push(busyInfo[i]);
            busyInfo.remove(i);
            break;
        }
  }

}
function actionCurrentFaceBtn(id,subject)
{
    $("#action_btn_face").css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
    FaceRecognition.recognitionANumber(
       function(result) {
       var anumArr = result["anumber"];
       /*if(anumArr!=''){
        corpIDMeetingArr = unique(anumArr.substr(0, anumArr.length-1).split(','));
        }*/
       if(anumArr!=''){
       var currentCorpIDArr = unique(anumArr.substr(0, anumArr.length-1).split(','));
       var count=0;
       for(var i=0;i<corpIDMeetingArr.length;i++){
       if(corpIDMeetingArr[i].substr(0,corpIDMeetingArr[i].indexOf('/'))==id){
       tempcorpIDMeeting = id+"/"+mergeArray(corpIDMeetingArr[i].substr(corpIDMeetingArr[i].indexOf('/')+1).split(','), currentCorpIDArr).join(",");
       corpIDMeetingArr.splice(i,1,tempcorpIDMeeting);
       count=1;
       break;
       }

       }
       if(count==0){
       tempcorpIDMeeting = id+"/"+currentCorpIDArr.join(",");
       corpIDMeetingArr.push(tempcorpIDMeeting);
       }

       }

       $.ajax({
              dataType: 'jsonp',
              type: 'get',
              data:"meetingId='"+id+"'&corpIdArr='"+result["anumber"]+"'",
              jsonp: 'callback',
              url: 'http://10.179.88.66:8080/saveParticipants?callback=?',
              success: function(data) {
              console.log('success');
              //alert("The attendees of the meeting is saved successfully!");
              console.log(JSON.stringify(data));
              }
              });
       //alert("Success: \r\n"+result["anumber"]);
       },

       function(error) {
       alert("Error: \r\n"+error);
       },

       ["HelloWorld"]
       );
}
function actionCurrentFaceBtn2(id,subject)
{
    $("#action_btn_face2").css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
    FaceRecognition.recognitionANumber(
                                       function(result) {
                                       var anumArr = result["anumber"];
                                       /*if(anumArr!=''){
                                        corpIDMeetingArr = unique(anumArr.substr(0, anumArr.length-1).split(','));
                                        }*/

                                       if(anumArr!=''){
                                       var currentCorpIDArr = unique(anumArr.substr(0, anumArr.length-1).split(','));
                                       var count=0;
                                       for(var i=0;i<corpIDMeetingArr.length;i++){
                                       if(corpIDMeetingArr[i].substr(0,corpIDMeetingArr[i].indexOf('/'))==id){
                                       tempcorpIDMeeting = id+"/"+mergeArray(corpIDMeetingArr[i].substr(corpIDMeetingArr[i].indexOf('/')+1).split(','), currentCorpIDArr).join(",");
                                       corpIDMeetingArr.splice(i,1,tempcorpIDMeeting);
                                       count=1;
                                       break;
                                       }

                                       }
                                       if(count==0){
                                       tempcorpIDMeeting = id+"/"+currentCorpIDArr.join(",");
                                       corpIDMeetingArr.push(tempcorpIDMeeting);
                                       }

                                       }
                                       $.ajax({
                                              dataType: 'jsonp',
                                              type: 'get',
                                              data:"meetingId='"+id+"'&corpIdArr='"+result["anumber"]+"'",
                                              jsonp: 'callback',
                                              url: 'http://10.179.88.66:8080/saveParticipants?callback=?',
                                              success: function(data) {
                                              console.log('success');
                                              //alert("Success Saved: \r\n"+result["anumber"]);
                                              //alert("The attendees of the meeting is saved successfully!");
                                              console.log(JSON.stringify(data));
                                              }
                                              });
                                       //alert("Success: \r\n"+result["anumber"]);
                                       },

                                       function(error) {
                                       alert("Error: \r\n"+error);
                                       },

                                       ["HelloWorld"]
                                       );
}

/**
 * set current busy room info
 * param startTime,index of number
 */
function getCurrentBusyInfo(kval,f)
{
  var tempI;
  var flag = false;
  var status;
  //get subject,starttime,index and etc. info
  for(var i= 0;i<busyInfo.length;i++ )
  {
    var temp = busyInfo[i].split("*");
    if(parseInt(f,10) == parseInt(temp[0],10))
    {
      flag =true;
      tempI = i;
      var tempStart = temp[0];
      var tempCount = temp[1];
      var tempSubject = temp[2];
      var tempStatus = temp[3];
            var tempID = temp[4];
            var tempPreStart = temp[5];
      break;

    }
  }
  if(!flag)
  {
    for(var i= 0;i<busyInfo.length;i++ )
    {
      var temp = busyInfo[i].split("*");
      if(parseInt(temp[0],10) < parseInt(f,10))
      {
        tempI = i;
        var tempStart = temp[0];
        var tempCount = temp[1];
        var tempSubject = temp[2];
        var tempStatus = temp[3];
        var tempID = temp[4];
        var tempPreStart = temp[5];
      }
    }
  }
  $('#getCurrentBusyInfo').empty();
  //$('#getCurrentBusyInfo').append('<p><span class="detailFontCls">Meeting Subject:</span> '+tempSubject+'</p><p id="bookRoomStatus"></p> <div style="display: inline-block;"><div id="action_btn_start1" ><p class="action_btn_text">Start</p></div><div id="action_btn_update" ><p class="action_btn_text">Cancel</p></div><div id="action_btn_face"><p class="action_face_btn_text">Register</p></div></div>');
  $('#getCurrentBusyInfo').append('<p style="font-size: x-large;margin-bottom:0px"><b>CURRENT: '+tempSubject+'</b></p><div style="border:1px solid #389015;margin-top:0"></div><p id="bookRoomStatus"></p> <div style="display: inline-block;"><div id="action_btn_start1" ><p class="action_btn_text">Start</p></div><div id="action_btn_face"><p class="action_face_btn_text">Register</p></div><div id="action_btn_update" ><p class="action_btn_text">Cancel</p></div></div>');
  $('#action_btn_update').attr("onClick", "actionCurrentCancelBtn('"+kval+"','"+f+"')");
  if(tempStatus == "Y")
  {
    $("#action_btn_start1").css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
        $("#action_btn_face").css({"background-color": "#389015","border":"1px solid #389015" });
        $('#action_btn_face').attr("onClick", "actionCurrentFaceBtn('"+tempID+"','"+tempSubject+"')");
    $("#bookRoomStatus").append('<span class="detailFontCls">Booking Room Status:</span> <span style="font-color:red">In Progress </span><img class = "imgStatus" src="'+path+'icon-Admin1Green.png"/>');
    $("#action_btn_start1").removeAttr("onClick");
        $('#action_btn_report').css({"background-color": "#389015","border":"1px solid #389015" });
        $('#action_btn_report').attr("onClick", "actionCurrentReportBtn('"+tempID+"','"+tempSubject+"')");
  }
  else
  {
    $("#action_btn_start1").css({"background-color": "#389015","border":"1px solid #389015" });
        $("#action_btn_face").css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3"});
    $("#bookRoomStatus").append('<span class="detailFontCls">Booking Room Status:</span> Not Start <img class = "imgStatus" src="'+path+'icon-Admin.png"/>');
    $('#action_btn_start1').attr("onClick", "actionCurrentStartBtn("+f+")");
        $("#action_btn_face").removeAttr("onClick");
        $('#action_btn_report').css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3"});
        $('#action_btn_report').removeAttr("onClick");
  }
    if(window.orientation == 0)
    {
        $("#action_btn_update").css("margin-left", "5px");
        $("#action_btn_face").css("margin-left", "5px");
        //$("#action_btn_face2").css("margin-left", "5px");
        //$("#action_btn_report").css("margin-left", "5px");
    }
    else
    {
        $("#action_btn_update").css("margin-left", "20px");
        $("#action_btn_face").css("margin-left", "20px");
        //$("#action_btn_face2").css("margin-left", "20px");
        //$("#action_btn_report").css("margin-left", "20px");
    }
}
/**
 * set current free room info
 * param index of number,status
 */
function getCurrentFreeInfo(index,status)
{

  $('#getCurrentBusyInfo').empty();
  $('#getCurrentBusyInfo').append('<p style="font-size: x-large;margin-bottom:0px"><b>CURRENT: Available</b></p><div style="border:1px solid #389015;margin-top:0"></div>');

}
/**
 * get a free/busy array contains 6 items
 * param current Time
 * param time array
 * param free/busy array
 * return an array contains 6 items with free/busy info
 */
function getIntervalsFreeBusy(currentTime,intervals,intervalsFreeBusy){
  var intervalsArray =[];
  $.each(intervalsFreeBusy, function(f, kval){
           if(currentTime == intervals[f])
           {
           intervalsArray[0] = kval;
           intervalsArray[1] = intervalsFreeBusy[f+1];
           intervalsArray[2] = intervalsFreeBusy[f+2];
           intervalsArray[3] = intervalsFreeBusy[f+3];
           intervalsArray[4] = intervalsFreeBusy[f+4];
           intervalsArray[5] = intervalsFreeBusy[f+5];
           }
           });
  return intervalsArray;
}
/**
 * check time is whether current time
 * param start Time
 * return false/ture
 */
function checkTimeWithBusy(startTime)
{
    var d = new Date();
    var month = d.getMonth();
    var year = d.getFullYear();
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var tempH = startTime.substr(0,2);
    var tempM = startTime.substr(3).substr(0,2);
    var am = startTime.substr(6,8);

    if((am == 'PM')&&(tempH != '12'))
    {
        tempH = parseInt(tempH,10);
        tempH += 12;
    }
    if(tempM == '00')
    {
        tempM = '45';
        tempH--;
    }
    else
    {
        tempM = '15';
    }
    var staticTimeStamp = createEpochTimeStamp(year,month,day,tempH,tempM);
  var currTimeStamp = createEpochTimeStamp(year,month,day,hour,minute);
    if(currTimeStamp >= staticTimeStamp)
    {
        return true;
    }
    else
    {
        return false;
    }
}
/**
 * set Next busy info
 */
function getNextBusyInfo(index,kval)
{
  var tempStatus = false;
  var intervals = createIntervalArray();
  $.each(intervals, function(f, kval) {
           var flagTimeLine = getCurrentTimeLine(kval).split('|');
           if(flagTimeLine[0] == 'true')
           {
           for(var i= 0;i<busyInfo.length;i++ )
           {
           var temp = busyInfo[i].split("*");
           if(parseInt(temp[0],10) > parseInt(index,10))
           {
           var tempa = temp[0];
           var tempb = temp[1];
           var tempc = parseInt(tempa,10)+parseInt(tempb,10);
           var tempS = temp[3];
           var tempID = temp[4];
           var tempPreStart = temp[5];
           var tempSubject = temp[2];
           var checkFlag = checkTimeWithBusy(intervals[tempa]);
           if((parseInt(tempa,10)+parseInt(tempb,10)) >= intervals.length)
           {
           $('#getNextBusyInfo').empty();
           $('#getNextBusyInfo').append("<p style='font-size: x-large;margin-bottom:0px'><b>NEXT: "+tempSubject+"</b></p><div style='border:1px solid #389015;margin-top:0'></div>");
           $('#getNextBusyInfo').append("<p><span class='detailFontCls'>Meeting Time: From </span>"+intervals[tempa]+" <span class='detailFontCls'>to</span> 09:00 PM </p>");
           $('#getNextBusyInfo').append("<p>You can sign in 15 minutes before start meeting.</p><div id='action_btn_start2'><p class='action_btn_text'>Start</p></div>");


           }
           else
           {
           $('#getNextBusyInfo').empty();
           $('#getNextBusyInfo').append("<p style='font-size: x-large;margin-bottom:0px'><b>NEXT: "+tempSubject+"</b></p><div style='border:1px solid #389015;margin-top:0'></div>");
           $('#getNextBusyInfo').append("<p><span class='detailFontCls'>Meeting Time: From </span>"+intervals[tempa]+" <span class='detailFontCls'>to </span>"+intervals[parseInt(tempa,10)+parseInt(tempb,10)]+"</p>");
           $('#getNextBusyInfo').append("<p>You can sign in 15 minutes before start meeting.</p><div id='action_btn_start2'><p class='action_btn_text'>Start</p></div>");
           }
           if(checkFlag)
           {
           if(tempS == 'N')
           {
           $('#action_btn_start2').css({"background-color": "#389015","border":"1px solid #389015" });
           $('#action_btn_start2').attr("onClick", "actionNextStartBtn('"+tempa+"','"+kval+"')");
           }
           else
           {
           // $("#action_btn_face2").css({"background-color": "#389015","border":"1px solid #389015" });
           // $('#action_btn_face2').attr("onClick", "actionCurrentFaceBtn2('"+tempID+"','"+tempSubject+"')");
           }
           }
           break;
           }
           else
           {
           $('#getNextBusyInfo').empty();
           $('#getNextBusyInfo').append('<p style="font-size: x-large;margin-bottom:0px;margin-bottom:0px"><b>NEXT: There is no meeting</b></p><div style="border:1px solid #389015;margin-top:0"></div>');
           }
           }
           }
           });
}
/**
 * call the cancel busy room function automatically when the time over 15 mins from start time
 */
function checkTimeOutByCancel(){
    var intervals = createIntervalArray();
    if (typeof(indexBusy)!="undefined")
    {
        if(dataResponse.freebusyIntervalAvailability[indexBusy]=='Busy')
        {
            /*for(var i= 0;i<busyInfo.length;i++ )
             {
             var temp = busyInfo[i].split("*");
             if(parseInt(indexBusy,10) > parseInt(temp[0],10))
             {
             var tempStatus = temp[3];
             var tempStartTime = temp[0];
             }
             }*/

            var flag = false;
            for(var i= 0;i<busyInfo.length;i++ )
            {
                var temp = busyInfo[i].split("*");
                if(parseInt(indexBusy,10) == parseInt(temp[0],10))
                {
                    flag =true;
                    var tempStatus = temp[3];
                    var tempStartTime = temp[0];
                }
            }
            if(!flag)
            {
                for(var i= 0;i<busyInfo.length;i++ )
                {
                    var temp = busyInfo[i].split("*");
                    if(parseInt(indexBusy,10) > parseInt(temp[0],10))
                    {
                        var tempStatus = temp[3];
                        var tempStartTime = temp[0];
                    }
                }
            }

            var d = new Date();
            var month = d.getMonth();
            var year = d.getFullYear();
            var day = d.getDate();
            var hour = d.getHours();
            var minute = d.getMinutes();
            var data = intervals[tempStartTime];
            var tempH = data.substr(0,2);
            var tempM = data.substr(3).substr(0,2);
            var am = data.substr(6,8);

            if((am == 'PM')&&(tempH != '12'))
            {
                tempH = parseInt(tempH,10);
                tempH += 12;
            }
            if(tempM == '00')
            {
                tempM = '15';
            }
            else
            {
                tempM = '45';
            }
            var staticTimeStamp = createEpochTimeStamp(year,month,day,tempH,tempM);
            var currTimeStamp = createEpochTimeStamp(year,month,day,hour,minute);
            currTimeStamp = parseInt(currTimeStamp,10);
            staticTimeStamp = parseInt(staticTimeStamp,10);
            if(((currTimeStamp == staticTimeStamp)||(currTimeStamp > staticTimeStamp))&& (tempStatus =='N'))
            {
                actionCurrentCancelBtn(intervals[indexBusy],indexBusy);
            }
        }
    }
}
/**
 * check the busy meeting whether is started in pre-time
 */
function checkPreStart(f){
    var flag = false;
    var tempPreStart;
    var tempI;
    var tempStart;
    for(var i= 0;i<busyInfo.length;i++ )
    {
        var temp = busyInfo[i].split("*");
        if(parseInt(f,10) == parseInt(temp[0],10))
        {
            flag =true;
            tempI = i;
            //tempI = parseInt(tempI,10)+1;
            //var tempPreStart = temp[5];
            break;

        }
    }
    if(!flag)
    {
        for(var i= 0;i<busyInfo.length;i++ )
        {
            var temp = busyInfo[i].split("*");
            if(parseInt(temp[0],10) < parseInt(f,10))
            {
                tempI = i;
                //svar tempPreStart = temp[5];
            }
        }
    }
    tempI = parseInt(tempI,10)+1;
    if(tempI < busyInfo.length)
    {
        var tempInfo = busyInfo[tempI].split("*");
        tempPreStart = tempInfo[5];
        if(tempPreStart == 'Y')
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}
/**
 * update the whole page contains schedule info, current busy info and next busy info per 1 minute
 */
function createScheduleUIByTime(){
    //Call automatically cancel function
  var intervals = createIntervalArray();
  var currTimeLine;
  var timeLinePX;
  var curentMeetingLine,tempMeetingLine = 0;
  $.each(intervals, function(f, kval) {
           $("#timeline"+f).css("background-image","none");
           /*set current time line*/
           var flagTimeLine = getCurrentTimeLine(kval).split('|');
           if(flagTimeLine[0] == 'true')
           {
           currTimeLine = f;
           timeLinePX = flagTimeLine[1];
           curentMeetingLine = (f%2 == 0)?f:tempMeetingLine;
           //debugger
           if(dataResponse.freebusyIntervalAvailability[f] == 'Free')
           {
             var tempStatus = checkPreStart(f);
             if(tempStatus)
             {
             var tempF = parseInt(f,10)+1;
             getCurrentBusyInfo(intervals[tempF],tempF);
             getNextBusyInfo(tempF,intervals[tempF]);
             }
             else
             {
              getCurrentFreeInfo(f,"Free");
              getNextBusyInfo(f,kval);
             }

           }
           else
           {
           var tempStatus = checkPreStart(f);
           if(tempStatus)
           {
           var tempF = parseInt(f,10)+1;
           getCurrentBusyInfo(intervals[tempF],tempF);
           getNextBusyInfo(tempF,intervals[tempF]);
           //updateNextMeeting(tempF);
           }
           else
           {
           getCurrentBusyInfo(kval,f);
           getNextBusyInfo(f,kval);
           }
           }
           }
           if( f%2 == 0)
           {
           tempMeetingLine = f;
           }
           if(dataResponse.freebusyIntervalAvailability[f] == 'Free')
           {
           var flag = getCurrentTimeArray(kval);
           if(!flag)//set green
           {
           intervalsArray = getIntervalsFreeBusy(kval,intervals,dataResponse.freebusyIntervalAvailability);
           $('#free'+f).css({"background-color":"#389015","border":"solid 1px rgb(179, 179, 179)"});
           //$('#free'+f).attr("onClick", "openBookingForm('"+kval+"','"+f+"','"+intervalsArray+"')");
           }
           else //set grey
           {
           $('#free'+f).css({"background-color":"#DBDBDB","border":"solid 1px rgb(179, 179, 179)"});
           }

           }
           else//set rad
           {
           $('#free'+f).css({"background-color":"#FEFACC","border":"solid 1px rgb(179, 179, 179)"});
           }

           });
  //alert(currTimeLine);
  if (currTimeLine >= 0 )
  {
    $("#timeline"+currTimeLine).css({"background-image":"url("+path+"yellowline.png)","background-repeat":"repeat-x","background-position":"0px "+timeLinePX+"px"});
  }
    indexBusy = currTimeLine;
  scrollToElement("#free"+curentMeetingLine);
  $("#schPanel").table( "rebuild" ).css('height', '100%');
  var intervals = createIntervalArray();
  var intervalsArray = [];
  for(var i= 0;i<busyInfo.length;i++ )
  {
    var temp = busyInfo[i].split("*");
    mergeBusySubject(temp[0],temp[1]);
    $("#free"+temp[0]).text(temp[2]);
  }
    checkTimeOutByCancel();
}
/**
 * update the whole page contains schedule info, current busy info and next busy info from web service in the frist time
 */
function createScheduleUIBySearch(varSelectName,data){

  var intervals = createIntervalArray();
  var intervalsArray = [];
  if(typeof data.detailedFreebusydata  != 'undefined')
  {
    var tempI = 0;
    var tempBusyI = 0;
    if(data.detailedFreebusydata.length > 0)
    {

      $.each(data.detailedFreebusydata, function(f, kval) {
                   if((kval.busyType == 'Busy') ||(kval.busyType == 'Tentative'))
                   {

                   var timeSlot = getTimeSlotCount(kval.endTime,kval.startTime);
                   var tempTimeSlot = timeSlot;
                   var busySubject = kval.subject;
                   var meetingID = kval.id;
                   for(var i = tempI ;i < data.freebusyIntervalAvailability.length;i++)
                   {
                   if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
                   {
                   for (var k = 0;k < timeSlot;k++)
                   {
                   if(data.freebusyIntervalAvailability[i] == 'Free')
                   {
                   tempTimeSlot--;
                   }
                   i++;
                   }
                   i = i-timeSlot;
                   timeSlot = tempTimeSlot;
                   mergeBusySubject(i,timeSlot);
                   busyInfo[tempBusyI] =  i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
                   var tempJ = i+timeSlot;
                   for(var j = 0;j < timeSlot ;j++)
                   {
                   if(j > 0)
                   {
                   i = i+1;
                   }
                   if(((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))&& (busySubject != ""))
                   {
                   $("#free"+i).text(busySubject);

                   }
                   }
                   tempI = tempJ;
                   tempBusyI++;
                   break;
                   }
                   }
                   }
                   });
    }
    else
    {
      if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
      {

        var timeSlot = getTimeSlotCount(data.detailedFreebusydata.endTime,data.detailedFreebusydata.startTime);
        var busySubject = data.detailedFreebusydata.subject;
        for(var i = tempI ;i < data.freebusyIntervalAvailability.length;i++)
        {

          if((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative'))
          {
            for (var k = 0;k < timeSlot;k++)
            {
              if(data.freebusyIntervalAvailability[i] == 'Free')
              {
                tempTimeSlot--;
              }
              i++;
            }
            i = i-timeSlot;
            timeSlot = tempTimeSlot;
            mergeBusySubject(i,timeSlot);
            busyInfo[tempBusyI] = i+'*'+timeSlot+'*'+busySubject+'*'+'N'+'*'+meetingID+'*N';
            var tempJ = i+timeSlot;
            for(var j = 0;j < timeSlot ;j++)
            {
              if(j > 0)
              {
                i = i+1;
              }
              if(((data.freebusyIntervalAvailability[i] == 'Busy')||(data.freebusyIntervalAvailability[i] == 'Tentative')) && (busySubject != ""))
              {
                $("#free"+i).text(busySubject);
              }
            }
            tempI = tempJ;
            break;
          }
        }
      }
    }
  }
  console.log("createScheduleUIBySearch:busy info"+busyInfo);
  $.each(intervals, function(f, kval) {
           var flagTimeLine = getCurrentTimeLine(kval).split('|');
           if(flagTimeLine[0] == 'true')
           {
           if(data.freebusyIntervalAvailability[f] == 'Free')
           {

           getCurrentFreeInfo(f,"Free");
           getNextBusyInfo(f,kval);

           }
           else
           {
           getCurrentBusyInfo(kval,f);
           getNextBusyInfo(f,kval);
           }

           }

           if(data.freebusyIntervalAvailability[f] == 'Free')
           {
           var flag = getCurrentTimeArray(kval);
           if(!flag)//set green
           {
           intervalsArray = getIntervalsFreeBusy(kval,intervals,data.freebusyIntervalAvailability);
           $('#free'+f).css({"background-color":"#389015","border":"solid 1px rgb(179, 179, 179)"});
           //$('#free'+f).attr("onClick", "openBookingForm('"+kval+"','"+f+"','"+intervalsArray+"')");
           }
           else //set grey
           {
           $('#free'+f).css({"background-color":"#DBDBDB","border":"solid 1px rgb(179, 179, 179)"});
           }

           }
           else//set rad
           {
           $('#free'+f).css({"background-color":"#FEFACC","border":"solid 1px rgb(179, 179, 179)"});
           }
           });
}
/**
 * merge the td when the busy time over30 minutes
 * param index of the number
 * param the counts for the busy room time e.g. 1 hour= 2counts (per 30 minutes)
 */
function mergeBusySubject(indexI,timeSlot){
  var intervals = createIntervalArray();
  $.each(intervals, function(f, kval) {
           var flagTimeLine = getCurrentTimeLine(kval).split('|');

           if((flagTimeLine[0] == 'true')&&(indexI == f))
           {
           currentPostion = true;
           indexBusy = indexI;
           countBusy = timeSlot;
           }

           })
  var rightTD = $("#free"+indexI);
  rightTD.attr('rowSpan', timeSlot);
  for (var i = 0; i < timeSlot; i++) {
    if (i>0)
      $("#free"+(i+ parseInt(indexI,10))).remove();
  }

}

function getFreeBusyByData(varSelectName,varSelectKey)
{
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth();//January is 0!
  var yyyy = today.getFullYear();
  if(dd < 10)
  {
    dd='0'+dd;
  }
  if(mm < 10)
  {
    mm='0'+mm;
  }
  var startTime = createEpochTimeStamp(yyyy,mm,dd,'06','00');
    var endTime = createEpochTimeStamp(yyyy,mm,dd,'23','59');
  var methodArgs = {'alias':varSelectKey,'startTimeStamp': startTime,'emailHost':'', 'endTimeStamp':endTime};
    $.ajax({
           url: "",
           data: methodArgs,
           type: "GET",
           contentType: "application/json; charset=utf-8",
           dataType: "jsonp",
           error: function () {
           alert("Unable to Get FreeBusy Data");
           },
           success: function (response) {
           dataResponse = response;
           var roomsFreeBusy = response.freebusyIntervalAvailability;
           if((roomsFreeBusy == "No data")||(response.responseMsg != "EC-100"))
           {
           //errorUIBySearch(varSelectName);
           }
           else
           {
           createScheduleUIBySearch(varSelectName,dataResponse);
           }
           }
           });

}
/**
 * decode the html code
 * param the html code
 */
function htmlDecode(value) {
    if (value) {
        return $('<div />').html(value).text();
    } else {
        return '';
    }
}


/**
 * scroll the td element to the top of schedule follow by current time
 * param td' id
 */
function scrollToElement(elementId) {
    console.log("elementId:"+elementId.substring(5));
    var count = elementId.substring(5);
    if(parseInt(count,10) <= 29)
    {
      $('#wrapper').animate({scrollTop: $(elementId).offset().top-$(elementId).offsetParent().offset().top},'slow');
    }
};
/**
 * create an interface for removing data from array
 */
Array.prototype.remove=function(dx)
{
    if(isNaN(dx)||dx>this.length){return false;}
    for(var i=0,n=0;i<this.length;i++)
    {
        if(this[i]!=this[dx])
        {
            this[n++]=this[i]
        }
    }
    this.length-=1
}

function mergeArray(arr1, arr2) {
    var _arr = [];
    for (var i = 0; i < arr1.length; i++) {
        _arr.push(arr1[i]);
    }
    var _dup;
    for (var i = 0; i < arr2.length; i++){
        _dup = false;
        for (var _i = 0; _i < arr1.length; _i++){
            if (arr2[i] === arr1[_i]){
                _dup = true;
                break;
            }
        }
        if (!_dup){
            _arr.push(arr2[i]);
        }
    }

    return _arr;
}

function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
