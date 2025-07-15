"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminPage from "@/components/admin/AdminPage";
import { useTokenContext } from "@/context/TokenProvider";

export default function AdminRouteGuard() {
	const { user, loading } = useTokenContext();
	const router = useRouter();

	useEffect(() => {
		if (!loading) {
			if (user === null) {
				router.replace("/connexion");
			} else if (!user.admin) {
				router.replace("/unauthorized");
			}
		}
	}, [user, loading, router]);
	
	if (loading) {
		return <p className="text-center mt-6">Chargement...</p>;
	}
	
	return <AdminPage />;
}