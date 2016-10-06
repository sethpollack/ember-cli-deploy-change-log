/* jshint node: true */
'use strict';

var BasePlugin = require('ember-cli-deploy-plugin'),
    syncExec   = require('sync-exec'),
    Promise    = require('ember-cli/lib/ext/promise');

module.exports = {
  name: 'ember-cli-deploy-change-log',

  createDeployPlugin: function(options) {
    var DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig: {
        changelog: {
          revision: '%h',
          commit: '%H',
          author: '%an <%ae>',
          message: '%f',
        },

        deployer: function(context) {
          return context.deployer || syncExec('git config --global user.name').stdout;
        },

        merges: function(context) {
          return context.merges || false;
        },

        summary: function(context) {
          return context.summary || context.commandOptions.summary || '';
        },

        initialActiveRevisionKey: function(context) {
          if (context.initialRevisions) {
            var activeRevision = context.initialRevisions.filter(function(revision) {
              return revision.active;
            });

            if (activeRevision.length) {
              return activeRevision[0].revision;
            }
          }
        },

        revisionKey: function(context) {
          return context.revisionKey || (context.revisionData && context.revisionData.revisionKey);
        },

        defaultRange: function(context) {
          return context.defaultRange || 10;
        }
      },

      didUpload: function(context) {
        var changelogOptions = {
          initialActiveRevisionKey: this.readConfig('initialActiveRevisionKey'),
          revisionKey: this.readConfig('revisionKey'),
          defaultRange: this.readConfig('defaultRange'),
          changelog: this.readConfig('changelog'),
          merges: this.readConfig('merges'),
        };

        return this._createDeployMetaData.call(this, changelogOptions)
          .catch(this._errorMessage.bind(this));
      },
      // private functions
      _createDeployMetaData: function(changelogOptions) {
        var self = this;
        return this._generateChangeLog(changelogOptions)
          .then(function(changelog) {
            return {
              deployMetaData: {
                changelog: changelog,
                summary: self.readConfig('summary'),
                deployer: self.readConfig('deployer')
              }
            };
          });
      },

      _generateChangeLog: function(options) {
        var range                    = options.defaultRange,
            initialActiveRevisionKey = options.initialActiveRevisionKey,
            revisionKey              = options.revisionKey,
            changelog                = options.changelog,
            merges                   = options.merges;

        if (initialActiveRevisionKey && revisionKey) {
          range = initialActiveRevisionKey + '..' + revisionKey;
        } else {
          range = '-n' + range;
        }

        merges = merges ? '' : '--no merges';

        var changeLog = JSON.parse(syncExec('git log --format=medium ' + range + ' ' + merges + " --pretty=format:'" + JSON.stringify(changelog) + ",' $@ |     perl -pe 'BEGIN{print \"[\"}; END{print \"]\n\"}' |     perl -pe 's/},]/}]/'").stdout);

        return Promise.resolve(changeLog);
      },

      _errorMessage: function(error) {
        this.log(error, { color: 'red' });
        return Promise.reject(error);
      },
    });

    return new DeployPlugin();
  },
};
