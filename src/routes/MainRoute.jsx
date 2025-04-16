import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react"
import CityIndex from "../views/cityAI/CityIndex"
import Map from "../views/cityAI/Map"
import PlaceDet from "../views/cityAI/PlaceDet"
import Aianalysis from "../views/cityAI/AIanalysis"
import Error from "../views/common/Error";

const Visualization = lazy(() => import("../views/cityAI/Visualization"))
function MainRoute() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CityIndex />} />
        <Route path='/map' element={<Map />} />
        <Route path='/placeDetails' element={<PlaceDet />} />
        <Route path='/visual' element={
          <Suspense fallback={<div>Loading...</div>}>
            <Visualization />
          </Suspense>
        } />
        <Route path='/aiAnalysis' element={<Aianalysis />} />
        <Route path='*' element={<Error/>} />
      </Routes>
    </Router>
  )
}

export default MainRoute