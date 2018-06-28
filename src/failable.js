const equal = require('assert').deepEqual
const stringify = require('json-stringify-safe')

const SUCCESS = 0
const FAILURE = 1
const EMPTY = 2
const PROTOCOL_V1 = 'fv1'

const protocolVersion = f => f[0]
const kind = f => f[1]
const payload = f => f[2]
const meta = f => f[3]

const success = (payload, meta) => {
  if (payload === undefined) return empty(meta)
  return [PROTOCOL_V1, SUCCESS, payload, meta]
}
const failure = (payload, meta) => [PROTOCOL_V1, FAILURE, payload, meta]
const empty = meta => [PROTOCOL_V1, EMPTY, undefined, meta]

const isSuccess = f =>
  Array.isArray(f) && (kind(f) === SUCCESS || kind(f) === EMPTY)
const isFailure = f => Array.isArray(f) && kind(f) === FAILURE
const isEmpty = f => Array.isArray(f) && kind(f) === EMPTY
const isFailable = f => {
  if (protocolVersion(f) === PROTOCOL_V1) {
    if (isSuccess(f) || isFailure(f) || isEmpty(f)) {
      return true
    }
  }
  return false
}

const anyFailed = l => l.filter(isFailure).length > 0
const firstFailure = l => l.filter(isFailure)[0]

const assertSuccessWhich = (t, f) => {
  equal(isSuccess(f), true, stringify(hydrate(f)))
  equal(t(payload(f)), true, stringify(hydrate(f)))
}

const same = (a, b) => {
  try {
    equal(a, b)
    return true
  } catch (e) {
    return false
  }
}

const assertSuccess = (f, p) =>
  assertSuccessWhich(x => p === undefined || same(x, p), f)

const assertSuccessTyped = (t, f) => assertSuccessWhich(p => typeof p === t, f)

const assertFailure = (f, p) => {
  equal(isFailure(f), true, stringify(hydrate(f)))
  if (p !== undefined) equal(payload(f), p)
}

const assertEmpty = f => equal(isEmpty(f), true, stringify(hydrate(f)))

const extractPayloads = results => results.map(payload)

const flattenResults = results => {
  if (anyFailed(results)) return firstFailure(results)
  return success(extractPayloads(results))
}

const makeItFailable = fn => {
  return async (...args) => {
    try {
      const result = await fn.apply(this, args)
      if (isFailable(result)) return result
      return success(result)
    } catch (err) {
      return failure(err.toString())
    }
  }
}

const clean = o => {
  return Object.keys(o)
    .filter(f => o[f] !== undefined)
    .reduce((r, i) => Object.assign(r, { [i]: o[i] }), {})
}

const kindString = f => {
  switch (kind(f)) {
    case SUCCESS:
      return 'success'
    case FAILURE:
      return 'failure'
    case EMPTY:
      return 'empty'
    default:
      return 'unknown'
  }
}

const hydrate = f =>
  clean({
    kind: kindString(f),
    payload: payload(f),
    meta: meta(f),
  })

module.exports = {
  kind,
  payload,
  meta,
  success,
  failure,
  empty,
  isSuccess,
  isFailure,
  isEmpty,
  isFailable,
  assertSuccess,
  assertSuccessWhich,
  assertSuccessTyped,
  assertFailure,
  assertEmpty,
  anyFailed,
  firstFailure,
  makeItFailable,
  extractPayloads,
  flattenResults,
  hydrate,
}
