import WorkerCard from './WorkerCard'
import AddWorkerCard from './AddWorkerCard'

const WokersContainer = ({workers, setMonitor, handleLogout}) => {
  return (
    <>
      <h1 style={{textAlign: 'center', margin: '60px 0', fontSize: '3rem'}}>Your Workers</h1>
      { workers?.map(worker => <WorkerCard key={worker._id} worker={worker}/>) }
      <AddWorkerCard setMonitor={setMonitor}/>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* <h2>Dashboard</h2> */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "#fff",
            fontFamily: "Arial",
            marginTop: "10px",
            padding: "10px 14px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#c0392b";
            e.target.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#e74c3c";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default WokersContainer