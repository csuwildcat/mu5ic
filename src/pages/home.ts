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
        transform: translateY(0.3em);
        transition: opacity 0.3s ease, transform ease 0.2s;
      }

      :host([state="active"]) #page_tabs::part(body) {
        opacity: 1;
        transform: translateY(0);
      }

      #page_tabs sl-tab::part(base) {
        font-size: 1.1em;
        transition: color 0.2s ease;
      }

      #page_tabs sl-tab::part(base) {
        font-family: unset;
      }

      #page_tabs sl-tab:not([active])::part(base):hover {
        color: #ccc;
      }

      #page_tabs sl-tab sl-icon {
        padding-top: 0.1em;
        margin-right: 0.6em;
      }

      #page_tabs sl-tab-panel[active] {
        display: flex;
        animation: fadePanel 0.75s ease forwards;
      }

      @keyframes fadePanel {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      .panel-intro {
        display: block;
        position: absolute;
        align-self: center;
        justify-self: center;
        top: 50%;
        left: 50%;
        min-width: 150px;
        max-width: 300px;
        padding: 3em;
        text-align: center;
        transform: translate(-50%, calc(-50% - 5vh));
      }

      .panel-intro > sl-icon {
        font-size: 8em;
        color: rgb(85 85 85);
        filter: drop-shadow(0 3px 1px rgb(0 0 0 / 0.3));
      }

      .panel-intro p {
        margin-bottom: 3em;
      }

      @media (min-width: 750px) {

      }

    `];
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    console.log('This is your home page');
  }

  async onPageEnter(){
    // this.renderRoot?.querySelector('#top_controls')?.show()
  }

  async onPageLeave(){
    // this.renderRoot?.querySelector('#top_controls')?.hide()
  }

  openAudioPicker(){
    this.renderRoot.querySelector('#audio_file_input').click()
  }

  openPlaylistModal(){
    this.renderRoot.querySelector('#create_playlist_modal').show()
  }

  closePlaylistModal(){
    this.renderRoot.querySelector('#create_playlist_modal').hide()
  }

  createPlaylist(name){
    // Store to DWN
    DOM.fireEvent(this, 'app-notify', {
      composed: true,
      detail: {
        variant: 'success',
        duration: 1000000,
        message: `Playlist created: ${name}`
      }
    })
    this.closePlaylistModal()
  }

  render() {
    return html`

      <!-- <sl-drawer id="top_controls" placement="top" class="drawer-placement-top drawer-contained" no-header contained >
        <sl-icon-button name="plus-circle" label="Edit" style="font-size: 2rem;" @click="${e => {
          DOM.fireEvent(this, 'open-content-modal', { composed: true });
        }}"></sl-icon-button>
      </sl-drawer> -->

      <sl-tab-group id="page_tabs">
        <sl-tab slot="nav" panel="songs">
          <sl-icon name="music-note-beamed"></sl-icon>
          Songs
        </sl-tab>
        <sl-tab slot="nav" panel="playlists">
          <sl-icon name="music-note-list"></sl-icon>
          Playlists
        </sl-tab>

        <input id="audio_file_input" type="file" accept="audio/mp4, audio/mpeg, application/ogg" style="display: none;" />

        <sl-tab-panel name="songs">
          <div class="panel-intro">
            <sl-icon name="music-note-beamed"></sl-icon>
            <p>You haven't added any music, add your first song now.</p>
            <sl-button variant="primary" @click="${e => this.openAudioPicker() }">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Add Songs
            </sl-button>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="playlists">
          <div class="panel-intro">
            <sl-icon name="music-note-list"></sl-icon>
            <p>You don't have any playlists, create your first one now.</p>
            <sl-button variant="primary" @click="${e => this.openPlaylistModal() }">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Create a Playlist
            </sl-button>
          </div>
        </sl-tab-panel>

      </sl-tab-group>


      <sl-dialog id="create_playlist_modal" label="Add Playlists" class="dialog-overview">
        <sl-input id="create_playlist_input" placeholder="Enter playlist name"></sl-input>
        <sl-button slot="footer" variant="danger" @click="${e => this.closePlaylistModal()}">Close</sl-button>
        <sl-button slot="footer" variant="success" @click="${e => this.createPlaylist(this.renderRoot.querySelector('#create_playlist_input').value)}">Create</sl-button>
      </sl-dialog>

    `;
  }
}
