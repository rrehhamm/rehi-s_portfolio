import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Copy, Send, RotateCcw, MapPin } from "lucide-react";
import { FaLinkedin, FaGithub, FaDiscord } from "react-icons/fa";
import { socialLinks } from "../../../data/social";
import { profileImage, profileImageFallback } from "../../../data/profile";
import { useToast } from "../../../context/ToastContext";
import "./contact.css";

const emptyForm = { name: "", email: "", subject: "", message: "" };

// EmailJS is client-side only (no backend for this portfolio) — the public
// key is meant to be exposed in the browser, that's how EmailJS is designed
// to work. Service/template created in Reham's EmailJS account, wired to
// rehamtareq490@gmail.com.
const EMAILJS_SERVICE_ID = "service_yhob9dj";
const EMAILJS_TEMPLATE_ID = "template_05khd96";
const EMAILJS_PUBLIC_KEY = "QmGPFLx8HPAgmcmbX";

export default function ContactWindow() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [avatarFailed, setAvatarFailed] = useState(false);
  const { showToast } = useToast();

  const showFallback = !profileImage || avatarFailed;
  const avatarSrc = showFallback ? profileImageFallback : profileImage;

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        // Keys here match the EmailJS template's variables exactly:
        // {{name}}, {{email}}, {{title}}, {{message}}.
        { name: form.name, email: form.email, title: form.subject, message: form.message },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("sent");
      showToast("Message sent — thank you! I'll get back to you soon.");
      setForm(emptyForm);
    } catch {
      setStatus("error");
      showToast("Couldn't send that — please try again or email me directly.");
    }
  };

  const handleReset = () => setForm(emptyForm);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.email);
      showToast("Email Copied");
    } catch {
      showToast("Couldn't copy — email is " + socialLinks.email);
    }
  };

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(socialLinks.discord);
      showToast("Discord Username Copied");
    } catch {
      showToast("Couldn't copy — Discord is " + socialLinks.discord);
    }
  };

  return (
    <div className="win contact-window">
      <div className="win-scroll">
        <h2 className="win-title" style={{ fontSize: 22 }}>Let's build something meaningful.</h2>
        <p className="win-lead" style={{ marginBottom: 18 }}>
          I'm currently open to internships, junior opportunities, collaborations, and software projects related to
          Quality Assurance, UI/UX Design, Front-End Development, and Software Engineering.
        </p>

        <div className="contact-window__profile card">
          <img
            src={avatarSrc}
            alt={showFallback ? "" : "Reham Alhasabeen"}
            className={`contact-window__avatar ${showFallback ? "contact-window__avatar--fallback" : ""}`}
            onError={() => setAvatarFailed(true)}
          />
          <div>
            <p className="contact-window__name">Reham Alhasabeen</p>
            <p className="contact-window__title">Software Engineer · QA Enthusiast · UI/UX Designer</p>
            <p className="contact-window__location"><MapPin size={12} /> Jordan</p>
          </div>
          <span className="badge badge--green contact-window__status">Open to Internships</span>
        </div>

        <p className="section-title">Send a Message</p>
        <form className="contact-window__form" onSubmit={handleSubmit}>
          <div className="contact-window__field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" required value={form.name} onChange={update("name")} />
          </div>
          <div className="contact-window__field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" type="email" required value={form.email} onChange={update("email")} />
          </div>
          <div className="contact-window__field">
            <label htmlFor="c-subject">Subject</label>
            <input id="c-subject" required value={form.subject} onChange={update("subject")} />
          </div>
          <div className="contact-window__field">
            <label htmlFor="c-message">Message</label>
            <textarea id="c-message" rows={4} required value={form.message} onChange={update("message")} />
          </div>
          <div className="contact-window__actions">
            <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
              <Send size={13} /> {status === "sending" ? "Sending…" : "Send"}
            </button>
            <button type="button" className="btn btn--ghost" onClick={copyEmail}>
              <Copy size={13} /> Copy Email
            </button>
            <button type="button" className="btn btn--ghost" onClick={handleReset}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </form>

        <p className="section-title">Elsewhere</p>
        <div className="tag-row">
          <a className="btn btn--sm" href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin size={13} /> LinkedIn</a>
          <a className="btn btn--sm" href={socialLinks.github} target="_blank" rel="noopener noreferrer"><FaGithub size={13} /> GitHub</a>
          <button type="button" className="btn btn--sm" onClick={copyDiscord} title={`Copy Discord username: ${socialLinks.discord}`}>
            <FaDiscord size={13} /> {socialLinks.discord}
          </button>
        </div>
      </div>
    </div>
  );
}
