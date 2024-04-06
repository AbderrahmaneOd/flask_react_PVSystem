import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import config from "../config.json";
const Newsletter = () => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      nom: nom,
      prenom: prenom,
      email: email,
      subject: subject,
      message_body: message
    };

    try {
      const response = await fetch(`${config.apiUrl}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Email envoyé avec succès");
        setNom("");
        setPrenom("");
        setEmail("");
        setMessage("");
      } else {
        const errorMessage = await response.text();
        alert(`Une erreur s'est produite : ${errorMessage}`);
      }
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      alert("Une erreur s'est produite lors de l'envoi de l'email");
    }
  };

  return (
    <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto bg-neutralSilver py-2">
      <motion.div 
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView={"show"}
        viewport={{ once: false, amount: 0.6 }}
        className="flex items-center justify-center lg:w-2/5 mx-auto"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Contactez-nous</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              Vos retours et réclamations sont extrêmement précieux pour nous. Ils nous aident à identifier les domaines de notre service qui pourraient nécessiter des améliorations. Si vous rencontrez un bug ou si quelque chose n'est pas clair, n'hésitez pas à nous laisser un message.
            </div>
            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="flex flex-wrap">
                <div className="w-full sm:w-1/2 px-3 mb-6">
                  <input
                    type="text"
                    placeholder="Nom"
                    className="border-2 border-gray-200 rounded-md py-2 px-4 w-full focus:outline-none focus:border-brandPrimary"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-1/2 px-3 mb-6">
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="border-2 border-gray-200 rounded-md py-2 px-4 w-full focus:outline-none focus:border-brandPrimary"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full px-3 mb-6">
              <input
                    type="email"
                    placeholder="Votre email"
                    className="border-2 border-gray-200 rounded-md py-2 px-4 w-full focus:outline-none focus:border-brandPrimary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
              </div>

              <div className="w-full px-3 mb-6">
              <input
                    type="text"
                    placeholder="Sujet du message"
                    className="border-2 border-gray-200 rounded-md py-2 px-4 w-full focus:outline-none focus:border-brandPrimary"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
              </div>
              <div className="w-full px-3 mb-6">
                <textarea
                  placeholder="Corps du message"
                  className="border-2 border-gray-200 rounded-md py-2 px-4 w-full h-32 resize-none focus:outline-none focus:border-brandPrimary"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="w-full px-3 mb-6">
                <button
                  type="submit"
                  className="w-full bg-brandPrimary hover:bg-neutralDGrey text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Newsletter;
