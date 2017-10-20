const SUCCESS = 0;
const ERROR = 1;
const EMPTY = 2;

const kind = f => f[0];
const payload = f => f[1];
const meta = f => f[2];

const success = (payload, meta) => [SUCCESS, payload, meta];
const failure = (payload, meta) => [ERROR, payload, meta];
const empty = meta => [EMPTY, undefined, meta];

const isSuccess = f => kind(f) === SUCCESS;
const isFailure = f => kind(f) === ERROR;
const isEmpty = f => kind(f) === EMPTY;

module.exports = {
  kind,
  payload,
  meta,
  success,
  failure,
  empty,
  isSuccess,
  isFailure,
  isEmpty
};
