import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-join-room',
    templateUrl: './join-room.component.html',
    styleUrls: ['./join-room.component.scss'],
    standalone: true,
    imports:[FormsModule]
})
export class JoinRoomComponent implements OnInit {
  @Input() userId = '';
  room = '';
  @Output() join = new EventEmitter<string>();
  router = inject( Router);
  constructor() {/*empty */ }

  ngOnInit(): void {
    const navState = history.state as { userId?: string };
    if (navState && navState.userId) {
      this.userId = navState.userId;
    }
  }

  joinRoom() {
    if (!this.userId.trim()) {
      alert('Enter your name!');
      return;
    }
    if (!this.room.trim()) {
      alert('Enter room code!');
      return;
    }
    const code = this.room.trim().toUpperCase();
    this.join.emit(code);
    localStorage.setItem("room",code);
    localStorage.setItem("userId",this.userId);
    this.router.navigate(['/chat']);
  }
}
