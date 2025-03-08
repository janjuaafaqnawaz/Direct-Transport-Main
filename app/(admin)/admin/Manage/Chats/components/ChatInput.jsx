import { ArrowDownCircle, ImageIcon, Send } from "lucide-react";

const ChatInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleSendImage,
  listRef,
  chat,
}) => (
  <div className="p-4 bg-opacity-20 backdrop-blur-lg bg-gray-900">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your message..."
      />
      <button
        onClick={handleSendImage}
        className="bg-[#349ae7] text-white rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <ImageIcon alt="logo" size={20} />
      </button>
      <button
        onClick={handleSendMessage}
        className="bg-[#349ae7] text-white rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <Send size={20} />
      </button>
      <button
        onClick={() => listRef.current?.scrollToItem(chat.length - 1, "end")}
        className="bg-white text-[#349ae7] rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <ArrowDownCircle size={20} />
      </button>
    </div>
  </div>
);

export default ChatInput;
