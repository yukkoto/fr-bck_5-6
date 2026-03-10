import React, { useState, useEffect } from "react";

function UserModal({ isOpen, onClose, onSubmit, editingUser }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setAge(String(editingUser.age));
    } else {
      setName("");
      setAge("");
    }
    setErrors({});
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  function validate() {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Имя обязательно";
    if (!age) {
      newErrors.age = "Возраст обязателен";
    } else if (isNaN(Number(age)) || Number(age) < 0) {
      newErrors.age = "Введите корректный возраст";
    }
    return newErrors;
  }

  function handleSubmit() {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ name: name.trim(), age: Number(age) });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal__title">
          {editingUser ? "Редактировать пользователя" : "Новый пользователь"}
        </h2>

        <div className="modal__field">
          <label className="modal__label">Имя</label>
          <input
            className={`modal__input ${errors.name ? "modal__input--error" : ""}`}
            type="text"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="modal__error">{errors.name}</span>}
        </div>

        <div className="modal__field">
          <label className="modal__label">Возраст</label>
          <input
            className={`modal__input ${errors.age ? "modal__input--error" : ""}`}
            type="number"
            placeholder="Введите возраст"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="0"
          />
          {errors.age && <span className="modal__error">{errors.age}</span>}
        </div>

        <div className="modal__buttons">
          <button className="btn btn--primary" onClick={handleSubmit}>
            {editingUser ? "Сохранить" : "Создать"}
          </button>
          <button className="btn btn--cancel" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
