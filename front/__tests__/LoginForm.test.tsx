import { render, screen } from "@testing-library/react";

// Importing userEvent to simulate real user interactions (typing, clicking, etc.)
import userEvent from "@testing-library/user-event";
import ConnexionForm from "@/components/Login/LoginForm";

// Mocking Next.js navigation hooks (useRouter and useSearchParams)
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: jest.fn(), // Mock for router.push redirection
	}),
	useSearchParams: () => ({
		get: jest.fn().mockReturnValue("/reservations"), // Mock for URL search param "redirect"
	}),
}));
// Grouping all tests related to the login form component
describe("Login component", () => {
	// Test to ensure the form inputs accept user input values
	it("allows user to type email and password", async () => {
		// Render the login form in a virtual DOM
		render(<ConnexionForm />);
		// Grab the email and password input fields using their labels
		const emailInput = screen.getByLabelText(/email/i);
		const passwordInput = screen.getByLabelText(/mot de passe/i);
		// Simulate typing into the input fields
		await userEvent.type(emailInput, "test@email.com");
		await userEvent.type(passwordInput, "changeme");
		// Assert that the fields contain the expected values
		expect(emailInput).toHaveValue("test@email.com");
		expect(passwordInput).toHaveValue("changeme");
	});
	// Mocking the global fetch function to simulate a successful login response
	global.fetch = jest.fn(() =>
		Promise.resolve({
			ok: true, // Simulates HTTP 200 response
			json: () => Promise.resolve({ user: { admin: false } }), // Simulated user data
		}),
	) as jest.Mock;
	// Test to ensure the form calls the API on submit
	it("calls fetch on form submit", async () => {
		render(<ConnexionForm />);
		// Fill in the form fields
		await userEvent.type(screen.getByLabelText(/email/i), "test@email.com");
		await userEvent.type(screen.getByLabelText(/mot de passe/i), "changeme");
		// Click the submit button
		await userEvent.click(
			screen.getByRole("button", { name: /me connecter/i }),
		);
		// Ensure fetch was called once
		expect(fetch).toHaveBeenCalledTimes(1);

		// Ensure the fetch call was made to the correct login endpoint
		expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: "test@email.com",
				password: "changeme",
			}),
			credentials: "include",
		});
	});
});
