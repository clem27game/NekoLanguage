/**
 * Module d'exportation pour le gestionnaire de packages NekoScript
 */

const PackageManager = require('./packageManagerNew');
const PackageDatabase = require('./pkg-schema');
const PackageServer = require('./pkg-server');
const PackageClient = require('./pkg-client');

module.exports = {
  PackageManager,
  PackageDatabase,
  PackageServer,
  PackageClient
};