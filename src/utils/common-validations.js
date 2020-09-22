const { InvalidArgumentError } = require('./error');

module.exports = {
  fieldStringNotNull(value, name) {
    if (typeof value !== 'string' || value === 0)
      throw new InvalidArgumentError(`You must fill in the field ${name}!`);
  },

  fieldSizeMinimum(value, name, minimum) {
    if (value.length < minimum)
      throw new InvalidArgumentError(
        `The ${name} field must be greater than ${minimum} characters!`
      );
  },

  fieldSizeMaximum(value, name, maximum) {
    if (value.length > maximum)
      throw new InvalidArgumentError(
        `The ${name} field must be less than ${maximum} characters!`
      );
  }
};
