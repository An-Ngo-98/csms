import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DialogComponent, DialogService } from 'angularx-bootstrap-modal';
import { MouseEvent } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-select-position-map-popup',
  templateUrl: './select-position-map-popup.component.html'
})
export class SelectPositionMapPopupComponent extends DialogComponent<any, any> implements OnInit {

  public latitudeMap: number = 51.673858;
  public longitudeMap: number = 7.815982;
  public latitude: number = 51.673858;
  public longitude: number = 7.815982;
  public zoom: number = 15;

  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;

  constructor(
    public dialogService: DialogService) {
    super(dialogService);
  }

  ngOnInit() {
    // this.setCurrentLocation();
  }

  // Get Current Location Coordinates
  // private setCurrentLocation() {
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 15;
  //     });
  //   }
  // }

  public onClose() {
    this.result = this.latitude + ' | ' + this.longitude;
    this.close();
  }

  public onCancel() {
    this.close();
  }

  public mapClicked($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
  }
}
