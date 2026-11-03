const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
console.log("TEST ROUTES LOADED");
router.post("/test", verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Authenticated AI request successful!",
        userId: req.user.userId
    });
});

module.exports = router;