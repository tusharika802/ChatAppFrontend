import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { environment } from '../../../enviornment/dev.env';
import { decryptMessage } from '../../../utils/crypto.util';
import { CommonModule } from '@angular/common';
import { ChatBarComponent } from '../chat-bar/chat-bar.component';
import { ChatMessage } from '../../../chat-message';
import { FeedbackComponent } from "../../feedback/feedback.component";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [CommonModule, ChatBarComponent, FeedbackComponent],
  standalone: true
})
export class ChatComponent implements OnInit {
  @Input() isCreator = false;
  userId = localStorage.getItem("userId") || '';
  room = localStorage.getItem("room") || '';
  messages: ChatMessage[] = [];
  message = '';
  selectedFile: File | null = null;
  filePreview: string | null = null;
  copyBtnText = 'Copy';
  emojiPickerVisible = false;
  chatService = inject(ChatService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  showFeedback = false;

  constructor() { /* empty */ }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const qpCreator = params.get('isCreator') === 'true';
      this.isCreator = qpCreator;

      if (this.userId && this.room) {
        this.chatService.connect('join', this.userId, this.room);
      }
    });

    this.chatService.messages$.subscribe((msg: ChatMessage) => {
      if (msg.action === 'deleteFile' && msg.userId === this.userId) {
        this.messages = this.messages.filter(m => m.url !== msg.url);
      } else if (msg.text || msg.type === 'file' || msg.action === 'system') {
        if (msg.type === 'join' && msg.userId === this.userId) return;

        // decrypt
        if (msg.text && msg.action !== 'system') {
          msg.text = decryptMessage(msg.text);
        }
        this.messages.push({ ...msg, seen: false });
      }
    });
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

  isImage(filename: string): boolean {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }

  openImage(url: string) {
    window.open(url, '_blank');
  }

  async downloadFile(url: string | undefined, filename: string | undefined, originalName?: string) {
    if (!url || !filename) return;

    const downloadName = originalName || filename;
    const fileUrl = url.replace("http://localhost:8080", environment.apiUrl);

    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Failed to fetch file');

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

    // removing file locally
    this.messages = this.messages.filter(msg => msg.url !== url);
  }

  async deleteFileAndNotify(url: string, filename: string, originalName?: string) {
    try {
      const serverFilename = url.split('/').pop();
      if (!serverFilename) return;

      this.chatService.sendDeleteMessage(url, serverFilename, originalName);
      await fetch(`${environment.apiUrl}/delete/${serverFilename}`, { method: 'DELETE' });
    } catch (e) {
      console.log('Could not delete file:', e);
    }
  }

  clearFile() {
    this.selectedFile = null;
    this.filePreview = null;
  }

  showFileLink(event: Event) {
    const target = event.target as HTMLElement;
    target.style.display = 'none';
    const parent = target.parentElement;
    const link = parent?.querySelector('.file-link') as HTMLElement;
    if (link) link.style.display = 'block';
  }

  destroyRoom() {
    if (confirm('Are you sure you want to destroy this room?')) {
      this.chatService.sendDestroyRoom();
    }
  }

  leaveRoom() {
    if (confirm('Are you sure you want to leave this room?')) {
      this.chatService.disconnect();
      this.router.navigate(['/home']);
    }
  }

  toggleEmojiPicker() {
    this.emojiPickerVisible = !this.emojiPickerVisible;
  }

  addEmoji(event: { emoji: { native: string } }) {
    this.message += event.emoji.native;
  }

  openFeedback() {
    this.showFeedback = true;
  }

  closeFeedback() {
    this.showFeedback = false;
  }
}
