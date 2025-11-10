import { PulseLoader } from "react-spinners";
import User from "./User";
import { useGetUsersQuery } from "./usersApiSlice";

const UsersList = () => {


  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetUsersQuery("usersList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
  });

  let content;
  if (isLoading) {
    content = <PulseLoader color={"#00ff44ff"} />
  }
  if (isError) {
    content = <p>{error?.data?.message}</p>
  }
  if (isSuccess) {
    const { ids } = users;

    const tableContent = ids?.length ? ids.map(id => (
      <User key={id} userId={id} />
    )) : null;

    content = (
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Roles</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
    ); 
  }

  return <>
    {content}
  </>;
}
export default UsersList