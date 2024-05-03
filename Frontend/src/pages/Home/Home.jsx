import About from "./About";
import Blog from "./Blog";
import Footer from "./Footer";
import Banner from "./Banner";
import Navbar from "./Navbar";
import Newsletter from "./Newsletter";
import Product from "./Product";
import Services from "./Services";

function Home() {

    return (
        <>
        
          <Navbar />
          <Banner/>
          {/*<Services/>*/}
          <About/>
          {/*<Product/>*/}
          <Blog/>
          <Newsletter/>          
          <Footer/>
        </>
      );
}

export default Home;