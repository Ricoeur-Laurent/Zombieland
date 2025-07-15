import AttractionsSection from "@/components/admin/sections/AttractionsSection";
import CategoriesSection from "@/components/admin/sections/CategoriesSection";
import UsersSection from "@/components/admin/sections/UsersSection";
import ReservationsSection from "./sections/ReservationsSection";

export default function AdminPage() {
	return (
		<div className="max-w-md mx-auto px-4 py-8 text-text font-body">
			<h1 className="text-3xl font-subtitle text-primary text-center mb-8 uppercase">
				Admin Page
			</h1>

			<AttractionsSection />
			<CategoriesSection />
			<UsersSection />
			<ReservationsSection />
		</div>
	);
}
