import Notes from "./Note";
import { useGetNotesQuery } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";

const NotesList = () => {
  const { username, isManager, isAdmin } = useAuth();

  const {
    data: notes,
    isError,
    isSuccess,
    isLoading,
    error
  } = useGetNotesQuery("notesList", {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
  });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>
  }
  if (isError) {
    content = <p>{error?.data?.message}</p>
  }
  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
    } else {
      filteredIds = ids.filter(noteId => entities[noteId].username === username);
    }

    const tableContent = ids && filteredIds.map(id => (
      <Notes key={id} noteId={id} />
    ));

    content = (
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Title</th>
            <th>Owner</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    );
  }

  return content;
}
export default NotesList