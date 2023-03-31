const express = require("express");
const Wine = require("../models/wine");

const wineRouter = express.Router();

wineRouter
  .route("/")
  .get((req, res, next) => {
    Wine.find()
      .then((wines) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(wines);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Wine.create(req.body)
      .then((wine) => {
        console.log("Wine Created ", wine);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(wine);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /wines");
  })
  .delete((req, res, next) => {
    Wine.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// Wine by Id requests
wineRouter
  .route("/:wineId")
  .get((req, res, next) => {
    Wine.findById(req.params.wineId)
      .then((wine) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(wine);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /wines/${req.params.wineId}`);
  })
  .put((req, res, next) => {
    Wine.findByIdAndUpdate(
      req.params.wineId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((wine) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(wine);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Wine.findByIdAndDelete(req.params.wineId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

// review requests
wineRouter
  .route("/:wineId/review")
  .get((req, res, next) => {
    Wine.findById(req.params.wineId)
      .then((wine) => {
        if (wine) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(wine.review);
        } else {
          err = new Error(`Wine ${req.params.wineId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Wine.findById(req.params.wineId)
      .then((wine) => {
        if (wine) {
          wine.review.push(req.body);
          wine
            .save()
            .then((wine) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(wine);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Wine ${req.params.wineId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /wines/${req.params.wineId}/review`
    );
  })
  .delete((req, res, next) => {
    Wine.findById(req.params.wineId)
      .then((wine) => {
        if (wine) {
          for (let i = wine.review.length - 1; i >= 0; i--) {
            wine.review.id(wine.review[i]._id).remove();
          }
          wine
            .save()
            .then((wine) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(wine);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Wine ${req.params.wineId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = wineRouter;
