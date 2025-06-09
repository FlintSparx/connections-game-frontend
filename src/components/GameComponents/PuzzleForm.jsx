import { useState } from "react";

function PuzzleForm({
  initialName = "",
  initialCategories = null,
  onSubmit,
  submitButtonText = "Create Game Board",
  loading = false,
}) {
  // Define difficulty levels and colors as component constants
  const DIFFICULTY_LABELS = ["Easiest", "Harder", "Even Harder", "Hardest"];
  const CATEGORY_COLORS = [
    "#fde68a", // yellow
    "#a7f3d0", // green
    "#fca5a5", // red
    "#93c5fd", // blue
  ];

  // Set the max word length
  const WORD_MAX_LENGTH = 15;

  const [gameName, setGameName] = useState(initialName);
  const [categoryErrors, setCategoryErrors] = useState(["", "", "", ""]);
  const [formError, setFormError] = useState("");

  // Initialize categories from props or create default structure
  const [categories, setCategories] = useState(() => {
    const emptyCategory = { name: "", words: ["", "", "", ""] };
    const defaultCategories = Array(4)
      .fill()
      .map(() => ({ ...emptyCategory }));

    if (!initialCategories) return defaultCategories;

    if (Array.isArray(initialCategories)) {
      return initialCategories;
    }

    // Convert from object format (category1, category2, etc.) to array format
    return [1, 2, 3, 4].map((i) => {
      const category = initialCategories[`category${i}`] || {};
      return {
        name: category.name || "",
        words: category.words || ["", "", "", ""],
      };
    });
  });

  const handleCategoryNameChange = (catIdx, value) => {
    setCategories((prev) => {
      const updated = [...prev];
      updated[catIdx] = { ...updated[catIdx], name: value };
      return updated;
    });
  };

  const handleWordChange = (catIdx, wordIdx, value) => {
    // Remove spaces and limit to 15 characters
    const sanitized = value.replace(/\s+/g, "").slice(0, WORD_MAX_LENGTH);
    setCategories((prev) => {
      const updated = [...prev];
      const words = [...updated[catIdx].words];
      words[wordIdx] = sanitized;
      updated[catIdx] = { ...updated[catIdx], words };
      return updated;
    });
  };

  // Handle form submission with validation
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Validate game name
    if (!gameName.trim()) {
      setFormError("Game board name is required");
      return;
    }

    // Validate categories
    const newErrors = [...categoryErrors];
    let hasError = false;

    categories.forEach((cat, i) => {
      if (!cat.name.trim()) {
        newErrors[i] = `Category name required`;
        hasError = true;
      } else {
        const filledWords = cat.words.filter((w) => w.trim() !== "");
        if (filledWords.length !== 4) {
          newErrors[i] = `All 4 words required for this category`;
          hasError = true;
        } else {
          newErrors[i] = "";
        }
      }
    });

    setCategoryErrors(newErrors);

    if (hasError) return;

    // Prepare categories object for submission
    const categoriesObj = {};
    categories.forEach((cat, i) => {
      categoriesObj[`category${i + 1}`] = cat;
    });

    // Submit the form data
    onSubmit({
      name: gameName,
      ...categoriesObj,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="puzzle-form">
      <div className="puzzle-form-title">
        <label htmlFor="gameName">Game Board Name</label>
        <input
          type="text"
          id="gameName"
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="puzzle-form-input"
        />
      </div>
      {formError && <div className="puzzle-form-error">{formError}</div>}
      <div className="puzzle-form-categories">
        {categories.map((cat, catIdx) => (
          <div key={catIdx}>
            <div
              className="puzzle-form-category-header"
              style={{ background: CATEGORY_COLORS[catIdx] }}
            >
              <span>{DIFFICULTY_LABELS[catIdx]}</span>
              <input
                type="text"
                placeholder={`${DIFFICULTY_LABELS[catIdx]} Category`}
                value={cat.name}
                onChange={(e) =>
                  handleCategoryNameChange(catIdx, e.target.value)
                }
                className="puzzle-form-category-input"
                maxLength={32}
              />
            </div>
            <div className="word-grid">
              {cat.words.map((word, wordIdx) => (
                <input
                  key={wordIdx}
                  type="text"
                  placeholder={`Word ${wordIdx + 1}`}
                  value={word}
                  onChange={(e) =>
                    handleWordChange(catIdx, wordIdx, e.target.value)
                  }
                  className="puzzle-form-word-input"
                  maxLength={WORD_MAX_LENGTH}
                />
              ))}
            </div>
            {categoryErrors[catIdx] && (
              <div className="puzzle-form-category-error">
                {categoryErrors[catIdx]}
              </div>
            )}
          </div>
        ))}
      </div>
      <button type="submit" disabled={loading} className="puzzle-form-submit">
        {loading ? "Processing..." : submitButtonText}
      </button>
    </form>
  );
}

export default PuzzleForm;
