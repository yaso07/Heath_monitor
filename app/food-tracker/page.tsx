import DailyFoodTrackerList from "../../components/DailyFoodTrackerList"

export default function FoodTrackerPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Daily Food Tracker</h2>
        <p className="mb-4 text-gray-600">Log your daily meals and track your nutrition over time.</p>
        <DailyFoodTrackerList />
      </section>
    </div>
  )
}

