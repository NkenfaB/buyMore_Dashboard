import React, { useEffect, useState } from "react";
import "./catalog.css";
const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
const blank = () => ({
  name: "",
  description: "",
  imageUrl: "",
  country: "",
  category: "",
  tags: "",
});
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Unable to reach the catalog");
  return data;
}
export default function App() {
  const [resource, setResource] = useState("products");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setItems([]);
    request(`/${resource}`, { signal: controller.signal })
      .then((data) => {
        if (!Array.isArray(data))
          throw new Error("The API returned an unexpected response");
        setItems(data);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [resource, reload]);
  const reset = () => {
    setForm(blank());
    setEditing(null);
  };
  const changeResource = (next) => {
    setResource(next);
    reset();
    setNotice("");
    setSearch("");
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    try {
      const saved = await request(
        `/${resource}${editing ? `/${editing}` : ""}`,
        {
          method: editing ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload),
        }
      );
      setItems((current) =>
        editing
          ? current.map((item) => (item._id === editing ? saved : item))
          : [saved, ...current]
      );
      reset();
      setNotice(
        "Catalog saved. The storefront will show this item when refreshed."
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name}?`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await request(`/${resource}/${item._id}`, { method: "DELETE", headers });
      setItems((current) => current.filter((row) => row._id !== item._id));
      if (editing === item._id) reset();
      setNotice("Item deleted.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const field = (name, label, type = "text") => (
    <label key={name}>
      {label}
      <input
        type={type}
        name={name}
        value={form[name]}
        required={name !== "tags"}
        maxLength={name === "description" ? 3000 : 500}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      />
    </label>
  );
  const filtered = items.filter((item) =>
    `${item.name} ${item.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <a className="admin-brand" href="/">
          buyMore<span>CATALOG STUDIO</span>
        </a>
        <p>Workspace</p>
        {["products", "categories"].map((value) => (
          <button
            key={value}
            disabled={busy}
            className={value === resource ? "active" : ""}
            aria-pressed={value === resource}
            onClick={() => changeResource(value)}
          >
            {value === "products" ? "Products" : "Categories"}
          </button>
        ))}
        <div className="nav-note">
          A focused home for your catalog.
          <br />
          Create, update, publish.
        </div>
      </aside>
      <main className="admin-main">
        <header>
          <div>
            <p className="admin-kicker">BUYMORE / INVENTORY</p>
            <h1>{resource === "products" ? "Products" : "Categories"}</h1>
            <p>Manage the details your customers see.</p>
          </div>
          <span className="count-badge">{items.length} {items.length === 1 ? "item" : "items"}</span>
        </header>
        <section className="admin-access">
          <label htmlFor="admin-token">Catalog admin token</label>
          <input
            id="admin-token"
            type="password"
            value={token}
            autoComplete="off"
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your token to enable editing"
          />
          <span>Kept in memory for this session.</span>
        </section>
        {error && (
          <div className="admin-error" role="alert">
            {error}{" "}
            <button onClick={() => setReload((value) => value + 1)}>
              Retry loading
            </button>
          </div>
        )}
        {notice && (
          <p role="status" className="admin-notice">
            {notice}
          </p>
        )}
        <div className="admin-columns">
          <section className="catalog-list">
            <div className="list-heading">
              <h2>Your catalog</h2>
              <label className="search-label">
                Search
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name"
                />
              </label>
            </div>
            {loading ? (
              <p role="status">Loading catalog…</p>
            ) : !filtered.length ? (
              <p className="empty-catalog">
                {items.length
                  ? "No matching items."
                  : "Your catalog is empty. Add your first item using the form."}
              </p>
            ) : (
              <ul>
                {filtered.map((item) => (
                  <li key={item._id}>
                    <img src={item.imageUrl} alt="" />
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      {item.category && (
                        <span>
                          {item.category} · {item.country}
                        </span>
                      )}
                    </div>
                    <div className="row-actions">
                      <button
                        disabled={!token || busy || loading}
                        onClick={() => {
                          setEditing(item._id);
                          setForm({
                            ...blank(),
                            ...item,
                            tags: (item.tags || []).join(", "),
                          });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        disabled={!token || busy || loading}
                        onClick={() => remove(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="catalog-editor">
            <p className="admin-kicker">{editing ? "EDIT ITEM" : "NEW ITEM"}</p>
            <h2>
              {editing ? "Update" : "Add"}{" "}
              {resource === "products" ? "product" : "category"}
            </h2>
            <form onSubmit={save}>
              <fieldset disabled={busy || loading}>
                {field("name", "Name")}
                {field("description", "Description")}
                {field("imageUrl", "Image URL", "url")}
                {resource === "products" && (
                  <>
                    {field("country", "Country")}
                    {field("category", "Category name")}
                    {field("tags", "Tags, separated by commas")}
                  </>
                )}
                <button className="save-button" disabled={!token || busy || loading}>
                  {busy
                    ? "Saving…"
                    : editing
                    ? "Save changes"
                    : "Add to catalog"}
                </button>
                {editing && (
                  <button type="button" onClick={reset}>
                    Cancel editing
                  </button>
                )}
              </fieldset>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
