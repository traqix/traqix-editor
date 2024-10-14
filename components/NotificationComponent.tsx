"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useMqtt } from "./providers/mqtt-provider";
import { addComponent, convertTreeItemToTreeFull, transformSectionToTreeItems } from "@/app/(main)/(editor)/utils/util";
import { useTree } from "./context/tree-context";
import { TreeFull, TreeItem } from "@/app/(main)/(editor)/types";

const NotificationComponent = () => {
  const { connected, mqttData, setSendMessageMqtt, setMqttData } = useMqtt();

  const [messages, setMessages] = useState([
    // {
    //   role: "agent",
    //   content: "Hi, how can I help you today?",
    // },
    // {
    //   role: "user",
    //   content: "Hey, I'm having trouble with my account.",
    // },
    // {
    //   role: "agent",
    //   content: "What seems to be the problem?",
    // },
    // {
    //   role: "user",
    //   content: "I can't log in.",
    // },
  ]);

  const sendMessage = useCallback(
    (
      message: string,
      user: string,
      local: boolean = true,
      mqtt: boolean = true
    ) => {
      if (mqtt) {
        setSendMessageMqtt({ message: message, user: "characterName" });
        // setLoading(true);
      }

      const dateNow = new Date().toISOString();
      const dateReceiver = dateNow.slice(0, 10) + " " + dateNow.slice(11, 16);

      const newMessages = [
        ...messages,
        {
          role: local ? "user" : "assistant",
          user: user,
          content: message,
          dateReceiver: dateReceiver,
        }, // as ChatGPTMessage,
      ];
      setMessages(newMessages);
      // scrollToBottom();
      // setLoading(false);
      // const last10messages = newMessages.slice(-10); // remember last 10 messages

      // const response = await fetch("/api/chat", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     messages: last10messages,
      //     user: cookie[COOKIE_NAME],
      //   }),
      // });

      // console.log("Edge function returned.");

      // if (!response.ok) {
      //   throw new Error(response.statusText);
      // }

      // // This data is a ReadableStream
      // const data = response.body;
      // if (!data) {
      //   return;
      // }

      // const reader = data.getReader();
      // const decoder = new TextDecoder();
      // let done = false;

      // let lastMessage = "";

      // while (!done) {
      //   const { value, done: doneReading } = await reader.read();
      //   done = doneReading;
      //   const chunkValue = decoder.decode(value);

      //   lastMessage = lastMessage + chunkValue;

      //   setMessages([
      //     ...newMessages,
      //     { role: "assistant", content: lastMessage } as ChatGPTMessage,
      //   ]);

      //   setLoading(false);
      // }
    },
    [setSendMessageMqtt]
  );

  const { getTree, setTree } = useTree();
  const treeRoot = getTree("root")

  useEffect(() => {
    if (connected) {
      // Aqui você pode lidar com a lógica de exibição de notificações
      // Por exemplo, exibir a última mensagem recebida
      console.log("Nova mensagem recebida:", mqttData);
      if (mqttData?.length) {
        const messa = JSON.parse(mqttData[mqttData?.length - 1]);
        if (messa.message == 'start' && window.localStorage.getItem('traqix_id') == messa.project) {
          setSendMessageMqtt({message: JSON.stringify(convertTreeItemToTreeFull(treeRoot, getTree), null, 2), action: 'response', to: 'value'})
        }
        if (messa.action == 'response' && window.localStorage.getItem('traqix_id') == messa.to && treeRoot?.children?.length == 0) {
          addPresetSection2([JSON.parse(messa.message).children[0]])
        }
      }
    }
  }, [connected, mqttData]);


  function addPresetSection2(section: TreeFull[]) {
    const newsComponents = transformSectionToTreeItems(section);

    console.log("newsComponentsnewsComponents", newsComponents)

    let newComponents: TreeItem[] = []

    newsComponents.map((el: TreeItem, i: number) => {
      if (i < newsComponents.length-1) {
        newComponents.push(el)
        // setTree(el.id, el);
      }
    });

    // if (treeRoot) {
    //   treeRoot.children?.push(newsComponents[0].id);
    //   treeRoot.lastUpdate = new Date().valueOf();

    //   setTree("root", treeRoot);
    // }

    if (newComponents.length) {
      setTree(newComponents);
    }

    if (treeRoot) {
      addComponent(newsComponents[newsComponents.length-1], "root", "inside", treeRoot, setTree);
    }
  }

  // useEffect(() => {

  //   // console.log(mqttData);
  //   if (mqttData && mqttData.length > 1) {
  //     sendMessage(mqttData[mqttData.length-1], false, false);
  //   }
  // }, [ mqttData ]);

  return (
    <div>
      {/* {mqttData?.map((message, index) => <div key={index}>{message}</div>)}
      messages:{JSON.stringify(messages)}= */}
    </div>
  );
};

export default NotificationComponent;
