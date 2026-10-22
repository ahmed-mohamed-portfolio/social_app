import { TestBed } from '@angular/core/testing';

import { GetOneChatService } from './get-one-chat.service';

describe('GetOneChatService', () => {
  let service: GetOneChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetOneChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
