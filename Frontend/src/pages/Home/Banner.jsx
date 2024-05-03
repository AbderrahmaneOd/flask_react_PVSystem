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
              <img src={banner} alt=""style={{ marginLeft: '200px' }} />
            </div>
            <div className="md:w-1/2" >
              <h1 className="text-3xl mb-4 font-semibold text-neutralDGrey md:w-3/4 leading-snug text-justify ">Explorez Votre Énergie Solaire Sous un Nouveau Jour : <span className="text-brandPrimary leading-snug">Prétraitement Avancé, Prédiction, Visualisation</span></h1><br />
              <p className="text-neutralGrey text-base mb-8 text-justify"><b>De nombreuses données peuvent être suivies et surveillées dans le domaine de l'énergie solaire, mais quelles solutions évidentes déployer en premier lieu ? </b><br />La prédiction précise de la production d'énergie solaire, en particulier avec les fluctuations climatiques actuelles, est une nécessité. Cela impacte directement la planification des ressources, la maintenance des panneaux solaires, ainsi que la gestion de l'énergie produite. En anticipant les conditions météorologiques et en comprenant les tendances de production, nous pouvons optimiser nos opérations et améliorer notre rendement énergétique de manière significative.</p><br /><br />

              <Link to="/register">
                <button className="px-7 py-2 bg-brandPrimary text-white rounded hover:bg-neutralDGrey  block" style={{ marginLeft: '290px' }}>
                  S'inscrire
                </button>
              </Link>
            </div>
          </div>

        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
