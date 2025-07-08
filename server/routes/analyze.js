const express = require("express");
const axios = require("axios");
const analyzeRouter = express.Router();

analyzeRouter.post("/", async (req, res) => {
  const { sentence } = req.body;

  if (!sentence || sentence.trim() === "") {
    return res.status(400).json({ error: "No sentence provided." });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase",
      {
        inputs: sentence,
        parameters: { num_return_sequences: 3, temperature: 0.7 }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("HF raw response:", JSON.stringify(response.data, null, 2));

    const hfData = response.data;

    if (hfData.error) {
      console.error("HF model error:", hfData.error);
      return res.json({ error: hfData.error });
    }

    if (!Array.isArray(hfData)) {
      console.error("HF unexpected format:", hfData);
      return res.json({ error: "Unexpected response format from Hugging Face." });
    }

    const rephrasedSentences = hfData.map(item => item.generated_text);
    res.json({ rephrasedSentences });

  } catch (error) {
    console.error("HF API failed:", error.response?.data || error.message);
    res.json({ error: "Failed to process sentence with Hugging Face." });
  }
});

module.exports = analyzeRouter;
