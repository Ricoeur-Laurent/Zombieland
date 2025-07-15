"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminPage from "@/components/admin/AdminPage";
import { useTokenContext } from "@/context/TokenProvider";

export default function AdminRouteGuard() {
	const { user } = useTokenContext();
	const router = useRouter();

	useEffect(() => {
		if (user === null) {
			router.replace("/connexion");
		} else if (!user.admin) {
			router.replace("/unauthorized");
		}
	}, [user, router]);
	return <AdminPage />;
}
