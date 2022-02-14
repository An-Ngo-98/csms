import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Document } from 'app/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class SockerService {
  currentDocument = this.socket.fromEvent<Document>('document');
  documents = this.socket.fromEvent<string[]>('documents');

  constructor(private socket: Socket) { }

  getOrder(id: string) {
    this.socket.emit('getOrder', id);
  }

  addNewOrder(document: Document) {
    this.socket.emit('addOrder', document);
  }

  updateOrder(document: Document) {
    this.socket.emit('updateOrder', document);
  }
}
