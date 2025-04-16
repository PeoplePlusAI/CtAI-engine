import React, { useState } from "react";
import CustomButton from "../../../components/Button";
import CustomImage from "../../../components/Image";
import useNavigation from "../../../hooks/useNavigation";
import DataTable from "react-data-table-component";


const HistoryList = ({ historyItems, onDelete }) => {
  const { navigate } = useNavigation()
  // const [placeNames, setPlaceNames] = useState({});
  // const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      name: "Image",
      selector: (row) => row.image,
      cell: (row) =>
        <div className="col-6 col-sm-5">
          <CustomImage
          src={`${process.env.REACT_APP_BASE_URL}${row.road_image_url}`}
          alt="Thumbnail"
          className="rounded ms-lg-4"
          style={{ height: "clamp(2.8rem, 5vw, 6rem)", }}
          width="100%"
        />
        </div>,
      sortable: true,
    },
    {
      name: "Latitude",
      selector: (row) => <span className="placeTitle">{row.latitude || "Loading..."}</span>,
      sortable: true,
    },
    {
      name: "Longitude",
      selector: (row) => <span className="placeTitle">{row.longitude || "Loading..."}</span>,
      sortable: true,
    },
    {
      name: "View",
      cell: (row, index) => (
        <div className="col-12 d-flex justify-content-center ">
          <CustomButton
            style={styles.viewBtn}
            className="viewBtn  px-2 py-1 px-md-3 rounded-2"
            onClick={() => navigate('/aiAnalysis', { state: { details: row } })}
          >
            View
          </CustomButton>
        </div>
      ),
    },
  ];

  // const filteredData = historyItems.filter((row) =>
  //   placeNames[row.id]?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // useEffect(() => {
  //   historyItems.forEach((item, index) => {
  //     if (item.latitude && item.longitude) {
  //       getPlaceName(item.latitude, item.longitude, index);
  //     }
  //   });
  // }, [historyItems]);

  // const getPlaceName = async (lat, lng, index) => {
  //   const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
  //   console.log(API_KEY)
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;

  //   try {
  //     const response = await fetch(url);
  //     const data = await response.json();

  //     if (data.status === "OK" && data.results.length > 0) {
  //       const addressComponents = data.results[0].address_components;

  //       let subLocality = "";
  //       let locality = "";
  //       let district = "";

  //       addressComponents.forEach((component) => {
  //         if (component.types.includes("sublocality") || component.types.includes("sublocality_level_1")) {
  //           subLocality = component.long_name;
  //         }
  //         if (component.types.includes("locality")) {
  //           locality = component.long_name;
  //         }
  //         if (component.types.includes("administrative_area_level_2")) {
  //           district = component.long_name;
  //         }
  //       });

  //       let formattedName = subLocality && locality ? `${subLocality}, ${locality}` :
  //         !subLocality ? `${locality}, ${district}` : district;

  //       setPlaceNames((prev) => ({ ...prev, [index]: formattedName }));
  //     } else {
  //       setPlaceNames((prev) => ({ ...prev, [index]: "Location not found" }));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching place name:", error);
  //     setPlaceNames((prev) => ({ ...prev, [index]: "Error fetching location" }));
  //   }
  // };

  return (
    <div className="px-5">
    {/* ----------search-input---------
      <div className="col-10 ps-3 ps-lg-4 ms-lg-3">
        <input
          type="text"
          placeholder="Search places..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control mb-3"
          style={{ width: "101%" }}
        />
      </div> */}

      <DataTable
        columns={columns}
        data={historyItems}
        pagination
        highlightOnHover
        noTableHead
        responsive
        customStyles={{ 
          rows: { style: { paddingTop: "1rem", paddingBottom: "1rem", background: "transparent" } },
          table: { style: { backgroundColor: "transparent", background: 'transparent' } },
          pagination: { style: { background: "transparent" } }
        }}
        paginationRowsPerPageOptions={[]}
        paginationComponentOptions={{
          noRowsPerPage: true,
        }}
      />
    </div>
  );
};

const styles = {
  viewBtn: {
    fontSize: "clamp(0.7rem, 2vw, 1.2rem)",
  }
}
export default HistoryList;