// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// The link to your model provided by the Teachable Machine export panel
const URL = "./tm-my-image-model/";

let model, labelContainer, maxPredictions;
let video, canvas, ctx;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load the model and metadata
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Set up the camera to use the main camera (rear-facing camera)
    const flip = true; // whether to flip the camera feed

    // Get user media
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 640 },
            height: { ideal: 480 },
        },
    });

    // Create a video element to display the camera feed
    video = document.createElement("video");
    video.srcObject = stream;
    video.width = 200;
    video.height = 200;
    video.autoplay = true;
    // Create a canvas element to capture frames from the video
    canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);

    // Create a canvas context
    ctx = canvas.getContext("2d");

    // Append elements to the DOM
    const predictionContainer = document.getElementById("prediction-container");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    const startButton = document.getElementById("startButton");
    startButton.style.display = "none";

    // Start the loop after initializing
    loop();
}

async function loop() {
    await predict(); // predict should be called before updating the webcam
    updateMostProbablePrediction(); // Update the most probable prediction
    requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const prediction = await model.predict(canvas);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// Function to update the most probable prediction
async function updateMostProbablePrediction() {
    const predictions = await model.predict(canvas);

    // Find the prediction with the highest probability
    let mostProbablePrediction = predictions.reduce((max, prediction) => {
        return prediction.probability > max.probability ? prediction : max;
    });

    // Display the most probable prediction
    predictionContainer.innerHTML = `Most Probable: ${mostProbablePrediction.className}`;
}

// Call init to start the application
init();
