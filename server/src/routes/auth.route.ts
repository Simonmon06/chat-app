import express from "express";

const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Logged in successfully");
});

router.get("/logout", (req, res) => {
  res.send("Logout successfully");
});
router.get("/signup", (req, res) => {
  res.send("Signup successfully");
});
export default router;
