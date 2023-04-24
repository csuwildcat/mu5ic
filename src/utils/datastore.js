
import { toWebStream } from "./streams";

class Datastore {

  constructor(options){
    this.did = options.did;
    this.dwn = options.web5.dwn;
    this.ready = new Promise(resolve => {
      this.getProtocol().then(async response => {
        if (response.entries.length) {
          console.log('existing');
          resolve();
        }
        else {
          console.log('new')
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
    return this.dwn.protocols.query(this.did.id, {
      author: this.did.id,
      message: {
        filter: {
          protocol: this.protocolUri
        }
      }
    });
  }

  setProtocol(){
    return this.dwn.protocols.configure(this.did.id, {
      author: this.did.id,
      message: {
        protocol: this.protocolUri,
        definition: {
          labels: {
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
          records: {
            playlist: {},
            track: {
              records: {
                audio: {}
              }
            }
          }
        }
      }
    });
  }

  getPlaylist(playlistId){
    return this.dwn.records.read(this.did.id, {
      author: this.did.id,
      message: {
        protocol: this.protocolUri,
        recordId: playlistId
      }
    });
  }

  getPlaylists(){
    return this.dwn.records.query(this.did.id, {
      author: this.did.id,
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
    return this.dwn.records.create(this.did.id, {
      author: this.did.id,
      data: playlistJson,
      message: {
        protocol: this.protocolUri,
        schema: this.playlistSchema,
        dataFormat: 'application/json'
      }
    });
  }

  modifyPlaylist(){

  }

  getTrack(trackId){
    return this.dwn.records.read(this.did.id, {
      author: this.did.id,
      message: {
        recordId: trackId
      }
    });
  }

  async getTracks(){
    const response = await this.dwn.records.query(this.did.id, {
      author: this.did.id,
      message: {
        filter: {
          protocol: this.protocolUri,
          schema: this.trackSchema
        }
      }
    });
    return Promise.all(response.entries.map(async entry => {
      const json = await entry.data.json()
      entry.trackData = json;
      return entry;
    }))
  }

  async createTrack(trackJson){
    const response = await this.dwn.records.create(this.did.id, {
      author: this.did.id,
      data: trackJson,
      message: {
        protocol: this.protocolUri,
        schema: this.trackSchema,
        dataFormat: 'application/json'
      }
    });
    response.record.trackData = await response.record.data.json();
    return response.record;
  }

  async modifyTrack(){

  }

  async getAudioForTrack(trackId){
    const results = await this.dwn.records.query(this.did.id, {
      author: this.did.id,
      message: {
        filter: {
          protocol: this.protocolUri,
          parentId: trackId
        }
      }
    });
    const record = results.entries[0];
    if (!record) return;
    const stream = toWebStream(await record.data.stream())
    const blob = await (new Response(stream).blob({ type: record.dataFormat }));
    record.audioUrl = URL.createObjectURL(blob);
    return record;
  }

  async saveAudioForTrack(file, format, trackId){
    return this.dwn.records.create(this.did.id, {
      author: this.did.id,
      data: new Uint8Array(await file.arrayBuffer()), // rip this jank out when we get streams going again
      message: {
        parentId: trackId,
        contextId: trackId,
        protocol: this.protocolUri,
        schema: this.audioSchema,
        dataFormat: format
      }
    });
  }

}


export {
  Datastore
}