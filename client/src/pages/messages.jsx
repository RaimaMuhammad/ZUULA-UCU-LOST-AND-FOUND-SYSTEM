import { useState } from "react";

export default function Messages() {
  const conversations = [
    {
      id: 1,
      name: "UCU Administrator",
      preview: "Your claim is being reviewed.",
      messages: [
        { text: "Hello. We have received your claim.", sender: "received" },
        { text: "Thank you for the update.", sender: "sent" },
        { text: "Your claim is being reviewed.", sender: "received" },
      ],
    },
    {
      id: 2,
      name: "Comfort Shalom",
      preview: "I found your item.",
      messages: [
        { text: "Hello, I think I found your item.", sender: "received" },
        { text: "Thank you. I will check the details.", sender: "sent" },
      ],
    },
  ];

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  function handleSend(e) {
    e.preventDefault();

    if (!message.trim()) return;

    setActiveChat({
      ...activeChat,
      messages: [
        ...activeChat.messages,
        { text: message, sender: "sent" },
      ],
    });

    setMessage("");
  }

  return (
    <div className="messages-page">
      <h1>Messages</h1>
      <p>Communicate about lost and found items.</p>

      <div className="messages-container">
        <aside className="conversation-panel">
          <h2>Conversations</h2>

          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`conversation-item ${
                activeChat.id === conversation.id ? "active" : ""
              }`}
              onClick={() => setActiveChat(conversation)}
            >
              <strong>{conversation.name}</strong>
              <span>{conversation.preview}</span>
            </button>
          ))}
        </aside>

        <section className="chat-panel">
          <div className="chat-header">
            <h2>{activeChat.name}</h2>
          </div>

          <div className="chat-messages">
            {activeChat.messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${msg.sender}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form className="chat-input" onSubmit={handleSend}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message..."
            />

            <button type="submit">Send</button>
          </form>
        </section>
      </div>
    </div>
  );
}