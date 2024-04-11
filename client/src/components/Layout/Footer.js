import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footer">
      <p className="text-center">Get your medicines at your door steps!</p>
      <h6 className="text-center mt-3">
        {/* <Link to="/about">About</Link> */}
        
        <Link to="/contact" className="contact"> 📲Contact Us</Link>
        <Link to="https://www.google.com/maps/place/SRI+KUMARAN+MEDICALS/@11.1481886,77.3279206,15z/data=!3m1!4b1!4m6!3m5!1s0x3ba907091a6c2737:0x866e27c5972adbb1!8m2!3d11.1481681!4d77.3463747!16s%2Fg%2F11rzcqm7fb?entry=ttu" className="contact"> 📌 Navigate to our Shop</Link>
      </h6>
    </div>
  );
};

export default Footer;