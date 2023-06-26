const express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter.route("/");

favoriteRouter.route("/:campsiteId");

module.exports = favoriteRouter;
