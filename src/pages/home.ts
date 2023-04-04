import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

import { styles } from '../styles/shared-styles';

@customElement('page-home')
export class PageHome extends LitElement {

  static get styles() {
    return [
      styles,
      css`

      :host > section {
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      :host([state="active"]) {
        z-index: 1;
      }

      :host([state="active"]) > section {
        opacity: 1;
      }

      #page_tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        --track-color: transparent;
      }

      #page_tabs::part(base) {
        flex: 1;
      }

      #page_tabs::part(nav) {
        display: flex;
        justify-content: center;
        background: rgb(37 39 42);
        box-shadow: var(--sl-shadow-medium);
        transform: translateY(-100%);
        transition: transform ease 0.2s;
      }

      :host([state="active"]) #page_tabs::part(nav) {
        transform: translateY(-0%);
      }

      #page_tabs::part(body) {
        display: flex;
        flex: 1;
        opacity: 0;
        transform: translateY(0.25em);
        transition: opacity 0.3s ease, transform ease 0.2s;
      }

      :host([state="active"]) #page_tabs::part(body) {
        opacity: 1;
        transform: translateY(0);
      }

      #page_tabs sl-tab-panel[active] {
        display: flex;
      }

      sl-tab-panel[name="songs"]:empty::before {
        content: "Drag-and-drop or click here to add a song";
        display: block;
        position: absolute;
        align-self: center;
        justify-self: center;
        top: 50%;
        left: 50%;
        padding: 3em;
        border: 5px dashed rgba(255 255 255 / 10%);
        border-radius: 3px;
        transform: translate(-50%, -50%);
        cursor: pointer;
      }

      @media(min-width: 750px) {

      }

    `];
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle event in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');

  }

  async onPageEnter(){
    // this.renderRoot?.querySelector('#top_controls')?.show()
  }

  async onPageLeave(){
    // this.renderRoot?.querySelector('#top_controls')?.hide()
  }

  render() {
    return html`


      <!-- <sl-drawer id="top_controls" placement="top" class="drawer-placement-top drawer-contained" no-header contained >
        <sl-icon-button name="plus-circle" label="Edit" style="font-size: 2rem;" @click="${e => {
          DOM.fireEvent(this, 'open-content-modal', { composed: true });
        }}"></sl-icon-button>
      </sl-drawer> -->

      <sl-tab-group id="page_tabs">
        <sl-tab slot="nav" panel="songs">Songs</sl-tab>
        <sl-tab slot="nav" panel="playlists">Playlists</sl-tab>
        <sl-tab slot="nav" panel="artists">Artists</sl-tab>
        <sl-tab slot="nav" panel="genres">Genres</sl-tab>

        <sl-tab-panel name="songs"></sl-tab-panel>
        <sl-tab-panel name="playlists">TEST</sl-tab-panel>
        <sl-tab-panel name="artists">This is the advanced tab panel.</sl-tab-panel>
        <sl-tab-panel name="genres">This is a disabled tab panel.</sl-tab-panel>
      </sl-tab-group>

    `;
  }
}
