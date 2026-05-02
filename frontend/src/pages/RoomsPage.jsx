import { useEffect, useState } from 'react';
import RoomCatalog from '../components/RoomCatalog.jsx';
import { apiGet } from '../services/api.js';
import { formatPeso } from '../utils/format.js';

function RoomsPage() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    async function loadRooms() {
      const rooms = await apiGet('/rooms');
      setCatalog(Array.isArray(rooms) ? rooms : rooms.value || []);
    }

    loadRooms().catch(() => {
      setCatalog([]);
    });
  }, []);

  return (
    <main className="stack-grid">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Accommodations</p>
          <h1 className="page-title">Rooms and Villas</h1>
         {/*  <p>These room cards are loaded from the live backend API.</p> */}
        </div>
      </section>

      <RoomCatalog
        catalog={catalog}
        formatPeso={formatPeso}
        eyebrow="Room Preview"
        title="Available Accommodations"
        description="Browse the current room inventory coming from the live backend."
      />
    </main>
  );
}

export default RoomsPage;
