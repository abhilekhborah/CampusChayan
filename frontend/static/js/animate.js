import SiriWave from 'siriwave'; 


var siriWave = new SiriWave({
    container: document.getElementById("siri-container"),
    amplitude: "1",
    speed: "0.30",
    autostart: true,
  });

// Siri message animation
$('.siri-message').textillate({
    loop: true,
    sync: true,
    in: {
        effect: "fadeInUp",
        sync: true,
    },
    out: {
        effect: "fadeOutUp",
        sync: true,
    },

});


