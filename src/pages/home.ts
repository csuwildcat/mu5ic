import { LitElement, css, html, unsafeCSS } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { styles } from '../styles/shared-styles';
import { styles as scrollStyles } from '../styles/scroll';

import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/drawer/drawer.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';

import '@vaadin/upload/theme/lumo/vaadin-upload.js';
import '@vaadin/select/theme/lumo/vaadin-select.js';

import * as musicParser from 'music-metadata-browser';

import Plyr from 'plyr';
import PlyrStyles from 'plyr/dist/plyr.css';

import Vudio from 'vudio'

@customElement('page-home')
export class PageHome extends LitElement {

  constructor() {
    super();
    this.tracks = [];
    this.tracksByArtist = {};
    this.tracksByPlaylist = {};
    datastore.ready.then(async () => {
      this.addTracks(await datastore.getTracks());
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
      // scrollStyles(':host'),
      unsafeCSS(PlyrStyles),
      css`
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
        width: 100%;
        --track-color: transparent;
      }

      #page_tabs sl-tab-panel {
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
      }

      #page_tabs::part(base) {
        flex: 1;
        height: 100%;
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
        overflow: unset;
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

      #page_tabs sl-tab-panel {
        padding: 0 0 6em;
      }

      #page_tabs sl-tab-panel[active] {
        display: block;
        animation: fadeIn 0.75s ease forwards;
      }

      #page_tabs sl-tab-panel::part(base) {
        margin: 0 1em;
      }

      .panel-intro {
        display: block;
        position: absolute;
        align-self: center;
        justify-self: center;
        top: 50vh;
        left: 50vw;
        min-width: 150px;
        max-width: 300px;
        padding: 3em;
        text-align: center;
        opacity: 0;
        visibility: hidden;
        transform: translate(-50%, calc(-50% - 5vh));
        transition: opacity 0.3s ease, visibility 0.3s linear;
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
        position: fixed;
        bottom: 0px;
        height: auto;
        overflow: unset;
      }

      #music_controls::part(body) {
        padding: min(2.25vw, 0.85em) min(1.75vw, 0.75em);
        overflow: unset;
        z-index: 3;
      }

      #music_controls .plyr {
        --plyr-audio-control-color: rgba(255,255,255,0.5);
        --plyr-audio-controls-background: transparent;
      }

      #visualizer_canvas {
        position: fixed;
        height: 100%;
        width: 100%;
        opacity: 0;
        transition: opacity 1s ease;
        z-index: -1;
      }

      #add_song_modal vaadin-upload > vaadin-button {
        margin: 0.5em 0;
      }

      #add_song_modal vaadin-upload-file-list li:last-child vaadin-upload-file {
        padding-bottom: 0;
      }

      #add_song_modal vaadin-upload-file::part(start-button),
      #add_song_modal vaadin-upload-file::part(status),
      #add_song_modal vaadin-upload-file::part(warning-icon),
      #add_song_modal vaadin-upload-file::part(warning-icon)::before,
      #add_song_modal vaadin-upload-file::part(done-icon),
      #add_song_modal vaadin-upload-file::part(done-icon)::before,
      #add_song_modal vaadin-upload-file::part(error),
      #add_song_modal vaadin-upload-file vaadin-progress-bar {
        display: none !important;
      }

      #add_song_modal vaadin-upload-file::part(commands) {
        align-self: center;
      }

      #song_panel::part(base) {
        display: flex;
        flex-direction: column;
        transition: opacity 0.3s ease;
      }

      #page_tabs:hover #song_panel::part(base) {
        opacity: 1;
      }

      #song_nav {
        display: flex;
        justify-content: end;
        position: sticky;
        top: 2em;
        margin: 1em 0 0;
        transition: opacity 0.3s ease;
      }

      #song_list {
        /* height: 2000px; */
        order: 2;
        transition: opacity 1s ease;
      }

      #song_list:empty {
        opacity: 0;
        z-index: 0;
      }

      #song_list:empty ~ .panel-intro {
        opacity: 1;
        visibility: visible;
        z-index: 1;
      }

      #song_list:empty ~ #song_nav {
        opacity: 0;
        visibility: hidden;
        z-index: 0;
      }

      #song_list > header {
        position: sticky;
        top: 4.5em;
        padding: 0.5em 0.75em;
        margin: 1.5em 0 1em;
        font-size: 1.2em;
        font-weight: bold;
        background: var(--header-bar);
        box-shadow: rgba(20, 20, 20, 0.75) 0px 2px 2px;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
      }

      #song_list > ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      #song_list > ul li {
        margin: 0 0 0.5em;
        padding: 0.5em 0.7em 0.6em;
        background-color: rgb(24 24 24);
        cursor: pointer;
      }

      #song_list > ul li:hover {
        background-color: rgb(34 34 34);
      }

      #song_list > ul li sl-icon {
        vertical-align: middle;
      }

      @keyframes fadeIn {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      @media (hover: none) {

        :host([playing]) #visualizer_canvas {
          opacity: 0.2;
        }

      }

      @media (hover: hover) {

        :host([playing]) #song_panel::part(base) {
          opacity: 0.4;
        }

        :host([playing]) #visualizer_canvas {
          opacity: 1;
        }

        :host([playing]) #page_tabs:hover ~ #visualizer_canvas {
          opacity: 0.2;
          transition: opacity 0.5s ease;
        }

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

  addTracks(tracks){
    const iterable = Array.isArray(tracks) ? tracks : [tracks];
    this.tracks.push(...iterable);
    for (let track of iterable) {
      const artist = track.trackData?.artist?.trim() || 'Unknown';
      const artistBucket = this.tracksByArtist[artist] || (this.tracksByArtist[artist] = []);
      artistBucket.push(track);
      const playlists = track.trackData.playlists || [];
      if (playlists.length) {
        for (let playlist of playlists) {
          let playlist = this.tracksByPlaylist[playlist] || [];
          playlist.push(track);
          this.tracksByPlaylist[playlist] = playlist;
        }
      }
    }
    this.requestUpdate();
  }

  async onPageEnter(){
    if (this.musicDrawerWasOpen){
      this.openMusicPlayer();
    }
  }

  async onPageLeave(){
    this.renderRoot?.querySelector('#music_player')?.pause()
    this.musicDrawerWasOpen = this.musicDrawer.hasAttribute('open');
    this.closeMusicPlayer();
  }

  openPlaylistModal(){
    this.renderRoot.querySelector('#create_playlist_modal').show()
  }

  closePlaylistModal(){
    this.renderRoot.querySelector('#create_playlist_modal').hide()
  }

  get musicDrawer(){
    return this.renderRoot.querySelector('#music_controls')
  }

  openMusicPlayer(){
    this.musicDrawer.show()
  }

  closeMusicPlayer(){
    this.musicDrawer.hide()
  }

  connectVisualizer(){
    let audio = this.audioElement = this.renderRoot.querySelector('#music_player');
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
      this.setAttribute('playing', '')
    }
    audio.onpause = e => {
      this.removeAttribute('playing')
    }
    audio.onended = e => {
      this.removeAttribute('playing')
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

  async playAudioForTrack(trackId){
    const audio = await datastore.getAudioForTrack(trackId);
    console.log(audio);
    this.audioElement.src = audio.audioUrl;
    this.audioElement.setAttribute('type', audio.dataFormat);
    this.musicPlayer.play();
    this.openMusicPlayer();
  }

  openSongModal(){
    this.renderRoot.querySelector('#add_song_modal').show()
  }

  closeSongModal(){
    this.renderRoot.querySelector('#add_song_modal').hide()
  }

  clearUploader(){
    const uploader = this.renderRoot.querySelector('#add_song_modal vaadin-upload');
    uploader.files = [];
  }

  async submitSongModal(){
    await datastore.ready;
    const uploader = this.renderRoot.querySelector('#add_song_modal vaadin-upload')
    console.log(uploader.files)
    try {
      for (let file of uploader.files) {
        const metadata = await musicParser.parseBlob(file);
        console.log(metadata);
        metadata.common.filename = file.name.replace(/\..+$/, '')
        const track = await datastore.createTrack(metadata.common);
        console.log('track: ', track)
        const audio = await datastore.saveAudioForTrack(file, file.type, track.id);
        console.log('audio: ', audio)
        this.addTracks(track);
      }
    }
    catch(e){
      console.log(e);
    }
    this.closeSongModal();
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

        <sl-tab-panel id="song_panel" name="songs">
          <section id="song_list">${Object.keys(this.tracksByArtist).sort().map(artist => {
            return html`
              <header>${artist}</header>
              <ul>
                ${repeat(
                  this.tracksByArtist[artist].sort(),
                  async track => track.id,
                  track => html`
                    <li @click="${e => this.playAudioForTrack(track.id)}">
                      <sl-icon name="music-note-beamed"></sl-icon>
                      <span>${track.trackData.title || track.trackData.filename}<span>
                    </li>
                  `
                )}
              </ul>
            `
          })}</section>

          <nav id="song_nav">
            <sl-button variant="primary" size="small" @click="${e => this.openSongModal() }">
              <sl-icon slot="prefix" name="plus-lg"></sl-icon>
              Add Songs
            </sl-button>
          </nav>

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

      <canvas id="visualizer_canvas"></canvas>

      <sl-drawer id="music_controls" placement="bottom" class="drawer-placement-bottom drawer-contained" no-header contained>
        <audio id="music_player" controls></audio>
      </sl-drawer>

      <sl-dialog id="create_playlist_modal" label="Add Playlists" class="dialog-overview">
        <sl-input id="create_playlist_input" placeholder="Enter playlist name"></sl-input>
        <sl-button slot="footer" variant="danger" @click="${e => this.closePlaylistModal()}">Close</sl-button>
        <sl-button slot="footer" variant="success" @click="${e => this.createPlaylist(this.renderRoot.querySelector('#create_playlist_input').value)}">Create</sl-button>
      </sl-dialog>

      <sl-dialog id="add_song_modal" label="Add Songs" class="dialog-overview" @sl-hide="${e => this.clearUploader()}">
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
