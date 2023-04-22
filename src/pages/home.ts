import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { styles } from '../styles/shared-styles';

import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';

import '@vaadin/upload/theme/lumo/vaadin-upload.js';
import '@vaadin/select/theme/lumo/vaadin-select.js';

import * as musicParser from 'music-metadata-browser';

import Plyr from 'plyr';
import PlyrStyles from 'plyr/dist/plyr.css';

// import '../components/waveform-visualizer';
import Vudio from 'vudio'

@customElement('page-home')
export class PageHome extends LitElement {

  constructor() {
    super();
    this.tracks = [];
    datastore.ready.then(async () => {
      this.tracks = await datastore.getTracks();
      console.log(this.tracks);
    });
  }

  static properties = {
    tracks: {
      type: Array,
      attribute: false
    }
  }

  static get styles() {
    return [
      styles,
      css`

      ${unsafeCSS(PlyrStyles)}

      :host > * {
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      :host([state="active"]) {
        z-index: 1;
      }

      :host([state="active"]) > * {
        opacity: 1;
      }

      :host([state="active"]) #page_tabs::part(nav) {
        transform: translateY(-0%);
      }

      :host([state="active"]) #page_tabs::part(body) {
        opacity: 1;
        transform: translateY(0);
      }

      #page_tabs {
        display: flex;
        flex-direction: column;
        width: 100%;
        --track-color: transparent;
      }

      #page_tabs sl-tab-panel {
        max-width: 700px;
        margin: 0 auto;
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

      #page_tabs::part(body) {
        display: flex;
        flex: 1;
        opacity: 0;
        transform: translateY(0.3em);
        transition: opacity 0.3s ease, transform ease 0.2s;
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

      #music_controls::part(panel) {
        height: auto;
      }

      #music_controls .plyr {
        --plyr-audio-control-color: rgba(255,255,255,0.5);
        --plyr-audio-controls-background: transparent;
      }

      #visualizer_canvas {
        position: absolute;
        height: 100%;
        width: 100%;
        opacity: 0;
        transition: opacity 1.5s ease;
      }

      #visualizer_canvas[active] {
        opacity: 1;
      }

      #add_song_modal vaadin-upload-file::part(start-button) {
        display: none;
      }

      #add_song_modal vaadin-upload-file::part(status),
      #add_song_modal vaadin-upload-file::part(error) {
        display: none;
      }

      #song_list:not(:empty) ~ * {
        display: none;
      }

      #song_list {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      #song_list li {
        max-width: 6em;
        margin: 1.25em;
        cursor: pointer;
      }

    `];
  }

