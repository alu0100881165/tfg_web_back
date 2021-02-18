{
    "collection": "@nestjs/schematics",
    "sourceRoot": "src"
}
module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'react',
    database: 'pruebamas',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
};