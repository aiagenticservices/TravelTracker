"use client";

import { useEffect, useState } from "react";

type Trip = {
  id: number;
  fullName: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
};

type DestinationInfo = {
  destination: string;
  budget: number;
  hotels: { name: string; avgPricePerNight: number }[];
  restaurants: { name: string; avgPricePerMeal: number }[];
  activities: { name: string; avgPricePerPerson: number }[];
  topThings: any[];
};

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<DestinationInfo | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: ""
  });

  const fetchTrips = async () => {
    const res = await fetch("/api/trips");
    const data = await res.json();
    setTrips(data);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget)
        })
      });
      if (!res.ok) throw new Error("Failed to create trip");
      setForm({
        fullName: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: ""
      });
      await fetchTrips();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    await fetchTrips();
  };

  const handleViewInfo = async (trip: Trip) => {
    setInfoLoading(true);
    setSelectedInfo(null);
    try {
      const res = await fetch("/api/destination-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          budget: trip.budget
        })
      });
      const data = await res.json();
      setSelectedInfo(data);
    } finally {
      setInfoLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        maxWidth: 960,
        margin: "0 auto",
        padding: "2.5rem 1.5rem"
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        TravelTracker – CRUD + Destination Insights
      </h1>

      {/* Form */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          marginBottom: "2rem"
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Create a Trip
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem"
          }}
        >
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db" }}
          />
          <input
            name="destination"
            placeholder="Destination"
            value={form.destination}
            onChange={handleChange}
            required
            style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db" }}
          />
          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", width: "100%" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", width: "100%" }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>Budget (USD)</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              required
              style={{ padding: "0.5rem 0.75rem", borderRadius: 8, border: "1px solid #d1d5db", width: "100%" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1rem",
              borderRadius: 999,
              border: "none",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
              justifySelf: "flex-start"
            }}
          >
            {loading ? "Saving..." : "Save Trip"}
          </button>
        </form>
      </section>

      {/* Trips list */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Saved Trips
        </h2>
        {trips.length === 0 && (
          <p style={{ color: "#6b7280" }}>No trips yet. Create one above.</p>
        )}
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {trips.map(trip => (
            <li
              key={trip.id}
              style={{
                backgroundColor: "#ffffff",
                padding: "0.9rem 1rem",
                borderRadius: 10,
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap"
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>
                  {trip.fullName} → {trip.destination}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {trip.startDate.slice(0, 10)} to {trip.endDate.slice(0, 10)} | Budget: $
                  {trip.budget}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => handleViewInfo(trip)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: 999,
                    border: "none",
                    backgroundColor: "#059669",
                    color: "#ffffff",
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  View top 5 things
                </button>
                <button
                  onClick={() => handleDelete(trip.id)}
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: 999,
                    border: "none",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: 12,
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Destination info */}
      <section
        style={{
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}
      >
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Destination details (live data placeholder)
        </h2>
        {infoLoading && <p>Loading destination info…</p>}
        {!infoLoading && !selectedInfo && (
          <p style={{ color: "#6b7280" }}>
            Select a trip and click &quot;View top 5 things&quot;.
          </p>
        )}
        {selectedInfo && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ fontWeight: 600 }}>
              {selectedInfo.destination} – Budget: ${selectedInfo.budget}
            </p>

            <div>
              <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Top 5 things to do</h3>
              <ul style={{ paddingLeft: "1.25rem", fontSize: 14 }}>
                {selectedInfo.topThings.map((item: any, idx: number) => (
                  <li key={idx}>
                    {item.name} –{" "}
                    {"avgPricePerNight" in item &&
                      `Hotel avg/night: $${item.avgPricePerNight}`}
                    {"avgPricePerMeal" in item &&
                      `Meal avg: $${item.avgPricePerMeal}`}
                    {"avgPricePerPerson" in item &&
                      `Activity avg/person: $${item.avgPricePerPerson}`}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                fontSize: 14
              }}
            >
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Hotels</h4>
                <ul style={{ paddingLeft: "1.25rem" }}>
                  {selectedInfo.hotels.map((h, i) => (
                    <li key={i}>
                      {h.name} – ${h.avgPricePerNight}/night
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Restaurants</h4>
                <ul style={{ paddingLeft: "1.25rem" }}>
                  {selectedInfo.restaurants.map((r, i) => (
                    <li key={i}>
                      {r.name} – ${r.avgPricePerMeal}/meal
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: 4 }}>Activities</h4>
                <ul style={{ paddingLeft: "1.25rem" }}>
                  {selectedInfo.activities.map((a, i) => (
                    <li key={i}>
                      {a.name} – ${a.avgPricePerPerson}/person
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
