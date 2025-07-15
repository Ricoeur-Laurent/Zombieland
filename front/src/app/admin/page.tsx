"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTokenContext } from "@/context/TokenProvider";

export default function AdminPage() {
	const { user } = useTokenContext();
	const router = useRouter();

	useEffect(() => {
		if (user === null) {
			router.replace("/connexion");
		} else if (!user.admin) {
			router.replace("/unauthorized");
		}
	}, [user, router]);
	return (
		<div className="min-h-screen flex flex-col items-center justify-start px-4 py-12 bg-background text-text">
			<h1>hello admin</h1>
		</div>
	);
}
