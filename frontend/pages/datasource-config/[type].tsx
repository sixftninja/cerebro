import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../../components/UI/button';

interface FormData {
  username: string;
  password: string;
  host: string;
  port: string;
  database: string;
  [key: string]: string;
}

export default function DatasourceDetails() {
  const router = useRouter();
  const { type } = router.query;
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    host: '',
    port: '',
    database: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/datasource-config/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          name,
          config: formData
        }),
      });

      if (res.ok) {
        setMessage('Datasource configured successfully');
      }
    } catch (error) {
      setMessage('Error configuring datasource');
    }
  };

  const renderForm = () => {
    if (type === 'sql-server') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="e.g., Production Database"
            />
          </div>
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block mb-1 capitalize">
                {field.replace('_', ' ')}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                value={formData[field]}
                onChange={(e) => setFormData({
                  ...formData,
                  [field]: e.target.value
                })}
                className="border p-2 rounded w-full"
              />
            </div>
          ))}
        </div>
      );
    }
    
    return <p>Configuration form for {type} will be implemented later.</p>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl mb-4">Configure {type}</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-6">
        {renderForm()}
        <div className="space-x-4">
          <Button type="submit" className="bg-green-600 text-white">
            Save Configuration
          </Button>
          <Button 
            type="button" 
            onClick={() => router.push('/datasource-config')}
            className="bg-gray-600 text-white"
          >
            Back to Datasources
          </Button>
        </div>
      </form>
      {message && (
        <div className="mt-4">
          <p className="text-green-600">{message}</p>
          <div className="mt-2 space-x-4">
            <Button 
              onClick={() => router.push('/datasource-config')}
              className="bg-blue-600 text-white"
            >
              Add Another Datasource
            </Button>
            <Button 
              onClick={() => router.push('/roles-permissions')}
              className="bg-green-600 text-white"
            >
              Continue to Roles & Permissions
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 