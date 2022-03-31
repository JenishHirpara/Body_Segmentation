// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load bodypix DONE
// 6. Detect function DONE
// 7. Draw using drawMask DONE

import React, {useRef} from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodySegment = async() => {
    const net = await bodyPix.load();
    console.log("BodyPix model loaded");
    setInterval(() => {
      detect(net);
    }, 100);
  }

  const detect = async(net) => {
    // Check data is available
    if(typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4) {
      // Get video properties
      const video = webcamRef.current.video;
      const videoHeight = video.videoHeight;
      const videoWidth = video.videoWidth;
      
      // Set video width and height
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas width and height
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      
      // Make detections
      const person = await net.segmentPersonParts(video);
      console.log(person);

      // Draw detections
      const coloredPartImage = bodyPix.toColoredPartMask(person);

      bodyPix.drawMask(
        canvasRef.current, 
        video, 
        coloredPartImage, 
        0.7, 
        0, 
        false,
      );
    }
  }

  runBodySegment();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }} />
        <canvas ref={canvasRef} style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480,
        }} />
      </header>
    </div>
  );
}

export default App;
