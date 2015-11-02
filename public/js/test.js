
var path="./css/";
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
			return intervals;
	}
$(document).ready(function(){

	setRoomScheduleUI();
	//getFreeBusyByData("Dalian A","Conf.XCE.Dalian.A");
	$("#action_btn_start1").on('click', function(e) {
		$(this).css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
	});
	$("#action_btn_start2").on('click', function(e) {
		$(this).css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
	});
	$("#action_btn_update").on('click', function(e) {
		$(this).css({"background-color": "#b3b3b3","border":"1px solid #b3b3b3" });
	});
})
function setRoomScheduleUI(){
	$('#freeBusyResponse').empty();
	var intervals = createIntervalArray();
	var intervalsArray = [];
	var tRow = '<ul>';
	var currTimeLine;
	var timeLinePX;
	$.each(intervals, function(f, kval) {
		/*set current time line*/
		var flagTimeLine = getCurrentTimeLine(kval).split('|');
			if(flagTimeLine[0] == 'true')
			{
				currTimeLine = f;
				timeLinePX = flagTimeLine[1];
			}
			if( f%2 == 0)
			{
				tRow += '<div id = "timelinediv'+f+'" style="border-left:solid 1px #cdcbcb;text-shadow: none;"><div id = "timeline'+f+'"  class=ui-block-a>'+kval+'</div><div id = "timelineright'+f+'" class=ui-block-b style="width:70%"><li id = "free'+f+'" data-theme="b" class="ui-li  ui-bar-b ui-li-has-thumb">&nbsp;</li></div></div>';
			}
			else
			{
				//tRow += '<div id = "timelinediv'+f+'" class=ui-grid-a style="border-left:solid 1px #cdcbcb;"><div id = "timeline'+f+'" class=ui-block-a></div><div id = "timelineright'+f+'" class=ui-block-b style="width:70%"><li id = "free'+f+'">&nbsp;</li></div></div>';

				tRow += '<div id = "timelinediv'+f+'" style="border-left:solid 1px #cdcbcb"><div id = "timeline'+f+'"  class=ui-block-a>&nbsp;</div><div id = "timelineright'+f+'" class=ui-block-b style="width:70%"><li id = "free'+f+'" data-theme="b" class="ui-li  ui-bar-b ui-li-has-thumb" >&nbsp;</li></div></div>';
			}
		});
		tRow +='</ul>';
		$('#freeBusyResponse').append(tRow);


		if (currTimeLine >= 0 )
		{
			$("#timeline"+currTimeLine).css({"background-image":"url("+path+"yellowline.png)","background-repeat":"repeat-x","background-position":"0px "+timeLinePX+"px"});
		}

		$.each(intervals, function(f, kval) {
			$("#timeline"+f).css({"text-align":"center","border-bottom":"1px solid #b3b3b3 ","border-top":"1px solid #b3b3b3","width":"30%","font-weight":"bold","background-color":"white","height":"30px","font-size":"larger","line-height":"30px"});
		});
}
function createEpochTimeStamp(year,month, day, hours, mins){
    var now = new Date();

    var zeropad = function (num) { return ((num < 10) ? '0' : '') + num; }
    var date = new Date(zeropad(year), zeropad(month),zeropad(day),zeropad(hours), zeropad(mins), zeropad(0));
    var epochDate = date.getTime()/1000;
    return epochDate;
}
/*get current Time */
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

		if (hour > tempH){
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
/*get currentTime line*/
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
				timeLinePX=2;
				break;
			case 2:
				timeLinePX=5;
				break;
			case 3:
				timeLinePX=9;
				break;
			case 4:
				timeLinePX=12;
				break;
			case 5:
				timeLinePX=16;
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
		if ((hour == tempH)&&(minute > 30))
		{
			switch(parseInt((minute-30)/5,10))
			{
			case 0:
				timeLinePX=0;
				break;
			case 1:
				timeLinePX=2;
				break;
			case 2:
				timeLinePX=5;
				break;
			case 3:
				timeLinePX=9;
				break;
			case 4:
				timeLinePX=12;
				break;
			case 5:
				timeLinePX=16;
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

function errorUIBySearch(data){
	$('#information').empty();
	$('#information').append("No schedule information is for your selected room - "+data);
	$('#information').css({"color":"red","font-weight":"bold"});
}
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
function createScheduleUIBySearch(varSelectName,data){

	var intervals = createIntervalArray();
	var intervalsArray = [];

	$.each(intervals, function(f, kval) {

		if(data.freebusyIntervalAvailability[f] == 'Free')
		{
			var flag = getCurrentTimeArray(kval);
			if(!flag)//set green
			{

			}
			else //set grey
			{

			}

		}
		else//set rad
		{

		}
	});


				/*if(typeof data.detailedFreebusydata  != 'undefined')
				{
					var tempI = 0;
					if(data.detailedFreebusydata.length > 0)
					{
						$.each(data.detailedFreebusydata, function(f, kval) {
							if((kval.busyType == 'Busy') ||(kval.busyType == 'Tentative'))
							{

								var timeSlot = getTimeSlotCount(kval.endTime,kval.startTime);
								var tempTimeSlot = timeSlot;
								var busySubject = kval.subject;
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
				}*/
}
function mergeBusySubject(indexI,timeSlot){

	var tempCount1 = 30 - parseInt(indexI,10);
	if(tempCount1 < timeSlot)
	{
		timeSlot = tempCount1;
	}
	for(var i =1;i < timeSlot;i++)
	{
		var tempI = indexI+i;
		$("#timelinediv"+indexI).append($("#timeline"+tempI));
		$("#timelineright"+tempI).empty();
	}
	if(navigator.userAgent.match(/blackberry/i)=="BlackBerry")
	{
		$("#free"+indexI).css({"position":"absolute","left":"0","right":"0","line-height": (timeSlot*20 +(timeSlot-1)*2+(timeSlot-1)*2+1)+"px"});
	}
	else
	{
		$("#free"+indexI).css({"position":"absolute","left":"0","right":"0","line-height": (timeSlot*20 +(timeSlot-1)*2)+"px"});
	}
	$("#timelineright"+indexI).css({"position":"relative"});


}

function getFreeBusyByData(varSelectName,varSelectKey)
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;//January is 0!
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
			var roomsFreeBusy = response.freebusyIntervalAvailability;
			if((roomsFreeBusy == "No data")||(response.responseMsg != "EC-100"))
			{
				errorUIBySearch(varSelectName);
			}
			else
			{
				createScheduleUIBySearch(varSelectName,response);
			}
        }
    });
}
function htmlDecode(value) {
    if (value) {
        return $('<div />').html(value).text();
    } else {
        return '';
    }
}


