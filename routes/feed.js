const router = require("express").Router();
const feedController = require("../controllers/feed");
const {body} = require("express-validator");

router.get("/posts", feedController.getPosts);
router.get("/post/:id", feedController.getPost);
router.post("/post", [body("title")
                        .trim()
                        .isLength({min: 5}), body("content")
                        .trim()
                        .isLength({min: 5})], feedController.postPost);
router.put("/post/:id", [body("title")
                           .trim()
                           .isLength({min: 5}), body("content")
                           .trim()
                           .isLength({min: 5})], feedController.putPost);
router.delete("/post/:id", feedController.deletePost);

module.exports = router;