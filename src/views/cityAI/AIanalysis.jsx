import { ProgressBar } from 'react-bootstrap';
import CustomCard from '../../components/Card';
import CustomIcon from '../../components/Icon';
import CustomImage from '../../components/Image';
import Icons from '../../utils/Icon';
import Images from '../../utils/Image';
import useNavigation from '../../hooks/useNavigation';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomLoader from '../../components/Loader';

function Aianalysis() {
    const [loading, setLoading] = useState(true);
    const { navigate } = useNavigation()
    const { details } = useLocation().state?.state || {};
    const [place, setPlace] = useState("");

    useEffect(() => {
        getPlaceName(details.latitude, details.longitude);

        if (details) {
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        }
    }, []);

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

                setPlace(formattedName || "Location not found");
            } else {
                console.error("Location not found");
            }
        } catch (error) {
            console.error("Error fetching location");
        }
    };

    return (
        <div className='backgroundContainer'>
            <CustomImage src={Images.topImg} className='topImg' />
            <CustomImage src={Images.bottomImg} className='bottomImg' />

            {loading ? (
                <div className='d-flex justify-content-center align-items-center h-100'>
                    <CustomLoader />
                </div>
            ) : (
                details ? (
                    <>
                        <div className="col-12 pb-md-5">
                            <div className='col-12'>
                                <div className='col-2 d-flex justify-content-center ms-5  ms-md-4 p-4 p-sm-5'>
                                    <CustomImage src={Images.brandImg} className="brandImage" />
                                </div>
                            </div>

                            <div className="leftArrow col-6 col-sm-6 col-md-6 mb-5 ms-4 ms-sm-5 ps-2 ps-lg-3 d-flex">
                                <div className="arrow-container divBtn" onClick={() => navigate(-1)}>
                                    <CustomIcon icon={Icons.leftArrow} size='40' />
                                </div>

                                <div className=' ms-3 pt-2 d-flex justify-content-center align-items-end'>
                                    <p className='selectedPlaceTitle'>{place}</p>
                                </div>
                            </div>

                        </div>

                        <div className='mt-5 d-flex justify-content-center'>
                            <div className='d-flex justify-content-center col-10 col-md-9 '>
                                <CustomImage src={`${process.env.REACT_APP_BASE_URL}${details.road_image_url}`} className='selectedImage rounded-3' />
                            </div>
                        </div>

                        <div className='mt-5 pt-5 d-flex justify-content-center'>
                            <p className=" fw-bold textFootpath">AI Analysis</p>
                        </div>

                        <div className='mx-lg-5 mt-2 mt-md-4 d-flex justify-content-center'>
                            <div className='infoCard col-10 col-md-9  '>
                                <CustomCard className='shadow-lg ' >
                                    <div className="container-fluid">
                                        <div className="row mb-2 ">
                                            <div className="col-6 mt-2 ps-0">
                                                <p className="imginfoTitle pt-2">Image Information</p>
                                            </div>
                                            {/* {--------edit-Icon----------} */}
                                            {/* <div className='col-6 d-flex justify-content-end' >
                                                <div className='editBox' onClick={()=> navigate('/map')}>
                                                    <CustomIcon icon={Icons.editIcon} size='100%' className='h-100 d-flex align-items-center'  />
                                                </div>
                                            </div> */}
                                        </div>


                                        <div className="row">
                                            <div className="col-12 d-flex align-items-center ps-1 ps-md-3">
                                                <p className="filenameTitle me-2">Filename:</p>
                                                <p className="filenameText  text-truncate pt-1">{details.road_image_filename || "No file selected"}</p>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-6 d-flex align-items-center ps-1 ps-md-3">
                                                <p className="filenameTitle me-2">Latitude:</p>
                                                <p className="filenameText text-truncate pt-1">{details ? details.latitude : "Not Available"}</p>
                                            </div>

                                            <div className="col-6 d-flex align-items-center  justify-content-sm-end">
                                                <p className="filenameTitle me-2">Longitude:</p>
                                                <p className="filenameText text-truncate  pt-1"> {details ? details.longitude : "Not Available"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CustomCard>
                            </div>
                        </div>

                        <div className='mx-lg-5 mt-3 mt-md-5 d-flex justify-content-center'>
                            <div className='col-10 col-md-9 infoCard'>
                                <CustomCard className='shadow-lg'>
                                    <div className="container-fluid">
                                        <div className="row mb-2">
                                            <div className="col-6">
                                                <p className="imginfoTitle">Analysis Result</p>
                                            </div>
                                            <div className='col-6 d-flex justify-content-end' >
                                                <div className=' d-flex justify-content-end '>
                                                    <p className="imginfoTitle">Score: {details.overall_score}</p>
                                                </div>
                                            </div>
                                            <div className="p-md-3">
                                                <ProgressBar
                                                    now={(details.overall_score / 5) * 100}
                                                    className='progressColors'
                                                    style={{ height: "15px" }}
                                                />
                                                <div className="d-flex justify-content-between mt-2">
                                                    <span>0</span> <span>1</span><span>2</span><span>3</span>
                                                    <span>4</span><span>5</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CustomCard>
                            </div>
                        </div>

                        <div className='mx-lg-5 mt-3 mt-md-5 d-flex justify-content-center'>
                            <div className='col-10 col-md-9'>
                                <CustomCard className='yellowCard shadow-lg '>
                                    <div>
                                        <p className='yellowCardTitle'>What went wrong?</p>
                                    </div>
                                    <div>
                                        <p className='yellowCardText'>{details.negative_components}</p>
                                    </div>
                                </CustomCard>
                            </div>
                        </div>

                        <div className='mx-lg-5 mt-3 mt-md-5 mb-5 d-flex justify-content-center'>
                            <div className='col-10 col-md-9'>
                                <CustomCard className='violetCard shadow-lg'>
                                    <div>
                                        <p className='violetCardTitle'>Action Recommendations</p>
                                    </div>
                                    <div>
                                        <p className='violetCardText'> {details.actionable_recommendations} </p>
                                    </div>
                                </CustomCard>
                            </div>
                        </div>
                    </>
                ) : (
                    <p className='text-center'>No data available</p>
                )
            )}
        </div>
    );
}
export default Aianalysis