  async firstUpdated() {
    console.log('This is your home page');
    this.musicPlayer = new Plyr(this.renderRoot.querySelector('#music_player'), {
      iconUrl: '/public/assets/plyr.svg'
    });
    this.connectVisualizer();
    this.renderRoot.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(e);
      this.openSongModal();
    });
  }

  async onPageEnter(){
    // this.renderRoot?.querySelector('#top_controls')?.show()
  }

  async onPageLeave(){
    this.renderRoot?.querySelector('#music_player')?.pause()
    //this.closeMusicPlayer()
  }

  openPlaylistModal(){
    this.renderRoot.querySelector('#create_playlist_modal').show()
  }

  closePlaylistModal(){
    this.renderRoot.querySelector('#create_playlist_modal').hide()
  }

  openMusicPlayer(){
    this.renderRoot.querySelector('#music_controls').show()
  }

  closeMusicPlayer(){
    this.renderRoot.querySelector('#music_controls').hide()
  }

  connectVisualizer(){
    let audio = this.renderRoot.querySelector('#music_player');
    let canvas = this.renderRoot.querySelector('#visualizer_canvas');
    audio.onplay = e => {
      if (!this.visualizer) {
        this.visualizer = new Vudio(audio, canvas, {
          effect : 'circlebar', // waveform, circlewave, circlebar, lighting (4 visual effect)
          accuracy : 128, // number of freqBar, must be pow of 2.
          waveform: {
            maxHeight: 500,
            minHeight: 1,
            spacing: 8,
            color: 'rgb(255, 236, 25)',
            shadowBlur: 0,
            shadowColor: '#f00',
            fadeSide: true,
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            prettify: true
          },
          circlebar : {
            showProgress: false,
            maxHeight : 110, // max waveform bar height
            minHeight : 1, // min waveform bar height
            spacing: 5, // space between bars
            color : 'rgb(255, 236, 25)', // string | [string] color or waveform bars
            shadowBlur : 0, // blur of bars
            shadowColor : '#f00',
            fadeSide : false, // fading tail
            maxParticle: 200,
            horizontalAlign : 'center', // left/center/right, only effective in 'waveform'/'lighting'
            verticalAlign: 'middle' // top/middle/bottom, only effective in 'waveform'/'lighting'
          },
          circlewave: {
            maxHeight: 100,
            minHeight: 1,
            spacing: 10,
            color: '#fff',
            shadowBlur:0,
            shadowColor: '#000',
            fadeSide: false,
            prettify: false,
            particle: true,
            maxParticle: 200,
            circleRadius: 128,
            showProgress: false,
          },
          lighting: {
            lineWidth: 3,
            maxSize: 8,
            maxHeight: 300,
            dottify: true,
            fadeSide: true,
            prettify: false,
            color : 'rgb(255, 236, 25)',
            shadowBlur : 2,
            shadowColor: 'rgba(244,244,244,.5)',
          }
        });
      }
      this.visualizer.dance()
    };
    audio.onplaying = e => {
      canvas.setAttribute('active', '')
    }
    audio.onpause = e => {
      canvas.removeAttribute('active')
    }
    audio.onended = e => {
      canvas.removeAttribute('active')
    }
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

  playAudioForTrack(trackId){
    datastore.getAudioForTrack(trackId);
  }

  openSongModal(){
    this.renderRoot.querySelector('#add_song_modal').show()
  }

  closeSongModal(){
    this.renderRoot.querySelector('#add_song_modal').hide()
  }

  async submitSongModal(){
    await datastore.ready;
    const uploader = this.renderRoot.querySelector('#add_song_modal vaadin-upload')
    console.log(uploader.files)
    for (let file of uploader.files) {
      const metadata = await musicParser.parseBlob(file);
      const track = await datastore.createTrack(metadata.common);
      console.log('track: ', track)
      const audio = await datastore.saveAudioForTrack(file, file.type, track.id);
      console.log('audio: ', audio)
      this.tracks.push(track);
      this.requestUpdate();
    }
  }

  render() {
    return html`

      <sl-tab-group id="page_tabs">

        <sl-tab slot="nav" panel="songs">
          <sl-icon name="music-note-beamed"></sl-icon>
          Songs
        </sl-tab>
        <sl-tab slot="nav" panel="playlists">
          <sl-icon name="music-note-list"></sl-icon>
          Playlists
        </sl-tab>

        <canvas id="visualizer_canvas"></canvas>

        <sl-tab-panel name="songs">
          <sl-button variant="success" @click="${e => this.openMusicPlayer()}">Open Controls</sl-button>
          <ul id="song_list">${repeat(
            this.tracks,
            async track => track.id,
            (track, index) => html`
              <li @click="${e => this.playAudioForTrack(track.id)}">
                <sl-icon name="music-note-beamed"></sl-icon>
                <div>${track.trackData.title}<div>
              </li>
            `
          )}</ul>
          <div class="panel-intro">
            <sl-icon name="music-note-beamed"></sl-icon>
            <p>You haven't added any music, add your first song now.</p>
            <sl-button variant="primary" @click="${e => this.openSongModal() }">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Add Songs
            </sl-button>
          </div>
        </sl-tab-panel>

        <sl-tab-panel name="playlists">
          <div class="panel-intro">
            <sl-icon name="music-note-list"></sl-icon>
            <p>You don't have any playlists, create your first one now.</p>
            <sl-button variant="primary" @click="${e => this.openSongModal() }">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Create a Playlist
            </sl-button>
          </div>
        </sl-tab-panel>

      </sl-tab-group>

      <sl-drawer id="music_controls" placement="bottom" class="drawer-placement-bottom drawer-contained" no-header contained>
        <audio id="music_player" src="/public/audio/beat-1.mp3" controls></audio>
      </sl-drawer>

      <sl-dialog id="create_playlist_modal" label="Add Playlists" class="dialog-overview">
        <sl-input id="create_playlist_input" placeholder="Enter playlist name"></sl-input>
        <sl-button slot="footer" variant="danger" @click="${e => this.closePlaylistModal()}">Close</sl-button>
        <sl-button slot="footer" variant="success" @click="${e => this.createPlaylist(this.renderRoot.querySelector('#create_playlist_input').value)}">Create</sl-button>
      </sl-dialog>

      <sl-dialog id="add_song_modal" label="Add Songs" class="dialog-overview">
        <vaadin-upload
          no-auto
          id="song_file_drop"
          accept="audio/mp4, audio/mpeg, application/ogg, .mp3, .m4a"
          .nodrop="${false}"
          @change="${{handleEvent: e => console.log(e), capture: true}}"
        >
          <vaadin-button slot="add-button" theme="primary">
            Upload Song
          </vaadin-button>
          <span slot="drop-label">
            Drop a music file to upload
          </span>
        </vaadin-upload>
        <!-- <vaadin-select
          label="Add to a Playlist"
          placeholder="Select a playlist (optional)"
          .items="${globalThis.datastore.getPlaylistMap().reduce((set, item) => {
            set.push({
              label: item.name,
              value: item.recordId
            });
            return set;
          }, [])}"
        ></vaadin-select> -->
        <sl-button slot="footer" variant="danger" @click="${e => this.closeSongModal()}">Close</sl-button>
        <sl-button slot="footer" variant="success" @click="${e => this.submitSongModal()}">Add</sl-button>
      </sl-dialog>

    `;
  }
}
