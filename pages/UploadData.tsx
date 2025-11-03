import React, { useState } from 'react';
import { uploadData } from '../services/api';
import { UploadIcon } from '../components/Icons';
import { AlertInfo } from '../types';
import Alert from '../components/Alert';

interface PreviewData {
    name: string;
    batch: string;
    stock: string;
    price: string;
    expiry: string;
}

const erpOptions = [
    { value: 'none', label: 'Select a Provider' },
    { value: 'marg_erp', label: 'Marg ERP 9+' },
    { value: 'logic_erp', label: 'Logic ERP' },
    { value: 'gofrugal', label: 'GoFrugal' },
    { value: 'vyapar', label: 'Vyapar' },
    { value: 'zoho', label: 'Zoho Inventory' },
    { value: 'other', label: 'Other' },
];

const UploadData: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<PreviewData[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [alert, setAlert] = useState<AlertInfo | null>(null);
    const [selectedErp, setSelectedErp] = useState('none');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setAlert(null);
            // Simulate reading CSV for preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const lines = text.split('\n').slice(1, 6); // Preview first 5 lines
                const data = lines.filter(line => line.trim() !== '').map(line => {
                    const [name, batch, stock, price, expiry] = line.split(',');
                    return { name, batch, stock, price, expiry };
                });
                setPreviewData(data);
            };
            reader.readAsText(selectedFile);
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
            setAlert({ type: 'error', title: 'No File Selected', message: 'Please select a file to upload before saving.' });
            return;
        }
        setUploading(true);
        setAlert(null);
        setUploadProgress(0);

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 10;
            });
        }, 200);

        try {
            const response = await uploadData(file);
            setUploadProgress(100);
            setAlert({ type: 'success', title: 'Upload Successful', message: response.message });
            setFile(null);
            setPreviewData([]);
        } catch (error) {
            setAlert({ type: 'error', title: 'Upload Failed', message: 'An error occurred during the upload. Please try again.' });
        } finally {
            clearInterval(interval);
            setTimeout(() => setUploading(false), 1000);
        }
    };

    const renderErpInputs = () => {
        switch (selectedErp) {
            case 'marg_erp':
            case 'logic_erp':
                return (
                    <>
                        <div>
                            <label htmlFor="license-no" className="block text-sm font-medium text-neutral-700">License No.</label>
                            <input type="text" name="license-no" id="license-no" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Your ERP License Number"/>
                        </div>
                         <div>
                            <label htmlFor="api-key" className="block text-sm font-medium text-neutral-700">API Key</label>
                            <input type="password" name="api-key" id="api-key" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="••••••••••••••••"/>
                        </div>
                    </>
                );
            case 'gofrugal':
            case 'zoho':
                 return (
                    <>
                         <div>
                            <label htmlFor="client-id" className="block text-sm font-medium text-neutral-700">Client ID / Org ID</label>
                            <input type="text" name="client-id" id="client-id" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Your Client or Organization ID"/>
                        </div>
                         <div>
                            <label htmlFor="client-secret" className="block text-sm font-medium text-neutral-700">Client Secret</label>
                            <input type="password" name="client-secret" id="client-secret" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="••••••••••••••••"/>
                        </div>
                    </>
                );
             case 'vyapar':
                return (
                     <div>
                        <label htmlFor="api-token" className="block text-sm font-medium text-neutral-700">API Token</label>
                        <input type="password" name="api-token" id="api-token" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="Your Vyapar API Token"/>
                    </div>
                );
            case 'other':
                return (
                     <>
                        <div>
                            <label htmlFor="api-url" className="block text-sm font-medium text-neutral-700">API URL</label>
                            <input type="text" name="api-url" id="api-url" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="https://api.your-erp.com/data"/>
                        </div>
                         <div>
                            <label htmlFor="api-key" className="block text-sm font-medium text-neutral-700">API Key</label>
                            <input type="password" name="api-key" id="api-key" className="mt-1 block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="••••••••••••••••"/>
                        </div>
                    </>
                );
            default:
                return <p className="text-sm text-neutral-500 text-center py-4">Please select a provider to see connection options.</p>;
        }
    }


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-neutral-800">Data Integration</h1>

            {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CSV Upload Section */}
                <div className="bg-white p-6 rounded-xl shadow-subtle">
                    <h2 className="text-xl font-semibold text-neutral-700 mb-2">Upload CSV File</h2>
                    <p className="text-neutral-500 mb-4 text-sm">Upload a CSV file with columns: name, batch, stock, price, expiry.</p>
                    
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                        <UploadIcon className="mx-auto h-12 w-12 text-neutral-400" />
                        <label htmlFor="file-upload" className="mt-2 text-sm font-medium text-primary-600 cursor-pointer hover:underline">
                            {file ? file.name : 'Select a file'}
                        </label>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv" />
                        <p className="mt-1 text-xs text-neutral-500">CSV up to 10MB</p>
                    </div>

                    {previewData.length > 0 && (
                        <div className="mt-6">
                            <h3 className="font-semibold text-neutral-700">Preview Table</h3>
                            <p className="text-xs text-neutral-500 mb-2">Showing first 5 rows. Scroll right to see all columns.</p>
                            <div className="overflow-x-auto mt-2 border rounded-md">
                                <table className="min-w-full text-sm text-left text-neutral-500">
                                    <thead className="text-xs text-neutral-700 uppercase bg-neutral-50">
                                        <tr>
                                            {Object.keys(previewData[0]).map(key => <th key={key} scope="col" className="px-4 py-2 whitespace-nowrap">{key}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, index) => (
                                            <tr key={index} className="bg-white border-b">
                                                <td className="px-4 py-2 whitespace-nowrap">{row.name}</td>
                                                <td className="px-4 py-2">{row.batch}</td>
                                                <td className="px-4 py-2">{row.stock}</td>
                                                <td className="px-4 py-2">{row.price}</td>
                                                <td className="px-4 py-2 whitespace-nowrap">{row.expiry}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    
                    {uploading && (
                         <div className="mt-4 w-full bg-neutral-200 rounded-full h-2.5">
                             <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                         </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition duration-300 disabled:bg-primary-300 disabled:cursor-not-allowed"
                    >
                        {uploading ? `Uploading... ${uploadProgress}%` : 'Save to Database'}
                    </button>
                </div>

                {/* ERP/POS Integration Section */}
                <div className="bg-white p-6 rounded-xl shadow-subtle">
                    <h2 className="text-xl font-semibold text-neutral-700 mb-2">Connect ERP/POS</h2>
                     <p className="text-neutral-500 mb-6 text-sm">Select your provider to sync data automatically.</p>
                     <form className="space-y-4">
                        <div>
                            <label htmlFor="erp-provider" className="block text-sm font-medium text-neutral-700">Select your ERP/POS Provider</label>
                            <select 
                                id="erp-provider" 
                                name="erp-provider" 
                                value={selectedErp}
                                onChange={e => setSelectedErp(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            >
                                {erpOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        
                        {renderErpInputs()}
                       
                        {selectedErp !== 'none' && (
                            <button
                                type="submit"
                                onClick={(e) => e.preventDefault()}
                                className="!mt-6 w-full bg-success-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-success-700 transition duration-300"
                            >
                                Connect
                            </button>
                        )}
                     </form>
                </div>
            </div>
        </div>
    );
};

export default UploadData;