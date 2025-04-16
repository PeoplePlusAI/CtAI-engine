import React, { useEffect, useRef, useState } from 'react';
import Images from '../../utils/Image';
import CustomImage from '../../components/Image';
import Icons from '../../utils/Icon';
import CustomIcon from '../../components/Icon';
import useNavigation from '../../hooks/useNavigation';
import HistoryList from './addition/HistoryList';
import CustomButton from '../../components/Button';
import IModal from './addition/IModal';
import heic2any from "heic2any";
import Webcam from "react-webcam";
import { useImage } from '../../contexts/ImageContext';
import { fetchData } from '../../components/action';
import { BsInfoSquareFill } from "react-icons/bs";
import { useDropzone } from "react-dropzone";
import CustomTooltip from '../../components/Tooltip';

function CityIndex() {
  const { navigate } = useNavigation()
  const { setImageData } = useImage();
  const [history, setHistory] = useState([])
  const [showModal, setShowModal] = useState(false);

  const cameraInputRef = useRef(null);
  const webcamRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem("isCityAIFirstVisit");
    
    if (!isFirstVisit) {
      setShowModal(true);
      sessionStorage.setItem("isCityAIFirstVisit", "true");
    }
  }, []);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  const handleFileChange = (event) => {

    const files = event.target.files;

    if (files.length > 0) {
      const selectedFile = files[0];
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageData({ file: selectedFile, preview: imageUrl });
      navigate("/map");
    }

  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(file);
        setImageData({ file, preview: imageUrl });
        setShowWebcam(false);
        navigate("/map");
      });

  };

  const handleCameraClick = () => {
    if (isMobile) {
      cameraInputRef.current.click();
    } else {
      setShowWebcam(true);
    }
  };
  const stopWebcam = () => {
    if (webcamRef.current && webcamRef.current.video.srcObject) {
      let tracks = webcamRef.current.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowWebcam(false);
  };

  useEffect(() => {
    fetchData(`/all-data/`).then(data => {
      const sortedData = data.image_objects.sort((a, b) => b.id - a.id);
      {
        setHistory(sortedData)
      }
    })
  }, [])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".heic", ".heif"] },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        let selectedFile = acceptedFiles[0];

        const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp",
          "image/heic",
          "image/heif",
        ];

        if (selectedFile.type === "image/heic" || selectedFile.name.endsWith(".heic")) {
          try {
            const blob = await heic2any({
              blob: selectedFile,
              toType: "image/jpeg",
            });

            selectedFile = new File([blob], selectedFile.name.replace(".heic", ".jpg"), {
              type: "image/jpeg",
            });

          } catch (error) {
            alert("Failed to convert HEIC file.");
            return;
          }
        }
        if (!allowedTypes.includes(selectedFile.type)) {
          alert("Invalid file type. Please select a PNG, JPG, JPEG, WEBP, or HEIC file.");
          return;
        }
        const imageUrl = URL.createObjectURL(selectedFile);
        setImageData({ file: selectedFile, preview: imageUrl });

        navigate("/map");
      }
    },
  });

  return (
    <div className='backgroundContainer'>
      {/* Top-right image */}
      <CustomImage src={Images.topImg} className='topImg' />

      {/* Bottom-left image */}
      <CustomImage src={Images.bottomImg} className='bottomImg' />

      <div className=' col-12 d-flex pe-lg-4'>

        <div className='col-2  ms-4 ms-md-1 py-4 p-md-5'>
          <CustomImage src={Images.brandImg} className="brandImage" />
        </div>

        <div className='col-9  d-flex justify-content-end p-4 p-lg-5 px-lg-0'>
          <div>
            <BsInfoSquareFill size='clamp(1.8em, 5.5vw, 2.9em)'
              color='#005C75'
              onClick={() => setShowModal(true)}
              cursor='pointer'
               />
          </div>

          <IModal handleOpen={showModal} handleClose={() => setShowModal(false)} />

          <div className='px-md-2 px-lg-3'>
            <CustomButton style={styles.headerBtns} onClick={() => navigate('/visual')}
              className="viewBtn ms-3  px-3  py-2 px-md-3 rounded-2"
            >
              Map
            </CustomButton>
          </div>
        </div>

      </div>

      <div className='d-flex justify-content-center mb-4 pt-3 pt-sm-0'>
        <p className='title'>City AI Engine</p>
      </div>

      <div className='bg-white p-md-5 px-3  px-sm-5 py-4 py-sm-5'>
        <div>
          <p className='textFootpath ps-2 ps-md-2'>
            Click Your Footpath Picture
            <CustomTooltip
              tooltip_content="The image location isn't detected automatically. Click 'Get My Current Location' for auto-detection or select your location from the search suggestions in Google Places">
            </CustomTooltip>
          </p>
        </div>

        <div className='col-12 d-flex gap-2 pe-2 mt-3 mt-md-4'>
          <div className='col-6 zone d-sm-flex justify-content-end px-md-5 ' >

            <div  {...getRootProps()} className='footpathBoxg divBtn col-11 col-md-12 col-lg-11 d-flex flex-column p-5 px-2 p-sm-5 ms-2  justify-content-center align-items-center h-100 '>

              <input {...getInputProps()} className='w-100 h-100 py-5' />

              <CustomIcon icon={Icons.dropIcon} size="clamp(1.8rem, 6vw, 4rem)" color="#56A4B4" />
              {
                isDragActive ?
                  <span className='filesText pt-2'>Drop here</span>
                  :
                  <span className='filesText pt-2'>Drop file or Browse</span>
              }

              <p className='mt-3 notes text-center'>
               * Supporting image formats : PNG, JPG, JPEG, WEBP, HEIC.
               </p>
               
            </div>
          </div>
          <div className='col-6  d-sm-flex  px-md-5'  >
            {
              showWebcam !== false ?
                (
                  <div className='col-12 '>
                    <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className='w-100' />
                    <div className="container text-center">
                      <div className="row">

                        <div className="col">
                          <CustomButton onClick={() => captureImage()} className="captureBtn w-100 btn-sm">Capture</CustomButton>
                        </div>

                        <div className="col">
                          <CustomButton onClick={() => stopWebcam()} className="cancelBtn w-100 btn-sm">Cancel</CustomButton>
                        </div>

                      </div>
                    </div>
                  </div>
                )
                : (
                  <div className=' footpathBoxw divBtn col-11 col-md-12 col-lg-11 d-flex  flex-column p-5 px-4 py-5  px-sm-3 ms-2 justify-content-center align-items-center h-100' onClick={() => handleCameraClick("cameraOn")} >

                    <CustomIcon icon={Icons.cameraIcon} size="clamp(1.8rem, 6vw, 4rem)" color="#56A4B4" className='pt-1 pt-sm-0' />
                    <span className='filesText fs-md-1  ps-2'>Open Camera & Take photo</span>
                    {/* -------------------Hiden file inpu-------------- */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      style={{ display: "none" }}
                      ref={cameraInputRef}
                      onChange={handleFileChange}
                    />
                    
                  </div>
                )
            }
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center px-3 ps-md-5 pe-md-1 px-lg-5 py-3 mt-4">
        <div className="col-8 ">
          <p className='textFootpath ps-2 ps-sm-4 ps-md-2'>History</p>
        </div>
        {/* {-deleteIcon--------} */}
        {/* <div className='col-4 d-flex justify-content-end ms-sm-1 ms-md-0 mb-1' >
          <div className='deleteBox me-sm-3 me-md-5 me-lg-5 h-100 d-flex align-items-center '>
            <CustomIcon icon={Icons.deleteIcon} size='100%' />
          </div>
        </div> */}
      </div>
      <HistoryList historyItems={history} />
    </div>

  );
}

const styles = {
  headerBtns: {
    fontSize: "clamp(0.5rem, 2vw, 1.2rem)",
  }
}

export default CityIndex;
