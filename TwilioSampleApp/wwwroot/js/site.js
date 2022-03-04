
$(document).ready(function () {

    $(".incomingNumber").text("");
    $('#IMute').hide();
    $('#IUnMute').hide();
    $('#IRejectCall').hide();
    $('#OMute').hide();
    $('#ICall').hide();
    $('#OUnMute').hide();
    $('#ORejectCall').hide();
      
    const device = new Twilio.Device();

    $.getJSON("/Home/GenerateToken")
        .then(function (data) {
            localStorage.setItem("Token", data.token);

            device.setup(data.token, {
                codecPreferences: ["opus", "pcmu"],
                fakeLocalDTMF: true,
                enableRingingState: true,
            });

            device.on("ready", function (device) {
                console.log("Twilio.Device Ready!");
            });

            device.on("error", function (error) {
                console.log("Twilio.Device Error: " + error.message);
            });

            device.on("error", function (error) {
                console.log("Twilio.Device Error: " + error.message);
            });

            device.on("connect", function (conn) {
                $("#IMute").show();
                $("#IUnMute").hide();
                $("#IRejectCall").show();
                reset();
                conn.reject();
                console.log('Successfully established call ! ');
            });

            device.on("disconnect", function (conn) {
                reset();
                $("#ICall").show();
                $(".incomingNumber").show();
                $("#IMute").hide();
                $("#IMute").hide();
                $("#IRejectCall").hide();
                conn.accept();
            });
            reset();
        })
        .catch(function (err) {
            console.log(err);
            log("Could not get a token from server!");
        });


    // Bind button to make call
    $('#OCall').bind('click', function () {
        $("#OCall").hide();
        $("#OMute").show();
        $("#ORejectCall").show();
        var params = {
            "phoneNumber": $("#outgoingCall").val(),
        };
        reset();
        start();
        if (device) {
            var outgoingConnection = device.connect(params);
            outgoingConnection.on("ringing", function () {
                console.log("Ringing...");
            });
        }
    })
     
    $('#ORejectCall').bind('click', function () {
        console.log("Call ended.");
        $("#OMute").hide();
        $("#ORejectCall").hide();
        $("#OUnMute").hide();
        $("#OCall").show();
        if (device) {
            device.disconnectAll();
        }
    })
      
    $('#IMute').click(function () {
        $('#IMute').hide();
        $('#IUnMute').show();
        device.activeConnection().mute(true);
    });

    $('#IUnMute').click(function () {
        $('#IMute').hide();
        $('#IUnMute').show();
        device.activeConnection().mute(false);
    });
     
    function log(message) {
        var logDiv = document.getElementById("log");
        logDiv.innerHTML += "<p>&gt;&nbsp;" + message + "</p>";
        logDiv.scrollTop = logDiv.scrollHeight;
    }

    device.on("incoming", function (conn) {
        reset();
        debugger;
        var fromNumber = conn.parameters.From.replace('+1', '');
        $(".incomingNumber").text(fromNumber);
        $('#IMute').hide();
        $('#IUnMute').hide();
        $("#IRejectCall").show();
        $("#ICall").show();

        $('#ICall').bind('click', function () {
            alert("1");
            $("#IMute").show();
            $(".incomingNumber").show();
            $("#IUnMute").hide();
            $("#IRejectCall").show();
            $("#ICall").hide();
            conn.accept();
            start();
            
        })

        $('#IRejectCall').bind('click', function () {
            reset();
            alert("1.1");
            $("#ICall").hide();
            $(".incomingNumber").hide();
            $("#ICall").hide();
            $("#IMute").hide();
            $("#IUnMute").hide();
            $("#IRejectCall").hide();
            reset();
            conn.reject();
            device.disconnectAll();
        })
    });

    var time = 0;
    var running = 0;

    function start() {
        time = 0;
        running = 0;
        if (running == 0) {
            running = 1;
            increment();
        } else {
            running = 0;
        }
    }

    function reset() {
        running = 0;
        time = 0;
        $(".divtimer").text("00:00:00");
    }

    function increment() {
        if (running == 1) {
            setTimeout(function () {
                time++;
                var mins = Math.floor(time / 10 / 60);
                var secs = Math.floor(time / 10 % 60);
                var tenths = time % 10;
                if (mins < 10) {
                    mins = "0" + mins;
                }
                if (secs < 10) {
                    secs = "0" + secs;
                }
                $(".divtimer").text(mins + ":" + secs + ":" + "0" + tenths);
                increment();
            }, 100);
        }
    }
});

var callinterval = "";
function callingStatus() {
    callinterval = window.setInterval(function () {
        CheckCallStatus();
    }, 5000);
}