import { TestBed } from '@angular/core/testing';

import { GetUsersInChatService } from './get-users-in-chat.service';

describe('GetUsersInChatService', () => {
  let service: GetUsersInChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUsersInChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
