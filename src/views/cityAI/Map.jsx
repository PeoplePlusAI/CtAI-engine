import { useRef, useState } from "react";
import CustomButton from "../../components/Button";
import CustomIcon from "../../components/Icon";
import CustomImage from "../../components/Image";
import Icons from "../../utils/Icon";
import Images from "../../utils/Image";
import { GoogleMap, Marker, useJsApiLoader, Autocomplete, } from "@react-google-maps/api";
import { useImage } from "../../contexts/ImageContext";
import useNavigation from "../../hooks/useNavigation";
import { postData } from "../../components/action";

const LIBRARIES = ["places"];

function Map() {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const autocompleteRef = useRef(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);


  const { imageData } = useImage();
  const { navigate } = useNavigation();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: LIBRARIES,
  });



  const getDeviceInfo = () => {
    const deviceInfo = {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      deviceMemory: navigator.deviceMemory || "Unknown",
      hardwareConcurrency: navigator.hardwareConcurrency || "Unknown",
    };
    return deviceInfo;
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place?.geometry) return;

    const { lat, lng } = place.geometry.location;

    const selected = {
      lat: lat(),
      lng: lng(),
      geolocationData: {
        timestamp: Date.now(),
        latitude: lat(),
        longitude: lng(),
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
    };

    setLocation({ lat: lat(), lng: lng() });
    setSearchQuery(place.name);
    setSelectedPlace(selected);
  };

  const getPlaceName = async (lat, lng) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    try {
      if (data.status === "OK" && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;

        let subLocality = "";
        let locality = "";
        let district = "";

        addressComponents.forEach((component) => {
          if (component.types.includes("sublocality") || component.types.includes("sublocality_level_1")) {
            subLocality = component.long_name;
          }
          if (component.types.includes("locality")) {
            locality = component.long_name;
          }
          if (component.types.includes("administrative_area_level_2")) {
            district = component.long_name;
          }
        });

        let formattedName = subLocality && locality
          ? `${subLocality}, ${locality}`
          : !subLocality
            ? `${locality}, ${district}`
            : district;
        return formattedName || "Location not found"
      } else {
        console.error("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location");
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlace && !location) {
      alert("Please select a location before submitting.");
      return;
    }

    let formData = new FormData();
    const deviceInfo = getDeviceInfo();
    const placeDataToSubmit = selectedPlace || location;
    formData.append("file", imageData.file);
    formData.append("lat", placeDataToSubmit.lat);
    formData.append("long", placeDataToSubmit.lng);
    formData.append("deviceInfo", JSON.stringify(deviceInfo));
    formData.append("geolocation", JSON.stringify(placeDataToSubmit.geolocationData));

    try {
      setUploadLoading(true);
      const response = await postData(`${process.env.REACT_APP_BASE_URL}`, formData);
      if (response.status === 200) {
        setUploadLoading(false);
  
        navigate("/placeDetails", {
          state: {
            filename: imageData.file?.name,
            filelink: imageData.preview,
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            responseCode: response.data.response,
            negativeComponents: response.data.negative_components,
            actionableRecommendation:
              response.data.actionable_recommendations,
            place: await getPlaceName(response.data.latitude,response.data.longitude)
          },
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setUploadLoading(false);
    }
  };
  const handleCurrentLocation = () => {
    setCurrentLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords, timestamp }) => {

        const geolocationData = {
          timestamp,
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            altitudeAccuracy: coords.altitudeAccuracy,
            heading: coords.heading,
            speed: coords.speed,
          },
        };

        setLocation({
          lat: coords.latitude,
          lng: coords.longitude,
          geolocationData,
        });

        setTimeout(() => {
          setCurrentLocationLoading(false)
        }, 300);

      },
      (error) => {
        setUploadLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(
              "Permission denied. Allow location access in browser settings."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location unavailable. Try moving outdoors.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out. Try again.");
            break;
          default:
            alert("An unknown error occurred.");
        }
      }
    );
  };

  return (
    <div className="backgroundContainer">
      {/* Top-right image */}
      <CustomImage src={Images.topImg} className="topImg" />
      {/* Bottom-left image */}
      <CustomImage src={Images.bottomImg} className="bottomImg" />

      <div className="col-12">
        <div className="col-12">
          <div className="col-2 d-flex justify-content-center ms-5 ms-md-1 p-4 p-sm-5">
            <CustomImage src={Images.brandImg} className="brandImage" />
          </div>
        </div>
        <div className="leftArrow ms-4 ms-md-5 col-1">
          <div
            className="arrow-container divBtn mb-5 mb-sm-5"
            onClick={() => navigate(-1)}
          >
            <CustomIcon icon={Icons.leftArrow} size="40" />
          </div>
        </div>
      </div>

      <div className="mt-5 d-flex justify-content-center">
        <div className="d-flex justify-content-center col-9 col-md-9 col-lg-10">
          <CustomImage
            src={imageData.preview}
            className="selectedImage rounded-3"
          />
        </div>
      </div>

      <div className="mt-5 d-flex justify-content-center">
        <div className="col-md-7 d-flex justify-content-center">
          <CustomButton
            className="locationBtn bg-transparent d-flex gap-md-2 pb-0 px-2 px-md-4"
            onClick={() => handleCurrentLocation()}
            disabled={currentLocationLoading}
          >
            <CustomIcon icon={Icons.gpsIcon} size="40" />
            <p className="locationText pt-2 pt-md-2 pt-lg-1">
              {currentLocationLoading ? "Loading..." : "Get my Current Location"}
            </p>
          </CustomButton>
        </div>
      </div>

      <div className="col-12 d-flex align-items-center mt-5 px-4 px-md-5">
        <div className="flex-grow-1">
          <hr className="divider" />
        </div>
        <p className="mx-3 or-text">or</p>
        <div className="flex-grow-1">
          <hr className="divider" />
        </div>
      </div>

      <div className=" mt-5  d-flex justify-content-center position-relative">
        <div className="col-10 col-md-9 col-lg-8 position-relative border border-success rounded-3">
          <div className=" position-absolute top-0 start-50 translate-middle-x bg-white border border-success p rounded  p-md-2 shadow d-flex align-items-center  w-70  z-3">
            {isLoaded && (
              <Autocomplete
                onLoad={(ref) => (autocompleteRef.current = ref)}
                onPlaceChanged={handlePlaceSelect}
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control border-0 flex-grow-1"
                  placeholder="Search"
                />
              </Autocomplete>
            )}
            <CustomIcon icon={Icons.searchIcon} />
          </div>

          {/* Google Map */}
          {!isLoaded ? (
            <p>Loading Map...</p>
          ) : (
            <div className="position-relative z-0">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={location || { lat: 37.7749, lng: -122.4194 }}
                zoom={10}
                options={{
                  fullscreenControl: false,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                }}
              >
                {location && <Marker position={location} />}
              </GoogleMap>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 mt-md-5 d-flex justify-content-center mb-5">
        <div className="col-7 d-flex justify-content-center ">
          <CustomButton
            className="submitBtn d-flex align-items-center justify-content-center pt-md-2 gap-2 gap-md-4 pb-2 px-3 px-md-5"
            onClick={() => handleSubmit()}
            disabled={uploadLoading}
          >
            <p className="submitText fw-bold mb-0 ">
              {uploadLoading ? "Loading..." : "Submit"}
            </p>
            <div className="rightArrowBox d-flex align-items-center">
              <CustomIcon icon={Icons.rightArrow} className="submitIcon" />
            </div>
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

export default Map;
