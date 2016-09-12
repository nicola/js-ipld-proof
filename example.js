// This code is simply adding 3 hashes to a service

// General requirements
const path = require('path')
const parallel = require('async').parallel

// IPLD/IPFS requirements
const ipld = require('ipld')
const IPFSRepo = require('ipfs-repo')
const BlockService = require('ipfs-block-service')
const IPLDService = require('ipfs-ipld/src').IPLDService
const fsb = require('fs-blob-store')

// Creating service
const repo = new IPFSRepo(path.join(__dirname, 'blobs'), {stores: fsb})
const bs = new BlockService(repo)
const ipldService = new IPLDService(bs)

// Creating IPLD objects
const B = {
  value: 1
}
const hashB = ipld.multihash(ipld.marshal(B))

const C = {
  value: 2
}
const hashC = ipld.multihash(ipld.marshal(C))

const A = {
  left: {'/': hashB},
  right: {'/': hashC}
}
const hashA = ipld.multihash(ipld.marshal(A))

// Adding them to the service
parallel([
  (cb) => ipldService.put(A, cb),
  (cb) => ipldService.put(B, cb),
  (cb) => ipldService.put(C, cb)
], (err) => {
  console.log(err, 'added them all')
})
