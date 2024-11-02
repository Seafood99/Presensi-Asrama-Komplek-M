import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import Clock from "../components/Clock";
import CountUp from "react-countup";
import { MdiUser } from "../components/MdiUser"; // Import MdiUser
import Sidebar from "../components/Sidebar";
import AOS from "aos";
import "aos/dist/aos.css";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import useSWR from "swr";
import Modal from "react-modal";
import { useApiUrl } from "../helpers/apiUrl";
import Swal from "sweetalert2";

const SantriPage = () => {
  const url = useApiUrl();
  const cookies = new Cookies();
  const fetcher = (url) =>
    fetch(url, {
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    }).then(async(res) => {
      if (res.status === 401) {
        cookies.remove("token");
        navigate("/login");
      }
      return res.json();
    });

  const [user, setUser] = useState({ name: "", role: "" });
  const [newSantri, setNewSantri] = useState({
    name: "",
    birthdate: "",
    registration_year: "",
    study_level: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editSantri, setEditSantri] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Use SWR to fetch data
  const { data: santri, error } = useSWR(`${url}/api/santri`, fetcher, {
    revalidateOnFocus: false, // Re-fetch when window gets focus
    dedupingInterval: 1000 * 60 * 5, // Avoid refetching for 5 minutes
  });

  // Calculate totalSantri, santriAktif, santriNonaktif based on fetched santri data
  const totalSantri = santri ? santri.data.length : 0;
  const santriAktif = santri
    ? santri.data.filter((s) => s.is_active).length
    : 0;
  const santriNonaktif = santri
    ? santri.data.filter((s) => !s.is_active).length
    : 0;

  useEffect(() => {
    AOS.init({
      duration: 1000, // animation duration in milliseconds
      once: true, // animation triggers only once on scroll
    });
  }, []);

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Decode the JWT token to get user information
    const decodedToken = jwtDecode(token);
    const storedUser = decodedToken.data;

    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSantri({ ...newSantri, [name]: value });
  };

  const handleAddSantri = async () => {
    try {
      const nis = newSantri.registration_year + newSantri.study_level;
      const new_newSantri = { ...newSantri, nis };

      if(new_newSantri.name === "" || new_newSantri.birthdate === "" || new_newSantri.study_level === "" || new_newSantri.registration_year === "") {
        Swal.fire({
          title: 'Error',
          text: 'Silahkan isi semua field!',
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Ok'
        })
        return
      }

      const response = await fetch(`${url}/api/santri`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`,
        },
        body: JSON.stringify(new_newSantri),
      });
      if (!response.ok) {
        throw new Error("Failed to add new santri");
      }
      // Show the sweet alert 

      Swal.fire({
        title: 'Berhasil',
        text: "Santri berhasil ditambahkan",
        icon: 'success',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Kembali',
      })

      setNewSantri({
        name: "",
        birthdate: "",
        registration_year: "",
        study_level: "",
      });
    } catch (error) {
      alert("Gagal menambahkan santri: " + error.message);
    }
  };

  const openModal = (santri) => {
    setEditSantri(santri);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditSantri({ ...editSantri, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${url}/api/santri/${editSantri.nis}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`,
        },
        body: JSON.stringify(editSantri),
      });
      if (!response.ok) {
        throw new Error("Failed to update santri");
      }
      alert("Santri berhasil diperbarui!");
      closeModal();
    } catch (error) {
      alert("Gagal memperbarui santri: " + error.message);
    }
  };

  const handleDeleteSantri = async () => {
    try {
      const response = await fetch(`${url}/api/santri`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.get("token")}`,
        },
        body: JSON.stringify({ nis: editSantri.nis }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete santri");
      }
      alert("Santri berhasil dihapus!");
      closeModal();
    } catch (error) {
      alert("Gagal menghapus santri: " + error.message);
    }
    console.log("Deleting santri:", editSantri.nis);
  };

  if (error) return (
    <div className="min-h-screen flex justify-center items-center animate-pulse bg-gray-300">
      Error fetching santri data
    </div>
  );
  if (!santri) return (
    <div className="min-h-screen flex justify-center items-center animate-pulse bg-gray-300">
      {/* Loading icon */}
      <svg className="h-12 w-12 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
        {isOpen &&
            <button className="md:hidden absolute top-4 right-4" onClick={()=>setIsOpen(isOpen => !isOpen)}>
                <svg className="w-6 h-6 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                </svg>
            </button>
        }
      <Sidebar user={user} opened={isOpen} />

      {/* Konten Santri */}
      <div className="md:w-3/4 w-full p-8 md:ms-[28rem]">
        <div className="flex justify-between items-center">
          <section className="flex gap-x-3">
            <button onClick={()=>setIsOpen(isOpen => !isOpen)} className='md:hidden block'>
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              </svg>
            </button>
            <h2 className="text-3xl font-bold">Data Santri</h2>
          </section>
          <LogoutButton />
        </div>

        <div className="flex justify-end mt-4">
          <Clock />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          <div
            className="bg-white shadow-md rounded-lg p-6 text-center"
            data-aos="fade-up"
          >
            <MdiUser color="blue" className="text-4xl mx-auto mb-4" />
            <div className="text-2xl font-bold text-teal-800">
              <CountUp end={totalSantri} duration={3} />
            </div>
            <p className="text-gray-600">Total Santri</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-6 text-center"
            data-aos="fade-up"
          >
            <MdiUser color="green" className="text-4xl mx-auto mb-4" />
            <div className="text-2xl font-bold text-green-500">
              <CountUp end={santriAktif} duration={3} />
            </div>
            <p className="text-gray-600">Santri Aktif</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-6 text-center"
            data-aos="fade-up"
          >
            <MdiUser color="red" className="text-4xl mx-auto mb-4" />
            <div className="text-2xl font-bold text-red-500">
              <CountUp end={santriNonaktif} duration={3} />
            </div>
            <p className="text-gray-600">Santri Nonaktif</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Tambah Santri Baru</h3>
          <div className="mt-4 bg-white shadow-md rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Nama"
                value={newSantri.name}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="date"
                name="birthdate"
                placeholder="Tanggal Lahir"
                value={newSantri.birthdate}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              />
              <select
                name="study_level"
                value={newSantri.study_level}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              >
                <option value="">Pilih Jenjang Studi</option>
                <option value="01">SD</option>
                <option value="02">SMP</option>
                <option value="03">SMA</option>
              </select>

              <select
                name="registration_year"
                value={newSantri.registration_year}
                onChange={handleInputChange}
                className="p-2 border rounded"
                required
              >
                <option value="">Pilih tahun masuk</option>
                <option value="22">2022</option>
                <option value="23">2023</option>
                <option value="24">2024</option>
                <option value="25">2025</option>
                <option value="26">2026</option>
              </select>
            </div>
            <button
              onClick={handleAddSantri}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Tambah Santri
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Daftar Santri</h3>

          {/* Mobile view - cards */}
          <div className="md:hidden space-y-4 mt-4">
            {santri.data.map((s, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">NIS:</span> {s.nis}
                  </div>
                  <div>
                    <span className="font-semibold">Nama:</span> {s.name}
                  </div>
                  <div>
                    <span className="font-semibold">Tanggal Lahir:</span>{" "}
                    {new Date(s.birthdate).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-semibold">Jenjang Studi:</span>{" "}
                    {s.study_level}
                  </div>
                  <div>
                    <span className="font-semibold">Tahun Masuk:</span>{" "}
                    {s.registration_year}
                  </div>
                  <button
                    onClick={() => openModal(s)}
                    className="w-full bg-yellow-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop view - table */}
          <div className="hidden md:block overflow-x-auto rounded-lg mt-4">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      NIS
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Nama
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Tanggal Lahir
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Jenjang Studi
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Tahun Masuk
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {santri.data.map((s, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{s.nis}</td>
                      <td className="px-4 py-3 text-sm">{s.name}</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(s.birthdate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">{s.study_level}</td>
                      <td className="px-4 py-3 text-sm">
                        {s.registration_year}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => openModal(s)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Editing Santri */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Edit Santri"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              padding: "20px",
            },
            overlay: {
              zIndex: 1000,
            },
          }}
        >
          <h2 className="text-xl font-bold mb-4">Edit Santri</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Nama"
              value={editSantri.name}
              onChange={handleEditInputChange}
              className="p-2 border rounded"
            />
            <input
              type="date"
              name="birthdate"
              placeholder="Tanggal Lahir"
              value={editSantri.birthdate}
              onChange={handleEditInputChange}
              className="p-2 border rounded"
            />
            <select
              name="study_level"
              value={editSantri.study_level}
              onChange={handleEditInputChange}
              className="p-2 border rounded"
            >
              <option value="">Pilih Jenjang Studi</option>
              <option value="01" >SD</option>
              <option value="02" >SMP</option>
              <option value="03" >SMA</option>
            </select>

            <select
              name="registration_year"
              value={editSantri.registration_year}
              onChange={handleEditInputChange}
              className="p-2 border rounded"
            >
              <option value="">Pilih tahun masuk</option>
              <option value="22">2022</option>
              <option value="23">2023</option>
              <option value="24">2024</option>
              <option value="25">2025</option>
              <option value="26">2026</option>
            </select>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleDeleteSantri}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Hapus
            </button>
            <div className="flex">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Batal
              </button>
              <button
                onClick={handleSaveChanges}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SantriPage;
