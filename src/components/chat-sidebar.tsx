"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Plus, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  MoreVertical,
  Search,
  X
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ChatService, Conversation } from "@/lib/chat-service"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  currentConversationId?: string
  onConversationSelect: (conversationId: string) => void
  onNewChat: () => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  refreshTrigger?: number
}

export default function ChatSidebar({
  currentConversationId,
  onConversationSelect,
  onNewChat,
  isCollapsed = false,
  onToggleCollapse,
  refreshTrigger = 0
}: ChatSidebarProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  // Load conversations when user changes or component mounts
  const loadConversations = async () => {
    if (!user) {
      setConversations([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const userConversations = await ChatService.getConversationsForUser(user)
      setConversations(userConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [user, toast, refreshTrigger])

  // Subscribe to real-time conversation updates
  useEffect(() => {
    if (!user) return

    const subscription = ChatService.subscribeToConversations(user, (updatedConversations) => {
      setConversations(updatedConversations)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteConversation = async (conversationId: string) => {
    if (!user) return

    try {
      const success = await ChatService.deleteConversation(user, conversationId)
      if (success) {
        setConversations(prev => prev.filter(conv => conv.id !== conversationId))
        toast({
          title: "Success",
          description: "Conversation deleted successfully",
        })
        
        // If we deleted the current conversation, start a new chat
        if (currentConversationId === conversationId) {
          onNewChat()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete conversation",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      })
    }
  }

  const handleEditTitle = (conversation: Conversation) => {
    setEditingId(conversation.id)
    setEditingTitle(conversation.title)
  }

  const handleSaveTitle = async (conversationId: string) => {
    if (!user || !editingTitle.trim()) return

    try {
      const success = await ChatService.updateConversationTitle(user, conversationId, editingTitle.trim())
      if (success) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, title: editingTitle.trim() }
            : conv
        ))
        toast({
          title: "Success",
          description: "Conversation title updated",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update conversation title",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating conversation title:', error)
      toast({
        title: "Error",
        description: "Failed to update conversation title",
        variant: "destructive",
      })
    } finally {
      setEditingId(null)
      setEditingTitle("")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (isCollapsed) {
    return (
      <div className="w-16 h-full bg-gradient-to-b from-background/95 to-background/90 border-r border-border/50 flex flex-col">
        <div className="p-3 border-b border-border/50">
          <Button
            onClick={onNewChat}
            size="icon"
            className="w-10 h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredConversations.slice(0, 10).map((conversation) => (
              <Button
                key={conversation.id}
                variant={currentConversationId === conversation.id ? "secondary" : "ghost"}
                size="icon"
                className={cn(
                  "w-10 h-10 relative",
                  currentConversationId === conversation.id && "bg-secondary/80"
                )}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <MessageCircle className="h-4 w-4" />
                {currentConversationId === conversation.id && (
                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-primary rounded-full" />
                )}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="w-80 h-full bg-gradient-to-b from-background/95 to-background/90 border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat History</h2>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">
                {searchQuery ? "No conversations found" : "No conversations yet"}
              </p>
              <p className="text-xs mt-1">
                {searchQuery ? "Try a different search term" : "Start a new chat to begin"}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                    currentConversationId === conversation.id && "bg-secondary/80 shadow-sm"
                  )}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs">
                        <MessageCircle className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      {editingId === conversation.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveTitle(conversation.id)
                              } else if (e.key === 'Escape') {
                                handleCancelEdit()
                              }
                            }}
                            onBlur={() => handleSaveTitle(conversation.id)}
                            className="h-8 text-sm"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium truncate">
                            {conversation.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(conversation.last_message_at)}
                          </p>
                        </>
                      )}
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditTitle(conversation)
                            }}
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteConversation(conversation.id)
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 