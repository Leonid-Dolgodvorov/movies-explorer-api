const corsOptions = {
  origin: [
    'http://localhost:3010',
    'https://dolgodvorovl.nomoredomains.icu',
    'http://dolgodvorovl.nomoredomains.icu',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

module.exports = corsOptions;
