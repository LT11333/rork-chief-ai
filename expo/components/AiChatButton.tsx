import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { MessageSquare, Send, X } from "lucide-react-native";
import Colors from "@/constants/colors";
import { globalStyles } from "@/constants/theme";
import { useUserStore } from "@/store/userStore";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export default function AiChatButton() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your Chief AI assistant. How can I help with your meal planning or nutrition questions today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { preferences } = useUserStore();
  
  const handleOpenChat = () => {
    setIsModalVisible(true);
  };
  
  const handleCloseChat = () => {
    setIsModalVisible(false);
  };
  
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputText
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    
    try {
      // Prepare system message with user preferences
      const systemMessage = `You are a helpful nutrition and meal planning assistant. 
        The user has the following preferences:
        - Goal: ${preferences.goal}
        - Dietary restrictions: ${preferences.dietaryRestrictions.join(", ") || "None"}
        - Cooking time preference: ${preferences.cookingTime}
        - Flavor preferences: ${preferences.flavorPreferences.join(", ") || "No specific preferences"}
        
        Provide helpful, concise advice based on these preferences.`;
      
      // Format messages for the API
      const apiMessages = [
        { role: "system", content: systemMessage },
        ...messages.filter(m => m.role !== "system"),
        userMessage
      ].map(({ role, content }) => ({ role, content }));
      
      // Make API request
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }
      
      const data = await response.json();
      
      // Add assistant response to messages
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.completion
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please try again later."
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reverse the messages array for display
  const displayMessages = [...messages].reverse();
  
  return (
    <>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={handleOpenChat}
      >
        <MessageSquare size={24} color={Colors.white} />
      </TouchableOpacity>
      
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseChat}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chief AI Assistant</Text>
              <TouchableOpacity onPress={handleCloseChat}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {displayMessages.map((message) => (
                <View 
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.role === "user" ? styles.userMessage : styles.assistantMessage
                  ]}
                >
                  <Text style={styles.messageText}>{message.content}</Text>
                </View>
              ))}
            </ScrollView>
            
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={100}
            >
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Ask about nutrition or recipes..."
                  placeholderTextColor={Colors.textExtraLight}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={500}
                  onSubmitEditing={handleSendMessage}
                />
                
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !inputText.trim() && styles.sendButtonDisabled
                  ]}
                  onPress={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Send size={20} color={Colors.white} />
                  )}
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    flexDirection: 'column-reverse',
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: Colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: Colors.backgroundLight,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textExtraLight,
  },
});