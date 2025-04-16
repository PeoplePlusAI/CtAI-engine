import Icons from "../utils/Icon"
import CustomIcon from "./Icon"

function CustomLoader() {
  return (
         <div className="loader ">
                    <CustomIcon icon={Icons.ellipseIcon} />
                    <div className="ball">
                        <CustomIcon icon={Icons.ballIcon} />
                    </div>
                </div>
  )
}

export default CustomLoader
