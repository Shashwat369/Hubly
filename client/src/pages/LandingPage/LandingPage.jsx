import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Brand from "../../components/Brands/Brand";
import Feature from "../../components/Features/Feature";
import Pricing from "../../components/Pricing/Pricing";
import Footer from "../../components/Footer/Footer";
import "./LandingPage.css"
import ChatWidget from "../../components/Chatbot/ChatWidget";
const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero/>
      <Brand />
      <Feature/>
      <Pricing/>
      <Footer/>
      <ChatWidget/>

   
    </>
  );
};

export default LandingPage;
