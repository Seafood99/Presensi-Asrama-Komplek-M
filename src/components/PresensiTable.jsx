import React, { useState, useEffect } from 'react';

const PresensiTable = ({ presensi, user, handleStatusChange }) => {
    // State untuk presensiData
    const [presensiData, setPresensiData] = useState([]);

    // Gunakan useEffect untuk memperbarui presensiData setiap kali presensi berubah
    useEffect(() => {
        setPresensiData(
            presensi.map((santri) => ({
                ...santri,
                status: santri.status || 'Hadir',
            }))
        );
    }, [presensi]);

    // State untuk loading
    const [isSubmitting, setIsSubmitting] = useState(false);
    // State untuk pesan status
    const [statusMessage, setStatusMessage] = useState('');

    const handleSimpanPresensi = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage('');

        try {
            // Menyiapkan data yang akan dikirim
            const dataPresensi = presensiData.map(({ id, nis, name, status }) => ({
                id,
                nis,
                name,
                status,
                tanggal: new Date().toISOString().split('T')[0],
            }));
            console.log(dataPresensi);
            const new_presensi = dataPresensi.map((item) => {
                return {
                    user_id: item.id,
                    status: item.status,
                    presence_type_id: 3
                };
            })
            console.log(user)
            // // Mengirim data ke server
            const response = await fetch('http://203.194.113.18:4100/api/presensi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user}`,
                },
                body: JSON.stringify(new_presensi),
            });

            if (!response.ok) {
                throw new Error('Gagal menyimpan data presensi');
            }

            const result = await response.json();
            setStatusMessage('Data presensi berhasil disimpan!');
            console.log('Presensi berhasil disimpan:', result);
        } catch (error) {
            console.error('Error:', error);
            setStatusMessage('Gagal menyimpan data presensi. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChangeStatus = (nis, value) => {
        setPresensiData((prevData) =>
            prevData.map((santri) =>
                santri.nis === nis ? { ...santri, status: value } : santri
            )
        );
    };

    return (
        <div className="max-w-full overflow-x-auto">
            <form onSubmit={handleSimpanPresensi}>
                <table className="min-w-full table-auto bg-white shadow-md rounded-lg mt-4">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">NIS</th>
                            <th className="px-4 py-2 text-left">Nama</th>
                            <th className="px-4 py-2 text-left">Tanggal</th>
                            <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presensiData.map((santri) => (
                            <tr key={santri.nis} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{santri.nis}</td>
                                <td className="border px-4 py-2">{santri.name}</td>
                                <td className="border px-4 py-2">
                                    {new Date().toLocaleDateString('id-ID')}
                                </td>
                                <td className="border px-4 py-2">
                                    <select
                                        value={santri.status}
                                        onChange={(e) => handleChangeStatus(santri.nis, e.target.value)}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Hadir">Hadir</option>
                                        <option value="Izin">Izin</option>
                                        <option value="Sakit">Sakit</option>
                                        <option value="Alpa">Alpa</option>
                                        <option value="Ghoib">Ghoib</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {statusMessage && (
                    <div
                        className={`mt-4 p-4 rounded ${
                            statusMessage.includes('berhasil')
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                    >
                        {statusMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-4 px-6 py-2 rounded text-white font-medium ${
                        isSubmitting
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                    } transition duration-150 ease-in-out`}
                >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Presensi'}
                </button>
            </form>
        </div>
    );
};

export default PresensiTable;
