export function FloatImg({ src, style }) {
  return (
    <div
      className="float-obj"
      style={{
        ...style,
        position: 'absolute',
        transition: 'transform .1s linear',
      }}
    >
      <div
        style={{
          width: style.width,
          aspectRatio: '3/4',
          borderRadius: 4,
          overflow: 'hidden',
          border: '8px solid #fdf8ef',
          boxShadow: '0 30px 50px -10px rgba(74, 20, 28, .4)',
        }}
      >
        <img
          src={src}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt=""
        />
      </div>
    </div>
  );
}
