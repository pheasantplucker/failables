# failables

Failables are a clean, consistent, async-friendly, network-friendly result type.  

Successful results are represented as failables of type `SUCCESS`, with the result stored in the payload.

Empty results are neither success nor failure; they are represented as failables of type `EMPTY`, and of course have no payload.  Calling success without a payload will result in an empty failable (not a success).

Instead of representing errors sometimes by a result code, sometimes by a magic number, and sometimes by throwing an exception, consistently represent errors as failables of type `FAILURE`, with the error message stored in the payload.

That's all there is to it.

# usage

```js
  const result1 = success('foo') // first parameter is payload
  const result2 = success('foo', { timesCalled: 7 })  // second (optional) parameter is metadata
  const result3 = failure('trouble!') // payload is error message
  const result4 = failure('trouble!', { userId: 'fred' })  // all failables can include metadata
  const result5 = empty() // empty failables have no payload
  const result6 = empty({ userId: 'fred' })  // for empty, the first (optional) parameter is metadata

  const answer = payload(result1) // extract the payload
  const metadata = meta(result2) // extract the metadata
  if (isFailure(result4)) return result4 // a common pattern: if a failure is encountered in a
                                         // failable-returning function, just return the failure directly
```

# documentation
## creation
```js
  success(payload, meta) // returns a success failable
  failure(payload, meta) // returns a failure failable
  empty(meta)            // returns an empty failable
```
## tests
```js
  isFailable(object)  // whether the object represents a failable
  isSuccess(failable) // whether the failable is success
  isFailure(failable) // whether the failable is failure
  isEmpty(failable)   // whether the failable is empty
```
## elements
```js
  payload(failable) // extracts the failable's payload
  meta(failable)    // extracts the failable's metadata
```
## list operations
```js
  anyFailed(list)            // whether any in the list failed
  firstFailure(list)         // the first failure in the list
  extractPayloads(failables) // extracts the payloads from a list of failables
```
## assertions
```js
  assertSuccess(failable, payload)        // assert that the failable is success
  assertSuccessWhich(predicate, failable) // assert that the failable is success and its payload satisfies the predicate
  assertSuccessTyped(type, failable)      // assert that the failable is success and the payload has the named type ('string', 'number', 'object', 'boolean')
  assertFailure(failable, payload)        // assert that the failable is failure
  assertEmpty(failable)                   // assert that the failable is empty
```
## utility
```js
  hydrate(failable) // returns an object with kind, payload, and meta fields
```
