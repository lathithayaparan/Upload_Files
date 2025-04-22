"use client";

import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setInProgress(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await response.json();
      setPreview(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Unknown error occurred");
    } finally {
      setInProgress(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg">
      <input
        type="file"
        className="border p-2 mb-4 w-full border-gray-300 rounded"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {inProgress ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Uploaded preview"
            className="rounded border shadow"
            width={600}
          />
          <p className="text-sm mt-2 text-gray-500 break-all">{preview}</p>
        </div>
      )}
    </form>
  );
}
