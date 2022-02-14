import { Injectable } from '@angular/core';
import { User } from 'app/models/user.model';
// import { User } from '@app/models/user.model';

export const keyLocalStorageLastSeenSetting = 'lastNotificationsDeniedLastSeenAt';
export const keyIsDoneFeatureTour = 'isDoneFeatureTour';
@Injectable()
export class LocalStorageService {
  public reset() {
    localStorage.clear();
  }

  public getAuthToken(): string {
    return localStorage.getItem('token');
  }

  public setAuthToken(authToken: string) {
    localStorage.setItem('token', authToken);
  }

  public setUserObject(userObject: User) {
    localStorage.setItem('user', JSON.stringify(userObject));
  }

//   public getUserObject(): User | undefined {
//     const userStringified = localStorage.getItem('user');

//     if (userStringified !== undefined && userStringified.length !== 0) {
//       return JSON.parse(userStringified);
//     }

//     return undefined;
//   }
}

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};
