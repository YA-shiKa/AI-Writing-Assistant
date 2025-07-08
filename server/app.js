const express = require("express");
const cors = require("cors");
require("dotenv").config();

const spellChecker = require("./routes/spellcheck");
const grammarCheck = require("./routes/grammarcheck");
const analyzeRouter = require("./routes/analyze"); // ✅ ADD THIS LINE

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/spellcheck", spellChecker);
app.use("/api/grammarcheck", grammarCheck);
app.use("/api/analyze", analyzeRouter); // ✅ ADD THIS LINE

app.listen(port, () => {
  console.log(`✅ AI Writing app running at http://localhost:${port}`);
});
