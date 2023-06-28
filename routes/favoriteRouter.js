const express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {})
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {})
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {})
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {});

favoriteRouter
    .route("/:campsiteId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {})
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {})
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {})
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {});

module.exports = favoriteRouter;
