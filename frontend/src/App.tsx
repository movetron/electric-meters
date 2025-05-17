import React, { useState, useMemo, useEffect  } from 'react';
import { GaragePresenter } from './presenter/GaragePresenter';
import { GarageModel } from './model/GarageModel';
import GarageView from './view/GarageView';
import { Garage } from './types/types';
import { AuthPresenter } from "./presenter/AuthPresenter";
// import { AuthModel } from "./model/AuthModel";
import Modal from "./components/Modal";
import GarageForm from "./components/GarageForm";
import AuthView from "./view/AuthView";
import './App.css';


const App: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState<Garage | null>(null);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);




//   const authModel = new AuthModel();
  const garageModel = useMemo(() => new GarageModel(), []);
// Обновляем состояние компонента при изменении данных в модели
  const [garages, setGarages] = useState<Garage[]>(() => garageModel.getGarages());
const [filteredGarages, setFilteredGarages] = useState<Garage[]>(garages);

const handleSearch = (id: number) => {
     console.log("handleSearch вызван с id:", id);
  if (isNaN(id)) {
    setFilteredGarages(garages);
  } else {
    const foundGarages = garageModel.searchGarageById(id);
    console.log("Найденные гаражи:", foundGarages);
    setFilteredGarages(foundGarages);
  }
   console.log("Состояние filteredGarages после поиска:", filteredGarages);
};

  useEffect(() => {
    const unsubscribe = garageModel.subscribe(() => {
      setGarages(garageModel.getGarages());
    });

    return () => {
      unsubscribe();
    };
  }, [garageModel]);

//   const updateGarages = (newGarages: Garage[]) => {
//     setGarages(newGarages);
//   };
  const garagePresenter = useMemo(() => {
    return new GaragePresenter(
      {
        updateGarages: () => setGarages(garageModel.getGarages()),
        showAlert: (message) => alert(message),
      },
      garageModel
    );
  }, [garageModel]);

  
  const authPresenter = useMemo(
    () =>
      new AuthPresenter({
        onLogin: (username: string, role: string) => {
          setIsAuthenticated(true);
          setUser({ username, role });
        },
        onLogout: () => {
          setIsAuthenticated(false);
          setUser(null);
        },
      }),
    []
  );

  const handleLogout = () => {
    authPresenter.logout();
    setIsAuthenticated(false);
  };

//   const showAlert = (message: string) => {
//     alert(message);
//   };

  const handleEdit = (garage: Garage) => {
    setSelectedGarage(garage);
    setModalOpen(true);
  };


  const handleCreate = () => {
    setSelectedGarage(null);
    setModalOpen(true);
  };

  const handleSubmit = (garage: Garage) => {
    if (selectedGarage) {
      garagePresenter.updateGarage(garage);
    } else {
      garagePresenter.createGarage(garage);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    garagePresenter.deleteGarage(id);
  };
  return (
    
    <div>
         {isAuthenticated ? (
      <GarageView 
        garages={garages} 
        onToggle={(id) => garagePresenter.toggleGarageStatus(id)} 
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onCheckReadings={() => garagePresenter.checkMeterReadings()}
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
      />
    ) : (
        <AuthView onLogin={(u, p) => authPresenter.login(u, p)} />
      )}
       <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <GarageForm onSubmit={handleSubmit} initialData={selectedGarage ?? undefined} />
      </Modal>
      
    </div>
  );
};

export default App;
