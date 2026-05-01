"use client";

const data = [
  {
    id: "01",
    title: "Our Vision",
    text: `Our vision centers around being a renowned thought leader in the field of Online Reputation Management. Our team aims to be providers of exemplary and thorough online reputation management services for enterprise-level companies and startup business owners alike. We conduct business with all of our clients in a time-saving and cost-effective manner through virtual staff that works on projects wherever and whenever.`,
  },
  {
    id: "02",
    title: "Our Mission",
    text: `Our goal is to support our client’s efforts to reach, engage, and interact with their customers on a more productive level; provide all of our clients with outstanding services that will meet their online reputation needs. Therefore, Get Reviews mission is to ensure that our team of online professionals would always have the technology, the tools, the resources, and the right number of staff to meet our goals and accomplish our mission.`,
  },
  {
    id: "03",
    title: "Our Commitment",
    text: `Our team of professionals is committed to delivering the promised results and keeping our processes transparent. Every step of the way, we keep you updated with progress on your order. In the process, we help our clients climb the ladder to success as we build lasting relationships with them. We assure you of high service quality and a team of professionals who work with you to achieve your business objectives.`,
  },
];

export default function VisionMissionSection() {
  return (
    <section className="py-10 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition "
            >
              {/* Number Circle */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-black mb-6">
                <span className="text-[#fcd535] font-bold text-lg">
                  {item.id}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-black mb-4">
                {item.title}
              </h3>

              {/* Content */}
              <p className="text-gray-600 text-sm leading-relaxed text-justify">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="mt-16 text-center">
          <p className="text-xl md:text-2xl font-bold italic text-black leading-relaxed max-w-4xl mx-auto">
            “We Have Come To Balance The Field – To Battle The Trolls And Haters, 
            Unfair Customers, Misleading Feedback And Competition”
          </p>
        </div>

      </div>
    </section>
  );
}