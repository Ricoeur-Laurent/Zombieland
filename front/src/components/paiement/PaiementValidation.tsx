"use client";

export default function PaiementValidation() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background p-8 rounded shadow-lg text-center text-text">
                <h3 className="text-2xl font-bold mb-4 text-primary">Paiement validé !</h3>
                <p>Vous allez être redirigé vers votre page de réservations...</p>
            </div>
        </div>
    );
}
