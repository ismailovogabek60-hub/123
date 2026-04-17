'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, ChevronLeft, Send } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }
    fetchConversations(token);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchMessages(token, selectedConversation);
      }
    }
  }, [selectedConversation]);

  const fetchConversations = async (token: string) => {
    try {
      const response = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        if (data.conversations && data.conversations.length > 0) {
          setSelectedConversation(data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (token: string, conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: selectedConversation,
          content: messageInput,
        }),
      });

      if (response.ok) {
        setMessageInput('');
        fetchMessages(token, selectedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <ChevronLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">EduLearn</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Messages</h2>
          <p className="text-gray-600">Chat with your instructors and classmates</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="overflow-hidden flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                {conversations.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation.id)}
                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                          selectedConversation === conversation.id
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-white flex items-center justify-center font-bold">
                              {conversation.participantName[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {conversation.participantName}
                              </h4>
                              <p className="text-xs text-gray-600 truncate">
                                {conversation.lastMessage}
                              </p>
                            </div>
                          </div>
                          {conversation.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-13">
                          {conversation.lastMessageTime}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Area */}
            {selectedConversation ? (
              <Card className="lg:col-span-2 overflow-hidden flex flex-col">
                {conversations.find((c) => c.id === selectedConversation) && (
                  <>
                    <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                      <CardTitle className="text-lg">
                        {conversations.find((c) => c.id === selectedConversation)?.participantName}
                      </CardTitle>
                    </CardHeader>

                    {/* Messages */}
                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col justify-end">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500">
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg ${
                                message.isOwn
                                  ? 'bg-blue-600 text-white rounded-br-none'
                                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${message.isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 flex gap-2">
                      <Input
                        type="text"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            ) : (
              <Card className="lg:col-span-2 flex items-center justify-center text-gray-500">
                <p>Select a conversation to start chatting</p>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
