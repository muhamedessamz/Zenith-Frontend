import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';

export const DashboardTest = () => {
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testAPI = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔍 Testing Dashboard API...');
            const data = await dashboardService.getStats();
            console.log('✅ Success! Response:', data);
            setResponse(data);
        } catch (err: any) {
            console.error('❌ Error:', err);
            console.error('❌ Error Response:', err.response);
            console.error('❌ Error Data:', err.response?.data);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        testAPI();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Dashboard API Test</h1>

            <button
                onClick={testAPI}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                disabled={loading}
            >
                {loading ? 'Testing...' : 'Test API Again'}
            </button>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <h3 className="font-bold">Error:</h3>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(error.response?.data || error.message, null, 2)}
                    </pre>
                </div>
            )}

            {response && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <h3 className="font-bold mb-2">Success! API Response:</h3>
                    <pre className="text-sm overflow-auto bg-white p-4 rounded">
                        {JSON.stringify(response, null, 2)}
                    </pre>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded">
                            <div className="text-2xl font-bold">{response.totalTasks}</div>
                            <div className="text-sm">Total Tasks</div>
                        </div>
                        <div className="bg-white p-4 rounded">
                            <div className="text-2xl font-bold">{response.completedTasks}</div>
                            <div className="text-sm">Completed</div>
                        </div>
                        <div className="bg-white p-4 rounded">
                            <div className="text-2xl font-bold">{response.inProgressTasks}</div>
                            <div className="text-sm">In Progress</div>
                        </div>
                        <div className="bg-white p-4 rounded">
                            <div className="text-2xl font-bold">{response.overdueTasks}</div>
                            <div className="text-sm">Overdue</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
