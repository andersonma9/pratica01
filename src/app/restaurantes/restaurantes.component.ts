import { Component, OnInit, OnDestroy } from "@angular/core";
import { Restaurante } from "./restaurante.model";
import { RestaurantesService } from "./restaurantes.service";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import {
  switchMap,
  tap,
  take,
  debounceTime,
  distinctUntilChanged,
  catchError,
  filter
} from "rxjs/operators";
import { Observable, from } from "rxjs";

@Component({
  selector: "app-restaurantes",
  templateUrl: "./restaurantes.component.html",
  styleUrls: ["./restaurantes.component.css"]
})
export class RestaurantesComponent implements OnInit {
  constructor(
    private restauranteServcice: RestaurantesService,
    private fb: FormBuilder
  ) {}

  restaurantes: Restaurante;

  // variáveis de formulário
  searchForm: FormGroup;
  searchControl: FormControl;
  typeAheadItems;
  search;
  typedItem;
  settedSearch: boolean = false;

  ngOnInit() {
    this.searchControl = this.fb.control("");

    

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(termo =>
          this.restauranteServcice
            .restaurantes(termo)
            .pipe(catchError(error => from([])))
        ),
        tap(res => {
          this.typeAheadItems = res;
          this.typeAheadItems.splice(5)
          for (let rests of this.typeAheadItems) {
            if (this.searchControl.value == "") {
              this.settedSearch = false;
              this.typeAheadItems = "";
            } else if (this.searchControl.value.length < 3) {
              this.settedSearch = false;
              // console.log(rests.name);
            }
          }
          // console.log(arrayResposta)
        })
      )
      .subscribe();

    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    });

    this.restauranteServcice
      .restaurantes("")
      .subscribe(restaurantes => (this.restaurantes = restaurantes));

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(termo =>
          this.restauranteServcice
            .restaurantes(termo)
            .pipe(catchError(error => from([])))
        )
      )
      .subscribe(rests => {
        this.restaurantes = rests;
      });

    this.searchForm = this.fb.group({
      searchControl: this.searchControl
    });

    this.restauranteServcice
      .restaurantes("")
      .subscribe(restaurantes => (this.restaurantes = restaurantes));
  }

  setSearch(item) {
    this.settedSearch = true;
    this.searchControl.setValue(item);
  }

  onClick(evento) {
    console.log(evento);
  }
}
