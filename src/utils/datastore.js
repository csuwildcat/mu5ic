
import { toWebStream } from "./streams";

class Datastore {

  constructor(options){
    this.did = options.did;
    this.dwn = options.web5.dwn;
    this.ready = new Promise(resolve => {
      this.getProtocol().then(async response => {
        if (response.protocols.length) {
          console.log('existing');
          resolve();
        }
        else {
          console.log('new');
          this.setProtocol().then(z => resolve());
        }
      })
    })
  }

  protocolUri = 'music';
  audioSchema = 'music://audio';
  trackSchema = 'music://track';
  playlistSchema = 'music://playlist';

  getProtocol(){
    return this.dwn.protocols.query({
      message: {
        filter: {
          protocol: this.protocolUri
        }
      }
    });
  }

  setProtocol(){
    return this.dwn.protocols.configure({
      message: {
        definition: {
          protocol: this.protocolUri,
          types: {
            "audio": {
              "schema": this.audioSchema
            },
            "track": {
              "schema": this.trackSchema
            },
            "playlist": {
              "schema": this.playlistSchema
            }
          },
          structure: {
            playlist: {},
            track: {
              audio: {}
            }
          }
        }
      }
    });
  }

  getPlaylist(playlistId){
    return this.dwn.records.read({
      message: {
        protocol: this.protocolUri,
        recordId: playlistId
      }
    });
  }

  getPlaylists(){
    return this.dwn.records.query({
      message: {
        filter: {
          protocol: this.protocolUri,
          schema: this.playlistSchema
        }
      }
    });
  }

  getPlaylistMap(){
    return [
      {
        name: 'Rap',
        recordId: 'ID_1'
      },
      {
        name: 'Classic Rock',
        recordId: 'ID_2'
      },
      {
        name: 'Alternative',
        recordId: 'ID_3'
      }
    ]
  }

  createPlaylist(playlistJson){
    return this.dwn.records.create({
      data: playlistJson,
      message: {
        protocol: this.protocolUri,
        protocolPath: 'playlist',
        schema: this.playlistSchema,
        dataFormat: 'application/json'
      }
    });
  }

  modifyPlaylist(){

  }

  getTrack(trackId){
    return this.dwn.records.read({
      message: {
        recordId: trackId
      }
    });
  }

  async getTracks(){
    const { records } = await this.dwn.records.query({
      message: {
        filter: {
          protocol: this.protocolUri,
          schema: this.trackSchema
        }
      }
    });
    return Promise.all(records.map(async entry => {
      const json = await entry.data.json()
      entry.trackData = json;
      return entry;
    }))
  }

  async createTrack(trackJson){
    const { record } = await this.dwn.records.create({
      data: trackJson,
      message: {
        protocol: this.protocolUri,
        protocolPath: 'track',
        schema: this.trackSchema,
        dataFormat: 'application/json'
      }
    });
    record.trackData = await record.data.json();
    return record;
  }

  async modifyTrack(){

  }

  async getAudioForTrack(trackId){
    const { records } = await this.dwn.records.query({
      message: {
        filter: {
          protocol: this.protocolUri,
          parentId: trackId
        }
      }
    });
    const record = records[0];
    if (!record) return;
    const stream = toWebStream(await record.data.stream())
    const blob = await (new Response(stream).blob({ type: record.dataFormat }));
    record.audioUrl = URL.createObjectURL(blob);
    return record;
  }

  async saveAudioForTrack(file, format, trackId){
    return this.dwn.records.create({
      data: file,
      message: {
        parentId: trackId,
        contextId: trackId,
        protocol: this.protocolUri,
        protocolPath: 'track/audio',
        schema: this.audioSchema,
        dataFormat: format
      }
    });
  }

}


export {
  Datastore
}