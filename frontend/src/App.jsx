
import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const API_URL = `${API_BASE_URL}/api/devices`;

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    deviceId: "",
    name: "",
    deviceType: "",
    room: "",
    brand: "",
    model: "",
    quantity: 1,
    status: "Đang sử dụng",
    purchaseDate: "",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  async function loadDevices(keyword = "") {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}?search=${encodeURIComponent(keyword)}`
      );

      if (!response.ok) throw new Error("Không thể tải danh sách thiết bị");

      const data = await response.json();
      setDevices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevices();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(device) {
    setEditingId(device._id);
    setForm({
      ...emptyForm,
      ...device,
      quantity: device.quantity ?? 1,
    });
    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể lưu thiết bị");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadDevices(search);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa thiết bị này?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể xóa thiết bị");
      }

      await loadDevices(search);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    await loadDevices(search);
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>QUẢN LÝ THIẾT BỊ PHÒNG HỌC</h1>
          <p>Hệ thống quản lý thiết bị trường học</p>
        </div>
        <button className="add-button" onClick={openAddForm}>
          + Thêm thiết bị
        </button>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat-card">
            <span>Tổng số thiết bị</span>
            <strong>{devices.length}</strong>
          </div>
          <div className="stat-card">
            <span>Đang sử dụng</span>
            <strong>
              {devices.filter((d) => d.status === "Đang sử dụng").length}
            </strong>
          </div>
          <div className="stat-card">
            <span>Hư hỏng</span>
            <strong>
              {devices.filter((d) => d.status === "Hư hỏng").length}
            </strong>
          </div>
        </section>

        <section className="device-section">
          <div className="section-heading">
            <h2>Danh sách thiết bị</h2>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, mã, phòng..."
              />
              <button type="submit">Tìm kiếm</button>
            </form>
          </div>

          {error && <p className="error">{error}</p>}
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Mã thiết bị</th>
                    <th>Tên thiết bị</th>
                    <th>Loại</th>
                    <th>Phòng</th>
                    <th>Số lượng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty">
                        Không có thiết bị nào
                      </td>
                    </tr>
                  ) : (
                    devices.map((device) => (
                      <tr key={device._id}>
                        <td>{device.deviceId}</td>
                        <td>{device.name}</td>
                        <td>{device.deviceType}</td>
                        <td>{device.room}</td>
                        <td>{device.quantity}</td>
                        <td>
                          <span className="status">
                            {device.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="edit-button"
                            onClick={() => openEditForm(device)}
                          >
                            Sửa
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(device._id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {showForm && (
          <div className="modal">
            <form className="device-form" onSubmit={handleSubmit}>
              <h2>{editingId ? "Cập nhật thiết bị" : "Thêm thiết bị"}</h2>

              {[
                ["deviceId", "Mã thiết bị"],
                ["name", "Tên thiết bị"],
                ["deviceType", "Loại thiết bị"],
                ["room", "Phòng học"],
                ["brand", "Thương hiệu"],
                ["model", "Model"],
                ["quantity", "Số lượng"],
                ["purchaseDate", "Ngày mua"],
              ].map(([name, label]) => (
                <label key={name}>
                  {label}
                  <input
                    name={name}
                    type={name === "quantity" ? "number" : "text"}
                    min={name === "quantity" ? "0" : undefined}
                    value={form[name]}
                    onChange={handleChange}
                    required={[
                      "deviceId",
                      "name",
                      "deviceType",
                      "room",
                      "quantity",
                    ].includes(name)}
                  />
                </label>
              ))}

              <label>
                Trạng thái
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Đang sử dụng</option>
                  <option>Hư hỏng</option>
                  <option>Đang sửa chữa</option>
                  <option>Ngừng sử dụng</option>
                </select>
              </label>

              <label>
                Mô tả
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <div className="form-actions">
                <button type="submit" className="add-button">
                  Lưu
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
