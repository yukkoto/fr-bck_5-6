import React, { useState, useEffect } from "react";
import { api } from "../../api";
import UsersList from "../../components/UsersList";
import UserModal from "../../components/UserModal";
import "./UsersPage.scss";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError("Не удалось загрузить пользователей");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingUser(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(user) {
    setEditingUser(user);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingUser(null);
  }

  async function handleSubmit(userData) {
    try {
      if (editingUser) {
        const updated = await api.updateUser(editingUser.id, userData);
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
      } else {
        const created = await api.createUser(userData);
        setUsers((prev) => [...prev, created]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Ошибка при сохранении:", err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Ошибка при удалении:", err);
    }
  }

  return (
    <div className="users-page">
      <div className="users-page__header">
        <h1 className="users-page__title">Управление пользователями</h1>
        <button className="btn btn--primary" onClick={handleOpenCreate}>
          + Добавить пользователя
        </button>
      </div>

      {loading && <p className="users-page__status">Загрузка...</p>}
      {error && <p className="users-page__status users-page__status--error">{error}</p>}

      {!loading && !error && (
        <UsersList
          users={users}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        editingUser={editingUser}
      />
    </div>
  );
}

export default UsersPage;
