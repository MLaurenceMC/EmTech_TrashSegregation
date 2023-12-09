const model = await tf.loadLayersModel('C:\Users\ML_Ca\EmTech_TrashSegregation\tm-my-image-model\model.json');

// Wait for OpenCV.js to be ready
function onOpenCvReady() {
    // Your OpenCV.js code can go here
    console.log('OpenCV.js is ready!');
    
    // Access the camera and process frames
    startCamera();
}

// Start camera and process frames
async function startCamera() {
    const video = document.createElement('video');
    
    // Access user's camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    
    // Wait for the video to be loaded
    video.onloadedmetadata = () => {
        video.play();
        
        // Start processing frames
        processFrames(video);
    };
}

// Process frames from the camera
function processFrames(video) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.width;
    canvas.height = video.height;

    // Append canvas to the body or another container
    document.body.appendChild(canvas);

    // Define a function to process each frame
    function processFrame() {
        // Draw the current frame on the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Convert image data to a matrix (you may need to adapt this based on your model's input)
        const mat = cv.matFromImageData(imageData);

        // Perform image processing with OpenCV functions
        // Example: Convert the image to grayscale
        cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY);

        // Display the result on the canvas
        cv.imshow(canvas, mat);

        // Release the matrix
        mat.delete();

        // Request the next animation frame
        requestAnimationFrame(processFrame);
    }

    // Start processing frames
    processFrame();
}

