const equal = require("assert").deepEqual;
const {
  success,
  failure,
  empty,
  isFailure,
  isSuccess,
  isEmpty,
  payload,
  meta,
  kind
} = require("./failable");

test("should make a success", async () => {
  const box = success("foo");
  const data = payload(box);
  equal(isSuccess(box), true);
  equal(data, "foo");
});

test("should make a failure", async () => {
  const box = failure("bad things");
  const error = payload(box);
  equal(isFailure(box), true);
  equal(error, "bad things");
});

test("should make a empty that only takes meta as args", async () => {
  const box = empty({ meta: 1 });
  const nothing = payload(box);
  const metadata = meta(box);
  equal(isEmpty(box), true);
  equal(nothing, undefined);
  equal(metadata, { meta: 1 });
});
