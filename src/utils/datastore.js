

import { Web5 } from '@tbd54566975/web5';

const web5 = new Web5();
console.log(web5);

let userDID;
const protocolUri = 'mu5ic';

/* Playlists */

const playlistSchema = 'mu5ic/playlist';

function getPlaylist(playlistId){
  return web5.dwn.records.read(userDID, {
    author: userDID,
    message: {
      recordId: playlistId
    }
  });
}

function getPlaylists(){
  return web5.dwn.records.query(userDID, {
    author: userDID,
    message: {
      filter: {
        protocol: protocolUri,
        schema: playlistSchema
      }
    }
  });
}

function getPlaylistMap(){
  return {
    'Rap': 'ID_1',
    'Classic Rock': 'ID_2',
    'Alternative': 'ID_3'
  }
}

function createPlaylist(playlistJson){
  return web5.dwn.records.write(userDID, {
    author: userDID,
    data: playlistJson,
    message: {
      dataFormat: 'application/json'
    }
  });
}

function modifyPlaylist(){

}

/* Tracks */

const trackSchema = 'mu5ic/track';

function getTrack(trackId){
  return web5.dwn.records.read(userDID, {
    author: userDID,
    message: {
      recordId: trackId
    }
  });
}

function getTracks(){
  return web5.dwn.records.query(userDID, {
    author: userDID,
    message: {
      filter: {
        protocol: protocolUri,
        schema: trackSchema
      }
    }
  });
}

function createTrack(trackJson){
  return web5.dwn.records.write(userDID, {
    author: userDID,
    data: trackJson,
    message: {
      dataFormat: 'application/json'
    }
  });
}

function modifyTrack(){

}

/* Audio */

function getAudio(fileId){

}

function saveAudio(file, trackId){
  return web5.dwn.records.write(userDID, {
    author: userDID,
    data: trackJson,
    message: {
      dataFormat: 'application/json'
    }
  });
}


export {
  getPlaylist,
  getPlaylists,
  getPlaylistMap,
  createPlaylist,
  modifyPlaylist,
  getTrack,
  getTracks,
  createTrack,
  modifyTrack,
  getAudio
}