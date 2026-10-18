import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
afterEach(() => {
  jest.restoreAllMocks();
  delete global.fetch;
});
test("catalog loads and creating an item updates the list", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => [] })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: "1",
        name: "Shirt",
        description: "Soft cotton",
        imageUrl: "https://example.com/a.jpg",
        country: "Cameroon",
        category: "Clothing",
        tags: [],
      }),
    });
  render(<App />);
  expect(
    await screen.findByText(
      "Your catalog is empty. Add your first item using the form."
    )
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Catalog admin token"), {
    target: { value: "demo-token" },
  });
  for (const [label, value] of [
    ["Name", "Shirt"],
    ["Description", "Soft cotton"],
    ["Image URL", "https://example.com/a.jpg"],
    ["Country", "Cameroon"],
    ["Category name", "Clothing"],
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Add to catalog" }));
  expect(
    await screen.findByRole("heading", { name: "Shirt" })
  ).toBeInTheDocument();
  const [url, options] = global.fetch.mock.calls[1];
  expect(url).toContain("/api/products");
  expect(options.method).toBe("POST");
  expect(options.headers.Authorization).toBe("Bearer demo-token");
});
test("editing is disabled without a token and failed load reports an error", async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Database unavailable" }),
    });
  render(<App />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Database unavailable"
  );
  expect(screen.getByRole("button", { name: "Add to catalog" })).toBeDisabled();
});
