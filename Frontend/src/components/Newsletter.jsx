import React from "react";

// motion
import { motion } from "framer-motion";
// variants
import { fadeIn } from "../variants";

const Newsletter = () => {
  return (
    <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto bg-neutralSilver py-2">
      <motion.div 
    
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView={"show"}
      viewport={{ once: false, amount: 0.6 }}
      className="flex items-center justify-center lg:w-2/5 mx-auto">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Subscribe to our newsletter</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">Stay updated with our latest news and updates.</div>
            <form className="mt-4 flex flex-col sm:flex-row justify-center items-center">
              <input
                type="email"
                className="w-full sm:w-auto flex-1 appearance-none rounded-md py-2 px-4 mr-2 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your email address"
              />
              <button
                type="submit"
                className="mt-3 sm:mt-0 w-full sm:w-auto flex-shrink-0 inline-block bg-brandPrimary hover:bg-neutralDGrey text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Newsletter;
