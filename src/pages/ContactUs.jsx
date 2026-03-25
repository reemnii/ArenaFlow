import emailjs from "@emailjs/browser";
import { useState } from "react";
import { Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactUs() {
  // Stores form input values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Success and error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Updates form fields dynamically
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Handles form submission
  function handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }

    // Send email using EmailJS
    emailjs
      .send(
        "service_ixqmxvv",
        "template_faikrhn",
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "CptTcsfKD8TIrxymK"
      )
      .then(
        () => {
          // Show success and reset form
          setSuccessMessage("Your message has been sent successfully!");
          setError("");

          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        },
        () => {
          // Show error if sending fails
          setError("Something went wrong. Please try again.");
        }
      );
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 sm:py-10 md:py-12 flex items-center justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        {/* Contact Info */}
        <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.25)] p-5 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-inherit mb-3">
            Contact Us
          </h1>

          <p className="text-inherit/75 text-sm sm:text-base leading-relaxed mb-6">
            Have a question about tournaments, teams, or your account? Send us a
            message and our team will get back to you as soon as possible.
          </p>

          <div className="space-y-4">

            {/* Email links */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand mt-0.5" />
              <div>
                <h2 className="text-inherit font-semibold mb-1">Email Us</h2>

                <div className="text-inherit/75 text-sm sm:text-base space-y-1 break-words">
                  <a
                    href="mailto:shahd.kaddoura182@gmail.com?subject=ArenaFlow%20Support"
                    className="block hover:underline hover:text-inherit transition"
                  >
                    shahd.kaddoura182@gmail.com
                  </a>

                  <a
                    href="mailto:rnimer9@gmail.com?subject=ArenaFlow%20Support"
                    className="block hover:underline hover:text-inherit transition"
                  >
                    rnimer9@gmail.com
                  </a>

                  <a
                    href="mailto:hashemrawad85@gmail.com?subject=ArenaFlow%20Support"
                    className="block hover:underline hover:text-inherit transition"
                  >
                    hashemrawad85@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Location info */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand mt-0.5" />
              <div>
                <h2 className="text-inherit font-semibold mb-1">Location</h2>
                <p className="text-inherit/75 text-sm sm:text-base">
                  Online platform
                </p>
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand mt-0.5" />
              <div>
                <h2 className="text-inherit font-semibold mb-1">Response Time</h2>
                <p className="text-inherit/75 text-sm sm:text-base">
                  We usually respond within 24–48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.25)] p-5 sm:p-6 md:p-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-inherit mb-5">
            Send a Message
          </h2>
          {/* Error message*/}
          {error && (
            <p role="alert" className="text-red-300 text-sm font-medium mb-4">
              {error}
            </p>
          )}
          {/*Success message*/}
          {successMessage && (
            <p role="alert" className="text-green-300 text-sm font-medium mb-4">
              {successMessage}
            </p>
          )}

          {/* Name input */}
          <label htmlFor="name" className="block text-sm font-medium text-inherit mb-2">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-inherit/50 px-3 py-2.5 mb-4 outline-none"
          />
          {/* Email input */}
          <label htmlFor="email" className="block text-sm font-medium text-inherit mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-inherit/50 px-3 py-2.5 mb-4 outline-none"
          />
          {/* Subject dropdown */}
          <label htmlFor="subject" className="block text-sm font-medium text-inherit mb-2">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            aria-label="Select subject"
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white px-3 py-2.5 mb-4 outline-none appearance-none"
          >
            <option value="" disabled className="bg-[#2a1430] text-white">
              Choose a subject
            </option>
            <option value="Tournament Question" className="bg-[#2a1430] text-white">
              Tournament Question
            </option>
            <option value="Team Management" className="bg-[#2a1430] text-white">
              Team Management
            </option>
            <option value="Technical Issue" className="bg-[#2a1430] text-white">
              Technical Issue
            </option>
            <option value="Feedback" className="bg-[#2a1430] text-white">
              Feedback
            </option>
            <option value="Other" className="bg-[#2a1430] text-white">
              Other
            </option>
          </select>
          {/* Message input */}
          <label htmlFor="message" className="block text-sm font-medium text-inherit mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Write your message here"
            value={formData.message}
            onChange={handleChange}
            className="w-full rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-inherit/50 px-3 py-2.5 mb-5 outline-none resize-none"
          />
          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-brand text-white py-2.5 sm:py-3 rounded-lg hover:bg-brand/90 transition flex items-center justify-center gap-2"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}