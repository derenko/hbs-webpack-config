const Handlebars = require('handlebars/runtime');

Handlebars.registerHelper('repeat', function(n, block) {
  let accum = '';

  for(let i = 0; i < n; ++i) {
    accum += block.fn(i);
  }

  return accum;
});

module.exports = Handlebars;