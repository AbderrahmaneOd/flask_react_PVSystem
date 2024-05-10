import React from "react";
import { Carousel } from "flowbite-react";

import banner from "../../assets/banner.png"

import { Link } from 'react-router-dom';


const Banner = () => {
  return (
    <div className=" bg-neutralSilver" id="home"><br /><br /><br /><br /><br /><br />
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto min-h-screen h-screen flex justify-center items-center">
        <Carousel className="w-full mx-auto">
          <div className="my-28 md:my-8 py-12 flex flex-col w-full mx-auto md:flex-row-reverse items-center justify-between gap-12">
            <div>
              <img src={banner} alt="" />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug">Explorez Votre Énergie Solaire: <span className="text-brandPrimary leading-snug">Prétraitement Avancé, Prédiction, Visualisation</span></h1>
              <p className="text-neutralGrey text-base mb-8">De nombreuses données peuvent être suivies et surveillées dans le domaine de l'énergie solaire, mais quelles solutions évidentes déployer en premier lieu ?</p>
              <button className="px-7 py-2 bg-brandPrimary text-white rounded hover:bg-neutralDGrey">S'inscrire</button>
            </div>
          </div>

        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
