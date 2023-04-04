import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { styles } from '../styles/shared-styles'

import '@shoelace-style/shoelace/dist/components/card/card.js';

@customElement('page-explore')
export class PageExplore extends LitElement {
  static styles = [
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
    `
  ]

  constructor() {
    super();
  }

  render() {
    return html`
      <section>
        TEST EXPLORE
      </section>

      <sl-drawer placement="top" class="drawer-placement-top">
        <sl-input placeholder="Enter a DID to explore its music" clearable></sl-input>
      </sl-drawer>
    `;
  }
}
