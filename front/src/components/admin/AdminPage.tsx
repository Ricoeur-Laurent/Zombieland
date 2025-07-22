import AttractionsSection from "@/components/admin/sections/AttractionsSection";
import CategoriesSection from "@/components/admin/sections/CategoriesSection";
import MembersSection from "@/components/admin/sections/MembersSection";
import ReservationsSection from "./sections/ReservationsSection";

// Main admin dashboard page
export default function AdminPage() {
	return (
		<div className="max-w-md mx-auto px-4 py-8 text-text font-body">
			<h1 className="text-3xl font-subtitle text-primary text-center mb-8 uppercase">
				Admin Page
			</h1>

			{/* Sections of the admin dashboard */}
			<AttractionsSection />
			<CategoriesSection />
			<MembersSection />
			<ReservationsSection />
		</div>
	);
}
