/* eslint-disable import/prefer-default-export */

export function setMode(actionContext, mode) {
  actionContext.dispatch('SetMode', mode);
}
