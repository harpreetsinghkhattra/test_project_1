import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class IshaanviSharedataService {

  private cData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public cDataEmitter: Observable<any> = this.cData.asObservable();

  private loader: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public loaderEmitter: Observable<any> = this.loader.asObservable();

  constructor() { }

  componentData(value: any) {
    this.cData.next(value);
  }

  /** For loader to hide and show it for now on */
  loaderView(value: string) {
    this.loader.next(value);
  }
}
