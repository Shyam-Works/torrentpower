import { useState } from "react";
import items from "../data/items.json";

export default function Home() {
  const [formData, setFormData] = useState({});
  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [store, setStore] = useState("");
  const [orderNo, setOrderNo] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const handleInputChange = (category, item, quantity, id) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [id]: {
          id,
          name: item,
          quantity: parseInt(quantity) || 0,
        },
      },
    }));
  };

  const handleSubmit = async () => {
    if (!name.trim()  || !store.trim()) {
      alert("Please enter your name, store, and email.");
      return;
    }
    const generatedEmail = `${name.trim().toLowerCase().replace(/\s+/g, '')}@gmail.com`;

    const response = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: generatedEmail, store, orderNo, formData }),
    });
  
    if (response.ok) {
      setSubmitted(true);
    } else {
      alert("Error submitting the form.");
    }
  };
  

  if (submitted) {
    return (
      <h2 style={{ textAlign: "center", padding: "2rem" }}>
        Thanks, {name}! Your request was sent.
      </h2>
    );
  }

  return (
    
    <div style={styles.container}>
      
      <h1 style={styles.heading}><b>Contractor Order Form</b></h1>

      <div style={styles.inputContainer}>
  <label style={styles.xyz}>Recipient Name*</label>
  <input
    type="text"
    placeholder="Recipient Name"
    value={name}
    style={styles.fullInput}
    onChange={(e) => setName(e.target.value)}
  />

  <label style={styles.xyz}>Store Location*</label>
  <select
    value={store}
    onChange={(e) => setStore(e.target.value)}
    style={styles.fullInput}
  >
    <option value="">Select Store</option>
    <option value="A-station">A-station</option>
    <option value="D-station">D-station</option>
    <option value="E-station">E-station</option>
  </select>

  <label style={styles.xyz}>Order Number</label>
  <input
    type="text"
    placeholder="Optional Order Number"
    value={orderNo}
    style={styles.fullInput}
    onChange={(e) => setOrderNo(e.target.value)}
  />

  {/* <label style={styles.xyz}>Email*</label>
  <input
    type="email"
    placeholder="Your Email"
    value={email}
    style={styles.fullInput}
    onChange={(e) => setEmail(e.target.value)}
  /> */}
</div>

      {Object.entries(items).map(([category, itemList]) => (
        <div key={category} style={styles.categoryBox}>
          <div
            style={styles.categoryHeader}
            onClick={() =>
              setOpenCategory(openCategory === category ? null : category)
            }
          >
            <h2 style={styles.categoryTitle}>{category}</h2>
            <span style={styles.toggleIcon}>
              {openCategory === category ? "−" : "+"}
            </span>
          </div>

          {openCategory === category && (
            <div style={styles.itemList}>
              {itemList.map((item) => (
                <div key={item.id || item.name} style={styles.itemRow}>
                  <label style={styles.itemLabel}>{item.name}</label>
                  <label style={styles.itemLabel}>{item.id}</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    style={styles.inputField}
                    onChange={(e) =>
                      handleInputChange(category, item.name, e.target.value, item.id)
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}




      <div style={styles.submitWrapper}>
        <button onClick={handleSubmit} style={styles.submitButton}>
          Submit Order
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "1rem",
    maxWidth: "500px",
    height: "100%",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f6f7eb", // black background
    color: "#fff", // white text
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#393e41",
    fontSize: "1.8rem",
  },
  categoryBox: {
    marginTop: "2rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    backgroundColor: "#393e41"
    
  },
  categoryHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.8rem 1rem",
    cursor: "pointer",
    backgroundColor: "#363636",
    color: "#fff",
    borderRadius: "10px"
  },
  categoryTitle: {
    margin: 0,
    fontSize: "1rem",
  },
  toggleIcon: {
    fontSize: "1.2rem",
  },
  itemList: {
    padding: "0.5rem 1rem",
    maxHeight: "300px",
    overflowY: "auto",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    alignItems: "center",
    color: "#fff",
  },
  itemLabel: {
    flex: 1,
    fontSize: "0.95rem",
  },
  inputField: {
    width: "60px",
    padding: "6px",
    fontSize: "0.9rem",
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #666",
    borderRadius: "10px 10px 10px 10px",  
  },
  inputContainer: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    
  },
  fullInput: {
    padding: "10px",
    fontSize: "1rem",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "1px solid #555",
    borderRadius: "4px",
  },
  submitWrapper: {
    // position: "sticky",
    bottom: 0,
    backgroundColor: "#f6f7eb",
    padding: "1rem 0",
    textAlign: "center",
  },
  submitButton: {
    padding: "5px 12px",
    fontSize: "1rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  xyz: {
    color: "#000000",
    fontWeight: "bold",
  }
}
