// backend/middlewares/validate.js
const validate = (schema) => {
  return (req, res, next) => {
    const options = {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    };

    const { error, value } = schema.validate(req.body, options);

    if (error) {
      return res.status(400).json({
        message: 'Données invalides',
        details: error.details.map((d) => d.message),
      });
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
