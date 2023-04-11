
import { Router } from '@lit-labs/router';

// const style = document.createElement('style');
// const sheet = document.head.appendChild(style).sheet;
// const index = sheet.insertRule('p { color: blue; }', 0);

// function updateColor(color) {
//   const rule = sheet.cssRules[index];
//   rule.style.color = color;
// }

export class AppRouter extends Router {
  constructor(element, routes){
    super(element, routes.map((enteringRoute, i, routes) => {
      const selector = enteringRoute.component;
      if (typeof selector === 'string') {
        enteringRoute.component = () => element.renderRoot.querySelector(selector);
      }
      enteringRoute.enter = async () => {
        await Promise.all(
          routes.reduce((promises, leavingRoute) => {
            const leavingComponent = leavingRoute.component();
            const enteringComponent = enteringRoute.component();
            leavingComponent?.removeAttribute('state');
            enteringComponent?.setAttribute('state', 'active');
            if (leavingComponent !== enteringComponent) {
              promises.push(leavingComponent?.onPageLeave?.())
            }
            return promises;
          }, [enteringRoute.component()?.onPageEnter?.()])
        );
      }
      return enteringRoute;
    }))
  }
}