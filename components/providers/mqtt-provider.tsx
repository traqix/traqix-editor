"use client";

import { ContactsStorage } from "@/storage/local-storage-cache";
import mqtt, { IClientOptions, MqttClient } from "mqtt";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type Contact = {
  bio: string;
  image: string;
  name: string;
  userId: string;
  username: string;
  verified: boolean;
  roomLanding?: string;
  roomConversation?: string;
};

export type ContactList = {
  id: string;
  image: string;
  name: string;
  username: string;
  verified: boolean;
  roomConversation?: string;
};

export type RoomsConnected = {
  total: number;
  rooms: string[];
};

export type ResultContacts = {
  _id: string;
  contacts: ContactList[];
};

export interface MqttProps {
  connected: boolean;
  mqttData: string[] | undefined;
  setMqttData: (data: string[]) => void;
  setSendMessageMqtt: (data: any) => void;
  setContacts: (data: Contact[]) => void;
  setRoomsConnected: (data: RoomsConnected) => void;
  resultContacts: ResultContacts[];
  startStorage: () => void;
}

const MqttContext = createContext<MqttProps | undefined>(undefined);

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error("useMqtt must be used within a MqttProvider");
  }
  return context;
};

export const MqttProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connected, setConnected] = useState(false);
  const [mqttData, setMqttData] = useState<string[]>([]);
  const [client, setClient] = useState<MqttClient | null>(null);
  const [sendMessageMqtt, setSendMessageMqtt] = useState<any>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [resultContacts, setResultContacts] = useState<ResultContacts[]>([]);
  const [roomsConnected, setRoomsConnected] = useState<RoomsConnected>({
    total: 0,
    rooms: [],
  });

  const websocketUrl = "d3NzOi8vdGVzdC5tb3NxdWl0dG8ub3JnOjgwODE=";
  const landingChat = "dmFuY2hlLW1haW4tY2hhdC1pQUpla1Bvc3VqU04=";

  const connectMQTT = useCallback(() => {
    if (!connected) {
      const clientId = `mqttjs_${Math.random().toString(16).substr(2, 8)}`;
      const options: IClientOptions = {
        connectTimeout: 40000,
        keepalive: 1200,
        clean: true,
        reconnectPeriod: 1000,
        protocol: "wss",
        path: "/mqtt",
      };

      const mqttClient = mqtt.connect(atob(websocketUrl), {
        ...options,
        clientId,
      });
      mqttClient.on("connect", () => {
        setConnected(true);
        console.log("Connected to", atob(websocketUrl));
      });

      mqttClient.on("message", (topic: string, message: Buffer) => {
        const newMessage = message.toString();
        setMqttData((prevData) => [...prevData, newMessage]);
      });

      setClient(mqttClient);
    }
  }, [connected]);

  const subscribeRoom = useCallback(
    (nameChat: string, contact: any) => {
      if (!connected) return;

      client?.subscribe(nameChat, (err) => {
        if (err) {
          console.error(`Error subscribing to ${nameChat}:`, err);
        } else {
          console.log(`Subscribed to ${nameChat}`);
          // Adicione a lógica para lidar com o contato aqui
        }
      });
    },
    [connected, client]
  );

  useEffect(() => {
    // make an announcement
    if (!sendMessageMqtt) return
    console.log(
      "TRY  YYY Published successfully",
      atob(landingChat),
      sendMessageMqtt,
      connected
    );
    if (connected && sendMessageMqtt) {
      client?.publish(atob(landingChat), JSON.stringify(sendMessageMqtt), (err: any) => {
        console.log(err, "Published successfully");
        setSendMessageMqtt(null)
      });
    }
  }, [sendMessageMqtt, client]);

  useEffect(() => {
    setTimeout(() => {
    if (!connected) connectMQTT();
  }, 1000)
  }, [connectMQTT]);

  useEffect(() => {
    if (connected) {
      subscribeRoom(atob(landingChat), null);
    }
  }, [connected, subscribeRoom]);

  const startStorage = () => {
    const contactsStorage: ResultContacts[] = JSON.parse(
      ContactsStorage.get() ?? "[]"
    );
    setResultContacts(contactsStorage);
  };

  const value: MqttProps = {
    connected,
    mqttData,
    setMqttData,
    setSendMessageMqtt,
    setContacts,
    setRoomsConnected,
    resultContacts,
    startStorage,
  };

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
};
