export interface Garage {
    id: number;
    energy: number;
    balance: number;
    status: boolean;
  }
  
  export interface IGarageModel {
    getGarages(): Garage[];
    toggleStatus(id: string): void;
  }
  
  export interface IGarageView {
    updateGarages(garages: Garage[]): void;
  }
  
  export interface IGaragePresenter {
    toggleGarageStatus(id: string): void;
  }
  export interface User {
    id: string;
    username: string;
    password: string;
    role: "user" | "admin";
  }