import { Component, Prop, State } from '@stencil/core';
import createHistory from '../../utils/createBrowserHistory';
import createHashHistory from '../../utils/createHashHistory';
import { LocationSegments, HistoryType, RouterHistory, RouteSubscription } from '../../global/interfaces';
import ActiveRouter from '../../global/active-router';


const HISTORIES: { [key in HistoryType]: Function } = {
  'browser': createHistory,
  'hash': createHashHistory
};

/**
  * @name Router
  * @module ionic
  * @description
 */
@Component({
  tag: 'stencil-router'
})
export class Router {
  @Prop() root: string = '/';

  @Prop() historyType: HistoryType = 'browser';

  // A suffix to append to the page title whenever
  // it's updated through RouteTitle
  @Prop() titleSuffix: string = '';

  @State() location: LocationSegments;
  @State() history: RouterHistory;

  asyncListeners: RouteSubscription[] = [];
  asyncGroups: { [groupId: string]: any } = {};

  componentWillLoad() {
    this.history = HISTORIES[this.historyType]();

    this.history.listen(async (location: LocationSegments) => {
      location = this.getLocation(location);
      this.location = location;
    });
    this.location = this.getLocation(this.history.location);
  }

  getLocation(location: LocationSegments): LocationSegments {
    // Remove the root URL if found at beginning of string
    const pathname = location.pathname.indexOf(this.root) == 0 ?
                     '/' + location.pathname.slice(this.root.length) :
                     location.pathname;

    return {
      ...location,
      pathname
    };
  }

  render() {
    const state = {
      location: this.location,
      titleSuffix: this.titleSuffix,
      root: this.root,
      history: this.history
    };

    return (
      <ActiveRouter.Provider state={state}>
        <slot />
      </ActiveRouter.Provider>
    );
  }
}
