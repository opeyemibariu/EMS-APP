import { Link } from "react-router-dom";


export default function WorkerCard({ worker }) {
  return (
    <Link to={`/${worker._id}`} className='link'>
      <div style={styles.card}>
        <div style={styles.header}>
          <h3 style={styles.name}>{worker.name}</h3>
          <span style={styles.role}>{worker.role}</span>
        </div>

        <div style={styles.body}>
          <p><strong>Email:</strong> {worker.email}</p>
          <p><strong>Phone:</strong> {worker.phone}</p>
          <p><strong>Status:</strong> {worker.status}</p>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    width: "280px",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    margin: "6px",
    display: "inline-block"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  name: {
    margin: 0,
    textTransform: "capitalize"
  },
  role: {
    fontSize: "12px",
    padding: "4px 8px",
    background: "#eee",
    borderRadius: "8px",
    textTransform: "capitalize"
  },
  body: {
    fontSize: "14px",
    marginBottom: "12px"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between"
  },
  editBtn: {
    padding: "6px 10px",
    border: "none",
    background: "#3498db",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  },
  deleteBtn: {
    padding: "6px 10px",
    border: "none",
    background: "#e74c3c",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer"
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  actions2: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  }
};