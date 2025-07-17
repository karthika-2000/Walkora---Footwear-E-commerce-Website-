import { createBrowserRouter } from "react-router-dom";
import App from "../App";

import Signuppage from "./Signuppage";
import Login from "./Loginpage";
import AllProducts from "./products/Allproducts";
import Cart from "./products/Cart";
import Orderplacement from "./products/Orderplacement";
import UserAccount from "./products/Useraccount";
import ViewProduct from "./products/Viewproduct";
import AboutUs from "./Aboutuspage";
import ChangePassword from "./ChangePassword";
import PrivateRoute from "./PrivateRoute";



const router = createBrowserRouter([
    // {path : 'app', element: <App/>},
    {path : '/', element: <App/>},
    {path: 'signup', element: <Signuppage />},
    {path: 'login', element: <Login />},

    {path: 'allproducts', element:<PrivateRoute><AllProducts /></PrivateRoute> },
    {path: 'cart', element:<PrivateRoute> <Cart /></PrivateRoute>},
    {path: 'placeorder', element: <PrivateRoute><Orderplacement /></PrivateRoute>},
    {path: 'userprofile', element:<PrivateRoute><UserAccount /></PrivateRoute> },
    {path: 'viewproduct/:id', element: <PrivateRoute><ViewProduct /></PrivateRoute> },
    {path: 'aboutus', element: <PrivateRoute><AboutUs /></PrivateRoute> },
     { path: 'changepassword', element: <PrivateRoute><ChangePassword /></PrivateRoute> }


])

export default router;