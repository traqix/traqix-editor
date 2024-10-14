"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeProps,
  EdgeProps,
  MarkerType,
  Handle,
  Position,
  ConnectionLineType,
  StepEdge,
  SmoothStepEdge,
  StraightEdge,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  MessageSquare,
  Database,
  Cpu,
  X,
  ChevronLeft,
  ChevronRight,
  FileInput,
  Code,
  GitBranch,
  ArrowRight,
  Plus,
  Trash2,
  FileSpreadsheet,
  PlusCircle,
  ArrowRightCircle,
  ArrowRightToLine,
  ArrowUpRight,
  InspectIcon,
  DatabaseZap,
  CircleArrowOutDownRight,
  CircleChevronRight,
  CirclePlay,
  Play,
  Pause,
  PlusIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { arrayToObject } from "./util";

// import { collaboration, CollabCompState } from './collaboration'
// import useMousePosition from '@/hooks/mousePosition';
// import { MousePositionTracking } from './MousePositionTracking';

// GoogleSheets noded
// 1XurUZPkrSdM_4nf2vWHHCcj94hTFvfUU5AAuLdJOjfw
// Página1!A1:B4

// https://jsonplaceholder.typicode.com/todos/1

// Weather node
// 0d019a678e59d7111413243a36716e41

const nodeTypes = {
  chatbot: ChatbotNode,
  api: ApiNode,
  ai: AiNode,
  dataCapture: DataCaptureNode,
  conditional: ConditionalNode,
  input: InputNode,
  output: OutputNode,
  googleSheets: GoogleSheetsNode,
  weather: WeatherNode
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "start",
    data: { label: "Chatbot", inputs: [{ type: "text", label: "User Input" }] },
    position: { x: 250, y: 25 },
  },
  {
    id: "2",
    type: "api",
    data: {
      label: 'Fetch Data',
      endpoint: 'https://jsonplaceholder.typicode.com/todos/1', // Exemplo de API
      method: 'GET',
    },
    position: { x: 250, y: 150 },
  },
  {
    id: "3",
    type: "ai",
    data: { label: "AI Processing", model: "gpt-3.5-turbo" },
    position: { x: 250, y: 275 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "SmoothStep",
    animated: true,
    style: { stroke: "green", strokeWidth: 3 },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "SmoothStep",
    animated: false,
    style: { stroke: "#000", strokeWidth: 2 },
  },
];

function ChatbotNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-xl  p-4 w-48 relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-blue-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      <MessageSquare className="w-6 h-6 mb-2 text-blue-500" />
      <div className="text-sm font-medium">{data?.label}</div>
      <div className="text-xs text-gray-500 mt-1">
        Inputs: {data?.inputs?.length}
      </div>

      {/* Output Handles - Two Outputs */}
      <Handle
        type="source"
        position={Position.Right}
        id="output-1"
        className="w-2 h-2 bg-blue-500"
        style={{ top: '30%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output-2"
        className="w-2 h-2 bg-blue-500"
        style={{ top: '70%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}

function ApiNode({ data }: NodeProps) {
  // console.log("Component ApiNode", data)
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 w-48 relative ${data.error ? 'border-red-500 bg-red-100 border-2' : ''}`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-green-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      <Database className="w-6 h-6 mb-2 text-green-500" />
      <div className="text-sm font-medium">{data?.label}</div>
      <div className="text-xs text-gray-500 mt-1">
        {data?.method} {data?.endpoint}
      </div>
      
      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2 h-2 bg-green-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}

function AiNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-xl  p-4 w-48 relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-purple-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      <Cpu className="w-6 h-6 mb-2 text-purple-500" />
      <div className="text-sm font-medium">{data?.label}</div>
      <div className="text-xs text-gray-500 mt-1">Model: {data?.model}</div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2 h-2 bg-purple-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}

function DataCaptureNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-xl  p-4 w-48 relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-orange-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      <FileInput className="w-6 h-6 mb-2 text-orange-500" />
      <div className="text-sm font-medium">{data?.label}</div>
      <div className="text-xs text-gray-500 mt-1">Type: {data?.captureType}</div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2 h-2 bg-orange-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}

function ConditionalNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-xl p-4 w-48 relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-yellow-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      <GitBranch className="w-6 h-6 mb-2 text-yellow-500" />
      <div className="text-sm font-medium">{data.label}</div>

      {/* Render conditions */}
      <div className="text-xs text-gray-500">
        {data.conditions?.map((cond: any, index: number) => (
          <div key={index} className="border-[0.5px] rounded-md h-5 my-1">
            <span>{cond.label}</span>
          </div>
        ))}
      </div>

      {/* Output Handles */}
      {data.conditions?.map((cond: any, index: number) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`output-${index}`}
          className="w-2 h-2 bg-yellow-500"
          style={{ top: `${72 + index * 21}px` }}  // Position handles dynamically
        />
      ))}
    </div>
  );
}

function InputNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-xl text-left">
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-yellow-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      <ArrowRight className="w-6 h-6 mb-2 text-red-500" />
      <div className="text-sm font-medium">{data?.label}</div>
      <div className="text-xs text-gray-500 mt-1">
        <p className="truncate">Input: {data.result ? `${JSON.stringify(data.result)}` : 'No Data'}</p>
      </div>
      {/* <div className="text-xs text-gray-500 mt-1">Result: {data?.result}</div> */}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2 h-2 bg-red-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

    </div>
  );
}

function OutputNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-xl text-left w-full relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-red-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
      
      <div className="w-full">
        <ArrowRight className="w-6 h-6 mb-2 text-red-500" />
        <div className="text-sm truncate font-medium">{data?.label}</div>
        <div className="text-xs truncate text-gray-500 mt-1">
          <p>Output Type: {data?.outputType}</p>
          <p className="line-clamp-2">{data.result ? `${JSON.stringify(data.result)}` : 'No Data'}</p>
        </div>
      </div>
    </div>
  );
}

function GoogleSheetsNode({ data }: NodeProps) {
  return (
    <div className="bg-white border rounded-xl p-4 w-48 relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-3 h-3 bg-yellow-300 border-none flex items-center justify-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <PlusIcon className="w-2.5 h-2.5  " />
      </Handle>

      <div className="w-full">
        <FileSpreadsheet className="w-6 h-6 mb-2 text-green-500" />
        <div className="text-sm truncate font-medium">{data.label}</div>
        <div className="text-xs truncate text-gray-500 mt-1">Sheet ID: {data.sheetId}</div>
        <div className="text-xs truncate text-gray-500 mt-1">Range: {data.range}</div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-blue-300 border-none flex items-center justify-center"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        <ArrowRight className="h-2.5 w-2.5" style={{pointerEvents: 'none'}} />
      </Handle>
    </div>
  );
}

function WeatherNode({ data }: NodeProps) {

  return (
    <div className="bg-white border rounded-xl  p-4 w-48 relative">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="w-2 h-2 bg-yellow-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />

      <div className="text-sm font-medium">{data.label}</div>
      <div className="text-xs text-gray-500 mt-1">City: {data.city}</div>
      <div className="text-xs text-gray-500 mt-1">Weather: {data.result !== undefined ? `${data.result}°C` : 'N/A'}</div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-2 h-2 bg-yellow-500"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
};

// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   markerEnd,
// }: EdgeProps) => {
//   const edgePath = `M${sourceX},${sourceY} L${sourceX},${targetY} L${targetX},${targetY}`;

//   return (
//     <path
//       id={id}
//       style={style}
//       className="react-flow__edge-path"
//       d={edgePath}
//       markerEnd={markerEnd}
//     />
//   );
// };

const edgeTypes = {
  // cant use this here since the types are not exported
  default: StepEdge,
  straight: StraightEdge,
  smoothstep: SmoothStepEdge,
  // custom: CustomEdge,
}

export default function EnhancedAutomationSystem() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]) // (initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]) // (initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { project } = useReactFlow()
  const [newNodeType, setNewNodeType] = useState('chatbot')
  const [newNodeLabel, setNewNodeLabel] = useState('')

  const nodesRef = useRef(nodes);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const onConnect = useCallback(
    (params: Edge | Connection) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const updateNodeData = useCallback(
    (id: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            console.log("RESULT 333333", id, newData)
            return { ...node, data: { ...node?.data ?? [], ...newData } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  useEffect(() => {
    const savedData = localStorage.getItem('traqix_flow');
    if (savedData) {
      const { nodes, edges } = JSON.parse(savedData);
      setNodes(nodes);
      setEdges(edges);
    } else {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, []);

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const flow = {
        nodes,
        edges: edges.map(edge => ({
          ...edge,
          style: edge.style || { stroke: 'green', strokeWidth: 3 },  // Garante que o estilo esteja presente
        })),
      };
      
      localStorage.setItem('traqix_flow', JSON.stringify(flow));
    }
  }, [nodes, edges]);
  

  const closeSidebar = () => {
    setSelectedNode(null);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  useEffect(() => {
    console.log("selectedNode", selectedNode);
  }, [selectedNode])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const reactFlowBounds =  reactFlowWrapper.current.getBoundingClientRect() ?? {}
      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [project]
  )

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onNodeDragStop = (event: React.MouseEvent, node: Node) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return { ...n, position: node.position }
        }
        return n
      })
    )
  }

  const onNodeDelete = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    setSelectedNode(null)
  }, [setNodes, setEdges])

  const addNewNode = () => {
    const newNode: Node = {
      id: `${newNodeType}-${Date.now()}`,
      type: newNodeType,
      position: { x: 100, y: 100 },
      data: { label: newNodeLabel || `New ${newNodeType} Node` },
    }
    setNodes((nds) => nds.concat(newNode))
    setNewNodeLabel('')
  }

  const [executingEdge, setExecutingEdge] = useState<string | null>(null);

  const startFlow = async () => {
    // Primeiro, encontra o primeiro node para iniciar o fluxo
    const startNode = nodesRef.current.find(node => node.type === 'start'); // Exemplo de um node de início
  
    if (!startNode) {
      console.error("No starting node found");
      return;
    }
  
    // Função recursiva para executar o node e passar para o próximo
    const processNode = async (node: Node) => {
      try {
        // Executa o node atual
        console.log("Executa o node atual", node.id);
        await executeNode(node);

        // Encontra todos os edges de saída do node atual
        let outgoingEdges = edges.filter(edge => edge.source === node.id);

        // Para cada edge de saída, encontra o node alvo e processa-o
        for (const edge of outgoingEdges) {
          const targetNode = nodesRef.current.find(n => n.id === edge.target);
          
          if (targetNode) {
            // Atualiza o estado e aguarda que ele se propague
            setEdges((prevEdges) =>
              prevEdges.map(e =>
                e.id === edge.id
                  ? { ...e, animated: true, style: { stroke: 'blue', strokeWidth: 4, animation: 'pulse 2s infinite' } }
                  : e
              )
            );

            // Aguarde o próximo ciclo de renderização para garantir que a atualização de estado seja aplicada
            await new Promise((resolve) => setTimeout(resolve, 0));

            // Reprocessa o próximo node
            await processNode(targetNode);
          }
        }
      } catch (error) {
        // Se ocorrer um erro, marque o node e o edge como erro
        const outgoingEdges = edges.filter(edge => edge.source === node.id);
    
        for (const edge of outgoingEdges) {
          setEdges((prevEdges) =>
            prevEdges.map(e =>
              e.id === edge.id
                ? { ...e, style: { stroke: 'red', strokeWidth: 3 } } // Edge com erro
                : e
            )
          );
        }
      }
    };

    console.log("AAAAAAAAAA startNode", startNode);
    // Inicia o processamento a partir do node inicial
    await processNode(startNode);
  };


  const executeSelectedNode = async (nodeId: string) => {
    const selectedNode = nodesRef.current.find(n => n.id === nodeId);
    if (!selectedNode) {
      console.error(`Node ${nodeId} not found`);
      return;
    }
  
    await executeNode(selectedNode); // Executa o node isoladamente
  };

  const [executingNode, setExecutingNode] = useState<string | null>(null);

  const executeNode = (node: Node) => {
    
    setExecutingNode(node.id)
    console.log("executeNode", node)
    if (node.type === 'api') {
      const fetchData = async () => {
    
        try {
          const response = await fetch(node.data.endpoint, {
            method: node.data.method,
          });

          if (!response.ok) {
            updateNodeData(node.id, { error: true, result: { type: "error", response: response, date: new Date().valueOf()} });
            throw new Error(`API call failed with status ${response.status}`);
          }

          const data = await response.json();
          updateNodeData(node.id, { result: data, error: false });
          console.log(`Node ${node.id} API call result: `, data);
        } catch (e) {
          updateNodeData(node.id, { error: true, result: { type: "error", response: e, date: new Date().valueOf()}});
        }
      }
        
      fetchData()

    } else if (node.type === 'conditional') {

      // const sourceNodeId = getSourceNodeId(node.id);
      // const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      // if (sourceNode && sourceNode.data.result) {
      //   updateNodeData(node.id, { result: sourceNode.data.result });
      // }
      executeConditionalNode(node)
      console.log(`Executing conditional node ${node.id}: `, node.data);

    } else if (node.type === 'chatbot') {

      console.log(`Executing chatbot node ${node.id}: `, node.data.inputs);

    } else if (node.type === 'ai') {

      console.log(`Executing AI node ${node.id} with model: ${node.data.model}`);

    } else if (node.type === 'output') {
      const fetchData2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const sourceNodeId = getSourceNodeId(node.id);
        const sourceNode = nodesRef.current.find((n) => n.id === sourceNodeId);
        if (sourceNode) {
          console.log("RESULT", sourceNode, sourceNode?.data?.result)
          updateNodeData(node.id, { result: sourceNode?.data?.result });
          if (node.id === selectedNode?.id) {
            const prevNode = {...selectedNode, data: { ...selectedNode?.data ?? [], result: sourceNode.data.result}}
            setSelectedNode(prevNode)
          }
        }

      }
      fetchData2()

    } else if (node.type === 'input') {
      updateNodeData(node.id, { result: node.data.result });

    } else if (node.type === 'googleSheets') {
      executeGoogleSheetsNode(node)

    } else if (node.type === 'weather') {

      const fetchData3 = async () => {
        const sourceNodeId = getSourceNodeId(node.id);
        console.log("output sourceNodeId", sourceNodeId)
        const sourceNode = nodes.find((n) => n.id === sourceNodeId);
        if (sourceNode && sourceNode.data.result) {
          const weather = await fetchWeather(sourceNode.data.result, node.data.apiKey);
          updateNodeData(node.id, { result: weather }); // Atualiza o node com a temperatura obtida
          if (node.id === selectedNode?.id) {
            const prevNode = {...selectedNode, data: { ...selectedNode?.data ?? [], result: weather }}
            setSelectedNode(prevNode)
          }
        }
      }
      fetchData3()
      
    } else if (node.type === 'findInObject') {

      console.log("nodeIdCompareWith", node)
      let nodeIdSetenceIn = node?.data?.setenceIn ?? ''
      nodeIdSetenceIn = nodeIdSetenceIn.replace("NODE[", "")
      nodeIdSetenceIn = nodeIdSetenceIn.replace("]", "")

      let nodeIdCompareWith = node?.data?.compareWith ?? ''
      nodeIdCompareWith = nodeIdCompareWith.replace("NODE[", "")
      nodeIdCompareWith = nodeIdCompareWith.replace("]", "")


      const setenceInNode = nodes.find((n) => n.id === nodeIdSetenceIn);
      const compareWithNode = nodes.find((n) => n.id === nodeIdCompareWith);

      console.log("compareWithNode?.data?.result", compareWithNode?.data?.result)

      const dataSetence =  JSON.parse(`{"usuario": "user1", "password": "senha1"}`) // setenceInNode?.data?.result

      const result = procurarRegistro(dataSetence, compareWithNode?.data?.result)
      updateNodeData(node.id, { result: result });
      if (node.id === selectedNode?.id) {
        const prevNode = {...selectedNode, data: { ...selectedNode?.data ?? [], result: result }}
        setSelectedNode(prevNode)
      }
      
    }

    // try {
    // } catch (error) {
    //   console.error(`Node ${node.id} failed:`, error.message);
    //   // Visual feedback for node error
    //   setNodes((prevNodes) => prevNodes.map(n =>
    //     n.id === node.id ? { ...n, data: { ...n.data, error: true } } : n
    //   ));
    //   throw error; // Propagate error to stop flow
    // }

    setTimeout(() => {
      setExecutingNode(null)
    }, 1000);
  };
  

// function procurarRegistro(criterios: { [key: string]: string }, data: any[]): boolean {
//   return data.some(item => 
//     Object.entries(criterios).every(([key, value]) => item[key] === value)
//   );
// }

function procurarRegistro(criterios: { [key: string]: string }, data: any[]): boolean {
  console.log("DATA", data, criterios)
  return data.some(item => 
    item && typeof item === 'object' && // Adicione uma verificação para garantir que item seja um objeto válido
    Object.entries(criterios).every(([key, value]) => item[key] === value)
  );
}

  // Função auxiliar para encontrar o node de origem (para nodes dependentes como OutputNode)
  const getSourceNodeId = (nodeId: string) => {
    const edge = edges.find((e) => e.target === nodeId);
    return edge ? edge.source : null;
  };

  function executeConditionalNode(node: Node) {
    const sourceNodeId = getSourceNodeId(node.id);  // Get source node ID
    const sourceNode = nodes.find((n) => n.id === sourceNodeId);  // Find source node
    
    if (!sourceNode) {
      console.error(`Source node not found for conditional node ${node.id}`);
      return;
    }
  
    const result = sourceNode.data.result;  // Fetch result from source node
    console.log(`Executing conditional node ${node.id}: `, node.data, result);
  
    // Iterate over conditions to find the matching condition based on the response code
    const matchingCondition = node.data.conditions?.find((cond: any) => {
      return cond.responseCode === result?.status;
    });
  
    if (matchingCondition) {
      // Update the node's result
      updateNodeData(node.id, { result });
  
      // Find the edge corresponding to the matching condition
      const edge = edges.find((e: any) => e.source === node.id && e.sourceHandle === `output-${matchingCondition.index}`);
      
      if (edge) {
        // setEdgeColor(edge.id, 'green', 3);  // Set the edge to green to show success
        // executeNode(edge.target);  // Execute the next node
      }
    } else {
      // No matching condition, mark node and edges as failed (red)
      console.error(`No condition matched for node ${node.id}`);
      updateNodeData(node.id, { error: true });
  
      const connectedEdges = edges.filter((e: any) => e.source === node.id);
      connectedEdges.forEach((edge: any) => {
        // setEdgeColor(edge.id, 'red', 3);  // Set the edge to red to indicate an error
      });
    }
  }

  async function fetchDataFromGoogleSheets(sheetId: string, range: string, values?: any[]) {
    const apiKey = 'secret';
    const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;
  
    // Se valores forem fornecidos, escrevemos os dados na planilha
    if (values) {
      const url = `${baseUrl}/values/${range}?valueInputOption=RAW&key=${apiKey}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to write data to Google Sheets');
      }
  
      const data = await response.json();
      return data; // Retorna a resposta da escrita
    } else {
      // Se não houver valores, fazemos a leitura
      const url = `${baseUrl}/values/${range}?key=${apiKey}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data from Google Sheets');
      }
  
      const data = await response.json();
      return data.values; // Retorna os dados da planilha
    }
  }
  
  async function executeGoogleSheetsNode(node: Node) {
    const sheetId = node.data.sheetId;
    const range = node.data.range;
  
    try {
      const data = await fetchDataFromGoogleSheets(sheetId, range);
      updateNodeData(node.id, { result: arrayToObject(data) }); // Salva os dados retornados no node
      console.log(`Data fetched for node ${node.id}: `, data);
      if (node.id === selectedNode?.id) {
        const prevNode = {...selectedNode, data: {result: arrayToObject(data)}}
        setSelectedNode(prevNode)
      }
    } catch (error) {
      console.error(`Error fetching data from Google Sheets: ${error.message}`);
      // Lógica para lidar com erros, como marcar o node como falho
      updateNodeData(node.id, { result: error }); // Salva os dados retornados no node
      if (node.id === selectedNode?.id) {
        const prevNode = {...selectedNode, data: {result: error}}
        setSelectedNode(prevNode)
      }

    }
  }

  async function fetchWeather(city: string, apiKey: string): Promise<number | null> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data from OpenWeather');
      }
  
      const data = await response.json();
      return data.main.temp; // Retorna a temperatura em Celsius
    } catch (error) {
      console.error('Error fetching weather:', error);
      return error;
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${sidebarOpen ? "w-80" : "w-0"}`}
      >
        <div className="flex justify-between items-center p-4 border-b relative z-[50]">
          <Button
            variant="link"
            size="default"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <h2 className="text-lg font-semibold">Components</h2>
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={startFlow} className="mt-4">Iniciar Flow</Button>
        </div>
        {sidebarOpen && (
          <>
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold mb-2">Add New Node</h3>
              <div className="space-y-2">
                <Select value={newNodeType} onValueChange={setNewNodeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select node type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatbot">Chatbot</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="dataCapture">Data Capture</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                    <SelectItem value="output">Output</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Node Label"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                />
                <Button onClick={addNewNode} className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Node
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[calc(100vh-180px)] p-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="data-capture">
                  <AccordionTrigger>Data Capture</AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'dataCapture')}
                    >
                      <FileInput className="w-4 h-4 inline-block mr-2" />
                      Text Input
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'dataCapture')}
                    >
                      <FileInput className="w-4 h-4 inline-block mr-2" />
                      File Upload
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="api">
                  <AccordionTrigger>API Integration</AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'api')}
                    >
                      <Database className="w-4 h-4 inline-block mr-2" />
                      API Call
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="ai">
                  <AccordionTrigger>AI Processing</AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'ai')}
                    >
                      <Cpu className="w-4 h-4 inline-block mr-2" />
                      AI Node
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="actions">
                  <AccordionTrigger>Actions</AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'conditional')}
                    >
                      <GitBranch className="w-4 h-4 inline-block mr-2" />
                      Conditional
                    </div>
                  </AccordionContent>
                
                </AccordionItem>
                <AccordionItem value="output">
                  <AccordionTrigger>Output</AccordionTrigger>
                  <AccordionContent>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'start')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      Start Node
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'findInObject')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      Find in OBJECT
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'startloop')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      Start Loop Node
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'endloop')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      End Loop Node
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'input')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      Input Node
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'output')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      Output Node
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'googleSheets')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      Google Sheets
                    </div>
                    <div
                      className="bg-gray-100 rounded p-2 mb-2 cursor-move"
                      draggable
                      onDragStart={(event) => onDragStart(event, 'weather')}
                    >
                      <ArrowRight className="w-4 h-4 inline-block mr-2" />
                      Weather
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </>
        )}
      </div>
      <div className="flex-grow" ref={reactFlowWrapper}>
        <ReactFlow
          connectionLineType={ConnectionLineType.SmoothStep}
          nodes={nodes.map((node) => ({
            ...node,
            style: node.id === executingNode
              ? { backgroundColor: 'yellow', border: '2px solid orange', borderRadius: '0.55rem'  }
              : (node.style ?? {}),
          }))}
          edges={edges.map((edge) => ({
            ...edge,
            animated: edge.id === executingEdge, // Highlight the executing edge
            style: edge.id === executingEdge ? { stroke: 'blue', strokeWidth: 3 } : (edge.style ?? {}), // Apply animation style
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDragStop={onNodeDragStop}
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: { stroke: '#0000FF', strokeWidth: 2 }
          }}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
         
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Node Settings</h2>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" size="icon" onClick={() => onNodeDelete(selectedNode?.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Node</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="ghost" size="icon" onClick={closeSidebar}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>


          <div className="space-y-1 mb-6">
            {/* Botão para Executar Node Individualmente */}
            <div>
              <Label htmlFor="label" className="text-sm font-medium text-gray-700">Actions</Label>
            </div>
            <div className="space-x-2">
              <Button onClick={() => executeSelectedNode(selectedNode?.id)} className="">
                <Play />
              </Button>
              <Button disabled className="">
                <Pause />
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Configurações do Node: Label */}
            <div>
              <Label htmlFor="label" className="text-sm font-medium text-gray-700">ID#</Label>
              <p>{selectedNode?.id}</p>
            </div>

            <div>
              <Label htmlFor="label" className="text-sm font-medium text-gray-700">Label</Label>
              <Input
                id="label"
                value={selectedNode?.data?.label}
                onChange={(e) => updateNodeData(selectedNode?.id, { label: e.target.value })}
                className="mt-1"
              />
            </div>

            
        
            {/* Configurações específicas para o Node Condicional */}
            {selectedNode?.type === 'conditional' && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Conditions</Label>
                {selectedNode?.data?.conditions?.map((condition: any, index: number) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <Input
                      value={condition.label}
                      onChange={(e) => {
                        const newConditions = [...selectedNode?.data?.conditions];
                        newConditions[index].label = e.target.value;
                        updateNodeData(selectedNode?.id, { conditions: newConditions });
                      }}
                      className="mt-1"
                    />
                    <Button
                      variant="destructive"
                      onClick={() => {
                        const newConditions = selectedNode?.data?.conditions?.filter((_: any, i: number) => i !== index);
                        updateNodeData(selectedNode?.id, { conditions: newConditions });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const exis = selectedNode?.data?.conditions ?? []
                    const newConditions = [...exis, { id: Math.random() + '', label: 'New Condition' }];
                    updateNodeData(selectedNode?.id, { conditions: newConditions });
                  }}
                  className="mt-2"
                >
                  Add Condition
                </Button>
              </div>
            )}
        
            {/* Outras configurações específicas do Node, como Chatbot, API, etc. */}
            {selectedNode?.type === 'chatbot' && (
              <div>
                <Label className="text-sm font-medium text-gray-700">Inputs</Label>
                {selectedNode?.data?.inputs.map((input: any, index: number) => (
                  <div key={index} className="mt-2">
                    <Input
                      value={input.label}
                      onChange={(e) => {
                        const newInputs = [...selectedNode?.data?.inputs];
                        newInputs[index].label = e.target.value;
                        updateNodeData(selectedNode?.id, { inputs: newInputs });
                      }}
                      className="mt-1"
                    />
                  </div>
                ))}
                <Button
                  onClick={() => {
                    const newInputs = [...selectedNode?.data?.inputs, { type: 'text', label: 'New Input' }];
                    updateNodeData(selectedNode?.id, { inputs: newInputs });
                  }}
                  className="mt-2"
                >
                  Add Input
                </Button>
              </div>
            )}

            {selectedNode?.type === 'input' && (
              <>
                <div>
                  <Label htmlFor="result" className="text-sm font-medium text-gray-700">Result</Label>
                  <Input
                    id="result"
                    value={selectedNode?.data?.result}
                    onChange={(e) => {
                      const updatedResult = e.target.value;
                      if (selectedNode?.id) {
                        updateNodeData(selectedNode.id, { result: updatedResult });
                      }
                      
                      setSelectedNode((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          result: updatedResult,
                        },
                      }));
                    }}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {selectedNode?.type === 'weather' && (
              <>
                <div>
                  <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">API Key</Label>
                  <Input
                    id="apiKey"
                    value={selectedNode?.data?.apiKey}
                    onChange={(e) => {
                      const updatedResult = e.target.value;
                      if (selectedNode?.id) {
                        updateNodeData(selectedNode.id, { apiKey: updatedResult });
                      }
                      
                      setSelectedNode((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          apiKey: updatedResult,
                        },
                      }));
                    }}
                    className="mt-1"
                  />
                </div>
              </>
            )}
        
            {selectedNode?.type === 'api' && (
              <>
                <div>
                  <Label htmlFor="endpoint" className="text-sm font-medium text-gray-700">Endpoint</Label>
                  <Input
                    id="endpoint"
                    value={selectedNode?.data?.endpoint}
                    onChange={(e) => {
                      const updatedResult = e.target.value;
                      if (selectedNode?.id) {
                        updateNodeData(selectedNode.id, { endpoint: updatedResult });
                      }
                      
                      setSelectedNode((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          endpoint: updatedResult,
                        },
                      }));
                    }}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="method" className="text-sm font-medium text-gray-700">Method</Label>
                  <Select
                    value={selectedNode?.data?.method}
                    onValueChange={(value) => {
                      const updatedResult = value;
                      if (selectedNode?.id) {
                        updateNodeData(selectedNode.id, { method: updatedResult });
                      }
                      
                      setSelectedNode((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          method: updatedResult,
                        },
                      }));
                    }}
                  >
                    <SelectTrigger id="method" className="mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                
              </>
            )}

            {selectedNode?.type === 'googleSheets' && (
              <>
                <div>
                  <Label htmlFor="sheetId" className="text-sm font-medium text-gray-700">SheetId:</Label>
                  <Input
                    id="sheetId"
                    value={selectedNode?.data?.sheetId}
                    onChange={(e) => {
                      const updatedResult = e.target.value;
                      if (selectedNode?.id) {
                        updateNodeData(selectedNode.id, { sheetId: updatedResult });
                      }
                      
                      setSelectedNode((prev) => ({
                        ...prev,
                        data: {
                          ...prev.data,
                          sheetId: updatedResult,
                        },
                      }));
                    }}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="range" className="text-sm font-medium text-gray-700">Range</Label>
                  <Input
                    id="range"
                    value={selectedNode?.data?.range}
                    onChange={(e) => updateNodeData(selectedNode?.id, { range: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                

              </>
            )}
        
            {selectedNode?.type === 'ai' && (
              <div>
                <Label htmlFor="model" className="text-sm font-medium text-gray-700">AI Model</Label>
                <Select
                  value={selectedNode?.data?.model}
                  onValueChange={(value) => {
                    const updatedResult = value;
                    if (selectedNode?.id) {
                      updateNodeData(selectedNode.id, { model: updatedResult });
                    }
                    
                    setSelectedNode((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        model: updatedResult,
                      },
                    }));
                  }}
                >
                  <SelectTrigger id="model" className="mt-1">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-v1">Claude v1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Exibe o valor da entrada do node */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Input Value</Label>
              <Textarea
                value={
                  (() => {
                    // Encontrar o edge que conecta ao node atual
                    const sourceEdge = edges.find((edge) => edge.target === selectedNode.id);
                    if (!sourceEdge) return 'No input yet';

                    // Encontrar o node source usando o id do source edge
                    const sourceNode = nodes.find((node) => node.id === sourceEdge.source);
                    if (!sourceNode) return 'No input yet';

                    // Retornar o valor do input do node source
                    return JSON.stringify(sourceNode?.data?.result, null, 2) || 'No input yet';
                  })()
                }
                readOnly
                className="mt-1 h-52"
              />
            </div>

            {selectedNode?.type === 'findInObject' && (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mr-2">Setence In {"{"}name:"foo",value:"bar"}</Label>
                  <Input
                    id="setenceIn"
                    value={selectedNode?.data?.setenceIn}
                    onChange={(e) => updateNodeData(selectedNode?.id, { setenceIn: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700 mr-2">Compare With [Array]</Label>
                  <Input
                    id="compareWith"
                    value={selectedNode?.data?.compareWith}
                    onChange={(e) => updateNodeData(selectedNode?.id, { compareWith: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {selectedNode?.type === 'api' && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mr-2">Response</Label>
                <Badge variant={selectedNode.data.error ? "destructive" : "secondary"}>
                  {JSON.stringify(selectedNode.data.error ? 'Error' : 'OK')}
                </Badge>
              </div>
            )}
            {/* Exibe o resultado do node */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Result</Label>
              <Textarea
                value={JSON.stringify(selectedNode?.data?.result, null, 2) || 'No result yet'}
                readOnly
                className="mt-1 h-52"
              />
            </div>
          </div>
        </div>
      
      )}
    </div>
  );
}


{ /* <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold text-gray-800">Node Settings</h2>
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="icon" onClick={() => onNodeDelete(selectedNode?.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Node</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button variant="ghost" size="icon" onClick={closeSidebar}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  </div>
  <div className="space-y-6">
    <div>
      <Label htmlFor="label" className="text-sm font-medium text-gray-700">Label</Label>
      <Input
        id="label"
        value={selectedNode?.data?.label}
        onChange={(e) => updateNodeData(selectedNode?.id, { label: e.target.value })}
        className="mt-1"
      />
    </div>
    {selectedNode?.type === 'chatbot' && (
      <div>
        <Label className="text-sm font-medium text-gray-700">Inputs</Label>
        {selectedNode?.data?.inputs.map((input: any, index: number) => (
          <div key={index} className="mt-2">
            <Input
              value={input.label}
              onChange={(e) => {
                const newInputs = [...selectedNode?.data?.inputs]
                newInputs[index].label = e.target.value
                updateNodeData(selectedNode?.id, { inputs: newInputs })
              }}
              className="mt-1"
            />
          </div>
        ))}
        <Button
          onClick={() => {
            const newInputs = [...selectedNode?.data?.inputs, { type: 'text', label: 'New Input' }]
            updateNodeData(selectedNode?.id, { inputs: newInputs })
          }}
          className="mt-2"
        >
          Add Input
        </Button>
      </div>
    )}
    {selectedNode?.type === 'api' && (
      <>
        <div>
          <Label htmlFor="endpoint" className="text-sm font-medium text-gray-700">Endpoint</Label>
          <Input
            id="endpoint"
            value={selectedNode?.data?.endpoint}
            onChange={(e) => updateNodeData(selectedNode?.id, { endpoint: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="method" className="text-sm font-medium text-gray-700">Method</Label>
          <Select
            value={selectedNode?.data?.method}
            onValueChange={(value) => updateNodeData(selectedNode?.id, { method: value })}
          >
            <SelectTrigger id="method" className="mt-1">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    )}
    {selectedNode?.type === 'ai' && (
      <div>
        <Label htmlFor="model" className="text-sm font-medium text-gray-700">AI Model</Label>
        <Select
          value={selectedNode?.data?.model}
          onValueChange={(value) => updateNodeData(selectedNode?.id, { model: value })}
        >
          <SelectTrigger id="model" className="mt-1">
            <SelectValue placeholder="Select AI model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="claude-v1">Claude v1</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )}
  </div>
</div> */ }