require('babel-register')
// require('babel-core/register')({
//   presets: ['es2015', 'react']
// });
require.extensions['.scss'] = () => {
  return;
}
require.extensions['.css'] = () => {
  return;
};
require('./server')
