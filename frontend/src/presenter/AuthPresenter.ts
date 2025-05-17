
interface AuthViewProps {
  onLogin: (username: string, role: string) => void;
  onLogout: () => void;
}

export class AuthPresenter {
  private view: AuthViewProps;

  constructor(view: AuthViewProps) {
    this.view = view;
  }

  login(username: string, role: string) {
    this.view.onLogin(username, role);
  }

  logout() {
    this.view.onLogout();
  }

  
}
