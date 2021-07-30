const recording = document.getElementById("recording");
const video22 = document.querySelector("video");
var recorder, stream, aStream;
var chunks = [];
var audio1_flag = true,audio2_flag = true


// start the recording with canvas video
async function startRecording() {

    // to check the audio selections
    const checkboxes1 = document.querySelectorAll('input[id="audio-1"]:checked');
    const checkboxes2 = document.querySelectorAll('input[id="audio-2"]:checked');

    // check the value of video audio checkbox
    if(checkboxes1.length == 1){
        audio1_flag = true
    }
    else{
        audio1_flag = false
    }

    // check the value of mic audio checkbox
    if(checkboxes2.length == 1){
        audio2_flag = true
    }
    else{
        audio2_flag = false
    }
    console.log(audio1_flag,audio2_flag)



    // canvas stream
	try{
		stream = canvas.captureStream(30);
	}
	catch(err){
		console.log("error occur in stream")
	}
    
    if(audio1_flag){
        video22.muted=false
    }
    else{
        video22.muted=true
    }

    // mic audio stream
    if(audio2_flag){
        try {
            aStream = await navigator.mediaDevices.getUserMedia({
            // audio: true,
                audio: {
                sampleRate: 48000,
                channelCount: 2,
                volume: 1.0,
                latency:0
                }
            })
            console.log("aStream",aStream)
            stream.addTrack(aStream.getTracks()[0]);
        }
        catch(err) {
            console.log("eror occured",err)
        }
    }   
	
	//var options = {
	  //audioBitsPerSecond : 128000,
	  //videoBitsPerSecond : 2500000,
	  //mimeType : 'video/mp4'
	//}
    // create a recorder fed with our canvas stream and audio device stream
    //recorder = new MediaRecorder(stream,options)
	recorder = new MediaRecorder(stream)

    // start it
    recorder.start();
    
    console.log("recorder",recorder)
    
    recorder.ondataavailable = e =>{ 
        console.log(e.data)
        chunks.push(e.data)
    }
    recorder.onstop = e => {
        const completeBlob = new Blob(chunks, { type: chunks[0].type })
        //video.src = URL.createObjectURL(completeBlob)

        var link = document.createElement('a')
        link.download = 'download.mp4'
        link.href = URL.createObjectURL(completeBlob)
        link.click()
        link.delete
    }
}


recording.addEventListener("click", () => {
    if(recording.innerText == "Start Recording"){
        recording.innerText = "Stop Recording"
        startRecording()
    }
    else{
        recording.innerText = "Start Recording"
        recorder.stop()
        stream.getVideoTracks()[0].stop()
        if(audio2_flag){
            aStream.getTracks()[0].stop()
        }
        chunks = []
    }
})

// start.addEventListener("click", () => {
//     start.setAttribute("disabled", true)
//     stop.removeAttribute("disabled")
//     startRecording()
// })

// stop.addEventListener("click", () => {
//     stop.setAttribute("disabled", true)
//     start.removeAttribute("disabled")
//     recorder.stop()
//     stream.getVideoTracks()[0].stop()
//     if(audio2_flag){
//         aStream.getTracks()[0].stop()
//     }
//     chunks = []
// })

