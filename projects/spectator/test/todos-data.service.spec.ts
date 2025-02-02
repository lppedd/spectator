import { fakeAsync, tick } from '@angular/core/testing';
import { createHttpFactory, HttpMethod } from '@ngneat/spectator';
import { defer } from 'rxjs';

import { TodosDataService, UserService } from './todos-data.service';

describe('HttpClient testing', () => {
  const http = createHttpFactory({
    service: TodosDataService,
    mocks: [UserService]
  });

  it('can test HttpClient.get', () => {
    const spectatorHttp = http();

    spectatorHttp.service.get().subscribe();
    spectatorHttp.expectOne('url', HttpMethod.GET);
  });

  it('can test HttpClient.post', () => {
    const spectatorHttp = http();

    spectatorHttp.dataService.post(1).subscribe();

    const req = spectatorHttp.expectOne('url', HttpMethod.POST);
    expect(req.request.body.id).toEqual(1);
  });

  it('should test two requests', () => {
    const spectatorHttp = http();

    spectatorHttp.dataService.twoRequests().subscribe();
    const req = spectatorHttp.expectOne('one', HttpMethod.POST);
    req.flush({});
    spectatorHttp.expectOne('two', HttpMethod.GET);
  });

  it('should work with external service', fakeAsync(() => {
    const spectatorHttp = http();
    spectatorHttp.get(UserService).getUser.andCallFake(() => {
      return defer(() => Promise.resolve({}));
    });

    spectatorHttp.dataService.requestWithExternalService().subscribe();
    tick();

    spectatorHttp.expectOne('two', HttpMethod.GET);
  }));
});
