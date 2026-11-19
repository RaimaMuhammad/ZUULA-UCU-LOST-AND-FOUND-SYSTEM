import { useState } from "react";

export default function AdminMessages() {
  const initialConversations = [
    {
      id: 1,
      name: "Jane Doe",
      studentNumber: "2026-00001",
      subject: "Claim for Blue Water Bottle",
      preview: "I wanted to follow up on my claim.",
      unread: true,
      messages: [
        {
          id: 1,
          sender: "student",
          text: "Hello, I submitted a claim for a blue water bottle.",
          time: "10:15 AM",
        },
        {
          id: 2,
          sender: "admin",
          text: "Hello. We have received your claim and it is under review.",
          time: "10:20 AM",
        },
        {
          id: 3,
          sender: "student",
          text: "I wanted to follow up on my claim. Is there any update?",
          time: "10:35 AM",
        },
      ],
    },
    {
      id: 2,
      name: "John Smith",
      studentNumber: "2026-00002",
      subject: "Reporting a Found Item",
      preview: "Where should I take the item?",
      unread: false,
      messages: [
        {
          id: 1,
          sender: "student",
          text: "I found a wallet near the cafeteria. Where should I take it?",
          time: "Yesterday",
        },
      ],
    },
    {
      id: 3,
      name: "Mary Allen",
      studentNumber: "2026-00003",
      subject: "Account Assistance",
      preview: "Thank you for your assistance.",
      unread: false,
      messages: [
        {
          id: 1,
          sender: "student",
          text: "I am having trouble accessing my account.",
          time: "Yesterday",
        },
        {
          id: 2,
          sender: "admin",
          text: "Please try resetting your password.",
          time: "Yesterday",
        },
        {
          id: 3,
          sender: "student",
          text: "Thank you for your assistance.",
          time: "Yesterday",
        },
      ],
    },
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(search.toLowerCase())
  );

  function selectConversation(id) {
    setActiveConversationId(id);

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id
          ? { ...conversation, unread: false }
          : conversation
      )
    );
  }

  function handleSendMessage(e) {
    e.preventDefault();

    if (!message.trim() || !activeConversation) return;

    const newMessage = {
      id: Date.now(),
      sender: "admin",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              preview: newMessage.text,
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    setMessage("");
  }

  return (
    <div className="admin-messages-page">
      <div className="page-heading">
        <div>
          <h1>Messages</h1>
          <p>Communicate with students about lost and found items.</p>
        </div>
      </div>

      <div className="admin-messages-container">
        {/* Conversations list */}
        <aside className="admin-conversations-panel">
          <div className="conversations-heading">
            <h2>Conversations</h2>
            <span>{conversations.length}</span>
          </div>

          <div className="conversation-search">
            <input
              type="search"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-conversations-list">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <button
                  type="button"
                  key={conversation.id}
                  className={`admin-conversation-item ${
                    activeConversationId === conversation.id ? "active" : ""
                  }`}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <div className="conversation-avatar">
                    {conversation.name.charAt(0)}
                  </div>

                  <div className="conversation-details">
                    <div className="conversation-name-row">
                      <strong>{conversation.name}</strong>
                      {conversation.unread && (
                        <span className="unread-indicator"></span>
                      )}
                    </div>

                    <span className="conversation-subject">
                      {conversation.subject}
                    </span>

                    <p>{conversation.preview}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="empty-conversations">
                No conversations found.
              </p>
            )}
          </div>
        </aside>

        {/* Active conversation */}
        <section className="admin-chat-panel">
          {activeConversation ? (
            <>
              <header className="admin-chat-header">
                <div className="conversation-avatar">
                  {activeConversation.name.charAt(0)}
                </div>

                <div>
                  <h2>{activeConversation.name}</h2>
                  <p>
                    Student Number: {activeConversation.studentNumber}
                  </p>
                </div>
              </header>

              <div className="admin-chat-subject">
                <span>Subject:</span> {activeConversation.subject}
              </div>

              <div className="admin-chat-messages">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`admin-chat-message ${msg.sender}`}
                  >
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form
                className="admin-chat-input"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button type="submit" disabled={!message.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <h2>Select a Conversation</h2>
              <p>Choose a student conversation to view messages.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}