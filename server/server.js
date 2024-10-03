var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Query {
    hello: String
    }
`);

var root = {
    hello() {
        return 'Hello world!';
    },
};

var app = express();

app.all(
    '/graphql',
    createHandler({
        schema: schema,
        rootValue: root,
    })
);

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
