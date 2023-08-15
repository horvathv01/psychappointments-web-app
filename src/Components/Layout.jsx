import Footer from "./Footer";
import NavBar from "./NavBar";


export default function Layout({children}){


    return(
        <div>
            <div>
                <NavBar />
                {children}
                <Footer />
            </div>
        </div>
    )
}