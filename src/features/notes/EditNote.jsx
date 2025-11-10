import { useGetNotesQuery } from "./notesApiSlice"
import { useGetUsersQuery } from "../users/usersApiSlice"
import { useParams } from "react-router"
import useAuth from "../../hooks/useAuth"
import EditNoteForm from "./EditNoteForm"
import { PulseLoader } from "react-spinners"

const EditNote = () => {
    const { id } = useParams();
    const { id: currentUserId, isAdmin, isManager } = useAuth();

    const { users } = useGetUsersQuery("usersList", {
      selectFromResult: ({ data }) => ({
        users: data && Object.values(data?.entities)
      })
    });

    const { note } = useGetNotesQuery("notesList", {
      selectFromResult: ({ data }) => ({
        note: data?.entities[id]
      })
    });

    if (!note || !users?.length) return <PulseLoader color={"#00ff44ff"} />

    if (!isManager || !isAdmin) {
      if (note.user !== currentUserId) {
        return <p>No access...</p>
      }
    }
     
    const content = users && note ? <EditNoteForm users={users} note={note} /> : <p>Loading...</p>
  return content;
}
export default EditNote