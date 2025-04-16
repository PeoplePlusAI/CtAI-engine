import CustomButton from '../../../components/Button'
import CustomModal from '../../../components/Modal'

function IModal({ handleOpen, handleClose }) {
    return (
        <CustomModal
            show={handleOpen}
            handleClose={handleClose}
            header={false}
            footer={false}
        >
            <div>
                <p className='text-center title'> Welcome to City AI Engine!</p>
            </div>
            <p className='fs-6 fw-bold iModalText'>
                City AI Engine analyzes urban environments by assessing
                footpath conditions, accessibility,
                and overall infrastructure quality using AI-powered image and location data.
            </p>
            <p className='fw-bold iModalText'>How to Use the App</p>

            <div className='ps-3'>
                <p className=' fs-6 iModalText'>
                    Upload or Capture a Footpath Image
                    Click "Drop file or Browse" to upload an image.
                    Or click "Open Camera & Take Photo" to capture one directly.
                    Set Location
                </p>
                <p className=' fs-6 iModalText'>
                    Click "Get my Current Location" or manually select a location on the map.
                    Submit for AI Analysis
                </p>
                <p className=' fs-6 iModalText'>
                    Click "Submit" to process the image and location data.
                    View AI Analysis & Recommendations
                </p>

                <p className=' fs-6 iModalText'>
                    Get a condition score (1-5) based on safety, accessibility, and usability.
                    Identify issues like obstructions, surface damage, or poor infrastructure.
                    Read AI-generated recommendations for improvements.
                    Visualize on Map
                </p>
                <p className=' fs-6 iModalText'>
                    See analyzed locations and scores on the interactive map.
                    Click a marker to view issues, scores, and suggested actions.
                    This AI-powered tool helps enhance urban planning and infrastructure decision-making! 🚀
                </p>

                <div>
                    <CustomButton variant="success" className="w-100" onClick={handleClose}>
                        Close
                    </CustomButton>
                </div>

            </div>

        </CustomModal>
    )
}

export default IModal
