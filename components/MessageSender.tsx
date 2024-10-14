"use client";

import React, { useEffect, useState } from "react";
import { useMqtt } from "./providers/mqtt-provider";
import { Input } from "./ui/input";

const MessageSender = (props: any) => {
  const [message, setMessage] = useState("");
  const { connected, setSendMessageMqtt } = useMqtt();
  const { params: { id } } = props;

  const handleSend = () => {
    if (message) {
      //   setSendMessageMqtt(message);
      setSendMessageMqtt({ message: message, user: "characterName" });
      setMessage(""); // Limpa o campo após enviar
    }
  };

  useEffect(() => {
    console.log("AAAAAAAAAAAAAAAA", id, connected)
    if (id && connected) {
      setSendMessageMqtt({
        message: 'start',
        project: id[0] ?? "-",
        action: "start",
      });
    }
  }, [connected, id]);

  return (
    <div>
      {/* ={JSON.stringify(props)}=
      <Input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem"
      />
      <button onClick={handleSend}>Enviar</button> */}
    </div>
  );
};

export default MessageSender;
