
import { useNavigate } from "react-router-dom";

interface userListType {
  data: {
    firstname: string;
    lastname: string;
    username: string;
  }[];
  username: string;
}

function UserList({ data, username }: userListType) {
  const navigate = useNavigate()
  return (
    <ul>
      {data.map((x) => {
        return x.username != username ? (
          <li className="items-center flex justify-between border-b-2 border-gray-300 py-3 px-5 hover:bg-gray-200 rounded-md">
            <h2 className="">{x.username}</h2>
            <button
              onClick={() => {
                navigate(`/send?from=${username}&to=${x.username}`)
              }}
              className="rounded-md bg-blue-400 py-2 px-3 "
            >
              Send
            </button>
          </li>
        ) : null;
      })}
    </ul>
  );
}

export default UserList;
