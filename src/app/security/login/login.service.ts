import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MEAT } from "../../restaurantes/api";
import { User } from "./user.model";
import { tap, filter } from "rxjs/operators";
import { Router, NavigationEnd } from "@angular/router";
// import { CarrinhoComprasService } from "../../carrinho-compras.service";

@Injectable({
  providedIn: "root"
})
export class LoginService implements OnInit {
  constructor(private http: HttpClient, private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => (this.lastUrl = e.url));
  }

  lastUrl;
  MEAT = MEAT;

  user: User;
  storedSession;

  ngOnInit() {}

  isLoggedIn(): boolean {
    return this.user !== undefined;
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${MEAT}/login`, {
        email: email,
        password: password
      })
      .pipe(
        tap(user => {
          this.user = user;
          localStorage.setItem('session', JSON.stringify(user))
        })
      );
  }

  logout() {
    this.user = undefined;
    this.router.navigate(["/"]);
    localStorage.removeItem('session')
  }

  handleLogin(path = this.lastUrl) {
    this.router.navigate(["/login", btoa(path)]);
  }
}
