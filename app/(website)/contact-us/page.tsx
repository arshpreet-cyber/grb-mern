import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | Get Reviews Buzz | Let's Talk Business",
  description: "Contact Get Reviews Buzz for a customized review package. Reach us via email, phone, or WhatsApp and get expert help to grow your business reputation.",
};

export default function ContactPage() {
  return <ContactClient />;
}
