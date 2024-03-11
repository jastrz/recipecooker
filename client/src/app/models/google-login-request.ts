export class GoogleLoginRequest {
  idToken!: string;

  constructor(idToken : string) {
    this.idToken = idToken;
  }
}
