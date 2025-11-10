import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate  } from "react-router";
import { ROLES } from "../../config/roles";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/ 

// passing user in here means that you cant just reload,
const EditUserForm = ({ user }) => {

    const navigate = useNavigate();
    const [updateUser, {
        isSuccess,
        isLoading,
        isError,
        error
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isLoading: isDelLoading,
        isError: isDelError
    }] = useDeleteUserMutation();

    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);
    

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername("");
            setPassword("");
            setRoles([]);
            if (isDelSuccess) {
                toast.success("User deleted successfully");
            } else if (isSuccess) {
                toast.success("User updated successfully");
            }
            navigate("/dash/users")
        }
    }, [isSuccess, isDelSuccess, navigate]); 
    
    const onUsernameChanged = (e) => setUsername(prev => e.target.value);
    const onPasswordChanged = (e) => setPassword(prev => e.target.value);

    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            option => option.value
        );
        setRoles(values);
    };

    const onActiveChanged = () => setActive(prev => !prev);

    const onSaveUser = async (e) => {
        e.preventDefault();
        if (password) {
            await updateUser({ id: user._id, username, password, roles, active, });
        } else {
            await updateUser({ id: user._id, username, roles, active, });
        }
    };

    const onDeleteUser = async () => {
        await deleteUser({ id: user._id });
    };

    const options = Object.values(ROLES).map(role => (
        <option value={role} key={role}>
            {role}
        </option>
    ));

    let canSave;
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading;    
    }
const content = (
        <>
            <form onSubmit={onSaveUser}>
                <div>
                    <h2>Edit User</h2>
                        <label htmlFor="username">
                            Username: <span className="nowrap">[3-20 letters]</span>
                        </label>
                    <div>
                        <input
                            className={`${username && !validUsername && "invalidUsername"}`}
                            type="text"
                            placeholder="username"
                            required
                            autoComplete="off"
                            id="username"
                            value={username}
                            onChange={onUsernameChanged}
                            />
                    </div>
                        <label htmlFor="password">
                            Password: <span className="nowrap">[4-12 characters including !@#$%]</span>
                        </label>
                    <div>
                        <input
                            className={`${password && !validPassword && "invalidPassword"}`}
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={onPasswordChanged}
                            id="password"
                        />
                    </div>
                    <div>
                        <label htmlFor="active">Active:</label>
                        <input
                            type="checkbox"
                            id="active"
                            checked={active}
                            onChange={onActiveChanged}
                        />
                    </div>
                    <div>
                        <label htmlFor="roles">Assign Roles: (Hold ⌘ / Ctrl to select multiple)</label>
                        <br />
                        <select
                            className={`${!roles.length && "invalidRoles"}`}
                            id="roles"
                            name="roles"
                            onChange={onRolesChanged}
                            value={roles}
                            multiple={true}
                            size="3"
                        >
                            {options}
                        </select>
                    </div>
                    <button
                    disabled={!canSave}
                    type="submit">
                    {false ? "Saving.." : "Save"}</button>
                    <button
                    type="button"
                    disabled={isDelLoading}
                    onClick={onDeleteUser}
                    >
                        Delete</button>
                </div>
                </form>
        </>
    );




  return content;
}
export default EditUserForm