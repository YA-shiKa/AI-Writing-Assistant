const express = require("express");
const { pipeline } = require("@xenova/transformers");

const analyzeRouter = express.Router();

// Load pipeline once
let pipePromise = pipeline('text2text-generation', 'Xenova/t5-small');

analyzeRouter.post("/", async (req, res) => {
  const { sentence } = req.body;

  if (!sentence || sentence.trim() === "") {
    return res.status(400).json({ error: "No sentence provided." });
  }

  try {
    const pipe = await pipePromise;
    const cleanSentence = String(sentence).trim();

    // 🔥 Use T5-style paraphrase prompt
    const output = await pipe(`paraphrase: "${cleanSentence}"`);
    const rephrasedText = output[0].generated_text;

    // 🔥 Try to split into suggestions if multiple separated by periods/newlines
    const rephrasedSentences = rephrasedText
      .split(/[\.\n]/)
      .map(s => s.trim())
      .filter(Boolean);

    res.json({ rephrasedSentences });
  } catch (error) {
    console.error("Rephrasing failed:", error);
    res.status(500).json({ error: "Rephrasing failed." });
  }
});

module.exports = analyzeRouter;
