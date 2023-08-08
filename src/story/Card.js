function Card({ title, text, date, image, tag, published, author }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
      {published === 'yes' && <img src={image} alt={title} />}
      <h3>{title}</h3>
      <p>{text}</p>
      <span>{date}</span>
      <div>{tag}</div>
      <div>{published === 'yes' ? 'Published' : 'Not Published'}</div>
      <div>{author}</div>
    </div>
  );
}