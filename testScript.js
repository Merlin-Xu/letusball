//test save and update
$.ajax({
        url: "http://localhost:8080/saveParticipants",
		data: {meetingId:'2009',meetingSubject:'test summary nihao',meetingName:'Taishan',corpIdArr:'530831,528946,520831,526570',startTime:new Date()},
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        jsonpCallback:"success",
        error: function () {
           console.log("Unable to Get FreeBusy Data");
        },
        success: function (response) {
			console.log("What's Great");
    }
});
//test find
$.ajax({
        url: "http://localhost:8080/getParticipants",
		//data: {meetingId:'2008',meetingName:'Taishan',corpIdArr:'526525'},
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        jsonpCallback:"success",
        error: function () {
           console.log("Unable to Get FreeBusy Data");
        },
        success: function (response) {
			console.log("What's Great");
    }
});
$.ajax({
        url: "http://localhost:8080/getRoomsBySite",
        data: {'siteCode':'DBL'},
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "jsonp",
        jsonpCallback:"success",
        error: function () {
           console.log("Unable to Get FreeBusy Data");
        },
        success: function (response) {
            console.log("What's Great"+'\n'+JSON.stringify(response));

    }
});