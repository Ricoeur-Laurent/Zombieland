import MyProfile from "@/components/myProfile/MyProfile";
import { Suspense } from "react";

export const metadata = {
	title: "Mon profil – Zombieland",
	description:
		"Consultez et modifiez votre profil facilement depuis votre espace personnel",
};


export default function ProfilePage() {

    return (
      <div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto">
            <h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
                Gestion du profil
            </h2>
            <Suspense  fallback={<p className="text-center mt-6">Chargement...</p>}>
                <MyProfile />
            </Suspense>
        </div>
    )
}

