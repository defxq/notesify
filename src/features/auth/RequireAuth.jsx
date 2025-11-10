import useAuth from "../../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router";

const RequireAuth = ({ allowedRoles }) => {
    const { roles, status } = useAuth();
    const location = useLocation();
    if (!status) {
        return <Outlet />
    }
    const content = roles.some(role => allowedRoles.includes(role))
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;

    return content;
}
export default RequireAuth