import { useParams } from "react-router";
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice";
import { PulseLoader } from "react-spinners";

const EditUser = () => {
    const { id } = useParams();
    const { user } = useGetUsersQuery("usersList", {
      selectFromResult: ({ data }) => ({
        user: data?.entities[id]
      })
    })

    if (!user) return <PulseLoader color={"#0015ffff"} />

    const content = <EditUserForm user={user}/>

  return content;
}
export default EditUser