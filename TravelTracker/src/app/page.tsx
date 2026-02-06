"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: ""
  });

  const fetchTrips = async () => {
    const res = await fetch("/api/trips");
    setTrips(await res.json());
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    fetchTrips();
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>TravelTracker</h1>

      <form onSubmit={submit} style={{ marginTop: 20 }}>
        <input placeholder="Full Name" onChange={e => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Destination" onChange={e => setForm({ ...form, destination: e.target.value })} />
        <input type="date" onChange={e => setForm({ ...form, startDate: e.target.value })} />
        <input type="date" onChange={e => setForm({ ...form, endDate: e.target.value })} />
        <input type="number" placeholder="Budget" onChange={e => setForm({ ...form, budget: e.target.value })} />
        <button type="submit">Save</button>
      </form>

      <ul style={{ marginTop: 40 }}>
        {trips.map((t: any) => (
          <li key={t.id}>
            {t.fullName} → {t.destination}
          </li>
        ))}
      </ul>
    </main>
  );
}
