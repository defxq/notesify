import { Outlet } from "react-router";
import { notesApiSlice } from "../notes/notesApiSlice"; 
import store from "../../app/store";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import usePersists from "../../hooks/usePersists";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
// import { useGetUsersQuery, useLazyGetUsersQuery } from "../users/usersApiSlice";
// import { useGetNotesQuery, useLazyGetNotesQuery } from "../notes/notesApiSlice";


const Prefetch = () => {
    const [persist] = usePersists();
    const token = useSelector(selectCurrentToken);
//     const [triggerUsers] = useLazyGetUsersQuery();
//     const [triggerNotes] = useLazyGetNotesQuery();

//   useEffect(() => {
//     triggerUsers();
//     triggerNotes();
//   }, []);

    // useGetUsersQuery();
    // useGetNotesQuery();
    // useEffect(() => {
    //     // if no persist, but token, continue
    //     // if no token, but persist, the persistlogin wouldve handled it already, so dont mention persist anymore at this point
    //     if (!token) return; 
    //     // console.log('subscribing')
    //     const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
    //     const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

    //     return () => {
    //         notes.unsubscribe()
    //         users.unsubscribe()
    //     }
    // }, [persist, token])

    useEffect(() => {
        if (!token) return;
        store.dispatch(notesApiSlice.util.prefetch('getNotes', 'notesList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch