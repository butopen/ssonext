import { Injectable } from '@nestjs/common';
import messages from './messages_en';

type MessageKey = keyof typeof messages;

@Injectable()
export class MessageService {
  constructor(private messages) {}

  get(s: MessageKey | string, data = {}): string {
    let r = this.messages[s];
    if (!r) {
      console.log('could not find token ' + r);
      r = s;
    }

    const hasData = Object.keys(data).length > 0;
    if (hasData) {
      for (let k in data) {
        r = r.replaceAll(`$${k}`, data[k]);
      }
    }
    return r;
  }
}
