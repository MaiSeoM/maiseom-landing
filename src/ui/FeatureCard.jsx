export default function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm p-6 hover:shadow-md transition">
      <div className="flex items-start gap-3">
        <div className="text-[#2066CC]">{icon}</div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}
