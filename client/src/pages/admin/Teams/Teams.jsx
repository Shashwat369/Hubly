import React, { useState, useEffect } from "react";
import "./Teams.css";
import edit from "../../../assets/edit.png";
import trash from "../../../assets/trash.png";
import arrow from "../../../assets/arrow.png";

const Teams = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);

  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "team_member",
    password: "password123",
  });

  const API_URL = import.meta.env.VITE_API_URL + "/api";

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = loggedInUser?.role === "admin";


  const fetchTeam = async () => {
    try {
    const res = await fetch(`${API_URL}/users`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${loggedInUser?.token}`,
  },
});

if (!res.ok) {
  const err = await res.json();
  console.log("Server replied:", err);
  setLoading(false);
  return;
}


      const data = await res.json();

      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setTeam(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);


  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser?.token}`,
        },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        setShowModal(false);
        setNewMember({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          role: "team_member",
          password: "password123",
        });
        fetchTeam();
      } else {
        alert("Failed to add member");
      }
    } catch (err) {
      console.log("Add error:", err);
    }
  };


  const handleDelete = async (id, role) => {
    if (role === "admin") {
      alert("Admin cannot be deleted!");
      return;
    }

    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${loggedInUser?.token}`,
        },
      });

      fetchTeam();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };


  const openEditModal = (member) => {
    if (member.role === "admin") {
      alert("Admin cannot be edited!");
      return;
    }

    setSelectedMember(member);

    setNewMember({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      role: member.role,
      password: member.password,
    });

    setEditModal(true);
  };


  const handleEditMember = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/users/${selectedMember._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser?.token}`,
        },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        setEditModal(false);
        fetchTeam();
      } else {
        alert("Failed to update");
      }
    } catch (err) {
      console.log("Edit error:", err);
    }
  };

  const initials = (f, l) =>
    f ? (f[0] + (l ? l[0] : "")).toUpperCase() : "U";

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="team-wrapper">
      <h2 className="team-title">Team</h2>

      <div className="team-container">
        <table className="team-table">
          <thead>
            <tr>
              <th></th>
              <th>
                Full Name <img src={arrow} alt="up-down" />
              </th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {team.map((member) => (
              <tr key={member._id}>
                <td>
                  <div className="avatar-circle">
                    {initials(member.firstName, member.lastName)}
                  </div>
                </td>

                <td>{member.firstName + " " + member.lastName}</td>
                <td>{member.phone || "+1 (000) 000-0000"}</td>
                <td>{member.email}</td>

                <td className="role-tag">
                  {member.role === "admin" ? "Admin" : "Member"}
                </td>

                <td>
                  {isAdmin && member.role !== "admin" && (
                    <div className="action-btns">
                      <button
                        className="edit-btn"
                        onClick={() => openEditModal(member)}
                      >
                        <img src={edit} alt="edit" />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(member._id, member.role)}
                      >
                        <img src={trash} alt="delete" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD BUTTON — ADMIN ONLY */}
      {isAdmin && (
        <div className="add-btn-wrapper">
          <button
            className="add-member-btn"
            onClick={() => {
              setNewMember({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                role: "team_member",
                password: "password123",
              });
              setShowModal(true);
            }}
          >
            + Add Team Members
          </button>
        </div>
      )}

      {/* ADD MODAL */}
      {showModal && (
        <div className="team-modal-overlay">
          <div className="team-modal">
            <h3>Add New Team Member</h3>

            <form onSubmit={handleAddMember}>
              <div className="modal-row">
                <div className="modal-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={newMember.firstName}
                    onChange={(e) =>
                      setNewMember({ ...newMember, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="modal-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={newMember.lastName}
                    onChange={(e) =>
                      setNewMember({ ...newMember, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>

              <div className="modal-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                />
              </div>

              <div className="modal-group">
                <label>Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                >
                  <option value="team_member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="team-modal-overlay">
          <div className="team-modal">
            <h3>Edit Member</h3>

            <form onSubmit={handleEditMember}>
              <div className="modal-row">
                <div className="modal-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={newMember.firstName}
                    onChange={(e) =>
                      setNewMember({ ...newMember, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="modal-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={newMember.lastName}
                    onChange={(e) =>
                      setNewMember({ ...newMember, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                />
              </div>

              <div className="modal-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                />
              </div>

              <div className="modal-group">
                <label>Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) =>
                    setNewMember({ ...newMember, role: e.target.value })
                  }
                >
                  <option value="team_member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
