"use client";

import type { ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	confirmText?: string;
	onConfirm?: () => void;
	disableConfirm?: boolean;
	loading?: boolean;
}

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
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center">
			<div className="bg-bg rounded-lg p-6 w-full max-w-md shadow-lg">
				<h3 className="text-xl font-bold mb-4 text-primary font-subtitle uppercase">
					{title}
				</h3>

				<div className="text-text font-body mb-4">{children}</div>

				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="px-3 py-1 rounded bg-muted text-bg hover:bg-muted/80 transition font-subtitle uppercase"
					>
						Annuler
					</button>
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
							{loading ? "Envoi…" : confirmText}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
