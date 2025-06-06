import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Rock Paper Scissors heading", () => {
  render(<App />);
  const heading = screen.getByText(/stone paper scissors/i);
  expect(heading).toBeInTheDocument();
});
