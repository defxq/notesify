import { useLocation, useNavigate } from "react-router";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { username, status } = useAuth();

    const onGoHomeClicked = () => navigate("/dash");
    
    let goHomeButton = null;
    if (pathname !== "/dash") {
        goHomeButton = <button onClick={onGoHomeClicked}>
            🏠
        </button>
    }

    const content = <footer>
        <hr />
        {goHomeButton}
        <p>Current User: {username ? username : "Anonymous User"}</p>
        <p>Status: {status ? status : "Not logged in"}</p>
    </footer>;

  return content;
}
export default DashFooter