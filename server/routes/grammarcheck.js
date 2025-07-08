const express = require("express");
const axios = require("axios");
const grammarCheck = express.Router();

grammarCheck.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided." });
  }

  try {
    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      new URLSearchParams({
        text,
        language: "en-US",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const matches = response.data.matches;
    console.log("Grammar matches found:", matches.length);

    let corrected = text;

    if (matches && matches.length > 0) {
      // Replace grammar issues from end to start
      for (let i = matches.length - 1; i >= 0; i--) {
        const match = matches[i];

        // Filter: only process grammar rules (not spelling)
        if (match.rule.issueType === "grammar" && match.replacements && match.replacements.length > 0) {
          const replacement = match.replacements[0].value;
          console.log(`Grammar replace: "${text.substr(match.offset, match.length)}" -> "${replacement}"`);
          corrected = corrected.substring(0, match.offset) +
                      replacement +
                      corrected.substring(match.offset + match.length);
        }
      }
    }

    res.json({ correctedText: corrected });
  } catch (error) {
    console.error("Grammar check error:", error.response?.data || error.message);
    res.status(500).json({ error: "Grammar check failed." });
  }
});

module.exports = grammarCheck;

