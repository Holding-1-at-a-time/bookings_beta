import React from "react";
import SignInPage from "../page";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the SignIn component from @clerk/nextjs
jest.mock("@clerk/nextjs", () => ({
  SignIn: () => <div>Mocked SignIn Component</div>,
}));

describe("SignInPage() SignInPage method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the SignInPage component correctly", () => {
      // This test checks if the SignInPage component renders without crashing
      const { getByText } = render(<SignInPage />);
      expect(getByText("Mocked SignIn Component")).toBeInTheDocument();
    });

    it("should apply the correct styles to the SignIn component", () => {
      // This test checks if the SignIn component has the correct styles applied
      const { container } = render(<SignInPage />);
      const signInContainer = container.firstChild;
      expect(signInContainer).toHaveClass(
        "flex justify-center items-center min-h-screen py-12",
      );
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle the absence of SignIn component gracefully", () => {
      // This test checks if the component handles the absence of SignIn gracefully
      jest.mock("@clerk/nextjs", () => ({
        SignIn: () => null,
      }));

      const { container } = render(<SignInPage />);
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it("should render without crashing even if SignIn component throws an error", () => {
      // This test checks if the component renders without crashing even if SignIn throws an error
      jest.mock("@clerk/nextjs", () => ({
        SignIn: () => {
          throw new Error("SignIn component error");
        },
      }));

      expect(() => render(<SignInPage />)).not.toThrow();
    });
  });
});
