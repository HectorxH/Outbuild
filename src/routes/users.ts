import express from "express";

const router = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *    summary: Retrieve a list of users.
 */
router.get("/", (req, res) => {
  res.send("Get users");
});

export default router;
