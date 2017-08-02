import {FrameworkConfiguration} from 'aurelia-framework';
import {Router} from 'aurelia-router';

export function configure(config: FrameworkConfiguration) {
  const router = config.container.get(Router);
  router.addRoute({ route: 'home', name: 'home', moduleId: 'pages/home/main', nav: true });
}