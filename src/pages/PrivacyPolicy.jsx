import React from "react";
import { Link } from "react-router-dom";
export default function PrivacyPolicy() {
  return (
    <div className="max-w-6xl mx-auto text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-400 mb-6 text-xs">
        Last updated: 2026
      </p>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p className="text-gray-300">
          ArenaFlow respects your privacy. This Privacy Policy explains how we
          collect, use, and protect your information when you use our platform
          to organize and manage volleyball tournaments.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
        <p className="text-gray-300">
          We may collect basic information such as your name, email address,
          and tournament participation details when you register or interact
          with the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>To manage tournaments and teams</li>
          <li>To improve the platform experience</li>
          <li>To communicate important updates</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Protection</h2>
        <p className="text-gray-300">
          We take reasonable measures to protect your information from
          unauthorized access or disclosure.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-gray-300"> If you have questions, please visit our <Link to="/contact" className="text-purple-300 hover:underline">
        Contact page</Link></p>
      </section>
    </div>
  );
}