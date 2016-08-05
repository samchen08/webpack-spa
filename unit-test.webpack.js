//All test case naming follow /-test\.js$/ regexp pattern.
const context = require.context('./test', true, /-test\.js$/);
context.keys().forEach(context);