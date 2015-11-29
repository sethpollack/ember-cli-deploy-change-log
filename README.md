# ember-cli-deploy-change-log

> WARNING: This plugin is only compatible with ember-cli-deploy versions >= 0.5.0

> WARNING This plugin requires your upload plugin to set `revisionsData.initialActiveRevisionKey`.

###Install

You should already have `ember-cli-deploy` installed but if you don't:

```sh
$ ember install ember-cli-deploy
```

You will also need `ember-cli-deploy-build`, to build your project on deploy.

```sh
$ ember install ember-cli-deploy-build
```

and  `ember-cli-deploy-revision-data`

```sh
$ ember install ember-cli-deploy-revision-data
```

And finally install `ember-cli-deploy-change-log`

```sh
$ ember install ember-cli-deploy-change-log
```

Add the required configurations to  `deploy.js `:

```js
// An example of deploy.js.

module.exports = function(deployTarget) {
  var ENV = {
    build: {}
    // include other plugin configuration that applies to all deploy targets here
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';

    ENV.plugins = ['build', 'change-log', 'revision-data'];

    ENV['change-log'] = {
      changelog: {
        title: '(%h) %an <%ae>',
        message: '%f'
      }
    };
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
  }

  return ENV;
};
```
Make sure you specify all your plugins in each of your environments.

```sh
  ENV.plugins = ['build', 'change-log', 'revision-data'];
```

## Configurations

The following options are available:

* `deployer` Name of the deployer, defaults to `git config --global user.name`
* `merges` Set to true if you would like to include merges in the change-log data.
* `defaultRange` If there is no current active revision, the number of revisions to show in the change-log, defaults to 10.
* `changelog` an object with arbitrary keys and git log pretty-format [placeholders](http://git-scm.com/docs/pretty-formats) as the values. Defaults to:
```javascript
{
 revision: '%h',
 commit: '%H',
 author: '%an <%ae>',
 message: '%f'
}
```

You can also add these optional flags:
  * `--summary` adds a summary message to the deployMetaData.

## Results
Adds deployMetaData object with the following properties to the deployment context.

* `deployer` string with the deployer name.
* `summary` string with message from the `--summary` flag.
* `changelog` an array of change-log objects with the key/values described in the config.


## Authors
* [Seth Pollack](https://github.com/sethpollack)

***
The MIT License  
Copyright (c) 2015 [Seth Pollack](https://github.com/sethpollack)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
