import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { logout, getMessages, getChatPreviews , uploadAvatar , deleteAccount } from "../api";
import { useNavigate } from "react-router-dom";
import socket from "../web-sockets/socket";
import Loading from "../components/Loading";

function Home() {
  const { user , loading ,setUser } = useAuth();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedTab, setSelectedTab ]= useState("chats");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messages, setMessages] = useState({});
  const [chatPreviews, setChatPreviews] = useState([]);
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    socket.on("online-users", (users) => {
      
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online-users");
    };
  }, []);

  useEffect(() => {
    getChatPreviews().then((res) => {
      

      setChatPreviews(res.data);
    });
  }, []);
  useEffect(() => {
   
  }, [chatPreviews]);

  useEffect(() => {
    socket.on("typing", ({ senderID }) => {
      if (selectedUser && selectedUser._id === senderID) {
        setTypingUser(senderID);
      }
    });

    socket.on("stop-typing", ({ senderID }) => {
      if (selectedUser && selectedUser._id === senderID) {
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("typing");
      socket.off("stop-typing");
    };
  }, [selectedUser]);

  useEffect(() => {
    const handleReceiveMessage = ({ senderID, content }) => {
      const newMsg = {
        senderID,
        receiverID: user._id,
        content,
        timestamp: Date.now(),
      };

      setMessages((prevMessages) => {
        const updatedMessages = {
          ...prevMessages,
          [senderID]: [...(prevMessages[senderID] || []), newMsg],
        };

       
        setChatPreviews((prevPreviews) => {
          const updated = prevPreviews.map((preview) => {
            if (preview.friend._id === senderID) {
              return {
                ...preview,
                lastMessage: newMsg,
                unreadCount:
                  selectedUser && selectedUser._id === senderID
                    ? preview.unreadCount
                    : (preview.unreadCount || 0) + 1,
              };
            }
            return preview;
          });

          return updated
        });
        
      
        if (selectedUser && selectedUser._id === senderID) {
          socket.emit("markMessagesAsRead", {
            from: senderID,
            to: user._id,
          });
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [senderID]: 0,
          }));
        } else {
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [senderID]: (prevCounts[senderID] || 0) + 1,
          }));
        }

        return updatedMessages;
      });
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedUser, user._id]);

  function sendMessage() {
    if (!selectedUser || !message.trim()) return;

    const newMsg = {
      senderID: user._id,
      receiverID: selectedUser._id,
      content: message.trim(),
      timestamp: Date.now(),
    };
    setMessages((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), newMsg],
    }));
    setChatPreviews((prevPreviews) => {
      const updatedPreviews = prevPreviews.map((preview) => {
        if (preview.friend._id === selectedUser._id) {
          return {
            ...preview,
            lastMessage: newMsg,
          };
        }
        return preview;
      });

      return updatedPreviews
    });

    socket.emit("send-message", {
      senderID: user._id,
      receiverID: selectedUser._id,
      content: message.trim(),
      timestamp: Date.now(),
    });
    setMessage("");
  }
  useEffect(() => {
    if (selectedUser) {
      setUnreadCounts((prev) => ({ ...prev, [selectedUser._id]: 0 }));
      try {
        getMessages(selectedUser._id).then((res) => {
         

          const data = res.data;
          setMessages((prev) => ({
            ...prev,
            [selectedUser._id]: data,
          }));
        });
      } catch (error) {
        console.error("Failed to load messages", err);
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.on("messages-seen", ({ by }) => {
      setMessages((prev) => {
        const updated = { ...prev };
        if (updated[by]) {
          updated[by] = updated[by].map((msg) => ({
            ...msg,
            isRead: true,
          }));
        }
        return updated;
      });
    });

    return () => {
      socket.off("messages-seen");
    };
  }, []);
  async function logoutUser() {
    await logout();

    setUser(null)
    navigate("/login");
  }
  async function deleteAcc() {
    await deleteAccount(user._id);
    navigate("/login");
  }

  const sortedChatPreviews = [...chatPreviews].sort((a, b) => {
  const lastA = messages[a.friend._id]?.at(-1)?.timestamp || 0;
  const lastB = messages[b.friend._id]?.at(-1)?.timestamp || 0;
  return lastB - lastA;
});


  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = 0;
    }
  }, [messages[selectedUser?._id]]);

  function handlePictureChange(e) {
      const file = e.target.files[0];
      if (file) {
       
        const formData = new FormData();
  
        formData.append("avatar", file);
         uploadAvatar(formData)
      }
    }

  if (loading) return <Loading />
    
  return (
    <div className="w-full h-screen bg-[url('/bg.png')] bg-center bg-cover flex">
      <div
        className={`contacts-bar w-full md:w-1/3 lg:w-1/4 bg-white border-r ${
          isMobileChatOpen ? "hidden md:block" : "block"
        }`}
      >
        <div className=" header font-semibold flex-col bg-gray-100 justify-between text-lg px-4 shadow-md items-center">
          <div className="flex justify-between items-center w-full py-3">
            
          
          <img
            src="logo.png"
            className="w-24 md:w-20"
            alt="logo"
          />
          <div className="flex gap-3">
           
            <img 
              onClick={() =>setShowMenu(!showMenu)}
              src={user.profilePic}
              className="w-8 h-8 cursor-pointer rounded-full object-cover"
             alt="profile pic"
            />
          </div>
          </div>
          {showMenu && 
          <div className="menu-options w-full h-24 border-t border-gray-400 flex items-center justify-center gap-10 ">
            <div onClick={()=>fileInputRef.current.click()} className="flex flex-col items-center text-sm font-light cursor-pointer"> <img
              src={user.profilePic}
              className="w-10 h-10 border rounded-full p-0.5 object-cover"
              alt="search icon"
            />Change dp</div>

            <input
              type="file"
              accept="image/*"
              name="avatar"
              onChange={(e) => {
                handlePictureChange(e);
                
              }}
              ref={fileInputRef}
              className="hidden"
            />
            <div onClick={()=> setShowPopup(true)} className="flex flex-col items-center cursor-pointer text-sm font-light"> <img
              src="user.png"
              className="w-10 h-10 border rounded-full p-1"
              alt="search icon"
            />Delete account</div>

             <div onClick={logoutUser} className="flex flex-col items-center text-sm font-light cursor-pointer"> <img
              src="back.png"
              className="w-10 h-10 border rounded-full p-1"
              alt="back icon"
            />Log out</div>
          </div>
          }
        </div>
        <div className="flex justify-between w-full text-md font-light border-b-[1px] border-gray-200">
          <div onClick={()=> setSelectedTab("chats")} className={`w-1/2 hover:bg-gray-200 ${selectedTab == "chats" &&  "bg-gray-200"} cursor-pointer flex justify-center`}>
            my chats
          </div>
          <div onClick={()=> setSelectedTab("online")} className={`w-1/2 hover:bg-gray-100 cursor-pointer ${selectedTab == "online" &&  "bg-gray-200"} flex justify-center`}>
            online users
          </div>
          
        </div>

      {selectedTab == "chats" && 
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {sortedChatPreviews.map((preview) => {
              const isOnline = onlineUsers.some(
                (u) => u._id === preview.friend._id
              );
              const lastMsg = preview.lastMessage;
              const isSender = lastMsg?.senderID === user._id;

              return (
                <div
                  onClick={() => {
                    setSelectedUser(preview.friend);
                    setIsMobileChatOpen(true);

                    // Emit to server to reset unread count
                    socket.emit("markMessagesAsRead", {
                      from: preview.friend._id,
                      to: user._id,
                    });

                    // Optimistically update UI
                    setChatPreviews((prevPreviews) =>
                      prevPreviews.map((p) =>
                        p.friend._id === preview.friend._id
                          ? { ...p, unreadCount: 0 }
                          : p
                      )
                    );
                  }}
                  key={preview.friend._id}
                  className={`p-3 md:p-2 ${
                    user._id === preview.friend._id && "hidden"
                  } hover:bg-gray-100 cursor-pointer h-20 flex gap-2 items-center border-b-[1px] border-gray-200 relative`}
                >
                  <img
                    src={preview.friend.profilePic}
                    alt="profile pic"
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex flex-col justify-center">
                    <p className="text-xl font-medium">
                      {preview.friend.name}{" "}
                      {isOnline && (
                        <span className="ml-1 w-2 h-2 bg-green-500 rounded-full inline-block mb-0.5"></span>
                      )}
                    </p>
                    <p className="text-sm font-light mb-1 truncate max-w-[180px]">
                      {isSender && "you: "}
                      {lastMsg?.content || "No messages yet"}
                    </p>
                  </div>

                  {preview.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-indigo-500 absolute top-1/3 right-4 rounded-full text-xs inline-flex justify-center items-center pb-0.5 text-white font-semibold">
                      {preview.unreadCount}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        }
        {selectedTab == "online" && 
         <div className="overflow-y-auto  h-[calc(100%-4rem)]">
    {onlineUsers.map((onlineUser) => (
       <div
       onClick={() => {
        setSelectedUser(onlineUser);
         setIsMobileChatOpen(true);
       }}
        key={onlineUser._id}
       className={`p-3 md:p-2 ${
        (user._id === onlineUser._id || chatPreviews.some(obj =>obj.friend._id == onlineUser._id ) ) && "hidden"
      } hover:bg-gray-100 cursor-pointer flex gap-2 items-center border-b-[1px] border-gray-200 relative`}
     >
      <img src={onlineUser.profilePic}  alt="profile pic" className="w-12 h-12 rounded-full" />

      <div className="flex flex-col justify-center">
        <p className="text-xl font-medium">{onlineUser.name}</p>
       
      </div>
      {unreadCounts[onlineUser._id] > 0 && (
        <div className="w-5 h-5 bg-indigo-500 absolute top-1/3 right-4 rounded-full text-xs inline-flex justify-center items-center pb-0.5 text-white font-semibold">
          {unreadCounts[onlineUser._id]}
        </div>
      )}
    </div>
  ))}
</div>
        }
      </div>
      {selectedUser ? (
        <>
          <div
            className={`messages-bar flex w-full flex-col md:w-2/3 lg:w-3/4 bg-[url('/bg.png')] bg-center bg-cover ${
              selectedUser ? "block" : "hidden"
            } ${isMobileChatOpen ? "block" : "hidden md:flex"}`}
          >
            {/* Header */}
            <div className="text-lg px-4 py-4 bg-gray-100 shadow-md flex items-center gap-2">
              <button
                onClick={() => setIsMobileChatOpen(false)}
                className="md:hidden mr-2 rounded font-black text-lg"
              >
                <img src="/back.png" width={15} alt="back icon" />
              </button>

              <img
                src={selectedUser.profilePic}
                alt="profile pic"
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="flex flex-col justify-center">
                <p className="text-xl font-semibold">
                  {selectedUser && selectedUser.name}
                </p>

                {typingUser && (
                  <p className="text-xs text-gray-600">Typing...</p>
                )}
              </div>
            </div>

            {/* chats */}
            <div
              ref={messageEndRef}
              className="flex-1 flex flex-col-reverse overflow-y-auto p-4 gap-2"
            >
              {[...(messages[selectedUser._id] || [])]
                .reverse()
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.senderID === user._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`${
                        msg.senderID === user._id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      } py-2 px-4 rounded-2xl shadow max-w-xs break-words`}
                    >
                      <div className="text-lg">{msg.content}</div>
                      <div
                        className={`text-xs mt-1 text-right ${
                          msg.senderID === user._id
                            ? "text-gray-200"
                            : "text-gray-600"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {msg.senderID === user._id && (
                        <span className="ml-3 text-xs">
                          {msg.isRead ? "✓✓" : "✓"}
                        </span>
                      )}
                      </div>
                      
                    </div>
                  </div>
                ))}
            </div>

            {/* input */}

            <div className="flex p-4 gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);

                  socket.emit("typing", {
                    senderID: user._id,
                    receiverID: selectedUser?._id,
                  });

                  // Stop typing after 2s of inactivity
                  clearTimeout(typingTimeoutRef.current);
                  typingTimeoutRef.current = setTimeout(() => {
                    socket.emit("stop-typing", {
                      senderID: user._id,
                      receiverID: selectedUser?._id,
                    });
                  }, 2000);
                }}
                placeholder="Type a message.."
                className="flex-1 border border-gray-400 px-3 py-2 rounded-full text-sm"
              />
              <button
                onClick={sendMessage}
                className=" px-3 py-2 text-white rounded-full cursor-pointer"
              >
                <img
                  src="/send.png"
                  className="w-6 md:w-7"
                  alt=""
                />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="messages-bar hidden md:flex flex-col justify-center items-center w-2/3 lg:w-3/4 bg-[url('bg.png')] bg-center bg-cover">
          <h1 className="font-light text-4xl mb-1 pb-1 border-b-[1px] border-gray-300">
            Welcome to <span className="font-bold text-indigo-500">Qurio</span>
          </h1>
          <p className="text-sm">Select a chat to see its content!</p>
        </div>
      )}
    {showPopup && 
      <div className="menu w-full h-screen flex justify-center items-center fixed top-18">
        <div className="popup w-4/5 lg:w-3/5  xl:w-2/5 2xl:w-1/5 h-[15%] bg-gray-100 rounded-2xl shadow flex flex-col justify-center items-center gap-6">
          <p className="font-thin">Do you really want to delete your account?</p>
          <div className="flex gap-4">
          <button onClick={()=>setShowPopup(false)} className="border cursor-pointer hover:bg-green-700 px-6 py-1 bg-green-600 text-white text-xl font-medium rounded-lg">Cancel</button>
          <button onClick={deleteAcc} className="border px-6 py-1 bg-red-500 cursor-pointer hover:bg-red-600 text-white text-xl font-medium rounded-lg">Delete</button>
          </div>
            
        </div>
      </div>
      }
    </div>
  );
}

export default Home;


 
