import React, { useState } from 'react';

type DocTopic = 'getting-started' | 'data-integration' | 'dashboard' | 'action-center' | 'ai-features' | 'roi-tracker' | 'visualizations';

const documentationTopics = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'data-integration', title: 'Data Integration' },
    { id: 'dashboard', title: 'Dashboard Overview' },
    { id: 'action-center', title: 'Using the Action Center' },
    { id: 'ai-features', title: 'AI Features Explained' },
    { id: 'roi-tracker', title: 'Maximizing Your ROI' },
    { id: 'visualizations', title: 'Custom Visualizations' },
];

const DocumentationContent: React.FC<{ topic: DocTopic }> = ({ topic }) => {
    switch (topic) {
        case 'getting-started':
            return (
                <div className="prose">
                    <h2>Welcome to PharmaIQ!</h2>
                    <p>This guide will walk you through the essential first steps to get the most out of your pharmacy intelligence dashboard.</p>
                    <h3>Step 1: Your First Data Upload</h3>
                    <p>The first and most crucial step is to provide PharmaIQ with your pharmacy data. The richer the data, the more powerful the insights.</p>
                    <ol>
                        <li>Navigate to the <strong>Data Integration</strong> page from the sidebar.</li>
                        <li>You can either upload a CSV file or connect directly to your ERP/POS system.</li>
                        <li>For new users, we recommend starting with a CSV upload to quickly see results.</li>
                    </ol>
                    <h3>Step 2: Explore Your Dashboard</h3>
                    <p>Once your data is uploaded, the Dashboard will come to life. It provides a high-level overview of your pharmacy's key metrics, such as low stock items, top sellers, and potential savings.</p>
                    <h3>Step 3: Check the Action Center</h3>
                    <p>The <strong>Action Center</strong> is where our AI provides you with a prioritized to-do list. It's the best place to start taking concrete steps to improve your pharmacy's performance.</p>
                </div>
            );
        case 'data-integration':
             return (
                <div className="prose">
                    <h2>Integrating Your Data</h2>
                    <p>PharmaIQ supports two primary methods for data integration: CSV file upload and direct ERP/POS connection.</p>
                    <h3>CSV File Upload</h3>
                    <p>This is the quickest way to get started. Your CSV file should contain the following columns in order:</p>
                    <ul>
                        <li><strong>name</strong>: The full name of the medicine (e.g., "Paracetamol 500mg").</li>
                        <li><strong>batch</strong>: The batch number for the specific stock item.</li>
                        <li><strong>stock</strong>: The current number of units available.</li>
                        <li><strong>price</strong>: The retail price per unit.</li>
                        <li><strong>expiry</strong>: The expiry date in YYYY-MM-DD format.</li>
                    </ul>
                    <p><strong>Example CSV Format:</strong></p>
                    <pre className="bg-neutral-100 p-3 rounded-md"><code>
                        name,batch,stock,price,expiry<br/>
                        Paracetamol 500mg,P500-123,50,25,2025-12-31<br/>
                        Amoxicillin 250mg,A250-456,30,75,2024-08-30
                    </code></pre>
                    <h3>ERP/POS Connection</h3>
                    <p>For automated, real-time data synchronization, we recommend connecting your ERP or POS system. Navigate to the "Connect ERP/POS" section on the <strong>Data Integration</strong> page, select your provider from the dropdown, and enter the required API credentials.</p>
                </div>
            );
        case 'dashboard':
            return (
                <div className="prose">
                    <h2>Dashboard Overview</h2>
                    <p>The dashboard is your mission control, giving you a quick, visual summary of your pharmacy's health.</p>
                    <ul>
                        <li><strong>Quick Stats Cards</strong>: At-a-glance metrics like the number of low stock items, out of stock items, your current top-selling product, and the total value of your inventory.</li>
                        <li><strong>ROI & Savings Snapshot</strong>: This powerful card shows you the estimated monthly savings PharmaIQ provides by helping you reduce expiry waste and prevent lost sales from stockouts.</li>
                        <li><strong>Quick Actions</strong>: Jump directly to the most used sections of the app.</li>
                        <li><strong>AI Business Advisor</strong>: This feed shows you the latest high-level recommendations from our AI to improve your business.</li>
                    </ul>
                </div>
            );
         case 'action-center':
            return (
                <div className="prose">
                    <h2>Using the Action Center</h2>
                    <p>The Action Center is the heart of PharmaIQ's proactive intelligence. It turns complex data analysis into a simple, actionable to-do list.</p>
                    <h3>What It Is</h3>
                    <p>It's a consolidated list of tasks and recommendations generated by our AI. These range from critical reorder alerts to strategic sales opportunities.</p>
                    <h3>How to Use It</h3>
                    <ol>
                        <li><strong>Review Daily</strong>: Start your day by checking the Action Center for new high-priority items.</li>
                        <li><strong>Filter Your View</strong>: Use the filters to focus on what matters most. You can filter by status (To Do / Completed) or by priority (High, Medium, Low).</li>
                        <li><strong>Take Action</strong>: Each item provides a clear description of the issue and a suggested action. Many items include a direct link to the relevant page in PharmaIQ to help you resolve it quickly.</li>
                        <li><strong>Mark as Done</strong>: Once you've addressed an item, check it off to move it to your completed list. This helps you track your progress and keep your to-do list clean.</li>
                    </ol>
                </div>
            );
        default:
            return <div className="prose"><p>Select a topic to learn more.</p></div>;
    }
}

const Documentation: React.FC = () => {
    const [activeTopic, setActiveTopic] = useState<DocTopic>('getting-started');
    
    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-1/4">
                <h1 className="text-3xl font-bold text-neutral-800 mb-6">Documentation</h1>
                <nav>
                    <ul>
                        {documentationTopics.map(topic => (
                             <li key={topic.id}>
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTopic(topic.id as DocTopic);
                                    }}
                                    className={`block p-3 rounded-lg text-sm font-medium transition-colors ${
                                        activeTopic === topic.id 
                                            ? 'bg-primary-100 text-primary-700' 
                                            : 'text-neutral-600 hover:bg-neutral-100'
                                    }`}
                                >
                                    {topic.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 bg-white p-6 sm:p-8 rounded-xl shadow-subtle">
                <DocumentationContent topic={activeTopic} />
            </main>
        </div>
    );
};

export default Documentation;
