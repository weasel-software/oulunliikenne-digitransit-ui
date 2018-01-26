/* eslint-disable import/prefer-default-export */

export function shadeColor(color, factor) {
  var f=parseInt(color.slice(1),16),t=factor<0?0:255,p=factor<0?factor*-1:factor,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}
