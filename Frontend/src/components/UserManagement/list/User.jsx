import config from "../../../config.json";
import { useEffect, useState } from "react";
import axios from "axios";
import "./User.css";
import { useParams, useNavigate } from "react-router-dom";

const User = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    roles: [],
  });

  useEffect(() => {
    if (username && username !== "new") {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token'); // Récupérer le token d'authentification depuis le localStorage
          const { data } = await axios.get(`${config.apiUrl}/users/${username}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(data);
        } catch (error) {
          console.error("Error:", error);
        }
      };
      fetchUser();
    }
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const { name, checked } = e.target;
    setUser((prevState) => ({
      ...prevState,
      roles: checked
        ? [...prevState.roles, name] // Add role to array if checked
        : prevState.roles.filter((role) => role !== name), // Remove role from array if unchecked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Récupérer le token d'authentification depuis le localStorage
      if (username === "new") {
        await axios.post(`${config.apiUrl}/users`, user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put(`${config.apiUrl}/users/${username}`, user, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate("/users");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="post__wrapper">
      <div className="container">
        <form className="post">
          {/* Input fields for user details */}
          <input
            type="text"
            placeholder="Nom d'utilisateur..."
            name="username"
            value={user.username}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Nom..."
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Prénom..."
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
          />

          <input
            type="text"
            placeholder="Email..."
            name="email"
            value={user.email}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Phone..."
            name="phone"
            value={user.phone}
            onChange={handleChange}
          />

          {/* Checkboxes for user roles */}
          <div className="roles">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="admin"
                checked={user.roles.includes("admin")}
                onChange={handleRoleChange}
              />
              <span className="checkmark"></span>
              <span className="label">Admin</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="responsableAi"
                checked={user.roles.includes("responsableAi")}
                onChange={handleRoleChange}
              />
              <span className="checkmark"></span>
              <span className="label">Gestionnaire IA </span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="researcher"
                checked={user.roles.includes("researcher")}
                onChange={handleRoleChange}
              />
              <span className="checkmark"></span>
              <span className="label">Chercheur</span>
            </label>
            {/* Add more checkboxes for other roles as needed */}
          </div>

          <input
            type="password"
            placeholder="Mot de passe..."
            name="password"
            value={user.password}
            onChange={handleChange}
          />
          {/* Button to submit form */}
          <button onClick={handleSubmit} className="btn btn-primary">
            {username === "new" ? "Créer l'utilisateur" : "Mettre à jour l'utilisateur"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default User;
