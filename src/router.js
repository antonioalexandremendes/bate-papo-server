var url = require("url");
var querystring = require('querystring');
var helpers = require('./helpers/request-helper');

module.exports = async (req, res, routes) => {
    let req_url = url.parse(req.url);

    const route = routes.find((route) => {
        const methodMatch = route.method === req.method;
        let pathMatch = false;

        if (typeof route.path === 'object') {
            pathMatch = req_url.pathname.match(route.path);
        } else {
            pathMatch = route.path === req_url.pathname;
        }

        return pathMatch && methodMatch;
    });

    if (route) {
        let param = null;
        let query = null;
        let body = null;

        if (route && typeof route.path === 'object') {
            param = req_url.pathname.match(route.path).slice(1);
        }

        if (req_url.query) {
            query = querystring.parse(req_url.query);
        }

        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            body = await getPostData(req);
        }

        return route.handler(req, res, param, body, query);
    } else {
        return helpers.error(res, 'Endpoint not found', 404);
    }
};

function getPostData(req) {
    return new Promise((resolve, reject) => {
       try {
           let body = '';
           req.on('data', chunk => {
               body += chunk.toString();
           });

           req.on('end', () => {
               resolve(body);
           });
       } catch (e) {
           reject(e);
       }
    });
}
