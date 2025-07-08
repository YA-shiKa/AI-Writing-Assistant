import React, { useState } from "react";
import axios from "axios";
import { FaSpellCheck, FaCheck, FaSyncAlt, FaPencilAlt } from "react-icons/fa";
import { SiGrammarly } from "react-icons/si";

const Editor = () => {
  const [text, setText] = useState("");
  const [correctedSentences, setCorrectedSentences] = useState([]);
  const [spellCheckedText, setSpellCheckedText] = useState("");
  const [grammarCheckedText, setGrammarCheckedText] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [rephrasedSentences, setRephrasedSentences] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => setText(e.target.value);

  const handleSentenceSelection = () => {
    const selected = window.getSelection().toString();
    if (selected) {
      setSelectedSentence(selected.trim());
      console.log("Selected sentence:", selected.trim());
    }
  };

  const checkSpelling = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/spellcheck", { text });
      setSpellCheckedText(res.data.correctedText);
    } catch (err) {
      console.error("Spell Check Error:", err);
      alert("Spell check failed.");
    } finally {
      setLoading(false);
    }
  };

  const checkGrammar = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/grammarcheck", { text });
      setGrammarCheckedText(res.data.correctedText);
    } catch (err) {
      console.error("Grammar Check Error:", err);
      alert("Grammar check failed.");
    } finally {
      setLoading(false);
    }
  };

  const rephraseSentence = async () => {
    if (!selectedSentence) return;
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/analyze", {
        sentence: selectedSentence,
      });
      setRephrasedSentences(res.data.rephrasedSentences || []);
    } catch (err) {
      console.error("Rephrase Error:", err);
      alert("Rephrasing failed.");
    } finally {
      setLoading(false);
    }
  };

  const addCorrectedSentence = (sentence) => {
    setCorrectedSentences((prev) => [...prev, sentence]);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              AI Writing Assistant
            </h2>
            <textarea
              value={text}
              onChange={handleTextChange}
              onMouseUp={handleSentenceSelection}
              placeholder="Type your text here..."
              rows={10}
              className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end mt-4 space-x-4">
              <Button onClick={checkSpelling} icon={<FaSpellCheck />}>
                Check Spelling
              </Button>
              <Button onClick={checkGrammar} icon={<SiGrammarly />}>
                Check Grammar
              </Button>
            </div>
            {loading && <p className="text-blue-600 mt-2">Processing...</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultSection
              title="Spell Checked Text"
              text={spellCheckedText}
              onAccept={() => addCorrectedSentence(spellCheckedText)}
              icon={<FaSpellCheck className="text-green-500" />}
            />
            <ResultSection
              title="Grammar Checked Text"
              text={grammarCheckedText}
              onAccept={() => addCorrectedSentence(grammarCheckedText)}
              icon={<SiGrammarly className="text-blue-500" />}
            />
          </div>

          {selectedSentence && (
            <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaPencilAlt className="mr-2 text-purple-500" />
                Selected Sentence:
              </h3>
              <p className="mb-4 italic text-gray-700">{selectedSentence}</p>
              <Button onClick={rephraseSentence} icon={<FaSyncAlt />}>
                Rephrase
              </Button>
            </div>
          )}

          {rephrasedSentences.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaSyncAlt className="mr-2 text-indigo-500" />
                Rephrased Suggestions:
              </h3>
              {rephrasedSentences.map((sentence, i) => (
                <div key={i} className="mb-4 border-b pb-2">
                  <p className="mb-2">{sentence}</p>
                  <Button onClick={() => addCorrectedSentence(sentence)} icon={<FaCheck />}>
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white shadow-lg rounded-lg p-6 sticky top-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaCheck className="mr-2 text-green-500" />
              Corrected Sentences
            </h3>
            {correctedSentences.length > 0 ? (
              correctedSentences.map((s, i) => (
                <p key={i} className="mb-2 border-b pb-2">{s}</p>
              ))
            ) : (
              <p className="text-gray-500 italic">No corrections yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Button = ({ onClick, children, icon }) => (
  <button
    onClick={onClick}
    className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition duration-300 flex items-center"
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

const ResultSection = ({ title, text, onAccept, icon }) =>
  text && (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <p className="mb-4">{text}</p>
      <Button onClick={onAccept} icon={<FaCheck />}>
        Accept
      </Button>
    </div>
  );

export default Editor;
