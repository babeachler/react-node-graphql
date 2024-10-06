const express = require('express');
const { createHandler } = require('graphql-http/lib/use/express');
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLBoolean,
} = require('graphql');

const app = express();

const UsersList = [
    { id: '1', name: 'Bob', email: 'bob@test.com', isActive: true },
    { id: '2', name: 'Jim', email: 'jim@test.com', isActive: true },
    { id: '3', name: 'Ted', email: 'ted@test.com', isActive: true },
];

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        isActive: { type: GraphQLBoolean },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        // get all users
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return UsersList;
            },
        },
        // get user by id
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return UsersList.find((u) => u.id === args.id);
            },
        },
    },
});

const mutations = new GraphQLObjectType({
    name: 'mutations',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                isActive: { type: GraphQLBoolean },
            },
            resolve(parent, { name, email }) {
                const newUser = { name, email, id: Date.now().toString() };
                newUser.isActive = true;
                UsersList.push(newUser);
                return newUser;
            },
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
            },
            resolve(parent, args) {
                const user = UsersList.find((u) => u.id === args.id);

                user.name = args.name;
                user.email = args.email;

                return user;
            },
        },
        // soft delete
        deleteUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, { id }) {
                const user = UsersList.find((u) => u.id === id);

                user.isActive = false;

                return user;
            },
        },
    },
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: mutations,
});

app.use('/graphql', createHandler({ schema }));

app.listen(5000, () => console.log('Server running'));
