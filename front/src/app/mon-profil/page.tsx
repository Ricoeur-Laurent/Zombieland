import MyProfil from "@/components/mon-profil/MyProfile";

export const metadata = {
    title: "Mon profil – Zombieland",
    description:
        "Consultez et modifiez votre profil facilement depuis votre espace personnel"
};

export default function MonProfilPage() {
    return (
        <main className="max-w-md mx-auto p-4">
            <h1 className="text-primary font-subtitle text-3xl text-center mt-4">
                Mon profil
            </h1>
            <MyProfil />
        </main>
    );
}