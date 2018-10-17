import Store from 'fluxible/addons/BaseStore';
import reactCookie from 'react-cookie';

/* Mode is stored in cookie
 */
class NavbarSettingsStore extends Store {
  static storeName = 'NavbarSettingsStore';

  constructor(dispatcher) {
    super(dispatcher);

    const { config } = dispatcher.getContext();
    const navbarSettings = reactCookie.load('navbarSettings');

    if (config.navbarSettings && navbarSettings) {
      this.navbarSettings = Object.keys(navbarSettings)
        .filter(key => config.navbarSettings.hasOwnProperty(key))
        .reduce((obj, key) => {
          obj[key] = navbarSettings[key];
          return obj;
        }, {});
    } else {
      this.navbarSettings = config.navbarSettings;
    }
  }

  getNavbarSettings() {
    return this.navbarSettings;
  }

  toggleItem(item) {
    if (!this.navbarSettings.hasOwnProperty(item)) {
      return;
    }

    this.navbarSettings[item] = !this.navbarSettings[item];

    reactCookie.save('navbarSettings', this.navbarSettings, {
      // Good up to one year
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
    });
    this.emitChange();
  }

  static handlers = {
    ToggleItem: 'toggleItem',
  };
}

export default NavbarSettingsStore;
