function RoomCatalog({
  catalog,
  formatPeso,
  title = 'Current Room Catalog',
  eyebrow = 'Room Preview',
  description = 'Loaded from the `GET /rooms` endpoint.'
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="room-catalog">{title}</h2>
        <p>{description}</p>
      </div>

      <div className={catalog.length ? 'room-list' : 'room-list empty-state'}>
        {catalog.length ? catalog.map((room) => (
          <article className="room-card" key={room.id}>
            {room.primary_image_url ? (
              <img
                className="room-card-image"
                src={room.primary_image_url}
                alt={room.primary_image_alt || `${room.room_name} photo`}
                loading="lazy"
              />
            ) : null}
            <header>
              <div>
                <h3>{room.room_name}</h3>
                <p className="room-meta">{room.room_type_name || 'Room'} - #{room.room_number}</p>
              </div>
              <span className="price">{formatPeso(room.effective_price || room.price_override || 0)}</span>
            </header>
            <p className="room-meta">{room.description || 'Room description not available yet.'}</p>
          </article>
        )) : 'Loading rooms...'}
      </div>
    </section>
  );
}

export default RoomCatalog;
