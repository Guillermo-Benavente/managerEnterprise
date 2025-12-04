import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import style from './modal.module.css';
import { X } from 'lucide-react';
import Header from 'Components/Header/Header';
import Button from "Components/Button/Button";
import ButtonType from 'Types/renderer/buttonType';

export default function Modal({ title, textButtonOpen, autoOpen = false, hidden = false, typeButton = ButtonType.PRIMARY, children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {!hidden && (
        <Dialog.Trigger asChild>
          <Button type={typeButton}>
            {textButtonOpen}
          </Button>
        </Dialog.Trigger>
      )}

      <Dialog.Portal>
        <Dialog.Overlay className={style.overlay}/>
        <Dialog.Content className={style.content}>
          
          {/* TODO: En el futuro usar para darle contexto al dialogo <Dialog.Title></Dialog.Title> */}
          <Header title={title}>
            <Button type={ButtonType.LINK} event={() => setOpen(false)}>
              <X />
            </Button>
          </Header>
          {/*children*/}
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}