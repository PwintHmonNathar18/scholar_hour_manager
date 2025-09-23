"use client";

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Scholar Hour Manager</h1>
      <p>If you can see this page, the Next.js app is working correctly with basePath.</p>
      <div className="mt-4">
        <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server side'}</p>
        <p><strong>Base Path:</strong> /scholar-hour-manager</p>
      </div>
      <div className="mt-4">
        <a href="/scholar-hour-manager/signin" className="text-blue-600 underline">Go to Sign In</a>
      </div>
    </div>
  );
}
