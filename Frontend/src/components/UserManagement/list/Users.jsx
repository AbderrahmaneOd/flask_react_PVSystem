import config from "../../../config.json";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Users.css";
import useAuth from "../../../hooks/useAuth";

const Users = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${config.apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (username) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.apiUrl}/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter((user) => user.username !== username));
      setShowModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const confirmDelete = (username) => {
    setUserToDelete(username);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUserToDelete(null);
  };

  return (
    <div className="posts">
      <div className="container">
        {isAdmin && (
          <button
            onClick={() => navigate("/user/new")}
            className="btn btn-primary mb-4"
          >
            Nouvel Utilisateur         
             </button>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Nom d'utilisateur</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôles</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username}>
                <td>{user.username}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.roles.join(', ')}</td>
                <td>
                  <button
                    onClick={() => navigate(`/user/${user.username}`)}
                    className="btn  btn-info btn-update"
                  >
                    Modifier
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => confirmDelete(user.username)}
                      className="btn btn-danger btn-delete"
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <p>Etes-vous sûr de vouloir supprimer cet utilisateur ?</p>
              <div>
                <button onClick={() => handleDelete(userToDelete)}>Oui</button>
                <button onClick={closeModal}>Non</button>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default Users;
