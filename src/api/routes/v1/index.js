const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const eventRoutes = require("./event.route");
const eventRegistrationRoutes = require("./eventRegistrations.route");
const courseRoutes = require("./course.route");
const courseReviewRoutes = require("./courseReview.route");
const taskRoutes = require("./task.route");
const fileUpload = require("./fileUpload.route");
const articleRoutes = require("./article.route");
const questionRoutes = require("./question.route");
const quizRoutes = require("./quiz.route");
const quizResponsesRoutes = require("./quizResponses.route");
const chapterRoutes = require("./chapter.route");
const activityFeedRoutes = require("./activityFeed.route");
const zoomRoutes = require("./zoom.route");
const notificationRoutes = require("./notification.route");
const forumRoutes = require("./forum.route");
const pollRoutes = require("./poll.route");
const inviteUserRoutes = require("./inviteUser.route");
const todoRoutes = require("./todo.route");
const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
// router.use('/docs', express.static('docs'));

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/event", eventRoutes);
router.use("/event", eventRegistrationRoutes);
router.use("/course", courseRoutes);
router.use("/course", courseReviewRoutes);
router.use("/task", taskRoutes);
router.use("/file", fileUpload);
router.use("/article", articleRoutes);
router.use("/question", questionRoutes);
router.use("/quiz", quizRoutes);
router.use("/quizResponses", quizResponsesRoutes);
router.use("/chapter", chapterRoutes);
router.use("/activityFeed", activityFeedRoutes);
router.use("/zoom", zoomRoutes);
router.use("/notification", notificationRoutes);
router.use("/forum", forumRoutes);
router.use("/poll", pollRoutes);
router.use("/inviteUser", inviteUserRoutes);
router.use("/todo", todoRoutes);

module.exports = router;
