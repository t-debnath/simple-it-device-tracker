import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [devices, setDevices] = useState([]);
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Working");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const devicesCollection = collection(db, "devices");

  const fetchDevices = async () => {
    const data = await getDocs(devicesCollection);

    setDevices(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
    );
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const resetForm = () => {
    setDeviceName("");
    setDeviceType("");
    setLocation("");
    setStatus("Working");
    setNotes("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const deviceData = {
      deviceName,
      deviceType,
      location,
      status,
      notes
    };

    if (editingId) {
      const deviceDoc = doc(db, "devices", editingId);
      await updateDoc(deviceDoc, deviceData);
    } else {
      await addDoc(devicesCollection, deviceData);
    }

    resetForm();
    fetchDevices();
  };

  const handleEdit = (device) => {
    setDeviceName(device.deviceName);
    setDeviceType(device.deviceType);
    setLocation(device.location);
    setStatus(device.status);
    setNotes(device.notes);
    setEditingId(device.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "devices", id));
    fetchDevices();
  };

  const filteredDevices = devices.filter((device) =>
    device.deviceName.toLowerCase().includes(search.toLowerCase()) ||
    device.deviceType.toLowerCase().includes(search.toLowerCase()) ||
    device.location.toLowerCase().includes(search.toLowerCase()) ||
    device.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Simple IT Device Tracker
          </span>
        </div>
      </nav>

      <div className="container">
        <div className="card p-4 mb-4 shadow-sm">
  <h2>Project Overview</h2>
  <p>
    This Simple IT Device Tracker helps IT support staff track devices by
    name, type, location, status, and notes. Users can add, view, update,
    delete, and search device records using a Firebase database.
  </p>
</div>
        <div className="card p-4 mb-4 shadow-sm">
          <h2 className="mb-3">Add / Update Device</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Device Name</label>

              <input
                type="text"
                className="form-control"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Device Type</label>

              <select
                className="form-select"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="POS">POS</option>
                <option value="Printer">Printer</option>
                <option value="Scale">Scale</option>
                <option value="iPad">iPad</option>
                <option value="KDS Screen">KDS Screen</option>
                <option value="Network Switch">Network Switch</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>

              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Example: JFK T5 - Halal Guys"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>

              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Working">Working</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Offline">Offline</option>
                <option value="Replaced">Replaced</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Notes</label>

              <textarea
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>

            <button className="btn btn-primary me-2" type="submit">
              {editingId ? "Update Device" : "Add Device"}
            </button>

            {editingId && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="card p-4 shadow-sm">
          <h2 className="mb-3">Device List</h2>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search devices"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Device Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id}>
                    <td>{device.deviceName}</td>
                    <td>{device.deviceType}</td>
                    <td>{device.location}</td>
                    <td>{device.status}</td>
                    <td>{device.notes}</td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(device)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(device.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No devices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-center text-muted">
          <p>Final Exam Project - React + Firebase CRUD Application</p>
        </div>
      </div>
    </div>
  );
}

export default App;