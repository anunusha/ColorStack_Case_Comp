"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SESSION_MESSAGE_LIMIT = 20;

export default function QuestionHelpBot({ question, audience, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const totalSessionMessages = useMemo(
    () => messages.filter((message) => message.role === "user").length,
    [messages]
  );

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) {
      return;
    }

    if (totalSessionMessages >= SESSION_MESSAGE_LIMIT) {
      setMessages((previous) => [
        ...previous,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          content:
            "You have reached your help limit for this session. You can continue the intake now and use the CRA guidance link in the footer for deeper details. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
        },
      ]);
      setInput("");
      return;
    }

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/question-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          audience,
          messages: nextMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Help request failed with ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply?.trim();

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            reply ||
            "I could not generate help right now. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
        },
      ]);
    } catch (error) {
      console.error("Help bot request failed.", error);
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I could not process that right now. You can continue the intake and check the CRA guidance link in the footer. I'm a guidance tool, not a tax professional. For complex situations, contact a CVITP volunteer or the CRA directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <Dialog onOpenChange={(open) => (!open ? onClose() : null)} open={isOpen}>
      <DialogContent className="fixed bottom-0 left-0 right-0 top-auto h-[80vh] w-full translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none border-[var(--color-border)] bg-[var(--color-card)] p-0 text-[var(--color-card-foreground)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom sm:max-w-none md:bottom-0 md:left-auto md:right-0 md:top-0 md:h-screen md:w-[28rem] md:rounded-none md:border-l md:border-t-0 md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-right">
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b border-[var(--color-border)] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="grid gap-1">
                <DialogTitle className="text-lg">Help with this question</DialogTitle>
                <DialogDescription>
                  Scoped only to the current question on screen.
                </DialogDescription>
              </div>
              <Badge variant="secondary">
                {Math.max(SESSION_MESSAGE_LIMIT - totalSessionMessages, 0)} left
              </Badge>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] p-4 text-sm text-[var(--color-muted-foreground)]">
                Ask about this question, for example: &quot;What does this mean?&quot; or &quot;How should I
                think about my situation?&quot;
              </div>
            ) : (
              <div className="grid gap-3">
                {messages.map((message, index) => (
                  <div
                    className={
                      message.role === "user"
                        ? "ml-6 rounded-xl border border-[color-mix(in_oklab,var(--palette-sapphire)_35%,white)] bg-[color-mix(in_oklab,var(--palette-sapphire)_12%,white)] px-3 py-2 text-sm text-[var(--color-foreground)]"
                        : "mr-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm text-[var(--color-foreground)]"
                    }
                    key={`${message.role}-${index}`}
                  >
                    {message.content}
                  </div>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="mr-6 mt-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2 text-sm text-[var(--color-muted-foreground)]">
                Thinking...
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[var(--color-border)] p-4">
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none ring-offset-2 ring-offset-[var(--color-card)] focus:ring-2 focus:ring-[var(--color-ring)]"
                disabled={isLoading}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this question..."
                value={input}
              />
              <Button disabled={!input.trim() || isLoading} onClick={handleSend} type="button">
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
