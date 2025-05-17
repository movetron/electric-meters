import { Garage } from '../types/types';
import apiClient from "../apiClient";


type Listener = () => void;
export class GarageModel {
  private garages: Garage[] = [];
 private listeners: Listener[] = [];
  constructor() {
     this.loadGarages();
  }
   subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
    notifyListeners() {
       console.log("notifyListeners вызван. Текущее состояние гаражей:", JSON.stringify(this.garages));
  this.listeners.forEach((listener) => listener());
    }
    async loadGarages() {
        try {
            const url = "/api/garages"; 
            console.log("Делаем GET на:", url);
            const response = await apiClient.get(url);
            console.log("Ответ от сервера при загрузке гаражей:", JSON.stringify(response.data));
            this.garages = response.data;
            this.notifyListeners();
        } catch (error) {
            console.error("Ошибка при загрузке данных из БД:", error);
        }
    } 
  getGarages(): Garage[] {
    return this.garages;
  }
  setGarages(garages: Garage[]) {
    this.garages = garages;
  }

    searchGarageById(id: number): Garage[] {
        console.log(`Поиск гаража с id ${id}`);

        if (isNaN(id)) {
             console.log("Возвращаем все гаражи");
            return this.garages;
        }
         const foundGarages = this.garages.filter((garage) => garage.id === id);
        console.log("Найденные гаражи:", foundGarages);
        return foundGarages;
    }

  getGarageById(id: number): Garage | undefined {
    return this.garages.find(garage => garage.id === id);
  }
async toggleStatus(id: number) {
  const garage = this.garages.find((g) => g.id === id);
  if (!garage) {
    console.warn(`Гараж с id ${id} не найден при переключении статуса.`);
    return;
  }

    console.log("Статус после изменения:", garage.status);
  garage.status = !garage.status;

    console.log("Список гаражей:", [...this.garages]);
  try {
    const response = await apiClient.put(`/api/garages/${id}`, { status: garage.status });
    console.log("Ответ от сервера после PUT:", response.data);
     console.log("После изменения (до notifyListeners):", JSON.stringify(this.garages));

    this.notifyListeners(); // ✅ Обновляем UI
  } catch (e) {
    console.error("Ошибка изменения статуса:", e);
    garage.status = !garage.status; // Откат при ошибке
    this.notifyListeners();
  }
}

  async updateGarage(updatedGarage: Garage) {
  const index = this.garages.findIndex(garage => garage.id === updatedGarage.id);

  if (index !== -1) {
    this.garages[index] = updatedGarage;
  }
}

  async createGarage(garage: Garage) {
    try {
      await apiClient.post("/api/garages", garage);
      this.notifyListeners();
    } catch (e) {
      console.error("Ошибка создания гаража:", e);
    }
  }
  async deleteGarage(id: number) {
    try {
      await apiClient.delete(`/api/garages/${id}`);
      this.garages = this.garages.filter((g) => g.id !== id);
      this.notifyListeners();
    } catch (e) {
      console.error("Ошибка удаления гаража:", e);
    }
  }
}
