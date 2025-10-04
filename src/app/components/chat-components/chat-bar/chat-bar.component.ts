import { Component, inject } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { SubscriptionComponent } from '../../../services/subscription/subscription.component';

@Component({
  selector: 'app-chat-bar',
  standalone: true,
  imports: [FormsModule, EmojiModule, PickerModule],
  templateUrl: './chat-bar.component.html',
  styleUrl: './chat-bar.component.scss'
})
export class ChatBarComponent extends SubscriptionComponent{
  /**
   *
   */
  chatService = inject(ChatService);
  selectedFile?: File;
  userId =localStorage.getItem("userId")||'';
  room = localStorage.getItem("room")||'';
  message = '';
  filePreview: string | null = null;
  copyBtnText = 'Copy';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;

    if (this.isImage(file.name)) {
      const reader = new FileReader();
      reader.onload = e => this.filePreview = e.target?.result as string;
      reader.readAsDataURL(file);
    } else {
      this.filePreview = null;
    }

    input.value = '';
  }

  send() {
    if (this.selectedFile) {
      this.sendFile();
    } else if (this.message.trim()) {
      this.chatService.sendMessage(this.message);
      this.message = '';
    }
  }

  async sendFile() {
    if (!this.selectedFile) return;
    try {
      await this.chatService.uploadFileAndSend(this.selectedFile);
      this.clearFile();
    } catch {
      alert('File upload failed');
    }
  }

  isImage(filename: string): boolean {
    if (!filename) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return imageExtensions.includes(ext);
  }
  clearFile() {
    this.selectedFile = undefined;
    this.filePreview = null;
  }
  emojiPickerVisible = false;


addEmoji(emoji: string) {
  this.message += emoji; 
  }

}
