import React, { useState, useEffect, useRef } from 'react';

const ChatBox = ({ isChatOpen, setIsChatOpen }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to Digital Heroes. How can I assist you with your Home Loan planning today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInput('');

    // Trigger mock bot reply after 600ms
    setTimeout(() => {
      let reply = "Thank you for your message! A home loan expert from Digital Heroes will get in touch with you shortly. You can also call us at +91 6387421XXX.";
      const cleanQuery = query.toLowerCase();

      if (cleanQuery.includes('rate') || cleanQuery.includes('interest')) {
        reply = "Digital Heroes offers home loan interest rates starting from 7.75%* p.a. Under adjustable rate options, rates can vary depending on loan size and tenure.";
      } else if (cleanQuery.includes('surf') || cleanQuery.includes('step up')) {
        reply = "SURF (Step Up Repayment Facility) offers lower EMIs in the initial years. It is designed to match your growing income, allowing you to buy a home early in your career.";
      } else if (cleanQuery.includes('prepay') || cleanQuery.includes('save')) {
        reply = "Prepaying your home loan reduces the principal balance, saving you substantial interest. Try adding a 'Monthly Prepayment' in our calculator above to see your customized savings!";
      } else if (cleanQuery.includes('eligibility') || cleanQuery.includes('amount')) {
        reply = "Home loan eligibility depends on your income, age, existing liabilities, and credit score. Use our Eligibility Calculator tab at the top for detailed estimations.";
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 600000 / 1000000 + 600); // ~600ms response delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!isChatOpen) {
    return (
      <button
        type="button"
        className="chat-toggle-btn"
        onClick={() => setIsChatOpen(true)}
        aria-label="Open chat"
      >
        <span className="chat-icon-bubble">💬</span>
        <span className="chat-notification-dot"></span>
      </button>
    );
  }

  return (
    <div className="chatbox-widget animate-slide-in">
      {/* Header */}
      <div className="chatbox-header">
        <div className="chatbox-agent-info">
          <div className="chatbox-avatar">
            <span className="avatar-letter">H</span>
            <span className="online-indicator"></span>
          </div>
          <div>
            <div className="agent-name">Hero Support</div>
            <div className="agent-status">Online • Ready to help</div>
          </div>
        </div>
        <button
          type="button"
          className="btn-chatbox-close"
          onClick={() => setIsChatOpen(false)}
          aria-label="Minimize chat"
        >
          &times;
        </button>
      </div>

      {/* Messages body */}
      <div className="chatbox-body">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message-row ${msg.sender}`}>
            {msg.sender === 'bot' && (
              <div className="bot-chat-avatar">H</div>
            )}
            <div className={`chat-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick response chips */}
      <div className="chatbox-chips">
        <button type="button" className="chat-chip" onClick={() => handleSend("What are the interest rates?")}>
          Interest Rates?
        </button>
        <button type="button" className="chat-chip" onClick={() => handleSend("What is SURF repayment?")}>
          What is SURF?
        </button>
        <button type="button" className="chat-chip" onClick={() => handleSend("How can I save interest?")}>
          Save Interest?
        </button>
      </div>

      {/* Input row */}
      <div className="chatbox-input-row">
        <input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="chatbox-input"
        />
        <button
          type="button"
          className="btn-chatbox-send"
          onClick={() => handleSend()}
          aria-label="Send message"
        >
          ➔
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
