import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout title={'Contact Us'} >
      <div className="row contactus ">
        {/* <div className="col-md "> */}
          {/* <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          /> */}
        {/* </div> */}
        <div className="col-md">
          <h2 className="  text-center">CONTACT US</h2>
          <p className="text-justify mt-2">
        If there is any query or issues regarding the products ,feel free to ask!
          </p>
          <p className="mt-3">
            <BiMailSend /> : srikumaranmedicals@gmail.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> : 012-3456789
          </p>
          <p className="mt-3">
            <BiSupport /> : 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;