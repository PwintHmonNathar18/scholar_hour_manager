"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewReportPage() {
	const { data: session } = useSession();
	const router = useRouter();
	const [form, setForm] = useState({ title: "", description: "" });
	const [saving, setSaving] = useState(false);

	if (!session?.user || (session.user.role !== "student" && session.user.role !== "supervisor")) {
		return <div className="p-6">Only students and supervisors can report problems.</div>;
	}

	const handleChange = (k, v) => setForm(f => ({ ...f, [k]: v }));

	const handleSubmit = async e => {
		e.preventDefault();
		setSaving(true);
		const res = await fetch("/api/reports", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form)
		});
		setSaving(false);
		if (res.ok) {
			alert("Report submitted.");
			router.push("/reports");
		} else {
			alert("Failed to submit report.");
		}
	};

	return (
		<main className="max-w-xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Report a Problem</h1>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1">Title</label>
					<input
						type="text"
						value={form.title}
						onChange={e => handleChange("title", e.target.value)}
						className="w-full border rounded px-3 py-2"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium mb-1">Description</label>
					<textarea
						value={form.description}
						onChange={e => handleChange("description", e.target.value)}
						className="w-full border rounded px-3 py-2"
						rows={5}
						required
					/>
				</div>
				<button
					type="submit"
					disabled={saving}
					className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
				>
					{saving ? "Submitting..." : "Submit Report"}
				</button>
			</form>
		</main>
	);
}
