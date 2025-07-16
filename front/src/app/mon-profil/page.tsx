import MyProfile from "@/components/myProfile/MyProfile";

export const metadata = {
    title: "Mon profil – Zombieland",
    description:
        "Consultez et modifiez votre profil facilement depuis votre espace personnel"
};

export default function ProfilePage() {
    return (
    <div className="max-w-sm mx-auto px-4 py-8 text-text font-body">
                <h1 className="text-3xl font-subtitle text-primary text-center mb-8 uppercase">
                    Gestion du profil
                </h1>
                <MyProfile />
    

            </div>
    )
}