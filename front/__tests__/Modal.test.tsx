import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "@/components/modal/Modal";

describe("Modal component", () => {
	it("does not render when isOpen is false", () => {
		render(
			<Modal isOpen={false} onClose={() => {}} title="Titre test">
				<p>Contenu</p>
			</Modal>,
		);

		// Le modal n’est pas dans le DOM
		expect(screen.queryByText(/titre test/i)).not.toBeInTheDocument();
	});

	it("renders modal when isOpen is true", () => {
		render(
			<Modal isOpen={true} onClose={() => {}} title="Titre test">
				<p>Contenu</p>
			</Modal>,
		);

		expect(screen.getByText(/titre test/i)).toBeInTheDocument();
		expect(screen.getByText(/contenu/i)).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /annuler/i }),
		).toBeInTheDocument();
	});

	it("calls onClose when Annuler is clicked", () => {
		const onClose = jest.fn();

		render(
			<Modal isOpen={true} onClose={onClose} title="Fermeture test">
				<p>Contenu</p>
			</Modal>,
		);

		fireEvent.click(screen.getByRole("button", { name: /annuler/i }));
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("calls onConfirm when Confirmer is clicked", () => {
		const onConfirm = jest.fn();

		render(
			<Modal
				isOpen={true}
				onClose={() => {}}
				title="Confirmer test"
				confirmText="Confirmer"
				onConfirm={onConfirm}
			>
				<p>Test</p>
			</Modal>,
		);

		fireEvent.click(screen.getByRole("button", { name: /confirmer/i }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});

	it("disables confirm button when disableConfirm is true", () => {
		render(
			<Modal
				isOpen={true}
				onClose={() => {}}
				title="Confirm disable"
				confirmText="Confirmer"
				onConfirm={() => {}}
				disableConfirm={true}
			>
				<p>Formulaire</p>
			</Modal>,
		);

		expect(screen.getByRole("button", { name: /confirmer/i })).toBeDisabled();
	});

	it("shows loading text when loading is true", () => {
		render(
			<Modal
				isOpen={true}
				onClose={() => {}}
				title="Chargement"
				confirmText="Confirmer"
				onConfirm={() => {}}
				loading={true}
			>
				<p>Test</p>
			</Modal>,
		);

		expect(screen.getByRole("button", { name: /envoi/i })).toBeInTheDocument();
	});
});
