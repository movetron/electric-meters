import React from 'react';
import { Garage } from '../types/types';

interface Props {
  garage: Garage;
  onToggle: (id: number) => void;
}

const GarageItem: React.FC<Props> = ({ garage, onToggle }) => {
  return (
    <tr>
      <td>{garage.id}</td>
      <td>{garage.energy} кВт</td>
      <td>{garage.balance} ₽</td>
      <td>{garage.status ? 'Включён' : 'Выключен'}</td>
      <td>
        <button onClick={() => onToggle(garage.id)}>
          {garage.status ? 'Выключить' : 'Включить'}
        </button>
      </td>
    </tr>
  );
};

export default GarageItem;
