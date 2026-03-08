import React from "react";
export default function TermsOfService() {
  return (
    <div className="max-w-6xl mx-auto text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="text-gray-400 mb-6 text-xs">
        Last updated: 2026
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
        <p className="text-gray-300">
          By accessing or using ArenaFlow, you agree to be bound by these Terms
          of Service and all applicable laws and regulations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Use of the Platform</h2>
        <p className="text-gray-300">
          ArenaFlow allows users to create and manage volleyball tournaments.
          Users must use the platform responsibly and not misuse or disrupt
          the service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>Provide accurate information</li>
          <li>Respect other participants</li>
          <li>Follow tournament rules</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
        <p className="text-gray-300">
          ArenaFlow is provided for organizational purposes and we are not
          responsible for disputes, damages, or losses related to tournament
          activities.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
        <p className="text-gray-300">
          We may update these Terms of Service at any time. Continued use of
          the platform means you accept the updated terms.
        </p>
      </section>
    </div>
  );
}