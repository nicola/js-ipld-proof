const path = require('path')
const forEach = require('async').forEachSeries

function parentPaths (uri) {
  const parents = [uri]
  if (uri === '/') {
    return parents
  }

  let times = uri.split('/').length

  // TODO: improve temporary solution to stop recursive path walking above root
  if (uri.endsWith('/')) {
    times--
  }

  for (let i = 0; i < times - 1; i++) {
    uri = path.dirname(uri)
    parents.push(uri)
  }
  return parents
}

const resolve = require('ipfs-ipld/src').resolve
// TODO it would be just faster to implement this in the resolver as we go down,
//      since this is just re-running the same function, but for now it's fine
module.exports = function proof (service, path, cb) {
  const parents = parentPaths(path)
  forEach(parents, (parent, next) => resolve(service, parent, next), cb)
}
