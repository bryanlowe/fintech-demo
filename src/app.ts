import {Router, RouterConfiguration} from 'aurelia-router';

function findDefaultRoute(router) {
  return router.navigation[0].relativeHref;
}

export class App {
  public year: number;
  public router: Router;
  
  constructor() {
    this.year = (new Date()).getFullYear();
  }

  public configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.map([
      { route: '', redirect: findDefaultRoute(router) } 
    ]);
    config.mapUnknownRoutes('not-found');
  }
}
