const express = require("express");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favorite = require("../models/favorite");

const favoriteRouter = express.Router();

favoriteRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate("user")
            .populate("campsites")
            .then((favorites) => {
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.json(favorites);
            })
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    req.body.forEach((campsite) => {
                        if (!favorite.campsites.includes(campsite._id)) {
                            favorite.campsites.push(campsite._id);
                        }
                    });
                    favorite.save().then((updatedFavorite) => {
                        res.setHeader("Content-Type", "application/json");
                        res.statusCode = 200;
                        res.json(updatedFavorite);
                    });
                } else {
                    const newFavorite = {
                        user: req.user._id,
                        campsites: req.body,
                    };
                    Favorite.create(newFavorite).then((createdFavorite) => {
                        res.setHeader("Content-Type", "application/json");
                        res.statusCode = 200;
                        res.json(createdFavorite);
                    });
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end("PUT operation not supported on /favorites/");
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    res.setHeader("Content-Type", "application/json");
                    res.statusCode = 200;
                    res.json(favorite);
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete.");
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter
    .route("/:campsiteId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end(
            "GET operation not supported on /favorites/" + req.params.campsiteId
        );
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    if (favorite.campsites.includes(req.params.campsiteId)) {
                        res.setHeader("Content-Type", "text/plain");
                        res.send(
                            "That campsite is already in the list of favorites!"
                        );
                    } else {
                        favorite.campsites.push(req.params.campsiteId);
                        favorite.save().then((updatedFavorite) => {
                            res.setHeader("Content-Type", "application/json");
                            res.statusCode = 200;
                            res.json(updatedFavorite);
                        });
                    }
                } else {
                    Favorite.create({
                        user: req.user._id,
                        campsites: [req.params.campsiteId],
                    }).then((newFavorite) => {
                        res.setHeader("Content-Type", "application/json");
                        res.statusCode = 200;
                        res.json(newFavorite);
                    });
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain");
        res.end(
            "PUT operation not supported on /favorites/" + req.params.campsiteId
        );
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    const campsiteIndex = favorite.campsites.indexOf(
                        req.params.campsiteId
                    );
                    if (campsiteIndex !== -1) {
                        favorite.campsites.splice(campsiteIndex, 1);
                        favorite
                            .save()
                            .then((updatedFavorite) => {
                                res.setHeader(
                                    "Content-Type",
                                    "application/json"
                                );
                                res.statusCode = 200;
                                res.json(updatedFavorite);
                            })
                            .catch((err) => next(err));
                    } else {
                        res.setHeader("Content-Type", "text/plain");
                        res.statusCode = 200;
                        res.send(
                            "The specified campsite is not in your favorites."
                        );
                    }
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.statusCode = 200;
                    res.send("You do not have any favorites to delete.");
                }
            })
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;
