import AttractionMap from '@/components/attractionMap/AttractionMap';

export default function MapPage() {
  return (
    <div className="px-4 py-6 max-w-6xl mx-auto">
      <h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Plan du parc
			</h2>
      <AttractionMap />
    </div>
  );
}
