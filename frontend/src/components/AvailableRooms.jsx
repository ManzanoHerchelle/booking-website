function AvailableRooms({
  availableRooms,
  selectedRoomIds,
  selectedRooms,
  numberOfNights,
  estimatedTotal,
  onToggleRoom,
  formatPeso
}) {
  return (
    <section className="availability-section">
      <div className="section-head">
        <h3>Available Rooms</h3>
        <p>Select one or more rooms to see availability.</p>
      </div>

      {!!selectedRoomIds.length && (
        <div className="summary-card">
          <div><strong>Selected rooms:</strong> {selectedRooms.map((room) => room.room_name).join(', ')}</div>
          <div><strong>Nights:</strong> {numberOfNights}</div>
          <div><strong>Estimated total:</strong> {formatPeso(estimatedTotal)}</div>
        </div>
      )}

      <div className={availableRooms.length ? 'results-grid' : 'results-grid empty-state'}>
        {availableRooms.length ? availableRooms.map((room) => (
          <article className="availability-card" key={room.id}>
            <header>
              <div>
                <span className="tag">{room.room_type_name}</span>
                <h3>{room.room_name}</h3>
                <p className="room-meta">Room {room.room_number}</p>
              </div>
              <strong className="price">{formatPeso(room.effective_price)}</strong>
            </header>
            <p className="room-meta">{room.description || 'No description available.'}</p>
            <div className="room-meta">
              <span>Base capacity: {room.base_capacity}</span>
              <span>Max capacity: {room.max_capacity}</span>
              <span>Status: {room.status}</span>
            </div>
            <label className="select-row">
              <span>Select this room</span>
              <input
                type="checkbox"
                checked={selectedRoomIds.includes(room.id)}
                onChange={() => onToggleRoom(room.id)}
              />
            </label>
          </article>
        )) : 'Check availability to load rooms.'}
      </div>
    </section>
  );
}

export default AvailableRooms;
