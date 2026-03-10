import React from "react";
import UserItem from "./UserItem";

function UsersList({ users, onEdit, onDelete }) {
  if (!users.length) {
    return <p className="users-list__empty">Пользователей пока нет.</p>;
  }

  return (
    <div className="users-list">
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default UsersList;
