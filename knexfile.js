// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {
  development:  {
    client: 'pg',
      connection: {
      host : process.env.DB_HOST,
      port : process.env.DB_PORT,
      user : process.env.DB_USER,
      password : process.env.DB_PASS,
      database : process.env.DB_DATABASE
    },
    migrations: {
      directory: './src/migrations'
    },
    seeds: {
      directory: './src/seeds',
    },
  }
};
