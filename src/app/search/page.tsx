import Navbar from '@/components/Navbar';

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            <div className="container mx-auto px-4 pt-24">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Search Results</h1>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-dashed border-gray-300">
                    <p className="text-gray-500">No results found yet. (Placeholder)</p>
                </div>
            </div>
        </div>
    );
}
