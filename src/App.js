import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const initialFacts = [
  {
    id: 1,
    text: "Cappuccino",
    source: "https://www.starbucksathome.com/recipes/cappuccino",
    category: "Coffee",
    votesInteresting: "1000",
    votesMindblowing: "500",
    votesFalse: "69",
    createdIn: 2023,
  },
  {
    id: 2,
    text: "Mac&cheese",
    source:
      "https://www.southernliving.com/recipes/best-ever-macaroni-and-cheese-recipe",
    category: "Pasta",
    votesInteresting: "8000",
    votesMindblowing: "5000",
    votesFalse: "609",
    createdIn: 2023,
  },
];

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}
function App() {
  //1.DEFINE STATE VARIABLE

  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(" all");
  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);
        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query.order(" text", {
          ascending: true,
        });

        if (!error) setFacts(facts);
        else alert("There was a problem getting data");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );
  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="cafe lavender.png" height="65" width="65" alt="logo" />
          <h1>Cafe Lavender</h1>
        </div>
        <button
          className="btn btn-large btn-open"
          //UPDATE STATE VARIABLE
          onClick={() => setShowForm((show) => !show)}
        >
          {showForm ? "close" : "Share your recipe"}
        </button>
      </header>
      {/*USE STATE VARIABLE*/}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading......</p>;
}

const CATEGORIES = [
  { name: "Coffee", color: "rgba(224, 196, 159, 0.493)" },
  { name: "Pasta", color: "rgba(159, 210, 224, 0.493)" },
  { name: "Pizza", color: " rgba(205, 95, 55, 0.493)" },
  { name: "Burger", color: "rgba(244, 253, 150, 0.493)" },
  { name: "Sandwich", color: " rgba(139, 238, 200, 0.493)" },
  { name: "Shakes", color: "rgba(255, 152, 210, 0.493)" },
  { name: "Pastries", color: "rgba(255, 128, 119, 0.493)" },
  { name: "Wraps", color: "rgba(149, 20, 166, 0.313)" },
  { name: "Buns&Breads", color: "beige" },
];
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;
  async function handleSubmit(e) {
    {
      /*1. prevent browser reload */
    }
    e.preventDefault();
    console.log(text.source, category);
    // 2.check is data is valid if so create new recipe
    // 3. Upload fact to Supabase and receive the new fact object
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // 3. Create a new fact object
      /*const newFact = {
        id: Math.round(Math.random() * 10000000),
        text,
        source,
        category,
        votesInteresting: 0,
        votesMindblowing: 0,
        votesFalse: 0,
        createdIn: new Date().getFullYear(),
      };*/
      // 3. Upload fact to Supabase and receive the new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      // 4. Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      // 5. Reset input fields
      setText("");
      setSource("");
      setCategory("");
      // 6. close form
      setShowForm(false);
    }
  }
  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name of the food"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Link of your recipe blog"
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>

        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-cat"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        {" "}
        Click the category again......if you don't find a recipe....No recipe
        for this category yet! Create the first one🍩🍕🥐🧁☕
      </p>
    );
  }
  //TEMPORARY

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} in the database</p>
    </section>
  );
}
function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[🚫 DISPUTED]</span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          ❤️ {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          😋 {fact.votesMindblowing}
        </button>

        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          👎 {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
