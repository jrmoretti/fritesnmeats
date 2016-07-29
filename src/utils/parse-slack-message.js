module.exports = function(text) {
  switch (text.toLowerCase().slice(0, 5)) {
    case 'order':
    return text.slice(5).trim().split(',').map(person => person.trim());
    default:
    throw new Error(`could not parse this: ${text}`);
  }
}
