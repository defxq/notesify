import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";


// user, title, text
const EditNoteForm = ({ users, note }) => {
    const { isAdmin, isManager } = useAuth();
    const [updateNote, {
        isSuccess,
        isError,
        isLoading,
        error
    }] = useUpdateNoteMutation();


    const [deleteNote, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        isLoading: isDelLoading,
        error: delError
    }] = useDeleteNoteMutation();

    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [owner, setOwner] = useState(note.username);
    const [completed, setCompleted] = useState(note.completed);
    
    const titleRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        titleRef.current.focus();
    }, []);
    
    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle("");
            setText("");
            setOwner([]);
            if (isSuccess) {
                toast.success("Note updated successfully!");
            } else if (isDelSuccess) {
                toast.success("Note deleted successfully!");
            }
            navigate("/dash/notes");
        }
    }, [isSuccess, isDelSuccess, navigate]);

    const onTitleChanged = (e) => setTitle(prev => e.target.value);
    const onTextChanged = (e) => setText(prev => e.target.value);

    const onOwnerChanged = (e) => {
        setOwner(e.target.value);
    };

    const onCompletedChanged = () => setCompleted(prev => !prev);

    const options = users.length ? users.map(user => (
        <option value={user.username} key={user.id}>
            {user.username}
        </option>
    )) : null;

    const canSave = [owner, title, text].every(Boolean);

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        const userId = users.find(user => user.username === owner).id;
        if (canSave) {
            await updateNote({ id: note._id, user: userId, title, text, completed});
        }
    };

    const handleDeleteNote = async () => {
        await deleteNote({ id: note.id });
    };

    const created = new Date(note.createdAt).toLocaleString('en-US', {
        month: 'long',     // January, February, etc.
        day: 'numeric',    // 1, 2, 3...
        hour: 'numeric',   // 1, 2, 3...
        minute: '2-digit', // 01, 02...
        hour12: true       // AM/PM format
    });

    const updated = new Date(note.updatedAt).toLocaleString('en-US', {
        month: 'long',     // January, February, etc.
        day: 'numeric',    // 1, 2, 3...
        hour: 'numeric',   // 1, 2, 3...
        minute: '2-digit', // 01, 02...
        hour12: true       // AM/PM format
    });
    let deleteButton;
    if (isAdmin || isManager) {
    deleteButton = <button
                        disabled={isDelLoading}
                        type="button"
                        onClick={handleDeleteNote}
                    >
                    {isDelLoading ? "Deleting..." : "Delete"}
                    </button>;
    }

    const content = (
        <div>
            {isError ? <p>Error: {error?.data?.message || error?.status || "An Error Occured"}</p> : null}
            <form onSubmit={handleUpdateNote}>
                <h2>Edit Note #{note.ticket}</h2>
                <div>
                    Created At: {created}
                    <br />
                    Updated At: {updated}
                </div>
                <br />
                <div>
                    <label htmlFor="title">Title: </label>
                    <input
                        id="title"
                        type="text"
                        ref={titleRef}
                        value={title}
                        autoComplete="off"
                        required
                        placeholder="Title"
                        onChange={onTitleChanged}
                    />
                </div>
                <div>
                    <label htmlFor="text">Text: </label>
                    <br />
                    <textarea
                        id="text"
                        type="text"
                        autoComplete="off"
                        required
                        value={text}
                        placeholder="Text details..."
                        onChange={onTextChanged}
                    >
                    </textarea>
                </div>
                <div>
                    <label htmlFor="owner">Assigned to: </label>
                    <select
                        id="owner"
                        value={owner}
                        onChange={onOwnerChanged}
                    >
                        {options}
                    </select>
                </div>
                <div>
                    <label htmlFor="completed">Completed: </label>
                    <input
                        type="checkbox" 
                        id="completed"
                        checked={completed}
                        onChange={onCompletedChanged}
                    />
                </div>
                <button
                    disabled={isLoading}
                    type="submit"
                >
                    {isLoading ? "Saving..." : "Save"}
                </button>
                {deleteButton}
            </form>
        </div>
    );

  return content;
}
export default EditNoteForm