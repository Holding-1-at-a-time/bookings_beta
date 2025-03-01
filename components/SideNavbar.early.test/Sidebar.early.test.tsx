import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "../SideNavbar";
import { useOrganization } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import "@testing-library/jest-dom";

// Mocking necessary hooks and components
jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("@clerk/nextjs", () => ({
  useOrganization: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

jest.mock("../LoadingSpinnerOne", () => () => <div>Loading...</div>);

describe("Sidebar() Sidebar method", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render loading spinner when user is not loaded", () => {
      // Mocking the organization and user state
      (useOrganization as jest.Mock).mockReturnValue({
        isLoaded: false,
        organization: null,
      });
      (currentUser as jest.Mock).mockReturnValue({ user: null });

      render(<Sidebar />);

      // Expect the loading spinner to be displayed
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it('should render "Not Logged In" when user is not available but organization is loaded', () => {
      (useOrganization as jest.Mock).mockReturnValue({
        isLoaded: true,
        organization: null,
      });
      (currentUser as jest.Mock).mockReturnValue({ user: null });

      render(<Sidebar />);

      // Expect the "Not Logged In" message to be displayed
      expect(screen.getByText("Not Logged In")).toBeInTheDocument();
    });

    it("should render user greeting when user is available", () => {
      (useOrganization as jest.Mock).mockReturnValue({
        isLoaded: true,
        organization: { membership: { role: "org:admin" } },
      });
      (currentUser as jest.Mock).mockReturnValue({
        user: { firstName: "John" },
      });

      render(<Sidebar />);

      // Expect the greeting message to be displayed
      expect(screen.getByText("Hello John")).toBeInTheDocument();
    });

    it("should render navigation items based on user role", () => {
      (useOrganization as jest.Mock).mockReturnValue({
        isLoaded: true,
        organization: { membership: { role: "org:admin" } },
      });
      (currentUser as jest.Mock).mockReturnValue({
        user: { firstName: "John" },
      });
      (usePathname as jest.Mock).mockReturnValue("/dashboard");

      render(<Sidebar />);

      // Expect the navigation items to be displayed
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Admin")).toBeInTheDocument();
      expect(screen.getByText("Detailer")).toBeInTheDocument();
      expect(screen.getByText("Appointments")).toBeInTheDocument();
      expect(screen.getByText("Clients")).toBeInTheDocument();
      expect(screen.getByText("Billing")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should not render any navigation items if user role does not match any item roles", () => {
      (useOrganization as jest.Mock).mockReturnValue({
        isLoaded: true,
        organization: { membership: { role: "org:unknown" } },
      });
      (currentUser as jest.Mock).mockReturnValue({
        user: { firstName: "John" },
      });

      render(<Sidebar />);

      // Expect no navigation items to be displayed
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
      expect(screen.queryByText("Admin")).not.toBeInTheDocument();
      expect(screen.queryByText("Detailer")).not.toBeInTheDocument();
      expect(screen.queryByText("Appointments")).not.toBeInTheDocument();
      expect(screen.queryByText("Clients")).not.toBeInTheDocument();
      expect(screen.queryByText("Billing")).not.toBeInTheDocument();
    });

    it("should handle case when organization is null", () => {
      (useOrganization as jest.Mock).mockReturnValue({
        isLoaded: true,
        organization: null,
      });
      (currentUser as jest.Mock).mockReturnValue({
        user: { firstName: "John" },
      });

      render(<Sidebar />);

      // Expect the default organization name to be displayed
      expect(screen.getByText("Smart Booking's")).toBeInTheDocument();
    });
  });
});
