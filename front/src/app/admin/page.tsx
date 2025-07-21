"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminPage from "@/components/admin/AdminPage";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminRouteGuard() {
	const { user, loading } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (!user) {
				router.replace("/connexion");
			} else if (!user.admin) {
				router.replace("/unauthorized");
			}
		}
	}, [user, loading, router]);

	if (loading) return <p className="text-center mt-6">Chargement...</p>;

	if (!user || !user.admin) {
		//  Strictly block rendering if redirection is necessary
		return null;
	}

	return <AdminPage />;
}
