import { Component, OnInit } from '@angular/core';
import { IshaanviSharedataService } from '../ishaanvi-sharedata.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  public toggleL: string = "none";
  public loader: Subscription;
  constructor(public shareData: IshaanviSharedataService) { }

  ngOnInit() {
    console.log('loader init')
    this.loader = this.shareData.loaderEmitter.subscribe(res => {
      console.log(res);
      switch (res) {
        case 'show':
          this.toggleL = "block";
          break;
        case 'hide':
          this.toggleL = "none";
          break;
      }
    })
  }

  ngOnDestroy() {
    //Unsubscribe the loader
    this.loader.unsubscribe();
  }
}
