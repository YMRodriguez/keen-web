// app/why/page.js
export default function Why() {
  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-claret mb-6">Why Keen?</h1>
        <div className="space-y-6 text-holly">
          <p>
            Keen is not just another dating app. We're on a mission to revolutionize the way Gen Z connects and builds relationships.
          </p>
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>One match at a time, based on deep compatibility</li>
            <li>A dedicated space for meaningful connections</li>
            <li>Supporting new and existing couples in their journey</li>
          </ul>
          <h2 className="text-2xl font-semibold">What Sets Us Apart</h2>
          <p>
            Keen offers two unique products:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Finding Product:</strong> Our innovative matching algorithm ensures you connect with one highly compatible person at a time, allowing for deeper, more meaningful interactions.
            </li>
            <li>
              <strong>Building Product:</strong> We support couples in nurturing their relationships through quality time, shared experiences, and financial goals.
            </li>
          </ol>
          <p>
            Join us in redefining modern relationships and creating lasting connections in the digital age.
          </p>
        </div>
      </div>
    </main>
  )
}