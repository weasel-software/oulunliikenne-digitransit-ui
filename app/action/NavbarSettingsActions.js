/* eslint-disable import/prefer-default-export */

export function toggleItem(actionContext, item) {
  actionContext.dispatch('ToggleItem', item);
}
