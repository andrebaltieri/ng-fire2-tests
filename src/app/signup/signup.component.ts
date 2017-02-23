import { Component, OnInit } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {
  user: any = {};

  constructor(public af: AngularFire) {
    this.af.auth.subscribe(auth => {
      if (auth.github) {
        this.user = {
          id: auth.uid,
          firstName: auth.github.displayName.split(" ")[0],
          lastName: auth.github.displayName.split(" ")[1],
          email: auth.github.email,
          image: auth.github.photoURL,
          plan: {
            type: 'free',
            paymentMethod: 'free',
            status: 'active',
            expireDate: ''
          }
        }
      }
    });
  }

  ngOnInit() {
  }

  checkSubscription(id: string) {
    const queryList = this.af.database.list('/students', {
      query: {
        orderByChild: 'id',
        equalTo: id,
      }
    }).subscribe(data => {
      if (data.length > 0) {
        alert('Você já tem cadastro');
      }
    });
  }

  loginGithub() {
    this.af.auth.login({
      provider: AuthProviders.Github,
      method: AuthMethods.Popup,
    }).then(_ => {
      document.getElementById('register-modal').classList.add('is-active');
    });
  }

  register() {
    this.af.database.list('/students').push(this.user).then(_ => {
      document.getElementById('register-modal').classList.remove('is-active');
    });
  }

}
