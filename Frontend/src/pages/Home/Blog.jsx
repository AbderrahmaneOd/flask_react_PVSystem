import { Card } from 'flowbite-react';
import React from 'react';

// motion
import { motion } from "framer-motion";
// variants
import { fadeIn } from "../../variants";

const Blog = () => {
    const blogs = [
        {id: 2, title: "Les utilisateurs ont la main pour personnaliser le prétraitement de leurs données.", image: "/src/assets/dash3.jpeg"},
        {id: 3, title: "Nous mettons à la disposition des utilisateurs des outils de visualisation pour faciliter leur processus décisionnel.", image: "/src/assets/dash2.jpeg"},
        {id: 4, title: "Nous offrons aux utilisateurs des modèles de prédiction performants pour les aider à prendre des décisions stratégiques et éclairées.", image: "/src/assets/dash1.jpeg"}
    ];
    return (
        <div  className='px-4 lg:px-14 max-w-screen-2xl mx-auto my-12' id='faq'>
            <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.6 }}
            
            className='text-center md:w-1/2 mx-auto'>
            <h2 className="text-4xl text-neutralDGrey font-semibold mb-4">Nos Solutions</h2>
           
            </motion.div>

            {/* all blogs */}
            <motion.div 
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.6 }}
            
            className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 items-center justify-between mt-16'>
                {
                    blogs.map( blog => <div key={blog.id} className='mx-auto relative mb-12 cursor-pointer'>
                       <img src={blog.image} alt="" className='mx-auto hover:scale-95 transition-all duration-300'  style={{ borderRadius: '10px', width: '350px', height: '350px' }}/>
                       
                        <div className='text-center px-4 py-8 bg-white shadow-lg rounded-md md:w-3/4 mx-auto absolute -bottom-12 left-0 right-0'>
                            <h3 className='mb-3 text-neutralGrey font-semibold'>{blog.title}</h3>
                            
                        </div>
                    </div>)
                }
            </motion.div>

        </div>
    );
};

export default Blog;