import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../enviornment/dev.env';
import { encryptMessage } from '../utils/crypto.util';
import { ChatMessage } from '../chat-message';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private ws?: WebSocket;
  private userId = '';
  private room = '';
  private messagesSubject = new Subject<ChatMessage>();
  messages$ = this.messagesSubject.asObservable();

  connect(action: 'create' | 'join', userId: string, room?: string) {
    this.userId = userId;
    this.room = room || '';

    this.ws = new WebSocket(environment.wsUrl);

    this.ws.onopen = () => {
      if (action === 'create') {
        this.ws?.send(JSON.stringify({ action: 'create', userId }));
      } else if (action === 'join') {
        if (!room) {
          console.error('Room code required to join!');
          return;
        }
        this.ws?.send(JSON.stringify({ action: 'join', room, userId }));
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.action === 'roomCreated' && data.room) {
          this.room = data.room;
        }
        this.messagesSubject.next(data);
      } catch {
        console.log('Non-JSON:', event.data);
      }
    };
  }

  sendMessage(text: string) {
    if (!this.ws) return;
    const encryptedText = encryptMessage(text);
    const msg = {
      action: 'message',
      room: this.room,
      userId: this.userId,
      text: encryptedText
    };
    this.ws.send(JSON.stringify(msg));
  }
  async uploadFileAndSend(file: File): Promise<void> {
    const form = new FormData();
    form.append('file', file);
    form.append('room', this.room);
    form.append('userId', this.userId);

    const res = await fetch(`${environment.apiUrl}/upload`, {
      method: 'POST',
      body: form
    });

    if (!res.ok) throw new Error('Upload failed');

    const payload = await res.json();
    if (this.ws) {
      const msg = {
        action: 'message',
        room: this.room,
        userId: this.userId,
        type: 'file',
        url: payload.url,
        filename: payload.filename,
        originalName: file.name
      };
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendDeleteMessage(url: string, filename: string, originalName?: string) {
    if (!this.ws) return;
    const msg = {
      action: 'deleteFile',
      room: this.room,
      userId: this.userId,
      url,
      filename,
      originalName
    };
    this.ws.send(JSON.stringify(msg));
  }
  sendFileSeen(filename: string) {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({
      action: 'fileSeen',
      room: this.room,
      userId: this.userId,
      filename
    }));
  }

  sendDestroyRoom() {
    if (!this.ws) return;
    const msg = { action: 'destroyRoom', room: this.room, userId: this.userId };
    this.ws.send(JSON.stringify(msg));
  }

  getUserId() { return this.userId; }
  getRoom() { return this.room; }

  disconnect() { this.ws?.close(); }
}
