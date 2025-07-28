import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import style from './modal.module.css';
import Header from 'Components/Header/Header';
import Button from "Components/Button/Button";
import ButtonType from 'Types/renderer/buttonType';

export default function Modal({ title, textButtonOpen, textButtonClose, children }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button type={ButtonType.PRIMARY}>
          {textButtonOpen}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={style.overlay}/>
        <Dialog.Content className={style.content}>
          
          {/* TODO: En el futuro usar para darle contexto al dialogo <Dialog.Title></Dialog.Title> */}
          <Header title={title}>
            <Button type={ButtonType.PRIMARY} event={() => setOpen(false)}>
              {textButtonClose}
            </Button>
          </Header>
          {/*children*/}
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}