import React, { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  garageId: number | undefined;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, garageId }) => {
  const [amount, setAmount] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handlePayment = () => {
    const paymentUrl = `https://yookassa.ru/payment?garageId=${garageId}&amount=${amount}`;
    window.open(paymentUrl, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Оплата для гаража {garageId}</h3>
        <input 
          type="number" 
          value={amount} 
          onChange={handleAmountChange} 
          placeholder="Введите сумму" 
        />
        <div className="buttons">
            <button onClick={handlePayment}>Оплатить</button>
            <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
