const express = require("express")
const { calculateRecommendation } = require("../logic/scoring")

const router = express.Router()

function handleRecommend(req, res) {
  const { path, answers } = req.body

  if (
    !['path1', 'path2'].includes(path) ||
    !Array.isArray(answers) ||
    answers.length !== 7 ||
    answers.some((v) => typeof v !== "number" || isNaN(v))
  ) {
    return res
      .status(400)
      .json({ error: "path must be 'path1' or 'path2', answers must be an array of exactly 7 numbers" })
  }

  res.json(calculateRecommendation({ path, answers }))
}

router.post("/recommend", handleRecommend)

module.exports = router
