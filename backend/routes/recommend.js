const express = require("express")
const { calculateRecommendation } = require("../logic/scoring")

const router = express.Router()

function handleRecommend(req, res) {
  const { answers } = req.body

  if (
    !Array.isArray(answers) ||
    answers.length !== 12 ||
    answers.some((v) => typeof v !== "number" || isNaN(v))
  ) {
    return res
      .status(400)
      .json({ error: "answers must be an array of exactly 12 numbers" })
  }

  res.json(calculateRecommendation(answers))
}

router.post("/recommend", handleRecommend)

module.exports = router
