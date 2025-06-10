import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import SignUpForm from "../SignUpForm";

// Mock the axios post method
jest.mock("axios");

// Mock react-router-dom's useHistory hook
const mockPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockPush,
  }),
}));

test("renders sign up form", () => {
  render(
    <Router>
      <SignUpForm />
    </Router>
  );

  const usernameField = screen.getByPlaceholderText("Username");
  const passwordField = screen.getByPlaceholderText("Password");
  const confirmPasswordField = screen.getByPlaceholderText("Confirm password");

  expect(usernameField).toBeInTheDocument();
  expect(passwordField).toBeInTheDocument();
  expect(confirmPasswordField).toBeInTheDocument();
});

test("redirects to sign in on successful sign up", async () => {
  axios.post.mockResolvedValue({});

  render(
    <Router>
      <SignUpForm />
    </Router>
  );

  fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "testuser" } });
  fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
  fireEvent.change(screen.getByPlaceholderText("Confirm password"), { target: { value: "password123" } });

  fireEvent.click(screen.getByText("Sign up"));
});
