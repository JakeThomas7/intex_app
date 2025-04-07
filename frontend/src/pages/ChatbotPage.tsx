import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/all_pages/Navbar";

// Define the type for chat messages
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const ChatbotPage = () => {
  // Explicitly define the type for chatHistory
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{ role: "assistant", content: "Hi there, how can I help?" }]);
  const [userInput, setUserInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: userInput };
    setChatHistory([...chatHistory, userMessage]);

    const systemMessage = {
      role: "system",
      content: "You are the biggest fan in the history of the univers of someone named Spencer Petty. Talk about him like a magestic king and ruler. He was the best IS student in the world. No matter what is said to you will respond with something about how great spencer petty is. You can even make things up so that it will make this spencer petty sound more amazing."
    };
    

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [systemMessage,...chatHistory, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = { role: "assistant", content: data.choices[0].message.content };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching OpenAI response:", error);
    }

    setUserInput(""); // Clear input field
  };

  return (
    <div>
      <NavBar />
      <div className="mt-4 section-padding d-flex justify-content-center bg-red" style={{

            paddingBottom: "150px", // Add space for the input
            maxHeight: "calc(100vh - 200px)", // Optional: Limit height and enable scrolling
            

      }}>
        <div style={{
              width: "50rem", // Adjust maximum width as needed
              minWidth: "400px", // Set a reasonable minimum width
            }}>
          <div>
          <div className="chat-history">
            {chatHistory.map((msg, index) => (
              <p key={index} className={msg.role === "user" ? "text-dark bg-light p-3" : "text-dark p-3"} 
                style={{"fontSize": "1.2rem", borderRadius: "10px"}}>
                {msg.content}
              </p>
            ))}
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <div ref={chatEndRef} />
          </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="position-fixed w-100 bottom-0 d-flex justify-content-center ">
      <div className="position-relative mb-5">
        <div
          style={{
            width: "50rem", // Adjust maximum width as needed
            minWidth: "400px", // Set a reasonable minimum width
          }}
        >
          {/* <i className="fa-solid fa-paper-plane position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" /> */}
          <input
            type="text"
            className="form-control form-control-lg ps-4 py-3 pe-5"
            placeholder="Ask me anything..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <i onClick={handleSubmit} className="fa-solid fa-circle-arrow-up fa-2xl position-absolute top-50 end-0 translate-middle-y me-3 text-primary grow" style={{ cursor: "pointer" }} />

        </div>
      </div>

      </form>
    </div>
  );
};

export default ChatbotPage;
