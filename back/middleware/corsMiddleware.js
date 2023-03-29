const config = require("config")

module.exports = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", config.get("domainUrl")); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE");
    next();
}