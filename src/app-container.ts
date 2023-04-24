globalThis.global = window;
import { Buffer } from "buffer";
import process from "process";
globalThis.Buffer = Buffer;
globalThis.process = process;

import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AppRouter } from './components/router';

import './styles/global.css';
import './styles/theme.js';
import './utils/dom';

import './pages/home';
import './pages/explore';

import './components/header';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';

import { Web5 } from '@tbd54566975/web5';
const web5 = globalThis.web5 = new Web5();
const userDID = localStorage.userDID ? JSON.parse(localStorage.userDID) : await web5.did.create('ion');
      localStorage.userDID = JSON.stringify(userDID);

console.log(userDID);

// Set Managed DID as running in browser memory and for which keys are available to sign messages.
web5.did.manager.set(userDID.id, {
  connected: true,
  endpoint: 'app://dwn',
  keys: {
    '#dwn': {
      'keyPair': userDID.keys.find(key => key.id === 'dwn').keyPair
    }
  }
});

import { Datastore } from './utils/datastore.js';
const datastore = globalThis.datastore = new Datastore({
  web5: web5,
  did: userDID
})

const BASE_URL: string = (import.meta.env.BASE_URL).length > 2 ? (import.meta.env.BASE_URL).slice(1, -1) : (import.meta.env.BASE_URL);

@customElement('app-container')
export class AppContainer extends LitElement {

  static get styles() {
    return css`

      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      #app_header {
        padding: 0.9em 1.1em;
        color: #000;
        background-color: rgb(255, 236, 25);
        /* background: rgb(37 39 42); */
        border-bottom: 1px solid #111;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px;
        z-index: 100;
      }

      #app_header > * {
        margin: 0;
      }

      #app_header nav {
        display: flex;
        align-items: center;
        flex: 0;
        max-width: 900px;
        margin: 0 auto;
      }

      #app_header h1 {
        font-size: 1.8em;
        margin: 0 auto 0 0;
      }

      #app_header h1 span {
        font-size: 0.73em;
        text-shadow: 0 0 0 black, 0 0 0 black, 0 0 0 black;
      }

      #app_header sl-input {
        width: 100%;
        min-width: 300px;
        max-width: 500px;
        margin: auto;
      }

      main {
        display: flex;
        position: relative;
        flex: 1;
      }

      main > * {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      main > *[state="active"] {
        overflow-y: auto;
      }

    `;
  }

  constructor() {
    super();

    this.router = new AppRouter(this, [
      {
        path: '/',
        component: '#pages page-home'
      },
      {
        path: '/explore',
        component: '#pages page-explore'
      }
    ]);

    this.addEventListener('app-notify', e => this.notify(e.detail.message, e.detail))

  }

  firstUpdated() {
    DOM.skipFrame(() => this.router.goto(location.pathname));
  }

  notify(message, options = {}) {
    const alert = Object.assign(document.createElement('sl-alert'), {
      variant: 'primary',
      duration: 3000,
      closable: true,
      innerHTML: `
        <sl-icon name="${options.icon || 'info-circle'}" slot="icon"></sl-icon>
        ${document.createTextNode(message).textContent}
      `
    }, options);
    return document.body.appendChild(alert).toast();
  }

  render() {
    return html`
      <header id="app_header">
        <nav>
          <h1>Mu<span>5</span>ic</h1>
          <a href="/">My Music</a>
          <a href="/explore">Explore</a>
        </nav>
      </header>

      <main id="pages">
        <page-home id="home" scroll></page-home>
        <page-explore id="explore" scroll></page-explore>
      </main>
    `;
  }
}
