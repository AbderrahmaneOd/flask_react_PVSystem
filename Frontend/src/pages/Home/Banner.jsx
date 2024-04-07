import React from "react";
import { Carousel } from "flowbite-react";

import banner from "../../assets/banner.png"



const Banner = () => {
  return (
    <div className=" bg-neutralSilver" id="home">
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-screen h-screen flex justify-center items-center">
        <Carousel className="w-full mx-auto">
          <div className="my-28 md:my-8 py-12 flex flex-col w-full mx-auto md:flex-row-reverse items-center justify-between gap-12">
          <div>
            <img src={banner} alt=""/>
           </div>
            {/* hero text */}
           <div className="md:w-1/2">
            <h1 className="text-3xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug">Empowering Solar Futures: <span className="text-brandPrimary leading-snug">Data Analysis, Prediction, Understanding</span></h1>
            <p className="text-neutralGrey text-base mb-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit?</p>
            <button className="px-7 py-2 bg-brandPrimary text-white rounded hover:bg-neutralDGrey">Register</button>
           </div>
          </div>
          
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
