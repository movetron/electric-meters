import React, { useState, useEffect } from "react";
import { Garage } from "../types/types";
import PaymentModal from "./PaymentModal";

interface GarageViewProps {
  garages: Garage[];
  onToggle: (id: number) => void;
  onSearch: (id: number) => void;
  onEdit: (garage: Garage) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
  onCheckReadings: () => void;
  isAuthenticated: boolean;
  user: { username: string; role: string } | null;
  onLogout: () => void;
}

const GarageView: React.FC<GarageViewProps> = ({
  garages,
  onToggle,
  onSearch,
  onEdit,
  onDelete,
  onCreate,
  onCheckReadings,
  isAuthenticated,
  user,
  onLogout,
}) => {
  const [searchId, setSearchId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGarageId, setSelectedGarageId] = useState<number>();
const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);

//   const [energy, setEnergy] = useState<string>("");
//   const [balance, setBalance] = useState<string>("");
  const handleEdit = (garage: Garage) => {
    setSelectedGarage(garage);
    setIsModalOpen(true);
  };
useEffect(() => {
  console.log("UI обновился", garages); // ← Проверяем, когда и как обновляется UI
}, [garages]);
  const handleAddGarage = () => {
    onCreate(); // Открываем модалку, а не делаем fetch напрямую
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchId(value);
 console.log("Введённое значение для поиска:", value);
    if (value === '') {
        onSearch(NaN); // или обработайте как отдельный случай
    } else {
         const id = Number(value);
    console.log("Передаём в onSearch:", id);
        onSearch(Number(value)); // ← приводим к числу
    }
  };

  const handleOpenPaymentModal = (id: number) => {
    setSelectedGarageId(id);
    setIsModalOpen(true);
  };
useEffect(() => {
  console.log("Полученные гаражи:", garages);
}, [garages]);
  return (
    <div className="container">
      <div className="header">
        <h1>Учёт электросчётчиков</h1>

        {isAuthenticated && (
          <div className="user-info">
            <h3>Добро пожаловать, {user?.username} ({user?.role})</h3>
            <button type="button" onClick={onLogout}>Выйти</button>
          </div>
        )}
      </div>

      <div className="main__meter">
        <h2>Основной счётчик</h2>
        <p>Потребление энергии: 320 кВт</p>
        <button type="button" onClick={onCheckReadings}>Сверить показания</button>
      </div>

      
        <div className="buttons">
        <div>
          <h3>Добавить новый гараж</h3>
          <button type="button" onClick={handleAddGarage}>Добавить гараж</button>
        </div>
        <button type="button">История платежей</button>
      </div>
        <div className="search">
        <h3>Поиск по номеру гаража:</h3>
        <input
          type="text"
          placeholder="Введите номер гаража"
          value={searchId}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Номер гаража</th>
            <th>Энергопотребление</th>
            <th>Баланс</th>
            <th>Статус</th>
            <th>Действие</th>
            <th>Оплата</th>
          </tr>
        </thead>
        <tbody>
          {garages.map((garage) => (
            <tr key={garage.id}>
              <td>{garage.id}</td>
              <td>{garage.energy} кВт</td>
              <td>{garage.balance} ₽</td>
              <td>{garage.status ? "Включён" : "Выключен"}</td>
              <td className="buttons-table">
                 <button onClick={() => onToggle(garage.id)}>{garage.status ? "Выключить" : "Включить"}</button>
                <button onClick={() => onEdit(garage)}>Редактировать</button>
                <button onClick={() => onDelete(garage.id)}>Удалить</button>
              </td>
              <td>
                <button type="button" onClick={() => handleOpenPaymentModal(garage.id)}>Оплатить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        garageId={selectedGarageId}
      />

      
    </div>
  );
};

export default GarageView;