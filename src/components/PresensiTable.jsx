import React from 'react';

const PresensiTable = ({ presensi, user, handleStatusChange }) => {
    return (
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg mt-4">
            <thead>
                <tr>
                    <th className="px-4 py-2 text-left">NIS</th>
                    <th className="px-4 py-2 text-left">Nama</th>
                    <th className="px-4 py-2 text-left">Status</th>
                </tr>
            </thead>
            <tbody>
                {presensi.map((santri, index) => (
                    <tr key={index}>
                        <td className="border px-4 py-2">{santri.nis}</td>
                        <td className="border px-4 py-2">{santri.nama}</td>
                        <td className="border px-4 py-2">
                            {user.role === 'admin' ? (
                                <select
                                    value={santri.status}
                                    onChange={(e) => handleStatusChange(santri.nis, e.target.value)}
                                    className="p-2 border rounded"
                                >
                                    <option value="Hadir">Hadir</option>
                                    <option value="Izin">Izin</option>
                                    <option value="Sakit">Sakit</option>
                                    <option value="Alpa">Alpa</option>
                                    <option value="Ghoib">Ghoib</option>
                                </select>
                            ) : (
                                <span>{santri.status}</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PresensiTable;
