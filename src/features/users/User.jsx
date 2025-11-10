import { useGetUsersQuery } from "./usersApiSlice"; 
import { useNavigate } from "react-router";
import { memo } from "react";

const User = ({ userId }) => {
    const navigate = useNavigate();
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({data}) => ({
            user: data?.entities[userId]
        })
    });

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`);
        const userRolesString = user.roles.join(", ");
        // conditional class checking user.active
        const cellStatus = user.active ? "" : "table_cell--inactive";

        return (
            <tr>
                <td className={cellStatus}>{user.username}</td>
                <td className={cellStatus}>{userRolesString}</td>
                <td className={cellStatus}>
                    <button onClick={handleEdit} className="edit-button">🖋️</button>
                </td>
            </tr>
        );
    } else return null;
}

const memoizedUser = memo(User);
export default memoizedUser