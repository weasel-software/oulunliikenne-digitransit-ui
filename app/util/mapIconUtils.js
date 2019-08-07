import memoize from 'lodash/memoize';
import getSelector from './get-selector';
import glfun from './glfun';

const FONT_SIZE = 11;

export const getCaseRadius = memoize(
  glfun({
    base: 1.15,
    stops: [[11.9, 0], [12, 1.5], [22, 26]],
  }),
);

export const getStopRadius = memoize(
  glfun({
    base: 1.15,
    stops: [[11.9, 0], [12, 1], [22, 24]],
  }),
);

export const getHubRadius = memoize(
  glfun({
    base: 1.15,
    stops: [[14, 0], [14.1, 2], [22, 20]],
  }),
);

export const getColor = memoize(mode => {
  const cssRule = mode && getSelector(`.${mode.toLowerCase()}`);
  return cssRule && cssRule.style.color;
});

function getImageFromSpriteSync(icon, width, height, fill) {
  if (!document) {
    return null;
  }
  const symbol = document.getElementById(icon);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  const vb = symbol.viewBox.baseVal;
  svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.width} ${vb.height}`);
  if (fill) {
    svg.setAttribute('fill', fill);
  }
  // TODO: Simplify after https://github.com/Financial-Times/polyfill-service/pull/722 is merged
  Array.prototype.forEach.call(symbol.childNodes, node => {
    const child = node.cloneNode(true);
    if (node.style && !child.attributes.fill) {
      child.style.fill = window.getComputedStyle(node).color;
    }
    svg.appendChild(child);
  });
  const image = new Image(width, height);
  image.src = `data:image/svg+xml;base64,${btoa(
    new XMLSerializer().serializeToString(svg),
  )}`;
  return image;
}

function getImageFromSpriteAsync(icon, width, height, fill) {
  return new Promise(resolve => {
    // TODO: check that icon exists using MutationObserver
    const image = getImageFromSpriteSync(icon, width, height, fill);
    image.onload = () => resolve(image);
  });
}

const getImageFromSpriteCache = memoize(
  getImageFromSpriteAsync,
  (icon, w, h, fill) => `${icon}_${w}_${h}_${fill}`,
);

function changeImageColor(image, hex) {
  const base64 = image.src.replace(/^.+base64,/, '').replace(/"?\)$/, '');
  const xml = window
    .atob(base64)
    .replace(/fill="#[A-Za-z0-9]+"/, `fill="${hex}"`);
  const newBase64 = window.btoa(xml);
  const newSrc = `data:image/svg+xml;base64,${newBase64}`;
  // eslint-disable-next-line no-param-reassign
  image.src = newSrc;
}

function drawIconImage(image, tile, geom, width, height) {
  tile.ctx.drawImage(
    image,
    geom.x / tile.ratio - width / 2,
    geom.y / tile.ratio - height / 2,
  );
}

function calculateIconBadgePosition(
  coord,
  tile,
  imageSize,
  badgeSize,
  scaleratio,
) {
  return coord / tile.ratio - imageSize / 2 - badgeSize / 2 + 2 * scaleratio;
}

function drawIconImageBadge(
  image,
  tile,
  geom,
  imageSize,
  badgeSize,
  scaleratio,
) {
  tile.ctx.drawImage(
    image,
    calculateIconBadgePosition(geom.x, tile, imageSize, badgeSize, scaleratio),
    calculateIconBadgePosition(geom.y, tile, imageSize, badgeSize, scaleratio),
  );
}

/* eslint-disable no-param-reassign */
export function drawRoundIcon(tile, geom, type, large, platformNumber) {
  const scale = large ? 2 : 1;
  const caseRadius = getCaseRadius(tile.coords.z) * scale;
  const stopRadius = getStopRadius(tile.coords.z) * scale;
  const hubRadius = getHubRadius(tile.coords.z) * scale;

  if (caseRadius > 0) {
    tile.ctx.beginPath();
    tile.ctx.fillStyle = '#fff';
    tile.ctx.arc(
      geom.x / tile.ratio,
      geom.y / tile.ratio,
      caseRadius * tile.scaleratio,
      0,
      Math.PI * 2,
    );
    tile.ctx.fill();

    tile.ctx.beginPath();
    tile.ctx.fillStyle = getColor(type);
    tile.ctx.arc(
      geom.x / tile.ratio,
      geom.y / tile.ratio,
      stopRadius * tile.scaleratio,
      0,
      Math.PI * 2,
    );
    tile.ctx.fill();

    if (hubRadius > 0) {
      tile.ctx.beginPath();
      tile.ctx.fillStyle = '#fff';
      tile.ctx.arc(
        geom.x / tile.ratio,
        geom.y / tile.ratio,
        hubRadius * tile.scaleratio,
        0,
        Math.PI * 2,
      );
      tile.ctx.fill();

      // The text requires 14 pixels in width, so we draw if the hub radius is at least half of that
      if (platformNumber && hubRadius > 7) {
        tile.ctx.font = `${1.2 *
          hubRadius *
          tile.scaleratio}px Gotham XNarrow SSm A, Gotham XNarrow SSm B, Arial, sans-serif`;
        tile.ctx.fillStyle = '#333';
        tile.ctx.textAlign = 'center';
        tile.ctx.textBaseline = 'middle';
        tile.ctx.fillText(
          platformNumber,
          geom.x / tile.ratio,
          geom.y / tile.ratio,
        );
      }
    }
  }
}

export function drawTerminalIcon(tile, geom, type, name) {
  const iconSize = (getStopRadius(tile.coords.z) * 2.5 + 8) * tile.scaleratio;
  getImageFromSpriteCache(
    `icon-icon_${type.split(',')[0].toLowerCase()}`,
    iconSize,
    iconSize,
  ).then(image => {
    tile.ctx.drawImage(
      image,
      geom.x / tile.ratio - iconSize / 2,
      geom.y / tile.ratio - iconSize / 2,
    );

    if (name) {
      /* eslint-disable no-param-reassign */
      tile.ctx.fillStyle = '#333';
      tile.ctx.strokeStyle = 'white';
      tile.ctx.lineWidth = 2 * tile.scaleratio;
      tile.ctx.textAlign = 'center';
      tile.ctx.textBaseline = 'top';
      tile.ctx.font = `500 ${FONT_SIZE * tile.scaleratio}px
          Gotham Rounded SSm A, Gotham Rounded SSm B, Arial, Georgia, Serif`;
      let y = iconSize / 2 + 2 * tile.scaleratio;
      name.split(' ').forEach(part => {
        tile.ctx.strokeText(part, geom.x / tile.ratio, geom.y / tile.ratio + y);
        tile.ctx.fillText(part, geom.x / tile.ratio, geom.y / tile.ratio + y);
        y += (FONT_SIZE + 2) * tile.scaleratio;
      });
    }
  });
}

export function drawParkingStationIcon(tile, geom, imageSize) {
  return getImageFromSpriteCache(
    'icon-icon_parking-station',
    imageSize,
    imageSize,
  ).then(image => {
    drawIconImage(image, tile, geom, imageSize, imageSize);
  });
}

export function drawCameraStationIcon(tile, geom, imageSize) {
  getImageFromSpriteCache(
    'icon-icon_camera-station',
    imageSize,
    imageSize,
  ).then(image => {
    drawIconImage(image, tile, geom, imageSize, imageSize);
  });
}

export function drawRoadworkIcon(tile, geom, imageSize) {
  getImageFromSpriteCache('icon-icon_roadwork', imageSize, imageSize).then(
    image => {
      const minPos = imageSize * tile.scaleratio;
      const maxPos = tile.tileSize * tile.ratio - minPos;

      geom.x = geom.x < minPos ? minPos : geom.x;
      geom.y = geom.y < minPos ? minPos : geom.y;
      geom.x = geom.x > maxPos ? maxPos : geom.x;
      geom.y = geom.y > maxPos ? maxPos : geom.y;

      drawIconImage(image, tile, geom, imageSize, imageSize);
    },
  );
}

export function drawRoadworkPath(tile, points, color = '#0073BF') {
  const { lineCap, lineJoin } = tile.ctx;
  tile.ctx.lineCap = 'round';
  tile.ctx.lineJoin = 'round';
  tile.ctx.globalCompositeOperation = 'destination-over';

  tile.ctx.beginPath();
  for (let i = 0, ref = points.length; i < ref; i++) {
    if (i === 0) {
      tile.ctx.moveTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    } else {
      tile.ctx.lineTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    }
  }

  tile.ctx.strokeStyle = color;
  tile.ctx.lineWidth = 5;
  tile.ctx.stroke();

  tile.ctx.lineCap = lineCap;
  tile.ctx.lineJoin = lineJoin;
  tile.ctx.globalCompositeOperation = 'source-over';
}

export function drawDisorderIcon(tile, geom, imageSize, color) {
  getImageFromSpriteCache('icon-icon_disorder', imageSize, imageSize).then(
    image => {
      const minPos = imageSize * tile.scaleratio;
      const maxPos = tile.tileSize * tile.ratio - minPos;

      geom.x = geom.x < minPos ? minPos : geom.x;
      geom.y = geom.y < minPos ? minPos : geom.y;
      geom.x = geom.x > maxPos ? maxPos : geom.x;
      geom.y = geom.y > maxPos ? maxPos : geom.y;

      if (color) {
        const imageClone = image.cloneNode(true);
        changeImageColor(imageClone, color);

        setTimeout(
          () => drawIconImage(imageClone, tile, geom, imageSize, imageSize),
          0,
        );
      } else {
        drawIconImage(image, tile, geom, imageSize, imageSize);
      }
    },
  );
}

export function drawDisorderPath(tile, points, color = '#0073BF') {
  const { lineCap, lineJoin } = tile.ctx;
  tile.ctx.lineCap = 'round';
  tile.ctx.lineJoin = 'round';
  tile.ctx.globalCompositeOperation = 'destination-over';

  tile.ctx.beginPath();
  for (let i = 0, ref = points.length; i < ref; i++) {
    if (i === 0) {
      tile.ctx.moveTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    } else {
      tile.ctx.lineTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    }
  }
  tile.ctx.strokeStyle = color;
  tile.ctx.lineWidth = 5;
  tile.ctx.stroke();

  tile.ctx.lineCap = lineCap;
  tile.ctx.lineJoin = lineJoin;
  tile.ctx.globalCompositeOperation = 'source-over';
}

export function drawDisorderPolygon(tile, points, color = '#0073BF') {
  tile.ctx.beginPath();
  for (let i = 0, ref = points.length; i < ref; i++) {
    if (i === 0) {
      tile.ctx.moveTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    } else {
      tile.ctx.lineTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    }
  }
  tile.ctx.strokeStyle = color;
  tile.ctx.lineWidth = 5;
  // tile.ctx.lineWidth = 5 * tile.scaleratio;
  tile.ctx.stroke();

  const { globalAlpha } = tile.ctx;
  tile.ctx.globalAlpha = 0.2;
  tile.ctx.fillStyle = color;
  tile.ctx.fill();

  tile.ctx.globalAlpha = globalAlpha;
}

export function drawRoadConditionIcon(tile, geom, imageSize) {
  getImageFromSpriteCache(
    'icon-icon_road_condition',
    imageSize,
    imageSize,
  ).then(image => {
    const minPos = imageSize * tile.scaleratio;
    const maxPos = tile.tileSize * tile.ratio - minPos;

    geom.x = geom.x < minPos ? minPos : geom.x;
    geom.y = geom.y < minPos ? minPos : geom.y;
    geom.x = geom.x > maxPos ? maxPos : geom.x;
    geom.y = geom.y > maxPos ? maxPos : geom.y;

    drawIconImage(image, tile, geom, imageSize, imageSize);
  });
}

export function drawRoadConditionPath(tile, points, color = '#999999') {
  const { lineCap, lineJoin } = tile.ctx;
  tile.ctx.lineCap = 'round';
  tile.ctx.lineJoin = 'round';
  tile.ctx.globalCompositeOperation = 'destination-over';

  tile.ctx.beginPath();
  for (let i = 0, ref = points.length; i < ref; i++) {
    if (i === 0) {
      tile.ctx.moveTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    } else {
      tile.ctx.lineTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    }
  }

  tile.ctx.strokeStyle = color;
  tile.ctx.lineWidth = 5;
  tile.ctx.stroke();

  tile.ctx.lineCap = lineCap;
  tile.ctx.lineJoin = lineJoin;
  tile.ctx.globalCompositeOperation = 'source-over';
}

export function drawFluencyIcon(tile, geom, imageSize) {
  getImageFromSpriteCache('icon-icon_fluency', imageSize, imageSize).then(
    image => {
      const minPos = imageSize * tile.scaleratio;
      const maxPos = tile.tileSize * tile.ratio - minPos;

      geom.x = geom.x < minPos ? minPos : geom.x;
      geom.y = geom.y < minPos ? minPos : geom.y;
      geom.x = geom.x > maxPos ? maxPos : geom.x;
      geom.y = geom.y > maxPos ? maxPos : geom.y;

      drawIconImage(image, tile, geom, imageSize, imageSize);
    },
  );
}

export function drawFluencyPath(
  tile,
  points,
  color = '#999999',
  lineWidth = 5,
  feather = false,
) {
  const { lineCap, lineJoin, filter } = tile.ctx;
  tile.ctx.lineCap = 'round';
  tile.ctx.lineJoin = 'round';
  tile.ctx.globalCompositeOperation = 'destination-over';

  if (feather) {
    tile.ctx.filter = 'blur(2px)';
  }

  tile.ctx.beginPath();
  for (let i = 0, ref = points.length; i < ref; i++) {
    if (i === 0) {
      tile.ctx.moveTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    } else {
      tile.ctx.lineTo(points[i].x / tile.ratio, points[i].y / tile.ratio);
    }
  }

  tile.ctx.strokeStyle = color;
  tile.ctx.lineWidth = lineWidth;
  tile.ctx.stroke();
  tile.ctx.lineCap = lineCap;
  tile.ctx.lineJoin = lineJoin;
  tile.ctx.filter = filter;
  tile.ctx.globalCompositeOperation = 'source-over';
}

export function drawParkAndRideIcon(tile, geom, width, height) {
  getImageFromSpriteCache('icon-icon_park-and-ride', width, height).then(
    image => {
      drawIconImage(image, tile, geom, width, height);
    },
  );
}

export function drawWeatherStationIcon(tile, geom, imageSize) {
  getImageFromSpriteCache(
    'icon-icon_weather-station',
    imageSize,
    imageSize,
  ).then(image => {
    drawIconImage(image, tile, geom, imageSize, imageSize);
  });
}

export function drawTmsStationIcon(tile, geom, imageSize) {
  getImageFromSpriteCache('icon-icon_tms-station', imageSize, imageSize).then(
    image => {
      drawIconImage(image, tile, geom, imageSize, imageSize);
    },
  );
}

export function drawEcoCounterIcon(tile, geom, imageSize) {
  getImageFromSpriteCache('icon-icon_eco-counter', imageSize, imageSize).then(
    image => {
      drawIconImage(image, tile, geom, imageSize, imageSize);
    },
  );
}

export function drawCitybikeIcon(tile, geom, imageSize) {
  return getImageFromSpriteCache(
    'icon-icon_citybike',
    imageSize,
    imageSize,
  ).then(image => drawIconImage(image, tile, geom, imageSize, imageSize));
}

export function drawCitybikeOffIcon(tile, geom, imageSize) {
  return getImageFromSpriteCache(
    'icon-icon_citybike_off',
    imageSize,
    imageSize,
  ).then(image => drawIconImage(image, tile, geom, imageSize, imageSize));
}

export function drawCitybikeNotInUseIcon(tile, geom, imageSize) {
  return getImageFromSpriteCache(
    'icon-icon_not-in-use',
    imageSize,
    imageSize,
  ).then(image => drawIconImage(image, tile, geom, imageSize, imageSize));
}

export function drawAvailabilityBadge(
  availability,
  tile,
  geom,
  imageSize,
  badgeSize,
  scaleratio,
) {
  if (
    availability !== 'good' &&
    availability !== 'poor' &&
    availability !== 'no'
  ) {
    throw Error("Supported badges are 'good', 'poor', and 'no'");
  }

  getImageFromSpriteCache(
    `icon-icon_${availability}-availability`,
    badgeSize,
    badgeSize,
  ).then(image => {
    drawIconImageBadge(image, tile, geom, imageSize, badgeSize, scaleratio);
  });
}

export function drawIcon(icon, tile, geom, imageSize) {
  getImageFromSpriteCache(icon, imageSize, imageSize).then(image => {
    drawIconImage(image, tile, geom, imageSize, imageSize);
  });
}

/* eslint-disable no-param-reassign */
export function drawAvailabilityValue(
  tile,
  geom,
  value,
  imageSize,
  badgeSize,
  scaleratio,
  color,
  fontColor,
) {
  const radius = badgeSize / 2;
  const x =
    calculateIconBadgePosition(geom.x, tile, imageSize, radius, scaleratio) + 1;
  const y =
    calculateIconBadgePosition(geom.y, tile, imageSize, radius, scaleratio) + 1;

  tile.ctx.beginPath();
  tile.ctx.fillStyle = color || (value > 3 ? '#4EA700' : '#FF6319');
  tile.ctx.arc(x, y, radius, 0, Math.PI * 2);
  tile.ctx.fill();

  tile.ctx.font = `${(value > 99 ? 0.5 : 0.7) * badgeSize}px
    Gotham XNarrow SSm A, Gotham XNarrow SSm B, Arial, sans-serif`;
  tile.ctx.fillStyle = fontColor || '#fff';
  tile.ctx.textAlign = 'center';
  tile.ctx.textBaseline = 'middle';
  tile.ctx.fillText(value, x, y);
}
