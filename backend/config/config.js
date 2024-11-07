const Config = {
    sqlite: {
        type: 'sqlite',
        database: 'database.sqlite',
    },
    tidb: {
        type: 'tidb',
        host: '127.0.0.1',
        port: 4000,
        user: 'root',
        password: '',
        database: 'HW',
    },
    jwtSecret: 'my_jwt_secret',
};

module.exports = Config;