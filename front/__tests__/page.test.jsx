import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "../src/app/page";

jest.mock("embla-carousel-react", () => {
	return {
		__esModule: true,
		default: () => {
			return [
				jest.fn(), // emblaRef (ref callback)
				{
					on: jest.fn(),
					off: jest.fn(),
					scrollTo: jest.fn(),
					canScrollNext: jest.fn().mockReturnValue(false),
					canScrollPrev: jest.fn().mockReturnValue(false),
				},
			];
		},
	};
});

describe("Page", () => {
	it("renders a heading", () => {
		render(<Page />);

		const heading = screen.getByRole("heading", {
			name: /bienvenue à zombieland/i,
			level: 2,
		});
		expect(heading).toBeInTheDocument();
	});
});
