import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { AppRouter } from './components/router';

import './styles/global.css';
import './utils/dom';

import './pages/home';
import './pages/explore';

import './components/header';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';

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
        display: flex;
        align-items: center;
        flex: 0;
        padding: 0.9em 1.1em;
        color: #000;
        background-color: rgb(218 201 18);
        /* background: rgb(37 39 42); */
        border-bottom: 1px solid #111;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 1px 3px 0px;
        z-index: 100;
      }

      #app_header > * {
        margin: 0;
      }

      #app_header h1 span {
        font-size: 0.75em;
      }

      #app_header sl-input {
        width: 100%;
        min-width: 300px;
        max-width: 500px;
        margin: auto;
      }

      main {
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
        height: auto;
        min-height: 100%;
        overflow: auto;
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

    this.addEventListener('open-content-modal', e => {
      this.openContentModal();
    })
  }

  firstUpdated() {
    DOM.skipFrame(() => this.router.goto(location.pathname));
  }

  openContentModal(){
    this.renderRoot.querySelector('#add_content').show()
  }

  closeContentModal(){
    this.renderRoot.querySelector('#add_content').hide()
  }

  render() {
    return html`
      <header id="app_header">
        <h1>Mu<span>5</span>ic</h1>
        <a href="/">My Music</a>
        <a href="/explore">Explore</a>
      </header>

      <sl-dialog id="add_content" label="Add Content" class="dialog-overview">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <sl-button slot="footer" variant="primary">Close</sl-button>
      </sl-dialog>

      <main id="pages">
        <page-home></page-home>
        <page-explore></page-explore>
      </main>
    `;
  }
}
