'use client';

import { useState } from 'react';

interface Props {
  onUpload: () => void;
}

export default function UploadCsv({ onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');

  async function handleUpload() {
    if (!file) {
      setStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`http://localhost:5000/upload/${file.name.split('.')[0]}`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('Upload successful!');
        setFile(null);
        onUpload(); // trigger parent to refresh table
      } else {
        setStatus(`Upload failed: ${data.message}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('Upload failed due to network error.');
    }
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload CSV
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
