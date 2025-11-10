import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";


const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    let isAdmin = false;
    let isManager = false;
    let status;

    if (token) {
        const decoded = jwtDecode(token);
        const { username, roles, id } = decoded.UserInfo;
        isManager = roles.includes("Manager");
        isAdmin = roles.includes("Admin");
        let status = "Employee";
        if (isManager) status = "Manager";
        if (isAdmin) status = "Admin";
        
        return { roles, username, isManager, isAdmin, status, id };
    }

    

  return {roles: [], username: "", isManager, status, isAdmin};
}
export default useAuth