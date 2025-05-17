import { User } from "../types/types";

export class AuthModel {
  private users: User[] = [
    { id: "1", username: "user", password: "user123", role: "user" },
    { id: "2", username: "admin", password: "admin123", role: "admin" },
  ];

  private loggedInUser: User | null = null;

  login(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      this.loggedInUser = user;
      return true;
    }
    return false;
  }

  logout() {
    this.loggedInUser = null;
  }

  getLoggedInUser(): User | null {
    return this.loggedInUser;
  }
}
