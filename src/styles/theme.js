
import * as styles from '@vaadin/vaadin-lumo-styles/all-imports';

const style = document.createElement('style');
      style.innerHTML = [
        'color',
        'typography'
      ].map(z => styles[z].toString())
      document.head.appendChild(style);