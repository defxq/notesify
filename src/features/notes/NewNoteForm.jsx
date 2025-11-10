import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAddNewNoteMutation } from "./notesApiSlice";
import toast from "react-hot-toast";

// user, title, text
const NewNoteForm = ({ users }) => {
    const titleRef = useRef();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const firstUser = users.length ? users[0].username : "";
    const [owner, setOwner] = useState(firstUser);
    const [addNewNote, { isLoading, isError, error, isSuccess }] = useAddNewNoteMutation();

    useEffect(() => {
        titleRef.current.focus();
    }, []);
    
    useEffect(() => {
        if (isSuccess) {
            setTitle("");
            setText("");
            setOwner([]);
            toast.success("New note created successfully!");
            navigate("/dash/notes");
        }
    }, [isSuccess, navigate]);

    const onTitleChanged = (e) => setTitle(prev => e.target.value);
    const onTextChanged = (e) => setText(prev => e.target.value);

    const onOwnerChanged = (e) => {
        setOwner(e.target.value);
    };

    const options = users.length ? users.map(user => (
        <option value={user.username} key={user.id}>
            {user.username}
        </option>
    )) : null;

    const canSave = [owner, title, text].every(Boolean);

    const handleNewNote = async (e) => {
        e.preventDefault();
        const userId = users.find(user => user.username === owner).id;
        if (canSave) {
            await addNewNote({ user: userId, title, text });
        }
    };

    const content = (
        <div>
            {isError ? <p>Error: {error?.data?.message || error?.status || "An Error Occured"}</p> : null}
            <form onSubmit={handleNewNote}>
                <div>
                    <label htmlFor="title">Title: </label>
                    <input
                        id="title"
                        ref={titleRef}
                        type="text"
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
                <button
                    disabled={isLoading}
                    type="submit"
                >
                    {isLoading ? "Adding..." : "Add"}
                </button>
            </form>
        </div>
    );

  return content;
}
export default NewNoteForm