import { useState } from "react";

function CreateGame() {
  const [gameName, setGameName] = useState("");
  const [category1, setCategory1] = useState("");
  const [category2, setCategory2] = useState("");
  const [category3, setCategory3] = useState("");
  const [category4, setCategory4] = useState("");
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [array3, setArray3] = useState([]);
  const [array4, setArray4] = useState([]);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [error3, setError3] = useState("");
  const [error4, setError4] = useState("");

  const handleArrayCreation = (i, setError) => {
    const arr = i
      .split(",")
      .map((e) => e.trim())
      .sort((a, b) => a.localeCompare(b));
    if (arr.length > 4) {
      setError("Only 4 words allowed per category.");
    } else {
      setError("");
    }
    return arr.slice(0, 4);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    let gameData = {
      gameName: gameName,
      category1: { name: category1, words: array1 },
      category2: { name: category2, words: array2 },
      category3: { name: category3, words: array3 },
      category4: { name: category4, words: array4 },
    };
    console.log(gameData);
    fetch("http://localhost:5000/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
      })
      .catch((err) => {
        console.error("Error creating game:", err);
      });
  };

  return (
    <div>
      <h1>Create Game</h1>
      <form onSubmit={handleSend}>
        <div>
          <label>Game Name: </label>
          <input
            type="text"
            placeholder="Game Name"
            onChange={(e) => setGameName(e.target.value)}
          />
        </div>
        <div>
          <label>Category 1: </label>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setCategory1(e.target.value)}
          />
          <input
            type="text"
            placeholder="Words (comma separated)"
            onChange={(e) => {
              setArray1(handleArrayCreation(e.target.value, setError1));
            }}
          />
          {error1 && <div style={{ color: "red" }}>{error1}</div>}
        </div>
        <div>
          <label>Category 2: </label>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setCategory2(e.target.value)}
          />
          <input
            type="text"
            placeholder="Words (comma separated)"
            onChange={(e) => {
              setArray2(handleArrayCreation(e.target.value, setError2));
            }}
          />
          {error2 && <div style={{ color: "red" }}>{error2}</div>}
        </div>
        <div>
          <label>Category 3: </label>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setCategory3(e.target.value)}
          />
          <input
            type="text"
            placeholder="Words (comma separated)"
            onChange={(e) => {
              setArray3(handleArrayCreation(e.target.value, setError3));
            }}
          />
          {error3 && <div style={{ color: "red" }}>{error3}</div>}
        </div>
        <div>
          <label>Category 4: </label>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setCategory4(e.target.value)}
          />
          <input
            type="text"
            placeholder="Words (comma separated)"
            onChange={(e) => {
              setArray4(handleArrayCreation(e.target.value, setError4));
            }}
          />
          {error4 && <div style={{ color: "red" }}>{error4}</div>}
        </div>
        <button type="submit">Create Game</button>
      </form>
    </div>
  );
}

export default CreateGame;
