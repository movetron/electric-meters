import React, { useState } from "react";
import { Garage } from "../types/types";

interface GarageFormProps {
  onSubmit: (garage: Garage) => void;
  initialData?: Garage;
}

const GarageForm: React.FC<GarageFormProps> = ({ onSubmit, initialData }) => {
  const [id, setId] = useState<number | string>(initialData?.id ? Number(initialData.id) : "");
  const [energy, setEnergy] = useState(initialData?.energy || 0);
  const [balance, setBalance] = useState(initialData?.balance || 0);
  const [status, setStatus] = useState(initialData?.status || false);

 const handleSubmit = () => {
  onSubmit({
    id: Number(id),
    energy,
    balance,
    status,
  });
};

  return (
    <div>
      <input
        placeholder="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        disabled={!!initialData}
      />
      <input
        placeholder="Энергопотребление"
        type="number"
        value={energy}
        onChange={(e) => setEnergy(Number(e.target.value))}
      />
      <input
        placeholder="Баланс"
        type="number"
        value={balance}
        onChange={(e) => setBalance(Number(e.target.value))}
      />
      <label>
        <input
          type="checkbox"
          checked={status}
          onChange={(e) => setStatus(e.target.checked)}
        />
        Включён
      </label>
      <button onClick={handleSubmit}>{initialData ? "Сохранить" : "Создать"}</button>
    </div>
  );
};

export default GarageForm;
