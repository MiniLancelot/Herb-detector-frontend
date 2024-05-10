const plantList = document.getElementById("plant-list");
const fileInput = document.getElementById("file-input");
const imageOutput = document.getElementById("image-herb");

const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture-btn");

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    body: data,
  });
  return response.json();
}

async function processFile(file) {
  console.log("File type:", file.type);
  imageOutput.src = "";
  plantList.innerText = "";

  if (!file.type.startsWith("image/")) {
    alert("Please upload an image");
    fileInput.value = "";
    return;
  }
  const formData = new FormData();
  formData.append("image", file);
  // const response = await postData("http://127.0.0.1:5000/detect", formData);
  const response = await postData("https://cloud-detect.onrender.com/detect", formData);
  console.log(response.plant_detected);
  imageOutput.src = "data:image/jpeg;base64," + response.plant_detected.image;

  while (plantList.firstChild) {
    plantList.removeChild(plantList.firstChild);
  }

  Object.keys(response.plant_detected.plants).forEach((plant) => {
    const listItem = document.createElement("li");
    listItem.textContent = plant;
    plantList.appendChild(listItem);
  });
}

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("An error occurred: " + err);
  });

captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const imageData = canvas.toDataURL("image/png");

  fetch(imageData)
    .then((res) => res.blob())
    .then(async (blob) => {
      const file = new File([blob], "webcam-image.png", { type: "image/png" });
      processFile(file);
    });
});

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  processFile(file);
});

// async function isWebcamConnected() {
//   const devices = await navigator.mediaDevices.enumerateDevices();
//   const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
//   return videoInputDevices.length > 0;
// }

// isWebcamConnected().then(isConnected => {
//   if (isConnected) {
//     console.log("Webcam is connected");
//   } else {
//     console.log("Webcam is not connected");
//   }
// });

async function isWebcamAccessible() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    return false;
  }
}

isWebcamAccessible().then(isAccessible => {
  if (isAccessible) {
    console.log("Webcam is accessible");
  } else {
    console.log("Webcam is not accessible");
  }
});