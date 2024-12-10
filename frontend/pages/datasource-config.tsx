// /Users/anand/Desktop/cerebro/frontend/pages/datasource-config.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/UI/button';

interface DatasourceCategory {
  category: string;
  types: string[];
}

export default function DatasourceConfig() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const datasourceCategories: DatasourceCategory[] = [
    {
      category: 'Relational Databases (RDBMS)',
      types: ['SQL Server', 'Oracle Database', 'MySQL', 'PostgreSQL']
    },
    {
      category: 'NoSQL Databases',
      types: ['MongoDB', 'Cassandra']
    },
    {
      category: 'Object Storage (Cloud Storage)',
      types: ['Amazon S3', 'Google Cloud Storage', 'Azure Blob Storage']
    },
    {
      category: 'Data Warehouses',
      types: ['Snowflake', 'Amazon Redshift', 'Google BigQuery']
    },
    {
      category: 'File Storage / Collaboration Platforms',
      types: ['Google Drive', 'Dropbox', 'Microsoft OneDrive', 'Box']
    },
    {
      category: 'Data Lakes',
      types: ['HDFS', 'Azure Data Lake', 'Amazon Lake Formation']
    },
    {
      category: 'Communication Platforms',
      types: ['Email', 'Slack', 'Microsoft Teams']
    },
    {
      category: 'Project Management Tools',
      types: ['Jira', 'Asana', 'Trello']
    }
  ];

  const handleDatasourceClick = (type: string): void => {
    const formattedType = type.toLowerCase().replace(/\s+/g, '-');
    router.push(`/datasource-config/${formattedType}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl mb-4">Datasource Configuration</h1>
      <div className="space-y-6">
        {datasourceCategories.map((cat, idx) => (
          <div key={idx} className="border p-4 rounded bg-white">
            <h2 className="text-xl font-semibold mb-2">{cat.category}</h2>
            <div className="flex flex-wrap gap-2">
              {cat.types.map((dsType, dsIdx) => (
                <Button
                  key={dsIdx}
                  onClick={() => handleDatasourceClick(dsType)}
                  className="bg-green-600 text-white"
                >
                  {dsType}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button 
        onClick={() => router.push('/roles-permissions')} 
        className="mt-4 bg-blue-600 text-white"
      >
        Next: Configure Roles & Permissions
      </Button>
    </div>
  );
}