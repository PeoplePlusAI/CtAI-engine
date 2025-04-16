import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import CustomImage from "../../components/Image";
import Images from "../../utils/Image";
import CustomIcon from "../../components/Icon";
import Icons from "../../utils/Icon";
import CustomCard from "../../components/Card";
import { fetchData } from "../../components/action";
import CustomButton from "../../components/Button";
import useNavigation from "../../hooks/useNavigation";


const legendData = [
    { score: 1, color: "bg-danger", text: "Walkability Score :1 (Very Poor)" },
    { score: 2, color: "bg-danger-subtle", text: "Walkability Score :2 (Poor)" },
    { score: 3, color: "bg-warning", text: "Walkability Score :3 (Moderate)" },
    { score: 4, color: "bg-success", text: "Walkability Score :4 (Good)" },
    { score: 5, color: "bg-primary", text: "Walkability Score :5 (Excellent)" }
];

const getMarkerColor = (score) => {
    switch (score) {
        case 1: return "#dc3545";
        case 2: return "#ff9999";
        case 3: return "#ffc107";
        case 4: return "#198754";
        case 5: return "#0d6efd";
        default: return "gray";
    }
};

const LIBRARIES = ["places"]; 

function Visualization() {
    const [placeData, setPlaceData] = useState([])
    const [mapLoaded, setMapLoaded] = useState(false);
    const [hoveredData, setHoveredData] = useState(null);
    const [showLegend, setShowLegend] = useState(false);

    const [hoveredPlace, setHoveredPlace] = useState("");

    const { navigate } = useNavigation()

    useEffect(() => {
        fetchData('/all-data').then(data => {setPlaceData(data.image_objects)
        })
    }, [])

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey:process.env.REACT_APP_GOOGLE_API_KEY,
        libraries : LIBRARIES
    });

    useEffect(() => {
        if (isLoaded && window.google) {
            setMapLoaded(true);
        }
    }, [isLoaded]);

    return (
        <div className="backgroundContainer d-flex flex-column vh-100 overflow-hidden">
            {/* Header Section */}
            <div className="col-12 px-1 px-md-5 pt-4">
                {/* Row 1: Arrow Icon & Brand Image */}
                <div className="col-12 row align-items-center ">
                    {/* Left Arrow */}
                    <div className="col-auto">
                        <div className="arrow-container divBtn" onClick={() => navigate(-1)}>
                            <CustomIcon icon={Icons.leftArrow} size="40" />
                        </div>
                    </div>

                    {/* Brand Image */}
                    <div className="col-2 px-lg-4 pe-lg-5 ">
                        <CustomImage src={Images.brandImg} className="brandImage" />
                    </div>
                </div>

                {/* Row 2: Centered Title */}
                <div className="row">
                    <div className="col-12 text-center">
                        <h2 className="title mb-2">Visualization</h2>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-grow-1 position-relative">
                {!mapLoaded ? (
                    <p className="text-center mt-5">Loading Map...</p>
                ) : (
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={{ lat: 12.929892, lng: 77.6292899 }}
                        zoom={8}
                        options={{
                            fullscreenControl: false,
                            zoomControl: true,
                            streetViewControl: false,
                            mapTypeControl: false,
                            disableDefaultUI: true,
                            styles: [
                                { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
                                { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
                                { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
                            ],
                        }}
                    >
                        {placeData.map((point) => (
                            <Marker
                                key={point.id}
                                position={{ lat: parseFloat(point.latitude), lng: parseFloat(point.longitude) }}
                                icon={{
                                    path: window.google?.maps.SymbolPath.CIRCLE,
                                    scale: 10,
                                    fillColor: getMarkerColor(point.overall_score),
                                    fillOpacity: 1,
                                    strokeWeight: 1,
                                    strokeColor: "#333",
                                }}
                                onClick={() => {
                                    setHoveredData(point)
                                }}
                            />
                        ))}
                    </GoogleMap>
                )}

                {/* Hover Card */}
                {hoveredData && (
                    <div className="position-absolute top-50 start-50 translate-middle z-5 col-12">
                        <div className="col-6 col-sm-4 col-md-4 col-lg-4 mx-auto">
                            <CustomCard className=" shadow-lg  p-2 px-1 small-card">
                                {/* Header Section */}
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    {/* <div className="d-flex location-title  align-items-center">
                                        <CustomIcon icon={Icons.locationIcon} size='20' className="pe-1" />
                                        {hoveredPlace || "Fetching..."}
                                    </div> */}
                                    <div className="cancelIconBox" style={{ cursor: "pointer" }} onClick={() => setHoveredData(null)}>
                                        <CustomIcon icon={Icons.cancelIcon} className="cancelIcon" />
                                    </div>
                                </div>

                                <CustomImage
                                    src={`${process.env.REACT_APP_BASE_URL}${hoveredData.road_image_url}`}
                                    alt="Road Issue"
                                    className="img-fluid rounded mb-2"
                                    style={{ height: "6.5rem", width: "100%", objectFit: "cover" }}
                                />

                                <div className="info-text">
                                    <p className="mb-1 text-id"><strong>ID:</strong> {hoveredData.id}</p>
                                    <p className="mb-1 text-score"><strong>Score:</strong> {hoveredData.overall_score}</p>
                                    <p className="mb-1 text-issues text-break"><strong>Issues:</strong> {hoveredData.negative_components}</p>
                                    <p className="mb-1 text-recommendation text-break"><strong>Recommendation:</strong> {hoveredData.actionable_recommendations}</p>
                                </div>


                                <div className="d-flex justify-content-center ">
                                    <CustomButton className=" viewBtn btn-sm w-100 "
                                        onClick={() => navigate('/aiAnalysis', { state: { details: hoveredData, place: hoveredPlace } })}>
                                        View
                                    </CustomButton>
                                </div>
                            </CustomCard>
                        </div>
                    </div>
                )}

                {/* Legend - Bottom Left */}
                <div className="position-absolute bottom-0 start-0 m-3 d-none d-md-block col-6 col-md-5 col-lg-3">
                    <CustomCard className="shadow rounded p-3 p-lg-0">
                        {legendData.map((item) => (
                            <div key={item.score} className="d-flex align-items-center mb-1">
                                <div className={`legend-square ${item.color}`}></div>
                                <span className="ms-2">{item.text}</span>
                            </div>
                        ))}
                    </CustomCard>
                </div>

                <div className="position-absolute bottom-0 start-10 translate-end-x m-3 ps-2 d-md-none">
                    <button className="btn btn-dark" onClick={() => setShowLegend(!showLegend)}>
                        {showLegend ? "▼" : "▲"}
                    </button>
                    {showLegend && (
                        <CustomCard className="shadow rounded p-3 mt-2">
                            {legendData.map((item) => (
                                <div key={item.score} className="d-flex align-items-center mb-1">
                                    <div className={`legend-square ${item.color}`}></div>
                                    <span className="ms-2">{item.text}</span>
                                </div>
                            ))}
                        </CustomCard>
                    )}
                </div>
            </div>
        </div>
    );
}
const styles = {
    viewBtn: {
        backgroundColor: '#005C75',
        border: 'none',
        fontSize: "clamp(0.7rem, 2vw, 1.2rem)",

    }
}
export default Visualization;
