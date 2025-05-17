import { GarageModel } from "../model/GarageModel";
import { Garage } from "../types/types";

interface GarageViewProps {
  updateGarages: (garages: Garage[]) => void;
  showAlert: (message: string) => void;
}

export class GaragePresenter {
  private model: GarageModel;
  private view: GarageViewProps;
    private mainMeterConsumption: number = 320;

  constructor(view: GarageViewProps, model: GarageModel) {
    this.view = view;
    this.model = model;
    this.view.updateGarages(this.model.getGarages());
     this.loadGarages();
  }

  async loadGarages() {
    await this.model.loadGarages();
    this.view.updateGarages(this.model.getGarages());
  }

async toggleGarageStatus(id: number) {
  try {
    const garage = this.model.getGarageById(id);
    if (!garage) return;

    const updatedStatus = !garage.status;
    
    await fetch(`http://localhost:5000/api/garages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: updatedStatus }),
    });

       // Обновляем только изменённый элемент
    const updatedGarages = this.model.getGarages().map(g => 
      g.id === id ? { ...g, status: updatedStatus } : g
    );

    this.model.setGarages(updatedGarages);
    this.view.updateGarages(updatedGarages);


  } catch (error) {
    console.error("Ошибка при изменении статуса гаража:", error);
    this.view.showAlert("Не удалось изменить статус гаража");
  }
}


  searchGarageById(id: number) {
    const filteredGarages = this.model.searchGarageById(id);
    this.view.updateGarages(filteredGarages);
  }

  createGarage(newGarage: Garage) {
    this.model.createGarage(newGarage);
    this.view.updateGarages(this.model.getGarages());
  }

  updateGarage(updatedGarage: Garage) {
    this.model.updateGarage(updatedGarage);
    this.view.updateGarages(this.model.getGarages());
  }

  deleteGarage(id: number) {
    this.model.deleteGarage(id);
    this.view.updateGarages(this.model.getGarages());
  }
  checkMeterReadings() {
    const garages = this.model.getGarages();
    const totalConsumption = garages.reduce((acc, garage) => acc + garage.energy, 0);

    if (totalConsumption > this.mainMeterConsumption) {
      this.view.showAlert(
        `Общее энергопотребление (${totalConsumption} кВт) превышает показания основного счётчика (${this.mainMeterConsumption} кВт).`
      );
    } else {
      this.view.showAlert(`Энергопотребление в норме.`);
    }
  }
  

}
