const equal = require("assert").deepEqual

const SUCCESS = 0
const FAILURE = 1
const EMPTY = 2
const PROTOCOL_V1 = "fv1"

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

const isSuccess = f => kind(f) === SUCCESS
const isFailure = f => kind(f) === FAILURE
const isEmpty = f => kind(f) === EMPTY
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

const assertSuccess = (f, p) => {
  equal(isSuccess(f), true)
  if (p) equal(payload(f), p)
}

const assertFailure = (f, p) => {
  equal(isFailure(f), true)
  if (p) equal(payload(f), p)
}

const assertEmpty = f => equal(isEmpty(f), true)

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
      return "success"
    case FAILURE:
      return "failure"
    case EMPTY:
      return "empty"
    default:
      return "unknown"
  }
}

const hydrate = f =>
  clean({
    kind: kindString(f),
    payload: payload(f),
    meta: meta(f)
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
  assertFailure,
  assertEmpty,
  anyFailed,
  firstFailure,
  makeItFailable,
  hydrate
}
