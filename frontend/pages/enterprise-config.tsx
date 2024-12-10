// /Users/anand/Desktop/cerebro/frontend/pages/enterprise-config.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Checkbox from '../components/UI/checkbox';
import Textarea from '../components/UI/textarea';
import Slider from '../components/UI/slider';
import Button from '../components/UI/button';

export default function EnterpriseConfig() {
  const router = useRouter();
  const [multipleChoice, setMultipleChoice] = useState([false, false, false, false]);
  const [description, setDescription] = useState('Some prepopulated text');
  const [rating, setRating] = useState(3);

  const isFormValid = multipleChoice.some(o => o) && description.length > 0 && rating >= 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const res = await fetch('http://localhost:8000/api/enterprise-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ multipleChoice, description, rating })
    });
    if (res.ok) {
      router.push('/datasource-config');
    }
  }

  const toggleOption = (index: number) => {
    const newMC = [...multipleChoice];
    newMC[index] = !newMC[index];
    setMultipleChoice(newMC);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-2xl mb-4">Enterprise Configuration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-2">Multiple Choice Question (select one or more):</p>
          {['Option A', 'Option B', 'Option C', 'Option D'].map((opt, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <Checkbox checked={multipleChoice[i]} onCheckedChange={() => toggleOption(i)} />
              <span>{opt}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-2">Descriptive Question:</p>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <p className="mb-2">Rating Question (1-5):</p>
          <Slider value={[rating]} min={1} max={5} step={1} onValueChange={(val) => setRating(val[0])} />
          <p>Value: {rating}</p>
        </div>

        <Button type="submit" className="bg-blue-600 text-white px-4 py-2" disabled={!isFormValid}>Next</Button>
      </form>
    </div>
  )
}