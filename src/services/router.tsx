import { Route, Routes } from "react-router";
import Home from "../pages/Home/Home";
// import KenoPage from "../../KenoPage/KenoPage";
// import PrivateRoute from '../../../../Services/privateRouter';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/login" element={<Login pageName={"/login"} />}/> */}
      {/* <Route exact path='/menu' element={<PrivateRoute/>}>
                <Route exact path='/menu' element={<Menu pageName={"/menu"}/>}/>
            </Route> */}
      <Route
        path="*"
        element={
          <h1 style={{ marginTop: "64px", textAlign: "center" }}>
            Under Construction
          </h1>
        }
      />
    </Routes>
  );
};

export default Router;
