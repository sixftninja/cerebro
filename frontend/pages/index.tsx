// /Users/anand/Desktop/cerebro/frontend/pages/index.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/UI/button';
import Input from '../components/UI/input';

export default function LandingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<'start' | 'userinfo' | 'code'>('start');
  const [name, setName] = useState('John Smith');
  const [email, setEmail] = useState('johnsmith@cerebro.com');
  const [code, setCode] = useState('12345');
  const [message, setMessage] = useState('');

  const handleStart = () => {
    setStage('userinfo');
  }

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Please enter valid name and email.');
      return;
    }
    setStage('code');
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== '12345') {
      setMessage('Invalid code. Please try again.');
      return;
    }
    // Save to system db (POST request to backend)
    const res = await fetch('http://localhost:8000/api/onboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, code })
    });
    if (res.ok) {
      router.push('/enterprise-config');
    } else {
      setMessage('Error onboarding user.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center text-white">
      <header className="text-center mt-20 mb-auto">
        <h1 className="text-6xl font-bold tracking-widest mb-4">C E R E B R O</h1>
        <p className="text-xl text-gray-300">Task Autopilot for Enterprise</p>
      </header>
      <main className="w-full max-w-md px-4 mb-20">
        {message && (
          <div className="mb-4 p-3 bg-blue-600 text-white rounded-md">
            {message}
          </div>
        )}
        {stage === 'start' && (
          <Button onClick={handleStart} className="w-full bg-blue-600 hover:bg-blue-700">
            Get Started
          </Button>
        )}
        {stage === 'userinfo' && (
          <form onSubmit={handleUserInfoSubmit} className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-300">Please enter your name and email</div>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Next
            </Button>
          </form>
        )}
        {stage === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="text-sm font-medium text-gray-300">Please enter the code we emailed</div>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Next
            </Button>
          </form>
        )}
      </main>
    </div>
  )
}