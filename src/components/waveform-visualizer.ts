
import { LitElement, css, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import { getAudioData, linearPath, polarPath } from 'waveform-path';

const visualizationTypes = {
  linear: {
    processor: linearPath,
    options: {
      samples: 100,
      type: 'bars',
      top: 20,
      normalize: false,
      paths: [
          {d:'V', sy: 0, x:50, ey:100 }
      ]
    }
  },
  polar: {
    processor: polarPath,
    options: {
      samples: 90,
      type: 'steps',
      left: 200, top: 200, distance: 100, length: 100,
      normalize: false,
      paths: [
          {d:'L', sdeg:0, sr:0,  edeg:0, er:90 },
          {d:'A', sdeg:0, sr:90, edeg: 100, er:90, rx: 5, ry: 5, angle: 100, arc: 1, sweep: 1 },
          {d:'L', sdeg:100, sr:90,  edeg:100, er:0 },
      ]
    }
  }
}

@customElement('waveform-visualizer')
export class WaveformVisualizer extends LitElement {
  constructor (){
    super();
  }

  get type (){
    const type = this.getAttribute('type');
    return visualizationTypes[type] ? type : 'linear';
  }

  async connect (element, options = {}){
    if (this.audioContext) {
      this.audioProcessor.disconnect(this.audioContext.destination);
    }

    this.audioElement = element;
    const context = this.audioContext = new AudioContext();
    await context.audioWorklet.addModule('../utils/audio-processor.js');

    const source = this.audioSource = context.createMediaElementSource(element);
    const worklet = this.audioWorklet = new AudioWorkletNode(context, 'audio-processor');

    source.connect(worklet);
    worklet.connect(context.destination);

    // const analyzer = this.audioAnalyzer = context.createAnalyser();
    // const playbackGain = this.playbackGain = context.createGain();
    // const visualGain = this.visualGain = context.createGain();

    // source.connect(playbackGain);
    // source.connect(visualGain);
    // playbackGain.connect(context.destination);
    // visualGain.connect(analyzer);

    const visualization = visualizationTypes[this.type];
    worklet.port.onmessage = (event) => {
      if (event.data.input) {
        const waveform = new WaveformPath({
          samples: 100,
          type: 'linear',
          top: 20,
          normalize: false,
        });

        const path = waveform.generate(event.data.input);
        document.querySelector('#waveform path').setAttribute('d', path);
      }
    };

    this.draw(new Uint8Array(analyzer.frequencyBinCount), options);

    this.audioElement.onplay = () => {
      if (context.state === 'suspended') {
        context.resume();
      }
    };

    this.audioElement.onpause = () => {
      context.suspend();
    };
  }

  draw (dataArray, options){
    console.log(dataArray);
    this.audioAnalyzer.getByteFrequencyData(dataArray);
    const visualization = visualizationTypes[this.type];
    const waveform = visualization.processor(Object.assign(visualization.options, options));
    this.renderRoot.querySelector('#path').setAttribute('d', waveform.generate(dataArray));
    requestAnimationFrame(() => this.draw(dataArray, options));
  }

  render (){
    return html`
      <svg id="svg" height="100%" width="100%">
        <path id="path" style="fill:none; stroke-width: 4px; stroke-linecap: round; stroke:url(#lgrad)"></path>
      </svg>
    `
  }
}