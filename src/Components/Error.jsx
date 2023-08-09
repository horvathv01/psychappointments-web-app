import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

export default function Error(){
    const navigate = useNavigate();

    return(
        <div>
            <div>
                <NavBar />
            </div>
            <div>
                <h1>Something went wrong.</h1>
                <button onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    )
}