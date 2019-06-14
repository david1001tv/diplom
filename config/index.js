require('fs').readdirSync(base_dir + '/config').forEach(function (file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    let name = file.replace('.js', '')
    exports[name] = require('./' + file)
  }
});
