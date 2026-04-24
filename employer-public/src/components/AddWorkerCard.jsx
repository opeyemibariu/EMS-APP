import { useState, useEffect } from "react";

export default function AddWorkerCard({ setMonitor }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdWorker, setCreatedWorker] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    adminCode: ""
  });

  // 6-char alphanumeric password generator
  const generatePassword = (length = 6) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    if (!open && !showSuccess) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showSuccess) handleCloseSuccess();
        else setOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [open, showSuccess]);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const generatedPassword = generatePassword(6);

    const newWorker = {
     ...form,
      status: "active",
      password: String(generatedPassword),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/auth/register-employee', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWorker)
      });
      console.log(await res.json())

      if (!res.ok) throw new Error("Failed to create employee");

      setCreatedWorker({ email: form.email, password: generatedPassword });
      setOpen(false);
      setShowSuccess(true);
      setMonitor(prev =>!prev);
      
      setForm({
        name: "",
        role: "",
        email: "",
        phone: "",
        address: "",
        adminCode: ""
      });
    } catch (err) {
      alert("Error creating worker");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const text = `Email: ${createdWorker.email}\nPassword: ${createdWorker.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setCreatedWorker(null);
    setCopied(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      if (showSuccess) handleCloseSuccess();
      else setOpen(false);
    }
  };

  return (
    <>
      <div style={styles.card} onClick={() => setOpen(true)}>
        <div style={styles.plus}>+</div>
      </div>

      {/* CREATE WORKER MODAL */}
      {open && (
        <div style={styles.overlay} onClick={handleBackdropClick}>
          <div style={styles.modal}>
            <h2>Add Worker</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="role"
                placeholder="Role"
                value={form.role}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone (11 digits)"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength={11}
                pattern="\d{11}"
              />
              <input
                name="adminCode"
                placeholder="Admin Code (6 alphanumeric chars)"
                value={form.adminCode}
                onChange={handleChange}
                required
                maxLength={6}
                pattern="[A-Za-z0-9]{6}"
              />
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
              />

              <div style={styles.actions}>
                <button type="button" onClick={() => setOpen(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS + COPY MODAL */}
      {showSuccess && createdWorker && (
        <div style={styles.overlay} onClick={handleBackdropClick}>
          <div style={styles.modal}>
            <h2 style={styles.successTitle}>Worker Created!</h2>
            <p style={styles.successText}>Share these credentials with the employee:</p>
            
            <div style={styles.credentialsBox}>
              <div style={styles.credRow}>
                <strong>Email:</strong> {createdWorker.email}
              </div>
              <div style={styles.credRow}>
                <strong>Password:</strong> {createdWorker.password}
              </div>
            </div>

            <div style={styles.actions}>
              <button 
                type="button" 
                onClick={handleCopy}
                style={styles.copyBtn}
              >
                {copied ? "✓ Copied!" : "Copy Credentials"}
              </button>
              <button 
                type="button" 
                onClick={handleCloseSuccess}
                style={styles.doneBtn}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  card: {
    width: "250px",
    height: "160px",
    border: "2px dashed #aaa",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "#fafafa",
    transition: "background 0.2s"
  },
  plus: {
    fontSize: "48px",
    color: "#555"
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
    justifyContent: "center",
    zIndex: 9999
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "340px",
    maxWidth: "90vw"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    gap: "10px"
  },
  successTitle: {
    margin: "0 0 10px 0",
    color: "#2ecc71"
  },
  successText: {
    margin: "0 0 15px 0",
    fontSize: "14px",
    color: "#555"
  },
  credentialsBox: {
    background: "#f4f6f8",
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    marginBottom: "10px"
  },
  credRow: {
    margin: "6px 0",
    fontSize: "14px",
    wordBreak: "break-all"
  },
  copyBtn: {
    flex: 1,
    padding: "10px",
    border: "none",
    background: "#3498db",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  doneBtn: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    background: "#fff",
    color: "#333",
    borderRadius: "6px",
    cursor: "pointer"
  }
};