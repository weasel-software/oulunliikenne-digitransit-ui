# oulunliikenne-digitransit-ui

This is a fork of [Digitransit-ui](https://github.com/HSLdevcom/digitransit-ui) for the creation of a city specific version for the city of Oulu.

To keep the branches separate from the remote ones this version is using ol-develop and ol-master:  
**ol-develop** - When code is pushed to this branch the [development](https://next-dev.oulunliikenne.fi/) site will be automatically updated  
**ol-master** - When code is pushed to this branch the [live](https://www.oulunliikenne.fi/) site will be automatically updated

**Running locally:**
- `yarn install`
- `CONFIG=oulu yarn run dev` to start the Oulu version

**Configure Git Hooks**
- `ln -s ../../hooks/pre-commit.sh .git/hooks/pre-commit`
- `ln -s ../../hooks/pre-push.sh .git/hooks/pre-push` 

[development site](https://next-dev.oulunliikenne.fi/)  
[live site](https://www.oulunliikenne.fi/)

---

Digitransit-ui is a mobile friendly User interface built to work with Digitransit platform

## Licensing
The source code of the platform is dual-licensed under the EUPL v1.2 and AGPLv3 licenses.

## Issues
Our main issue tracking is handled in [https://digitransit.atlassian.net](https://digitransit.atlassian.net)
However, we also monitor this repository's issues and import them to Jira. You can create issues in GitHub.

## Demos
* [https://reittiopas.hsl.fi - Helsinki city area demo](https://reittiopas.hsl.fi/)
* [https://opas.matka.fi/ - National demo](https://opas.matka.fi/)

## Testing

Digitransit-ui is tested to work on the latest and the second latest major versions of Firefox, Chrome, Safari and Edge. Additionally, latest version of IE and couple of latest versions Samsung Internet for Android should work almost optimally. For automated testing we use [Nightwatch](http://nightwatchjs.org/) and [BrowserStack](http://browserstack.com/).
- Continuous Integration: [https://travis-ci.org/HSLdevcom/digitransit-ui](https://travis-ci.org/HSLdevcom/digitransit-ui)
- BrowserStack (not public): [BrowserStack](http://www.browserstack.com/)

Visual tests are run with Gemini. The images must be created using same browser on same platform to eliminate font rendering issues. We use BrowserStack for that too.

More information about [testing](docs/Tests.md).

## Documentation
* [Terms](docs/Terms.md)
* [Architecture](docs/Architecture.md)
* [Positioning](docs/Position.md)
* [Locations](docs/Location.md)
* [Run in Docker](docs/Docker.md)
* [Style guide](http://beta.digitransit.fi/styleguide)
* [Installation](docs/Installation.md)
* [Tests](docs/Tests.md)
* [Z-Index Index](docs/ZIndex.md)
* [Benchmark results and UX](docs/JSBenchmark.md)
* [Navigation](docs/Navigation.md)
* [Themes](docs/Themes.md)
