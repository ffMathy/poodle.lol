"use strict";
exports.__esModule = true;
var server_1 = require("@trpc/server");
var server_aws_lambda_1 = require("./server.aws-lambda");
var server_express_1 = require("./server.express");
var t = server_1.initTRPC.create();
var userList = [
    {
        id: '1',
        name: 'KATT'
    },
];
var appRouter = t.router({
    userById: t.procedure
        // The input is unknown at this time.
        // A client could have sent us anything
        // so we won't assume a certain data type.
        .input(function (val) {
        // If the value is of type string, return it.
        // TypeScript now knows that this value is a string.
        if (typeof val === 'string')
            return val;
        // Uh oh, looks like that input wasn't a string.
        // We will throw an error instead of running the procedure.
        throw new Error("Invalid input: ".concat(typeof val));
    })
        .query(function (req) {
        var input = req.input;
        var user = userList.find(function (u) { return u.id === input; });
        return user;
    })
});
(0, server_aws_lambda_1["default"])(appRouter);
(0, server_express_1["default"])(appRouter);
