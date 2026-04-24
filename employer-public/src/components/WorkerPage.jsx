import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function WorkerPage({setMonitor, handleDel}) {
  const [worker, setWorker] = useState(null);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [del, setDel] = useState(false)
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newWorker = {
      ...form,
    };

    fetch(`api/workers/${worker._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newWorker)})
    .then(res => res.json())
    .then(() => setMonitor(prev => !prev))

    setOpen(prev => !prev);
    setDone(prev => !prev);
  };

  const { id } = useParams()
  useEffect(() => {
    fetch(`/api/workers/${id}`)
      .then(res => res.json())
      .then(data => setWorker(data))
      .catch(err => console.log(err));
  }, [done]);

  if (!worker)
    return (
      <div style={styles.page2}>
        Loading worker...
      </div>
    );
  if (worker.message) return <p style={styles.page2}>{worker.message}</p>

  return (
      <>
        <button style={styles.editBtn} onClick={() => window.history.back()}>
          Go Back
        </button>
        {!del ?
          <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.header}>
              <div>
                <h1 style={styles.name}>{worker?.name}</h1>
                <span style={styles.role}>{worker?.role}</span>
                <span
                  style={{
                    ...styles.status,
                    background: worker?.status === "active" ? "#2ecc71" : "#e74c3c"
                  }}
                >
                  {worker.status}
                </span>
              </div>
              <div style={styles.actions}>
                <button style={styles.editBtn} onClick={() => setOpen(prev => !prev)}>
                  Edit
                </button>
                {/* MODAL */}
                {open && (
                  <div style={styles.overlay}>
                    <div style={styles.modal}>
                      <h2>Add Worker</h2>

                      <form onSubmit={handleSubmit} style={styles.form}>
                        <input name="name" placeholder="Name" onChange={handleChange} />
                        <input name="role" placeholder="Role" onChange={handleChange} />
                        <input name="email" placeholder="Email" onChange={handleChange} />
                        <input name="phone" placeholder="Phone" onChange={handleChange} />
                        <input name="address" placeholder="Address" onChange={handleChange} />
                        <input name="status" placeholder="Status" onChange={handleChange} />

                        {/* NEW FIELD */}
                        <input name="wkratings" placeholder="Worker Rating" onChange={handleChange} />

                        <div style={styles.actions2}>
                          <button type="button" onClick={() => setOpen(false)}>
                            Cancel
                          </button>
                          <button type="submit">Create</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                <button style={styles.deleteBtn} onClick={() => {
                  handleDel(id, setMonitor, setDel)
                }}>
                  Delete
                </button>
              </div>
            </div>

            {/* DETAILS CARD */}
            <div style={styles.card}>
              <h3>Worker Details</h3>

              <p><strong>Email:</strong> {worker?.email}</p>
              <p><strong>Phone:</strong> {worker?.phone}</p>
              <p><strong>Address:</strong> {worker?.address}</p>
              <p><strong>Joined:</strong> {new Date(worker?.createdAt).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) || "Unknown"}
              </p>
              <p><strong>WeekRate:</strong> {worker?.wkratings}</p>
            </div>
          </div> : <p style={styles.page2}>deleted</p>
        }
    </>
    
  );
}

const styles = {
  page: {
    padding: "20px",
    background: "#f4f6f8",
    minHeight: "100vh"
  },
  page2: {
    padding: "20px",
    background: "#f4f6f8",
    minHeight: "50vh",
    fontSize: "4rem",
    margin: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "12px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },
  name: {
    margin: 0,
    textTransform: "capitalize"
  },
  role: {
    marginRight: "10px",
    padding: "4px 8px",
    background: "#ddd",
    borderRadius: "6px",
    fontSize: "12px",
    textTransform: "capitalize"
  },
  status: {
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#fff",
    marginLeft: "5px"
  },
  card: {
    background: "#fff",
    padding: "16px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "6px"
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