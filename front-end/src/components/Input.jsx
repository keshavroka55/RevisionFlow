function Input({ label, type, value, onChange }) {
  return (
    <div style={{ margin: "10px 0" }}>
      <label>
        {label}
        <input
          type={type}
          value={value}
          onChange={onChange}
          style={{ marginLeft: 10 }}
        />
      </label>
    </div>
  );
}

export default Input;
