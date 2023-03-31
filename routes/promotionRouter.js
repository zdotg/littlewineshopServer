const express = require("express");
const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the promotions to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the promotion: ${req.body.name} with description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res) => {
    res.end("Deleting all promotions");
  });

promotionRouter
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end(`Sending details of the promotion ${req.params.promotionId}`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end("POST request not supported");
  })
  .put((req, res) => {
    res.end(
      `Will update promotion: ${req.body.name} and description: ${req.body.description}`
    );
  })
  .delete((req, res) => {
    res.end(`Deleteing promotion: ${req.params.promotionid}`);
  });

module.exports = promotionRouter;
