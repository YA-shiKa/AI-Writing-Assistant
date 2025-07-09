const express = require("express");
const { pipeline } = require("@xenova/transformers");

const grammarCheck = express.Router();
let pipePromise = pipeline('text2text-generation', 'Xenova/t5-small');

grammarCheck.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided." });
  }

  try {
    const pipe = await pipePromise;
    const cleanText = String(text).trim();
    const output = await pipe(`Rewrite this sentence using correct English grammar. Reply in English only: "${cleanText}"`);
    const correctedText = output[0].generated_text;
    res.json({ correctedText });
  } catch (error) {
    console.error("Grammar correction failed:", error);
    res.status(500).json({ error: "Grammar correction failed." });
  }
});

module.exports = grammarCheck;
