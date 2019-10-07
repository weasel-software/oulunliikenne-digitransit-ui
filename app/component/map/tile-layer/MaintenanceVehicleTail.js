import L from 'leaflet';
import { drawMaintenanceVehicleTail } from '../../../util/mapIconUtils';
import { latLngToTilePoint } from '../../../util/coordinatesUtils';
import { MaintenanceJobColors } from '../../../constants';

class MaintenanceVehicleTail {
  constructor(tile, config) {
    this.tile = tile;
    this.config = config;

    this.promise = this.getPromise();
  }

  static getName = () => 'realtimeMaintenanceVehicles';

  getPromise = () =>
    new Promise(resolve => {
      this.drawTail();
      resolve();
    });

  drawTail = () => {
    const { coords, tileSize, scaleratio, map } = this.tile;

    const size = new L.Point(tileSize / scaleratio, tileSize / scaleratio);
    const nwPoint = coords.scaleBy(size);
    const nePoint = coords.scaleBy(size).add(size);

    const nwLatLng = map.unproject(nwPoint, coords.z);
    const neLatLng = map.unproject(nePoint);

    const tileBounds = new L.LatLngBounds(nwLatLng, neLatLng);

    const points = [];
    let jobId = null;
    this.tile.props.maintenanceVehicleTail.forEach(item => {
      const tailLatLng = new L.LatLng(item.lat, item.long);
      [jobId] = item.jobIds;

      if (tileBounds.contains(tailLatLng)) {
        const point = latLngToTilePoint(item.lat, item.long, this.tile);

        points.push(point);
      }
    });

    if (points.length) {
      drawMaintenanceVehicleTail(
        this.tile,
        points,
        MaintenanceJobColors[jobId],
      );
    }
  };
}

export default MaintenanceVehicleTail;
