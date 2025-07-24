import AttractionsSection from "@/components/admin/sections/AttractionsSection";
import CategoriesSection from "@/components/admin/sections/CategoriesSection";
import MembersSection from "@/components/admin/sections/MembersSection";
import ReservationsSection from "./sections/ReservationsSection";

// Main admin dashboard page
export default function AdminPage() {
	return (
		<div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto text-text ">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				ADMIN PAGE
			</h2>

			{/* Sections of the admin dashboard */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="bg-surface/70 border-l-4 border-primary rounded-xl p-6 shadow-lg">
					<AttractionsSection />
				</div>
				<div className="bg-surface/70 border-l-4 border-primary rounded-xl p-6 shadow-lg">
					<CategoriesSection />
				</div>
				<div className="bg-surface/70 border-l-4 border-primary rounded-xl p-6 shadow-lg">
					<MembersSection />
				</div>
				<div className="bg-surface/70 border-l-4 border-primary rounded-xl p-6 shadow-lg">
					<ReservationsSection />
				</div>
			</div>
		</div>
	);
}
