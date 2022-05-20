import React, { useState } from "react";
import "antd/dist/antd.css";
import { Card, Button, Progress, Row } from "antd";
import axios from "axios";

function ProgressBar() {
  const [fetching, setFetching] = useState(false);
  const [selectedFile, setFiles] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [allowUpload, setAllowUpload] = useState(true);
  const [verifyProgress, setVerificationProgress] =  useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  React.useEffect(() => {
    const source =  new EventSource("http://localhost:5000/api/sse");
    source.addEventListener('open', () => {
      console.log('SSE Opened!')
    });

    source.addEventListener('verification', (event) => {
      const data =  JSON.parse(event.data);
      setVerificationProgress(data);

      //if(data === 100) {
       // source.close();
      //}
    });

    source.addEventListener('error', (e) => {
      console.log('Error: ', e);
    });

    return () => {
      source.close()
    }
  }, [])

  const handleSelectedFile = (event) => {
    console.log(event);
    setAllowUpload(false);
    setFiles(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("file", selectedFile);
    uploadFile(data, setUploadPercentage);
  };



  const uploadFile = (data, updateProgress) => {
    setFetching(true);
    return axios
      .post("http://localhost:5000/api/docs/upload", data, {
        onUploadProgress: (progressEvent) => {
          let percentageComplete = 
            progressEvent.loaded / progressEvent.total
          ;
          percentageComplete = parseInt(percentageComplete * 100);
          console.log(progressEvent);
           // console.log(percentageComplete);
          updateProgress(percentageComplete);
          setTimeout(() => {
            setUploadPercentage(0);
            setFiles(undefined);
          }, 2000);
        },
      })
      .then((response) => {
        if (response.data.status === "success") {
          setAllowUpload(true);
          setUploadComplete(true);
          //verificationProgress();
        }
        console.log(response);
      });
  };

  return (
    <div>
      <Card ttitle="Live Progress Indicator">
        <Row justify="center">
          {fetching &&
            (uploadPercentage / 100) * 100 !== 100 &&
            `Uploading [${(uploadPercentage / 100) * 100}/100]%`}
          {(uploadPercentage / 100) * 100 === 100 &&
            "File Uploaded Successfully"}
        </Row>
        <br />
        <Row justify="center">
          <form>
            <input type="file" onChange={handleSelectedFile} />
            <Button
              type="primary submit"
              disabled={allowUpload}
              onClick={handleSubmit}
            >
              Upload
            </Button>
          </form>
        </Row>
        <br />
        <Row justify="center">
          <h2>File Upload</h2>
          <Progress type="circle" percent={(uploadPercentage / 100) * 100} />
        </Row>
        <br />

          
            <Row justify="center">
              <h2>File Verification</h2>
              <Progress type="circle" percent={verifyProgress} />
            </Row>
          
      </Card>
    </div>
  );
}

export default ProgressBar;
