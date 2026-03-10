import React from "react";

function UserItem({ user, onEdit, onDelete }) {
  return (
    <div className="user-card">
      <div className="user-card__info">
        <h3 className="user-card__name">{user.name}</h3>
        <p className="user-card__age">Возраст: {user.age}</p>
        <p className="user-card__id">ID: {user.id}</p>
      </div>
      <div className="user-card__actions">
        <button className="btn btn--edit" onClick={() => onEdit(user)}>
          Редактировать
        </button>
        <button className="btn btn--delete" onClick={() => onDelete(user.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}

export default UserItem;
