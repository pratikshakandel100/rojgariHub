// import { useState } from 'react'

// // import Homepage from './pages/Homepage.jsx';
// import Homepage from './pages/HomePage';
// import SignIn from './pages/Signin.jsx';
// function App() {

//   return (
//    <>
//     <SignIn/>
//    </>
//   )
// }

// export default App;
// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Joblist from "./pages/Joblist"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/jobs" element={<Joblist/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;

