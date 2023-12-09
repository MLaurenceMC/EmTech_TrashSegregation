// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "./tm-my-image-model/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    // Set up the camera to use the main camera (rear-facing camera)
    const flip = true; // whether to flip the camera feed

    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((error) => {
        console.error('Error accessing the webcam: ', error);
    });

    // Create a video element to display the camera feed
    const video = document.createElement("video");
    video.srcObject = stream;
    video.width = 200;
    video.height = 200;
    video.autoplay = true;
    document.body.appendChild(video);

    // Create a canvas element to capture frames from the video
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);

    // Create a canvas context
    const ctx = canvas.getContext("2d");

    // Webcam update function
    const updateWebcam = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(updateWebcam);
    };

    // Start updating the webcam
    updateWebcam();
    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }

    const startButton = document.getElementById("startButton");
    startButton.style.display = "none";
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}
