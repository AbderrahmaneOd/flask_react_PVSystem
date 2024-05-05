import React from "react";
import aboutImg from "../../assets/about.png";
import { Link } from 'react-router-dom';

// motion
import { motion } from "framer-motion";
// variants
import { fadeIn } from "../../variants";


const About = () => {
  return (
    <div>
      {/* about text */}
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-8" id="about">
        <div className="md:w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.6 }}
          >
            <img src={aboutImg} alt="" className="w-full" />
          </motion.div>
          <motion.div
            variants={fadeIn("left", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.5 }}
            className="md:w-3/5 mx-auto"
            >
            <h2 className="text-4xl text-neutralDGrey font-semibold mb-4 md:w-4/5 text-justify">
            Plateforme  Intégrée pour la Prédiction et la Visualisation de l'Énergie Solaire
            </h2>
            <p className="md:w-3/4 text-sm text-neutralGrey mb-8 text-justify">
              Notre solution offre une plateforme intégrée permettant l'importation efficace des données, suivie d'un prétraitement avancé des données, réalisable en temps réel ou en mode hors ligne. Nous nous spécialisons dans la prédiction précise de l'énergie solaire, fournissant des analyses pertinentes et des visualisations percutantes pour faciliter la prise de décision. De plus, notre système génère automatiquement des rapports détaillés pour chaque opération, offrant une transparence et une traçabilité complètes tout au long du processus. Avec notre solution, optimisez vos opérations énergétiques avec confiance et efficacité.
            </p>
            <Link to="/register">
                <button className="px-7 py-2 bg-brandPrimary text-white rounded hover:bg-neutralDGrey block" style={{ marginLeft: '230px' }}>
                EN SAVOIR +               
                </button>
              </Link>
          </motion.div>
        </div>
      </div>

      {/* company stats */}
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.7 }}
        className="px-4 lg:px-14 max-w-screen-2xl mx-auto bg-neutralSilver py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="md:w-1/2">
            <h2 className="text-4xl text-neutralDGrey font-semibold mb-2 md:w-2/3">
            L'Allié Incontournable dans la   <br /> <span className="text-brandPrimary">Révolution Énergétique</span>
            </h2>
          </div>

          {/* stats */}
          <div className="md:w-1/2 mx-auto flex sm:flex-row flex-col sm:items-center justify-around gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <img src="/src/assets/icons/group.png" alt="" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">4</h4>
                  <p>Chercheurs</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
              <img src="/src/assets/icons/developpement-web.png" alt="" width="60" height="60" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">3</h4>
                  <p>Développeurs</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
              <img src="/src/assets/icons/ai.png" alt="" width="50" height="50" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">9</h4>
                  <p>Mdèles d'intelligence artificielle</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
              <img src="/src/assets/icons/panneaux-solaires.png" alt="" width="50" height="50" />
                <div>
                  <h4 className="text-2xl text-neutralDGrey font-semibold">22</h4>
                  <p>Panneaux solaires</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default About;
