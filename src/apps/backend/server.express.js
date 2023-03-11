"use strict";
exports.__esModule = true;
var server_1 = require("@trpc/server");
var trpcExpress = require("@trpc/server/adapters/express");
var express_1 = require("express");
/**
 * Used when debugging locally.
 */
function configureExpress(appRouter) {
    var createContext = function (_a) {
        var req = _a.req, res = _a.res;
        return ({});
    };
    var t = server_1.initTRPC.context().create();
    var app = (0, express_1["default"])();
    app.use('/trpc', trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext: createContext
    }));
    var port = 4000;
    app.listen(port);
    console.info("Listening on port ".concat(port));
    return t;
}
exports["default"] = configureExpress;
