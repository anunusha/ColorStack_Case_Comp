"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function DeepLinkDialog({
  modalKey,
  title,
  description,
  confirmLabel,
  onConfirm,
  children,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modal") === modalKey;

  const setModalState = useCallback(
    (open) => {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (open) {
        nextParams.set("modal", modalKey);
      } else {
        nextParams.delete("modal");
      }

      const query = nextParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [modalKey, pathname, router, searchParams]
  );

  return (
    <>
      <Button onClick={() => setModalState(true)} variant="secondary">
        {children}
      </Button>
      <Dialog onOpenChange={setModalState} open={isOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setModalState(false)} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onConfirm();
                setModalState(false);
              }}
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
