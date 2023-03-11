"use strict";
exports.__esModule = true;
var aws_lambda_1 = require("@trpc/server/adapters/aws-lambda");
function configureAws(appRouter) {
    var createContext = function (_a) {
        var event = _a.event, context = _a.context;
        return ({});
    };
    var handler = (0, aws_lambda_1.awsLambdaRequestHandler)({
        router: appRouter,
        createContext: createContext
    });
}
exports["default"] = configureAws;
