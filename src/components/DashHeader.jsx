import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import toast from "react-hot-toast";
import apiSlice from "../app/api/apiSlice";
import { useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;

const DashHeader = () => {
  const { status, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const [triggerLogout, {
    isLoading: logoutLoading,
    isSuccess: logoutSuccess,
    isError: logoutError,
    error: logoutErr
  }] = useSendLogoutMutation();

  useEffect(() => {
    if (logoutSuccess) {
      toast.success("Logged out");
      navigate("/");
      // dispatch(apiSlice.util.resetApiState());
    }
  }, [logoutSuccess, navigate]);
  
  // const handleLogout = () => triggerLogout();
  
  const handleLogout = () => {
    localStorage.clear();
    triggerLogout();
  }
  const onUsersClicked = () => navigate("/dash/users");
  const onNotesClicked = () => navigate("/dash/notes");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onNewNoteClicked = () => navigate("/dash/notes/new");


  if (logoutLoading) return <p>Logging out...</p>;
  // idk whether the thrown error and this error has the same thing? 
  // just check which one has the 'originalStatus' i guess... :'(
  if (logoutError) return <p>Error: {logoutErr?.data?.message}</p>;

  let dashClass;
  // its not in /dash and not in users and in notes, so its only /new and /:id
  if (!DASH_REGEX.test(pathname) && !USERS_REGEX.test(pathname) && !NOTES_REGEX.test(pathname)) {
    dashClass = "dashboard";
  }

  // /dash/users
  // /dahs/notes
  // /dash/users/new
  // /dash/notes/new



  let usersButton;
  let newUserButton;
  if (isAdmin || isManager) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      usersButton = (
        <button
          title="Users"
          onClick={onUsersClicked}
        >
          Users
        </button>
      );
    }

    if (USERS_REGEX.test(pathname)) {
      newUserButton = (
        <button
          title="New User"
          onClick={onNewUserClicked}
        >
          Add New User
        </button>
      )
    }
  }
  
  let notesButton;
  let newNoteButton;
  
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button
        title="Notes"
        onClick={onNotesClicked}
      >
        Notes
      </button>
    )
  }
  
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        title="New Note"
        onClick={onNewNoteClicked}
      >
        New Note
      </button>
    )
  }
  let logoutButton;
  if (status) {
    logoutButton = (
      <button
        title="Logout"
        onClick={handleLogout}
      >
        ◇Logout◇
      </button>
    );
  }
  let buttonsList;
  if (logoutLoading) {
    buttonsList = <p>Logging out...</p>
  } else {
    buttonsList = (
      <>
        {newNoteButton}
        {notesButton}
        {usersButton}
        {newUserButton}
        {logoutButton}
      </>
    );
  }
  
  return (
    <>
      <p>{logoutErr?.data?.message}</p>
        <header>
              <Link to="/dash">
                  <h1>techNotes</h1>
              </Link>
            <div className={dashClass}>
                <nav>

                  {buttonsList}

                </nav>
            </div>
        </header>
        <hr />
    </>
  )
}
export default DashHeader