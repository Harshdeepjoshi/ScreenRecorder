const durationElement = document.querySelector('#duration');
const videoElement = document.querySelector('video');
const recordButton = document.querySelector('#start-button');
const stopButton = document.querySelector('#stop-button');

let stream;
let recorder;

let duration = 0;
let interval;
function startRecording() {
  navigator.mediaDevices.getDisplayMedia({ video: true }).then(function(s) {
    // set the source of the video element to the stream from the screen
    stream = s;
    videoElement.srcObject = stream;
    
    // create a MediaRecorder to record the screen in webm format
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const data = [];
    videoElement.style.display = 'block';
    
    recorder.ondataavailable = function(event) {
      // store the recorded data in an array
      data.push(event.data);
    };
    
    recorder.onstop = function() {
      // download the recorded data as a webm file
      const blob = new Blob(data, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'screen-recording.webm';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    };
    
    // start recording
    startDurationCounter();
    recorder.start();
    
    // disable the record button and enable the stop button
    recordButton.disabled = true;
    stopButton.disabled = false;
  });
}


function startDurationCounter() {
  interval = setInterval(function() {
    duration++;
    let totalSeconds = duration;
    hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;
    if (hours.toString().length===1){
      hours = '0'+hours
    }
    if (minutes.toString().length===1){
      minutes = '0'+minutes
    }if (seconds.toString().length===1){
      seconds = '0'+seconds
    }
    durationElement.innerHTML = `Duration: ${hours}:${minutes}:${seconds} seconds`;
  }, 1000);
}

function stopDurationCounter() {
  clearInterval(interval);
  durationElement.innerHTML = `video of ${duration} seconds saved.`;
  duration = 0;
}

recordButton.addEventListener('click', startRecording);

stopButton.addEventListener('click', function() {
  // stop recording
  recorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
  stopDurationCounter();
  stream.getTracks().forEach(function(track) {
    track.stop();
  });
});
