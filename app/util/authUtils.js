export default function addDigitransitAuthParameter(config, url) {
  const key = config.SUBSCRIPTION_KEY;
  return `${url}?digitransit-subscription-key=${key}`;
}
