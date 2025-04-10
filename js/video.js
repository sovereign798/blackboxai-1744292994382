// Global variables to store recording state
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let isPaused = false;
let stream;

// DOM Elements
const videoPreview = document.getElementById('videoPreview');
const recordButton = document.getElementById('recordButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const downloadButton = document.getElementById('downloadButton');
const recordingsList = document.getElementById('recordingsList');
const previewSection = document.getElementById('previewSection');
const recordingPreview = document.getElementById('recordingPreview');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Initialize the application
async function initializeRecording() {
    try {
        // Request access to the user's camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoPreview.srcObject = stream;
        
        // Enable the record button
        recordButton.disabled = false;
        
        // Hide any previous error messages
        hideError();
    } catch (err) {
        showError('Could not access camera. Please ensure you have granted permission and have a camera connected.');
        console.error('Error accessing media devices:', err);
    }
}

// Start recording
function startRecording() {
    try {
        // Create MediaRecorder instance
        mediaRecorder = new MediaRecorder(stream);
        
        // Handle dataavailable event
        mediaRecorder.ondataavailable = handleDataAvailable;
        
        // Handle recording stop
        mediaRecorder.onstop = handleStop;
        
        // Start recording
        mediaRecorder.start();
        isRecording = true;
        
        // Update UI
        updateButtonStates();
        hideError();
    } catch (err) {
        showError('Failed to start recording. Please try again.');
        console.error('Error starting recording:', err);
    }
}

// Handle data available event
function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

// Handle recording stop
function handleStop() {
    // Create blob from recorded chunks
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    
    // Create URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Add recording to history
    addRecordingToHistory(url);
    
    // Show preview
    showPreview(url);
    
    // Reset recording state
    recordedChunks = [];
    isRecording = false;
    isPaused = false;
    
    // Update UI
    updateButtonStates();
}

// Add recording to history
function addRecordingToHistory(url) {
    const timestamp = new Date().toLocaleTimeString();
    const recordingItem = document.createElement('div');
    recordingItem.className = 'bg-white p-3 rounded-lg shadow';
    recordingItem.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <p class="text-sm font-medium text-gray-900">Recording ${recordingsList.children.length + 1}</p>
                <p class="text-xs text-gray-500">${timestamp}</p>
            </div>
            <button onclick="previewRecording('${url}')" class="text-indigo-600 hover:text-indigo-900">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `;
    recordingsList.insertBefore(recordingItem, recordingsList.firstChild);
}

// Show preview
function showPreview(url) {
    recordingPreview.src = url;
    previewSection.classList.remove('hidden');
    downloadButton.onclick = () => downloadRecording(url);
}

// Preview recording
function previewRecording(url) {
    showPreview(url);
    recordingPreview.play();
}

// Download recording
function downloadRecording(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().getTime()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Update button states
function updateButtonStates() {
    recordButton.disabled = isRecording;
    pauseButton.disabled = !isRecording;
    stopButton.disabled = !isRecording;
    
    // Update button text and icons based on state
    if (isRecording) {
        recordButton.innerHTML = '<i class="fas fa-circle mr-2"></i> Recording...';
        recordButton.classList.add('bg-gray-400');
        recordButton.classList.remove('bg-red-600', 'hover:bg-red-700');
    } else {
        recordButton.innerHTML = '<i class="fas fa-circle mr-2"></i> Record';
        recordButton.classList.remove('bg-gray-400');
        recordButton.classList.add('bg-red-600', 'hover:bg-red-700');
    }
    
    if (isPaused) {
        pauseButton.innerHTML = '<i class="fas fa-play mr-2"></i> Resume';
    } else {
        pauseButton.innerHTML = '<i class="fas fa-pause mr-2"></i> Pause';
    }
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Event Listeners
recordButton.addEventListener('click', () => {
    if (!isRecording) {
        startRecording();
    }
});

pauseButton.addEventListener('click', () => {
    if (isRecording) {
        if (isPaused) {
            mediaRecorder.resume();
            isPaused = false;
        } else {
            mediaRecorder.pause();
            isPaused = true;
        }
        updateButtonStates();
    }
});

stopButton.addEventListener('click', () => {
    if (isRecording) {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        initializeRecording(); // Reinitialize for new recording
    }
});

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initializeRecording);
