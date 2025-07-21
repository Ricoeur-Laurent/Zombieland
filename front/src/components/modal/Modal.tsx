"use client";

import type { ReactNode } from "react";

// Props type definition for the reusable Modal component
interface ModalProps {
	isOpen: boolean; // Controls the visibility of the modal
	onClose: () => void; // Callback when the user closes the modal
	title: string; // Modal header title
	children: ReactNode; // Modal content (usually a form or message)
	confirmText?: string; // Text for the confirm button
	onConfirm?: () => void; // Callback when user confirms action
	disableConfirm?: boolean; // Disable confirm button (e.g. invalid form)
	loading?: boolean; // Shows a loading state on confirm button
}

/**
 * Modal is a reusable component to display a dialog overlay.
 * It blocks interaction with the rest of the UI until dismissed.
 */

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	confirmText = "Confirmer",
	onConfirm,
	disableConfirm = false,
	loading = false,
}: ModalProps) {
	// Don't render if the modal is not open
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center">
			{/* Modal container */}
			<div className="bg-bg rounded-lg p-6 w-full max-w-md shadow-lg">
				{/* Modal title */}
				<h3 className="text-xl font-bold mb-4 text-primary font-subtitle uppercase">
					{title}
				</h3>
				{/* Modal content */}
				<div className="text-text font-body mb-4">{children}</div>
				{/* Modal footer actions */}
				<div className="flex justify-end gap-2">
					{/* Cancel button */}
					<button
						type="button"
						onClick={onClose}
						className="px-3 py-1 rounded bg-muted text-bg hover:bg-muted/80 transition font-subtitle uppercase"
					>
						Annuler
					</button>

					{/* Confirm button (optional) */}
					{onConfirm && (
						<button
							type="button"
							onClick={onConfirm}
							disabled={disableConfirm || loading}
							className={`px-3 py-1 rounded font-subtitle uppercase transition ${
								confirmText.toLowerCase().includes("supprim") ||
								confirmText.toLowerCase().includes("annul")
									? "bg-red-600 hover:bg-red-700"
									: "bg-primary text-black hover:bg-primary-dark"
							} disabled:opacity-50`}
						>
							{/* Show loading state if needed */}
							{loading ? "Envoi…" : confirmText}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
