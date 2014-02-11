Cryptonaut
==========
Explore and manipulate zero-knowledge, cloud-based [Crypton](https://crypton.io) key/value databases.

Cryptonaut demonstrates a simple mapping of the fundamental [Backbone](http://backbonejs.org/) elements - collections and models - onto Crypton's corresponding containers and entries.  This mapping is handily deployed as a tool for navigation and manipulation of any Crypton data stores to which you have authorized access.

The app infrastructure is shamelessly stolen from Tommy-Carols Williams [Encryptr](https://github.com/devgeeks/Encryptr).  We build upon his implementation, with the addition of Ken's folders work.

It is currently aimed to work on iOS, Android, and the Desktop – thanks to [node-webkit](https://github.com/rogerwang/node-webkit) – but there are no reasons why it could not by expanded to Blackberry10 and Windows Phone 8.

## Requirements

- Cordova CLI - [https://github.com/apache/cordova-cli/](https://github.com/apache/cordova-cli/)
	- Cordova / PhoneGap command line interface
- Grunt - [http://gruntjs.com/](http://gruntjs.com/)
	- Build tool for minimising, running and tests
- Node and npm - [http://nodejs.org/](http://nodejs.org/)
	- Node package manager for Grunt Add-ons
- PhantomJS - [http://phantomjs.org/](http://phantomjs.org/)
	- Headless webkit for running tests

## Getting started

- clone the project
- cd into the project folder
- `npm install` to install node_modules and js/css components (`npm install` will also run `bower install`).
- `cordova platform add ios` and/or `cordova platform add android`
- `npm run pluginstall` to install any plugins needed

## First test

To make sure everything is set up from the above, run your first tests:

   `grunt test`

See the output for the steps taken to produce the working test rig. Most of the steps have `grunt` commands you can use to do them individually.

## Workflow

JavaScript files are in `src`. They are kept out of the www tree so that they can be linted without trying to lint the concatenated and minified versions. However, the index.html should have a script tag only for the JavaScript files in either `components` (managed by Bower) or `www/js`.

Building and testing the project is normally done via the Grunt tasks below.

## Grunt tasks

We use `grunt` commands to do most of the project operations, like:

* running the app:
** ios: `grunt debug:ios`
** Android: `grunt debug:android`

* testing: `grunt test`
* linting the sources: `grunt jshint`
* concatenating the sources: `grunt concat`
* compiling the templates: `grunt dot`

See the steps taken for `grunt test` and `grunt debug:XXX` for the various operations needed to constitute the working app, and look at Gruntfile.js for the whole repertoire.


### License
- GPLv3 – [https://github.com/kenmanheimer/Cryptonaut/blob/master/LICENSE](https://github.com/kenmanheimer/Cryptonaut/blob/master/LICENSE)
