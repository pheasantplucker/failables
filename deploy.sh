# Test
npm test
if [[ $? -ne 0 ]] ; then
  echo "Tests failed."
  exit $?
fi
echo 'test complete'

# Upgrade patch version
npm version patch
echo 'updated patch version'

# Deploy to NPM
npm publish
echo 'publish complete'
