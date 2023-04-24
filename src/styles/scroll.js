import { css, unsafeCSS } from 'lit';

function styles (selector){
  return css`${unsafeCSS(`
    /* For Webkit-based browsers (Chrome, Safari) */
    ${selector}::-webkit-scrollbar {
      width: 10px;
    }

    ${selector}::-webkit-scrollbar-track {
      background: rgb(40, 40, 40);
    }

    ${selector}::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.25);
      border-radius: 6px;
      border: 2px solid rgb(40, 40, 40);
      background-clip: content-box;
    }

    /* For Firefox (version 64 and later) */
    ${selector} {
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.25) rgb(40, 40, 40);
    }

    /* For Edge */
    ${selector}::-ms-scrollbar {
      width: 10px;
    }

    ${selector}::-ms-scrollbar-track {
      background: rgb(40, 40, 40);
    }

    ${selector}::-ms-scrollbar-thumb {
      border-radius: 6px;
      border: 2px solid rgb(40, 40, 40);
      background-color: rgba(255, 255, 255, 0.25);
      background-clip: content-box;
    }
  `)}`
}

export {
  styles
}