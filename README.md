# YowJS
[![Maintenance Status][status-image]][status-url] [![NPM Version][npm-image]][npm-url] [![Dependency Status][deps-image]][deps-url] [![Build Status][travis-image]][travis-url] [![Code Climate][climate-image]][climate-url]

## What is it?

### About the package

`yowjs` is a node module, distributed via NPM and allows you to easily intergrate `yowsup` (Python library) into a node application. `yowjs` is essantially an event
based proxy and allows you easily to communicate with `yowsup` without any Python being involved.

## Usage

Add `yowjs` you your package.json file and install it via npm install. `yowjs` is dependent on `yowsup` and must be install manually.

```
npm install yowjs --save-dev
```

## Install `yowsup` (globally)
```
sudo easy_install yowsup2
```

### Example code

```
const YowJS = require('yowjs');

let yowsup = new YowJS();

// init the connection params
yowsup.initialize(
    config.countryCode,
    config.phoneNumber,
    config.password
)
.on('ON_MESSAGE', message => { // bind to incoming events from yowsup cli
    console.log(['incoming msg', message]);
})
.on('LINK_DEAD', () => {
    // re-init, connection lost
    console.log('connection lost');
})
.connect(); // establish connection.
```


## Building
Clone this repo (or fork it)
```
git clone git@github.com:landrover/yowjs.git
```
Install deps
```
npm install
```

### Todo
 * comments

## MIT Licenced

[npm-url]: https://npmjs.org/package/yowjs
[npm-image]: https://img.shields.io/npm/v/yowjs.svg?style=flat

[travis-url]: https://travis-ci.org/LandRover/YowJS
[travis-image]: https://img.shields.io/travis/LandRover/YowJS.svg?style=flat

[deps-url]: https://gemnasium.com/LandRover/YowJS
[deps-image]: https://img.shields.io/gemnasium/LandRover/YowJS.svg?style=flat

[climate-url]: https://codeclimate.com/github/LandRover/YowJS
[climate-image]: https://img.shields.io/codeclimate/github/LandRover/YowJS.svg?style=flat

[status-url]: https://github.com/LandRover/YowJS/pulse
[status-image]: https://img.shields.io/badge/status-maintained-brightgreen.svg?style=flat