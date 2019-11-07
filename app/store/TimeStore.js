import Store from 'fluxible/addons/BaseStore';
import moment from 'moment';
import { isBrowser } from '../util/browser';

class TimeStore extends Store {
  static storeName = 'TimeStore';
  static TWICE_PER_MINUTE = 30 * 1000;

  constructor(dispatcher) {
    super(dispatcher);
    this.updateCurrentTime();

    if (isBrowser) {
      // This causes a memory leak on server side.
      setInterval(this.updateCurrentTime, TimeStore.TWICE_PER_MINUTE);
    }
  }

  updateCurrentTime = () => {
    this.currentTime = moment();

    this.emitChange({
      currentTime: this.currentTime,
    });
  };

  getCurrentTime() {
    return this.currentTime.clone();
  }

  static handlers = {};
}

export default TimeStore;
