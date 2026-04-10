import React from "react";

function MessagesPage() {
  const contacts = [
    { id: 1, name: "Alice Growth", active: true },
    { id: 2, name: "Stream Sam", active: false }
  ];

  return (
    <section className="space-y-6 flex flex-col h-[calc(100vh-120px)]">
      <h1 className="text-3xl font-bold text-textPrimary">Messages</h1>
      <div className="flex flex-1 overflow-hidden rounded-2xl bg-white shadow-sm border border-cardBorder">
        <div className="w-1/3 border-r border-cardBorder hidden md:flex flex-col">
          <div className="p-4 border-b border-cardBorder font-semibold">Contacts</div>
          <div className="overflow-y-auto w-full">
            {contacts.map(c => (
              <div key={c.id} className={`p-4 cursor-pointer hover:bg-bgSecondary border-b border-cardBorder ${c.active ? 'bg-bgSecondary border-l-4 border-l-primary' : ''}`}>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-textSecondary">Active recently</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-cardBorder font-semibold">
            Chat with Alice Growth
          </div>
          <div className="flex-1 p-4 bg-bgSecondary overflow-y-auto space-y-4">
            <div className="bg-white p-3 rounded-lg rounded-tl-none self-start max-w-[70%] border border-cardBorder">
              <p>Hi! Im interested in the Food Influencer account. Is the price negotiable?</p>
              <span className="text-xs text-textSecondary mt-2 block">10:00 AM</span>
            </div>
            <div className="bg-primary text-white p-3 rounded-lg rounded-tr-none self-end max-w-[70%] ml-auto">
              <p>Hello Alice, we can discuss it. What is your offer?</p>
              <span className="text-xs text-white/80 mt-2 block text-right">10:05 AM</span>
            </div>
            <div className="bg-white p-3 rounded-lg rounded-tl-none self-start max-w-[70%] border border-cardBorder">
              <p>Would you consider $7,000 for a direct crypto transaction?</p>
              <span className="text-xs text-textSecondary mt-2 block">10:15 AM</span>
            </div>
          </div>
          <div className="p-4 border-t border-cardBorder">
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 rounded-full border border-cardBorder px-4 py-2" />
              <button className="bg-primary text-white px-6 py-2 rounded-full font-medium">Send</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MessagesPage;
