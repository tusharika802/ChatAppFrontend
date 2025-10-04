import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-room',
    templateUrl: './create-room.component.html',
    styleUrls: ['./create-room.component.scss'],
    standalone: true,

})
export class CreateRoomComponent implements OnInit {
  @Input() userId = '';
  @Input() room = '';
  @Output() startChat = new EventEmitter<void>();
  copyBtnText = 'Copy'; 
  router = inject(Router);
  constructor() {/* empty */ }

  ngOnInit(): void {
    const navState = history.state as { userId?: string };
    if (navState && navState.userId) {
      this.userId = navState.userId;
    }
    if (!this.room) {
      this.room = this.generateRoomCode();
    }
  }

 copyCode() {
  if (!this.room) return;
  navigator.clipboard.writeText(this.room).then(() => {
    this.copyBtnText = 'Copied ✓'; 
    setTimeout(() => {
      this.copyBtnText = 'Copy'; 
    }, 2000);
  });
}

  startChatClick(): void {
    if (!this.userId || !this.room) return;
    this.copyCode();

    setTimeout(() => {
    localStorage.setItem("room",this.room);
    localStorage.setItem("userId",this.userId);
    this.router.navigate(['/chat']);
    }, 2000);
    this.startChat.emit();
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
}
