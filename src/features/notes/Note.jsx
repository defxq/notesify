import { useNavigate } from "react-router";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

const Note = ({ noteId }) => {
    const navigate = useNavigate();

    const { note }  = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        })
    });

    if (note) {
        const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/notes/${noteId}`);

        return (
            <tr>
                <td>
                    {note.completed ? 
                    <span>Completed</span> :
                    <span>Open</span>}
                </td>
                <td>
                    {created}
                </td>
                <td>
                    {updated}
                </td>
                <td>
                    {note.title}
                </td>
                <td>
                    {note.username}
                </td>
                <td>
                    <button onClick={handleEdit} className="edit-button">🖋️</button>
                </td>
            </tr>
        );
    } else return null;
}

const memoizedNote = memo(Note);
export default memoizedNote;