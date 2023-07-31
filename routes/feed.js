const router = require("express").Router();
const feedController = require("../controllers/feed");
const {body} = require("express-validator");
const isAuth = require("../middlewares/is-auth");

router.get("/posts", isAuth, feedController.getPosts);
router.get("/post/:id", isAuth, feedController.getPost);
router.post("/post", isAuth, [body("title")
                                .trim()
                                .isLength({min: 5}), body("content")
                                .trim()
                                .isLength({min: 5})], feedController.postPost);
router.put("/post/:id", isAuth, [body("title")
                                   .trim()
                                   .isLength({min: 5}), body("content")
                                   .trim()
                                   .isLength({min: 5})], feedController.putPost);
router.delete("/post/:id", isAuth, feedController.deletePost);
router.get("/status", isAuth, feedController.getStatus);
router.patch("/status", isAuth, feedController.patchStatus);

module.exports = router;