import mergeWith from 'lodash/mergeWith';

// in case of arrays, replace instead of merge
function arrayReplacer(objValue, srcValue) {
  if (Array.isArray(srcValue) && Array.isArray(objValue)) {
    return srcValue;
  }
  return undefined;
}

// merge two arrays by identifying array items by their 'header' field.
// matching src values overwrite objvalues
function aboutMerger(objValue, srcValue) {
  if (Array.isArray(srcValue) && Array.isArray(objValue)) {
    const merged = [];
    for (let i = 0; i < objValue.length; i++) {
      for (let j = 0; j < srcValue.length; j++) {
        if (srcValue[j].header === objValue[i].header) {
          merged[i] = mergeWith(objValue[i], srcValue[j], arrayReplacer);
          break;
        }
      }
      if (!merged[i]) {
        // not found from srcValue
        merged[i] = objValue[i];
      }
    }
    // copy additional fields
    for (let i = objValue.length; i < srcValue.length; i++) {
      merged[i] = srcValue[i];
    }
    return merged;
  }
  return undefined; // Otherwise use default customizer
}

function merger(objValue, srcValue, key) {
  if (key === 'aboutThisService') {
    // property inheritance from objValue to srcValue
    return mergeWith({}, objValue, srcValue, aboutMerger);
  }
  if (Array.isArray(srcValue)) {
    return srcValue;
  } // Return only latest if array
  if (Array.isArray(objValue)) {
    return objValue;
  }

  return undefined; // Otherwise use default customizer
}

export default function configMerger(obj, src) {
  return mergeWith({}, obj, src, merger);
}
