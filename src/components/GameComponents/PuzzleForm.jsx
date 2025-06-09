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
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 32,
        padding: "16px 8px",
        border: "1px solid #ddd",
        borderRadius: 12,
        width: "100%",
        maxWidth: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <label
          htmlFor="gameName"
          style={{ display: "block", marginBottom: 4, fontWeight: 600 }}
        >
          Game Board Name
        </label>
        <input
          type="text"
          id="gameName"
          placeholder="Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "8px 12px",
            border: "1px solid #bbb",
            borderRadius: 6,
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      </div>

      {formError && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: 8,
            marginBottom: 12,
            borderRadius: 6,
          }}
        >
          {formError}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(4, auto)",
          gap: 16,
        }}
      >
        {categories.map((cat, catIdx) => (
          <div key={catIdx}>
            <div
              style={{
                background: CATEGORY_COLORS[catIdx],
                borderRadius: "6px 6px 0 0",
                padding: "6px 0",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1rem",
                border: "1px solid #ccc",
                borderBottom: "none",
                letterSpacing: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span style={{ margin: "0 4px 0 0" }}>
                {DIFFICULTY_LABELS[catIdx]}
              </span>
              <input
                type="text"
                placeholder={`${DIFFICULTY_LABELS[catIdx]} Category`}
                value={cat.name}
                onChange={(e) =>
                  handleCategoryNameChange(catIdx, e.target.value)
                }
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  textAlign: "center",
                  width: "65%",
                  minWidth: "100px",
                }}
                maxLength={32}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
                gap: 8,
                background: "#fff",
                borderRadius: "0 0 6px 6px",
                border: "1px solid #ccc",
                borderTop: "none",
                padding: 8,
                justifyItems: "center",
              }}
              className="word-grid"
            >
              {cat.words.map((word, wordIdx) => (
                <input
                  key={wordIdx}
                  type="text"
                  placeholder={`Word ${wordIdx + 1}`}
                  value={word}
                  onChange={(e) =>
                    handleWordChange(catIdx, wordIdx, e.target.value)
                  }
                  style={{
                    width: "100%",
                    minWidth: "80px",
                    maxWidth: "120px",
                    height: 34,
                    textAlign: "center",
                    border: "1px solid #bbb",
                    borderRadius: 6,
                    fontSize: "0.9rem",
                    background: "#f9fafb",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    margin: 0,
                    padding: "0 2px",
                    boxSizing: "border-box",
                  }}
                  maxLength={WORD_MAX_LENGTH}
                />
              ))}
            </div>
            {categoryErrors[catIdx] && (
              <div
                style={{
                  color: "red",
                  marginTop: 4,
                  textAlign: "center",
                  fontSize: 14,
                }}
              >
                {categoryErrors[catIdx]}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 24,
          padding: "10px 24px",
          background: loading ? "#9ca3af" : "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontWeight: 600,
          fontSize: 16,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          cursor: loading ? "not-allowed" : "pointer",
          width: "100%",
          maxWidth: "300px",
          display: "block",
          margin: "24px auto 0",
        }}
      >
        {loading ? "Processing..." : submitButtonText}
      </button>
    </form>
  );
}

export default PuzzleForm;
