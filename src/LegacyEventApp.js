// import React, { useState } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LandingPage from "./pages/landingPage/landingPage";
// import HomePage from "./pages/home/HomePage";
// import MyEvents from "./pages/events/myEvent";
// import JoinEvent from "./pages/events/joinEvent";
// import eventBoard from "./pages/events/eventBoard";
// import about from "./pages/about/about";
// import services from "./pages/services/services";
// import contact from "./pages/contact/contact";
// import settings from "./pages/settings/settings";
// import profile from "./pages/profile/profile";
// import Login from "./pages/authenticate/login";
// import Signup from "./pages/authenticate/signup";
// import ProtectedRoute from "./utils/ProtectedRoute";
// // import dummyEvents from "./Dummy/dummy";
// import "./App.css";

// function App() {
//   const { userInfo } = useSelector((state) => state.userLogin);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/home"
//           element={userInfo ? <HomePage /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/myEvents"
//           element={userInfo ? <MyEvents /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/joinEvent/:roomId"
//           element={userInfo ? <JoinEvent /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LandingPage from "./pages/landingPage/landingPage";
import HomePage from "./pages/home/HomePage";
import MyEvents from "./pages/events/myEvent";
import JoinEvent from "./pages/events/joinEvent";
import EventBoard from "./pages/events/eventBoard";
import About from "./pages/about/about";
import Contact from "./pages/contact/contact";
import Profile from "./pages/profile/profile";
import Login from "./pages/authenticate/login";
import Signup from "./pages/authenticate/signup";
import ProtectedRoute from "./utils/ProtectedRoute";
// import dummyEvents from "./Dummy/dummy";
import "./App.css";

function App() {
  const { userInfo } = useSelector((state) => state.userLogin);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<ProtectedRoute element={HomePage} />} />
        <Route
          path="/join-event/:roomId"
          element={<ProtectedRoute element={JoinEvent} />}
        />
        <Route
          path="/my-event"
          element={<ProtectedRoute element={MyEvents} />}
        />
        <Route
          path="/event-board"
          element={<ProtectedRoute element={EventBoard} />}
        />
        <Route path="/about" element={<ProtectedRoute element={About} />} />

        <Route path="/contact" element={<ProtectedRoute element={Contact} />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
      </Routes>
    </Router>
  );
}

export default App;
