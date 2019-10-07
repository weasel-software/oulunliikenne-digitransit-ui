import L from 'leaflet';

// eslint-disable-next-line import/prefer-default-export
export const latLngToTilePoint = (lat, lng, tile) => {
  const { map, coords, tileSize, scaleratio } = tile;
  const size = new L.Point(tileSize / scaleratio, tileSize / scaleratio);

  const projected = map.project(new L.LatLng(lat, lng), coords.z);

  return projected
    .unscaleBy(size)
    .subtract(coords)
    .scaleBy(size)
    .multiplyBy(scaleratio);
};
