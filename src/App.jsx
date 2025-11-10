import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Public from "./pages/Public";
import UsersList from "./features/users/UsersList";
import NotesList from "./features/notes/NotesList";
import Welcome from "./features/auth/Welcome";
import Missing from "./components/Missing";
import DashLayout from "./components/DashLayout";
import Login from "./features/auth/Login";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import { ROLES } from "./config/roles";
import RequireAuth from "./features/auth/RequireAuth";
import useTitle from "./hooks/useTitle";


const App = () => {
  useTitle("Notesify")
  return (
    <div>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Public /> } />
                <Route path="login" element={<Login /> } />

                {/* Dash-protected */}
                <Route element={<PersistLogin />}>
                  <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                    <Route element={<Prefetch />}>
                      <Route path="dash" element={<DashLayout />} >

                        <Route index element={<Welcome />} />

                        {/* users */}
                        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />}>
                          <Route path="users">
                            <Route index element={<UsersList />} />
                            <Route path=":id" element={<EditUser />} />
                            <Route path="new" element={<NewUserForm />} />
                          </Route>
                        </Route> 

                        {/* notes */}
                        <Route path="notes">
                          <Route index element={<NotesList />} />
                          <Route path="notes" element={<NotesList />} />
                          <Route path=":id" element={<EditNote />} />
                          <Route path="new" element={<NewNote />} />
                        </Route>

                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<Missing />} />
            </Route>
        </Routes>
    </div>
  )
}
export default App