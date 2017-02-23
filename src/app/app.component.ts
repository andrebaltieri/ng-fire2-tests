import { Component } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  item: FirebaseObjectObservable<any>;
  auth: any;
  user: any;

  constructor(public af: AngularFire) {
    this.af.auth.subscribe(auth => {
      this.auth = auth;
      if (auth) {
        this.checkSubscription();
      }
    });
  }

  checkSubscription() {
    const queryList = this.af.database.list('/students', {
      query: {
        orderByChild: 'id',
        equalTo: this.auth.uid,
      }
    }).subscribe(data => this.user = data[0]);
  }

  register() {
    this.af.database.list('/students').push({
      id: this.auth.uid,
      document: '35292623822',
      name: this.auth.github.displayName,
      email: this.auth.github.email,
      image: this.auth.github.photoURL,
      plan: {
        type: 'monthly',
        paymentMethod: 'paypal',
        status: 'active',
        expireDate: '2017-08-28T'
      }
    });
  }

  login() {
    // this.af.auth.login();
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    });
  }

  logout() {
    this.af.auth.logout();
  }
}
