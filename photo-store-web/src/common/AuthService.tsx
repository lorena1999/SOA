class AuthService {
  getUsername(): string {
    return localStorage.getItem('username') ?? '';
  }

  getJwt(): string {
    return localStorage.getItem('jwt') ?? '';
  }

  setLoggedUser(username: string, jwt: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('jwt', jwt);
  }
}

export default AuthService;