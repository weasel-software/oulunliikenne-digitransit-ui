import Store from 'fluxible/addons/BaseStore';
import reactCookie from 'react-cookie';

/* Mode is stored in cookie
 */
class ModeStore extends Store {
  static storeName = 'ModeStore';

  constructor(dispatcher) {
    super(dispatcher);

    const { config } = dispatcher.getContext();
    this.availableModes = config.availableModes;
    this.defaultMode = config.defaultMode;

    const mode = reactCookie.load('mode');
    if (this.availableModes.indexOf(mode) === -1) {
      // illegal selection, use default
      this.mode = this.defaultMode;
    } else {
      this.mode = mode;
    }
  }

  getMode() {
    return this.mode;
  }

  setMode(mode) {
    if (this.availableModes.indexOf(mode) === -1) {
      return;
    }

    reactCookie.save('mode', mode, {
      // Good up to one year
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });
    this.mode = mode;
    this.emitChange();
  }

  static handlers = {
    SetMode: 'setMode',
  };
}

export default ModeStore;
