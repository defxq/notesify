import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { ROLES } from "../../config/roles";
import toast from "react-hot-toast";

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/ 

const NewUserForm = () => {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();

    const navigate = useNavigate();
    const userRef = useRef();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(["Employee"]);


    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUsername("");
            setPassword("");
            setRoles([]);
            toast.success("New User created Successfully!");
            navigate("/dash/users")
        }
    }, [isSuccess, navigate]); // navigate in the dependencies just for the warning thing 
    
    const onUsernameChanged = (e) => setUsername(prev => e.target.value);
    const onPasswordChanged = (e) => setPassword(prev => e.target.value);

    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            option => option.value
        );
        setRoles(values);
    };

    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

    const onSaveUser = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({ username, password, roles });
        }
    };

    const options = Object.values(ROLES).map(role => (
        <option
            key={role}
            value={role}
        >
            {role}
        </option>
    ));

    if (isError) {
        console.log(error);
    }
    
    const content = (
        <>
            {isError ? <p className="errorMsg">Error: {error?.data?.message || error?.status || "An Error occured"}</p> : null}
            <form onSubmit={onSaveUser}>
                <div>
                    <h2>New User</h2>
                        <label htmlFor="username">
                            Username: <span className="nowrap">[3-20 letters]</span>
                        </label>
                    <div>
                        <input
                            className={`${username && !validUsername && "invalidUsername"}`}
                            type="text"
                            placeholder="username"
                            ref={userRef}
                            required
                            autoComplete="off"
                            id="username"
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
                            required
                            onChange={onPasswordChanged}
                            id="password"
                        />
                    </div>
                    <div>
                        <label htmlFor="roles">
                            Assigned Roles:
                        </label>
                        <select
                            id="roles"
                            // name="roles"
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
                    {isLoading ? "Creating.." : "Create"}</button>
                </div>
            </form>
        </>
    );

  return content;
}
export default NewUserForm