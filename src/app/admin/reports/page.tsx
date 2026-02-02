
'use client';

import React, { useEffect, useState } from 'react';
import { getReports, updateReportStatus } from '@/services/adminService';
import { Search, CheckCircle, XCircle, AlertOctagon } from 'lucide-react';

export default function AdminReports() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await getReports();
            setReports(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id: string, status: string) => {
        try {
            const updated = await updateReportStatus(id, status);
            setReports(reports.map(r => r._id === id ? updated : r));
        } catch (error) {
            alert('Failed to update report');
        }
    };

    if (loading) return <div className="text-center py-10">Loading Reports...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">User Reports</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Reason</th>
                            <th className="px-6 py-4">Reporter</th>
                            <th className="px-6 py-4">Reported User</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <AlertOctagon className="h-4 w-4 text-red-500 mr-2" />
                                            <div>
                                                <div className="font-semibold text-gray-900">{report.reason}</div>
                                                <div className="text-gray-500 text-xs truncate max-w-[200px]">{report.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {report.reporterId?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {report.reportedId?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                report.status === 'dismissed' ? 'bg-gray-200 text-gray-600' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {report.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleResolve(report._id, 'resolved')}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                    title="Mark Resolved"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleResolve(report._id, 'dismissed')}
                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                    title="Dismiss"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No reports found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
